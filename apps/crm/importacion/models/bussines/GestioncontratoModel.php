<?php

/**
 *
 *
 * @author         Ing. Rodain Terrer Molina
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Models/Bussines
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
define('APP_HOME', realpath(dirname(__FILE__)) . '/');
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/Mpdf/mpdf.php');

class GestioncontratoModel extends ZendExt_Model
{
    private $_numero;
    private $_gestordocumental;
    private $_datosmaestros;
    private $_persona;
    private $_logistica;
    private $_datindicador;
    public $_planificacion;
    public $_contrato;
    public $_estructura;
    public $_confcontratacion;
    private $_idestructura;
    private $_transicion;
    private $_seguridad;
    private $_iddominio;
    private $_extrafields;
    private $_anexos;
    private $_increment_sign;
    private $_reclamacion;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_contrato = new DatContrato();
        $this->_numero = new GestionarNumContratoModel();
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->_persona = new PersonaComunicationInterface();
        $this->_logistica = new LogisticaComunicationInterface();
        $this->_planificacion = new PlanificacionComunicationInterface();
        $this->_estructura = new EstructuraComunicationInterface();
        $this->_datindicador = new DatIndicadorContrato();
        $this->_confcontratacion = new ConfContratacionModel();
        $this->_idestructura = $this->global->Estructura->idestructura;
        $this->_transicion = new NomTransicion();
        $this->_seguridad = new SeguridadComunicationInterface();
        $this->_demandaDService = new DemandaDService();
        $this->_reclamacionesDService = new ReclamacionesDService();
        $this->_hitoareaimplicada=new DatHitoAreaImplicada();
        $this->_contratoclientesasociados=new DatContratoClientesAsociados();
        $this->_hitocontrato=new DatHitoContrato();
        $this->_iddominio = $this->global->Perfil->iddominio;
        $this->_extrafields
            = array('denominacionclienteproveedor' => array('mapping' => 'clienteproveedor',
                                                            'type'    => 'string'),
                    'idresponsable'                => array('mapping' => 'idpersona'),
                    'tipocontrato'                 => array('type' => 'string'),
                    'clienteproveedor'             => array('type' => 'string'),
                    'transicion'                   => array('type' => 'array'),
                    'mediopago'                    => array('type' => 'array'),
                    'acciones'                     => array('type' => 'array'),
                    'estadoinicial'                => array('type' => 'string'),
                    'iconoestadoinicial'           => array('type' => 'string'),
                    'sector'                       => array('type' => 'string'),
                    'vigente'                      => array('type' => 'string'),
                    'nombrepersona'                => array('type' => 'string'),
                    'condicionpago'                => array('type' => 'string'),
                    'nombrearea'                   => array('type' => 'string'),
                    'idplantilla'                  => array('type' => 'string'),
                    'denominacioncontratomarco'    => array('type' => 'string'),
                    'registropago'                 => array('type' => 'array'),
                    'monedas'                      => array('type' => 'array'),
                    'idmediopago'                  => array('type' => 'string'),
                    'diasrestantesvigencia'        => array('type' => 'int'),
                    'cumplimientoobligaciones'     => array('type' => 'int'),
                    'idoferta'                     => array('type' => 'int'),
                    'deuda'                        => array('type' => 'boolean'),
                    'categoria'                    => array('type' => 'string'),
                    'fechaestado'                  => array('type' => 'date'),
                    'idcontratoimportacion'        => array('type' => 'int'),
                    'idlinea'                      => array('type' => 'int'),
                    'idtipolinea'                  => array('type' => 'int'),
                    'idpuertoorigen'               => array('type' => 'string'),
                    'idpuertodestino'              => array('type' => 'string'),
                    'idincoterm'                   => array('type' => 'string'),
                    'linea'                        => array('type' => 'string'),
                    'reclamaciones'                => array('type' => 'string'),
                    'idreclamacion'                => array('type' => 'string'),
                    'tipolinea'                    => array('type' => 'string'),
                    'puertoorigen'                 => array('type' => 'array'),
                    'puertodestino'                => array('type' => 'array'),
                    'incoterm'                     => array('type' => 'array'),
                    'nombreoferta'                 => array('type' => 'string'),
                    'nombreareacreado'             => array('type' => 'string'),
                    'idespaciotrabajo'             => array('type' => 'string'),
                    'iddestinocomercial'           => array('type' => 'numeric'),
                    'destinocomercial'             => array('type' => 'string'),
                    'idclientefinal'               => array('type' => 'numeric'),
                    'clientefinal'                 => array('type' => 'string'),
                    'idcondicionespago'           => array('type' => 'string'),
                    'condicionespago'             => array('type' => 'array'),
        );
        $this->_increment_sign = false;
        $this->_mostrar_suplementos = false;
        $this->_mostrar_hitos_area = false;
        $this->_anexos = new DatAnexo();
//         $file = APP_HOME . '../../../comun/recursos/server_config.ini';
//         if (file_exists($file)) {
//             $config = parse_ini_file($file, true);
// //            $temp = $config['contratos']['increment_sign'];
//             $this->_increment_sign = $config['contratos']['increment_sign'] ?
//                 ($config['contratos']['increment_sign'] == 'true' ? true : false) : false;
//             $this->_mostrar_suplementos = ($config['contratos']['mostrar_todos'] ?
//                 ($config['contratos']['mostrar_todos'] == 'true' ? true : false) : false);
//             $this->_manual_number = ($config['contratos']['numero_manual'] ?
//                 ($config['contratos']['numero_manual'] == 'true' ? true : false) : false);
//             $this->_mostrar_hitos_area = $config['contratos']['mostrar_hitos_areas'] ?
//                 ($config['contratos']['mostrar_hitos_areas']== 'true'?true:false): false;
//             $this->_mostrar_todas_areas=$config['areas']['mostrar_todas']?
//                 ($config['areas']['mostrar_todas']== 'true'?true:false): false;
//             $this->_cliente_tipocontrato=$config['contratos']['cliente_tipocontrato']?
//                 ($config['contratos']['cliente_tipocontrato']== 'true'?true:false): false;
//             $this->_show_by_resource=$config['contratos']['show_by_resource']?
//                 ($config['contratos']['show_by_resource']== 'true'?true:false): false;
//         }
        $instance = (new ConfContratoGeneral())->getConfig();           
        $config = (array)json_decode($instance['confgcontrato']);
        if ($config) {
            // $config = parse_ini_file($file, true);
            $this->_increment_sign = $config['increment_sign'] && $config['increment_sign'] == 'true';
            $this->_mostrar_hitos_area = $config['mostrar_hitos_areas'] && $config['mostrar_hitos_areas'] == 'true';
            $this->_mostrar_suplementos = ($config['mostrar_todos'] && $config['mostrar_todos'] == 'true');
            $this->_manual_number = ($config['numero_manual'] && $config['numero_manual'] == 'true');
            $this->_mostrar_todas_areas = $config['mostrar_todas_area'] && $config['mostrar_todas_area'] == 'true';
            $this->_cliente_tipocontrato = $config['cliente_tipocontrato'] && $config['cliente_tipocontrato'] == 'true';
            $this->_mostrar_filtro_area = $config['mostrar_filtro_area'] && $config['mostrar_filtro_area'] == 'true';
          //  $this->_show_by_resource = $config['show_by_resource'] && $config['show_by_resource'] == 'true';
            $this->_estructura_persona_nomencladores = $config['estructura_persona_nomenclador'] && $config['estructura_persona_nomenclador'] == 'true';
           
        }  
    }

    public function getContratos($params, $includedefaultfilter = true,
        $includeextravalues = true
    ) {
        try {
            $filter = $params['filter'];
            $filter2 = json_decode($params['filter2'], true);
            if (!$filter) {
                $filter = array();
            }
            if (!isset($params['incluirtransiciones'])) {
                $params['incluirtransiciones'] = true;
            }

            //Se adiciona la condicion para cargar los contratos dado un dominio
            $filter[] = array('field' => 'dominiofila',
                              'data'  => array('type'  => 'bit',
                                               'value' => $this->_iddominio
                                                   ? $this->_iddominio : 1));
            $filter[] = array('field' => 'cliente',
                              'data'  => array('type'  => 'list',
                                               'value' => '[2]'));
            if ($includedefaultfilter) {

                $filter[] = array('field' => 'ultimocontrato',
                                  'data'  => array('type'  => 'other',
                                                   'value' => !$this->_mostrar_suplementos));
                $filter[] = array('field' => 'hitosarea',
                                  'data'  => array('type'  => 'other',
                                                   'value' => $this->_mostrar_hitos_area));
                $filter[] = array('field' => 'todasareas',
                                  'data'  => array('type'  => 'other',
                                                   'value' => $this->_mostrar_todas_areas));
                $filter = $this->getDefaultFilters($filter);
            }
            $result = $this->_contrato->cargarcontrato(
                array($filter, ' AND '),
                array($filter2, ' OR '),
                $params['sort'],
                $params['limit'],
                $params['start'],
                $this->_idestructura
            );

            if ($includeextravalues) {
                $result = $this->setValoresExtras(
                    $result, $params['incluirtransiciones']
                );
            }

            return $result;
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function getDefaultFilters($filter)
    {
        try {
            $roles = $this->getArrayRolsIds();
            $params = array('filter' => array(
                array('field' => 'idrol',
                      'data'  => array('type'  => 'numeric',
                                       'value' => $roles)),
                array('field' => 'idestructuracomun',
                      'data'  => array('type'  => 'numeric',
                                       'value' => $this->_idestructura))
            )
            );
            $params['modelName'] = 'DatContrato';
            $result = $this->_confcontratacion->loadFiltersCompartimentacion(
                $params
            );
            return array_merge($filter, $result);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getArrayRolsIds()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $rolsArray = $this->_seguridad->getRolsByUser(
            $global->Perfil->idusuario
        );
        $ids = array();
        foreach ($rolsArray as $rol) {
            if (is_numeric($rol['idrol'])) {
                $ids [] = $rol['idrol'];
            }
        }
        return $ids;
    }

    private function getArrayMonedasValores()
    {
        try {
            $monedas = $this->_contrato->cargarMonedasDominio(
                $this->_iddominio
            );
            $resultado = [];
            foreach ($monedas as $moneda) {
                if (!isset($resultado[$moneda['idcontrato']][$moneda['idmoneda']])) {
                    $resultado[$moneda['idcontrato']][$moneda['idmoneda']]
                        = array('valor'=>$moneda['valor'], 'incremento'=>$moneda['incremento']);
                }
            }
            return $resultado;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function getArrayMonedasEntidad($idestructura)
    {
        try {
            $resultado = $this->_datosmaestros->getMonedasEntidad(
                $idestructura
            );
            foreach($resultado as $r){
                $this->_extrafields['montomoneda_'.strtolower($r['codigoiso']).'_'.$r['idmoneda']]= array('type' => 'float');
                $this->_extrafields['incremento_'.strtolower($r['codigoiso']).'_'.$r['idmoneda']]= array('type' => 'float');
            }
            return $resultado;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function getMetaData()
    {
        try {
            $types = array('numeric' => 'int', 'character varying' => 'string');
            $contrato = new DatContrato();
            $columns = $contrato->getTable()->getColumns();
            $merge = array_merge($columns, $this->_extrafields);
            $fields = [];
            $idproperty = '';
            foreach ($merge as $key => $conf) {
                if ($conf['type'] && $types[$conf['type']]) {
                    $conf['type'] = $types[$conf['type']];
                }
                if ($conf['type'] == 'date') {
                    unset($conf['type']);
                }
                if ($conf['mapping']) {
                    $conf['name'] = $conf['mapping'];
                    unset($conf['mapping']);
                }
                if ($conf['primary']) {
                    $idproperty = $key;
                }
                $fields[] = array_merge(array('name' => $key), $conf);
            }
            return array('fields' => $fields, 'idProperty' => $idproperty);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function setValoresExtras($result, $incluirtransiciones = true)
    {
        try {
            $t = array();
            $monedas = $this->getArrayMonedasValores();
            $extra = [];
            $result['monedasentidad']
                = $monedasEntidad[$this->_idestructura]
                = $this->getArrayMonedasEntidad($this->_idestructura);
            $result['metaData'] = $this->getMetaData();
            $v = array();
            if ($incluirtransiciones) {
                $result['estados_cliente'] = $this->getTransicionesProceso(
                    'mdContrato'
                );
                $result['estados_importacion'] = $this->getTransicionesProceso(
                    'mdcontratoimportacion'
                );
            }
            $idclientesproveedores = array();
            foreach ($result['data'] as $index => $d) {
                $idclientesproveedores[] = $d['idclienteproveedor'];
                $v[$d['numero']] = array('idresponsable' => $d['idresponsable'],
                                         'nombrepersona' => $d['nombrepersona']);
                $idestructura = $d['idestructuracomun'];

                if (!isset($monedasEntidad[$idestructura])) {
                    $monedasEntidad[$idestructura]
                        = $this->getArrayMonedasEntidad($idestructura);
                }
                foreach ($monedasEntidad[$idestructura] as $k => $m) {
                    $field = strtolower($m['codigoiso']);
//                    if (!in_array($field, $extra)) {
//                        $extra[] = $field;
//                        $result['metaData']['fields'][]
//                            = array('name' => 'montomoneda_' . $field . '_'
//                            . $m['idmoneda']);
//                        $result['metaData']['fields'][]
//                            = array('name' => 'incremento_' . $field . '_'
//                            . $m['idmoneda']);
//                    }
                    $monedasEntidad[$idestructura][$k]['monto']
                        =
                    $result['data'][$index]['montomoneda_' . $field . '_'.$m['idmoneda']]
                        = $monedas[$d['idcontrato']][$m['idmoneda']]['valor'];
                    $monedasEntidad[$idestructura][$k]['incremento']=
                    $result['data'][$index]['incremento_' . $field.'_'.$m['idmoneda']]
                        = $monedas[$d['idcontrato']][$m['idmoneda']]['incremento'];
                }
                $result['data'][$index]['monedas']
                    = $monedasEntidad[$idestructura];
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
                $query
                    = 'SELECT mp.idmediopago, nmp.nombre
                  FROM mod_crmcontratacion.dat_mediopagocontrato mp
                  INNER JOIN mod_crmcontratacion.nom_mediodepago nmp 
                  ON nmp.idmediodepago=mp.idmediopago
                  WHERE mp.idcontrato=' . $d['idcontrato'];
                $a = $conexionActual->fetchAll($query);
                $datos = array('id' => '', 'nombre' => array());
                foreach ($a as $e) {
                    $datos['id'] = $datos['id'] . $e['idmediopago'] . ',';
                    $datos['nombre'][] = $e['nombre'];
                }
                $result['data'][$index]['idmediopago'] = trim(
                    $datos['id'], ','
                );
                $result['data'][$index]['mediopago'] = $datos['nombre'];

                $puertosorigen = $conexionActual->fetchAll(
                    'SELECT mp.idpuertoorigen, nmp.denominacion
                  FROM mod_crmcontratacion.dat_puertoorigencontrato mp
                  INNER JOIN mod_crmcontratacion.nom_puertoorigen nmp 
                  ON nmp.idpuertoorigen=mp.idpuertoorigen
                  WHERE mp.idcontrato=' . $d['idcontrato']
                );
                $datosp = array('id' => '', 'nombre' => array());
                foreach ($puertosorigen as $e) {
                    $datosp['id'] = $datosp['id'] . $e['idpuertoorigen'] . ',';
                    $datosp['nombre'][] = $e['denominacion'];
                }
//                print_r($datosp);die;
                $result['data'][$index]['idpuertoorigen'] = trim(
                    $datosp['id'], ','
                );
                $result['data'][$index]['puertoorigen'] = $datosp['nombre'];

                $puertosdestino = $conexionActual->fetchAll(
                    'SELECT mp.idpuertodestino, nmp.denominacion
                  FROM mod_crmcontratacion.dat_puertodestinocontrato mp
                  INNER JOIN mod_crmcontratacion.nom_puertodestino nmp 
                  ON nmp.idpuertodestino=mp.idpuertodestino
                  WHERE mp.idcontrato=' . $d['idcontrato']
                );
                $datosp = array('id' => '', 'nombre' => array());
                foreach ($puertosdestino as $e) {
                    $datosp['id'] = $datosp['id'] . $e['idpuertodestino'] . ',';
                    $datosp['nombre'][] = $e['denominacion'];
                }
//                print_r($datosp);die;
                $result['data'][$index]['idpuertodestino'] = trim(
                    $datosp['id'], ','
                );
                $result['data'][$index]['puertodestino'] = $datosp['nombre'];

//                print_r($result['data']);die;
                $incoterms = $conexionActual->fetchAll(
                    'SELECT mp.idincoterm, nmp.nombre, nmp.abreviatura
                  FROM mod_crmcontratacion.dat_incotermcontrato mp
                  INNER JOIN mod_crmcontratacion.nom_incoterm nmp 
                  ON nmp.idincoterm=mp.idincoterm
                  WHERE mp.idcontrato=' . $d['idcontrato']
                );
                $datosi = array('id' => '', 'nombre' => array());
                foreach ($incoterms as $e) {
                    $datosi['id'] = $datosi['id'] . $e['idincoterm'] . ',';
                    $datosi['nombre'][] = $e['abreviatura'];
                }
                $result['data'][$index]['idincoterm'] = trim(
                    $datosi['id'], ','
                );
                $result['data'][$index]['incoterm'] = $datosi['nombre'];

                $condicionespago
                    = 'SELECT tp.idcondicionpago, ntp.nombre
                  FROM mod_crmcontratacion.dat_condicionpagocontratoimportacion tp
                  INNER JOIN mod_datosmaestros.nom_terminosdepago ntp 
                  ON ntp.idterminodepago=tp.idcondicionpago
                  WHERE tp.idcontratoimportacion=' . $d['idcontrato']?:-1;
                $a = $conexionActual->fetchAll($condicionespago);
                $datos = array('id' => '', 'nombre' => array());
                foreach ($a as $e) {
                    $datos['id'] = $datos['id'] . $e['idcondicionpago'] . ',';
                    $datos['nombre'][] = $e['nombre'];
                }
                $result['data'][$index]['idcondicionespago'] = trim(
                    $datos['id'], ','
                );
                $result['data'][$index]['condicionespago'] = $datos['nombre'];
            }
            if ($this->getContabilidad()['habilitado']) {
                if (count($idclientesproveedores) > 0) {
                    $datosDeudas
                        = $this->integrator->copa->cargarDatosDuoClientes(
                        array('clientes' => $idclientesproveedores)
                    );
                    foreach ($result['data'] as $index => $d) {
                        $cont = 0;
                        foreach ($datosDeudas as $a) {
                            if ($d['idclienteproveedor'] == $a['idcliente']) {
                                $cont += 1;
                            }
                        }
                        $result['data'][$index]['deuda'] = $cont > 0;
                    }
                }
            }
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function comprobarClienteTipoContrato($parametros){
        $contratoclientetipo = Doctrine::getTable('DatContrato')->findBySql(
            "idclienteproveedor=".$parametros['idclienteproveedor'].
            " AND idtipocontrato=".$parametros['idtipocontrato'].
            " AND idestructuracomun=".$this->_idestructura.
            ($parametros['idcontrato']?' AND idcontrato!='.$parametros['idcontrato']:'')
        );
        return count($contratoclientetipo);
    }

    public function saveContrato($parametros)
    {
        try {
            if($this->_cliente_tipocontrato){
                $contratoclientetipo = Doctrine::getTable('DatContrato')->findByDql(
                    "idclienteproveedor=".$parametros['idclienteproveedor'].
                    " AND idtipocontrato=".$parametros['idtipocontrato'].
                    " AND idestructuracomun=".$this->_idestructura.
                    ($parametros['idcontrato']?' AND idcontrato!='.$parametros['idcontrato']:'')
                );
                if(count($contratoclientetipo)){
                    return array('code' => -1, 'success' => false,
                        'msg' => 'Ya existe un contrato vigente con el cliente y el tipo de contrato especificado. ('.$contratoclientetipo[0]['numerocontrato'].')'
                    );
                }
            }

            $contrato = new DatContrato();
            $adicionar = true;
            $contratodestino = $parametros['cliente'] ? 2 : 3;
            if ($parametros['idcontrato']) {
                $adicionar = false;
                $contrato = Doctrine::getTable('DatContrato')->find(
                    $parametros['idcontrato']
                );
            }else{
                if(!$this->obtenerEstadoinicial()){
                    return array('success' => false, 'code'    => 666,
                        'msg' => 'No está configurado ningún estado como inicial. Contacte al administrador.'
                    );
                }
                $contrato->idusuariocreador = $this->global->Perfil->idusuario;
            }
            // generar un nuevo numero de contrato
            if (!$contrato->idcontrato
                && ($parametros['suplemento']
                    && ($parametros['suplemento'] == 'false'
                        || $parametros['suplemento'] == false))
                && ($parametros['addsuplemento']
                    && ($parametros['addsuplemento'] == 'false'
                        || $parametros['addsuplemento'] == false))
				&& ($this->_manual_number == false)
            ) {
//                $contrato = $this->generarNumeroConsecutivo($contrato);
//                $formatojson=$this->generarNumero($parametros);
//                print_r($parametros);die;
                $formatonumero = $this->generarNumero($parametros);
                $numerojson = new stdClass();
                $numerojson->numero = $formatonumero;
                $numerojson->suplemento = $parametros['numerojson']->suplemento;
                $parametros['numerojson'] = $numerojson;
                $parametros['numero'] = implode('', $formatonumero);
//                print('/*generarNumero:'.$parametros['numero'].'*/');
            }
            elseif(!$contrato->idcontrato && $this->_manual_number == true){
                $numerojson = new stdClass();
                $numerojson->numero = array($parametros['numero']);
                $numerojson->suplemento = 0;
                $parametros['numerojson'] = $numerojson;
            }
            $contrato = $this->obtenerNumero($contrato, $parametros);
            if (gettype($contrato) == 'array') {
                return $contrato;
            }
           $contrato->activocontrato=1;
            $contrato->fechaestado = date('d-m-Y');
