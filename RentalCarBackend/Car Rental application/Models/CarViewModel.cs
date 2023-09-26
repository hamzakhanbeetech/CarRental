using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Car_rental_application.Models
{
    public class CarViewModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CarId { get; set; }

        [Required]
        public string Maker { get; set; }

        [Required]
        public string Model { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")] // Specify the column type with precision and scale
        public decimal RentalPrice { get; set; }
        [Required]
        public string ImageURL { get; set; }

        [Required]
        public bool AvailabilityStatus { get; set; }
        public bool RequestForReturn { get; set; }

        public List<RentalAgreement> RentalAgreement { get; set; }
    }
}
