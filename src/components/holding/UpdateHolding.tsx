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
import { Input } from '@/components/ui/input';
import { ToggleGroupItem } from '@/components/ui/toggle-group';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { Bitcoin, DollarSign } from 'lucide-react';
import React, { useEffect } from 'react';
import BigNumber from 'bignumber.js';
import setUserHolding from '../../../db/functions/setUserHolding';
import { useToast } from '@/components/ui/use-toast';
interface UpdateHoldingProps {
	name: string;
	icon: string;
	symbol: string;
	cryptocurrencyId: string;
	currentHolding: number;
	price: number;
	updateType: 'increase' | 'decrease';
	trigger: React.ReactNode;
	userId: string;
	reload: () => void;
}
const nf = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});
export default function UpdateHolding(props: UpdateHoldingProps) {
	const { toast } = useToast();
	const [inputType, setInputType] = React.useState<'crypto' | 'fiat'>('crypto');
	// String because of inaccuracy with floating point numbers
	const [amount, setAmount] = React.useState('0');
	const [totalCrypto, setTotalCrypto] = React.useState('0');
	const [totalFiat, setTotalFiat] = React.useState(0);
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);
	const amountChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Check decimals
		const decimalCount = (e.target.value.split('.')[1] || []).length;
		console.log(decimalCount);
		if (e.target.value === '') {
			e.target.value = '0';
		}
		if (new BigNumber(e.target.value).isNegative()) {
			setAmount('0');
			return;
		}
		let allowedDecimals = inputType === 'crypto' ? 18 : 2;
		if (!(decimalCount > allowedDecimals)) {
			if (inputType === 'crypto') {
				if (props.updateType === 'decrease') {
					const totalCrypto = new BigNumber(props.currentHolding).minus(e.target.value).toFixed();
					const totalFiat = new BigNumber(props.currentHolding)
						.times(props.price)
						.minus(new BigNumber(e.target.value).times(props.price))
						.toNumber();
					if (new BigNumber(totalCrypto).isNegative() || new BigNumber(totalFiat).isNegative()) {
						setAmount(e.target.value.slice(0, -1));
						return;
					}
					setTotalCrypto(totalCrypto);
					setTotalFiat(totalFiat);
				} else {
					setTotalCrypto(
						new BigNumber(e.target.value).plus(new BigNumber(props.currentHolding)).toFixed()
					);
					setTotalFiat(
						new BigNumber(e.target.value)
							.plus(new BigNumber(props.currentHolding))
							.times(new BigNumber(props.price))
							.toNumber()
					);
				}
			} else {
				const fiatToCrypto = new BigNumber(e.target.value).dividedBy(props.price).toFixed();
				const currentCryptoToFiat = new BigNumber(props.currentHolding).times(props.price).toFixed();
				if (props.updateType === 'decrease') {
					const totalCrypto = new BigNumber(props.currentHolding)
						.minus(new BigNumber(fiatToCrypto))
						.toFixed(6);
					const totalFiat = new BigNumber(currentCryptoToFiat).minus(e.target.value).toNumber();
					// Check if totalCrypto is negative
					if (new BigNumber(totalCrypto).isNegative() || new BigNumber(totalFiat).isNegative()) {
						setAmount(e.target.value.slice(0, -1));
						return;
					}
					setTotalCrypto(totalCrypto);
					setTotalFiat(totalFiat);
				} else {
					setTotalCrypto(
						new BigNumber(fiatToCrypto).plus(new BigNumber(props.currentHolding)).toFixed(6)
					);
					setTotalFiat(
						new BigNumber(e.target.value).plus(new BigNumber(currentCryptoToFiat)).toNumber()
					);
				}
			}
			setAmount(e.target.value);
		} else {
			setAmount(e.target.value.slice(0, -1));
			console.log('Too many decimals!');
		}
	};
	useEffect(() => {
		// @ts-ignore
		amountChanged({ target: { value: '0' } });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
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
					<DialogTitle>{props.updateType === 'increase' ? 'Increase' : 'Decrease'} Holding</DialogTitle>
					<DialogDescription>
						Update your holdings for {props.name} ({props.symbol}).
					</DialogDescription>
				</DialogHeader>
				<div>
					<div className={'flex gap-2'}>
						<Input className={'w-40'} type={'number'} value={amount} onInput={amountChanged} />
						<ToggleGroup type="single" value={inputType}>
							<ToggleGroupItem
								value="crypto"
								aria-label="Select currency"
								onClick={() => {
									setInputType('crypto');
									setAmount('0');
									// @ts-ignore
									amountChanged({ target: { value: '0' } });
								}}
							>
								<Bitcoin className="h-4 w-4" />
							</ToggleGroupItem>
							<ToggleGroupItem
								value="fiat"
								aria-label="Select fiat"
								onClick={() => {
									setInputType('fiat');
									setAmount('0');
									// @ts-ignore
									amountChanged({ target: { value: '0' } });
								}}
							>
								<DollarSign className="h-4 w-4" />
							</ToggleGroupItem>
						</ToggleGroup>
					</div>

					<div className={'flex items-center gap-2 mt-3'}>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={props.icon} className={'h-8'} alt={'cryptocurrency icon'} />
						&nbsp;
						<span className={'font-bold text-xl'}>{props.name}</span>
					</div>
					<div className={'mt-2 break-all'}>
						<p className={'text-4xl font-bold'}>{nf.format(totalFiat)}</p>
						<p className={'text-2xl font-bold'}>
							{totalCrypto}
							&nbsp;
							{props.symbol}
						</p>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="secondary">Cancel</Button>
					</DialogClose>
					<Button
						variant="default"
						onClick={() => {
							setUserHolding(props.userId, props.cryptocurrencyId, totalCrypto as unknown as number)
								.then(() => {
									setIsDialogOpen(false);
									toast({
										title: '📈 Updated holding',
										description: `Updated your holdings for ${props.name} (${props.symbol}) to ${totalCrypto} ${props.symbol}.`,
										duration: 5000
									});
									props.reload();
								})
								.catch((e) => {
									toast({
										title: '🚨 Error',
										description: `An error occurred while updating your holding: ${e}`,
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
