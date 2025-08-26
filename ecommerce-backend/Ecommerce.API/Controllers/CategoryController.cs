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
public class CategoryController : ControllerBase
{
    private readonly ICategoryProductService _categoryProductService;

    public CategoryController(ICategoryProductService categoryProduct)
    {
        _categoryProductService = categoryProduct;
    }

    [HttpPost("add-category")]
    [Authorize(Roles = "Super Admin,Admin,Shop")]
    public async Task<IActionResult> AddCategory([FromBody] AddCategoryProductDto category)
    {
        var userId =
            Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                       throw new UnauthorizedAccessException());

        var message = await _categoryProductService.AddCategory(userId, category);
        return Ok(new
        {
            message
        });
    }

    [HttpGet("get-all-categories/{shopId:guid}")]
    [Authorize(Roles = "Super Admin,Admin,Shop")]
    public async Task<IActionResult> GetAllCategories(Guid shopId,
        [FromQuery] RequestParameters parameters)
    {
        var result = await _categoryProductService.GetAllCategories(shopId, parameters);
        return Ok(result);
    }

    [HttpGet("{categoryId:guid}")]
    [Authorize(Roles = "Super Admin,Admin,Shop")]
    public async Task<IActionResult> GetCategory(Guid categoryId)
    {
        var result = await _categoryProductService.GetCategory(categoryId);
        return Ok(result);
    }

    [HttpPut("edit-category/{id:guid}")]
    [Authorize(Roles = "Super Admin,Admin,Shop")]
    public async Task<IActionResult> EditCategory(Guid id, [FromBody] EditCategoryProduct payload)
    {
        var userId =
            Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                       throw new UnauthorizedAccessException());
        var message = await _categoryProductService.EditCategory(userId, id, payload);
        return Ok(new { message });
    }

    [HttpDelete("delete-category/{id:guid}")]
    [Authorize(Roles = "Super Admin,Shop")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var userId =
            Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                       throw new UnauthorizedAccessException());
        var message = await _categoryProductService.DeleteCategory(userId, id);
        return Ok(new { message });
    }
}