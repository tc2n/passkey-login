'use client';
import { deleteCredential } from '@/app/auth/_passkey/client';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export default function DeletePasskey({ credentialId }) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleDelete = async () => {
		try {
			setIsLoading(true);
			await deleteCredential(credentialId);
			setDialogOpen(false);
			toast({
				description: `Deleted Passkey`,
			});
		} catch (e) {
			console.error(e);
			toast({
				variant: 'destructive',
				title: 'Error Deleting Passkey',
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
					<Trash />
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Delete Credential</DialogTitle>
					<DialogDescription>This will Delete the Passkey permanently</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button type='button' variant='secondary'>
							Close
						</Button>
					</DialogClose>
					<Button variant='destructive' disabled={isLoading} onClick={handleDelete}>
						{isLoading && <Loader2 className='animate-spin' />}
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
