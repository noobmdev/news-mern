export const ROLES = {
  ADMIN: 2,
  AUTHOR: 3,
  REVIEWER: 5,
  EDITOR: 7,
  PUBLISHER: 11,
  EDITOR_IN_CHIEF: 13,
};

export const HANDLE_ACTIONS = {
  ADD: "add",
  REMOVE: "remove",
  CHANGE: "change",
};

export const LISTS = {
  MAJOR_RESEARCH: 0,
  VOLUME_ISSUE: 2,
};

export const ARTICLE_STATUSES = {
  INCOMPLETE: "incomplete",
  WAIT_APPROVE: "wait for approve",
  WITH_EDITOR: "wth editor",
  REJECTED: "rejected",
  WITH_REVIEWER: "wth reviewer",
  NEED_REVISION: "need revision",
  ACCEPTED: "accepted",
};

export const REVIEW_STATUSES = {
  NEW_INVITATION: "new invitation",
  INCOMPLETE: "incomplete assignment",
  COMPLETED: "completed assignment",
};

export const EDITOR_IN_CHIEF_STATUSES = {
  PENDING: "pending",
  NEW_SUBMISSIONS: "new submissions",
  ASSIGNED_EDITOR: "Assigned to Editor",
  RESULT_EDITOR: "Result from Editor",
  REJECTED_DECISION: "rejected decision",
  RETURN_AUTHOR: "Return to author",
  SENT_TO_PUBLISHER: "Sent to Publisher",
  PUBLISHED: "Published",
};

export const EDITOR_STATUSES = {
  REJECTED: "rejected",
  NEW_INVITATION: "new invitation",
  INCOMPLETE_ASSIGNMENT: "incomplete assignment",
};

export const PUBLISHER_STATUSES = {
  WAIT_FOR_PUBLISHING: "Wait for publishing",
  PUBLISHED: "Published",
};

export const CONSTANTS_TYPES = {
  MANUSCRIPT_ID: "manuscript_id",
  SUBMISSION_FIRST_DECISION: "submission_first_decision",
  SUBMISSION_ACCEPTANCE: "submission_acceptance",
  SUBMISSION_DOWNLOAD: "submission_download",
};

export const MODAL_TITLES = {
  INVITE_EDITOR: "Invite editor",
  INVITE_REVIEWER: "Invite reviewer",
  SEND_RESULT_TO_CHIEF: "Send result to Editor-in-Chief",
  SEND_TO_PUBLISHER: "Send to publisher"
};
