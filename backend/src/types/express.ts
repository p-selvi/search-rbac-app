export enum Role {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  CONTRIBUTOR = 'CONTRIBUTOR',
}

export interface User {
  id: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
