interface UserDisplayProps {
	avatarURL: string;
	name: string;
}
export default function UserDisplay(props: UserDisplayProps) {
	return (
		<div className={'flex flex-row items-center'}>
			<p className={'ml-2 text-xl'}>{props.name}</p>
		</div>
	);
}
