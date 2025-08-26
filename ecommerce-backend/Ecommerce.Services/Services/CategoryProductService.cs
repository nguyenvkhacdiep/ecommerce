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

public class CategoryProductService : ICategoryProductService
{
    private readonly ICategoryProductRepository _categoryProductRepository;
    private readonly IMapper _mapper;
    private readonly IShopRepository _shopRepository;
    private readonly IUserRepository _userRepository;

    public CategoryProductService(ICategoryProductRepository categoryProductRepository,
        IMapper mapper,
        IShopRepository shopRepository,
        IUserRepository userRepository)
    {
        _categoryProductRepository = categoryProductRepository;
        _mapper = mapper;
        _shopRepository = shopRepository;
        _userRepository = userRepository;
    }

    public async Task<string> AddCategory(Guid userId, AddCategoryProductDto addCategoryDto)
    {
        var shop = await _shopRepository
            .FindByCondition(s => s.Id == addCategoryDto.ShopId)
            .FirstOrDefaultAsync();

        if (shop == null)
            throw new BadRequestException("Shop does not exist.");

        var userRole = await _userRepository
            .FindByCondition(u => u.Id == userId)
            .Select(u => u.Role.Name)
            .FirstOrDefaultAsync();

        if (userRole == "Shop" && shop.UserId != userId)
            throw new UnauthorizedAccessException("You are not the owner of this shop.");

        var existingCategory =
            await _categoryProductRepository.FindByCondition(c => c.Name == addCategoryDto.Name)
                .FirstOrDefaultAsync();

        if (existingCategory != null)
            throw new BadRequestException("Category already exists.");

        var category = new CategoryProduct
        {
            Id = Guid.NewGuid(),
            Name = addCategoryDto.Name,
            ShopId = addCategoryDto.ShopId
        };

        _categoryProductRepository.Add(category);
        await _categoryProductRepository.SaveChangesAsync();

        return "Category has been added.";
    }

    public async Task<string> EditCategory(Guid userId, Guid categoryId,
        EditCategoryProduct categoryDto)
    {
        var existingCategory =
            await _categoryProductRepository.FindByCondition(c => c.Id == categoryId)
                .Include(c => c.Shop)
                .FirstOrDefaultAsync();

        if (existingCategory == null)
            throw new BadRequestException("Category does not exist.");

        var userRole = await _userRepository
            .FindByCondition(u => u.Id == userId)
            .Select(u => u.Role.Name)
            .FirstOrDefaultAsync();


        if (userRole == "Shop" && existingCategory.Shop.UserId != userId)
            throw new UnauthorizedAccessException("You are not the owner of this shop.");

        existingCategory.Name = categoryDto.Name;

        _categoryProductRepository.Update(existingCategory);
        await _categoryProductRepository.SaveChangesAsync();

        return "Category has been updated successfully.";
    }

    public async Task<string> DeleteCategory(Guid userId, Guid categoryId)
    {
        var existingCategory =
            await _categoryProductRepository.FindByCondition(c => c.Id == categoryId)
                .Include(c => c.Shop)
                .FirstOrDefaultAsync();

        if (existingCategory == null)
            throw new BadRequestException("Category does not exist.");

        var userRole = await _userRepository
            .FindByCondition(u => u.Id == userId)
            .Select(u => u.Role.Name)
            .FirstOrDefaultAsync();

        if (userRole == "Shop" && existingCategory.Shop.UserId != userId)
            throw new UnauthorizedAccessException("You are not the owner of this shop.");

        _categoryProductRepository.Delete(existingCategory);
        await _categoryProductRepository.SaveChangesAsync();

        return "Category has been deleted successfully.";
    }

    public async Task<PageList<CategoryProductResponseModel>> GetAllCategories(Guid shopId,
        RequestParameters parameters)
    {
        var query = _categoryProductRepository.FindByCondition(c => c.ShopId == shopId);

        if (!string.IsNullOrWhiteSpace(parameters.SearchKey))
            query = query.Where(x =>
                x.Name != null && x.Name.Contains(parameters.SearchKey));

        if (string.IsNullOrWhiteSpace(parameters.OrderBy))
            query = query.OrderByDescending(x => x.Name);
        else
            query = query.ApplySort(parameters.OrderBy);

        var result = _mapper.Map<List<CategoryProductResponseModel>>(query);
        return new PageList<CategoryProductResponseModel>(result, query.Count(),
            parameters.PageNumber,
            parameters.PageSize);
    }

    public async Task<CategoryProductResponseModel> GetCategory(Guid categoryId)
    {
        var query = await _categoryProductRepository.FindByCondition(c => c.Id == categoryId)
            .FirstOrDefaultAsync();

        if (query == null) throw new BadRequestException("Category not found.");

        var result = _mapper.Map<CategoryProductResponseModel>(query);
        return result;
    }
}