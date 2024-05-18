type setDataByObject<Tform> = (data: Tform) => void;
type setDataByMethod<Tform> = (data: (previousData: Tform) => Tform) => void;
type setDataByKeyValuePair<TForm> = <K extends keyof TForm>(
    key: K,
    value: TForm[K]
) => void;

export { setDataByObject, setDataByMethod, setDataByKeyValuePair };
