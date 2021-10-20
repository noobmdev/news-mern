import React, { useContext, useState } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  HStack,
  Box,
  Select,
  InputGroup,
  InputRightElement,
  VStack,
  Grid,
} from "@chakra-ui/react";
import { useFormHook } from "hooks/useFormHook";
import * as yup from "yup";
import { axiosInstance } from "utils/axios";
import { GlobalContext } from "context/GlobalContext";
import jwtDecode from "jwt-decode";
import { useTranslate } from "hooks/useTranslate";
import { BiHide, BiShow } from "react-icons/bi";
import { ROLES } from "keys";
import { Link, useHistory, useLocation } from "react-router-dom";

const loginValidationSchema = yup.object().shape({
  email: yup.string().email("email_invalid").required("email_required"),
  password: yup.string().min(6).required(),
});

export const Login = () => {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslate();
  const { setCurrentUser } = useContext(GlobalContext);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useFormHook(loginValidationSchema);

  const [isShowPwd, setIsShowPwd] = useState(false);

  const onSubmit = (values) => {
    axiosInstance
      .post("/auth/login", values)
      .then((res) => {
        const { token } = res.data;
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setCurrentUser(decoded);
            localStorage.setItem("token", token);
            history.push("/dashboard");

            // if (location.state.prePath) {
            //   history.push(location.state.prePath);
            // } else {
            //   history.push("/dashboard");
            // }
          } catch (err) {
            console.log(err);
          }
        }
      })
      .catch((err) => console.error(err));
  };
  return (
    <VStack align="center">
      <Box w="24em">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid gap="4">
            <FormControl
              isInvalid={!!errors?.email?.message}
              errortext={errors?.email?.message}
              isRequired
            >
              <FormLabel>{t("email")}</FormLabel>
              <Input name="email" placeholder="Email" {...register("email")} />
              <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!errors?.password?.message}
              errortext={errors?.password?.message}
              isRequired
            >
              <FormLabel>{t("password")}</FormLabel>
              <InputGroup>
                <Input
                  type={isShowPwd ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  {...register("password")}
                />
                <InputRightElement
                  cursor="pointer"
                  children={isShowPwd ? <BiHide /> : <BiShow />}
                  onClick={() => setIsShowPwd((preState) => !preState)}
                />
              </InputGroup>
              <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
            </FormControl>

            {/* <FormControl
              isInvalid={!!errors?.role?.message}
              errortext={errors?.role?.message}
              isRequired
            >
              <FormLabel>{t("role")}</FormLabel>
              <Select
                name="role"
                style={{ textTransform: "uppercase" }}
                defaultValue={ROLES.AUTHOR}
                {...register("role")}
              >
                {Object.keys(ROLES).map((r, idx) => (
                  <option value={ROLES[r]} key={idx}>
                    {ROLES[r]}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors?.role?.message}</FormErrorMessage>
            </FormControl> */}

            <Box textAlign="center">
              <Button
                type="submit"
                mx="4"
                w="40"
                colorScheme="teal"
                variant="solid"
                isLoading={isSubmitting}
                disabled={!!errors?.email || !!errors?.password}
              >
                {t("login")}
              </Button>
            </Box>
          </Grid>
        </form>
        <HStack pt="4" color="teal" justify="space-between">
          <Link to="/auth/forgot-password">
            <Box>{t("forgot_pwd")}</Box>
          </Link>
          <Link to="/auth/register">
            <Box>{t("create_new_account")}</Box>
          </Link>
        </HStack>
      </Box>
    </VStack>
  );
};
