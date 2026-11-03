<?php

/**
* ZendExt_GlobalConcept_ConceptConcret
* Clase para obtener y conformar los conceptos concretos
*
* @author Elianys Hurtado Sola
* @package ZendExt
* @subpackage GlobalConcept
* @copyright ERP Cuba 
* @version 1.5.0
*/
class ZendExt_GlobalConcept_ConceptConcret
{
    /**
     * Constructor de la clase
     */
    public function ZendExt_GlobalConcept_ConceptConcret()
    {

    }

    /**
	 * Método para obtener un concepto en específico
	 *
	 * @param string $concept
	 * @param SimpleXMLElement $xml
	 * @return object
	 */
    public function ObtenerConcepto($concept, $xml)
    {
        foreach ($xml as $global) {
            foreach ($global as $concret) {
                if (strtolower($concret['nombre'])==strtolower($concept)) {
                    $temp=$concept;
                    $dir='ZendExt_GlobalConcept_';
                    $classname=$dir.$temp;
                    $puntero= new $classname();
                    $return=$puntero->ObtenerConcepto();
                    return $return;
                }
            }
        }
        return false;
    }

    /**
     * Método para obtener los conceptos concretos que pertenen al concepto global que se pasa por parametro
     *
     * @param string $globalconcept
     * @param SimpleXMLElement $xml
     *
     * @return array|bool
     */
    public function ObtenerConceptoGlobal($globalconcept,$xml)
    {
        $arr=array();
        $dir='ZendExt_GlobalConcept_';
        foreach ($xml as $global) {
            if ((string)$global['nombre']==(string)$globalconcept) {
                if (count($global)>0) {
                    foreach ($global as $concret) {
                        $var=(string) $concret['nombre'];
                        $classname=$dir.$var;
                        $puntero=new $classname();
                        $arr[(string) $concret['nombre']]=$puntero->ObtenerConcepto();
                    }
                    if (count($arr)>0) {
                        return $arr;
                    }
                } else {
                    $classname=$dir.$globalconcept;
                    $puntero= new $classname();
                    return  $puntero->ObtenerConcepto();
                }
            }
        }
        return false;
    }

    /**
     * Obtener el nombre del concepto global al que pertenece un concepto concreto
     *
     * @param string $concept
     * @param SimpleXMLElement $xml
     *
     * @return string|bool
     */
    public function ObtenerNombreGlobal($concept,$xml)
    {
        foreach ($xml as $global) {
            foreach ($global as $concret) {
                if (strtolower($concret['nombre'])==strtolower($concept)) {
                    return (string)$global['nombre'];
                }
            }
        }
        return false;
    }
}


