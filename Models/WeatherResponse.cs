using System.Text.Json.Serialization;
using System.Text.Json;
using System.Collections.Generic;

public class WeatherResponse
{
    public string Cod { get; set; }
    
       public JsonElement Message { get; set; }
    
    public int Cnt { get; set; }
    public List<WeatherListItem> List { get; set; }
}

public class WeatherListItem
{
    public long Dt { get; set; }
    public MainInfo Main { get; set; }
    public List<WeatherInfo> Weather { get; set; }
    public CloudsInfo Clouds { get; set; }
    public WindInfo Wind { get; set; }
    public int Visibility { get; set; }
    public int Pop { get; set; }
    public RainInfo Rain { get; set; }
    public SysInfo Sys { get; set; }
    public string DtTxt { get; set; }
}

public class MainInfo
{
    public float Temp { get; set; }
    public float FeelsLike { get; set; }
    public float TempMin { get; set; }
    public float TempMax { get; set; }
    public int Pressure { get; set; }
    public int Humidity { get; set; }
}

public class WeatherInfo
{
    public int Id { get; set; }
    public string Main { get; set; }
    public string Description { get; set; }
    public string Icon { get; set; }
}

public class CloudsInfo
{
    public int All { get; set; }
}

public class WindInfo
{
    public float Speed { get; set; }
    public int Deg { get; set; }
    public float Gust { get; set; }
}

public class RainInfo
{
    [JsonPropertyName("3h")]
    public float? ThreeHour { get; set; }
}

public class SysInfo
{
    public string Pod { get; set; }
}
