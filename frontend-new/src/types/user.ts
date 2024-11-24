import { User as FirebaseUser } from 'firebase/auth';

export interface CustomUser extends FirebaseUser {
  name?: string;
  sobrietyDate?: string;
  addictionType?: string;
}

export type User = CustomUser;
