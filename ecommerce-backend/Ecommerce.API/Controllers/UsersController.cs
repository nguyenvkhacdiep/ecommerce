using Ecommerce.Services.DTOs.Users;
using Ecommerce.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class usersController : ControllerBase
{
    private readonly IUserService _userService;

    public usersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("get-all-users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userService.GetAllUsers();

        return Ok(users);
    }

    [HttpPost("add-user")]
    public async Task<IActionResult> AddUser([FromBody] AddUserDto addUserDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var createdUser = await _userService.AddUserAsync(addUserDto);
        return CreatedAtAction(nameof(GetUsers), new { id = createdUser.Id }, createdUser);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _userService.Login(userLoginDto);

        return Ok(result);
    }

    [HttpGet("resend-activation")]
    public async Task<IActionResult> ResendActivationEmail([FromQuery] string email)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _userService.ResendActivationEmailAsync(email);

        return Ok(new { result });
    }

    [HttpGet("activate")]
    public async Task<IActionResult> ActivateUser([FromQuery] string token)
    {
        var result = await _userService.ActivateUserAsync(token);
        return Ok(result);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> SendEmailResetPassword([FromBody] ForgotPasswordEmailDto forgotPasswordEmailDto)
    {
        var message = await _userService.ForgotPassword(forgotPasswordEmailDto.Email);
        return Ok(new { message });
    }

    [HttpGet("check-token")]
    public async Task<IActionResult> CheckResetPasswordToken([FromQuery] string token)
    {
        var isValid = await _userService.ValidateToken(token, "reset-password");
        return Ok(isValid);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordEmailDto resetPasswordEmailDto)
    {
        var message = await _userService.ResetPassword(resetPasswordEmailDto);
        return Ok(new { message });
    }
}