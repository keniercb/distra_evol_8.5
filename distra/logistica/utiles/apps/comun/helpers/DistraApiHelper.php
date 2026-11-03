<?php

class DistraApiHelper extends ApiHelper implements ISingletonClass
{

    private static $instance = null;
    private $apiToken;
    private $apiURL;
    private $variablesModel;
    /**
     * @return DistraApiHelper
     */
    public static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new DistraApiHelper;
            self::$instance->setVariablesModel(new VariablesGlobalesModel);
            self::$instance->setApiUrl(self::$instance->getVariablesGlobalesModel()->obtenerValor('API_URL'));
        }
        return self::$instance;
    }

    public function setApiUrl($newUrl)
    {
        $this->apiURL = $newUrl;
    }

    public function getVariablesGlobalesModel()
    {
        return $this->variablesModel;
    }

    public function setVariablesModel(VariablesGlobalesModel $model)
    {
        $this->variablesModel = $model;
    }
    public function authenticate($user, $password)
    {
        $data = http_build_query(array(
            'username' => $user,
            'password' => $password,
        ));

        $header = array(
            'Accept: application/json'
        );
        $tokenData = $this->execute($this->apiURL . 'login', $data, $header);
        $this->apiToken = $tokenData['type'] . ' ' . $tokenData['token'];
        return $this->apiToken;
    }

    /**
     * Devices
     */
    public function registerDevice()
    {

        $token = $this->authenticate($this->variablesModel->obtenerValor('API_LOGIN_USER'), $this->variablesModel->obtenerValor('API_LOGIN_PWD'));
        $header = array(
            'Accept: application/json',
            'Authorization: ' . $token
        );
        $data = $this->execute($this->apiURL . 'dispositivos/registrar', array(), $header);
        return $data['data']['id'];
    }

    /**
     * Payments
     */
    public function createPaymentRequest()
    {
        $header = array(
            'Accept: application/json'
        );
        $paymentData = $this->execute($this->apiURL . 'payments/create', array(), $header);
        if ($paymentData['success'] != 1) {
            throw new Exception("Error Processing Request", 1);
        }
        return $paymentData['data'];
    }

    public function validatePayment($id)
    {
        $data = http_build_query(array(
            'uuid' => $id
        ));
        $header = array(
            'Accept: application/json'
        );
        $paymentData = $this->execute($this->apiURL . 'payments/validate', $data, $header);
        if ($paymentData['success'] != 1) {
            return array(
                'is_valid' => false
            );
        }
        return $paymentData['data'];
    }
}
