<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatFuncionalidadModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    function insertarfuncionalidad($instance)
    {
        $instance->save();
        return $instance->idfuncionalidad;
    }

    function modificarfuncionalidad($instance)
    {
        $instance->save();
    }

    function eliminarfuncionalidad($instance)
    {
        $instance->delete();
    }

    public static function getMenuFuncionalidad($referencia)
    {
        $arrays = DatFuncionalidad::getMenuFuncionalidad($referencia);
        if (count($arrays > 0)) {
            $idsistema = $arrays[0]['idsistema'];
            $denominacion = $arrays[0]['denominacion'];
            $idfuncionalidad = $arrays[0]['idfuncionalidad'];
            while (true) {
                $arrays = DatSistema::getMyPadre($idsistema);
                $idpadre = $arrays[0]['idpadre'];
                $denominacion = $arrays[0]['denominacion'] . "/" . $denominacion;
                if ($idpadre == $idsistema) {
                    break;
                }
                $idsistema = $idpadre;
                $idpadre = "";
            }
            return array(
                "menu" => $denominacion, 
                "idfuncionalidad" => $idfuncionalidad
            );
        }
        return null;
    }

}
