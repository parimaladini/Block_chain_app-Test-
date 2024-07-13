import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";

import { useState } from "react";

function UploadDocument({ isOpen, onOpen, onClose }) {
    const [file, setFile] = useState(null);
    const [docId, setDocId] = useState("");
    const [docType, setDocType] = useState("");
    const [owner, setOwner] = useState("");
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleDocIdChange = (event) => {
        setDocId(event.target.value);
    };

    const handleDocTypeChange = (event) => {
        setDocType(event.target.value);
    };

    const handleOwnerChange = (event) => {
        setOwner(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = new FormData();
        form.append("file", file);
        form.append("doc_id", docId);
        form.append("doc_type", docType);
        owner && form.append("owner", owner);

        setIsLoading(true);

        fetch("http://localhost:3001/api/doc/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: form,
        }).then((response) => {
            toast({
                title: "Document uploaded",
                description: "Your document has been uploaded successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            onClose();
        }).catch((error) => {
            toast({
                title: "An error occurred.",
                description: error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Heading as="h1" size="lg">
                            Upload Document
                        </Heading>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={{ base: "4", md: "6", lg: "8" }}>
                                <FormControl isRequired>
                                    <FormLabel>File</FormLabel>
                                    <Input type="file" onChange={handleFileChange} />
                                    <Text fontSize="sm" color="gray.500">
                                        Note: Maximum file size is 10MB.
                                    </Text>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Document ID</FormLabel>
                                    <Input type="text" value={docId} onChange={handleDocIdChange} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Document Type</FormLabel>
                                    <Input type="text" value={docType} onChange={handleDocTypeChange} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Assign to</FormLabel>
                                    <Input type="text" value={owner} onChange={handleOwnerChange} />
                                </FormControl>
                            </Stack>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="teal" mr={3} onClick={handleSubmit} isLoading={isLoading}>
                            Upload
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default UploadDocument;
