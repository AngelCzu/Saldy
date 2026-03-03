import { FirebaseAuthRepository } from 'src/app/data/repositories/firebase-auth.repository';
import { AUTH_REPOSITORY } from './tokens';

export const AUTH_PROVIDER = {
  provide: AUTH_REPOSITORY,
  useClass: FirebaseAuthRepository
};