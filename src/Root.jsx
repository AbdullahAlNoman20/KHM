import React from 'react';
import { Outlet } from 'react-router-dom';


const Root = () => {
    return (
        <div className='text-zinc-600 bg-white font-poppins '>
            <Outlet></Outlet>
        </div>
    );
};

export default Root;