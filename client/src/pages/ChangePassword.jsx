import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, VStack } from "@chakra-ui/layout";
import { HStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { Icon } from "@chakra-ui/icon";
import React, { useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";
import { axiosInstance } from "utils/axios";

const ChangePassword = () => {
  const [isShowPassword, setIsShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const [value, setValue] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    if (
      !value.currentPassword.trim() ||
      !value.newPassword.trim() ||
      !value.confirmNewPassword.trim()
    ) {
      return alert("Please fill all fields");
    }

    if (value.newPassword.trim() !== value.confirmNewPassword.trim()) {
      return alert("Confirm password is not match");
    }

    setIsSubmitting(true);
    axiosInstance
      .post("/auth/change-password", value)
      .then((_) => {
        alert("Change password success");

        setIsSubmitting(false);
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.log(err.response.data);
        if (typeof err.response?.data === "string") {
          alert(err.response?.data);
        } else alert("Something went error");
      });
  };

  return (
    <HStack justify="center">
      <Box w="96">
        <VStack align="stretch" spacing="4">
          <FormControl isRequired>
            <FormLabel>Current Password</FormLabel>
            <InputGroup>
              <Input
                pr="4.5rem"
                type={isShowPassword.currentPassword ? "text" : "password"}
                placeholder="Enter password"
                value={value.currentPassword}
                onChange={(e) =>
                  setValue((pre) => ({
                    ...pre,
                    currentPassword: e.target.value,
                  }))
                }
              />
              <InputRightElement>
                {isShowPassword.currentPassword ? (
                  <Icon
                    as={BiHide}
                    cursor="pointer"
                    onClick={() =>
                      setIsShowPassword((pre) => ({
                        ...pre,
                        currentPassword: !pre.currentPassword,
                      }))
                    }
                  />
                ) : (
                  <Icon
                    as={BiShow}
                    cursor="pointer"
                    onClick={() =>
                      setIsShowPassword((pre) => ({
                        ...pre,
                        currentPassword: !pre.currentPassword,
                      }))
                    }
                  />
                )}
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <Input
                pr="4.5rem"
                type={isShowPassword.newPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={value.newPassword}
                onChange={(e) =>
                  setValue((pre) => ({
                    ...pre,
                    newPassword: e.target.value,
                  }))
                }
              />
              <InputRightElement>
                {isShowPassword.newPassword ? (
                  <Icon
                    as={BiHide}
                    cursor="pointer"
                    onClick={() =>
                      setIsShowPassword((pre) => ({
                        ...pre,
                        newPassword: !pre.newPassword,
                      }))
                    }
                  />
                ) : (
                  <Icon
                    as={BiShow}
                    cursor="pointer"
                    onClick={() =>
                      setIsShowPassword((pre) => ({
                        ...pre,
                        newPassword: !pre.newPassword,
                      }))
                    }
                  />
                )}
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Confirm New Password</FormLabel>
            <InputGroup>
              <Input
                pr="4.5rem"
                type={isShowPassword.confirmNewPassword ? "text" : "password"}
                placeholder="Enter confirm new password"
                value={value.confirmNewPassword}
                onChange={(e) =>
                  setValue((pre) => ({
                    ...pre,
                    confirmNewPassword: e.target.value,
                  }))
                }
              />
              <InputRightElement>
                {isShowPassword.confirmNewPassword ? (
                  <Icon
                    as={BiHide}
                    cursor="pointer"
                    onClick={() =>
                      setIsShowPassword((pre) => ({
                        ...pre,
                        confirmNewPassword: !pre.confirmNewPassword,
                      }))
                    }
                  />
                ) : (
                  <Icon
                    as={BiShow}
                    cursor="pointer"
                    onClick={() =>
                      setIsShowPassword((pre) => ({
                        ...pre,
                        confirmNewPassword: !pre.confirmNewPassword,
                      }))
                    }
                  />
                )}
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            colorScheme="teal"
            onClick={handleSave}
            isLoading={isSubmitting}
          >
            Save
          </Button>
        </VStack>
      </Box>
    </HStack>
  );
};

export default ChangePassword;
