﻿using Ecommerce.Services.DTOs.FirebaseStorage;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Ecommerce.API.Extensions;

public class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var fileParams = context.ApiDescription.ParameterDescriptions
            .Where(p => p.ModelMetadata?.ModelType == typeof(IFormFile) ||
                        p.ModelMetadata?.ModelType == typeof(FileUploadRequest))
            .ToList();

        if (fileParams.Any())
            operation.RequestBody = new OpenApiRequestBody
            {
                Content =
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties =
                            {
                                ["file"] = new OpenApiSchema
                                {
                                    Type = "string",
                                    Format = "binary"
                                }
                            }
                        }
                    }
                }
            };
    }
}