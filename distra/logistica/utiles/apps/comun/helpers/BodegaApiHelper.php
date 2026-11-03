<?php

class BodegaApiHelper extends ApiHelper implements ISingletonClass
{

    private static $instance = null;
    private $apiToken;
    private $typeToken;
    private $apiURL;
    private $apiLoginURL;
    private $variablesModel, $docLogModel;
    private $proxy;
    private $proxyAuth;

    private $keyPublic;
    private $keySecret;

    public function __construct()
    {
        $this->docLogModel = new DocumentoLogisticaModel();
        $this->setApiUrl();
        $this->setProxyConfig();
        $this->setKeys();
    }

    private function setKeys() {
        $keyPublicSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'KEY_PUBLIC'";
        $keyPublicValue = LogisticaDoctrineHelper::__init()->getConnection()->execute($keyPublicSql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($keyPublicValue) > 0) {
            $this->keyPublic = substr($keyPublicValue[0]['valor'], 1, -1);
        }

        $keySecretSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'KEY_SECRET'";
        $keySecretValue = LogisticaDoctrineHelper::__init()->getConnection()->execute($keySecretSql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($keySecretValue) > 0) {
            $this->keySecret = substr($keySecretValue[0]['valor'], 1, -1);
        }
    }

    private function setProxyConfig() {
        $this->proxy = false;
        $this->proxyAuth = false;

        $proxySql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'PROXY_TV'";
        $proxyValue = LogisticaDoctrineHelper::__init()->getConnection()->execute($proxySql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($proxyValue) > 0) {
            $this->proxy = str_replace('\'', '', $proxyValue[0]['valor']);
        }

        $proxyAuthSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'PROXY_TV_AUTH'";
        $proxyAuthValue = LogisticaDoctrineHelper::__init()->getConnection()->execute($proxyAuthSql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($proxyAuthValue) > 0) {
            $this->proxyAuth = str_replace('\'', '', $proxyAuthValue[0]['valor']);
        }
    }
    /**
     * @return DistraApiHelper
     */
    public static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new BodegaApiHelper();
        }
        return self::$instance;
    }

    public function execute($url, $data, $header, $post = true, $method = 'POST', $debugInfo = false, $authorization = false)
    {
        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_HEADER => true,
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_URL => $url,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_SSL_VERIFYHOST => 0
        ));

        if ($this->proxy) {
            curl_setopt_array($ch, array(
                CURLOPT_PROXY => $this->proxy
            ));

            if ($this->proxyAuth) {
                curl_setopt_array($ch, array(
                    CURLOPT_PROXYUSERPWD => $this->proxyAuth
                ));
            }
        }

        if ($data) {
            curl_setopt_array($ch, array(
                CURLOPT_POSTFIELDS => $data
            ));
        }

        if ($post !== false && $method === 'POST') {
            curl_setopt_array($ch, array(
                CURLOPT_POST => true
            ));
        }
        if ($method === 'GET') {
            if ($authorization) {
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                    'Authorization: ' . $authorization
                ));
            }
            curl_setopt_array($ch, array(
                CURLOPT_HTTPGET => true
            ));
        }
        if ($method === 'PATCH') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        }
        if ($method === 'PUT') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT'); // Establece el método PUT
        }
        $apiResponse = curl_exec($ch);
        if ($apiResponse === false) {
            die('Request Error:' . curl_error($ch));
        }
        $apiResponseInfo = curl_getinfo($ch);
        if ($debugInfo) {
            print_r($apiResponseInfo);
            die;
        }
        $pos = $apiResponseInfo['header_size'];
        /*stripos($apiResponse, '{');
        //$pos = stripos($apiResponse, '{');
        //$apiResponseHeader = trim(substr($apiResponse, 0, $pos));
        //$apiResponseBody  = $apiResponse;
        */
        $apiResponseBody = substr($apiResponse, $pos);
        curl_close($ch);
        return json_decode($apiResponseBody, true);
    }

    public function setApiUrl()
    {
        $urlLoginSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'APILOGINURL_BV'";
        $urlLoginValue = LogisticaDoctrineHelper::__init()->getConnection()->execute($urlLoginSql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($urlLoginValue) > 0) {
            $this->apiLoginURL = substr($urlLoginValue[0]['valor'], 1, -1);
        }

        $urlSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'APIURL_BV'";
        $urlValue = LogisticaDoctrineHelper::__init()->getConnection()->execute($urlSql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($urlValue) > 0) {
            $this->apiURL = substr($urlValue[0]['valor'], 1, -1);;
        }
    }

    public function setToken($token)
    {
        $this->apiToken = $token;
    }

    public function setTypeToken($type)
    {
        $this->typeToken = $type;
    }

    public function authenticate() {
        $token_url = $this->apiLoginURL . '/oauth2/token';

        $content = http_build_query([
            'grant_type' => 'client_credentials',

        ]);

        $header = array(
            "Content-Type: application/x-www-form-urlencoded",
            'Authorization: Basic ' . base64_encode($this->keyPublic.':'.$this->keySecret)
            );
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => $token_url,
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $content
        ));

        if ($this->proxy) {
            curl_setopt_array($curl, array(
                CURLOPT_PROXY => $this->proxy
            ));

            if ($this->proxyAuth) {
                curl_setopt_array($curl, array(
                    CURLOPT_PROXYUSERPWD => $this->proxyAuth
                ));
            }
        }

        $response = curl_exec($curl);
        curl_close($curl);

        $respuesta = json_decode($response);
        $this->setToken($respuesta)->access_token;
        $this->setTypeToken($respuesta)->token_type;
        return $respuesta;
    }

    public function repartirControladosFarmacia($parametros, $tokenData = false) {
        if (!$tokenData) {
            $tokenData = $this->authenticate();
        }

        $header = array(
            'Accept: /',
            'Content-Type: application/json',
            'Authorization: ' . $tokenData->token_type.' '.$tokenData->access_token
        );
        try {
            $resp = $this->execute($this->apiURL . '/repartirfarmacia', $parametros, $header, false, 'PUT');
            return $resp;
        } catch (Exception $e) {
            var_dump($e);die;
        }
        return true;
    }

    public function challenge($parametros, $tokenData = false) {
        if (!$tokenData) {
            $tokenData = $this->authenticate();
        }

        $header = array(
            'Accept: /',
            'Content-Type: application/json',
            'Authorization: ' . $tokenData->token_type.' '.$tokenData->access_token
        );
        try {
            $resp = $this->execute($this->apiURL . '/challenge', array(), $header, false, 'GET');
            return $resp;
        } catch (Exception $e) {
            var_dump($e);die;
        }
        return true;
    }
}
