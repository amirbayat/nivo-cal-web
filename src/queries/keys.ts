export const keys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  nivoCal: {
    profile: () => ['nivo-cal', 'profile'] as const,
    logs: () => ['nivo-cal', 'logs'] as const,
    dailySummary: () => ['nivo-cal', 'daily-summary'] as const,
  },
}
