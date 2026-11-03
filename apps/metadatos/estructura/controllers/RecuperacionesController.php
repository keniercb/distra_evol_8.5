<?php

/**
 * @name ActivarpersonaController - Clase controladora de la funcionalidad "Activar persona".
 * @package   persona.
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class RecuperacionesController extends ZendExt_Controller_Secure
{
    public function recuperacionesAction()
    {
        $this->view->jsCmpReccomplejas = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();
        $this->render();
    }
}