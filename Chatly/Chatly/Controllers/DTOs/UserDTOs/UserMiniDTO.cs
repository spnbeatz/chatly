namespace Chatly.Controllers.DTOs
{
    public class UserMiniDto
    {
        public string Id { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? AvatarUrl { get; set; }
    }
}