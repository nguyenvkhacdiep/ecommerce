using System.Security.Claims;
using Ecommerce.Services.Common;
using Ecommerce.Services.DTOs.Shop;
using Ecommerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ShopController : ControllerBase
{
    private readonly IShopService _shopService;

    public ShopController(IShopService shopService)
    {
        _shopService = shopService;
    }

    [HttpPost("add-shop")]
    [Authorize(Roles = "Super Admin,Admin,Shop")]
    public async Task<IActionResult> AddShop([FromBody] AddShopDto shop)
    {
        var message = await _shopService.AddShop(shop);
        return Ok(new
        {
            message
        });
    }

    [HttpGet("get-all-shops")]
    [Authorize(Roles = "Super Admin,Admin")]
    public async Task<IActionResult> GetAllShops([FromQuery] RequestParameters parameters)
    {
        var result = await _shopService.GetAllShops(parameters);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Super Admin,Admin,Shop")]
    public async Task<IActionResult> GetShop(Guid id)
    {
        var result = await _shopService.GetShopById(id);
        return Ok(result);
    }

    [HttpPut("edit-shop/{id:guid}")]
    [Authorize(Roles = "Super Admin,Admin,Shop")]
    public async Task<IActionResult> EditShop(Guid id, [FromBody] EditShopDto shopDto)
    {
        var message = await _shopService.EditShop(id, shopDto);
        return Ok(new { message });
    }

    [HttpPatch("change-type-shop/{id:guid}")]
    [Authorize(Roles = "Super Admin,Admin")]
    public async Task<IActionResult> ChangeTypeShop(Guid id, [FromBody] EditTypeShopDto shopDto)
    {
        var message = await _shopService.ChangeTypeShop(id, shopDto);
        return Ok(new { message });
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Super Admin,Admin,Shop")]
    public async Task<IActionResult> DeleteShop(Guid id)
    {
        var message = await _shopService.DeleteShop(id);
        return Ok(new { message });
    }

    [HttpPatch("follow-shop/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> FollowShop(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid user.");
        var userIdParse = new Guid(userIdClaim);
        var message = await _shopService.FollowShop(id, userIdParse);
        return Ok(new { message });
    }
}