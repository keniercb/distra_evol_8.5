<?php

/**
 * @name AnalisisftController - Clase controladora de análisis de información.
 * @package   persona.
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class Anexo2Controller extends ZendExt_Controller_Secure
{
     function init()
    {
        parent::init();

    }

    function anexo2Action()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }


     function exportarestadoAction()
    {

        $filters=json_decode(stripslashes($this->_request->getParam('filters')));
        $idestructura = $this->global->Estructura->idestructura;

        //print_r($filters);die;
       // $model=new ReportepdfEstadosModel();
        $model=new Anexo2Model();
        $result=$model->construirReporte($filters,$idestructura);

        echo json_encode('ok');
    }




}