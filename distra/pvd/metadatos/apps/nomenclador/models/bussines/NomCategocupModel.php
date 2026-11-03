<?php

  /***
   * Class NomcategoriaocupacionalModel
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class NomCategocupModel extends ZendExt_Model
  {
    /**
     *
     */
    public function __construct()
    {
      parent::ZendExt_Model();
      $this->instance = new NomCategocup();
    }

    /**
     * Descripción del método: Inserta una categoría ocupacional
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool,si permite insertar la categoria ocupacional
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($data)
    {
      $object       = new NomCategocup();
      $valores      = $data[2];
      $denominacion = $valores->denominacion;
      $abreviatura  = $valores->abreviatura;
      $idcategoria  = $valores->idcategoria;
      $fechainicio  = $valores->fechainicio;
      $fechafin     = $valores->fechafin;
      if (UtilModel::check_in_range($fechainicio, (empty($fechafin) ? date("d/m/Y") : $fechafin))) {
        $actual  = UtilModel::getRealValue($valores->actual);
        $visible = UtilModel::getRealValue($valores->visible);
      } else {
        $actual  = 0;
        $visible = 0;
      }
      $object->idcategocup  = self::buscarIdProximo();
      $object->denominacion = strtoupper($denominacion);
      $object->idcategoria  = $idcategoria;
      $object->abreviatura  = $abreviatura;
      $object->actual       = $actual;
      $object->visible      = $visible;
      $object->fechainicio  = $fechainicio;
      $object->fechafin     = $fechafin;
      $object->orden        = self::buscarOrdenProximo();
      $object->save();

      return true;
    }

    /**
     * Descripción del método: Modifica la categoria ocupacional
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, Permite modificar la categoria ocupacional
     * @copyright Copyright (c) 2013 xetid
     */
    public function modificar($data)
    {
      $idCategoria  = $data[0];
      $valores      = $data[2];
      $denominacion = $valores->denominacion;
      $abreviatura  = $valores->abreviatura;
      $idcategoria  = $valores->idcategoria;
      $fechainicio  = $valores->fechainicio;
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
      $categoria = Doctrine::getTable('NomCategocup')->find($idCategoria);;
      if (is_object($categoria)) {
        $categoria->denominacion = strtoupper($denominacion);
        $categoria->abreviatura  = $abreviatura;
        $categoria->idcategoria  = $idcategoria;
        $categoria->actual       = $actual;
        $categoria->visible      = $visible;
        $categoria->fechainicio  = $fechainicio;
        $categoria->fechafin     = $fechafin;
        $categoria->save();

        return true;
      }

      return false;
    }

    /**
     * Descripción del método: Elimina la categoria ocupacional atendiendo al id pasado por parametro
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, retorna tru si se puede eliminar la categoria ocupacional
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminar($data)
    {
      $idCategoria = $data[0];
      $object      = Doctrine::getTable('NomCategocup')->find($idCategoria);
      if (is_object($object)) {
        $object->delete();

        return true;
      }

      return false;
    }

    /**
     * Descripción del método: Desactiva la categoria ocupacionalatendiendo al id pasado por parametro
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, retorna true y Desactiva la categoria ocupacional
     * @copyright Copyright (c) 2013 xetid
     */
    public function desactivar($data)
    {
      $idCategoria = $data[0];
      try{
        $object          = Doctrine::getTable('NomCategocup')->find($idCategoria);
        $object->actual  = 0;
        $object->visible = 0;
        $object->save();

        return true;
      } catch (Doctrine_Exception $ee){
        return false;
      }
    }

    /**
     * Descripción del método: Activa la categoria ocupacionalatendiendo al id pasado por parametro
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, retorna true y Activa la categoria ocupacional
     * @copyright Copyright (c) 2013 xetid
     */
    public function activar($data)
    {
      $idCategoria = $data[0];
      try{
        $object          = Doctrine::getTable('NomCategocup')->find($idCategoria);
        $object->actual  = 1;
        $object->visible = 1;
        $object->save();

        return true;
      } catch (Doctrine_Exception $ee){
        return false;
      }
    }

    /**
     * Descripción del método: Devuelve la cantidad de categorias ocupacionales
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return int : int, Retorna la cantidad de elementos encontrados durante la busqueda
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
          $where .= " AND LOWER(c.denominacion) LIKE LOWER ('%$denominacion%')";
        }
        if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
          $where .= " AND LOWER(c.abreviatura) LIKE LOWER ('%$abreviatura%')";
        }
      }
      $query  = Doctrine_Query::create();
      $result = $query->from('NomCategocup c')->where($where)->execute()->count();

      return $result;
    }

    /**
     * Descripción del método: Devuelve el proximo id de la tabla
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     * @return int : int, Devuelve el siguiente identificador de las categorias ocupacionales
     * @copyright Copyright (c) 2013 xetid
     */
    function buscarIdProximo()
    {
      $query   = Doctrine_Query::create();
      $result  = $query->select('max(a.idcategocup) as maximo')->from('NomCategocup a')->execute()->toArray();
      $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;

      return $proximo;
    }

    /**
     * Descripción del método:  Muestra los elementos de la categoria ocupacional
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, Devuelve un arreglo con los elementos encontrados en la tabla
     * @copyright Copyright (c) 2013 xetid
     */
    function buscar($data)
    {
      $limit = $data[0];
      $start = $data[1];
      $dir   = $data[3];
      $sort  = $data[4];
      $data  = $data[2];
      if ($sort === 'denominacion') {
        $esquema = "c." . $sort;
      } elseif ($sort === 'abreviatura') {
        $esquema = "cg." . $sort;
      } elseif ($sort === 'fechainicio') {
        $esquema = "c." . $sort;
      } elseif ($sort === 'fechafin') {
        $esquema = "c." . $sort;
      } else {
        $sort = '';
      }
      $campo        = ($sort != "") ? $esquema : "c.idcategocup";
      $orden        = ($dir === "ASC") ? " ASC" : " DESC";
      $valores      = $data[1];
      $denominacion = $valores->denominacion;
      $abreviatura  = $valores->abreviatura;
      $where        = '1=1';
      if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
        $where .= " AND LOWER(c.denominacion) LIKE LOWER ('%$denominacion%')";
      }
      if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
        $where .= " AND LOWER(c.abreviatura) LIKE LOWER ('%$abreviatura%')";
      }
      $query  = Doctrine_Query::create();
      $result = $query->select('c.*, c.idcategocup as id, cg.denominacion as categoria')->from('NomCategocup c')
                      ->innerJoin('c.NomCategoria cg')->where($where)->orderBy(
                      $campo . $orden
        )->limit($limit)->offset($start)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

      return $result;
    }

    /**
     * Descripción del método: Devuelve el proximo orden de la tabla
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     * @return int : int, Devuelve el siguiente orden de la tabla
     * @copyright Copyright (c) 2013 xetid
     */
    function buscarOrdenProximo()
    {
      $query   = Doctrine_Query::create();
      $result  = $query->select('max(a.orden) as maximo')->from('NomCategocup a')->execute()->toArray();
      $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;

      return $proximo;
    }

    /**
     * Descripción del método: Devuelve la(s) categorias civiles
     *
     * @autor     : Ing. Osvaldo Manuel Gonzalez Ortis
     *
     * @param     $idCategoria
     * @param     $start
     * @param     $limit
     *
     * @return array
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameCategorias($idCategoria, $start, $limit)
    {
      $where = 'c.fechafin IS NULL';
      if (is_numeric($idCategoria)&& $idCategoria!=0) {
        $where .= " AND c.idcategocup = $idCategoria";
      }
      $query = Doctrine_Query::create();
      $query->select('c.*, c.idcategocup as id')->from('NomCategocup c')->where($where)->orderBy(
            'c.idcategocup'
      );
      if ($limit) {
        $query->limit($limit);
        $query->offset($start);
      }
      $result = $query->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

      return $result;
    }
  }