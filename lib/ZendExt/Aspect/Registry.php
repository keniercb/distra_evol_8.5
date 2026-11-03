<?php
/**
 * ZendExt_Aspect_Registry
 * Inicializa el registro de singlenton
 *
 * @author     : Yoandry Morejon Borbon
 * @copyright  UCID-ERP Cuba
 * @package    : ZendExt
 * @subpackage ZendExt_Aspect_Registry
 * @version    1.0-0
 */
class ZendExt_Aspect_Registry implements ZendExt_Aspect_ISinglenton
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
     * @return ZendExt_Aspect_Registry - instancia de la clase
     */
    static public function getInstance()
    {
        static $instance;
        if (!isset($instance)) {
            $instance = new self();
        }
        return $instance;
    }

    public function initRegistry()
    {
        //Se crea el registro de objetos, variables y arreglos
        $register = new Zend_Registry(array(), ArrayObject::ARRAY_AS_PROPS);
        //Se guarda el registro en el singelton de Registro
        Zend_Registry::setInstance($register);
    }
}
