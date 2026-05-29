using Chatly.Models;

namespace Chatly.Controllers.DTOs
{
    public class CreateRequestDto
    {
        public string? ToUserId { get; set; }
        public RequestType Type { get; set; }
        public int? ChatId { get; set; }
    }
}