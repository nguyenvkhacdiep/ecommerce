using Ecommerce.Base.Models;

namespace Ecommerce.Repositories.Models;

public class Shop
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

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}