import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { AccountPage } from './pages/AccountPage';

import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminDeliveryZonesPage } from './pages/admin/AdminDeliveryZonesPage';
import { AdminRestaurantsPage } from './pages/admin/AdminRestaurantsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<RegisterPage />} />
        <Route path="/catalogue" element={<ProductsPage />} />
        <Route path="/produits/:slug" element={<ProductDetailPage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/panier" element={<CartPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/commandes/:orderNumber/confirmation" element={<OrderConfirmationPage />} />
          <Route path="/compte" element={<AccountPage />} />
          <Route path="/compte/commandes" element={<OrdersPage />} />
          <Route path="/compte/commandes/:orderNumber" element={<OrderDetailPage />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="produits" element={<AdminProductsPage />} />
          <Route path="produits/nouveau" element={<AdminProductFormPage />} />
          <Route path="produits/:id" element={<AdminProductFormPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="commandes" element={<AdminOrdersPage />} />
          <Route path="commandes/:orderNumber" element={<AdminOrderDetailPage />} />
          <Route path="stock" element={<AdminInventoryPage />} />
          <Route path="livraison" element={<AdminDeliveryZonesPage />} />
          <Route path="restaurants" element={<AdminRestaurantsPage />} />
          <Route path="avis" element={<AdminReviewsPage />} />
          <Route path="utilisateurs" element={<AdminUsersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
