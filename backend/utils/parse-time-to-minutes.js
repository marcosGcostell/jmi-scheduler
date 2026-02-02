export default timeString => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};
