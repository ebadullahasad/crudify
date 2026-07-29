import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ProductsPage } from "./pages/ProductsPage";
import { AppLayout } from "./components/AppLayout";
import {
  ProtectedRoute,
  PublicOnlyRoute,
} from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public-only (redirect to /products if already logged in) */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected (redirect to /login if not authenticated) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/products" element={<ProductsPage />} />
          </Route>
        </Route>

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
