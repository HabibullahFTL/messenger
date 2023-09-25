import Image from 'next/image';
import AuthForm from './components/AuthForm';

export default function Home() {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          width={48}
          height={48}
          src="/images/logo.png"
          alt="Logo"
          className="mx-auto w-auto"
        />
        <h2 className="mt-3 text-center tracking-tight text-gray-900 font-bold">
          Sign in to messenger
        </h2>
        <AuthForm />
      </div>
    </div>
  );
}
