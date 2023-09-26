using Car_rental_application.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;
    public AuthController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    [HttpGet]
    [Route("IsUserEmailExist/{email}")]
    public async Task<IActionResult> IsUserEmailExist(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user != null)
        {
            return Ok("User Exist");
        }
        else
        {
            return BadRequest("User Not Exist");
        }
    }

    [HttpGet]
    [Route("IsUserExit/{username}")]
    public async Task<IActionResult> IsUserExit(string username)
    {
        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
        {
            return BadRequest("User Not Exist");
        }
        return Ok("User Exist");
    }

    [HttpPost]
    [Route("Register")]
    public async Task<IActionResult> Regiser(RegisterViewModel signUp)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = new IdentityUser
        {
            UserName = signUp.Email,
            Email = signUp.Email
            

        };

        var result = await _userManager.CreateAsync(user, signUp.Password);

        if (result.Succeeded)
        {
            var userFromDb = await _userManager.FindByNameAsync(user.UserName);
            var userEmail = user.Email.Split('@')[1];
            var checkAdmin = false;
            if (userEmail == "Grocery.com")
                checkAdmin = true;
            if (checkAdmin)
            {
                await _roleManager.CreateAsync(new IdentityRole("Admin"));
                await _userManager.AddToRoleAsync(user, "Admin");
            }
            else
            {
                await _roleManager.CreateAsync(new IdentityRole("User"));
                await _userManager.AddToRoleAsync(user, "User");


            }
            await _signInManager.SignInAsync(user, isPersistent: false);

            return Ok(result);

        }
        else
        {
            return BadRequest(ModelState);
        }
    }
    private JwtSecurityToken GetToken(List<Claim> authClaims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            expires: DateTime.Now.AddHours(3),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

        return token;
    }

    [HttpPost]
    [Route("Login")]
    public async Task<ActionResult> Login(Signin model)
    {
        if (ModelState.IsValid)
        {   /*
                var LoginQuery = await _signInManager.PasswordSignInAsync(signin.Username, signin.Password,true,false);
                if(LoginQuery.Succeeded)
                {

                    return Ok("Login Accepted");
                }
                else
                {
                    return BadRequest("login Failed");
                }
            
                 */

            var user = await _userManager.FindByNameAsync(model.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };
                var LoginUserRole = "User";
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                    LoginUserRole = userRole;
                }

                var token = GetToken(authClaims);

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    role = LoginUserRole
                }); ;
            }
            else
                return Unauthorized();

        }


        return BadRequest("login Failed");



    }

}
