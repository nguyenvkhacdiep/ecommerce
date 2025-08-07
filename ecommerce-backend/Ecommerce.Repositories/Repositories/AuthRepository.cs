using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using SCGC.Repositories.Repositories;

namespace Ecommerce.Repositories.Repositories;

public class AuthRepository : BaseRepository<User>, IAuthRepository
{
    public AuthRepository(AppDbContext context) : base(context)
    {
    }
}