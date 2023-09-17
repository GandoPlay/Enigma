import {
  Box,
  Button,
  Center,
  Flex,
  Text,
  Input,
  keyframes,
} from "@chakra-ui/react";
import { useState } from "react";
import { NumberInput, NumberInputField } from "@chakra-ui/react";
import crypto from "crypto";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

function App() {
  const [showInput, setshowInput] = useState(false);
  const { mutateAsync: addPerson } = api.bazar.addPerson.useMutation();
  const [didVote, setDidVote] = useState(false);

  const breatheAnimation = keyframes`
  0% { transform: scale(0.9); }
  25% { transform: scale(1); }
  50% { transform: scale(0.9); }
  100% { transform: scale(0.9); }
`;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const name = router.query.slug || "";
  console.log(name[0]);

  const onSubmit = async (data: any) => {
    let valid = false;
    if (localStorage.getItem("sessionId")) {
      const t = parseInt(localStorage.getItem("sessionId")?.slice(128)!);

      const date = new Date(t);

      const fourDaysAgo = new Date();
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

      valid = date <= fourDaysAgo;
    }

    if (!localStorage.getItem("sessionId") || valid) {
      const timeStamp = new Date().valueOf();
      console.log(timeStamp);

      const sessionId = crypto.randomBytes(64).toString("hex") + timeStamp;

      localStorage.setItem("sessionId", sessionId);
      const res = await addPerson({
        bazarName: name[0]!,
        personPhone: data.phoneNumber,
        personName: data.name,
      });
      if (res.data) {
        alert("בוצע בהצלחה!");
      } else {
        alert("אירעה שגיאה");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box w="100vw" h="100vh" bgGradient="linear(to-r, blue.500, blue.200)">
        <Center h="100vh">
          {!showInput ? (
            <Button
              fontSize={"5xl"}
              bgBlendMode={"darken"}
              borderRadius={"50%"}
              bg={"None"}
              animation={`${breatheAnimation} 4s infinite ease-in-out`}
              onClick={() => {
                setshowInput(true);
              }}
            >
              ?מגיע לבאזר
            </Button>
          ) : (
            <Flex dir="rtl" flexDir={"column"} gap={3}>
              <Text fontSize={"xl"}>נשמח אם רק תוכלו למלא מספר פרטים😇</Text>
              <Text>{name[0]}</Text>
              <Input
                {...register("name", { required: true })}
                placeholder="שם מלא"
              ></Input>
              <NumberInput>
                <NumberInputField
                  {...register("phoneNumber", { required: true })}
                  placeholder="מספר טלפון"
                />
              </NumberInput>
              <Button type="submit">שלח</Button>
            </Flex>
          )}
        </Center>
      </Box>
    </form>
  );
}

export default App;
