import { createContext, useState, useEffect } from "react";
import { ReactChildrenType } from "../types/ReactChildrenType";
import { JWTPayloadType } from "../../lib/types/HelperTypes";

interface AuthType {
	isAuthenticating?: boolean;
	changeIsAuthenticating?: (newValue: boolean) => void;
	isLoggedIn?: boolean;
	toggleIsLoggedIn?: () => void;
	userInfo?: JWTPayloadType;
	updateUserInfo?: (newInfo: JWTPayloadType) => void;
}

export const AuthContext = createContext<AuthType>({});

const AuthContextProvider = ({ children }: ReactChildrenType) => {
	const getUserInfo = () => {
		const infoFromStorage = window.localStorage.getItem("userInfo");
		if (infoFromStorage) {
			return JSON.parse(infoFromStorage);
		}
		return undefined;
	};

	const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
	const [userInfo, setUserInfo] = useState<JWTPayloadType | undefined>();

	useEffect(() => {
		setUserInfo(getUserInfo());
		try {
			manageAuth();
		} catch {
			setIsLoggedIn(false);
		}
	}, []);

	const getAuthStatus = async () => {
		const res = await fetch("/api/check");
		const data = await res.json();
		return data.message;
	};

	const refreshToken = async () => {
		const res = await fetch("/api/refresh_token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ "email": userInfo && userInfo.email })
		});
		if (res.status !== 200) {
			throw Error("Server Error");
		}
		setIsLoggedIn(true);
	};

	const manageAuth = async () => {
		const status = await getAuthStatus();
		if (status === "logged") {
			setIsLoggedIn(true);
		} else if (status === "refresh") {
			try {
				refreshToken();
			} catch {
				setIsLoggedIn(false);
			}
		} else {
			setIsLoggedIn(false);
		}
	};

	const changeIsAuthenticating = (newValue: boolean): void => {
		setIsAuthenticating(newValue);
	};

	const toggleIsLoggedIn = (): void => {
		setIsLoggedIn((current) => !current);
	};

	const updateUserInfo = (newInfo: JWTPayloadType) => {
		setUserInfo(newInfo);
		window.localStorage.setItem("userInfo", JSON.stringify(newInfo));
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticating,
				changeIsAuthenticating,
				isLoggedIn,
				toggleIsLoggedIn,
				userInfo,
				updateUserInfo
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
