document.addEventListener('DOMContentLoaded', () => {
  const coracao = document.getElementById('coracao');
  const body = document.body;
  const contentArea = document.querySelector('.content-area');
  const fraseCentral = document.querySelector('.frase-central');
  const btnContinuar = document.querySelector('.btn-continuar');
  const secondScreen = document.querySelector('.second-screen');
  const btnVoltar = document.querySelector('.btn-voltar');
  const btnContinuar2 = document.querySelector('.btn-continuar-2');
  const thirdScreen = document.getElementById('thirdScreen');
  const audioPlayer = document.getElementById('audioPlayer');
  const btnVoltar3 = document.querySelector('.btn-voltar-3');
  const btnContinuar3 = document.querySelector('.btn-continuar-3'); // NOVO: Seleciona o botão continuar da terceira tela
  const progressBarFill = document.querySelector('.progress-bar-fill');
  const currentTimeSpan = document.getElementById('currentTime');
  const totalTimeSpan = document.getElementById('totalTime');
  const finalScreen = document.getElementById('finalScreen'); // NOVO: Seleciona a tela final
  const finalPhrases = document.querySelectorAll('.final-phrase'); // NOVO: Seleciona todas as frases finais

  const textoParaDigitar =
    'Julia, não tenho palavras pra dizer o que sinto por você, mas tenho linhas de código! Pra representar o quanto eu amo ter você na minha vida.';
  let indexTexto = 0;
  const velocidadeDigitacao = 70;

  let fadeInterval; // Esta variável controla o setInterval para os fades
  let fadeOutStarted = false; // Flag para evitar múltiplos fades out

  function digitarTexto() {
    if (indexTexto < textoParaDigitar.length) {
      fraseCentral.textContent += textoParaDigitar.charAt(indexTexto);
      indexTexto++;
      setTimeout(digitarTexto, velocidadeDigitacao);
    } else {
      if (btnContinuar) {
        btnContinuar.classList.add('show');
      }
    }
  }

  function fadeInAudio(audio) {
    clearInterval(fadeInterval); // Limpa qualquer intervalo de fade anterior
    fadeOutStarted = false; // Reseta a flag ao iniciar um novo fade-in/reprodução
    audio.volume = 0;
    audio.play();
    let volume = 0;
    const maxVolume = 1.0;
    const fadeStep = 0.02;
    const fadeDuration = 50;

    fadeInterval = setInterval(() => {
      if (volume < maxVolume) {
        volume += fadeStep;
        audio.volume = Math.min(volume, maxVolume);
      } else {
        clearInterval(fadeInterval);
      }
    }, fadeDuration);
  }

  // A função fadeOutAudio é atualizada para mostrar o btnContinuar3
  function fadeOutAudio(audio, resetOnEnd = true) {
    clearInterval(fadeInterval); // Limpa qualquer intervalo de fade anterior

    let volume = audio.volume;
    if (volume === 0 && !audio.paused) {
      audio.pause();
      if (resetOnEnd) audio.currentTime = 0;
      progressBarFill.style.width = '0%';
      // Se o fadeout veio do final da música ou do botão "voltar", mostra o btnContinuar3
      if (resetOnEnd && btnContinuar3) {
        btnContinuar3.classList.add('show');
      }
      return;
    }

    const fadeStep = 0.05;
    const fadeDuration = 100;

    fadeInterval = setInterval(() => {
      if (volume > 0) {
        volume -= fadeStep;
        audio.volume = Math.max(volume, 0);
      } else {
        audio.pause();
        if (resetOnEnd) audio.currentTime = 0;
        progressBarFill.style.width = '0%';
        clearInterval(fadeInterval);
        // Mostra o btnContinuar3 APENAS se o fadeout for por fim de música ou botão "voltar"
        if (resetOnEnd && btnContinuar3) {
          btnContinuar3.classList.add('show');
        }
      }
    }, fadeDuration);
  }

  // NOVO: Função para animar as frases na tela final
  function animateFinalPhrases() {
    finalPhrases.forEach((phrase, index) => {
      // Esconde todas as frases inicialmente
      phrase.classList.remove('show');
      // Adiciona a classe 'show' com um atraso para cada frase
      setTimeout(() => {
        phrase.classList.add('show');
      }, 2000 * (index + 1)); // 500ms de atraso para cada frase
    });
  }

  if (audioPlayer) {
    audioPlayer.addEventListener('timeupdate', () => {
      if (!isNaN(audioPlayer.duration) && audioPlayer.duration > 0) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBarFill.style.width = `${progress}%`;

        const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
        const currentSeconds = Math.floor(audioPlayer.currentTime % 60);
        currentTimeSpan.textContent = `${currentMinutes}:${
          currentSeconds < 10 ? '0' : ''
        }${currentSeconds}`;

        if (totalTimeSpan.textContent === '1:27') {
          const totalMinutes = Math.floor(audioPlayer.duration / 60);
          const totalSeconds = Math.floor(audioPlayer.duration % 60);
          totalTimeSpan.textContent = `${totalMinutes}:${
            totalSeconds < 10 ? '0' : ''
          }${totalSeconds}`;
        }

        // FADE OUT automático quando faltar X segundos para o fim
        if (
          !fadeOutStarted &&
          audioPlayer.duration - audioPlayer.currentTime < 5 && // 5 segundos antes do fim
          audioPlayer.volume > 0.05 // Garante que há volume para diminuir
        ) {
          fadeOutStarted = true; // Define a flag para evitar múltiplos disparos
          fadeOutAudio(audioPlayer);
        }
      }
    });

    progressBarFill.parentElement.addEventListener('click', () => {
      if (audioPlayer.paused) {
        fadeInAudio(audioPlayer);
      } else {
        fadeOutAudio(audioPlayer, false); // Ao clicar para pausar, não reseta o áudio
      }
    });
  }

  // Verificação de todos os elementos necessários
  if (
    coracao &&
    body &&
    contentArea &&
    fraseCentral &&
    btnContinuar &&
    secondScreen &&
    btnContinuar2 &&
    thirdScreen &&
    btnContinuar3 && // Novo botão incluído
    progressBarFill &&
    currentTimeSpan &&
    totalTimeSpan &&
    finalScreen && // Nova tela final incluída
    finalPhrases.length > 0 // Garante que há frases
  ) {
    coracao.addEventListener('click', () => {
      body.style.backgroundColor = 'white';
      contentArea.classList.add('active');
      coracao.style.cursor = 'default';
      coracao.style.pointerEvents = 'none';

      setTimeout(() => {
        digitarTexto();
      }, 3200);
    });

    btnContinuar.addEventListener('click', () => {
      contentArea.classList.remove('active');
      secondScreen.classList.add('show');

      setTimeout(() => {
        btnContinuar2.classList.add('show');
      }, 1000);
    });

    btnContinuar2.addEventListener('click', () => {
      secondScreen.classList.remove('show');
      thirdScreen.classList.add('show');

      if (audioPlayer) {
        audioPlayer.currentTime = 0;
        fadeInAudio(audioPlayer);
      }
    });

    // NOVO: Evento de clique para o btnContinuar3 (indo para a tela final)
    btnContinuar3.addEventListener('click', () => {
      thirdScreen.classList.remove('show'); // Esconde a terceira tela
      if (audioPlayer) {
        fadeOutAudio(audioPlayer); // Garante que a música pare com fade ao sair
      }

      finalScreen.classList.add('show'); // Mostra a tela final
      animateFinalPhrases(); // Inicia a animação das frases
    });

    if (btnVoltar) {
      btnVoltar.addEventListener('click', () => {
        secondScreen.classList.remove('show');
        btnContinuar2.classList.remove('show');
        contentArea.classList.add('active');
      });
    }

    if (btnVoltar3) {
      btnVoltar3.addEventListener('click', () => {
        thirdScreen.classList.remove('show');
        btnContinuar3.classList.remove('show'); // Esconde o btnContinuar3 ao voltar para a 2a tela
        secondScreen.classList.add('show');

        if (audioPlayer) {
          fadeOutAudio(audioPlayer); // Garante que o áudio pare com fade ao voltar
        }
      });
    }
  } else {
    console.error(
      'Um ou mais elementos HTML não foram encontrados. Verifique os IDs/classes no HTML e as constantes no JS.'
    );
  }
});
