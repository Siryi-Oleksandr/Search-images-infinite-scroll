const optionsObserver = {
  root: null,
  rootMargin: '350px',
  threshold: 0.25,
};

function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onLoadMore();
    }
  });
}
function handleIntersectLastElem(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      notify.showInfoMessage();
    }
  });
}

export { optionsObserver, handleIntersect, handleIntersectLastElem };
