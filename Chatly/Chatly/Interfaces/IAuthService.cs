namespace Chatly.Interfaces
{
    public interface IAuthService
{
    Task<string> GenerateToken(string userId, string email);
}
}

