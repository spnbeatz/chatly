using Chatly.Models;

namespace Chatly.Controllers.DTOs
{
    public class OutgoingRequestDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = null!;
        public UserMiniDto ToUser { get; set; } = null!;
        public RequestStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public ChatMiniDTO? Chat { get; set; } = null!;
    }
}