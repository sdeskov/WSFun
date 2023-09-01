import './App.css';
import React, { useEffect, useState, useRef } from 'react';

function App() {
  const [value, setInput] = useState('');
  const [responseData, setResponseData] = useState({ capital: [], lower: [] });

  const inputRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket('wss://ws.postman-echo.com/raw');

    ws.onopen = () => { console.log("Connected!") }

    socketRef.current = ws;

    return () => {
      ws.close();
    }
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.onmessage = ({ data }) => {
        console.log(data);
        const responseDataCopy = { ...responseData };
        if (data && data.trim() !== "") {
          if (data.charAt(0) === data.charAt(0).toLowerCase()) {
            responseDataCopy.lower = [...responseDataCopy.lower, data];
          } else {
            responseDataCopy.capital = [...responseDataCopy.capital, data];
          }
        }

        setResponseData(responseDataCopy);
        setInput('');
        if (inputRef.current) {
          inputRef.current.focus();
        }

      };
    }
  }, [responseData]);

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(value);
    }
  };

  return (
    <div>
      <div>
        <h2>WebSocket Messages:</h2>
        <div className="row">
          <div className="column" style={{ backgroundColor: "#67962d" }}>
            <h4>Capital Letter</h4>
            {responseData.capital.map((message, m) => (
              <p key={message + m}>{message}</p>
            ))}
          </div>
          <div className="column" style={{ backgroundColor: "#7eaf3e" }}>
            <h4>Lowercase Letter</h4>
            {responseData.lower.map((message, m) => (
              <p key={message + m}>{message}</p>
            ))}
          </div>
        </div>
      </div>
      <h2>WebSocket Echo Form</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          ref={inputRef}
          autoFocus
          type="text"
          value={value}
          onChange={handleInput}
          placeholder="Write a message to send to the socket"
        />
        <button className="submit-button" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
