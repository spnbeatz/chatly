namespace Chatly.Interfaces
{
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(IFormFile file, string folder);
        Task<string> SaveImageAsync(IFormFile file, string folder);
    }
}