<?php

//namespace reportservices;
class ReportServerTemplateContainer extends ServiceTemplateContainer
{

    public function getURL($reportId, $params = array())
    {
        $config = $this->getConfigutation('reportserver');
        $url = $config['url'];
        $url .= '/reportserver/reportserver/httpauthexport?';
        $defaultParams = array(
            'user' => $config['user'],
            'apikey' => $config['apikey'],
            'format' => $config['format'],
            'download' => 'false',
            'id' => $reportId,
        );
        if(isset($params['format'])){
            $defaultParams['format'] = $params['format'];
            unset($params['format']);
        }
        foreach ($params as $key => $paramValue) {
            $defaultParams['p_' . $key] = $paramValue;
        }
        foreach ($defaultParams as $key => $param) {
            $url .= "&{$key}={$param}";
        }
        return $url;
    }

    public function execute($reportId, $params = array())
    {
        $url = $this->getUrl($reportId, $params);
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
        return json_decode($result,true);
    }

}