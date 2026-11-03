<?php

abstract class ApiHelper
{
    public function execute($url, $data, $header, $post = true, $method = 'POST', $debugInfo = false)
    {
        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_HEADER => true,
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_URL => $url,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_POSTFIELDS => $data
        ));
        if ($post !== false) {
            curl_setopt_array($ch, array(
                CURLOPT_POST => true
            ));
        }
        if ($method === 'GET') {
            curl_setopt_array($ch, array(
                CURLOPT_CUSTOMREQUEST=>true,
                CURLOPT_NOBODY=>true,
                CURLOPT_HTTPGET => true
            ));
        }
        $apiResponse = curl_exec($ch);
        if ($apiResponse === false) {
            throw new Exception('Request Error:' . curl_error($ch), 1001);
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
}