exports.ROLES = {
  ADMIN: 2,
  AUTHOR: 3,
  REVIEWER: 5,
  EDITOR: 7,
  PUBLISHER: 11,
  EDITOR_IN_CHIEF: 13,
};

exports.EmailTypes = {
  REGISTER: 0,
  FORGOT_PASSWORD: 1,
  CHANGE_PASSWORD: 2,
  REVIEWER_RESULT: "REVIEWER_RESULT",
  PUBLISHED: "PUBLISHED",
  PUBLISHER_ACCEPT: "PUBLISHER_ACCEPT",
  REJECTED: "REJECTED",
};

exports.Lists = {
  MAJOR_RESEARCH: 0,
  VOLUME_ISSUE: 2,
};

exports.ArticleStatus = {
  INCOMPLETE: "incomplete",
  WAIT_APPROVE: "wait for approve",
  WITH_EDITOR: "wth editor",
  REJECTED: "rejected",
  WITH_REVIEWER: "wth reviewer",
  NEED_REVISION: "need revision",
  ACCEPTED: "accepted",
};

exports.ReviewStatus = {
  REJECTED: "rejected",
  NEW_INVITATION: "new invitation",
  INCOMPLETE: "incomplete assignment",
  COMPLETED: "completed assignment",
};

exports.EditorChiefStatus = {
  NEW_SUBMISSIONS: "new submissions",
  ASSIGNED_EDITOR: "Assigned to Editor",
  RESULT_EDITOR: "Result from Editor",
  REJECTED_DECISION: "rejected decision",
  RETURN_AUTHOR: "Return to author",
  SENT_TO_PUBLISHER: "Sent to Publisher",
  PUBLISHED: "Published",
};

exports.EditorStatus = {
  REJECTED: "rejected",
  NEW_INVITATION: "new invitation",
  DECLINE: "decline invitation",
  INCOMPLETE_ASSIGNMENT: "incomplete assignment",
  COMPLETED: "completed",
};

exports.PublishStatus = {
  WAIT_FOR_PUBLISHING: "Wait for publishing",
  PUBLISHED: "Published",
};

exports.ConstantTypes = {
  MANUSCRIPT_ID: "manuscript_id",
  SUBMISSION_FIRST_DECISION: "submission_first_decision",
  SUBMISSION_ACCEPTANCE: "submission_acceptance",
  SUBMISSION_DOWNLOAD: "submission_download",
};

exports.INVITE_ARTICLE = {
  INVITE_EDITOR: "Invite editor",
  INVITE_REVIEWER: "Invite reviewer",
  SEND_RESULT_TO_CHIEF: "Send result to Editor-in-Chief",
  SEND_TO_PUBLISHER: "Send to publisher",
  REVISION_AUTHOR: "Revision to author",
};
