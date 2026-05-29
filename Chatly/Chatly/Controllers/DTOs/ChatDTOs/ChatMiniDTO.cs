using Chatly.Models;

namespace Chatly.Controllers.DTOs
{
    public class ChatMiniDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ParticipantsCount { get; set; }
        public ChatPrivacy ChatPrivacy { get; set; }

        public ChatMiniDTO() { }
        public ChatMiniDTO(Chat chat)
        {
            Id = chat.Id;
            Name = chat.Name;
            ChatPrivacy = chat.ChatPrivacy;

        }
    }
}
