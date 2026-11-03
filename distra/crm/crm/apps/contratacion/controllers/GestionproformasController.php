<?php

/**
 * Controlador encargado de manejar lo referente a la gestion
 * de las proformas y contratos marcos del modulo Contratacion de PCRM.
 *
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Controller
 * @author         Ing. Alberto Mesa Martínez <amartinez@xetid.cu>
 * @copyright (c)  2015, XETID
 * @version        1.0
 */

class GestionproformasController extends NomencladorCmpController
{

    function init()
    {
        $this->model = new GestionProformasModel();
        parent::init();
    }

    function gestionproformasAction()
    {
        $this->render();
    }

    /**
     * Funcionalidad que obtiene los tipos de contratos.
     */
    public function getTiposContratosAction()
    {
        $result = $this->model->getTiposContratos();
        echo json_encode($result);
    }

    /**
     * Funcionalidad que obtiene las clausulas de una proforma.
     */
    public function getClausulasAction()
    {
        $params = $this->_request->getParams();
        $result = $this->model->getClausulas($params);
        echo json_encode($result);
    }

    public function guardarHerenciaProformaAction()
    {
        $params = $this->_request->getParams();
        $result = $this->model->guardarHerenciaProforma($params);
        echo json_encode($result);
    }
    public function exportarProformaAction()
    {
        $params = $this->_request->getParams();
        $result = $this->model->exportarProforma($params);
////        echo json_encode($result);
//        echo (json_encode ($result));
//        $dir_www = $_SERVER['DOCUMENT_ROOT'];
//        $dir_rel_mt = '/'; //Direccion del Marco de trabajo relativa a la carpeta de publicacion.
//        $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt); //Direccion absoluta del marco de trabajo
//        include($dir_abs_mt . 'apps/pvd/comun/recursos/Mpdf/mpdf.php');
//        $pdf = new mPDF();
//        $tituloReporte='proforma';
////        $pdf->Output();
//        header("Expires: Mon, 15 Dec 2003 05:00:00 GMT");
//        header("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
//        header("Cache-Control: no-cache, must-revalidate");
//        header("Pragma: no-cache");
//        header("Content-type: application/pdf");
//        header("Content-Disposition: attachment; filename=\"" . basename($tituloReporte . '.pdf') . "\"");
//        header("Content-Description: PHP/INTERBASE Generated Data");
////        echo $this->GetHeaderPDF_DOC($tituloReporte, null, null);
////        echo 'que pasa';
////        echo $this->GetFooterPDF_DOC(null, null);
//        $pdf->WriteHTML('<table><body><html>algo plis2</table></body></html>');
//        $pdf->Output($tituloReporte . '.pdf', 'D');
    }

    public function getDocumentoAction()
    {
        $params = $this->_request->getParams();
        echo $this->model->getDocumento($params['idnodo']);
    }

    public function cargarDocumentosAction()
    {
        $params = $this->_request->getParams();
		//print_r($params);die;
        echo json_encode($this->model->cargarDocumentos($params));
    }

    public function guardarDocumentoAction()
    {
        $params = $this->_request->getParams();
        echo json_encode($this->model->guardarDocumento($params));
    }

    public function getConfiguracionesAction()
    {
        $params = $this->_request->getParams();
        echo json_encode($this->model->getConfiguraciones($params));
    }

    public function eliminarDocumentosAction()
    {
        $params = $this->_request->getParams();
        echo json_encode($this->model->eliminarDocumentos($params));
    }
}
