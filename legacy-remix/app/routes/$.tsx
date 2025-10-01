import { redirect } from '@remix-run/node';

import { RoutePaths } from '~/data/routes.data';

export function loader() {
  return redirect(RoutePaths.home);
}
