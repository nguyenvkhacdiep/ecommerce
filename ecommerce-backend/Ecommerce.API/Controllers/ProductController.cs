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
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpPost("add-product")]
    [Authorize(Roles = "Super Admin,Admin,Shop")]
    public async Task<IActionResult> AddProduct([FromBody] CreateProductDto product)
    {
        var userId =
            Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                       throw new UnauthorizedAccessException());
        var message = await _productService.CreateProduct(userId, product);
        return Ok(new
        {
            message
        });
    }

    [HttpPut("edit-product/{productId:guid}")]
    [Authorize(Roles = "Super Admin,Admin,Shop")]
    public async Task<IActionResult> EditProduct(Guid productId, [FromBody] EditProductDto product)
    {
        var userId =
            Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                       throw new UnauthorizedAccessException());

        var message = await _productService.EditProduct(userId, productId, product);
        return Ok(new
        {
            message
        });
    }

    [HttpDelete("delete-product/{productId:guid}")]
    [Authorize(Roles = "Super Admin,Admin,Shop")]
    public async Task<IActionResult> DeleteProduct(Guid productId)
    {
        var userId =
            Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                       throw new UnauthorizedAccessException());

        var message = await _productService.DeleteProduct(userId, productId);
        return Ok(new
        {
            message
        });
    }

    [HttpGet("get-all-products/{shopId:guid}")]
    [Authorize]
    public async Task<IActionResult> GetAllProductsOfShop(Guid shopId,
        [FromQuery] RequestParameters parameters)
    {
        var result = await _productService.GetAllProductsOfShop(shopId, parameters);
        return Ok(result);
    }

    [HttpGet("{productId:guid}")]
    [Authorize]
    public async Task<IActionResult> GetProduct(Guid productId)
    {
        var result = await _productService.GetProduct(productId);
        return Ok(result);
    }

    [HttpPatch("mark-out-of-stock/{productId:guid}")]
    [Authorize]
    public async Task<IActionResult> MarkedOutOfStock(Guid productId)
    {
        var userId =
            Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                       throw new UnauthorizedAccessException());
        var message = await _productService.MarkedOutOfStock(userId, productId);
        return Ok(new { message });
    }
}