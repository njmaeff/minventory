import Head from 'next/head';
import "./lib/styles/antd.css"
import {QueryClient, QueryClientProvider} from "react-query";
import createCache from "@emotion/cache";
import {CacheProvider} from "@emotion/react";
import {ThemeEnvironment} from "./lib/styles/theme";

export default ({
                    Component,
                    pageProps,
                    emotionCache = createCache({key: 'css'})
                }) => {
    const Layout = Component.getLayout ?? (({children}) => <>{children}</>)

    return (
        <>
            <Head>
                <title>Inventory Mini</title>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1, maximum-scale=1"/>
            </Head>
            <CacheProvider value={emotionCache}>
                <QueryClientProvider client={new QueryClient()}>
                    <ThemeEnvironment>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </ThemeEnvironment>
                </QueryClientProvider>
            </CacheProvider>
        </>
    );
}
