namespace Ecommerce.Services.DTOs;

public class AddToCartDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}

public class CartResponseModel
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public List<CartItemResponseDto> Items { get; set; } = new();
}

public class CartItemResponseDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}

public class UpdateCartItemDto
{
    public Guid CartItemId { get; set; }
    public int Quantity { get; set; }
}