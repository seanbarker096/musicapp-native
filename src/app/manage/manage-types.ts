export type ManageStackParamList = {
  Manage: undefined;
  ManageTaggedPosts: undefined;
  ManageFeaturedPosts: undefined;
  ViewPost: { postId: number }; // We can't append Manage here because we navigate to ViewPost in the resusable Gallery component, so we must keep the Screen name the same
  ManageCreatePerformance: undefined;
};
