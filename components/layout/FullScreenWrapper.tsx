import React, { type PropsWithChildren } from "react";

function FullScreenWrapper({ children }: PropsWithChildren) {
	return (
		<div className="font-Inter flex min-h-screen w-screen max-w-full flex-col bg-background xl:min-h-screen">
			<div className="flex min-h-full grow">
				<div className="flex w-full grow flex-col">{children}</div>
			</div>
		</div>
	);
}

export default FullScreenWrapper;
