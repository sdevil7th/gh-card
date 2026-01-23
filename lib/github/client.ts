import { GraphQLClient } from "graphql-request";
import {
  ORGANIZATION_STATS_QUERY,
  REPO_STATS_QUERY,
  USER_STATS_QUERY,
} from "./queries";
import {
  CardData,
  GithubOrgResponse,
  GithubRepoResponse,
  GithubUserResponse,
  ProcessedOrgData,
  ProcessedRepoData,
  ProcessedUserData,
} from "./types";

const GITHUB_ENDPOINT = "https://api.github.com/graphql";

export async function fetchGithubData(input: string): Promise<CardData> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN is not defined");
  }

  const client = new GraphQLClient(GITHUB_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  try {
    // Check if input is a repository (owner/repo)
    const isRepo = input.includes("/");

    if (isRepo) {
      const [owner, name] = input.split("/");
      const data = await client.request<GithubRepoResponse>(REPO_STATS_QUERY, {
        owner,
        name,
      });
      return processRepoData(data);
    }

    try {
      const data = await client.request<GithubUserResponse>(USER_STATS_QUERY, {
        login: input,
      });
      return processUserData(data);
    } catch (error: any) {
      // If user not found, try fetching as Organization
      try {
        const orgData = await client.request<GithubOrgResponse>(
          ORGANIZATION_STATS_QUERY,
          {
            login: input,
          },
        );
        return processOrgData(orgData);
      } catch (orgError) {
        console.error("Failed to fetch as User and Organization:", orgError);
        // Throw original error if both fail
        throw error;
      }
    }
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    throw error;
  }
}

function processRepoData(data: GithubRepoResponse): ProcessedRepoData {
  const { repository } = data;

  const languages = repository.languages.edges
    .map((edge) => ({
      name: edge.node.name,
      color: edge.node.color,
      percentage: Math.ceil((edge.size / repository.languages.totalSize) * 100),
    }))
    .slice(0, 5);

  return {
    type: "repo",
    name: repository.name,
    description: repository.description,
    owner: repository.owner.login,
    avatarUrl: repository.owner.avatarUrl,

    stars: repository.stargazerCount,
    forks: repository.forkCount,
    issues: repository.openIssues.totalCount,
    watchers: repository.watchers.totalCount,
    commits: repository.defaultBranchRef?.target?.history?.totalCount || 0,

    languages,
  };
}

function processUserData(
  data: GithubUserResponse,
): ProcessedUserData & { type: "user" } {
  const { user } = data;

  // 1. Calculate Repo Stats
  const repos = user.repositories.nodes;
  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazerCount, 0);
  const totalForks = repos.reduce((acc, repo) => acc + repo.forkCount, 0);

  // 2. Calculate Language Distribution (by repo count)
  const languageMap = new Map<string, { count: number; color: string }>();

  repos.forEach((repo) => {
    if (repo.primaryLanguage) {
      const { name, color } = repo.primaryLanguage;
      const current = languageMap.get(name) || { count: 0, color };
      languageMap.set(name, { ...current, count: current.count + 1 });
    }
  });

  const totalLanguages = Array.from(languageMap.values()).reduce(
    (acc, item) => acc + item.count,
    0,
  );

  const languages = Array.from(languageMap.entries())
    .map(([name, { count, color }]) => ({
      name,
      color,
      size: count,
      percentage: Math.ceil((count / totalLanguages) * 100),
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 5); // Top 5

  return {
    name: user.name || user.login,
    username: user.login,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    location: user.location,
    company: user.company,

    totalStars,
    totalForks,
    totalRepos: user.repositories.totalCount,
    totalCommits: user.contributionsCollection.totalCommitContributions,
    totalPRs: user.contributionsCollection.totalPullRequestContributions,
    followers: user.followers.totalCount,
    following: user.following.totalCount,

    languages,

    contributions: {
      total:
        user.contributionsCollection.contributionCalendar.totalContributions,
      calendar:
        user.contributionsCollection.contributionCalendar.weeks.slice(-10), // Last 10 weeks
    },
    type: "user",
  };
}

function processOrgData(data: GithubOrgResponse): ProcessedOrgData {
  const { organization } = data;

  const repos = organization.repositories.nodes;
  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazerCount, 0);
  const totalForks = repos.reduce((acc, repo) => acc + repo.forkCount, 0);

  // Calculate Language Distribution
  const languageMap = new Map<string, { count: number; color: string }>();

  repos.forEach((repo) => {
    if (repo.primaryLanguage) {
      const { name, color } = repo.primaryLanguage;
      const current = languageMap.get(name) || { count: 0, color };
      languageMap.set(name, { ...current, count: current.count + 1 });
    }
  });

  const totalLanguages = Array.from(languageMap.values()).reduce(
    (acc, item) => acc + item.count,
    0,
  );

  const languages = Array.from(languageMap.entries())
    .map(([name, { count, color }]) => ({
      name,
      color,
      size: count,
      percentage: Math.ceil((count / totalLanguages) * 100),
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 5);

  return {
    type: "organization",
    name: organization.name || organization.login,
    username: organization.login,
    avatarUrl: organization.avatarUrl,
    description: organization.description,
    location: organization.location,
    websiteUrl: organization.websiteUrl,
    twitterUsername: organization.twitterUsername,

    totalStars,
    totalForks,
    totalRepos: organization.repositories.totalCount,

    languages,
  };
}
