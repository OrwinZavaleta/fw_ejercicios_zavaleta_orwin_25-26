class AuthSession {
    private userId: User["id"];
    private name: string;
    private loginDate: Date;

    constructor(userId: number, name: string, loginDate: Date) {
        this.userId = userId;
        this.name = name;
        this.loginDate = loginDate;
    }
}
