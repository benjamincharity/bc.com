import { Outlet } from '@remix-run/react';

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      Alpha index:
      <Outlet />
    </div>
  );
}
