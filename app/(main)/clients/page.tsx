"use client"
import React from 'react';
import RowExpandTable from '../uikit/table/RowExpandTable';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
import { ClientService } from '@/demo/service/Client.service';


function page() {
    const {createClient} = ClientService
    const { isPending, isError, data, error } =useQuery({ queryKey: ['client'], queryFn: createClient })
    if (isPending) {

      return <div className="w-full h-full flex align-items-center justify-content-center"><span>Loading...</span></div>
      return <span className="loading loading-ball loading-lg"></span>
      }

      if (isError) {
        return <span>Error: {error.message}</span>
      }

    return (

            <RowExpandTable clients={data} />

    );
}

export default page;
