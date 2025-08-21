namespace Ecommerce.Repositories.Models;

public class OrderCharge
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public string Type { get; set; } = null!; // Shipping, Tax, Discount, Other
    public decimal Amount { get; set; }

    public virtual Order Order { get; set; } = null!;
}