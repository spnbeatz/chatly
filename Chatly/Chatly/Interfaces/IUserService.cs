using Chatly.Controllers.DTOs;

namespace Chatly.Interfaces
{
    public interface IUserService
    {
        Task CreateUser(RegisterDTO dto);
        Task<object?> GetCurrentUser(string userId);
        Task<List<UserSearchDto>> SearchUsers(string query, string currentUserId);
        Task UpdateUser(string id, UpdateUserDTO dto);
        Task DeleteUser(string id);
    }
}
