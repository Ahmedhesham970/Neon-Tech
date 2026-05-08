export class AuthResponseDto {
  message: string;
  token: string;
  user: { email: string; name: string };

  constructor(
    user: { email: string; name: string },
    token: string,
    message: string = 'Success',
  ) {
    this.message = message;
    this.token = token;
    this.user = {
      email: String(user.email),
      name: String(user.name),
    };
  }
}
// auth-success.response.ts
