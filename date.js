exports.getDate = () => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const date = new Date;
  day = date.toLocaleDateString("en-US", options);
  return day
}

exports.getDay = () => {
  const options = { weekday: 'long'};
  const date = new Date;
  day = date.toLocaleDateString("en-US", options); 
  return day;
}