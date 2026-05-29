namespace Chatly.Controllers.DTOs
{
    public class RequestDto
    {
        public int Id { get; set; }

        public string Type { get; set; } = null!;
        public string Status { get; set; } = null!;

        public UserMiniDto FromUser { get; set; } = null!;
        public UserMiniDto ToUser { get; set; } = null!;

        public int? ChatId { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? RespondedAt { get; set; }
    }
}