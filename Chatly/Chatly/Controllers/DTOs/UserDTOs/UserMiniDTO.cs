using System.ComponentModel.DataAnnotations;

namespace Chatly.Controllers.DTOs
{
    public class UserMiniDto
    {
        public string Id { get; set; } = null!;
        [EmailAddress]
        public string Email { get; set; } = null!;
        public string? AvatarUrl { get; set; }
    }
}