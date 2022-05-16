import {Theme, ThemeProvider} from "@emotion/react";
import React from "react";
import {GlobalStyles} from "./global";
import {lighten} from "polished";

declare module "@emotion/react" {
    interface Theme {
        colors?: {
            primary: string
            secondary: string
            light: string
            dark: string
            darkLight: string
            error: string
            success: string
            warning: string
            gray: string
            grayLight: string
        }
        media?: {
            tablet: string
            desktop: string
        }
    }
}

const gray = "#9A9A9A";
const dark = "#3F4747"

export const defaultTheme: Theme = {
    colors: {
        light: "#F0F0F0",
        dark,
        darkLight: lighten(.15, dark),
        gray,
        primary: "#C73023",
        secondary: "#888C03",
        error: "red",
        success: "green",
        warning: "yellow",
        grayLight: lighten(.15, gray)
    },
    media: {
        tablet: "48rem",
        desktop: "64rem"
    }
}

export const ThemeEnvironment: React.FC = ({children}) => {

    return <ThemeProvider theme={defaultTheme}>
        <GlobalStyles/>
        {children}
    </ThemeProvider>
}
