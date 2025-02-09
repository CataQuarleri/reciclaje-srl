import { useEffect, useContext, useState } from "react";
import { NextPage } from "next";
import NextLink from "next/link";

import { useServices } from "@/hooks/useServices";

import { MainLayout } from "../components/layouts";
import { CardServicesHome } from "@/components/services";
import { ModalSubscribe } from "@/components/mailchimp";

import { Carrousel, FullScreenLoading } from "@/components/ui";
import { Typography, Divider, Grid, Button, Box, Link } from "@mui/material";
import { content } from "@/utils";
import { UiContext } from "@/context";
import { LocationOnOutlined } from "@mui/icons-material";

const HomePage: NextPage = () => {
  const { services, isLoading } = useServices("/services");
  const { toggleModalOpen } = useContext(UiContext);
  const [wasModalOpen, setWasModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const wasModalOpen = sessionStorage.getItem("openModal");
      if (wasModalOpen !== "true") {
        toggleModalOpen();
        sessionStorage.setItem("openModal", "true");
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout title={content.home.title} metaHeader={content.home.metaHeader}>
      <ModalSubscribe />

      <Typography
        variant="h1"
        component="h1"
        sx={{ textAlign: "center", mb: 2 }}
      >
        {content.home.title}
      </Typography>

      <Carrousel />

      <Divider sx={{ mt: 5 }} />

      <Typography
        variant="h2"
        sx={{ textAlign: "center", my: 4, fontSize: "34px" }}
      >
        {content.home.descriptionTitle}
      </Typography>

      <Typography variant="body1">{content.home.descriptionInfo}</Typography>

      <Divider sx={{ mt: 5 }} />

      <Typography
        variant="h2"
        sx={{ textAlign: "center", my: 4, fontSize: "34px" }}
      >
        {content.services.title}
      </Typography>

      {isLoading ? (
        <FullScreenLoading />
      ) : (
        <Grid
          container
          spacing={4}
          width="100%"
          sx={{ flexDirection: { xs: "column", sm: "row" }, flexWrap: "wrap" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {services.map((svc, i) => {
            return (
              <Grid
                key={i}
                item
                xs={12}
                md={6}
                display="flex"
                justifyContent="space-evenly"
                alignItems="center"
              >
                <NextLink
                  href={`/services#${svc.title}`}
                  passHref
                  legacyBehavior
                >
                  <Button
                    sx={{
                      backgroundColor: "#008f39",
                      width: "70%",
                      height: "120%",
                      "&:hover": { border: "2px solid #008f39" },
                    }}
                  >
                    {svc.title}
                  </Button>
                </NextLink>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Divider sx={{ my: 5 }} />

      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography
          variant="h2"
          sx={{ textAlign: "center", my: 4, fontSize: "34px", mr: 1 }}
        >
          Ubicación
        </Typography>

        <LocationOnOutlined sx={{ fontSize: "34px", color: "#008f39" }} />
      </Box>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497.5300291294314!2d-60.64673352873913!3d-32.97820004482624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7abbc8c011071%3A0x4a32208737d1a0af!2sValdes%201163%2C%20S2000%20Rosario%2C%20Santa%20Fe!5e0!3m2!1ses!2sar!4v1674076905543!5m2!1ses!2sar"
        width="100%"
        height="450"
        loading="lazy"
      ></iframe>
    </MainLayout>
  );
};

export default HomePage;
