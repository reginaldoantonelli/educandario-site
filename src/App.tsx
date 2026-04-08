import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DefaultLayout from '@/layouts/DefaultLayout';

// Adicione o lazy load para a nova página
const Home = lazy(() => import('@/pages/Home'));
const Transparency = lazy(() => import('@/pages/Transparency'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));
const HistoryPage = lazy(() => import('@/pages/HistoryPage'));
const RegimentoInterno = lazy(() => import('@/pages/RegimentoInterno'));
const Login = lazy(() => import('@/pages/Login')); // <-- NOVA ROTA

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <Suspense fallback={<div>Loading...</div>}><ErrorPage /></Suspense>,
    children: [
      { path: '/', element: <Suspense fallback={<div>Loading...</div>}><Home /></Suspense> },
      { path: '/transparencia', element: <Suspense fallback={<div>Loading...</div>}><Transparency /></Suspense> },
      { path: '/sobre', element: <Suspense fallback={<div>Loading...</div>}><About /></Suspense> },
      { path: '/contato', element: <Suspense fallback={<div>Loading...</div>}><Contact /></Suspense> },
      { path: '/historia', element: <Suspense fallback={<div>Loading...</div>}><HistoryPage /></Suspense> },
      { path: '/regimento-interno', element: <Suspense fallback={<div>Loading...</div>}><RegimentoInterno /></Suspense> },
    ]
  },
  // Rota de Login FORA do DefaultLayout (Tela cheia, sem Navbar/Footer)
  {
    path: '/admin',
    element: <Suspense fallback={<div>Loading...</div>}><Login /></Suspense>
  },
  // Rota de Erro Genérica
  {
    path: '*',
    element: <Suspense fallback={<div>Loading...</div>}><ErrorPage /></Suspense>
  }
]);

export { router };