<?php

function fetch()
{

    $scrapeTarget = 'https://bscscan.com/token/0x0cF011A946f23a03CeFF92A4632d5f9288c6C70D?a=0x0000000000000000000000000000000000000001';
    $content = file_get_contents($scrapeTarget);

    if (preg_match('/Balance<\/h6>\s+([\d,]+)\.\d+\s+NCAT\s+<\/div>/s', $content, $m) &&
        preg_match('/BscScan shows the price of the Token \$([\d.]+), total supply ([\d,.]+), number of holders ([\d,]+) and updated/s', $content, $n) &&
        preg_match('/id="pricebutton".*>\s\$([\d,]+)\.\d+\s+<\/span>/s', $content, $p)) {
        $burn = intval(str_replace(',', '', $m[1]));
        $total = intval(str_replace(',', '', $n[2]));
        $holders = intval(str_replace(',', '', $n[3]));
        $supply = $total - $burn;
        $marketcap = intval(str_replace(',', '', $p[1]));
        $data = [
            'burn' => number_format($burn),
            'time' => time(),
            'price' => number_format($marketcap / $supply, 10),
            'supply' => number_format($supply),
            'holders' => number_format($holders),
            'percentage' => number_format($burn / $total * 100, 2),
            'marketcap' => number_format($marketcap),
        ];
        return $data;
    }

    throw new Exception("Scrapper Error", 1);
}

// add this bot into the telegram group
// run this in interval using schedular
// chatid get from from https://api.telegram.org/bot1721335070:AAGXR9p__JqW3aTbXiNCAjZOowUK7YAUx9w/getUpdates

$botToken = '1721335070:AAGXR9p__JqW3aTbXiNCAjZOowUK7YAUx9w';
$website = "https://api.telegram.org/bot" . $botToken;
$chatId = -1001191500499; /// <<<< EDIT THIS to the actual chat Id

// @json_decode(@file_get_contents(__DIR__ . '/cache.json'), true) ?? [];
$data = fetch();
// no data
if (!isset($data['time'])) {
    exit;
}

$params = [
    'chat_id' => $chatId,
    'text' =>
    "🌏 Supply: {$data['supply']} NCAT\n" .
    "💎🤘 Holders: {$data['holders']}\n" .
    "💰 MarketCap: \${$data['marketcap']}\n" .
    "💵 Price: \${$data['price']}\n" .
    "🔥 Burned: {$data['burn']} NCAT ({$data['percentage']}%)\n" .
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
