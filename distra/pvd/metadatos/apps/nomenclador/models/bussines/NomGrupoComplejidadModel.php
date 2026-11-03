<?php

  /**
   * Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   * @version   Release: @package_version@
   */
  class NomGrupoComplejidadModel extends ZendExt_Model
  {
    /**
     *
     */
    public function __construct()
    {
      parent::ZendExt_Model();
      $this->instance = new NomGrupocomplejidad();
    }

    /**
     * Descripción del método: Inserta un nuevo Grupo complejidad
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : Permite insertar el elemento en la base de datos
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($data)
    {
      $object       = new NomGrupocomplejidad();
      $valores      = $data[2];
      $denominacion = $valores->denominacion;
      $abreviatura  = $valores->abreviatura;
      $fechainicio  = $valores->fechainicio;
      $fechafin     = $valores->fechafin;
      if (UtilModel::check_in_range($fechainicio, (empty($fechafin) ? date("d/m/Y") : $fechafin))) {
        $actual  = UtilModel::getRealValue($valores->actual);
        $visible = UtilModel::getRealValue($valores->visible);
      } else {
        $actual  = 0;
        $visible = 0;
      }
      $object->idgrupocomplejidad = self::buscarIdProximo();
      $object->denominacion       = ucfirst($denominacion);
      $object->abreviatura        = $abreviatura;
      $object->actual             = $actual;
      $object->visible            = $visible;
      $object->fechainicio        = $fechainicio;
      $object->fechafin           = $fechafin;
      $object->save();

      return true;
    }

    /**
     * Descripción del método: Modifica un nuevo Grupo complejidad
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : Permite modificar el elemento en la base de datos
     * @copyright Copyright (c) 2013 xetid
     */
    public function modificar($data)
    {
      $idgrupocomplejidad = $data[0];
      $valores            = $data[2];
      $denominacion       = $valores->denominacion;
      $abreviatura        = $valores->abreviatura;
      $fechainicio        = $valores->fechainicio;
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
      $cargo = Doctrine::getTable('NomGrupocomplejidad')->find($idgrupocomplejidad);
      if (is_object($cargo)) {
        $cargo->denominacion = ucfirst($denominacion);
        $cargo->abreviatura  = $abreviatura;
        $cargo->actual       = $actual;
        $cargo->visible      = $visible;
        $cargo->fechainicio  = $fechainicio;
        $cargo->fechafin     = $fechafin;
        $cargo->save();

        return true;
      }

      return false;
    }

    /**
     * Descripción del método: Elimina la instancia de la tabla atendiendo al id pasado por parametro
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : Elimina la instancia de la tabla
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminar($data)
    {
      $idGrupoComplejidad = $data[0];
      $object             = Doctrine::getTable('NomGrupocomplejidad')->find($idGrupoComplejidad);
      if (is_object($object)) {
        $object->delete();

        return true;
      }

      return false;
    }

    /**
     * Descripción del método: Desactiva el grupo complejidad especificado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : Desactiva el nomenclador
     * @copyright Copyright (c) 2013 xetid
     */
    public function desactivar($data)
    {
      $idGrupoComplejidad = $data[0];
      try{
        $object          = Doctrine::getTable('NomGrupocomplejidad')->find($idGrupoComplejidad);
        $object->actual  = 0;
        $object->visible = 0;
        $object->save();

        return true;
      } catch (Doctrine_Exception $ee){
        return false;
      }
    }

    /**
     * Descripción del método: Activa el grupo complejidad especificado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : Activa el nomenclador
     * @copyright Copyright (c) 2013 xetid
     */
    public function activar($data)
    {
      $idGrupoComplejidad = $data[0];
      try{
        $object          = Doctrine::getTable('NomGrupocomplejidad')->find($idGrupoComplejidad);
        $object->actual  = 1;
        $object->visible = 1;
        $object->save();

        return true;
      } catch (Doctrine_Exception $ee){
        return false;
      }
    }

    /**
     * Descripción del método: Devuelve el proximo id de la tabla
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     * @return int : Devuelve el siguiente id de la tabla
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarIdProximo()
    {
      $query   = Doctrine_Query::create();
      $result  = $query->select('max(g.idgrupocomplejidad) as maximo')->from('NomGrupocomplejidad g')->execute()
                       ->toArray();
      $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;

      return $proximo;
    }

    /**
     * Descripción del método: Devuelve la cantidad de elementos segun los filtros de busquedas
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return int : mixed, Retorna la cantidad de elementos encontrados durante la busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public function cantidad($data)
    {
      $where = '1=1';
      if (count($data) > 1) {
        $valores      = $data[1];
        $denominacion = $valores->denominacion;
        $abreviatura  = $valores->abreviatura;
        if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
          $where .= " AND LOWER(gc.denominacion) LIKE LOWER ('%$denominacion%')";
        }
        if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
          $where .= " AND LOWER(gc.abreviatura) LIKE LOWER ('%$abreviatura%')";
        }
      }
      $query  = Doctrine_Query::create();
      $result = $query->from('NomGrupocomplejidad gc')->where($where)->execute()->count();

      return $result;
    }

    /**
     * Descripción del método: Devuelve un arreglo con los grupos de complejidad
     *
     * @modify    : Ing. Pedro Alberto Jiménez
     *
     * @param     $data
     *
     * @return mixed, devuelve un arreglo con los identificadores, denominaciones y abreviaturas de los medios
     * @copyright Copyright (c) 2013 xetid
     */
    function buscar($data)
    {
      $limit        = $data[0];
      $start        = $data[1];
      $dir          = $data[3];
      $sort         = $data[4];
      $data         = $data[2];
      $campo        = ($sort != "") ? "gc." . $sort : "gc.idgrupocomplejidad";
      $orden        = ($dir === "ASC") ? " ASC" : " DESC";
      $valores      = $data[1];
      $denominacion = $valores->denominacion;
      $abreviatura  = $valores->abreviatura;
      $where        = '1=1';
      if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
        $where .= " AND LOWER(gc.denominacion) LIKE LOWER ('%$denominacion%')";
      }
      if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
        $where .= " AND LOWER(gc.abreviatura) LIKE LOWER ('%$abreviatura%')";
      }
      $query  = Doctrine_Query::create();
      $result = $query->select('gc.*, gc.idgrupocomplejidad as id')->from('NomGrupocomplejidad gc')->where($where)
                      ->orderBy($campo . $orden)->limit($limit)->offset($start)->setHydrationMode(
                      Doctrine::HYDRATE_ARRAY
        )->execute();

      return $result;
    }
  }