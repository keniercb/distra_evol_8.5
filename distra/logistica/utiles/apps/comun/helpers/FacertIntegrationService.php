<?php

class FacertIntegrationService extends ApiHelper
{
    private $baseURL;
    private $apiUser;
    private $apiPassword;
    private $apiToken;
    private $userKey;
    private $userSecret;
    const URL_POST_FACTURA = 'facturas/fact';
    const URL_GET_FACTURA = 'facturas';
    const URL_TOKEN = 'oauth2/token';
    const URL_FACEL = 'https://am-cav.test.xetid.cu/';

    public function __construct()
    {
        $this->setBaseURL(FacertIntegrationService::URL_FACEL.'/api/1.0/');//TODO Tomarlo de una variable global
        $this->setApiUser('XZJevo3U7rGuoZDHP2SZvzfMWIoa');//TODO Tomarlo de una variable global
        $this->setApiPassword('XfE9uOgHq1xu7ad7nfGKJZkC7VEa');//TODO Tomarlo de una variable global
    }

    public function generarFactura($xmlFile, $p12File, $p12PasswordFile)
    {
        $this->authenticate();
        $header = array(
            'Authorization: Bearer ' . $this->getApiToken(),
            'Content-Type: multipart/form-data'
        );
        $urlPost = $this->getBaseURL() . FacertIntegrationService::URL_POST_FACTURA;
        $posData = array(
            'pkcs12File' => curl_file_create($p12File, 'application/pkcs12', 'pkcs12File.p12'),
            'pkcs12FilePassword' => curl_file_create($p12PasswordFile, 'text/plain', 'pkcs12FilePassword.txt'),
            'xmlFile' => curl_file_create($xmlFile, 'text/xml', 'xmlFile.xml')
        );
        $nFact = $this->execute($urlPost, $posData, $header, true, false, true);
        print_r(array($header, $posData, $nFact));
        die;
        return $nFact;
    }

    public function obtenerFactura($nFcaturaLegal)
    {
        $this->authenticate();
        $header = array(
            'Authorization: Bearer ' . $this->getApiToken(),
            'Accept: application/json'
        );
        $urlPost = $this->getBaseURL() . FacertIntegrationService::URL_GET_FACTURA . "/{$nFcaturaLegal}";
        $posData = array();
        $nFact = $this->execute($urlPost, $posData, $header, false, 'GET', true);
        print_r(array($header, $posData, $nFact, $urlPost));
        die;
        return $nFact;
    }

    public function authenticate()
    {
        $header = array(
            'Authorization: Basic ' . base64_encode($this->getApiUser() . ":" . $this->getApiPassword())
        );
        $dataResp = $this->execute(FacertIntegrationService::URL_FACEL.''.FacertIntegrationService::URL_TOKEN, http_build_query(array('grant_type' => 'client_credentials')), $header, true);
        $this->setApiToken($dataResp['access_token']);
    }

    /**
     * @return mixed
     */
    public function getApiToken()
    {
        return $this->apiToken;
    }

    /**
     * @param mixed $apiToken
     * @return FacertIntegrationService
     */
    public function setApiToken($apiToken)
    {
        $this->apiToken = $apiToken;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserKey()
    {
        return $this->userKey;
    }

    /**
     * @param mixed $userKey
     * @return FacertIntegrationService
     */
    public function setUserKey($userKey)
    {
        $this->userKey = $userKey;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserSecret()
    {
        return $this->userSecret;
    }

    /**
     * @param mixed $userSecret
     * @return FacertIntegrationService
     */
    public function setUserSecret($userSecret)
    {
        $this->userSecret = $userSecret;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBaseURL()
    {
        return $this->baseURL;
    }

    /**
     * @param mixed $baseURL
     * @return FacertIntegrationService
     */
    public function setBaseURL($baseURL)
    {
        $this->baseURL = $baseURL;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getApiUser()
    {
        return $this->apiUser;
    }

    /**
     * @param mixed $apiUser
     * @return FacertIntegrationService
     */
    public function setApiUser($apiUser)
    {
        $this->apiUser = $apiUser;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getApiPassword()
    {
        return $this->apiPassword;
    }

    /**
     * @param mixed $apiPassword
     * @return FacertIntegrationService
     */
    public function setApiPassword($apiPassword)
    {
        $this->apiPassword = $apiPassword;
        return $this;
    }

}