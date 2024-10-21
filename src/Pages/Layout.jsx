import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

export default function Layout() {
    const { user, token, setUser, setToken } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation(); // Get current location

    async function handleLogout(e) {
        e.preventDefault();

        const res = await fetch('/api/logout', {
            method: 'post',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        console.log(data);

        if (res.ok) {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            navigate('/login');
        }
    }

    return (
        <>
            <header>
                <nav>
                    <Link to="/" className="nav-link">Home</Link>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            <p className="text-slate-400 text-xs">Welcome back {user.name}</p>
                            
                            {/* Conditionally render the Link based on the current path */}
                            {location.pathname === '/customers' ? (
                                <Link to="/customers/add" className="nav-link">New Customer</Link>
                            ) : (
                                <div>
                                    <Link to="/customers" className="nav-link">Customers</Link>
                                    {/* Check if we are not on the '/projects/add' route before showing the New Project button */}
                                    {location.pathname !== '/projects/add' && (
                                        <Link to="/projects/add" className="nav-link">New Project</Link>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleLogout}>
                                <button className="nav-link">Logout</button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="nav-link">Login</Link>
                        </div>
                    )}
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </>
    );
};
