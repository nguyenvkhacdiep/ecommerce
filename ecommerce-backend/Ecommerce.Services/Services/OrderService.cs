using Ecommerce.Repositories.Interfaces;
using Ecommerce.Services.DTOs;
using Ecommerce.Services.Interfaces;

namespace Ecommerce.Services.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;

    public OrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<string> CreateOrderAsync(CreateOrderDto order)
    {
        return "Oke";
    }
}