import { Heart, Moon, Sun, Wind } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/themeSlice';

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ${
    isActive
      ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md'
      : 'text-gray-300 hover:bg-white/10 hover:text-white'
  }`;

export default function Navbar() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-gradient-to-r from-gray-900 via-gray-950 to-black backdrop-blur-lg">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/*  LOGO */}
        <NavLink
          to="/"
          className="group flex items-center gap-2 text-lg font-extrabold tracking-wide text-white"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg transition duration-300 group-hover:scale-110">
            <Wind size={22} />
          </span>
          <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            AirGuard AI
          </span>
        </NavLink>

        {/*  NAV LINKS */}
        <div className="hidden items-center gap-3 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/dashboard/Delhi" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/favorites" className={navLinkClass}>
            Favorites
          </NavLink>
        </div>

        {/*  RIGHT ICONS */}
        <div className="flex items-center gap-2">
          <button
            className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white transition hover:scale-110 hover:bg-white/20"
            type="button"
            onClick={() => dispatch(toggleTheme())}
            title="Toggle dark mode"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <NavLink
            to="/favorites"
            className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white transition hover:scale-110 hover:bg-white/20 md:hidden"
            aria-label="Favorites"
          >
            <Heart size={18} />
          </NavLink>
        </div>
      </nav>
    </header>
  );
}