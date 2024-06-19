import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { MutableRefObject } from "react";
import SearchInput from "@/components/common/SearchInput";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const AddMemberDialog = ({
    openAddMemberDialog,
    setOpenAddMemberDialog,
}: {
    openAddMemberDialog: boolean;
    setOpenAddMemberDialog: (open: boolean) => void;
}) => {
    const handleClose = () => {
        setOpenAddMemberDialog(false);
    };
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openAddMemberDialog}
            onBackdropClick={handleClose}
        >
            <DialogTitle
                sx={{
                    m: 0,
                    p: 2,
                    textAlign: "center",
                    fontWeight: 700,
                }}
                id="customized-dialog-title"
            >
                Add new member
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers className="w-[548px] h-full">
                <Box className="w-full h-full px-4 my-4">
                    <SearchInput
                        placeholder="Search..."
                        inputProps={{ "aria-label": "Search..." }}
                        onChange={() => {}}
                        value=""
                        className=""
                    ></SearchInput>
                </Box>
                <hr />
                {Array.from({ length: 4 }).map((_, index) => (
                    <Box
                        key={index}
                        className="flex flex-col w-full h-full gap-y-2"
                    >
                        <Typography>{`Group ${index + 1}`}</Typography>
                        {Array.from({ length: 2 }).map((_, subIndex) => (
                            <Box
                                key={subIndex}
                                className="flex items-center justify-between"
                            >
                                <Box className="flex items-center justify-start gap-x-2">
                                    <img
                                        src={`https://source.unsplash.com/random`}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <Typography>{`Friend ${
                                        subIndex + 1
                                    }`}</Typography>
                                </Box>
                                <Checkbox
                                    color="primary"
                                    inputProps={{
                                        "aria-label": "select all desserts",
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="info">
                    Cancel
                </Button>
                <Button autoFocus variant="contained" color="info">
                    Save
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default AddMemberDialog;
