import axios from 'axios';
import { useEffect, useState } from 'react';
import './app.css';

function App() {
  const [data, setData] = useState({});
  const [dateFocused, setFocus] = useState({});

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
            <span className="temperatures">H: {e.day.maxtemp_f}</span>
            <span className="temperatures">L: {e.day.mintemp_f}</span>
          </button>
        );
      });
    }
  };

  const getLongForecast = () => {
    console.log(dateFocused);
    const prefix = 'https:';
    let parser = new DOMParser();
    const currentSpeed = dateFocused.hour[new Date().getHours()];
    if (dateFocused.day) {
      return (
        <>
          <img
            src={prefix.concat('', dateFocused.day.condition.icon)}
            alt={dateFocused.day.condition.text}
          ></img>
          <div>{dateFocused.day.condition.text}</div>
          <div>Max Temperature: {dateFocused.day.maxtemp_f}</div>
          <div>Min Temperature: {dateFocused.day.mintemp_f}</div>
          <div>
            Chance of Rain Today: {dateFocused.day.daily_chance_of_rain}
          </div>
          <div>
            Wind: {dateFocused.hour[new Date().getHours()].wind_mph}
            {
              parser.parseFromString(
                directionMap[currentSpeed.wind_dir],
                'text/html'
              ).body.childNodes[0].textContent
            }
          </div>
        </>
      );
    } else {
      return <div>Please Select a day to see an extended weather report</div>;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <div className="App">
      <div className="alerts">{getAlerts()}</div>
      <div className="condensed-forecast">{getShortForecast()}</div>
      <div className="expanded-forecast">{getLongForecast()}</div>
    </div>
  );
}

export default App;
