<?php

/**
 * ZendExt_Trace
 *
 * Singleton para la creación de trazas
 *
 * @author Omar Antonio Díaz Peña
 * @copyright ERP-Cuba
 * @package ZendExt
 * @version 1.0.0
 */
class ZendExt_Trace {

    /**
     * Instancia estática
     *
     * @var ZendExt_Trace
     */
    private static $_instance;
    /**
     * Instancia del XML de configuraciön de trazas
     *
     * @var SimpleXmlObject
     */
    private $_xml;

    /**
     * Constructor
     *
     * @return ZendExt_Trace
     */
    private function __construct() {
        $this->_xml = ZendExt_FastResponse::getXML('traceconfig');
    }

    /**
     * Retorna una instancia
     *
     * @return ZendExt_Trace
     */
    public static function getInstance() {
        if (self::$_instance == null) {
            self :: $_instance = new self();
        }

        return self::$_instance;
    }

    /**
     * Maneja las trazas.
     *
     * @param ZendExt_Container_Log $pContainer
     * @return void
     */
    public function handle($pContainer) {
        $className = get_class($pContainer);
        $obj = $this->_xml->containers->$className;

        $enabled = (int) $obj ['enabled'];

        if ($enabled) {
            foreach ($obj->publishers->children() as $var) {
                if ($var ['enabled'] == true) {
                    $clase = (string) $var['class'];
                    $publisher = new $clase($pContainer);
                    $publisher->save($pContainer);
                }
            }

            foreach ($obj->triggers->children() as $var) {
                $enabled = (int) $var['enabled'];

                if ($enabled) {
                    $class = (string) $var['class'];
                    $method = (string) $var ['method'];

                    if (class_exists($class)) {
                        $trigger = new $class ();

                        if (method_exists($trigger, $method)) {
                            $trigger->$method();
                        } else
                            throw new ZendExt_Exception('TRACE002');
                    } else
                        throw new ZendExt_Exception('TRACE003');
                }
            }
        }
    }

}