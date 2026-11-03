<?php

/**
 * @name Util - Clase usada para implementar funciones genericas que 
 * puedan ser usadas por los demas modelos.
 * @package seguridad
 * @copyright UCID
 * @author Darien García Tejo.
 * @version 2.0-0
 */
class SegUtil
{

    /**
     * @method convertToUnidimensional - Función usada para convertir un 
     * arreglo vidimencional a unidimencional.
     * @param array $array - Arreglo de valores.
     * @param string $indice - Indice por el que se realizara la converción.
     * @return array - Arreglo unidimencional.
     */
    public static function convertToUnidimensional($array, $indice)
    {
        $arrayResult = array();
        if (count($array) > 0) {
            foreach ($array as $values)
                array_push($arrayResult, $values[$indice]);
        }
        return $arrayResult;
    }

    /**
     * @method getPerfil - Función usada para retornar el concepto 
     * global del Perfil.
     * @return ZendExt_GlobalConcept_Perfil - Concepto global del Perfil.
     */
    public static function getPerfil()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        return $global->Perfil;
    }

    /**
     * @method Integrator - Función usada para retornar el objeto integrator.
     * @return ZendExt_IoC - Integrador.
     */
    public static function Integrator()
    {
        return ZendExt_IoC::getInstance();
    }

    /**
     * @method getValueIndexByIndex - Función genérica usada para retornar 
     * un valor especifico de un arreglo asociativo donde uno de sus indices 
     * tenga el valor deseado.
     * @param array $array - Arreglo de valores.
     * @param string $indexSearch - Índice de búsqueda.
     * @param string $value - Valor a buscar.
     * @param string $indexReturn - Índice a retornar.
     * @return string | FALSE - Retorna el valor en caso de que cumpla con 
     * las restricciones, False de lo contrario.
     */
    public static function getValueIndexByIndex(
        $array, $indexSearch, $value, $indexReturn
    )
    {
        foreach ($array as $row) {
            if ($row[$indexSearch] == $value)
                return $row[$indexReturn];
        }
        return FALSE;
    }

}