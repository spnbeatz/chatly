using Microsoft.AspNetCore.Identity;

namespace Chatly.Models
{
    public class User: IdentityUser
    {
        public List<Participant> ChatUsers { get; set; } = new();
        public List<Message> Messages { get; set; } = new();
        public string? AvatarUrl { get; set; }
        public Status Status { get; set; } = Status.Active;
        public Role Role { get; set; } = Role.User;
    }
}

public enum Status
{
    Active,
    Inactive,
    Blocked
}

public enum Role
{
    User,
    Admin
}