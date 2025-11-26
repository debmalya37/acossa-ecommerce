import { ListItemIcon, MenuItem } from '@mui/material'
import  EditIcon  from '@mui/icons-material/Edit'
import Link from 'next/link'
import React from 'react'

interface EditActionProps {
  href: string;
}

const EditAction: React.FC<EditActionProps> = ({ href }) => {
  return (
    <MenuItem href='edit'>
        <Link href={href}>
            <ListItemIcon>
                <EditIcon/>
            </ListItemIcon>
            Edit
        </Link>  
    </MenuItem>
  )
}

export default EditAction