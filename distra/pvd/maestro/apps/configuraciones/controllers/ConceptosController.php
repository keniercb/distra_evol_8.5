<?php

/**
 * @name RegistrounicoController - Clase controladora de la configuración de conceptos .
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConceptosController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function conceptosAction()
    {
        $this->render();
    }

    /**
     * @method  getConceptos ->Devuelve los conceptos.
     * @author Beatriz Selema Alvarez.
     */
    function getConceptosAction()
    {
        $conc['datos'] = ZendExt_IoC_Inter::getInstance()->nomina->GetAllConceptosPD();
        $conc['cantidad'] = count(ZendExt_IoC_Inter::getInstance()->nomina->GetAllConceptosPD());
        echo json_encode($conc);
    }

    /**
     * @method guardarConceptos - Guarda la configuracion.
     * @author Beatriz Selema Alvarez.
     */
    function guardarConceptosAction()
    {
        $ids = json_decode(stripslashes($this->_getParam('arra')));
        $cfg = ConfConceptosNominaModel::guardarConceptos($ids);
        if ($cfg == true) {
            $r->codigo = 1;
        } else {
            $r->codigo = 3;
        }
        echo json_encode($r);

    }

    public function getSelectedAction()
    {
        $cfg = ConfConceptosNominaModel::getSelected();
        echo Zend_Json::encode(array('datos' => $cfg, 'cantidad' => count($cfg)));
    }


}