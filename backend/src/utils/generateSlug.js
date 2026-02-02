const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()       // Replace multiple - with single -
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
};

module.exports = generateSlug;