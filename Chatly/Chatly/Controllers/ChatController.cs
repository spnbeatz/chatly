
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

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateChat([FromBody] List<string> participants)
        {
            try
            {
                string userId = GetUserId();
                int participantsCount = participants.Count;
                bool isCreated = participantsCount == 1 ? await _chatService.IsChatCreated(participants[0], userId) : false;

                if (isCreated)
                {
                    return Ok(new { message = "Chat already exists" });
                }
                int chatId = await _chatService.CreateChat(participantsCount);

                await _chatService.AddParticipant(userId, chatId);
                foreach (var participant in participants)
                {
                    await _chatService.AddParticipant(participant, chatId);
                }
                await _chatService.AddTopic(userId, chatId);
                return Ok(chatId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

        }

        [HttpGet("list")]
        [Authorize]
        public async Task<IActionResult> GetList()
        {
            try
            {
                var chats = await _chatService.GetChats(GetUserId());

                return Ok(chats);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpGet("topics")]
        [Authorize]
        public async Task<IActionResult> GetChatTopics([FromQuery] string chatId)
        {
            try
            {
                string userId = GetUserId();
                List<TopicDTO> chatTopics = await _chatService.GetChatTopics(int.Parse(chatId));

                if (chatTopics == null)
                {
                    await _chatService.AddTopic(userId, int.Parse(chatId));
                    chatTopics = await _chatService.GetChatTopics(int.Parse(chatId));
                }

                return Ok(chatTopics);
                
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

        }
        [HttpGet("messages")]
        [Authorize]
        public async Task<IActionResult> GetTopicMessages([FromQuery] string topicId)
        {
            try
            {
                var messages = await _chatService.GetTopicMessages(int.Parse(topicId));
                return Ok(messages);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }
    }
}