import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import { hydrateTheme } from './store/slices/themeSlice';

export default function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    dispatch(hydrateTheme());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="app-shell min-h-screen bg-mist text-ink transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
