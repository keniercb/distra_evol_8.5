<?php
return array(
    'grant_type' =>array('client_credentials','password','refresh_token'),
    'urlApi'=>'https://api.enzona.net',
    'consumerKey'=>'',
    'consumerSecret'=>'',
    'urlQrAPI'=>'/qr/v1.0.0/qr/merchant',
    'urlQrAPITM'=>'/transfermovil/v1.0.0/payments',
    'urlTokenAPI'=>'/token',
    'urlPaymentAPI'=>'/payment/v1.0.0',
    'scope'=>'enzona_business_payment enzona_business_qr',
    'urlNotify'=>'https://distra-enz.sasa.co.cu/index.php/merchantnotify/',
    'urlReturn'=>'https://distra-enz.sasa.co.cu/index.php/merchantreturn/',
    'base64IMG'=>"",
    'comercios' =>array(
       'tv13y84'=>[
           'consumerKey'=>'ymow5Rd3o8BtRxEepnkIM1sRetYa',
           'consumerSecret'=>'2B_0L5BhAOy_3Hlg8296qX1LT8Ia',
       ],
       'provari'=>[
            'consumerKey'=>'izrei8omUU75rEZ3oH3Za5B76qUa',
            'consumerSecret'=>'fDEfY3LzrOKLxuOpH_CqmQXajEwa',
        ],
    ),
);