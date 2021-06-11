using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;
using API.interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext context;
        public UserRepository(DataContext context)
        {
            this.context = context;
        }

        async Task<IEnumerable<AppUser>> IUserRepository.GetAllUsersAsync()
        {
            return await context.Users.Include(p=>p.Photos).ToListAsync();
        }

        async Task<AppUser> IUserRepository.GetUserById(int id)
        {
            return await context.Users.FindAsync(id);
        }

        async Task<AppUser> IUserRepository.GetUserByUsername(string username)
        {
            return await context.Users.Include(p=>p.Photos).
            FirstOrDefaultAsync(x=>x.UserName == username);
        }

        async Task<bool> IUserRepository.SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }

        void IUserRepository.Update(AppUser user)
        {
             context.Entry(user).State = EntityState.Modified;
        }
    }
}