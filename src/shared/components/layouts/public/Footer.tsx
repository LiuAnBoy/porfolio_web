"use client";

import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const FooterContainer = styled("footer")({
  backgroundColor: "#0a0a0a",
  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
  padding: "32px 0",
});

const FooterContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
});

const Copyright = styled(Typography)({
  color: "rgba(255, 255, 255, 0.4)",
  fontSize: "0.875rem",
});

const Tagline = styled(Typography)({
  color: "rgba(255, 255, 255, 0.25)",
  fontSize: "0.75rem",
});

/**
 * Footer component with copyright and tagline.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <FooterContent>
          <Copyright>CLA @ 2016 - {currentYear}</Copyright>
          <Tagline>Crafting Digital Experiences</Tagline>
        </FooterContent>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
