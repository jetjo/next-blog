import { hwbDarks, hwbLights } from "@/assets/style";
import { cookies } from "next/headers";

export function WithTheme<P>(Com: React.ComponentType<{ theme: string } & P>) {
    const theme = cookies().get('theme')?.value || 'light';
    return (props: P) => (<Com  {...props} theme={theme} hwbLights={hwbLights} hwbDarks={hwbDarks} />)
}