export default () => {
  const handlePageLoaded = () => {
    const bodyElement = document.getElementsByTagName("body")[0];
    bodyElement && bodyElement.classList.add("loaded");
  };

  window.addEventListener("load", handlePageLoaded, { once: true });
};
