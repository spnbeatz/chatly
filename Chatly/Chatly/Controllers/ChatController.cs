
using System.Diagnostics;
using Chatly.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Chatly.Interfaces;
using Chatly.Controllers.DTOs;

namespace Chatly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ILogger<ChatController> _logger;
        private readonly IChatService _chatService;
        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        }

        public ChatController(ILogger<ChatController> logger, IChatService chatService)
        {
            _logger = logger;
            _chatService = chatService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetChats()
        {
            var chats = await _chatService.GetChats(GetUserId());
            return Ok(chats);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetChat(int id)
        {
            var chat = await _chatService.GetChat(id);

            if (chat == null)
                return NotFound("Chat not found");

            return Ok(chat);
        }

        [HttpDelete("{chatId}/leave")]
        [Authorize]
        public async Task<IActionResult> LeaveChat(int chatId)
        {
            bool result = await _chatService.LeaveChat(GetUserId(), chatId);

            if (result)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("{chatId}/join")]
        [Authorize]
        public async Task<IActionResult> JoinChat([FromQuery] int chatId)
        {
            var result = await _chatService.AddParticipant(GetUserId(), chatId, "Member");

            if (!result)
            {
                return BadRequest();
            }
            return NoContent();
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateChat(CreateChatDTO dto)
        {
            var chatId = await _chatService.CreateChat(GetUserId(), dto);
            return Ok(chatId);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateChat(int id, UpdateChatDTO dto)
        {
            bool updated = await _chatService.UpdateChat(id, dto);

            if (updated)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }

        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteChat(int id)
        {
            await _chatService.DeleteChat(id);
            return NoContent();
        }

        [HttpGet("{id}/members")]
        [Authorize]
        public async Task<IActionResult> GetMembers(int id)
        {
            var members = await _chatService.GetMembers(id);
            return Ok(members);
        }
        [HttpGet("group")]
        public async Task<IActionResult> FindChats([FromQuery] string name)
        {
            var chats = await _chatService.GetGroupChats(name, GetUserId());
            if (chats == null)
                return NoContent();
            return Ok(chats);
        }

        [HttpDelete("{chatId}/participants/{participantId}")]
        [Authorize]
        public async Task<IActionResult> RemoveParticipant(int chatId, string participantId)
        {
            var result = await _chatService.LeaveChat(participantId, chatId);
            if (result)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPut("{chatId}/participants/{participantId}/promote")]
        [Authorize]
        public async Task<IActionResult> PromoteParticipant(int chatId, string participantId)
        {
            await _chatService.PromoteParticipant(chatId, participantId);
            return Ok();
        }
    }
}