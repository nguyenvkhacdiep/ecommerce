using Ecommerce.Services.DTOs;

namespace Ecommerce.Services.Interfaces;

public interface IOrderService
{
    Task<string> CreateOrderAsync(CreateOrderDto order);
}