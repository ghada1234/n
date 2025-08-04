
'use client';

import PageHeader from '@/components/page-header';
import SuggestionForm from '@/components/ai/suggestion-form';
import { useLanguage } from '@/hooks/use-language';

export default function AiSuggestionsPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <PageHeader title={t('aiMealSuggestions')} />
      <SuggestionForm />
    </div>
  );
}
