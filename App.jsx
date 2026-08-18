import React, { useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([
    {
      id: 1,
      sku: "SKU001",
      name: "Laptop",
      warehouse: "Warehouse A",
      quantity: 25,
    },
    {
      id: 2,
      sku: "SKU002",
      name: "Keyboard",
      warehouse: "Warehouse B",
      quantity: 50,
    },
    {
      id: 3,
      sku: "SKU003",
      name: "Mouse",
      warehouse: "Warehouse A",
      quantity: 80,
    },
    {
      id: 4,
      sku: "SKU004",
      name: "Monitor",
      warehouse: "Warehouse C",
      quantity: 30,
    },
  ]);

  const [orders] = useState([
    { id: 101, customer: "Rahul", region: "North", item: "Laptop", qty: 2 },
    { id: 102, customer: "Priya", region: "West", item: "Mouse", qty: 5 },
    { id: 103, customer: "Aman", region: "South", item: "Monitor", qty: 3 },
  ]);

  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  // Update stock
  const updateStock = (id, change) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const oldQuantity = item.quantity;
          const newQuantity = Math.max(0, oldQuantity + change);

          setHistory((prevHistory) => [
            ...prevHistory,
            {
              id: Date.now(),
              itemId: id,
              itemName: item.name,
              oldQuantity,
              newQuantity,
              change,
            },
          ]);

          return {
            ...item,
            quantity: newQuantity,
          };
        }

        return item;
      })
    );
  };

  // Undo last stock change
  const undoLastChange = () => {
    if (history.length === 0) {
      alert("No stock changes to undo!");
      return;
    }

    const lastChange = history[history.length - 1];

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === lastChange.itemId
          ? { ...item, quantity: lastChange.oldQuantity }
          : item
      )
    );

    setHistory((prevHistory) => prevHistory.slice(0, -1));
  };

  // Search
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.warehouse.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalWarehouses = new Set(
    items.map((item) => item.warehouse)
  ).size;

  return (
    <div className="app">

      <header>
        <h1>SaaS Warehouse Splitter</h1>
        <p>Warehouse & Inventory Management System</p>
      </header>

      {/* Dashboard */}
      <section className="dashboard">
        <div className="card">
          <h3>Total Products</h3>
          <p>{items.length}</p>
        </div>

        <div className="card">
          <h3>Total Stock</h3>
          <p>{totalStock}</p>
        </div>

        <div className="card">
          <h3>Warehouses</h3>
          <p>{totalWarehouses}</p>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
      </section>

      {/* Inventory */}
      <section className="section">
        <h2>Master Item List</h2>

        <input
          type="text"
          placeholder="Search SKU, product or warehouse..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Warehouse</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.warehouse}</td>
                <td>{item.quantity}</td>

                <td>
                  <button
                    onClick={() => updateStock(item.id, -1)}
                  >
                    -
                  </button>

                  <button
                    onClick={() => updateStock(item.id, 1)}
                  >
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Undo */}
      <section className="section">
        <h2>Undo Stock Changes</h2>

        <button
          className="undo"
          onClick={undoLastChange}
        >
          Undo Last Change
        </button>
      </section>

      {/* Stock History */}
      <section className="section">
        <h2>Stock History</h2>

        {history.length === 0 ? (
          <p>No stock changes recorded.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Old Stock</th>
                <th>New Stock</th>
                <th>Change</th>
              </tr>
            </thead>

            <tbody>
              {[...history].reverse().map((record) => (
                <tr key={record.id}>
                  <td>{record.itemName}</td>
                  <td>{record.oldQuantity}</td>
                  <td>{record.newQuantity}</td>
                  <td>
                    {record.change > 0
                      ? `+${record.change}`
                      : record.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Orders */}
      <section className="section">
        <h2>Customer Orders</h2>

        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Region</th>
              <th>Item</th>
              <th>Quantity</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.region}</td>
                <td>{order.item}</td>
                <td>{order.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer>
        <p>© 2026 SaaS Warehouse Splitter</p>
      </footer>

    </div>
  );
}

export default App;