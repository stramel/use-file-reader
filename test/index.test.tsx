import { act, renderHook } from '@testing-library/react-hooks';
import useFileReader, { ReaderAction } from '../src';

describe('useFileReader', () => {
  it('should show intial states', () => {
    const { result } = renderHook(() =>
      useFileReader({ method: ReaderAction.READ_AS_DATA_URL })
    );
    const [{ loading, error, result: imgResult, file }] = result.current;
    expect(loading).toBe(false);
    expect(error).toBe(null);
    expect(imgResult).toBe(null);
    expect(file).toBe(null);
  });

  it('should show the proper states after reading as a file', async () => {
    const loadSpy = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useFileReader({ method: ReaderAction.READ_AS_DATA_URL, onLoad: loadSpy })
    );
    const [, setFile] = result.current;
    const tempFile = new File(['Test File'], 'filename');
    act(() => {
      setFile(tempFile);
    });
    await waitForNextUpdate();
    const [{ loading, file, result: imgResult, error }] = result.current;
    expect(file).toEqual(tempFile);
    expect(loadSpy).toHaveBeenCalledWith('data:;base64,VGVzdCBGaWxl');
    expect(imgResult).toBe('data:;base64,VGVzdCBGaWxl');
    expect(loading).toBe(false);
    expect(error).toBe(null);
  });
  it('should show the proper states after reading as text', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useFileReader({ method: ReaderAction.READ_AS_TEXT })
    );
    const [, setFile] = result.current;
    const tempFile = new File(['Test File'], 'filename');
    act(() => {
      setFile(tempFile);
    });
    await waitForNextUpdate();
    const [{ loading, file, result: imgResult, error }] = result.current;
    expect(file).toEqual(tempFile);
    expect(imgResult).toBe('Test File');
    expect(loading).toBe(false);
    expect(error).toBe(null);
  });
  it('should show the proper states after reading as a binary string', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useFileReader({ method: ReaderAction.READ_AS_BINARY_STRING })
    );
    const [, setFile] = result.current;
    const tempFile = new File(['Test File'], 'filename');
    act(() => {
      setFile(tempFile);
    });
    await waitForNextUpdate();
    const [{ loading, file, result: imgResult, error }] = result.current;
    expect(file).toEqual(tempFile);
    expect(imgResult).toBe('Test File');
    expect(loading).toBe(false);
    expect(error).toBe(null);
  });
  it('should show the proper states after reading as a binary string', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useFileReader({ method: ReaderAction.READ_AS_ARRAY_BUFFER })
    );
    const [, setFile] = result.current;
    const tempFile = new File(['Test File'], 'filename');
    act(() => {
      setFile(tempFile);
    });
    await waitForNextUpdate();
    const [{ loading, file, result: imgResult, error }] = result.current;
    expect(file).toEqual(tempFile);
    expect(
      imgResult && typeof imgResult !== 'string' && imgResult.byteLength
    ).toBe(9);
    expect(loading).toBe(false);
    expect(error).toBe(null);
  });
});
