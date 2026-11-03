<?php

/**
 * @name AnalisisftController - Clase controladora de análisis de información.
 * @package   movimientoslaborales.
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class AnalisisController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function analisisAction()
    {
        $this->render();
    }
}