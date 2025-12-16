import type { Request } from 'express';
import { JwtResponsePayload } from 'src/modules/authentication/types/JwtResponsePayload.types';

export interface AuthRequest extends Request {
  user: JwtResponsePayload;
}
