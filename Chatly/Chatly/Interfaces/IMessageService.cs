using Chatly.Controllers.DTOs;
using Chatly.Models;

namespace Chatly.Interfaces
{
    public interface IMessageService
    {
        Task<List<ShowMessageDTO>> GetChatMessages(int chatId);
        Task<Message> SaveMessage(int chatId, string userId, string content);
        Task UpdateMessage(int messageId, UpdateMessageDTO dto);
        Task<ShowMessageDTO> GetMessage(int id);
        Task DeleteMessage(int id);
    }
}
