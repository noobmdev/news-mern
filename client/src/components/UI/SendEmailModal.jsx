import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Select } from "@chakra-ui/select";
import { Textarea } from "@chakra-ui/textarea";
import { GlobalContext } from "context/GlobalContext";
import { MODAL_TITLES } from "keys";
import React, { useContext, useEffect, useState } from "react";
import { axiosInstance } from "utils/axios";

function SendEmailModal({ articleId, title, isOpen, onClose, setRefresh }) {
  const { volumes } = useContext(GlobalContext);

  const [publicationCode, setPublicationCode] = useState("");
  const [pageNumberStart, setPageNumberStart] = useState("");
  const [pageNumberEnd, setPageNumberEnd] = useState("");
  const [selectedVolume, setSelectedVolume] = useState();
  const [selectedIssue, setSelectedIssue] = useState();

  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (volumes?.length) {
      setSelectedVolume(volumes[0]);
    }
  }, [volumes]);

  useEffect(() => {
    // console.log(selectedVolume);
    if (selectedVolume?.issues?.length) {
      setSelectedIssue(selectedVolume?.issues[0]?._id);
    }
  }, [selectedVolume]);

  const handleChangeSelectedVolume = (id) => {
    const volume = volumes.find((v) => v._id === id);
    if (volume) {
      setSelectedVolume(volume);
    }
  };

  const resetState = () => {
    setTo("");
    setCc("");
    setSubject("");
    setContent("");
  };

  const handleSendInvite = () => {
    const reEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reEmail.test(String(to).toLowerCase())) {
      return alert("Email is invalid");
    }

    if (!subject.trim() || !content) {
      return alert("Fill all required field");
    }

    if (window.confirm("Are you OK?")) {
      axiosInstance
        .post(`/articles/${articleId}/invite`, {
          type: title,
          to: to,
          data: {
            cc,
            subject,
            content,
          },
        })
        .then((res) => {
          setRefresh && setRefresh((pre) => !pre);
          resetState();
          alert("Send mail success");
        })
        .catch((err) => {
          if (typeof err.response?.data === "string") {
            alert(err.response?.data);
          } else alert("Something went error");
        });
    }
  };

  const handlePublish = () => {
    if (
      !publicationCode ||
      !pageNumberStart ||
      !pageNumberEnd ||
      !selectedVolume ||
      !selectedIssue
    ) {
      return alert("Fill all required field");
    }
    if (window.confirm("Are you OK?")) {
      axiosInstance
        .post(`/articles/${articleId}/publish`, {
          publicationCode,
          pageNumberStart,
          pageNumberEnd,
          volume: selectedVolume,
          issue: selectedIssue,
        })
        .then((res) => {
          setRefresh && setRefresh((pre) => !pre);
          resetState();
          alert("Publish success");
        })
        .catch((err) => {
          if (typeof err.response?.data === "string") {
            alert(err.response?.data);
          } else alert("Something went error");
        });
    }
  };

  function handleSend() {
    switch (title) {
      case MODAL_TITLES.PUBLISH_ARTICLE:
        handlePublish();
        break;

      default:
        handleSendInvite();
        break;
    }
    onClose();
  }

  const renderBody = () => {
    // console.log(title, MODAL_TITLES.SEND_TO_PUBLISHER);
    switch (title) {
      case MODAL_TITLES.PUBLISH_ARTICLE:
        return (
          <>
            <Input
              placeholder="Mã số xuất bản"
              value={publicationCode}
              onChange={(e) => setPublicationCode(e.target.value)}
            />
            <HStack>
              <Input
                placeholder="Page start"
                value={pageNumberStart}
                onChange={(e) => setPageNumberStart(e.target.value)}
              />
              <Input
                placeholder="Page end"
                value={pageNumberEnd}
                onChange={(e) => setPageNumberEnd(e.target.value)}
              />
            </HStack>
            <HStack>
              <Box flex="1">
                <Box>Volume</Box>
                <Select
                  value={selectedVolume?._id}
                  onChange={(e) => handleChangeSelectedVolume(e.target.value)}
                >
                  {volumes.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box flex="1">
                <Box>Issue</Box>
                <Select value={selectedIssue}>
                  {selectedVolume?.issues.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.name}
                    </option>
                  ))}
                </Select>
              </Box>
            </HStack>
          </>
        );

      default:
        return (
          <>
            <Input
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <Input
              placeholder="CC"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
            />
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Textarea
              minH="40"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </>
        );
    }
  };

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch">{renderBody()}</VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={onClose}
            onClick={handleSend}
          >
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SendEmailModal;
