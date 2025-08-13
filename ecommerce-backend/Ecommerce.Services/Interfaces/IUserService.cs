using Ecommerce.Services.Common;
using Ecommerce.Services.DTOs.Users;

namespace Ecommerce.Services.Interfaces;

public interface IUserService
{
    Task<PageList<UserResponseModel>> GetAllUsers(UserParameters userParameters);
    Task<UserResponseModel> AddUserAsync(AddUserDto addUserDto);
    Task<string> EditUserAsync(Guid id, AddUserDto addUserDto);
    Task<string> InactiveUserAsync(Guid id);
    Task<UserResponseModel> GetUserById(Guid id);
}