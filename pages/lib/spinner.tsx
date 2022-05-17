import {Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import {css} from "@emotion/react";

const antIcon = <LoadingOutlined style={{fontSize: 64}} spin/>;

export const Spinner = () => <div css={
    css`
        height: 100%;
    `
}>
    <Spin css={css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `} indicator={antIcon}/>
</div>;
