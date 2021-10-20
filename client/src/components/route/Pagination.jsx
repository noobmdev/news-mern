import { Box, Button, HStack } from "@chakra-ui/react";
import React from "react";

export const Pagination = ({
  total = 0,
  perPage = 10,
  currentPage = 1,
  onChange = (page) => null,
}) => {
  return (
    <HStack justify="center">
      {total !== 0 && currentPage !== 1 && (
        <Button colorScheme="teal">Pre</Button>
      )}
      <HStack fontWeight="semibold">
        {new Array(Math.round(total / perPage)).fill("").map((p, idx) => (
          <Box
            px="2"
            cursor="pointer"
            borderRadius="full"
            bg={currentPage === idx + 1 ? "teal" : ""}
            color={currentPage === idx + 1 ? "white" : ""}
            onClick={() => idx + 1 !== currentPage && onChange(idx + 1)}
          >
            {idx + 1}
          </Box>
        ))}
      </HStack>
      {currentPage * perPage < total && (
        <Button colorScheme="teal">Next</Button>
      )}
    </HStack>
  );
};
