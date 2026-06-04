using System.Diagnostics;
using Chatly.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Chatly.Controllers.DTOs;

namespace Chatly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AuthController(
            ILogger<AuthController> logger,
            UserManager<User> userManager,
            SignInManager<User> signInManager)
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO body)
        {
            var user = await _userManager.FindByEmailAsync(body.Email);

            if (user == null)
            {
                Console.WriteLine("AuthController - login failed - user not found");
                return Unauthorized(new
                {
                    message = "User not found"
                });
            }


            if (user.Status == Status.Blocked)
            {
                Console.WriteLine("AuthController - login failed - user has been blocked");
                return Unauthorized(new
                {
                    message = "User has been blocked"
                });
            }

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
