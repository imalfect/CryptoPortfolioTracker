'use client';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import Image from 'next/image';
import { AnimationScope, motion } from 'framer-motion';
export default function IntroCards(props: { ref: AnimationScope }) {
	return (
		<div className={'flex flex-wrap gap-5 justify-center'}>
			<motion.div whileHover={{ x: 10, y: -5 }}>
				<Card className={'w-80 step-card opacity-0'}>
					<CardHeader className={'text-left'}>
						<CardTitle>Step 1</CardTitle>
						<CardDescription>Create your account</CardDescription>
					</CardHeader>
					<CardContent className={'flex justify-center align-middle'}>
						<Image
							src={'illustrations/mobile_login.svg'}
							alt="Create account"
							width={'300'}
							height={'300'}
						/>
					</CardContent>
					<CardFooter>
						<p>Create a Monetis account</p>
					</CardFooter>
				</Card>
			</motion.div>
			<motion.div whileHover={{ x: 10, y: -5 }}>
				<Card className={'w-80 step-card opacity-0'}>
					<CardHeader className={'text-left'}>
						<CardTitle>Step 2</CardTitle>
						<CardDescription>Register your holdings</CardDescription>
					</CardHeader>
					<CardContent className={'flex justify-center align-middle'}>
						<Image
							src={'illustrations/register_holdings.svg'}
							alt="Create account"
							width={'300'}
							height={'300'}
						/>
					</CardContent>
					<CardFooter>
						<p>Enter your holdings into the app with the intuitive UI</p>
					</CardFooter>
				</Card>
			</motion.div>
			<motion.div whileHover={{ x: 10, y: -5 }}>
				<Card className={'w-80 step-card opacity-0'}>
					<CardHeader className={'text-left'}>
						<CardTitle>Step 3</CardTitle>
						<CardDescription>Watch your account</CardDescription>
					</CardHeader>
					<CardContent className={'flex justify-center align-middle'}>
						<Image
							src={'illustrations/crypto_portfolio.svg'}
							alt="Create account"
							width={'300'}
							height={'300'}
						/>
					</CardContent>
					<CardFooter>
						<p>Watch your investments grow over time!</p>
					</CardFooter>
				</Card>
			</motion.div>
		</div>
	);
}
