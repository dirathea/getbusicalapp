import { useNavigate } from 'react-router';
import { IcsInput } from '@/components/IcsInput';
import { InstructionsGuide } from '@/components/InstructionsGuide';
import { PrivacyBanner } from '@/components/PrivacyBanner';
import { useIcsData } from '@/hooks/useIcsData';

export function SetupPage() {
  const navigate = useNavigate();
  const { setIcsUrl, loading } = useIcsData();

  const handleSubmit = async (url: string) => {
    await setIcsUrl(url);
    navigate('/', { replace: true });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <IcsInput onSubmit={handleSubmit} loading={loading} />
      <InstructionsGuide />
      <PrivacyBanner />
    </div>
  );
}
