using Ecommerce.Services.DTOs.Users;
using Ecommerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [Authorize(Roles = "Super Admin")]
    [HttpGet("get-all-users")]
    public async Task<IActionResult> GetUsers([FromQuery] UserParameters userParameters)
    {
        var users = await _userService.GetAllUsers(userParameters);

        return Ok(users);
    }

    [Authorize(Roles = "Super Admin")]
    [HttpPost("add-user")]
    public async Task<IActionResult> AddUser([FromBody] AddUserDto addUserDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var createdUser = await _userService.AddUserAsync(addUserDto);
        return CreatedAtAction(nameof(GetUsers), new { id = createdUser.Id }, createdUser);
    }

    [HttpPut("edit-user/{id:guid}")]
    [Authorize(Policy = "SuperAdminOrSelf")]
    public async Task<IActionResult> EditUser(Guid id, [FromBody] AddUserDto userUpdateDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var message = await _userService.EditUserAsync(id, userUpdateDto);
        return Ok(new { message });
    }

    [Authorize(Roles = "Super Admin")]
    [HttpPatch("inactive-user/{id:guid}")]
    public async Task<IActionResult> InactiveUser(Guid id)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var message = await _userService.InactiveUserAsync(id);
        return Ok(new { message });
    }

    [HttpGet("get-user/{id:guid}")]
    [Authorize(Policy = "SuperAdminOrSelf")]
    public async Task<IActionResult> GetUser(Guid id)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _userService.GetUserById(id);
        return Ok(user);
    }
}