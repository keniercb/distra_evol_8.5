<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class EnzonaController extends PaymentController
{
    public function init()
    {
        parent::init('log.lb.ezn');
        $this->serviciosBarcode = LogisticaBarcodegenHelper::__init();
    }

    public function testAction()
    {
        echo '<pre>';
        $qrCode = LogisticaGlobal::__init()->getEznContainer()->generateQrCode(array('monto' => 1, 'moneda' => 'cup',
        'idComercio' =>'provari', 'descripcion' => 'Pago de factura comecial', 
        'consumerKey'=>'izrei8omUU75rEZ3oH3Za5B76qUa','consumerSecret'=>'fDEfY3LzrOKLxuOpH_CqmQXajEwa'));
        $payments = LogisticaGlobal::__init()->getEznContainer()->getPayments(array('idComercio' =>'provari', 'consumerKey'=>'izrei8omUU75rEZ3oH3Za5B76qUa','consumerSecret'=>'fDEfY3LzrOKLxuOpH_CqmQXajEwa'));
        $token = LogisticaGlobal::__init()->getEznContainer()->getToken('izrei8omUU75rEZ3oH3Za5B76qUa','fDEfY3LzrOKLxuOpH_CqmQXajEwa');
        echo '<pre>';
        print_r(['qr'=>$qrCode, 'token'=>$token, 'payments'=> $payments]);die;
    }

    public function qrAction()
    {
        $this->setDefaultParam('type','tm');
        $dataQr = LogisticaGlobal::__init()->getEznContainer()->generateQrCode(array(
            'monto' => $this->uiParams['monto'],
            'idComercio' => $this->uiParams['comercio'],
            'moneda' => strtolower($this->uiParams['isomoneda']),
            'descripcion' => strtoupper($this->uiParams['descipcionpago']),
            'consumerKey' => $this->uiParams['key'],
            'consumerSecret' => $this->uiParams['secret'],
            'type' => $this->uiParams['type'],
        ));
        $this->uuid = $dataQr['uuid'];
        $this->qr = $dataQr['image'] != null ? $dataQr['image'] : LogisticaGlobal::__init()
            ->getEznContainer()
            ->getConfigutation('base64IMG'); 
		if($this->uiParams['iddocumento'] && $dataQr['image'] != null){
			$documento =  new DocumentoLogisticaModel();
			$documento->saveQrByDoc($this->uiParams['iddocumento'], $dataQr['image'],$this->uiParams['type']);
		}
        $this->fallido = $dataQr['image'] != null ? '0' : '1';
    }

    public function getPaymentsAction()
    {

    }

    public function verifyPaymentAction()
    {
        LogisticaObjectHelper::__init()->synchronize($this, LogisticaGlobal::__init()
            ->getEznContainer()->verifyPayment($this->uiParams['uuid']));
    }

    
}
