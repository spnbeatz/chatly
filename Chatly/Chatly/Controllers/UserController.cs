using System.Diagnostics;
using Chatly.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Chatly.Controllers.DTOs;
using Chatly.Interfaces;
using Chatly.Services;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


namespace Chatly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        private string GetUserId()
            => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        [HttpPost("create")]
        public async Task<IActionResult> CreateUser(RegisterDTO dto)
        {
            try
            {
                await _userService.CreateUser(dto);
                return Ok("User created successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUser()
        {
            var result = await _userService.GetCurrentUser(GetUserId());

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("list")]
        [Authorize]
        public async Task<IActionResult> GetUsers([FromQuery] string? query)
        {
            var users = await _userService.GetUsers(query);
            return Ok(users);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers(string query)
        {
            var result = await _userService.SearchUsers(query, GetUserId());
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, UpdateUserDTO dto)
        {
            await _userService.UpdateUser(id, dto);
            return NoContent();
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ChangeStatus(string id, [FromBody] string status)
        {
            Console.WriteLine($"Changing status for user {id} to {status}");
            Status parsed = Enum.Parse<Status>(status);
            await _userService.ChangeStatus(id, parsed);
            return NoContent();
        }


        [HttpPut("{id}/email")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ChangeEmail(string id, [FromBody] string email)
        {
            await _userService.ChangeEmail(id, email);
            return Ok();
        }
    }
}
