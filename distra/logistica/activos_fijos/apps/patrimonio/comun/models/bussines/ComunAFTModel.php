<?php

/**
 * Clase que contiene funcionalidades comunes y configuraciones generales del sistema de Activos Fijos
 *
 * @autor Jorge Luis Cuellar Mondeja
 */
class ComunAFTModel extends ZendExt_Model
{

    private static $instance;
    private $xmlConfiguraciones;
    private $sConfGeneral;

    /**
     *
     */
    private function __construct()
    {
        try {
            $xml = substr($_SERVER['SCRIPT_FILENAME'], 0, strrpos($_SERVER['SCRIPT_FILENAME'], 'web'))
                . 'apps/logistica/activos_fijos/comun/recursos/xml/configuraciones.xml';

            if (is_readable($xml)) {
                $xmlOperaciones = simplexml_load_file($xml);
                $jsonString = json_encode($xmlOperaciones);

                $this->xmlConfiguraciones = json_decode($jsonString, true);
            } else {
                die('No se puede leer el fichero que se encuentra en: ' . $xml);
            }
        } catch (Exception $exc) {
            die($exc->getMessage());
        }

        $this->sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    /**
     *
     */
    public function __clone()
    {
        die('No se puede clonar este objeto');
    }

    /**
     * @return ComunAFTModel $instance
     */
    public static function getInstance()
    {
        if (!isset(self::$instance)) {
            $class = __CLASS__;
            self::$instance = new $class();
        }

        return self::$instance;
    }

    /**
     * Este metodo devuelve los estados operancio que iran adquiriendo los activos segun el proceso que se le realice.
     * 
     * @return type array
     */
    public function GetArrEstadosoperacion()
    {
        return array(
            0 => 'Insertado', // Para los registros operativos que no esten en ningun documento
            1 => 'Registrado', // Para los numeros de series que no esten en ninguno de los otros estados
            2 => 'Alquilado proveedor', // Para los # de series alquilados donde la entidad alquila proveedora
            3 => 'Alquilado cliete', // Para los numeros de series en las que la entidad que alquila es la cliente
            4 => 'Prestado', // Para los numeros de series presatos
            5 => 'Reparacion', // Para los numeros de series que estan en el taller
            6 => 'Trasladado', // Para los numeros de series que han sido trasladados externamente
            7 => 'Baja', // Para los numeros de series que se han dado de baja de la entidad por algun motivo
        );
    }

    /**
     * Si existe un sistema dentro de la aplicación
     *
     * @param string $url
     *
     * @return bool
     */
    private function integradoSistema($url)
    {
        return (file_exists(
                substr($_SERVER['SCRIPT_FILENAME'], 0, strrpos($_SERVER['SCRIPT_FILENAME'], 'web')) . 'apps/' . $url
            )) ? true : false;
    }

    /**
     * Si esta activo el sistema de contabilidad dentro de la aplicación
     *
     * @return bool
     */
    public function integradoContabilidad()
    {
        return self::integradoSistema('contabilidad/comun/recursos/xml/ioc.xml');
    }

    /**
     * Si esta activo el sistema de persona dentro de la aplicación
     *
     * @return bool
     */
    public function integradoPersona()
    {
        return self::integradoSistema('pvd/comun/recursos/xml/ioc.xml');
    }

    /**
     * Devuelve el listado de métodos de depreciación configurados en la aplicación
     *
     * @return array
     */
    public function getMetodosDepreciacion()
    {
        $metodos = array();
        foreach ($this->xmlConfiguraciones['metodos_depreciacion'] as $value) {
            $metodos[$value['idmetodo']] = $value;
        }
        return $metodos;
    }

    /**
     * Devuelve el listado de datos auxiliares configurados por tipos de documentos la aplicación
     *
     * @return array
     */
    public function getOperacionesDocumento()
    {
        return $this->xmlConfiguraciones['tipo_datos_aux_doc'];
    }

    /**
     * Devuelve el listado de configuraciones predeterminadas por tipos de operaciones la aplicación
     *
     * @return array
     */
    public function getInterfacesDocumento()
    {
        $operaciones = $this->xmlConfiguraciones['operaciones'];
        $arrOperacionesAsociativo = array();
        foreach ($operaciones as $value) {
            $arrOperacionesAsociativo[$value['codigo']] = $value;
        }
        return $arrOperacionesAsociativo;


        //return $this->xmlConfiguraciones['operaciones'];
    }

    /**
     * Devuelve la configuración del comportamiento de una operación en la aplicación
     *
     * @param int $idOperacion
     *
     * @return array
     */
    public function getOperacionSobreMediosById($idOperacion)
    {
        $operaciones = self::getInterfacesDocumento();
        $operacion = $this->sConfGeneral->obtenerOperaciones(0, 0, 0, $idOperacion);
        $resultado = new stdClass();

        $codigooperacion = $operacion[0]['codigooperacion'];
        if ($operaciones[$codigooperacion] != null) {
            $resultado->operacion_sobre_medios = $operaciones[$codigooperacion]['operacion_sobre_medios'];
            $resultado->signo = $operaciones[$codigooperacion]['signo'];
            $resultado->codigooperacion = $operaciones[$codigooperacion]['codigo'];
            $resultado->afectacantidad = $operaciones[$codigooperacion]['afectacantidad'];
            $resultado->afectadisponible = $operaciones[$codigooperacion]['afectadisponible'];
        }
        return $resultado;
    }

    /**
     * Devuelve la configuración de los datos a usar en la interfaz de usuario dado el identificador de una operación
     * en la aplicación
     *
     * @param int $idOperacion
     *
     * @return array
     */
    public function getDatosInterfazByIdOperacion($idOperacion)
    {
        $operaciones = self::getInterfacesDocumento();
        $operacion = ServiciosConfiguracionGeneralHelper::__init()->obtenerOperaciones(null, null, null, $idOperacion);
        $codigooperacion = $operacion[0]['codigooperacion'];

        if ($operaciones[$codigooperacion] != NULL) {
            $operaciones[$codigooperacion]['idoperacion'] = $idOperacion;
            return $operaciones[$codigooperacion];
        }

        /*

          foreach ($operaciones AS $value) {
          if ($value['codigo'] == $operacion[0]['codigooperacion']) {
          $value['idoperacion'] = $idOperacion;
          return $value;
          }
          } */

        return false;
    }

    /**
     * Devuelve la configuración de los datos a usar en la interfaz de usuario dado varios parámetros que identifiquen
     * una operación en la aplicación
     *
     * @param int $idInterfaz
     * @param int $idDatEspecif
     * @param int $codigo
     * @param int $tipo
     * @param int $idEstructura
     * @param int $idDoc
     *
     * @return array
     */
    public function getDatosInterfazOperacion(
    $idInterfaz = false, $idDatEspecif = false, $codigo = false, $tipo = false, $idEstructura = false, $idDoc = 0,
        $idfuncionalidad = false, $idoperacion = 0
    )
    {
       
        $datos = array();
        $classEstructura = 'Estructura';

        $operaciones = self::getInterfacesDocumento();
        
        $idEstructura = (($idEstructura) ? $idEstructura :
                ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura);


        $operacionesSubsistema = $this->sConfGeneral->obtenerOperaciones(
            $idEstructura, LogisticaGlobal::SUBSISTEMA_AFT, $idDoc, $idoperacion
        );
        
        if ($idfuncionalidad) {
            $certificado = Zend_Registry::get('session')->certificado;
            $integrator = ZendExt_IoC::getInstance();
            $accionesSis = $integrator->seguridad->ObtenerAcciones(
                $certificado, $idfuncionalidad, $idEstructura
            );
            foreach ($accionesSis AS $accionesS) {
                $acciones[] = $accionesS['abreviatura'];
            }
        }

        
        foreach ($operacionesSubsistema as $operacion) {
            if (in_array($operacion['codigooperacion'], $acciones) || !$idfuncionalidad) {
                $codigooperacion = $operacion['codigooperacion'];               
                
                if ($operaciones[$codigooperacion] != NULL) {
                    if (
                        (!$idInterfaz && !$idDatEspecif && !$codigo && !$tipo) ||
                        ($idInterfaz && $idInterfaz == $operaciones[$codigooperacion]['idinterfaz']) ||
                        ($idDatEspecif && $idDatEspecif == $operaciones[$codigooperacion]['iddatosespecificos']) ||
                        ($codigo && $codigo == $operaciones[$codigooperacion]['codigo']) ||
                        ($tipo && $tipo == $operaciones[$codigooperacion]['tipo'])) {

                        unset($operacion['signo']);

                        $operaciones[$codigooperacion] = array_merge($operaciones[$codigooperacion], $operacion);
                        $operaciones[$codigooperacion]['idoperacion'] = $operacion['idnomoperaciones'];
                        $operaciones[$codigooperacion]['iddoc'] = $operacion['iddocentidad'];

                        //unset($operaciones[$codigooperacion]['idnomoperaciones']);
                        //unset($operaciones[$codigooperacion]['iddocentidad']);
                        array_push($datos, $operaciones[$codigooperacion]);
                    }
                }
            }
        }

        return $datos;
    }

    /**
     *  Devuelve un arreglo de identificadores de operaciones dado determinados parámetros configurados
     *  en la aplicación
     *
     * @param int $idInterfaz
     * @param int $idDatEspecificos
     * @param int $codigo
     * @param int $tipo
     *
     * @return array
     */
    public function getArrayIdOperacionesUtilizadas($idInterfaz, $idDatEspecificos, $codigo, $tipo)
    {
        $operaciones = self::getInterfacesDocumento();
        
        $operacionesSubsistema = $this->sConfGeneral->obtenerOperaciones(0, LogisticaGlobal::SUBSISTEMA_AFT);
       
        $datos = array(); 
        foreach ($operacionesSubsistema AS $operacion) {
            $codigooperacion = $operacion['codigooperacion'];
            if ($operaciones[$codigooperacion] != null) {
                $operXml = $operaciones[$codigooperacion];
                if (
                    ($idInterfaz && $idInterfaz == $operXml['idinterfaz']) ||
                    (is_array($idInterfaz) && count($idInterfaz) && in_array($operXml['idinterfaz'], $idInterfaz)) ||
                    ($idDatEspecificos && $idDatEspecificos == $operXml['iddatosespecificos']) ||
                    (is_array($idDatEspecificos) && count($idDatEspecificos) && in_array($operXml['iddatosespecificos'],
                        $idDatEspecificos)) || ($codigo && $codigo == $operXml['codigo']) ||
                    (is_array($codigo) && count($codigo) && in_array($operXml['codigo'], $codigo)) ||
                    ($tipo && $tipo == $operXml['tipo'] ||
                    (is_array($tipo) && count($tipo) && in_array($operXml['tipo'], $tipo))
                    )
                ) {
                    
                    array_push($datos, $operacion['idnomoperaciones']);
                }
            }
        }        
        return $datos;
    }

    /**
     *  Devuelve un arreglo de identificadores de todas las operaciones que según la configuración de la aplicación,
     *  contabilizan
     *
     * @return array
     */
    public function getArrayIdOpersQueContabililzan()
    {
        $classEstructura = 'Estructura';
        $operaciones = self::getInterfacesDocumento();

        $operacionesSubsistema = $this->sConfGeneral->obtenerOperaciones(
            ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura, LogisticaGlobal::SUBSISTEMA_AFT
        );
        $arrIdesNomOper = array();
        foreach ($operacionesSubsistema as $operacion) {
            $codigooperacion = $operacion['codigooperacion'];
            if ($operaciones[$codigooperacion]['generacomprobante'] === '1') {
                array_push($arrIdesNomOper, $operacion['idnomoperaciones']);
            }
        }
        return $arrIdesNomOper;
    }

    /**
     * Devuelve un arreglo de estructuras hijas con todos sus datos dado un idestructura padre.
     * En caso de que se pase el parametro $incluirPadre en true, se incluye
     * en el arreglo al padre tambien.
     *
     * @param int $idEstructura
     *
     * @return array
     */
    public function getEstructurasHijas($idEstructura, $soloAreasResp, $filtrarDominio = true)
    {
        $iddominio = ($filtrarDominio) ? $this->global->Perfil->iddominio : 0;
        return $this->getEstructurasHijasById($iddominio, $idEstructura, false, $soloAreasResp);
    }

    /**
     * Devuelve un arreglo de idestructuras hijas dado un idestructura padre.
     * En caso de que se pase el parametro $incluirPadre en true, se incluye
     * en el arreglo al padre tambien.
     *
     * @param int  $idEstructura
     * @param bool $incluirPadre
     *
     * @return array
     */
    public function getIdEstructurasHijas($idEstructura, $incluirPadre = false, $soloAreasResp = false,
        $filtrarDominio = true)
    {
        $arrIdesEstructuras = array();
        $estructuras = $this->getEstructurasHijas($idEstructura, $soloAreasResp, $filtrarDominio);
        if (count($estructuras) > 0) {
            $arrIdesEstructuras = LogisticaObjectHelper::__init()->extractValueFromArrayColumn($estructuras, 'id');
        }
        if ($incluirPadre) {
            array_push($arrIdesEstructuras, $idEstructura);
        }
        return $arrIdesEstructuras;
    }

    /**
     * Devuelve un arreglo de idestructuras
     *
     * @param int  $idDominioPermiso
     * @param int  $idEstructura
     * @param bool $checked
     *
     * @return array
     */
    public function getEstructurasHijasById($idDominioPermiso = 0, $idEstructura = 0, $checked = false,
        $soloAreasResp = false)
    {

        $estructuraHelper = ServiciosEstructuraComposicionHelper::__init();


        $result = $estructuraHelper->obtenerEstructurasNoFormales(
            $idDominioPermiso, $idEstructura, null, null, null,
            null, 0
        );

        if($checked){
            foreach ($result as $pos => $item) {
                $result[$pos]['checked'] = false;
            }
        }

        return $result;
    }

    /**
     *  Devuelve los datos de la entidad padre de un área de responsabilidad
     *
     * @param int $idPadreAreaResp
     *
     * @return array
     */
    public function getEntidadPadreArea($idPadreAreaResp)
    {
        //obtenerPadreEntidad
        $estructuraHelper = ServiciosEstructuraComposicionHelper::__init();
        $result = $estructuraHelper->obtenerPadreEntidad($idPadreAreaResp);
        return $result;


        /*
          $conn = Zend_Registry::get('conexion');

          $sql = "SELECT denominacion, idestructura FROM mod_estructuracomp.dat_estructura
          WHERE idestructura = (SELECT f.idfila FROM mod_estructuracomp.nom_filaestruc f
          WHERE f.idconcepto = 3 AND
          f.idfila = (SELECT f2.IDPADRE FROM mod_estructuracomp.nom_filaestruc f2 WHERE f2.idfila = $idPadreAreaResp)-- Id padre del area de responsabilidad
          ORDER BY f.rgt - f.lft LIMIT 1)";

          return $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC); */
    }

    /**
     * Convierte una fecha de formato ingles a formato en español
     *
     * @param date $fecha
     *
     * @return string
     */
    public function setDateFormatoIngles($fecha)
    {
        $date = date_parse_from_format('d/m/Y', $fecha);
        return $date['year'] . '-' . $date['month'] . '-' . $date['day'];
    }

    /**
     * Devuelve el listado de países registrados en el sistema
     *
     * @param string $denominacion
     * @param int    $start
     * @param int    $limit
     *
     * @return array('data', 'total')
     */
    public function getPaises($denominacion = false, $start = 0, $limit = false)
    {
        if ($denominacion && strlen($denominacion)) {
            $where = "  WHERE p.nombrepais iLike '%$denominacion%' ";
        }

        $sqlPais = "SELECT * FROM mod_datosmaestros.nom_pais p $where offset $start";
        if ($limit) {
            $sqlPais .= " limit $limit";
        }

        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sqlPais);

        if ($limit) {
            $sqlTotal = "SELECT COUNT(*) AS TOTAL FROM mod_datosmaestros.nom_pais p $where ";
            $total = $conn->fetchAll($sqlTotal);
            $total = $total['TOTAL'];
        } else {
            $total = count($datos);
        }

        array('data' => $datos, 'total' => $total);
    }

