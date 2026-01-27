import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import Transparency from '@/pages/Transparency';
import About from '@/pages/About';
import DefaultLayout from '@/layouts/DefaultLayout';
import Contact from '@/pages/Contact';
import ErrorPage from '@/pages/ErrorPage';
import HistoryPage from '@/pages/HistoryPage';
import RegimentoInterno from '@/pages/RegimentoInterno';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/transparencia',
        element: <Transparency />
      },
      {
        path: '/sobre',
        element: <About />
      },
      {
        path: '/contato',
        element: <Contact />
      },
      {
        path: '/historia',
        element: <HistoryPage />
      },
      {
        path: '/regimento-interno',
        element: <RegimentoInterno />
      },
      {
        path: '*',
        element: <ErrorPage />
      }
    ]
  }
]);

export { router };