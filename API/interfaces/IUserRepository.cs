using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;
using API.Helpers;

namespace API.interfaces
{
    public interface IUserRepository
    {
         void Update(AppUser user);

        public Task<bool> SaveAllAsync();
        Task<PagedList<AppUser>> GetAllUsersAsync(UserParams userParams);
        Task<AppUser> GetUserById(int id);
        Task<AppUser> GetUserByUsername(string username);
    }
}