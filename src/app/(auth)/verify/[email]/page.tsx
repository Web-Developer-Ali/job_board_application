'use client';

import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponce } from '@/types/ApiResponce';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useRouter, useParams } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

function Page() {
  const route = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const params = useParams<{ email: string }>();
  const encodedParams = params.email;

  // Step 1: Decode the URL-encoded string
  const decodedParams = decodeURIComponent(encodedParams);

  // Step 2: Split the string into key-value pairs
  const paramsArray = decodedParams.split('&');

  // Step 3: Convert the array into an object for easier access
  const getUrlData = paramsArray.reduce((acc, param) => {
    const [key, value] = param.split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  // Access the email value
  const email = getUrlData['email'];

  const { register, handleSubmit } = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof verifySchema>> = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/registeration/verify-code', {
        email,
        code: data.code,
      });
      toast({
        title: 'Success',
        description: response.data.message,
      });
      route.replace(`/onboard/email=${email}&email_user=true`);
    } catch (error) {
      console.error('Error in verifying code:', error);
      const axiosError = error as AxiosError<ApiResponce>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: 'Verification Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="dark:bg-gray-800 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Verify OTP</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Enter OTP
            </label>
            <input
              type="text"
              id="code"
              {...register('code')} // Use react-hook-form register
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-white bg-white dark:bg-gray-800 sm:text-sm"
              required
              placeholder="Enter your OTP"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Page;
