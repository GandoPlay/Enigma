import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import styles from "./index.module.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { env } from "~/env.mjs";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Get the token from local storage
    const token = localStorage.getItem("adminID");

    if (token === env.NEXT_PUBLIC_PASSWORD) {
      router.push("/DashBoard");
    }
  }, []);
  return (
    <>
      <Head>
        <title>אניגמה</title>
        <meta name="description" content="באזרי הצופים של אניגמה" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>?מגיעים לבאזר</h1>
        </div>
      </main>
    </>
  );
}
