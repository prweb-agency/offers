# Інструкція по деплою prweb.pro на хостинг

## Структура файлів на хостингу

```
public_html/
├── .htaccess              ← з файлу htaccess.txt
├── send-form.php          ← PHP обробник форм
├── form-script.js         ← Universal JS форм
├── index.html             ← Головна сторінка (з GitHub)
├── 404.html               ← Сторінка помилки
│
├── services/
│   ├── seo-delivery-sushi.html
│   ├── seo-local-business.html
│   ├── seo-promotion.html
│   ├── seo-shop.html
│   ├── technical-audit.html
│   ├── google-ads.html
│   ├── dev-sites.html
│   └── admin.html
│
├── services/
│   ├── stomatology.html
│   ├── clinic.html
│   ├── beauty-salon.html
│   ├── restaurant.html
│   ├── food-delivery.html
│   ├── auto-service.html
│   ├── construction.html
│   └── cleaning.html
│
├── cases/
│   ├── roll-club.html     ← Seo-Case-Roll-Club.html
│   └── index.html         ← page-cases.html
│
├── blog/
│   ├── index.html         ← page-blog.html
│   ├── what-is-local-seo.html
│   ├── google-maps-top3.html
│   ├── seo-for-ukraine-business-in-poland.html
│   ├── scale-local-business-by-cities.html
│   ├── seo-ai-chatgpt-2026.html
│   └── how-to-read-seo-report.html
│
├── about.html             ← page-about.html
├── contacts.html          ← page-contacts.html
└── services.html          ← page-services.html
```

## Крок 1 — Підготовка файлів

1. Завантажте всі HTML з GitHub: https://github.com/prweb-agency/offers
2. Перейменуйте файли згідно структури вище
3. Додайте `send-form.php` і `form-script.js` в корінь
4. Перейменуйте `htaccess.txt` → `.htaccess`

## Крок 2 — Підключення form-script.js до всіх сторінок

Перед закриваючим `</body>` на КОЖНІЙ сторінці додайте:

```html
<script src="/form-script.js"></script>
```

Або якщо сторінка в підпапці (`/services/`):

```html
<script src="../../form-script.js"></script>
```

## Крок 3 — Активація FormSubmit (якщо PHP не працює)

1. Залийте сайт
2. Заповніть і відправте форму вперше
3. На seo@prweb.pro прийде лист від FormSubmit
4. Натисніть "Activate Form"
5. Готово — форми працюють

## Крок 4 — Перевірка PHP

Створіть файл `test-mail.php`:

```php
<?php
$result = mail('seo@prweb.pro', 'Test', 'Test from prweb.pro', 'From: test@prweb.pro');
echo $result ? 'Mail works!' : 'Mail FAILED — use FormSubmit';
```

Відкрийте `https://prweb.pro/test-mail.php` — якщо "Mail works!" — PHP спрацює.
Якщо "Mail FAILED" — форми автоматично переключаться на FormSubmit.

## Крок 5 — Налаштування DNS

| Тип | Хост | Значення |
|-----|------|---------|
| A   | @    | IP вашого хостингу |
| A   | www  | IP вашого хостингу |
| MX  | @    | Поштовий сервер (якщо є) |

## Поширені хостинги України

### Hostpro.ua
- PHP mail() підтримується
- Залийте через FTP або cPanel File Manager

### Mirohost.net
- PHP mail() підтримується
- ISPmanager панель

### Timeweb.ua
- PHP mail() підтримується
- cPanel панель

## Перевірка форм після деплою

1. Відкрийте https://prweb.pro/cases/roll-club
2. Заповніть форму тестовими даними
3. Перевірте seo@prweb.pro — лист має прийти за 1-2 хв
4. Перевірте GA4 → Events → form_submit

## Якщо листи не приходять

1. Перевірте папку Spam
2. Запустіть test-mail.php
3. Якщо PHP не працює — form-script.js автоматично використає FormSubmit
4. Активуйте FormSubmit (крок 3)
