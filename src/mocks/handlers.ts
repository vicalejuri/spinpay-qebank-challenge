import { rest } from 'msw';

import qeauth from '$features/auth/services/Auth/QEAuth.mock';
import qefunds from '$features/funds/services/QE/Funds.mock';

export const handlers = [...qeauth, ...qefunds];
