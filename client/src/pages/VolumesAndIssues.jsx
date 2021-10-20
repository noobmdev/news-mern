import {
  Box,
  Button,
  HStack,
  Table,
  Tbody,
  Td,
  Tr,
  VStack,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { GlobalContext } from "context/GlobalContext";
import RightMenu from "components/UI/RightMenu";

export const VolumesAndIssues = () => {
  const { volumes } = useContext(GlobalContext);
  console.log(volumes);

  return (
    <HStack align="flex-start" spacing="16">
      <VStack align="stretch" flex="1" spacing="8">
        <Box fontSize="2xl" fontWeight="semibold">
          Volumes and issues
        </Box>

        {volumes
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((volume) => (
            <Box>
              <HStack justify="space-between">
                <Box fontSize="xl" fontWeight="semibold">
                  {volume.name}
                </Box>
                <Box>{volume.desc}</Box>
              </HStack>
              <hr />

              <Table variant="simple" color="blue.600">
                <Tbody>
                  {volume.issues
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map((issue) => (
                      <Tr>
                        <Td>
                          {issue.name}
                          {issue.desc && (
                            <Box color="gray.600" mt="2">
                              {issue.desc}
                            </Box>
                          )}
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </Box>
          ))}
      </VStack>

      <RightMenu />
    </HStack>
  );
};
