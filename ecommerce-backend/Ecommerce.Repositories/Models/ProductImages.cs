namespace Ecommerce.Repositories.Models;

public class ProductImages
{
    public Guid Id { get; set; }
    public string ImageUrl { get; set; } = null!;
    public bool IsPrimary { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid ProductId { get; set; }
    public virtual Product Product { get; set; } = null!;
}