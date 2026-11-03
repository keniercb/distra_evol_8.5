<?php

/**
 * ConfContratacionModel
 *
 * Clase encargada de guardar las configuraciones del modulo contratacion
 *
 * @package        ERP-PCRM
 * @category       Model
 * @author         Ing. Alberto Mesa martinez <amartinez@xetid.cu>
 * @copyright (c)  2016, XETID
 * @version        1.0
 */
class ConfContratacionModel extends ZendExt_Model
{
    private $_comitetransition;
    private $_comitedocumento;
    private $_contratodocumento;
    private $_idestructura;
    private $_gestordocumental;
    private $_ofertanegocio;
    private $_seguridad;
    private $_datcompartimentacion;
    private $_persona;
    private $_datosmaestros;
    private $_reclamaciones;
    private $_penalizaciones;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_comitetransition = new DatComiteTransicion();
        $this->_comitedocumento = new DatComiteGestorDocumental();
        $this->_contratodocumento = new DatContratoGestorDocumental();
        $this->_contratoimportaciondocumento = new DatContratoImportacionGestorDocumental();
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_idestructura = $this->global->Estructura->idestructura;
        $this->_ofertanegocio = new ConfOfertaNegocio();
        $this->_solicitudnegocio = new ConfSolicitudNegocio();
        $this->_reclamaciones = new ConfReclamaciones();
        $this->_penalizaciones = new ConfPenalizaciones();
        $this->_clientesproveedores = new ConfClientesproveedores();
        $this->_seguridad = new SeguridadComunicationInterface();
        $this->_datcompartimentacion = new DatCompartimentacion();
        $this->_persona = new PersonaComunicationInterface();
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->_contratogeneral = new ConfContratoGeneral();
    }

    public function loadConfComite($idcomite)
    {
        try {
            $response = [];
            $response['transitions'] = $this->loadtransitions($idcomite);
            $response['committeedoc'] = $this->loadCommitteedoc();
            return $response;
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function loadtransitions($idcomite)
    {
        try {
            $params = array('idestructuracomun' => $this->_idestructura);
            if ($idcomite) {
                $params['idcomite'] = $idcomite;
            }
            return $this->_comitetransition->loadByCondition($params);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function loadCommitteedoc()
    {
        try {
            return $this->_comitedocumento->loadByCondition(array('idestructuracomun' => $this->_idestructura));
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function saveConfComite($data)
    {
        try {
            if (isset($data['transitions'])) {
                $this->saveTransitions($data);
            }
            if (isset($data['committeedoc'])) {
                $this->saveCommitteedoc($data);
            }

            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function saveTransitions($data)
    {
        try {
            $transitions = json_decode($data['transitions']);
            $result = $this->_comitetransition->deleteByCondition(array('idestructuracomun' => $this->_idestructura));
            if (is_array($result)) {
                return $result;
            }
            $collection = new Doctrine_Collection('DatComiteTransicion');
            foreach ($transitions as $transition) {
                if (Doctrine::getTable('NomTransicion')->find($transition->id)) {
                    $instance = new DatComiteTransicion();
                    $instance->idtransicion = $transition->id;
                    $instance->idcomite = $transition->idcomite ? $transition->idcomite : null;
                    $instance->idestructuracomun = $this->_idestructura;
                    $instance->reglas = json_encode($transition->reglas);
                    $collection->add($instance);
                }
            }
            if (count($collection)) {
                $collection->save();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function saveCommitteedoc($data)
    {
        $committeedoc = json_decode($data['committeedoc']);
        $instance = new DatComiteGestorDocumental();
        if ($committeedoc->idcomitegestordocumental) {
            $instance = Doctrine::getTable('DatComiteGestorDocumental')->find($committeedoc->idcomitegestordocumental);
        }
        if ($committeedoc->espaciotrabajo) {
            $instance->denominacion = $committeedoc->espaciotrabajo;
        }
        if ($committeedoc->idespaciotrabajo) {
            $instance->idespaciotrabajo = $committeedoc->idespaciotrabajo;
        }
        if ($committeedoc->organizacion) {
            $instance->organizacion = $committeedoc->organizacion;
        }
        $instance->activo = $committeedoc->activo == 'true' ? 1 : 0;
        $instance->idestructuracomun = $this->_idestructura;
        $instance->save();
    }

    public function loadConfContrato()
    {
        try {
            $response = [];
            $response['contractdoc'] = $this->loadContractdoc();
            return $response;
        } catch (Doctrine_Exception $e) {
            throw $e;
//            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function loadConfContratoImportacion()
    {
        try {
            $response = [];
            $response['contractdoc'] = $this->_contratoimportaciondocumento->loadByCondition(
                array('idestructuracomun' => $this->_idestructura));
            return $response;
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function loadContractdoc()
    {
        try {
            $model=new DatContratoGestorDocumental();
            $result=$model->loadByCondition(array('idestructuracomun' => $this->_idestructura));
            return $result;
//            return $this->_contratodocumento->loadByCondition(array('idestructuracomun' => $this->_idestructura));
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function loadConfContratoPlanif()
    {
        try {
            $this->_query = Doctrine_Query::create();
            $this->_query->select('cp.*')
                ->from('DatContratoPlanificacion cp')
                ->where('cp.idestructuracomun=' . $this->_idestructura);
            $this->_result = $this->_query->execute();
            return $this->_result->toArray();
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function saveConfContrato($data)
    {
        try {
            if (isset($data['contractdoc'])) {
                $this->saveContractdoc($data);
            }

            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'success' => false);
        }
    }

    public function saveConfContratoImportacion($data)
    {
        try {
            if (isset($data['contractdoc'])) {
                $this->saveContractImportaciondoc($data);
            }

            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'success' => false);
        }
    }

    public function saveContractdoc($data)
    {
        try {
            $contractdoc = json_decode($data['contractdoc']);
            $instance = new DatContratoGestorDocumental();
            if ($contractdoc->idcontratogestordocumental) {
                $instance = Doctrine::getTable('DatContratoGestorDocumental')->find(
                    $contractdoc->idcontratogestordocumental
                );
            }
            if ($contractdoc->espaciotrabajo) {
                $instance->denominacion = $contractdoc->espaciotrabajo;
            }
            if ($contractdoc->idespaciotrabajo) {
                $instance->idespaciotrabajo = $contractdoc->idespaciotrabajo;
            }
            if ($contractdoc->organizacion) {
                $instance->organizacion = $contractdoc->organizacion;
            }
            $instance->activo = $contractdoc->activo == 'true' ? 1 : 0;
            $instance->idestructuracomun = $this->_idestructura;
            $instance->save();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function saveContractImportaciondoc($data)
    {
        try {
            $contractdoc = json_decode($data['contractdoc']);
            $instance = new DatContratoImportacionGestorDocumental();
            if ($contractdoc->idcontratoimportaciongestordocumental) {
                $instance = Doctrine::getTable('DatContratoImportacionGestorDocumental')->find(
                    $contractdoc->idcontratoimportaciongestordocumental
                );
            }
            if ($contractdoc->espaciotrabajo) {
                $instance->denominacion = $contractdoc->espaciotrabajo;
            }
            if ($contractdoc->idespaciotrabajo) {
                $instance->idespaciotrabajo = $contractdoc->idespaciotrabajo;
            }
//            if ($contractdoc->organizacion) {
//                $instance->organizacion = $contractdoc->organizacion;
//            }
            $instance->activo = $contractdoc->activo == 'true' ? 1 : 0;
            $instance->idestructuracomun = $this->_idestructura;
            $instance->save();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function saveConfPlanif($data)
    {
        try {
            $datos = json_decode($data['contractdoc']);
            $instance = new DatContratoPlanificacion();
            if ($datos->idcontratoplanificacion) {
                $instance = Doctrine::getTable('DatContratoPlanificacion')->find(
                    $datos->idcontratoplanificacion
                );
            }
            $instance->activo = $datos->activo == 'true' ? 1 : 0;
            $instance->idestructuracomun = $this->_idestructura;
            $instance->save();
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'success' => false);
        }
    }

    public function getWorkSpace($data)
    {
        $espacios=$this->_gestordocumental->getWorkSpace($data['node']);
        $result=array();
        foreach ($espacios->objectList as $value){
            if($value->properties['cmis:baseTypeId']=='cmis:folder'){
                $idespacio=explode('/',$value->properties['cmis:objectId']);
                $result[]=array(
                    'text'=>$value->properties['cmis:name'],
                    'id'=>$idespacio[count($idespacio)-1]
                );
            }
        }
        return $result;
    }

    public function loadConfOfertaNegocio()
    {
        $conf = $this->_ofertanegocio->getConfig();
        $solicitudEstados = (new SolicitudNegocioEstadoDService())->getConfiguracionEstados();
        $solicitudEstadosOferta = (new SolicitudNegocioEstadoDService())->getConfiguracionEstados('solicitudofertaimportacion');

        return array(
            'config' => $conf,
            'estados' => $solicitudEstados,
            'estadosoferta' => $solicitudEstadosOferta
        );
    }

    public function saveConfOfertaNegocio($params)
    {
        try {
            $ofertparam = json_decode($params['ofertanegocio'], true);
            $this->_ofertanegocio->updateConfig(
                $ofertparam['idestadooferta'],
                $ofertparam['idestado'],
                $ofertparam['idespaciotrabajo'],
                $ofertparam['espaciotrabajo'],
                $ofertparam['activo']
            );

            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getMessage(), 'success' => false);
        }
    }

    public function saveConfClientesproveedores($params)
    {
        try {
            $clientesproveedoresparam = json_decode($params['clientesproveedores'], true);
            $this->_clientesproveedores->updateConfig($clientesproveedoresparam);

            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getMessage(), 'success' => false);
        }
    }

    public function loadConfClientesproveedores()
    {
        $conf = $this->_clientesproveedores->getConfig();
        return array('config' => $conf);
    }
    public function loadConfSolicitudNegocio()
    {
        $conf = $this->_solicitudnegocio->getConfig();
        $solicitudEstados = (new SolicitudNegocioEstadoDService())->getConfiguracionEstados('solicituddemanda');
        return array(
            'config' => $conf,
            'estados' => $solicitudEstados
        );
    }
    public function loadconfreclamaciones()
    {
        $conf = $this->_reclamaciones->getConfig();
        $reclamacionesEstados = (new ReclamacionesEstadoDService())->getConfiguracionEstados();
        return array(
            'config' => $conf,
            'estados' => $reclamacionesEstados
        );
    }

    public function loadConfPenalizaciones()
    {
        $conf = $this->_penalizaciones->getConfig();
        $penalizacionesEstados = (new PenalizacionEstadoDService())->getConfiguracionEstados();
        return array(
            'config' => $conf,
            'estados' => $penalizacionesEstados
        );
    }

    public function saveConfSolicitudNegocio($params)
    {
        try {
            $solicitudparam = json_decode($params['solicitudnegocio'], true);

            $this->_solicitudnegocio->updateConfig(
                $solicitudparam['idespaciotrabajo'],
                $solicitudparam['espaciotrabajo'],
                $solicitudparam['activo'],
                $solicitudparam['idestado'],
                $solicitudparam['repositorioclientes']
            );
			

            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'success' => false, 'message' => $e->getMessage());
        }
    }
    public function saveConfReclamacion($params)
    {
        try {
            $reclamacionparam = json_decode($params['reclamaciones'], true);

            $this->_reclamaciones->updateConfig(
                $reclamacionparam['idespaciotrabajo'],
                $reclamacionparam['espaciotrabajo'],
                $reclamacionparam['activo'],
                $reclamacionparam['idestado']
            );

            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'success' => false);
        }
    }

    public function saveConfPenalizacion($params)
    {
        try {
            $penalizacionparam = json_decode($params['penalizaciones'], true);

            $this->_penalizaciones->updateConfig(
                $penalizacionparam['idespaciotrabajo'],
                $penalizacionparam['espaciotrabajo'],
                $penalizacionparam['activo'],
                $penalizacionparam['idestado']
            );

            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'success' => false);
        }
    }

    public function loadConfCompartimentacion($params)
    {
        try {
            return $this->_datcompartimentacion->getCompartimentacion($params);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function saveConfCompartimentacion($params)
    {
        try {
            $id = $params['idcompartimentacion'];
            $instance = !$id ? new DatCompartimentacion() : Doctrine::getTable('DatCompartimentacion')->find($id);
            $instance->idrol = $params['idrol'];
            $instance->definicion = $params['definicion'];
            $instance->modulo = $params['modelName'];
            $instance->idestructuracomun = $this->_idestructura;
            $instance->save();
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function deleteConfCompartimentacion($params)
    {
        try {
            $ids = json_decode($params['ids']);
            $collection = new Doctrine_Collection('DatCompartimentacion');
            foreach ($ids as $id) {
                $instance = Doctrine::getTable('DatCompartimentacion')->find($id);
                if ($instance) {
                    $collection->add($instance);
                }
            }
            $collection->delete();
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function getRoles()
    {
        return $this->_seguridad->getRoles();
    }

    public function getFiltros($params)
    {
        $entity = Doctrine::getTable($params['modelName']);
        $data = $entity->getColumns();
        $data = $this->setConfiguration($data);
        return array('data' => $data);
    }

    public function loadFiltersCompartimentacion($params)
    {
        try {
            return $this->refactFilters($this->_datcompartimentacion->getCompartimentacion($params), $params['modelName']);
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function refactFilters($params, $modelName)
    {
        $entity = Doctrine::getTable($modelName);
        $columns = $entity->getColumns();
        $data = $params['data'];
        $fields = array();
        $result = array();
        $cont = 0;
        foreach ($data as $compartimentacion) {
            $filtros = json_decode($compartimentacion['definicion']);
            foreach ($filtros as $filtro) {
                if (isset($fields[$filtro->field][$filtro->idcomparison])) {
                    $temp = $result[$fields[$filtro->field][$filtro->idcomparison]]['data']['value'];
                    if (!is_array($temp)) {
                        $temp = array($temp);
                    }
                    $temp[] = $filtro->idvalue;
                    $result[$fields[$filtro->field][$filtro->idcomparison]]['data']['value'] = $temp;
                } else {
                    $fields[$filtro->field][$filtro->idcomparison] = $cont;
                    $result[$cont] = array('field' => $filtro->field,
                        'data' => array(
                            'type' => $columns[$filtro->field]['type'],
                            'comparison' => $filtro->idcomparison,
                            'value' => $filtro->idvalue
                        )
                    );
                    $cont++;
                }


            }
        }
        return $result;
    }

    private function setConfiguration($data)
    {
        $result = array();
        $isString = array('character varying');
        $isNumeric = array('numeric');
        $isDate = array('date');
        $this->nomConfig = array('idtipocontrato'     => $this->getConfigTipoContrato(),
                                 'idclienteproveedor' => $this->getConfigClienteProveedor(),
                                 'idsector'           => $this->getConfigSector(),
                                 'idestado'           => $this->getConfigEstado(),
                                 'idmediopago'        => $this->getConfigMedioPago(),
                                 'unidadtiempo'       => $this->getConfigUnidadTiempo(),
                                 'idresponsable'      => $this->getConfigPersona(),
                                 'idcondicionpago'    => $this->getConfigCondicionPago(),
                                 'idarea'             => $this->getConfigArea(),
                                 'dominio'            => $this->getConfigDominio()
        );
        $data = array_merge(array('dominio' => array('type' => 'numeric')), $data);
        foreach ($data as $key => $config) {
            $newconfig = array('name' => $key, 'config' => $config);
            if (in_array($config['type'], $isNumeric)) {
                $newconfig['config']['type'] = 'numeric';
                $newconfig = $this->setCondicionesNumeric($newconfig);
                $newconfig = $this->setValoresNumeric($newconfig);
            }

            if (in_array($config['type'], $isString)) {
                $newconfig['type'] = 'string';
                $newconfig = $this->setCondicionesString($newconfig);
            }

            if (in_array($config['type'], $isDate)) {
                $newconfig['type'] = 'date';
                $newconfig = $this->setCondicionesDate($newconfig);
            }

            $result[] = $newconfig;
        }
        return $result;
    }

    private function setCondicionesNumeric($config)
    {
        $comparison = array(
            array('id' => 'eq', 'name' => '='),
            array('id' => 'di', 'name' => '<>')
        );

        if (!$this->nomConfig[$config['name']]) {
            $comparison = array_merge(
                $comparison, array(
                    array('id' => 'lt', 'name' => '<'),
                    array('id' => 'gt', 'name' => '>')
                )
            );
        }

        $config['config']['comparison'] = $comparison;

        return $config;
    }

    private function setValoresNumeric($config)
    {
        if ($this->nomConfig[$config['name']]) {
            $config['config']['source'] = $this->nomConfig[$config['name']];
        }

        return $config;
    }

    private function setCondicionesString($config)
    {
        $comparison = array(
            array('id' => 'eq', 'name' => '='),
            array('id' => '%x%', 'name' => 'ILIKE %x%')
        );

        $config['config']['comparison'] = $comparison;

        return $config;
    }

    private function setCondicionesDate($config)
    {
        $comparison = array(
            array('id' => 'eq', 'name' => '='),
            array('id' => 'lt', 'name' => '<'),
            array('id' => 'gt', 'name' => '>'),
            array('id' => 'in', 'name' => 'ISNULL'),
            array('id' => 'nn', 'name' => 'NOTNULL')
        );

        $config['config']['comparison'] = $comparison;

        return $config;
    }

    public function getValores($params)
    {
        $data = array();
        if ($params['method']) {
            $data = $this->getValoresMetodo($params);
        }

        if ($params['model']) {
            $data = $this->getDataByModel($params);
        }
        return $data;
    }

    private function getValoresMetodo($params)
    {
        $method = $params['method'];
        if (!method_exists($this, $method)) {
            return array('aqui');
        }
        return $this->$method($params);
    }

    private function getConfigTipoContrato()
    {
        return array('model'     => 'DatTipoContrato',
                     'namefield' => 'denominacion',
                     'idfield'   => 'idtipocontrato'
        );
    }

    private function getConfigClienteProveedor()
    {
        return array('method'     => 'getClientesProveedores',
                     'namefield'  => 'nombre',
                     'queryfield' => 'filtronomb',
                     'idfield'    => 'idclientesproveedores'
        );
    }

    private function getConfigSector()
    {
        return array('model'     => 'NomSector',
                     'namefield' => 'denominacion',
                     'idfield'   => 'idsector'
        );
    }

    private function getConfigEstado()
    {
        return array('model'     => 'NomEstado',
                     'namefield' => 'nombre',
                     'idfield'   => 'idestado'
        );
    }

    private function getConfigMedioPago()
    {
        return array('model'     => 'NomMedioPago',
                     'namefield' => 'nombre',
                     'idfield'   => 'idmediodepago'
        );
    }

    private function getConfigUnidadTiempo()
    {
        return array('data' => array(array('id' => 1, 'name' => 'Dia(s)'), array('id' => 2, 'name' => 'Mes(es)'),
                                     array('id' => 3, 'name' => 'Año(s)')));
    }

    private function getConfigPersona()
    {
        return array('method'    => 'getPersonas',
                     'namefield' => 'nombreapellidos',
                     'idfield'   => 'idpersona'
        );
    }

    private function getConfigCondicionPago()
    {
        return array('method'     => 'getCondicionesPago',
                     'namefield'  => 'nombre',
                     'queryfield' => 'denominacion',
                     'idfield'    => 'idterminodepago'
        );
    }

    private function getConfigArea()
    {
        return array('method'    => 'getAreasInternas',
                     'namefield' => '',
                     'idfield'   => ''
        );
    }

    private function getConfigDominio()
    {
        return array('data' => array(array('id' => 'current', 'name' => 'Actual'),
                                     array('id' => 'all', 'name' => 'Todos')));
    }

    private function getDataByModel($params)
    {
        $model = Doctrine::getTable($params['model']);
        $columsId = $model->getIdentifierColumnNames();
        $strIdentifiesColumns = implode(', a.', $columsId);
        $columnsNames = $model->getColumnNames();
        $columns = $model->getColumns();
        $strIColumns = implode(', a.', $columnsNames);
        $filter = $this->getFilter($params, $columns);

        $query = new Doctrine_Query();
        $query->select('a.' . $strIColumns)->from($params['model'] . ' a ')->orderby($strIdentifiesColumns . ' ASC')
            ->offset($params['start'])->limit($params['limit']);
        if (count($filter)) {
            $query->where(implode('AND', $filter));
        }
        $count = $query->count();
        $data = $query->execute()->toArray();
        return array('data' => $data, 'count' => $count);
    }

    private function getFilter($params, $columns)
    {
        $filter = array();
        foreach ($params as $key => $value) {
            if ($columns[$key] && $columns[$key]['type'] == "character varying") {
                $filter[] = $key . " ILIKE '%" . $value . "%'";
            }
        }
        return $filter;
    }

    private function getClientesProveedores($params)
    {
        $result = $this->_datosmaestros->getClientesProveedores($params, $params['start'], $params['limit']);
        return array('data' => $result['datos'], 'count' => $result['cantidad']);
    }

    private function getPersonas($params)
    {
        $result = $this->_persona->getListadoPersonas($params);
        return array('data' => $result->data, 'count' => $result->quantity);
    }

    private function getCondicionesPago($params)
    {
        $result = $this->_datosmaestros->getCodicionesPago($params);
        return $result;
    }

    private function getAreasInternas($params)
    {
        return array();
    }

    public function getConfComite($params){
        $params['idestructuracomun']=$this->global->Estructura->idestructura;
        $result=ConfComiteGeneral::getDatos($params);
        return $result;
    }

    public function guardarComite($params){
        $params['idestructuracomun']=$this->global->Estructura->idestructura;
        $result=ConfComiteGeneral::guardarComite($params);
        return $result;
    }

    public function getConfComitePorId($params){
        $result=ConfComiteGeneral::getDatosPrId($params['idcomitegeneral']);
        return $result;
    }

    public function eliminarComite($params){
        $result=ConfComiteGeneral::eliminarComites(json_decode($params['idcomitegeneral']));
        return $result;
    }

    public function loadConfContratoContabilidad()
    {
        try {
            $this->_query = Doctrine_Query::create();
            $this->_query->select('cc.*')
                ->from('DatContratoContabilidad cc')
                ->where('cc.idestructuracomun=' . $this->_idestructura);
            $this->_result = $this->_query->execute();
            return $this->_result->toArray();
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function saveConfContabilidad($data)
    {
        try {
            $datos = json_decode($data['contractdoc']);
            $instance = new DatContratoContabilidad();
            if ($datos->idcontratocontabilidad) {
                $instance = Doctrine::getTable('DatContratoContabilidad')->find(
                    $datos->idcontratocontabilidad
                );
            }
            $instance->activo = $datos->activo == 'true' ? 1 : 0;
            $instance->idestructuracomun = $this->_idestructura;
            $instance->save();
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'success' => false);
        }
    }

    public function loadConfSolicitudPago()
    {
        try {
            $this->_query = Doctrine_Query::create();
            $this->_query->select('spgd.*')
                ->from('DatSolicitudPagoGestorDocumental spgd')
                ->where('spgd.idestructuracomun=' . $this->_idestructura);
            $this->_result = $this->_query->execute();
            return $this->_result->toArray();
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }
    public function loadConfSeguimiento()
    {
        try {
            $this->_query = Doctrine_Query::create();
            $this->_query->select('sgd.*')
                ->from('DatSeguimientoGestorDocumental sgd')
                ->where('sgd.idestructuracomun=' . $this->_idestructura);
            $this->_result = $this->_query->execute();
            return $this->_result->toArray();
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function saveConfSolicitudPago($data)
    {
        try {
            $datos = json_decode($data['contractdoc']);
            $instance = new DatSolicitudPagoGestorDocumental();
            if ($datos->idsolicitudpagogestordocumental) {
                $instance = Doctrine::getTable('DatSolicitudPagoGestorDocumental')->find(
                    $datos->idsolicitudpagogestordocumental
                );
            }
            $instance->activo = $datos->activo == 'true' ? 1 : 0;
            $instance->idestructuracomun = $this->_idestructura;
            if ($datos->idespaciotrabajo) {
                $instance->idespaciotrabajo = $datos->idespaciotrabajo;
            }
            if ($datos->espaciotrabajo) {
                $instance->denominacion = $datos->espaciotrabajo;
            }
            $instance->save();
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'success' => false);
        }
    }
    public function saveConfSeguimiento($data)
    {
        try {
            $datos = json_decode($data['contractdoc']);
            $instance = new DatSeguimientoGestorDocumental();
            if ($datos->idseguimientogestordocumental) {
                $instance = Doctrine::getTable('DatSeguimientoGestorDocumental')->find(
                    $datos->idseguimientogestordocumental
                );
            }
            $instance->activo = $datos->activo == 'true' ? 1 : 0;
            $instance->idestructuracomun = $this->_idestructura;
            if ($datos->idespaciotrabajo) {
                $instance->idespaciotrabajo = $datos->idespaciotrabajo;
            }
            if ($datos->espaciotrabajo) {
                $instance->denominacion = $datos->espaciotrabajo;
            }
            $instance->save();
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'success' => false);
        }
    }

    public function loadConfContratoGeneral(){
        try {

            $conf = $this->_contratogeneral->getConfig();
            $ofertasEstados = (new OfertaNegocioEstadoDService())->getConfiguracionEstados();
            return array(
                'config'  => $conf,
                'estados' => $ofertasEstados,
            );

        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function saveConfContratoGeneral($data){
        try {
            $datos = json_decode($data['confcontrato']);
//            print_r($datos->activopersona);die;
            $instance = new ConfContratoGeneral();
            if ($datos->idcontratogeneral) {
                $instance = Doctrine::getTable('ConfContratoGeneral')->find(
                    $datos->idcontratogeneral
                );
            }
            $instance->activopersona = $datos->activopersona == 'true' ? 1 : 0;        
            $instance->idestadoofertalisto = $datos->idestadooferta?$datos->idestadooferta:null;
            $instance->idestructuracomun = $this->_idestructura;
            $instance->confgcontrato = json_encode($datos->confgcontrato);
            $instance->confgmail = json_encode($datos->confgmail);
            $instance->confgjasper = $datos->datasource?$datos->datasource:null;
            $instance->save();
            return array('code' => 1, 'success' => true);
        }catch (Exception $e) {
            return array('code' => $e->getCode(), 'mensaje'=> $e->getMessage(),'success' => false);
        }
    }

    public function loadConfProforma($params){
        try {
            $this->_query = Doctrine_Query::create();
            $this->_query->select('cp.*')
                ->from('ConfProforma cp');
//                ->where('cp.idestructuracomun=' . $this->_idestructura);
            $this->_result = $this->_query->execute();
            return $this->_result->toArray();
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function saveConfProforma($datos){
        try {
            //print_r($datos);die;
            $datos = json_decode($datos['confproforma']);
            $valores = new ConfProforma();
            if ($datos->idconfproforma) {
                $valores = Doctrine::getTable('ConfProforma')->find(
                    $datos->idconfproforma
                );
            }
            $valores->activo = $datos->activo == 'true' ? 1 : 0;
//            $instance->idestructuracomun = $this->_idestructura;
            $valores->idespaciotrabajo = $datos->idespaciotrabajo?$datos->idespaciotrabajo:null;
            $valores->espaciotrabajo = $datos->espaciotrabajo?$datos->espaciotrabajo:null;
            //print_r($valores);die;
            $valores->save();
            return array('code' => 1, 'success' => true);
        }catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function getVariables($params){
        $model=new ConfVariable();
        return $model->getVariables($params);
    }

    public function guardarVariable($params){
        try {
            $model = new ConfVariable();
            return $model->guardarVariable($params);
        }catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function eliminarVariable($params){
        try{
            $model=new ConfVariable();
            $result = $model->eliminarVariable($params);
            return array('success' => $result ? true : false,'msg' => $result ? 'OK' : 'Error' );
        }catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }


    public function getIndicadoresPliego1(){
        $ruta=realpath(dirname(__FILE__)) . '/'.'../../../comun/recursos/evaluadores_pliego.ini';
//        print($ruta);die;
        if (file_exists($ruta)) {
            $config = parse_ini_file($ruta, true);
            $metadata=null;
            $result = array();
            $caracteristicas=$config['caracteristicas'];
            $variables=$config['variables'];
            foreach ($config as $dataIndex => $value) {
                if($dataIndex!='caracteristicas' && $dataIndex!='variables'){
                    $vars=explode(',', $value['variables']);
                    $config=array();
                    foreach ($vars as $var){
                        $config[trim($var)]=json_decode($variables[trim($var)]);
                    }
                    $result[] = array(
                        'text'    => $value['text'],
                        'dataIndex'   => $dataIndex,
                        'variables' => $value['variables'],
                        'config' =>$config
                    );
                }

            }
//            foreach ($config['indicadores'] as $dataIndex => $value) {
//                $result[] = array(
//                    'text'    => $value,
//                    'dataIndex'   => $dataIndex,
//                );
//            }
            return array('success'=> true, 'data'=>$result, 'metaData'=>array('columnas'=>$caracteristicas, 'variables'=>$variables));
        } else {
            return (array('success'   => false,
                'msg' => 'El archivo de configuraci&oacute;n no existe.'));
        }
    }

    public function getIndicadoresPliego($params){
        try{
            $result=ConfIndicadorPliego::getIndicadoresPliego($params);
            $variables=$this->getVariablesIndex();
            foreach($result as &$i){
                $configgrafica=(array)json_decode($i['configgrafica']);
                $configgrid=(array)json_decode($i['configgrid']);
                $i['tipografica']=$configgrafica['tipografica'];
                $colmnas=array();
                foreach($configgrid as $column){
                    $colmnas[]=$column['nombrecolumna'];
                }
                $i['columnasgrid']=implode(',', $colmnas);
                if($i['descripcion']=='' && $variables[$i['atributo']] && $variables[$i['atributo']]['descripcion'])
                    $i['descripcion']=$variables[$i['atributo']]['descripcion'];
            }
            return array('success'=>true, 'data'=>$result, 'variables'=>$variables);
        }catch(Exception $e){
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }

    }

    public function getVariablesPliego(){
        $ruta=realpath(dirname(__FILE__)) . '/'.'../../../comun/recursos/evaluadores_pliego.ini';
        $result=array();
        if (file_exists($ruta)) {
            $config = parse_ini_file($ruta, true);
            foreach ($config['variables'] as $dataIndex => $value){
                $data=(array)json_decode($value);
                $data['id']=$dataIndex;
                $data['nombrecolumna']=($data['nombrecolumna']?:$data['nombre']);
                $result[]=$data;
            }
            return array('success'=> true, 'data'=>$result);
        } else {
            return (array('success'   => false,
                'msg' => 'El archivo de configuraci&oacute;n no existe.'));
        }
    }

    public function getVariablesIndex(){
        $ruta=realpath(dirname(__FILE__)) . '/'.'../../../comun/recursos/evaluadores_pliego.ini';
        $result=array();
        if (file_exists($ruta)) {
            $config = parse_ini_file($ruta, true);
            foreach ($config['variables'] as $dataIndex => $value){
                $data=(array)json_decode($value);
                $data['id']=$dataIndex;
                $data['nombrecolumna']=$data['nombre'];
                $result[$dataIndex]=$data;
            }
            return $result;
        } else {
            return false;
        }
    }

    public function guardarIndicadoresPliego($params){
        try{
            $values=(array)json_decode($params['values']);
            $values['idusuario']=$this->global->Perfil->idusuario;
            $values['idestructuracomun']=$this->global->Estructura->idestructura;;
            $values['configgrafica']=$params['configgrafica'];
            $values['configgrid']=$params['configgrid'];
            $values['mostrargrafica']=(isset($values['mostrargrafica']) && $values['mostrargrafica']=='on')?'1':'0';
            $values['mostrargrid']=(isset($values['mostrargrid']) && $values['mostrargrid']=='on')?'1':'0';
			$values['calcularrelevancia']=(isset($values['calcularrelevancia']) && $values['calcularrelevancia']==1)?'1':'0';
			//print_r($values);die;
            ConfIndicadorPliego::guardarIndicadorPliego($values);
            return array('success'=>true);
        }catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function eliminarIndicadoresPliego($params){
        try{
            ConfIndicadorPliego::eliminarIndicadorPliego(json_decode($params['idindicadorespliego']));
            return array('success'=>true);
        }catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

}