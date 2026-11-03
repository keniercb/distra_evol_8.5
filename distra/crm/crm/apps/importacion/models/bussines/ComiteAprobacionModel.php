<?php

/**
 * Clase encargada de la gestion de solicitudes del
 * comite de aprobacion
 *
 * @author         Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Models/Bussines
 * @copyright (c)  2016, XETID
 * @version        1.0
 */
class ComiteAprobacionModel extends ZendExt_Model
{
    private $_contrato;
    private $_contratomodel;
    private $_confcontratacion;
    private $_configuracion;
    private $_dictamen;
    private $_ofertadictamen;
    private $_solicituddictamen;
    private $_fields;
    private $_gestordocumental;
    private $_persona;
    private $_aliasproceso;
    private $_ofertadservice;
    private $_ofertaestadodservice;
    private $_nomestado;
    private $_solicitudpago;
    private $_solicitudpagodictamen;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_contrato = new DatContrato();
        $this->_contratomodel = new GestioncontratoModel();
        $this->_confcontratacion = new ConfContratacionModel();
        $this->_dictamen = new DatDictamen();
        $this->_ofertadictamen = new DatOfertaDictamen();
        $this->_solicituddictamen = new DatSolicitudDictamen();
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_persona = new PersonaComunicationInterface();
        $this->_aliasproceso = "mdContrato";
        $this->_ofertadservice = new OfertaNegocioDService();
        $this->_solicituddservice = new SolicitudNegocioDService();
        $this->_ofertaestadodservice = new OfertaNegocioEstadoDService();
        $this->_solicitudestadodservice = new SolicitudNegocioEstadoDService();
        $this->_nomestado = new NomEstado();
        $this->_demanda = new DemandaDService();
        $this->_solicitudpagodictamen = new DatSolicitudPagoDictamen();
    }

    public function guardarDictamen($params)
    {
        try {
            $this->cargarConfiguracion($params);
            $roles = $this->integrator->seguridad->getRolesbyUser(
                $params['idusuario']
            );
            if (count($roles)) {
                $documentojson = $this->guardarDocumento();
                if ($documentojson === false) {
                    return;
                }
            }
            foreach ($roles as $rol) {
                if (in_array($rol['idrol'], $this->_configuracion['idroles'])) {
                    $respuesta = $this->crearDictamen($params, $rol);
                    $dictamen = $respuesta['dictamen'];
                    $claveid = $respuesta['claveid'];
                    $dictamen->$claveid = $params['id'];
                    $dictamen->idestado = $params['idestado'];
                    $dictamen->idrol = $rol['idrol'];
                    $dictamen->idusuario = $params['idusuario'];
                    $dictamen->observacion = $params['observacion'];
                    $dictamen->documento = json_encode($documentojson);
                    $dictamen->fecha = date('d/m/Y');
                    $dictamen->save();
                }
            }
            return array('code' => 1, 'success' => true);
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'message'=> $e->getMessage(),'success' => false);
        }
    }

    public function guardarDocumento()
    {
        try {
            $documentojson = array();
            $idespaciotrabajo = $this->getIdEspacioTrabajo();
            if ($_FILES['file']['type'] && $idespaciotrabajo) {
                $exploded = explode('.', $_FILES['file']['name']);
                $name = $exploded[0]
                    . $this->_gestordocumental->generateRandomString(6);
                if ($exploded[1]) {
                    $name .= '.' . $exploded[1];
                }
                $_FILES['file']['realname'] = $name;
                $documento = $this->_gestordocumental->saveDocument(
                    $idespaciotrabajo
                );
                if (count($documento)) {
                    $documentojson = $documento[0];
                } else {
                    return false;
                }
            }
            return $documentojson;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function crearDictamen($params, $rol)
    {
        try {
            $claveid = $this->getClaveId($params['tipo']);
            $singleton = $this->getSinglenton($params['tipo']);
            $newClass = $this->getClassName($params['tipo']);
            $filter = array($claveid    => $params['id'],
                'idrol'     => $rol['idrol'],
                'idusuario' => $params['idusuario'],
                'activo'    => 1);
            $dictamen = $singleton->getByParams($filter, false);
            if ($dictamen[0]) {
                $dictamen = $dictamen[0];
            } else {
                $dictamen = new $newClass();
            }

            return array('dictamen' => $dictamen, "claveid" => $claveid);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function cargarDictamenes($params)
    {
        try {
            $claveid = $this->getClaveId($params['tipo']);
            $singleton = $this->getSinglenton($params['tipo']);
            $condition = [];
            if ($params['id']) {
                $condition[$claveid] = $params['id'];
            }
            if (!$params['todos']) {
                $condition['dd.activo'] = 1;
            }
            $result = $singleton->getByParams($condition);
            foreach ($result as $key => $value) {
                $result[$key]['nombrerol'] = $value['SegRol']['denominacion'];
                $result[$key]['abreviaturarol']
                    = $value['SegRol']['abreviatura'];
                $result[$key]['nombreestado'] = $value['NomEstado']['nombre'];
                $result[$key]['iconoestado'] = $value['NomEstado']['icono'];
                if ($value['SegUsuario']['idpersona']) {
                    $persona = $this->_persona->getPersona(
                        $value['SegUsuario']['idpersona']
                    );
                    $result[$key]['nombrepersona']
                        = $persona['nombreapellidos'];
                    $result[$key]['cargopersona'] = $persona['denomcargo'];
                }
                $comiteDOC = $this->_confcontratacion->loadConfComite(
                )['committeedoc'];
                if (count($comiteDOC) && $comiteDOC[0]['activo'] == 1) {
                    $documento = json_decode($value['documento']);
                    if ($documento->id) {
                        /*$url = $this->getFile(
                            array('iddocument' => $documento->id)
                        );*/
                        $documento->url = $documento->id;
                    }
                    $result[$key]['documento'] = $documento;
                }
            }
            return array('data' => $result, 'count' => count($result));
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

    public function cargarContrato($params)
    {
        try {
            $this->cargarConfiguracion($params);
            $this->obtenerColumnas($params);
            $this->aplicarReglas();
            $result = $this->cargarDatosContrato(
                $params, $this->_configuracion['estadoinicial']
            );
            $result['metaData'] = $this->obtenerMetadata();
            $singlenton = $this->getSinglenton();
            foreach ($result['data'] as $key => &$contrato) {
                foreach ($this->_configuracion['roles'] as $rol) {
                    $filter = array('idcontrato' => $contrato['idcontrato'],
                        'idrol'      => $rol['idrol'],
                        'dd.activo'  => 1);
                    $dictamen = $singlenton->getByParams($filter);
                    if ($dictamen) {
                        $contrato['estado-' . $rol['abreviatura']] = $dictamen;
                    } else {
                        $contrato['estado-' . $rol['abreviatura']]
                            = $contrato['iconoestadoinicial'];
                    }
                }
                $diastranscurridos = $singlenton->executeQuery(
                    $singlenton->getQueryDays($contrato['fechaestado'])
                );
                $contrato['diastranscurridos'] = $diastranscurridos[0]['cant'];
            }
            return $result;

        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

    public function cargarOfertas($params)
    {
        try {
            $idtipo = 2;
            $this->cargarConfiguracion($params);
            $this->obtenerColumnas($params);
            $this->aplicarReglas($idtipo);
            $result = $this->cargarDatosOferta(
                $params, $this->_configuracion['estadoinicial']
            );
            $result['estados']
                = $this->_ofertaestadodservice->getConfiguracionEstados();
            $result['metaData'] = $this->obtenerMetadata();
            $singlenton = $this->getSinglenton($idtipo);
            foreach ($result['datos'] as $key => $oferta) {
                $params = array('idestado' => $oferta['idestado']);
                $estado = $this->_nomestado->getEstadoByParams($params);
                foreach ($this->_configuracion['roles'] as $rol) {
                    $filter = array('idoferta'  => $oferta['idoferta'],
                        'idrol'     => $rol['idrol'],
                        'dd.activo' => 1);
                    $dictamen = $this->_ofertadictamen->getByParams($filter);
                    if ($dictamen) {
                        $oferta['estado-' . $rol['abreviatura']] = $dictamen;
                    } else {
                        $oferta['estado-' . $rol['abreviatura']]
                            = $estado[0]['icono'];
                    }
                }
                $diastranscurridos = $singlenton->executeQuery(
                    $singlenton->getQueryDays($oferta['fechaestado'])
                );
                $oferta['diastranscurridos'] = $diastranscurridos[0]['cant'];
                $result['datos'][$key] = $oferta;
            }
            return $result;
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

    public function cargarSolicitudesNegocio($params)
    {
        try {
            $idtipo = 3;
            $this->cargarConfiguracion($params);
            $this->obtenerColumnas($params);
            $this->aplicarReglas($idtipo);
            $result = $this->cargarDatosSolicitudesNegocio(
                $params, $this->_configuracion['estadoinicial']
            );
            $result['estados']
                = $this->_solicitudestadodservice->getConfiguracionEstados();
            $result['metaData'] = $this->obtenerMetadata();
            $singlenton = $this->getSinglenton($idtipo);
            foreach ($result['datos'] as $key => $solicitud) {
                $params = array('idestado' => $solicitud['idestado']);
                $estado = $this->_nomestado->getEstadoByParams($params);
                foreach ($this->_configuracion['roles'] as $rol) {
                    $filter = array('idsolicitud' => $solicitud['idsolicitud'],
                        'idrol'       => $rol['idrol'],
                        'dd.activo'   => 1);

                    $dictamen = $singlenton->getByParams($filter);
                    if ($dictamen) {
                        $solicitud['estado-' . $rol['abreviatura']] = $dictamen;
                    } else {
                        $solicitud['estado-' . $rol['abreviatura']]
                            = $estado[0]['icono'];
                    }
                }

                $diastranscurridos = $singlenton->executeQuery(
                    $singlenton->getQueryDays($solicitud['fechaestado'])
                );
                $solicitud['diastranscurridos'] = $diastranscurridos[0]['cant'];
                $result['datos'][$key] = $solicitud;
            }
            return $result;
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

    public function cargarSolicitudesPago($params)
    {
        try {
            $idtipo = 4;
            $this->cargarConfiguracion($params);
            $this->obtenerColumnas($params);
            $this->aplicarReglas($idtipo);
            $result = $this->cargarDatosSolicitudesPagos(
                $params, $this->_configuracion['estadoinicial']
            );
            $result['metaData'] = $this->obtenerMetadata();
            $singlenton = $this->getSinglenton($idtipo);
            foreach ($result['data'] as $key => $solicitud) {
                $params = array('idestado' => $solicitud['idestado']);
                $estado = $this->_nomestado->getEstadoByParams($params);
                foreach ($this->_configuracion['roles'] as $rol) {
                    $filter
                        = array('idsolicitudpago' => $solicitud['idsolicitudpago'],
                        'idrol'           => $rol['idrol'],
                        'dd.activo'       => 1);
                    $dictamen = $singlenton->getByParams($filter);
                    if ($dictamen) {
                        $solicitud['estado-' . $rol['abreviatura']] = $dictamen;
                    } else {
                        $solicitud['estado-' . $rol['abreviatura']]
                            = $estado[0]['icono'];
                    }
                }
                $diastranscurridos = $singlenton->executeQuery(
                    $singlenton->getQueryDays($solicitud['fechaestado'])
                );
                $solicitud['diastranscurridos'] = $diastranscurridos[0]['cant'];
                $result['data'][$key] = $solicitud;
            }
            return $result;
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

    public function cargarConfiguracion($params = array())
    {
        $result = $this->_confcontratacion->loadConfComite(
            $params['idcomite']
        )['transitions'];
        $data = [];
        $alias = $params['aliasproceso'] ? $params['aliasproceso']
            : $this->_aliasproceso;
        foreach ($result as $key => $value) {
            if ($value['aliasproceso'] == $alias) {
                foreach ($value['roles'] as $rol) {
                    if (!in_array($rol['idrol'], $data['idroles'])) {
                        $data['roles'][] = $rol;
                        $data['idroles'][] = $rol['idrol'];
                    }
                }
                $data['estadofinal-' . $value['idestadofinal']] = json_decode(
                    $value['reglas']
                );
                $data['reglas'][$value['idestadofinal']]
                    = $this->crearFiltrosDictamen(
                    json_decode($value['reglas']), $value['idestadofinal'],
                    $alias
                );
                if (!in_array(
                    $value['idestadoinicial'], $data['estadoinicial']
                )
                ) {
                    $data['estadoinicial'][] = $value['idestadoinicial'];
                }
            }
        }
        $this->_configuracion = $data;
    }

    public function cargarDatosContrato($params, $estados)
    {
        if (!isset($params['filter'])) {
            $params['filter'] = array();
        }
        $params['filter'][] = array(
            'field' => 'ce.idestado',
            'data'  => array(
                'type'  => 'numeric',
                'value' => $estados,
            )
        );
        $params['filter'][] = array(
            'field' => 'cliente',
            'data'  => array(
                'type'  => 'numeric',
                'value' => 2,
            )
        );
        return $this->_contratomodel->getContratos($params);
    }

    public function cargarDatosOferta($params, $estados)
    {
        if ($estados) {
            $params['filters'][] = array('field' => 'estado',
                'data'  => array('type'  => 'list',
                    'value' => $estados));
            $params['filters'][] = array(
                'field' => 'cliente',
                'data'  => array(
                    'type'  => 'list',
                    'value' => [3],
                )
            );
            return $this->_ofertadservice->getOfertas($params);
        }
        return array();
    }

    public function cargarDatosSolicitudesNegocio($params, $estados)
    {
        if ($estados) {
            $params['filters'][] = array('field' => 'idestado', 'data' =>
                array('type' => 'list', 'value' => $estados));
            $tipo = 1;
            if ($params['aliasproceso'] == 'solicitudnegocioproveedor') {
                $tipo = 2;
            } else {
                if ($params['aliasproceso'] == 'solicitudnegocioimportacion') {
                    $tipo = 3;
                }
            }
            $params['filters'][] = array(
                'field' => 'cliente',
                'data'  => array(
                    'type'  => 'numeric',
                    'value' => $params['aliasproceso'] === 'solicituddemanda' ? 3 : 4,
                )
            );
            return $params['aliasproceso'] === 'solicituddemanda' ?
                $this->_demanda->getDemandas($params) :
                $this->_solicituddservice->getSolicitudes($params);

        }
        return array();
    }

    public function cargarDatosSolicitudesPagos($params, $estados)
    {
        try {
            if ($estados) {
                $params['filter'][] = array('field' => 'spe.idestado',
                    'data'  => array('type'  => 'numeric',
                        'value' => $estados));
                return $this->_solicitudpago->listarSolicitudesPago($params);
            }
            return array();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerMetadata()
    {
        $roles = $this->_configuracion['roles'];
        $fields = $this->_fields;
        $columns = array();
        foreach ($roles as $rol) {
            $fields[] = array('name'     => 'estado-' . $rol['abreviatura'],
                'width'    => 80,
                'renderer' => 'showIcon',
                'align'    => 'center',
                'tooltip'  => $rol['denominacion']);
        }

        foreach ($fields as $key => $field) {
            if (!isset($field['hideable'])) {
                $header = explode('-', $field['name']);
                $header = count($header) == 2 ? strtoupper($header[1])
                    : $header[0];
                $column = array('dataIndex' => $field['name'],
                    'header'    => $header,
                    'renderer'  => $field['renderer']?$field['renderer']:'showTooltip',
                    'align'     => $field['align'] ? $field['align']
                        : 'left',
                    'hidden'    => $field['hidden'] ? true : false,
                    'hideable'  => $field['hideable'] == false
                        ? false : true,
                    'sortable'  => false
                );
                if ($field['tooltip']) {
                    $column['tooltip'] = $field['tooltip'];
                }

                if ($field['type']) {
                    $column['filter'] = array('type' => $field['type']);
                }

                if ($field['filter']) {
                    $column['filter'] = array('type' => $field['filter']);
                }

                if ($field['width']) {
                    $column['width'] = $field['width'];
                } else {
                    $column['flex'] = 1;
                }

                if ($field['type'] == 'date') {
                    unset($fields[$key]['type']);
                }
                $columns[] = $column;
            }
        }
        return array(
            'fields'  => $fields,
            'columns' => $columns
        );
    }

    public function aplicarReglas($tipo = 1)
    {
        try {
            $reglas = $this->_configuracion['reglas'];
//            print_r($this->_configuracion['reglas']);die;// $this->_configuracion['estadoinicial']
            $singlenton = $this->getSinglenton($tipo);
            $claveid = $this->getClaveId($tipo);
//            $todosvotaronfilter = array(array('field' => 'cantidadvotos',
//                'data' => array('type' => 'numeric',
//                    'value' => count($this->_configuracion['idroles']))));

            foreach ($reglas as $idestado => $regla) {
//                $resultado = $singlenton->getByRules($regla);
                $keyTime=$this->findByKey($regla, array('cantidaddiasautomatico', 'cantidaddias'));
                if($keyTime){
                    $result = HelperModel::excecute(
                        $singlenton, 'getByTime', array('estadoinicial'=> $this->_configuracion['estadoinicial'],
                            'reglaTime'=>$keyTime, 'reglas'=>$regla)
                    );
                    if($result) {
                        foreach($result as $dict){
                            $newClass = $this->getClassName($tipo);
                            $newdictamen=new $newClass();
                            $newdictamen->$claveid=$dict[$claveid];
                            $newdictamen->idestado = $idestado;
                            $newdictamen->fecha = date('d/m/Y');
                            $newdictamen->observacion = $this->findByKey(array('cantidaddiasautomatico'))==null?
                                'Se ha cumplido el plazo de votación.':'Se ha realizado un voto automático.';
                            $newdictamen->save();
                        }
//                        $resultado = array_merge($resultado, $result);
                    }
                }
//                $todosvotaron = $singlenton->getByRules($todosvotaronfilter);
                $todosvotaron = $singlenton->getCantidadVotos(count($this->_configuracion['idroles']));

//                print('/*');
//                print_r(count($this->_configuracion['idroles']));
//                print('------');
//                print_r($todosvotaronfilter);
//               print('------');
//                print_r(count($todosvotaron));
//                print('------');
//                print_r($todosvotaron);die;
//                print('*/');
                if(count($todosvotaron)) {
                    $idsTodosVotaron = array_map(function ($valor) use ($claveid) {
                        return $valor[$claveid];
                    }, $todosvotaron);
                    $reglatodosvotaron = array('field' => $claveid,
                        'data' => array('type' => 'numeric',
                            'value' => $idsTodosVotaron));
                    $regla[] = $reglatodosvotaron;

                    $resultado = $singlenton->getByRules($regla);

                    foreach ($resultado as $dictamen) {
                        $cambiado = $this->cambiarEstado(
                            $tipo, $dictamen, $idestado
                        );
                        if ($cambiado) {
                            $filtro = array($claveid => $dictamen[$claveid],
                                'activo' => 1);
                            $singlenton->deleteByParams($filtro);
                        }
                    }
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function findByKey($reglas, $keys){
//        foreach($this->_configuracion['reglas'] as $value){
        foreach($reglas as $regla) {
            if (in_array($regla['field'], $keys)) {
                return $regla;
            }
        }
//        }
        return null;
    }

    private function getSinglenton($tipo = 1)
    {
        switch ($tipo) {
            case 1:
                return $this->_dictamen;
            case 2:
                return $this->_ofertadictamen;
            case 3:
                return $this->_solicituddictamen;
        }
    }

    private function getClaveId($tipo = 1)
    {
        switch ($tipo) {
            case 1:
                return 'idcontrato';
            case 2:
                return 'idoferta';
            case 3:
                return 'idsolicitud';
        }
    }

    private function getClassName($tipo = 1)
    {
        switch ($tipo) {
            case 1:
                return 'DatDictamen';
            case 2:
                return 'DatOfertaDictamen';
            case 3:
                return 'DatSolicitudDictamen';
        }
    }

    public function crearFiltrosDictamen($reglas, $idestado, $alias)
    {
        if (!count($reglas)) {
            return array();
        }
        $result[] = $this->crearFiltroEstado($idestado);
        $result = $this->crearFiltroProceso($alias, $result);
        foreach ($reglas as $key => $regla) {
            switch ($regla->idtiporegla) {
                case 1:
                    $result = $this->crearFiltroRol($regla->idrol, $result);
                    break;
                case 2:
                    $result[] = $this->crearFiltroCantidadVotos($regla->valor);
                    break;
                case 3:
                    $result[] = $this->crearFiltroCantidadDiasAutomatica(
                        $regla->valor
                    );
                    break;
                case 4:
                    $result[] = $this->crearFiltroCantidadDias($regla->valor);
                    break;
            }
        }
        $result = $this->crearFiltroCantidadVotosByRoles($result);
        return $result;
    }

    private function crearFiltroEstado($idestado)
    {
        return array('field' => 'idestado', 'data' => array('type'  => 'numeric',
            'value' => $idestado));
    }

    private function crearFiltroCantidadVotos($valor)
    {
        return array('field' => 'cantidadvotos',
            'data'  => array('type'       => 'numeric',
                'value'      => $valor,
                'comparison' => 'gte'));
    }

    private function crearFiltroRol($idrol, $filtros)
    {
        $pos = $this->buscarFiltro('idrol', $filtros);
        if ($pos != -1) {
            $filtros[$pos]['data']['value'][] = $idrol;
        } else {
            $filtros[] = array('field' => 'idrol',
                'data'  => array('type'  => 'numeric',
                    'value' => array($idrol)));
        }
        return $filtros;
    }

    private function crearFiltroCantidadVotosByRoles($filtros)
    {
        $posVotos = $this->buscarFiltro('cantidadvotos', $filtros);
        $posRoles = $this->buscarFiltro('idrol', $filtros);
        if ($posRoles != -1) {
            $roles = $filtros[$posRoles]['data']['value'];
            $cant = count($roles);
            if ($posVotos == -1) {
                $filtros[] = $this->crearFiltroCantidadVotos($cant);
                $posVotos = count($filtros) - 1;
            }
            $filtros[$posVotos]['data']['value'] = $cant;
        }
        return $filtros;
    }

    private function crearFiltroCantidadDias($valor)
    {
        return array('field' => 'cantidaddias',
            'data'  => array('type'       => 'numeric',
                'value'      => $valor,
                'comparison' => 'gt'));
    }

    private function crearFiltroCantidadDiasAutomatica($valor)
    {
        return array('field' => 'cantidaddiasautomatico',
            'data'  => array('type'       => 'numeric',
                'value'      => $valor,
                'comparison' => 'gt'));
    }

    private function crearFiltroProceso($alias, $result)
    {
        switch ($alias) {
            case 'mdContrato':
                $result = $this->crearFiltroProcesoContratoCliente($result);
                break;
            case 'mdcontratoproveedor':
                $result = $this->crearFiltroProcesoContratoProveedor($result);
                break;
        }
        return $result;
    }

    private function crearFiltroProcesoContratoCliente($result)
    {
        $result[] = array('field' => 'cliente',
            'data'  => array('type' => 'numeric', 'value' => 1));
        return $result;
    }

    private function crearFiltroProcesoContratoProveedor($result)
    {
        $result[] = array('field' => 'cliente',
            'data'  => array('type' => 'numeric', 'value' => 0));
        return $result;
    }

    private function buscarFiltro($field, $filtros)
    {
        $key = -1;
        foreach ($filtros as $k => $filtro) {
            if ($filtro['field'] == $field) {
                $key = $k;
            }
        }
        return $key;
    }

    public function cambiarEstado($tipo, $instancia, $idestadofinal)
    {
        try {
            if ($tipo == 1) {
                $filter = array('idcontrato' => $instancia['idcontrato'],
                    'idestado'   => $idestadofinal);
                $this->_contratomodel->upEstadoContrato($filter);
            } elseif ($tipo == 2) {
                $filter = array('idoferta' => $instancia['idoferta'],
                    'idestado' => $idestadofinal);
                $this->_ofertaestadodservice->cambiarOfertaEstado($filter);
            } elseif ($tipo == 3) {
                $filter = array('idsolicitud' => $instancia['idsolicitud'],
                    'idestado'    => $idestadofinal);
                $this->_solicitudestadodservice->cambiarSolicitudEstado(
                    $filter
                );
            } elseif ($tipo == 4) {
                $filter
                    = array('idsolicitudpago' => $instancia['idsolicitudpago'],
                    'idestado'        => $idestadofinal);
                $this->_solicitudpago->cambiarEstado($filter);
            }
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerColumnas($params)
    {
        $alias = $params['aliasproceso'] ? $params['aliasproceso']
            : $this->_aliasproceso;
        if ($alias == 'ofertacompra') {
            $this->_fields = $this->obtenerColumnasOferta();
        } elseif ($alias == 'solicitudofertaimportacion'
        ) {
            $this->_fields = $this->obtenerColumnasSolicitud();
        } elseif ($alias == 'solicituddemanda') {
            $this->_fields = $this->obtenerColumnasDemanda();
        } else {
            $this->_fields = $this->obtenerColumnasContrato();
        }
    }

    public function obtenerColumnasContrato()
    {
        return array(
            array('name' => 'idcontrato', 'type' => 'int', 'hideable' => false),
            array('name' => 'numero', 'type' => 'string', 'width'=>140),
            array('name' => 'numerocontrato', 'type' => 'string', 'width'=>140, 'hidden' => true),
            array('name' => 'nombre', 'type' => 'string'),
            array('name' => 'fechainicio', 'hideable' => false),
            array('name' => 'fechafin', 'hideable' => false),
            array('name' => 'fechafirma', 'hideable' => false),
            array('name' => 'tipocontrato', 'hideable' => false),
            array('name' => 'clienteproveedor', 'type' => 'string'),
            array('name' => 'montototal', 'hideable' => false),
            array('name' => 'registropago', 'hideable' => false),
            array('name' => 'idproforma', 'hideable' => false),
            array('name' => 'objeto', 'hideable' => false),
            array('name' => 'descripcion', 'hideable' => false),
            array('name' => 'denominacioncontratomarco', 'hideable' => false),
            array('name' => 'mediopago', 'hideable' => false),
            array('name' => 'idproforma', 'hideable' => false),
            array('name' => 'mediopago', 'hideable' => false),
            array('name' => 'sector', 'hideable' => false),
            array('name' => 'vigencia', 'hideable' => false),
            array('name' => 'unidadtiempo', 'hideable' => false),
            array('name' => 'condicionpago', 'hideable' => false),
            array('name' => 'nombrepersona', 'type' => 'string', 'hideable' => false),
            array('name' => 'acciones', 'type' => 'array', 'hideable' => false),
            array('name' => 'transicion', 'type' => 'array', 'hideable' => false),
            array('name' => 'idestado', 'type' => 'int', 'hideable' => false),
            array('name' => 'estadoinicial', 'hideable' => false),
            array('name' => 'iconoestadoinicial', 'hideable' => false),
            array('name' => 'fechaestado', /*'type' => 'date',*/ 'width'    => 100, 'hideable' => false),
            array('name' => 'diastranscurridos', 'type' => 'int', 'width' => 50),
            array('name' => 'documentojson', 'hideable' => false),
            array('name' => 'idarea', 'hideable' => false, 'hidden' => true, 'filter' => 'list'),
            array('name' => 'nombrearea', 'hideable' => false),
            array('name' => 'cliente', 'hideable' => false),
            array('name' => 'monedas', 'hideable' => false),
            array('name' => 'cumplimientoobligaciones', 'hideable' => false),
            array('name' => 'nombreareacreado', 'hideable' => false),
            array('name' => 'linea', 'hideable' => false),
            array('name' => 'tipolinea', 'hideable' => false),
            array('name' => 'puertoorigen', 'hideable' => false),
            array('name' => 'puertodestino', 'hideable' => false),
            array('name' => 'incoterms', 'hideable' => false),
            array('name' => 'incoterm', 'hideable' => false),
            array('name' => 'destinocomercial', 'hideable' => false),
            array('name' => 'clientefinal', 'hideable' => false),
            array('name' => 'condicionespago', 'hideable' => false),
        );
    }

    public function obtenerColumnasOferta()
    {
        return array(
            array('name' => 'idoferta', 'type' => 'int', 'hideable' => false),
            array('name' => 'numero', 'type' => 'string', 'width'=>80),
            array('name' => 'nombre', 'type' => 'string'),
            array('name'     => 'idsolicitud', 'type' => 'int',
                'hideable' => false),
            array('name'     => 'solicitud', 'type' => 'string',
                'hideable' => false),
            array('name'     => 'fechainicio', 'type' => 'date',
                'hideable' => false),
            array('name'     => 'fechafirma', 'type' => 'date',
                'hideable' => false),
            array('name' => 'vigencia', 'type' => 'int', 'hideable' => false),
            array('name'     => 'idmediopago', 'type' => 'int',
                'hideable' => false),
            array('name'     => 'mediopago', 'type' => 'string',
                'hideable' => false),
            array('name'     => 'idcondicionpago', 'type' => 'int',
                'hideable' => false),
            array('name'     => 'condicionpago', 'type' => 'string',
                'hideable' => false),
            array('name' => 'montototal', 'type' => 'int', 'hideable' => false),
            array('name'     => 'descripcion', 'type' => 'string',
                'hideable' => false),
            array('name'     => 'unidadtiempo', 'type' => 'int',
                'hideable' => false),
            array('name'     => 'idclienteproveedor', 'type' => 'int',
                'hideable' => false),
            array('name' => 'sector', 'type' => 'string', 'hideable' => false),
            array('name'     => 'arearesponsable', 'type' => 'string',
                'hideable' => false),
            array('name'     => 'idofertadocumento', 'type' => 'int',
                'hideable' => false),
            array('name'     => 'nombredoc', 'type' => 'string',
                'hideable' => false),
            array('name'     => 'documento', 'type' => 'string',
                'hideable' => false),
            array('name' => 'idestado', 'type' => 'int', 'hideable' => false),
            array('name' => 'estado', 'type' => 'string', 'hideable' => false),
            array('name' => 'clienteproveedor', 'type' => 'string'),
            array('name'  => 'diastranscurridos', 'type' => 'int',
                'width' => 50),
            array('name'     => 'fechaestado', /*'type' => 'date',*/
                'width'    => 100,
                'hideable' => false),
            array('name' => 'linea', 'hideable' => false),
            array('name' => 'tipolinea', 'hideable' => false),

        );
    }

    public function obtenerColumnasSolicitud()
    {
        return array(
            array('name' => 'numero', 'type' => 'string', 'width'=>70),
            array('name' => 'nombre', 'type' => 'string'),
            array('name' => 'clienteproveedor', 'type' => 'string'),
            array('name'     => 'fechacreada', 'type' => 'date',
                'hideable' => false),
            array('name' => 'descripcion', 'string', 'hideable' => false),
            array('name' => 'arearesponsable', 'type' => 'string'),
//            array('name'     => 'descripcion', 'type' => 'string',
//                  'hideable' => false),
            array('name' => 'area', 'type' => 'string', 'hideable' => false),
            array('name'     => 'idsolicitud', 'type' => 'int',
                'hideable' => false),
            array('name'     => 'idclienteproveedor', 'type' => 'int',
                'hideable' => false),
            array('name' => 'idsector', 'type' => 'int', 'hideable' => false),
            array('name'     => 'idarearesponsable', 'type' => 'int',
                'hideable' => false),
            array('name'     => 'documento', 'type' => 'string',
                'hideable' => false),
            array('name' => 'sector', 'type' => 'string', 'hideable' => false),
            array('name' => 'idestado', 'type' => 'int', 'hideable' => false),
            array('name' => 'estado', 'type' => 'string', 'hideable' => false),
            array('name'     => 'estadoicon', 'type' => 'string',
                'hideable' => false),
            array('name' => 'idarea', 'type' => 'int', 'hideable' => false),
            array('name'     => 'idestructura', 'type' => 'int',
                'hideable' => false),
            array('name'     => 'areasimplicadas', 'type' => 'array',
                'hideable' => false),
            array('name'  => 'diastranscurridos', 'type' => 'int',
                'width' => 50),
            array('name'     => 'idespaciotrabajo', 'type' => 'string',
                'hideable' => false),
            array('name'     => 'fechaestado', /*'type' => 'date',*/
                'width'    => 100,
                'hideable' => false),
            array('name' => 'linea', 'hideable' => false),
            array('name' => 'tipolinea', 'hideable' => false),
            array('name' => 'cliente', 'int', 'hideable' => false),
            array('name' => 'solicituddemanda', 'string', 'hideable' => false),
            array('name' => 'nombrepersona', 'string', 'hideable' => false),
            array('name' => 'fechafin', 'string', 'hideable' => false),
        );
    }

    public function obtenerColumnasDemanda()
    {
        return array(
            array('name'     => 'idsolicitud', 'type' => 'int', 'hideable' => false),
            array('name' => 'numero', 'type' => 'string', 'width'=>70),
            array('name' => 'nombre', 'type' => 'string'),
            array('name' => 'descripcion', 'string', 'hideable' => false),
            array('name'     => 'documento', 'type' => 'string',
                'hideable' => false),
            array('name' => 'arearesponsable', 'string'),
            array('name' => 'clienteproveedor', 'string', 'hideable' => false),
            array('name' => 'cliente', 'int', 'hideable' => false),
            array('name' => 'idestado', 'int', 'hideable' => false),
            array('name' => 'estado', 'string', 'hideable' => false),
            array('name' => 'idarea', 'int', 'hideable' => false),
            array('name' => 'idespaciotrabajo', 'string', 'hideable' => false),
            array('name' => 'idestructuracomun', 'int', 'hideable' => false),
            array('name'  => 'diastranscurridos', 'type' => 'int', 'width' => 50),
            array('name'     => 'fechaestado', /*'type' => 'date',*/
                'width'    => 100,
                'hideable' => false),
            array('name' => 'linea', 'string', 'hideable' => false),
            array('name' => 'tipolinea', 'string', 'hideable' => false),
            array('name' => 'descripcion', 'string', 'hideable' => false),
            array('name' => 'fechacreada', 'string', 'hideable' => false),
            array('name' => 'sector', 'string', 'hideable' => false),
            array('name' => 'nombrepersona', 'string', 'hideable' => false),
        );
    }

    public function cargarProductos($params)
    {
        try {
            return $this->_contratomodel->getDatosAdicionales($params);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'success' => false);
        }
    }

    public function obtenerArchivo($params)
    {
        return $this->_gestordocumental->getFile($params);
    }

    public function getIdEspacioTrabajo()
    {
        $result = $this->_confcontratacion->loadCommitteedoc();
        return $result[0]['idespaciotrabajo'];
    }

    public function getFile($params)
    {
        return $this->_gestordocumental->getFile($params);
    }

    public function obtenerProcesos($params)
    {
        $conf = $this->_confcontratacion->loadConfComite(
            $params['comite']
        )['transitions'];
        $result = [];
        $temp = [];
        foreach ($conf as $value) {
            if (!in_array($value['aliasproceso'], $temp)) {
                $result[] = $value;
                $temp [] = $value['aliasproceso'];
            }
        }
        return $result;
    }

    public function obtenerProcesos2($params)
    {
        $conf = $this->_confcontratacion->loadConfComite()['transitions'];
        $comite = $params['comite'] ? $params['comite'] : 'contract';
        $groups = array('contract' => array('solicitudnegocio', 'mdContrato',
            'ofertanegocio'),
            'money'    => array('solicitudpago',
                'mdcontratoproveedor'));
        $result = [];
        $temp = [];
        foreach ($conf as $value) {
            if (!in_array($value['aliasproceso'], $temp)
                && in_array(
                    $value['aliasproceso'], $groups[$comite]
                )
            ) {
                $result[] = $value;
                $temp [] = $value['aliasproceso'];
            }
        }
        return $result;
    }
} 