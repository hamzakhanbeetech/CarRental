namespace Car_rental_application.Models
{
    public class CheckAvailability
    {
        public int carId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
