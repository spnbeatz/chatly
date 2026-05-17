using Chatly.Controllers.DTOs;
using Chatly.Models;

namespace Chatly.Interfaces
{
    public interface IChatService
    {
        Task<int> CreateChat(int participantsCount);
        Task<bool> IsChatCreated(string participant, string userId);
        Task<bool> AddParticipant(string participantId, int chatId);
        Task<bool> AddTopic(string userId, int chatId);
        Task<bool> IsUserInChat(string userId, int chatId);
        Task<Message> SaveMessage(int topicId, string userId, string content);
        Task<int> GetChatIdFromTopic(int topicId);
        Task<List<int>> GetUserChats(string userId);
        Task<List<ChatListDto>> GetChats(string userId);
        Task<List<TopicDTO>> GetChatTopics(int chatId);
        Task<List<Message>> GetTopicMessages(int topicId);
        Task<Reaction> ToggleReaction(int messageId, string userId, ReactionType type);
        Task<int> GetChatIdFromMessage(int messageId);
    }
}
