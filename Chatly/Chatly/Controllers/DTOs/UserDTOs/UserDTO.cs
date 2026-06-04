using Chatly.Models;

using Microsoft.AspNetCore.Identity;

namespace Chatly.Controllers.DTOs.UserDTOs
{
    public class UserDTO
    {
        public string Id { get; set; }
        public string? Email { get; set; }
        public string Role { get; set; }
        public Status Status { get; set; }


        public UserDTO() { }
        public UserDTO(User user, string role)
        {
            Id = user.Id;
            Email = user.Email;
            Role = role;
            Status = user.Status;
        }
    }
}
