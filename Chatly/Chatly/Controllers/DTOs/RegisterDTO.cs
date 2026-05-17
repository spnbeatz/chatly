using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Chatly.Controllers.DTOs
{
    public class RegisterDTO
    {
        [Required]
        [EmailAddress]
        public string Email {  get; set; }
        [Required]
        [MinLength(8)]
        public string Password { get; set; }
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
        public IFormFile? Avatar { get; set; }

    }
}
