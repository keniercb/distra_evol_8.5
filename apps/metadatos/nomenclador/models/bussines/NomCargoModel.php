<?php

  /**
   * Class NomcargoModel
   * Generada por Doctrine Generate
   *
   * @property mixed connection
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2014 xetid
   */
  class NomCargoModel extends ZendExt_Model
  {
    /**
     *
     */
    public function __construct()
    {
      parent::ZendExt_Model();
      $this->instance = new NomCargo();
    }

    public function dameTodosVisibles()
    {
      $query  = Doctrine_Query::create();
      $result = $query->from('NomCargo')->where('visible = 1')->execute()->toArray();

      return $result;
    }

    /**
     * Descripción del método: Inserta un nuevo cargo
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param      $data
     *
     * @return bool : boolm Permite insertar el elemento en la base de datos
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($data)
    {
      $object  = new NomCargo();
      $valores = $data[2];
      // Util::msg($valores);
      $denominacion       = $valores->denominacion;
      $abreviatura        = $valores->abreviatura;
      $idgrupocomplejidad = $valores->idgrupocomplejidad;
      $idnormajuridica    = ($valores->idnormajuridica == '') ? null : $valores->idnormajuridica;
      $condicion          = $valores->condicion;
      $facultado          = UtilModel::getRealValue($valores->facultado);
      $fechainicio        = $valores->fechainicio;
      $fechafin           = $valores->fechafin;
      if (UtilModel::check_in_range($fechainicio, (empty($fechafin) ? date("d/m/Y") : $fechafin))) {
        $actual  = UtilModel::getRealValue($valores->actual);
        $visible = UtilModel::getRealValue($valores->visible);
      } else {
        $actual  = 0;
        $visible = 0;
      }
      $idNomCargo                 = self::obtenerIdProximo();
      $object->idnomcargo         = $idNomCargo;
      $object->denominacion       = ucfirst($denominacion);
      $object->idgrupocomplejidad = $idgrupocomplejidad;
      $object->idnormajuridica    = $idnormajuridica;
      $object->facultado          = $facultado;
      $object->abreviatura        = $abreviatura;
      $object->actual             = $actual;
      $object->visible            = $visible;
      $object->fechainicio        = $fechainicio;
      $object->fechafin           = $fechafin;
      $object->orden              = self::obtenerProxOrden();
      $object->save();
      if ($condicion != '') {
        $modelCondicion = new NomCondicionModel();
        $modelCondicion->insertar($idNomCargo, $condicion);
      }

      return true;
    }

    /**
     * Descripción del método: Modifica una instancia de la tabla cargo
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, Permite modificar el elemento en la base de datos
     * @copyright Copyright (c) 2014 xetid
     */
    public function modificar($data)
    {
      $idgrupocomplejidadOld = false;
      $cambioGC              = false;
      $idCargo               = (int)$data[0];
      $valores               = $data[2];
      $denominacion          = $valores->denominacion;
      $abreviatura           = $valores->abreviatura;
      $idgrupocomplejidad    = (int)$valores->idgrupocomplejidad;
      $idnormajuridica       = (int)$valores->idnormajuridica;
      $facultado             = UtilModel::getRealValue($valores->facultado);
      $condicion             = $valores->condicion;
      $fechainicio           = $valores->fechainicio;
      $fechafin              = ($valores->fechafin != "") ? $valores->fechafin : NULL;

      if (UtilModel::check_in_range($fechainicio, $fechafin)) {
        $actual  = UtilModel::getRealValue($valores->actual);
        $visible = UtilModel::getRealValue($valores->visible);
      } else {
        if ($valores->fechafin == "") {
          $actual  = 1;
          $visible = 1;
        } else {
          $actual  = 0;
          $visible = 1;
        }
      }
      $cargo = Doctrine::getTable('NomCargo')->find($idCargo);
      if (is_object($cargo)) {
        if ($idgrupocomplejidad != $cargo->idgrupocomplejidad) {
          $cambioGC              = true;
          $idgrupocomplejidadOld = (int)$cargo->idgrupocomplejidad;
        }
        $cargo->denominacion       = ucfirst($denominacion);
        $cargo->abreviatura        = $abreviatura;
        $cargo->idgrupocomplejidad = $idgrupocomplejidad;
        $cargo->idnormajuridica    = $idnormajuridica;
        $cargo->facultado          = $facultado;
        $cargo->actual             = $actual;
        $cargo->visible            = $visible;
        $cargo->fechainicio        = $fechainicio;
        $cargo->fechafin           = $fechafin;
        $cargo->save();
        $modelCondicion = new NomCondicionModel();
        $modelCondicion->insertar($idCargo, $condicion);
        if ($cambioGC && is_numeric($idgrupocomplejidadOld)) {
          $doctrineObject = Doctrine_Manager::getInstance();
          $connection     = $doctrineObject->getCurrentConnection();
          $connection->commit();
          $connection->beginTransaction();
          $query
            = "Select mod_estructuracomp.ft_cambiargrupo($idCargo,$idgrupocomplejidadOld,$idgrupocomplejidad);";
          $connection->fetchAll($query);
        }

        return true;
      }

      return false;
    }

    /**
     * Descripción del método: Desactiva el cargor especificado atendiendo al id pasado por parametro
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool  Desactiva o activa el nomenclador
     * @copyright Copyright (c) 2014 xetid
     */
    public function desactivar($data)
    {
      $idCargo = $data[0];
      try {
        $object          = Doctrine::getTable('NomCargo')->find($idCargo);
        $object->actual  = 0;
        $object->visible = 0;
        $object->save();

        return true;
      } catch (Doctrine_Exception $ee) {
        return false;
      }
    }

    /**
     * Descripción del método: Activa el cargo
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
      $idCargo = $data[0];
      try {
        $object          = Doctrine::getTable('NomCargo')->find($idCargo);
        $object->actual  = 1;
        $object->visible = 1;
        $object->save();

        return true;
      } catch (Doctrine_Exception $ee) {
        return false;
      }
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
     * @return bool : bool, Elimina la instancia de la tabla
     * @copyright Copyright (c) 2014 xetid
     */
    public function eliminar($data)
    {
      $idCargo = $data[0];
      $object  = Doctrine::getTable('NomCargo')->find($idCargo);
      if (is_object($object)) {
        $object->delete();

        return true;
      }

      return false;
    }

    /**
     * Descripción del método: Obtiene la instancia de la tabla que coincide con el id especificado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idCargo
     *
     * @return bool
     * @copyright Copyright (c) 2014 xetid
     */
    function dameDatos($idCargo)
    {
      try {
        $q        = Doctrine_Query::create();
        $consulta = $q->select('*')->from('NomCargo')->where("idnomcargo ='$idCargo'")->orderBy(
          'idnomcargo <> 0,denominacion'
        )->execute()->toArray();

        return $consulta;
      } catch (Doctrine_Exception $ee) {
        return false;
      }
    }

    /**
     * Descripción del método: Obtener el proximo id de la tabla
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     * @return int :  Retorna el siguiente id de la tabla
     * @copyright Copyright (c) 2014 xetid
     * @version   Release: @package_version@
     */
    public function obtenerIdProximo()
    {
      $query   = Doctrine_Query::create();
      $result  = $query->select('max(a.idnomcargo) as maximo')->from('NomCargo a')->execute()->toArray();
      $proximo = isset ($result [0] ['maximo']) ? $result [0] ['maximo'] + 1 : 1;

      return $proximo;
    }

    /**
     * Descripción del método: Obtener el proximo orden de la tabla
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     * @return int : Retorna el siguiente orden de la tabla
     * @copyright Copyright (c) 2014 xetid
     * @version   Release: @package_version@
     */
    public function obtenerProxOrden()
    {
      $query   = Doctrine_Query::create();
      $result  = $query->select('max(a.orden) as maximo')->from('NomCargo a')->execute()->toArray();
      $proximo = isset ($result [0] ['maximo']) ? $result [0] ['maximo'] + 1 : 1;

      return $proximo;
    }

    /***
     * Descripción del método: Devuelve la cantidad de cargos segun los filtros de busqueda
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return int Retorna la cantidad de cargos que cumplen con el filtro
     * @copyright Copyright (c) 2013 xetid
     */
    public function cantidad($data)
    {
      $where = '1=1';
      if (count($data) > 1) {
        $valores            = $data[1];
        $denominacion       = $valores->denominacion;
        $abreviatura        = $valores->abreviatura;
        $idgrupocomplejidad = $valores->idgrupocomplejidad;
        if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
          $where .= " AND LOWER(c.denominacion) LIKE LOWER ('%$denominacion%')";
        }
        if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
          $where .= " AND LOWER(c.abreviatura) LIKE LOWER ('%$abreviatura%')";
        }
        if (is_numeric($idgrupocomplejidad)) {
          $where .= " AND c.idgrupocomplejidad = $idgrupocomplejidad";
        }
      }
      $query  = Doctrine_Query::create();
      $result = $query->from('NomCargo c')->where($where)->execute()->count();

      return $result;
    }

    /**
     * Descripción del método: Busca uno o varios cargos
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : Permite buscar uno o varios elemento en la base de
     * datos atendiendo a los criterios de busqueda
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
      }
      if ($sort === 'grupocomplejidad') {
        $sort    = 'denominacion';
        $esquema = "c." . $sort;
      }
      if ($sort === 'abreviatura') {
        $esquema = "c." . $sort;
      }
      if ($sort === 'fechainicio') {
        $esquema = "c." . $sort;
      }
      if ($sort === 'fechafin') {
        $esquema = "c." . $sort;
      }
      $campo              = ($sort != "") ? $esquema : " c.idnomcargo";
      $orden              = ($dir === "ASC") ? " ASC" : " DESC";
      $valores            = $data[1];
      $denominacion       = $valores->denominacion;
      $abreviatura        = $valores->abreviatura;
      $idgrupocomplejidad = $valores->idgrupocomplejidad;
      $where              = '1=1';
      $campo              = ($sort != "") ? "c." . $sort : "c.idnomcargo <> 0,c.denominacion";
      $orden              = ($dir === "ASC") ? " ASC" : " DESC";
      if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
        $where .= " AND LOWER(c.denominacion) LIKE LOWER ('%$denominacion%')";
      }
      if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
        $where .= " AND LOWER(c.abreviatura) LIKE LOWER ('%$abreviatura%')";
      }
      if (is_numeric($idgrupocomplejidad)) {
        $where .= " AND c.idgrupocomplejidad = $idgrupocomplejidad";
      }
      $query  = Doctrine_Query::create();
      $result = $query->select('c.*, c.idnomcargo as id , nj.denominacion as normajuridica,gc.denominacion as grupocomplejidad')
        ->from('NomCargo c')
        ->leftJoin("c.NomGrupocomplejidad gc")
        ->leftJoin("c.NomNormaJuridica nj")
        ->where($where)->orderBy($campo . $orden)
        ->limit($limit)->offset($start)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();


      foreach ($result as $index => $datos) {
        $condiciones                   = NomCondicion::buscar($datos['id']);
        $result[$index]['idcondicion'] = $condiciones['idcondicion'];
        $result[$index]['condicion']   = $condiciones['condicion'];
      }


      return $result;
    }
  }