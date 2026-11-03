<?php
/**
 * ZendExt_Aspect_Session
 * Inicializa la session
 *
 * @author     : Yoandry Morejon Borbon
 * @copyright  UCID-ERP Cuba
 * @package    : ZendExt
 * @subpackage ZendExt_Aspect_Session
 * @version    1.0-0
 */
class ZendExt_Aspect_Session implements ZendExt_Aspect_ISinglenton
{
    /**
     * Constructor de la clase, es privado para impedir que pueda
     * ser instanciado y de esta forma garantizar que la instancia
     * sea un singlenton
     */
    private function __construct()
    {

    }

    /**
     * Obtencion de la instancia de la clase, ya que esta no puede ser
     * instanciada directamente debido a que es un singlenton
     *
     * @return ZendExt_Aspect_Session - instancia de la clase
     */
    static public function getInstance()
    {
        static $instance;
        if (!isset($instance)) {
            $instance = new self();
        }
        return $instance;
    }

    public function initSession($nameSpace = 'Zeolides')
    {
        //Inicializacion de la conexion a la base de datos.
        try {
            $_conn = Doctrine_Manager::getInstance()->getConnection('session');
        } catch (Doctrine_Manager_Exception $e) {
            $configApp = new ZendExt_App_Config();
            $configApp->addBdToConfig('session');
            $_conn = ZendExt_Aspect_TransactionManager::getInstance()->openConections('session', false, false);
        }

        //Inicializacion de la sesion.
        //session_save_path(Zend_Registry::getInstance()->config->session_save_path);
        Zend_Session::setSaveHandler(new ZendExt_Session_SaveHandler_Doctrine($_conn));
        Zend_Session::start(array('cookie_httponly' => 1)/*array('cookie_secure' => true)*/);
        $session = new Zend_Session_Namespace($nameSpace);

        //Guardando la sesion en el registro.
        Zend_Registry::getInstance()->session = $session;
    }
}
