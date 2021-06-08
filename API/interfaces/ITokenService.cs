using API.Entities;

namespace API.interfaces
{
    public interface ITokenService
    {
         public string CreateToken(AppUser appUser);
    }
}