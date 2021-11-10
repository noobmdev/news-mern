import {
  Box,
  Checkbox,
  CheckboxGroup,
  HStack,
  Select,
  VStack,
} from "@chakra-ui/react";
import { GlobalContext } from "context/GlobalContext";
import React, { useContext } from "react";

export const FirstStep = ({
  articleType,
  setArticleType,
  researchTopics,
  setResearchTopics,
}) => {
  const { majors } = useContext(GlobalContext);

  return (
    <Box>
      <HStack>
        <Box>
          Select article type <span className="required-field">(*)</span>
        </Box>
        <Box>
          <Select value="">
            <option value="">Manuscript</option>
          </Select>
        </Box>
      </HStack>

      <HStack my="4">
        <Box>
          Select article's major <span className="required-field">(*)</span>
        </Box>
        <Box>
          <Select
            value={articleType}
            onChange={(e) => {
              setArticleType(e.target.value);
              setResearchTopics([]);
            }}
          >
            {majors.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </Select>
        </Box>
      </HStack>

      <Box>
        Choose article's research topics{" "}
        <span className="required-field">(*)</span>
      </Box>
      <Box border="1px solid" maxH="64" overflowY="scroll" px="8" py="4">
        <CheckboxGroup
          colorScheme="green"
          value={researchTopics}
          onChange={(values) => setResearchTopics(values)}
        >
          <VStack align="flex-start" spacing="4" fontWeight="semibold">
            {majors
              .find((m) => m._id === articleType)
              ?.researches.map((r) => (
                <Checkbox key={r._id} value={r._id}>
                  {r.name}
                </Checkbox>
              ))}
          </VStack>
        </CheckboxGroup>
      </Box>
    </Box>
  );
};
