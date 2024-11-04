import { useEffect } from 'react';

export const useArrowKeyNavigator = () => {
  useEffect(() => {
    const handlerKeyClick = (e: KeyboardEvent) => {
      const currentElement = document.activeElement as HTMLInputElement;
      const inputs: HTMLInputElement[] = Array.from(
        document.querySelectorAll('input:not([disabled]):not([readonly])')
      );

      if (!currentElement) return;

      const currentIndex = inputs.indexOf(currentElement);

      if (
        !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(
          e.key
        )
      )
        return;

      if (e.key === 'Enter') {
        // click shift+enter -> back to previous input
        if (e.shiftKey) {
          inputs[currentIndex - 1]?.focus();
          return;
        }

        // click enter -> move to the next input
        inputs[currentIndex + 1]?.focus();
        return;
      }

      let newIndex;

      const cursorPosition = currentElement.selectionStart;
      const valueLength = currentElement.value.length;

      const getNewIndex = (type: 'pre' | 'next') => {
        return type === 'pre' ? currentIndex - 1 : currentIndex + 1;
      };

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          if (cursorPosition === 0) {
            newIndex = getNewIndex('pre');
            if (newIndex >= 0) inputs[newIndex].focus();
          }
          break;

        case 'ArrowRight':
        case 'ArrowDown':
          if (cursorPosition === valueLength) {
            newIndex = getNewIndex('next');
            if (newIndex < inputs.length) inputs[newIndex].focus();
          }
          break;
      }
    };

    document.addEventListener('keydown', handlerKeyClick);
    return () => {
      document.removeEventListener('keydown', handlerKeyClick);
    };
  }, []);

  return null;
};
