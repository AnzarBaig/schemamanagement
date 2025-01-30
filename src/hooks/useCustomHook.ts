import { useState } from "react";

export const useCustomHook = () => {
    const [state, setState] = useState(null);

    const updateState = (value: any) => {
        setState(value);
    };

    return { state, updateState };
};
