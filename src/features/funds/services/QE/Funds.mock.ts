import { rest } from 'msw';

export default [
  rest.post('/accounts/:accountId/deposit', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(''));
  }),
  rest.post(`/accounts/:accountId/withdraw`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(''));
  }),
  rest.get(`/accounts/:accountId/balance`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        balance: 176.85, // balance amount checked in timestamp
        timestamp: '2021-09-30T17:45:01Z' // last date which balance was updated
      })
    );
  }),
  rest.get(`/accounts/:accountId/statement`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [
          {
            id: '165487',
            amount: 10,
            date: '2021-09-02T14:40:15Z',
            channel: 'ATM'
          },
          {
            id: '587459',
            amount: -57.87,
            date: '2021-08-03T12:25:36Z',
            channel: 'online',
            note: 'pizza'
          },
          {
            id: '315126',
            amount: 154.87,
            date: '2021-09-05T01:02:03Z',
            channel: 'ATM'
          },
          {
            id: '787915',
            amount: 12.48,
            date: '2021-08-30T23:02:20Z',
            channel: 'online'
          },
          {
            id: '159753',
            amount: -578.87,
            date: '2021-09-15T06:30:27Z',
            channel: 'ATM',
            note: 'new game'
          },
          {
            id: '987412',
            amount: 87.77,
            date: '2021-08-18T12:43:54Z',
            channel: 'online',
            note: 'debt pay'
          },
          {
            id: '123698',
            amount: -5.01,
            date: '2021-09-11T11:11:11Z',
            channel: 'ATM'
          }
        ]
      })
    );
  })
];
