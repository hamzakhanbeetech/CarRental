using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Car_rental_application.Models;
using static Car_rental_application.Models.DamageReport;

[Route("api/[controller]")]
[ApiController]

public class AdminController : ControllerBase
{
    // Add necessary services and dependencies here
    private readonly ApplicationDbContext _dbContext; // Define and inject your ApplicationDbContext here

    public AdminController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    }
    // Define your admin-related actions (endpoints) here
    [HttpPost("add-car")]
    public IActionResult AddCarToInventory([FromBody] Car model)
    {
        // Validate input
        if (model == null)
        {
            return BadRequest(new { Message = "Invalid car data." });
        }
        var car = new Car
        {
            Maker = model.Maker,
            Model = model.Model,
            RentalPrice = model.RentalPrice,
            AvailabilityStatus = true,
            ImageURL = model.ImageURL,

        };

        _dbContext.Cars.Add(car);
        _dbContext.SaveChanges();

        return Ok(new { Message = "Car added to inventory successfully.", Car = car });
    }

    [HttpPut("update-car/{carId}")]
    public IActionResult UpdateCarDetails(int carId, [FromBody] Car model)
    {
        var car = _dbContext.Cars.FirstOrDefault(c => c.CarId == carId);

        if (car == null)
        {
            return NotFound(new { Message = "Car not found." });
        }
        // Validate input
        if (model == null)
        {
            return BadRequest(new { Message = "Invalid car data." });
        }

        car.Maker = model.Maker;
        car.Model = model.Model;
        car.RentalPrice = model.RentalPrice;

        _dbContext.SaveChanges();

        return Ok(new { Message = "Car details updated successfully.", Car = car });
    }

    [HttpGet("GetCarDetail/{carid}")]
    public IActionResult GetCarDetail(int carid)
    {
        var car=_dbContext.Cars.Where(item => item.CarId == carid).Select(c => new CarViewModel
        {
            CarId = c.CarId,
            AvailabilityStatus = c.AvailabilityStatus,
            ImageURL = c.ImageURL,
            Model = c.Model,
            Maker = c.Maker,
            RentalPrice = c.RentalPrice,
            RequestForReturn = c.RequestForReturn,
            RentalAgreement = _dbContext.RentalAgreements.Where(r => r.CarId == c.CarId && !r.BookingApprove).ToList()
        }).FirstOrDefault();
        return Ok(car);
    }

    [HttpDelete("delete-car/{carId}")]
    public IActionResult DeleteCarFromInventory(int carId)
    {
        var car = _dbContext.Cars.FirstOrDefault(c => c.CarId == carId);

        if (car == null)
        {
            return NotFound(new { Message = "Car not found." });
        }

        _dbContext.Cars.Remove(car);
        _dbContext.SaveChanges();

        return Ok(new { Message = "Car deleted from inventory successfully." });
    }


    [HttpPost("mark-car-returned/{carId}")]
    public IActionResult MarkCarAsReturned(int carId)
    {
        var car = _dbContext.Cars.FirstOrDefault(c => c.CarId == carId);

        if (car == null)
        {
            return NotFound(new { Message = "Car not found." });
        }

        car.AvailabilityStatus = true;
        _dbContext.SaveChanges();

        return Ok(new { Message = "Car marked as returned by admin." });
    }

    [HttpGet("all-rental-agreements")]
    public IActionResult GetAllRentalAgreements()
    {
        var rentalAgreements = _dbContext.RentalAgreements.Select(c => new RentalAgreementViewModel
        {
            BookingApprove = c.BookingApprove,
            BookingRequest = c.BookingRequest,
            CarId = c.CarId,
            EndDate = c.EndDate,
            ImageURL = c.ImageURL,
            Model = c.Model,
            RentalAgreementId = c.RentalAgreementId,
            RentalDuration = c.RentalDuration,
            StartDate = c.StartDate,
            TotalCost = c.TotalCost,
            UserId = c.UserId,
            car = _dbContext.Cars.FirstOrDefault(x => x.CarId == c.CarId) ?? null
        }).ToList();
        return Ok(rentalAgreements);
    }

    [HttpGet("all-rental-agreements/{id}")]
    public IActionResult GetAllRentalAgreements(int id)
    {
        var rentalAgreements = _dbContext.RentalAgreements.Where(item=>item.UserId==id).ToList();
        return Ok(rentalAgreements);
    }


    [HttpPut("update-rental-agreement/{rentalAgreementId}")]
    public IActionResult UpdateRentalAgreementByAdmin(int rentalAgreementId, [FromBody] RentalAgreement model)
    {
        var rentalAgreement = _dbContext.RentalAgreements.FirstOrDefault(ra => ra.RentalAgreementId == rentalAgreementId);

        if (rentalAgreement == null)
        {
            return NotFound(new { Message = "Rental agreement not found." });
        }

        // Validate and update rental agreement details
        if (model.RentalDuration <= 0)
        {
            return BadRequest(new { Message = "Invalid rental duration." });
        }

        rentalAgreement.RentalDuration = model.RentalDuration;
        rentalAgreement.BookingApprove= model.BookingApprove;
        rentalAgreement.BookingRequest = model.BookingRequest;
        var car = _dbContext.Cars.FirstOrDefault(c => c.CarId == rentalAgreement.CarId);
        car.AvailabilityStatus = true;
        rentalAgreement.TotalCost = CalculateTotalCost(rentalAgreement.CarId, model.RentalDuration); // Implement CalculateTotalCost function

        // You can update other fields as needed

        _dbContext.SaveChanges();

        return Ok(new { Message = "Rental agreement updated by admin.", RentalAgreement = rentalAgreement });
    }

    // Define the CalculateTotalCost function
    private decimal CalculateTotalCost(int carId, int rentalDuration)
    {
        // Retrieve the car's rental price from the database based on the carId
        var car = _dbContext.Cars.FirstOrDefault(c => c.CarId == carId);

        if (car == null)
        {
            // Handle the case where the car is not found
            throw new InvalidOperationException("Car not found.");
        }

        // Calculate the total cost by multiplying the rental price by the rental duration
        decimal totalCost = car.RentalPrice * rentalDuration;

        return totalCost;
    }



    [HttpDelete("delete-rental-agreement/{rentalAgreementId}")]
    public IActionResult DeleteRentalAgreementByAdmin(int rentalAgreementId)
    {
        var rentalAgreement = _dbContext.RentalAgreements.FirstOrDefault(ra => ra.RentalAgreementId == rentalAgreementId);

        if (rentalAgreement == null)
        {
            return NotFound(new { Message = "Rental agreement not found." });
        }

        _dbContext.RentalAgreements.Remove(rentalAgreement);
        _dbContext.SaveChanges();

        return Ok(new { Message = "Rental agreement deleted by admin." });
    }


    [HttpGet("all-cars")]
    public IActionResult GetAllCars()
    {
        var cars = _dbContext.Cars.ToList();
        return Ok(cars);
    }

    [HttpPost("AddRentalAgreement")]
    public IActionResult AddRentalAgreement([FromBody]RentalAgreement rental)
    {
        if (rental == null)
        {
            return BadRequest(new { Message = "Invalid car data." });
        }
        var car = _dbContext.Cars.FirstOrDefault(x => x.CarId == rental.CarId);

        if (car == null)
        {
            return BadRequest(new { Message = "Invalid car data." });

        }


        _dbContext.RentalAgreements.Add(rental);
        _dbContext.SaveChanges();

        car.AvailabilityStatus = false; 
        _dbContext.SaveChanges();


        return Ok(new { Message = "Booking is Done", Rental = rental });
    }

    [HttpPost("CheckAvailability")]
    public bool CheckAvailability([FromBody]CheckAvailability rental)
    {
        if (rental == null)
        { return false; }

        var data = _dbContext.RentalAgreements.Where(booking => booking.CarId == rental.carId);

        foreach (var item in data)
        {
            if(item.StartDate<=rental.StartDate && item.EndDate>=rental.EndDate)
                {
                return false;
            }
            return true;
        }
        return true;
    }



    [HttpPost("validate-cars-marked-for-return")]
    public IActionResult ValidateCarsMarkedForReturn()
    {
        // Implement logic to validate cars marked for return by admin
        var carsToValidate = _dbContext.Cars.Where(c => c.RequestForReturn).ToList();

        foreach (var car in carsToValidate)
        {
            // Perform inspections or checks on each car
            // Example: Check for damages, fuel levels, cleanliness, etc.
            // You can add more checks as needed

            // For example, check for damages
            if (CheckForDamages(car))
            {
                // If there are damages, handle it accordingly
                // Example: Update a DamageReport table, deduct from deposit, etc.
                HandleDamages(car);
            }

            // Update the AvailabilityStatus of the car accordingly
            car.AvailabilityStatus = true;

            // Clear the "RequestForReturn" flag
            car.RequestForReturn = false;
        }

        // Save changes to the database
        _dbContext.SaveChanges();

        return Ok(new { Message = "Validation completed by admin." });
    }

    // Example function to check for damages
    // Example function to check for damages
    private bool CheckForDamages(Car car)
    {
        // Implement your logic to check for damages
        // For demonstration purposes, let's assume that there is a DamageReport table
        // in your database where damages are reported for each rental agreement.

        // Check if there are any damage reports associated with this car
        var damageReports = _dbContext.DamageReports
            .Where(report => report.CarId == car.CarId)
            .ToList();

        // If there are any damage reports, consider the car as damaged
        return damageReports.Any();
    }

    // Example function to handle damages
    private void HandleDamages(Car car)
    {
        // Implement your logic to handle damages
        // For demonstration purposes, let's assume you have a DamageReport table
        // where you track details of each damage report, including cost.

        // Fetch all damage reports associated with this car
        var damageReports = _dbContext.DamageReports
            .Where(report => report.CarId == car.CarId)
            .ToList();

        foreach (var damageReport in damageReports)
        {
            // Calculate the total cost for repairing the damages
            decimal repairCost = CalculateRepairCost(damageReport);

            // Deduct the repair cost from the user's deposit (assuming you track deposits)
            // You might need to implement deposit handling logic in your application.
            // Here, we'll assume there is a Deposit table for each user.
            DeductRepairCostFromDeposit(damageReport.UserId, repairCost);

            // Update the status of the damage report to indicate that it has been handled
            damageReport.Status = DamageReportStatus.Handled;

            // Save changes to the database for each damage report
            _dbContext.SaveChanges();
        }
    }

    // Example function to calculate repair cost based on damage report details
    private decimal CalculateRepairCost(DamageReport damageReport)
    {
        // Implement your logic to calculate the repair cost based on the damage report details
        // For example, you can sum up the costs of individual damages listed in the report.

        // For demonstration purposes, we'll assume that the repair cost is provided in the damage report.
        return damageReport.RepairCost;
    }

    // Example function to deduct repair cost from the user's deposit
    private void DeductRepairCostFromDeposit(int userId, decimal repairCost)
    {
        // Implement your logic to deduct the repair cost from the user's deposit
        // For example, you can retrieve the user's deposit from a Deposit table and update it.

        var userDeposit = _dbContext.Deposits.FirstOrDefault(deposit => deposit.UserId == userId);

        if (userDeposit != null)
        {
            userDeposit.Amount -= repairCost;
            // Save changes to the user's deposit in the database
            _dbContext.SaveChanges();
        }
    }



}
