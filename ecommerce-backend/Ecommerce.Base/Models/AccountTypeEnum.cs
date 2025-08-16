using System.ComponentModel;

namespace Ecommerce.Base.Models;

public enum RoleEnum
{
    [Description("Super Admin")] SuperAdmin = 1,

    [Description("Admin")] Admin = 2,

    [Description("Shop")] Shop = 3,

    [Description("Customer")] Customer = 4
}