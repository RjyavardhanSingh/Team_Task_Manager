import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth.api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../utils/api';

export default function RegisterForm() {
    const [name, setName] = useState('');
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
            const res = await authApi.register(name, email, password);
            setAuth(res.data.user, res.data.token);
            navigate('/app');
        } catch (err) {
            setError(getErrorMessage(err, 'Registration failed. Please try again.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {error && <div className="status-enter border border-zinc-300 bg-zinc-100 p-3 text-sm text-zinc-900">{error}</div>}
            
            <Input 
                label="Full Name"
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                placeholder="John Doe"
            />

            <Input 
                label="Work Email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                placeholder="you@company.com"
            />
            
            <Input 
                label="Password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                placeholder="••••••••"
                minLength={6}
            />
            
            <Button type="submit" isLoading={isLoading} className="mt-4 w-full">
                Create Account
            </Button>
        </form>
    );
}
