import { createContext } from "@lit/context";

// my depend
export interface AppContext {
  jumpToHome(): void
  jump(url: URL): void
}

export const appContext = createContext<AppContext>(Symbol("app-context"));
