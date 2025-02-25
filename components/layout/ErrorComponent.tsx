import React from "react";
import { MdOutlineError } from "react-icons/md";
import FullScreenWrapper from "./FullScreenWrapper";
type ErrorComponentProps = {
	msg?: string;
	fullScreen?: boolean;
};
function ErrorComponent({ msg, fullScreen = false }: ErrorComponentProps) {
	if (!fullScreen)
		return (
			<div className="flex h-full w-full grow flex-col items-center justify-center bg-transparent">
				<MdOutlineError color="#F31559" size={35} />
				<p className="text-sm font-medium italic text-gray-500">{msg ? msg : "Oops, houve um erro."}</p>
			</div>
		);
	return (
		<FullScreenWrapper>
			<div className="flex h-full w-full grow flex-col items-center justify-center bg-transparent">
				<MdOutlineError color="#F31559" size={35} />
				<p className="text-sm font-medium italic text-gray-500">{msg ? msg : "Oops, houve um erro."}</p>
			</div>
		</FullScreenWrapper>
	);
}

export default ErrorComponent;
