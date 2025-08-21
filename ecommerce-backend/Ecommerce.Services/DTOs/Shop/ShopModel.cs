using Ecommerce.Base.Models;

namespace Ecommerce.Services.DTOs.Shop;

public class AddShopDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? LogoUrl { get; set; }
    public ShopTypeEnum Type { get; set; }
    public Guid UserId { get; set; }
}

public class ShopResponseModel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? LogoUrl { get; set; }
    public decimal Rating { get; set; } = 0;
    public int FollowerCount { get; set; } = 0;
    public ShopTypeEnum Type { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public Guid UserId { get; set; }
}

public class EditShopDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? LogoUrl { get; set; }
    public ShopTypeEnum Type { get; set; } = 0;
}

public class EditTypeShopDto
{
    public ShopTypeEnum Type { get; set; }
}