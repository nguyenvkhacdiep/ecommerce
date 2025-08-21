using Ecommerce.Services.DTOs;

namespace Ecommerce.Services.Interfaces;

public interface ICartService
{
    Task<string> AddToCart(Guid userId, AddToCartDto cart);
    Task<CartResponseModel> GetCart(Guid userId);
    Task<string> DeleteItem(Guid userId, Guid itemId);
    Task<string> UpdateCartItem(Guid userId, UpdateCartItemDto itemDto);
}