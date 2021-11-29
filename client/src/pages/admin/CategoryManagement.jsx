import {
  Box,
  HStack,
  Icon,
  Select,
  VStack,
  Input,
  Button,
} from "@chakra-ui/react";
import React, { useState, useContext, useEffect } from "react";
import { FaSortDown } from "react-icons/fa";
import { GlobalContext } from "context/GlobalContext";
import { LISTS } from "keys";
import { axiosInstance } from "utils/axios";

const ListItem = ({ cType, item, onClick }) => {
  const [isShowChildList, setIsShowChildList] = useState(false);

  const renderItems = () => {
    switch (cType) {
      case LISTS.VOLUME_ISSUE:
        return item.issues.map((issue, idx) => (
          <Box key={idx} ml="8" py="0.5" onClick={() => onClick(issue)}>
            {issue.name}
          </Box>
        ));

      case LISTS.MAJOR_RESEARCH:
        return item.researches.map((research, idx) => (
          <Box key={idx} ml="8" py="0.5" onClick={() => onClick(research)}>
            {research.name}
          </Box>
        ));
    }
  };

  return (
    <Box px="8" py="1" cursor="pointer">
      <HStack align="center" spacing="0">
        <Box pr="2" onClick={() => onClick(item)}>
          {item.name}
        </Box>
        <Icon
          as={FaSortDown}
          onClick={() => setIsShowChildList((preState) => !preState)}
          transform={isShowChildList ? "" : "rotate(-90deg)"}
          cursor="pointer"
          transition="all .3s ease"
        />
      </HStack>
      {isShowChildList && renderItems()}
    </Box>
  );
};

const List = ({ cType, listName, items, setSelectedItem }) => {
  const [isShow, setIsShow] = useState(true);

  const onClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <Box>
      <HStack align="center" spacing="0">
        <Box pr="2">{listName}</Box>
        <Icon
          as={FaSortDown}
          onClick={() => setIsShow((preState) => !preState)}
          transform={isShow ? "" : "rotate(-90deg)"}
          cursor="pointer"
          transition="all .3s ease"
        />
      </HStack>
      {isShow &&
        items.map((item, idx) => (
          <ListItem cType={cType} onClick={onClick} item={item} key={idx} />
        ))}
    </Box>
  );
};

