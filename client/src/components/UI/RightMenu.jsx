import { VStack, Box, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React from "react";

const RightMenu = () => {
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
          For authors
        </Box>
        <hr />

        <Link
          to={{
            pathname: "https://giaothongso.tk/submission-guidelines/",
          }}
          target="_blank"
        >
          <Box cursor="pointer">Submit guidelines</Box>
        </Link>
        <Link
          to={{
            pathname: "https://giaothongso.tk/contact-the-journal/",
          }}
          target="_blank"
        >
          <Box cursor="pointer">Contact the jounal</Box>
        </Link>

        <Link to="/articles/new">
          <Button colorScheme="blue" w="100%">
            Submit manuscript
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
          Explore
        </Box>
        <hr />

        <Link to="/volumes-and-issues">
          <Box>Volume and issues</Box>
        </Link>
      </VStack>
    </VStack>
  );
};

export default RightMenu;
