import { Outlet } from 'react-router';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UpdatePrompt } from '@/components/UpdatePrompt';
import { IcsDataProvider } from '@/context/IcsDataContext';
import { useIcsDataContext } from '@/context/IcsDataContext';

function HeaderWrapper() {
  const { loading, refresh } = useIcsDataContext();
  return <Header onRefresh={refresh} loading={loading} />;
}

export function Root() {
  return (
    <IcsDataProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <HeaderWrapper />
        <UpdatePrompt />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </IcsDataProvider>
  );
}