//            $contrato = $this->obtenerNumero($contrato, $parametros);
            $contrato->nombre = $parametros['nombre'];
            $contrato->denominacionclienteproveedor
                = $parametros['clienteproveedor'];
            $contrato->idclienteproveedor = $parametros['idclienteproveedor']
                ? $parametros['idclienteproveedor'] : null;
            $contrato->denominaciontipocontrato = $parametros['tipocontrato'];
            $contrato->idtipocontrato = $parametros['idtipocontrato']
                ? $parametros['idtipocontrato'] : null;
            if (!$parametros['idcontrato']) {
                $contrato->fechainicio = date('d-m-Y');
            }
            $contrato->fechafin = $parametros['fechafin']
                ? $parametros['fechafin'] : null;
            $contrato->idestructuracomun = $this->_idestructura;
            $contrato->elemento = $parametros['formDynamic']
                ? $parametros['formDynamic'] : null;
            $contrato->montototal = $parametros['montototal']
                ? $this->formatearNumero($parametros['montototal'])
                : null;
            $contrato->objeto = $parametros['objeto'] ? $parametros['objeto']
                : null;
            $contrato->descripcion = $parametros['descripcion']
                ? $parametros['descripcion'] : null;
            $contrato->contratomarco = $parametros['contratomarco'];
            $contrato->idcontratomarco = $parametros['idcontratomarco']
                ? $parametros['idcontratomarco'] : null;
            $contrato->proforma = $parametros['proforma']
                ? $parametros['proforma'] : null;
            $contrato->idproforma = $parametros['idproforma']
                ? $parametros['idproforma'] : null;
            $contrato->cliente = $parametros['cliente'];
            if (!$contrato->idcontrato) {
                $contrato->idpadre = $parametros['idpadre']
                    ? $parametros['idpadre'] : null;
            }
//            $contrato->version = 0;
            $contrato->version = $this->obtenerVersion($parametros);
            $contrato->idsector = $parametros['idsector']
                ?  : null;
            $contrato->vigencia = $parametros['vigencia']
                ? $parametros['vigencia'] : null;
            $contrato->unidadtiempo = $parametros['unidadtiempo']
                ? $parametros['unidadtiempo'] : null;
            $contrato->idresponsable = $parametros['idpersona']
                ? $parametros['idpersona'] : null;
            $contrato->nombrepersona = $parametros['nombrepersona']
                ? $parametros['nombrepersona'] : null;
            $contrato->idcondicionpago = $parametros['idcondicionpago']
                ? $parametros['idcondicionpago'] : null;
            $contrato->idarea = $parametros['idarea'] ? $parametros['idarea']
                : null;
            $contrato->registropago = $parametros['pago'] ? $parametros['pago']
                : null;
            $contrato->fechamodificacion = date('d-m-Y');
            $contrato->cumplimientoobligaciones
                = $parametros['cumplimientoobligaciones'];
            $contrato->objetosuplemento = $parametros['objetosuplemento'];
            $contrato->idcategoria = $parametros['idcategoria']?  : null;
//            $contrato->fechafirma = $parametros['fechafirma']
//                ? $parametros['fechafirma'] : null;
//            $existegd = false;
            $existegd = $this->existeGestorDocumental();
//            print('/*$existegd'.$existegd.'*/');
//            print('/*$contrato->idespaciotrabajo'.$contrato->idespaciotrabajo.'*/');
            if ($existegd && count($_FILES) != 0) {
                if (!$contrato->idespaciotrabajo) {
                    $contrato->idespaciotrabajo = $this->crearEspacioContrato(
                        $parametros, $parametros['idcontrato']
                    );
                }
                if (!$parametros['idcontrato']
                    && $parametros['addsuplemento'] == true
                ) {
                    $padre = Doctrine::getTable('DatContrato')->find(
                        $parametros['idpadre']
                    );
                    $contrato->idespaciotrabajo = $padre->idespaciotrabajo;
                    $contrato->iddocumentocontratooriginal
                        = $padre->iddocumentocontratooriginal;
                    $padre->idespaciotrabajo = null;
                    $padre->iddocumentocontratooriginal = null;
                    $padre->save();
                }
            }
            if ($parametros['fechafirma']) {
                if ($parametros['idcontrato'] && $contrato->fechafirma != $parametros['fechafirma']) {
                    if(!$this->obtenerEstadoFirmado())
                        return array('success' => false, 'code'    => 666,
                            'msg' => 'No está configurado ningún estado como firmado. Contacte al administrador.'
                        );
                    $this->guardarContratoEstadoFirmado($parametros['idcontrato']);
                    if($parametros['suplemento']
                        && ($parametros['suplemento'] == 'true'
                            || $parametros['suplemento'] == true) && $contrato->idcontrato)
                        $this->corregirFechaFinHijos($contrato->idpadre, $contrato->fechafin);
                    $firmado = true;
                    //$contrato = $this->generarNumeroConsecutivo($contrato);
                }
            }
            $contrato->fechafirma = $parametros['fechafirma']? $parametros['fechafirma'] : null;
	        if($parametros['vehiculos']){
                $contrato->vehiculos=$parametros['vehiculos']?$parametros['vehiculos']:null;
            }


            $con=Doctrine_Manager::getInstance()->getCurrentConnection();
            $con->beginTransaction();
            $contrato->save();
            if( $adicionar == true && $contrato->objetosuplemento == '' &&
                $this->_increment_sign == false && $this->_manual_number == false)
            {

                $contrato = $this->generarNumeroConsecutivo($contrato, $parametros);
            }
            if (array_key_exists('puertoorigen', $parametros)) {
                $contratoimportacion = new DatContratoImportacion();
                if ($parametros['idcontratoimportacion']) {
                    $contratoimportacion = Doctrine::getTable(
                        'DatContratoImportacion'
                    )->find(
                        $parametros['idcontratoimportacion']
                    );
                }
                $contratoimportacion->idcontrato = $contrato->idcontrato;
                $contratoimportacion->idlinea = $parametros['idlinea']? : null;
                $contratoimportacion->idtipolinea = $parametros['idtipolinea']?  : null;
                $contratoimportacion->iddestinocomercial = $parametros['iddestinocomercial']?  : null;
                $contratoimportacion->idclientefinal = $parametros['idclientefinal']?  : null;
//                $contratoimportacion->idpuertoorigen= $parametros['idpuertoorigen'] ?  : null;
//                $contratoimportacion->idpuertodestino= $parametros['idpuertodestino']?  : null;
//                $contratoimportacion->idincoterms = $parametros['idincoterms']?  : null;
                $contratoimportacion->save();
            }

            $idcontrato = $contrato->idcontrato;

            if ($idcontrato) {

                if (!$firmado && !$parametros['idcontrato']) {
                    $this->guardarContratoEstadoInicial($idcontrato);
                }

                if($parametros['idpuertoorigen'])
                    $this->savePuertosOrigen($idcontrato, $parametros['idpuertoorigen']);
                if($parametros['idpuertodestino'])
                    $this->savePuertosDestino($idcontrato, $parametros['idpuertodestino']);
                if($parametros['idincoterm'])
                    $this->saveIncoterms($idcontrato, $parametros['idincoterm']);
                if($parametros['idcondicionespago'])
                    $this->saveCondiciones($idcontrato, $parametros['idcondicionespago']);

            }
            /* if ($adicionar && !$parametros['suplemento']
               && $this->_increment_sign == false
           ) {
               $this->_numero->incrementarConsecutivos($contratodestino);
           }*/
