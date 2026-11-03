<?php

/**
 * Clase modelo para gestionar los efectos del componente
 * diagrama Causa-Efecto(Ishikawa).
 *
 * @author ohgonzalez
 * @copyright (c) 2015, xetid
 * @version 1.0
 * @package pye
 */
class DatEfectoModel extends ZendExt_Model
{

    public static function cargarArbolCausaEfecto($type, $objeto)
    {
        $data = array();
        switch ($type) {
            case 'root': {
                $idproyecto = $objeto['idproyecto'];
                $objEfecto = self::obtenerEfecto($idproyecto);
                $objEfecto['qtip']=$objEfecto['denominacion'].' :<b> Se refiere al problema</b>';
                $childrenCategoria = DatCategoria::getByEfecto($objEfecto['idefecto']);
                $arrayChildren = array();
                foreach ($childrenCategoria as $objCategoria) {
                    $idcategoria = $objCategoria['idcategoria'];
                    $childrenCausa = DatCausa::getByCategoria($idcategoria);
                    foreach ($childrenCausa as $k=>$value) {
                        $childrenCausa[$k]['qtip'] = $value['denominacion'] . ': <b> Nivel 2</b>';
                    }
                    $objCategoria['children'] = $childrenCausa;
                    $objCategoria['qtip'] = $objCategoria['denominacion'] . ': <b> Nivel 1</b>';
                    $objCategoria['leaf'] = count($childrenCausa) > 0 ? false : true;
                    array_push($arrayChildren, $objCategoria);
                }
                $objEfecto['children'] = $arrayChildren;
                $objEfecto['leaf'] = count($arrayChildren) > 0 ? false : true;
                array_push($data, $objEfecto);
                break;
            }
            case 'causa': {
                $idcausa = $objeto['idcausa'];
                $data = DatCausa::getByCausa($idcausa);
                foreach ($data as $k=>$value) {
                    $data[$k]['qtip'] = $value['denominacion'] . ': <b> Nivel 3</b>';
                }

            }
        }
        return $data;
    }

    public static function obtenerEfecto($idproyecto)
    {
        $data = array();
        $arrayDatos = DatEfecto::getByProyecto($idproyecto);
        if (count($arrayDatos) > 0) {
            $arrayEfecto = $arrayDatos['DatEfecto'];
            $objEfecto = $arrayEfecto[0];
            $data = $objEfecto;
        } else {
            $objEstudio = DatEstudiocausaefectoModel::obtenerEstudioByProyecto($idproyecto);
            $idestudiocausaefecto = $objEstudio->idestudiocausaefecto;
            $denominacion = "denominación del efecto";
            $objDatEfecto = self::crearDatEfecto($idestudiocausaefecto, $denominacion, null);
            $objDatEfecto->save();
            $data = $objDatEfecto->toArray();
        }
        return $data;
    }

    public static function crearDatEfecto($idestudiocausaefecto, $denominacion, $descripcion)
    {
        $datEfecto = new DatEfecto();
        $datEfecto->idestudiocausaefecto = $idestudiocausaefecto;
        $datEfecto->denominacion = $denominacion;
        $datEfecto->descripcion = $descripcion;
        return $datEfecto;
    }

    public static function modificarEfecto($objEfecto)
    {
        $idefecto = $objEfecto['idefecto'];
        $newObjEfecto = DatEfecto::getByid($idefecto);
        $newObjEfecto->denominacion = $objEfecto['denominacion'];
        $newObjEfecto->descripcion = $objEfecto['descripcion'];
        $newObjEfecto->save();
        return $newObjEfecto->toArray();
    }

    public static function generarDiagrama($objeto)
    {
        $idefecto = $objeto['idefecto'];
        $query = DatCategoria::getByDiagram($idefecto);
        return $query;
    }

    public static function listarCausa($objeto)
    {
        $data = array();
        $onlyHojas = $objeto['onlyHojas'];
        $idefecto = $objeto['idefecto'];
        $query = DatCategoria::getByDiagram($idefecto);
        foreach ($query as $category) {
            $arrayCausa = $category['DatCausa'];
            if (count($arrayCausa) > 0) {
                if($onlyHojas){
                    foreach ($arrayCausa as $causa) {
                        if(($causa['rgt'] - $causa['lft']) == 1){
                            array_push($data, $causa);
                        }
                    }
                }else{
                    array_push($data, $category['DatCausa']);
                }
            }
        }
        return $data;
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

}
