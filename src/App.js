import React, { useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import "./App.css";

const fetcher = (url) => axios.get(url).then((res) => res.data);

function App() {
  const [name, setName] = useState("");
  const { data: items } = useSWR("http://localhost:3001/items", fetcher);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post("http://localhost:3001/items", { name });
    mutate("http://localhost:3001/items", [...items, data], false);
    setName("");
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/items/${id}`);
    mutate(
      "http://localhost:3001/items",
      items.filter((item) => item.id !== id),
      false
    );
  };

  if (!items) return <div>Loading...</div>;

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add item"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}{" "}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;