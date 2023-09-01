import './App.css';
import React, { useEffect, useState, useRef } from 'react';

function App() {
  const [value, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [responseData, setResponseData] = useState({ capital: [], lower: [] });
  const inputRef = useRef(null);


  useEffect(() => {
    const ws = new WebSocket('wss://ws.postman-echo.com/raw');

    ws.addEventListener("open", () => {
      console.log("Connected!");
    })

    ws.addEventListener('message', ({ data }) => {
      console.log(data);
      setResponseData((prevData) => {
        const responseDataCopy = { ...prevData };
        if (data && data.trim() !== "") {
          if (data.charAt(0) === data.charAt(0).toLowerCase()) {
            responseDataCopy.lower = [...responseDataCopy.lower, data];
          } else {
            responseDataCopy.capital = [...responseDataCopy.capital, data];
          }
        }
        return responseDataCopy;
      });
      setInput('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    });

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);


  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(value);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(value);
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
