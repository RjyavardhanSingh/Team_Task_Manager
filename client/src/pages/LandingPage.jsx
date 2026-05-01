import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import heroIllustration from '../assets/hero2.png';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-zinc-100 text-zinc-950">
            <header className="border-b border-zinc-300 bg-white/90 backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="text-xl font-semibold tracking-tight">
                        Team<span className="text-zinc-500">Task</span>Manager
                    </div>
                    <nav className="flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">Log In</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm">Get Started</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto grid min-h-[calc(100vh-65px)] max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="page-enter">
                    <p className="mb-4 inline-flex border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
                        Team Workflow Platform
                    </p>
                    <h1 className="text-4xl font-semibold leading-tight text-zinc-950 md:text-6xl">
                        Plan projects.
                        <br />
                        Assign clearly.
                        <br />
                        Deliver on time.
                    </h1>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-600 md:text-lg">
                        A focused task system for product and engineering teams that need role-based control,
                        transparent ownership, and reliable progress tracking.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link to="/register">
                            <Button size="lg" className="min-w-44">Create Workspace</Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" size="lg" className="min-w-36">Open Dashboard</Button>
                        </Link>
                    </div>
                </section>

                <section className="surface-card page-enter p-5">
                    <div className="border border-zinc-300 bg-zinc-50 p-4">
                        <img
                            src={heroIllustration}
                            alt="Team workflow illustration"
                            className="h-auto w-full object-contain"
                        />
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-zinc-600 md:grid-cols-3">
                        <div className="surface-card-muted p-3">
                            <p className="text-xs uppercase tracking-wide">Role Aware</p>
                            <p className="mt-2 font-medium text-zinc-900">Admin & Member controls</p>
                        </div>
                        <div className="surface-card-muted p-3">
                            <p className="text-xs uppercase tracking-wide">Live Metrics</p>
                            <p className="mt-2 font-medium text-zinc-900">Dashboard health at a glance</p>
                        </div>
                        <div className="surface-card-muted p-3">
                            <p className="text-xs uppercase tracking-wide">Execution Focused</p>
                            <p className="mt-2 font-medium text-zinc-900">Task status lifecycle</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
