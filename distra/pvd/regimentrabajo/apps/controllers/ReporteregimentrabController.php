<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/fpdf/font');
include_once($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

class ReporteregimentrabController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();

    }

    function reporteregimentrabAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }

    function getReporteAction()
    {
        $idregimentrabajo = $this->_request->getParam('idregimentrabajo');
        $denonregimen = $this->_request->getParam('denonregimen');
        $exportar = $this->_request->getParam('exportar');
        $model = new NomRegimentrabajoModel();
        $result = $model->getPersonasByRegimen($idregimentrabajo);
        if ($exportar == 1) {
            $objReportePDF = new ReporteRegimenModel();
            $objReportePDF->CrearReportePDF($result->data,$denonregimen);
            echo json_encode('ok');
        } else if ($exportar == 2) {
            $objFicha = new ReporteRegimenRTF($result->data,$denonregimen);
            $objFicha->CrearFicha();
            $r->msg = "";
            $r->url = "/pvd/regimentrabajo/Reporte.rtf";
            echo json_encode($r);
        } else {
            echo json_encode($result);
        }
    }

    public function getCantPersonaByRegimenAction()
    {
        $model = new NomRegimentrabajoModel();
        $result = $model->getCantPersonaByRegimen();
        echo json_encode($result);
    }


}