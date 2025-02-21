"use client";
import ErrorComponent from "@/components/layout/ErrorComponent";
import LoadingComponent from "@/components/layout/LoadingComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { getErrorMessage } from "@/lib/methods/errors";
import { useUserProfile } from "@/lib/queries/profile";
import { useQueryClient } from "@tanstack/react-query";
import { Settings, UserRound } from "lucide-react";
import UserAvatarConfig from "./UserAvatarConfig";
import UserGeneralInfoConfig from "./UserGeneralInfoConfig";
import UserLocationInfoConfig from "./UserLocationInfoConfig";

type UserProfileConfigProps = {
	sessionUser: TAuthSession["user"];
};
function UserProfileConfig({ sessionUser }: UserProfileConfigProps) {
	const queryClient = useQueryClient();

	const { data: profile, isLoading, isError, isSuccess, error } = useUserProfile();

	const handleOnMutate = async () =>
		await queryClient.cancelQueries({
			queryKey: ["profile"],
		});
	const handleOnSettled = async () =>
		await queryClient.invalidateQueries({
			queryKey: ["profile"],
		});
	return (
		<div className="bg-[#fff] dark:bg-[#121212] w-full flex p-3.5 flex-col gap-1.5 shadow-sm border border-primary/20 rounded-lg">
			<div className="w-full flex items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<UserRound className="w-4 h-4 lg:w-6 lg:h-6 min-w-4 min-h-4" />
					<h1 className="text-sm lg:text-lg font-bold leading-none tracking-tight">MEU PERFIL</h1>
				</div>
			</div>
			<div className="w-full flex flex-col items-center justify-center grow py-3 px-0 lg:px-6 gap-1.5">
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<>
						<UserAvatarConfig
							profile={profile}
							callbacks={{
								onMutate: handleOnMutate,
								onSettled: handleOnSettled,
							}}
						/>
						<UserGeneralInfoConfig
							profile={profile}
							callbacks={{
								onMutate: handleOnMutate,
								onSettled: handleOnSettled,
							}}
						/>
						<UserLocationInfoConfig
							profile={profile}
							callbacks={{
								onMutate: handleOnMutate,
								onSettled: handleOnSettled,
							}}
						/>
					</>
				) : null}
			</div>
		</div>
	);
}
export default UserProfileConfig;
