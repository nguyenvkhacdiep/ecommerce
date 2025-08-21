namespace Ecommerce.Services.DTOs;

public class CreateOrderDto
{
    public Guid UserId { get; set; }
    
    public List<CreateOrderItemDto> Items { get; set; } = new();
    public CreateOrderAddressDto ShippingAddress { get; set; } = null!;
    public List<CreateOrderChargeDto> Charges { get; set; } = new();
    public string? Note { get; set; }
}

public class CreateOrderChargeDto
{
    public string Type { get; set; } = null!;
    public decimal Amount { get; set; }
}

public class CreateOrderItemDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}

public class CreateOrderAddressDto
{
    public string FullName { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Street { get; set; } = null!;
    public string Ward { get; set; } = null!;
    public string District { get; set; } = null!;
    public string City { get; set; } = null!;
    public string Country { get; set; } = "Vietnam";
}
