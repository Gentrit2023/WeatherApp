import React from 'react';

const DailyForecastCard = ({ dayData }) => {
  return (
    <div className="daily-forecast-card">
      <h6>{dayData.date}</h6>
      <img src={`http://openweathermap.org/img/wn/${dayData.icon}@2x.png`} alt={dayData.description} />
      <h6>{dayData.temp}°C</h6>
      <p>{dayData.description}</p>
    </div>
  );
};

export default DailyForecastCard;
