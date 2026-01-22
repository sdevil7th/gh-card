export interface Language {
  name: string;
  color: string;
}

export interface RepositoryNode {
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: Language | null;
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface ContributionsCollection {
  totalCommitContributions: number;
  totalPullRequestContributions: number;
  totalIssueContributions: number;
  contributionCalendar: ContributionCalendar;
}

export interface GithubUserResponse {
  user: {
    name: string;
    login: string;
    avatarUrl: string;
    bio: string | null;
    location: string | null;
    company: string | null;
    twitterUsername: string | null;
    followers: {
      totalCount: number;
    };
    following: {
      totalCount: number;
    };
    repositories: {
      totalCount: number;
      nodes: RepositoryNode[];
    };
    contributionsCollection: ContributionsCollection;
  };
}

export interface ProcessedUserData {
  name: string;
  username: string;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  company: string | null;

  // Stats
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  totalCommits: number;
  totalPRs: number;
  followers: number;
  following: number;

  // Languages (top 5)
  languages: Array<{
    name: string;
    color: string;
    percentage: number;
    size: number; // calculated score
  }>;

  // Contribution heatmap (last weeks)
  contributions: {
    total: number;
    calendar: ContributionWeek[];
  };
}

export interface GithubRepoResponse {
  repository: {
    name: string;
    description: string | null;
    stargazerCount: number;
    forkCount: number;
    openIssues: {
      totalCount: number;
    };
    watchers: {
      totalCount: number;
    };
    owner: {
      login: string;
      avatarUrl: string;
    };
    languages: {
      edges: Array<{
        size: number;
        node: {
          name: string;
          color: string;
        };
      }>;
      totalSize: number;
    };
    defaultBranchRef: {
      target: {
        history: {
          totalCount: number;
        };
      };
    };
  };
}

export interface ProcessedRepoData {
  type: "repo";
  name: string;
  description: string | null;
  owner: string;
  avatarUrl: string;

  stars: number;
  forks: number;
  issues: number;
  watchers: number;
  commits: number;

  languages: Array<{
    name: string;
    color: string;
    percentage: number;
  }>;
}

export interface GithubOrgResponse {
  organization: {
    name: string;
    login: string;
    avatarUrl: string;
    description: string | null;
    location: string | null;
    websiteUrl: string | null;
    twitterUsername: string | null;
    repositories: {
      totalCount: number;
      nodes: RepositoryNode[];
    };
  };
}

export interface ProcessedOrgData {
  type: "organization";
  name: string;
  username: string; // login
  avatarUrl: string;
  description: string | null;
  location: string | null;
  websiteUrl: string | null;
  twitterUsername: string | null;

  // Stats
  totalStars: number;
  totalForks: number;
  totalRepos: number;

  // Languages (top 5 from repos)
  languages: Array<{
    name: string;
    color: string;
    percentage: number;
    size: number;
  }>;
}

export type CardData =
  | (ProcessedUserData & { type: "user" })
  | ProcessedRepoData
  | ProcessedOrgData;
