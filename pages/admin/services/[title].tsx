import {
  ChangeEvent,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GetServerSideProps } from "next";
import { UiContext } from "@/context/ui";

import { useRouter } from "next/router";

import { MainLayout } from "../../../components/layouts";
import { IServiceSchema } from "../../../interfaces";
import { Service } from "@/models";

import { dbServices } from "@/database";

import { useForm } from "react-hook-form";

import axios from "axios";

import { ModalCancelChanges } from "@/components/admin/ModalCancelChanges";

import {
  BorderColorOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  Chip,
  Divider,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

interface FormData {
  _id?: string;
  title: string;
  images: string[];
  description: string;
}

interface Props {
  service: IServiceSchema;
}

const ServiceAdminPage: FC<Props> = ({ service }) => {
  const { toggleModalCancelChange } = useContext(UiContext);
  const [isSaving, setIsSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [stateUrl, setStateUrl] = useState<string>("");

  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormData>({
    defaultValues: service,
  });

  useEffect(() => {
    const message = "no te vayas plis";

    const routeChangeStart = (url: string) => {
      setStateUrl(url);
      if (router.asPath !== url && unsavedChanges) {
        toggleModalCancelChange();
        throw "Abort route change. Please ignore this error.";
      }
    };

    const beforeunload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        toggleModalCancelChange();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", beforeunload);
    router.events.on("routeChangeStart", routeChangeStart);

    return () => {
      window.removeEventListener("beforeunload", beforeunload);
      router.events.off("routeChangeStart", routeChangeStart);
    };
  }, [unsavedChanges]);

  const selectFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("No se han seleccionado archivos");
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "type",
        `service/${getValues("title").replaceAll(" ", "-").toLowerCase()}`
      );

      for (let i = 0; i < e.target.files.length; i++) {
        formData.append(`images`, e.target.files[i]);
        const { data } = await axios.post("/api/admin/upload", formData);
        console.log("response", data);
        setValue("images", [...getValues("images"), data.url], {
          shouldValidate: true,
        });
        setUnsavedChanges(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTitleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue("title", e.target.value, {
      shouldValidate: true,
    });

    if (service.title === getValues("title")) {
      setUnsavedChanges(false);
    } else {
      setUnsavedChanges(true);
    }
  };

  const handleDescriptionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue("description", e.target.value, {
      shouldValidate: true,
    });

    if (service.description === getValues("description")) {
      setUnsavedChanges(false);
    } else {
      setUnsavedChanges(true);
    }
  };

  function compareArrays(arr1: string[], arr2: string[]) {
    if (arr1.length === arr2.length) {
      return arr1.every(function (element, index) {
        if (element === arr2[index]) {
          setUnsavedChanges(false);
        } else {
          setUnsavedChanges(true);
        }
      });
    } else {
      return setUnsavedChanges(true);
    }
  }

  const onDeleteImage = async (image: string) => {
    const imageName = image.replace(
      "https://todorecsrl-test-dev.s3.sa-east-1.amazonaws.com/",
      ""
    );
    await axios.post("/api/admin/deleteImageFromS3", {
      key: imageName,
    });
    setValue(
      "images",
      getValues("images").filter((img) => img !== image),
      { shouldValidate: true }
    );

    compareArrays(service.images, getValues("images"));
  };

  const deleteUnsavedChanges = async () => {
    try {
      setUnsavedChanges(false);
      const serviceName = service.title.replaceAll(" ", "-").toLowerCase();

      const { data } = await axios.post("/api/admin/getFiles", {
        serviceName: serviceName,
      });

      const url = "https://todorecsrl-test-dev.s3.sa-east-1.amazonaws.com/";
      const imagesInDB = service.images.map((oneImage) => {
        return oneImage.replace(url, "");
      });

      const imagesInS3 = data.objects.filter(
        (img: string) => !imagesInDB.includes(img)
      );

      await imagesInS3.map((eachImage: string) => {
        axios.post("/api/admin/deleteImageFromS3", {
          key: eachImage,
        });
      });

      router.push(stateUrl || "/");

      toggleModalCancelChange();
    } catch (error) {
      console.log("ALGO SALIÓ MAL");
      throw new Error("No se pudieron borrar las imagenes");
    }
  };

  const onSubmit = async (form: FormData) => {
    if (form.images.length < 1) return;

    setIsSaving(true);

    try {
      setUnsavedChanges(false);
      const { data } = await axios({
        url: "/api/admin/services",
        method: form._id ? "PUT" : "POST",
        data: form,
      });
      router.replace("/admin/services");

      if (!form._id) {
        router.replace(`/admin/services/${form.title}`);
      } else {
        setIsSaving(false);
      }
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }
  };
  return (
    <MainLayout
      title={service.title}
      metaHeader={
        router.asPath === "/admin/services/new"
          ? "Crear servicio"
          : "Editar servicio"
      }
    >
      {/*//@ts-ignore*/}
      <ModalCancelChanges deleteUnsavedChanges={deleteUnsavedChanges} />
      {router.asPath === "/admin/services/new" ? (
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Typography variant="h1" sx={{ mr: 1 }}>
            Crear servicio
          </Typography>
          <BorderColorOutlined />
        </Box>
      ) : (
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Typography variant="h1" sx={{ mr: 1 }}>
            Editar servicio
          </Typography>
          <BorderColorOutlined />
        </Box>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{
              width: "150px",
              color: "white",
              backgroundColor: "#008f39",
            }}
            type="submit"
            disabled={isSaving}
          >
            Guardar
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Título"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("title", {
                required: "Este campo es requerido",
                minLength: {
                  value: 2,
                  message: "Mínimo 2 caracteres",
                },
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
              onChange={(e) => handleTitleChange(e)}
            />

            <TextField
              label="Descripción"
              variant="filled"
              fullWidth
              multiline
              maxRows={3}
              value={getValues("description") || ""}
              // defaultValue={"Aqui va la descripcion del servicio"}
              sx={{ mb: 1 }}
              {...register("description", {
                required: "Este campo es requerido",
                minLength: {
                  value: 10,
                  message: "Mínimo 10 caracteres",
                },
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
              onChange={(e) => handleDescriptionChange(e)}
            />

            {/* <Divider sx={{ my: 1 }} /> */}
          </Grid>

          {/* Imagenes */}
          <Grid item xs={12} sm={6}>
            <Divider sx={{ my: 2 }} />

            <Box display="flex" flexDirection="column">
              <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
              <Button
                color="secondary"
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{
                  mb: 3,
                  color: "white",
                  backgroundColor: "#008f39",
                }}
                onClick={() => fileInputRef.current?.click()}
                disabled={getValues("title").trim().length === 0 ? true : false}
              >
                Cargar imagen
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png, image/gif, image/jpeg"
                style={{ display: "none" }}
                onChange={(e) => selectFile(e)}
              />

              <Chip
                label="Es necesario al menos 1 imagen"
                color="error"
                variant="outlined"
                sx={{
                  display: getValues("images").length < 1 ? "flex" : "none",
                }}
              />
              <Chip
                label="Es necesario incluir un título para subir una imagen"
                color="error"
                variant="outlined"
                sx={{
                  display:
                    getValues("title").trim().length === 0 ? "flex" : "none",
                }}
              />

              <Grid container spacing={2}>
                {getValues("images").map((img) => (
                  <Grid item xs={4} sm={3} key={img}>
                    <Card>
                      <CardMedia
                        component="img"
                        className="fadeIn"
                        image={img}
                        alt={img}
                      />
                      <CardActions>
                        <Button
                          fullWidth
                          color="error"
                          onClick={() => onDeleteImage(img)}
                        >
                          Borrar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { title = "" } = query;

  let service: IServiceSchema | null;

  if (title === "new") {
    const tempService = JSON.parse(JSON.stringify(new Service()));
    delete tempService._id;
    // tempService.images = ["img1.jpg"];
    service = tempService;
  } else {
    service = await dbServices.getServiceByTitle(title.toString());
  }

  if (!service) {
    return {
      redirect: {
        destination: "/admin/services",
        permanent: false,
      },
    };
  }

  return {
    props: {
      service,
    },
  };
};

export default ServiceAdminPage;
