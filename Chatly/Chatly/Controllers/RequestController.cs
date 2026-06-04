using Chatly.Controllers.DTOs;
using Chatly.Interfaces;
using Chatly.Models;
using Chatly.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Chatly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RequestController : ControllerBase
    {
        private readonly IRequestService _requestService;
        private readonly INotificationService _notificationService;

        public RequestController(IRequestService requestService, INotificationService notificationService)
        {
            _requestService = requestService;
            _notificationService = notificationService;
        }

        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRequestDto dto)
        {
            var userId = GetUserId();

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            await _requestService.CreateAsync(userId, dto);

            return Ok();
        }

        [HttpGet("incoming")]
        public async Task<IActionResult> GetIncoming()
        {
            var userId = GetUserId();

            var result = await _requestService.GetIncomingAsync(userId);

            return Ok(result);
        }

        [HttpGet("incoming/chat")]
        public async Task<IActionResult> GetChatsIncoming([FromQuery] int chatId)
        {
            var userId = GetUserId();

            var result = await _requestService.GetChatIncomingAsync(chatId);

            return Ok(result);
        }

        [HttpGet("outgoing")]
        public async Task<IActionResult> GetOutgoing()
        {
            var userId = GetUserId();

            var result = await _requestService.GetOutgoingAsync(userId);

            return Ok(result);
        }

        [HttpGet("check")]
        public async Task<IActionResult> CheckRequested([FromQuery] int chatId)
        {
            try
            {
                var result = await _requestService.CheckRequested(chatId, GetUserId());

                if (result == null) return NoContent();

                return Ok(result);

            } catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("{id}/accept")]
        [Authorize]
        public async Task<IActionResult> Accept(int id)
        {
            var userId = GetUserId();

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var chatId = await _requestService.AcceptAsync(id, userId);

            return Ok(new { success = true, chatId });
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> Reject(int id)
        {
            var userId = GetUserId();

            var ok = await _requestService.RejectAsync(id, userId);

            if (!ok)
                return NotFound();

            return Ok(new { message = "Request rejected" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();

            var ok = await _requestService.DeleteAsync(id, userId);

            if (!ok)
                return NotFound();

            return Ok(new { message = "Request deleted" });
        }
    }
}