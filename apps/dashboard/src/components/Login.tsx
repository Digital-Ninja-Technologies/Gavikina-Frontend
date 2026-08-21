import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLoginSchema  } from '@gavikina/schemas';
import type {AdminLoginValues} from '@gavikina/schemas';
import { Field, Input } from '@gavikina/ui';
import { signIn } from '../store/auth';

export default function Login() {
  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit((values) => {
    signIn(values.email);
  });

  const canSignIn = form.formState.isValid;

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5 py-10">
      <div className="w-full max-w-105 animate-gv-fade">
        <img src={`${import.meta.env.BASE_URL}logo-primary-ondark.svg`} alt="Gavikina Energy" className="mx-auto block h-8 w-auto" />
        <div className="mt-6 rounded-3xl border border-navy/12 bg-white p-8.5 shadow-[0_18px_44px_-34px_rgba(16,19,40,.4)]">
          <h1 className="m-0 text-[23px] font-semibold tracking-tight">Admin sign in</h1>
          <p className="mb-6.5 mt-2 text-[13.5px] leading-relaxed text-navy/60">
            One account manages every enquiry, assessment and project on the site.
          </p>
          <form onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-3.5">
              <Field label="Admin email" error={form.formState.errors.email?.message}>
                <Input type="email" placeholder="admin@gavikina.com" {...form.register('email')} />
              </Field>
              <Field label="Password" error={form.formState.errors.password?.message}>
                <Input type="password" placeholder="••••••••" {...form.register('password')} />
              </Field>
              <button
                type="submit"
                disabled={!canSignIn}
                className="mt-1.5 rounded-xl border-0 bg-green px-5 py-3.5 text-[14.5px] font-semibold text-white hover:bg-green-dark disabled:cursor-not-allowed disabled:bg-navy/14 disabled:text-navy/40"
              >
                Sign in
              </button>
              <span className="text-xs text-navy/50">
                {canSignIn ? 'Two-factor prompt follows on a live deployment.' : 'Enter the admin email and a password of at least 6 characters.'}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
