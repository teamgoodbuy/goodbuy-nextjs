import { useState, useEffect } from "react";
import Link from "next/link";
import { handleAuth, dataUpdater, CheckFields } from "./helperFunctions";
import Field from "./Field";
import Checkbox from "./Checkbox";
import SubmitButton from "./SubmitButton";

export default function SignUpForm() {
	const defaultData = {
		email: "",
		username: "",
		password: "",
		repeatedPassword: "",
		acceptedTerms: false,
		hasRequiredAge: false
	};
	const [data, setData] = useState(defaultData);

	const [isSendingData, setIsSendingData] = useState<boolean>(false);
	const [serverResponse, setServerResponse] = useState<string>("");

	const checker = new CheckFields(data);

	useEffect(() => {
		checker.updateData(data);
	}, [data]);

	const clearForm = () => {
		setData(defaultData);
	};

	const handleSignUp = async () => {
		setIsSendingData(true);

		let specificHandler = () => {
			setServerResponse("Check your email and then log in");
		};
		handleAuth({
			url: "/api/register",
			data,
			specificHandler,
			setServerResponse,
			setIsSendingData,
			clearForm
		});
	};

	return (
		<form
			onSubmit={(e) => e.preventDefault()}
			id="signup-form"
			className="flex flex-col justify-center items-center my-14"
		>
			{serverResponse !== "" && <div className="pb-10 text-2xl colorful-text">{serverResponse}</div>}
			<Field
				value={data.email}
				setValue={dataUpdater("email", data, setData)?.updater}
				isValidValue={checker.isValidEmail()}
				type="text"
				name="Email"
			/>
			<Field
				value={data.username}
				setValue={dataUpdater("username", data, setData)?.updater}
				isValidValue={checker.isValidUsername()}
				type="text"
				name="Username"
			/>
			<Field
				value={data.password}
				setValue={dataUpdater("password", data, setData)?.updater}
				isValidValue={checker.isValidPassword()}
				type="password"
				name="Password"
			/>
			<Field
				value={data.repeatedPassword}
				setValue={dataUpdater("repeatedPassword", data, setData)?.updater}
				isValidValue={checker.areSamePasswords()}
				type="password"
				name="Repeated Password"
			/>
			<Checkbox condition={data.acceptedTerms} updateCondition={dataUpdater("acceptedTerms", data, setData)?.updater}>
				<span>
					I read and accept the{" "}
					<Link href="about:blank">
						<a target="_blank" rel="noreferrer noopener" className="colorful-text">
							Terms and Conditions
						</a>
					</Link>
					.
				</span>
			</Checkbox>
			<Checkbox condition={data.hasRequiredAge} updateCondition={dataUpdater("hasRequiredAge", data, setData)?.updater}>
				<span>I am 16 or older.</span>
			</Checkbox>
			<SubmitButton disabled={!checker.isValidSignUp() || isSendingData} updater={handleSignUp} text="Sign Up" />
		</form>
	);
}
