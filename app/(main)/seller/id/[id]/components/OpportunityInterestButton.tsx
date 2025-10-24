'use client';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { LoadingButton } from '@/components/buttons/loading-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import type { TSessionUser } from '@/lib/authentication/types';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { getErrorMessage } from '@/lib/methods/errors';
import { createIndication } from '@/lib/mutations/indications';
import { cn } from '@/lib/utils';
import type { TIndication } from '@/schemas/indication.schema';

type OpportunityInterestButtonProps = {
	sessionUser: TSessionUser;
	sellerId: string;
	sellerName: string;
	sellerPhone: string;
	whatsappHref: string;
	buttonLabel: string;
	buttonIcon?: React.ReactNode;
	className?: string;
};
export default function OpportunityInterestButton({ sessionUser, sellerId, sellerName, whatsappHref, buttonLabel, buttonIcon, className }: OpportunityInterestButtonProps) {
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const isDesktop = useMediaQuery('(min-width: 768px)');

	const { mutate: createSelfIndication, isPending } = useMutation({
		mutationKey: ['create-self-indication', sellerId],
		mutationFn: () => {
			const selfIndication: TIndication = {
				nome: sessionUser.nome,
				telefone: sessionUser.telefone || '',
				uf: '',
				cidade: '',
				tipo: {
					id: '661dc2e36dd818643c532cda',
					titulo: 'SISTEMA FOTOVOLTAICO',
					categoriaVenda: 'KIT',
				},
				autor: {
					id: sessionUser.id,
					nome: sessionUser.nome,
					avatar_url: sessionUser.avatar_url,
				},
				oportunidade: {
					id: '',
					nome: '',
					identificador: '',
				},
				codigoIndicacaoVendedor: sellerId,
				dataInsercao: new Date().toISOString(),
			};
			return createIndication(selfIndication);
		},
		onSuccess: () => {
			toast.success('Oportunidade criada! Redirecionando para o WhatsApp...');
			setTimeout(() => {
				if (whatsappHref) {
					window.open(whatsappHref, '_blank', 'noopener,noreferrer');
				}
				setShowConfirmDialog(false);
			}, 1000);
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			toast.error(msg);
		},
	});

	const content = (
		<div className="flex flex-col gap-3 px-4">
			<p className="text-sm">
				Ao confirmar, você será redirecionado para o WhatsApp de <strong>{sellerName}</strong> para iniciar a conversa.
			</p>
			<div className="rounded-lg bg-primary/5 p-3">
				<p className="text-center font-medium text-primary/80 text-xs">Esta é uma forma rápida de saber mais sobre energia solar diretamente com este vendedor.</p>
			</div>
		</div>
	);

	return (
		<>
			<Button className={cn('w-full lg:w-auto', className)} onClick={() => setShowConfirmDialog(true)} size="sm" variant="default">
				{buttonIcon}
				{buttonLabel}
			</Button>

			{showConfirmDialog ? (
				isDesktop ? (
					<Dialog onOpenChange={() => setShowConfirmDialog(false)} open>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>QUERO SABER MAIS SOBRE ENERGIA SOLAR</DialogTitle>
								<DialogDescription>Confirme para falar com {sellerName}</DialogDescription>
							</DialogHeader>
							{content}
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">CANCELAR</Button>
								</DialogClose>
								<LoadingButton loading={isPending} onClick={() => createSelfIndication()}>
									CONFIRMAR E FALAR NO WHATSAPP
								</LoadingButton>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				) : (
					<Drawer onOpenChange={() => setShowConfirmDialog(false)} open>
						<DrawerContent>
							<DrawerHeader className="text-left">
								<DrawerTitle>QUERO SABER MAIS SOBRE ENERGIA SOLAR</DrawerTitle>
								<DrawerDescription>Confirme para falar com {sellerName}</DrawerDescription>
							</DrawerHeader>
							{content}
							<DrawerFooter className="pt-2">
								<LoadingButton loading={isPending} onClick={() => createSelfIndication()}>
									CONFIRMAR E FALAR NO WHATSAPP
								</LoadingButton>
								<DrawerClose asChild>
									<Button variant="outline">CANCELAR</Button>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				)
			) : null}
		</>
	);
}
