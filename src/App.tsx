import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DefaultLayout from '@/layouts/DefaultLayout';

// Lazy load das páginas para reduzir TBT
const Home = lazy(() => import('@/pages/Home'));
const Transparency = lazy(() => import('@/pages/Transparency'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));
const HistoryPage = lazy(() => import('@/pages/HistoryPage'));
const RegimentoInterno = lazy(() => import('@/pages/RegimentoInterno'));

// Componente de loading enquanto a página carrega
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
      <p className="text-slate-600 dark:text-slate-400 font-medium">Carregando...</p>
    </div>
  </div>
);

// Wrapper para Suspense
const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <LazyPage><ErrorPage /></LazyPage>,
    children: [
      {
        path: '/',
        element: <LazyPage><Home /></LazyPage>
      },
      {
        path: '/transparencia',
        element: <LazyPage><Transparency /></LazyPage>
      },
      {
        path: '/sobre',
        element: <LazyPage><About /></LazyPage>
      },
      {
        path: '/contato',
        element: <LazyPage><Contact /></LazyPage>
      },
      {
        path: '/historia',
        element: <LazyPage><HistoryPage /></LazyPage>
      },
      {
        path: '/regimento-interno',
        element: <LazyPage><RegimentoInterno /></LazyPage>
      },
      {
        path: '*',
        element: <LazyPage><ErrorPage /></LazyPage>
      }
    ]
  }
]);

export { router };