<?php
/**
 * ZendExt_GlobalConcept
 * Clase para obtener los conceptos globales y cargalos en la cache
 *
 * @author    Elianys Hurtado Sola
 * @package   ZendExt
 * @copyright ERP Cuba
 * @version   1.5.0
 */
class ZendExt_GlobalConcept
{

    /**
     * Constructor para formar un arreglo con todos los conceptos y salvarlo en la cache
     *
     */
    private function __construct()
    {

    }

    /**
     * Retorna una instancia de la clase
     */
    static public function getInstance()
    {
        static $instance;
        if (!isset($instance)) {
            $instance = new self();
        }
        return $instance;
    }

    /**
     * Funcion magica para obtener un concepto
     *
     * @param string $name
     *
     * @return object
     */
    public function __get($name)
    {
        return $this->ConcretConcept($name);
    }

    /**
     * Obtener todos los conceptos concretos que pertenecen a al mismo global que el concreto que se pasa por parametro
     *
     * @param string $concretconcept
     *
     * @return array
     */
    public function ConcretConcepts($concretconcept)
    {
        $xml = ZendExt_FastResponse :: getXML('concepts'); //cargo el xml de los conceptos
        if ($xml instanceof SimpleXMLElement) {
            $puntero = new ZendExt_GlobalConcept_ConceptConcret();
            $global = $puntero->ObtenerNombreGlobal($concretconcept, $xml);
            if ($global != false) { //si encontro el concepto
                return $puntero->ObtenerConceptoGlobal(
                    $global, $xml
                );
                //devuelve un array con todos los conceptos concretos pertenecientes
                //al global y si no encuentra nada se devuelve falso
            }
        }
        return false; //retornar falso si no se encontr� el concepto o no se cargo el xml
    }

    /**
     * Obtener un concepto en concreto
     *
     * @param string $concretconcept
     *
     * @return object
     */
    public function ConcretConcept($concretconcept)
    {
        $var = 'ZendExt_GlobalConcept_';
        $classname = $var . $concretconcept;
        if (@class_exists($classname)) {
            $puntero = new $classname();
            return $puntero->ObtenerConcepto();
        } else {
            return null;
        }
    }

    public function init()
    {
        $xml = ZendExt_FastResponse :: getXML('concepts'); //cargo el xml de los conceptos
        if ($xml instanceof SimpleXMLElement) {
            $array = array();
            $puntero = new ZendExt_GlobalConcept_ConceptConcret();
            foreach ($xml as $global) {
                if ((string)$global['active'] == 'true') {
                    $array[(string)$global['nombre']] = $puntero->ObtenerConceptoGlobal(
                        (string)$global['nombre'], $xml
                    );
                }
            }
        }
        return false; //si no encontro el xml retorna falso o si el array est� vacio
    }
}

