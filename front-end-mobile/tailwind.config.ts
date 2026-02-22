import { Config } from "tailwindcss";
import { theme } from "./src/constants/theme";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: theme.colors.background,
        details_bg: theme.colors.details_bg,
        gray: theme.colors.gray,
        purple: theme.colors.purple,
        text: theme.colors.text,
        alert_success: theme.colors.alert_success,
        alert_error: theme.colors.alert_error,
        alert_warning: theme.colors.alert_warning,
        text_msg_other: theme.colors.text_msg_other,
        text_msg_me: theme.colors.text_msg_me,
        white: theme.colors.white,
      },
      fontFamily: {
        jet: [theme.fonts.family.jetBold],
        roboto: [theme.fonts.family.robRegular],
      },
    },
  },
  plugins: [],
} satisfies Config;
