using AutoMapper;
using Ecommerce.Base.Exceptions;
using Ecommerce.Base.Helpers;
using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using Ecommerce.Services.DTOs.Users;
using Ecommerce.Services.Interfaces;
using Ecommerce.Services.Profiles;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Ecommerce.Services.Services;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
    private readonly IEmailService _emailService;
    private readonly string _frontendUrl;
    private readonly JwtTokenGenerator _jwtTokenGenerator;
    private readonly IMapper _mapper;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IRoleRepository _roleRepository;
    private readonly ITokenUserRepository _tokenUserRepository;

    public AuthService(IAuthRepository authRepository, IMapper mapper,
        IEmailService emailService,
        JwtTokenGenerator jwtTokenGenerator, IPasswordHasher<User> passwordHasher,
        IOptions<FrontendSettings> frontendOptions, IRoleRepository roleRepository,
        ITokenUserRepository tokenUserRepository)
    {
        _authRepository = authRepository;
        _mapper = mapper;
        _jwtTokenGenerator = jwtTokenGenerator;
        _emailService = emailService;
        _passwordHasher = passwordHasher;
        _frontendUrl = frontendOptions.Value.BaseUrl;
        _roleRepository = roleRepository;
        _tokenUserRepository = tokenUserRepository;
    }

    public async Task<UserLoginResponseModel> Login(UserLoginDto userLoginDto)
    {
        var user = await _authRepository
            .FindByCondition(u => u.Email == userLoginDto.Email).Include(u => u.Role)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "email",
                    Issue = "Email is incorrect or account does not exist."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }

        if (!user.IsActive)
            throw new BadRequestException("Account is inactive. Please check your email or resend activation link.");

        var passwordVerificationResult =
            _passwordHasher.VerifyHashedPassword(user, user.Password, userLoginDto.Password);
        if (passwordVerificationResult == PasswordVerificationResult.Failed)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "password",
                    Issue = "Password is incorrect."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }

        var (token, expiresIn) = _jwtTokenGenerator.GenerateToken(user.Id, user.Email, user.Role.Name);

        return new UserLoginResponseModel
        {
            User = _mapper.Map<UserResponseModel>(user),
            Token = token,
            TokenExpiresIn = expiresIn
        };
    }

    public async Task<string> ResendActivationEmailAsync(string email)
    {
        var findUser = await _authRepository
            .FindByCondition(u => u.Email == email)
            .FirstOrDefaultAsync();


        if (findUser == null)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "email",
                    Issue = "Email is incorrect or account does not exist."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }

        var existingToken = await _tokenUserRepository
            .FindByCondition(t => t.UserId == findUser.Id && t.Type == "active-account" && !t.IsUsed)
            .FirstOrDefaultAsync();

        var (token, expiresAt) = _jwtTokenGenerator.GenerateTokenByType(findUser.Id, "active-account");
        var activationLink = $"{_frontendUrl}/activate?email={findUser.Email}&token={token}";

        findUser.UpdatedAt = DateTime.UtcNow;

        if (existingToken != null)
        {
            existingToken.Token = token;
            existingToken.ExpiredAt = expiresAt;
            existingToken.IsUsed = false;
            _tokenUserRepository.Update(existingToken);
        }
        else
        {
            _tokenUserRepository.Add(new TokenUser
            {
                Id = Guid.NewGuid(),
                UserId = findUser.Id,
                Token = token,
                Type = "active-account",
                IsUsed = false,
                ExpiredAt = expiresAt,
                CreatedAt = DateTime.UtcNow
            });
        }

        _authRepository.Update(findUser);
        await _authRepository.SaveChangesAsync();
        await _tokenUserRepository.SaveChangesAsync();
        await _emailService.SendAccountActivationEmailAsync(findUser.Email, findUser.Username, activationLink);

        return "Activation email has been sent. Please check your inbox.";
    }

    public async Task<object> ActivateUserAsync(string token)
    {
        var tokenRecord = await _tokenUserRepository
            .FindByCondition(t => t.Token == token && t.Type == "active-account")
            .Include(t => t.User)
            .FirstOrDefaultAsync();

        if (tokenRecord == null || tokenRecord.IsUsed)
            throw new BadRequestException("Invalid or expired activation link");

        var user = tokenRecord.User;

        if (user.IsActive) throw new BadRequestException("Your account is already activated.");

        tokenRecord.IsUsed = true;
        tokenRecord.UsedAt = DateTime.UtcNow;
        _tokenUserRepository.Update(tokenRecord);

        var (setPasswordToken, expiresAt) = _jwtTokenGenerator.GenerateTokenByType(user.Id, "set-password");
        _tokenUserRepository.Add(new TokenUser
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = setPasswordToken,
            Type = "set-password",
            IsUsed = false,
            ExpiredAt = expiresAt,
            CreatedAt = DateTime.UtcNow
        });

        await _tokenUserRepository.SaveChangesAsync();

        return new { setPasswordToken };
    }

    public async Task<string> ForgotPassword(string email)
    {
        var user = await _authRepository
            .FindByCondition(u => u.Email == email)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "email",
                    Issue = "Email is incorrect or account does not exist."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }


        if (!user.IsActive)
            throw new BadRequestException(
                "Your account is not activated. Please check your email or request a new activation link.");

        var (resetPasswordToken, expiresAt) = _jwtTokenGenerator.GenerateTokenByType(user.Id, "reset-password");

        _tokenUserRepository.Add(new TokenUser
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = resetPasswordToken,
            Type = "reset-password",
            IsUsed = false,
            ExpiredAt = expiresAt,
            CreatedAt = DateTime.UtcNow
        });


        var resetLink = $"{_frontendUrl}/reset-password?email={user.Email}&token={resetPasswordToken}";

        await _tokenUserRepository.SaveChangesAsync();
        await _emailService.SendForgotPasswordEmailAsync(email, user.Username, resetLink);

        return "The password reset link has been sent to your email. Please check your inbox.";
    }

    public async Task<bool> ValidateToken(string token, string type)
    {
        var tokenRecord = await _tokenUserRepository
            .FindByCondition(t => t.Token == token && t.Type == type)
            .FirstOrDefaultAsync();

        return tokenRecord is not null
               && !tokenRecord.IsUsed
               && (tokenRecord.ExpiredAt == null || tokenRecord.ExpiredAt >= DateTime.UtcNow);
    }

    public async Task<string> ResetPassword(ResetPasswordEmailDto resetPasswordEmailDto)
    {
        var tokenRecord = await _tokenUserRepository
            .FindByCondition(t => t.Token == resetPasswordEmailDto.Token && t.Type == "reset-password")
            .FirstOrDefaultAsync();

        if (tokenRecord == null || tokenRecord.IsUsed || tokenRecord.ExpiredAt < DateTime.UtcNow)
            throw new BadRequestException("Invalid or expired activation link");

        var user = await _authRepository
            .FindByCondition(u => u.Id == tokenRecord.UserId)
            .FirstOrDefaultAsync();

        if (user == null) throw new BadRequestException("Account does not exist.");

        // if (_passwordHasher.VerifyHashedPassword(user, user.Password, resetPasswordEmailDto.Password) ==
        //     PasswordVerificationResult.Success)
        //     throw new BadRequestException("Validation failed", new Dictionary<string, string[]>
        //     {
        //         { "Password", new[] { "New password must be different from the current password." } }
        //     });

        if (resetPasswordEmailDto.Password != resetPasswordEmailDto.ConfirmPassword)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "confirmPassword",
                    Issue = "Password and Confirm password do not match."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }

        user.Password = _passwordHasher.HashPassword(user, resetPasswordEmailDto.Password);
        user.UpdatedAt = DateTime.UtcNow;
        _authRepository.Update(user);

        tokenRecord.IsUsed = true;
        tokenRecord.UsedAt = DateTime.UtcNow;
        _tokenUserRepository.Update(tokenRecord);

        await _authRepository.SaveChangesAsync();
        await _tokenUserRepository.SaveChangesAsync();

        return "Password has been reset successfully.";
    }

    public async Task<List<RoleModel>> GetAllRoles()
    {
        var roles = _roleRepository.FindAll().Where(r => r.Name != "Super Admin");
        var rolesResponse = _mapper.Map<List<RoleModel>>(roles);
        return rolesResponse;
    }

    public async Task<string> SetPasswordAsync(SetPasswordEmailDto payload)
    {
        var tokenEntity = await _tokenUserRepository
            .FindByCondition(t =>
                t.Token == payload.Token && t.Type == "set-password" && !t.IsUsed && t.ExpiredAt > DateTime.UtcNow)
            .Include(t => t.User)
            .FirstOrDefaultAsync();

        if (tokenEntity == null)
            throw new BadRequestException("Invalid or expired token");

        var user = tokenEntity.User;

        if (user.IsActive)
            throw new BadRequestException("Account is already activated. Please use reset password instead.");

        if (payload.Password != payload.ConfirmPassword)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "confirmPassword",
                    Issue = "Password and Confirm password do not match."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }

        user.Password = _passwordHasher.HashPassword(user, payload.Password);
        user.IsActive = true;
        user.UpdatedAt = DateTime.UtcNow;

        _authRepository.Update(user);

        tokenEntity.IsUsed = true;
        _tokenUserRepository.Update(tokenEntity);

        await _authRepository.SaveChangesAsync();
        await _tokenUserRepository.SaveChangesAsync();

        return "Password set successfully. Your account is now active.";
    }
}