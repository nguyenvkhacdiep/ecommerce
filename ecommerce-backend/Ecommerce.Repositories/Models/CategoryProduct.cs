namespace Ecommerce.Repositories.Models;

public class CategoryProduct
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Product> Product { get; set; } = new List<Product>();
}