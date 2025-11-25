import { Roles } from 'src/common/Enums/roles.enums';

export class UserResponse {
  id: number;
  username: string;
  email: string;
  role: Roles;
}
