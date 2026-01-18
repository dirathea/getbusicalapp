import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Root } from '@/routes/Root';
import { EventsPage } from '@/routes/EventsPage';
import { SetupPage } from '@/routes/SetupPage';
import { FAQPage } from '@/routes/FAQPage';
import { AboutPage } from '@/routes/AboutPage';
import { PrivacyPage } from '@/routes/PrivacyPage';
import { TermsPage } from '@/routes/TermsPage';
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
      {
        path: 'privacy',
        element: <PrivacyPage />,
      },
      {
        path: 'terms',
        element: <TermsPage />,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
