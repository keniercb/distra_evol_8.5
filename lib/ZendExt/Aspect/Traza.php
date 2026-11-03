<?php
/**
 * ZendExt_Aspect_Validation
 *
 * Administra las transacciones
 *
 * @author    : Yoandry Morejon Borbon
 * @copyright UCID-ERP Cuba
 * @package   : ZendExt
 * @version   1.0-0
 */
class ZendExt_Aspect_Traza implements ZendExt_Aspect_ISinglenton
{
    private $_startScriptRuntime = 0;

    private $_endScriptRuntime = 0;

    /**
     * Constructor de la clase, es privado para impedir que pueda
     * ser instanciado y de esta forma garantizar que la instancia
     * sea un singlenton
     *
     * @return void
     */
    private function __construct()
    {

    }

    static public function getInstance()
    {
        static $instance;
        if (!isset ($instance)) {
            $instance = new self ();
        }
        return $instance;
    }

    public function startTrazaAction()
    {
        $this->script_runtime();
    }

    public function endTrazaAction()
    {
        $register = Zend_Registry::getInstance();
        $usuario = $register->session->usuario;
        $categoria = 'arquitectura';
        $tipo = 'accion';
        $frontController = Zend_Controller_Front::getInstance();
        $action = $frontController->getRequest()->getActionName();
        $controller = $frontController->getRequest()->getControllerName();
        $this->script_runtime();
        $mensaje = '[referencia:' . $moduleReference . ']-[controlador:' . $controller . ']-[accion:' . $action
            . ']-[tiempo de ejecucion:' . $this->_endScriptRuntime . ' seg]';
        $dm = Doctrine_Manager::getInstance();
        try {
            $conn = $dm->getConnection('traza');
        } catch (Doctrine_Manager_Exception $e) {
            $configApp = new ZendExt_App_Config();
            $configApp->addBdToConfig('traza', 'traza');
            $tm = ZendExt_Aspect_TransactionManager::getInstance();
            $conn = $tm->openConections('traza');
        }
        $conntmp = $dm->getCurrentConnection();
        $dm->setCurrentConnection($conn->getName());

        ZendExt_Traza::tratarLog(ZendExt_Traza::getLog($usuario, $categoria, $tipo, $mensaje));
        $dm->setCurrentConnection($conntmp->getName());
    }

    /**
     * Funcion para el calculo del tiempo de ejecucion de la accion
     */
    private function script_runtime($round = 20)
    {
        //Check to see if the global is already set
        if ($this->_startScriptRuntime != 0) {
            //The global was set. So, get the current microtime and explode it into an array.
            list($msec, $sec) = explode(" ", microtime());
            $this->_endScriptRuntime = round(($sec + $msec) - $this->_startScriptRuntime, $round);
        } else {
            // The global was not set. Create it!
            list($msec, $sec) = explode(" ", microtime());
            $this->_startScriptRuntime = $sec + $msec;
        }
    }
}
