import { IncomingMessage, ServerResponse } from "node:http";
import Cookies from "cookies";

export function setTokenCookie(
	req: IncomingMessage,
	res: ServerResponse,
	name: "auth-token" | "refresh-token",
	token: string
) {
	const cookies = new Cookies(req, res);
	cookies.set(name, token, {
		httpOnly: true,
		sameSite: "lax"
	});
}

export function getTokenFromCookie(req: IncomingMessage, res: ServerResponse, name: "auth-token" | "refresh-token") {
	const cookies = new Cookies(req, res);
	return cookies.get(name);
}

export function unsetTokenCookie(req: IncomingMessage, res: ServerResponse, name: "auth-token" | "refresh-token") {
	const cookies = new Cookies(req, res);
	cookies.set(name, "", {
		httpOnly: true,
		sameSite: "lax"
	});
}

export function getTokenFromResponse(apiResponseBody: string): null | string {
	try {
		const body = JSON.parse(apiResponseBody);
		const jwtAccessToken = body.jwtAccessToken ? body.jwtAccessToken : body.accessToken;
		if (jwtAccessToken === undefined) {
			return null;
		}
		return jwtAccessToken;
	} catch (err) {
		return null;
	}
}
