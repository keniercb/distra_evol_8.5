<?php

  /***
   * Class NomIconoModel
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class NomIconoModel extends ZendExt_Model
  {
    /**
     *
     */
    public function __construct()
    {
      parent::ZendExt_Model();
      $this->instance = new NomIcono();
    }

    /**
     * Descripción del método: Inserta un nuevo icono
     *
     * @author    :Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool TRUE si se logro adicionar satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($data)
    {
      $object               = new NomIcono();
      $valores              = $data[2];
      $denominacion         = $valores->denominacion;
      $icono                = $valores->icono;
      $fechainicio          = $valores->fechainicio;
      $concepto             = UtilModel::getRealValue($valores->concepto);
      $medio                = UtilModel::getRealValue($valores->medio);
      $grado                = UtilModel::getRealValue($valores->grado);
      $logo                 = UtilModel::getRealValue($valores->logo);
      $object->denominacion = ucfirst($denominacion);
      $object->icono        = $icono;
      $object->concepto     = $concepto;
      $object->medio        = $medio;
      $object->grado        = $grado;
      $object->logo         = $logo;
      $object->fechainicio  = $fechainicio;
      $object->save();

      return true;
    }

    /**
     * Descripción del método: Modifica un icono especificado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool TRUE si se logro modificar satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function modificar($data)
    {
      $idIcono      = $data[0];
      $valores      = $data[2];
      $denominacion = $valores->denominacion;
      $icono        = $valores->icono;
      $fechainicio  = $valores->fechainicio;
      $concepto     = UtilModel::getRealValue($valores->concepto);
      $medio        = UtilModel::getRealValue($valores->medio);
      $grado        = UtilModel::getRealValue($valores->grado);
      $logo         = UtilModel::getRealValue($valores->logo);
      $object       = Doctrine::getTable('NomIcono')->find($idIcono);
      if (is_object($object)) {
        $object->denominacion = ucfirst($denominacion);
        $object->icono        = $icono;
        $object->concepto     = $concepto;
        $object->medio        = $medio;
        $object->grado        = $grado;
        $object->logo         = $logo;
        $object->fechainicio  = $fechainicio;
        $object->save();

        return true;
      }

      return false;
    }

    /**
     * Descripción del método: Elimina el icono especificado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool TRUE si se logro eliminar satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminar($data)
    {
      $idIcono = $data[0];
      $object  = Doctrine::getTable('NomIcono')->find($idIcono);
      if (is_object($object)) {
        $object->delete();

        return true;
      }

      return false;
    }

    /**
     * Descripción del método: Devuelve la cantidad de iconos que cumplen con la condicion insertada
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return mixed : int, Retorna la cantidad de elementos encontrados durante la busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public function cantidad($data)
    {
      $where = 'i.fechafin IS NULL';
      if (count($data) > 1) {
        $valores      = $data[1];
        $denominacion = $valores->denominacion;
        if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
          $where .= " AND LOWER(i.denominacion) LIKE LOWER ('%$denominacion%')";
        }
      }
      $query  = Doctrine_Query::create();
      $result = $query->from('NomIcono i')->where($where)->execute()->count();

      return $result;
    }

    /**
     * Descripción del método: Busca uno o varios iconos
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : Permite buscar uno o varios elemento en
     * la base de datos atendiendo a los criterios de busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    function buscar($data)
    {
      $limit = $data[0];
      $start = $data[1];
      $dir   = $data[3];
      $sort  = $data[4];
      $campo = ($sort != "") ? 'i.' . $sort : 'i.idicono';
      $orden = ($dir === "ASC") ? " ASC" : " DESC";
      $data         = $data[2];
      $valores      = $data[1];
      $denominacion = $valores->denominacion;
      $where        = 'i.fechafin IS NULL';
      if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
        $where .= " AND LOWER(i.denominacion) LIKE LOWER ('%$denominacion%')";
      }
      $query  = Doctrine_Query::create();
      $result = $query->select('i.*, i.idicono as id')->from('NomIcono i')->where($where)->orderBy($campo . $orden)
                      ->limit($limit)->offset($start)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

      return $result;
    }

    /**
     * @param $tipos
     *
     * @return Doctrine_Collection
     */
    public function dameIconosPorTipo($tipos)
    {
      $query = Doctrine_Query::create();
      $where = 'fechafin IS NULL';
      if (is_array($tipos)) {
        foreach ($tipos as $value) {
          $where .= " AND $value = 1 ";
        }
      } else {
        $where .= " AND $tipos = 1 ";
      }
      $iconos = $query->from('NomIcono')->where($where)->orderBy('idicono')->setHydrationMode(
                      Doctrine::HYDRATE_ARRAY
      )->execute();

      return $iconos;
    }
  }