import { Notify } from 'notiflix/build/notiflix-notify-aio';

// castom options for infoMessage
const notifyOptions = {
  position: 'center-bottom',
  distance: '50px',
  timeout: 4000,
  clickToClose: true,
  cssAnimationStyle: 'from-bottom',
  showOnlyTheLastOne: true,
};

export const errorMessage =
  'Sorry, there are no images matching your search query. Please try again.';

const infoMessage =
  "We're sorry, but you've reached the end of search results.";

export class NotifyMessage {
  constructor() {
    this.errorMessage = errorMessage;
    this.infoMessage = infoMessage;
    this.options = notifyOptions;
  }

  showSuccessMessage(message) {
    Notify.success(message);
  }
  showFailureMessage(message) {
    Notify.failure(message);
  }
  showInfoMessage() {
    Notify.info(this.infoMessage, this.options);
  }
}
