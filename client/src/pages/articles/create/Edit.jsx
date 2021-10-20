import { Box, Button, HStack, Icon } from "@chakra-ui/react";
import { GlobalContext } from "context/GlobalContext";
import withRole from "hocs/withRole";
import { HANDLE_ACTIONS, ROLES } from "keys";
import React, { useContext, useEffect, useState } from "react";
import { FaCheck, FaDownload, FaExclamation } from "react-icons/fa";
import { useHistory, useParams } from "react-router-dom";
import { axiosInstance } from "utils/axios";
import { FirstStep } from "./FirstStep";
import { SecondStep } from "./SecondStep";
import { FourthStep } from "./FourthStep";
import { ThirdStep } from "./ThirdStep";

const STEP = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  FOURTH: 4,
};

const EditArticle = () => {
  const history = useHistory();
  const { id } = useParams();
  const { majors } = useContext(GlobalContext);

  const [article, setArticle] = useState();

  const [step, setStep] = useState(STEP.FIRST);

  // step 1
  const [articleType, setArticleType] = useState();
  const [researchTopics, setResearchTopics] = useState([]);

  // step 3
  const [isPosted, setIsPosted] = useState("0");
  const [wherePosted, setWherePosted] = useState("");
  const [canShareManuscript, setCanShareManuscipt] = useState(true);
  const [isAcceptTerm, setIsAcceptTerm] = useState(true);

  // step 2
  const [articleInfo, setArticleInfo] = useState({
    title: "",
    summary: "",
    keywords: "",
    authors: [
      {
        firstname: "",
        lastname: "",
        workUnit: "",
        email: "",
      },
    ],
    isPrize: 0,
    prizeDetail: "",
  });

  // step 4
  const [articleFile, setArticleFile] = useState();
  const [additionalFiles, setAdditionalFiles] = useState([]);

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/articles/${id}`)
        .then((res) => {
          setArticle(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  useEffect(() => {
    if (article) {
      const {
        type,
        researches,
        file,
        additionalFiles,
        isPosted,
        wherePosted,
        canShareManuscript,
        info,
      } = article;

      setArticleType(type);
      setResearchTopics(researches);

      // setArticleFile(file);
      // setAdditionalFiles(additionalFiles);
      setIsPosted(isPosted ? "1" : "0");
      setWherePosted(wherePosted);
      setCanShareManuscipt(canShareManuscript ? "1" : "0");
      setArticleInfo(info);
      setIsAcceptTerm(isAcceptTerm);
    }
  }, [article]);

  useEffect(() => {
    if (majors?.length) setArticleType(majors[0]._id);
  }, [majors]);

  useEffect(() => {
    if (researchTopics?.length) setResearchTopics([]);
  }, [articleType]);

  const handleFileAdditionalActions = (
    type,
    idx = undefined,
    event = undefined
  ) => {
    switch (type) {
      case HANDLE_ACTIONS.ADD:
        setAdditionalFiles((pre) => [...pre, undefined]);
        break;

      case HANDLE_ACTIONS.REMOVE:
        setAdditionalFiles((pre) => [
          ...pre.slice(0, idx),
          ...pre.slice(idx + 1, pre.length),
        ]);
        break;

      case HANDLE_ACTIONS.CHANGE:
        const file = event.target.files[0];
        setAdditionalFiles((pre) => [
          ...pre.slice(0, idx),
          file,
          ...pre.slice(idx + 1, pre.length),
        ]);
        break;

      default:
        break;
    }
  };

  const onChangeStep3 = (type, value) => {
    console.log(type, value);
    switch (type) {
      case "is_posted":
        setIsPosted(value);
        break;

      case "where_posted":
        setWherePosted(value);
        break;

      case "can_share":
        setCanShareManuscipt(value);
        break;

      case "is_accept":
        setIsAcceptTerm(value);
        break;

      default:
        break;
    }
  };

  const [loading, setLoading] = useState(false);

  const handleSubmitArticle = () => {
    if (
      articleType &&
      researchTopics?.length > 0 &&
      articleFile &&
      ((!!+isPosted && wherePosted) || !!!+isPosted) &&
      isAcceptTerm &&
      articleInfo.title &&
      articleInfo.summary &&
      articleInfo.keywords &&
      articleInfo.authors.length &&
      (!articleInfo.isPrize || (articleInfo.isPrize && articleInfo.prizeDetail))
    ) {
      setLoading(true);
      const formData = new FormData();

      formData.append("type", articleType);
      formData.append("researches", JSON.stringify(researchTopics));
      formData.append("file", articleFile);
      additionalFiles.forEach((f) => formData.append("additionalFiles", f));

      formData.append("isPosted", isPosted);
      formData.append("wherePosted", wherePosted);
      formData.append("canShareManuscript", canShareManuscript);
      formData.append("info", JSON.stringify(articleInfo));

      axiosInstance
        .put(`/articles/${id}`, formData)
        .then((res) => {
          console.log(res);
          alert("Edit article success");
          history.push(`/articles/${ROLES.AUTHOR}/management`);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } else {
      alert("Please fill all required field");
    }
  };

  const renderStep = () => {
    switch (step) {
      case STEP.FIRST:
        return (
          <FirstStep
            articleType={articleType}
            setArticleType={setArticleType}
            researchTopics={researchTopics}
            setResearchTopics={setResearchTopics}
          />
        );

      case STEP.SECOND:
        return (
          <SecondStep
            articleInfo={articleInfo}
            setArticleInfo={setArticleInfo}
          />
        );

      case STEP.THIRD:
        return (
          <ThirdStep
            isPosted={isPosted}
            wherePosted={wherePosted}
            canShareManuscript={canShareManuscript}
            isAcceptTerm={isAcceptTerm}
            onChange={onChangeStep3}
          />
        );

      case STEP.FOURTH:
        return (
          <FourthStep
            setArticleFile={setArticleFile}
            additionalFiles={additionalFiles}
            handleFileAdditionalActions={handleFileAdditionalActions}
          />
        );

      default:
        return;
    }
  };

  return (
    <Box>
      <Box textAlign="center" fontWeight="bold" fontSize="2xl" mb="2">
        New Submission
      </Box>
      <HStack pos="relative" justify="space-between" color="white">
        <Button
          onClick={() => setStep(STEP.FIRST)}
          isLoading={step === STEP.FIRST}
          borderRadius="full"
          w="12"
          h="12"
          colorScheme={
            step === STEP.FIRST
              ? "teal"
              : articleType && researchTopics?.length > 0
              ? "green"
              : "red"
          }
          p="2"
          style={{
            opacity: "1",
          }}
        >
          <Icon
            as={
              articleType && researchTopics?.length > 0
                ? FaCheck
                : FaExclamation
            }
            w="100%"
            h="100%"
          />
        </Button>
        <Button
          onClick={() => setStep(STEP.SECOND)}
          isLoading={step === STEP.SECOND}
          borderRadius="full"
          w="12"
          h="12"
          colorScheme={
            step === STEP.SECOND
              ? "teal"
              : articleInfo.title &&
                articleInfo.summary &&
                articleInfo.keywords &&
                articleInfo.authors &&
                (!articleInfo.isPrize ||
                  (articleInfo.isPrize && articleInfo.prizeDetail))
              ? "green"
              : "red"
          }
          p="2"
          style={{
            opacity: "1",
          }}
        >
          <Icon as={articleFile ? FaCheck : FaExclamation} w="100%" h="100%" />
        </Button>
        <Button
          onClick={() => setStep(STEP.THIRD)}
          isLoading={step === STEP.THIRD}
          borderRadius="full"
          w="12"
          h="12"
          colorScheme={
            step === STEP.THIRD
              ? "teal"
              : ((!!+isPosted && wherePosted) || !!!+isPosted) && isAcceptTerm
              ? "green"
              : "red"
          }
          p="2"
          style={{
            opacity: "1",
          }}
        >
          <Icon
            as={
              ((!!+isPosted && wherePosted) || !!!+isPosted) && isAcceptTerm
                ? FaCheck
                : FaExclamation
            }
            w="100%"
            h="100%"
          />
        </Button>
        <Button
          onClick={() => setStep(STEP.FOURTH)}
          isLoading={step === STEP.FOURTH}
          borderRadius="full"
          w="12"
          h="12"
          colorScheme={
            step === STEP.FOURTH ? "teal" : articleFile ? "green" : "red"
          }
          p="2"
          style={{
            opacity: "1",
          }}
        >
          <Icon as={FaDownload} w="100%" h="100%" />
        </Button>

        <Box
          border="2px solid"
          borderColor="black"
          pos="absolute"
          left="0"
          top="50%"
          right="0"
          transform="translateY(-50%)"
          zIndex="-1"
        ></Box>
      </HStack>
      <Box py="4">{renderStep()}</Box>

      {/* Next or back step */}
      <HStack justify="space-between">
        <Button
          isDisabled={step === STEP.FIRST}
          colorScheme="blue"
          onClick={() => step > STEP.FIRST && setStep((pre) => --pre)}
        >
          Back
        </Button>
        {step === STEP.FOURTH ? (
          <Button
            isLoading={loading}
            colorScheme="blue"
            onClick={handleSubmitArticle}
          >
            Build PDF and Edit
          </Button>
        ) : (
          <Button
            colorScheme="blue"
            onClick={() => step < STEP.FOURTH && setStep((pre) => ++pre)}
          >
            Next
          </Button>
        )}
      </HStack>
    </Box>
  );
};

export default withRole(EditArticle, [ROLES.AUTHOR]);
