import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItem, updateItem } from '../../../utilities/items-api';
import NavBar from '../../../components/Navbar/Navbar';
import styles from './Items.module.scss';

export default function ItemsEditPage({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState({ name: '', details: '', returnPolicy: 'returnable', deadline: 7 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      try {
        const data = await getItem(id);
        setItem({
          name: data.name,
          details: data.details,
          returnPolicy: data.returnPolicy,
          deadline: data.deadline || 7,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  function handleChange(e) {
    setItem({ ...item, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await updateItem(id, item);
      navigate(`/items/${id}`);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.itemsEditPage}>
      <aside>
        <NavBar user={user} setUser={setUser} />
      </aside>
      <main>
        <h2>Edit Item</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input name="name" value={item.name} onChange={handleChange} required />
          </label>
          <label>
            Details:
            <textarea name="details" value={item.details} onChange={handleChange} required />
          </label>
          <label>
            Return Policy:
            <select name="returnPolicy" value={item.returnPolicy} onChange={handleChange}>
              <option value="returnable">Returnable</option>
              <option value="nonreturnable">Non-returnable</option>
            </select>
          </label>
          <label>
            Deadline (days):
            <input type="number" name="deadline" min="1" max="50" value={item.deadline} onChange={handleChange} />
          </label>
          <button type="submit">Save Changes</button>
        </form>
      </main>
    </div>
  );
}
