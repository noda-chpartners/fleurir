import { pausePageScroll } from './motion';

const trigger = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const dialog = document.querySelector<HTMLDialogElement>('#menu-dialog');
if (trigger && dialog) {
  let previousOverflow = '';
  trigger.addEventListener('click', () => {
    if (dialog.open) return;
    previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    pausePageScroll(true);
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    pausePageScroll(false);
    trigger.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
}
