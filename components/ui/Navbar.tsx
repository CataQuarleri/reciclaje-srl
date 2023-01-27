import NextLink from "next/link";
import { useRouter } from "next/router";

import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Box,
  Link,
  Button,
} from "@mui/material";
import { AccountCircle, MenuOutlined } from "@mui/icons-material";

export const Navbar = () => {
  const { asPath } = useRouter();

  return (
    <AppBar position="static">
      <Toolbar>
        <NextLink href="/" passHref legacyBehavior>
          <Link sx={{ mr: "10px", color: "white", fontSize: "20px" }}>TODO-REC</Link>
        </NextLink>

        <Box flex={1} />

        <Box className="fadeIn" sx={{ display: { xs: "none", sm: "flex" } }}>
          <NextLink href="/" passHref legacyBehavior>
            <Link sx={{ mr: "10px" }}>
              <Button color={asPath === "/" ? "primary" : "info"}>
                Inicio
              </Button>
            </Link>
          </NextLink>

          <NextLink href="/products" passHref legacyBehavior>
            <Link sx={{ mr: "10px" }}>
              <Button color={asPath === "/products" ? "primary" : "info"}>
                Productos
              </Button>
            </Link>
          </NextLink>

          <NextLink href="/services" passHref legacyBehavior>
            <Link sx={{ mr: "10px" }}>
              <Button color={asPath === "/services" ? "primary" : "info"}>
                Servicios
              </Button>
            </Link>
          </NextLink>

          <NextLink href="/blog" passHref legacyBehavior>
            <Link sx={{ mr: "10px" }}>
              <Button color={asPath === "/blog" ? "primary" : "info"}>
                Novedades
              </Button>
            </Link>
          </NextLink>

          <NextLink href="/contact" passHref legacyBehavior>
            <Link>
              <Button color={asPath === "/contact" ? "primary" : "info"}>
                Contacto
              </Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />

        <IconButton size="large" color="info">
          <AccountCircle />
        </IconButton>

        <IconButton
          sx={{ display: { xs: "flex", sm: "none" } }}
          size="large"
          color="info"
        >
          <MenuOutlined />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
