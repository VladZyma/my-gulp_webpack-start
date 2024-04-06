import getItemName from './modules/getItemName';

const buttonEl = document.querySelector('.contacts__btn');

buttonEl.addEventListener('click', function (e) {
  getItemName(e.target.innerText);
});
