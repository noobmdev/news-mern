import { VStack, Box, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React from "react";
import { useTranslate } from "hooks/useTranslate";

const RightMenu = () => {
  const { t } = useTranslate();

  return (
    <VStack align="stretch" w="35%" minW="80" maxW="96">
      <VStack
        spacing="4"
        align="stretch"
        p="4"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        color="blue.600"
      >
        <Box color="black" fontSize="xl" fontWeight="semibold">
          {t("for_author")}
        </Box>
        <hr />

        <Link
          to={{
            pathname: "/submission-guidelines/",
          }}
        >
          <Box cursor="pointer">{t("submit_guidelines")}</Box>
        </Link>
        <Link
          to={{
            pathname: "/contact-the-journal/",
          }}
        >
          <Box cursor="pointer">{t("contact_the_journal")}</Box>
        </Link>

        <Link to="/articles/new">
          <Button colorScheme="blue" w="100%">
            {t("submit_manuscript")}
          </Button>
        </Link>
      </VStack>

      <VStack
        spacing="4"
        align="stretch"
        p="4"
        border="2px solid"
        borderColor="gray.200"
        borderRadius="md"
        color="blue.600"
      >
        <Box color="black" fontSize="xl" fontWeight="semibold">
          {t("explore")}
        </Box>
        <hr />

        <Link to="/volumes-and-issues">
          <Box>{t("volume_and_issues")}</Box>
        </Link>
      </VStack>
    </VStack>
  );
};

export default RightMenu;
