namespace Chatly.Controllers.DTOs
{
    public class IncomingRequestDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = null!;
        public UserMiniDto FromUser { get; set; } = null!;
        public int? ChatId { get; set; }
        public string? ChatName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}