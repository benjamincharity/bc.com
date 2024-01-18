import { Outlet } from '@remix-run/react';
import { Navigation } from './components/Navigation';

const pagesWithBackground = ['', '404'];

export function determineIfShouldShowBackground(url: string): boolean {
  return pagesWithBackground.includes(url.replace(/\//, ''));
}

export default function Index() {
  // const [partyModeEnabled, setPartyModeEnabled] = useState(false);
  // const [partyModeInterval, setPartyModeInterval] =
  //   useState<NodeJS.Timeout | null>(null);

  // const canvasRef = useRef<InteractiveCanvasRefType>(null);

  // const togglePartyMode = (isOn: boolean) => {
  //   setPartyModeEnabled(isOn);
  //
  //   if (isOn && canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     const intervalId = setInterval(() => {
  //       canvas.wobbleRows();
  //     }, 500);
  //
  //     setPartyModeInterval(intervalId);
  //   } else if (partyModeInterval) {
  //     clearInterval(partyModeInterval);
  //     setPartyModeInterval(null);
  //   }
  // };

  return (
    <div
      className={
        'bc-home text-center relative z-20 font-vt323 pointer-events-none'
      }
      // bcKonami
      // konami={togglePartyMode}
    >
      <main>
        <Outlet />

        <h2 className="inline-block hyphens-none whitespace-nowrap uppercase text-subTitle m-4 mt-2 font-vt323 text-white leading-none text-shadow-title text-center">
          Engineering leader at high-growth
          <br />
          startups & scale-ups
        </h2>

        <Navigation />
      </main>

      {/*TODO: Need to finish this page*/}
      {/*<AboutLink />*/}
    </div>
  );
}
