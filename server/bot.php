<?php

// add this bot into the telegram group
// run this in interval using schedular
// chatid get from from https://api.telegram.org/bot1721335070:AAGXR9p__JqW3aTbXiNCAjZOowUK7YAUx9w/getUpdates

$botToken = '1721335070:AAGXR9p__JqW3aTbXiNCAjZOowUK7YAUx9w';
$website = "https://api.telegram.org/bot" . $botToken;
$chatId = 23975436; /// <<<< EDIT THIS to the actual chat Id

$data = @json_decode(@file_get_contents(__DIR__ . '/cache.json'), true) ?? [];
// no data
if (!isset($data['time'])) {
    exit;
}

$params = [
    'chat_id' => $chatId,
    'text' =>
    "Circulating Supply: {$data['supply']} NCAT\n" .
    "Holders: {$data['holders']} Cats\n" .
    "Market Cap: \${$data['marketcap']}\n" .
    "1 NCAT = \${$data['price']}\n" .
    "Total NCAT Burned: \${$data['burn']} NCAT ({$data['percentage']}%)\n" .
    "⏰ Update on: " . date('r', $data['time']),
];
$ch = curl_init($website . '/sendMessage');
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, ($params));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$result = curl_exec($ch);
curl_close($ch);
