'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppWindowIcon, GithubIcon, HomeIcon, InfoIcon, MenuIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/components/ModeToggle';
import { useSession } from 'next-auth/react';
import UserDropdown from '@/components/UserDropdown';
export default function Navbar() {
	const { data: session, status } = useSession();
	const [isSignedIn, setIsSignedIn] = React.useState(false);
	const [userName, setUserName] = React.useState('');
	const [userAvatar, setUserAvatar] = React.useState('');
	useEffect(() => {
		if (status === 'authenticated') {
			setIsSignedIn(true);
			setUserName(session?.user?.name as string);
			setUserAvatar(session?.user?.image as string);
		} else if (status === 'loading') {
			console.log('Hang on there...');
		} else {
			console.log('Not signed in.');
		}
	}, [session, status]);
	return (
		<nav className={'pt-2 px-6 flex items-center space-x-4 lg:space-x-6 justify-between'}>
			<div>
				<Link href={'/'}>
					<p className={'text-2xl font-bold'}>Monetis</p>
				</Link>
			</div>

			<div className="flex items-center space-x-4">
				{isSignedIn ? (
					<Button variant={'outline'} size={'icon'}>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<UserDropdown userName={userName} userAvatar={userAvatar} />
					</Button>
				) : null}
				<Link href={'/dashboard'}>
					<Button variant={'default'}>Dashboard</Button>
				</Link>
				<div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant={'outline'} size={'icon'}>
								<MenuIcon />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align={'end'}>
							<DropdownMenuItem>
								<HomeIcon size={19} className={'mr-1'} />
								<Link href={'/'}>Home</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<AppWindowIcon size={19} className={'mr-1'} />
								<Link href={'/dashboard'}>Dashboard</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<InfoIcon size={19} className={'mr-1'} />
								<Link href={'/about'}>About</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<GithubIcon size={19} className={'mr-1'} />
								<a href={'https://github.com/imalfect/Monetis'} target={'_blank'} rel={'noreferrer'}>
									GitHub
								</a>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<ModeToggle />
			</div>
		</nav>
	);
}
