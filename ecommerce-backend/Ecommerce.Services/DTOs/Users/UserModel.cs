namespace Ecommerce.Services.DTOs.Users;

public class UserModel
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public bool IsActive { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid RoleId { get; set; }
}

public class UserResponseModel
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public RoleModel Role { get; set; }
}

public class AddUserDto
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public Guid RoleId { get; set; }
}

public class UserLoginDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class UserLoginResponseModel
{
    public UserResponseModel User { get; set; } = null!;
    public string Token { get; set; } = null!;
    public long TokenExpiresIn { get; set; }
}

public class ForgotPasswordEmailDto
{
    public string Email { get; set; } = null!;
}

public class ResetPasswordEmailDto
{
    public string Email { get; set; } = null!;
    public string Token { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string ConfirmPassword { get; set; } = null!;
}