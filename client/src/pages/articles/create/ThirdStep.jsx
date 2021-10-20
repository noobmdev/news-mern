import {
  Box,
  Checkbox,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  VStack,
} from "@chakra-ui/react";
import React from "react";

export const ThirdStep = ({
  isPosted,
  wherePosted,
  canShareManuscript,
  isAcceptTerm,
  onChange,
}) => {
  console.log(isPosted, canShareManuscript, isAcceptTerm);
  return (
    <VStack spacing="4" align="flex-start">
      <Box w="100%">
        <HStack>
          <Box>Did you post it somewhere else?</Box>
          <Box>
            <Select
              value={isPosted}
              onChange={(e) => onChange("is_posted", +e.target.value)}
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </Select>
          </Box>
        </HStack>
        <Input
          isDisabled={!!+isPosted ? false : true}
          placeholder="Did you post it somewhere else? Ex ABC"
          value={wherePosted}
          onChange={(e) => onChange("where_posted", e.target.value)}
        />
      </Box>

      <Box>
        <Box d="inline-block">
          Bạn và tác giả của bài manuscript này có cho phép share manuscript này
          để thực hiện các công việc như: record trên occid, reviewer track tình
          trạng manuscript, cơ hội hợp tác với tác giả khác, nhận các feedback
          và các commnet từ cộng đồng,... hay không?{" "}
          <span className="required-field">(*)</span>
          <RadioGroup
            pl="4"
            d="inline-block"
            value={canShareManuscript + ""}
            onChange={(value) => onChange("can_share", +value)}
          >
            <HStack direction="row">
              <Radio value="1">Yes</Radio>
              <Radio value="0">No</Radio>
            </HStack>
          </RadioGroup>
        </Box>
      </Box>

      <HStack align="flex-start" spacing="4">
        <Box pt="2">
          <Checkbox
            isChecked={isAcceptTerm}
            onChange={(e) => onChange("is_accept", !isAcceptTerm)}
          />
        </Box>
        <Box>
          Tôi đồng ý với các điều khoản xuất bản tạp chí, đồng ý chia sẻ,...Tôi
          đồng ý với các điều khoản xuất bản tạp chí, đồng ý chia sẻ,...Tôi đồng
          ý với các điều khoản xuất bản tạp chí, đồng ý chia sẻ,...Tôi đồng ý
          với các điều khoản xuất bản tạp chí, đồng ý chia sẻ,...Tôi đồng ý với
          các điều khoản xuất bản tạp chí, đồng ý chia sẻ,...Tôi đồng ý với các
          điều khoản xuất bản tạp chí, đồng ý chia sẻ,...Tôi đồng ý với các điều
          khoản xuất bản tạp chí, đồng ý chia sẻ,...Tôi đồng ý với các điều
          khoản xuất bản tạp chí, đồng ý chia sẻ,...{" "}
          <span className="required-field">(*)</span>
        </Box>
      </HStack>
    </VStack>
  );
};
