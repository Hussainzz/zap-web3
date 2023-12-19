export const getInitials = (name: string): string => {
  const names = name.split(" ");
  const initials = names.map((part) => part.charAt(0).toUpperCase()).join("");
  return initials.length > 1 ? initials : name.substring(0, 2).toUpperCase();
};

export const getUserAppInfoLbl = (appEndpointKey: string): string => {
  let lbl = ''
  switch (appEndpointKey) {
    case 'postMessageToChannel':
        lbl = 'Channels'
      break;
    default:
      break;
  }
  return lbl;
}