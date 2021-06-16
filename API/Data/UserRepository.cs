using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Helpers;
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

       

        async Task<PagedList<AppUser>> IUserRepository.GetAllUsersAsync(UserParams userParams)
        {
            var query = context.Users.Include(p=>p.Photos).AsQueryable();
            query = query.Where(x=>x.UserName != userParams.CurrentUser);
            query = query.Where(x=>x.Gender == userParams.Gender);
            // query = query.Where(m=>m.GetAge() >= userParams.MinAge);
            // query = query.Where(m=>m.GetAge() <= userParams.MaxAge);

            var minDob = DateTime.Today.AddYears(-userParams.MaxAge -1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge);
            query = query.Where(u=>u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            if(userParams.OrderBy == "created"){
                query = query.OrderByDescending(m=>m.Created);
            }
            else {
                query = query.OrderByDescending(m=>m.LastActive);
            }
            return await PagedList<AppUser>.CreateAsync(query.AsNoTracking(),userParams.PageNumber,userParams.PageSize);

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