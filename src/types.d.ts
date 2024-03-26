// This is mostly the interface for the API Response from Github
// Found this somewhere on stack overflow
export interface GithubUser {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

// Generic to be used for filtering the response
// This is specially useful because it helps us
// with getting additive changes and subtractive changes
// which can be used to update the animations of graphics units
export interface DiffOperation<T> {
  additive: T[];
  subtractive: T[];
}

// Our base interface for graphics card
// Can be improved to have more properties
export interface LayoutInfo extends TextMetrics {
  x: number;
  y: number;
  width: number;
  height: number;
  textWidth: number;
}