import { useState, useEffect } from "react";
import TextTransition, { presets } from "react-text-transition";
import Image from "next/image";

export default function LandingPage() {
	const products = [
		"chocolate bar",
		"avocado",
		"egg",
		"steak",
		"water bottle",
		"soda can",
		"sugar pack",
		"honey jar",
		"almond"
	];
	const [index, setIndex] = useState<number>(0);
	useEffect(() => {
		/**
		 * automatically update the title text
		 */
		const intervalId = setInterval(() => setIndex((index) => index + 1), 3000);
		return () => clearTimeout(intervalId);
	}, []);

	return (
		<div className="flex flex-col bg-white dark:bg-black min-h-screen justify-start md:justify-evenly lg:justify-between p-4 lg:px-10 items-center space-y-3 lg:flex-row">
			<div className="flex flex-col justify-start max-w-xl items-center lg:items-start lg:mr-5">
				<div className="image-bg md:bg-blue-100 md:dark:bg-red-200 min-h-1/2 md:min-h-0 pt-48 md:pt-10 rounded-b-2xl md:rounded-b-none w-screen text-4xl md:text-5xl p-8 lg:p-4 font-bold colorful-text lg:mt-0">
					Stop climate change,
					<br />
					one{" "}
					<TextTransition
						className="dynamic"
						text={products[index % products.length]}
						springConfig={presets.wobbly}
						inline={true}
					/>{" "}
					at a time.
				</div>
				<p className="normal-text text-xl mx-4 mt-5 lg:mt-14 max-w-xl">
					Don't buy products that harm the environment, animals, or the people that produce them.
				</p>
				<p className="normal-text text-xl mx-4 mt-5 max-w-xl">
					Start using GoodBuy and measure the inpact of the products you use.
				</p>
			</div>
			<div>
				<figure className="hidden md:block bg-primary dark:bg-secondary transform xl:rotate-12 rounded-3xl p-2 text-center mx-10 md:mx-0 max-w-sm md:max-w-lg lg:max-w-full lg:w-7xl">
					<Image
						className="rounded-3xl"
						src="/pics/bear.jpg"
						alt="Polar Bear"
						layout="intrinsic"
						width="600"
						height="400"
					/>
					<figcaption className="text-white">
						<span>
							Photo by{" "}
							<a
								className="underline"
								href="https://unsplash.com/@hansjurgen007?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
							>
								Hans-Jurgen Mager
							</a>{" "}
							on{" "}
							<a
								className="underline"
								href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
							>
								Unsplash
							</a>
						</span>
					</figcaption>
				</figure>
			</div>
		</div>
	);
}
