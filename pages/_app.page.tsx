import React from 'react';
import {AppProvider} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import "./lib/styles.scss"

export const App = ({Component, pageProps}) => {
    return (
        <AppProvider
            i18n={enTranslations}
            colorScheme={'light'}
        >
            <Component {...pageProps} />
        </AppProvider>
    );
}
export default App
