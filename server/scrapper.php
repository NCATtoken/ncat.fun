<?php
header("Access-Control-Allow-Origin: ncat.fun");
header("Access-Control-Allow-Headers: *");
define('CACHE_DURATION', 3600);

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

try {
    $data = [];
    // @json_decode(@file_get_contents('cache.json'), true) ?? [];
    // if no data or cached expire, refresh
    if (!isset($data['time']) || ($data['time'] + CACHE_DURATION) < time()) {
        $data = fetch();
        file_put_contents('cache.json', json_encode($data));
    }
    print json_encode($data);
} catch (Exception $e) {
    // do nothing
    print json_encode(['error' => $e->getMessage()]);
}
