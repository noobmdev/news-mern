import {
  Box,
  Button,
  Collapse,
  Grid,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { BiBook, BiGroup } from "react-icons/bi";
import { RiComputerLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { axiosInstance } from "utils/axios";
import RightMenu from "components/UI/RightMenu";
import { GlobalContext } from "context/GlobalContext";

export const Home = () => {
  const { volumes } = useContext(GlobalContext);

  const [latestVolume, setLatestVolume] = useState();

  const [pagination, setPagination] = useState({
    total: 7,
    perPage: 2,
    currentPage: 2,
  });
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (volumes?.length) {
      let latestVolume, latestIssue;
      
      for (const volume of volumes) {
        latestVolume = !latestVolume
          ? volume
          : volume.createdAt >= latestVolume.createdAt
          ? volume
          : latestVolume;
      }
      for (const issue of latestVolume.issues) {
        latestIssue = !latestIssue
          ? issue
          : issue.createdAt >= latestIssue.createdAt
          ? issue
          : latestIssue;
      }
      latestVolume &&
        latestIssue &&
        setLatestVolume({
          ...latestVolume,
          issue: latestIssue,
        });
    }
  }, [volumes]);

  useEffect(() => {
    axiosInstance
      .get("/articles")
      .then((res) => {
        setArticles(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChangePage = (page) => {
    console.log(page);
    setPagination((preState) => ({ ...preState, currentPage: page }));
  };

  const [show, setShow] = useState(false);

  return (
    <HStack align="flex-start" spacing="16">
      {/* {newspapers.map((newspaper, idx) => (
        <Newspaper key={idx} newspaper={newspaper} />
      ))} */}
      {/* <Box>
        <Pagination
          onChange={handleChangePage}
          total={pagination.total}
          perPage={pagination.perPage}
          currentPage={pagination.currentPage}
        />
      </Box> */}
      <VStack align="stretch" spacing="4" flex="1">
        <HStack spacing="12" color="blue.600">
          <HStack>
            <Icon as={BiGroup} w="6" h="6" />
            <Link
              to={{
                pathname: "https://giaothongso.tk/editorial-board/",
              }}
              target="_blank"
            >
              <Box textDecor="underline" cursor="pointer">
                Editorial board
              </Box>
            </Link>
          </HStack>
          <HStack>
            <Icon as={BiBook} w="6" h="6" />

            <Link
              to={{
                pathname: "https://giaothongso.tk/aims-and-scope/",
              }}
              target="_blank"
            >
              <Box textDecor="underline" cursor="pointer">
                Aims & scrope
              </Box>
            </Link>
          </HStack>
          <HStack>
            <Icon as={RiComputerLine} w="6" h="6" />
            <Link
              to={{
                pathname: "https://giaothongso.tk/journal-updates/",
              }}
              target="_blank"
            >
              <Box textDecor="underline" cursor="pointer">
                Journal updates
              </Box>
            </Link>
          </HStack>
        </HStack>

        <hr />

        <Box>
          <Collapse startingHeight={70} in={show}>
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
            terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
            labore wes anderson cred nesciunt sapiente ea proident. Anim
            pariatur cliche reprehenderit, enim eiusmod high life accusamus
            terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
            labore wes anderson cred nesciunt sapiente ea proident. Anim
            pariatur cliche reprehenderit, enim eiusmod high life accusamus
            terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
            labore wes anderson cred nesciunt sapiente ea proident.
          </Collapse>
          <Button size="sm" onClick={() => setShow((pre) => !pre)}>
            Show {show ? "Less" : "More"}
          </Button>
        </Box>

        <hr />

        <Box>
          <Box fontSize="lg" fontWeight="semibold">
            Editor-in-Chief
          </Box>
          <Box>Ramjee Prasad</Box>
        </Box>

        <Grid templateColumns="repeat(3, 1fr)" gap="4">
          <Box>
            <Box fontWeight="semibold">289 days</Box>
            <Box>Submission to first decision</Box>
          </Box>
          <Box>
            <Box fontWeight="semibold">385,364 (2020)</Box>
            <Box>Downloads</Box>
          </Box>
          <Box>
            <Box fontWeight="semibold">352 days</Box>
            <Box>Submission to acceptance</Box>
          </Box>
        </Grid>

        <VStack
          align="stretch"
          border="1px solid"
          borderColor="gray.200"
          boxShadow=" 0 0 5px 0 rgb(128 128 128 / 10%)"
          borderRadius="md"
          p="4"
        >
          <Box fontSize="lg" fontWeight="semibold">
            Latest issue
          </Box>
          <hr />

          <HStack align="stretch" spacing="4">
            <Box minW="28">
              <Image
                h="auto"
                w="100%"
                // boxSize="250px"
                objectFit="cover"
                src="https://media.springernature.com/w92/springer-static/cover/journal/11277/120/1.jpg"
                alt="Segun Adebayo"
              />
            </Box>
            <VStack align="flex-start" justify="space-between">
              {latestVolume && (
                <Box>
                  <Box>{latestVolume.name}</Box>
                  <Box>
                    {latestVolume.issue?.name} - {latestVolume.issue?.desc}
                  </Box>
                </Box>
              )}

              <Link to="/volumes-and-issues">
                <Button>View all volumes and issues</Button>
              </Link>
            </VStack>
          </HStack>
        </VStack>

        <VStack
          align="stretch"
          border="1px solid"
          borderColor="gray.200"
          boxShadow=" 0 0 5px 0 rgb(128 128 128 / 10%)"
          borderRadius="md"
          p="4"
        >
          <Box fontSize="lg" fontWeight="semibold">
            Latest articles
          </Box>
          <hr />

          {articles.slice(0, 10).map((article) => (
            <Link to={`/articles/${article._id}`} key={article._id}>
              <VStack spacing="4" flex="1" align="stretch">
                <Box
                  fontSize="lg"
                  fontWeight="semibold"
                  color="blue.600"
                  cursor="pointer"
                  _hover={{
                    textDecor: "underline",
                  }}
                  className="two-line-text"
                >
                  {article.info?.title}
                </Box>
                <Box>
                  {article.info?.authors
                    .map((author) => `${author.firstname} ${author.lastname}`)
                    .join("; ")}
                </Box>
                <Box color="gray.500">PaperPublished: 29 August 2021</Box>
              </VStack>
              <hr />
            </Link>
          ))}

          <HStack>
            <Box>This journal has</Box>
            <Box color="blue.600" cursor="pointer" textDecor="underline">
              {articles.length} open access articles
            </Box>
          </HStack>
          <Box>
            <Button color="blue.600">View all articles</Button>
          </Box>
        </VStack>
      </VStack>

      <RightMenu />
    </HStack>
  );
};
