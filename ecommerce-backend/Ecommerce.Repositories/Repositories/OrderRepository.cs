using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using SCGC.Repositories.Repositories;

namespace Ecommerce.Repositories.Repositories;

public class OrderRepository : BaseRepository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context) : base(context)
    {
    }
}