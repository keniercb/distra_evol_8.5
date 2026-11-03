<?php
/**
 * @name ConfiguracionController - Clase controladora del componente "Riesgo".
 * @package   riesgo.configuracion
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