using Chatly.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Chatly.Services
{
    public class AuthService : IAuthService
    {
        private readonly string _jwtKey;
        public AuthService(IConfiguration configuration)
        {
            _jwtKey = configuration["Jwt:Key"];
        }
        public Task<string> GenerateToken(string userId, string email)
        {
            var claims = new[]
{
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Email, email)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return Task.FromResult(new JwtSecurityTokenHandler().WriteToken(token));
        }
    }
}