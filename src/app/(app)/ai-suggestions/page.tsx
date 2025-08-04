import PageHeader from '@/components/page-header';
import SuggestionForm from '@/components/ai/suggestion-form';

export default function AiSuggestionsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="AI Meal Suggestions" />
      <SuggestionForm />
    </div>
  );
}
