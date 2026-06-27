import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Signup } from './Components/Signup'
import { Login } from './Components/Login'
import { NotFound } from './Components/NotFound'
import { HomePage } from './Components/HomePage'
import { AuthProvider } from './Context/AuthContext'
import { ProtectedRoute } from './Components/ProtectedRoute'
import { Menu } from './Components/Menu'
import { CartProvider } from './Context/CartContext'
import { Cart } from './Components/Cart'
import { Orders } from './Components/Orders'
import { AddRestaurant } from './Components/AddRestaurant'
import { AdminRoute } from './Components/AdminRoute'
import { EditRestaurant } from './Components/EditRestaurant'
import { EditMenu } from './Components/EditMenu'
import { AddItems } from './Components/AddItems'
import { RestaurantOrders } from './Components/RestaurantOrders'
import { ToastProvider } from './Context/ToastContext'
import './biteroute.css'

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
