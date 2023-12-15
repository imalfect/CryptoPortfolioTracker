import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import React from 'react';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import { AppWindowIcon, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
interface UserDropdownProps {
	userName: string;
	userAvatar: string;
}
export default function UserDropdown(props: UserDropdownProps) {
	const router = useRouter();
	const { toast } = useToast();
	// noinspection JSIgnoredPromiseFromCall
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={'outline'} size={'icon'}>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src={props.userAvatar} alt={props.userName} width={40} className={'rounded-full'} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align={'end'} className={'px-3'}>
				<DropdownMenuLabel className={'font-extrabold'}>My account</DropdownMenuLabel>
				<DropdownMenuLabel>Logged in as {props.userName}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className={'gap-3'}
					onClick={() => {
						router.push('/dashboard');
					}}
				>
					<AppWindowIcon /> Dashboard
				</DropdownMenuItem>
				<DropdownMenuItem
					className={'gap-3'}
					onClick={() => {
						signOut().then(() => {
							toast({
								title: '👋 Logged out',
								description: 'You have been logged out.',
								duration: 5000
							});
						});
					}}
				>
					<LogOut /> Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
