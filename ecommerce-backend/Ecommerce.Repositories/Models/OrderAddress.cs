namespace Ecommerce.Repositories.Models;

public class OrderAddress
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }

    public string FullName { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string AddressLine { get; set; } = null!;
    public string City { get; set; } = null!;
    public string State { get; set; } = null!;
    public string Country { get; set; } = null!;
    public string PostalCode { get; set; } = null!;

    public string Type { get; set; } = "Shipping";
    // Shipping | Billing | Both

    public virtual Order Order { get; set; } = null!;
}