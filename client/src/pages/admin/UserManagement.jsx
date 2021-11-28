import {
  Box,
  Button,
  Checkbox,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Input,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { ROLES } from "keys";
import React, { useMemo } from "react";
import { useState } from "react";

import { useEffect } from "react";
import { axiosInstance } from "utils/axios";

const TableItem = ({ user, updateUser, setUserSelected }) => {
  const [item, setItem] = useState(user);

  const isRoleChange = () => {
    return item.role !== user.role;
  };

  const changeRole = (role) => {
    const currentRole = item.role;
    setItem((pre) => ({
      ...pre,
      role: currentRole % role === 0 ? currentRole / role : currentRole * role,
    }));
  };

  return (
    <Tr>
      <Td>{item.email}</Td>
      <Td>{item.firstname}</Td>
      <Td>{item.lastname}</Td>
      <Td textAlign="center">
        <Checkbox
          defaultChecked={item.role % ROLES.ADMIN === 0 ? true : false}
          onChange={() => changeRole(ROLES.ADMIN)}
        />
      </Td>
      <Td textAlign="center">
        <Checkbox
          defaultChecked={
            item.role % ROLES.EDITOR_IN_CHIEF === 0 ? true : false
          }
          onChange={() => changeRole(ROLES.EDITOR_IN_CHIEF)}
        />
      </Td>
      <Td textAlign="center">
        <Checkbox
          defaultChecked={item.role % ROLES.AUTHOR === 0 ? true : false}
          onChange={() => changeRole(ROLES.AUTHOR)}
        />
      </Td>
      <Td textAlign="center">
        <Checkbox
          defaultChecked={item.role % ROLES.EDITOR === 0 ? true : false}
          onChange={() => changeRole(ROLES.EDITOR)}
        />
      </Td>
      <Td textAlign="center">
        <Checkbox
          defaultChecked={item.role % ROLES.REVIEWER === 0 ? true : false}
          onChange={() => changeRole(ROLES.REVIEWER)}
        />
      </Td>
      <Td textAlign="center">
        <Checkbox
          defaultChecked={item.role % ROLES.PUBLISHER === 0 ? true : false}
          onChange={() => changeRole(ROLES.PUBLISHER)}
        />
      </Td>
      <Td isNumeric>
        {isRoleChange() && (
          <Button colorScheme="blue" onClick={() => updateUser(item)}>
            Save
          </Button>
        )}
        <Button onClick={() => setUserSelected(item)} colorScheme="teal">
          View
        </Button>
      </Td>
    </Tr>
  );
};

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userSelected, setUserSelected] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axiosInstance
      .get(`/auth/users/`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const updateUser = (user) => {
    axiosInstance
      .put(`/auth/users/${user._id}`, user)
      .then((res) => {
        const idx = users.findIndex((u) => u._id === user._id);
        if (idx !== -1) {
          setUsers([
            ...users.slice(0, idx),
            res.data,
            ...users.slice(idx + 1, users.length),
          ]);
        }
        alert("update success");
      })
      .catch((err) => console.log(err));
  };

  const userRender = useMemo(
    () =>
      users.filter((user) =>
        [user.firstname, user.lastname, user.email].some((e) =>
          new RegExp(searchQuery, "gi").test(e)
        )
      ),
    [users, searchQuery]
  );

  return (
    <Box>
      <Modal
        size="xl"
        isOpen={!!userSelected}
        onClose={() => setUserSelected(undefined)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {userSelected && (
              <Grid templateColumns="repeat(2, 1fr)" gap="4" minH="20">
                <GridItem>
                  <FormLabel>ID</FormLabel>
                  <Input
                    style={{
                      opacity: 1,
                    }}
                    value={userSelected._id}
                    isDisabled
                  />
                </GridItem>
                <GridItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    style={{
                      opacity: 1,
                    }}
                    value={userSelected.email}
                    isDisabled
                  />
                </GridItem>
                <GridItem colStart="1">
                  <FormLabel>First Name</FormLabel>
                  <Input
                    style={{
                      opacity: 1,
                    }}
                    value={userSelected.firstname}
                    isDisabled
                  />
                </GridItem>
                <GridItem>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    style={{
                      opacity: 1,
                    }}
                    value={userSelected.lastname}
                    isDisabled
                  />
                </GridItem>
                <GridItem>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    style={{
                      opacity: 1,
                    }}
                    value={userSelected.phone}
                    isDisabled
                  />
                </GridItem>
                <GridItem>
                  <FormLabel>Postcode</FormLabel>
                  <Input
                    style={{
                      opacity: 1,
                    }}
                    value={userSelected.postcode}
                    isDisabled
                  />
                </GridItem>
                <GridItem>
                  <FormLabel>Country</FormLabel>
                  <Input
                    style={{
                      opacity: 1,
                    }}
                    value={userSelected.country}
                    isDisabled
                  />
                </GridItem>
                <GridItem>
                  <FormLabel>City/Provine</FormLabel>
                  <Input
                    style={{
                      opacity: 1,
                    }}
                    value={userSelected.city_provine}
                    isDisabled
                  />
                </GridItem>
                <GridItem colSpan="2">
                  <FormLabel>Address</FormLabel>
                  <Input
                    style={{
                      opacity: 1,
                    }}
                    value={userSelected.address}
                    isDisabled
                  />
                </GridItem>
                <GridItem colSpan="2">
                  <FormLabel>Univesity</FormLabel>
                  <Input
                    style={{
                      opacity: 1,
                    }}
                    value={userSelected.university}
                    isDisabled
                  />
                </GridItem>
                <GridItem>
                  <FormLabel>Major</FormLabel>
                  <Input
                    style={{
                      opacity: 1,
                    }}
                    value={userSelected.major?.name}
                    isDisabled
                  />
                </GridItem>
                <GridItem>
                  <FormLabel>Research</FormLabel>
                  <Input
                    style={{
                      opacity: 1,
                    }}
                    value={userSelected.research?.name}
                    isDisabled
                  />
                </GridItem>
              </Grid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Box fontSize="2xl" fontWeight="bold" textAlign="center">
        User Management
      </Box>
      <Box maxW="80">
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>First Name</Th>
            <Th>Last Name</Th>

            <Th textAlign="center">Is Admin</Th>
            <Th textAlign="center">Is Editor-in-Chief</Th>
            <Th textAlign="center">Is Author</Th>
            <Th textAlign="center">Is Editor</Th>
            <Th textAlign="center">Is Reviewer</Th>
            <Th textAlign="center">Is Publisher</Th>
            <Th isNumeric>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userRender.map((user, idx) => (
            <TableItem
              key={idx}
              user={user}
              updateUser={updateUser}
              setUserSelected={setUserSelected}
            />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
