export const isMemberRole = (role: string | undefined | null): boolean => {
  if (!role) return false;
  return ["user", "jamaah", "member"].includes(role);
};
