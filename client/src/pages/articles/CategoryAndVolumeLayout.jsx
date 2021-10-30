import { Box, HStack, Icon } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaSortDown } from "react-icons/fa";

const ListItem = ({ item }) => {
  const [isShowChildList, setIsShowChildList] = useState(false);

  return (
    <Box px="6" py="1">
      <HStack align="center" spacing="0">
        <Box>{item.name}</Box>
        <Icon
          as={FaSortDown}
          onClick={() => setIsShowChildList((preState) => !preState)}
          transform={isShowChildList ? "" : "rotate(-90deg)"}
          cursor="pointer"
          transition="all .3s ease"
        />
      </HStack>
      {isShowChildList &&
        item.subs.map((sub, idx) =>
          sub?.subs ? (
            <ListItem item={sub} key={idx} />
          ) : (
            <Box ml="6" py="0.5">
              {sub.name}
            </Box>
          )
        )}
    </Box>
  );
};

const List = ({ listName, items }) => {
  const [isShow, setIsShow] = useState(true);
  return (
    <Box>
      <HStack align="center" spacing="0">
        <Box>{listName}</Box>
        <Icon
          as={FaSortDown}
          onClick={() => setIsShow((preState) => !preState)}
          transform={isShow ? "" : "rotate(-90deg)"}
          cursor="pointer"
          transition="all .3s ease"
        />
      </HStack>
      {isShow && items.map((item, idx) => <ListItem item={item} key={idx} />)}
    </Box>
  );
};

export const CategoryAndVolumeLayout = ({ children }) => {
  return (
    <Box pos="relative">
      <Box pr="24em">{children}</Box>
      <Box w="20em" pos="absolute" right="0" top="0">
        <List listName="All category" items={categories} />
        <List listName="All years" items={years} />
      </Box>
    </Box>
  );
};
