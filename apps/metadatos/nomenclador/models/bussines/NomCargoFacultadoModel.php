<?php

  /***
   * Class NomCargoFacultadoModel
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class NomCargoFacultadoModel extends ZendExt_Model
  {

    /**
     *
     */
    public function __construct()
    {
      parent::ZendExt_Model();

    }

    /**
     * Descripción del método: Inserta un nuevo tipo medio
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool TRUE si se logro adicionar satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($data)
    {
      $object       = new NomCargoFacultado();
      $valores      = $data[2];
      $denominacion = $valores->denominacion;
      $abreviatura  = $valores->abreviatura;
      $fechainicio  = $valores->fechainicio;
      $fechafin     = $valores->fechafin;
      if (UtilModel::check_in_range($fechainicio, (empty($fechafin) ? date("d/m/Y") : $fechafin))) {
        $actual  = UtilModel::getRealValue($valores->actual);
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
      $object->idcargofacultado  = self::buscarIdProximo();
      $object->denominacion = ucfirst($denominacion);
      $object->abreviatura  = $abreviatura;
      $object->actual       = $actual;
      $object->visible      = $visible;
      $object->fechainicio  = $fechainicio;
      $object->fechafin     = $fechafin;
      $object->save();

      return true;
    }

    /**
     * Descripción del método: Modifica un tipo medio especificado
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
      $idTipoMedio  = $data[0];
      $valores      = $data[2];
      $denominacion = $valores->denominacion;
      $abreviatura  = $valores->abreviatura;
      $fechainicio  = $valores->fechainicio;
       $fechafin = ($valores->fechafin != "") ? $valores->fechafin : NULL;

        if (UtilModel::check_in_range($fechainicio, $fechafin)) {
            $actual = UtilModel::getRealValue($valores->actual);
            $visible = UtilModel::getRealValue($valores->visible);
        } else {
            $actual = 0;
            $visible = 1;
        }
      $tipoMedio = Doctrine::getTable('NomCargoFacultado')->find($idTipoMedio);
      if (is_object($tipoMedio)) {
        $tipoMedio->denominacion = ucfirst($denominacion);
        $tipoMedio->abreviatura  = $abreviatura;
        $tipoMedio->actual       = $actual;
        $tipoMedio->visible      = $visible;
        $tipoMedio->fechainicio  = $fechainicio;
        $tipoMedio->fechafin     = $fechafin;
        $tipoMedio->save();

        return true;
      }

      return false;
    }

    /**
     * Descripción del método: Elimina el tipo medio especificado
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
      $idTipoMedio = $data[0];
      $object      = Doctrine::getTable('NomCargoFacultado')->find($idTipoMedio);
      if (is_object($object)) {
        $object->delete();

        return true;
      }

      return false;
    }

    /**
     * Descripción del método: Desactiva el tipo medio especificado atendiendo al id pasado por parametro
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool TRUE si se logro desactivar satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function desactivar($data)
    {
      $idTipoMedio = $data[0];
      try{
        $object          = Doctrine::getTable('NomCargoFacultado')->find($idTipoMedio);
        $object->actual  = 0;
        $object->visible = 0;
        $object->save();

        return true;
      } catch (Doctrine_Exception $ee){
        return false;
      }
    }

    /**
     * Descripción del método: Activa el tipo medio especificado atendiendo al id pasado por parametro
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool TRUE si se logro activar satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function activar($data)
    {
      $idTipoMedio = $data[0];
      try{
        $object          = Doctrine::getTable('NomCargoFacultado')->find($idTipoMedio);
        $object->actual  = 1;
        $object->visible = 1;
        $object->save();

        return true;
      } catch (Doctrine_Exception $ee){
        return false;
      }
    }

    /**
     * Descripción del método: Devuelve el proximo identificador de los tipos de medios
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     * @return int : int, Devuelve el siguiente identificador
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarIdProximo()
    {
      $query   = Doctrine_Query::create();
      $result  = $query->select('max(a.idcargofacultado) as maximo')->from('NomCargoFacultado a')->execute()->toArray();
      $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;

      return $proximo;
    }

    /**
     * Descripción del método: Devuelve la cantidad de tipos de medios que cumplen con la condicion insertada
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
      $where = '1=1';
      if (count($data) > 1) {
        $valores      = $data[1];
        $denominacion = $valores->denominacion;
        $abreviatura  = $valores->abreviatura;
        if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
          $where .= " AND LOWER(tm.denominacion) LIKE LOWER ('%$denominacion%')";
        }
        if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
          $where .= " AND LOWER(tm.abreviatura) LIKE LOWER ('%$abreviatura%')";
        }
      }
      $query  = Doctrine_Query::create();
      $result = $query->from('NomCargoFacultado tm')->where($where)->execute()->count();

      return $result;
    }

    /**
     * Descripción del método: Busca uno o varios tipos de medios
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : Permite buscar uno o varios elemento en la
     * base de datos atendiendo a los criterios de busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    function buscar($data)
    {
      $limit        = $data[0];
      $start        = $data[1];
      $dir          = $data[3];
      $sort         = $data[4];
      $campo        = ($sort != "") ? 'tm.' . $sort : 'tm.idcargofacultado';
      $orden        = ($dir === "ASC") ? " ASC" : " DESC";
      $data         = $data[2];
      $valores      = $data[1];
      $denominacion = $valores->denominacion;
      $abreviatura  = $valores->abreviatura;
      $where        = '1=1';
      if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
        $where .= " AND LOWER(tm.denominacion) LIKE LOWER ('%$denominacion%')";
      }
      if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
        $where .= " AND LOWER(tm.abreviatura) LIKE LOWER ('%$abreviatura%')";
      }
      $query  = Doctrine_Query::create();
      $result = $query->select('tm.*, tm.idcargofacultado as id')->from('NomCargoFacultado tm')->where($where)->orderBy(
                      $campo . $orden
      )->limit($limit)->offset($start)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

      return $result;
    }
  }