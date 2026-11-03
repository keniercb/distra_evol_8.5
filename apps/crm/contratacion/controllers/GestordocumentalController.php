<?php

/**
 * Controlador encargado de renderizar la vista de gestor documental
 *
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Controller
 * @author         Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class GestordocumentalController extends ZendExt_Controller_Secure
{
    private $_gestordocumental;
    private $_confcontrato;

    function init()
    {
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_confcontrato = new ConfContratacionModel();
        parent::init();
    }

    function gestordocumentalAction()
    {
        $this->view->gestdoc = $this->_gestordocumental->devolverJSContenido();
        $this->render();
    }

    function getEspacioTrabajoAction(){
        $idnodo = $this->getIdEspacioTrabajo();
        echo json_encode(array('idnodo'=>$idnodo));
    }

    function getIdEspacioTrabajo(){
        $result = $this->_confcontrato->loadContractdoc();
        return $result[0]['idespaciotrabajo'];
    }
}
