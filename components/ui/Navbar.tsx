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
import { AccountCircle, MenuOutlined} from '@mui/icons-material';

export const Navbar = () => {
  const {asPath} = useRouter()

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton>
          <Typography variant="h2" color="white">
            LOGO
          </Typography>
        </IconButton>

        <Box flex={1} />

        <Box className="fadeIn">
          <NextLink href="/products" passHref legacyBehavior>
            <Link sx={{mr: "10px"}}>
              <Button color={asPath === "/products" ? "primary" : "info"}>
                Productos
              </Button>
            </Link>
          </NextLink>

          <NextLink href="/services" passHref legacyBehavior>
            <Link sx={{mr: "10px"}}>
              <Button color={asPath === "/services" ? "primary" : "info"}>
                Servicios
              </Button>
            </Link>
          </NextLink>

          <NextLink href="/blog" passHref legacyBehavior>
            <Link sx={{mr: "10px"}}>
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

        <IconButton size="large" color="info">
          <MenuOutlined />
        </IconButton>

      </Toolbar>
    </AppBar>
  );
};