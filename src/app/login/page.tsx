'use client';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
export default function Page() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const userEmail = session?.user?.email;
	useEffect(() => {
		if (status === 'authenticated') {
			console.log('Signed in as ' + userEmail);
			router.push('/dashboard');
		} else if (status === 'loading') {
			console.log('Hang on there...');
		} else {
			console.log('Not signed in.');
		}
	}, [status]);
	return (
		<section className={'text-center flex flex-col items-center p-24'}>
			<h1 className="text-8xl font-extrabold">Sign in</h1>
			<h2 className={`text-3xl font-medium mt-4`}>
				Sign it to Monetis to view your crypto portfolio.
			</h2>
			<Button
				onClick={() => signIn('discord')}
				variant="default"
				style={{ backgroundColor: '#5865F2' }}
				className={'mt-4'}
			>
				<Image
					src={'discord_icon.svg'}
					width={24}
					height={24}
					alt={'Discord Logo'}
					className={'mr-2'}
				/>
				Sign in with Discord
			</Button>
		</section>
	);
}
