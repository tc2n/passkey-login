'use client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Edit2 } from 'lucide-react';
import { Input } from './ui/input';
import { updateName } from '@/app/auth/_passkey/actions';

export default function UpdatePasskey({ name, credentialId }) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [value, setValue] = useState(name);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleUpdateValue = async () => {
		try {
			setIsLoading(true);
			const { newName, error } = await updateName(value, credentialId);
			if (newName) {
                setDialogOpen(false);
				toast({
					description: `Credential Name updated to ${newName}`,
				});
			} else {
				toast({
					variant: 'destructive',
					title: 'Error Updating Credential Name',
					description: error || 'Unknown Error',
				});
			}
		} catch (e) {
			console.error(e);
			toast({
				variant: 'destructive',
				title: 'Error Updating Credential Name',
				description: e.message || 'Unknown Error',
			});
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant='ghost'>
					<Edit2 />
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Edit Credential</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Input
							id='name'
							placeholder='Enter New Name'
							value={value}
							onChange={e => {
								setValue(e.target.value);
							}}
							className='col-span-4'
						/>
					</div>
				</div>
				<DialogFooter>
					<Button disabled={isLoading} onClick={handleUpdateValue}>
						{isLoading && <Loader2 className='animate-spin' />}
						Update Name
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
