import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [board, setBoard] = useState([]);
  const [date, setDate] = useState(Date.now());
  let createEvent = (e) => {
    const options = {
      hour: 'numeric', minute: 'numeric'
    };
    const idData = e.id.split('-');
    const track = idData.length === 9 ? idData[7] : 'tbd';
    const train = idData[5];
    const station = idData[6];
    const d = new Date(e.attributes.departure_time);
    const departure = new Intl.DateTimeFormat('en-US', options).format(d);
    const status = e.attributes.status;
    const destination = e.relationships.route.data.id.split('-')[1];
    return {
      station,
      departure,
      track,
      train,
      status,
      destination,
    };
  }

  useEffect(() => {
    const interval = setInterval(() => setDate(Date.now()), 18000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    fetch(
      `https://cors-anywhere.herokuapp.com/https://api-v3.mbta.com/predictions?sort=departure_time&filter[route_type]=2&filter[stop]=place-north,place-sstat`,
      {
        method: "GET",
        headers: new Headers({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        setBoard(response.data.filter(e => e.attributes.departure_time).map(e => createEvent(e)));
      })
      .catch(error => console.log(error));
  }, [date]);


  return (
    <div className="App">
      <table className="Board">
        <thead>
          <tr>
            <th>STATION</th>
            <th>DESTINATION</th>
            <th>TIME</th>
            <th>TRAIN#</th>
            <th>TRACK#</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {
            board.map((x, k) => (
              <tr key={k}>
                <td>{x.station}</td>
                <td>{x.destination}</td>
                <td>{x.departure}</td>
                <td>{x.train}</td>
                <td>{x.track}</td>
                <td>{x.status}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};