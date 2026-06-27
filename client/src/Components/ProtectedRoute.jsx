import { Navigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext';
export const ProtectedRoute = ({children}) => {
const {user,loading} = useAuth();
console.log('loading:', loading, 'user:', user);
if(loading) return <div>Loading...</div>
if(!user) return <Navigate to='/login' replace/>
return children
}
