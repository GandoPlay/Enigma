import {
  Box,
  Button,
  Center,
  Flex,
  Text,
  Input,
  keyframes,
  TableContainer,
  Tfoot,
  Th,
  Tr,
  Tbody,
  Td,
  Table,
  TableCaption,
  Thead,
  Spacer,
  FormControl,
  Modal,
  FormLabel,
  FormErrorMessage,
  useDisclosure,
  Spinner,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState } from "react";

import { Controller, useForm } from "react-hook-form";
import DatePickerDialog from "~/compoments/DatePicker";
import { useRouter } from "next/router";

import { api } from "~/utils/api";

function App() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { data: bazars, isLoading } = api.bazar.getAllBazars.useQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutateAsync: addBazar, isLoading: loadingAdd } =
    api.bazar.addBazar.useMutation();

  const { mutateAsync: deleteBazar } = api.bazar.deleteBazar.useMutation();
  const context = api.useContext();
  const [id, setId] = useState("");

  const [name, setName] = useState("");

  const onSubmit = async (data: any) => {
    await addBazar(data);
    context.bazar.invalidate();
  };

  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess("Copied!");
    } catch (err) {
      setCopySuccess("Failed to copy text");
    }
  };
  if (isLoading) {
    <Box w="100vw" h="100vh" bgGradient="linear(to-r, blue.500, blue.200)">
      return <Spinner></Spinner>;
    </Box>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box w="100vw" h="100vh" bgGradient="linear(to-r, blue.500, blue.200)">
        <Box h="5vh"></Box>
        <Flex dir="rtl" flexDir={"column"} justifyContent="flex-end">
          <Input
            {...register("name", { required: true, maxLength: 20 })}
            placeholder="שם שבט"
          ></Input>
          <Controller
            control={control}
            name="date"
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { error },
            }) => (
              <FormControl isInvalid={error ? true : false}>
                <FormLabel
                  htmlFor="date"
                  fontSize="sm"
                  fontWeight="md"
                ></FormLabel>
                <DatePickerDialog isRange={false} onChange={onChange} />
              </FormControl>
            )}
          />
          <Button isLoading={loadingAdd} fontSize={"xl"} type="submit">
            הוסף באזר
          </Button>
        </Flex>
        {isLoading ? (
          <Spinner></Spinner>
        ) : (
          <>
            {" "}
            <Box h="5vh"></Box>
            <Center>
              <Flex dir="rtl" flexDir={"column"} gap={3}>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>באזר</Th>
                        <Th>תאריך</Th>
                        <Th>כמות אנשים</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {bazars?.map((bazar, index) => {
                        return (
                          <>
                            <Tr key={index}>
                              <Td>
                                <Button
                                  onClick={() => {
                                    setName(bazar.name);
                                    setId(bazar.id);
                                    onOpen();
                                  }}
                                >
                                  {bazar.name}
                                </Button>
                              </Td>
                              <Td>
                                {new Date(
                                  Number(bazar.date)
                                ).toLocaleDateString()}
                              </Td>
                              <Td>{bazar.count}</Td>
                            </Tr>
                          </>
                        );
                      })}
                    </Tbody>
                  </Table>
                </Box>
              </Flex>
            </Center>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Center>
                    <Button
                      onClick={() =>
                        copyToClipboard(
                          "    שלום, בבקשה להעביר את הקישור בקבוצה של ההורים ושיאשרו הגעה    " +
                            window.location.href.replace(
                              "DashBoard",
                              "EntryPermit"
                            ) +
                            "/" +
                            encodeURI(name)
                        )
                      }
                    >
                      {"העתק הודעה"}
                    </Button>
                  </Center>
                </ModalBody>

                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={async () => {
                    await deleteBazar({ id: id });
                    context.bazar.invalidate();
                    onClose();
                  }}
                >
                  מחק
                </Button>
              </ModalContent>
            </Modal>
          </>
        )}
      </Box>
    </form>
  );
}

export default App;
