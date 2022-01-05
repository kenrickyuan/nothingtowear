import Head from 'next/head'

export default function OfflinePage() {
  return (
    <>
      <Head>
        <title>Nothing To Wear Offline Page</title>
      </Head>
      <h1>This is the offline fallback page</h1>
      <h2>When offline, any page route will fallback to this page</h2>
    </>
  )
}