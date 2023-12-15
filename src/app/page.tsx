'use client';
import IntroCards from '@/components/IntroCards';
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
export default function Home() {
	const [scope, animate] = useAnimate();
	useEffect(() => {
		// @ts-ignore
		animate(sequence);
	}, []);
	return (
		<main className="flex flex-col items-center p-24" ref={scope}>
			<section className={'text-center'}>
				<h1 className="text-8xl font-extrabold opacity-0">Monetis</h1>
				<h2 className={`text-4xl font-bold mt-2 opacity-0`}>
					A simple, fast, and secure way to track your crypto holdings.
				</h2>
			</section>
			<section className={'mt-5'}>
				<IntroCards ref={scope} />
			</section>
		</main>
	);
}
