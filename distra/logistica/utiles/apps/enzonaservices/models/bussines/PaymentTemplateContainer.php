<?php
/**
 * Class PaymentTemplateContiner
 * @author kcumba
 */

abstract class PaymentTemplateContainer
{
    protected $config;

    /**
     * PaymentTemplateContiner constructor.
     */
    public function __construct()
    {

    }

    public function getConfigutation($configProperty = '')
    {
        if ($configProperty != '') {
            return $this->config->$configProperty;
        }
        return '';
    }

    /**
     * @return mixed
     */
    abstract public function getToken();

    /**
     * @return mixed
     */
    abstract public function refreshToken();

    /**
     * @param $config
     * @return mixed
     */
    abstract public function getURL($config);

    /**
     * @return mixed
     */
    abstract public function generateQrCode($data = array());


    public function execute($url, $data, $header, $post = true)
    {
        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_HEADER => true,
            CURLOPT_POST => $post,
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_URL => $url,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_POSTFIELDS => $data,
        ));
        $apiResponse = curl_exec($ch);
        $apiResponseInfo = curl_getinfo($ch);
        $pos = stripos($apiResponse, '{');
        $apiResponseHeader = trim(substr($apiResponse, 0, $pos));
        $apiResponseBody = substr($apiResponse, $pos);
        curl_close($ch);
        return json_decode($apiResponseBody, true);
    }

    public function prepareGetURL($url, $params = array())
    {
        foreach ($params as $key => $param) 
        {
            $url .= "&{$key}={$param}";
        }
        return $url;
    }

    public function executeGetURL($url, $header, $params = array())
    {
        $url = $this->prepareGetURL($url.'?', $params);
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

        $apiResponse = curl_exec($ch);
        $apiResponseInfo = curl_getinfo($ch);
        $pos = stripos($apiResponse, '{');
        $apiResponseHeader = trim(substr($apiResponse, 0, $pos));
        $apiResponseBody = substr($apiResponse, $pos);
        curl_close($ch);
        return json_decode($apiResponseBody, true);
    }
}