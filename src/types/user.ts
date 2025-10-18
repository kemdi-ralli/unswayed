// types/user.ts
export type IncomingUser = {
  id: number | null;
  email: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  username: string | null;
  type: string | null;
  email_verified_at: string | null;
  photo: string | null;
  phone: string | null;
  zip_code: string | null;
  address: string | null;
  password: string | null;
  about: string | null;
  remember_token: string | null;
  created_at: string | null;
  updated_at: string | null;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  last_seen_at: string | null;
  metadata: Record<string, any> | null;
  migrated: boolean | null;
};
