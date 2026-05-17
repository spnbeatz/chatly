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
using Chatly.Constants;


namespace Chatly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController: ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly UserManager<User> _userManager;
        private readonly IChatService _chatService;
        private readonly IFileStorageService _fileStorageService;
        private readonly ApplicationDbContext _context;
        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        }

        public UserController(
            ILogger<AuthController> logger,
            UserManager<User> userManager,
            IFileStorageService fileStorageService,
            ApplicationDbContext context,
            IChatService chatService
            )
        {
            _logger = logger;
            _userManager = userManager;
            _fileStorageService = fileStorageService;
            _context = context;
            _chatService = chatService;
        }

        // Dodany endpoint 
        [Authorize(Roles = Roles.Admin)]
        [HttpPut("{userId}/make-admin")]
        public async Task<IActionResult> MakeAdmin(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound();

            await _userManager.AddToRoleAsync(user, Roles.Admin);

            return Ok(new { message = "User promoted to admin" });
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromForm] RegisterDTO body)
        {
            if (body.Password != body.ConfirmPassword)
                return BadRequest("Passwords do not match");

            string? avatarURL = null;

            if (body.Avatar != null)
            {
                avatarURL = await _fileStorageService.SaveImageAsync(
                    body.Avatar,
                    "avatars"
                );
            }

            var user = new User
            {
                Email = body.Email,
                UserName = body.Email,
                AvatarUrl = avatarURL,
            };

            var result = await _userManager.CreateAsync(user, body.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, Roles.User);

            return Ok("User created successfully");
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUser()
        {
            var userId = GetUserId();

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound();

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                user.Id,
                user.Email,
                user.AvatarUrl,
                Roles = roles
            });
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] string query)
        {
            var users = await _userManager.Users
                .Where(u => u.Email != null && u.Email.Contains(query))
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.AvatarUrl
                })
                .Take(20)
                .ToListAsync();
            var userId = GetUserId();

            var chats = await _context.Chat
                .Where(c =>
                    c.Type == ChatType.User &&
                    c.Participants.Any(p => p.UserId == userId)
                )
                .SelectMany(c => c.Participants)
                .Select(p => p.UserId)
                .ToListAsync();

            var result = users.Select(u => new
            {
                u.Id,
                u.Email,
                u.AvatarUrl,
                HasChat = chats.Contains(u.Id)
            });

            return Ok(result);
        }
    }
}
