import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Minus, Plus, TrashIcon } from 'lucide-react';
import { LineChart, Line } from 'recharts';
import { Button } from '@/components/ui/button';
import RemoveHolding from '@/components/holding/RemoveHolding';
import UpdateHolding from '@/components/holding/UpdateHolding';
// @ts-ignore
import scientificToDecimal from 'scientific-to-decimal';
import { clsx } from 'clsx';
interface CryptoHoldingCardProps {
	name: string;
	symbol: string;
	icon: string;
	holding: number;
	price: number;
	data: number[];
	change: number;
	cryptocurrencyId: string;
	userId: string;
	reload: () => void;
}
const nf = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2
});
const cf = new Intl.NumberFormat('en-US');
function formatPrice(price: number) {
	const decimals = countDecimals(scientificToDecimal(price.toString()));
	const nfa = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: decimals
	});
	return nfa.format(price);
}
export default function CryptoHoldingCard(props: CryptoHoldingCardProps) {
	const data = props.data.map((value) => ({
		price: value
	}));
	return (
		<Card
			className={
				'sm:max-w-sm md:max-w-md lg:max-w-lg step-card text-left justify-between flex flex-col'
			}
		>
			<CardHeader>
				<CardTitle className={'flex items-start gap-2 flex-col'}>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<div className={'flex items-center gap-1'}>
						<Image src={props.icon} width={48} height={48} alt={''} /> {props.name}
					</div>

					<p className={'text-4xl font-bold break-all'}>{nf.format(props.price * props.holding)}</p>
					<p className={'text-2xl font-bold break-all'}>
						{cf.format(props.holding)} {props.symbol}
					</p>
				</CardTitle>
			</CardHeader>
			<CardContent className={'w-80'}>
				<div>
					<LineChart
						width={280}
						height={200}
						data={data}
						margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
					>
						<Line
							type="monotone"
							dataKey="price"
							stroke={props.change.toString().startsWith('-') ? '#ff4a4a' : '#4aff74'}
							strokeWidth={5}
							dot={false}
						/>
					</LineChart>
				</div>
			</CardContent>
			<CardFooter className={'flex justify-between flex-col'}>
				<div className={'flex justify-between flex-col w-full'}>
					<div className={'flex flex-row justify-between mt-1'}>
						<p className={'text-xl font-bold'}>24h Change</p>
						<p
							className={clsx(
								'text-xl font-bold',
								props.change.toString().startsWith('-') ? 'text-red-500' : 'text-green-500'
							)}
						>
							{props.change.toString().startsWith('-') ? '' : '+'}
							{props.change}%
						</p>
					</div>
					<div className={'flex flex-row justify-between mt-1'}>
						<p className={'text-xl font-bold'}>Price</p>
						<p
							className={clsx(
								'text-xl font-bold',
								props.change.toString().startsWith('-') ? 'text-red-500' : 'text-green-500'
							)}
						>
							{formatPrice(props.price)}
						</p>
					</div>
				</div>
				<div className={'flex gap-4 justify-between w-full mt-3'}>
					<div className={'flex gap-3'}>
						<UpdateHolding
							name={props.name}
							symbol={props.symbol}
							icon={props.icon}
							currentHolding={props.holding}
							price={props.price}
							cryptocurrencyId={props.cryptocurrencyId}
							userId={props.userId}
							updateType={'increase'}
							reload={props.reload}
							trigger={
								<Button variant={'secondary'} size={'icon'}>
									<Plus />
								</Button>
							}
						/>

						<UpdateHolding
							name={props.name}
							symbol={props.symbol}
							icon={props.icon}
							currentHolding={props.holding}
							price={props.price}
							cryptocurrencyId={props.cryptocurrencyId}
							userId={props.userId}
							updateType={'decrease'}
							reload={props.reload}
							trigger={
								<Button variant={'secondary'} size={'icon'}>
									<Minus />
								</Button>
							}
						/>
					</div>
					<RemoveHolding
						name={props.name}
						symbol={props.symbol}
						icon={props.icon}
						holding={props.holding}
						price={props.price}
						userId={props.userId}
						reload={props.reload}
						cryptocurrencyId={props.cryptocurrencyId}
						trigger={
							<Button variant={'destructive'} size={'icon'}>
								<TrashIcon />
							</Button>
						}
					/>
				</div>
			</CardFooter>
		</Card>
	);
}
function countDecimals(number: number) {
	const decimalIndex = number.toString().indexOf('.');
	return decimalIndex >= 0 ? number.toString().length - decimalIndex - 1 : 0;
}
