import throttle from "lodash/throttle";

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = document.querySelectorAll(
      `.screen:not(.screen--result)`
    );
    this.menuElements = document.querySelectorAll(
      `.page-header__menu .js-menu-link`
    );

    this.outgoingScreen = undefined;
    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(
      `wheel`,
      throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, { trailing: true })
    );
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.activeScreen;
      this.outgoingScreen = this.activeScreen;
      if (currentPosition !== this.activeScreen) {
        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex(
      (screen) => location.hash.slice(1) === screen.id
    );
    this.outgoingScreen = this.activeScreen;
    this.activeScreen = newIndex < 0 ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    if (this.outgoingScreen === 1 && this.activeScreen === 2) {
      // переход со скрина История на скрин Призы
      // добавляем screen-hidden всем, кроме Истории
      this.screenElements.forEach((screen, i) => {
        if (i !== this.outgoingScreen) {
          screen.classList.add(`screen--hidden`);
          screen.classList.remove(`active`);
        }
      });
      // показываем блок с заливкой бэкраунда
      const blockWithFIlledBackground = document.getElementsByClassName(
        "block__background-fill"
      )[0];
      if (blockWithFIlledBackground) {
        console.log("added active to background");
        blockWithFIlledBackground.classList.add("active");
      }

      //далее дожадаемся окончания (+ немного запас) трансформации блока с заливкой и
      // 1. прячем экран историй и
      // 2. показываем экран с призами
      // 3. возвращаем блок с заливкой в исходное состояние
      setTimeout(() => {
        this.screenElements[this.outgoingScreen].classList.add(
          `screen--hidden`
        );
        this.screenElements[this.outgoingScreen].classList.remove(`active`);
        this.screenElements[this.activeScreen].classList.remove(
          `screen--hidden`
        );

        setTimeout(() => {
          this.screenElements[this.activeScreen].classList.add(`active`);
        }, 10);

        if (blockWithFIlledBackground) {
          blockWithFIlledBackground.classList.remove("active");
        }
      }, 600);
    } else {
      this.screenElements.forEach((screen) => {
        screen.classList.add(`screen--hidden`);
        screen.classList.remove(`active`);
      });

      this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);

      setTimeout(() => {
        this.screenElements[this.activeScreen].classList.add(`active`);
      }, 100);
    }
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find(
      (item) => item.dataset.href === this.screenElements[this.activeScreen].id
    );
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        screenId: this.activeScreen,
        screenName: this.screenElements[this.activeScreen].id,
        screenElement: this.screenElements[this.activeScreen],
      },
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(
        this.screenElements.length - 1,
        ++this.activeScreen
      );
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
