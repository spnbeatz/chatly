using Chatly.Models;

namespace Chatly.Controllers.DTOs
{
    public class ShowChatDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<MemberDTO> Members { get; set; } = new();
        public ChatType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ChatPrivacy ChatPrivacy { get; set; }

        public ShowChatDTO() { }

        public ShowChatDTO(Chat chat)
        {
            Id = chat.Id;
            Name = chat.Name;
            Type = chat.Type;
            CreatedAt = chat.CreatedAt;
            UpdatedAt = chat.UpdatedAt;
            ChatPrivacy = chat.ChatPrivacy;
        }
    }
}
