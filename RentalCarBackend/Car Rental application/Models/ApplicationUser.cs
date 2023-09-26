using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;

public class ApplicationUser : IdentityUser
{
    // Custom properties for the user
    public string? FullName { get; set; } // Full name of the user
    public DateTime DateOfBirth { get; set; } // Date of birth of the user
    public bool IsAdmin { get; set; } // Indicates if the user has admin privileges

    // You can add more custom properties, methods, or relationships here
    [Key]
    public int UserId { get; set; }

    [Required]
    [EmailAddress]
    public new required string Email { get; set; }

    [Required]
    public required string Password { get; set; }

    [Required]
    public required string Role { get; set; } // "RegularUser" or "Admin"

    
}
