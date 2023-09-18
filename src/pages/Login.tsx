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
import { useForm } from "react-hook-form";
import { env } from "~/env.mjs";
import { useRouter } from "next/router";

function App() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm();
  const onSubmit = (data: any) => {
    if (data.password === env.NEXT_PUBLIC_PASSWORD) {
      localStorage.setItem("adminID", data.password);
      router.push("/DashBoard");
    }
  };

  const breatheAnimation = keyframes`
    0% { transform: scale(0.9); }
    25% { transform: scale(1); }
    50% { transform: scale(0.9); }
    100% { transform: scale(0.9); }
  `;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box w="100vw" h="100vh" bgGradient="linear(to-r, blue.500, blue.200)">
        <Center h="100vh">
          <Flex dir="rtl" flexDir={"column"} gap={3}>
            <Text fontSize={"xl"}>התחברות</Text>
            <Input
              {...register("password", { required: true })}
              type={"password"}
              placeholder="סיסמא"
            ></Input>

            <Button isDisabled={!isValid} type="submit">
              שלח
            </Button>
          </Flex>
        </Center>
      </Box>
    </form>
  );
}

export default App;
