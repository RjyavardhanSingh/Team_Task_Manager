import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth.api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../utils/api';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const setAuth = useAuthStore(state => state.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await authApi.login(email, password);
            setAuth(res.data.user, res.data.token);
            navigate('/app');
        } catch (err) {
            setError(getErrorMessage(err, 'Login failed. Please try again.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="status-enter border border-zinc-300 bg-zinc-100 p-3 text-sm text-zinc-900">{error}</div>}
            
            <Input 
                label="Email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                placeholder="you@example.com"
            />
            
            <Input 
                label="Password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                placeholder="••••••••"
            />
            
            <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
                Sign In
            </Button>
        </form>
    );
}
