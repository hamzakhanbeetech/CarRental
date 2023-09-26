using IdentityServer4.Models;
using System.ComponentModel.DataAnnotations;

namespace Car_rental_application.Models
{
    public class Signin
    {
        [Required(ErrorMessage = "Please Enter Your UserName")]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }


    }
}
