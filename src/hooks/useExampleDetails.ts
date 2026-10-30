import { useState, useEffect } from 'react';

/**
 * Hook to read and react to the 'Example Details' setting.
 * When OFF (default), form inputs are strictly blank without dummy example placeholders.
 * When ON, example hints are displayed.
 */
export function useExampleDetails(): boolean {
  const [showExampleDetails, setShowExampleDetails] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ctc_show_example_details') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleSettingsUpdate = () => {
      try {
        const val = localStorage.getItem('ctc_show_example_details') === 'true';
        setShowExampleDetails(val);
      } catch {}
    };

    window.addEventListener('storage', handleSettingsUpdate);
    window.addEventListener('ctc_settings_changed', handleSettingsUpdate);

    return () => {
      window.removeEventListener('storage', handleSettingsUpdate);
      window.removeEventListener('ctc_settings_changed', handleSettingsUpdate);
    };
  }, []);

  return showExampleDetails;
}
