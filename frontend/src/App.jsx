import { useEffect, useState } from "react";

function App() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5151/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error("Error fetching clients:", err));
  }, []);

  return (
    <div>
      <h1>Mini CRM</h1>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            <strong>{client.name}</strong> – {client.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
