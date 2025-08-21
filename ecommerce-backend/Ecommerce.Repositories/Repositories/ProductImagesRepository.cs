using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using SCGC.Repositories.Repositories;

namespace Ecommerce.Repositories.Repositories;

public class ProductImagesRepository : BaseRepository<ProductImages>, IProductImagesRepository
{
    public ProductImagesRepository(AppDbContext context) : base(context)
    {
    }
}