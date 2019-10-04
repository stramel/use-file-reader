import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useFileReader, { ReaderAction } from '../.';

const App = () => {
  const [file, setInputFile] = React.useState<File | null>(null);
  const [
    { result: imgSrc, file: _file, ...metaState },
    setFile,
  ] = useFileReader({
    method: ReaderAction.READ_AS_DATA_URL,
    onLoad: console.info,
  });

  React.useEffect(() => {
    setFile(file);
  }, [file, setFile]);

  return (
    <div>
      <label>
        Select an image file:
        <input
          type="file"
          accept="image/*"
          onInput={e => {
            if (e.currentTarget.files === null) {
              setInputFile(null);
            } else {
              setInputFile(e.currentTarget.files[0]);
            }
          }}
        />
      </label>
      <pre>{JSON.stringify(metaState, undefined, 2)}</pre>
      <div>{imgSrc && <img src={imgSrc.toString()} alt="File Preview" />}</div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
