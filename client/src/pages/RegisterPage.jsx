import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm.jsx';

export default function RegisterPage() {
    return (
        <div className="app-shell-bg flex min-h-screen items-center justify-center p-4">
            <div className="surface-card page-enter w-full max-w-md p-8">
                <h1 className="mb-2 text-2xl font-bold text-zinc-950">Join the Platform</h1>
                <p className="mb-8 text-sm text-zinc-600">
                    Create an account to start managing your teams and tasks.
                </p>
                
                <RegisterForm />

                <div className="mt-8 text-center text-sm text-zinc-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-zinc-950 hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
