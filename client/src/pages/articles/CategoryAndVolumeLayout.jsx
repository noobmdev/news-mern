import { Box, HStack, Icon } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaSortDown } from "react-icons/fa";

const categories = [
  {
    id: 1,
    name: "Category 1",
    subs: [
      {
        id: 1,
        name: "Subcategory 1 of category 1",
        subs: [
          { id: 1, name: "Subcategory 1 of category 2" },
          { id: 2, name: "Subcategory 2 of category 2" },
        ],
      },
      { id: 2, name: "Subcategory 2 of category 1" },
    ],
  },
  {
    id: 2,
    name: "Category 2",
    subs: [
      { id: 1, name: "Subcategory 1 of category 2" },
      { id: 2, name: "Subcategory 2 of category 2" },
    ],
  },
];

const years = [
  {
    id: 1,
    name: "Year 2021",
    subs: [
      {
        id: 1,
        name: "Volume 1",
        subs: [
          { id: 1, name: "Volume 1" },
          { id: 2, name: "Volume 2" },
        ],
      },
      { id: 2, name: "Volume 2" },
    ],
  },
  {
    id: 2,
    name: "Year 2022",
    subs: [
      { id: 1, name: "Volume 1" },
      { id: 2, name: "Volume 2" },
    ],
  },
];

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
