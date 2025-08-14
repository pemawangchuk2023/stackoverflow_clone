import { Badge } from "@/components/ui/badge";

const Chat = () => {
	return (
		<div className='space-y-2 flex flex-col items-center'>
			<Badge variant='secondary' className='gap-2'>
				<span className='text-4xl text-primary-500'>Coming Soon</span>
			</Badge>
		</div>
	);
};

export default Chat;
