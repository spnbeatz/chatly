using Chatly.Controllers.DTOs;
using Chatly.Controllers.DTOs.UserDTOs;

namespace Chatly.Interfaces
{
    public interface IUserService
    {
        Task CreateUser(RegisterDTO dto);
        Task<object?> GetCurrentUser(string userId);
        Task<List<UserSearchDto>> SearchUsers(string query, string currentUserId);
        Task UpdateUser(string id, UpdateUserDTO dto);
        Task ChangeStatus(string id, Status status);
        Task<UserDTO[]> GetUsers(string? query);
        Task ChangeEmail(string id, string email);
    }
}
