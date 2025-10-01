import React from 'react';

interface GlassCardProps extends React.HTMLProps<HTMLDivElement> {}

export function GlassCard(props: GlassCardProps) {
  const { children, className = '', ...divProps } = props;

  return (
    <div
      className={`relative border border-gray-200 bg-white bg-opacity-40 bg-clip-padding px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20 ${className}`}
      style={{ backdropFilter: 'blur(6px)' }}
      {...divProps}
    >
      <div className="mx-auto max-w-md">{children}</div>
    </div>
  );
}
