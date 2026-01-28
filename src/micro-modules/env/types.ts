export type EnvConfig = {
    $schema: string | undefined;
    baseUrl: string;
    setting: {
        font: {
            default: "Vazirmatn" | "Noto Nastaliq Urdu" | "Roboto" | "Beiruti" | "Gulzar" | "Lalezar" | "Caveat";
            fonts: {
                [key: "Vazirmatn" | "Noto Nastaliq Urdu" | "Roboto" | "Beiruti" | "Gulzar" | "Lalezar" | "Caveat"]: boolean;
            };
        };
        language: {
            default: "en" | "fa";
            languages: {
                [key: "en" | "fa"]: boolean;
            };
        };
    };
};