import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Signup } from './Components/auth/Signup'
import { Login } from './Components/auth/Login'
import { NotFound } from './Components/shared/NotFound'
import { HomePage } from './Components/pages/HomePage'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './Components/auth/ProtectedRoute'
import { Menu } from './Components/restaurant/Menu'
import { CartProvider } from './context/CartContext'
import { Cart } from './Components/cart/Cart'
import { Orders } from './Components/pages/Orders'
import { AddRestaurant } from './Components/admin/AddRestaurant'
import { AdminRoute } from './Components/auth/AdminRoute'
import { EditRestaurant } from './Components/admin/EditRestaurant'
import { EditMenu } from './Components/admin/EditMenu'
import { AddItems } from './Components/admin/AddItems'
import { RestaurantOrders } from './Components/admin/RestaurantOrders'
import { ToastProvider } from './context/ToastContext'
import './styles/biteroute.css'

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <CartProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<HomePage />} />
                            <Route path='/signup' element={<Signup />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='*' element={<NotFound />} />
                            <Route path='/restaurant/:id/menu' element={<ProtectedRoute><Menu /></ProtectedRoute>} />
                            <Route path='/cart' element={
                                <ProtectedRoute><Cart /></ProtectedRoute>
                            } />
                            <Route path='/orders' element={
                                <ProtectedRoute><Orders /></ProtectedRoute>
                            } />
                            <Route path='/addRestaurant' element={
                                <AdminRoute><AddRestaurant /></AdminRoute>
                            } />
                            <Route path='/restaurant/:id/manage' element={
                                <AdminRoute><EditRestaurant /></AdminRoute>
                            } />
                            <Route path='/restaurant/:id/editItems' element={
                                <AdminRoute><EditMenu /></AdminRoute>
                            } />
                            <Route path='/restaurant/:id/addItems' element={
                                <AdminRoute><AddItems /></AdminRoute>
                            } />
                            <Route path='/restaurant/:id/orders' element={
                                <AdminRoute><RestaurantOrders /></AdminRoute>
                            } />
                        </Routes>
                    </BrowserRouter>
                </CartProvider>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;
