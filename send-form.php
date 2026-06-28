<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://prweb.pro');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

// Sanitize
$name    = htmlspecialchars(strip_tags($input['name'] ?? ''));
$site    = htmlspecialchars(strip_tags($input['site'] ?? ''));
$niche   = htmlspecialchars(strip_tags($input['niche'] ?? ''));
$phone   = htmlspecialchars(strip_tags($input['phone'] ?? ''));
$source  = htmlspecialchars(strip_tags($input['source'] ?? 'сайт'));
$page    = htmlspecialchars(strip_tags($input['page'] ?? ''));

// Validation
if (empty($name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => "Вкажіть ваше ім'я"]);
    exit;
}

// Email config
$to      = 'seo@prweb.pro';
$subject = "=?UTF-8?B?" . base64_encode("Нова заявка з prweb.pro — {$source}") . "?=";
$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: =?UTF-8?B?' . base64_encode('PR.WEB сайт') . '?= <noreply@prweb.pro>',
    'Reply-To: ' . $to,
    'X-Mailer: PHP/' . phpversion(),
]);

$body = "
<!DOCTYPE html>
<html>
<body style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px'>
  <div style='background:#202020;padding:24px;border-radius:12px;margin-bottom:20px'>
    <h2 style='color:#fff;margin:0;font-size:20px'>
      Нова заявка з <span style='color:#F6364D'>PR.WEB</span>
    </h2>
    <p style='color:#aaa;margin:8px 0 0;font-size:14px'>Джерело: {$source}</p>
  </div>
  <table style='width:100%;border-collapse:collapse'>
    <tr style='background:#f9f9f9'>
      <td style='padding:12px 16px;font-weight:bold;width:140px;border:1px solid #eee'>Ім'я</td>
      <td style='padding:12px 16px;border:1px solid #eee'>{$name}</td>
    </tr>
    <tr>
      <td style='padding:12px 16px;font-weight:bold;border:1px solid #eee'>Сайт</td>
      <td style='padding:12px 16px;border:1px solid #eee'>" . ($site ?: '—') . "</td>
    </tr>
    <tr style='background:#f9f9f9'>
      <td style='padding:12px 16px;font-weight:bold;border:1px solid #eee'>Ніша / Місто</td>
      <td style='padding:12px 16px;border:1px solid #eee'>" . ($niche ?: '—') . "</td>
    </tr>
    <tr>
      <td style='padding:12px 16px;font-weight:bold;border:1px solid #eee'>Телефон / TG</td>
      <td style='padding:12px 16px;border:1px solid #eee'>" . ($phone ?: '—') . "</td>
    </tr>
    <tr style='background:#f9f9f9'>
      <td style='padding:12px 16px;font-weight:bold;border:1px solid #eee'>Сторінка</td>
      <td style='padding:12px 16px;border:1px solid #eee'>" . ($page ?: '—') . "</td>
    </tr>
  </table>
  <div style='margin-top:24px;padding:16px;background:#fff5f5;border-left:4px solid #F6364D;border-radius:4px'>
    <p style='margin:0;font-size:14px;color:#555'>
      Відповісти: <a href='mailto:seo@prweb.pro' style='color:#F6364D'>seo@prweb.pro</a> або 
      <a href='https://t.me/verdiev' style='color:#F6364D'>@verdiev</a>
    </p>
  </div>
</body>
</html>";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'OK']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mail error']);
}
