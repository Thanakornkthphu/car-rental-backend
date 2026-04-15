export interface JwtUser {
	userId: string;
	email: string;
	role: string;
}

export interface RequestWithUser {
	user: JwtUser;
}
