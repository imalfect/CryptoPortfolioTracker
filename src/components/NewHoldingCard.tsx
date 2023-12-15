import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgePlus } from 'lucide-react';
import NewHoldingDialog from '@/components/NewHoldingDialog';
export default function NewHoldingCard(props: { userId: string; reload: () => void }) {
	return (
		<Card className={'w-80 text-left'}>
			<CardHeader>
				<CardTitle className={'flex items-center gap-3'}>
					<BadgePlus size={40} />
					New holding
				</CardTitle>
				<CardDescription>Add a new holding to your portfolio.</CardDescription>
			</CardHeader>
			<CardContent className={'flex flex-col justify-center'}>
				<NewHoldingDialog userId={props.userId} reload={props.reload} />
			</CardContent>
		</Card>
	);
}
