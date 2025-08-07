using Ecommerce.Services.Common;
using Ecommerce.Services.DTOs.Users;

namespace Ecommerce.Services.Interfaces;

public interface IUserService
{
    Task<PageList<UserModel>> GetAllUsers(UserParameters userParameters);
    Task<UserResponseModel> AddUserAsync(AddUserDto addUserDto);
}