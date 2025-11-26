/* eslint-disable @typescript-eslint/no-explicit-any */
import { ListItemIcon, MenuItem } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

type DeleteType = "SD" | "PD" | "RSD";

interface DeleteActionProps {
  handleDelete: (ids: string[], deleteType: DeleteType) => void;
  row: { original: { _id: string } };
  deleteType: DeleteType;
}

const DeleteAction = ({ handleDelete, row, deleteType }: DeleteActionProps) => {
  return (
    <MenuItem onClick={() => handleDelete([row.original._id], deleteType)}>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      Delete
    </MenuItem>
  );
};

export default DeleteAction;
