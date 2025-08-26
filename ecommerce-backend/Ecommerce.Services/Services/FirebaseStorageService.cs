using Ecommerce.Base.Exceptions;
using Ecommerce.Services.DTOs.FirebaseStorage;
using Ecommerce.Services.Interfaces;
using Google;
using Google.Cloud.Storage.V1;
using Microsoft.Extensions.Configuration;

namespace Ecommerce.Services.Services;

public class FirebaseStorageService : IFirebaseStorageService
{
    private readonly string _bucketName;
    private readonly StorageClient _storageClient;

    public FirebaseStorageService(StorageClient storageClient, IConfiguration config)
    {
        _storageClient = storageClient;
        _bucketName = config["Firebase:StorageBucket"];
    }

    public async Task<UploadResponseModel> UploadFileAsync(Stream fileStream, string fileName,
        string contentType)
    {
        var extension = Path.GetExtension(fileName);
        var nameWithoutExt = Path.GetFileNameWithoutExtension(fileName);

        var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
        var uniqueFileName = $"{nameWithoutExt}_{timestamp}{extension}";

        var objectName = $"uploads/{uniqueFileName}";
        var token = Guid.NewGuid().ToString();
        var storageObject = await _storageClient.UploadObjectAsync(
            _bucketName,
            objectName,
            contentType,
            fileStream,
            new UploadObjectOptions()
        );

        storageObject.Metadata = storageObject.Metadata ?? new Dictionary<string, string>();
        storageObject.Metadata["firebaseStorageDownloadTokens"] = token;

        await _storageClient.UpdateObjectAsync(storageObject);
        var firebaseUrl =
            $"https://firebasestorage.googleapis.com/v0/b/{_bucketName}/o/{Uri.EscapeDataString(objectName)}?alt=media&token={token}";

        var result = new UploadResponseModel
        {
            url = firebaseUrl,
            FileName = uniqueFileName
        };
        return result;
    }

    public async Task<bool> DeleteFileAsync(string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            throw new BadRequestException("File name is required");

        try
        {
            await _storageClient.DeleteObjectAsync(_bucketName, $"uploads/{fileName}");
            return true;
        }
        catch (GoogleApiException ex) when (ex.Error?.Code == 404)
        {
            return false;
        }
    }
}