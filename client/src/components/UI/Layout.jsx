import {
  Box,
  Button,
  HStack,
  Image,
  Input,
  Select,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { LANGUAGES_SUPPORTED } from "language/index";
import { GlobalContext } from "context/GlobalContext";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslate } from "hooks/useTranslate";
import { TriangleDownIcon } from "@chakra-ui/icons";

export const Layout = ({ children }) => {
  const { isAuthenticated, user, language, setLanguage, getLists, logout } =
    useContext(GlobalContext);
  const { t } = useTranslate();

  useEffect(() => {
    getLists();
  }, []);

  const hanldeChangeLanguage = () => {
    const restLanguage = Object.values(LANGUAGES_SUPPORTED).find(
      (lang) => lang !== language
    );
    setLanguage(restLanguage);
  };

  return (
    <Box minH="100vh" pos="relative" pb="10">
      {/* footer */}
      <Box
        h="8"
        pos="absolute"
        left="0"
        right="0"
        bottom="0"
        textAlign="center"
        py="1"
      >
        Copyright &copy;{new Date().getFullYear()} by UTC EDU
      </Box>

      <HStack
        h={20}
        px={8}
        py={4}
        align="center"
        borderBottom="2px solid"
        borderColor="gray.400"
        bg="white"
        zIndex="999"
      >
        <Link to="/">
          <Box h={16}>
            <Image
              h="100%"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Logo_TV_2015.svg/1200px-Logo_TV_2015.svg.png"
              alt="logo"
            />
          </Box>
        </Link>

        <HStack flex="1" justify="flex-end">
          <HStack flex="1" justify="center">
            <HStack
              flex="1"
              maxW={{
                base: "25em",
                lg: "40em",
              }}
            >
              <Box flex="1">
                <Input />
              </Box>
              <Button colorScheme="teal">Go!</Button>
            </HStack>
          </HStack>

          <HStack>
            <Button
              size="sm"
              fontWeight="bold"
              colorScheme="blue"
              onClick={hanldeChangeLanguage}
            >
              {language}
            </Button>
            {isAuthenticated && (
              <Box pos="relative" role="group">
                <Button
                  rightIcon={
                    <TriangleDownIcon
                      w={3}
                      h={3}
                      transition="transform .3s ease"
                      _groupHover={{
                        transform: "rotate(180deg)",
                      }}
                    />
                  }
                  colorScheme="teal"
                >
                  {user.firstname}
                </Button>
                <Box
                  d="none"
                  pos="absolute"
                  right="0"
                  top="calc(100%)"
                  minW="10em"
                  pt="2"
                  _groupHover={{
                    d: "block",
                  }}
                  zIndex="2"
                >
                  <VStack align="stretch" bg="gray.200" p="2">
                    <Link to="/dashboard">
                      <Box
                        p="1"
                        borderRadius="md"
                        cursor="pointer"
                        _hover={{
                          bg: "gray.400",
                        }}
                      >
                        Dashboard
                      </Box>
                    </Link>

                    <Link to="/account">
                      <Box
                        p="1"
                        borderRadius="md"
                        cursor="pointer"
                        _hover={{
                          bg: "gray.400",
                        }}
                      >
                        Account
                      </Box>
                    </Link>

                    <Link to="/change-password">
                      <Box
                        p="1"
                        borderRadius="md"
                        cursor="pointer"
                        _hover={{
                          bg: "gray.400",
                        }}
                      >
                        Change password
                      </Box>
                    </Link>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => logout()}
                    >
                      Logout
                    </Button>
                  </VStack>
                </Box>
              </Box>
            )}
          </HStack>
        </HStack>
      </HStack>

      <Box p="8" className="main-contanier">
        {children}
      </Box>
    </Box>
  );
};
