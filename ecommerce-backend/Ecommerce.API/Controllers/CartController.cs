using System.Security.Claims;
using Ecommerce.Services.DTOs;
using Ecommerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpPost("add-to-cart")]
    [Authorize]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto cartDto)
    {
        var userId =
            Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                       throw new UnauthorizedAccessException());

        var message = await _cartService.AddToCart(userId, cartDto);
        return Ok(new
        {
            message
        });
    }

    [HttpGet("my-cart")]
    [Authorize]
    public async Task<IActionResult> GetCart()
    {
        var userId =
            Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                       throw new UnauthorizedAccessException());

        var result = await _cartService.GetCart(userId);
        return Ok(result);
    }

    [HttpDelete("delete-item/{itemId:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteItem(Guid itemId)
    {
        var userId =
            Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                       throw new UnauthorizedAccessException());

        var result = await _cartService.DeleteItem(userId, itemId);
        return Ok(result);
    }

    [HttpPut("update-item")]
    [Authorize]
    public async Task<IActionResult> DeleteItem(UpdateCartItemDto itemDto)
    {
        var userId =
            Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                       throw new UnauthorizedAccessException());

        var result = await _cartService.UpdateCartItem(userId, itemDto);
        return Ok(result);
    }
}