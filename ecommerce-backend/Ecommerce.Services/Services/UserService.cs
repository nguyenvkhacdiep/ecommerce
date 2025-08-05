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

public class UserService : IUserService
{
    private readonly IEmailService _emailService;
    private readonly string _frontendUrl;
    private readonly JwtTokenGenerator _jwtTokenGenerator;
    private readonly IMapper _mapper;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IRoleRepository _roleRepository;
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository, IRoleRepository roleRepository, IMapper mapper,
        IEmailService emailService,
        JwtTokenGenerator jwtTokenGenerator, IPasswordHasher<User> passwordHasher,
        IOptions<FrontendSettings> frontendOptions)
    {
        _userRepository = userRepository;
        _mapper = mapper;
        _roleRepository = roleRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _emailService = emailService;
        _passwordHasher = passwordHasher;
        _frontendUrl = frontendOptions.Value.BaseUrl;
    }


    public async Task<List<UserModel>> GetAllUsers()
    {
        var query = _userRepository.FindAll();
        var users = await query.ToListAsync();

        return _mapper.Map<List<UserModel>>(users);
    }

    public async Task<UserResponseModel> AddUserAsync(AddUserDto addUserDto)
    {
        var existingUser = await _userRepository
            .FindByCondition(u => u.Email == addUserDto.Email)
            .FirstOrDefaultAsync();

        if (existingUser != null)
            throw new BadRequestException("Validation failed", new Dictionary<string, string[]>
            {
                { "Email", new[] { "Email is already in use." } }
            });

        var userId = Guid.NewGuid();
        var activationToken = _jwtTokenGenerator.GenerateToken(userId, "validate-account");

        var user = new User
        {
            Id = userId,
            Username = addUserDto.Username,
            Email = addUserDto.Email,
            IsActive = false,
            ActivationToken = activationToken,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            RoleId = addUserDto.RoleId
        };

        var activationLink = $"{_frontendUrl}/activate?email={user.Email}&token={user.ActivationToken}";

        await _emailService.SendAccountActivationEmailAsync(user.Email, user.Username, activationLink);

        _userRepository.Add(user);
        await _userRepository.SaveChangesAsync();

        var roleEntity = await _roleRepository
            .FindByCondition(role => role.Id == user.RoleId)
            .FirstOrDefaultAsync();

        var roleMapper = _mapper.Map<RoleModel>(roleEntity);

        var createdUser = new UserResponseModel
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            Role = roleMapper
        };

        return createdUser;
    }

    public async Task<UserLoginResponseModel> Login(UserLoginDto userLoginDto)
    {
        var user = await _userRepository
            .FindByCondition(u => u.Email == userLoginDto.Email).Include(u => u.Role)
            .FirstOrDefaultAsync();

        if (user == null) throw new BadRequestException("Email is incorrect.");

        var passwordVerificationResult =
            _passwordHasher.VerifyHashedPassword(user, user.Password, userLoginDto.Password);
        if (passwordVerificationResult == PasswordVerificationResult.Failed)
            throw new BadRequestException("Password is incorrect.");

        if (!user.IsActive)
            throw new BadRequestException("ACCOUNT_INACTIVE", new Dictionary<string, string[]>
            {
                { "Account", new[] { "Account is inactive. Please check your email or resend activation link." } }
            });

        var token = _jwtTokenGenerator.GenerateToken(user.Id, user.Email, user.Role.Name);

        return new UserLoginResponseModel
        {
            User = _mapper.Map<UserResponseModel>(user),
            Token = token
        };
    }

    public async Task<string> ResendActivationEmailAsync(string email)
    {
        var findUser = await _userRepository
            .FindByCondition(u => u.Email == email)
            .FirstOrDefaultAsync();

        if (findUser == null)
            throw new BadRequestException("Validation failed", new Dictionary<string, string[]>
            {
                { "Email", new[] { "User not found." } }
            });

        var activationToken = _jwtTokenGenerator.GenerateToken(findUser.Id, "validate-account");
        var activationLink = $"{_frontendUrl}/activate?email={findUser.Email}&token={activationToken}";

        findUser.ActivationToken = activationToken;
        findUser.UpdatedAt = DateTime.UtcNow;

        _userRepository.Update(findUser);
        await _userRepository.SaveChangesAsync();

        await _emailService.SendAccountActivationEmailAsync(findUser.Email, findUser.Username, activationLink);

        return "Activation email has been sent. Please check your inbox.";
    }

    public async Task<object> ActivateUserAsync(string token)
    {
        var user = await _userRepository
            .FindByCondition(u => u.ActivationToken == token)
            .FirstOrDefaultAsync();

        if (user == null)
            throw new BadRequestException("Invalid or expired activation link.");

        if (user.IsActive)
            return "Your account is already activated.";

        user.IsActive = true;
        user.ActivationToken = null;
        user.UpdatedAt = DateTime.UtcNow;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        var resetPasswordToken = _jwtTokenGenerator.GenerateToken(user.Id, "reset-password");
        return new { resetPasswordToken };
    }

    public async Task<string> ForgotPassword(string email)
    {
        var user = await _userRepository
            .FindByCondition(u => u.Email == email)
            .FirstOrDefaultAsync();

        if (user == null)
            throw new BadRequestException("Validation failed", new Dictionary<string, string[]>
            {
                { "Email", new[] { "User not found." } }
            });

        if (!user.IsActive)
            throw new BadRequestException("InactiveAccount", new Dictionary<string, string[]>
            {
                {
                    "Account",
                    new[] { "Your account is not activated. Please check your email or request a new activation link." }
                }
            });

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
        if (!checkToken) return "Token is expired.";

        var user = await _userRepository
            .FindByCondition(u => u.Email == resetPasswordEmailDto.Email)
            .FirstOrDefaultAsync();

        if (user == null)
            throw new BadRequestException("Validation failed", new Dictionary<string, string[]>
            {
                { "Email", new[] { "User not found." } }
            });

        // if (_passwordHasher.VerifyHashedPassword(user, user.Password, resetPasswordEmailDto.Password) ==
        //     PasswordVerificationResult.Success)
        //     throw new BadRequestException("Validation failed", new Dictionary<string, string[]>
        //     {
        //         { "Password", new[] { "New password must be different from the current password." } }
        //     });

        if (resetPasswordEmailDto.Password != resetPasswordEmailDto.ConfirmPassword)
            throw new BadRequestException("Validation failed", new Dictionary<string, string[]>
            {
                { "Password", new[] { "Password and Confirm password do not match." } }
            });

        user.Password = _passwordHasher.HashPassword(user, resetPasswordEmailDto.Password);
        user.UpdatedAt = DateTime.UtcNow;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        return "Password has been reset successfully.";
    }
}