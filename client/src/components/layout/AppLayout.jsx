import { Menu, LogOut, LayoutDashboard, FolderKanban, ListChecks, X } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

const navItems = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/app/projects', label: 'Projects', icon: FolderKanban },
    { to: '/app/tasks', label: 'Tasks', icon: ListChecks },
];

const AppLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarOpen, toggleSidebar } = useUiStore();
    const { user, logout } = useAuthStore();

    const closeSidebarOnMobile = () => {
        if (window.innerWidth < 768 && isSidebarOpen) {
            toggleSidebar();
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="app-shell-bg min-h-screen text-zinc-950">
            {isSidebarOpen ? (
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="fixed inset-0 z-20 bg-black/40 md:hidden"
                    aria-label="Close sidebar overlay"
                />
            ) : null}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-30 w-64 border-r border-zinc-300 bg-white transition-transform duration-200 md:translate-x-0',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-14 items-center justify-between border-b border-zinc-300 bg-zinc-50 px-4">
                    <p className="text-sm font-semibold tracking-wide">TEAM TASK MANAGER</p>
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className="field-control p-1 hover:bg-zinc-100 md:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={16} />
                    </button>
                </div>

                <nav className="p-3">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={closeSidebarOnMobile}
                            className={({ isActive }) =>
                                cn(
                                    'mb-2 flex items-center gap-2 border border-zinc-300 px-3 py-2 text-sm transition-colors duration-200',
                                    isActive ? 'border-zinc-800 bg-zinc-900 text-white' : 'bg-white text-zinc-900 hover:bg-zinc-100'
                                )
                            }
                        >
                            <Icon size={16} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <div className="min-h-screen md:pl-64">
                <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-zinc-300 bg-white/90 px-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={toggleSidebar}
                            className="field-control p-2 hover:bg-zinc-100 md:hidden"
                            aria-label="Open sidebar"
                        >
                            <Menu size={16} />
                        </button>
                        <div>
                            <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                            <p className="text-xs uppercase tracking-wide text-zinc-600">{user?.role || 'Member'}</p>
                        </div>
                    </div>

                    <Button type="button" variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                        <LogOut size={14} />
                        Logout
                    </Button>
                </header>

                <main className="p-4 md:p-6">
                    <div key={location.pathname} className="page-enter">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
