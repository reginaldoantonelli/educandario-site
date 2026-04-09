import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DefaultLayout from '@/layouts/DefaultLayout';

// Adicione os novos imports com lazy load
const Home = lazy(() => import('@/pages/Home'));
const Transparency = lazy(() => import('@/pages/Transparency'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));
const HistoryPage = lazy(() => import('@/pages/HistoryPage'));
const RegimentoInterno = lazy(() => import('@/pages/RegimentoInterno'));
const Login = lazy(() => import('@/pages/Login'));

// Novos componentes administrativos
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout')); // <-- Novo Layout
const Dashboard = lazy(() => import('@/pages/Admin/Dashboard')); // <-- Nova Página
const TransparencyAdmin = lazy(() => import('@/pages/Admin/Transparency')); // <-- Nova Página

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
  // Rota de Login
  {
    path: '/admin',
    element: <Suspense fallback={<div>Loading...</div>}><Login /></Suspense>
  },
  
  // --- NOVAS ROTAS ADMINISTRATIVAS ---
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Carregando Painel...</div>}>
        <DashboardLayout />
      </Suspense>
    ),
    children: [
      {
        index: true, // Define /dashboard como a página principal deste grupo
        element: <Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense>
      },
      {
        path: 'transparencia',
        element: <Suspense fallback={<div>Loading...</div>}><TransparencyAdmin /></Suspense>
      },
      {
        path: 'configuracoes',
        element: <Suspense fallback={<div>Loading...</div>}><div className="text-white p-8">Configurações do Perfil em breve</div></Suspense>
      }
    ]
  },
  
  // Rota de Erro Genérica
  {
    path: '*',
    element: <Suspense fallback={<div>Loading...</div>}><ErrorPage /></Suspense>
  }
]);

export { router };