using AutoMapper;
using Ecommerce.Base.Exceptions;
using Ecommerce.Base.Helpers;
using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using Ecommerce.Services.Common;
using Ecommerce.Services.DTOs.Shop;
using Ecommerce.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Services.Services;

public class ProductService : IProductService
{
    private readonly IMapper _mapper;
    private readonly IProductImagesRepository _productImagesRepository;
    private readonly IProductRepository _productRepository;
    private readonly IProductReviewImageRepository _productReviewImageRepository;
    private readonly IProductReviewRepository _productReviewRepository;
    private readonly IUserRepository _userRepository;

    public ProductService(IProductRepository productRepository, IUserRepository userRepository,
        IProductImagesRepository productImagesRepository, IMapper mapper,
        IProductReviewRepository productReviewRepository,
        IProductReviewImageRepository productReviewImageRepository)
    {
        _productRepository = productRepository;
        _userRepository = userRepository;
        _productImagesRepository = productImagesRepository;
        _mapper = mapper;
        _productReviewRepository = productReviewRepository;
        _productReviewImageRepository = productReviewImageRepository;
    }

    public async Task<string> CreateProduct(Guid userId, CreateProductDto product)
    {
        var findUser = await _userRepository.FindByCondition(u => u.Id == userId)
            .Include(u => u.Role)
            .Include(u => u.Shop)
            .FirstOrDefaultAsync();

        if (findUser == null)
            throw new BadRequestException("User does not exist.");

        if (findUser.Shop == null)
            throw new BadRequestException("Shop does not exist.");

        if (findUser.Role.Name == "Shop" && findUser.Shop.Id != product.ShopId)
            throw new UnauthorizedAccessException("You are not the owner of this shop.");

        if (product.StockQuantity <= 0)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "stockQuantity",
                    Issue = "Stock quantity cannot be negative."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }

