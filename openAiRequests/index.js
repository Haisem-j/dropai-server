const loadMore = (previousOutput, prefix, list = false) => {
  let more = "";

  if (list) {
    previousOutput.forEach((item, i) => {
      if (i === previousOutput.length + 1) {
        more += `\n-${item}\n\n`;
      } else {
        more += `\n-${item}`;
      }
    });
  } else {
    previousOutput.forEach((item, i) => {
      if (i === 0) {
        more += `${item} \n `;
      } else {
        more += `\n ${prefix} \n ${item} \n`;
      }
    });
  }

  more += `\n\n${prefix}\n`;
  return more;
};

module.exports = {
  loadMore,
};
