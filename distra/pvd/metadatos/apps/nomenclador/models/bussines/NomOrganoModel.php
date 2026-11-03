<?php

  /**
   * Class NomorganoModel
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class NomOrganoModel extends ZendExt_Model
  {
    /**
     *
     */
    public function __construct()
    {
      parent::ZendExt_Model();
      $this->instance = new NomOrgano();
    }

    /**
     * Descripción del método: Inserta un nuevo organo
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param      $data
     * @param      $idEstructura
     *
     * @return bool : boolm Permite insertar el elemento en la base de datos
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($data, $idEstructura = false)
    {
      $object     = new NomOrgano();
      $idConcepto = $data[1];
      $valores    = $data[2];
      if (!$idEstructura) {
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
      } else {
        $denominacion = $valores['denominacion'];
        $abreviatura  = $valores['abreviatura'];
        $actual       = $valores['actual'];
        $visible      = $valores['visible'];
        $fechainicio  = $valores['fechainicio'];
        $fechafin     = $valores['fechafin'];
      }
      if (!$idEstructura) {
        $object->idorgano = self::buscarIdProximo();
      } else {
        $object->idorgano = $idEstructura;
      }
      $object->denominacion = ucfirst($denominacion);
      $object->abreviatura  = $abreviatura;
      $object->idconcepto   = $idConcepto;
      $object->actual       = $actual;
      $object->visible      = $visible;
      $object->fechainicio  = $fechainicio;
      $object->fechafin     = $fechafin;
      $object->orden        = self::buscarOrdenProximo($idConcepto);
      $object->save();

      return true;
    }

    /**
     * Descripción del método: Modifica un organo determinado
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
      $idOrgano     = $data[0];
      $idConcepto   = $data[1];
      $valores      = $data[2];
      $denominacion = $valores->denominacion;
      $abreviatura  = $valores->abreviatura;
      $fechainicio  = $valores->fechainicio;
      $fechafin     = ($valores->fechafin != "") ? $valores->fechafin : NULL;

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
      $organo = Doctrine::getTable('NomOrgano')->findByDql(
        'idorgano=? and idconcepto=?', array($idOrgano, $idConcepto)
      )->getFirst();
      if (is_object($organo)) {
        $organo->denominacion = ucfirst($denominacion);
        $organo->abreviatura  = $abreviatura;
        $organo->actual       = $actual;
        $organo->visible      = $visible;
        $organo->fechainicio  = $fechainicio;
        $organo->fechafin     = $fechafin;
        $organo->save();

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
     * @return bool : bool Elimina la instancia de la tabla
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminar($data)
    {
      $idorgano = $data[0];
      try {
        $query  = Doctrine_Query::create();
        $result = $query->delete('idorgano')->from('NomOrgano')->where("idorgano = $idorgano")->execute();

        return $result == 0 ? false : true;
      } catch (Doctrine_Exception $ee) {
        return false;
      }
    }

    /**
     * Descripción del método: Desactiva el organo
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : Desactiva o activa el nomenclador
     * @copyright Copyright (c) 2013 xetid
     */
    public function desactivar($data)
    {
      $idorgano   = $data[0];
      $idconcepto = $data[1];
      try {
        $query = Doctrine_Query::create();
        $query->update('NomOrgano n')->where("idorgano = $idorgano AND idconcepto = $idconcepto");
        $query->set('n.visible', 0)->set('n.actual', 0);
        $query->execute();

        return true;
      } catch (Doctrine_Exception $ee) {
        return false;
      }
    }

    /**
     * Descripción del método: Activa el organo
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : Desactiva o activa el nomenclador
     * @copyright Copyright (c) 2013 xetid
     */
    public function activar($data)
    {
      $idorgano   = $data[0];
      $idconcepto = $data[1];
      try {
        $query = Doctrine_Query::create();
        $query->update('NomOrgano n')->where("idorgano = $idorgano AND idconcepto = $idconcepto");
        $query->set('n.visible', 1)->set('n.actual', 1);
        $query->execute();

        return true;
      } catch (Doctrine_Exception $ee) {
        return false;
      }
    }

    /**
     * Descripción del método: Busca uno o varios organos
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
      $limit        = $data[0];
      $start        = $data[1];
      $dir          = $data[3];
      $sort         = $data[4];
      $data         = $data[2];
      $campo        = ($sort != "") ? "no." . $sort : "no.idorgano";
      $orden        = ($dir === "ASC") ? " ASC" : " DESC";
      $idConcepto   = $data[0];
      $valores      = $data[1];
      $denominacion = $valores->denominacion;
      $abreviatura  = $valores->abreviatura;
      $where        = '1=1';
      if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
        $where .= " AND LOWER(no.denominacion) LIKE LOWER ('%$denominacion%')";
      }
      if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
        $where .= " AND LOWER(no.abreviatura) LIKE LOWER ('%$abreviatura%')";
      }
      $q      = Doctrine_Query::create();
      $where  .= " AND no.idorgano > 0";
      $result = $q->select('no.*,no.idorgano as id, nom.denominacion')->from('NomOrgano no')->innerJoin(
        'no.NomConcepto nom '
      )->where($where . " AND no.idconcepto in ($idConcepto)")->orderBy($campo . $orden)->limit($limit)->offset(
        $start
      )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();


      return $result;
    }

    /**
     * Descripción del método: Devuelve la cantidad de órganos que cumplen con los criterios de busqueda
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return mixed : mixed, Retorna la cantidad de elementos encontrados durante la busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public function cantidad($data)
    {
      $idConcepto = $data[0];
      $where      = '1=1';
      if (count($data) > 1) {
        $valores      = $data[1];
        $denominacion = $valores->denominacion;
        $abreviatura  = $valores->abreviatura;
        if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
          $where .= " AND LOWER(no.denominacion) LIKE LOWER ('%$denominacion%')";
        }
        if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
          $where .= " AND LOWER(no.abreviatura) LIKE LOWER ('%$abreviatura%')";
        }
      }
      $q      = Doctrine_Query::create();
      $result = $q->select('no.*,nom.denominacion')->from('NomOrgano no')->innerJoin('no.NomConcepto nom ')->where(
        $where . " AND no.idconcepto in ($idConcepto) "
      )->execute()->count();

      return $result;
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
      $result  = $query->select('max(a.idorgano) as maximo')->from('NomOrgano a')->execute()->toArray();
      $proximo = isset ($result [0] ['maximo']) ? $result [0] ['maximo'] + 1 : 1;

      return $proximo;
    }

    /**
     * Descripción del método: Devuelve el proximo orden de la tabla
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param bool $idconcepto
     *
     * @return int : Devuelve el siguiente orden en la tabla segun el concepto
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarOrdenProximo($idconcepto = false)
    {
      $query = Doctrine_Query::create();
      $where = $idconcepto ? " idconcepto = $idconcepto " : "1 = 1";
      // buscar el campo
      $result  = $query->select('max(a.orden) as maximo')->from('NomOrgano a')->where($where)->execute()->toArray();
      $proximo = isset ($result [0] ['maximo']) ? $result [0] ['maximo'] + 1 : 1;

      return $proximo;
    }

    /**
     * Descripción del método: Obtiene la instancia de la tabla que coincide con el id especificado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param      $idOrgano
     * @param      $idConcepto
     * @param bool $isEstructura
     *
     * @return bool : Retorna una intancia de la tabla atendiendo al id pasado por parametro
     * @copyright Copyright (c) 2013 xetid
     */
    public function obtenerOrgano($idOrgano, $idConcepto, $isEstructura = false)
    {
      if (!$isEstructura) {
        $idConcepto = ($idConcepto == 3 || $idConcepto == 4) ? 1 : $idConcepto;
      }
      try {
        $q        = Doctrine_Query::create();
        $consulta = $q->select('*')->from('NomOrgano o')->where(
          "o.fechafin IS NULL AND o.idorgano ='$idOrgano'  AND o.idconcepto='$idConcepto'"
        )->execute()->toArray();

        return $consulta;
      } catch (Doctrine_Exception $ee) {
        if (DEBUG_ERP) {
          echo(__file__ . ' ' . __line__ . ' ' . $ee->getMessage());
        }

        return false;
      }
    }
  }