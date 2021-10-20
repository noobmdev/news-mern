import {
  Box,
  Button,
  Grid,
  HStack,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import withRole from "hocs/withRole";
import { ROLES } from "keys";
import React, { useState } from "react";

const ReviewByRole = () => {
  const [role, setRole] = useState(ROLES.REVIEWER);

  const renderByRole = () => {
    switch (role) {
      case ROLES.EDITOR:
      case ROLES.PUBLISHER:
        return (
          <Box>
            <Grid
              templateColumns="10em 1fr"
              gap="8"
              border="1px solid"
              p="4"
              bg="gray.100"
            >
              <Box textAlign="right" fontSize="lg" fontWeight="semibold">
                Article Name
              </Box>
              <Box>
                Improve something Improve somethingImprove somethingImprove
                something
              </Box>

              <Box textAlign="right" fontSize="lg" fontWeight="semibold">
                Research Topics
              </Box>
              <Box>Chu de 1, chu de 2, chu de 3</Box>

              <Box textAlign="right" fontSize="lg" fontWeight="semibold">
                File content
              </Box>
              <Box color="blue.600" textDecor="underline" cursor="pointer">
                Tai file PDF da build
              </Box>

              <Box textAlign="right" fontSize="lg" fontWeight="semibold">
                Comment to editorial board
              </Box>
              <Textarea bg="white" placeholder="Comment" />
            </Grid>
            <HStack py="4">
              <Box fontSize="lg" fontWeight="semibold">
                Pushlish this article?
              </Box>
              <Box>
                <Select>
                  <option>Yes</option>
                  <option>No</option>
                </Select>
              </Box>
            </HStack>

            <Box fontSize="lg" fontWeight="semibold">
              Comments
            </Box>
            <Textarea
              borderColor="black"
              minH="40"
              placeholder="Comment something Comment something Comment something Comment something Comment something Comment something "
            />
            <HStack mt="4" justify="center" spacing="8">
              <Button colorScheme="red">Cancel</Button>
              <Button colorScheme="blue">Save</Button>
            </HStack>
          </Box>
        );

      case ROLES.REVIEWER:
        return (
          <Box>
            <Grid
              templateColumns="10em 1fr"
              border="1px solid"
              gap="8"
              p="4"
              bg="gray.100"
            >
              <Box textAlign="right" fontSize="lg" fontWeight="semibold">
                Article Name
              </Box>
              <Box>
                Improve something Improve somethingImprove somethingImprove
                something
              </Box>

              <Box textAlign="right" fontSize="lg" fontWeight="semibold">
                Research Topics
              </Box>
              <Box>Chu de 1, chu de 2, chu de 3</Box>

              <Box textAlign="right" fontSize="lg" fontWeight="semibold">
                File content
              </Box>
              <Box color="blue.600" textDecor="underline" cursor="pointer">
                Tai file PDF da build
              </Box>
            </Grid>
            <HStack py="4">
              <Box fontSize="lg" fontWeight="semibold">
                Pushlish this article?
              </Box>
              <Box>
                <Select>
                  <option>Yes</option>
                  <option>No</option>
                </Select>
              </Box>
            </HStack>

            <Box fontSize="lg" fontWeight="semibold">
              Comments
            </Box>
            <Textarea
              borderColor="black"
              minH="40"
              placeholder="Comment something Comment something Comment something Comment something Comment something Comment something "
            />

            <HStack mt="4" justify="center" spacing="8">
              <Button colorScheme="red">Cancel</Button>
              <Button colorScheme="blue">Save</Button>
            </HStack>
          </Box>
        );
      default:
        return;
    }
  };

  return (
    <Box>
      <HStack>
        <Box>Select role</Box>
        <Box>
          <Select
            style={{ textTransform: "uppercase" }}
            onChange={(e) => setRole(+e.target.value)}
            value={role}
          >
            {Object.keys(ROLES).map((r, idx) => (
              <option value={ROLES[r]} key={idx}>
                {r}
              </option>
            ))}
          </Select>
        </Box>
      </HStack>
      <Box fontSize="xl" fontWeight="bold" textAlign="center">
        Review/Accept Article
      </Box>
      {renderByRole()}
    </Box>
  );
};

export default withRole(ReviewByRole, [
  ROLES.AUTHOR,
  ROLES.EDITOR,
  ROLES.PUBLISHER,
  ROLES.REVIEWER,
]);
