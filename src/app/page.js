import { CreatePasskey } from '@/components/create-passkey';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UpdatePasskey from '@/components/update-passkey';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { getUserCredentials } from './_data/credentials';
import { getUser } from './_data/user';
import { Logout } from './auth/login/actions';
import DeletePasskey from '@/components/delete-passkey';
import { CONFIG } from '@/config';

export default async function Home() {
	const { name } = await getUser();
	const credentials = await getUserCredentials();

	return (
		<div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
			<main className='flex flex-col gap-4 row-start-2 items-center sm:items-start'>
				<h1 className='text-3xl'>Welcome, {name}</h1>
				<h5>Your Saved Passkeys</h5>
				{credentials?.length ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{credentials.map(cred => (
								<TableRow key={cred.id}>
									<TableCell>
										<div className='flex gap-4 items-center'>
											{CONFIG.aaguids[cred.aaguid]?.icon_light ? (
												<div className='p-2'>
													<Image src={CONFIG.aaguids[cred.aaguid]?.icon_dark} height={35} width={35} alt="Authenticator Logo" />
												</div>
											) : (
												<div className='text-4xl'>{cred?.name.charAt(0) || 'P'}</div>
											)}
											<div>
												<span className='text-lg'>{cred.name}</span>
												<div className='text-white/50'>
													Created on: <span>{cred.registered?.toDateString()}</span>
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<UpdatePasskey name={cred.name} credentialId={cred.id} />
										<DeletePasskey credentialId={cred.id} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<p className='text-sm text-center sm:text-left'>You don't have any saved passkeys yet.</p>
				)}

				<div className='flex gap-4 items-center flex-col sm:flex-row'>
					<CreatePasskey />
					<button
						className='rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44'
						rel='noopener noreferrer'
						onClick={Logout}
					>
						Logout
					</button>
				</div>
			</main>
			<footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'>
				<a className='flex items-center gap-2 hover:underline hover:underline-offset-4' href='https://web.dev/articles/passkey-registration' target='_blank' rel='noopener noreferrer'>
					<Image aria-hidden src='/file.svg' alt='File icon' width={16} height={16} />
					Learn
				</a>
				<a className='flex items-center gap-2 hover:underline hover:underline-offset-4' href='https://github.com/GoogleChromeLabs/passkeys-demo' target='_blank' rel='noopener noreferrer'>
					<Image aria-hidden src='/window.svg' alt='Window icon' width={16} height={16} />
					Another Example
				</a>
				<a
					className='flex items-center gap-2 hover:underline hover:underline-offset-4'
					href='https://developers.google.com/identity/passkeys/developer-guides/server-registration'
					target='_blank'
					rel='noopener noreferrer'
				>
					<Image aria-hidden src='/globe.svg' alt='Globe icon' width={16} height={16} />
					Official Blog →
				</a>
			</footer>
		</div>
	);
}
