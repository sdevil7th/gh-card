import { gql } from "graphql-request";

export const USER_STATS_QUERY = gql`
  query UserStats($login: String!) {
    user(login: $login) {
      name
      login
      avatarUrl
      bio
      location
      company
      twitterUsername

      followers {
        totalCount
      }
      following {
        totalCount
      }

      repositories(
        first: 100
        ownerAffiliations: OWNER
        orderBy: { field: STARGAZERS, direction: DESC }
        isFork: false
      ) {
        totalCount
        nodes {
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
        }
      }

      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`;

export const REPO_STATS_QUERY = gql`
  query RepoStats($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      name
      description
      stargazerCount
      forkCount

      openIssues: issues(states: OPEN) {
        totalCount
      }

      watchers {
        totalCount
      }

      owner {
        login
        avatarUrl
      }

      languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
        totalSize
        edges {
          size
          node {
            name
            color
          }
        }
      }

      defaultBranchRef {
        target {
          ... on Commit {
            history {
              totalCount
            }
          }
        }
      }
    }
  }
`;

export const ORGANIZATION_STATS_QUERY = gql`
  query OrgStats($login: String!) {
    organization(login: $login) {
      name
      login
      avatarUrl
      description
      location
      websiteUrl
      twitterUsername

      repositories(
        first: 100

        orderBy: { field: STARGAZERS, direction: DESC }
        isFork: false
      ) {
        totalCount
        nodes {
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
        }
      }
    }
  }
`;
