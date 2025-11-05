export interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  role: string;
  gender?: 'male' | 'female' | 'prefer-not-to-say';
  ageRange?: '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+' | 'prefer-not-to-say';
}
