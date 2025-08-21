using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using SCGC.Repositories.Repositories;

namespace Ecommerce.Repositories.Repositories;

public class ProductReviewRepository : BaseRepository<ProductReview>, IProductReviewRepository
{
    public ProductReviewRepository(AppDbContext context) : base(context)
    {
    }
}