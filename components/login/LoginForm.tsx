import { useState, useEffect, useContext } from "react";
import { updateWithoutSpaces, checkEmail } from "./helperFunctions";
import { AuthContext } from "../../lib/context/AuthContext";
import { useRouter } from "next/router";

export default function LoginForm() {
	const [email, setEmail] = useState<string>("");
	const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
	const [password, setPassword] = useState<string>("");
	const [isValidForm, setIsValidForm] = useState<boolean>(false);
	const [isSendingData, setIsSendingData] = useState<boolean>(false);
	const [serverResponse, setServerResponse] = useState<string>("");

	const { updateUserInfo, toggleIsLoggedIn } = useContext(AuthContext);

	const router = useRouter();

	useEffect(() => {
		/**
		 * Every time the email is updated, it checks if it is valid
		 */
		checkEmail(setIsValidEmail, email);
	}, [email]);

	useEffect(() => {
		/**
		 * Checks if the form can be submitted
		 */
		if (email !== "" && isValidEmail && password !== "") {
			setIsValidForm(true);
		} else {
			setIsValidForm(false);
		}
	}, [email, password, isValidEmail]);

	const clearForm = () => {
		setEmail("");
		setPassword("");
	};

	const handleLogin = async () => {
		const BASE_URL = window.location.protocol + "//" + window.location.host;
		setIsSendingData(true);
		const userData = {
			email,
			password
		};
		try {
			let res = await fetch(BASE_URL + "/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(userData)
			});
			if (res && res.status === 200) {
				let data = await res.json();
				updateUserInfo && updateUserInfo(data);
				toggleIsLoggedIn && toggleIsLoggedIn();
				router.push("/");
			} else {
				setServerResponse("An Error Occured");
			}
		} catch (e) {
			console.error(e);
		}

		clearForm();
		setIsSendingData(false);
	};

	return (
		<form
			onSubmit={(e) => e.preventDefault()}
			id="login-form"
			className="flex flex-col justify-center items-center my-14"
		>
			{serverResponse !== "" && (
				<div className="pb-10 text-2xl colorful-text">{serverResponse}</div>
			)}
			{!isValidEmail && <label className="error-label">This email is not valid</label>}
			<input
				type="text"
				placeholder="email"
				onChange={(e) => updateWithoutSpaces(setEmail, e.target.value)}
				value={email || ""}
				className="field focus:ring-2 focus:ring-primary dark:focus:ring-2 dark:focus:ring-secondary"
			/>
			<input
				type="password"
				placeholder="password"
				onChange={(e) => updateWithoutSpaces(setPassword, e.target.value)}
				value={password || ""}
				className="field focus:ring-2 focus:ring-primary dark:focus:ring-2 dark:focus:ring-secondary"
			/>
			<button
				type="submit"
				form="login-form"
				className="colorful-button mb-6"
				disabled={!isValidForm || isSendingData}
				onClick={handleLogin}
			>
				Log In
			</button>
		</form>
	);
}