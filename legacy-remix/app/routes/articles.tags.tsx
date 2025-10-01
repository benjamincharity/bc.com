import { Outlet } from '@remix-run/react';

export default function TagsLayout() {
  return (
    <div data-e2e={'tags'}>
      <Outlet />
    </div>
  );
}
