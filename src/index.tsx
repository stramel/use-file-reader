import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export enum ReaderAction {
  READ_AS_TEXT = 'readAsText',
  READ_AS_DATA_URL = 'readAsDataURL',
  READ_AS_BINARY_STRING = 'readAsBinaryString',
  READ_AS_ARRAY_BUFFER = 'readAsArrayBuffer',
}

enum ReaderEvent {
  LOAD_START = 'loadstart',
  LOAD_END = 'loadend',
  LOAD = 'load',
  ERROR = 'error',
}

type ReaderResult = string | ArrayBuffer;

type ReaderProps = Partial<{
  /**
   * @default ReaderAction.READ_AS_TEXT
   */
  method: ReaderAction;
  onLoad: (result: ReaderResult | null) => void;
}>;

export default function useFileReader({
  method = ReaderAction.READ_AS_TEXT,
  onLoad,
}: ReaderProps): [
  {
    result: ReaderResult | null;
    error: ProgressEvent | null;
    file: File | null;
    loading: boolean;
  },
  Dispatch<SetStateAction<File | null>>
] {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<ProgressEvent | null>(null);
  const [result, setResult] = useState<ReaderResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    function handleLoadStart() {
      setLoading(true);
    }
    function handleLoadEnd() {
      setLoading(false);
    }
    function handleLoad() {
      const { result } = reader;
      setResult(result);
      if (typeof onLoad === 'function') {
        onLoad(result);
      }
    }
    function handleError(e: ProgressEvent) {
      setError(e);
    }

    reader.addEventListener(ReaderEvent.LOAD_START, handleLoadStart);
    reader.addEventListener(ReaderEvent.LOAD, handleLoad);
    reader.addEventListener(ReaderEvent.ERROR, handleError);
    reader.addEventListener(ReaderEvent.LOAD_END, handleLoadEnd);

    try {
      reader[method](file);
    } catch (e) {
      setError(e);
    }

    return () => {
      reader.removeEventListener(ReaderEvent.LOAD_START, handleLoadStart);
      reader.removeEventListener(ReaderEvent.LOAD_END, handleLoadEnd);
      reader.removeEventListener(ReaderEvent.LOAD, handleLoad);
      reader.removeEventListener(ReaderEvent.ERROR, handleError);
    };
  }, [file, method, onLoad]);

  return [{ result, error, file, loading }, setFile];
}
