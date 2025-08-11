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
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository, IRoleRepository roleRepository, IMapper mapper,
        IEmailService emailService,
        JwtTokenGenerator jwtTokenGenerator,
        IOptions<FrontendSettings> frontendOptions)
    {
        _userRepository = userRepository;
        _mapper = mapper;
        _roleRepository = roleRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _emailService = emailService;
        _frontendUrl = frontendOptions.Value.BaseUrl;
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


    public async Task<PageList<UserModel>> GetAllUsers(UserParameters userParameters)
    {
        var query = _userRepository.FindAll();

        if (!string.IsNullOrWhiteSpace(userParameters.SearchKey))
            query = query.Where(x =>
                x.Username != null && x.Username.Contains(userParameters.SearchKey));

        if (string.IsNullOrWhiteSpace(userParameters.OrderBy))
            query = query.OrderByDescending(x => x.CreatedAt).ThenBy(x => x.CreatedAt);
        else
            query = query.ApplySort(userParameters.OrderBy);

        var users = await query.Skip((userParameters.PageNumber - 1) * userParameters.PageSize)
            .Take(userParameters.PageSize)
            .ToListAsync();

        var userResponse = _mapper.Map<List<UserModel>>(users);

        return new PageList<UserModel>(userResponse, query.Count(), userParameters.PageNumber, userParameters.PageSize);
    }
}