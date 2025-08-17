namespace Ecommerce.Repositories.Models;

public class Product
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public bool AvailabilityStatus { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Guid? CategoryId { get; set; }
    public Guid ShopId { get; set; }

    public virtual CategoryProduct? CategoryProduct { get; set; } = null!;

    public virtual ICollection<ProductImages> Images { get; set; } = new List<ProductImages>();
    public virtual Shop Shop { get; set; } = null!;
}