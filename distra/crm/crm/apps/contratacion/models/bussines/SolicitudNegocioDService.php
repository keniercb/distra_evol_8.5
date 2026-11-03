<?php

/**
 * SolicitudNegocioDService
 *
 * @package    Domain.
 * @subpackage Domain services.
 * @copyright  UCID
 * @version    1.0
 */
class SolicitudNegocioDService extends ZendExt_Model
{
    private $_solicitudRepository, $_areaimplicadaDService, $_estadoDService, $_gestordocumental, $_dictamen, $_ofertadictamen, $_solicituddictamen, $_solicitudpagodictamen;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_solicitudRepository = new SolicitudNegocioRepository();
        $this->_areaimplicadaDService
            = new SolicitudNegocioAreaImplicadaDService();
        $this->_dictamen = new DatDictamen();
        $this->_ofertadictamen = new DatOfertaDictamen();
        $this->_solicituddictamen = new DatSolicitudDictamen();
        $this->_solicitudpagodictamen = new DatSolicitudPagoDictamen();
        $this->_estadoDService = new SolicitudNegocioEstadoDService();
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_idestructura = $this->global->Estructura->idestructura;
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->_confcontratacion = new ConfContratacionModel();
    }

    public function getSolicitudes($params)
    {

        $params['filters'][] = array('field' => 'idestructuracomun',
                                     'data'  => array('value' => $this->_idestructura));
        $params['filters'][] = array('field' => 'cliente',
                                     'data'  => array('value' => '[1,2]'));
        $params['modelName']='SolicitudNegocio';
        $params['filters']=array_merge($params['filters'], $this->_confcontratacion->loadFiltersCompartimentacion(
            array('filter'=>
                array('field' => 'idestructuracomun',
                    'data'  => array('value' => $this->_idestructura)),
                'modelName'=>'SolicitudNegocio'
            )
        ));
        $result = $this->_solicitudRepository->getSolicitudesNegocio($params);
//        print_r($result);die;
        $listSolicitudes = array();
        foreach ($result['datos'] as $value) {
            if (array_key_exists($value, $listSolicitudes)) {
                continue;
            }
            $value['areasimplicadas']
                = $this->_areaimplicadaDService->getAreasImplicadasFromArray(
                $value['idsolicitud'], $result
            );
            $value['idarea'] = $value['idarearesponsable'];
            if ($value['cliente'] == 2) {
                $conexionActual = Doctrine_Manager::getInstance()
                    ->getCurrentConnection();
                $datos = $this->cargarProveedoresSolicitud(
                    $value['idsolicitud']
                );
                $provee = array();
                $idprovee = array();
                foreach ($datos['datos'] as $temp) {
                    $provee[] = $temp['nombre'];
                    $idprovee[] = $temp['idclientesproveedores'];
                }
                $value['clienteproveedor'] = implode(', ', $provee);
                $value['idproveedores'] = implode(',', $idprovee);
            }
            $listSolicitudes[] = $value;
        }
        return array(
            'cant'              => $result['cant'],
            'datos'             => $listSolicitudes,
            'estados_cliente'   => $this->_estadoDService->getConfiguracionEstados(),
            'estados_proveedor' => $this->_estadoDService->getConfiguracionEstados(
                'solicitudnegocioproveedor'
            ),
        );
    }

    public function getConfigSolicitudNegocio()
    {
        return (new ConfSolicitudNegocio())->getConfig();
    }

    public function getSolicitudDocs($idespacioTrabajo)
    {
        $result = [];
        if ($this->existeGestorDocumental() && !empty($idespacioTrabajo)) {

            $result = $this->_gestordocumental->getContenido(
                array('idespaciotrabajo' => $idespacioTrabajo)
            );
        }
        return $result;
    }

    public function getMonedasEstructura()
    {
        try {
            $resultado = $this->_datosmaestros->getMonedasEntidad(
                $this->_idestructura
            );
            return $resultado;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function adicionarSolicitud($params)
    {
        try {
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $result = $conn->fetchAll(
                "SELECT count(o.idsolicitud) FROM mod_crmcontratacion.dat_solicitudnegocio o 
                          WHERE o.numero='" . $params['numero']
                . "' AND o.cliente=".$params['cliente']." AND o.idestructuracomun=" . $this->_idestructura
            );
//            print($result[0]['count']);die;
            if ($result[0]['count'] == 0) {
                $saveValues = array();
                $saveValues['numero'] = $params['numero'] ? $params['numero'] : null;
                $saveValues['nombre'] = $params['nombre'];
                $saveValues['idclienteproveedor'] = $params['idclienteproveedor'] == '' ? null : $params['idclienteproveedor'];
                $saveValues['clienteproveedor'] = $params['clienteproveedor'] == '' ? null : $params['clienteproveedor'];
                $saveValues['idsector'] = $params['idsector'] ? $params['idsector'] : null;
                $saveValues['idarearesponsable'] = $params['idarea'] ? $params['idarea'] : null;
                $saveValues['descripcion'] = $params['descripcion'];
                $saveValues['cliente'] = $params['cliente'];
                $saveValues['idestructuracomun'] = $this->_idestructura;

                $this->updateUploadFilesName($params);
                if (count($_FILES) != 0) {
                    $saveValues['idespaciotrabajo'] = $this->generateEspacioTrabajo(
                        $params
                    );
                    $this->insertarDocumentos($saveValues['idespaciotrabajo']);
                }

                $idsolicitud = $this->_solicitudRepository->insertRecord(
                    $saveValues
                );
                $this->_areaimplicadaDService->adicionarAreasImplicadas(
                    $idsolicitud, $params['areasimplicadas']
                );
                if ($params['proveedores']) {
                    $this->adicionarProveedores(
                        $idsolicitud, $params['proveedores']
                    );
                }
                if ($params['productosservicios']) {
                    $this->adicionarProductoServicio(
                        $idsolicitud, $params['productosservicios']
                    );
                }
                $this->_estadoDService->registrarEstadInicial($idsolicitud);
                return array('success' => true, 'idsolicitud'=>$idsolicitud);
            }else{
                return array('success' => false, 'code' => 1, 'msg'=>'Ya existe una solicitud con el número de solicitud asignado.');
            }
        } catch (Exception $e) {
            if ($e->getCode() == 335) {
                return;
            }
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function modificarSolicitud($params)
    {
        try{
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $result = $conn->fetchAll(
                "SELECT count(o.idsolicitud) FROM mod_crmcontratacion.dat_solicitudnegocio o 
                      WHERE o.numero='" . $params['numero'] .
                "' AND o.idestructuracomun=" . $this->_idestructura
                . " AND o.idsolicitud!=" . $params['idsolicitud']
            );
            if ($result[0]['count'] == 0) {
                $saveValues = array();
                $saveValues['idsolicitud'] = $params['idsolicitud'];
                $saveValues['numero'] = $params['numero'] ? $params['numero'] : null;
                $saveValues['nombre'] = $params['nombre'];
                $saveValues['idclienteproveedor'] = $params['idclienteproveedor'] == '' ? null : $params['idclienteproveedor'];
                $saveValues['clienteproveedor'] = $params['clienteproveedor'] == '' ? null : $params['clienteproveedor'];
                $saveValues['idsector'] = $params['idsector'] ? $params['idsector'] : null;
                $saveValues['idarearesponsable'] = $params['idarea'] ? $params['idarea'] : null;
                $saveValues['descripcion'] = $params['descripcion'];

                $this->updateUploadFilesName($params);

                if (count($_FILES) != 0) {
                    $saveValues['idespaciotrabajo'] = ($params['idespaciotrabajo'])
                        ? $params['idespaciotrabajo']
                        : $this->generateEspacioTrabajo($params);
                    $this->insertarDocumentos($saveValues['idespaciotrabajo']);
                }

                $this->modificarDocumentos(json_decode($params['editfile']));
                $this->eliminarDocumentos(json_decode($params['delfile']));

                $this->_solicitudRepository->updateRecord($saveValues);
                $this->_areaimplicadaDService->modificarAreasImplicadas(
                    $params['idsolicitud'], $params['areasimplicadas']
                );
                if ($params['proveedores']) {
                    $this->adicionarProveedores(
                        $params['idsolicitud'], $params['proveedores']
                    );
                }
                if ($params['productosservicios']) {
                    $this->adicionarProductoServicio(
                        $params['idsolicitud'], $params['productosservicios']
                    );
                }
                return array('success'=>true);
            }else{
                return array('success' => false, 'code' => 1, 'msg'=>'Ya existe una solicitud con el número de solicitud asignado.');
            }
        } catch (Exception $e) {
            if ($e->getCode() == 335) {
                return;
            }
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function eliminarSolicitud($ids)
    {
        $this->_solicitudRepository->deleteRecords($ids);
    }

    private function adicionarProveedores($idsolicitud, $proveedores)
    {
        try {
            foreach ($proveedores['nuevos'] as $n) {
                $solprov = new DatSolicitudNegocioProveedor();
                $solprov->idsolicitudnegocio = $idsolicitud;
                $solprov->idproveedor = $n;
                $solprov->save();
            }
            if ($proveedores['eliminados']) {
                $query = Doctrine_Query::create();
                $query->delete()->from('DatSolicitudNegocioProveedor')
                    ->whereIn(
                        'idsolicitudnegocioproveedor',
                        $proveedores['eliminados']
                    )
                    ->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function adicionarProductoServicio($idsolicitud, $prodServ)
    {
        try {
            foreach ($prodServ['nuevos'] as $n) {
                $producto = $n['idindicadorcontrato']
                    ?
                    Doctrine::getTable('DatIndicadorSolicitud')->find(
                        $n['idindicadorcontrato']
                    )
                    :
                    new DatIndicadorSolicitud();
                $producto->idsolicitudnegocio = $idsolicitud;
                $producto->idindicador = $n['idindicador'] ? $n['idindicador']
                    : null;
                $producto->idactividad = $n['idactividad'] ? $n['idactividad']
                    : null;
                $producto->denominacion = $n['denominacion'];
                $producto->tipo = $n['tipo'];
                $producto->cantidad = $n['cantidad'];
                $producto->save();
            }
            if ($prodServ['eliminados']) {
                $query = Doctrine_Query::create();
                $query->delete()->from('DatIndicadorSolicitud')
                    ->whereIn('idindicadorsolicitud', $prodServ['eliminados'])
                    ->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function getNombreClienteProveedorById($idclientproveedor)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $datos = $conexionActual->fetchAll(
            "SELECT count(idclientesproveedores) FROM mod_datosmaestros.nom_clientesproveedor 
            WHERE idclientesproveedores=" . $idclientproveedor
        );
        $nombre = '';
        if ($datos[0]['count'] > 0) {
        }
        return $nombre;
    }

    private function updateUploadFilesName($params)
    {
        foreach ($_FILES as $k => $file) {
            $id = explode("_new", $k)[1];
            if ($_FILES[$k]['name']) {
                $_FILES[$k]['realname'] = $params['params']["nombre_new" . $id];
            } else {
                unset($_FILES[$k]);
            }
        }
    }

    private function generateEspacioTrabajo($params)
    {
        if ($this->existeGestorDocumental()) {
            $result = $this->_confcontratacion->loadConfSolicitudNegocio();
            if (count($result['config'])) {
                $idespacioGeneral = $result['config']['idespaciotrabajo'];
            }

            if ($idespacioGeneral) {

                $idespaciocliente = $this->crearEspacioClienteProveedor(
                    $idespacioGeneral, $params
                );
                return $this->crearEspacioSolicitudNegocio(
                    $idespaciocliente, $params
                );
            }

            return '';
        }
    }

    private function crearEspacioClienteProveedor($idespacio, $parametros)
    {
        try {
            $coneccion = Doctrine_Manager::getInstance()->getCurrentConnection()
                ->getName();
            $parametros
                = array('idclientesproveedores' => $parametros['idclienteproveedor'],
                        'idestructuracomun'     => $this->_idestructura,
                        'idespaciotrabajo'      => $idespacio,
                        'proceso'               => 'solicitudnegocio',
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

    private function crearEspacioSolicitudNegocio($idespacio, $parametros)
    {
        try {
            return $this->_gestordocumental->CreateWorkSpace(
                $idespacio, $parametros['nombre']
            );
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function existeGestorDocumental()
    {
        try {
            $conf = new ConfContratacionModel();
            $result = $conf->loadConfSolicitudNegocio();
//            print_r($result);die;
            if (count($result) && count($result['config'])
                && $result['config']['activo']
                && $this->_gestordocumental->testGD()
            ) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function insertarDocumentos($idespaciosolicitud)
    {
        try {
            if (count($_FILES) != 0 && $idespaciosolicitud) {

                $documento = $this->_gestordocumental->saveDocument(
                    $idespaciosolicitud
                );
                if (count($documento) == 0) {
                    throw new Exception(
                        'Ocurrio un error al salvar el documento.', 335
                    );
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modificarDocumentos($docs)
    {
        try {
            foreach ($docs as $doc) {
                $this->_gestordocumental->editDocument(
                    $doc->idnodo, array('nombre' => $doc->nombre)
                );
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getEstadoSolicitud()
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        return $conn->fetchOne(
            "
            SELECT idestadosolicitudinsertar FROM mod_crmadministracion.conf_ofertanegocio
        "
        );
    }

    public function eliminarDocumentos($docs)
    {
        try {
            if (count($docs)) {
                $this->_gestordocumental->delFile($docs);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function cargarProveedoresSolicitud($idsolicitud)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $datos = $conexionActual->fetchAll(
            'SELECT cp.idclientesproveedores, snp.idsolicitudnegocioproveedor,
            (CASE WHEN cp.registrado = 0 THEN cp.nombre else COALESCE (estru.denominacion, per.nombre||\' \'||per.papel||\' \'||per.sapel) END) as nombre
            FROM mod_crmcontratacion.dat_solicitudnegocioproveedor snp
            INNER JOIN mod_datosmaestros.nom_clientesproveedor cp ON cp.idclientesproveedores=snp.idproveedor
            LEFT JOIN mod_estructuracomp.dat_estructura estru ON (cp.idestructura = estru.idestructura and estru.idproyecto=0)
            LEFT JOIN mod_persona.dat_persona per ON (cp.idpersona = per.idpersona)
            WHERE snp.idsolicitudnegocio=' . $idsolicitud
        );
        return array('success' => true, 'datos' => $datos);
    }

    public function obtenerProductoServicio($idsolicitud)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $datos = $conexionActual->fetchAll(
            "SELECT isn.*, isn.idindicadorsolicitud as idindicadorcontrato,
            COALESCE(isn.denominacion, i.denominacion) as denominacion,
            COALESCE(num.denominacionunidadmedida, 'Unidad') as unidadmedida,
            COALESCE(i.precio, 0) as precio, ip.preciodivisa
            FROM mod_crmcontratacion.dat_indicadorsolicitud isn
            LEFT JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = isn.idindicador
            LEFT JOIN mod_datosmaestros.nom_indicadorplanif ip on i.idindicador = ip.idindicador
            LEFT JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = i.idumedida
            WHERE isn.idsolicitudnegocio=" . $idsolicitud
        );
        return array('success' => true, 'datos' => $datos);
    }

    public function getAreasImplicadas($idsolicitud)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        return $conn->fetchAll(
            "
            SELECT COALESCE (estuc1.denominacion, estucop1.denominacion) as area, sai.idarea, sai.idestructura
            FROM mod_crmcontratacion.dat_solicitudnegocioareaimplicada sai
            LEFT JOIN mod_estructuracomp.dat_estructura estuc1 ON (sai.idestructura = estuc1.idestructura and estuc1.idproyecto = 0)
            LEFT JOIN mod_estructuracomp.dat_estructuraop estucop1 ON (sai.idestructura = estucop1.idestructuraop and estucop1.idproyecto = 0)
            WHERE sai.idsolicitud=" . $idsolicitud
        );
    }

    public function cargarLineas($params)
    {
        try {
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where = "";
            $limits = "";
            if ($params['denominacion']) {
                $where = " WHERE n.denominacion ILIKE '%" . $params['denominacion'] . "%' ";
            }
            if($params['limit']){
                $limits=" LIMIT " . $params['limit'] . " OFFSET " . ($params['start']?$params['start']:0);
            }
            $result = $conexionActual->fetchAll(
                "SELECT count(n.idnaturaleza) over(), n.idnaturaleza, n.denominacion, n.idnaturaleza as idindicador
                    FROM mod_datosmaestros.nom_naturaleza n
                    $where
                    ORDER BY n.denominacion
                    ".$limits
            );
//        if (!$params['idnaturaleza']) {
//            $params['idnaturaleza'] = $this->cargarNaturaleza();
//        }
//        if ($params['idnaturaleza']) {
//            $result = $this->integrator->logistica->getIndicadoresByParams(
//                array('idnaturaleza' => $params['idnaturaleza'], 'nivel' => 2),
//                0, 0
//            );
//        }

//        $result=$this->integrator->datosmaestros->getArrIndicadoresDescendencia(null, null, null, array());
//        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
//        $result=$conexionActual->fetchAll(
//            "select m.denominacion, m.codigo, m.*
//            FROM mod_datosmaestros.nom_indicador m
//            LEFT JOIN mod_datosmaestros.nom_indicadorhoja m2 ON m.idindicador = m2.idindicador
//            WHERE m.idindicador <> m.idpadre AND m2.idindicador is null
//            AND m.idnaturaleza=1000261
//            /*AND denominacion='PEUGEOT'*/
//            ORDER BY m.codigo"
//        );
            return array('total'=>count($result)>0?$result[0]['count']:0, 'datos'=>$result);
        }catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerTiposLineas($post) {
//        return $this->integrator->crm->obtenerTiposLineas($post);
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $where = '';
        $arrwhere = [];
        foreach ($post as $index => $value) {
            if ($index == 'idlinea') {
                $arrwhere[] = " tl.lineas::text like '%" . $value . "%' ";
            }
        }
        if (count($arrwhere) > 0) {
            $where = ' WHERE ' . implode(' AND ', $arrwhere);
        }
        $resp = $conexionActual->fetchAll(
            'SELECT tl.*, tl.denominacion as tipolinea FROM mod_crmcontratacion.nom_tipolinea tl '
            . $where
        );
        $cant = $conexionActual->fetchAll(
            'SELECT count(tl.idtipolinea) FROM mod_crmcontratacion.nom_tipolinea tl '
            . $where
        );
        return array('datos' => $resp, 'total' => $cant[0]['count']);
    }

    public function cargarNaturaleza()
    {
        $resultado = '';
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        $naturaleza = $conexionActual->fetchAll(
            "SELECT n.idnaturaleza FROM mod_datosmaestros.nom_naturaleza n
                      WHERE n.denominacion='Partes y piezas SASA'"
        );
        if ($naturaleza) {
            $resultado = $naturaleza[0]['idnaturaleza'];
        }
        return $resultado;
    }

    public function getLineasClientes($params) {
        $disctinctStatement = '';
        $where = '';
        $arrWhere = array();
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        foreach ($params as $index => $value) {
            if ($value)
                switch ($index) {
                    case 'idclienteproveedor':
                        $arrWhere[] = 'cpl.idclienteproveedor=' . $value;
                        break;
                    case 'idlinea':
                        $arrWhere[] = 'cpl.idlinea=' . $value;
                        break;
                    case 'linea':
                        $arrWhere[] = 'i.denominacion ILIKE "%' . $value . '%"';
                        break;
                    case 'tipolinea':
                        $arrWhere[] = 'tl.denominacion ILIKE "%' . $value
                            . '%"';
                        break;
                    case 'soloLineas':
                        $disctinctStatement
                            = ' DISTINCT ON (cpl.idlinea) cpl.idlinea, ';
                        break;
                }
        }
        if (count($arrWhere) > 0) {
            $where = ' WHERE ' . implode(' AND ', $arrWhere);
        }
        $query
            = "
              FROM mod_datosmaestros.dat_clienteproveedorlinea cpl
              LEFT JOIN mod_datosmaestros.nom_indicador i ON i.idindicador=cpl.idlinea 
              LEFT JOIN mod_crmcontratacion.nom_tipolinea tl ON tl.idtipolinea=cpl.idtipolinea
              " . $where;
//        print($query);die;
        $resultado = $conexionActual->fetchAll(
            "SELECT $disctinctStatement cpl.*, i.codigo,
              i.denominacion as linea, tl.denominacion as tipolinea, i.idnaturaleza "
            . $query .
            ' LIMIT ' . $params['limit'] . ' OFFSET ' . $params['start']
        );
        if (count($resultado) < $params['limit']) {
            $total = count($resultado);
        } else {
            $total = $conexionActual->fetchAll(
                "SELECT count(i.denominacion)" . $query
            )[0]['count'];   // PENDIENTE
        }
//        $total=count($resultado)?$resultado[0]['count']:0;
        return array('success' => true, 'cantidad' => $total,
            'datos'   => $resultado);
    }

    public function obtenerDemandasSeleccionadas($params) {
        $query = Doctrine_Query::create();
//        print_r($params);die;
//        $result=$query->select('iddemanda')->from('DatSolicitudDemanda')->execute();
////            ->where('idsolicitud=?', $params['idsolicitud'])->execute();
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();

        $result = $conexionActual->fetchAll(
            '
            SELECT * FROM mod_crmcontratacion.dat_solicituddemanda WHERE idsolicitud='
            . $params['idsolicitud']
        );
        return $result;
    }

    public function generarConsecutivoAño($tiposolicitud, $cantCeros = 3) {
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();

        $anoActual = date('y');
        $solicitudes = $conexionActual->fetchAll(
            "
            SELECT numero FROM mod_crmcontratacion.dat_solicitudnegocio
            WHERE idestructuracomun=" . $this->_idestructura . " AND cliente=" . $tiposolicitud .
            " ORDER BY idsolicitud DESC LIMIT 15 OFFSET 0"
        );
//        print_r($solicitudes);
        $mayor = 0;
        foreach ($solicitudes as $o) {
//            $aux = explode('/', $o['numero']);
            if ($mayor < intval($o['numero'])) {
                $mayor = intval($o['numero']);
            }
        }
        return strval($mayor+1);

//        $result = $conexionActual->fetchAll(
//            "SELECT count(s.idsolicitud) FROM mod_crmcontratacion.dat_solicitudnegocio s
//            WHERE s.cliente=" . $tiposolicitud . " AND s.numero LIKE '%."
//            . date('Y') . "'"
//        );
//        return str_pad(
//                ((string)$result[0]['count'] + 1), $cantCeros, '0', STR_PAD_LEFT
//            ) . '.' . date('Y');
    }

    public function obtenerContenidoCorreo($params){
        $solicitud=Doctrine::getTable('SolicitudNegocio')->find($params['idsolicitud']);
        $params['cuerpo']='Se ha insertado una nueva solicitud de negocio con número <b style="color:#3158a0">'
            .$solicitud['numero'].'</b> y nombre <b style="color:#3158a0">'.$solicitud['nombre'].'</b>';
        $params['destinatarios']=json_decode($params['destinatarios']);
        return $params;
    }
}