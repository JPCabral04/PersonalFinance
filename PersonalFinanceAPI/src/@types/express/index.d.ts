import { User } from '../../entities/User';

interface JwtUserPayload {
  id: string;
  name: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user: JwtUserPayload;
    }
  }
}