export const CategoryManagement = () => {
  const { volumes, majors, getLists } = useContext(GlobalContext);

  const [refresh, setRefresh] = useState(false);

  const [selectedItem, setSelectedItem] = useState();
  const [cType, setCType] = useState(LISTS.VOLUME_ISSUE);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [desc, setDesc] = useState("");
  const [fileSelected, setFileSelected] = useState();

  useEffect(() => {
    setSelectedItem(undefined);
  }, [cType]);

  useEffect(() => {
    getLists();
  }, [refresh]);

  useEffect(() => {
    if (selectedItem) {
      console.log(selectedItem);
      setName(selectedItem.name);
      setParent(selectedItem.parent ?? "");
      setDesc(selectedItem.desc ?? "");
      selectedItem.filename
        ? setFileSelected({ name: selectedItem.filename })
        : setFileSelected(undefined);
    } else {
      setName("");
      setParent("");
      setDesc("");
    }
  }, [selectedItem]);

  console.log(fileSelected);

  const handleSaveList = () => {
    if (name) {
      const formData = new FormData();
      formData.append("type", cType);
      formData.append("name", name);
      if (parent) {
        formData.append("parent", parent);
      }
      if (desc) {
        formData.append("desc", desc);
      }
      if (fileSelected) {
        formData.append("file", fileSelected);
      }

      if (selectedItem) {
        // update
        formData.append("id", selectedItem._id);
        axiosInstance
          .put(`/list`, formData)
          .then((res) => {
            setRefresh((pre) => !pre);
            setSelectedItem(undefined);
            setFileSelected(undefined);
          })
          .catch((err) => console.log(err));
      } else {
        // create new once
        axiosInstance
          .post(`/list`, formData)
          .then((res) => {
            setRefresh((pre) => !pre);
            setName("");
            setParent("");
            setDesc("");
            setFileSelected(undefined);
          })
          .catch((err) => console.log(err));
      }
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      axiosInstance
        .delete(`/list`, {
          type: cType,
          id: selectedItem._id,
        })
        .then((res) => {
          setRefresh((pre) => !pre);
          setSelectedItem(undefined);
        })
        .catch((err) => console.log(err));
    }
  };

  const isDataChange = () => {
    let flag = false;
    if (selectedItem) {
      if (
        name !== selectedItem.name ||
        desc !== selectedItem.desc ||
        fileSelected?.name !== selectedItem.filename
      ) {
        flag = true;
      }
    } else {
      if (name || desc || (name && parent)) {
        flag = true;
      }
    }

    return flag;
  };

  return (
    <Box px={{ base: "0", md: "20", xl: "40" }}>
      <HStack>
        <Box fontSize="xl" fontWeight="semibold">
          Select category type
        </Box>
        <Select
          maxW="40"
          value={cType}
          onChange={(e) => setCType(+e.target.value)}
        >
          <option value={LISTS.VOLUME_ISSUE}>Volumes - Issues</option>
          <option value={LISTS.MAJOR_RESEARCH}>Majors - Researches</option>
        </Select>
      </HStack>
      <HStack align="flex-start" spacing="16">
        <VStack flex="1" align="flex-start">
          <VStack
            spacing="4"
            align="strech"
            w={{ base: "100%", md: "70%", xl: "50%" }}
          >
            <Box>
              <Box>Tên danh mục</Box>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Box>
            <Box>
              <Box>Danh mục cha</Box>
              <Select
                value={parent}
                onChange={(e) => setParent(e.target.value)}
                isDisabled={!!selectedItem}
              >
                <option value="">None</option>
                {cType === LISTS.MAJOR_RESEARCH
                  ? majors.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))
                  : cType === LISTS.VOLUME_ISSUE
                  ? volumes.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name}
                      </option>
                    ))
                  : null}
              </Select>
            </Box>
            {cType !== LISTS.MAJOR_RESEARCH && (
              <>
                <Box>
                  <Box>Mô tả</Box>
                  <Input
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </Box>
                <HStack>
                  <label
                    htmlFor="c-file"
                    style={{
                      border: "1px solid",
                      padding: "6px",
                      background: "#d7d7d7d",
                    }}
                  >
                    Choose file
                  </label>

                  <Box>
                    {fileSelected ? fileSelected.name : "No file chosen"}
                  </Box>
                  <input
                    id="c-file"
                    type="file"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => {
                      console.log(e.target.files[0]);
                      setFileSelected(e.target.files[0]);
                    }}
                  />
                </HStack>
              </>
            )}
            <HStack justify="center" spacing="4">
              {(selectedItem || name || parent || desc) && (
                <Button
                  colorScheme="purple"
                  onClick={() => {
                    if (selectedItem) {
                      selectedItem && setSelectedItem(undefined);
                    } else {
                      setName("");
                      setParent("");
                      setDesc("");
                    }
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                isDisabled={!isDataChange()}
                onClick={handleSaveList}
                colorScheme="blue"
              >
                Save
              </Button>
              {selectedItem && (
                <Button onClick={handleDelete} colorScheme="red">
                  Delete
                </Button>
              )}
            </HStack>
          </VStack>
        </VStack>
        <Box>
          <List
            cType={cType}
            listName={
              cType === LISTS.VOLUME_ISSUE
                ? "Volumes - Issues"
                : "Majors - Researches"
            }
            items={cType === LISTS.VOLUME_ISSUE ? volumes : majors}
            setSelectedItem={setSelectedItem}
          />
        </Box>
      </HStack>
    </Box>
  );
};
