import { useState, useEffect } from "react";

function App() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  // Fetch clients from backend
  const fetchClients = () => {
    fetch("http://localhost:5151/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error("Error fetching clients:", err));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Handle form submit (POST)
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5151/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add client");
        return res.json();
      })
      .then(() => {
        setForm({
          name: "",
          email: "",
          phone: "",
          company: "",
          notes: "",
        });
        fetchClients(); // reload list
      })
      .catch((err) => console.error(err));
  };
  const handleDelete = (id) => {
    fetch(`http://localhost:5151/api/clients/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete client");
        fetchClients(); // recargar lista actualizada
      })
      .catch((err) => console.error(err));
  };
  
  // Update form inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Mini CRM</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
        <input name="company" value={form.company} onChange={handleChange} placeholder="Company" />
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" />
        <button type="submit">Add Client</button>
      </form>

      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            <strong>{client.name}</strong> – {client.email}
            <button
              onClick={() => handleDelete(client.id)}
              style={{ marginLeft: "1rem", backgroundColor: "crimson", color: "white" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;
