using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using SCGC.Repositories.Repositories;

namespace Ecommerce.Repositories.Repositories;

public class ProductReviewImageRepository : BaseRepository<ProductReviewImage>,
    IProductReviewImageRepository
{
    public ProductReviewImageRepository(AppDbContext context) : base(context)
    {
    }
}