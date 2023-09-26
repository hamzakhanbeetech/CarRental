namespace Car_rental_application.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class DamageReport
    {
        public int DamageReportId { get; set; }

        [Required]
        public int CarId { get; set; } // Reference to the damaged car

        [Required]
        public int UserId { get; set; } // Reference to the user reporting the damage

        [Required]
        public DateTime ReportDate { get; set; } // Date of the damage report

        [Required]
        public string? Description { get; set; } // Description of the damage

        [Required]
        public decimal RepairCost { get; set; } // Cost of repair for the damage
        public DamageReportStatus Status { get; set; }

        public enum DamageReportStatus
        {
            Pending, // Add your desired enum values, e.g., Pending, Handled, etc.
            Handled,
            // Add more enum values as needed
        }

        // Add any other properties or relationships needed for your 'DamageReport' entity
    }

}
