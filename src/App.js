import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import './app.css';

function App() {
  const [data, setData] = useState({});
  const [dateFocused, setFocus] = useState({});
  const [time, setTime] = useState(6);

  const directionMap = {
    N: '&#8593;',
    NNE: '&#8593; &#8599;',
    NE: '&#8599;',
    E: '&#8594;',
    SSE: '&#8595; &#8600;',
    SE: '&#8600;',
    S: '&#8595;',
    SW: '&#8601;',
    SSW: '&#8595; &#8601;',
    W: '&#8592;',
    WSW: '&#8592; &#8601;',
    NNW: '&#8593; &#8598;',
    NW: '&#8598;',
  };

  const getAlerts = () => {
    if (data.alerts) {
      let id = 0;
      return data.alerts.alert.map((item) => {
        id++;
        if (item.msgtype === 'Alert') {
          return (
            <div className="alert-notif" key={id}>
              {item.event} - {item.areas}: {item.instruction}
            </div>
          );
        }
        return (
          <div key={id} className="alert-none">
            No Alert
          </div>
        );
      });
    }
  };

  const getShortForecast = () => {
    if (data.forecast) {
      return data.forecast.forecastday.map((e) => {
        return (
          <button key={e.date_epoch} onClick={() => setFocus(e)}>
            {new Date(e.hour[0].time).toDateString()}
            <span className="temperatures">H: {e.day.maxtemp_f}&#176;F</span>
            <span className="temperatures">L: {e.day.mintemp_f}&#176;F</span>
          </button>
        );
      });
    }
  };

  const getLongForecast = () => {
    const prefix = 'https:';
    let parser = new DOMParser();
    if (dateFocused.day) {
      const currentSpeed = dateFocused.hour[new Date().getHours()];
      return (
        <>
          <img
            src={prefix.concat('', dateFocused.day.condition.icon)}
            alt={dateFocused.day.condition.text}
          ></img>
          <div className="weather_condition">
            {dateFocused.day.condition.text}
          </div>
          <div>Max Temperature: {dateFocused.day.maxtemp_f}&#176;F</div>
          <div>Min Temperature: {dateFocused.day.mintemp_f}&#176;F</div>
          <div>
            Chance of Rain Today: {dateFocused.day.daily_chance_of_rain}%
          </div>
          <div>
            Wind: {dateFocused.hour[new Date().getHours()].wind_mph}mph &nbsp;
            <span className="wind_direction">
              {
                parser.parseFromString(
                  directionMap[currentSpeed.wind_dir],
                  'text/html'
                ).body.childNodes[0].textContent
              }
            </span>
          </div>
        </>
      );
    } else {
      return <div>Please Select a day to see an extended weather report</div>;
    }
  };

  const checkTime = useCallback(() => {
    console.log('time checked');
    setTime(new Date().getHours());
    document.body.classList =
      time < 6 || time > 18 ? 'night' : time >= 11 ? 'afternoon' : 'morning';
  }, [time]);

  setInterval(checkTime, 3600000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          'http://api.weatherapi.com/v1/forecast.json?key=54159b05af584cbfb53174253221107&q=New York City&days=7&aqi=no&alerts=yes'
        );
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    checkTime();
  }, [checkTime]);

  return (
    <div className="App">
      <div className="alerts">{getAlerts()}</div>
      <div className="condensed-forecast">{getShortForecast()}</div>
      <div className="expanded-forecast">{getLongForecast()}</div>
    </div>
  );
}

export default App;
