<?php

/**
 * Class NomSubordinacionModel
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class NomSubordinacionModel extends ZendExt_Model
{
    /**
     *
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new NomSubordinacion();
    }

    /**
     * Descripción del método: Inserta una nueva subordinacion
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool Devuelve true en caso de que se haya adicionado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($data)
    {
        $object = new NomSubordinacion();
        $valores = $data[2];
        $denominacion = $valores->denominacion;
        $abreviatura = $valores->abreviatura;
        $fechainicio = $valores->fechainicio;
        $fechafin = $valores->fechafin;
        if (UtilModel::check_in_range($fechainicio, (empty($fechafin) ? date("d/m/Y") : $fechafin))) {
            $actual = UtilModel::getRealValue($valores->actual);
            $visible = UtilModel::getRealValue($valores->visible);
        } else {
            $actual = 0;
            $visible = 0;
        }
        $object->idnomsubordinacion = self::buscarIdProximo();
        $object->denominacion = ucfirst($denominacion);
        $object->abreviatura = $abreviatura;
        $object->actual = $actual;
        $object->visible = $visible;
        $object->fechainicio = $fechainicio;
        $object->fechafin = $fechafin;
        $object->save();
        return TRUE;
    }

    /**
     * Descripción del método: Modifica una subordinacion
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool Devuelve true en caso de que se haya modificado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function modificar($data)
    {
        $idSubordinacion = $data[0];
        $valores = $data[2];
        $denominacion = $valores->denominacion;
        $abreviatura = $valores->abreviatura;
        $fechainicio = $valores->fechainicio;
        $fechafin = ($valores->fechafin != "") ? $valores->fechafin : NULL;
        if (UtilModel::check_in_range($fechainicio, $fechafin)) {
            $actual = UtilModel::getRealValue($valores->actual);
            $visible = UtilModel::getRealValue($valores->visible);
        } else {
            if ($valores->fechafin == "") {
                $actual = 1;
                $visible = 1;
            } else {
                $actual = 0;
                $visible = 1;
            }
        }
        $subordinacion = Doctrine::getTable('NomSubordinacion')->find($idSubordinacion);
        if (is_object($subordinacion)) {
            $subordinacion->denominacion = ucfirst($denominacion);
            $subordinacion->abreviatura = $abreviatura;
            $subordinacion->actual = $actual;
            $subordinacion->visible = $visible;
            $subordinacion->fechainicio = $fechainicio;
            $subordinacion->fechafin = $fechafin;
            $subordinacion->save();
            return TRUE;
        }
        return FALSE;
    }

    /**
     * Descripción del método: Elimina la subordinacion atendiendo al identificador pasado por parametro
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return  bool Retorna TRUE si el elemento fue eliminado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminar($data)
    {
        $idSubordinacion = $data[0];
        $object = Doctrine::getTable('NomSubordinacion')->find($idSubordinacion);
        if (is_object($object)) {
            $object->delete();
            return TRUE;
        }
        return FALSE;
    }

    /**
     * Descripción del método: Desactiva la subordinacion especificada
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, Retorna TRUE si el elemento fue desactivado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function desactivar($data)
    {
        $idSubordinacion = $data[0];
        try{
            $object = Doctrine::getTable('NomSubordinacion')->find($idSubordinacion);
            $object->actual = 0;
            $object->visible = 0;
            $object->save();
            return TRUE;
        } catch (Doctrine_Exception $ee){
            return FALSE;
        }
    }

    /**
     * Descripción del método: Activa la subordinacion especificada
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, Retorna TRUE si el elemento fue activado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function activar($data)
    {
        $idSubordinacion = $data[0];
        try{
            $object = Doctrine::getTable('NomSubordinacion')->find($idSubordinacion);
            $object->actual = 1;
            $object->visible = 1;
            $object->save();
            return TRUE;
        } catch (Doctrine_Exception $ee){
            return FALSE;
        }
    }

    /**
     * Descripción del método: Devuelve el proximo identificador de las subordinaciones
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     * @return int : int, Devuelve el siguiente identificador de las subordinaciones
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarIdProximo()
    {
        $query = Doctrine_Query::create();
        $data = $query->select('max(a.idnomsubordinacion) as maximo')->from('NomSubordinacion a')->execute()->toArray();
        $proximo = isset($data[0]['maximo']) ? $data[0]['maximo'] + 1 : 1;
        return $proximo;
    }

    /**
     * Descripción del método: Busca las subordinacion
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return array, Devuelve un arreglo con los elementos en dicho rangos
     * @copyright Copyright (c) 2013 xetid
     */
    function buscar($data)
    {

      $limit = $data[0];
      $start = $data[1];
      $dir = $data[3];
      $sort = $data[4];
        $campo = ($sort != "") ? 's.' . $sort : 's.idnomsubordinacion';
        $orden = ($dir === "ASC") ? " ASC" : " DESC";
        $where = '1=1';
        if (count($data) == 3) {
            $data = $data[2];
            $valores = $data[1];
            $denominacion = $valores->denominacion;
            $abreviatura = $valores->abreviatura;
            if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
                $where .= " AND LOWER(s.denominacion) LIKE LOWER ('%$denominacion%')";
            }
            if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
                $where .= " AND LOWER(s.abreviatura) LIKE LOWER ('%$abreviatura%')";
            }
        }
        $query = Doctrine_Query::create();
        $result = $query->select('s.*, s.idnomsubordinacion as id')->from('NomSubordinacion s')
            ->where($where)->orderBy($campo . $orden)->limit($limit)->offset($start)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }



    /**
     * Descripción del método: Busca las subordinacion visibles
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return array, Devuelve un arreglo con los elementos en dicho rangos
     * @copyright Copyright (c) 2013 xetid
     */
    function buscarSubordinacionesVisibles($data)
    {
        $limit = $data[0];
        $start = $data[1];
        $where = 's.visible = 1';
        if (count($data) == 3) {
            $data = $data[2];
            $valores = $data[1];
            $denominacion = $valores->denominacion;
            $abreviatura = $valores->abreviatura;
            if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
                $where .= " AND LOWER(s.denominacion) LIKE LOWER ('%$denominacion%')";
            }
            if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
                $where .= " AND LOWER(s.abreviatura) LIKE LOWER ('%$abreviatura%')";
            }
        }
        $query = Doctrine_Query::create();
        $result = $query->from('NomSubordinacion s')->where($where . ' AND s.visible = 1')
            ->orderBy('s.idnomsubordinacion')->limit($limit)->offset($start)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    /**
     * Descripción del método: Devuelve la cantidad de subordinaciones que cumplen con la condicion insertada
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return mixed : int, Retorna la cantidad de elementos encontrados durante la busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public function cantidad($data)
    {
        $where = 's.fechafin IS NULL';
        if (count($data) > 1) {
            $valores = $data[1];
            $denominacion = $valores->denominacion;
            $abreviatura = $valores->abreviatura;
            if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
                $where .= " AND LOWER(s.denominacion) LIKE LOWER ('%$denominacion%')";
            }
            if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
                $where .= " AND LOWER(s.abreviatura) LIKE LOWER ('%$abreviatura%')";
            }
        }
        $query = Doctrine_Query::create();
        $result = $query->from('NomSubordinacion s')->where($where)->execute()->count();
        return $result;
    }
}