import { rest } from 'msw';

import qeauth from '$features/auth/services/Auth/QEAuth.mock';

export const handlers = [
  ...qeauth,
  rest.get('/api/v1', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ username: 'admin' }));
  })
];
