import versionData from './version.json';

export interface AppVersionInfo {
  version: string;
  commitHash: string;
  commitCount: number;
  branch: string;
  commitMessage: string;
  buildDate: string;
  buildTimestamp: string;
  repoUrl: string;
  commitUrl: string;
}

export const APP_VERSION_INFO: AppVersionInfo = versionData;
