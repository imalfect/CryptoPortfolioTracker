import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import removeUserHolding from '../../../db/functions/removeUserHolding';
import Image from 'next/image';
interface RemoveHoldingProps {
	name: string;
	holding: number;
	price: number;
	symbol: string;
	icon: string;
	trigger: React.ReactNode;
	userId: string;
	cryptocurrencyId: string;
	reload: () => void;
}
const nf = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});
export default function RemoveHolding(props: RemoveHoldingProps) {
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);
	const { toast } = useToast();
	return (
		<Dialog
			open={isDialogOpen}
			onOpenChange={(status: boolean) => {
				setIsDialogOpen(status);
			}}
		>
			<DialogTrigger asChild>{props.trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Remove Holding</DialogTitle>
					<DialogDescription>
						Are you sure you want to remove this holding? This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<div>
					<div className={'flex items-center gap-2'}>
						<Image src={props.icon} height={32} width={32} className={'h-8'} alt={props.name + ' icon'} />
						<span className={'font-bold text-xl'}>{props.name}</span>
					</div>
					<div className={'mt-2'}>
						<p className={'text-4xl font-bold break-all'}>{nf.format(props.price * props.holding)}</p>
						<p className={'text-2xl font-bold break-all'}>
							{props.holding} {props.symbol}
						</p>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="secondary">Cancel</Button>
					</DialogClose>
					<Button
						variant="destructive"
						onClick={() => {
							removeUserHolding(props.userId, props.cryptocurrencyId)
								.then(() => {
									setIsDialogOpen(false);
									toast({
										title: '🗑️ Removed holding',
										description: `Removed ${props.holding} ${props.symbol} from your holdings.`,
										duration: 5000
									});
									props.reload();
								})
								.catch((e) => {
									toast({
										title: '🚨 Error',
										description: `An error occurred while removing your holding: ${e}`,
										duration: 5000
									});
								});
						}}
					>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
