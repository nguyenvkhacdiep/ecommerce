using AutoMapper;
using Ecommerce.Base.Exceptions;
using Ecommerce.Base.Helpers;
using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using Ecommerce.Services.Common;
using Ecommerce.Services.DTOs.Users;
using Ecommerce.Services.Interfaces;
using Ecommerce.Services.Profiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Ecommerce.Services.Services;

public class UserService : IUserService
{
    private readonly IEmailService _emailService;
    private readonly string _frontendUrl;
    private readonly JwtTokenGenerator _jwtTokenGenerator;
    private readonly IMapper _mapper;
    private readonly IRoleRepository _roleRepository;
    private readonly ITokenUserRepository _tokenUserRepository;
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository, IRoleRepository roleRepository,
        IMapper mapper,
        IEmailService emailService,
        JwtTokenGenerator jwtTokenGenerator,
        IOptions<FrontendSettings> frontendOptions,
        ITokenUserRepository tokenUserRepository)
    {
        _userRepository = userRepository;
        _mapper = mapper;
        _roleRepository = roleRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _emailService = emailService;
        _frontendUrl = frontendOptions.Value.BaseUrl;
        _tokenUserRepository = tokenUserRepository;
    }

    public async Task<UserResponseModel> AddUserAsync(AddUserDto addUserDto)
    {
        var existingUser = await _userRepository
            .FindByCondition(u => u.Email == addUserDto.Email)
            .FirstOrDefaultAsync();

        if (existingUser != null)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "email",
                    Issue = "Email is already in use."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }

        var userId = Guid.NewGuid();
        var (token, expiresAt) = _jwtTokenGenerator.GenerateTokenByType(userId, "active-account");

        var user = new User
        {
            Id = userId,
            Username = addUserDto.Username,
            Email = addUserDto.Email,
            IsActive = false,
            UrlAvatar = addUserDto.UrlAvatar,
            CreatedAt = DateTime.UtcNow,
            RoleId = addUserDto.RoleId
        };

        var activationLink = $"{_frontendUrl}/activate?email={user.Email}&token={token}";

        await _emailService.SendAccountActivationEmailAsync(user.Email, user.Username,
            activationLink);

        _tokenUserRepository.Add(new TokenUser
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Token = token,
            Type = "active-account",
            IsUsed = false
        });
        _userRepository.Add(user);
        await _userRepository.SaveChangesAsync();
        await _tokenUserRepository.SaveChangesAsync();

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
            UrlAvatar = user.UrlAvatar,
            CreatedAt = user.CreatedAt,
            Role = roleMapper
        };

        return createdUser;
    }

    public async Task<PageList<UserResponseModel>> GetAllUsers(UserParameters userParameters)
    {
        var query = _userRepository.FindAll();

        query = query.Include(u => u.Role).Where(u => u.Role.Name != "Super Admin");

        if (!string.IsNullOrWhiteSpace(userParameters.SearchKey))
            query = query.Where(x =>
                x.Email != null && x.Email.Contains(userParameters.SearchKey));

        if (string.IsNullOrWhiteSpace(userParameters.OrderBy))
            query = query.OrderByDescending(x => x.CreatedAt).ThenBy(x => x.CreatedAt);
        else
            query = query.ApplySort(userParameters.OrderBy);

        var users = await query.Skip((userParameters.PageNumber - 1) * userParameters.PageSize)
            .Take(userParameters.PageSize)
            .ToListAsync();

        var userResponse = _mapper.Map<List<UserResponseModel>>(users);

        return new PageList<UserResponseModel>(userResponse, query.Count(),
            userParameters.PageNumber,
            userParameters.PageSize);
    }

    public async Task<string> EditUserAsync(Guid id, AddUserDto userUpdateDto)
    {
        var findUser = await _userRepository.FindByCondition(u => u.Id == id).FirstOrDefaultAsync();

        if (findUser == null) throw new BadRequestException("User not found.");

        findUser.Email = userUpdateDto.Email;
        findUser.Username = userUpdateDto.Username;
        findUser.RoleId = userUpdateDto.RoleId;
        findUser.UrlAvatar = userUpdateDto.UrlAvatar;
        findUser.UpdatedAt = DateTime.UtcNow;

        _userRepository.Update(findUser);
        await _userRepository.SaveChangesAsync();

        return "User has been updated successfully.";
    }

    public async Task<string> InactiveUserAsync(Guid id)
    {
        var findUser = await _userRepository.FindByCondition(u => u.Id == id).FirstOrDefaultAsync();

        if (findUser == null) throw new BadRequestException("User not found.");

        if (!findUser.IsActive) throw new BadRequestException("User is inactive.");

        findUser.IsActive = false;
        findUser.UpdatedAt = DateTime.UtcNow;

        _userRepository.Update(findUser);
        await _userRepository.SaveChangesAsync();

        return "User has been deactivated successfully.";
    }

    public async Task<UserResponseModel> GetUserById(Guid id)
    {
        var findUser = await _userRepository.FindByCondition(u => u.Id == id).Include(u => u.Role)
            .FirstOrDefaultAsync();

        if (findUser == null) throw new BadRequestException("User not found.");

        var user = _mapper.Map<UserResponseModel>(findUser);
        return user;
    }

    public async Task<string> DeleteUser(Guid userId)
    {
        var findUser = await _userRepository
            .FindByCondition(s => s.Id == userId)
            .FirstOrDefaultAsync();

        if (findUser == null) throw new BadRequestException("User not found.");

        _userRepository.Delete(findUser);
        await _userRepository.SaveChangesAsync();

        return "User has been deleted successfully.";
    }
}