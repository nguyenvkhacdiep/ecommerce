using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using SCGC.Repositories.Repositories;

namespace Ecommerce.Repositories.Repositories;

public class TokenUserRepository : BaseRepository<TokenUser>, ITokenUserRepository
{
    public TokenUserRepository(AppDbContext context) : base(context)
    {
    }
}