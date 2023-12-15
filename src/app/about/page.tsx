'use client';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { stagger, useAnimate } from 'framer-motion';
import { useEffect } from 'react';
const sequence = [
	['h1', { y: [100, 0], opacity: [0, 1] }, { duration: 0.5, type: 'spring' }],
	['h2', { y: [100, 0], opacity: [0, 1] }, { duration: 0.5, type: 'spring' }],
	[
		'.step-card',
		{ y: [100, 0], opacity: [0, 1] },
		{ duration: 0.5, type: 'spring', delay: stagger(0.3) }
	]
];
export default function Page() {
	const [scope, animate] = useAnimate();
	useEffect(() => {
		// @ts-ignore
		animate(sequence);
	}, []);
	return (
		<section className={'text-center flex flex-col items-center p-24'} ref={scope}>
			<h1 className="text-8xl font-extrabold">About</h1>
			<h2 className={`text-3xl font-medium mt-4`}>
				Monetis is a simple portfolio tracker for cryptocurrencies.
			</h2>
			<div className={'flex flex-wrap gap-5 justify-center mt-3'}>
				<Card className={'w-80 step-card'}>
					<CardHeader className={'text-left'}>
						<CardTitle>Goal</CardTitle>
						<CardDescription>Monetis was made as a school project</CardDescription>
					</CardHeader>
					<CardContent className={'flex justify-center align-middle'}>
						<Image src={'illustrations/goal.svg'} alt="Create account" width={'300'} height={'300'} />
					</CardContent>
				</Card>
				<Card className={'w-80 step-card'}>
					<CardHeader className={'text-left'}>
						<CardTitle>Tech stack</CardTitle>
						<CardDescription>
							Monetis uses NextJS, shadcn/ui, NextAuth, Drizzle ORM and Postgres
						</CardDescription>
					</CardHeader>
					<CardContent className={'flex justify-center align-middle'}>
						<Image
							src={'illustrations/code_inspection.svg'}
							alt="Create account"
							width={'300'}
							height={'300'}
						/>
					</CardContent>
				</Card>
				<Card className={'w-80 step-card'}>
					<CardHeader className={'text-left'}>
						<CardTitle>Time spent</CardTitle>
						<CardDescription>
							According to WakaTime, this project took around 16 hours to complete.
						</CardDescription>
					</CardHeader>
					<CardContent className={'flex justify-center align-middle'}>
						<Image
							src={'illustrations/time_management.svg'}
							alt="Create account"
							width={'300'}
							height={'300'}
						/>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
