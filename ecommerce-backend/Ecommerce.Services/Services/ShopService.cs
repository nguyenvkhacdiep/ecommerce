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

public class ShopService : IShopService
{
    private readonly IMapper _mapper;
    private readonly IShopFollowerRepository _shopFollowerRepository;
    private readonly IShopRepository _shopRepository;
    private readonly IUserRepository _userRepository;


    public ShopService(IShopRepository shopRepository,
        IUserRepository userRepository, IMapper mapper,
        IShopFollowerRepository shopFollowerRepository)
    {
        _shopRepository = shopRepository;
        _userRepository = userRepository;
        _mapper = mapper;
        _shopFollowerRepository = shopFollowerRepository;
    }

    public async Task<string> AddShop(AddShopDto payload)
    {
        var existingUser = await _userRepository
            .FindByCondition(u => u.Id == payload.UserId)
            .Include(u => u.Role)
            .FirstOrDefaultAsync();

        if (existingUser == null)
            throw new BadRequestException("User does not exist.");

        if (!existingUser.IsActive)
            throw new BadRequestException(
                "Please activate your account to add a shop.");

        if (existingUser.Role.Name != "Shop")
            throw new BadRequestException(
                "This action is only allowed for users with the Shop role.");

        var existingShop = await _shopRepository
            .FindByCondition(u => u.User.Id == payload.UserId)
            .FirstOrDefaultAsync();

        if (existingShop != null)
            throw new BadRequestException(
                "A shop already exists for this user.");

        var shop = new Shop
        {
            Id = Guid.NewGuid(),
            UserId = payload.UserId,
            Name = payload.Name,
            Description = payload.Description,
            Address = payload.Address,
            PhoneNumber = payload.PhoneNumber,
            LogoUrl = payload.LogoUrl,
            Type = payload.Type
        };
        _shopRepository.Add(shop);

        await _shopRepository.SaveChangesAsync();

        return "Shop has been created successfully for the user.";
    }

    public async Task<PageList<ShopResponseModel>> GetAllShops(RequestParameters parameters)
    {
        var query = _shopRepository.FindAll();

        if (!string.IsNullOrWhiteSpace(parameters.SearchKey))
            query = query.Where(x =>
                x.Name != null && x.Name.Contains(parameters.SearchKey));

        if (string.IsNullOrWhiteSpace(parameters.OrderBy))
            query = query.OrderByDescending(x => x.CreatedAt);
        else
            query = query.ApplySort(parameters.OrderBy);

        var list = await query.Skip((parameters.PageNumber - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .ToListAsync();

        var response = _mapper.Map<List<ShopResponseModel>>(list);

        return new PageList<ShopResponseModel>(response, query.Count(), parameters.PageNumber,
            parameters.PageSize);
    }

    public async Task<ShopResponseModel> GetShopById(Guid id)
    {
        var findShop = await _shopRepository.FindByCondition(s => s.Id == id).FirstOrDefaultAsync();

        if (findShop == null) throw new BadRequestException("Shop not found.");

        var response = _mapper.Map<ShopResponseModel>(findShop);

        return response;
    }

    public async Task<string> EditShop(Guid shopId, EditShopDto payload)
    {
        var existingShop = await _shopRepository
            .FindByCondition(s => s.Id == shopId)
            .FirstOrDefaultAsync();

        if (existingShop == null)
            throw new BadRequestException("Shop does not exist.");

        existingShop.Name = payload.Name;
        existingShop.Description = payload.Description;
        existingShop.Address = payload.Address;
        existingShop.PhoneNumber = payload.PhoneNumber;
        existingShop.LogoUrl = payload.LogoUrl;
        existingShop.Type = payload.Type;
        existingShop.UpdatedAt = DateTime.UtcNow;

        _shopRepository.Update(existingShop);

        await _shopRepository.SaveChangesAsync();

        return "Shop has been updated successfully.";
    }

    public async Task<string> ChangeTypeShop(Guid shopId, EditTypeShopDto payload)
    {
        var existingShop = await _shopRepository
            .FindByCondition(s => s.Id == shopId)
            .FirstOrDefaultAsync();

        if (existingShop == null)
            throw new BadRequestException("Shop does not exist.");

        if (existingShop.Type == payload.Type)
            throw new BadRequestException(
                "The new shop type must be different from the current type.");

        existingShop.Type = payload.Type;
        existingShop.UpdatedAt = DateTime.UtcNow;

        _shopRepository.Update(existingShop);
        await _shopRepository.SaveChangesAsync();

        return "Shop has been updated successfully.";
    }

    public async Task<string> DeleteShop(Guid shopId)
    {
        var existingShop = await _shopRepository
            .FindByCondition(s => s.Id == shopId)
            .FirstOrDefaultAsync();

        if (existingShop == null)
            throw new BadRequestException("Shop does not exist.");

        _shopRepository.Delete(existingShop);
        await _shopRepository.SaveChangesAsync();

        return "Shop has been deleted successfully.";
    }

    public async Task<string> FollowShop(Guid shopId, Guid userId)
    {
        var existingShop = await _shopRepository
            .FindByCondition(s => s.Id == shopId)
            .FirstOrDefaultAsync();

        if (existingShop == null)
            throw new BadRequestException("Shop does not exist.");

        var existingFollow = await _shopFollowerRepository
            .FindByCondition(f => f.ShopId == shopId && f.UserId == userId)
            .FirstOrDefaultAsync();

        if (existingFollow != null)
        {
            _shopFollowerRepository.Delete(existingFollow);
            existingShop.FollowerCount = Math.Max(existingShop.FollowerCount - 1, 0);
            _shopRepository.Update(existingShop);

            await _shopFollowerRepository.SaveChangesAsync();
            await _shopRepository.SaveChangesAsync();

            return $"You have unfollowed {existingShop.Name}.";
        }

        var newFollow = new ShopFollower
        {
            Id = Guid.NewGuid(),
            ShopId = shopId,
            UserId = userId,
            FollowedAt = DateTime.UtcNow
        };
        _shopFollowerRepository.Add(newFollow);

        existingShop.FollowerCount += 1;
        _shopRepository.Update(existingShop);

        await _shopFollowerRepository.SaveChangesAsync();
        await _shopRepository.SaveChangesAsync();

        return $"You are now following {existingShop.Name}.";
    }
}