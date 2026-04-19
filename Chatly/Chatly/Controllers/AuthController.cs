using System.Diagnostics;
using Chatly.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Chatly.Controllers.DTOs;
using Chatly.Interfaces;
using Chatly.Services;
using Humanizer;

namespace Chatly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IAuthService _authService;
        private readonly IFileStorageService _fileStorageService;

        public AuthController(
            ILogger<AuthController> logger,
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IAuthService authService,
            IFileStorageService fileStorageService)
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
            _authService = authService;
            _fileStorageService = fileStorageService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO body)
        {
            var user = await _userManager.FindByEmailAsync(body.Email);

            if (user == null)
                return Unauthorized(new
                {
                    message = "User not found"
                });

            var result = await _signInManager.CheckPasswordSignInAsync(user, body.Password, false);
            

            if (!result.Succeeded)
                return Unauthorized(new
                {
                    message = "Wrong password"
                });
            await _signInManager.SignInAsync(user, isPersistent: true);

            return Ok(new
            {
                message = "Login successful",
                user = new
                {
                    user.Id,
                    user.Email,
                    user.AvatarUrl
                }
            });
        }
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            return Ok(new
            {
                message = "Logout successful"
            });
        }
    }
}
