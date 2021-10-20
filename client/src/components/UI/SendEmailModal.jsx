import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Textarea } from "@chakra-ui/textarea";
import React, { useState } from "react";
import { axiosInstance } from "utils/axios";

function SendEmailModal({ articleId, title, isOpen, onClose, setRefresh }) {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const resetState = () => {
    setTo("")
    setCc("")
    setSubject("")
    setContent("")
  }

  function handleSend() {
    const reEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reEmail.test(String(to).toLowerCase())) {
      return alert("Email is invalid");
    }

    if (!subject.trim() || !content) {
      return alert("Fill all required field");
    }

    if(window.confirm("Are you OK?")) {
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
        setRefresh && setRefresh(pre => !pre)
        resetState()
        alert("Send mail success")
      })
      .catch((err) => {
        if (typeof err.response?.data === 'string') {
          alert(err.response?.data);
        } else alert("Something went error");
      });
    }
  }

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
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
          </VStack>
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
