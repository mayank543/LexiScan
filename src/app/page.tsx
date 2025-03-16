import React from 'react'
import Sidebar from "@/app/components/Sidebar";
import FileUpload from './components/FileUpload';

export default function Page() {
  return <div className='flex h-screen'>
    <Sidebar/>
    <div className='flex flex-1 justify-center items-center bg-[#262424]'> 
      <FileUpload/>
    </div>
    </div>;
}
