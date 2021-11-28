import React, { useState, useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import update from "immutability-helper";
import { Input } from "@chakra-ui/react";
import { Grid, Box, GridItem, VStack } from "@chakra-ui/layout";

const style = {
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
};
export const Card = ({ id, author, index, moveCard, setArticleInfo }) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      <VStack
        spacing="2"
        p="4"
        pos="relative"
        border="1px solid"
        borderColor="gray.400"
        borderRadius="md"
        align="stretch"
      >
        <Box>Author {index + 1}</Box>
        <Grid templateColumns="repeat(6, 1fr)" gap="2">
          <GridItem colSpan="2">
            <Input
              className="required-input"
              size="sm"
              value={author.firstname}
              isDisabled={!!author.id}
              style={{
                opacity: 1,
              }}
              onChange={(e) =>
                setArticleInfo((pre) => ({
                  ...pre,
                  authors: [
                    ...pre.authors.slice(0, index),
                    {
                      ...pre.authors[index],
                      firstname: e.target.value,
                    },
                    ...pre.authors.slice(index + 1, pre.authors.length),
                  ],
                }))
              }
              bg="gray.100"
              placeholder="Firstname (*)"
            />
          </GridItem>

          <GridItem colSpan="2">
            {" "}
            <Input
              className="required-input"
              size="sm"
              value={author.lastname}
              isDisabled={!!author.id}
              style={{
                opacity: 1,
              }}
              onChange={(e) =>
                setArticleInfo((pre) => ({
                  ...pre,
                  authors: [
                    ...pre.authors.slice(0, index),
                    {
                      ...pre.authors[index],
                      lastname: e.target.value,
                    },
                    ...pre.authors.slice(index + 1, pre.authors.length),
                  ],
                }))
              }
              bg="gray.100"
              placeholder="Lastname (*)"
            />
          </GridItem>

          <GridItem colSpan="2">
            <Input
              className="required-input"
              size="sm"
              value={author.email}
              isDisabled={!!author.id}
              style={{
                opacity: 1,
              }}
              onChange={(e) =>
                setArticleInfo((pre) => ({
                  ...pre,
                  authors: [
                    ...pre.authors.slice(0, index),
                    {
                      ...pre.authors[index],
                      email: e.target.value,
                    },
                    ...pre.authors.slice(index + 1, pre.authors.length),
                  ],
                }))
              }
              bg="gray.100"
              placeholder="Email (*)"
            />
          </GridItem>
          <GridItem colSpan="3">
            <Input
              size="sm"
              value={author.school}
              onChange={(e) =>
                setArticleInfo((pre) => ({
                  ...pre,
                  authors: [
                    ...pre.authors.slice(0, index),
                    {
                      ...pre.authors[index],
                      school: e.target.value,
                    },
                    ...pre.authors.slice(index + 1, pre.authors.length),
                  ],
                }))
              }
              bg="gray.100"
              placeholder="School"
            />
          </GridItem>

          <GridItem colSpan="3">
            <Input
              size="sm"
              value={author.faculty}
              onChange={(e) =>
                setArticleInfo((pre) => ({
                  ...pre,
                  authors: [
                    ...pre.authors.slice(0, index),
                    {
                      ...pre.authors[index],
                      faculty: e.target.value,
                    },
                    ...pre.authors.slice(index + 1, pre.authors.length),
                  ],
                }))
              }
              bg="gray.100"
              placeholder="Faculty"
            />
          </GridItem>
          {!author.id && (
            <Box
              pos="absolute"
              top="2"
              right="2"
              fontWeight="bold"
              cursor="pointer"
              _hover={{
                color: "red",
              }}
              onClick={() =>
                setArticleInfo((pre) => ({
                  ...pre,
                  authors: [
                    ...pre.authors.slice(0, index),
                    ...pre.authors.slice(index + 1, pre.authors.length),
                  ],
                }))
              }
            >
              X
            </Box>
          )}
        </Grid>
      </VStack>
    </div>
  );
};

export const ArticleAuthors = ({ authors, setArticleInfo }) => {
  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = authors[dragIndex];
      setArticleInfo((pre) => ({
        ...pre,
        authors: update(authors, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        }),
      }));
    },
    [authors]
  );
  const renderCard = (author, index) => {
    return (
      <Card
        key={index}
        index={index}
        id={index}
        author={author}
        moveCard={moveCard}
        setArticleInfo={setArticleInfo}
      />
    );
  };
  return (
    <>
      <div>{authors.map((author, i) => renderCard(author, i))}</div>
    </>
  );
};