        if (product.Price <= 0)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "price",
                    Issue = "Price cannot be negative."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }

        if (product.ImageUrls.Count <= 0)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "imageUrls",
                    Issue = "Product must have at least one image."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }

        var newProduct = new Product
        {
            Id = Guid.NewGuid(),
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            CategoryId = product.CategoryId,
            StockQuantity = product.StockQuantity,
            AvailabilityStatus = product.AvailabilityStatus,
            CreatedAt = DateTime.Now,
            ShopId = product.ShopId,
            Images = new List<ProductImages>()
        };

        if (product.ImageUrls != null && product.ImageUrls.Count > 0)
            foreach (var (url, index) in product.ImageUrls.Select((url, i) => (url, i)))
                newProduct.Images.Add(new ProductImages
                {
                    Id = Guid.NewGuid(),
                    ImageUrl = url,
                    IsPrimary = index == 0,
                    CreatedAt = DateTime.UtcNow,
                    ProductId = newProduct.Id
                });

        _productRepository.Add(newProduct);
        await _productRepository.SaveChangesAsync();

        return "Product has been created successfully.";
    }

    public async Task<string> EditProduct(Guid userId, Guid productId, EditProductDto product)
    {
        var findUser = await _userRepository.FindByCondition(u => u.Id == userId)
            .Include(u => u.Role)
            .Include(u => u.Shop)
            .FirstOrDefaultAsync();

        if (findUser == null)
            throw new BadRequestException("User does not exist.");

        if (findUser.Shop == null)
            throw new BadRequestException("Shop does not exist.");

        var findProduct = await _productRepository.FindByCondition(p => p.Id == productId)
            .Include(p => p.Shop)
            .FirstOrDefaultAsync();

        if (findProduct == null)
            throw new BadRequestException("Product does not exist.");

        if (findUser.Role.Name == "Shop" && findUser.Shop.Id != findProduct.ShopId)
            throw new UnauthorizedAccessException("You are not the owner of this shop.");

        if (product.StockQuantity <= 0)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "stockQuantity",
                    Issue = "Stock quantity cannot be negative."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }

        if (product.Price <= 0)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "price",
                    Issue = "Price cannot be negative."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }

        if (product.ImageUrls.Count <= 0)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "imageUrls",
                    Issue = "Product must have at least one image."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }

        findProduct.Name = product.Name;
        findProduct.Description = product.Description;
        findProduct.Price = product.Price;
        findProduct.CategoryId = product.CategoryId;
        findProduct.StockQuantity = product.StockQuantity;
        findProduct.AvailabilityStatus = product.AvailabilityStatus;
        findProduct.UpdatedAt = DateTime.Now;

        if (product.ImageUrls != null)
        {
            _productImagesRepository.DeleteRange(findProduct.Images);
            foreach (var (url, index) in product.ImageUrls.Select((url, i) => (url, i)))
                findProduct.Images.Add(new ProductImages
                {
                    Id = Guid.NewGuid(),
                    ImageUrl = url,
                    IsPrimary = index == 0,
                    CreatedAt = DateTime.UtcNow,
                    ProductId = findProduct.Id
                });
        }

        _productRepository.Update(findProduct);
        await _productRepository.SaveChangesAsync();

        return "Product has been updated successfully.";
    }

    public async Task<string> DeleteProduct(Guid userId, Guid productId)
    {
        var findUser = await _userRepository.FindByCondition(u => u.Id == userId)
            .Include(u => u.Role)
            .Include(u => u.Shop)
            .FirstOrDefaultAsync();

        if (findUser == null)
            throw new BadRequestException("User does not exist.");

        if (findUser.Shop == null)
            throw new BadRequestException("Shop does not exist.");

        var findProduct = await _productRepository.FindByCondition(p => p.Id == productId)
            .Include(p => p.Shop)
            .FirstOrDefaultAsync();

        if (findProduct == null)
            throw new BadRequestException("Product does not exist.");

        if (findUser.Role.Name == "Shop" && findUser.Shop.Id != findProduct.ShopId)
            throw new UnauthorizedAccessException("You are not the owner of this shop.");

        _productRepository.Delete(findProduct);
        await _productRepository.SaveChangesAsync();

        return "Product has been updated successfully.";
    }

    public async Task<PageList<ProductResponseModel>> GetAllProductsOfShop(Guid shopId,
        RequestParameters parameters)
    {
        var query = _productRepository.FindByCondition(p => p.ShopId == shopId);

        query = query.Include(p => p.Images);

        if (!string.IsNullOrWhiteSpace(parameters.SearchKey))
            query = query.Where(x =>
                x.Name != null && x.Name.Contains(parameters.SearchKey));

        if (string.IsNullOrWhiteSpace(parameters.OrderBy))
            query = query.OrderByDescending(x => x.CreatedAt).ThenBy(x => x.CreatedAt);
        else
            query = query.ApplySort(parameters.OrderBy);

        var list = await query.Skip((parameters.PageNumber - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .ToListAsync();

        var response = _mapper.Map<List<ProductResponseModel>>(list);

        return new PageList<ProductResponseModel>(response, query.Count(), parameters.PageNumber,
            parameters.PageSize);
    }

    public async Task<ProductResponseModel> GetProduct(Guid productId)
    {
        var findProduct = await _productRepository.FindByCondition(p => p.Id == productId)
            .Include(p => p.Images)
            .FirstOrDefaultAsync();
        if (findProduct == null)
            throw new BadRequestException("Product does not exist.");

        var response = _mapper.Map<ProductResponseModel>(findProduct);
        return response;
    }

    public async Task<string> MarkedOutOfStock(Guid userId, Guid productId)
    {
        var findUser = await _userRepository.FindByCondition(u => u.Id == userId)
            .Include(u => u.Role)
            .Include(u => u.Shop)
            .FirstOrDefaultAsync();

        if (findUser == null)
            throw new BadRequestException("User does not exist.");

        if (findUser.Shop == null)
            throw new BadRequestException("Shop does not exist.");

        var findProduct = await _productRepository.FindByCondition(p => p.Id == productId)
            .Include(p => p.Images)
            .FirstOrDefaultAsync();
        if (findProduct == null)
            throw new BadRequestException("Product does not exist.");

        if (findUser.Role.Name == "Shop" && findUser.Shop.Id != findProduct.ShopId)
            throw new UnauthorizedAccessException("You are not the owner of this shop.");

        findProduct.AvailabilityStatus = false;
        findProduct.UpdatedAt = DateTime.Now;

        _productRepository.Update(findProduct);
        await _productRepository.SaveChangesAsync();

        return "Product has been updated successfully.";
    }

    public async Task<string> Reviews(Guid userId, Guid productId, ReviewsProduct review)
    {
        var findProduct = await _productRepository.FindByCondition(p => p.Id == productId)
            .Include(p => p.Images)
            .FirstOrDefaultAsync();
        if (findProduct == null)
            throw new BadRequestException("Product does not exist.");

        var findReview = await _productReviewRepository
            .FindByCondition(r => r.ProductId == productId && r.UserId == userId)
            .Include(r => r.Images).FirstOrDefaultAsync();

        if (findReview != null)
            throw new BadRequestException("You already submitted a review for this product.");

        if (review.Rating < 1 || review.Rating > 5)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "rating",
                    Issue = "Rating must be between 1 and 5."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }

        if (!string.IsNullOrWhiteSpace(review.Comment))
        {
            var wordCount = review.Comment
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Length;

            if (wordCount > 50)
            {
                var errors = new List<FieldError>
                {
                    new()
                    {
                        Field = "comment",
                        Issue = "Comment must not exceed 50 words."
                    }
                };
                throw new BadRequestException("INVALID_FIELD", errors);
            }
        }


        var createReview = new ProductReview
        {
            Id = Guid.NewGuid(),
            ProductId = productId,
            UserId = userId,
            Rating = review.Rating,
            Comment = review.Comment,
            Images = new List<ProductReviewImage>(),
            CreatedAt = DateTime.Now
        };

        if (review.ImageUrls != null && review.ImageUrls.Count > 0)
            foreach (var (url, index) in review.ImageUrls.Select((url, i) => (url, i)))
                createReview.Images.Add(new ProductReviewImage
                {
                    Id = Guid.NewGuid(),
                    ImageUrl = url,
                    ReviewId = createReview.Id
                });
        _productReviewRepository.Add(createReview);

        var allReviews = await _productReviewRepository
            .FindByCondition(r => r.ProductId == productId)
            .ToListAsync();

        findProduct.Rating = allReviews.Average(r => r.Rating);
        findProduct.UpdatedAt = DateTime.UtcNow;
        _productRepository.Update(findProduct);

        await _productRepository.SaveChangesAsync();
        await _productReviewRepository.SaveChangesAsync();
        return "Reviews have been saved successfully.";
    }

    public async Task<string> EditReviews(Guid userId, Guid productId, ReviewsProduct review)
    {
        var findProduct = await _productRepository.FindByCondition(p => p.Id == productId)
            .Include(p => p.Images)
            .FirstOrDefaultAsync();
        if (findProduct == null)
            throw new BadRequestException("Product does not exist.");

        var findReview = await _productReviewRepository
            .FindByCondition(r => r.ProductId == productId && r.UserId == userId)
            .Include(r => r.Images).FirstOrDefaultAsync();

        if (findReview == null)
            throw new BadRequestException("No review found for this product.");

        if (review.Rating < 1 || review.Rating > 5)
        {
            var errors = new List<FieldError>
            {
                new()
                {
                    Field = "rating",
                    Issue = "Rating must be between 1 and 5."
                }
            };
            throw new BadRequestException("INVALID_FIELD", errors);
        }

        if (!string.IsNullOrWhiteSpace(review.Comment))
        {
            var wordCount = review.Comment
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Length;

            if (wordCount > 50)
            {
                var errors = new List<FieldError>
                {
                    new()
                    {
                        Field = "comment",
                        Issue = "Comment must not exceed 50 words."
                    }
                };
                throw new BadRequestException("INVALID_FIELD", errors);
            }
        }


        findReview.Rating = review.Rating;
        findReview.Comment = review.Comment;

        if (review.ImageUrls != null && review.ImageUrls.Count > 0)
        {
            if (findReview.Images != null)
                _productReviewImageRepository.DeleteRange(findReview.Images);
            foreach (var (url, index) in review.ImageUrls.Select((url, i) => (url, i)))
                findReview.Images.Add(new ProductReviewImage
                {
                    Id = Guid.NewGuid(),
                    ImageUrl = url,
                    ReviewId = findReview.Id
                });
        }

        _productReviewRepository.Update(findReview);

        var allReviews = await _productReviewRepository
            .FindByCondition(r => r.ProductId == productId)
            .ToListAsync();

        findProduct.Rating = allReviews.Average(r => r.Rating);
        findProduct.UpdatedAt = DateTime.UtcNow;
        _productRepository.Update(findProduct);

        await _productRepository.SaveChangesAsync();
        await _productReviewRepository.SaveChangesAsync();
        return "Reviews have been updated successfully.";
    }
}