import { User } from "./user";

export class AuthSession {
  /* Representa la sesión autenticada

No contiene lógica de aplicación
No accede a localStorage
*/
  private userId: User['id'];
  private name: string;
  private loginDate: Date;

  constructor(userId: number, name: string, loginDate: Date) {
    this.userId = userId;
    this.name = name;
    this.loginDate = loginDate;
  }

  static fromJSON(json: string): AuthSession {
    const data = JSON.parse(json);
    return new AuthSession(data.userId, data.name, data.loginDate);
  }

  public getId(): User['id'] {
    return this.userId;
  }
}
