<?php

// PARAMETERS
$app['db.options'] = array(
    'driver' => 'pdo_pgsql',//'pdo_mysql';
    "host" => "10.12.170.138",
    "port" => '5432',
    "dbname" => "distra-beta",
    "user" => "zeolides",//logistica   ,zeolides
    "password" => 'zeolides*2012.,'//logistica ,zeolides*2012.,

);
//$app['database'] = Doctrine_Manager::getInstance()->connection("pgsql://zeolides:zeolides*2012.,@10.12.170.100:5432/distra-beta", 'wms');

// SECURITY
$app['auth'] = false;
$app['serverName'] = "http://localhost";
// Key for signing the JWT's, I suggest generate it with base64_encode(openssl_random_pseudo_bytes(64))
$app['JWT_KEY_SECRECT'] = '1ed4b7cd09c0266bfcb67bea262e768e';//md5= 1ed4b7cd09c0266bfcb67bea262e768e ; base64= a0xAdjMkM0NyM1RAKi4s'; mensaje = kL@v3$3Cr3T@*.,    ;
$app['JWT_HEADER'] = "JWT";
$app['NAMESPACE'] = 'Lcobucci\JWT\Signer\Hmac';
$app['JWT_SIGNER_ALGORITHM'] = 'Sha512'; //Sha512,Sha384,Sha256
$app['JWT_ALGORITHM'] = "HS512";
$app['JWT_ISSUER'] = "JWT Distra";
$app['JWT_AUDIENCE'] = "JWT Distra";

$app['JWT_EXP_TIME'] = 10;
$app['JWT_DEFAULT_MSG'] = '9706c81e54ca4d86bb7efb7721b0ae1b';//md5= 9706c81e54ca4d86bb7efb7721b0ae1b ; base64= c2VjdXJpdHkyMDE2Ki4'; mensaje = security2016*.    ;

$app['JWT_CERT'] = '/config/fixtures/google.crt';//CERTIFICATE
$app['JWT_GOOGLE'] = '/config/fixtures/google.jwt';//Token
$app['JWT_PRIVATE_KEY'] = '/config/fixtures/private_key.pem';//private Key
$app['JWT_PUBLIC_KEY'] = '/config/fixtures/public_key.pem';//public Key