    /**
     *  Método para crear los filtros que por defecto debe tener a una clase domain determinada, según
     *  el tipo de datos de sus columnas.
     *  Para el caso de las columnas de tipo numeric filtraría por un valor igual al almacenado
     *  Para el caso de las columnas de tipo string filtraría por un valor contenido dentro de la cadena almacenada
     *
     * @param Doctrine_Query $query
     * @param string         $alias
     * @param string         $nameDomain
     * @param array          $paramsWhere
     *
     * @return void
     */
    public function getFiltroGenerico(&$query, $alias, $nameDomain, $paramsWhere)
    {
        $paramsWhere = (array) $paramsWhere;
        if (count($paramsWhere)) {
            $columns = Doctrine::getTable($nameDomain)->getColumns();
            foreach ($columns as $key => $column) {
                if ($paramsWhere[$key]) {
                    if ($column['type'] == 'numeric') {
                        $query->addWhere("{$alias}.{$key} = ?", array($paramsWhere[$key]));
                    } else {
                        if ($column['type'] == 'character varying' || $column['type'] == 'string') {
                            $query->addWhere("{$alias}.{$key} iLike '%{$paramsWhere[$key]}%'");
                        }
                    }
                }
            }
        }
    }

    /**
     * Inicializar los parámetros de paginado de una petición
     *
     * @param array $parametros
     * @param int   $start
     * @param int   $limit
     *
     * @return void
     */
    public function configStartAndLimitInParams(&$parametros, $start, $limit)
    {
        if (is_array($parametros)) {
            $parametros['start'] = $start ? $start : 0;
            $parametros['limit'] = $limit ? $limit : 30;
        } else {
            $parametros->start = $start ? $start : 0;
            $parametros->limit = $limit ? $limit : 30;
        }
    }

