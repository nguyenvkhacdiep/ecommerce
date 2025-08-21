using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using Microsoft.EntityFrameworkCore;

namespace SCGC.Repositories.Repositories;

public class BaseRepository<T> : IBaseRepository<T> where T : class
{
    private readonly AppDbContext _context;

    public BaseRepository(AppDbContext context)
    {
        _context = context;
        _context.ChangeTracker.LazyLoadingEnabled = false;
    }

    public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression)
    {
        return _context.Set<T>().Where(expression);
    }

    public IQueryable<T> FindAll()
    {
        return _context.Set<T>();
    }

    public void Add(T entity)
    {
        _context.Set<T>().Add(entity);
    }

    public async Task<T> AddAsync(T entity)
    {
        await _context.Set<T>().AddAsync(entity);
        return entity;
    }

    public void Update(T entity)
    {
        _context.Set<T>().Update(entity);
    }

    public void Delete(T entity)
    {
        _context.Set<T>().Remove(entity);
    }

    public void DeleteRange(IEnumerable<T> entities)
    {
        _context.Set<T>().RemoveRange(entities);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public void AddRange(IEnumerable<T> entities)
    {
        _context.Set<T>().AddRange(entities);
    }

    public void UpdateRange(IEnumerable<T> entities)
    {
        _context.Set<T>().UpdateRange(entities);
    }

    public async Task AddRangeAsync(IEnumerable<T> entities)
    {
        await _context.Set<T>().AddRangeAsync(entities);
    }

    public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> expression)
    {
        return await _context.Set<T>().FirstOrDefaultAsync(expression);
    }

    public async Task<List<T1>> GetListByQueryAsync<T1>(string query) where T1 : class
    {
        return await _context.Database.SqlQuery<T1>(FormattableStringFactory.Create(query))
            .ToListAsync();
    }

    public async Task<int> GetCountByQueryAsync<T1>(string query)
    {
        return await _context.Database.SqlQuery<T1>(FormattableStringFactory.Create(query))
            .CountAsync();
    }
}