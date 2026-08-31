declare namespace NodeJS {
  interface ProcessEnv {
    readonly APP_RELEASE: string | undefined;
    readonly NEXT_PUBLIC_ADMIN_URL: string | undefined;
  }
}
