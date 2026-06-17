(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Tahun otomatis
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu
  const menuBtn = $('.menu-btn');
  const mobileNav = $('.mobile-nav');

  if (menuBtn && mobileNav) {
    const setExpanded = (val) => {
      menuBtn.setAttribute('aria-expanded', String(val));
      if (val) mobileNav.hidden = false;
      else mobileNav.hidden = true;
    };

    // default hidden (HTML sets hidden)
    setExpanded(false);

    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      setExpanded(!expanded);
    });

    $$('.mobile-nav a', mobileNav).forEach((a) => {
      a.addEventListener('click', () => setExpanded(false));
    });
  }

  // Scroll behavior for data-scroll links
  $$('a[data-scroll]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || !id.startsWith('#')) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Modal detail
  const modal = $('#detailModal');
  const backdrop = $('[data-close-modal]');
  const closeBtns = $$('[data-close-modal]');
  const modalImg = $('#modalImg');
  const modalDesc = $('#modalDesc');
  const modalRec = $('#modalRec');
  const modalStart = $('#modalStart');
  const modalWaBtn = $('#modalWaBtn');

  const openModal = ({ img, desc, rec, start, waText }) => {
    if (!modal) return;

    if (modalImg) modalImg.src = img;
    if (modalImg) modalImg.alt = desc || 'Detail produk';
    if (modalDesc) modalDesc.textContent = desc || '';
    if (modalRec) modalRec.textContent = rec || '';
    if (modalStart) modalStart.textContent = start || '';

    // WhatsApp link
    // TODO: Ganti nomor WhatsApp di bawah
    const phone = '6283170301628';
    if (modalWaBtn) {
      const text = waText || desc || 'Halo, saya ingin tanya produk bingkai bunga.';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      modalWaBtn.href = url;
    }

    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modal) {
    // Open from product cards
    $$('[data-product]').forEach((card) => {
      const btn = $('[data-open-detail]', card);
      if (!btn) return;

      btn.addEventListener('click', () => {
        const imgEl = $('img', card);
        const img = imgEl ? imgEl.getAttribute('src') : '';
        const title = $('h3', card)?.textContent?.trim() || 'Produk';
        const badge = $('.product-badge', card)?.textContent?.trim() || '';
        const price = $('.price', card)?.textContent?.trim() || '';

        const desc = `Bingkai bunga: ${title}. ${badge ? `Ciri: ${badge}. ` : ''}Penataan rapi dan tampil elegan untuk momen spesial.`;
        const rec = 'Wisuda • Anniversary • Kelahiran';
        const start = price ? price.replace('Mulai', 'Mulai') : 'Mulai ...';
        const waText = `Halo! Saya tertarik dengan ${title}. Mohon info ukuran, warna, dan estimasi harga. Terima kasih.`;

        openModal({ img, desc, rec, start, waText });
      });

      // keyboard accessibility
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const isFocused = document.activeElement === card || btn === document.activeElement;
          if (!isFocused) return;
          e.preventDefault();
          btn.click();
        }
      });
    });

    // Close
    closeBtns.forEach((el) => {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Click backdrop
    if (modal && backdrop) {
      modal.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }
  }

  // WA button placeholder
  const waBtn = $('#waBtn');
  if (waBtn) {
    const phone = '6283170301628';
    waBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent('Halo! Saya ingin tanya harga dan rekomendasi bingkai bunga. Terima kasih!')}`;
  }
})();

