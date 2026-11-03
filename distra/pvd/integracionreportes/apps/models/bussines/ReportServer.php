<?php

//namespace reportservices;
class ReportServer
{
    public function getURL($config)
    {
        $separator = '=';
        $urlpath = '';
        if ($config['config']['format'] == 'dashboards') {
            $url = $config['config']['urlservidor'] . '/ReportServer.html#inlinedashboard/type:' . $config['configusuariopwd']['usuariors'];
        } else {
            if ($config['configusuariopwd']['autenticarapikey'] == '0') {
                //$urlpath = "/reportserver/scriptAccess?id={$config['configusuariopwd']['idsso']}&user={$config['configusuariopwd']['usuariors']}&password={$config['configusuariopwd']['contrasenna']}&login=true&redirect=";
            }
            $config = $config['config'];
            if ($config['format'] == 'preview') {
                $urlpath .= '/ReportServer.html#inlinereport/';
                $config['type'] = $config['format'];
                unset($config['user']);
                unset($config['apikey']);
                unset($config['format']);
                unset($config['download']);
                $separator = ':';
                //$url = $urlservidor . '/ReportServer.html#inlinereport/id:' . $idreportereportserver . '&type:preview';
            } else if (!empty($config['user']) && !empty($config['apikey'])) {
                $urlpath = '/reportserver/httpauthexport?';
                //$url = $urlservidor . '/reportserver/httpauthexport?id=' . $idreportereportserver . '&user=' . $usuario . '&apikey=' . $apikey . '&format=' . $formatoreporte . '&download=false';
            } else {
                unset($config['user']);
                unset($config['apikey']);
                unset($config['download']);
                $urlpath .= '/reportserver/reportexport?';
                //$url = $urlservidor . '/reportserver/reportexport?id=' . $idreportereportserver . '&format=' . $formatoreporte;
            }
            $url = $config['urlservidor'] . $urlpath;
            unset($config['urlservidor']);
            foreach ($config as $key => $value) {
                $url .= "&{$key}$separator{$value}";
            }
        }
        return $url;
    }

    public function execute($params = array())
    {
        $url = $this->getUrl($params);
        $ch = curl_init();
        // eliminar problema de cacheo
        /*$params = strpos($url,'?');
        $url = $params === false ? $url.'?ModPagespeed=off'  : $url.'&ModPagespeed=off' ;
        */
        // Administrar url y tiempo de espera por la respuesta
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Si se van a enviar datos
        /*if (count($post) > 0) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        }*/

        // Tratamiento del ssl
        //curl_setopt($ch, CURLOPT_SSLVERSION,3);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYSTATUS, false);
        // Solo pedir la cabecera cuando hay que autenticas
        //curl_setopt($ch, CURLOPT_HEADER, $header);
        //curl_setopt($ch, CURLOPT_IGNORE_CONTENT_LENGTH, true);

        // curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

        //curl_setopt($ch, CURLOPT_SSLVERSION, 4);

        /*curl_setopt($ch, CURLOPT_SSLVERSION, 3);
        curl_setopt($ch, CURLOPT_SSL_CIPHER_LIST, 'SSLv3');*/

        $result = curl_exec($ch);
        if ($e = curl_error($ch)) {
            //echo 'URL: '. $url . ', Error: ' . $e;
            return false;
        }
        curl_close($ch);
        return json_decode($result, true);
    }

    function curl($url)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $info = curl_exec($ch);
        curl_close($ch);
        return $info;
    }

}