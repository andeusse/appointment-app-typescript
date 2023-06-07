const getFullNameInitials = (name: string) => {
  const fullName = name.toUpperCase().split(' ');
  if (fullName.length === 2) {
    return `${fullName[0][0]}${fullName[1][0]}`;
  } else if (fullName.length === 3) {
    return `${fullName[0][0]}${fullName[1][0]}`;
  } else if (fullName.length === 4) {
    return `${fullName[0][0]}${fullName[2][0]}`;
  } else {
    return `${fullName[0][0]}${fullName[2][0]}`;
  }
};

export default getFullNameInitials;
