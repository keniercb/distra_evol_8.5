<?php
/**
 * Clase controladora de P\xE1rrafo Fiscal para renderizar la vista
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage P\xE1rrafoFiscal/Controllers
 * @copyright  XETID
 * @version    1.0-0
 */
class IndexController extends Zend_Controller_Action
{
	/**
     * Inicializa la clase
     */
    function init()
    {
        // Local to this controller only; affects all actions, as loaded in init:
        $this->_helper->viewRenderer->setNoRender(true);
        // Globally:
        $this->_helper->removeHelper('viewRenderer');
        // Also globally, but would need to be in conjunction with the local
        // version in order to propagate for this controller:
        Zend_Controller_Front::getInstance()->setParam('noViewRenderer', true);
    }
    /**
     * Inicializa la vista
     */
    public function indexAction()
    {
        if (file_exists(
            '../portal/index.php'
        )) {
        //Si existe un modulo de gestion del portal
        //Se redirecciona hacia el modulo de gestion del portal
        header("Location:../portal/");
        } else {
        //Si no existe un modulo de gestion del portal        
        //Se muestra un mensaje
        echo '<h3 style="color:#0000FF">No se pudo encontrar el m&oacute;dulo de gesti&oacute;n del portal.</h3>';
        }
    }
}
