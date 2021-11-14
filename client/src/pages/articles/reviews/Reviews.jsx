import {
  Box,
  Button,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tag,
  Select,
  HStack,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Grid,
  GridItem,
  RadioGroup,
  Radio,
  Textarea,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import SendEmailModal from "components/UI/SendEmailModal";
import { GlobalContext } from "context/GlobalContext";
import withRole from "hocs/withRole";
import {
  ARTICLE_STATUSES,
  EDITOR_IN_CHIEF_STATUSES,
  EDITOR_STATUSES,
  MODAL_TITLES,
  REVIEW_STATUSES,
  ROLES,
  PUBLISHER_STATUSES,
} from "keys";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { axiosInstance } from "utils/axios";
import { timestampToDate } from "utils/time";

const Reviews = () => {
  const { role } = useParams();
  const history = useHistory();
  const { user } = useContext(GlobalContext);

  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [currentStatuses, setCurrentStatuses] = useState([]);
  const [statusSelected, setStatusSelected] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [openReviewResultModal, setOpenReviewResultModal] = useState(false);
  const [reviewSelected, setReviewSelected] = useState();
  const [viewReviewSelected, setViewReviewSelected] = useState(false);

  // flag refresh
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (user) {
      if (!role || user.role % role !== 0) return history.push("/dashboard");
      setLoading(false);
    }
  }, [user, role]);

  useEffect(() => {
    if (role && !loading) {
      switch (+role) {
        case ROLES.AUTHOR:
          setCurrentStatuses(ARTICLE_STATUSES);
          break;

        case ROLES.REVIEWER:
          setCurrentStatuses(REVIEW_STATUSES);
          break;

        default:
          setCurrentStatuses([]);
          break;
      }
      axiosInstance
        .get(`/articles/roles/${role}`)
        .then((res) => {
          setArticles(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [role, loading, refresh]);

  const hanldeDownload = (article) => {
    axiosInstance
      .get(`/articles/${article._id}/download`, {
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

  const colorOfStatus = (status) => {
    let color;
    switch (status) {
      case ARTICLE_STATUSES.WITH_EDITOR:
        color = "gray";
        break;

      case ARTICLE_STATUSES.REJECTED:
        color = "red";
        break;

      case ARTICLE_STATUSES.WITH_REVIEWER:
        color = "blue";
        break;

      case ARTICLE_STATUSES.NEED_REVISION:
        color = "orange";
        break;

      case ARTICLE_STATUSES.ACCEPTED:
        color = "green";
        break;

      case EDITOR_IN_CHIEF_STATUSES.NEW_SUBMISSIONS:
        color = "gray";
        break;
      case EDITOR_IN_CHIEF_STATUSES.ASSIGNED_EDITOR:
        color = "blue";
        break;
      case EDITOR_IN_CHIEF_STATUSES.PUBLISHED:
        color = "teal";
        break;
      case EDITOR_IN_CHIEF_STATUSES.REJECTED_DECISION:
        color = "red";
        break;

      default:
        color = "green";
        break;
    }
    return color;
  };

  const checkStatus = (status) => {
    return (
      <Tag
        size="sm"
        variant="solid"
        colorScheme={colorOfStatus(status)}
        textTransform="uppercase"
        textAlign="center"
        py="2"
      >
        {status}
      </Tag>
    );
  };

  const handleApproveByAuthor = (articleId) => {
    axiosInstance
      .put(`/articles/${articleId}/status`, {
        status: ARTICLE_STATUSES.WITH_EDITOR,
      })
      .then((res) => {
        const idx = articles.findIndex((a) => a._id === articleId);
        if (idx !== -1) {
          setArticles((pre) => [
            ...pre.slice(0, idx),
            res.data,
            ...pre.slice(idx + 1, pre.length),
          ]);
        }
      })
      .catch((err) => console.log(err));
  };

  // const [isAcceptPublish, setIsAcceptPublish] = useState("1");
  // const [comments, setComments] = useState("");
  const [reviewScores, setReviewScores] = useState({
    reievance: 1,
    technicalContent: 1,
    novelty: 1,
    quality: 1,
  });
  const [strongAspects, setStrongAspects] = useState("");
  const [weakAspects, setWeakAspects] = useState("");
  const [recommendedChanges, setRecommendedChanges] = useState("");

  useEffect(() => {
    if (reviewSelected) {
      // setIsAcceptPublish(reviewSelected.isAcceptPublish ? "1" : "0");
      // setComments(reviewSelected.comments);
      setReviewScores(reviewSelected.scores);
      setStrongAspects(reviewSelected.strongAspects);
      setWeakAspects(reviewSelected.weakAspects);
      setRecommendedChanges(reviewSelected.recommendedChanges);
    }
  }, [reviewSelected]);

  const hanldeReviewArticle = (review, isApprove = false) => {
    axiosInstance
      .put(`/articles/${review.article._id}/reviews/${review._id}`, {
        data: {
          scores: reviewScores,
          strongAspects,
          weakAspects,
          recommendedChanges,
        },
      })
      .then((res) => {
        const idx = articles.findIndex((a) => a._id === review._id);
        if (idx !== -1) {
          setArticles((pre) => [
            ...pre.slice(0, idx),
            res.data,
            ...pre.slice(idx + 1, pre.length),
          ]);
        }
        alert("Save review success");
      })
      .catch((err) => console.log(err));
  };

  const UpdateReviewActions = {
    AcceptInvitation: "accept_invitation",
    DeclineInvitation: "decline_invitation",
    ApproveReview: "approve_review",
  };

  const handleUpdateReview = (review, type, uncheck = false) => {
    if (
      uncheck &&
      (!strongAspects?.trim() ||
        !weakAspects?.trim() ||
        !recommendedChanges?.trim())
    ) {
      return alert("Please fill all required fields");
    }

    if (window.confirm("Are you OK?")) {
      axiosInstance
        .put(`/articles/${review.article._id}/reviews/${review._id}`, {
          type,
          data: {
            scores: reviewScores,
            strongAspects,
            weakAspects,
            recommendedChanges,
          },
        })
        .then((res) => {
          const idx = articles.findIndex((a) => a._id === review._id);
          if (idx !== -1) {
            setArticles((pre) => [
              ...pre.slice(0, idx),
              res.data,
              ...pre.slice(idx + 1, pre.length),
            ]);
          }
          let msg =
            UpdateReviewActions.DeclineInvitation === type
              ? "Decline success"
              : !uncheck
              ? "Accept review success"
              : "Review success";
          alert(msg);
        })
        .catch((err) => console.log(err));
    }
  };

  const [reviewResults, setReviewResults] = useState([]);

  const viewResultReview = (articleId) => {
    setOpenReviewResultModal(true);

    axiosInstance.get(`/articles/${articleId}/reviews`).then((res) => {
      const _res = res.data.filter((r) => r.isCompleted);
      setReviewResults(_res);
    });
  };

  const renderActionLinksByRole = (item) => {
    const { status } = item;

    switch (+role) {
      case ROLES.AUTHOR:
        switch (status) {
          case ARTICLE_STATUSES.INCOMPLETE:
            return (
              <>
                <Link to={`/articles/${item._id}/edit`}>
                  <Button size="xs" colorScheme="yellow">
                    Edit Submission
                  </Button>
                </Link>
                <Button size="xs" mt="1" colorScheme="red">
                  Remove Submission
                </Button>
              </>
            );

          case ARTICLE_STATUSES.WAIT_APPROVE:
            return (
              <>
                <Link to={`/articles/${item._id}/edit`}>
                  <Button size="xs" colorScheme="yellow">
                    Edit Submission
                  </Button>
                </Link>
                <Button size="xs" mt="1" colorScheme="red">
                  Remove Submission
                </Button>
                <Button
                  size="xs"
                  onClick={() => hanldeDownload(item)}
                  colorScheme="blue"
                >
                  View PDF
                </Button>

                <Button
                  size="xs"
                  onClick={() => handleApproveByAuthor(item._id)}
                  colorScheme="teal"
                >
                  Approve
                </Button>
              </>
            );

          case ARTICLE_STATUSES.WITH_EDITOR:
            return (
              <>
                <Button
                  size="xs"
                  onClick={() => hanldeDownload(item)}
                  colorScheme="blue"
                >
                  View PDF
                </Button>

                <Button size="xs" colorScheme="teal">
                  Send email
                </Button>
              </>
            );

          case ARTICLE_STATUSES.ACCEPTED:
            return (
              <Button
                size="xs"
                onClick={() => hanldeDownload(item)}
                colorScheme="blue"
              >
                View PDF
              </Button>
            );
        }

      //  role REVIEWER
      case ROLES.REVIEWER:
        switch (status) {
          case REVIEW_STATUSES.NEW_INVITATION:
            return (
              <>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="blue"
                  onClick={() =>
                    handleUpdateReview(
                      item,
                      UpdateReviewActions.AcceptInvitation
                    )
                  }
                >
                  Accept invitation
                </Button>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="red"
                  onClick={() =>
                    handleUpdateReview(
                      item,
                      UpdateReviewActions.DeclineInvitation
                    )
                  }
                >
                  Decline invitation
                </Button>
              </>
            );

          case REVIEW_STATUSES.INCOMPLETE:
            return (
              <>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="blue"
                  onClick={() => {
                    setReviewSelected(item);
                    setOpenReviewModal(true);
                  }}
                >
                  Review
                </Button>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="teal"
                  onClick={async () => {
                    setReviewSelected(item);
                    setOpenReviewModal(true);
                  }}
                >
                  Accept Review
                </Button>
              </>
            );

          case REVIEW_STATUSES.COMPLETED:
            return (
              <>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="blue"
                  onClick={() => {
                    setReviewSelected(item);
                    setViewReviewSelected(true);
                    setOpenReviewModal(true);
                  }}
                >
                  View review
                </Button>
              </>
            );
        }

      //  role EDITOR-IN-CHIEF
      case ROLES.EDITOR_IN_CHIEF:
        switch (item.editorInChiefStatus) {
          case EDITOR_IN_CHIEF_STATUSES.NEW_SUBMISSIONS:
            return (
              <>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="blue"
                  onClick={() => hanldeDownload(item)}
                >
                  View PDF
                </Button>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="green"
                  onClick={() => handleOpenModal(item._id)}
                >
                  Invite editor
                </Button>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="teal"
                  onClick={() => handleOpenModalSendToPublisher(item._id)}
                >
                  Accept
                </Button>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="red"
                  onClick={() => handleRejectDecision(item._id)}
                >
                  Reject
                </Button>
              </>
            );

          case EDITOR_IN_CHIEF_STATUSES.ASSIGNED_EDITOR:
            return (
              <>
                <Button
                  onClick={() => hanldeDownload(item)}
                  size="xs"
                  mt="1"
                  colorScheme="blue"
                >
                  View pdf
                </Button>
                <Button size="xs" mt="1" colorScheme="green">
                  Invite editor
                </Button>
              </>
            );

          case EDITOR_IN_CHIEF_STATUSES.RESULT_EDITOR:
            return (
              <>
                <Button
                  onClick={() => hanldeDownload(item)}
                  size="xs"
                  mt="1"
                  colorScheme="blue"
                >
                  View pdf
                </Button>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="green"
                  onClick={() => handleOpenModalSendToPublisher(item._id)}
                >
                  Accept
                </Button>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="red"
                  onClick={() => handleRejectDecision(item._id)}
                >
                  Reject
                </Button>
                <Button size="xs" mt="1" colorScheme="yellow">
                  Revision
                </Button>
              </>
            );

          case EDITOR_IN_CHIEF_STATUSES.REJECTED_DECISION:
            return (
              <Button
                onClick={() => hanldeDownload(item)}
                size="xs"
                mt="1"
                colorScheme="blue"
              >
                View PDF
              </Button>
            );

          case EDITOR_IN_CHIEF_STATUSES.RETURN_AUTHOR:
            return (
              <>
                <Button
                  onClick={() => hanldeDownload(item)}
                  size="xs"
                  mt="1"
                  colorScheme="blue"
                >
                  View pdf
                </Button>
                <Button size="xs" mt="1" colorScheme="red">
                  View email
                </Button>
              </>
            );

          case EDITOR_IN_CHIEF_STATUSES.SENT_TO_PUBLISHER:
            return (
              <Button
                onClick={() => hanldeDownload(item)}
                size="xs"
                mt="1"
                colorScheme="blue"
              >
                View PDF
              </Button>
            );
        }

      //  role EDITOR
      case ROLES.EDITOR:
        switch (item.editorStatus) {
          case EDITOR_STATUSES.NEW_INVITATION:
            return (
              <>
                <Button
                  onClick={() => hanldeDownload(item)}
                  size="xs"
                  mt="1"
                  colorScheme="blue"
                >
                  View pdf
                </Button>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="green"
                  onClick={() => handleEditorAccept(item._id)}
                >
                  Accept invitation
                </Button>
                <Button size="xs" mt="1" colorScheme="red">
                  Decline invitation
                </Button>
              </>
            );

          case EDITOR_STATUSES.INCOMPLETE_ASSIGNMENT:
            return (
              <>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="blue"
                  onClick={() => handleOpenModalSendResultChief(item._id)}
                >
                  Send result to TBT
                </Button>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="green"
                  onClick={() => handleEditorInviteReviewers(item._id)}
                >
                  Invite Reviewer
                </Button>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="red"
                  onClick={() => viewResultReview(item._id)}
                >
                  View result of reviewer
                </Button>
              </>
            );

          case EDITOR_STATUSES.REJECTED:
            return (
              <>
                <Button
                  onClick={() => hanldeDownload(item)}
                  size="xs"
                  mt="1"
                  colorScheme="blue"
                >
                  View pdf
                </Button>
              </>
            );
        }

      //  role PUBLISHER
      case ROLES.PUBLISHER:
        switch (item.publisherStatus) {
          case PUBLISHER_STATUSES.WAIT_FOR_PUBLISHING:
            return (
              <>
                <Button
                  onClick={() => hanldeDownload(item)}
                  size="xs"
                  mt="1"
                  colorScheme="blue"
                >
                  View pdf
                </Button>
                <Button
                  size="xs"
                  mt="1"
                  colorScheme="green"
                  onClick={() => handlePublisherAccept(item._id)}
                >
                  Publish
                </Button>
              </>
            );

          case PUBLISHER_STATUSES.PUBLISHED:
            return (
              <Button
                onClick={() => hanldeDownload(item)}
                size="xs"
                mt="1"
                colorScheme="blue"
              >
                View pdf
              </Button>
            );
        }

      default:
        return;
    }
  };

  const renderList = () => {
    switch (+role) {
      case ROLES.AUTHOR:
        return (
          articles
            // .filter((article) =>
            //   setSearchQuery
            //     ? new RegExp(searchQuery, "gi").test(article.info?.title) ||
            //       new RegExp(searchQuery, "gi").test(article.author?.email) ||
            //       new RegExp(searchQuery, "gi").test(
            //         article.info?.authors
            //           .map((author) => `${author.firstname} ${author.lastname}`)
            //           .join(";")
            //       )
            //     : article
            // )
            .filter((article) =>
              statusSelected ? article.status === statusSelected : article
            )
            .map((item, idx) => (
              <Tr key={item._id}>
                <Td>{idx + 1}</Td>
                <Td maxW="20">{item.manuscriptId}</Td>
                <Td>
                  <Box className="two-line-text">{item.info?.title}</Box>
                </Td>
                <Td>{timestampToDate(item.submissionDate)}</Td>
                <Td>{timestampToDate(item.submissionDate)}</Td>
                <Td textAlign="center">{checkStatus(item.status)}</Td>
                <Td isNumeric>
                  <VStack textAlign="center">
                    {renderActionLinksByRole(item)}
                  </VStack>
                </Td>
              </Tr>
            ))
        );

      case ROLES.REVIEWER:
        return articles.map((item, idx) => (
          <Tr key={item._id}>
            <Td>{idx + 1}</Td>
            <Td>{item.article?.manuscriptId}</Td>
            <Td>
              <Box className="two-line-text">{item.article?.info?.title}</Box>
            </Td>
            <Td>{timestampToDate(item.createdAt)}</Td>
            <Td>{timestampToDate(item.submissionDate)}</Td>
            <Td textAlign="center">{checkStatus(item.status)}</Td>
            <Td isNumeric>
              <VStack textAlign="center">
                {renderActionLinksByRole(item)}
              </VStack>
            </Td>
          </Tr>
        ));

      case ROLES.EDITOR_IN_CHIEF:
        return articles.map((item, idx) => (
          <Tr key={item._id}>
            <Td>{idx + 1}</Td>
            <Td>{item.manuscriptId}</Td>
            <Td>
              <Box className="two-line-text">{item.info?.title}</Box>
            </Td>
            <Td>{timestampToDate(item.submissionDate)}</Td>
            <Td>{timestampToDate(item.dateDecision)}</Td>
            <Td textAlign="center">{checkStatus(item.editorInChiefStatus)}</Td>
            <Td isNumeric>
              <VStack textAlign="center">
                {renderActionLinksByRole(item)}
              </VStack>
            </Td>
          </Tr>
        ));

      case ROLES.EDITOR:
        return articles.map((item, idx) => (
          <Tr key={item._id}>
            <Td>{idx + 1}</Td>
            <Td>{item.manuscriptId}</Td>
            <Td>
              <Box className="two-line-text">{item.info?.title}</Box>
            </Td>
            <Td>{timestampToDate(item.submissionDate)}</Td>
            <Td>{timestampToDate(item.dateDecision)}</Td>
            <Td textAlign="center">{checkStatus(item.editorStatus)}</Td>
            <Td isNumeric>
              <VStack textAlign="center">
                {renderActionLinksByRole(item)}
              </VStack>
            </Td>
          </Tr>
        ));

      case ROLES.PUBLISHER:
        return articles.map((item, idx) => (
          <Tr key={item._id}>
            <Td>{idx + 1}</Td>
            <Td>{item.manuscriptId}</Td>
            <Td>
              <Box className="two-line-text">{item.info?.title}</Box>
            </Td>
            <Td>{timestampToDate(item.submissionDate)}</Td>
            <Td textAlign="center">{checkStatus(item.publisherStatus)}</Td>
            <Td isNumeric>
              <VStack textAlign="center">
                {renderActionLinksByRole(item)}
              </VStack>
            </Td>
          </Tr>
        ));

      default:
        return;
    }
  };

  const renderHeader = () => {
    switch (+role) {
      case ROLES.AUTHOR:
        return (
          <>
            <Th>No</Th>
            <Th>Manuscript ID</Th>
            <Th>Manuscript title</Th>
            <Th>Date of starting submission</Th>
            <Th>Date of last status</Th>
            <Th textAlign="center">Status</Th>
            <Th isNumeric>Action links</Th>
          </>
        );

      case ROLES.REVIEWER:
        return (
          <>
            <Th>No</Th>
            <Th>Manuscript ID</Th>
            <Th>Manuscript title</Th>
            <Th>Date of invitation</Th>
            <Th>Date of review submission</Th>
            <Th textAlign="center">Status</Th>
            <Th isNumeric>Action links</Th>
          </>
        );

      case ROLES.EDITOR_IN_CHIEF:
      case ROLES.EDITOR:
        return (
          <>
            <Th>No</Th>
            <Th>Manuscript ID</Th>
            <Th>Manuscript title</Th>
            <Th>Date of submission</Th>
            <Th>Date of Decision</Th>
            <Th textAlign="center">Status</Th>
            <Th isNumeric>Action links</Th>
          </>
        );

      case ROLES.PUBLISHER:
        return (
          <>
            <Th>No</Th>
            <Th>Manuscript ID</Th>
            <Th>Manuscript title</Th>
            <Th>Date of submission</Th>
            <Th textAlign="center">Status</Th>
            <Th isNumeric>Action links</Th>
          </>
        );
      default:
        return;
    }
  };

  const handleApproveReview = (review) => {
    handleUpdateReview(review, UpdateReviewActions.ApproveReview, true);
  };

  // EDITOR_IN_CHIEF
  const {
    isOpen: isOpenSendEmailModal,
    onOpen: onOpenSendMailModal,
    onClose: onCloseSendEmailModal,
  } = useDisclosure();
  const [currentModalTitle, setCurrentModalTitle] = useState(
    MODAL_TITLES.INVITE_EDITOR
  );
  const [currentModalArticle, setCurrentModalArticle] = useState();

  const handleOpenModal = (articleId) => {
    setCurrentModalTitle(MODAL_TITLES.INVITE_EDITOR);
    setCurrentModalArticle(articleId);
    onOpenSendMailModal();
  };

  const handleOpenModalSendResultChief = (articleId) => {
    setCurrentModalTitle(MODAL_TITLES.SEND_RESULT_TO_CHIEF);
    setCurrentModalArticle(articleId);
    onOpenSendMailModal();
  };

  const handleOpenModalSendToPublisher = (articleId) => {
    setCurrentModalTitle(MODAL_TITLES.SEND_TO_PUBLISHER);
    setCurrentModalArticle(articleId);
    onOpenSendMailModal();
  };

  const handleCloseModal = () => {
    setCurrentModalArticle(undefined);
    onCloseSendEmailModal();
  };

  //EDITOR
  const handleRejectDecision = (articleId) => {
    return axiosInstance
      .put(`/articles/${articleId}/reject`)
      .then((_) => {
        setRefresh((pre) => !pre);
      })
      .catch(console.log);
  };

  //EDITOR
  const handleEditorAccept = (articleId) => {
    return axiosInstance
      .get(`/articles/${articleId}/invite/editor`)
      .then((_) => {
        setRefresh((pre) => !pre);
      })
      .catch(console.log);
  };

  const handleEditorInviteReviewers = (articleId) => {
    setCurrentModalTitle(MODAL_TITLES.INVITE_REVIEWER);
    setCurrentModalArticle(articleId);
    onOpenSendMailModal();
  };

  //PUBLISHER
  const handlePublisherAccept = (articleId) => {
    setCurrentModalTitle(MODAL_TITLES.PUBLISH_ARTICLE);
    setCurrentModalArticle(articleId);
    onOpenSendMailModal();

    // return axiosInstance
    //   .get(`/articles/${articleId}/invite/publisher`)
    //   .then((_) => {
    //     setRefresh((pre) => !pre);
    //   })
    //   .catch(console.log);
  };

  return !loading ? (
    <Box>
      <Modal
        size="2xl"
        isOpen={openReviewResultModal}
        onClose={() => {
          setOpenReviewResultModal(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Review results</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing="4">
              {reviewResults?.length &&
                reviewResults.map((review, idx) => (
                  <Box>
                    <Box fontSize="xl">Reviewer {idx + 1}</Box>
                    <Grid templateColumns="2em 1fr">
                      <Box>{review.scores?.reievance}</Box>
                      <Box>Reievance and timeliness</Box>
                      <Box>{review.scores?.technicalContent}</Box>
                      <Box>Technical content and scienific rigour</Box>
                      <Box>{review.scores?.novelty}</Box>
                      <Box>Novelty and originality</Box>
                      <Box>{review.scores?.quality}</Box>
                      <Box>Quality of presentation</Box>
                    </Grid>
                    <Box>Strong aspects: {review.strongAspects}</Box>
                    <Box>Weak aspects: {review.weakAspects}</Box>
                    <Box>Recommended changes: {review.recommendedChanges}</Box>
                    <hr />
                  </Box>
                ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* review modal */}
      <Modal
        size="2xl"
        isOpen={openReviewModal}
        onClose={() => {
          setOpenReviewModal(false);
          setViewReviewSelected(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Review article</ModalHeader>
          <ModalCloseButton />
          {reviewSelected && (
            <ModalBody>
              <VStack align="stretch" spacing="6">
                <Grid templateColumns="repeat(4, 1fr)" gap="2">
                  <GridItem textAlign="right" fontWeight="semibold">
                    Article's name:{" "}
                  </GridItem>
                  <GridItem colSpan="3">
                    {reviewSelected.article?.info.title}
                  </GridItem>
                  {/* <GridItem textAlign="right">Chu de nghien cuu</GridItem>
                <GridItem colSpan="3">
                  {reviewSelected.article?.researches.toString()}
                </GridItem> */}
                  <GridItem textAlign="right" fontWeight="semibold">
                    File content:{" "}
                  </GridItem>
                  <GridItem
                    colSpan="3"
                    textDecor="underline"
                    cursor="pointer"
                    color="blue"
                    onClick={() => hanldeDownload(reviewSelected.article)}
                  >
                    {reviewSelected.article?.file.filename}
                  </GridItem>
                </Grid>

                <HStack>
                  <Box w="20">
                    <Select
                      value={reviewScores.reievance}
                      onChange={(e) =>
                        setReviewScores((pre) => ({
                          ...pre,
                          reievance: e.target.value,
                        }))
                      }
                      isDisabled={viewReviewSelected}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Select>
                  </Box>
                  <Box textAlign="center">Reievance and timeliness</Box>
                </HStack>
                <HStack>
                  <Box w="20">
                    <Select
                      value={reviewScores.technicalContent}
                      onChange={(e) =>
                        setReviewScores((pre) => ({
                          ...pre,
                          technicalContent: e.target.value,
                        }))
                      }
                      isDisabled={viewReviewSelected}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Select>
                  </Box>
                  <Box textAlign="center">
                    Technical content and scienific rigour
                  </Box>
                </HStack>
                <HStack>
                  <Box w="20">
                    <Select
                      value={reviewScores.novelty}
                      onChange={(e) =>
                        setReviewScores((pre) => ({
                          ...pre,
                          novelty: e.target.value,
                        }))
                      }
                      isDisabled={viewReviewSelected}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Select>
                  </Box>
                  <Box textAlign="center">Novelty and originality</Box>
                </HStack>
                <HStack>
                  <Box w="20">
                    <Select
                      value={reviewScores.quality}
                      onChange={(e) =>
                        setReviewScores((pre) => ({
                          ...pre,
                          quality: e.target.value,
                        }))
                      }
                      isDisabled={viewReviewSelected}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Select>
                  </Box>
                  <Box textAlign="center">Quality of presentation</Box>
                </HStack>

                <Box>
                  <Box>
                    Strong aspects <span className="required-field">*</span>
                  </Box>
                  <Textarea
                    value={strongAspects}
                    onChange={(e) => setStrongAspects(e.target.value)}
                    minH="32"
                    placeholder="Strong aspects Strong aspects Strong aspects"
                    isDisabled={viewReviewSelected}
                  />
                </Box>

                <Box>
                  <Box>
                    Weak aspects <span className="required-field">*</span>
                  </Box>
                  <Textarea
                    value={weakAspects}
                    onChange={(e) => setWeakAspects(e.target.value)}
                    minH="32"
                    placeholder="Weak aspects Weak aspects Weak aspects"
                    isDisabled={viewReviewSelected}
                  />
                </Box>

                <Box>
                  <Box>
                    Recommnended changes{" "}
                    <span className="required-field">*</span>
                  </Box>
                  <Textarea
                    value={recommendedChanges}
                    onChange={(e) => setRecommendedChanges(e.target.value)}
                    minH="32"
                    placeholder="Recommnended changes"
                    isDisabled={viewReviewSelected}
                  />
                </Box>
              </VStack>
            </ModalBody>
          )}
          {!viewReviewSelected && (
            <ModalFooter>
              <Button
                colorScheme="gray"
                mr={3}
                onClick={() => hanldeReviewArticle(reviewSelected)}
              >
                Save
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => handleApproveReview(reviewSelected)}
              >
                Approve review
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>

      <SendEmailModal
        articleId={currentModalArticle}
        title={currentModalTitle}
        isOpen={isOpenSendEmailModal}
        onClose={handleCloseModal}
        setRefresh={setRefresh}
      />

      <HStack mb="4">
        <Box>Select role</Box>
        <Box>
          <Select
            style={{ textTransform: "uppercase" }}
            onChange={(e) => {
              history.push(`/articles/${e.target.value}/management`);
            }}
            value={role}
          >
            {Object.keys(ROLES)
              .filter((r) => user.role % ROLES[r] === 0)
              .map((r, idx) => (
                <option value={ROLES[r]} key={idx}>
                  {r}
                </option>
              ))}
          </Select>
        </Box>
      </HStack>

      <HStack>
        <Box maxW="80" minW="80">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
          />
        </Box>

        <Box>
          <Select
            style={{
              textTransform: "uppercase",
            }}
            value={statusSelected}
            onChange={(e) => setStatusSelected(e.target.value)}
          >
            <option value="">All</option>
            {Object.values(currentStatuses).map((status) => (
              <option value={status}>{status}</option>
            ))}
          </Select>
        </Box>
      </HStack>

      <Table>
        <Thead>
          <Tr>{renderHeader()}</Tr>
        </Thead>
        <Tbody>{renderList()}</Tbody>
      </Table>
    </Box>
  ) : (
    <Box>Loading ...</Box>
  );
};

export default withRole(Reviews, [
  ROLES.AUTHOR,
  ROLES.EDITOR,
  ROLES.REVIEWER,
  ROLES.PUBLISHER,
  ROLES.EDITOR_IN_CHIEF,
]);
