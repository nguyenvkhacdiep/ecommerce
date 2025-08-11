namespace Ecommerce.Services.Interfaces;

public interface IFirebaseStorageService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType);
    Task<bool> DeleteFileAsync(string fileName);
}