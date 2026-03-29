// ===== i18n TRANSLATIONS =====
const translations = {
  id: {
    title: 'Cek ID Akun <span class="title-accent">Mobile Legends</span>',
    subtitle: 'Verifikasi username dan region akun Mobile Legends secara instan',
    cardTitle: 'Validasi Akun',
    cardDesc: 'Masukkan User ID dan Server ID akun Anda',
    labelUserId: 'User ID',
    labelServerId: 'Server ID',
    placeholderUserId: 'Contoh: 496332516',
    placeholderServerId: 'Contoh: 2463',
    btnSubmit: 'Cek Sekarang',
    btnLoading: 'Mengecek...',
    resultFound: 'Akun Ditemukan!',
    footer: 'Dibuat dengan ❤️',
    errEmpty: 'Harap masukkan User ID dan Server ID',
    errServer: 'Gagal terhubung ke server',
    errValidate: 'Gagal memvalidasi ID',
    pageTitle: 'Cek ID Akun Mobile Legends',
  },
  en: {
    title: 'Check Account ID <span class="title-accent">Mobile Legends</span>',
    subtitle: 'Instantly verify username and region of Mobile Legends accounts',
    cardTitle: 'Validate Account',
    cardDesc: 'Enter your User ID and Server ID',
    labelUserId: 'User ID',
    labelServerId: 'Server ID',
    placeholderUserId: 'Example: 496332516',
    placeholderServerId: 'Example: 2463',
    btnSubmit: 'Check Now',
    btnLoading: 'Checking...',
    resultFound: 'Account Found!',
    footer: 'Built with ❤️',
    errEmpty: 'Please enter User ID and Server ID',
    errServer: 'Failed to connect to server',
    errValidate: 'Failed to validate ID',
    pageTitle: 'Check Mobile Legends Account ID',
  }
};

let currentLang = localStorage.getItem('lang') || 'id';

function t(key) {
  return translations[currentLang][key] || translations['id'][key] || key;
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.title = t('pageTitle');

  // Update all data-i18n elements
  $('[data-i18n]').each(function() {
    const key = $(this).data('i18n');
    $(this).html(t(key));
  });

  // Update all data-i18n-placeholder elements
  $('[data-i18n-placeholder]').each(function() {
    const key = $(this).data('i18n-placeholder');
    $(this).attr('placeholder', t(key));
  });

  // Update language toggle UI
  const flags = { id: '🇮🇩', en: '🇬🇧' };
  $('#lang-flag').text(flags[lang]);
  $('#lang-code').text(lang.toUpperCase());

  // Mark active option
  $('.lang-option').removeClass('active');
  $(`.lang-option[data-lang="${lang}"]`).addClass('active');
}

// Initialize Lucide icons
lucide.createIcons();

// Set current year
$('#current-year').text(new Date().getFullYear());

// ===== FLOATING PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  const colors = [
    'rgba(99, 102, 241, 0.3)',
    'rgba(129, 140, 248, 0.2)',
    'rgba(52, 211, 153, 0.15)',
    'rgba(167, 139, 250, 0.2)',
  ];

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(particle);
  }
}
createParticles();

// ===== FETCH GITHUB STARS =====
$.ajax({
  url: 'https://api.github.com/repos/cabrata/check-id-mlbb',
  type: 'GET',
  dataType: 'json',
  success: function(repo) {
    if (repo && typeof repo.stargazers_count !== 'undefined') {
      $('#github-stars').text(repo.stargazers_count);
    }
  },
  error: function() {
    $('#github-stars').text('0');
  }
});

// ===== LANGUAGE TOGGLE =====
$('#lang-toggle').on('click', function(e) {
  e.stopPropagation();
  $('#lang-dropdown').toggleClass('open');
});

$('.lang-option').on('click', function() {
  const lang = $(this).data('lang');
  applyLanguage(lang);
  $('#lang-dropdown').removeClass('open');
});

// Close dropdown on outside click
$(document).on('click', function() {
  $('#lang-dropdown').removeClass('open');
});

// Apply saved language on load
applyLanguage(currentLang);

// ===== FADE IN ANIMATIONS =====
setTimeout(function() {
  $('#lang-toggle-wrapper').addClass('active');
  $('#github-badge').addClass('active');
  setTimeout(function() {
    $('#header').addClass('active');
    setTimeout(function() {
      $('#card-container').addClass('active');
    }, 120);
  }, 100);
}, 150);

// ===== FORM SUBMISSION =====
$('#validation-form').on('submit', function(e) {
  e.preventDefault();

  const gameId = $('#gameId').val();
  const serverId = $('#serverId').val();

  if (!gameId || !serverId) {
    showError(t('errEmpty'));
    return;
  }

  // Show loading state
  const originalButtonText = $('#submit-button').html();
  $('#submit-button').html('<i data-lucide="loader-2" class="icon-sm spinner"></i><span>' + t('btnLoading') + '</span>');
  $('#submit-button').prop('disabled', true);
  lucide.createIcons();

  // Hide previous results/errors
  $('#error-container').addClass('hidden');
  $('#result-container').addClass('hidden');

  // Make AJAX call
  $.ajax({
    url: '/api/validasi',
    type: 'GET',
    data: {
      id: gameId,
      serverid: serverId
    },
    dataType: 'json',
    success: function(data) {
      if (data.status === 'success') {
        showResult(data.result);
      } else {
        showError(data.message || t('errValidate'));
      }
    },
    error: function(xhr) {
      let errorMessage = t('errServer');
      try {
        const response = JSON.parse(xhr.responseText);
        if (response && response.message) {
          errorMessage = response.message;
        }
      } catch (e) {}
      showError(errorMessage);
    },
    complete: function() {
      $('#submit-button').html(originalButtonText);
      $('#submit-button').prop('disabled', false);
      lucide.createIcons();
    }
  });
});

function showError(message) {
  $('#error-message').text(message);
  $('#error-container').removeClass('hidden');

  $('#error-container').css({ opacity: 0, transform: 'translateY(6px)' });
  setTimeout(function() {
    $('#error-container').css({ opacity: 1, transform: 'translateY(0)', transition: 'all 0.3s ease' });
  }, 10);
}

function showResult(result) {
  $('#result-nickname').text(result.nickname);
  $('#result-country').text(result.country);
  $('[data-i18n="resultFound"]').html(t('resultFound'));
  $('#result-container').removeClass('hidden');
  lucide.createIcons();

  $('#result-container').css({ opacity: 0, transform: 'translateY(6px)' });
  setTimeout(function() {
    $('#result-container').css({ opacity: 1, transform: 'translateY(0)', transition: 'all 0.3s ease' });
  }, 10);
}