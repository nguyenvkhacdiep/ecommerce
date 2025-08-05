using System.Linq.Expressions;

namespace Ecommerce.Repositories.Interfaces;

public interface IBaseRepository<T>
{
    IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression);
    IQueryable<T> FindAll();
    void Add(T entity);
    Task<T> AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
    Task SaveChangesAsync();
    void AddRange(IEnumerable<T> entities);
    void UpdateRange(IEnumerable<T> entities);
    Task AddRangeAsync(IEnumerable<T> entities);
    Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> expression);
    Task<List<T1>> GetListByQueryAsync<T1>(string query) where T1 : class;
    Task<int> GetCountByQueryAsync<T1>(string query);
}