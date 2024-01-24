import { redirect } from '@remix-run/node'

import { RoutesPath } from '~/data/routes.data'

export function loader() {
  return redirect(RoutesPath.home)
}
