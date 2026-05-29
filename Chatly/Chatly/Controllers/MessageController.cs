using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Chatly.Interfaces;
using System.Security.Claims;
using Chatly.Controllers.DTOs;

namespace Chatly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController: ControllerBase
    {
        private readonly ILogger<ChatController> _logger;
        private readonly IMessageService _messageService;
        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        }

        public MessageController(ILogger<ChatController> logger, IMessageService messageService)
        {
            _logger = logger;
            _messageService = messageService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMessages([FromQuery] int chatId)
        {
            try
            {
                var messages = await _messageService.GetChatMessages(chatId);
                return Ok(messages);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetMessage(int id)
        {
            try
            {
                var message = await _messageService.GetMessage(id);
                if (message == null)
                {
                    return BadRequest();
                }
                return Ok(message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateMessage(int id, UpdateMessageDTO dto)
        {
            try
            {
                await _messageService.UpdateMessage(id, dto);
                return Ok();
            }
            catch (Exception ex) { 
                return BadRequest(ex.ToString());
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            try
            {
                await _messageService.DeleteMessage(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

    }
}
