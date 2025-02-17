export interface TUser {
  avatar: string;
  createdAt: string;
  email: string;
  updatedAt: string;
  username: string;
  verifiedEmail: boolean;
  id: string;
}

export interface Data {
  message: string;
  data: TUser;
}
