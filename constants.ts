export const CONSTANTS = {
  COMMANDS: {
    // User aggregates constants
    CREATE_USER: "create_user",
    UPDATE_USER: "update_user",
    UPDATE_USER_HOME: "update_user_home",
    UPDATE_USER_WORK: "update_user_work",
    CREATE_USER_ROUTE: "create_user_route",
    DELETE_USER_ROUTE: "delete_user_route",

    // Application aggregate constants
    CREATE_APPLICATION: "create_application",
    APPROVE_APPLICATION: "approve_application",
    REJECT_APPLICATION: "reject_application",

    // Report aggregate constants
    CREATE_REPORT: "create_report",
    UPDATE_REPORT_USER_NAME: "update_report_user_name",
    CREATE_REPORT_VOTE: "create_report_vote",
    DELETE_REPORT_VOTE: "delete_report_vote",

    // Advertistement aggregate constants
    CREATE_AD: "create_ad",
    UPDATE_AD_USER_NAME: "update_ad_user_name",

    // Comment aggregate constants
    CREATE_COMMENT: "create_comment"
  },

  TOPICS: {
    COMMAND: "fwaze_commands",
    EVENT: "fwaze_events"
  },

  EVENTS: {
    // User aggregates constants
    USER_CREATED: "user_created",
    USER_UPDATED: "user_updated",
    USER_HOME_UPDATED: "user_home_updated",
    USER_WORK_UPDATED: "user_work_updated",
    USER_ROUTE_CREATED: "user_route_created",
    USER_ROUTE_DELETED: "user_route_deleted",

    // Application aggregate constants
    APPLICATION_CREATED: "application_created",
    APPLICATION_APPROVED: "application_approved",
    APPLICATION_REJECTED: "application_rejected",

    // Report aggregate constants
    REPORT_CREATED: "report_created",
    REPORT_USER_NAME_UPDATED: "report_user_name_updated",
    REPORT_VOTE_CREATED: "report_vote_created",
    REPORT_VOTE_DELETED: "report_vote_deleted",

    // Advertistement aggregate constants
    AD_CREATED: "ad_created",
    AD_USER_NAME_UPDATED: "ad_user_name_updated",

    // Comment aggregate constants
    COMMENT_CREATED: "comment_created"
  },

  AGGREGATES: {
    USER_AGGREGATE_NAME: "users",
    APPLICATION_AGGREGATE_NAME: "applications",
    REPORT_AGGREGATE_NAME: "reports",
    AD_AGGREGATE_NAME: "advertisements",
    COMMENT_AGGREGATE_NAME: "comments"
  },

  ERRORS: {
    // Errors messages
    DEFAULT_INVALID_DATA: "Invalid data received",
    DEFAULT_SERVER_ERROR: "Something is wrong with the server. Try again later",
    USER_NOT_EXISTS: "This user does not exist",
    DEFAULT_LOGIN_FAILURE: "Login failed",
    PASSWORDS_NOT_MATCH: "Passwords do not match",
    USERNAME_TAKEN: "Username already taken",
    EMAIL_TAKEN: "Email address already registered",
    EMAIL_INVALID_FORMAT: "Format is not a valid email address",
    USER_NOT_PERMITTED: "You don't have the right permissions",
    REPORT_NOT_EXISTS: "This report does not exist",
    INVALID_REPORT_TYPE: "Invalid report type",
    REPORT_TYPE_EMPTY: "No reports of this type",
    AD_NOT_EXISTS: "This ad does not exist",
    COMMENT_NOT_EXISTS: "This comment does not exist",
    COMMENTS_NOT_FOUND: "No comments found",
    APPLICATION_NOT_EXISTS: "Application does not exist",
    DUPLICATE_APPLICATION: "Application already being processed",
    FILE_NOT_FOUND: "File not found",
    COMMAND_NOT_EXISTS: "Command does not exist"
  },

  SUCCESS: {
    // Success messages
    DEFAULT_SUCCESS: "Success",
    LOGIN_SUCCESS: "Login success"
  },

  // Component names
  COMPONENTS: {
    USER_COMPONENT: "users",
    MAP_COMPONENT: "map"
  }
};
