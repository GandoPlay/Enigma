import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Component {...pageProps} />
      </LocalizationProvider>
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
