<?php
/**
 * @name AnalisisftController - Clase controladora de análisis de información.
 * @package   persona.
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class CertificaciondelpersonalController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function certificaciondelpersonalAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }

    function exportarestadoCertificacionAction()
    {
        $filters=json_decode(stripslashes($this->_request->getParam('filters')));
        $idestructura = $this->global->Estructura->idestructura;
        $model=new CertificaciondelpersonalModel();
        $result=$model->exportarestadoCertificacion($filters,$idestructura);
        echo json_encode('ok');
    }
}