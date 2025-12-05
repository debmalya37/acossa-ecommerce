import { ListItemIcon, MenuItem } from '@mui/material'
import  EditIcon  from '@mui/icons-material/Edit'
import Link from 'next/link'
import React from 'react'
import { View } from 'lucide-react';
import { MdRemoveRedEye } from 'react-icons/md';

interface EditActionProps {
  href: string;
}

const ViewAction: React.FC<EditActionProps> = ({ href }) => {
  return (
    <MenuItem href='view'>
        <Link href={href} className='flex items-center'>
            <ListItemIcon>
                <MdRemoveRedEye />
            </ListItemIcon>
            View
        </Link>  
    </MenuItem>
  )
}

export default ViewAction