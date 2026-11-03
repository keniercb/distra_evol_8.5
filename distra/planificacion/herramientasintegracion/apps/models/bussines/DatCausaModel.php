<?php

class DatCausaModel extends ZendExt_Model
{
    public function setUp() {
        parent::ZendExt_Model();
    }

    public static function crearCausa($idcategoria, $denominacion) {
        $datCausa = new DatCausa();
        $datCausa->idcategoria = $idcategoria;
        $datCausa->denominacion = $denominacion;
        return $datCausa;
    }

    public static function guardarCausa($objCausa) {
        $data = array();
        try {
            $idcategoria = $objCausa['idcategoria'];
            $denominacion = $objCausa['denominacion'];
            $idcategoria = $objCausa['idcategoria'];
            $buscar = self::buscarCausa($denominacion, $idcategoria);
            if (count($buscar) > 0) {
                $data = array("cod" => 1, "mensaje" => "La causa que quiere adicionar ya existe.");
            } else {
                $newObjCausa = self::crearCausa($idcategoria, $denominacion);
                if ($objCausa['idpadre'] != null && isset($objCausa['idpadre'])) {
                    $newObjCausa->idpadre = $objCausa['idpadre'];
                }
                $newObjCausa->save();
                $data = $newObjCausa->toArray();
            }
        } catch (Exception $ex) {
            $data = array("cod" => 3, "mensaje" => $ex->getMessage());
        }
        return $data;
    }

    public static function modificarCausa($objCausa) {
        $data = array();
        try {
            $idcausa = $objCausa['idcausa'];
            $denominacion = $objCausa['denominacion'];
            $idcategoria = $objCausa['idcategoria'];
            $buscar = self::buscarCausa($denominacion, $idcategoria);
            if (count($buscar) > 0) {
                $data = array("cod" => 1, "mensaje" => "Ya existe una causa con esta denominaci&oacute;n.");
            } else {
                $newObjCausa = DatCausa::getByid($idcausa);
                $newObjCausa->denominacion = $denominacion;
                $newObjCausa->save();
                $data = $newObjCausa->toArray();
            }
        } catch (Exception $ex) {
            $data = array("cod" => 3, "mensaje" => $ex->getMessage());
        }
        return $data;
    }

    public static function eliminarCausa($objCausa) {
        $data = false;
        $idcausa = $objCausa['idcausa'];
        $newObjCausa = DatCausa::getByid($idcausa);
        if ($newObjCausa != null && isset($newObjCausa)) {
            $data = $newObjCausa->delete();
        }
        return $data;
    }

    public static function buscarCausa($denominacion, $idcategoria = false) {
        return DatCausa::buscarCausa($denominacion, $idcategoria);
    }
    
    public static function findCausa($denominacion, $idcategoria, $idefecto) {
        return DatCausa::findCausa($denominacion, $idcategoria, $idefecto);
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name getCausasByEstudio
     * @param $idEstudio : Identificador del estudio
     * @param $start : Inicio de la selecciona de datos
     * @param $limit : Cantidad de elementos a seleccionar
     * @use Funcion para obtener las causas del estudio
     * @return mixed
     */
    public static function getCausasByEstudio($idEstudio, $start, $limit) {
        return DatCausa::getCausasByEstudio($idEstudio, $start, $limit);
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name getCausaDenominacion
     * @param $idCausa :Identificador de la causa
     * @use Funcion para obtener la denominacion de la causa
     * @return mixed
     */
    public static function getCausaDenominacion($idCausa) {
        return DatCausa::getByCausa($idCausa);
    }
}
