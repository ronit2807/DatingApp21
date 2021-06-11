using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;

namespace API.interfaces
{
    public interface IUserRepository
    {
         void Update(AppUser user);

        public Task<bool> SaveAllAsync();
        Task<IEnumerable<AppUser>> GetAllUsersAsync();
        Task<AppUser> GetUserById(int id);
        Task<AppUser> GetUserByUsername(string username);
    }
}