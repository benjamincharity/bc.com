import React from 'react';

interface ReactCodepenProps {
  defaultTab?: string;
  hash: string;
  height?: number;
  title?: string;
  themeId?: string | number;
  user: string;
}

const Codepen: React.FC<ReactCodepenProps> = ({
  defaultTab = 'js,result',
  hash,
  height = 300,
  title,
  themeId = 'dark',
  user,
}) => {
  // Build the embed URL with parameters
  const embedUrl = `https://codepen.io/${user}/embed/${hash}?height=${height}&default-tab=${encodeURIComponent(defaultTab)}&slug-hash=${hash}&user=${user}&name=cp_embed_${hash.slice(0, 6)}`;
  
  const penLink = `https://codepen.io/${user}/pen/${hash}/`;
  const userProfileLink = `https://codepen.io/${user}`;

  return (
    <div className="codepen-embed-wrapper">
      <iframe
        height={height}
        style={{ width: '100%' }}
        scrolling="no"
        title={title || `CodePen Embed ${hash}`}
        src={embedUrl}
        frameBorder="no"
        loading="lazy"
        allowTransparency={true}
        allowFullScreen={true}
        sandbox="allow-scripts allow-same-origin"
        allow="accelerometer 'none'; camera 'none'; geolocation 'none'; gyroscope 'none'; microphone 'none'; midi 'none'"
      >
        See the Pen <a href={penLink}>{title}</a>
        by {user} (<a href={userProfileLink}>@{user}</a>) on{' '}
        <a href="https://codepen.io">CodePen</a>.
      </iframe>
    </div>
  );
};

export default Codepen;
