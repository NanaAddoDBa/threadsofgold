declare namespace NodeJS {
  interface ProcessEnv {
    readonly APP_RELEASE: string | undefined;
    readonly FOUNDATION_RUNTIME_ENABLED: string | undefined;
    readonly FOUNDATION_VERIFIER_TOKEN: string | undefined;
    readonly INTERNAL_API_URL: string | undefined;
    readonly NEXT_PUBLIC_STOREFRONT_URL: string | undefined;
  }
}
