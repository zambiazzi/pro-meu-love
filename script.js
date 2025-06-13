document.addEventListener('DOMContentLoaded', () => {
  const lampada = document.getElementById('lampada');
  const body = document.body;
  const contentArea = document.querySelector('.content-area');

  if (lampada && body && contentArea) {
    lampada.addEventListener('click', () => {
      body.style.backgroundColor = 'white';

      contentArea.classList.add('active');
      lampada.style.cursor = 'default';
      lampada.style.pointerEvents = 'none';
    });
  } else {
    console.error(
      'Um ou mais elementos não foram encontrados: lâmpada, body ou content-area.'
    );
  }
});
