export class RegisterDto {
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAccountOfficer: boolean;
}

export class LoginDto {
  email: string;
  password: string;
}