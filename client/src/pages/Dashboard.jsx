import { Box, HStack, ListItem, Select, UnorderedList } from "@chakra-ui/react";
import { GlobalContext } from "context/GlobalContext";
import { ROLES } from "keys";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const menuItems = {
  [ROLES.ADMIN]: [
    { name: "User Managemnet", path: "/admin/users" },
    { name: "Category Managemnet", path: "/admin/categories" },
  ],
  [ROLES.AUTHOR]: [
    { name: "New Submissions", path: "/articles/new", type: "new" },
    {
      name: "View Submissions",
      path: `/articles/${ROLES.AUTHOR}/management`,
    },
  ],
  [ROLES.REVIEWER]: [
    {
      name: "Submissions waiting review",
      path: `/articles/${ROLES.REVIEWER}/management`,
      type: "wating-review",
    },
    // {
    //   name: "Submissions are reviewing temporarily",
    //   path: "/articles",
    //   type: "reviewing",
    // },
    // {
    //   name: "Submissions reviewed",
    //   path: `/articles/${ROLES.REVIEWER}/management`,
    //   type: "reviewed",
    // },
  ],
  [ROLES.EDITOR]: [
    {
      name: "Submissions waiting edit",
      path: `/articles/${ROLES.EDITOR}/management`,
      type: "waiting-edit",
    },
    // {
    //   name: "Submissions are editing temporarily",
    //   path: "/articles",
    //   type: "editing",
    // },
    // {
    //   name: "Submissions edited",
    //   path: `/articles/${ROLES.EDITOR}/management`,
    //   type: "edited",
    // },
  ],
  [ROLES.PUBLISHER]: [
    {
      name: "Submissions waiting publish",
      path: `/articles/${ROLES.PUBLISHER}/management`,
      type: "waiting-publish",
    },
    // {
    //   name: "Submissions are publishing temporarily",
    //   path: "/articles",
    //   type: "publishing",
    // },
    // {
    //   name: "Submissions published",
    //   path: `/articles/${ROLES.PUBLISHER}/management`,
    //   type: "published",
    // },
  ],
  [ROLES.EDITOR_IN_CHIEF]: [
    {
      name: "View Submissions",
      path: `/articles/${ROLES.EDITOR_IN_CHIEF}/management`,
      type: "View-publish",
    },
  ],
};

export const Dashboard = () => {
  const { user } = useContext(GlobalContext);

  const [role, setRole] = useState(ROLES.AUTHOR);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    if (user) {
      const firstRole = Object.keys(ROLES).find(
        (r) => user.role % ROLES[r] === 0
      );
      setRole(ROLES[firstRole]);
    }
  }, [user]);

  useEffect(() => {
    if (role && menuItems[role]) {
      setMenu(menuItems[role]);
    }
  }, [role]);

  return (
    <Box px="40">
      <HStack>
        <Box>Select role</Box>
        <Box>
          <Select
            style={{ textTransform: "uppercase" }}
            onChange={(e) => setRole(e.target.value)}
            value={role}
          >
            {Object.keys(ROLES)
              .filter((r) => user.role % ROLES[r] === 0)
              .map((r, idx) => (
                <option value={ROLES[r]} key={idx}>
                  {r}
                </option>
              ))}
          </Select>
        </Box>
      </HStack>
      <Box fontSize="xl" textDecor="underline">
        <UnorderedList>
          {menu?.map((item, idx) => (
            <ListItem key={idx}>
              <Link
                to={{
                  pathname: item.path,
                  state: {
                    type: item.type ?? null,
                    role,
                  },
                }}
              >
                {item.name}
              </Link>
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
    </Box>
  );
};
