/**
 * PR.WEB — Universal Form Handler
 * Підключіть цей файл на всіх сторінках: <script src="/form-script.js"></script>
 * Форми відправляються на /send-form.php (PHP) або FormSubmit (fallback)
 */

(function() {
  'use strict';

  // Config
  var PHP_ENDPOINT = '/send-form.php';
  var FALLBACK_EMAIL = 'seo@prweb.pro';

  // Messages (Ukrainian)
  var MSG = {
    sending: 'Відправляємо...',
    success: 'Дякуємо! Ми зв\'яжемось з вами найближчим часом.',
    error: 'Помилка відправки. Напишіть напряму: seo@prweb.pro',
    required: 'Будь ласка, заповніть обов\'язкові поля'
  };

  function showMsg(el, text, isError) {
    if (!el) return;
    el.style.display = 'block';
    el.style.color = isError ? '#e74c3c' : '#27ae60';
    el.textContent = text;
  }

  function setBtn(btn, text, disabled) {
    if (!btn) return;
    btn.textContent = text;
    btn.disabled = disabled;
    btn.style.opacity = disabled ? '0.7' : '1';
  }

  async function submitForm(formEl, btnEl, msgEl) {
    var formData = new FormData(formEl);
    var data = {
      name:   formEl.querySelector('[name="name"]')?.value || '',
      site:   formEl.querySelector('[name="site"]')?.value || '',
      niche:  formEl.querySelector('[name="niche"]')?.value || formEl.querySelector('[name="message"]')?.value || '',
      phone:  formEl.querySelector('[name="phone"]')?.value || '',
      source: formEl.dataset.source || document.title,
      page:   window.location.href
    };

    // Try PHP handler first
    try {
      var res = await fetch(PHP_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      // If PHP not available (404/500) — try FormSubmit
      if (!res.ok && res.status >= 400) {
        throw new Error('PHP unavailable: ' + res.status);
      }

      var json = await res.json();
      if (json.success) {
        showMsg(msgEl, MSG.success, false);
        formEl.reset();
        // GA4 event
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submit', {
            event_category: 'lead',
            event_label: data.source,
            page_location: data.page
          });
        }
        return;
      }
      throw new Error(json.message || 'Unknown error');

    } catch (phpErr) {
      // Fallback: FormSubmit.co
      try {
        var fbRes = await fetch('https://formsubmit.co/ajax/' + FALLBACK_EMAIL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: 'Нова заявка з prweb.pro — ' + data.source,
            _template: 'table',
            _captcha: 'false',
            ...data
          })
        });
        var fbJson = await fbRes.json();
        if (fbJson.success === 'true' || fbJson.success === true) {
          showMsg(msgEl, MSG.success, false);
          formEl.reset();
          if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', { event_category: 'lead', event_label: data.source });
          }
          return;
        }
        throw new Error('FormSubmit failed');
      } catch (fbErr) {
        showMsg(msgEl, MSG.error, true);
      }
    }
  }

  function initForm(formEl) {
    if (!formEl || formEl._prwebInit) return;
    formEl._prwebInit = true;

    // Find or create btn/msg
    var btnEl = formEl.querySelector('[type="submit"]');
    var msgEl = formEl.querySelector('[data-msg]') || formEl.querySelector('[id$="-msg"]');

    // Create msg div if missing
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.style.cssText = 'display:none;margin-top:10px;font-size:14px;text-align:center;padding:8px;border-radius:8px';
      formEl.appendChild(msgEl);
    }

    var originalBtnText = btnEl ? btnEl.textContent : 'Відправити';

    formEl.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Simple validation
      var name = formEl.querySelector('[name="name"]');
      if (name && !name.value.trim()) {
        showMsg(msgEl, MSG.required, true);
        name.focus();
        return;
      }

      setBtn(btnEl, MSG.sending, true);
      msgEl.style.display = 'none';

      await submitForm(formEl, btnEl, msgEl);

      setBtn(btnEl, originalBtnText, false);
    });
  }

  // Init all forms on page
  function initAll() {
    // Named forms
    var forms = document.querySelectorAll(
      '#prweb-form, #prweb-case-form, [data-prweb-form], form[action="#contact-form"]'
    );
    forms.forEach(initForm);

    // Also init any form with submit button containing "консультацію" or "аудит"
    document.querySelectorAll('form').forEach(function(f) {
      var btn = f.querySelector('[type="submit"]');
      if (btn && /консультацію|аудит|відправити|заявку/i.test(btn.textContent)) {
        initForm(f);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Expose for manual use
  window.PRWebForm = { init: initForm, initAll: initAll };

})();
