import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';

const CodeEditor = ({ code, onCodeChange }) => {

    const onChangeHandler = (val) => {
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
