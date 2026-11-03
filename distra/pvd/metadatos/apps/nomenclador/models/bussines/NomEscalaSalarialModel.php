<?php

/**
 * Descripción del método: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate  *
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomEscalaSalarialModel extends ZendExt_Model
{
    /**
     *
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new NomEscalaSalarial();
    }

    /**
     * Descripción del método: Inserta una nueva escala salarial
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool :bool Devuelve TRUE en caso de que se haya adicionado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($data)
    {
        $object = new NomEscalaSalarial();
        $valores = $data[2];
        $idTipoEscala = strtoupper($valores->idtipoescala);
        $idSalario = strtoupper($valores->idsalario);
        $fechainicio = $valores->fechainicio;
        $fechafin = $valores->fechafin;
        if (UtilModel::check_in_range($fechainicio, (empty($fechafin) ? date("d/m/Y") : $fechafin))) {
            $actual = UtilModel::getRealValue($valores->actual);
            $visible = UtilModel::getRealValue($valores->visible);
        } else {
            $actual = 0;
            $visible = 0;
        }
        $object->idtipoescala = $idTipoEscala;
        $object->idsalario = $idSalario;
        $object->actual = $actual;
        $object->visible = $visible;
        $object->fechainicio = $fechainicio;
        $object->fechafin = $fechafin;
        $object->save();
        return TRUE;
    }

    /**
     * Descripción del método: Modifica una escala salarial determinada
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool :bool Devuelve TRUE en caso de que se haya modificado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function modificar($data)
    {
        $idEscala = $data[0];
        $valores = $data[2];
        $idTipoEscala = $valores->idtipoescala;
        $idSalario = $valores->idsalario;
        $fechainicio = $valores->fechainicio;
        $fechafin = ($valores->fechafin != "") ? $valores->fechafin : NULL;

        if (UtilModel::check_in_range($fechainicio, $fechafin)) {
            $actual = UtilModel::getRealValue($valores->actual);
            $visible = UtilModel::getRealValue($valores->visible);
        }  else {
            if ($valores->fechafin == "") {
                $actual = 1;
                $visible = 1;
            } else {
                $actual = 0;
                $visible = 1;
            }
        }
        $escala = Doctrine::getTable('NomEscalaSalarial')->find($idEscala);
        if (is_object($escala)) {
            $escala->idtipoescala = $idTipoEscala;
            $escala->idsalario = $idSalario;
            $escala->actual = $actual;
            $escala->visible = $visible;
            $escala->fechainicio = $fechainicio;
            $escala->fechafin = $fechafin;
            $escala->save();
            return TRUE;
        }
        return FALSE;
    }

    /**
     * Descripción del método: Elimina una escala salarial determinada
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool :bool Devuelve TRUE en caso de que se haya eliminado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminar($data)
    {
        $idEscala = $data[0];
        $object = Doctrine::getTable('NomEscalaSalarial')->find($idEscala);
        if (is_object($object)) {
            $object->delete();
            return TRUE;
        }
        return FALSE;
    }

    /**
     * Descripción del método: Desactiva una escala salarial determinada
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool :bool Devuelve TRUE en caso de que se haya desactivado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function desactivar($data)
    {
        $idEscala = $data[0];
        try{
            $object = Doctrine::getTable('NomEscalaSalarial')->find($idEscala);
            $object->actual = 0;
            $object->visible = 0;
            $object->save();
            return TRUE;
        } catch (Doctrine_Exception $ee){
            return FALSE;
        }
    }

    /**
     * Descripción del método: Activa una escala salarial determinada
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool :bool Devuelve TRUE en caso de que se haya activado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function activar($data)
    {
        $idEscala = $data[0];
        try{
            $object = Doctrine::getTable('NomEscalaSalarial')->find($idEscala);
            $object->actual = 1;
            $object->visible = 1;
            $object->save();
            return TRUE;
        } catch (Doctrine_Exception $ee){
            return FALSE;
        }
    }

    /**
     * Descripción del método: Devuelve la cantidad de escala salariales
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @internal  param $ : string $denominacion, Denominacion de la preparación
     * @internal  param $ : string $abraviatura, Abraviatura de la preparación
     * @return int : int, Retorna la cantidad de elementos encontrados durante la busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public function cantidad($data)
    {
        $where = '1=1';
        if (count($data) > 1) {
            $valores = $data[1];
            $idtipoescala = $valores->idtipoescala;
            $idgrupocomplejidad = $valores->idgrupocomplejidad;
            if (is_numeric($idtipoescala)) {
                $where .= " AND esc.idtipoescala = $idtipoescala";
            }
            if (is_numeric($idgrupocomplejidad)) {
                $where .= " AND sal.idgrupocomplejidad = $idgrupocomplejidad";
            }
        }
        $query = Doctrine_Query::create();
        $result = $query->from('NomEscalaSalarial esc')->innerJoin("esc.NomSalario sal")->where($where)->execute()
                        ->count();
        return $result;
    }

    /**
     * Descripción del método: Devuelve un arreglo con las escala salariales que cumplan con las condiciones
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     *
     * @param        $data
     * @param string $addWhere
     * @param bool   $reporte
     *
     * @return mixed, devuelve un arreglo con las escala salariales
     * @copyright Copyright (c) 2013 xetid
     */
    function buscar($data, $addWhere = '1=1', $reporte = FALSE)
    {
        $where = '1=1';
        $limit = $data[0];
        $start = $data[1];
        $dir = $data[3];
        $sort = $data[4];
        if ($sort === 'tipoescala') {
            $sort = 'denominacion';
            $esquema = "te." . $sort;
        }
        if ($sort === 'grupocomplejidad') {
            $sort = 'denominacion';
            $esquema = "gc." . $sort;
        }
        if ($sort === 'salario') {
            $esquema = "sal." . $sort;
        }
        if ($sort === 'fechainicio') {
            $esquema = "esc." . $sort;
        }
        if ($sort === 'fechafin') {
            $esquema = "esc." . $sort;
        }
        $campo = ($sort != "") ? $esquema : "esc.idescalasalarial";
        $orden = ($dir === "ASC") ? " ASC" : " DESC";
        if (!$reporte) {
            $data = $data[2];
            $valores = $data[1];
            $idtipoescala = $valores->idtipoescala;
            $idgrupocomplejidad = $valores->idgrupocomplejidad;
            if (is_numeric($idtipoescala)) {
                $where .= " AND esc.idtipoescala = $idtipoescala";
            }
            if (is_numeric($idgrupocomplejidad)) {
                $where .= " AND sal.idgrupocomplejidad = $idgrupocomplejidad";
            }
        }
        $query = Doctrine_Query::create();
        $result = $query->select(
                        '
                                                          esc.*,
                                                          esc.idescalasalarial as id,
                                                          te.denominacion as tipoescala,
                                                          te.idtipoescala as idtipoescala,
                                                          sal.salario as salario,
                                                          sal.idsalario as idsalario,
                                                          gc.denominacion as grupocomplejidad,
                                                          gc.idgrupocomplejidad as idgrupocomplejidad'
        )->from('NomEscalaSalarial esc')->innerJoin("esc.NomTipoEscala te")->innerJoin(
                        "esc.NomSalario sal"
            )->innerJoin("sal.NomGrupocomplejidad gc")->where($where)->addWhere($addWhere)->orderBy(
                        $campo . $orden
            )->limit($limit)->offset($start)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }
}