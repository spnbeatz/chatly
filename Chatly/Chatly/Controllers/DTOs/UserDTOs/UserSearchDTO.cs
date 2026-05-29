namespace Chatly.Controllers.DTOs
{
    public class UserSearchDto
    {
        public string Id { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? AvatarUrl { get; set; }

        public int? ChatId { get; set; }
        public bool RequestSent { get; set; }
        public int? RequestReceivedId { get; set; }
    }
}
