namespace Ecommerce.Repositories.Models;

public class CategoryProduct
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public Guid ShopId { get; set; }
    public virtual Shop Shop { get; set; } = null!;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}