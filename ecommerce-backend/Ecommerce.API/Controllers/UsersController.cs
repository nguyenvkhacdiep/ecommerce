using Ecommerce.Services.DTOs.Users;
using Ecommerce.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("get-all-users")]
    public async Task<IActionResult> GetUsers([FromQuery] UserParameters userParameters)
    {
        var users = await _userService.GetAllUsers(userParameters);

        return Ok(users);
    }

    [HttpPost("add-user")]
    public async Task<IActionResult> AddUser([FromBody] AddUserDto addUserDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var createdUser = await _userService.AddUserAsync(addUserDto);
        return CreatedAtAction(nameof(GetUsers), new { id = createdUser.Id }, createdUser);
    }
}