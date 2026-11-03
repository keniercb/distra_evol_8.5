<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class CintaauditoraController extends BaseController
{
    private $serviciosAyuda;
    private $_auditoraModel;

    function init()
    {
        parent::init('log.fac.cintaauditora');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
		$this->_auditoraModel = new CintaauditoraModel();
        $this->_serviciosLogisticaGlobal = LogisticaGlobal::__init();
    }
	
	public function cintaauditoraAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->initComponent('log.fac.cintaauditora');
        $this->rendertemplate();
    }

    public function cargarauditorasAction()
    {
        $this->objectHelper->synchronize($this, $this->_auditoraModel->cargarAuditoras($this->uiParams));
    }

    public function devolverInformacionAction()
    {
        $this->objectHelper->synchronize($this, $this->_auditoraModel->devolverInformacion($this->uiParams));
    }

    public function descargarAuditoraAction() {
        $this->objectHelper->synchronize($this,$this->_auditoraModel->descargarAuditora($this->uiParams));
    }

    public function exportarCsvAction()
    {
        $dir_index = $_SERVER['SCRIPT_FILENAME'];
        $path = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'web/logistica/facturacion/puntoventa/AuditorasCvs/';
        if (!is_dir($path)) {
            mkdir($path, 0777, true);
        }


        //create a file pointer
        $data = $this->_auditoraModel->getDataDescarga($this->uiParams);
        $fileName = $data[0]['iddescarga'].'_'.str_replace('/', '', $data[0]['fecha']).'_'.$data[0]['identificador'].'.txt';
        file_put_contents($path.$fileName,$data[0]['infoauditora']);

        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $fileName . '";');

        $this->url = '/logistica/facturacion/puntoventa/AuditorasCvs/'.$fileName;
        $this->success = true;
        $this->intercepted = null;
    }
}