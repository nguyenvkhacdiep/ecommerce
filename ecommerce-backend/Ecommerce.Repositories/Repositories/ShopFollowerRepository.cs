using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using SCGC.Repositories.Repositories;

namespace Ecommerce.Repositories.Repositories;

public class ShopFollowerRepository : BaseRepository<ShopFollower>,
    IShopFollowerRepository
{
    public ShopFollowerRepository(AppDbContext context) : base(context)
    {
    }
}