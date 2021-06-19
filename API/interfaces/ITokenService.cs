using System.Threading.Tasks;
using API.Entities;

namespace API.interfaces
{
    public interface ITokenService
    {
         public Task<string> CreateToken(AppUser appUser);
    }
}