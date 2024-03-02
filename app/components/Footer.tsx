export function Footer() {
  return (
    <footer className={'space-y-2 pb-2 pt-8 font-mono text-xs'}>
      <p className={'text-center'}>
        <abbr
          className={
            'cursor-help no-underline opacity-80 transition-all dark:opacity-80'
          }
          title="Building better. Startups & strategy."
        >
          🛠️ 🌟 🎯
        </abbr>
      </p>

      <div
        className={
          'mx-auto flex flex-col justify-center gap-0 text-center align-middle md:flex-row md:justify-center md:gap-4'
        }
      >
        <div>Copyright © {new Date().getFullYear()} Benjamin Charity.</div>
        <div>All rights reserved.</div>
      </div>
    </footer>
  );
}
