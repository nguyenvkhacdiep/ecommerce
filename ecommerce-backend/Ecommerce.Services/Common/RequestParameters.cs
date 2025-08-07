namespace Ecommerce.Services.Common;

public class RequestParameters
{
    private const int MaxPageSize = 100;
    private int _pageSize = 10;

    public int PageNumber { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value is > MaxPageSize ? MaxPageSize : value;
    }

    public string? OrderBy { get; set; }

    public string? SearchKey { get; set; }
}