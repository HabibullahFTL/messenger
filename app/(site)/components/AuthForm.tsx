'use client';

import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { z } from 'zod';
import AuthSocialButton from './AuthSocialButton';

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(
      z.object({
        ...(variant === 'REGISTER'
          ? {
              name: z
                .string({
                  required_error: 'Name is required',
                })
                .min(1, 'Name is required!'),
            }
          : {}),
        email: z
          .string({
            required_error: 'Email is required',
          })
          .min(1, 'Email is required!')
          .email('Email is not valid'),
        password: z
          .string({
            required_error: 'Password is required',
          })
          .min(1, 'Password is required!'),
      })
    ),
  });

  const onSubmit = (data: FieldValues) => {
    console.log('Login', data);
    setIsLoading(true);

    if (variant === 'REGISTER') {
      axios
        .post('/api/register', data)
        .then((response) => {
          signIn('credentials', {
            ...data,
          });
          toast.success('Successfully registered!');
          reset({});
        })
        .catch((error) => {
          toast.error('Registration failed!');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (variant === 'LOGIN') {
      console.log('Login', data);
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((response) => {
          if (response?.error) {
            toast.error('Something went wrong!');
          }
          if (response?.ok && !response?.error) {
            toast.success('Successfully logged in!');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const socialAuthAction = (action: string) => {
    setIsLoading(true);

    signIn(action, {
      redirect: false,
    })
      .then((response) => {
        if (response?.error) {
          toast.error('Something went wrong!');
        }
        if (response?.ok && !response?.error) {
          toast.success('Successfully logged in!');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const session = useSession();

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router?.push('/users');
    }
  }, [session]);

  return (
    <div className="shadow sm:rounded-lg sm:px-10 mt-6 bg-white px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        {variant === 'REGISTER' ? (
          <Input
            disabled={isLoading}
            id="name"
            label="Name"
            register={register}
            errors={errors}
          />
        ) : null}
        <Input
          disabled={isLoading}
          id="email"
          label="Email"
          type="email"
          register={register}
          errors={errors}
        />
        <Input
          disabled={isLoading}
          id="password"
          label="Password"
          type="password"
          register={register}
          errors={errors}
        />

        <Button disabled={isLoading} type="submit" fullWidth>
          {variant === 'LOGIN' ? 'Sign in' : 'Register'}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <AuthSocialButton
            Icon={BsGithub}
            onClick={() => socialAuthAction('github')}
          />
          <AuthSocialButton
            Icon={BsGoogle}
            onClick={() => socialAuthAction('google')}
          />
        </div>

        <div className="flex gap-2 justify-center text-sm  mt-6 px-2 text-gray-500">
          <div className="">
            {variant === 'LOGIN'
              ? 'New to Messenger?'
              : 'Already have an account?'}
          </div>
          <button className="underline cursor-pointer" onClick={toggleVariant}>
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
