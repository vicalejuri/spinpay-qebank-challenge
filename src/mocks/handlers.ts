import { rest } from 'msw';

import qeauth from '$features/auth/services/Auth/QEAuth.mock';
import qefunds from '$features/funds/services/QE/Funds.mock';

export const handlers = [
  ...qeauth,
  ...qefunds,
  rest.get('/test', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({}));
  })
];
