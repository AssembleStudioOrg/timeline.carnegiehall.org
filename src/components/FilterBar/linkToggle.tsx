import Toggle from '../Toggle';
import { useTimeline } from '$src/stores/useTimeline';
import { useCallback } from 'react';
import shallow from 'zustand/shallow';

function LinkToggle() {
  const [showCrossLinks, setShowCrossLinks] = useTimeline(
    useCallback((s) => [s.showCrossLinks, s.setShowCrossLinks], []),
    shallow
  );

  return (
    <Toggle
      label="Indirect Connections"
      checked={showCrossLinks}
      toggle={setShowCrossLinks}
    />
  );
}

export default LinkToggle;
