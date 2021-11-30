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
import { useTranslate } from "hooks/useTranslate";
import { timestampToDate } from "utils/time";
import { CONSTANTS_DATA } from "keys";
import { useLocation } from "react-router";
import queryString from "query-string";
import imagePath from "utils/imagePath";

export const Home = () => {
  const { volumes } = useContext(GlobalContext);

  const [latestVolume, setLatestVolume] = useState();

  const [pagination, setPagination] = useState({
    total: 7,
    perPage: 2,
    currentPage: 2,
  });
  const [articles, setArticles] = useState([]);

  const { t } = useTranslate();

  useEffect(() => {
    if (volumes?.length) {
      let latestVolume, latestIssue;
      const _volumes = [...volumes.filter((volume) => !!volume.issues?.length)];
      for (const volume of _volumes) {
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

  const location = useLocation();
  console.log(location);

  const { q } = queryString.parse(location.search);

  useEffect(() => {
    let path = "/articles";
    if (q) {
      path = `/articles?q=${q}`;
    }
    axiosInstance
      .get(path)
      .then((res) => {
        setArticles(res.data);
      })
      .catch((err) => console.log(err));
  }, [q]);

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
      {!q ? (
        <>
          <VStack align="stretch" spacing="4" flex="1">
            <HStack spacing="12" color="blue.600">
              <HStack>
                <Icon as={BiGroup} w="6" h="6" />
                <Link
                  to={{
                    pathname: "/editorial-board/",
                  }}
                >
                  <Box textDecor="underline" cursor="pointer">
                    {t("editorial_board")}
                  </Box>
                </Link>
              </HStack>
              <HStack>
                <Icon as={BiBook} w="6" h="6" />

                <Link
                  to={{
                    pathname: "/aims-and-scope/",
                  }}
                >
                  <Box textDecor="underline" cursor="pointer">
                    {t("aims_and_scope")}
                  </Box>
                </Link>
              </HStack>
              <HStack>
                <Icon as={RiComputerLine} w="6" h="6" />
                <Link
                  to={{
                    pathname: "/journal-updates/",
                  }}
                >
                  <Box textDecor="underline" cursor="pointer">
                    {t("journal_updates")}
                  </Box>
                </Link>
              </HStack>
            </HStack>

            <hr />

            <Box>
              <Collapse startingHeight={70} in={show}>
                {t(CONSTANTS_DATA.INTRO)}
              </Collapse>
              <Button size="sm" onClick={() => setShow((pre) => !pre)}>
                Show {show ? "Less" : "More"}
              </Button>
            </Box>

            <hr />

            <Box>
              <Box fontSize="lg" fontWeight="semibold">
                {t("editor_in_chief")}
              </Box>
              <Box>{CONSTANTS_DATA.EDITOR_IN_CHIEF}</Box>
            </Box>

            <Grid templateColumns="repeat(3, 1fr)" gap="4">
              <Box>
                <Box fontWeight="semibold">
                  {CONSTANTS_DATA.SUBMISSION_FIRST_DECISION} {t("days")}
                </Box>
                <Box>{t("submission_to_first_decision")}</Box>
              </Box>
              <Box>
                <Box fontWeight="semibold">385,364</Box>
                <Box>{t("downloads")}</Box>
              </Box>
              <Box>
                <Box fontWeight="semibold">
                  {CONSTANTS_DATA.SUBMISSION_ACCEPTANCE} {t("days")}
                </Box>
                <Box>{t("submission_to_acceptance")}</Box>
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
                {t("latest_issue")}
              </Box>
              <hr />

              <HStack align="stretch" spacing="4">
                <Box boxSize="36">
                  <Image
                    objectFit="cover"
                    src={
                      latestVolume
                        ? latestVolume.issue?.filename
                          ? imagePath(latestVolume.issue?.filename)
                          : "https://media.springernature.com/w92/springer-static/cover/journal/11277/120/1.jpg"
                        : "https://media.springernature.com/w92/springer-static/cover/journal/11277/120/1.jpg"
                    }
                    alt="image"
                  />
                </Box>
                <VStack align="flex-start" justify="space-between">
                  {latestVolume && (
                    <Link to={`/volumes-and-issues/${latestVolume.issue._id}`}>
                      <Box>
                        <Box>{latestVolume.name}</Box>
                        <Box>
                          {latestVolume.issue?.name} -{" "}
                          {latestVolume.issue?.desc}
                        </Box>
                      </Box>
                    </Link>
                  )}

                  <Link to="/volumes-and-issues">
                    <Button>{t("view_all_volumes_and_issues")}</Button>
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
                {t("latest_articles")}
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
                        .map(
                          (author) => `${author.firstname} ${author.lastname}`
                        )
                        .join("; ")}
                    </Box>
                    <Box color="gray.500">
                      {t("paper_published")}:{" "}
                      {timestampToDate(article.publishedDate)}
                    </Box>
                  </VStack>
                  <hr />
                </Link>
              ))}

              <HStack>
                <Box>{t("this_journal_has")}</Box>
                <Box color="blue.600" cursor="pointer" textDecor="underline">
                  {articles.length} {t("open_access_articles")}
                </Box>
              </HStack>
              <Box>
                <Button color="blue.600">{t("view_all_articles")}</Button>
              </Box>
            </VStack>
          </VStack>
        </>
      ) : (
        <VStack align="stretch" flex="1" spacing="8">
          {articles.map((article) => (
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
                <Box color="gray.500">
                  {t("paper_published")}:{" "}
                  {timestampToDate(article.publishedDate)}
                </Box>
              </VStack>
              <hr />
            </Link>
          ))}
        </VStack>
      )}

      <RightMenu />
    </HStack>
  );
};
