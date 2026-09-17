
    var DEFAULT_REVIEWS = [
      { name: "Michael R.", location: "Round Rock, TX", initials: "MR", color: "#2563eb", text: "Shingles were replaced in two days. The crew cleaned up perfectly and the new roof looks incredible. Worth every penny." },
      { name: "Sarah K.", location: "Cedar Park, TX", initials: "SK", color: "#1d4ed8", text: "Found a leak no one else could fix in under an hour. Absolute lifesavers during the storm — they answered at 2 AM." },
      { name: "James T.", location: "Pflugerville, TX", initials: "JT", color: "#0f172a", text: "The insurance process was so smooth. They handled everything with our adjuster and we paid zero out of pocket. 10/10." }
    ];

    var SERVICE_IMAGES = [
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80", label: "Roof Replacement" },
      { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80", label: "Roof Repair" },
      { url: "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?auto=format&fit=crop&w=900&q=80", label: "Storm Damage" }
    ];

    var CONFIG = {
      company_name: "Apex Roofing",
      phone_number: "(555) 839-2041",
      city_state: "Austin, TX",
      services_list: "Roof Replacement, Leak Repair, Storm Damage",
      logo_url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=120&q=80",
      tagline: "Licensed, insured, and family-owned. With a 4.9-star rating, 500+ completed roofs, and a lifetime workmanship warranty — we make protecting your home effortless.",
      rating: "4.9",
      review_count: "2,400+",
      stats_years: "15+",
      stats_projects: "500+",
      emergency_hours: "24/7",
      form_endpoint: "",
      reviews: DEFAULT_REVIEWS
    };

    function normalizePhoneForTel(phone) {
      var digits = phone.replace(/\D/g, '');
      return '+1' + digits;
    }

    function formatPhone(val) {
      var d = val.replace(/\D/g, '').slice(0, 10);
      if (!d) return '';
      if (d.length < 4) return '(' + d;
      if (d.length < 7) return '(' + d.slice(0, 3) + ') ' + d.slice(3);
      return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
    }

    function getServices() {
      var arr = (CONFIG.services_list || '').split(',').map(function(s) { return s.trim(); }).filter(Boolean);
      return arr.length ? arr.slice(0, 6) : ['Roof Replacement', 'Leak Repair', 'Storm Damage'];
    }

    function serviceBlurb(name) {
      var n = name.toLowerCase();
      if (n.indexOf('replace') !== -1 || n.indexOf('install') !== -1) return "New architectural shingle systems installed with proper ventilation and manufacturer-certified crews.";
      if (n.indexOf('repair') !== -1 || n.indexOf('leak') !== -1) return "Fast, lasting fixes for leaks and damaged sections — many repaired same-day.";
      if (n.indexOf('storm') !== -1 || n.indexOf('damage') !== -1) return "Complete storm restoration, from inspection to insurance-approved replacement.";
      return "Professional roofing done right — quality materials, clean crews, and on-time finishes.";
    }

    function applyQueryOverrides() {
      if (!window.location.search) return;
      var params = new URLSearchParams(window.location.search);
      var aliases = { city: 'city_state', phone: 'phone_number', name: 'company_name', services: 'services_list', logo: 'logo_url', stars: 'rating', reviews: 'review_count' };
      Object.keys(aliases).forEach(function(k) {
        var v = params.get(k);
        if (v) CONFIG[aliases[k]] = decodeURIComponent(v);
      });
      Object.keys(CONFIG).forEach(function(k) {
        var v = params.get(k);
        if (v) CONFIG[k] = decodeURIComponent(v);
      });
    }

    function applyConfig(cfg) {
      document.querySelectorAll('[data-field]').forEach(function(el) {
        var key = el.getAttribute('data-field');
        if (cfg[key] !== undefined && cfg[key] !== '') el.textContent = cfg[key];
      });
      document.querySelectorAll('img[data-field="logo_url"]').forEach(function(img) {
        if (cfg.logo_url) { img.src = cfg.logo_url; img.onerror = function() { this.remove(); }; }
      });
      document.querySelectorAll('[data-field-href="phone_number"]').forEach(function(el) {
        if (cfg.phone_number) el.href = 'tel:' + normalizePhoneForTel(cfg.phone_number);
      });
      document.title = cfg.company_name + ' — Roofing & Repairs in ' + cfg.city_state;
      var yearEl = document.getElementById('footer-year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    }

    function populateServiceSelect(selectId) {
      var sel = document.getElementById(selectId);
      if (!sel) return;
      sel.innerHTML = '<option value="" disabled selected>Select a service...</option>' + getServices().map(function(s) {
        return '<option value="' + encodeURIComponent(s) + '">' + s.replace(/</g, '&lt;') + '</option>';
      }).join('');
    }

    function renderServiceCards() {
      var grid = document.getElementById('services-grid');
      if (!grid) return;
      var services = getServices();
      services.forEach(function(s, i) {
        var img = SERVICE_IMAGES[i % SERVICE_IMAGES.length];
        var card = document.createElement('article');
        card.className = 'chip-card bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm';

        var media = document.createElement('div');
        media.className = 'relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-900 to-slate-900';
        var photo = document.createElement('img');
        photo.src = img.url;
        photo.alt = s;
        photo.loading = 'lazy';
        photo.decoding = 'async';
        photo.className = 'absolute inset-0 w-full h-full object-cover transition duration-300';
        photo.onerror = function() { this.remove(); };
        var chip = document.createElement('span');
        chip.className = 'absolute top-3.5 left-3.5 bg-white/95 backdrop-blur text-slate-900 text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full shadow-sm';
        chip.textContent = '0' + (i + 1);
        media.appendChild(photo);
        media.appendChild(chip);

        var body = document.createElement('div');
        body.className = 'p-6';
        var title = document.createElement('h3');
        title.className = 'font-display text-base font-bold text-slate-900';
        title.textContent = s;
        var desc = document.createElement('p');
        desc.className = 'text-sm text-slate-500 mt-2 leading-relaxed';
        desc.textContent = serviceBlurb(s);
        var link = document.createElement('a');
        link.href = '#quote';
        link.className = 'inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition mt-4';
        link.textContent = 'Get Free Quote';
        link.innerHTML = link.textContent + ' <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>';

        body.appendChild(title);
        body.appendChild(desc);
        body.appendChild(link);
        card.appendChild(media);
        card.appendChild(body);
        grid.appendChild(card);
      });
    }

    function starSvg() {
      return '<svg class="h-4 w-4 shrink-0" fill="currentColor" style="color:#f59e0b" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>';
    }

    function renderReviews() {
      var track = document.getElementById('reviews-track');
      if (!track) return;
      var reviews = Array.isArray(CONFIG.reviews) && CONFIG.reviews.length ? CONFIG.reviews : DEFAULT_REVIEWS;
      track.innerHTML = '';
      reviews.forEach(function(r) {
        var article = document.createElement('article');
        article.className = 'snap-center shrink-0 w-[85%] sm:w-[380px] bg-white rounded-3xl p-7 border border-slate-100 shadow-sm';

        var head = document.createElement('div');
        head.className = 'flex items-center justify-between mb-4';
        var stars = document.createElement('div');
        stars.className = 'flex gap-0.5';
        stars.innerHTML = starSvg() + starSvg() + starSvg() + starSvg() + starSvg();
        var chip = document.createElement('span');
        chip.className = 'text-[11px] sm:text-xs font-bold tracking-tight bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm';
        chip.innerHTML = '<span style="color:#4285F4">G</span><span style="color:#EA4335">o</span><span style="color:#FBBC05">o</span><span style="color:#4285F4">g</span><span style="color:#34A853">l</span><span style="color:#EA4335">e</span>';
        head.appendChild(stars);
        head.appendChild(chip);

        var quote = document.createElement('p');
        quote.className = 'text-sm text-slate-700 leading-relaxed';
        quote.textContent = '"' + r.text + '"';

        var foot = document.createElement('div');
        foot.className = 'flex items-center gap-3 mt-5';
        var avatar = document.createElement('div');
        avatar.className = 'w-10 h-10 rounded-full text-white flex items-center justify-center font-bold shrink-0';
        avatar.style.backgroundColor = r.color || '#2563eb';
        avatar.textContent = r.initials || 'RO';
        var meta = document.createElement('div');
        var nameEl = document.createElement('p');
        nameEl.className = 'font-semibold text-slate-900 text-sm';
        nameEl.textContent = r.name || 'Verified Customer';
        var locEl = document.createElement('p');
        locEl.className = 'text-xs text-slate-400';
        locEl.textContent = r.location || '';
        meta.appendChild(nameEl);
        meta.appendChild(locEl);
        foot.appendChild(avatar);
        foot.appendChild(meta);

        article.appendChild(head);
        article.appendChild(quote);
        article.appendChild(foot);
        track.appendChild(article);
      });
    }

    function initCompare() {
      var wrapper = document.querySelector('.compare');
      if (!wrapper) return;
      var range = wrapper.querySelector('.compare-range');
      function update(val) { wrapper.style.setProperty('--pos', val + '%'); }
      update(50);
      range.addEventListener('input', function(e) { update(e.target.value); });
    }

    function initReveal() {
      var els = document.querySelectorAll('.reveal');
      if (!('IntersectionObserver' in window)) {
        els.forEach(function(el) { el.classList.add('revealed'); });
        return;
      }
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(en) {
          if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      els.forEach(function(el) { io.observe(el); });
      window.setTimeout(function() {
        els.forEach(function(el) {
          if (!el.classList.contains('revealed') && el.getBoundingClientRect().top < window.innerHeight * 0.9) el.classList.add('revealed');
        });
      }, 800);
    }

    function initScrollSpy() {
      var links = document.querySelectorAll('.nav-link');
      var map = {};
      links.forEach(function(l) {
        var href = l.getAttribute('href');
        if (href && href.charAt(0) === '#') map[href.slice(1)] = l;
      });
      var ids = Object.keys(map);
      if (!ids.length || !('IntersectionObserver' in window)) return;
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(en) {
          if (en.isIntersecting) {
            links.forEach(function(l) { l.classList.remove('nav-active'); });
            if (map[en.target.id]) map[en.target.id].classList.add('nav-active');
          }
        });
      }, { rootMargin: '-40% 0px -50% 0px' });
      ids.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) io.observe(el);
      });
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      var form = document.getElementById('quote-form');
      var success = document.getElementById('form-success');
      var phoneInput = document.getElementById('form-phone');
      var phoneError = document.getElementById('phone-error');
      var phoneDigits = phoneInput.value.replace(/\D/g, '');

      if (phoneDigits.length !== 10) {
        phoneError.classList.remove('hidden');
        phoneInput.classList.add('border-red-400', 'ring-1', 'ring-red-300');
        phoneInput.focus();
        return;
      }
      phoneError.classList.add('hidden');
      phoneInput.classList.remove('border-red-400', 'ring-1', 'ring-red-300');

      var payload = {
        name: document.getElementById('form-name').value.trim(),
        phone: phoneInput.value.trim(),
        service: document.getElementById('form-service').value,
        company: CONFIG.company_name,
        city: CONFIG.city_state
      };

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending...';

      function finish() {
        form.classList.add('hidden');
        success.classList.remove('hidden');
        console.log('Quote submitted:', payload);
      }

      if (CONFIG.form_endpoint) {
        fetch(CONFIG.form_endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(function() {}).finally(finish);
      } else {
        window.setTimeout(finish, 900);
      }
    }

    document.addEventListener('DOMContentLoaded', function() {
      applyQueryOverrides();
      applyConfig(CONFIG);
      renderServiceCards();
      renderReviews();
      populateServiceSelect('form-service');
      initCompare();
      initReveal();
      initScrollSpy();

      var phoneInput = document.getElementById('form-phone');
      if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
          e.target.value = formatPhone(e.target.value);
        });
      }
    });
  