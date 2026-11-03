<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class EstructuraopModel extends ZendExt_Model
  {
    /**
     * Constructor de la clase
     */
    public function __construct()
    {
      parent::ZendExt_Model();
      $this->instance = new DatEstructuraop();
    }

    /**
     * Descripción del método: Borrar la instancia vieja que poseia el modelo
     *
     * @author    : Ing.Javier Limonta
     * @copyright Copyright (c) 2013 xetid
     */
    public function Instancia()
    {
      $this->instance = NULL;
      $this->instance = new DatEstructuraop();
    }

    /**
     * Descripción del método: INSERTA UNA NUEVA ESTRUCTURA INTERNA
     *
     * @author    : Ing.Javier Limonta
     *
     * @param $idfila
     * @param $idConcepto
     * @param $datos
     * @param $idProyecto
     * @param $modificar
     *
     * @return bool
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertarEstructuraop($idfila, $idConcepto, $datos, $idProyecto, $modificar = FALSE)
    {
      $this->Instancia();
      $this->instance->idestructuraop = $idfila;
      $this->instance->denominacion   = ucfirst($datos['denominacion']);
      $this->instance->abreviatura    = $datos['abreviatura'];
      $this->instance->codigo         = $datos['codigo'];
      $this->instance->codigonit         = $datos['codigonit'];
      $this->instance->idconcepto     = $idConcepto;
      $this->instance->idorgano       = $datos['idOrgano'];
      if (!empty($datos['idespecialidad'])) {
        $this->instance->idespecialidad = $datos['idespecialidad'];
      }
      $this->instance->idproyecto = $idProyecto;
      $this->instance->idestado   = ($idProyecto != 0) ? ($modificar) ? 2 : 1 : 0;

      $this->instance->correo           = $datos['correo'];
      $this->instance->objetosocial     = $datos['objetosocial'];
      $this->instance->funcioneslegales = $datos['funcioneslegales'];
      $this->instance->direccion        = $datos['direccion'];
      $this->instance->fax              = $datos['fax'];
      $this->instance->telefono         = $datos['telefono'];
      $this->instance->idicono          = $datos['icono'];
      $this->instance->iddpt            = $datos['idDpt'];
      $this->instance->codigonirc       = ($datos['codigonirc'])?$datos['codigonirc']:null;
      $this->instance->save();
      return TRUE;
    }

    /**
     * Descripción del método: MODIFICA UNA NUEVA ESTRUCTURA INTERNA
     *
     * @author    : Ing.Javier Limonta
     *
     * @param $idNodo
     * @param $idConcepto
     * @param $datos
     * @param $proyecto
     *
     * @return bool
     * @copyright Copyright (c) 2013 xetid
     */
    public function modificarEstructura($idNodo, $idConcepto, $datos, $proyecto)
    {
      $this->instance = Doctrine::getTable('DatEstructuraop')->findByDql(
        "idestructuraop = $idNodo AND idproyecto = $proyecto"
      )->getFirst();
      if (is_object($this->instance)) {
        $this->instance->denominacion     = ucfirst($datos['denominacion']);
        $this->instance->abreviatura      = $datos['abreviatura'];
        $this->instance->idorgano         = $datos['idOrgano'];
        $this->instance->codigo           = $datos['codigo'];
        $this->instance->codigonit         = $datos['codigonit'];
        $this->instance->idespecialidad   = $datos['idespecialidad'];
        $this->instance->correo           = $datos['correo'];
        $this->instance->objetosocial     = $datos['objetosocial'];
        $this->instance->funcioneslegales = $datos['funcioneslegales'];
        $this->instance->direccion        = $datos['direccion'];
        $this->instance->fax              = $datos['fax'];
        $this->instance->telefono         = $datos['telefono'];
        $this->instance->idicono          = $datos['icono'];
        $this->instance->iddpt            = $datos['idDpt'];
        $this->instance->codigonirc       = ($datos['codigonirc'])?$datos['codigonirc']:null;
        $this->instance->save();
        return TRUE;
      } else {
        return $this->insertarEstructuraop($idNodo, $idConcepto, $datos, $proyecto, TRUE);
      }
    }

    /**
     * Descripción del método: Verifica si existe la estructura interna especificada
     *
     * @author    : Ing.Javier Limonta
     *
     * @param int $idEstructuraop
     *
     * @return bool
     * @copyright Copyright (c) 2013 xetid
     */
    public function existeEstructruraInterna($idEstructuraop)
    {
      try {
        $mg       = Doctrine_Manager::getInstance();
        $conn     = $mg->getConnection('metadatos');
        $q        = Doctrine_Query::create($conn);
        $consulta = $q->select('idestructuraop')->from('DatEstructuraop op')->where(
          "op.idestructuraop ='$idEstructuraop' and op.idproyecto = 0"
        )->execute()->count();
        return ($consulta != 0);
      } catch (Doctrine_Exception $e) {
        if (DEBUG_ERP) {
          echo(__FILE__ . ' ' . __LINE__ . ' ' . $e->getMessage());
        }
        return FALSE;
      }
    }

    /**
     * Descripción del método: Obtiene todas las estructuras no formales segun el dominio especificado
     *
     * @author    : Ing.Javier Limonta
     * @modified  : Ing.Osvaldo Gonzalez
     * @modified  : Ing.Daymel Machado
     *
     * @param            $iddominio
     * @param bool $idrama
     * @param bool $filtro
     * @param int $limit
     * @param int $start
     * @param int|string $idestructura
     * @param int $area
     *
     * @return array Retorna un arreglo con los datos de las estructuras no formales
     * @copyright Copyright (c) 2013 xetid
     */
    public function obtenerEstructurasNoFormales(
      $iddominio, $idrama = FALSE, $filtro = FALSE, $limit = 1000, $start = 0, $idestructura = " ", $area = 0
    )
    {
      $idconcepto  = ($area == 0) ? 5 : 8;
      $resultado   = array();
      $whereCodigo = " 1=1";
      $query       = Doctrine_Query::create();
      $result      = $query->select('f.idfila as id,f.*,e.codigo,e.denominacion as text')->from('NomFilaestruc f')
        ->innerJoin('f.DatEstructuraop e WITH e.idproyecto = 0')
        ->where("f.dominiofila [?] = 1::bit and idconcepto = $idconcepto and fechafin is null", $iddominio)
        ->limit($limit)->orderBy('e.codigo')->offset($start)->setHydrationMode(Doctrine::HYDRATE_ARRAY);
      if ($filtro) {
        if (!is_array($filtro)) {
          $query->addWhere("e.denominacion ilike '%$filtro%'");
        } else {
          if ($filtro['criterio']) {
            $query->addWhere("e.denominacion ilike '%{$filtro['criterio']}%'");
          }
          $query->addWhere(" e.idestructuraop NOT IN (" . implode(',', $filtro['idestructura']) . ") ");
        }
      }
      if ($area != 0) {
        $query = $this->integrator->metadatos->getSqlOrganos($query);
        $query->addWhere("no.idorgano = $area");
      }
      if (is_array($idestructura)) {
        $whereCodigo = " e.idestructuraop in (" . implode(',', $idestructura) . ")";
      }
      if (is_numeric($idestructura)) {
        $whereCodigo = "e.idestructuraop = $idestructura";
      }
      $query->addWhere($whereCodigo);
      if (is_numeric($idrama)) {
        $object = Doctrine::getTable('NomFilaestruc')->find($idrama);
        if (is_object($object)) {
          $parent_path = $object->parent_path;
          if (!empty($parent_path)) {
            $query->addWhere("f.parent_path operator (public.<@) ?", "$parent_path");
          }
        }
      }
      $resultado = $result->execute();
      return $resultado;
    }

    /**
     * Descripción del método: Busca los datos de una estructura interna
     *
     * @author    : Ing.Javier Limonta
     *
     * @param int $limit
     * @param int $start
     *
     * @return array
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarEstructuraInterna($limit = 10, $start = 0)
    {
      try {
        $mg          = Doctrine_Manager::getInstance();
        $conn        = $mg->getConnection('metadatos');
        $q           = Doctrine_Query::create($conn);
        $resultTotal = $this->conn->getTable('DatEstructuraop')->findAll();
        $result      = $q->from('DatEstructuraop')->where('idproyecto = 0')->limit($limit)->offset($start)->execute();
        $resultado   = $result->toArray();
        $solve       = array('cant' => $resultTotal->count(), 'datos' => $resultado);
        return $solve;
      } catch (Doctrine_Exception $e) {
        if (DEBUG_ERP) {
          echo(__FILE__ . ' ' . __LINE__ . ' ' . $e->getMessage());
        }
        return FALSE;
      }
    }

    /**
     * Descripción del método : Obtener los datos de un area segun su id
     *
     * @author  : Ing.Javier Limonta
     * @modified: Ing.Daymel Machado
     *
     * @params  : int $idestructura
     * @param $idestructura
     *
     * @return \Doctrine_Collection : array Retorna un arreglo con los datos del area
     */
    public function obtenerDatosArea($idestructura)
    {
      $mg     = Doctrine_Manager::getInstance();
      $conn   = $mg->getCurrentConnection();
      $sql    = "
          SELECT
           x.denominacion,
                 x.abreviatura,
                 o.denominacion as tipo_de_area
          FROM mod_estructuracomp.dat_estructuraop x
          INNER JOIN mod_estructuracomp.nom_organo o ON (x.idorgano = o.idorgano)
          INNER JOIN mod_estructuracomp.nom_filaestruc f ON (f.idfila = x.idestructuraop)
          WHERE (x.idestructuraop = $idestructura AND x.idproyecto = 0 AND f.fechafin is null)
      ";
      $result = $conn->fetchAll($sql);
      return $result;
    }

    /**
     * Descripción del método : Obtener las estructuras internas hijas de una especificada
     *
     * @author  : Ing.Osvaldo Manuel Gonzalez Ortiz
     *
     * @param $idPadre
     *
     * @return array Retorna un arreglo con los datos de las areas
     */
    public function dameEstructurasInternasSeguridad($idPadre)
    {
      $mg     = Doctrine_Manager::getInstance();
      $conn   = $mg->getCurrentConnection();
      $sql    = "SELECT
                op.idestructuraop as id,
                op.denominacion as text,
                true as leaf,
                'interna' as tipo
              FROM mod_estructuracomp.nom_filaestruc f
              INNER JOIN mod_estructuracomp.dat_estructuraop op ON (f.idfila = op.idestructuraop AND op.idproyecto = 0 )
              WHERE f.idpadre = $idPadre
              ORDER BY op.idestructuraop";
      $result = $conn->fetchAll($sql);
      return $result;
    }

    public function obtenerEstructurasDadoPadre($idpadre, $limit = 1000, $start = 0)
    {
      $object      = Doctrine::getTable('NomFilaestruc')->find($idpadre);
      $parent_path = $object->parent_path;
      $iddominio   = ZendExt_GlobalConcept::getInstance()->Perfil->iddominio;
      $resultado   = array();
      $query       = Doctrine_Query::create();
      $result      = $query->select('f.idfila as id,f.*,e.codigo,e.denominacion as text')->from('NomFilaestruc f')
        ->innerJoin('f.DatEstructuraop e WITH e.idproyecto = 0')
        ->where("f.dominiofila [?] = 1::bit and fechafin is null and (f.parent_path operator (public.<@) ? )", array($iddominio, $parent_path))
        ->orderBy('f.parent_path')
        ->limit($limit)->orderBy('e.codigo')->offset($start)->setHydrationMode(Doctrine::HYDRATE_ARRAY);

      $resultado = $result->execute();
      return $resultado;
    }
  }
