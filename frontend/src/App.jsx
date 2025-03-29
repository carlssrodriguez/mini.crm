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
  const [editingId, setEditingId] = useState(null);

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

  // Handle form submit (POST or PUT)
  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5151/api/clients/${editingId}`
      : "http://localhost:5151/api/clients";

    const payload = editingId
      ? { ...form, id: editingId }
      : form;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit client");
        return res.status === 204 ? {} : res.json();
      })
      .then(() => {
        setForm({ name: "", email: "", phone: "", company: "", notes: "" });
        setEditingId(null);
        fetchClients();
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5151/api/clients/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete client");
        fetchClients();
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (client) => {
    setForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      notes: client.notes,
    });
    setEditingId(client.id);
  };

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
        <button type="submit">{editingId ? "Update Client" : "Add Client"}</button>
      </form>

      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            <strong>{client.name}</strong> – {client.email}
            <button
              onClick={() => handleEdit(client)}
              style={{ marginLeft: "1rem", backgroundColor: "orange", color: "white" }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(client.id)}
              style={{ marginLeft: "0.5rem", backgroundColor: "crimson", color: "white" }}
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
