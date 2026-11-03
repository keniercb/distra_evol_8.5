<?php

/**
 * Componente para gestionar las los formatos de las entidades.
 *
 * @package    Configuración
 * @subpackage Formatos/Models/Bussines
 * @copyright  XETID
 * @version    1.0
 */
class IFormato extends ZendExt_Model
{

    /**
     * Obtener formato
     *
     * @param  int $idformato Identificador de formato
     * @return array Retorna un arreglo con los datos del formato
     * 
     */
    public static function getFormato($idformato = 0) 
    {
        $formatos = DatFormato::Formatos('', array('idformato' => $idformato));
        if ($formatos) {
            $standard = new ZendExt_ClassStandard();
            if (!$idformato && $formatos)
                return $standard->ArrayObject($formatos);
            else
                return $standard->Object($formatos);
        }
        return array();
    }

    /**
     * Obtener nivel formato
     *
     * @param  int $idformato Identificador de formato
     * @return array Retorna un arreglo con los datos del formato
     * 
     */
    public static function getNiveldeFormato($idformato) 
    {
        $standard = new ZendExt_ClassStandard();
        $parteformato = DatParteformato::ParteFormato('', array('idformato' => $idformato));
        if ($parteformato)
            return $standard->ArrayObject($parteformato);
        return array();
    }

    /**
     * Obtener formatos
     *
     * @param  int $idformato Identificador de formato
     * @return array Retorna un arreglo con los datos del formato
     * 
     */
    public static function getFormatos($idformato) 
    {
        $formatos = datFormato::Formatos('', array('idformato' => $idformato));
        $array = NULL;
        $field = array_keys($formatos[0]);
        $i = 0;
        foreach ($formatos as $vlp) {
            $array[] = new stdClass();
            foreach ($field as $j => $d)
                $j++;
                $array[$i]->$d = $vlp[$d];
            $i++;
        }
        return $array;
    }

}