"use client";

import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { Social, SocialPlatform } from "@/services/user/types";

type SocialIconSize = "small" | "medium" | "large";

const SIZE_CONFIG = {
  small: { button: 36, icon: 18, gap: 8 },
  medium: { button: 48, icon: 24, gap: 12 },
  large: { button: 56, icon: 28, gap: 16 },
} as const;

const Container = styled(Box, {
  shouldForwardProp: (prop) => prop !== "size",
})<{ size: SocialIconSize }>(({ size }) => ({
  display: "flex",
  gap: SIZE_CONFIG[size].gap,
}));

const SocialButton = styled("a", {
  shouldForwardProp: (prop) => prop !== "size",
})<{ size: SocialIconSize }>(({ size }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: SIZE_CONFIG[size].button,
  height: SIZE_CONFIG[size].button,
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "rgba(255, 255, 255, 0.7)",
  transition: "all 0.2s ease",
  textDecoration: "none",
  "& svg": {
    width: SIZE_CONFIG[size].icon,
    height: SIZE_CONFIG[size].icon,
  },
  "&:hover": {
    backgroundColor: "rgba(34, 211, 238, 0.15)",
    borderColor: "rgba(34, 211, 238, 0.3)",
    color: "#22d3ee",
  },
}));

/**
 * LINE icon SVG.
 */
const LineIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

/**
 * WeChat icon SVG.
 */
const WeChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.007-.27-.026-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z" />
  </svg>
);

/**
 * Ensure URL has a protocol prefix.
 */
const ensureProtocol = (url: string): string => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

/**
 * Get social icon by platform.
 */
const getSocialIcon = (platform: SocialPlatform) => {
  switch (platform) {
    case "GITHUB":
      return <GitHubIcon />;
    case "LINKEDIN":
      return <LinkedInIcon />;
    case "TELEGRAM":
      return <TelegramIcon />;
    case "LINE":
      return <LineIcon />;
    case "WECHAT":
      return <WeChatIcon />;
    default:
      return null;
  }
};

interface SocialIconsProps {
  socials: Social[];
  size?: SocialIconSize;
}

/**
 * Social media icons component.
 */
const SocialIcons = ({ socials, size = "medium" }: SocialIconsProps) => {
  if (socials.length === 0) return null;

  return (
    <Container size={size}>
      {socials.map((social) => (
        <SocialButton
          key={social.platform}
          size={size}
          href={ensureProtocol(social.url)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.platform}
        >
          {getSocialIcon(social.platform)}
        </SocialButton>
      ))}
    </Container>
  );
};

export default SocialIcons;
