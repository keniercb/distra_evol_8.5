<?php
/**
 * @name EstructuraconceptoController - Clase controladora de la configuración de estructuras por conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class EstructuraconceptoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function estructuraconceptoAction()
    {
        $this->render();
    }

    /**
     * @method obtenerCfgEstructConcepto - Devuelve las configuraciones de estructuras por conceptos.
     * @author Orestes Rodríguez Lorenzo.
     */
    function obtenerCfgEstructConceptoAction()
    {
        //Obteniendo el resultado y enviando a la vista
        echo json_encode(ConfEstructuraconceptoModel::obtenerConfEstructuraconcepto());
    }

    /**
     * @method obtenerEstructura - Devuelve la estructura organizativa
     * @author Orestes Rodríguez Lorenzo.
     */
    function obtenerEstructuraAction()
    {
        //Obteniendo el resultado y enviando a la vista
        $idestructglobal = $this->global->Estructura->idestructura;
        echo json_encode(ConfEstructuraconceptoModel::obtenerEstructura($this->_getParam('node'), $idestructglobal));
    }

    /**
     * @method modConfEstructConcepto - Devuelve la estructura organizativa
     * @author Orestes Rodríguez Lorenzo.
     */
    function modConfEstructConceptoAction()
    {
        $cfg = ConfEstructuraconceptoModel::modConfEstructuraconcepto(
            $this->_getParam('idestructconcepto'),
            $this->_getParam('idestructura')
        );
        echo json_encode($cfg);
    }
}