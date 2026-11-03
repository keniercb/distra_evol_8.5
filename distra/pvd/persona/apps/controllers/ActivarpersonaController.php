<?php

/**
 * @name ActivarpersonaController - Clase controladora de la funcionalidad "Activar persona".
 * @package   persona.
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ActivarpersonaController extends ZendExt_Controller_Secure
{
    public function activarpersonaAction()
    {
        $this->view->jsCmpReccomplejas = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();
        $this->render();
    }
}