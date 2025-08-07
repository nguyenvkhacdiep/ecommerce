using Ecommerce.Services.DTOs.Users;

namespace Ecommerce.Services.Interfaces;

public interface IAuthService
{
    Task<UserLoginResponseModel> Login(UserLoginDto userLoginDto);
    Task<string> ResendActivationEmailAsync(string email);
    Task<object> ActivateUserAsync(string token);
    Task<string> ForgotPassword(string email);
    Task<bool> ValidateToken(string token, string type);
    Task<string> ResetPassword(ResetPasswordEmailDto resetPasswordEmailDto);
    Task<List<RoleModel>> GetAllRoles();
}