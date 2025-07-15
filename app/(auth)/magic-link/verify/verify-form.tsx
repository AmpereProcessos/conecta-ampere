"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { verifyCode } from "@/lib/authentication/actions";
import React, { useActionState, useState } from "react";

type VerifyWaitingPageFormProps = {
	verificationTokenId: string;
};

function VerifyWaitingPageForm({ verificationTokenId }: VerifyWaitingPageFormProps) {
	const [code, setCode] = useState("");
	const [actionResult, actionMethod] = useActionState(verifyCode, {});

	const handleSubmit = async () => {
		await actionMethod({
			code: code,
			verificationTokenId: verificationTokenId,
		});
	};

	return (
		<form action={async () => await actionMethod({ code: code, verificationTokenId: verificationTokenId })} className="flex flex-col gap-4 items-center">
			<Label htmlFor="verification-code" className="text-sm font-medium tracking-tight text-primary/80 text-center self-center">
				Digite o código de verificação:
			</Label>
			<div className="flex justify-center">
				<InputOTP maxLength={6} value={code} onChange={(value) => setCode(value)}>
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

			{actionResult?.fieldError?.code && <p className="text-center text-sm text-destructive">{actionResult.fieldError.code}</p>}

			{actionResult?.formError && <p className="text-center text-sm text-destructive">{actionResult.formError}</p>}

			<SubmitButton disabled={code.length !== 6} className="w-full">
				Verificar Código
			</SubmitButton>
		</form>
	);
}

export default VerifyWaitingPageForm;
