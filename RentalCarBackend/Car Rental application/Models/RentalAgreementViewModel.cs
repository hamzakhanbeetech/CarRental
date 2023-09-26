namespace Car_rental_application.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class RentalAgreementViewModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RentalAgreementId { get; set; }

        [Required]
        [ForeignKey("Car")]
        public int CarId { get; set; }

        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public int RentalDuration { get; set; } // in days

        [Required]
        public Boolean BookingRequest { get; set; }

        [Required]
        public Boolean BookingApprove { get; set; }

        [Required]
        public string ImageURL { get; set; }

        [Required]
        public string Model { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")] // Specify the column type with precision and scale
        public decimal TotalCost { get; set; }

        public Car car { get; set; }
    }

}
