import {Frame, Navigation, TopBar} from "@shopify/polaris";
import {InventoryMajor, RecentSearchesMajor} from "@shopify/polaris-icons";
import {useRef, useState} from "react";
import {useRouter} from "next/router";

export const Layout: React.FC = ({children}) => {
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
    const skipToContentRef = useRef(null);
    const router = useRouter();
    return <Frame
        showMobileNavigation={isNavMenuOpen}
        onNavigationDismiss={() => setIsNavMenuOpen(current => !current)}
        navigation={
            <Navigation location={router.asPath}>
                <Navigation.Section
                    items={[
                        {
                            url: '/',
                            label: 'Inventory',
                            icon: InventoryMajor,
                        },
                        {
                            url: '/history',
                            label: 'History',
                            icon: RecentSearchesMajor,
                        },
                    ]}
                />
            </Navigation>
        }
        topBar={
            <header>
                <TopBar
                    showNavigationToggle
                    onNavigationToggle={() => setIsNavMenuOpen(current => !current)}
                />
            </header>
        }
    >
        {children}
    </Frame>
};
