import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import styles from "./index.module.css";

export default function Home() {
  const hello = api.bazar.hello.useQuery({ text: "from tRPC" });

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
