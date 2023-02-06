module.exports = function (eleventyConfig) {

  // Folders to copy to output folder
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("uploads");
  return {
    pathPrefix: "doc"/*,
    dir: {
      input: "src",
      output: "www",
    }*/
  };

};
