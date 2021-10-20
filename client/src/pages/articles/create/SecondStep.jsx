import {
  Box,
  Grid,
  Select,
  Textarea,
  VStack,
  Button,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ArticleAuthors } from "./ArticleAuthors";

export const SecondStep = ({ articleInfo, setArticleInfo }) => {
  const [keywords, setKeywords] = useState(["", "", ""]);

  useEffect(() => {
    if (keywords.every((key) => key === ""))
      setArticleInfo((pre) => ({
        ...pre,
        keywords: JSON.stringify([]),
      }));
    else
      setArticleInfo((pre) => ({
        ...pre,
        keywords: JSON.stringify(keywords),
      }));
  }, [keywords]);

  return (
    <Grid templateColumns="10em 1fr" gap="8">
      <Box textAlign="right">
        Tiêu đề bài báo <span className="required-field">(*)</span>
      </Box>
      <Textarea
        placeholder="Improve something Improve somethingImprove somethingImprove something"
        value={articleInfo.title}
        onChange={(e) =>
          setArticleInfo((pre) => ({ ...pre, title: e.target.value }))
        }
      />

      <Box textAlign="right">
        Tóm tắt bài báo (Abstract) <span className="required-field">(*)</span>
      </Box>
      <Textarea
        minH="40"
        maxBlockSize
        placeholder="Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something Improve something"
        value={articleInfo.summary}
        onChange={(e) => {
          setArticleInfo((pre) => ({ ...pre, summary: value }));
          const value = e.target.value;
          const regex = /[\s|\.|\,|\;|\:|\'|\"|\?|\(|\)]+/gim;
          if (value.split(regex).length <= 250) {
            setArticleInfo((pre) => ({ ...pre, summary: value }));
          } else {
            return alert("Abstract must be less than 250 words");
          }
        }}
      />

      <Box textAlign="right">
        Từ khóa <span className="required-field">(*)</span>
      </Box>
      <Grid templateColumns="5em 1fr" gap="4" placeItems="center">
        {keywords.map((_, idx) => (
          <>
            <Box>Keyword {idx + 1}</Box>
            <Input
              value={keywords[idx]}
              placeholder="Keywords, max 6 words"
              onChange={(e) => {
                const value = e.target.value;
                const regex = /[\s|\.|\,|\;|\:|\'|\"|\?|\(|\)]+/gim;
                if (value.split(regex).length <= 6) {
                  keywords[idx] = e.target.value;
                  setKeywords([...keywords]);
                } else {
                  return alert("Keyword must be less than 6 keyword");
                }
              }}
            />
          </>
        ))}
      </Grid>
      {/* <Textarea
        placeholder="Improve something Improve somethingImprove somethingImprove something"
        value={articleInfo.keywords}
        onChange={(e) =>
          setArticleInfo((pre) => ({ ...pre, keywords: e.target.value }))
        }
      /> */}

      <Box textAlign="right">
        Danh sách tác giả <span className="required-field">(*)</span>
      </Box>
      <Box>
        <Box>
          <Button
            colorScheme="blue"
            onClick={() =>
              setArticleInfo((pre) => ({
                ...pre,
                authors: [
                  ...pre.authors,
                  {
                    firstname: "",
                    lastname: "",
                    workUnit: "",
                    email: "",
                  },
                ],
              }))
            }
          >
            Add
          </Button>
        </Box>
        <Grid templateColumns="repeat(1, 1fr)" gap="4" pt="2">
          <DndProvider backend={HTML5Backend}>
            <ArticleAuthors
              authors={articleInfo.authors}
              setArticleInfo={setArticleInfo}
            />
          </DndProvider>
        </Grid>
      </Box>
      {/* <Textarea
        placeholder="Improve something Improve somethingImprove somethingImprove something"
        value={articleInfo.authors}
        onChange={(e) =>
          setArticleInfo((pre) => ({ ...pre, authors: e.target.value }))
        }
      /> */}

      <Box textAlign="right">Funding</Box>
      <VStack w="100%" align="flex-start">
        <Box>
          <Select
            value={articleInfo.isPrize}
            onChange={(e) =>
              setArticleInfo((pre) => ({
                ...pre,
                isPrize: +e.target.value,
              }))
            }
          >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </Select>
        </Box>
        <Textarea
          value={articleInfo.prizeDetail}
          onChange={(e) =>
            setArticleInfo((pre) => ({
              ...pre,
              prizeDetail: e.target.value,
            }))
          }
          isDisabled={articleInfo.isPrize ? false : true}
          placeholder="Nhập thông tin giải thưởng nếu Yes"
        />
      </VStack>
    </Grid>
  );
};
