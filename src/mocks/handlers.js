import { rest } from 'msg';

export const handlers = [
  rest.get('/api/v1', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ username: 'admin' }));
  })
];
