'use client';

import { useActionState, useState } from 'react';
import { SubmitButton } from '@/components/buttons/submit-button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { verifyCode } from '@/lib/authentication/actions';

type VerifyWaitingPageFormProps = {
	verificationTokenId: string;
};

function VerifyWaitingPageForm({ verificationTokenId }: VerifyWaitingPageFormProps) {
	const [code, setCode] = useState('');
	const [actionResult, actionMethod] = useActionState(verifyCode, {});

	return (
		<form action={async () => await actionMethod({ code, verificationTokenId })} className="flex flex-col items-center gap-4">
			<Label className="self-center text-center font-medium text-primary/80 text-sm tracking-tight" htmlFor="verification-code">
				Digite o código de verificação:
			</Label>
			<div className="flex justify-center">
				<InputOTP maxLength={6} onChange={(value) => setCode(value)} value={code}>
					<InputOTPGroup>
						<InputOTPSlot index={0} />
						<InputOTPSlot index={1} />
						<InputOTPSlot index={2} />
						<InputOTPSlot index={3} />
						<InputOTPSlot index={4} />
						<InputOTPSlot index={5} />
					</InputOTPGroup>
				</InputOTP>
			</div>

			{actionResult?.fieldError?.code && <p className="text-center text-destructive text-sm">{actionResult.fieldError.code}</p>}

			{actionResult?.formError && <p className="text-center text-destructive text-sm">{actionResult.formError}</p>}

			<SubmitButton className="w-full" disabled={code.length !== 6}>
				Verificar Código
			</SubmitButton>
		</form>
	);
}

export default VerifyWaitingPageForm;
