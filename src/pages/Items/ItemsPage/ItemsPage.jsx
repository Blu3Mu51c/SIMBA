import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/Navbar/Navbar";
import { getAllItems, createItem } from "../../../utilities/items-api";
import styles from "./Items.module.scss";

export default function ItemsPage({ user, setUser }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    picture: "",
    locationId: "", // or you can have campus/building/classroom if you like
    returnPolicy: "returnable",
    deadline: 7,
    quantity: 0,
    threshold: 5,
  });

  const navigate = useNavigate();

  // Fetch items
  useEffect(() => {
    async function fetchItems() {
      try {
        const data = await getAllItems();
        // If user is not admin, filter items to only show those created by admin
        const filtered = user.role === "admin" ? data : data.filter(i => i.createdBy.role === "admin");
        setItems(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [user]);

  if (loading) return <div>Loading items...</div>;

  // Handle form input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // Handle form submission
  async function handleAddItem(e) {
    e.preventDefault();
    try {
      const newItem = await createItem(formData);
      setItems(prev => [newItem, ...prev]);
      setFormData({
        name: "",
        details: "",
        picture: "",
        locationId: "",
        returnPolicy: "returnable",
        deadline: 7,
        quantity: 0,
        threshold: 5,
      });
    } catch (err) {
      console.error("Error adding item:", err);
    }
  }

  return (
    <div className={styles.itemsPage}>
      <aside>
        <NavBar user={user} setUser={setUser} />
      </aside>
      <main>
        <h2>Items</h2>

        {/* Admin form */}
        {user.role === "admin" && (
          <form className={styles.addItemForm} onSubmit={handleAddItem}>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Item Name"
              required
            />
            <input
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Details"
              required
            />
            <input
              name="picture"
              value={formData.picture}
              onChange={handleChange}
              placeholder="Picture URL"
            />
            <input
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              placeholder="Location ID"
              required
            />
            <select
              name="returnPolicy"
              value={formData.returnPolicy}
              onChange={handleChange}
            >
              <option value="returnable">Returnable</option>
              <option value="nonreturnable">Nonreturnable</option>
            </select>
            <input
              type="number"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={1}
              max={50}
              placeholder="Deadline"
            />
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min={0}
              placeholder="Quantity"
            />
            <input
              type="number"
              name="threshold"
              value={formData.threshold}
              onChange={handleChange}
              min={0}
              placeholder="Threshold"
            />
            <button type="submit">Add Item</button>
          </form>
        )}

        {/* Item List */}
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <ul className={styles.itemList}>
            {items.map(item => (
              <li key={item._id} onClick={() => navigate(`/items/${item._id}`)}>
                <strong>{item.name}</strong> - {item.details.substring(0, 50)}...
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
