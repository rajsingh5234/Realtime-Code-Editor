import React, { useEffect, useRef, useState } from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import ACTIONS from '../../../Constants/Actions';

const CodeEditor = ({ socketRef, roomId, code, onCodeChange }) => {

    // const codeRef = useRef("");

    // useEffect(() => {

    //     if (socketRef.current) {
    //         socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
    //             // setCode(code)
    //             console.log("code", code);
    //             if (code !== null) {
    //                 codeRef.current = code;
    //             }
    //         })
    //     }

    //     return () => {
    //         if (socketRef.current) {
    //             socketRef.current.off(ACTIONS.CODE_CHANGE)
    //         }
    //     }

    // }, [socketRef.current])

    const onChangeHandler = (val, viewUpdate) => {
        onCodeChange(val);
    }

    return (
        <CodeMirror
            value={code}
            height="100%"
            theme={dracula}
            extensions={[javascript({ jsx: true })]}
            onChange={onChangeHandler}
        />
    )
};

export default CodeEditor;
