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
    private static $_static_data_operacion;
    private $idsubsistema;

    /**
     *
     */
    private function __construct($idsubsistema)
    {
        try {
            $xml = substr($_SERVER['SCRIPT_FILENAME'], 0, strrpos($_SERVER['SCRIPT_FILENAME'], 'web'))
                .'apps/logistica/activos_fijos/comun/recursos/xml/configuraciones.xml';

            if (is_readable($xml)) {
                $xmlOperaciones = simplexml_load_file($xml);
                $jsonString = json_encode($xmlOperaciones);

                $this->xmlConfiguraciones = json_decode($jsonString, true);
                $_static_data_operacion = array();
            } else {
                die('No se puede leer el fichero que se encuentra en: '.$xml);
            }
        } catch (Exception $exc) {
            die($exc->getMessage());
        }
        
        $this->sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->idsubsistema = $idsubsistema;
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
    public static function getInstance($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {

        if (!isset(self::$instance)) {           
            $class = __CLASS__;
            self::$instance = new $class($idsubsistema);
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
            2 => 'Alquilado a cliente', // Para los # de series alquilados donde la entidad alquila proveedora
            3 => 'Alquilado a proveedor', // Para los numeros de series en las que la entidad que alquila es la cliente
            4 => 'Prestado', // Para los numeros de series presatos
            5 => 'Reparacion', // Para los numeros de series que estan en el taller
            6 => 'Trasladado', // Para los numeros de series que han sido trasladados externamente
            7 => 'Baja', // Para los numeros de series que se han dado de baja de la entidad por algun motivo
            8 => 'Devuelto', // Para los numeros de series que son devueltos porque no se recepcionan en el traslado
            9 => 'Conciliando apertura', // Para los numeros de series que estan en la conciliacion de la apertura
            10 => 'Asignado' // Para los regnumerico que son asignados como por ejemplo a patrimonio
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
                substr($_SERVER['SCRIPT_FILENAME'], 0, strrpos($_SERVER['SCRIPT_FILENAME'], 'web')).'apps/'.$url
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

    public function integradoContabiliadConf($idestructura)
    {
        $contabilidad = self::integradoContabilidad();
        if($contabilidad == 1){
            $confModel = new ConfparametrosgeneralesModel();
            $confEntidad = $confModel->getConfiguracionPG($idestructura);
            if($confEntidad[0]['contabilidad'] == 1){
                return 1;
            }
        }
        return 0;
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
    public function getInterfacesDocumento($entrada)
    {
        $operaciones = $this->xmlConfiguraciones['operaciones'];
        $arrOperacionesAsociativo = array();
        foreach ($operaciones as $value) {
            if($entrada && $value['signo'] != '+')
                continue;
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

    public function getArrayOperacionEntrada($obj){
        $operaciones = $this->getInterfacesDocumento(true);
        $operacion = $this->sConfGeneral->obtenerOperaciones(0, 0, 0);

        $resultado =  array();
        foreach($operacion as $oper){
            if ($operaciones[$oper['codigooperacion']] != null) {
                $res['signo'] = $operaciones[$oper['codigooperacion']]['signo'];
                $res['id'] = $oper['idnomoperaciones'];
                $res['codigooperacion'] = $oper['codigooperacion'];
                ($obj)?$resultado[]=$res: $resultado[] = $res['id'];
            }
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
        if(self::$_static_data_operacion[$idOperacion]){
            return self::$_static_data_operacion[$idOperacion];
        }else{
            $operaciones = self::getInterfacesDocumento();
            $operacion = ServiciosConfiguracionGeneralHelper::__init()->obtenerOperaciones(null, null, null, $idOperacion);
            $codigooperacion = $operacion[0]['codigooperacion'];

            if ($operaciones[$codigooperacion] != NULL) {
                $operaciones[$codigooperacion]['idoperacion'] = $idOperacion;
                self::$_static_data_operacion[$idOperacion] = $operaciones[$codigooperacion];
                return $operaciones[$codigooperacion];
            }
        }

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
        //print_r(func_get_args());
        $datos = array();
        $classEstructura = 'Estructura';

        $operaciones = self::getInterfacesDocumento(); //Devuelve todas las operaciones

        $idEstructura = (($idEstructura) ? $idEstructura :
                ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura);

        $operacionesSubsistema = $this->sConfGeneral->obtenerOperaciones(
            $idEstructura, $this->idsubsistema, $idDoc, $idoperacion
        );
        //print_r($operacionesSubsistema);die("asdhjasd PPPOOO");


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
       
//print_r($operacionesSubsistema);
        foreach ($operacionesSubsistema as $operacion) {
            $codigooperacion = $operacion['codigooperacion'];
/*            print_r('$operaciones');
            print_r($operaciones);
            print_r('$codigooperacion');
            print_r($codigooperacion);
*/
            if ($operaciones[$codigooperacion] != NULL) {
                if (in_array($operacion['codigooperacion'], $acciones) 
                    || !$idfuncionalidad 
                    || !$operaciones[$codigooperacion]['restringida'] 
                    || $operaciones[$codigooperacion]['restringida'] === '0'
                ) {
                //print_r($operaciones[$codigooperacion]);

                
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
        //print_r($datos);die;
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

        $operacionesSubsistema = $this->sConfGeneral->obtenerOperaciones(0, $this->idsubsistema);

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
    public function getArrayIdOpersQueContabililzan($operacionesConModeloContabilizacion = false)
    {
        $classEstructura = 'Estructura';
        $operaciones = self::getInterfacesDocumento();

        $operacionesSubsistema = $this->sConfGeneral->obtenerOperaciones(
            ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura, $this->idsubsistema
        );
        $arrIdesNomOper = array();
        foreach ($operacionesSubsistema as $operacion) {
            $codigooperacion = $operacion['codigooperacion'];
            if ($operaciones[$codigooperacion]['generacomprobante'] === '1') {
                if($operacionesConModeloContabilizacion && $operacion['idmodelo'] || !$operacionesConModeloContabilizacion){
                    array_push($arrIdesNomOper, $operacion['idnomoperaciones']);
                }
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

    /** @deprecated
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
     * Devuelve un arreglo de idareas hijas de la estructura actual.

     * @return array
     */
    public function getIdsAreasHijas($params = false)
    {
        $areas = $this->getAreasHijas($params);
            
        $arrIdesAreas = array(); 
        if (count($areas['depositos']) > 0) {
            $arrIdesAreas = LogisticaObjectHelper::__init()->extractValueFromArrayColumn($areas['depositos'], 'iddeposito');
        }
        return $arrIdesAreas;
    }

    /*
     * Devuelve un arreglo de areas hijas de la estructura actual
     */
    public function getAreasHijas($params){
        $classEstructura = 'Estructura';
        $idEstructura = isset($params['idestructuradestino']) ? $params['idestructuradestino'] : ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;

        $data = $this->getAreasRespActivos($idEstructura, $params);
        $areas['depositos'] = $data;
        return $areas;
    }
    public function getAreasHijas1($params){
        $classEstructura = 'Estructura';
        $idEstructura = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;

        $data = $this->getAreasSinregistro($idEstructura, $params);
        $areas['depositos'] = $data;
        return $areas;
    }
    
    /*
     * Este metodo selecciona las areas de responasbilidad que descienden de una estructura
     * En caso que que algunas de esas areas sean descendientes de una Estructura (UEB) con 
     * idorgano = -2 and idconcepto = 5 no se incluyen en la respuesta. Ej.
     *                             A
     *                            /|\
     *                           / | \
     *                          /  |  \
     *                         /   |   \     
     *                        B    H    C 
     *                       / \       / \
     *                      D   E     F   G
     * Donde C es una UEB (idorgano = -2 and idconcepto = 5), B es una oficina central,
     * y D, E, F, G, y H son areas de responsabilidad.
     * El siguiente metodo si se le pasa la Estructura A devuelve (D, E, H) ya que excluye a 
     * (F, G) por estar dentro de una UEB.
     */
    
    public function getAreasRespActivos($idestructura, $params) {
       
            $sql ="
            select	distinct aresp.idarea,
		            f.idfila as iddeposito,
		            f.idfila as id,
		            op.denominacion as deposito,
		            op.codigo as codigo,
		            op.denominacion as text,
		            '' as denestado,
		            null as estado,
		            '' as color
            from mod_estructuracomp.nom_filaestruc f
            inner join mod_estructuracomp.dat_estructuraop op on op.idestructuraop = f.idfila and op.idproyecto = 0
            left join mod_logactivofijotangible.dat_regnumericoactivo drna on drna.idarearesp = op.idestructuraop
            inner join mod_contabilidadcosto.conf_areasreponsabilidad aresp 
                    on ( aresp.idarea = op.idestructuraop
                    	and	f.parent_path operator(public.<@) (	select fe1.parent_path from mod_estructuracomp.nom_filaestruc fe1
																where fe1.idfila = $idestructura
                                                                )
                        )
            where (f.fechafin is null or f.fechafin > now()::date) 
                and f.idfila not in (with uebs_contenidas as (select distinct f.idfila as id, f.parent_path
												                from mod_estructuracomp.nom_filaestruc f
												                inner join mod_estructuracomp.dat_estructuraop op 
                                                                    on op.idestructuraop = f.idfila and op.idproyecto = 0
												                where (f.fechafin is null or f.fechafin > now()::date) 
													                and f.parent_path operator(public.<@) (	select fe1.parent_path
																							                from mod_estructuracomp.nom_filaestruc fe1
																						                    where fe1.idfila = $idestructura
																						                    )
						 							                and op.idorgano = -2 and op.idconcepto = 5 
                                                                    and f.idfila <> $idestructura
						 						                )						 
                                    select f.idfila from mod_estructuracomp.nom_filaestruc as f
						            right join uebs_contenidas as ueb on f.parent_path operator(public.<@) ueb.parent_path
					                )";

        $conn = Zend_Registry::get('conexion');
        // Filtros
        if ($params['criterio']) {
            $sql .= " AND ( op.codigo ilike '%{$params['criterio']}%'
                        OR  op.denominacion ilike '%{$params['criterio']}%') ";
        }
        if ($params['idseleccionados']) {
            $arraySelect = Zend_Json::decode($params['idseleccionados']);
            $idareasresp = implode(',', $arraySelect);
            if ($idareasresp) {
                $sql .= " and op.idestructuraop NOT IN ($idareasresp) ";
            }
        }
        if(($params['start'] || $params['start'] == 0)  && $params['limit']){
            return array(
                'datos' => $conn->execute("$sql  ORDER BY op.denominacion OFFSET {$params['start']} LIMIT {$params['limit']} ")->fetchAll(PDO::FETCH_ASSOC),
                'cantidad' => $conn->fetchAll("SELECT count(sub.*) FROM ($sql) as sub ")[0]['count']
            );
        }
        $respdata = $conn->execute("$sql ORDER BY op.denominacion");
        return $respdata->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getAreasSinregistro($idestructura, $params) {
        $sql ="
        select distinct aresp.idarea,
        f.idfila as iddeposito,
        f.idfila as id,
        op.denominacion as deposito,
        op.codigo as codigo,
        op.denominacion as text,
        '' as denestado,
        null as estado,
        '' as color
        from mod_estructuracomp.nom_filaestruc f
        inner join mod_estructuracomp.dat_estructuraop op on op.idestructuraop = f.idfila 
        inner join mod_logactivofijotangible.dat_regnumericoactivo drna on drna.idarearesp = op.idestructuraop
        inner join mod_contabilidadcosto.conf_areasreponsabilidad aresp on aresp.idarea = drna.idarearesp 
        and 
        f.parent_path OPERATOR(public.<@) (
        select fe1.parent_path
        from mod_estructuracomp.nom_filaestruc fe1
        WHERE fe1.idfila = $idestructura
        )
        UNION
        ( select distinct aresp.idarea,
                f.idfila as iddeposito,
                f.idfila as id,
                op.denominacion as deposito,
                op.codigo as codigo,
                op.denominacion as text,
                '' as denestado,
                null as estado,
                '' as color
        from mod_estructuracomp.nom_filaestruc f
        inner join mod_estructuracomp.dat_estructuraop op on op.idestructuraop = f.idfila 
        inner join mod_contabilidadcosto.conf_areasreponsabilidad aresp on aresp.idarea = op.idestructuraop

        left join mod_logactivofijotangible.dat_regnumericoactivo drna on drna.idarearesp = op.idestructuraop

        where           f.parent_path OPERATOR(public.<@) (
        select fe1.parent_path
        from mod_estructuracomp.nom_filaestruc fe1
        WHERE fe1.idfila = $idestructura)
        and drna.idregnumerico is null
        ) ";

    $conn = Zend_Registry::get('conexion');
    
    // Filtros
    if ($params['criterio']) {
        $sql .= " AND ( op.codigo ilike '%{$params['criterio']}%'
                    OR  op.denominacion ilike '%{$params['criterio']}%') ";
    }
    if ($params['idseleccionados']) {
        $arraySelect = Zend_Json::decode($params['idseleccionados']);
        $idareasresp = implode(',', $arraySelect);
        if ($idareasresp) {
            $sql .= " and op.idestructuraop NOT IN ($idareasresp) ";
        }
    }
        return array(
            'datos' => $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC),
            //'cantidad' => $conn->fetchAll("SELECT count(sub.*) FROM ($sql) as sub ")[0]['count']
        );
    
    
   // $respdata = $conn->execute("$sql ORDER BY op.denominacion");
   // return $respdata->fetchAll(PDO::FETCH_ASSOC);
}
	
	public function getEstructuraOpPadreSuperior($idestructura){
		$sql = "select 
                f.idfila as idestructura,
                op.denominacion as denominacion
                from mod_estructuracomp.nom_filaestruc f
                left join mod_estructuracomp.dat_estructuraop op on op.idestructuraop = f.idfila
                where 
                	  f.parent_path OPERATOR(public.@>) (
                      select fe1.parent_path
                      from mod_estructuracomp.nom_filaestruc fe1
                      WHERE fe1.idfila = $idestructura
                    )   
                    AND f.fechafin is null
                    AND op.idproyecto = 0
                    AND f.idconcepto = 5
                        and (op.idconcepto=5 OR op.idconcepto=8)
                        order by f.parent_path ASC limit 1
				";
		$conn = Zend_Registry::get('conexion');
        $respdata = $conn->execute($sql);
        return $respdata->fetchAll(PDO::FETCH_ASSOC);
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
            $idDominioPermiso, $idEstructura, null, null, null, null, 0
        );

        if ($checked) {
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
        return $date['year'].'-'.$date['month'].'-'.$date['day'];
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
    
    
    
     /**
     * Metodo para saber si estoy en un proceso de revaluacion
     * Es decir: Si se realiza en una reevaluacion en la entidad el metodo devuelve verdadero.
     * Para saber si poder hacer operaciones con los RN de la entidad o no.
     *
     * @param 
     * @param 
     * @param 
     *
     * @return booleano
     */
    
     public function getProcesoRevaluacion()
    {
        return "false";
    }

    /**
     * @param      $parametros
     * @param bool $sql
     *
     * @return mixed
     * @throws Zend_Exception
     */

    public function cargarEstructuras($parametros, $sql = false){
        
        $classEstructura = 'Estructura';
        $idestructura = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;
        $excluir = $parametros['excluir'];
        $criterio = $parametros['criterio'];
        
        $datos = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras($idestructura, $excluir, $criterio);
        
        foreach($datos as $i => $dato)        
            $datos[$i]->idfila = $datos[$i]->idestructura;
        
        $respuesta['datos'] = $datos;
        $respuesta['total'] = count($datos);
        return $respuesta;
        
        // Esto se ha comentariado porque no se usa para las cosas de moncar
        // ya que ahora las estructuras pueden ser organos internos, por lo que
        // se usa el metodo que hizo kenier.
        
        /*$conn = Zend_Registry::get('conexion');
        $selectData = " SELECT DISTINCT es.codigo || ' - ' || es.denominacion as denominacion,
        btrim(concat(es.codigo,' - ',es.denominacion),' - ')  as text, f.idfila as idfila, es.codigo as codigo ";
        $sqlFrom = " FROM mod_estructuracomp.nom_filaestruc f
        INNER JOIN mod_estructuracomp.dat_estructura es on es.idestructura = f.idfila";
        $sqlWhere = " where es.idconcepto = 3 ";
        
        if($parametros['criterio']){
            $sqlWhere .= " AND ( es.codigo ilike '%{$parametros['criterio']}%'
                           OR  es.denominacion ilike '%{$parametros['criterio']}%') ";
        }
        if($parametros['excluir']){
            $excluir = (is_array($parametros['excluir'])? implode(",",$parametros['excluir']):$parametros['excluir']);
            $sqlWhere .= " AND  f.idfila NOT IN ($excluir) ";
        }
        if($parametros['idsestructura']){
            $ids = $parametros['idsestructura'];
            $ids = (is_array($ids)? implode(",",$ids):$ids);
            $sqlWhere .= " AND  f.idfila IN ($ids) ";
        }
        $sqlGroupBy = " GROUP BY es.denominacion, f.idfila, es.idconcepto, es.codigo ";
        $start = ($parametros['start']) ? $parametros['start'] : 0;
        $limit = ($parametros['limit']) ? $parametros['limit'] : 30;
        if (is_numeric($start) && is_numeric($limit)) {
            $sqlPaginado = " OFFSET($start) LIMIT($limit)";
        } else {
            $sqlPaginado = "";
        }
        $sqlSelectCount = "SELECT count(DISTINCT es.denominacion) as cantidad";
        $total = $conn->fetchAll($sqlSelectCount.$sqlFrom.$sqlWhere);
        if($sql){
            return $selectData.$sqlFrom.$sqlWhere.$sqlGroupBy.$sqlPaginado;
        }
        else {
            $respuesta['total'] = $total[0]['cantidad'];
            $respuesta['datos'] = $conn->fetchAll($selectData . $sqlFrom . $sqlWhere . $sqlGroupBy . $sqlPaginado);
            return $respuesta;
        }*/
    }

    /* 
     * Esta funcion es un hack para poder incluir el includePath de estructura y composicion
     * algunas de sus clases Domain para poder realizar innerJoin directo con estas clases a travez de doctrine.
     * 
     * El hack consiste en llamar un servicio cualquiera del modulo de estructura y composicion, no importa que servicio sea, 
     * solo llamar alguno (preferentemente el mas rapido en ejecutarse) a travez de IoC integrator, este cuando llama al sercicio
     * especifico incluye en el includePath de php/Zend las clases de estructura y composicion, y desde ese momento se puede hacer
     * referencia a estas clases sin temor a que salte el error de que no existe una clase X que pertenece al modulo de estructura
     * con la cual no podemos hacer innerJoin.
     * 
     * Recomendacion: Pedirle al personal de estructura y composicion que publique un servicio vacio, que devuelva algo sencillo como
     * el valor: true, para que no haya complejidad algoritmica, ni consumo de memoria demas, ni acceso a BD innecesario.
    */

    public function incluirEstructuraHack() {
        ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(ZendExt_GlobalConcept::getInstance()->Estructura->idestructura, false);
    }


    // ----------------------------- PARA EL COMPLETAMIENTO ----------------------------------------------------------//
    /**
     * @param $arrdatos array(array('idestructura' =>9999999, 'idindicador' => 99999, 'cantidad' => 5))
     *
     */
    // Metodo estático, significa que el metodo hay que llamarlo con '::' (cuatro puntos)

    public static function validarInsertarVariosCompletamiento($arrdatos)
    {
        foreach($arrdatos as $dato){
            //validando los datos
            if(is_numeric($dato['idindicador']) && is_numeric($dato['idestructura']) && is_numeric($dato['cantidad']))
                if(!self::validarInsertPorCompletamiento($dato['idindicador'], $dato['idestructura'], $dato['cantidad']))
                    return false;
        }
        return true;
    }

    /**
     * @param $idindicador
     * @param $idestructura
     * @param $cantidad
     * @param $datasalida
     * @return bool
     */
    public static function validarInsertPorCompletamiento($idindicador, $idestructura, $cantidad, &$datasalida)
    {
        $data = self::buscaNomMedioEyC($idindicador, $idestructura);
        $datasalida = $data;

        if(count($data) > 0)
        {
            $data = $data[0];
            if($data['cantidad'] - $data['cantreal'] >= $cantidad)
                return true; // Se puede agregar
            else
                return false; // No se puede agregar
        }
    }

    /**
     * @param $idindicador
     * @param $idestructura
     * @param $cantidad
     * @return mixed
     * @throws Zend_Exception
     */
    // Metodo estático, significa que el metodo hay que llamarlo con '::' (cuatro puntos)
    public static function incrementarCompletamiento($idindicador, $idestructura, $cantidad)
    {
        $data = array();
        if(self::validarInsertPorCompletamiento($idindicador, $idestructura, $cantidad, $data))
        {
            $sql = "UPDATE mod_estructuracomp.dat_medio SET cantidadreal = cantidadreal + $cantidad WHERE idmedio = ". $data['idmedio'];
            $conn = Zend_Registry::get('conexion');
            $conn->execute($sql);
            return $data['cantreal'] + $cantidad;
        }
    }

    /**
     * @param $idindicador
     * @param $idestructura
     * @param $cantidad
     * @return mixed
     * @throws Zend_Exception
     */
    // Metodo estático, significa que el metodo hay que llamarlo con '::' (cuatro puntos)
    public static function decrementarCompletamiento($idindicador, $idestructura, $cantidad)
    {
        $data = self::buscaNomMedioEyC($idindicador, $idestructura);

        if(count($data) > 0)
        {
            $sql = "UPDATE mod_estructuracomp.dat_medio SET cantidadreal = cantidadreal - $cantidad WHERE idmedio = ". $data['idmedio'];
            $conn = Zend_Registry::get('conexion');
            $conn->execute($sql);
            return $data['cantreal'] - $cantidad;
        }
    }

    /**
     * @param $idindicador
     * @param $idestructura
     * @return mixed
     * @throws Zend_Exception
     */
    // Metodo estático, significa que el metodo hay que llamarlo con '::' (cuatro puntos)
    private static function buscaNomMedioEyC($idindicador, $idestructura)
    {
        $sql = "SELECT dm.idmedio, dm.idnommedio as idindicador, dm.cantidad, COALESCE(dm.cantreal, 0) as cantreal  
                    FROM mod_estructuracomp.dat_medio dm
                    INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = dm.idmedio
                    inner join mod_datosmaestros.nom_indicador i on i.idindicador = dm.idnommedio
                    WHERE 
                        dm.idnommedio IN (
                              SELECT ni.idindicador 
                              FROM mod_datosmaestros.nom_indicador ni 
                              WHERE ni.idarbol = (
                                SELECT ni1.idarbol 
                                FROM mod_datosmaestros.nom_indicador ni1
                                WHERE ni1.idindicador = $idindicador
                              )
                              ORDER BY ni.nivel DESC
                            )
                         and nf.parent_path <@ $idestructura
                ";
        $conn = Zend_Registry::get('conexion');
        $data = $conn->fetchAll($sql);

        return $data;
    }
}
