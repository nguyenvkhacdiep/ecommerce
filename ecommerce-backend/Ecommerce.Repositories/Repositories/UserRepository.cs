using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using SCGC.Repositories.Repositories;

namespace Ecommerce.Repositories.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context): base(context){}
    }
    
}