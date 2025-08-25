import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getItem } from '../../../utilities/items-api';
import NavBar from '../../../components/Navbar/Navbar';
import styles from './Items.module.scss';

export default function ItemsShowPage({ user, setUser }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      try {
        const data = await getItem(id);
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  if (loading) return <div>Loading item...</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className={styles.itemsShowPage}>
      <aside>
        <NavBar user={user} setUser={setUser} />
      </aside>
      <main>
        <h2>{item.name}</h2>
        <p>{item.details}</p>
        <p><strong>Return Policy:</strong> {item.policySummary}</p>
        <p><strong>Created By:</strong> {item.createdBy?.name} ({item.createdBy?.email})</p>
        <p><strong>Location:</strong> {item.location?.campus}, {item.location?.building}, {item.location?.classroom}</p>
        {item.partNumbers?.length > 0 && (
          <div>
            <h4>Parts / Datasheets</h4>
            <ul>
              {item.datasheetLinks.map(p => (
                <li key={p.url}><a href={p.url} target="_blank">{p.title}</a></li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
