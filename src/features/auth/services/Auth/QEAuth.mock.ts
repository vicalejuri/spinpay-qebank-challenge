import { IUserAccountHandle } from '$features/auth/types';
import { rest } from 'msw';

export default [
  rest.post('/login', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ accesToken: 'admin' }));
  }),
  rest.get(`/:id/user`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.id,
        name: 'john doe',
        document: { type: 'CPF', value: '111222333' },
        phone: ''
      } as IUserAccountHandle)
    );
  })
];
