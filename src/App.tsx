import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Root } from '@/routes/Root';
import { EventsPage } from '@/routes/EventsPage';
import { SetupPage } from '@/routes/SetupPage';
import { FAQPage } from '@/routes/FAQPage';
import { AboutPage } from '@/routes/AboutPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'setup',
        element: <SetupPage />,
      },
      {
        path: 'faq',
        element: <FAQPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
