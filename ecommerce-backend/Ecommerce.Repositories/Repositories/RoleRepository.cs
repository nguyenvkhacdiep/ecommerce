using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using SCGC.Repositories.Repositories;

namespace Ecommerce.Repositories.Repositories
{
    public class RoleRepository : BaseRepository<Role>, IRoleRepository
    {
        public RoleRepository(AppDbContext context): base(context){}
    }
    
}