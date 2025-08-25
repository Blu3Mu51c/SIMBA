import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './AppRouter.module.scss';
import { getUser } from '../utilities/users-service';

// Auth Pages
import AdminLoginPage from '../pages/Auth/AdminLoginPage/AdminLoginPage';
import AdminSignupPage from '../pages/Auth/AdminSignupPage/AdminSignupPage';
import UserAuthPage from '../pages/Auth/UserAuthPage/UserAuthPage';

// User Pages
import AnalyticsPage from '../pages/Analytics/AnalyticsPage/AnalyticsPage';
import ProfilePage from '../pages/Profile/ProfilePage/ProfilePage';
import ItemsPage from '../pages/Items/ItemsPage/ItemsPage';
import ItemsEditPage from '../pages/Items/ItemsEditPage/ItemsEditPage';
import ItemsShowPage from '../pages/Items/ItemsShowPage/Items';
import OrdersPage from '../pages/Booking/OrdersPage/OrdersPage';
import CartPage from '../pages/Booking/CartPage/CartPage';
import StudentRequestsPage from '../pages/Booking/StudentRequestsPage/StudentRequestsPage';

// Admin Pages
import StockRequestPage from '../pages/Management/StockRequest/StockRequestPage';

const AppRouter = () => {
  const [user, setUser] = useState(getUser());

  return (
    <Router>
      <main className={styles.App}>
        <Routes>
          {/* Auth Routes */}
          {!user && (
            <>
              <Route path="/admin/login" element={<AdminLoginPage setUser={setUser} />} />
              <Route path="/admin" element={<AdminSignupPage setUser={setUser} />} />
              <Route path="/user" element={<UserAuthPage setUser={setUser} />} />
              <Route path="/*" element={<Navigate to="/user" />} />
            </>
          )}

          {/* Admin Routes */}
          {user && user.role === 'admin' && (
            <>
              <Route path="/analytics" element={<AnalyticsPage user={user} setUser={setUser} />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/stock-request" element={<StockRequestPage user={user} setUser={setUser} />} />
              <Route path="/*" element={<Navigate to="/stock-request" />} />
              <Route path="/items" element={<ItemsPage user={user} setUser={setUser} />} />
              <Route path="/items/edit/:id" element={<ItemsEditPage user={user} setUser={setUser}/>} />
            </>
          )}

          {/* User Routes */}
          {user && user.role === 'user' && (
            <>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/items" element={<ItemsPage user={user} setUser={setUser}/>} />
              <Route path="/items/:id" element={<ItemsShowPage />} />
              <Route path="/orders" element={<OrdersPage user={user} setUser={setUser} />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/requests" element={<StudentRequestsPage />} />
              <Route path="/*" element={<Navigate to="/orders" />} />
            </>
          )}
        </Routes>
      </main>
    </Router>
  );
};

export default AppRouter;
