import { useNavigate } from 'react-router';
import { IcsInput } from '@/components/IcsInput';
import { InstructionsGuide } from '@/components/InstructionsGuide';
import { PrivacyBanner } from '@/components/PrivacyBanner';
import { useIcsDataContext } from '@/context/IcsDataContext';

export function SetupPage() {
  const navigate = useNavigate();
  const { setIcsUrl, loading, icsUrl, isEditingUrl } = useIcsDataContext();

  const handleSubmit = async (url: string) => {
    await setIcsUrl(url);
    navigate('/', { replace: true });
  };

  // Determine if we should show the current URL for editing
  const initialUrl = isEditingUrl && icsUrl ? icsUrl : undefined;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <IcsInput onSubmit={handleSubmit} loading={loading} initialUrl={initialUrl} />
      <InstructionsGuide />
      <PrivacyBanner />
    </div>
  );
}
