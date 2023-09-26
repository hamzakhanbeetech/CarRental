using System.ComponentModel.DataAnnotations;

public class User
{
	[Key]
	public int UserId { get; set; }
	public string Email { get; set; }
	public string Password { get; set; }
	public string Role { get; set; } // "RegularUser" or "Admin"

	public User()
	{
		Email = string.Empty; // Initialize with an empty string
		Password = string.Empty; // Initialize with an empty string
		Role = string.Empty; // Initialize with an empty string
	}
}