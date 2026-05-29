using Chatly.Controllers.DTOs;
using Chatly.Data;
using Chatly.Interfaces;
using Chatly.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Chatly.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IFileStorageService _fileStorageService;

        public UserService(
            UserManager<User> userManager,
            ApplicationDbContext context,
            IFileStorageService fileStorageService)
        {
            _userManager = userManager;
            _context = context;
            _fileStorageService = fileStorageService;
        }

        public async Task CreateUser(RegisterDTO body)
        {
            if (body.Password != body.ConfirmPassword)
                throw new Exception("Passwords do not match");

            string? avatarUrl = null;

            if (body.Avatar != null)
            {
                avatarUrl = await _fileStorageService.SaveImageAsync(body.Avatar, "avatars");
            }

            var user = new User
            {
                Email = body.Email,
                UserName = body.Email,
                AvatarUrl = avatarUrl
            };

            var result = await _userManager.CreateAsync(user, body.Password);

            if (!result.Succeeded)
                throw new Exception("User creation failed");

            await _userManager.AddToRoleAsync(user, body.Role);
        }

        public async Task<object?> GetCurrentUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return null;

            var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();

            return new
            {
                user.Id,
                user.Email,
                user.AvatarUrl,
                user.Status,
                Role = role
            };
        }

        public async Task<List<UserSearchDto>> SearchUsers(string query, string currentUserId)
        {
            var users = await _context.Users
                .Where(u => u.Id != currentUserId &&
                            u.Email!.Contains(query))
                .Select(u => new UserSearchDto
                {
                    Id = u.Id,
                    Email = u.Email!,

                    RequestSent = _context.Request.Any(r =>
                        r.Type == RequestType.FriendRequest &&
                        r.Status == RequestStatus.Pending &&
                        r.FromUserId == currentUserId &&
                        r.ToUserId == u.Id),

                    RequestReceivedId = _context.Request
                        .Where(r =>
                            r.Type == RequestType.FriendRequest &&
                            r.Status == RequestStatus.Pending &&
                            r.FromUserId == u.Id &&
                            r.ToUserId == currentUserId
                        )
                        .Select(r => (int?)r.Id)
                        .FirstOrDefault(),

                    ChatId = _context.Chat
                        .Where(c =>
                            c.Type == ChatType.Direct &&
                            c.Participants.Any(p => p.UserId == currentUserId) &&
                            c.Participants.Any(p => p.UserId == u.Id)
                        )
                        .Select(c => (int?)c.Id)
                        .SingleOrDefault()
                })
                .ToListAsync();

            return users;
        }

        public async Task UpdateUser(string id, UpdateUserDTO dto)
        {
            var user = new User
            {
                Id = id,
                Email = dto.Email,
                PasswordHash = dto.PasswordHash,
                Status = dto.Status
            };

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            if (!string.IsNullOrEmpty(dto.Role))
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, dto.Role);
            }
        }

        public async Task DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
                throw new Exception("User not found");

            await _userManager.DeleteAsync(user);
        }
    }
}
