# Third-party notices

This module vendors source code from **TruckSim Maps** (the `truckermudgeon/maps`
project) to render the ETS2 game map and recorded routes.

- Project: TruckSim Maps — https://github.com/truckermudgeon/maps
- Author: Trucker Mudgeon
- License: **GNU General Public License v3.0 or later** (see `LICENSE`)

Vendored under `client/src/lib/`:
- `base/`, `map/`, `ui/` — the `@truckermudgeon/{base,map,ui}` libraries.
- `map/projections.ts` is ported (server-side) as `server/utils/projection.ts`.

Map data and tiles are © Trucker Mudgeon / SCS Software.
The map tiles are proxied from `https://maps.truckermudgeon.com`.

Any modification to the vendored files must preserve this attribution and the
GPL-3.0-or-later license.
