<?php

  /**
   * Descripción del método: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate  *
   * @copyright Copyright (c) 2013 xetid
   * @version   Release: @package_version@
   */
  class NomTipoEscalaModel extends ZendExt_Model
  {
    /**
     *
     */
    public function __construct()
    {
      parent::ZendExt_Model();
      $this->instance = new NomTipoEscala();
    }

    /**
     * Descripción del método: Inserta una nueva preparacion
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool :bool Devuelve TRUE en caso de que se haya adicionado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($data)
    {
      $util         = new Util();
      $object       = new NomTipoEscala();
      $valores      = $data[2];
      $denominacion = strtoupper($util->fixTitleReverse($valores->denominacion));
      $abreviatura  = strtoupper($util->fixTitleReverse($valores->abreviatura));
      $fechainicio  = $valores->fechainicio;
      $fechafin     = $valores->fechafin;
      if (UtilModel::check_in_range($fechainicio, (empty($fechafin) ? date("d/m/Y") : $fechafin))) {
        $actual  = UtilModel::getRealValue($valores->actual);
        $visible = UtilModel::getRealValue($valores->visible);
      } else {
        $actual  = 0;
        $visible = 0;
      }
      $object->idtipoescala = self::buscarIdProximo();
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
     * Descripción del método: Modifica una preparacion determinada
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
      $idTipoEscala = $data[0];
      $valores      = $data[2];
      $denominacion = strtoupper($valores->denominacion);
      $abreviatura  = strtoupper($valores->abreviatura);
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
      $preparacion = Doctrine::getTable('NomTipoEscala')->find($idTipoEscala);
      if (is_object($preparacion)) {
        $preparacion->denominacion = $denominacion;
        $preparacion->abreviatura  = $abreviatura;
        $preparacion->actual       = $actual;
        $preparacion->visible      = $visible;
        $preparacion->fechainicio  = $fechainicio;
        $preparacion->fechafin     = $fechafin;
        $preparacion->save();

        return true;
      }

      return false;
    }

    /**
     * Descripción del método: Elimina una preparacion determinada
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool :bool Devuelve TRUE en caso de que se haya eliminado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminar($data)
    {
      $idTipoEscala = $data[0];
      $object       = Doctrine::getTable('NomTipoEscala')->find($idTipoEscala);
      if (is_object($object)) {
        $object->delete();

        return true;
      }

      return false;
    }

    /**
     * Descripción del método: Desactiva una preparacion determinada
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool :bool Devuelve TRUE en caso de que se haya desactivado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function desactivar($data)
    {
      $idTipoEscala = $data[0];
      try{
        $object          = Doctrine::getTable('NomTipoEscala')->find($idTipoEscala);
        $object->actual  = 0;
        $object->visible = 0;
        $object->save();

        return true;
      } catch (Doctrine_Exception $ee){
        return false;
      }
    }

    /**
     * Descripción del método: Activa una preparacion determinada
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool :bool Devuelve TRUE en caso de que se haya activado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function activar($data)
    {
      $idTipoEscala = $data[0];
      try{
        $object          = Doctrine::getTable('NomTipoEscala')->find($idTipoEscala);
        $object->actual  = 1;
        $object->visible = 1;
        $object->save();

        return true;
      } catch (Doctrine_Exception $ee){
        return false;
      }
    }

    /**
     * Descripción del método: Devuelve el proximo identificador de las preparaciones
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     * @return int : Devuelve el siguiente identificador de las preparaciones
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarIdProximo()
    {
      $query   = Doctrine_Query::create();
      $result  = $query->select('max(a.idtipoescala) as maximo')->from('NomTipoEscala a')->execute()->toArray();
      $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;

      return $proximo;
    }

    /**
     * Descripción del método: Devuelve la cantidad de preparaciones
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
        $valores      = $data[1];
        $denominacion = $valores->denominacion;
        $abreviatura  = $valores->abreviatura;
        if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
          $where .= " AND LOWER(esc.denominacion) LIKE LOWER ('%$denominacion%')";
        }
        if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
          $where .= " AND LOWER(esc.abreviatura) LIKE LOWER ('%$abreviatura%')";
        }
      }
      $query  = Doctrine_Query::create();
      $result = $query->from('NomTipoEscala esc')->where($where)->execute()->count();

      return $result;
    }

    /**
     * Descripción del método: Devuelve un arreglo con las preparaciones que cumplan con las condiciones
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param      $data
     *
     * @return mixed, devuelve un arreglo con las preparaciones
     * @copyright Copyright (c) 2013 xetid
     */
    function buscar($data)
    {
      $limit   = $data[0];
      $start   = $data[1];
      $dir     = $data[3];
      $sort    = $data[4];
      $data    = $data[2];
      $esquema = "esc." . $sort;
      $campo   = ($sort != "") ? $esquema : "esc.idtipoescala";
      $orden   = ($dir === "ASC") ? " ASC" : " DESC";
      $valores      = $data[1];
      $denominacion = $valores->denominacion;
      $abreviatura  = $valores->abreviatura;
      $where        = '1=1';
      if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
        $where .= " AND LOWER(esc.denominacion) LIKE LOWER ('%$denominacion%')";
      }
      if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
        $where .= " AND LOWER(esc.abreviatura) LIKE LOWER ('%$abreviatura%')";
      }
      $query  = Doctrine_Query::create();
      $result = $query->select('esc.*, esc.idtipoescala as id')->from('NomTipoEscala esc')->where($where)->orderBy(
                      $campo . $orden
      )->limit($limit)->offset($start)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

      return $result;
    }
  }