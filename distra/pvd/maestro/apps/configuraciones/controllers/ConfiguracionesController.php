<?php
/**
 * @name ConfiguracionesController - Clase controladora del componente nomencladores y configuraciones.
 * @package maestro.configuraciones
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 * @modify 18/10/2017 Ing. Orestes Rodríguez Lorenzo. Se elimina la funcionalidad getListaConfigAction.
 * @version 1.0
 */

class ConfiguracionesController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function configuracionesAction()
    {
        $this->view->plantilla = ZendExt_IoC_Inter::getInstance()->maestro->mostrarIUPlantilla();
        $this->view->dirScriptsCmpReccomplejas = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }
}