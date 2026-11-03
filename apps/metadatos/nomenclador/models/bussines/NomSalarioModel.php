<?php

  /**
   * Class NomSalarioModel
   * Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   * @version   Release: @package_version@
   */
  class NomSalarioModel extends ZendExt_Model
  {
    /**
     *
     */
    public function __construct()
    {
      parent::ZendExt_Model();
      $this->instance = new NomSalario();
    }

    /**
     * Descripción del método: Inserta un nuevo salario
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, Devuelve TRUE en caso de que se haya insertado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($data)
    {
      $object             = new NomSalario();
      $valores            = $data[2];
      $salario            = $valores->salario;
      $fechainicio        = $valores->fechainicio;
      $fechafin           = $valores->fechafin;
      $idgrupocomplejidad = $valores->idgrupocomplejidad;
      if (UtilModel::check_in_range($fechainicio, (empty($fechafin) ? date("d/m/Y") : $fechafin))) {
        $actual  = UtilModel::getRealValue($valores->actual);
        $visible = UtilModel::getRealValue($valores->visible);
      } else {
        $actual  = 0;
        $visible = 0;
      }
      $object->idsalario          = self::buscarIdProximo();
      $object->salario            = $salario;
      $object->idgrupocomplejidad = $idgrupocomplejidad;
      $object->actual             = $actual;
      $object->visible            = $visible;
      $object->fechainicio        = $fechainicio;
      $object->fechafin           = $fechafin;
      $object->save();

      return true;
    }

    /**
     * Descripción del método: Elimina el salario atendiendo al id pasado por parametro
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, Elimina la instancia de la tabla
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminar($data)
    {
      $idSalario = $data[0];
      $object    = Doctrine::getTable('NomSalario')->find($idSalario);
      if (is_object($object)) {
        $object->delete();

        return true;
      }

      return false;
    }

    /**
     * Descripción del método: Devuelve el proximo identificador de salario
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel MaHEADchado
     * @modify    : Ing. Osvaldo M. Gonzalez
     * @return int : int, Devuelve el siguiente identificador de salario
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarIdProximo()
    {
      $query   = Doctrine_Query::create();
      $result  = $query->select('max(a.idsalario) as maximo')->from('NomSalario a')->execute()->toArray();
      $proximo = isset ($result [0] ['maximo']) ? $result [0] ['maximo'] + 1 : 1;

      return $proximo;
    }

    /**
     * Descripción del método: Modifica un salario
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, Devuelve true si fue modificado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function modificar($data)
    {
      $idSalario          = $data[0];
      $valores            = $data[2];
      $salario            = $valores->salario;
      $idgrupocomplejidad = $valores->idgrupocomplejidad;
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
      $obj = Doctrine::getTable('NomSalario')->find($idSalario);
      if (is_object($obj)) {
        $obj->salario            = $salario;
        $obj->idgrupocomplejidad = $idgrupocomplejidad;
        $obj->actual             = $actual;
        $obj->visible            = $visible;
        $obj->fechainicio        = $fechainicio;
        $obj->fechafin           = $fechafin;
        $obj->save();

        return true;
      }

      return false;
    }

    /**
     * Descripción del método: Desactiva el salario especificado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, Devuelve true si fue desactivado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function desactivar($data)
    {
      $idSalario = $data[0];
      try{
        $object          = Doctrine::getTable('NomSalario')->find($idSalario);
        $object->actual  = 0;
        $object->visible = 0;
        $object->save();

        return true;
      } catch (Doctrine_Exception $ee){
        return false;
      }
    }

    /**
     * Descripción del método: Activa el salario especificado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, Devuelve true si fue activado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function activar($data)
    {
      $idSalario = $data[0];
      try{
        $object          = Doctrine::getTable('NomSalario')->find($idSalario);
        $object->actual  = 1;
        $object->visible = 1;
        $object->save();

        return true;
      } catch (Doctrine_Exception $ee){
        return false;
      }
    }

    /**
     * Devuelve la cantidad de salarios que cumplen con la condicion insertada
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
        $valores          = $data[1];
        $salario          = $valores->salario;
        $grupoComplejidad = $valores->grupocomplejidad;
        $condicion        = $valores->condicion;
        if (is_numeric($salario)) {
          if ($condicion != "Seleccione...") {
            $condicion = str_replace(' ', '', $condicion);
          } else {
            $condicion = '=';
          }
          $where .= " AND s.salario $condicion $salario";
        }
        if ($grupoComplejidad != "Criterio a buscar..." && $grupoComplejidad != "") {
          $where .= " AND n.denominacion = '$grupoComplejidad'";
        }
      }
      $query  = Doctrine_Query::create();
      $result = $query->select('s.*, n.denominacion')->from('NomSalario s')->innerjoin('s.NomGrupocomplejidad n')
                      ->where($where)->execute()->count();

      return $result;
    }

    /**
     * @param $data
     *
     * @return Doctrine_Collection
     */
    function buscar($data)
    {
      $limit = $data[0];
      $start = $data[1];
      $dir   = $data[3];
      $sort  = $data[4];
      $data  = $data[2];
      if ($sort === 'denominacion') {
        $esquema = "n." . $sort;
      } else {
        $esquema = "s." . $sort;
      }
      $campo            = ($sort != "") ? $esquema : "s.idsalario";
      $orden            = ($dir === "ASC") ? " ASC" : " DESC";
      $valores          = $data[1];
      $salario          = $valores->salario;
      $grupoComplejidad = $valores->grupocomplejidad;
      $condicion        = $valores->condicion;
      $query            = new Doctrine_Query();
      $where            = '1=1';
      if (is_numeric($salario)) {
        if ($condicion == "Seleccione...") {
          $condicion = '=';
        }
        $where .= " AND s.salario $condicion $salario";
      }
      if ($grupoComplejidad != "Criterio a buscar..." && $grupoComplejidad != "") {
        $where .= " AND n.denominacion = '$grupoComplejidad'";
      }
      $result = $query->select('s.*, s.idsalario as id,n.idgrupocomplejidad as idgrupocomplejidad, n.denominacion')
                      ->from('NomSalario s')->innerjoin('s.NomGrupocomplejidad n')->where($where)->orderBy(
                      $campo . $orden
        )->limit($limit)->offset($start)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

      return $result;
    }
  }