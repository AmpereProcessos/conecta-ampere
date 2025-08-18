'use client';
import { useQueryClient } from '@tanstack/react-query';
import { UserRound } from 'lucide-react';
import ErrorComponent from '@/components/layout/ErrorComponent';
import LoadingComponent from '@/components/layout/LoadingComponent';
import { getErrorMessage } from '@/lib/methods/errors';
import { useUserProfile } from '@/lib/queries/profile';
import UserAvatarConfig from './UserAvatarConfig';
import UserGeneralInfoConfig from './UserGeneralInfoConfig';
import UserLocationInfoConfig from './UserLocationInfoConfig';

function UserProfileConfig() {
	const queryClient = useQueryClient();

	const { data: profile, isLoading, isError, isSuccess, error } = useUserProfile();

	const handleOnMutate = async () =>
		await queryClient.cancelQueries({
			queryKey: ['profile'],
		});
	const handleOnSettled = async () =>
		await queryClient.invalidateQueries({
			queryKey: ['profile'],
		});
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-white p-3.5 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<UserRound className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">MEU PERFIL</h1>
				</div>
			</div>
			<div className="flex w-full grow flex-col items-center justify-center gap-1.5 px-0 py-3 lg:px-6">
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<>
						<UserAvatarConfig
							callbacks={{
								onMutate: handleOnMutate,
								onSettled: handleOnSettled,
							}}
							profile={profile}
						/>
						<UserGeneralInfoConfig
							callbacks={{
								onMutate: handleOnMutate,
								onSettled: handleOnSettled,
							}}
							profile={profile}
						/>
						<UserLocationInfoConfig
							callbacks={{
								onMutate: handleOnMutate,
								onSettled: handleOnSettled,
							}}
							profile={profile}
						/>
					</>
				) : null}
			</div>
		</div>
	);
}
export default UserProfileConfig;
