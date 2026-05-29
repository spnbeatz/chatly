using Chatly.Controllers.DTOs;
using Chatly.Models;

namespace Chatly.Interfaces
{
    public interface IChatService
    {
        Task<ShowChatDTO> GetChat(int id);
        Task<int> CreateChat(string creatorId, CreateChatDTO dto);
        Task<bool> UpdateChat(int id, UpdateChatDTO dto);
        Task DeleteChat(int id);
        Task<bool> LeaveChat(string userId, int chatId);
        Task<bool> IsChatCreated(string participant, string userId);
        Task<bool> AddParticipant(string participantId, int chatId, string role);
        Task<bool> IsUserInChat(string userId, int chatId);
        Task<List<int>> GetUserChats(string userId);
        Task<List<ChatItemDto>> GetChats(string userId);
        Task<List<MemberDTO>> GetMembers(int chatId);
        Task<List<ChatMiniDTO>> GetGroupChats(string name, string userId);
        Task PromoteParticipant(int chatId, string participantId);
    }
}
