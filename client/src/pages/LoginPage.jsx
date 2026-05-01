import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="app-shell-bg flex min-h-screen items-center justify-center p-4">
            <div className="surface-card page-enter w-full max-w-md p-8">
                <h1 className="mb-2 text-2xl font-semibold text-zinc-950">Sign In</h1>
                <p className="mb-8 text-sm text-zinc-600">Access your workspace and manage your team tasks.</p>

                <LoginForm />

                <div className="mt-8 text-center text-sm text-zinc-600">
                    No account yet?{' '}
                    <Link to="/register" className="font-semibold text-zinc-950 underline-offset-2 hover:underline">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}