//            if ($existegd) {
//                $this->salvarDocumentos(
//                    $contrato->idespaciotrabajo, $parametros,
//                    $contrato->idcontrato
//                );
//            }

            if ($parametros['idmediodepago']) {
                $exists = array();
                foreach (explode(',', $parametros['idmediodepago']) as $mp) {
                    $tabla = Doctrine::getTable('DatMedioPagoContrato')
                        ->findBySql(
                            'idmediopago=' . $mp . ' AND idcontrato='
                            . $contrato->idcontrato
                        )
                        ->getFirst();
                    if (!$tabla) {
                        $tabla = new DatMedioPagoContrato();
                        $tabla->idcontrato = $contrato->idcontrato;
                        $tabla->idmediopago = $mp;
                        $tabla->save();
                    }
                    $exists[] = $tabla->idmediopagocontrato;
                }
                foreach (
                    Doctrine::getTable('DatMedioPagoContrato')
                        ->findBySql(
                            'idcontrato=' . $contrato->idcontrato . ' AND
                        idmediopagocontrato NOT IN (' . implode(',', $exists)
                            . ')'
                        ) as $aelimar
                ) {
                    $aelimar->delete();
                }
            }
            if ($parametros['idoferta']) {
                $this->annadirContratoOferta(
                    $parametros['idoferta'], $idcontrato
                );
            }
            if ($idcontrato) {
                $this->salvarMonedasContrato(
                    $contrato->idcontrato, $parametros
                );

//                if (!$firmado && !$parametros['idcontrato']) {
//                    $this->guardarContratoEstadoInicial($idcontrato);
//                }
            }
            if ($adicionar && !$parametros['suplemento']
                && $this->_increment_sign == false
            ) {
                $parametros1 = (array)json_decode($parametros['numeroparametros']);
                $this->_numero->incrementarConsecutivos($idcontrato, $contratodestino, $parametros1);
            }

            if ($parametros['hitos']) {
                $this->guardarHitos(
                    json_decode($parametros['hitos']), $idcontrato,
                    $parametros['addsuplemento']
                );
            }
            if ($parametros['hitosadicionales'] && count(json_decode($parametros['hitosadicionales']))>0) {
                $this->guardarHitosDatosAdicionales(
                    json_decode($parametros['hitosadicionales']), $idcontrato,
                    $parametros['addsuplemento']
                );
            }

              if ($parametros['implicadas']) {
                $this->guardarAreaImplicada(
                    json_decode($parametros['implicadas']), $idcontrato,
                    $parametros['addsuplemento']
                );
            }

            if ($parametros['clientesasociados']) {
                $this->guardarClienteAsociado(
                    json_decode($parametros['clientesasociados']), $idcontrato,
                    $parametros['addsuplemento']
                );
            }
            if ($parametros['productos']) {
                $this->saveIndicador(
                    json_decode($parametros['productos']), $idcontrato,
                    $parametros['addsuplemento']
                );
            }
            if ($parametros['pedidos']) {
                $this->savePedidos(
                    json_decode($parametros['pedidos']), $idcontrato,
                    $parametros['addsuplemento']
                );
            }
            if ($parametros['vehiculos']) {
                $this->saveVehiculos(
                    json_decode($parametros['vehiculos']), $idcontrato,
                    $parametros['addsuplemento']
                );
            }
            if ($existegd) {
                $this->salvarDocumentos(
                    $contrato->idespaciotrabajo, $parametros,
                    $contrato->idcontrato
                );
            }
            $con->commit();
//            if (!$existegd) {
//                $this->salvarAnexosLocales($idcontrato, $parametros);
//            }
            return array('code'       => 1, 'success' => true,
                         'idcontrato' => $idcontrato);
        } catch (Exception $e) {
            if ($e->getCode() == 335) {
                return;
            }
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    private function annadirContratoOferta($idoferta, $idcontrato)
    {
        try {
            $oferta = Doctrine::getTable('OfertaNegocio')->find($idoferta);
            if ($oferta) {
                $oferta->idcontrato = $idcontrato;
                $oferta->save();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function obtenerNumero($contrato, $parametros)
    {
        try {
            if (!$contrato->idcontrato && $parametros['suplemento']
                && ($parametros['suplemento'] == 'true'
                    || $parametros['suplemento'] == true)
            ) {
                if ($this->executeQuery(
                        "SELECT count(dc.idcontrato) FROM mod_crmcontratacion.dat_contrato dc WHERE dc.idpadre ="
                        . $parametros['idpadre']
                        . " AND dc.idpadre <> dc.idcontrato AND dc.activocontrato=1;"
                    ) != 0
                ) {
                    return array('success' => true, 'suplementoEx' => true);
                }
//                $numero = $parametros['numero'];
//                preg_match_all("/\/(\d+)$/", $numero, $match);
//                $lastSuplementNumber = 0;
//                if ($match[1] && $match[1][0]) {
//                    $lastSuplementNumber = $match[1][0];
//                    preg_match_all("/(.+)\/\d+$/", $numero, $num);
//                    $numero = $num[1][0];
//                }
//                $parametros['numerojson']->suplemento;

                $numerojson = json_decode($parametros['numerojson']);
                if($this->_manual_number){
                    $numerojson->numero = array($contrato->numero);
                    $numerojson->suplemento = 0;
                }
                $numero = implode('', $numerojson->numero) . "/" . ((int)$numerojson->suplemento + 1);
                $numerojson->suplemento = (int)$numerojson->suplemento + 1;
            } else {
                $numero = $parametros['numero'];
                $numerojson = json_decode($parametros['numerojson']);
            }
            $contrato->numero = $numero;
            $contrato->numerojson = json_encode($numerojson);
            if ($parametros['cliente'] == 1) {
                $contrato->numerocontrato = $numero;
            } else {
                $contrato->numerocontrato = $parametros['numerocontrato'];
            }
            return $contrato;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerEstadoinicial()
    {
        try {
            $estado = new NomEstado();
            $idestado = $estado->getEstadoInicial()['idestado'];
            if (!$idestado) {
                throw new Exception('No existe el estado inicial.', 333);
            }
            return $idestado;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerEstadoFirmado()
    {
        try {
            $estado = new NomEstado();
            return $estado->getEstadoFirmado();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerVersion($parametros)
    {
        try {
            $version = $parametros['version'] ? $parametros['version'] : 0;
            $idcontrato = $parametros['idcontrato'];
            if (!empty($version)) {
                $modificado = $this->executeQuery(
                    "SELECT dc.idcontrato
                    FROM mod_crmcontratacion.dat_contrato dc
                    WHERE dc.idcontrato = $idcontrato AND dc.version > $version;"
                );
                if ($modificado) {
                    throw new Exception(
                        'El contrato no puede ser modificado porque fue previamente modificado por otro usuario. 
                        Por favor actualize la lista de contratos para ver los cambios.',
                        334
                    );
                }
            }
            return $version;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function salvarDocumentos($idespacio, $parametros, $idcontrato)
    {
        try {
            $modificados = json_decode($parametros['editfile']);
            $eliminados = json_decode($parametros['delfile']);
            $this->establecerNombreDocumento($parametros);
            if (count($_FILES) != 0 && $idespacio) {
                $documento = $this->_gestordocumental->saveDocument($idespacio);
                if (count($documento) == 0) {
                    throw new Exception(
                        'Ocurrio un error al salvar el documento.', 335
                    );
                }
                if ($idcontrato) {
                    $contrato = Doctrine::getTable('DatContrato')->find(
                        $idcontrato
                    );
                    $aux = explode('/', $documento[0]['id']);
                    $contrato->iddocumentocontratooriginal = $aux[count($aux)
                    - 1];
                    $contrato->save();
                }

            }

            if (count($modificados)) {
                $this->modificarDocumentos($modificados);
            }

            if (count($eliminados)) {
                $this->eliminarDocumentos($eliminados);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function heredarDocumentos($contrato, $params)
    {
        if ($params['idpadre']) {
            $padre = Doctrine::getTable('DatContrato')->find(
                $params['idpadre']
            );

            if ($padre->idespaciotrabajo) {
                if (!$contrato->idespaciotrabajo) {
                    $contrato->idespaciotrabajo = $this->crearEspacioContrato(
                        $params
                    );
                    $contrato->save();
                }
                $documentos = $this->_gestordocumental->getContenido(
                    array('idespaciotrabajo' => $padre->idespaciotrabajo)
                );
                foreach ($documentos as $doc) {
                    $archivo = $this->_gestordocumental->getFile(
                        array('iddocument' => $doc['idnodo'])
                    );
                    $this->_gestordocumental->saveDocument(
                        $contrato->idespaciotrabajo
                    );
                }
            }
        }
    }

    public function eliminarDocumentos($documentos)
    {
        try {
            $this->_gestordocumental->delFile($documentos);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modificarDocumentos($documentos)
    {
        try {
            foreach ($documentos as $doc) {
                $this->_gestordocumental->editDocument(
                    $doc->idnodo, array('nombre' => $doc->nombre)
                );
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function crearEspacioClienteProveedor($parametros)
    {
        try {
            $idespacio = $this->getIdEspacioTrabajo();
            $coneccion = Doctrine_Manager::getInstance()->getCurrentConnection()
                ->getName();
            $parametros
                = array('idclientesproveedores' => $parametros['idclienteproveedor'],
                        'idestructuracomun'     => $this->_idestructura,
                        'idespaciotrabajo'      => $idespacio,
                        'proceso'               => 'contrato',
                        'coneccion'             => $coneccion);
            $resultado = $this->_datosmaestros->getEspacioTrabajoCliente(
                $parametros
            );
            if (count($resultado)) {
                $idespacio = $resultado['idespaciotrabajo'];
            }
            return $idespacio;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function crearEspacioContrato($parametros, $idcontrato = null)
    {
        try {

            $idespacio = $this->crearEspacioClienteProveedor($parametros);
            $numtemp=json_decode($parametros['numerojson'])->numero;
            $idespacio = $this->_gestordocumental->CreateWorkSpace(
                $idespacio, $parametros['nombre'].'__'.
                str_replace(array('\\','/','|','.',':', '*'), '', implode('', $numtemp))
            );
            if ($idcontrato) {
                $contrato = Doctrine::getTable('DatContrato')->find(
                    $idcontrato
                );
                $contrato->idespaciotrabajo = $idespacio;
                $contrato->save();
            }
            return $idespacio;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function establecerNombreDocumento($parametros, $local = false)
    {
        foreach ($_FILES as $k => $file) {
            $id = explode("_new", $k)[1];
            if ($_FILES[$k]['name']) {
                $name = $parametros["nombre_new" . $id];
                if ($local) {
                    $original = explode('.', $file['name']);
                    $name .= "." . $original[count($original) - 1];
                }
                $_FILES[$k]['realname'] = $name;
            } else {
                unset($_FILES[$k]);
            }
        }
    }

    public function salvarMonedasContrato($idcontrato, $parametros)
    {
        try {
            $monedas = new Doctrine_Collection('DatMonedaContrato');
            foreach ($parametros as $k => $v) {
                if (preg_match('/idmoneda_/i', $k)) {
                    $temp = explode('_', $k);
                    $moneda = Doctrine::getTable('DatMonedaContrato')
                        ->findByDql(
                            'idcontrato=? and idmoneda=?',
                            array($idcontrato, $v)
                        );
                    if (!$moneda->count()) {
                        $moneda = new DatMonedaContrato();
                        $moneda->idcontrato = $idcontrato;
                        $moneda->idmoneda = $v;
                    } else {
                        $moneda = $moneda->getFirst();
                    }
                    $moneda->valor = $parametros['montomoneda_' . $temp[1].'_'.$v]
                        ? $this->formatearNumero(
                            $parametros['montomoneda_' . $temp[1] . '_' . $v]
                        ) : 0;
                    $moneda->incremento = $parametros['incremento_' . $temp[1].'_'.$v]
                        ? $this->formatearNumero(
                            $parametros['incremento_' . $temp[1].'_'.$v]
                        ) : 0;
                    $monedas->add($moneda);
                }
            }
            $monedas->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function upEstadoContrato($upData)
    {
        try {
            $idcontrato = $upData['idcontrato'];
            $idestado = $upData['idestado'];
            $fecha = date('d-m-Y');
            $fechafirma = $upData['fechafirma'];
            $fechafin = $upData['fechafin'];

            $contrato = Doctrine::getTable('Datcontrato')->find($idcontrato);
            $datosrolesobligatorios=NomTransicion::obtenerRolesObligatorios(array('idtransicion'=>$upData['idtransicion']));
            $ultimoestado=$this->obtenerUltimoEstado($upData['idcontrato']);
            $rolesparticipados=json_decode($ultimoestado['rolesobligatorios']);
            if(!is_array($rolesparticipados))$rolesparticipados=array();
            if(!in_array($this->global->Perfil->idrol, $rolesparticipados))$rolesparticipados[]=$this->global->Perfil->idrol;
            $seguir=true; $obligatoriosefectuados=0;
            foreach($datosrolesobligatorios as $rol){
                if(!in_array($rol['idrol'], $rolesparticipados)){
                    $seguir=false;
                }else{
                    $obligatoriosefectuados+=1;
                }
            }
            $this->actualizarRolesObligatorios(json_encode($rolesparticipados), $idcontrato);
            if ($contrato && $seguir) {
                $this->cambiarFechaFinEstado($idcontrato);
                $instance = new DatContratoEstado();
                $instance->idestado = $idestado;
                $instance->idcontrato = $idcontrato;
                $instance->idusuario = $this->global->Perfil->idusuario;
                $instance->fechainicio = $fecha;
                $instance->save();
                if ($fechafirma) {
                    $contrato->fechafirma = $fechafirma;
                    if($contrato->objetosuplemento==null || $contrato->objetosuplemento=='')
                        $contrato->fechafin=$fechafin;
                    if(json_decode($contrato['numerojson'])->suplemento!=0)
                        $this->corregirFechaFinHijos($contrato['idpadre'], $contrato['fechafin']);
                    if ($this->_increment_sign) {
                        $contrato = $this->generarNumeroConsecutivo($contrato, array());
                    }
                }
                if (count($_FILES) && $this->existeGestorDocumental()) {
                    $contrato = $this->addDocument($contrato, $upData);
                }
                $contrato->save();
                $data = $this->getDatosNotificar($contrato);
            }
            return array('code' => 1, 'success' => true, 'data' => $data, 'data' => $data, 'datos'=>array(
                'cantidadrolesobligatorios'=>count($datosrolesobligatorios), 'obligatoriosefectuados'=>$obligatoriosefectuados, 'nuevoestado'=>$seguir));
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false, 'upestado' => false);
        }
    }

    private function corregirFechaFinHijos($idpadre, $fechafin){
        do{
            $aux = Doctrine::getTable('DatContrato')->findBySql('idcontrato=?', array($idpadre));
            if(count($aux)!=0) {
                $aux[0]->fechafin = $fechafin;
                $aux[0]->save();
                $idpadre=$aux[0]['idpadre'];
            }
        }while(count($aux)!=0 && $aux[0]['idcontrato'] != $aux[0]['idpadre']);
    }

    public function obtenerUltimoEstado($idcontrato)
    {
        $result=Doctrine_Query::create()
            ->select('*')
            ->from('DatContratoEstado')
            ->where('fechafin is NULL and idcontrato =? ', $idcontrato)->fetchArray();
        return count($result)?$result[0]:null;
    }

    public function actualizarRolesObligatorios($rolesobligatorios, $idcontrato)
    {
        Doctrine_Query::create()
            ->update('DatContratoEstado')
            ->set('rolesobligatorios', '?', $rolesobligatorios)
            ->where('fechafin is NULL AND idcontrato =? ', $idcontrato)->execute();
    }

    public function generarNumeroConsecutivo($contrato, $parametros)
    {
//        print('/*generarNumeroConsecutivo*/');
        $contratodestino = 4;
        $numerooriginal = json_decode($contrato->numerojson)->numero;
        $suplementooriginal = json_decode($contrato->numerojson)->suplemento;
        $result = $this->getElementosNumeroContrato($parametros['contratodestino']);
        $params = array();
        $numeroparametros = json_decode($parametros['numeroparametros']);
//        print_r($result);die;
        foreach ($result as $k) {
            $params[$k['nombreparametro']] = $numeroparametros->$k['nombreparametro'];
        }
//        print('llega');die;
        $params['consecutivoactual'] = true;
        $result = $this->_numero->getNumContrato($params, $contratodestino);
        foreach ($result as $k => $v) {
            if ($result[$k] && $result[$k] != $numerooriginal[$k]) {
                $numerooriginal[$k] = $result[$k];
            }
        }
        $contrato->numerojson = json_encode(
            array('numero'     => $numerooriginal,
                  'suplemento' => $suplementooriginal)
        );
        $contrato->numero = implode('', $numerooriginal);
        if ($contrato->cliente) {
            $contrato->numerocontrato = $contrato->numero;
        }
        $parametros1 = (array)json_decode($parametros['numeroparametros']);
        $this->_numero->incrementarConsecutivos($contrato->idcontrato, $contratodestino, $parametros1);
        return $contrato;
    }

    public function addDocument($contrato, $params)
    {
        try {
            if (!$contrato->idespaciotrabajo) {
                $contrato->idespaciotrabajo = $this->crearEspacioContrato(
                    $contrato->toArray()
                );
            }
            $_FILES['documento']['realname']
                = $params['nombre'] . ' ' . date('dmYHis');
            $this->_gestordocumental->saveDocument($contrato->idespaciotrabajo);
            return $contrato;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function delContrato($delData)
    {
        $upEx = array();
        foreach ($delData as $del) {
            $query
                = "DELETE FROM mod_crmcontratacion.dat_contrato ";
            $query .= " WHERE idcontrato = " . $del->idcontrato;
            $query .= " RETURNING idcontrato ;";
            $ex = $this->executeQuery($query);
            if (!$ex) {
                $upEx[] = $del->nombre;
            }
        }
        if (empty($upEx)) {
            return array('success' => true);
        }
        return array('success' => false, $upEx);
    }

    public function desactivarcontrato($delData)
    {
        $upEx = array();
        $estado=new NomEstado();
        $estadoeliminado=$estado->getEstadoByAction('deletedcontrat');
        foreach ($delData as $del) {
            $query
                = "UPDATE mod_crmcontratacion.dat_contrato SET activocontrato = 0";
            $query .= " WHERE idcontrato = " . $del->idcontrato;
            $query .= " RETURNING idcontrato ;";
            $ex = $this->executeQuery($query);
            if (!$ex) {
                $upEx[] = $del->nombre;
            }else{
                if($estadoeliminado){
                    $this->cambiarEstado(array('idcontrato'=>$del->idcontrato, 'idestado'=>$estadoeliminado));
                }
            }
        }
        if (empty($upEx)) {
            return array('success' => true);
        }
        return array('success' => false, $upEx);
    }

    public function activarcontrato($delData)
    {
        $upEx = array();
        $estado=new NomEstado();
        $estadoeliminado=$estado->getEstadoByAction('deletedcontrat');
        foreach ($delData as $del) {
            $query
                = "UPDATE mod_crmcontratacion.dat_contrato SET activocontrato = 1";
            $query .= " WHERE idcontrato = " . $del->idcontrato;
            $query .= " RETURNING idcontrato ;";
            $ex = $this->executeQuery($query);
            if (!$ex) {
                $upEx[] = $del->nombre;
            }else{
                if($estadoeliminado){
                    $estadoanterior=$this->executeQuery("SELECT e.idestado FROM mod_crmcontratacion.dat_contratoestado e 
                        WHERE e.idcontrato=".$del->idcontrato." AND e.fechafin IS NOT NULL
                        ORDER BY e.idcontratoestado DESC LIMIT 1");
                    if(count($estadoanterior)) {
                        print('/*'.$estadoanterior['idestado'].'*/');
                        $this->cambiarEstado(
                            array('idcontrato' => $del->idcontrato, 'idestado' => $estadoanterior['idestado']));
                        }
                    }
            }
        }
        if (empty($upEx)) {
            return array('success' => true);
        }
        return array('success' => false, $upEx);
    }

    public function saveIndicador($data, $idcontrato, $addsuplemento)
    {

        try {
            $eliminados = new Doctrine_Collection('DatIndicadorContrato');
            $guardados = new Doctrine_Collection('DatIndicadorContrato');
            foreach ($data->guardados as $prod) {
                $producto
                    = $prod->idindicadorcontrato && $addsuplemento == 'false'
                    ? Doctrine::getTable('DatIndicadorContrato')
                        ->find(
                            $prod->idindicadorcontrato
                        ) : new DatIndicadorContrato();
                $producto->idindicador = $prod->idindicador ? $prod->idindicador
                    : null;
                $producto->idactividad = $prod->idactividad ? $prod->idactividad
                    : null;
                $producto->denominacion = $prod->denominacion;
                $producto->codigo = $prod->codigo;
                $producto->tipo = $prod->tipo;
                $producto->idcontrato = $idcontrato;
                $producto->cantidad = $prod->cantidad;
                $producto->save();
                DatMonedaIndicadorContrato::guardarMonedaEntidadIndicador(
                    (array)$prod, $producto->idindicadorcontrato
                );
                if ($prod->datos_json) {
                    $datosAdd = Doctrine_Query::create()->select()->from(
                        'DatProductosDatosAdicionales pda'
                    )
                        ->where(
                            'idproducto = ?', $producto->idindicadorcontrato
                        )
                        ->execute()->getFirst();
                    if (!$datosAdd) {
                        $datosAdd = new DatProductosDatosAdicionales();
                        $datosAdd->idproducto = $producto->idindicadorcontrato;
                    }
                    $datosAdd->datos = json_encode($prod->datos_json);
                    $datosAdd->save();

                }
            }
            if (count($data->eliminados)) {
                DatIndicadorContrato::eliminarIndicador($data->eliminados);
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function savePedidos($data, $idcontrato, $addsuplemento)
    {

        try {
            foreach ($data->guardados as $ped) {
                $pedido
                    = $ped->idcontratopedido && $addsuplemento == 'false'
                    ? Doctrine::getTable('DatContratoPedido')
                        ->find($ped->idcontratopedido) : new DatContratoPedido();
                $pedido->descripcion = $ped->descripcion;
                $pedido->fechacreacion = $ped->fechacreacion;
                $pedido->fechaestimada = $ped->fechaestimada;
                $pedido->idcontrato = $idcontrato;
                $pedido->productos = $ped->productos;
                $pedido->save();
                if (!$ped->idcontratopedido || $addsuplemento != 'false') {
                    $this->guardarPedidoContratoEstadoInicial($pedido->idcontratopedido);
                }
            }
            if (count($data->eliminados)) {
                DatContratoPedido::eliminarPedidos($data->eliminados);
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function savePuertosOrigen($idcontrato, $idpuertoorigen){
        $exists = array();
        foreach (explode(',', $idpuertoorigen) as $mp) {
            $tabla = Doctrine::getTable('DatPuertoOrigenContrato')
                ->findBySql(
                    'idpuertoorigen=' . $mp . ' AND idcontrato='
                    . $idcontrato
                )
                ->getFirst();
            if (!$tabla) {
                $tabla = new DatPuertoOrigenContrato();
                $tabla->idcontrato = $idcontrato;
                $tabla->idpuertoorigen = $mp;
                $tabla->save();
            }
            $exists[] = $tabla->idpuertoorigencontrato;
        }
        foreach (
            Doctrine::getTable('DatPuertoOrigenContrato')
                ->findBySql(
                    'idcontrato=' . $idcontrato . ' AND
                        idpuertoorigencontrato NOT IN (' . implode(',', $exists)
                    . ')'
                ) as $aeliminar
        ) {
            $aeliminar->delete();
        }
    }

    public function savePuertosDestino($idcontrato, $idpuertodestino){
        $exists = array();
        foreach (explode(',', $idpuertodestino) as $mp) {
            $tabla = Doctrine::getTable('DatPuertoDestinoContrato')
                ->findBySql(
                    'idpuertodestino=' . $mp . ' AND idcontrato='
                    . $idcontrato
                )
                ->getFirst();
            if (!$tabla) {
                $tabla = new DatPuertoDestinoContrato();
                $tabla->idcontrato = $idcontrato;
                $tabla->idpuertodestino = $mp;
                $tabla->save();
            }
            $exists[] = $tabla->idpuertodestinocontrato;
        }
        foreach (
            Doctrine::getTable('DatPuertoDestinoContrato')
                ->findBySql(
                    'idcontrato=' . $idcontrato . ' AND
                        idpuertodestinocontrato NOT IN (' . implode(',', $exists)
                    . ')'
                ) as $aeliminar
        ) {
            $aeliminar->delete();
        }
    }

    public function saveIncoterms($idcontrato, $idincoterm){
        $exists = array();
        foreach (explode(',', $idincoterm) as $mp) {
            $tabla = Doctrine::getTable('DatIncotermContrato')
                ->findBySql(
                    'idincoterm=' . $mp . ' AND idcontrato='
                    . $idcontrato
                )
                ->getFirst();
            if (!$tabla) {
                $tabla = new DatIncotermContrato();
                $tabla->idcontrato = $idcontrato;
                $tabla->idincoterm = $mp;
                $tabla->save();
            }
            $exists[] = $tabla->idincotermcontrato;
        }
        foreach (
            Doctrine::getTable('DatIncotermContrato')
                ->findBySql(
                    'idcontrato=' . $idcontrato . ' AND
                        idincotermcontrato NOT IN (' . implode(',', $exists)
                    . ')'
                ) as $aeliminar
        ) {
            $aeliminar->delete();
        }
    }


    public function saveCondiciones($idcontrato, $idcondicionpago){
        $exists = array();
        foreach (explode(',', $idcondicionpago) as $mp) {
            $tabla = Doctrine::getTable('DatCondicionPagoContratoImportacion')
                ->findBySql(
                    'idcondicionpago=' . $mp . ' AND idcontratoimportacion='
                    . $idcontrato
                )
                ->getFirst();
            if (!$tabla) {
                $tabla = new DatCondicionPagoContratoImportacion();
                $tabla->idcontratoimportacion = $idcontrato;
                $tabla->idcondicionpago = $mp;
                $tabla->save();
            }
            $exists[] = $tabla->idcondicionpagocontratoimportacion;
        }
        foreach (
            Doctrine::getTable('DatCondicionPagoContratoImportacion')
                ->findBySql(
                    'idcontratoimportacion=' . $idcontrato . ' AND
                        idcondicionpagocontratoimportacion NOT IN (' . implode(',', $exists)
                    . ')'
                ) as $aeliminar
        ) {
            $aeliminar->delete();
        }
    }

    public function guardarAreaConPermiso($data, $idcontrato, $addsuplemento)
    {
        $query = new Doctrine_Query();
        $query->delete()->from('ContratoAreaImplicada dcm')->where(
            'dcm.idcontrato=?', $idcontrato
        )->execute();

        foreach ($data as $actual) {
            $area = new ContratoAreaImplicada();
            $area->idestructura = $actual->idestructura;
            $area->idcontrato = $idcontrato;
            $area->save();
        }
    }

    public function getAreasI($idcontrato)
    {
        $cadenaQUERY
            = " SELECT 
                         c.idestructura,
                         COALESCE (eop.denominacion, e.denominacion) as denominacion 
                        FROM 
                          mod_crmcontratacion.dat_contratoareaimplicada c
                          LEFT JOIN mod_estructuracomp.dat_estructuraop  eop on (c.idestructura=eop.idestructuraop  and eop.idproyecto = 0)
                          LEFT JOIN mod_estructuracomp.dat_estructura e on (c.idestructura=e.idestructura  and e.idproyecto = 0)
                          where  c.idcontrato=$idcontrato ";

        $conn = Doctrine_Manager::connection();
        $respuesta = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );

        return $respuesta;
    }

    public function guardarHitos($data, $idcontrato, $addsuplemento)
    {
        try {
            $modificados = gettype($data->modificados) == 'string' ?
                json_decode(stripcslashes($data->modificados))
                : $data->modificados;
            $eliminados = gettype($data->eliminados) == 'string' ?
                json_decode(stripcslashes($data->eliminados))
                : $data->eliminados;
            if (count($modificados)) {
                foreach ($modificados as $actual) {
                    $idhitooriginal = $actual->idhito;
                    if ($addsuplemento == 'true') {
                        $actual->idhito = null;
                    }
                    $idhito = DatHitoContrato::guardarHitoContrato(
                        $actual, $idcontrato, $addsuplemento
                    );
                    if (!$idhitooriginal) {
                        $this->guardarHitoEstadoInicial($idhito);
                    }
                    if ($idhitooriginal && $addsuplemento == 'true') {
                        $this->guardarEstadoHitoOriginal(
                            $idhitooriginal, $idhito
                        );
                    }
                    if($actual->idhito==''){
                        $monto=0;
                        foreach($actual->pago as $pago){
                            $monto+=$pago->monto?$pago->monto:0;
                        }
                        $areaimplicada=array(
                            'idarea'=>$actual->idarea,
                            'idhito'=>$idhito,
                            'porciento'=>100,
                            'monto'=>$monto,
                        );
                        $this->_hitoareaimplicada->guardar($areaimplicada);
                    }
                }
            }
            if (count($eliminados)
                && ($addsuplemento == 'false'
                    || !$addsuplemento)
            ) {
                DatHitoContrato::eliminarHitosPermitidos($eliminados);
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function guardarHitosDatosAdicionales($data, $idcontrato, $addsuplemento)
    {
        try{
            foreach ($data as $actual) {
                $idhito = DatHitoContrato::guardarHitoDatosAdicionales(
                    $actual, $idcontrato
                );
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function guardarAreaImplicada($data, $idcontrato, $addsuplemento)
    {

        $query = new Doctrine_Query();
        $query->delete()->from('ContratoAreaImplicada dcm')->where(
            'dcm.idcontrato=?', $idcontrato
        )->execute();

        foreach ($data as $actual) {
            $areaimp = new ContratoAreaImplicada();
            $areaimp->idestructura = $actual->idarea;
            $areaimp->idcontrato = $idcontrato;
            $areaimp->ruta = $actual->ruta;
//            $areaimp->principal = $actual->principal=='true'?1:0;

            $areaimp->save();
        }
    }

     public function guardarClienteAsociado($data, $idcontrato, $addsuplemento){
        try {
//            $modificados = gettype($data->modificados) == 'string' ?
//                json_decode(stripcslashes($data->modificados))
//                : $data->modificados;
//            $eliminados = gettype($data->eliminados) == 'string' ?
//                json_decode(stripcslashes($data->eliminados))
//                : $data->eliminados;
//            if (count($modificados)) {
//                foreach($modificados as $i){
//                    $this->_contratoclientesasociados->guardar($i);
//                }
//            }
//            if (count($eliminados) && ($addsuplemento == 'false' || !$addsuplemento)) {
//                $this->_contratoclientesasociados->eliminarLista($eliminados);
//            }
            if($addsuplemento == 'false' || !$addsuplemento){
                $noeliminar=array();
                $nuevos=array();
                foreach($data as $actual){
                    if($actual->idcontratoclienteasociado && $actual->idcontratoclienteasociado!=null){
                        $noeliminar[]=$actual->idcontratoclienteasociado;
                    }else{
                        $nuevos[]=$actual;
                    }
                }
                $where="idcontrato=$idcontrato";
                if(count($noeliminar)){
                    $where.=" AND idcontratoclienteasociado NOT IN (".implode(',', $noeliminar).")";
                }
                $this->_contratoclientesasociados->eliminarPorCondicion($where);
                if(count($nuevos)){
                    foreach ($nuevos as $actual) {
                        $datos['idclienteproveedor']=$actual->idclienteproveedor;
                        $datos['idcontrato']=$idcontrato;
                        $this->_contratoclientesasociados->guardar($datos);
                    }
                }
            }else{
                foreach ($data as $actual) {
                    $datos['idclienteproveedor']=$actual->idclienteproveedor;
                    $datos['idcontrato']=$idcontrato;
                    $this->_contratoclientesasociados->guardar($datos);
                }
            }
        }catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function saveVehiculos($data, $idcontrato, $addsuplemento){
        try {
            $modificados = gettype($data->nuevos) == 'string' ?
                json_decode(stripcslashes($data->nuevos)) : $data->nuevos;
            $eliminados = gettype($data->eliminados) == 'string' ?
                json_decode(stripcslashes($data->eliminados)) : $data->eliminados;
            if (count($modificados)) {
                foreach ($modificados as $actual) {
                    $datos=(array)$actual;
                    $datos['idcontrato']=$idcontrato;
                    DatVehiculoContrato::guardarVehiculo($datos);
                }
            }
            if (count($eliminados)) {
                DatVehiculoContrato::eliminarVehiculo($eliminados);
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getAreaImplicada($idcontrato)
    {
        $cadenaQUERY
            = " SELECT 
                 c.idestructura,c.idestructura as idarea, c.ruta,
                 COALESCE (eop.denominacion, e.denominacion) as denominacion 
                FROM 
                  mod_crmcontratacion.dat_contratoareaimplicada c
                  LEFT JOIN mod_estructuracomp.dat_estructuraop  eop on (c.idestructura=eop.idestructuraop  and eop.idproyecto = 0)
                  LEFT JOIN mod_estructuracomp.dat_estructura e on (c.idestructura=e.idestructura  and e.idproyecto = 0)
                  where  c.idcontrato=$idcontrato ";

        $conn = Doctrine_Manager::connection();
        $respuesta = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );

        return $respuesta;
    }

    /**
     * @param $query
     *
     * @return string
     * @throws Doctrine_Connection_Exception
     */

    private function executeQuery($query)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $statementCant = $conexionActual->execute($query);
            return $statementCant->fetchColumn(0);
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Funcionalidad que obtiene los tipos de contratos.
     *
     * @return array Arreglo con la respuesta del servidor
     * @author Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
     */
    public function getTiposContratos()
    {
        $tipo = new DatTipoContrato();
        $idestructura = $this->global->Estructura->idestructura;
        $result = $tipo->getDataTipoContrato($idestructura);
        return $result;
    }

    /**
     * Funcionalidad que obtiene los elementos de un tipo de contrato.
     *
     * @param array $params Arreglo con los datos de la peticion
     *
     * @return array Arreglo con la respuesta del servidor
     * @author Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
     */
    public function getElementoContrato()
    {
//        $elemento = new ConfElementoTipoContrato();
//
//        $result = $elemento->getAllElements();
//        return $result;
        $model=new ConfVariable();
        return $model->getVariables();
    }

    public function generarNumero($params)
    {

        $contratodestino = $params['contratodestino'];
        $params = (array)json_decode($params['numeroparametros']);
        $params['consecutivoactual'] = !$this->_increment_sign;
        return $this->_numero->getNumContrato($params, $contratodestino);
    }

    public function getElementosNumeroContrato($params)
    {
        $contratodestino = $params['contratodestino'];
        return $this->_numero->getFormatNumContratoElemeParams(
            $contratodestino
        );
    }

    public function modificarNumero($params)
    {
        $numero = json_decode($params['numero']);
        $newValues = (array)json_decode($params['numeroparametros']);
        return $this->_numero->modificarElementosNumContrato(
            $numero, $newValues
        );
    }

    public function getFile($params)
    {
        try {
            $contrato = Doctrine::getTable("DatContrato")->find(
                $params['idcontrato']
            );
            $documentos = array();
            if ($this->existeGestorDocumental()
                && !empty($contrato->idespaciotrabajo)
            ) {
                $documentos = $this->_gestordocumental->getContenido(
                    array('idespaciotrabajo' => $contrato->idespaciotrabajo)
                );
            }
            return $documentos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getListadoPersonas($params)
    {
        if($this->_estructura_persona_nomencladores){
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $query
                = "SELECT m.idpersonaparametro, m.idpersona,  
                (CASE WHEN m2.snombre IS NOT NULL THEN m2.nombre||' '|| m2.snombre||' '|| m2.papel||' '|| m2.sapel ELSE m2.nombre||' '|| m2.papel||' '|| m2.sapel END) AS nombreapellidos
            FROM mod_crmcontratacion.dat_personaparametro m 
            INNER JOIN mod_persona.dat_persona m2 ON (m2.idpersona = m.idpersona) 
            ORDER BY m.idpersonaparametro DESC LIMIT 10000";
            $result = $conexionActual->fetchAll($query);
            $data = new StdClass();
            $data->data = $result;
            $data->quantity = count($result);
        }else{
            $params['idcargo'] = $this->_estructura->obtenerCargosEstructura(
                $params
            );
            $params['idestructura'] = $this->_idestructura;
            $data = $this->_persona->getListadoPersonas($params);
        }
        return $data;
    }

    public function getPersonaByPerfil()
    {
        $idpersona = $this->global->Perfil->idpersona;
        return $this->_persona->getPersona($idpersona, $this->_idestructura);
    }

    public function getCodicionesPago($params)
    {
        $params['idestructura'] = $this->global->Estructura->idestructura;
        return $this->_datosmaestros->getCodicionesPago($params);
    }

    public function getProducto($params)
    {
        $params['idestructura'] = $this->_idestructura;
        return $this->_logistica->getProductService($params);
    }

    public function getServicios($params)
    {
        return $this->_planificacion->getActividadesNormadas($params);
    }

    public function getDatosAdicionales($params)
    {
        try {
            $result = array();
            if ($params['idcontrato']) {
                $result['productos'] = $this->_datindicador->getByParams(
                    $params
                );

                if (isset($params['accion'])) {
                    $result['cantidad'] = count($result['productos']);
                    $result['success'] = true;
                    return $result;
                }

                $filter[0] = array(array('field' => 'idcontrato',
                                         'data'  => array('type'       => 'numeric',
                                                          'value'      => $params['idcontrato'],
                                                          'comparison' => 'eq')));
//                $filt = new stdClass();
//                $filt->property = 'idcontrato';
//                $filt->value = $params['idcontrato'];
//                $filt->idestructura = $this->global->Estructura->idestructura;
//                $filt->listofactura = $params['listofactura'];
                $paramshito=array(
                    'idcontratos'=>$params['idcontrato'],
                    'idestructura'=>$this->global->Estructura->idestructura,
                    'listofactura'=>$params['listofactura']);
                $result['hitos'] = DatHitoContrato::cargarhitoscontrato($paramshito);
                $result['hitos'] = $result['hitos'] != 'null' ? $result['hitos']
                    : array();
//                $result['anexos'] = $this->getFile($params);
                $espacio= $this->getespaciotrabajo($params['idcontrato']);
                $result['anexos'] = $this->getDocumentos($espacio[0]['idespaciotrabajo']);

                $result['conPermiso'] = $this->getAreasI(
                    $params['idcontrato']
                );
                $result['implicadas'] = $this->getAreaImplicada(
                    $params['idcontrato']
                );
                $result['clientesasociados']=$this->_contratoclientesasociados->listarPorCondicion(
                    'idcontrato='.$params['idcontrato']);
                $result['pedidos']=$this->getContratosPedidos($params['idcontrato']);

                $result['penalidadesgeneral']=$this->getPenalidadesGeneral($params['idcontrato']);
//                $result['datospedidosgeneral']=$this->getDatosPedidosGeneral($params['idcontrato']);


            }
            return $result;
        } catch (Doctrine_Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }
    public function getDocumentos($idespacio)
    {
        try {

            if ($this->existeGestorDocumental())
             {
                $documentos = $this->_gestordocumental->getContenidoDocuemtos($idespacio);

            }
            return $documentos;

            //return array('code'    => 'dsadas', 'msg' => 'sdfdsfsdf',
                //         'success' => false);
        } catch (Doctrine_Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function getespaciotrabajo($idcontrato)
    {
        $cadenaQUERY
            = " SELECT 
                         c.idespaciotrabajo
                        FROM 
                          mod_crmcontratacion.dat_contrato c
                          where  c.idcontrato=$idcontrato ";

        $conn = Doctrine_Manager::connection();
        $respuesta = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );

        return $respuesta;
    }

    public function getVehiculos($idclienteproveedor)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $query =
                "SELECT i.idindicador, i.denominacion, marc.denominacion as marca, marc.codigo, 
                model.denominacion as modelo, i.numeropieza as serie, ih.codigoauxiliar as matricula2,
                ic.ano, ic.codigoaux as matricula, ic.idcliente as idclientesproveedor
                FROM mod_datosmaestros.nom_indicador i
                INNER JOIN mod_datosmaestros.dat_indicadorcliente ic ON i.idindicador=ic.idindicador 
                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
                LEFT JOIN mod_datosmaestros.nom_marca marc on ih.idmarca = marc.idmarca
                LEFT JOIN mod_datosmaestros.nom_modelo model on ih.idmodelo = model.idmodelo
                WHERE ic.estado=1 AND ic.idcliente=".$idclienteproveedor ;
            return $conexionActual->fetchAll($query);
        }catch(Exception $e){
            throw $e;
        }
    }

    public function getVehiculosContrato($idcontrato){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $query = "SELECT dvc.idvehiculocontrato, i.idindicador, i.denominacion, marc.denominacion as marca, marc.codigo, 
                  model.denominacion as modelo, i.numeropieza as serie, ih.codigoauxiliar as matricula2,
                  ic.ano, ic.codigoaux as matricula
                  FROM mod_crmcontratacion.dat_vehiculocontrato dvc 
                  INNER JOIN mod_datosmaestros.nom_indicador i ON dvc.idindicador=i.idindicador
                  INNER JOIN mod_datosmaestros.dat_indicadorcliente ic ON i.idindicador=ic.idindicador 
                  INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
                  LEFT JOIN mod_datosmaestros.nom_marca marc on ih.idmarca = marc.idmarca
                  LEFT JOIN mod_datosmaestros.nom_modelo model on ih.idmodelo = model.idmodelo
                  WHERE dvc.idcontrato = $idcontrato";
        return $conexionActual->fetchAll($query);
    }
    public function getAreas($params)
    {
        if($this->_estructura_persona_nomencladores){
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $query
                = "SELECT a.idarea, a.idestructura as id, 
                m2.idfila, COALESCE(m3.denominacion, m4.denominacion) as text, true as leaf 
                FROM mod_crmcontratacion.dat_area a 
                INNER JOIN mod_estructuracomp.nom_filaestruc m2 ON (m2.idfila = a.idestructura) 
                LEFT JOIN mod_estructuracomp.dat_estructuraop m3 ON (m2.idfila = m3.idestructuraop) 
                LEFT JOIN mod_estructuracomp.dat_estructura m4 ON (m2.idfila = m4.idestructura) 
                ORDER BY a.idarea DESC";
            $data = $conexionActual->fetchAll($query);
        }else{
            $idestructura = $this->global->Estructura->idestructura;
            $idpadre = $params['node'] ? : $idestructura;
            // $file = APP_HOME . '../../../comun/recursos/server_config.ini';
            // if (file_exists($file) && !$params['node']) {
            //     $config = parse_ini_file($file, true);
            if ($this ->_mostrar_filtro_area== "true")
                $idpadre = 0;
           // }
            $data = $this->_estructura->getEstructura($idpadre);
        }
        return $data;
    }

    public function getIdEspacioTrabajo()
    {
        $result = $this->_confcontratacion->loadContractdoc();
        return $result[0]['idespaciotrabajo'];
    }

    private function getIdEntidad()
    {
        return $this->global->Estructura->idestructura;
    }

    public function getEstructuraActual()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $result = $this->_estructura->getEstructuraById($idestructura);
        return count($result) ? $result[0] : $result;
    }

    public function formatearNumero($numero)
    {
        return str_replace(',', '.', $numero);
    }

    public function existeGestorDocumental()
    {
        try {
            $conf = new ConfContratacionModel();
            $result = $conf->loadContractdoc();
            if (count($result) && $result[0]['activo']
                && $this->_gestordocumental->testGD()
            ) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getPlantillasProyectos($params)
    {
        try {
            $idestructura = $this->_idestructura;
            $params['idestructura'] = $idestructura;
            if ($params['tipofactura'] == 1) {
                $params['plantilla'] = true;
            } else {
                $params['proyecto'] = true;
            }
            settype($params['idestructura'], 'int');
            settype($params['start'], 'int');
            settype($params['limit'], 'int');
            $result = $this->_planificacion->getPlantillasProyectos($params);
            return array('data' => $result['resultado'],
                         'cant' => $result['total'], 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'success' => false);
        }
    }

    public function cargarhitoscontrato($params)
    {
        $post=array('idcontratos'=>$params['idcontrato'], 'idestructura'=>$this->_idestructura);
        $result = DatHitoContrato::cargarhitoscontrato($post);
        return array('data' => $result);
    }

    public function obtenerConfiguracionVigencia()
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $query
            = "SELECT *
          FROM mod_crmcontratacion.conf_contratoexpiracionvigencia 
          WHERE identidad=" . $this->getIdEntidad();
        $result = $conexionActual->fetchAll($query);
        return $result;
    }

    public function guardarConfiguracionVigencia($params)
    {
        try {
            $conf = $params['idconfig']
                ?
                Doctrine::getTable('ConfContratoExpiracionVigencia')->find(
                    $params['idconfig']
                )
                :
                new ConfContratoExpiracionVigencia();
            $conf->colorprecaucion = $params['activadoexpiracion']
                ? $params['colorfilaaexcederse'] : null;
            $conf->colorexpirado = $params['activadoexpirado']
                ? $params['colorfilaexpiracion'] : null;
            $conf->diasvencimiento = $params['activadoexpiracion']
                ? $params['cantidaddiasaviso'] : null;
            $conf->identidad = $this->getIdEntidad();
            $conf->save();
            return array('code' => 1, 'success' => true);
        } catch (Doctrine_Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function guardarPedidoContratoEstadoInicial($idcontratopedido)
    {
        try {
            $instance = new DatContratoPedidoEstado();
            $instance->idestado = $this->obtenerEstadoinicial();
            $instance->idcontratopedido = $idcontratopedido;
            $instance->idusuario = $this->global->Perfil->idusuario;
            $instance->fechainicio = date('d/m/Y');
            $instance->save();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function guardarHitoEstadoInicial($idhito)
    {
        try {
            $instance = new DatHitoEstado();
            $instance->idestado = $this->obtenerEstadoinicial();
            $instance->idhito = $idhito;
            $instance->idusuario = $this->global->Perfil->idusuario;
            $instance->fechainicio = date('d/m/Y');
            $instance->save();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function guardarEstadoHitoOriginal($idhitooriginal, $idhitoactual)
    {
        try {
            $instance = new DatHitoEstado();
            $hitoestado = DatHitoEstado::getEstadoByParams(
                array('idhito' => $idhitooriginal, 'fechafin' => 'isnull')
            );
            if (count($hitoestado) != 0) {
                $instance->idestado = $hitoestado[0]['idestado'];
                $instance->idhito = $idhitoactual;
                $instance->idusuario = $this->global->Perfil->idusuario;
                $instance->fechainicio = $hitoestado[0]['fechainicio'];
                $instance->save();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function getTransicionesProceso($idproceso)
    {
        $roles = $this->getArrayRolsIds();
        $result = $this->_transicion->getEstadoTransicionesPermisos(
            $idproceso, $roles, true, $this->_idestructura
        );
        return $this->changeResponse($result);
    }

    private function changeResponse($result)
    {
        foreach ($result as &$value) {
            $transicionesAutorizadas = array();
            foreach ($value['NomTransicion'] as $val) {
                if (empty($val['DatRolTransicion'])
                    || $val['idestadofinal'] == $value['idestado']
                ) {
                    continue;
                }
                array_push(
                    $transicionesAutorizadas,
                    array(
                        'idtransicion'=>$val['idtransicion'],
                        'idestado'  => $val['idestadofinal'],
                        'notificar' => $val['notificar']
                    )
                );
//                array_push($transicionesAutorizadas, $val['idestadofinal']);
            }

            unset($value['NomTransicion']);
            $value['transiciones'] = $transicionesAutorizadas;
            $value['acciones'] = Zend_Json::decode($value['acciones']);
        }
        return $result;
    }

    /**
     * Metodo utiliado para migrar los hitos que se encuentran en el campo registro pago
     * en la nueva estructura de tablas de la bd.
     *
     * @throws Exception
     */
    private function migrarHitos()
    {
        try {
            $q = new Doctrine_Query();
            $r = $q->select('d.idcontrato,d.registropago')->from(
                'DatContrato d'
            )->where('d.cliente = 0')->execute()
                ->toArray();
            foreach ($r as $c) {
                $pago = json_decode($c['registropago']);
                $this->insertarHitos($c, $pago->hitos);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function insertarHitos($contrato, $hitos)
    {
        try {
            foreach ($hitos as $hito) {
                $instance = new DatHitoContrato();
                $instance->descripcion = $hito->descripcion;
                $instance->numero = $hito->numero;
                $instance->fechacreacion = date('d/m/Y');
                $instance->fechaestimada = $hito->fechafin;
                $instance = $this->setVigencia($instance, $contrato);
                $instance->idcontrato = $contrato['idcontrato'];
                $instance->idarea = $contrato['idarea'];
                $instance->save();
                $idhito = $instance->idhito;
                $this->guardarHitoEstadoInicial($idhito);
                $pago = $hito->pago;
                foreach ($pago as $m) {
                    $moneda = new DatMonedaHito();
                    $moneda->idmoneda = $m->moneda->idmoneda;
                    $moneda->idhito = $idhito;
                    $moneda->valor = $m->monto;
                    $moneda->save();
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function setVigencia($hito, $contrato)
    {
        $fechai = $contrato['fechafirma'];
        $fechaf = $hito->fechaestimada;

        if ($fechai && $fechaf) {
            $fechai = explode('/', $fechai);
            $fechaf = explode('/', $fechaf);
            $timestampi = mktime(0, 0, 0, $fechai[1], $fechai[0], $fechai[2]);
            $timestampf = mktime(4, 12, 0, $fechaf[1], $fechaf[0], $fechaf[2]);
            $segundosdiferencia = $timestampi - $timestampf;
            $diasdiferencia = $segundosdiferencia / (60 * 60 * 24);
            $diasdiferencia = abs($diasdiferencia);
            $diasdiferencia = floor($diasdiferencia);
            $hito->vigencia = $diasdiferencia;
            $hito->unidadtiempo = 1;
        }

        return $hito;
    }

    public function getTipoPrecio($params)
    {
        try {
            $params['idestructura'] = $this->_idestructura;
            $params['idcliente'] = $params['idclienteproveedor'];
            return $this->_logistica->getTipoPrecio($params);
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function getAreaResponsable($params)
    {
        $datos = $this->integrator->metadatos->DameEstructura(
            $params['idarea']
        );
        return $datos;
    }

    public function guardarConfValoresPorDefecto($params)
    {
        try {
            $conf = $params['idvalorespordefecto']
                ?
                Doctrine::getTable('ConfValoresPorDefecto')->find(
                    $params['idvalorespordefecto']
                )
                : new ConfValoresPorDefecto();
            $conf->idarea = $params['idarea'] ? $params['idarea'] : null;
            $conf->idresponsable = $params['idresponsable']
                ? $params['idresponsable'] : null;
            $conf->idtipocontrato = $params['idtipocontrato']
                ? $params['idtipocontrato'] : null;
            $conf->idsector = $params['idsector'] ? $params['idsector'] : null;
            $conf->idareafiltro = $params['idareafiltro']
                ? $params['idareafiltro'] : null;
            $conf->idresponsablefiltro = $params['idresponsablefiltro']
                ? $params['idresponsablefiltro'] : null;
            $conf->idtipocontratofiltro = $params['idtipocontratofiltro']
                ? $params['idtipocontratofiltro'] : null;
            $conf->idestadofiltro = $params['idestadofiltro']
                ? $params['idestadofiltro'] : null;
            $conf->idvigenciafiltro = $params['idvigenciafiltro']
                ? $params['idvigenciafiltro'] : null;
            $conf->idclientefiltro = $params['idclientefiltro'] != null
                ? $params['idclientefiltro'] : null;
            $conf->idestructuracomun = $this->getIdEntidad();
            $conf->idusuario = $this->global->Perfil->idusuario;
            $conf->save();
            return array('code' => 1, 'success' => true);
        } catch (Doctrine_Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function obtenerConfiguracionPorDefecto()
    {
//        $clientSoap = new SoapClient("http://10.12.46.200:5900/crm/comun/webservices/services.php?wsdl", array('trace' => true));
////print_r($clientSoap);die;
//        $r = $clientSoap->cargarContratos(array('contenido' => '10'));
//        print_r($r);die;
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $query
            = "SELECT vpd.*, s.denominacion AS sector, t.denominacion AS tipocontrato,
              COALESCE (desop.denominacion, des.denominacion) as nombrearea,
              COALESCE (desop.denominacion, des.denominacion) as arearesponsable,
              tf.denominacion AS tipocontratofiltro,
              COALESCE (desopf.denominacion, desf.denominacion) as nombreareafiltro,
              COALESCE (desopf.denominacion, desf.denominacion) as arearesponsablefiltro,
              e.nombre as estadofiltro,
              (CASE WHEN vpd.idclientefiltro=1 THEN 'Contrato cliente' WHEN vpd.idclientefiltro=0 THEN 'Contrato proveedor' ELSE NULL END) as clientefiltro,
              (CASE WHEN vpd.idvigenciafiltro=1 THEN 'Vigente' WHEN vpd.idvigenciafiltro=2 THEN 'Fuera de vigencia' ELSE NULL END) as vigenciafiltro
          FROM mod_crmadministracion.conf_valorespordefecto vpd
          LEFT JOIN mod_crmcontratacion.nom_sector s ON vpd.idsector=s.idsector
          LEFT JOIN mod_crmcontratacion.dat_tipocontrato t ON vpd.idtipocontrato=t.idtipocontrato
          LEFT JOIN mod_estructuracomp.dat_estructura des ON (vpd.idarea = des.idestructura and des.idproyecto = 0)
          LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (vpd.idarea = desop.idestructuraop and desop.idproyecto = 0)
          LEFT JOIN mod_estructuracomp.nom_filaestruc f ON vpd.idarea=f.idfila
          LEFT JOIN mod_crmcontratacion.dat_tipocontrato tf ON vpd.idtipocontratofiltro=tf.idtipocontrato
          LEFT JOIN mod_estructuracomp.dat_estructura desf ON (vpd.idareafiltro = desf.idestructura and desf.idproyecto = 0)
          LEFT JOIN mod_estructuracomp.dat_estructuraop desopf ON (vpd.idareafiltro = desopf.idestructuraop and desopf.idproyecto = 0)
          LEFT JOIN mod_estructuracomp.nom_filaestruc ff ON vpd.idareafiltro=ff.idfila
          LEFT JOIN mod_crmcontratacion.nom_estado e ON vpd.idestadofiltro=e.idestado
          WHERE vpd.idestructuracomun=" . $this->getIdEntidad()
            . " AND vpd.idusuario=" . $this->global->Perfil->idusuario;
        return $conexionActual->fetchAll($query);
    }

    public function getCategorias($params)
    {
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection(
        );
        $where = '';
        if ($params['denominacion']) {
            $where = ' WHERE c.denominacion ILIKE %' . $params['denominacion']
                . '%';
        }
        $query
            = "SELECT c.denominacion, c.idcategoria
          FROM mod_crmcontratacion.nom_categoria c " . $where;
        return $conexionActual->fetchAll($query);
    }

    public function obtenerAtributosVehiculos($params)
    {
        return $this->integrator->logistica->GetAtributosByIndicador(
            $params['idindicador']
        );
    }

    private function salvarAnexosLocales($idcontrato, $params)
    {
        try {
            $this->establecerNombreDocumento($params, true);

            foreach ($_FILES as $file) {
                $anexo = new DatAnexo();
                $anexo->nombre = $file['realname'];
                $anexo->idexterno = $idcontrato;
                $anexo->tipoarchivo = $file['type'];
                $contenido = file_get_contents($file['tmp_name']);
                $anexo->contenido = pg_escape_bytea($contenido);
                $anexo->categoria = 3;
                $anexo->save();
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getContabilidad()
    {
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $ioccontabilidad
            = substr($dirindex, 0, strrpos($dirindex, 'web'))
            . 'apps/contabilidad/comun/recursos/xml/ioc.xml';
        $aperturado = 0;
        if (file_exists($ioccontabilidad)) {
            $result = $this->integrator->datosmaestros->subsistemaAperturado(
                $this->_idestructura, 4
            );
            if (!count($result)) {
                $aperturado = 0;
            } else {
                $aperturado = $result[0]['aperturado'];
            }
        }
        $habilitado = false;
        $contabilidad = $this->_confcontratacion->loadConfContratoContabilidad(
        );
        if (count($contabilidad) > 0) {
            $habilitado = $contabilidad[0]['activo'] == '1';
        }
        return array('archivo'        => file_exists($ioccontabilidad),
                     'aperturado'     => $aperturado,
                     'confhabilitado' => $habilitado,
                     'habilitado'     => file_exists($ioccontabilidad)
                         && $aperturado == 1
                         && $habilitado);
    }

    public function comprobarDeudaClienteProveedor($idclienteproveedor)
    {
        return $this->integrator->copa->cargarDatosDuoClientes(
            array('clientes' => json_decode($idclienteproveedor))
        );
    }

    private function obtenerAnexosLocales($idcontrato)
    {
        try {
            $params['categoria'] = 3;
            $params['idexterno'] = $idcontrato;
            return $this->_anexos->getAnexos($params);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function descargarAnexoLocal($params)
    {
        $idanexo = $params['idfile'];
        $anexo = $this->_anexos->getAnexos(
            array('idanexo' => $idanexo), true
        )[0];
        if ($anexo) {
            $filename = $anexo['nombre'];
            $type = $anexo['tipoarchivo'];
            $data = pg_unescape_bytea($anexo['contenido']);
            /*$file = fopen($filename, 'wb');
            fwrite($file, $data);
            fclose($file);*/
            header("Content-type: $type");
            header("Content-Disposition: attachment; filename=\"$filename\"");
            header("Pragma: no-cache");
            header("Expires: 0");
            echo $data;
        } else {
            json_encode(array('success' => false));
        }
    }

    public function getDatosNotificar($contrato)
    {
        try {

            $identificador = $contrato->cliente ? 'mdContrato'
                : 'mdcontratoproveedor';
            $result = $this->_transicion->getTransitions(
                null, $contrato->idestado, $identificador
            );
            $roles = array();
            foreach ($result as $t) {
                foreach ($t['DatRolTransicion'] as $r) {
                    if (!in_array($r['idrol'], $roles)) {
                        $roles[] = $r['idrol'];
                    }
                }
            }
            return array('roles' => $roles, 'contrato' => $contrato->toArray());
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDocumento($idnodo)
    {
        return $idnodo;
    }
    public function getArchivo($idnodo)
    {
        try {
            $documentos = null;

            if ($this->existeGestorDocumental()) {
                return $this->_gestordocumental->getArchivo($idnodo);
            }
            return $documentos;
        } catch (Exception $e) {
            throw $e;
        }
//        $params['iddocument'] = $params['idnodo'];
//        $path = $this->_gestordocumental->getFile($params);
//        $nombre = $params['idnodo'];
//        if ($path) {
//            $path = str_replace('/', '\\', $path);
//            header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
//            header("Cache-Control: public"); // needed for internet explorer
//            header("Content-Transfer-Encoding: Binary");
//            header("Content-Length:" . filesize($path));
//            header("Content-Disposition: attachment; filename=$nombre");
//            header("Content-Type: image/jpeg");
//            readfile($nombre);
//            unlink($path);
//            return true;
//
//        } else {
//            return;
//        }
    }

    public function getDocumentosreales($path)
    {
        try {
            $documentos=null;

            if ($this->existeGestorDocumental()) {
                return $this->_gestordocumental->getFileReales($path);
            }
            // return tr;
        } catch (Exception $e) {
            throw $e;
        }

//        $params['iddocument'] = $params['idnodo'];
//        $path = $this->_gestordocumental->getFile($params);
//        $nombre = $params['idnodo'];
//        if ($path) {
//            $path = str_replace('/', '\\', $path);
//            header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
//            header("Cache-Control: public"); // needed for internet explorer
//            header("Content-Transfer-Encoding: Binary");
//            header("Content-Length:" . filesize($path));
//            header("Content-Disposition: attachment; filename=$nombre");
//            header("Content-Type: image/jpeg");
//            readfile($nombre);
//            unlink($path);
//            return true;
//
//        } else {
//            return;
//        }
    }

    public function historial($params)
    {
        try {
            if ($params['idcontrato']) {
                $params['filter'] = array(array('field' => 'idcontrato',
                                                'data'  => array('type'  => 'numeric',
                                                                 'value' => $params['idcontrato'])));
            }
            $contratos = [];
            do {
                $result = $this->getContratos($params, false, true);
                $contrato = $result['data'][0];

                array_unshift($contratos, $contrato);
                $params['filter'] = array(array('field' => 'idcontrato',
                                                'data'  => array('type'  => 'numeric',
                                                                 'value' => $contrato['idpadre'])));
            } while ($contrato['idcontrato'] != $contrato['idpadre']);
            $result['data'] = $contratos;
            return $result;
        } catch (Exception $e) {
            return array();
        }
    }

    public function reclamacion($params)
    {
        $listReclamaciones = [];
        $result = $this->_reclamacionesDService->getReclamaciones($params);
        $reclamaciones = $result['datos'];

        foreach ($reclamaciones as $actual) {
            if ($actual['idcontrato'] == $params['idcontrato']) {
                if (array_key_exists($actual, $listReclamaciones)) {
                    continue;
                }
                $listReclamaciones[] = $actual;
            }
        }
        return array(
            'cant'  => count($listReclamaciones),
            'datos' => $listReclamaciones
        );
    }

//    public function reclamacion($params)
//    {
//
//        try {
//            $reclamaciones = [];
//            //do {
//            $result = $this->_reclamacionesDService->getReclamaciones(
//                $params, false, true
//            );
//            $reclamacion = $result['datos'];
//            foreach ($reclamacion as $actual) {
//                if ($actual['idcontrato'] == $params['idcontrato']) {
//                    array_unshift($reclamaciones, $actual);
//                    $result['datos'] = $reclamaciones;
//                }
//            }
//            return $result;
//        } catch (Exception $e) {
//            return array();
//        }
//    }


    public function cambiarEstado($params)
    {
        try {
            $this->cambiarFechaFinEstado($params['idcontrato']);
            $instance = new DatContratoEstado();
            $instance->idestado = $params['idestado'];
            $instance->idcontrato = $params['idcontrato'];
            $instance->idusuario = $this->global->Perfil->idusuario;
            $instance->fechainicio = date('d/m/Y');
            $instance->save();
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    private function cambiarFechaFinEstado($idhito)
    {
        try {
            $instance = Doctrine::getTable('DatContratoEstado')->findByDql(
                'idcontrato=? and fechafin ISNULL', array($idhito)
            );
            if (count($instance)) {
                $instance = $instance[0];
                $instance->fechafin = date('d/m/Y');
                $instance->save();
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function guardarContratoEstadoInicial($idcontrato)
    {
        try {
            $instance = new DatContratoEstado();
            $instance->idestado = $this->obtenerEstadoinicial();
            $instance->idcontrato = $idcontrato;
            $instance->idusuario = $this->global->Perfil->idusuario;
            $instance->fechainicio = date('d/m/Y');
            $instance->save();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function guardarContratoEstadoFirmado($idcontrato)
    {
        try {
            $this->cambiarFechaFinEstado($idcontrato);
            $instance = new DatContratoEstado();
            $instance->idestado = $this->obtenerEstadoFirmado();
            $instance->idcontrato = $idcontrato;
            $instance->idusuario = $this->global->Perfil->idusuario;
            $instance->fechainicio = date('d/m/Y');
            $instance->save();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function guardardocumento($data)
    {
        $idcontrato = $data['idcontrato'];
        $contrato = Doctrine::getTable('Datcontrato')->find($idcontrato);
        if ($contrato) {
            if (count($_FILES) && $this->existeGestorDocumental()) {
                $contrato = $this->addDocument($contrato, $data);
            }
            $contrato->save();
        }
        return array('code' => 1, 'success' => true, 'data' => $data);
    }

    private function calcularDuracionEstado($value)
    {
        $fechainicio = DateTime::createFromFormat(
            'd/m/Y', $value['fechainicio']
        );
        $fechafin = DateTime::createFromFormat(
            'd/m/Y', ($value['fechafin']) ? $value['fechafin'] : date('d/m/Y')
        );
        $diferencia = $fechainicio->diff($fechafin);
        return $diferencia->days;
    }

    public function getContratoEstadoTrazas($idcontrato)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $result = $conexionActual->fetchAll(
            "
            SELECT ce.*, e.nombre as estado, p.idpersona as idpersona, u.nombreusuario as usuario, e.icono as iconoestado
            FROM mod_crmcontratacion.dat_contratoestado ce
            LEFT JOIN mod_crmcontratacion.nom_estado e on (e.idestado = ce.idestado)
            LEFT JOIN mod_seguridad.seg_usuario u on (ce.idusuario = u.idusuario)
            LEFT JOIN mod_persona.dat_persona p on (u.idpersona = p.idpersona)
            WHERE ce.idcontrato=" . $idcontrato

        );

        foreach ($result as $key => $value) {
            $persona = (new PersonaComunicationInterface())->getPersona(
                $value['idpersona']
            );

            $estruc = (new EstructuraComunicationInterface(
            ))->getEstructuraById($persona['idarea']);
            $result[$key]['nombreapellidos'] = $persona['nombreapellidos'];
            $result[$key]['area'] = $estruc[0]->denominacion;
            $result[$key]['duracionestado'] = $this->calcularDuracionEstado(
                $value
            );
        }

        return $result;
    }

    public function filterliststore($columnlist){
        $filtros = array(
            'ultimocontrato' => !$this->_mostrar_suplementos,
            'hitosarea'=> $this->_mostrar_hitos_area,
            'todasareas'=>$this->_mostrar_todas_areas,
            'idestructuracomun'=>$this->_idestructura,
            'iddominio'=>$this->_iddominio?$this->_iddominio:1,
        );
        return $this->_contrato->filterliststore($columnlist, $filtros);
    }

       public function getTodasAreas($params){
           $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            //pa engañar
//        $estructura=$this->integrator->metadatos->DameEstructura($idestructura = $this->global->Estructura->idestructura);
           //$idpadre = $params['node'] ? $params['node'] : $idestructura;
           if($params['node']){
               $idpadre = $params['node'];
           }else{
               $idestructura = $this->global->Estructura->idestructura;
               $parenth_path=$conn->fetchAll("
                SELECT fe.parent_path FROM mod_estructuracomp.nom_filaestruc fe WHERE fe.idfila=".$idestructura
            );
            if(count($parenth_path)){
                $ids=explode('.', $parenth_path[0]['parent_path']);
                if(count($ids))$idpadre=$ids[0];
            }
        }
        $datos=$conn->fetchAll(
            "SELECT fila.idfila AS id, fila.idfila AS idarea,
            fila.idpadre AS _parent, i.icono as icon, fila.orden,
            CASE
                WHEN estructura.denominacion <> '' THEN estructura.abreviatura
                WHEN estructuraop.denominacion <> '' THEN estructuraop.abreviatura
            END AS abreviatura,
            CASE
                WHEN estructura.denominacion <> '' THEN estructura.denominacion
                WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
            END AS text,
            CASE
                WHEN estructura.denominacion <> '' THEN estructura.denominacion
                WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
            END AS denominacion,
            CASE
                WHEN estructura.denominacion <> '' THEN estructura.denominacion
                WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
            END AS qtip,
            NOT EXISTS(
              SELECT f.idfila
              FROM mod_estructuracomp.nom_filaestruc AS f
              LEFT JOIN mod_estructuracomp.dat_estructura e ON ( e.idestructura = f.idfila AND e.idproyecto = 0 )
              LEFT JOIN mod_estructuracomp.dat_estructuraop op ON ( op.idestructuraop = f.idfila AND op.idproyecto = 0)
              WHERE f.fechafin IS NULL AND 
              (e.idestructura IS NOT NULL OR op.idestructuraop IS NOT NULL)
              AND f.idpadre = fila.idfila AND f.idpadre <> f.idfila
            ) as leaf
            FROM mod_estructuracomp.nom_filaestruc fila
            INNER JOIN mod_estructuracomp.nom_concepto nomeav 
                ON fila.idconcepto = nomeav.idconcepto
            INNER JOIN mod_estructuracomp.nom_icono i 
                ON i.idicono = nomeav.idicono
            LEFT JOIN mod_estructuracomp.dat_estructura estructura
                ON (estructura.idestructura = fila.idfila AND estructura.idproyecto = 0)
            LEFT JOIN mod_estructuracomp.nom_icono iest 
                ON iest.idicono = estructura.idicono
            LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
                ON (estructuraop.idestructuraop = fila.idfila AND estructuraop.idproyecto = 0)
            WHERE fila.fechafin IS NULL AND 
                (estructura.denominacion <> '' OR estructuraop.denominacion <> '') AND
                fila.idpadre = $idpadre AND fila.idfila <> fila.idpadre
                ORDER BY fila.orden"
        );

        if($params['node']){
            $result=$datos;
        }else{
            $padre=$conn->fetchAll("SELECT e.idestructura as id, e.idestructura as idarea,
                COALESCE (e.denominacion, eop.denominacion) as text, e.abreviatura, e.denominacion as qtip, 
                false as leaf, true as expanded, c.denominacion as tipo_concepto, i.icono as icon
                FROM mod_estructuracomp.dat_estructura e
                INNER JOIN mod_estructuracomp.nom_filaestruc fe on(e.idestructura=fe.idfila)
                LEFT JOIN mod_estructuracomp.nom_concepto c ON(fe.idconcepto=c.idconcepto)
                LEFT JOIN mod_estructuracomp.nom_icono i ON i.idicono=c.idicono
                LEFT JOIN mod_estructuracomp.dat_estructuraop eop
                ON (eop.idestructuraop = fe.idfila AND eop.idproyecto = 0)
                WHERE e.idestructura=".$idpadre);
            $padre[0]['children']=$datos;
            $result=$padre;
        }
        return array('success'=>true, 'children'=>$result);

    }


    public function cargarElementosNumeroContrato($params){
        return array('success'=>true, 'data'=>$this->_numero->getFormatoNumContratoElementos(
            $params['contratodestino'], array('consecutivoactual'=>true, 'consecutivoglobal'=>$this->_increment_unique)));
        // NomFormatoNumContratoElemento
    }

    public function modificarNumeroContrato($params){
        $contrato = Doctrine::getTable('Datcontrato')->find($params['idcontrato']);
        $numerojson=json_decode($params['numerojson']);
        $elementos=$numerojson->numero;
        $posiciones=$params['posiciones'];
        $cond=[]; $cond1=''; $cond2='';
        $numerojsoncontrato=json_decode($contrato->numerojson);
        $cambiosuplemento=(int)$params['suplemento']!=(int)$numerojsoncontrato->suplemento;

        foreach(explode(',', $params['posiciones']) as $pos){
            if($numerojsoncontrato->numero[$pos]!=$elementos[$pos])
                $cond[]="c.numerojson -> 'numero' ->> $pos='".$elementos[$pos]."'";
        }
//        print_r(json_decode($contrato->numerojson)->suplemento);die;
        $cond1=implode(' AND ', $cond);
        if($params['suplemento'] && $cambiosuplemento){
            $cond2=($cond1==''?'':' OR ')."c.numero = '".implode('', $elementos).'/'.$params['suplemento']."' ";
        }
        $where=$cond1.$cond2.
            ($this->_increment_unique?"":" AND c.cliente=".$contrato->cliente);
//        print("SELECT count(c.idcontrato) over(), c.* FROM mod_crmcontratacion.dat_contrato c
//            WHERE $where");die;
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $contratosadicionales=$conn->fetchAll(
            "SELECT count(c.idcontrato) over(), c.* FROM mod_crmcontratacion.dat_contrato c
            WHERE $where"
        );
        $params['consecutivoactual'] = true;
        $params['consecutivoglobal'] = $this->_increment_unique;
        $params['cliente'] = $contrato->cliente;
        $result = $this->_numero->getNumContrato($params, $contrato->cliente?2:3);
//        print_r((int)$result[$posiciones] >(int)$elementos[$posiciones]);die;
        if((count($contratosadicionales)==0 && (int)$result[$posiciones]>=(int)$elementos[$posiciones]) ||
            $params['ignoreErrors']=='1'){
            $contrato->numero=implode('', $elementos).($numerojson->suplemento!='0'?"/" . ($numerojson->suplemento):'');
            if($contrato->cliente==1)$contrato->numerocontrato=implode('', $elementos).($numerojson->suplemento!='0'?"/" . ($numerojson->suplemento):'');
            $contrato->numerojson=$params['numerojson'];
            $contrato->save();
            return array('success'=>true);
        }else{
            $detalles='';
            if(count($contratosadicionales)>0){
                $numeros=[];
                foreach($contratosadicionales as $cont){
                    $numeros[]=preg_replace('/\/'.$params['suplemento'].'/', '/<span style="color:red">'.$params['suplemento'].'</span>',
                            preg_replace('/'.$elementos[$pos].'/','<span style="color:red">'.$elementos[$pos].'</span>',
                                $cont['numero'], 1), 1).' - '.$cont['nombre'].'<br>';
                }
                $detalles='Ya existen contratos con ese número consecutivo ó ese número de suplemento:<br>-'.implode('-', $numeros).'<br>';
            }
            if((int)$result[$posiciones]<(int)$elementos[$posiciones]){
                $detalles.='El número a cambiar es mayor que el número consecutivo actual: '.$result[$posiciones].'<br>';
            }
            return array('success'=>false, 'detalles'=>$detalles);
        }
    }

    public function cargarClientesAsociados($params){
        return $this->_contratoclientesasociados->listarPorCondicion('idcontrato=?', $params['idcontrato']);
    }

    public function importarDatosExcel($post)
    {
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $ruta = substr($dirindex, 0, strrpos($dirindex, 'web')) .
            'lib/Adapters/PHPExcel/1.8.0/';
        include_once($ruta . 'PHPExcel.php');
        include_once($ruta . 'PHPExcel/Reader/Excel2007.php');
        include_once($ruta . 'PHPExcel/Reader/Excel5.php');
        include_once($ruta . 'PHPExcel/IOFactory.php');
        $result = [];
        $nombres = array();
        $dic = array();
        $diccionario = array(
            'código'                   => 'codigo',
            'codigo'                   => 'codigo',
            'codigos'                  => 'codigo',
            'ref. /codigos'            => 'codigo',
            'denominación'             => 'denominacion',
            'denominacion'             => 'denominacion',
            'descripción'              => 'denominacion',
            'descripcion'              => 'denominacion',
            'descripcion del producto' => 'denominacion',
            'cantidad'                 => 'cantidad',
            'cant'                     => 'cantidad',
            'cant.'                    => 'cantidad',
            'cup'                      => 'precio',
            'precio'                   => 'precio',
            'monto'                    => 'precio',
            'precio dap'               => 'precio',
            'cuc'                      => 'preciodivisa');
        if (count($_FILES)) {
            $archivo = $_FILES['excel']['tmp_name'];
            $nombre = $_FILES['excel']['name'];
            $aux = explode('.', $nombre);
            $formato = $aux[count($aux) - 1];
            $inputFileType = 'Excel5';
            if ($formato == 'xlsx') {
                $inputFileType = 'Excel2007';
            }
            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
            $objReader->setReadDataOnly(true);
            if (file_exists($archivo)) {
                $objPHPExcel = $objReader->load($archivo);
                //Obteniendo los datos en un array
                $worksheettoarray = $objPHPExcel->getActiveSheet()->toArray(
                    null, true, true, true
                );

                foreach ($worksheettoarray as $i => $arrworksheet) {
                    if (count($nombres)) {
                        $actual = array();
                        foreach ($arrworksheet as $j => $column) {
                            if ($diccionario[trim(strtolower($nombres[$j]))]) {
                                if($diccionario[trim(strtolower($nombres[$j]))]=='codigo'){
                                    $actual[$diccionario[trim(strtolower($nombres[$j]))]] = str_replace(array('\'', '"'), '', trim($column));
                                }else{
                                    $actual[$diccionario[trim(strtolower($nombres[$j]))]] = trim($column);
                                }
                            }
                        }
                        $result[] = $actual;
                    }
                    if (
//                        $arrworksheet['A'] && $diccionario[trim(strtolower($arrworksheet['A']))] &&
                        count($nombres) == 0) {
                        $finded=false;
                        foreach($arrworksheet as $j => $column){
                            if($diccionario[trim(strtolower($column))]){
                                $finded=true;
                                $dic[$diccionario[trim(strtolower($column))]]=$column;
                            }
                        }
                        if($finded)$nombres = $arrworksheet;
                    }
//                    else{

                }
            }
        }
//        print_r($result);die;
        return array('success'    => true, 'count' => count($result),
                     'nombres'    => $nombres, 'diccionario'=>$dic, 'data' => $result
//                     'naturaleza' => $this->_demandaDService->cargarNaturaleza()
                     );
    }

    public function exportarDatosExcel($post)
    {
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $ruta = substr($dirindex, 0, strrpos($dirindex, 'web')) .
            'lib/Adapters/PHPExcel/1.8.0/';
        include_once($ruta . 'PHPExcel.php');
        include_once($ruta . 'PHPExcel/Reader/Excel2007.php');
        include_once($ruta . 'PHPExcel/Reader/Excel5.php');
        include_once($ruta . 'PHPExcel/IOFactory.php');
//        $objWriter=PHPExcel_IOFactory::createWriter('Excel5');
//        $objWriter->save('Nombrecualquiera');
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Productos');
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(50);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(80);
        $this->formatoCeldaTitulo($objPHPExcel, 'A1');
        $this->formatoCeldaTitulo($objPHPExcel, 'B1');
        $this->formatoCeldaTitulo($objPHPExcel, 'C1');
        $this->formatoCeldaTitulo($objPHPExcel, 'D1');
        $this->formatoCeldaTitulo($objPHPExcel, 'E1');
        $this->formatoCeldaTitulo($objPHPExcel, 'F1');
        $objPHPExcel->getActiveSheet()->setCellValue('A1', 'CODIGO');
        $objPHPExcel->getActiveSheet()->setCellValue('B1', 'DESCRIPCION');
        $objPHPExcel->getActiveSheet()->setCellValue('C1', 'CANTIDAD');
        $objPHPExcel->getActiveSheet()->setCellValue('D1', 'PRECIO');
        $objPHPExcel->getActiveSheet()->setCellValue('E1', 'IMPORTE');
        $objPHPExcel->getActiveSheet()->setCellValue('F1', 'DETALLES');
        $productos = json_decode($post['productos']);
        $cont = 2;
//        print_r($productos);die;
        foreach ($productos as $prod) {
            $objPHPExcel->getActiveSheet()->setCellValue(
                'A' . $cont, $prod->codigo
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'B' . $cont, $prod->denominacion
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'C' . $cont, $prod->cantidad
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'D' . $cont,
                floatval($prod->precio) + floatval($prod->preciodivisa)
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'E' . $cont,
                (floatval($prod->precio) + floatval($prod->preciodivisa))
                * $prod->cantidad
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'F' . $cont, $prod->datos_json
            );
            $cont++;
        }
        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save;
        header(
            'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        header(
            'Content-Disposition: attachment;filename="Productos_exportados_'
            . date('d-m-Y') . '.xls" '
        );
        header('Cache-Control: max-age=0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
    }

    public function formatoCeldaTitulo(&$objPHPExcel, $celda)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFont()
            ->applyFromArray(
                array(
                    'name'   => 'Arial',
                    'bold'   => true,
                    'italic' => false,
                    'strike' => false,
                    'size'   => 11,
                    'color'  => array(
                        'rgb' => '000000'
                    )
                )
            );
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getBorders()
            ->applyFromArray(
                array(
                    'bottom' => array(
                        'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    ),
                    'right'  => array(
                        'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                )
            );
    }

    public function guardarCambioArea($params)
    {
        try {
            if (true) {
                $idscontratos = json_decode($params['idscontratos']);
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
                if ($params['idscontratos']) {
                    if (count($idscontratos) > 0) {
                        foreach ($idscontratos as $actual) {
                            $contrato = Doctrine::getTable('DatContrato')->find(
                                $actual
                            );
                            $contrato->idarea = $params['idestructura'];
                            $contrato->save();
                            $hitos = $conexionActual->fetchAll(
                                "
                                    SELECT h.idcontrato,h.idhito,h.idarea
                                    FROM mod_crmcontratacion.dat_hito h
                                    WHERE h.idcontrato = $actual"
                            );
                            foreach ($hitos as $h) {
                                $hito = Doctrine::getTable('DatHitoContrato')
                                    ->find(
                                        $h['idhito']
                                    );
                                $hito->idarea = $params['idestructura'];
                                $hito->save();

                            }

                        }

                        return array('success' => true, 'code' => 1);
                    }
                }
            } else {
                return array('success' => true, 'code' => 3);
            }
        } catch (Exception $e) {
            if ($e->getCode() == 335) {
                return;
            }
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function getAreaConPermiso($idcontrato)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        return $conn->fetchAll(
            "
            SELECT COALESCE (estuc1.denominacion, estucop1.denominacion) as area, cai.idarea, cai.idestructura
            FROM mod_crmcontratacion.dat_contratoareaimplicada cai
            LEFT JOIN mod_estructuracomp.dat_estructura estuc1 ON (cai.idestructura = estuc1.idestructura and estuc1.idproyecto = 0)
            LEFT JOIN mod_estructuracomp.dat_estructuraop estucop1 ON (cai.idestructura = estucop1.idestructuraop and estucop1.idproyecto = 0)
            WHERE cai.idcontrato=" . $idcontrato
        );
    }

    public function getContratosPedidos($idcontrato){
        try {
//            $pedidos = Doctrine::getTable('DatContratoPedido')->findBy(
//                'idcontrato', $idcontrato
//            )->toArray();
//            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
//            $pedidos = $conexionActual->fetchAll("
//                SELECT cp.*, cpe.fechainicio as fechaestado, e.idestado, e.nombre as estado, e.icono as iconoestado
//                FROM mod_crmcontratacion.dat_contratopedido cp
//                LEFT JOIN mod_crmcontratacion.dat_contratopedidoestado cpe
//                ON (cpe.idcontratopedido=cp.idcontratopedido AND cpe.fechafin IS NULL)
//                LEFT JOIN mod_crmcontratacion.nom_estado e ON e.idestado=cpe.idestado
//            ");
//            return $pedidos;
            $pedidos=new DatContratoPedido();
            return $pedidos->listarPedidos(array('idcontrato'=>$idcontrato));
        }catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

    public function getPenalidadesGeneral($idcontrato){
        try {
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $penalizaciones = $conexionActual->fetchAll("
                SELECT p.idarribo, a.descripcion, 
                COUNT(p.idpenalidad) as cantpenalizaciones, 
                SUM(tp.porciento) as porcientototal
                FROM mod_crmcontratacion.dat_penalizaciones p
                LEFT JOIN mod_crmcontratacion.dat_arribo a ON (a.idarribo=p.idarribo)
                LEFT JOIN mod_crmcontratacion.nom_tipopenalidad tp ON (tp.idtipopenalidad=p.idtipopenalidad)
                WHERE a.idcontrato=".$idcontrato." GROUP BY p.idarribo, a.descripcion"
            );
            return $penalizaciones;
        }catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

    private function getDatosPedidosGeneral($idcontrato){
        try {
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $datos = $conexionActual->fetchAll("
                SELECT cp.productos
                FROM mod_crmcontratacion.dat_arribo a 
                LEFT JOIN mod_crmcontratacion.dat_arriboestado ae ON (ae.idarribo=a.idarribo AND ae.fechafin IS NULL)
                LEFT JOIN mod_crmcontratacion.dat_arribopedido ap ON (ap.idarribo=a.idarribo)
                LEFT JOIN mod_crmcontratacion.dat_contratopedido cp ON (cp.idcontratopedido=ANY(string_to_array(ap.pedidos::varchar, ',')::bigint[]))
                WHERE a.idcontrato=".$idcontrato
            );
            return $datos;
        }catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

    public function realizarAjusteMonetario($params){
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $contratos=$conn->fetchAll(
            "SELECT c.*, mc.valor,
            c.denominacionclienteproveedor as clienteproveedor,
            c.denominaciontipocontrato as tipocontrato,
            c.elemento as formDynamic,
            c.idresponsable as idpersona,
            c.registropago as pago,
            'true' as suplemento,
            'true' as addsuplemento,
            'Ajuste monetario' as objetosuplemento
            
            FROM mod_crmcontratacion.dat_contrato c
            INNER JOIN mod_crmcontratacion.dat_monedacontrato mc ON mc.idcontrato=c.idcontrato
            INNER JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mc.idmoneda
            WHERE m.codigoiso='CUC' AND mc.valor>0
            
            AND c.idcontrato=10106"

//            AND ((c.idcontrato = c.idpadre AND (SELECT count(dc.idpadre)
//                 FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 1) OR
//                 (c.idcontrato != c.idpadre AND (SELECT count(dc.idpadre)
//            FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 0))
        );
        $contratosModificados=array();
        $contratosNuevos=array();
        foreach ($contratos as $con){
            $contratosModificados[]=$con['numerocontrato'];
            $con['version']=0;

            $montos=$conn->fetchAll(
                "SELECT mc.valor, mc.idmoneda, m.codigoiso 
                FROM mod_crmcontratacion.dat_monedacontrato mc
                INNER JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mc.idmoneda
                WHERE mc.idcontrato=".$con['idcontrato']
            );
            $suma=0;
//            foreach($montos as $m){
//                $con['idmoneda_'.strtolower($m['codigoiso'])]=$m['idmoneda'];
//                $monto=$m['codigoiso']=='CUC'?$m['valor']*$tasa:$m['valor'];
//                $con['montomoneda_'.strtolower($m['codigoiso']).'_'.$m['idmoneda']]=$monto;
//                $suma+=$monto;
//            }
            $organizado=array();
            foreach ($montos as $m){
                $organizado[$m['codigoiso']]=array('valor'=> $m['valor'], 'idmoneda'=> $m['idmoneda']);
            }
            foreach($params as $key=>$value){
                if($value && strpos($key, '_a_')){
                    $aux=explode('_a_', $key);
                    if($organizado[$aux[1]]){
                        $organizado[$aux[1]]['valor']+=floatval($organizado[$aux[0]]['valor'])*floatval(str_replace(',', '.', $value));
                        $organizado[$aux[0]]['valor']=0;
                    }else{
                        $organizado[$aux[1]]['valor']=floatval($organizado[$aux[0]]['valor'])*floatval(str_replace(',', '.', $value));
                        $organizado[$aux[0]]['valor']=0;
                    }
                }
            }
            foreach($organizado as $k=>$c){
                if($c['valor']){
                    $con['idmoneda_'.strtolower($k)]=$c['idmoneda'];
                    $con['montomoneda_'.strtolower($k).'_'.$c['idmoneda']]=$c['valor'];
                    $suma+=$c['valor'];
                }
            }
            $con['montototal']=$suma;
            $productos = new stdClass();
            $productos->guardados=$this->_datindicador->getByParams(
                array('idcontrato'=>$con['idcontrato'])
            );
            $productos->eliminados=array();
            $con['productos']=json_encode($productos);
            $hitos=new stdClass();
            $hitos->modificados = $this->_hitocontrato->cargarhitoscontrato(
                array('idcontratos'=>$con['idcontrato'],
                    'idestructura'=>$this->global->Estructura->idestructura)
            );
            $hitos->eliminados=array();
            $con['hitos']=$hitos;
            $con['idcontrato']=null;
            $guardado=$this->saveContrato($con);
            $contratosNuevos[]=$guardado['idcontrato'];
        }
        return array(
            'success' => true,
            'modificados' => $contratosModificados,
            'nuevos' => $contratosNuevos,
            'respuesta'=> $guardado);
    }

    public function limpiarEspacioTrabajo($params){
        try{
            if($params['idcontrato']){
                $contrato = Doctrine::getTable('DatContrato')->find(
                    $params['idcontrato']
                );
                if($contrato){
                    $contrato->idespaciotrabajo=null;
                    $contrato->save();
                }else{
                    throw new Exception('El contrato ha sido eliminado. Recarge la lista de contratos.', 333);
                }
            }
            return array('success' => true);
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

    public function arreglarEstado($params){
        try{
            if($params['idcontratos']) {
                $idestadoinicial=$this->obtenerEstadoinicial();
                foreach(json_decode($params['idcontratos']) as $con){
                    $contrato = Doctrine::getTable('DatContrato')->find($con);
                    if ($contrato) {
                        $estadoContrato = new DatContratoEstado();
                        $estadoContrato->idestado = $this->obtenerEstadoinicial();
                        $estadoContrato->idusuario = $this->global->Perfil->idusuario;
                        $estadoContrato->fechainicio = date('d/m/Y');
                        $estadoContrato->idcontrato = $con;
                        $estadoContrato->idestado = $idestadoinicial;
                        $estadoContrato->save();
                    } else {
                        return array(
                            'success' => false,
                            'msg' => 'Un contrato ha sido eliminado. Actualice la lista de contratos he int&eacute;ntelo de nuevo.',
                        );
                    }
                }
            }
            return array('success' => true);
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

    public function cargarNaturalezas($params){
        try{
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where="";
            if($params['denominacion']){
                $where=" WHERE n.denominacion ILIKE '%".$params['denominacion']."%' ";
            }
            $naturalezas = $conexionActual->fetchAll(
                "SELECT count(n.idnaturaleza) over(), n.idnaturaleza, n.denominacion 
                    FROM mod_datosmaestros.nom_naturaleza n
                    $where
                    ORDER BY n.denominacion
                    LIMIT ".$params['limit']." OFFSET ".$params['start']
            );
            return array('succes'=> true, 'total'=>count($naturalezas) ? $naturalezas[0]['count'] : 0, 'data'=>$naturalezas);
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }

//        if (!$params['idnaturaleza']) {
//            $params['idnaturaleza'] = $this->cargarNaturaleza();
//        }
//        if ($params['idnaturaleza']) {
//            $result = $this->integrator->logistica->getIndicadoresByParams(
//                array('idnaturaleza' => $params['idnaturaleza'], 'nivel' => 2),
//                0, 0
//            );
//        }
    }

    public function exportarExcel($params){
        $cond['idestructuracomun'] = $this->global->Estructura->idestructura;
//        print_r($params);print('........');
//        print_r(json_decode($params));die;
        $clasificacion=array('0'=>'Contrato proveedor', '1'=>'Contrato cliente', '2'=>'Contrato importación');
        $datos = $this->getContratos($params);
//        print_r($datos);die;
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Contratos');
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(90);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(70);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(40);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(13);
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(40);
        $objPHPExcel->getActiveSheet()->getColumnDimension('K')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('L')->setWidth(8);
        $objPHPExcel->getActiveSheet()->getColumnDimension('M')->setWidth(8);
        $objPHPExcel->getActiveSheet()->getColumnDimension('N')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('O')->setWidth(15);
        $objPHPExcel->getActiveSheet()->setCellValue('A1', 'Número contrato');
        $objPHPExcel->getActiveSheet()->setCellValue('B1', 'Número');
        $objPHPExcel->getActiveSheet()->setCellValue('C1', 'Nombre');
        $objPHPExcel->getActiveSheet()->setCellValue('D1', 'Cliente/Proveedor');
        $objPHPExcel->getActiveSheet()->setCellValue('E1', 'Área');
        $objPHPExcel->getActiveSheet()->setCellValue('F1', 'Sector');
        $objPHPExcel->getActiveSheet()->setCellValue('G1', 'Fecha registro');
        $objPHPExcel->getActiveSheet()->setCellValue('H1', 'Fecha firma');
        $objPHPExcel->getActiveSheet()->setCellValue('I1', 'Fecha fin');
        $objPHPExcel->getActiveSheet()->setCellValue('J1', 'Tipo de contrato');
        $objPHPExcel->getActiveSheet()->setCellValue('K1', 'Estado');
        $objPHPExcel->getActiveSheet()->setCellValue('L1', 'Vigente');
        $objPHPExcel->getActiveSheet()->setCellValue('M1', 'Marco');
        $objPHPExcel->getActiveSheet()->setCellValue('N1', 'Cliente');
        $objPHPExcel->getActiveSheet()->setCellValue('O1', 'Monto total');
        $cont=2;
        $orden=array('P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
        $valores=array();
        foreach ($datos['monedasentidad'] as $mon){
            $actual=array_shift($orden);
            $objPHPExcel->getActiveSheet()->getColumnDimension($actual)->setWidth(15);
            $objPHPExcel->getActiveSheet()->setCellValue($actual.'1', $mon['codigoiso']);
            $valores[$actual]='montomoneda_'.strtolower($mon['codigoiso']).'_'.$mon['idmoneda'];
        }
        foreach($datos['data'] as $con){
            $objPHPExcel->getActiveSheet()->setCellValue('A'.$cont, $con['numerocontrato']);
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$cont, $con['numero']);
            $objPHPExcel->getActiveSheet()->setCellValue('C'.$cont, $con['nombre']);
            $objPHPExcel->getActiveSheet()->setCellValue('D'.$cont, $con['clienteproveedor']);
            $objPHPExcel->getActiveSheet()->setCellValue('E'.$cont, $con['nombrearea']);
            $objPHPExcel->getActiveSheet()->setCellValue('F'.$cont, $con['sector']);
            $objPHPExcel->getActiveSheet()->setCellValue('G'.$cont, $con['fechainicio']);
            $objPHPExcel->getActiveSheet()->setCellValue('H'.$cont, $con['fechafirma']);
            $objPHPExcel->getActiveSheet()->setCellValue('I'.$cont, $con['fechafin']);
            $objPHPExcel->getActiveSheet()->setCellValue('J'.$cont, $con['tipocontrato']);
            $objPHPExcel->getActiveSheet()->setCellValue('K'.$cont, $con['estadoinicial']);
            $objPHPExcel->getActiveSheet()->setCellValue('L'.$cont, $con['vigente']==1?'Si':'No');
            $objPHPExcel->getActiveSheet()->setCellValue('M'.$cont, $con['contratomarco']==1?'Si':'No');
            $objPHPExcel->getActiveSheet()->setCellValue('N'.$cont, $clasificacion[$con['cliente']]);
            $objPHPExcel->getActiveSheet()->setCellValue('O'.$cont, $con['montototal']);
            foreach ($valores as $key=>$v){
                $objPHPExcel->getActiveSheet()->setCellValue($key.$cont, $con[$v]);
            }
            $cont=$cont+1;
        }
        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save;
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="Reporte contrato '.date('d/m/Y').'.xls" ');
        header('Cache-Control: max-age=0');

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));

        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        ini_restore("max_execution_time");
        ini_restore("max_input_time");
        ini_restore("memory_limit");
    }

    public function obtenerDatosContrato($idcontrato, $datosadicionales=false){
        $result= $this->doQuery(
            "SELECT c.*, ci.*,
            c.denominacionclienteproveedor AS clienteproveedor,
            c.denominaciontipocontrato AS tipocontrato,
            cp.nombre AS cliente, s.denominacion AS sector,
            ntp.nombre AS condicionpago,
            (CASE WHEN c.idresponsable NOTNULL THEN per.nombre||' '||per.papel||' '||per.sapel else '' END) as nombrepersona,
            COALESCE (desop.denominacion, des.denominacion) as nombrearea,
            ni.denominacion as linea, npo.denominacion as puertoorigen,
              npd.denominacion as puertodestino, nin.abreviatura as incoterms
            FROM mod_crmcontratacion.dat_contrato c 
            LEFT JOIN mod_crmcontratacion.dat_contratoimportacion ci ON (ci.idcontrato=c.idcontrato)
            LEFT JOIN mod_datosmaestros.nom_naturaleza ni ON (ni.idnaturaleza=ci.idlinea)                
            LEFT JOIN mod_crmcontratacion.nom_puertoorigen npo ON (npo.idpuertoorigen=ci.idpuertoorigen)                
            LEFT JOIN mod_crmcontratacion.nom_puertodestino npd ON (npd.idpuertodestino=ci.idpuertodestino)                
            LEFT JOIN mod_crmcontratacion.nom_incoterm nin ON (nin.idincoterm=ci.idincoterms)    
            
            LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp ON cp.idclientesproveedores=c.idclienteproveedor 
            LEFT JOIN mod_crmcontratacion.nom_sector s ON s.idsector=c.idsector
            LEFT JOIN mod_datosmaestros.nom_terminosdepago ntp ON c.idcondicionpago = ntp.idterminodepago
            LEFT JOIN mod_persona.dat_persona per ON (c.idresponsable = per.idpersona)
            LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarea = des.idestructura and des.idproyecto = 0)
            LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarea = desop.idestructuraop and desop.idproyecto = 0)
            INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (c.idarea = nfe.idfila)
            WHERE c.idcontrato=$idcontrato "
        )[0];
        $mediospagos=$this->doQuery(
            'SELECT nmp.nombre
                  FROM mod_crmcontratacion.dat_mediopagocontrato mp
                  LEFT JOIN mod_crmcontratacion.nom_mediodepago nmp ON nmp.idmediodepago=mp.idmediopago
                  WHERE mp.idcontrato=' .$idcontrato
        );
        $arraymp=array();
        foreach($mediospagos as $mp){
            $arraymp[]=$mp['nombre'];
        }
        $result['mediopago']=implode($arraymp, ',');
        $monedas=$this->doQuery(
            'SELECT m.codigoiso, mc.valor, m.idmoneda
                  FROM mod_crmcontratacion.dat_monedacontrato mc
                  INNER JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mc.idmoneda 
                  WHERE mc.idcontrato=' .$idcontrato
        );
        $result['monedas']=$monedas;
        foreach($monedas as $mon){
            $result['montomoneda_'.strtolower($mon['codigoiso']).'_'.$mon['idmoneda']]=$mon['valor'];
        }
        if($datosadicionales){
            $datos=$this->getDatosAdicionales(array('idcontrato'=>$idcontrato));
            $result=array_merge($result, $datos);
        }
        return $result;
    }

    public function obtenerParametrosClases($params){
        try{
            $idvariables=(array)json_decode($params['idsvariables']);
            $values=(array)json_decode($params['values']);
            $idelementos=json_decode($params['idelementos']);
            $result=array();
            foreach($idvariables as $i){
                $i=(array)$i;
                if(in_array($i['idvariable'], $idelementos))
                    $result[$i['idvariable']]=$this->runSql($i, $values);
            }
//            print_r($result);
            return array('success'=>true, 'data'=>$result);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

    public function runSql($elemento, $values){
        try {
            $conexion = Doctrine_Manager::getInstance()->getCurrentConnection();
            $result=$elemento['nombre'];

            $sqlaux=strtolower($elemento['sql']);
            $aux1=explode('from', $sqlaux);
            if(count($aux1)>1) {
                $aux2 = explode('select', $aux1[0]);
//                    print_r($aux2);die;
                if(count($aux2)>1){
                    $index=trim($aux2[1]);
                    if(isset($values[$index]) && $values[$index]!='')
                        $result=$values[$index];
                }
            }
            if($result==$elemento['nombre']){
                $sql=$elemento['sql'];
                foreach($values as $index=>$value){
                    if($value!='')
                        $sql=str_replace('{'.$index.'}', $value, $sql);
                }
                if($sql!=$elemento['sql'])
                    $result = $conexion->fetchOne($sql);
            }

            return $result;
        } catch (Exception $e) {
            throw $e;
        }

    }

    public function checkProblems(){
        try {
            $problemas = [];
            if (!$this->obtenerEstadoinicial())
                $problemas[] = 'No está configurado ningún estado como inicial. No podrán adicionarse nuevos contratos.';
            if (!$this->obtenerEstadoFirmado())
                $problemas[] = 'No está configurado ningún estado como firmado. No podrán firmarse contratos.';
            return $problemas;
        }catch (Exception $e) {
            return array('No ha podido comprobar el funcionamiento de gestión de contratos.');
        }
    }

    private function doQuery($query){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        return $conexionActual->fetchAll($query);
    }

    private function getDetailsContratoHtml($data, $datosAdicionales){
//        print_r($datosAdicionales);die;
        $arrayContextos = array('Proveedor', 'Cliente', 'Importación');
        $arrayVigencia = array('', 'Día(s)', 'Mes(es)', 'Año(s)');
//        <div style="span: 2">Contrato '.($data->contratomarco==1?'Marco ':'').''.arrayContextos[$data->cliente].'</div>

        $noEjecutado = 0;
        $montoTotal= 0;
        foreach ($datosAdicionales['hitos'] as $hito){
            if ($hito['inicial'] == 1)
                $noEjecutado += floatval($hito['montototal']);
            $montoTotal+= floatval($hito['montototal']);
        }
        $ejecutado = $montoTotal - $noEjecutado;
        $vigencia = $data['cumplimientoobligaciones'] == 1 ?
            'Al cumplimiento de las obligaciones' :
            $data['vigencia'].' '.$arrayVigencia[$data['unidadtiempo']].(
            $data['fechafin']!=null?' ('.$data['diasrestantesvigencia'].' días restantes)':' a partir de que se firme');
        $data['mediopago'] = implode(', ', $data['mediopago']);
        $data['puertoorigen'] = implode(', ', $data['puertoorigen']);
        $data['puertodestino'] = implode(', ', $data['puertodestino']);
        $data['incoterm'] = implode(', ', $data['incoterm']);
        foreach($data as &$value){
            if($value==null)$value='<i style="color: grey">No definido</i>';
        }
        $styleBorderedContainer = '
            padding: 16px 10px 6px; 
            border: 1px solid #99BCE8; 
            border-radius: 4px; 
            margin-bottom: 16px; 
            position: relative;
        ';
        $styleTitleContainer = '
            color: #99BCE8;
            position: absolute;
            top: -10px;
            left: 20px;
            font-size: 14px;
            padding: 2px 4px;
            background-color: white;
        ';
        $styleDataContainer = 'display: grid; grid-template-columns: 1fr 1fr';
        $styleLabel = 'color:#124872; font-size:14px; padding-right: 8px; font-weight: bold;';
        $styleAllRow = 'grid-column-start: 1; grid-column-end: 3; margin-bottom: 10px;display: inline-flex;';
        $styleMediumRow = 'margin-bottom: 10px; display: inline-flex;';
        $styleLabelTable = 'grid-column-start: 1;grid-column-end: 3; border: 1px solid #e3e3e3; padding: 6px 12px;';
        $styleHeader = 'border: 1px solid #e3e3e3; width: 60px; background-color: #e3e3e3;';
        $styleCell = 'border: 0.2px solid #d7d7d7; padding: 4px;';
        $html = '<div style="'.$styleBorderedContainer.'">
                    <div style="'.$styleDataContainer.'">
                        <div class="all-row" style="'.$styleAllRow.' color: #124872;font-weight: bolder;font-size: 20px;">Contrato '.($data['contratomarco']==1?'Marco':'').' '.$arrayContextos[$data['cliente']].'</div>
                        <div style="'.$styleAllRow.'"><div style="'.$styleLabel.'">Nombre:</div><span>'.$data['nombre'].'</span> </div>
                        <div style="'.$styleAllRow.'"><div style="'.$styleLabel.'">General:</div><span>'.$data['denominacioncontratomarco'].'</span> </div>
                        <div style="'.$styleAllRow.'"><div style="'.$styleLabel.'">Tipo de contrato:</div><span>'.$data['tipocontrato'].'</span> </div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Número:</div><span>'.$data['numero'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Número contrato:</div><span>'.$data['numerocontrato'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Fecha registro:</div><span>'.$data['fechainicio'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Creado por:</div><span>'.$data['nombreareacreado'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Fecha firma:</div><span>'.$data['fechafirma'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Vigencia:</div><span>'.$vigencia.'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Fecha fin:</div><span>'.$data['fechafin'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Área:</div><span>'.$data['nombrearea'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Responsable:</div><span>'.$data['nombrepersona'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Estado:</div><span>'.$data['estadoinicial'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Linea:</div><span>'.$data['linea'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Tipo de linea:</div><span>'.$data['tipolinea'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Puerto de origen:</div><span>'.$data['puertoorigen'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Puerto de destino:</div><span>'.$data['puertodestino'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Incoterms:</div><span>'.$data['incoterm'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Destino comercial:</div><span>'.$data['destinocomercial'].'</span></div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Cliente final:</div><span>'.$data['clientefinal'].'</span></div>
                    </div>
                </div>
                <span style="'.$styleTitleContainer.'">Cliente</span>
                <div style="'.$styleBorderedContainer.'">
                    <div style="'.$styleDataContainer.'">
                        <div style="'.$styleAllRow.'"><div style="'.$styleLabel.'">Nombre:</div><span>'.$data['clienteproveedor'].'</span> </div>
                        <div style="'.$styleAllRow.'"><div style="'.$styleLabel.'">Sector:</div><span>'.$data['sector'].'</span> </div>
                    </div>
                </div>
                <span style="'.$styleTitleContainer.'">Cobro</span>
                <div style="'.$styleBorderedContainer.'">
                    <div style="'.$styleDataContainer.'">
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Condición de pago:</div><span>'.$data['condicionespago'].'</span> </div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Medio de pago:</div><span>'.$data['mediopago'].'</span> </div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Ejecutado:</div><span>'.number_format((float)$ejecutado, 2).'</span> </div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">No ejecutado:</div><span>'.number_format((float)$noEjecutado, 2).'</span> </div>
                        <div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">Monto total:</div><span>'.number_format((float)$data['montototal'], 2).'</span> </div>';
        foreach ($data['monedas'] as $moneda){
            $html = $html.'<div style="'.$styleMediumRow.'"><div style="'.$styleLabel.'">'.$moneda['codigoiso'].':</div><span>'.number_format((float)$moneda['monto'], 2).'</span> </div>';
        }
        $html = $html.'<div style="'.$styleLabelTable.'" ><span style="'.$styleLabel.'">Obligaciones financieras</span></div>
                        <div style="'.$styleAllRow.'" >
                            <table cellspacing=0 style="width: 100%;">
                                <tr>
                                    <th style="'.$styleHeader.'">Número</th>
                                    <th style="border: 1px solid #e3e3e3; background-color: #e3e3e3;">Descripción</th>
                                    <th style="border: 1px solid #e3e3e3; background-color: #e3e3e3; width: 100px;">Fecha fin</th>
                                    <th style="border: 1px solid #e3e3e3; background-color: #e3e3e3; width: 120px;">Monto total</th>
                                    <th style="border: 1px solid #e3e3e3; background-color: #e3e3e3; width: 150px;">Montos</th>
                                    <th style="border: 1px solid #e3e3e3; background-color: #e3e3e3;">Área</th>
                                    <th style="border: 1px solid #e3e3e3; background-color: #e3e3e3; width: 130px;">Estado</th>
                                </tr>';
        foreach ($datosAdicionales['hitos'] as $hito){
            $html = $html.'<tr>
                    <td style="'.$styleCell.'">'.$hito['numero'].'</td>
                    <td style="'.$styleCell.'">'.$hito['descripcion'].'</td>
                    <td style="'.$styleCell.'">'.$hito['fechafin'].'</td>
                    <td style="'.$styleCell.'">'.number_format((float)$hito['montototal'], 2).'</td>
                    <td style="'.$styleCell.'"></td>
                    <td style="'.$styleCell.'">'.$hito['nombrearea'].'</td>
                    <td style="'.$styleCell.'">'.$hito['nombreestado'].'</td>
                </tr>';
        }
        $html = $html.' </table>
                        </div>
                        <div style="'.$styleLabelTable.'" ><span style="'.$styleLabel.'">Productos / Servicios</span></div>
                        <div style="'.$styleAllRow.'" >
                            <table cellspacing=0 style="width: 100%;">
                                <tr>
                                    <th style="'.$styleHeader.'">Código</th>
                                    <th style="border: 1px solid #e3e3e3; background-color: #e3e3e3;">Descripción</th>
                                    <th style="border: 1px solid #e3e3e3; background-color: #e3e3e3; width: 100px;">Cantidad</th>
                                    <th style="border: 1px solid #e3e3e3; background-color: #e3e3e3; width: 120px;">Precio</th>
                                    <th style="border: 1px solid #e3e3e3; background-color: #e3e3e3; width: 150px;">Montos</th>
                                </tr>';
        foreach ($datosAdicionales['productos'] as $producto){
            $html = $html.'<tr>
                    <td style="'.$styleCell.'">'.$producto['codigo'].'</td>
                    <td style="'.$styleCell.'">'.$producto['denominacion'].'</td>
                    <td style="'.$styleCell.'">'.$producto['cantidad'].'</td>
                    <td style="'.$styleCell.'">'.number_format((float)$producto['precio'], 2).'</td>
                    <td style="'.$styleCell.'">'.number_format((float)$producto['precio'], 2).'</td>
                </tr>';
        }
        $html = $html.'  </table>
                        </div>
                    </div>
                </div>
                <span style="'.$styleTitleContainer.'">Objeto</span>
                <div style="'.$styleBorderedContainer.'">
                    <div style="'.$styleDataContainer.'">
                        <div style="'.$styleAllRow.'">'.$data['objeto'].'</div>
                    </div>
                </div>
                <span style="'.$styleTitleContainer.'">Descripción</span>
                <div style="'.$styleBorderedContainer.'">
                    <div style="'.$styleDataContainer.'">
                        <div style="'.$styleAllRow.'">'.$data['descripcion'].'</div>
                    </div>
                </div>';
        return $html;
    }

    public function exportarDetalles($params){
//        print_r('FIN');die;
        $contrato = $this->getContratos(array('filter'=>array(array('field'=>'idcontrato',
            'data'=>array('type'=>'int', 'value'=>$params['idcontrato'])))));
        if(!empty($contrato['data'])){
            $mpdf = new mPDF();
            $datosAdicionales = $this->getDatosAdicionales(array('idcontrato'=>$params['idcontrato']));
//            header("Cache-Control: no-cache, must-revalidate");
//            header("Content-type: application/octect-stream");
//            header("Content-type: application/pdf");
//            return $this->getDetailsContratoHtml($contrato['data'][0], $datosAdicionales);
            $mpdf->WriteHTML($this->getDetailsContratoHtml($contrato['data'][0], $datosAdicionales));
            $mpdf->Output("Detalles del contrato {$contrato['numero']}.pdf", 'D');

        }
        return false;
    }

    public function guardarDocumentos($params){
        $contrato = Doctrine::getTable('DatContrato')->find($params['idcontrato']);
        if ($contrato && !$contrato->idespaciotrabajo) {
            $contrato->idespaciotrabajo = $this->crearEspacioContrato(
                $contrato->toArray()
            );
            $contrato->save();
        }
        $this->salvarDocumentos(
            $contrato->idespaciotrabajo, $params,
            $contrato->idcontrato
        );
        return array('success'=>true);

    }

    public function getHitosFacturados($params){
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        $facturas = $conexionActual->fetchAll(
            "SELECT * FROM mod_logfacturacion.dat_elementosfactura ef WHERE ef.idhito IN (".
            implode(',',json_decode($params['idhitos'])).")"
        );
        return array('success' => true, 'data' => $facturas);
    }

    public function getFacturasContratos($params){
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        $facturas = $conexionActual->fetchAll(
            "SELECT df.* FROM mod_logfacturacion.dat_facturacontrato fc 
            INNER JOIN mod_logfacturacion.dat_docfactura df ON fc.idfactura=df.idfactura
            WHERE fc.idcontrato=".$params['idcontrato']
        );
        return array('success' => true, 'data' => $facturas);
    }
}
