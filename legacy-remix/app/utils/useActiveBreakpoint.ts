import { useEffect, useState } from 'react';

export const breakpoints = {
  sm: 640, // Tailwind's default for 'sm'
  md: 768, // Tailwind's default for 'md'
  lg: 1024, // Tailwind's default for 'lg'
  xl: 1280, // Tailwind's default for 'xl'
  '2xl': 1536, // Tailwind's default for '2xl'
};

export function useActiveBreakpoint() {
  const [activeBreakpoint, setActiveBreakpoint] = useState('');

  useEffect(() => {
    if (window) {
      const calculateActiveBreakpoint = () => {
        const width = window.innerWidth;
        let active = 'xs';

        if (width >= breakpoints['2xl']) {
          active = '2xl';
        } else if (width >= breakpoints.xl) {
          active = 'xl';
        } else if (width >= breakpoints.lg) {
          active = 'lg';
        } else if (width >= breakpoints.md) {
          active = 'md';
        } else if (width >= breakpoints.sm) {
          active = 'sm';
        }

        setActiveBreakpoint(active);
      };

      window.addEventListener('resize', calculateActiveBreakpoint);

      calculateActiveBreakpoint();

      return () =>
        window.removeEventListener('resize', calculateActiveBreakpoint);
    }
  }, []);

  return activeBreakpoint;
}
