import { ButtonHTMLAttributes } from 'react';

export function ModernButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { children, color = '--highlight-color-5', ...rest } = props;

  return (
    <button className="relative px-6 py-3 font-bold text-black group" {...rest}>
      <span
        className={`absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-[${color}] group-hover:translate-x-0 group-hover:translate-y-0`}
      />
      <span className="absolute inset-0 w-full h-full border-4 border-black" />
      <span className="relative">{children}</span>
    </button>
  );
}
