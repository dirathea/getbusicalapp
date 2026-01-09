import { Outlet } from 'react-router';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UpdatePrompt } from '@/components/UpdatePrompt';
import { useIcsData } from '@/hooks/useIcsData';

export function Root() {
  const { loading, refresh } = useIcsData();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onRefresh={refresh} loading={loading} />
      <UpdatePrompt />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}
