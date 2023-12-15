'use client';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import getCryptocurrencyData from '../../db/functions/getCryptocurrencyData';
import setUserHolding from '../../db/functions/setUserHolding';
import { useToast } from '@/components/ui/use-toast';

export default function NewHoldingDialog(props: { userId: string; reload: () => void }) {
	const toast = useToast();
	const [error, setError] = useState('');
	const [cryptoId, setCryptoId] = useState('');
	const [cryptoIdValid, setCryptoIdValid] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	// All lowercase no spaces regex
	const cryptoIdRegex = new RegExp('^[a-z0-9-]+$');
	const cryptoUrlChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCryptoId(e.target.value);
		const match = cryptoIdRegex.test(e.target.value);
		console.log(match);
		if (match) {
			setCryptoIdValid(true);
		} else {
			setCryptoIdValid(false);
		}
	};
	const createHolding = async () => {
		// Get the cryptocurrency ID from the URL
		const cryptoInfo = await getCryptocurrencyData(cryptoId!).catch((e) => {
			setError('Crypto not supported');
		});
		if (cryptoInfo) {
			setUserHolding(props.userId, cryptoId!, 0)
				.catch((e) => {
					setError(e.message);
				})
				.then(() => {
					props.reload();
					toast.toast({
						title: '👍 Holding created',
						description: `You have created a new holding for ${cryptoInfo.name}.`,
						duration: 5000
					});
					setIsDialogOpen(false);
					setError('');
					setCryptoId('');
					setCryptoIdValid(false);
				});
		}
	};
	useEffect(() => {}, []);
	return (
		<Dialog
			open={isDialogOpen}
			onOpenChange={(status: boolean) => {
				setIsDialogOpen(status);
			}}
		>
			<DialogTrigger>
				<Button variant={'secondary'} size={'icon'} className={'w-40 h-40'}>
					<Plus size={80} />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a new holding</DialogTitle>
					<DialogDescription>
						Visit{' '}
						<a href={'https://coingecko.com'} target={'_blank'} rel={'noreferrer'}>
							CoinGecko
						</a>{' '}
						to find the cryptocurrency you want to add, copy its API ID and paste it below.
					</DialogDescription>
				</DialogHeader>
				<div className={'flex flex-col items-center'}>
					<Input
						onChange={cryptoUrlChanged}
						color={'#FF0000'}
						className={clsx(
							'border-2',
							cryptoIdValid ? 'border-green-500' : null,
							!cryptoIdValid && cryptoId !== '' ? 'border-red-500' : null
						)}
					/>
					<Button
						className={'mt-4'}
						disabled={!cryptoIdValid}
						onClick={() => {
							// noinspection JSIgnoredPromiseFromCall
							createHolding();
						}}
					>
						Create holding
					</Button>
					{error !== '' ? <p className={'text-red-500'}>{error}</p> : null}
				</div>
			</DialogContent>
		</Dialog>
	);
}
