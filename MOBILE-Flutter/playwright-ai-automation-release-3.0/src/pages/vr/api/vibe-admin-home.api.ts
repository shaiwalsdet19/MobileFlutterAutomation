import { Page, Response } from "@playwright/test";

type WaitOptions = {
  timeout?: number;
};

export interface VibePostSummary {
  id: string;
  total_comments?: number;
  statusInString?: string;
  is_owner?: boolean;
  views_count?: number | null;
  show_views_count?: boolean;
}

export interface VibePostListResponse {
  params: {
    count: number;
    messages: VibePostSummary[];
  };
  message?: string;
}

export interface VibeAwardProgramSummary {
  type: "program" | "winner";
  program_id: string;
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export interface VibeAwardProgramsResponse {
  awards_data: VibeAwardProgramSummary[];
  years: number[];
  status: number;
  message: string;
}

export interface VibeNominationProgramsResponse {
  status: number;
  message: string;
  nomination_programs: Record<string, { name: string }>;
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function hasPathname(response: Response, pathname: string): boolean {
  return new URL(response.url()).pathname === pathname;
}

function requestBodyMatches(
  response: Response,
  predicate: (payload: Record<string, unknown>) => boolean
): boolean {
  try {
    const payload = response.request().postDataJSON() as Record<string, unknown>;
    return predicate(payload);
  } catch {
    return false;
  }
}

async function waitForResponse(
  page: Page,
  pathname: string,
  method: "GET" | "POST",
  options: WaitOptions = {},
  predicate?: (response: Response) => boolean
): Promise<Response> {
  return page.waitForResponse(
    (response) => {
      if (response.request().method() !== method || !hasPathname(response, pathname)) {
        return false;
      }

      return predicate ? predicate(response) : true;
    },
    { timeout: options.timeout ?? 30_000 }
  );
}

export const VibeAdminHomeApi = {
  pagePaths: {
    allPosts: "/ms/vibe/home/posts/all",
    reportedPosts: "/ms/vibe/home/posts/admin/reported",
    awardsLanding: "/ms/vibe/home/awards/awards-landing",
    groupDetailsBase: "/ms/vibe/home/groups/group",
  },
  endpoints: {
    getBanners: "/ms/vibeapi/vibe/getbanners",
    getAllPosts: "/ms/vibeapi/posts/getallposts",
    getAllPostsAdmin: "/ms/vibeapi/admin/getallpostsadmin",
    getPostAsDropdownOptions: "/ms/vibeapi/dropdown/getpostasdropdownoptions",
    getPrimaryDropdownOptions: "/ms/vibeapi/dropdown/primary",
    getAdminLeftPanelCounts: "/ms/vibeapi/admin/getadminleftpanelcounts",
    getCelebrations: "/ms/vibeapi/vibe/getcelebrations",
    getMyActivityAndSavedPostsCounts: "/ms/vibeapi/user/getmyactivityandsavedpostscounts",
    getFollowingFollowers: "/ms/vibeapi/user/getfollowingfollowers",
    getAllGroups: "/ms/vibeapi/group/allgrouplist",
    getGroupInfo: "/ms/vibeapi/group/groupinfo",
    getGroupPosts: "/ms/vibeapi/group/groupposts",
    fetchNotices: "/ms/vibeapi/v2/notice/fetchNotices",
    awardPrograms: "/rewards/Randrapi/awardPrograms",
    nominationPrograms: "/rewards/randrapi/getNominationGivePrograms",
    rewardsSettings: "/rewards/Randrapi/GetSettingDetails",
    awardsHistory: "/rewards/Randrapi/historyDetails",
  },

  getAllPostsUrl(baseUrl: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.pagePaths.allPosts}`;
  },

  getReportedPostsUrl(baseUrl: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.pagePaths.reportedPosts}`;
  },

  getAwardsLandingUrl(baseUrl: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.pagePaths.awardsLanding}`;
  },

  getGroupDetailsUrl(baseUrl: string, groupId: string, fromGroupModal = true): string {
    const suffix = fromGroupModal ? "?fromGroupModal=1" : "";
    return `${normalizeBaseUrl(baseUrl)}${this.pagePaths.groupDetailsBase}/${groupId}/group-posts${suffix}`;
  },

  async waitForBanners(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.getBanners, "GET", options);
  },

  async waitForAllPostsFeed(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.getAllPosts, "POST", options);
  },

  async waitForReportedPostsFeed(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.getAllPostsAdmin, "POST", options);
  },

  async waitForPostAsDropdownOptions(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.getPostAsDropdownOptions, "POST", options);
  },

  async waitForPrimaryAudienceOptions(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.getPrimaryDropdownOptions, "POST", options, (response) =>
      requestBodyMatches(response, (payload) => payload.for_purpose === "Post")
    );
  },

  async waitForAdminLeftPanelCounts(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.getAdminLeftPanelCounts, "GET", options);
  },

  async waitForCelebrations(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.getCelebrations, "POST", options);
  },

  async waitForMyActivityAndSavedPostsCounts(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.getMyActivityAndSavedPostsCounts, "POST", options);
  },

  async waitForFollowingFollowers(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.getFollowingFollowers, "POST", options);
  },

  async waitForAllGroups(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.getAllGroups, "POST", options);
  },

  async waitForGroupInfo(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.getGroupInfo, "POST", options);
  },

  async waitForGroupPosts(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.getGroupPosts, "POST", options);
  },

  async waitForNoticeBoard(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.fetchNotices, "POST", options);
  },

  async waitForAwardPrograms(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.awardPrograms, "POST", options);
  },

  async waitForNominationPrograms(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.nominationPrograms, "POST", options);
  },

  async waitForRewardsSettings(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForResponse(page, this.endpoints.rewardsSettings, "POST", options);
  },

  async waitForAwardsHistory(
    page: Page,
    historyType: "nominations_received" | "nominations_given",
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForResponse(page, this.endpoints.awardsHistory, "POST", options, (response) =>
      requestBodyMatches(response, (payload) => payload.history_type === historyType)
    );
  },

  async parsePostList(response: Response): Promise<VibePostListResponse> {
    return response.json() as Promise<VibePostListResponse>;
  },

  async parseAwardPrograms(response: Response): Promise<VibeAwardProgramsResponse> {
    return response.json() as Promise<VibeAwardProgramsResponse>;
  },

  async parseNominationPrograms(response: Response): Promise<VibeNominationProgramsResponse> {
    return response.json() as Promise<VibeNominationProgramsResponse>;
  },

  async parseJson<T = Record<string, unknown>>(response: Response): Promise<T> {
    return response.json() as Promise<T>;
  },

  getPostIds(payload: VibePostListResponse): string[] {
    return payload.params.messages.map((message) => message.id);
  },

  getAwardProgramIds(payload: VibeAwardProgramsResponse): string[] {
    return payload.awards_data
      .filter((entry) => entry.type === "program")
      .map((entry) => entry.program_id);
  },
};
