export default () => {
  const showFooterAction = () => {
    const footerElement = document.getElementsByClassName("hidden_footer")[0];
    footerElement && footerElement.classList.remove("hidden_footer");
  };

  let footerTogglers = document.querySelectorAll(`.js-footer-toggler`);

  if (footerTogglers.length) {
    for (let i = 0; i < footerTogglers.length; i++) {
      footerTogglers[i].addEventListener(`click`, function () {
        let footer = footerTogglers[i].parentNode;
        if (footer.classList.contains(`screen__footer--full`)) {
          footer.classList.remove(`screen__footer--full`);
        } else {
          footer.classList.add(`screen__footer--full`);
        }
      });
    }
  }
  window.addEventListener("load", showFooterAction, { once: true });
};
