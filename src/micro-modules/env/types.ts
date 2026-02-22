export type EnvConfig = {
    $schema: string | undefined;
    baseUrl: string;
    setting: {
        font: {
            default: "Vazirmatn" | "Noto Nastaliq Urdu" | "Roboto" | "Beiruti" | "Gulzar" | "Lalezar" | "Caveat";
            fonts: {
                // @ts-ignore
                [key: "Vazirmatn" | "Noto Nastaliq Urdu" | "Roboto" | "Beiruti" | "Gulzar" | "Lalezar" | "Caveat"]: boolean;
            };
        };
        language: {
            default: "en" | "fa";
            languages: {
                // @ts-ignore
                [key: "en" | "fa"]: boolean;
            };
        };
    };
};