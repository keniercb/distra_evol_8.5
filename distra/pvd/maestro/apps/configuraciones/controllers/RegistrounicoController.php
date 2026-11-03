<?php
/**
 * @name RegistrounicoController - Clase controladora de la configuración del registro único.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class RegistrounicoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function registrounicoAction()
    {
        $this->render();
    }

    /**
     * @method marcarUnico -> Guarda 1(Si) en el campo unico. 
     * @author Eddy Santana Navarro.
     */
    function marcarUnicoAction()
    {
        $idsRegistros = json_decode(stripslashes($this->_getParam('idsRegistros')));
        $cfg = ConfRegistrounicoModel::marcarUnico($idsRegistros);
        echo json_encode($cfg);
    }
    
    /**
     * @method marcarNoUnico - Guarda 2(No) en el campo unico. 
     * @author Eddy Santana Navarro.
     */
    function marcarNoUnicoAction()
    {
        $idsRegistros = json_decode(stripslashes($this->_getParam('idsRegistros')));
        $cfg = ConfRegistrounicoModel::marcarNoUnico($idsRegistros);
        echo json_encode($cfg);
    }
    
    /**
     * @method obtenerCfgRegistroUnico --> Obtiene todas las llaves. 
     * @author Eddy Santana Navarro.
     */
    function obtenerCfgRegistroUnicoAction()
    {
        $llaves = ConfRegistrounicoModel::getLlaves();
        $cantLlaves = ConfRegistrounicoModel::getCantLlaves();
        
        $array = array();
        $array['data'] = $llaves;
        $array['quantity'] = $cantLlaves;
        echo(json_encode($array));
    }
}