import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './store/store';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';
import './styles/index.css';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Favorites = lazy(() => import('./pages/Favorites'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard/:city?', element: <Dashboard /> },
      { path: 'favorites', element: <Favorites /> },
      { path: '*', element: <ErrorPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <Suspense fallback={<Loader label="Preparing AirGuard AI" />}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
);
