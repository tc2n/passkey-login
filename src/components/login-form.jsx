'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { login } from '@/app/auth/login/actions';
import { Loader2 } from 'lucide-react';
import { Fingerprint } from 'lucide-react';
import { isPublicKeyCredentialSupported } from '@/utils/isWebAuthnSupported';
import { authenticateUser } from '@/app/auth/_passkey/client';

export function LoginForm({ className, ...props }) {
	const queryParams = useSearchParams();
	const isSignUp = queryParams.get('from-signup');
	const isWebAuthnUsable = isPublicKeyCredentialSupported();
	const { toast } = useToast();

	const [state, action, pending] = useActionState(login);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isSignUp) {
			toast({
				title: 'User Created Successfully',
				description: 'Signin to Use Our Services',
			});
		}
		if (state?.error) {
			toast({
				variant: 'destructive',
				title: 'Uh oh! Something went wrong.',
				description: state.error,
			});
		}
	}, [state?.timestamp]);

	const handlePasskeyLogin = async (conditional = false) => {
		try {
			setIsLoading(true);
			await authenticateUser(conditional);
		} catch (e) {
			toast({
				variant: 'destructive',
				title: 'Error Logging in Using Passkey',
				description: e.message || 'Please try using password',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className='text-center'>
					<CardTitle className='text-xl'>Welcome back</CardTitle>
					<CardDescription>Login to Create a new Passkey</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={action}>
						<div className='grid gap-6'>
							<div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'></div>
							<div className='grid gap-6'>
								<div className='grid gap-2'>
									<Label htmlFor='email'>Email</Label>
									<Input id='email' name='email' type='email' placeholder='josh@example.com' autoComplete='email webauthn' required />
								</div>
								<div className='grid gap-2'>
									<div className='flex items-center'>
										<Label htmlFor='password'>Password</Label>
										<a href='#' className='ml-auto text-sm underline-offset-4 hover:underline'>
											Forgot your password?
										</a>
									</div>
									<Input id='password' name='password' type='password' required />
								</div>
								<Button type='submit' className='w-full' disabled={pending || isLoading}>
									{pending && <Loader2 className='animate-spin' />}
									Login
								</Button>
								{isWebAuthnUsable && (
									<Button type='button' variant='outline' className='w-full' disabled={pending || isLoading} onClick={handlePasskeyLogin}>
										<Fingerprint />
										Login with Passkey
									</Button>
								)}
							</div>
							<div className='text-center text-sm'>
								Don&apos;t have an account?{' '}
								<a href='/auth/signup' className='underline underline-offset-4'>
									Sign up
								</a>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
