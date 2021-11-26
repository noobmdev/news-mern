import {
  Box,
  Button,
  HStack,
  Table,
  Tbody,
  Td,
  Tr,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import RightMenu from "components/UI/RightMenu";
import { useParams } from "react-router";
import { axiosInstance } from "utils/axios";
import { Link } from "react-router-dom";
import { timestampToDate } from "utils/time";
import { useTranslate } from "hooks/useTranslate";

const VolumeAndIssueDetail = () => {
  const { id: issueId } = useParams();
  const { t } = useTranslate();

  const [articles, setArticles] = useState([]);

  console.log(issueId);
  useEffect(() => {
    if (issueId) {
      axiosInstance
        .get(`/articles?issue=${issueId}`)
        .then((res) => setArticles(res.data))
        .catch((err) => console.log(err));
    }
  }, [issueId]);

  return (
    <HStack align="flex-start" spacing="16">
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
                {t("paper_published")}: {timestampToDate(article.publishedDate)}
              </Box>
            </VStack>
            <hr />
          </Link>
        ))}
      </VStack>

      <RightMenu />
    </HStack>
  );
};

export default VolumeAndIssueDetail;
