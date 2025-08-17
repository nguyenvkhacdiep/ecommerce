using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using SCGC.Repositories.Repositories;

namespace Ecommerce.Repositories.Repositories;

public class CategoryProductRepository : BaseRepository<CategoryProduct>, ICategoryProductRepository
{
    public CategoryProductRepository(AppDbContext context) : base(context)
    {
    }
}