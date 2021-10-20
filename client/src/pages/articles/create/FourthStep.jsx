import { Box, Button, HStack, Select, VStack } from "@chakra-ui/react";
import { HANDLE_ACTIONS } from "keys";

const AdditionalFile = ({ idx, file, handleFileAdditionalActions }) => {
  return (
    <HStack key={idx} spacing="4">
      <Button
        onClick={() => handleFileAdditionalActions(HANDLE_ACTIONS.REMOVE, idx)}
        colorScheme="red"
      >
        X
      </Button>
      <Box>
        <Select>
          <option>File type</option>
        </Select>
      </Box>

      <Box
        bg="gray.200"
        p="2"
        borderRadius="md"
        minW="24"
        cursor="pointer"
        _hover={{ bg: "gray.100" }}
      >
        <label
          htmlFor={`file-${idx}`}
          style={{
            cursor: "pointer",
          }}
        >
          Choose file
        </label>
      </Box>
      <Box>{file?.name ?? "No file chosen"}</Box>
      <input
        id={`file-${idx}`}
        style={{
          visibility: "hidden",
        }}
        type="file"
        onChange={(e) =>
          handleFileAdditionalActions(HANDLE_ACTIONS.CHANGE, idx, e)
        }
      />
    </HStack>
  );
};

export const FourthStep = ({
  setArticleFile,
  additionalFiles,
  handleFileAdditionalActions,
}) => {
  return (
    <Box>
      <Box>
        File content of article <span className="required-field">(*)</span>
      </Box>
      <input type="file" onChange={(e) => setArticleFile(e.target.files[0])} />

      <HStack>
        <Box>Additional files</Box>
        <Button
          colorScheme="teal"
          onClick={() => handleFileAdditionalActions(HANDLE_ACTIONS.ADD)}
        >
          Add
        </Button>
      </HStack>
      <VStack spacing="4" py="4" align="flex-start">
        {additionalFiles.map((file, idx) => (
          <AdditionalFile
            key={idx}
            idx={idx}
            file={file}
            handleFileAdditionalActions={handleFileAdditionalActions}
          />
        ))}
      </VStack>
    </Box>
  );
};
