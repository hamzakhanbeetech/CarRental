using Car_rental_application.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext :IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions options) : base(options)
    {
    }

    // Define your DbSet properties for other entities here
    public new DbSet<User> Users { get; set; }
    public DbSet<Car> Cars { get; set; }
    public DbSet<RentalAgreement> RentalAgreements { get; set; }
    public DbSet<DamageReport> DamageReports { get; set; }
    public DbSet<Deposit> Deposits { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<DamageReport>()
            .Property(damageReport => damageReport.RepairCost)
            .HasColumnType("decimal(10, 2)"); // Specify the SQL Server column type for RepairCost

        modelBuilder.Entity<Deposit>()
            .Property(deposit => deposit.Amount)
            .HasColumnType("decimal(10, 2)"); // Specify the SQL Server column type for Amount

        // Other entity configurations...

    }


}
