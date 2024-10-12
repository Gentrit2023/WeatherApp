using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Threading.Tasks;

[ApiController]
[Route("api/weather")]
public class WeatherController : ControllerBase
{
    private readonly WeatherService _weatherService;

    public WeatherController(WeatherService weatherService)
    {
        _weatherService = weatherService;
    }

    [HttpGet("{city}")]
    public async Task<IActionResult> GetWeather(string city)
    {
        try
        {
            var weather = await _weatherService.GetWeatherAsync(city);
            return Ok(weather);
        }
        catch (HttpRequestException ex)
        {
            
            return StatusCode(500, $"Gabim gjate marrjes se te dhenave nga API: {ex.Message}");
        }
        catch (JsonException ex)
        {
           
            return BadRequest($"Gabim ne perpunimin e te dhenave: {ex.Message}");
        }
        catch (Exception ex)
        {
            
            return StatusCode(500, $"Nje gabim i papritur ndodhi: {ex.Message}");
        }
    }
}












