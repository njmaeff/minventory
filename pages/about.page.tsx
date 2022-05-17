import React from "react";
import {Meta} from "./lib/meta";
import {Page} from "./lib/page";
import ReadMe from "../readme.md"
import {css} from "@emotion/react";
import {lighten} from "polished";

export const Anchor = ({children, ...props}) => (
    <a target={"_blank"} rel={"noopener noreferrer"} {...props}>
        {children}
    </a>
);
export const Wrapper = ({children}) => {
    return <div css={
        theme => css`
            padding: 0 1rem;

            code {
                margin-left: 0.5rem;
                background: ${lighten(0.2, theme.colors.primary)};
                padding: 0.5rem;
            }
        `
    }>{children}</div>;
};

export default () => {
    return <>
        <Meta title={'About'}/>
        <Page>
            <ReadMe components={{
                a: Anchor,
                wrapper: Wrapper,
            }}/>
        </Page>
    </>
};
