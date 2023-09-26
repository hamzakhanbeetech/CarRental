using Microsoft.AspNetCore.Identity;

public class ApplicationRole : IdentityRole
{
    // Add additional custom properties for roles as needed
    public string? Description { get; set; } // A description or purpose of the role
    public bool IsDefault { get; set; } // Indicates if this is a default role (e.g., "RegularUser" or "Admin")

    // You can add more properties, methods, or relationships here
}
