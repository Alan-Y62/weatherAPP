import axios from 'axios';
import { useEffect, useState } from 'react';
import './app.css';

function App() {
  const [data, setData] = useState({});

  const getAlerts = () => {
    console.log(data);
    if (data.alerts) {
      let x = 0;
      return data.alerts.alert.map((item) => {
        x++;
        if (item.msgtype === 'Alert') {
          return (
            <div className="alert-notif" key={x}>
              {item.event} - {item.areas}: {item.instruction}
            </div>
          );
        }
        return (
          <div key={x} className="alert-none">
            No Alert
          </div>
        );
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          'http://api.weatherapi.com/v1/forecast.json?key=54159b05af584cbfb53174253221107&q=New York City&days=7&aqi=no&alerts=yes'
        );
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="App">
      <div className="alerts">{getAlerts()}</div>
      <div className="condensed-forecast">
        <button>Day 1</button>
        <button>Day 2</button>
        <button>Day 3</button>
      </div>
    </div>
  );
}

export default App;
