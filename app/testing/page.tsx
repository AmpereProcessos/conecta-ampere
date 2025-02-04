"use client";
import DateInput from "@/components/inputs/DateInput";
import MultiSelectInput from "@/components/inputs/MultiSelectInput";
import NumberInput from "@/components/inputs/NumberInput";
import SelectInput from "@/components/inputs/SelectInput";
import TextareaInput from "@/components/inputs/TextareaInput";
import TextInput from "@/components/inputs/TextInput";
import FullScreenWrapper from "@/components/layout/FullScreenWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	formatDateForInput,
	formatDateInputChange,
} from "@/lib/methods/formatting";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import AmpereLogo from "@/svgs/ampere-blue-logo-icon.svg";
function TestingPage() {
	const [infoHolder, setInfoHolder] = useState({
		name: "",
		description: "",
		age: 0,
		techStack: ["USUÁRIO"] as string[],
		insertDate: new Date().toISOString(),
		type: null as string | null,
	});
	function updateInfoHolder(info: Partial<typeof infoHolder>) {
		setInfoHolder((prev) => ({ ...prev, ...info }));
	}
	return (
		<FullScreenWrapper>
			<div className="w-full flex items-center justify-center grow bg-background">
				<div className="w-[60%] flex flex-col p-3 rounded-lg border border-primary/50 gap-3 self-center">
					<TextInput
						labelText="NOME"
						placeholderText="Preencha aqui seu nome.."
						value={infoHolder.name}
						handleChange={(value) => updateInfoHolder({ name: value })}
					/>
					<TextareaInput
						labelText="SOBRE VOCÊ"
						placeholderText="Preencha aqui sobre você.."
						value={infoHolder.name}
						handleChange={(value) => updateInfoHolder({ name: value })}
					/>
					<DateInput
						labelText="DATA DE CRIAÇÃO DO REGISTRO"
						value={formatDateForInput(infoHolder.insertDate)}
						handleChange={(value) =>
							updateInfoHolder({
								insertDate: formatDateInputChange(value, "string") as string,
							})
						}
					/>
					<NumberInput
						labelText="IDADE"
						value={infoHolder.age}
						placeholderText="Preencha aqui a sua idade..."
						handleChange={(value) => updateInfoHolder({ age: value })}
					/>
					<SelectInput
						labelText="TIPO"
						placeholderText="Preencha o tipo do usuário"
						resetOptionText="NÃO DEFINIDO"
						value={infoHolder.type}
						options={[
							{
								id: 1,
								label: "USUÁRIO",
								value: "USUÁRIO",
								startContent: (
									<Avatar className="w-6 h-6">
										<AvatarImage
											src={
												"https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/saas-crm%2Fusuarios%2FLUCAS%20FERNANDES?alt=media&token=3b345c22-c4d2-46cc-865e-8544e29e76a4"
											}
											alt="Logo"
										/>
										<AvatarFallback>N</AvatarFallback>
									</Avatar>
								),
							},
							{ id: 2, label: "ADMIN", value: "ADMIN" },
							{ id: 3, label: "USUÁRIO 1", value: "USUÁRIO 1" },
							{ id: 4, label: "USUÁRIO 2", value: "USUÁRIO 2" },
							{ id: 5, label: "USUÁRIO 3", value: "USUÁRIO 3" },
							{ id: 6, label: "USUÁRIO 4", value: "USUÁRIO 4" },
							{ id: 7, label: "USUÁRIO 5", value: "USUÁRIO 5" },
							{ id: 8, label: "USUÁRIO 6", value: "USUÁRIO 6" },
							{ id: 9, label: "USUÁRIO 7", value: "USUÁRIO 7" },
							{ id: 10, label: "USUÁRIO 8", value: "USUÁRIO 8" },
							{ id: 11, label: "USUÁRIO 9", value: "USUÁRIO 9" },
							{ id: 12, label: "USUÁRIO 10", value: "USUÁRIO 10" },
						]}
						optionsStartContent={<Plus />}
						handleChange={(value) => updateInfoHolder({ type: value })}
						handleReset={() => updateInfoHolder({ type: null })}
					/>
					<MultiSelectInput
						labelText="TECNOLOGIAS"
						value={infoHolder.techStack}
						placeholderText="Preencha tecnologias com maestria..."
						options={[
							{
								id: 1,
								label: "USUÁRIO",
								value: "USUÁRIO",
								startContent: (
									<Avatar className="w-6 h-6">
										<AvatarImage
											src={
												"https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/saas-crm%2Fusuarios%2FLUCAS%20FERNANDES?alt=media&token=3b345c22-c4d2-46cc-865e-8544e29e76a4"
											}
											alt="Logo"
										/>
										<AvatarFallback>N</AvatarFallback>
									</Avatar>
								),
							},
							{ id: 2, label: "ADMIN", value: "ADMIN" },
							{ id: 3, label: "USUÁRIO 1", value: "USUÁRIO 1" },
							{ id: 4, label: "USUÁRIO 2", value: "USUÁRIO 2" },
							{ id: 5, label: "USUÁRIO 3", value: "USUÁRIO 3" },
							{ id: 6, label: "USUÁRIO 4", value: "USUÁRIO 4" },
							{ id: 7, label: "USUÁRIO 5", value: "USUÁRIO 5" },
							{ id: 8, label: "USUÁRIO 6", value: "USUÁRIO 6" },
							{ id: 9, label: "USUÁRIO 7", value: "USUÁRIO 7" },
							{ id: 10, label: "USUÁRIO 8", value: "USUÁRIO 8" },
							{ id: 11, label: "USUÁRIO 9", value: "USUÁRIO 9" },
							{ id: 12, label: "USUÁRIO 10", value: "USUÁRIO 10" },
						]}
						handleChange={(value) => updateInfoHolder({ techStack: value })}
						handleReset={() => updateInfoHolder({ techStack: [] })}
						resetOptionText="NÃO DEFINIDAS"
					/>
				</div>
			</div>
		</FullScreenWrapper>
	);
}

export default TestingPage;
