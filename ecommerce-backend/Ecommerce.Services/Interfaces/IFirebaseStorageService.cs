using Ecommerce.Services.DTOs.FirebaseStorage;

namespace Ecommerce.Services.Interfaces;

public interface IFirebaseStorageService
{
    Task<UploadResponseModel> UploadFileAsync(Stream fileStream, string fileName,
        string contentType);

    Task<bool> DeleteFileAsync(string fileName);
}