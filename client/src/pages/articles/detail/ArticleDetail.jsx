import { Box, Button, HStack, VStack, Icon } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { axiosInstance } from "utils/axios";
import { HiOutlineMail } from "react-icons/hi";
import { timestampToDate } from "utils/time";
import { Link } from "react-router-dom";
import { useTranslate } from "hooks/useTranslate";

export const ArticleDetail = () => {
  const { t } = useTranslate();
  const [article, setArticle] = useState();
  const { id } = useParams();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getLatest10 = async () => {
      axiosInstance
        .get("/articles/latest")
        .then((res) => setArticles(res.data))
        .catch(console.error);
    };

    if (id) {
      axiosInstance
        .get(`/articles/${id}`)
        .then((res) => {
          setArticle(res.data);
        })
        .catch((err) => console.log(err));

      getLatest10();
    }
  }, [id]);

  const hanldeDownload = () => {
    axiosInstance
      .get(`/articles/${id}/download`, {
        responseType: "blob",
      })
      .then(async (res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", article.file.filename);
        document.body.appendChild(link);
        link.click();
      });
  };

  return article ? (
    <HStack align="flex-start" spacing="16">
      <VStack flex="1" align="stretch" spacing="8">
        <VStack align="stretch" spacing="4">
          <Box color="blue.600">
            Published: {timestampToDate(article.publishedDate)}
          </Box>
          <Box fontSize="2xl" fontWeight="semibold">
            {article.info?.title}
          </Box>
          <HStack color="blue.600" spacing="8">
            {article.info?.authors.map((author) => (
              <a href={`mailto:${author.email}`}>
                <Box textDecor="underline" pos="relative">
                  {author.firstname} {author.lastname}
                  {author.id && (
                    <Icon
                      pos="absolute"
                      right="-4"
                      top="-1"
                      as={HiOutlineMail}
                    />
                  )}
                </Box>
              </a>
            ))}
          </HStack>
          <HStack color="blue.600" spacing="4">
            <Box>Volume: {article.volume?.name}.</Box>
            <Box>Issue: {article.issue?.name}.</Box>
            <Box>Publication Code: {article.publicationCode}.</Box>
            <Box>
              Page Number: {article.pageNumberStart} - {article.pageNumberEnd}.
            </Box>
            <Box>Total download: {article.totalDownload}</Box>
          </HStack>
        </VStack>

        <VStack align="stretch" spacing="4">
          <Box>
            <Box fontSize="xl" fontWeight="semibold">
              Abstract
            </Box>
            <hr />
          </Box>
          <Box>{article.info?.summary}</Box>
        </VStack>

        <VStack align="stretch" spacing="4">
          <Box>
            <Box fontSize="xl" fontWeight="semibold">
              Keywords
            </Box>
            <hr />
          </Box>
          <Box>{article.info?.keywords}</Box>
        </VStack>

        <VStack align="stretch" spacing="4">
          <Box>
            <Box fontSize="xl" fontWeight="semibold">
              Funding
            </Box>
            <hr />
          </Box>

          <Box>{article.info?.prizeDetail || "N/A"}</Box>
        </VStack>

        <VStack align="stretch" spacing="4">
          <Box>
            <Box fontSize="xl" fontWeight="semibold">
              Author information
            </Box>
            <hr />
          </Box>

          <VStack align="stretch">
            {article.info?.authors.map((author, idx) => (
              <Box>
                {author.id ? (
                  <a href={`mailto:${author.email}`}>
                    <Box d="inline" pos="relative">
                      {author.firstname} {author.lastname}
                      {author.id && (
                        <Icon
                          pos="absolute"
                          right="-4"
                          top="-1"
                          as={HiOutlineMail}
                        />
                      )}
                    </Box>
                  </a>
                ) : (
                  <Box fontWeight="semibold">
                    {author.firstname} {author.lastname}
                  </Box>
                )}

                <Box>{author.workUnit}</Box>
                <Box>{author.email}</Box>
              </Box>
            ))}
          </VStack>
        </VStack>

        {/* <Box>
          <Box fontSize="xl" fontWeight="semibold">
            Corresponding author
          </Box>
          <Box>
            Correspondence to{" "}
            <Box d="inline-block" color="blue.600" textDecor="underline">
              Mohsen Maadani.
            </Box>
          </Box>
        </Box>
       */}
      </VStack>

      <VStack
        align="stretch"
        w="20em"
        minW="80"
        maxW="96"
        p="4"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        boxShadow=" 0 0 5px 0 rgb(128 128 128 / 10%)"
      >
        <Box textAlign="center">
          <Button colorScheme="blue" onClick={hanldeDownload}>
            Download
          </Button>
        </Box>
        <hr />
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
      </VStack>
    </HStack>
  ) : (
    <Box>Loading</Box>
  );
};
