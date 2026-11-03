<?php


class EnzonaTemplateContainer extends PaymentTemplateContainer
{
    private $apiToken;
    private $_logged;
    private $commerceId;

    /**
     * EnzonaTemplateContainer constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->config = LogisticaConfigHelper::__init()->loadConfig('ezconfig');
        $this->apiToken = null;
        $this->_logged = false;
    }


    /**
     * @inheritDoc
     */
    public function getToken($costumerKey = null, $costumerSecret = null)
    {
        $data = http_build_query(array(
            'grant_type' => $this->getConfigutation('grant_type')[0],
            'scope' => $this->getConfigutation('scope'),
        ));
        $comercio = $this->getConfigutation('comercios')[$this->commerceId];

        $merchantKey = is_array($comercio) ? $comercio['consumerKey'] . ':' . $comercio['consumerSecret'] : $this->getConfigutation('consumerKey') . ':'
            . $this->getConfigutation('consumerSecret');

        $paramsKey = $costumerKey . ':' . $costumerSecret;
        $header = array(
            'Accept: application/json',
            'Authorization: Basic ' . base64_encode($paramsKey)
        );
        $this->apiToken = $this->execute($this->getURL('urlTokenAPI'), $data, $header);
        return $this->apiToken;
    }

    /**
     * @param mixed $commerceId
     */
    public function setCommerceId($commerceId)
    {
        $this->commerceId = $commerceId;
    }



    public function generateQrCode($data = array())
    {
        $this->setCommerceId($data['idComercio']);
        $this->getToken($data['consumerKey'], $data['consumerSecret']);
        /**
         * type = 'default'
         */
        $paymentData = DistraApiHelper::__init()->createPaymentRequest();
        $url = $this->getURL('urlQrAPI');
        $dataSend = json_encode(array(
            'amount' => LogisticaObjectHelper::__init()->_roundToFive($data['monto']),
            'currency' => $data['moneda'],
            'description' => $data['descripcion'],
            'return_url' =>  $paymentData['url_return'],
            'notify_url' =>  $paymentData['url_notify']
        ), JSON_UNESCAPED_SLASHES);
        $header = array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: ' . $this->apiToken['token_type'] . ' ' . $this->apiToken['access_token']
        );
        $isTransferMovil = false;
        if ($data['type'] == 'tm') {
            $isTransferMovil = true;
            $url = $this->getURL('urlQrAPITM');
            $dataSend = json_encode(array(
                "amount" => $data['monto'],
                "currency" => $data['moneda'],
                "description" => $data['descripcion'],
                "return_url" =>  $paymentData['tm_url_return'],
                "cancel_url" =>  $paymentData['tm_url_cancel'],
                "items" => array(
                    array(
                        "name" => $data['descripcion'],
                        "description" => $data['descripcion'],
                        "quantity" => 1,
                        "price" => $data['monto'],
                        "tax" => 0.00
                    )
                ),
                "merchant_op_id" => $paymentData['tm_op_id'],
                "invoice_number" => $paymentData['tm_op_id'],
                "terminal_id" => 12356,
            ), JSON_UNESCAPED_SLASHES);
        }
        $dataResponse = $this->execute($url, $dataSend, $header);
        if($isTransferMovil){
            $dataResponse = $dataResponse['getTransfermovilResponse']['payment'];
            $dataResponse['image'] = $dataResponse['qr'];
        }
        $dataResponse['uuid'] = $paymentData['request_id'];
        return $dataResponse;
    }

    public function getURL($config)
    {
        return $this->getConfigutation('urlApi') . $this->getConfigutation($config);
    }


    public function refreshToken()
    {
        $data = http_build_query(array(
            'grant_type' => $this->getConfigutation('grant_type')[2],
            'refresh_token' => $this->apiToken['refresh_token']
        ));
        $header = array(
            'Accept: application/json',
            'Authorization: Basic ' . base64_encode($this->getConfigutation('consumerKey') . ':'
                . $this->getConfigutation('consumerSecret'))
        );
        $this->apiToken = $this->execute($this->getURL('urlTokenAPI'), $data, $header);
        print_r($this->apiToken);
        die;
        ('refresh');
    }

    public function getPayments($params = array())
    {
        $this->setCommerceId($params['idComercio']);
        $this->getToken($params['consumerKey'], $params['consumerSecret']);

        $dataSend = array(
            'status_filter' => '1111',
            'order_filter' => 'desc',
            'limit' => '15'
        );
        $header = array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: ' . $this->apiToken['token_type'] . ' ' . $this->apiToken['access_token']
        );

        return $this->executeGetURL($this->getURL('urlPaymentAPI') . '/payments', $header, $dataSend);
    }

    public function verifyPayment($uuid)
    {
        /*
        $selectQuery = "select  * from public.ez_payment where payment_uuid = '{$uuid}'";
        $paymentObj = LogisticaDoctrineHelper::__init()->executeQuery($selectQuery,'enzona')->fetchAll(PDO::FETCH_ASSOC);
        $operationCode = is_array($paymentObj[0]) ? json_decode($paymentObj[0]['is_valid'])  : 0;
        */
        $paymentData = DistraApiHelper::__init()->validatePayment($uuid);
        return array(
            'isvalid' => $paymentData['is_valid'],
            'operation' => $paymentData['is_valid'] == 1 ? $paymentData['payment_data']['transaction_signature']  : '',
            'transactionId' => $paymentData['is_valid'] == 1 ? $paymentData['payment_data']['transaction_uuid']  : ''
        );
    }

    public function refund($data = array())
    {
        $this->getToken($data['consumerKey'], $data['consumerSecret']);
        $dataSend = json_encode(array(
            'amount' => array(
                'total' => LogisticaObjectHelper::__init()->_roundToFive($data['monto'])
            ),
            'commerce_refund_id' => $data['commercerefundid'],
            'username' => $data['usuario'],
            'description' =>  $data['descripcion']
        ), JSON_UNESCAPED_SLASHES);
        $header = array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: ' . $this->apiToken['token_type'] . ' ' . $this->apiToken['access_token']
        );
        $refundURL = "/payments/{$data['transaction_uuid']}/refund";
        return $this->execute($this->getURL('urlPaymentAPI') . $refundURL, $dataSend, $header);
    }
}
