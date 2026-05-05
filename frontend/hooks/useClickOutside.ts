import { RefObject, useEffect } from 'react';

type OutsideClickEvent = MouseEvent | TouchEvent;

function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onClickOutside: (event: OutsideClickEvent) => void,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handlePointerDown = (event: OutsideClickEvent) => {
      const target = event.target;

      if (!(target instanceof Node) || ref.current?.contains(target)) {
        return;
      }

      onClickOutside(event);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [enabled, onClickOutside, ref]);
}

export default useClickOutside;
