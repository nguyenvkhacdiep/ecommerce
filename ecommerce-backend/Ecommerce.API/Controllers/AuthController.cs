using Ecommerce.Services.DTOs.Users;
using Ecommerce.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _authService.Login(userLoginDto);

        return Ok(result);
    }

    [HttpGet("resend-activation")]
    public async Task<IActionResult> ResendActivationEmail([FromQuery] string email)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _authService.ResendActivationEmailAsync(email);

        return Ok(new { result });
    }

    [HttpGet("activate")]
    public async Task<IActionResult> ActivateUser([FromQuery] string token)
    {
        var result = await _authService.ActivateUserAsync(token);
        return Ok(result);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> SendEmailResetPassword([FromBody] ForgotPasswordEmailDto forgotPasswordEmailDto)
    {
        var message = await _authService.ForgotPassword(forgotPasswordEmailDto.Email);
        return Ok(new { message });
    }

    [HttpGet("check-token")]
    public async Task<IActionResult> CheckResetPasswordToken([FromQuery] string token)
    {
        var isValid = await _authService.ValidateToken(token, "reset-password");
        return Ok(isValid);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordEmailDto resetPasswordEmailDto)
    {
        var message = await _authService.ResetPassword(resetPasswordEmailDto);
        return Ok(new { message });
    }

    [HttpGet("get-all-roles")]
    public async Task<IActionResult> GetAllRole()
    {
        var roles = await _authService.GetAllRoles();
        return Ok(roles);
    }
}