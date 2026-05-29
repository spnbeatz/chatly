using Chatly.Models;
using Microsoft.Identity.Client;

namespace Chatly.Controllers.DTOs
{
    public class UpdateUserDTO
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public Status Status { get; set; }
        public string Role {  get; set; }

        public UpdateUserDTO() {}
        public UpdateUserDTO(User user)
        {
            Email = user.Email;
            PasswordHash = user.PasswordHash;
            Status = user.Status;
        }
    }
}
