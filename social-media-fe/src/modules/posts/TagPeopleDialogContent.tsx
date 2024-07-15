import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchInput from "@/components/common/SearchInput";
import { RootState } from "@/store/configureStore";
import { useSelector } from "react-redux";
import { FriendRequestData } from "@/types/userType";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

const TagPeopleDialogContent = ({
    selectedPersons,
    setSelectedPersons,
}: {
    selectedPersons: FriendRequestData[];
    setSelectedPersons: (value: FriendRequestData[]) => void;
}) => {
    const relationshipUsers = useSelector(
        (state: RootState) => state.user.relationshipUsers
    );
    const [listUsers, setListUsers] = useState<FriendRequestData[]>(
        (Object.values(relationshipUsers.friends) as FriendRequestData[]) || []
    );
    const [searchValue, setSearchValue] = useState<string>("");

    const handleSelectPerson = (person: FriendRequestData) => {
        setSelectedPersons([...selectedPersons, person]);
    };

    const handleRemoveSelectedPerson = (indexToRemove: number) => {
        setSelectedPersons(
            selectedPersons.filter((_, index) => index !== indexToRemove)
        );
    };

    useEffect(() => {
        let updatedListUsers =
            (Object.values(relationshipUsers.friends) as FriendRequestData[]) ||
            [];
        if (searchValue) {
            updatedListUsers = updatedListUsers.filter((user) =>
                user.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }
        updatedListUsers = updatedListUsers.filter(
            (user) =>
                !selectedPersons.find(
                    (selected) => selected.user_id === user.user_id
                )
        );
        setListUsers(updatedListUsers);
    }, [searchValue, selectedPersons, relationshipUsers.friends]);

    return (
        <Box>
            <SearchInput
                placeholder="Search..."
                inputProps={{
                    "aria-label": "Search...",
                }}
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                className="w-full"
            />
            {selectedPersons.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        mt: 2,
                    }}
                >
                    {selectedPersons.map((person, index) => (
                        <Chip
                            key={index}
                            label={person.name}
                            color="info"
                            onDelete={() => handleRemoveSelectedPerson(index)}
                            deleteIcon={<CloseIcon />}
                        />
                    ))}
                </Box>
            )}
            <Typography className="mt-4">SUGGESTIONS</Typography>
            <Box
                sx={{
                    width: "100%",
                    maxHeight: "300px",
                    overflowY: "auto",
                    mt: 2,
                }}
            >
                <Grid container direction="column" spacing={2}>
                    {listUsers.map((person) => (
                        <Grid
                            item
                            xs={12}
                            key={uuidv4()}
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => handleSelectPerson(person)}
                        >
                            <Image
                                src={person.image_url}
                                alt={person.name}
                                width={40}
                                height={40}
                                className="object-cover w-10 h-10 rounded-full"
                            ></Image>
                            <Typography>{person.name}</Typography>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default TagPeopleDialogContent;
