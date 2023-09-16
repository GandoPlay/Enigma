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

function App() {
  const [showInput, setshowInput] = useState(false);
  const [didVote, setDidVote] = useState(false);

  const breatheAnimation = keyframes`
  0% { transform: scale(0.9); }
  25% { transform: scale(1); }
  50% { transform: scale(0.9); }
  100% { transform: scale(0.9); }
`;
  const router = useRouter();

  const name = router.query.slug || "";
  console.log(name[0]);

  return (
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
            <Input placeholder="שם מלא"></Input>
            <NumberInput>
              <NumberInputField placeholder="מספר טלפון" />
            </NumberInput>
            <Button
              onClick={() => {
                if (!localStorage.getItem("sessionId")) {
                  const sessionId = crypto.randomBytes(64).toString("hex");

                  localStorage.setItem("sessionId", sessionId);
                }
              }}
            >
              שלח
            </Button>
          </Flex>
        )}
      </Center>
    </Box>
  );
}

export default App;
