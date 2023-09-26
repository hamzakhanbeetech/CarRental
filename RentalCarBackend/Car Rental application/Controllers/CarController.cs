using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class CarController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager; // Add this

    public CarController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager; // Initialize _userManager
    }

    // Define your car-related actions (endpoints) here

    [HttpGet("cars")]
    public IActionResult GetAvailableCars(string maker, string model, decimal? rentalPrice)
    {
        var query = _dbContext.Cars.AsQueryable();

        if (!string.IsNullOrEmpty(maker))
        {
            query = query.Where(c => c.Maker.Contains(maker));
        }

        if (!string.IsNullOrEmpty(model))
        {
            query = query.Where(c => c.Model.Contains(model));
        }

        if (rentalPrice.HasValue)
        {
            query = query.Where(c => c.RentalPrice <= rentalPrice);
        }

        var availableCars = query.Where(c => c.AvailabilityStatus).ToList();

        return Ok(availableCars);
    }

    [HttpPost("rent")]
    [Authorize(Roles = "RegularUser")]
    public async Task<IActionResult> RentCar(int carId, int rentalDuration)
    {
        var user = await _userManager.GetUserAsync(User); // Use async/await
        var car = _dbContext.Cars.FirstOrDefault(c => c.CarId == carId);

        if (car == null || !car.AvailabilityStatus)
        {
            return BadRequest(new { Message = "Car not available for rent." });
        }

        var totalCost = car.RentalPrice * rentalDuration;

        var rentalAgreement = new RentalAgreement
        {
            CarId = carId,
            UserId = user.UserId,
            RentalDuration = rentalDuration,
            TotalCost = totalCost
        };

        _dbContext.RentalAgreements.Add(rentalAgreement);
        car.AvailabilityStatus = false;
        await _dbContext.SaveChangesAsync(); // Use async/await

        return Ok(new { Message = "Car rented successfully.", RentalAgreement = rentalAgreement });
    }

    [HttpGet("rental-agreements")]
    [Authorize(Roles = "RegularUser")]
    public async Task<IActionResult> GetRentalAgreements()
    {
        var user = await _userManager.GetUserAsync(User); // Use async/await
        var rentalAgreements = _dbContext.RentalAgreements
            .Where(ra => ra.UserId == user.UserId)
            .ToList();

        return Ok(rentalAgreements);
    }
}
