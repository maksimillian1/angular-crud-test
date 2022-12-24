function preventScroll(): number {
  const bodyStyle = document.body.style;
  const scrollPosition = window.pageYOffset;

  bodyStyle.overflow = 'hidden';
  bodyStyle.position = 'fixed';
  bodyStyle.top = `-${scrollPosition}px`;
  bodyStyle.width = '100%';

  return scrollPosition;
}

function enableScroll(scrollPosition: number): void {
  const bodyStyle = document.body.style;
  bodyStyle.removeProperty('overflow');
  bodyStyle.removeProperty('position');
  bodyStyle.removeProperty('top');
  bodyStyle.removeProperty('width');
  window.scrollTo(0, scrollPosition);
}

export { preventScroll, enableScroll };
