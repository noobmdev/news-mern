import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import { countries } from "assets/countries-states.json";
import { GlobalContext } from "context/GlobalContext";
import { useFormHook } from "hooks/useFormHook";
import { useTranslate } from "hooks/useTranslate";
import jwtDecode from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { axiosInstance } from "utils/axios";
import * as yup from "yup";

const profile = yup.object().shape({
  email: yup.string().email("email_invalid").required("email_required"),
  // password: yup.string().min(6).required(),
  firstname: yup.string().max(50).required(),
  lastname: yup.string().max(50).required(),
  phone: yup.string().required(),
  postcode: yup.string().min(3).max(9).required(),
  country: yup.string().required(),
  city_provine: yup.string().required(),
  address: yup.string().required(),
  university: yup.string().required(),
  major: yup.string().required(),
  research: yup.string().required(),
});

const Account = () => {
  const { t } = useTranslate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useFormHook(profile);
  const history = useHistory();

  const { majors, user, setCurrentUser } = useContext(GlobalContext);

  const [countryCode, setCountryCode] = useState("VN");
  const [countryStates, setCountryStates] = useState([]);
  const [countryStateSelected, setCountryStateSelected] = useState();

  const [majorSelected, setMajorSelected] = useState();

  useEffect(() => {
    if (user) {
      reset(user);
      console.log(user.major);
      setMajorSelected(user.major);
    }
  }, [user]);

  // useEffect(() => {
  //   !!majors?.length && setMajorSelected(majors[0]._id);
  // }, [majors]);

  useEffect(() => {
    if (countryCode) {
      const currentCountry = countries.find(
        (country) => country.code === countryCode
      );
      if (currentCountry) setCountryStates(currentCountry.states ?? []);
    }
  }, [countryCode]);

  useEffect(() => {
    if (countryStates) {
      const defaultState = countryStates[0];
      if (defaultState) setCountryStateSelected(defaultState.code);
    }
  }, [countryStates]);

  function onSubmit(values) {
    console.log(values);
    axiosInstance
      .put("/auth/users", values)
      .then((res) => {
        const { token } = res.data;
        if (token) {
          const decoded = jwtDecode(token);
          setCurrentUser(decoded);
          localStorage.setItem("token", token);
        }
        alert("Update success");
      })
      .catch((err) => console.error(err));
  }

  return (
    <VStack align="center">
      <Box w="48em">
        <form>
          <Grid templateColumns="repeat(2, 1fr)" gap="4">
            <FormControl
              isInvalid={!!errors?.email?.message}
              errortext={errors?.email?.message}
              isRequired
            >
              <FormLabel>{t("email")}</FormLabel>
              <Input
                name="email"
                placeholder={t("email")}
                {...register("email")}
              />
              <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
            </FormControl>

            <GridItem colStart="1">
              <FormControl
                isInvalid={!!errors?.firstname?.message}
                errortext={errors?.firstname?.message}
                isRequired
              >
                <FormLabel>{t("firstname")}</FormLabel>
                <Input
                  name="firstname"
                  placeholder={t("firstname")}
                  {...register("firstname")}
                />
                <FormErrorMessage>
                  {errors?.firstname?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            {/* <FormControl
              isInvalid={!!errors?.password?.message}
              errortext={errors?.password?.message}
              isRequired
            >
              <FormLabel>{t("password_confirm")}</FormLabel>
              <Input
                type="password"
                placeholder="Password"
                name="password"
                {...register("password")}
              />
              <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
            </FormControl> */}

            <FormControl
              isInvalid={!!errors?.lastname?.message}
              errortext={errors?.lastname?.message}
              isRequired
            >
              <FormLabel>{t("lastname")}</FormLabel>
              <Input
                name="lastname"
                placeholder={t("lastname")}
                {...register("lastname")}
              />
              <FormErrorMessage>{errors?.lastname?.message}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!errors?.phone?.message}
              errortext={errors?.phone?.message}
              isRequired
            >
              <FormLabel>{t("phone")}</FormLabel>
              <Input
                name="phone"
                placeholder={t("phone")}
                {...register("phone")}
              />
              <FormErrorMessage>{errors?.phone?.message}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!errors?.postcode?.message}
              errortext={errors?.postcode?.message}
              isRequired
            >
              <FormLabel>{t("postcode")}</FormLabel>
              <Input
                name="postcode"
                placeholder={t("postcode")}
                {...register("postcode")}
              />
              <FormErrorMessage>{errors?.postcode?.message}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!errors?.country?.message}
              errortext={errors?.country?.message}
              isRequired
            >
              <FormLabel>{t("country")}</FormLabel>
              <Select
                value={countryCode}
                // name="country"
                {...register("country")}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors?.country?.message}</FormErrorMessage>
            </FormControl>

            {countryStates?.length > 0 && countryStateSelected && (
              <FormControl
                isInvalid={!!errors?.city_provine?.message}
                errortext={errors?.city_provine?.message}
                isRequired
              >
                <FormLabel>{t("city_provine")}</FormLabel>
                <Select
                  value={countryStateSelected}
                  {...register("city_provine")}
                  onChange={(e) => setCountryStateSelected(e.target.value)}
                >
                  {countryStates.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </Select>

                <FormErrorMessage>
                  {errors?.city_provine?.message}
                </FormErrorMessage>
              </FormControl>
            )}

            <GridItem colSpan="2">
              <FormControl
                isInvalid={!!errors?.address?.message}
                errortext={errors?.address?.message}
                isRequired
              >
                <FormLabel>{t("address")}</FormLabel>
                <Input
                  name="address"
                  placeholder={t("address")}
                  {...register("address")}
                />
                <FormErrorMessage>{errors?.address?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan="2">
              <FormControl
                isInvalid={!!errors?.university?.message}
                errortext={errors?.university?.message}
                isRequired
              >
                <FormLabel>{t("university")}</FormLabel>
                <Input
                  name="university"
                  placeholder={t("university")}
                  {...register("university")}
                />
                <FormErrorMessage>
                  {errors?.university?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <FormControl
              isInvalid={!!errors?.major?.message}
              errortext={errors?.major?.message}
              isRequired
            >
              <FormLabel>{t("major")}</FormLabel>
              <Select
                name="major"
                {...register("major")}
                onChange={(e) => {
                  setMajorSelected(e.target.value);
                  setValue("research", undefined);
                }}
                // defaultValue=""
              >
                <option value="" style={{ display: "none" }}>
                  {t("choose_major")}
                </option>
                {majors.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors?.major?.message}</FormErrorMessage>
            </FormControl>

            {majorSelected && (
              <FormControl
                isInvalid={!!errors?.research?.message}
                errortext={errors?.research?.message}
                isRequired
              >
                <FormLabel>{t("research")}</FormLabel>
                <Select name="research" {...register("research")}>
                  <option value="" style={{ display: "none" }}>
                    {t("choose_research")}
                  </option>
                  {majors
                    .find((m) => m._id === majorSelected)
                    ?.researches.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name}
                      </option>
                    ))}
                </Select>
                <FormErrorMessage>{errors?.research?.message}</FormErrorMessage>
              </FormControl>
            )}

            <GridItem colSpan="2">
              <Box textAlign="center">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
                  mx="4"
                  w="40"
                  colorScheme="teal"
                  variant="solid"
                  isLoading={isSubmitting}
                  disabled={!!errors?.email || !!errors?.password}
                >
                  {t("update")}
                </Button>
              </Box>
            </GridItem>
          </Grid>
        </form>
      </Box>
    </VStack>
  );
};

export default Account;
