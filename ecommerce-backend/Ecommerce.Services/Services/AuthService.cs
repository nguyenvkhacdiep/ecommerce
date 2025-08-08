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


    public AuthService(IAuthRepository authRepository, IMapper mapper,
        IEmailService emailService,
        JwtTokenGenerator jwtTokenGenerator, IPasswordHasher<User> passwordHasher,
        IOptions<FrontendSettings> frontendOptions, IRoleRepository roleRepository)
    {
        _authRepository = authRepository;
        _mapper = mapper;
        _jwtTokenGenerator = jwtTokenGenerator;
        _emailService = emailService;
        _passwordHasher = passwordHasher;
        _frontendUrl = frontendOptions.Value.BaseUrl;
        _roleRepository = roleRepository;
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

        var activationToken = _jwtTokenGenerator.GenerateToken(findUser.Id, "validate-account");
        var activationLink = $"{_frontendUrl}/activate?email={findUser.Email}&token={activationToken}";

        findUser.ActivationToken = activationToken;
        findUser.UpdatedAt = DateTime.UtcNow;

        _authRepository.Update(findUser);
        await _authRepository.SaveChangesAsync();

        await _emailService.SendAccountActivationEmailAsync(findUser.Email, findUser.Username, activationLink);

        return "Activation email has been sent. Please check your inbox.";
    }

    public async Task<object> ActivateUserAsync(string token)
    {
        var user = await _authRepository
            .FindByCondition(u => u.ActivationToken == token)
            .FirstOrDefaultAsync();

        if (user == null) throw new BadRequestException("Invalid or expired activation link");

        if (user.IsActive) throw new BadRequestException("Your account is already activated.");

        user.IsActive = true;
        user.ActivationToken = null;
        user.UpdatedAt = DateTime.UtcNow;

        _authRepository.Update(user);
        await _authRepository.SaveChangesAsync();

        var resetPasswordToken = _jwtTokenGenerator.GenerateToken(user.Id, "reset-password");
        return new { resetPasswordToken };
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

        var token = _jwtTokenGenerator.GenerateToken(user.Id, "reset-password");

        var resetLink = $"{_frontendUrl}/reset-password?email={user.Email}&token={token}";

        await _emailService.SendForgotPasswordEmailAsync(email, user.Username, resetLink);

        return "The password reset link has been sent to your email. Please check your inbox.";
    }

    public async Task<bool> ValidateToken(string token, string type)
    {
        return _jwtTokenGenerator.ValidateToken(token, type);
    }

    public async Task<string> ResetPassword(ResetPasswordEmailDto resetPasswordEmailDto)
    {
        var checkToken = _jwtTokenGenerator.ValidateToken(resetPasswordEmailDto.Token, "reset-password");
        if (!checkToken) throw new BadRequestException("Invalid or expired activation link.");

        var user = await _authRepository
            .FindByCondition(u => u.Email == resetPasswordEmailDto.Email)
            .FirstOrDefaultAsync();

        if (user == null) throw new BadRequestException("Email is incorrect or account does not exist.");

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
        await _authRepository.SaveChangesAsync();

        return "Password has been reset successfully.";
    }

    public async Task<List<RoleModel>> GetAllRoles()
    {
        var roles = _roleRepository.FindAll();
        var rolesResponse = _mapper.Map<List<RoleModel>>(roles);
        return rolesResponse;
    }
}