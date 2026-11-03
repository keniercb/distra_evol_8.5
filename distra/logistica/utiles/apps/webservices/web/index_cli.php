<?php
// https://github.com/lcobucci/jwt
define('SERVER_URL', 'http://localhost/silexrest/web/index.php/');

function httpPost($url, $data = [], $headers = []) {
    $options = [
        'http' => [
            'method'  => 'POST',
            'header'  => array_merge(['Content-type: application/x-www-form-urlencoded'], $headers),
            'content' => http_build_query($data),
        ],
    ];
    $context  = stream_context_create($options);
    return file_get_contents($url, false, $context);
}

$url = SERVER_URL . 'users/login';
$response = httpPost($url, ['username' => 'admin', 'password' => 'p4ssw0rd']);
$response = json_decode($response);
print_r($url);die;
$url = SERVER_URL . 'users/admin-password';
echo httpPost($url, [], ["Authorization: Bearer <{$response->token}>",]);