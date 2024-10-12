/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import { RiBarChartFill } from 'react-icons/ri';
import patient from '../assets/images/Patient.png';
import { default as payment, default as wallet } from '../assets/images/Payment.png';
import insurance from '../assets/images/insurance.png';
// import { BiEnvelope } from 'react-icons/bi';
// import { HiOutlineUserAdd } from 'react-icons/hi';
// import { CgUserList } from 'react-icons/cg';

export default [
    { title: 'Dashboard', href: '/finance/dashboard', icon: <RiBarChartFill className='icon' /> },
    { title: 'Patient Payment', href: '/finance/patients-payment', icon: <img src={patient} className='icon' /> },
    { title: 'Cost SetUp', href: '/finance/cost-setup', icon: <img src={wallet} className='icon' /> },
    { title: 'Insurance (HMO)', href: '/finance/insurance', icon: <img src={insurance} className='icon' /> },
    { title: 'Manage Inventory', href: '/finance/manage-inventory', icon: <img src={payment} className='icon' /> },
];
