using AutoMapper;
using Ecommerce.Base.Exceptions;
using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using Ecommerce.Services.DTOs;
using Ecommerce.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Services.Services;

public class CartService : ICartService
{
    private readonly ICartItemRepository _cartItemRepository;
    private readonly ICartRepository _cartRepository;
    private readonly IMapper _mapper;
    private readonly IProductRepository _productRepository;

    public CartService(ICartRepository cartRepository, IMapper mapper,
        IProductRepository productRepository,
        ICartItemRepository cartItemRepository)
    {
        _cartRepository = cartRepository;
        _mapper = mapper;
        _productRepository = productRepository;
        _cartItemRepository = cartItemRepository;
    }

    public async Task<string> AddToCart(Guid userId, AddToCartDto cartDto)
    {
        var findProduct = await _productRepository.FindByCondition(p => p.Id == cartDto.ProductId)
            .FirstOrDefaultAsync();

        if (findProduct == null)
            throw new BadRequestException("Product does not exist or not enough stock.");

        if (findProduct.StockQuantity < cartDto.Quantity)
            throw new BadRequestException("Product does not enough stock.");

        var findCart = await _cartRepository.FindByCondition(c => c.UserId == userId)
            .Include(c => c.Items).FirstOrDefaultAsync();

        var isNewCart = false;

        if (findCart == null)
        {
            findCart = new Cart
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CreatedAt = DateTime.Now,
                Items = new List<CartItem>()
            };
            isNewCart = true;
        }

        var existingItem = findCart.Items.FirstOrDefault(i => i.ProductId == findProduct.Id);

        if (existingItem != null)
        {
            existingItem.Quantity += cartDto.Quantity;
            existingItem.UpdatedAt = DateTime.Now;
        }
        else
        {
            findCart.Items.Add(new CartItem
            {
                Id = Guid.NewGuid(),
                CartId = findCart.Id,
                ProductId = findProduct.Id,
                Quantity = cartDto.Quantity,
                CreatedAt = DateTime.Now
            });
        }

        if (isNewCart)
            _cartRepository.Add(findCart);
        else
            _cartRepository.Update(findCart);
        await _cartRepository.SaveChangesAsync();

        return "Product has been added to your cart";
    }

    public async Task<CartResponseModel> GetCart(Guid userId)
    {
        var findCart = await _cartRepository.FindByCondition(c => c.UserId == userId)
            .Include(c => c.Items).ThenInclude(i => i.Product).ThenInclude(p => p.Images)
            .FirstOrDefaultAsync();

        if (findCart == null)
            return new CartResponseModel
                { UserId = userId, Items = new List<CartItemResponseDto>() };

        var response = _mapper.Map<CartResponseModel>(findCart);
        return response;
    }

    public async Task<string> DeleteItem(Guid userId, Guid itemId)
    {
        var findItem = await _cartItemRepository.FindByCondition(c => c.Id == itemId)
            .FirstOrDefaultAsync();

        if (findItem == null)
            throw new BadRequestException("Cart item not found.");

        _cartItemRepository.Delete(findItem);
        await _cartItemRepository.SaveChangesAsync();

        return "Product has been deleted from your cart";
    }

    public async Task<string> UpdateCartItem(Guid userId, UpdateCartItemDto itemDto)
    {
        var findItem = await _cartItemRepository.FindByCondition(c => c.Id == itemDto.CartItemId)
            .Include(c => c.Product)
            .FirstOrDefaultAsync();

        if (findItem == null)
            throw new BadRequestException("Cart item not found.");

        if (itemDto.Quantity <= 0)
            throw new BadRequestException("Quantity must be greater than zero.");

        if (itemDto.Quantity > findItem.Product.StockQuantity)
            throw new BadRequestException("Not enough stock for this product.");

        findItem.Quantity = itemDto.Quantity;
        findItem.UpdatedAt = DateTime.Now;

        _cartItemRepository.Update(findItem);
        await _cartItemRepository.SaveChangesAsync();

        return "Product has been updated from your cart.";
    }
}