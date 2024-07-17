import {
    Box,
    Button,
    IconButton,
    TextareaAutosize,
    Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect } from "react";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Image from "next/image";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useSelector } from "react-redux";
import useClickOutSide from "@/hooks/useClickOutSide";
import { RootState } from "@/store/configureStore";
import { FriendRequestData } from "@/types/userType";
const PostDialogContent = ({
    taggedPersons,
    setOpenTagPeopleDialog,
    content,
    setContent,
    listFiles,
    setListFiles,
}: {
    taggedPersons: FriendRequestData[];
    setOpenTagPeopleDialog: (value: boolean) => void;
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    listFiles: File[];
    setListFiles: React.Dispatch<React.SetStateAction<File[]>>;
}) => {
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [listImage, setListImage] = React.useState<string[]>([]);

    const handleFileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        if (!files.length) return;
        setListFiles((prevFiles: File[]) => [...prevFiles, ...files]);
        setListImage((prevImages) => [
            ...prevImages,
            ...files.map((file) => URL.createObjectURL(file)),
        ]);
    };

    const {
        show: showEmojiPicker,
        setShow: setShowEmojiPicker,
        nodeRef: emojiPickerRef,
    } = useClickOutSide();

    const handleChooseEmoji = (emoji: any) => {
        setContent((prev) => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    const handleRemoveFile = (index: number) => {
        setListFiles((currentFiles) =>
            currentFiles.filter((_, i) => i !== index)
        );
        setListImage((currentImages) =>
            currentImages.filter((_, i) => i !== index)
        );
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    mb: "8px",
                }}
            >
                <Image
                    src={currentUserProfile.image_url}
                    alt={currentUserProfile.name}
                    width={40}
                    height={40}
                    className="object-cover w-10 h-10 rounded-full"
                ></Image>
                <span className="ml-2 font-semibold">
                    {currentUserProfile.name}
                    {taggedPersons?.length > 0
                        ? taggedPersons?.length < 3
                            ? ` is with ${taggedPersons
                                  ?.map((person) => person.name)
                                  .join(", ")}`
                            : ` is with ${taggedPersons?.length} others`
                        : ""}
                </span>
            </Box>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                }}
            >
                <TextareaAutosize
                    aria-label={`What's on your mind, ${
                        currentUserProfile.name.split(" ")[
                            currentUserProfile.name.split(" ").length - 1
                        ]
                    }?`}
                    minRows={3}
                    placeholder={`What's on your mind, ${
                        currentUserProfile.name.split(" ")[
                            currentUserProfile.name.split(" ").length - 1
                        ]
                    }?`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 pr-8 border-none outline-none resize-none"
                />
                <Tooltip title="Emoji">
                    <IconButton
                        size="small"
                        color={"inherit"}
                        className="absolute right-0 transform -translate-y-1/2 top-1/2 btn-chat-action w-7 h-7"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <SentimentVerySatisfiedIcon />
                    </IconButton>
                </Tooltip>

                {showEmojiPicker && (
                    <div
                        className="absolute top-0 right-0 z-50"
                        ref={emojiPickerRef}
                    >
                        <Picker data={data} onEmojiSelect={handleChooseEmoji} />
                    </div>
                )}
            </Box>
            {listImage.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                    }}
                >
                    {listImage.map((file, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                                borderRadius: "8px",
                                overflow: "hidden",
                            }}
                        >
                            <Image
                                src={file}
                                alt={""}
                                width={100}
                                height={100}
                                className="object-cover w-full h-full"
                            />
                            <IconButton
                                size="small"
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    color: "white",
                                }}
                                onClick={() => handleRemoveFile(index)}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button variant="text" component="label">
                        <AddIcon />
                        <input
                            type="file"
                            accept="image/*, video/*"
                            multiple
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                </Box>
            )}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                }}
            >
                <span className="text-sm font-semibold">Add to your post</span>
                <Box
                    sx={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Tooltip title="Photo/Video">
                        <Box>
                            <IconButton
                                size="small"
                                color={"inherit"}
                                aria-label="Photo/Video"
                                className="btn-chat-action"
                                onClick={handleFileInputClick}
                            >
                                <PhotoLibraryIcon />
                            </IconButton>
                            <input
                                type="file"
                                accept="image/*, video/*"
                                ref={fileInputRef}
                                multiple
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </Box>
                    </Tooltip>
                    <Tooltip title="Tag people">
                        <Box>
                            <IconButton
                                size="small"
                                color={"inherit"}
                                aria-label="Tag people"
                                onClick={() => setOpenTagPeopleDialog(true)}
                            >
                                <PersonAddIcon />
                            </IconButton>
                        </Box>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
};

export default PostDialogContent;
