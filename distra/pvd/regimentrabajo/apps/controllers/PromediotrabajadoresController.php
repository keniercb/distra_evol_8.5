<?php

$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/fpdf/font');
include_once($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

class PromediotrabajadoresController extends ZendExt_Controller_Secure
{
    private $parte = array();
    protected $DatPromediotrabajadoresModel;
    protected $DatpdfpromediotrabajadoresModel;
    protected $ConfConceptocausasModel;
    protected $NomCausaModel;
    protected $NomCausa;
    protected $ConfTipocontratosituacion;

    public function __construct(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response, array $invokeArgs = array())
    {
        parent::__construct($request, $response, $invokeArgs);
        $this->DatPromediotrabajadoresModel = new DatPromediotrabajadoresModel();
        $this->DatpdfpromediotrabajadoresModel = new DatpdfpromediotrabajadoresModel();
        $this->ConfConceptocausasModel = new ConfConceptocausasModel();
        $this->NomCausaModel = new NomCausaModel();
        $this->NomCausa = new NomCausa();
        $this->ConfTipocontratosituacion = new ConfTipocontratosituacion();
    }

    function init()
    {
        parent::init();
    }

    function promediotrabajadoresAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->fecha = date('d/m/Y');
        $this->render();
    }

    function getdatosAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $fdesde = $this->_request->getPost('fdesde');
        $fhasta = $this->_request->getPost('fhasta');
        $idestructura = $this->_request->getPost('idestructura');
        $r = $this->DatPromediotrabajadoresModel->getdata($fdesde, $fhasta, $idestructura);
        $_SESSION['parte'] = $r;
        echo(json_encode($r));
    }

    function getlistadoCausasAction()
    {
        $result = $this->ConfConceptocausasModel->getlistadoCausas();
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function getTipocontratoAction()
    {
        $idconcepto = $this->_request->getPost('idconcepto');
        if (!empty($idconcepto))
            $result = $this->ConfConceptocausasModel->gettipocontrato($idconcepto);
        else
            $result = $this->ConfTipocontratosituacion->gettipocontrato();
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function getSituacionAction()
    {
        $idconcepto = $this->_request->getPost('idconcepto');
        if (!empty($idconcepto))
            $result = $this->ConfConceptocausasModel->getsituacion($idconcepto);
        else
            $result = $this->ConfTipocontratosituacion->getsituacion();
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function setConceptoCausasAction()
    {
        $idcausas = json_decode(stripslashes($this->_request->getPost('causas')));
        $idconcepto = $this->_request->getPost('concepto');
        $tiposcontratos = json_decode(stripslashes($this->_request->getPost('tiposcontratos')));
        $situaciones = json_decode(stripslashes($this->_request->getPost('situaciones')));
        if(!empty($idconcepto))
            $r = $this->ConfConceptocausasModel->addTipocontratoSituacion($idconcepto, $tiposcontratos, $situaciones);
        if(!empty($idcausas))
            $r = $this->ConfConceptocausasModel->addConceptocausas($idcausas);
        echo json_encode(true);
    }

    function exportarPdfAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $fdesde = $this->_getParam('fdesde');
        $fhasta = $this->_getParam('fhasta');
        $idestructura = $this->_getParam('idestructura');
        $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $arreglo = $_SESSION['parte'];
        $this->DatpdfpromediotrabajadoresModel->CrearReportePDF($arreglo, $fdesde, $fhasta, $estructura[0]->denominacion);
        echo(json_encode('ok'));
    }

    function exportarExcelAction()
    {
        $arreglo = $_SESSION['parte'];
        $r = $this->DatPromediotrabajadoresModel->GetDatosExportarExcel($arreglo);
        return true;
    }
}

?>