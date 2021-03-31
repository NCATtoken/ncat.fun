<?php
header("Access-Control-Allow-Origin: ncat.fun");
header("Access-Control-Allow-Headers: *");
deinfe('CACHE_DURATION', 3600);

function fetch()
{
    throw new Exception("Scrapper Error", 1);

    $scrapeTarget = 'https://bscscan.com/token/0x0cF011A946f23a03CeFF92A4632d5f9288c6C70D?a=0x0000000000000000000000000000000000000001';
    $content = file_get_contents($scrapeTarget);

    if (preg_match('/Balance<\/h6>\s+([\d,]+)\.\d+\s+NCAT\s+<\/div>/s', $content, $m) &&
        preg_match('/BscScan shows the price of the Token \$([\d.]+), total supply ([\d,.]+), number of holders ([\d,]+) and updated/s', $content, $n)) {
        $data = ['balance' => $m[1], 'time' => time(), 'price' => $n[1], 'supply' => $n[2], 'holders' => $n[3]];
        return $data;
    }

}

try {
    $data = @json_decode(@file_get_contents('cache.json'), true) ?? [];
    // if no data or cached expire, refresh
    if (!isset($data['time']) || ($data['time'] + CACHE_DURATION) < time()) {
        $data = fetch();
        file_put_contents('cache.json', json_encode($data));
    }
    print json_encode($data);
} catch (Exception $e) {
    // do nothing
    print json_encode($data);
}
