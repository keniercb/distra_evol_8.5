<?php
/**
 * ZendExt_Aspect_Config
 * Inicializa la configuracion
 *
 * @author     : Yoandry Morejon Borbon
 * @copyright  UCID-ERP Cuba
 * @package    : ZendExt
 * @subpackage ZendExt_Aspect_Session
 * @version    1.0-0
 */
class ZendExt_Aspect_Config implements ZendExt_Aspect_ISinglenton
{

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

    /**
     * Obtencion de la instancia de la clase, ya que esta no puede ser
     * instanciada directamente debido a que es un singlenton
     *
     * @return ZendExt_Aspect_Config - instancia de la clase
     */
    static public function getInstance()
    {
        static $instance;
        if (!isset($instance)) {
            $instance = new self();
        }
        return $instance;
    }

    public function initAppConfig()
    {
        $configApp = new ZendExt_App_Config();
        $register = Zend_Registry::getInstance();
        $register->config = $configApp->configApp($config);
    }
}
