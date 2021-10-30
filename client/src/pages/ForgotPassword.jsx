import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { HStack, Text, VStack } from "@chakra-ui/layout";
import React, { useState } from "react";
import { axiosInstance } from "utils/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitForgotPassword = () => {
    if (!email?.trim()) {
      return alert("Enter your email");
    }
    setSubmitting(true);
    axiosInstance
      .post("/auth/forgot-password", { email })
      .then((res) => {
        alert("New password sent to your email");
        setSubmitting(false);
      })
      .catch((err) => {
        setSubmitting(false);
        console.error(err);
        // alert("Cannot")
      });
  };

  return (
    <HStack justify="center">
      <VStack w="96" spacing="4">
        <Text as="b" fontSize="xl">
          Forgot Password
        </Text>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <Button onClick={handleSubmitForgotPassword} colorScheme="teal">
          Submit
        </Button>
      </VStack>
    </HStack>
  );
}
