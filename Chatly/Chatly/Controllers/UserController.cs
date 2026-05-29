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
using Chatly.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Data;

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            await _userService.DeleteUser(id);
            return NoContent();
        }
    }
}
