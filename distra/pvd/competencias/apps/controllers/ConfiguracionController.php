<?php
/**
 * @name ConfiguracionController - Clase controladora del componente "Nomencladores y configuraciones"
 * @package   competencia.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfiguracionController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function configuracionAction()
    {
        $this->render();
    }
}