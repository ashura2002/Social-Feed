import { Roles } from 'src/common/Enums/roles.enums';

export interface JwtResponsePayload {
  userId: number;
  email: string;
  role: Roles;
  username: string;
}
