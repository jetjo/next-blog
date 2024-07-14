import { useLayoutEffect, useState } from "react";
import { getTheme, onDark } from "@/utils/client/darkTheme";

export function useTheme({ theme = 'light', mode = 'auto' } = {}) {
    const [mode_, setMode] = useState<{ theme: string, mode: string }>({ theme, mode });
    useLayoutEffect(() => {
        setMode(getTheme())
        const clean = onDark((_, { }) => {
            setMode(getTheme())
            // console.log('主题模式变更!', mode);
        })
        return () => (clean(), void 0);
    }, [])
    return mode_;
}