    /**
     * Devuelve cuantos días existen en un rango de fecha
     *
     * @param $diaIni
     * @param $mesIni
     * @param $annoIni
     * @param $diaFin
     * @param $mesFin
     * @param $annoFin
     *
     * @return float|int
     */
    public function getCantDias($diaIni, $mesIni, $annoIni, $diaFin, $mesFin, $annoFin)
    {
        $timeIniDep = mktime(0, 0, 0, $mesIni, $diaIni, $annoIni);
        $timeFinPeriodo = mktime(0, 0, 0, $mesFin, $diaFin, $annoFin);

        $segDiferencia = $timeFinPeriodo - $timeIniDep;
        $diasDiferencia = floor($segDiferencia / (60 * 60 * 24));

        return ($diasDiferencia > 0) ? $diasDiferencia : 0;
    }

    /**
     * Este metodo devuelve la operacion que condiciono el estado que se pasa por parametros
     * 
     * @param type $idestado
     */
    /* public function getEstadoOutByCodigoOperacion($arrCodigosOperaciones, $idestructura){
      if($idestructura == null){
      $classEstructura = 'Estructura';
      $idestructura = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;
      }

      $data = array();

      foreach($arrCodigosOperaciones as $key => $codigoOper){
      $result = $this->sConfGeneral->obtenerOperaciones($idestructura, 11, null, null, null, null, array('codigooperacion' => $codigoOper));
      if(count($result) > 0){

      $params->idoperacion = $result[0]['idnomoperaciones'];
      // o sino es $params->idoperacion = $result[0]['idoperacionesentidad'];

      $cfg = new CfgEstadosEntidad();
      $dat = $cfg->getEstadoSalidaOperacion($params, $idestructura);
      }
      array_push($data, $dat);
      }





      return $data;
      } */
}
