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

function App() {
  const [showInput, setshowInput] = useState(false);
  const [didVote, setDidVote] = useState(false);

  const breatheAnimation = keyframes`
    0% { transform: scale(0.9); }
    25% { transform: scale(1); }
    50% { transform: scale(0.9); }
    100% { transform: scale(0.9); }
  `;
  return (
    <Box w="100vw" h="100vh" bgGradient="linear(to-r, blue.500, blue.200)">
      <Center h="100vh">
        <Flex dir="rtl" flexDir={"column"} gap={3}>
          <Text fontSize={"xl"}>התחברות</Text>
          <Input type={"password"} placeholder="סיסמא"></Input>

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
      </Center>
    </Box>
  );
}

export default App;
