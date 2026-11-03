<?php

/**
 * @name AnalisisftController - Clase controladora de análisis de información.
 * @package   movimientoslaborales.
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ReportespdfController extends ZendExt_Controller_Secure
{
     function init()
    {
        parent::init();

    }

    function reportespdfAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->view->dirScriptsCmpReccomplejas = $this->integrator->reccomplejas->obtenerScriptsReccomplejas ();
        $this->render();
    }

    /**
     * @method getListaAnalisis - Devuelve la lista de análisis a mostrar en el menú.
     * @return Array - Arreglo con los elementos a mostrar en el menú.
     * @author Orestes Rodríguez Lorenzo.
     */

     function exportarestadoAction()
    {
       /* $r= ZendExt_IoC_Inter::getInstance()->seleccion->getEstados();
        print_r($r);die;*/
      /*  $idproceso=$this->_request->getPost('idproceso');
        $idestado=$this->_request->getPost('idestado');*/
        $filters=json_decode(stripslashes($this->_request->getParam('filters')));
        $idestructura = $this->global->Estructura->idestructura;

        //print_r($filters);die;
        $model=new ReportepdfEstadosModel();
        $result=$model->exportarestado($filters,$idestructura);

        ///*$resumen = ResumenEstadisticoModel::getResumenEstadistico(null);
        echo json_encode('ok');
    }

     function exportarcandidatosselecAction()
    {


        $filters=json_decode(stripslashes($this->_request->getParam('filters')));
        $idestructura = $this->global->Estructura->idestructura;
        $estructura=$filters[0]->value;
        $provincia=$filters[1]->value;
        $municipio=$filters[2]->value;
        $idestado=$filters[3]->value;
        $obj=new ExportarCandidatosSelecModel();
        $resumen = $obj->export($estructura,$provincia,$municipio,$idestructura);
        echo json_encode('ok');
    }


}