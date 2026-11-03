<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 2:39 PM
 */

class SolicitudPagoModel extends ZendExt_Model
{

    private $_contratomodel;
    private $_idestructura;
    private $_gestordocumental;
    private $_confcontratacion;
    private $_datosmaestros;
    private $_facturas;
    private $_transicion;
    private $_idproceso;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_contratomodel = new GestioncontratoModel();
        $this->_idestructura = $this->global->Estructura->idestructura;
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_confcontratacion=new ConfContratacionModel();
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->_facturas = new GestionfacturasModel();
        $this->_transicion = new NomTransicion();
        $this->_hito = new DatHitoContrato();
        $this->_producto = new DatIndicadorContrato();
        $this->_idproceso = 'solicitudpago';
        $estado = new NomEstado();
        $this->_estadosAceptados = $estado->getEstadoTrabajoTerminado();
        $estados=array();
        foreach($this->_estadosAceptados as $est){
            $estados[]=$est['idestado'];
        }
        $this->_idestadosAceptados=implode(',', $estados);
    }

    public function cargarContratos($params)
    {
        $params = $this->crearFiltrosContratoPorDefecto($params);
        $result = $this->_contratomodel->getContratos($params);
//        foreach($result['data'] as $pos=>$valor){
//            $objDoctrine = Doctrine_Manager::getInstance();
//            $conexionActual = $objDoctrine->getCurrentConnection();
//            foreach($valor['monedas'] as $index=>$mon){
//                $dato = $conexionActual->fetchAll(
//                    'SELECT SUM(fm.valor), fm.idmoneda,
//                    FROM mod_crmcontratacion.dat_facturamoneda fm
//                    INNER JOIN mod_crmcontratacion.dat_facturasolicitudpago fs
//                    ON fs.idfactura=fm.idfactura
//                    INNER JOIN mod_crmcontratacion.dat_solicitudpago sp
//                    ON sp.idsolicitudpago=fs.idsolicitudpago
//                    WHERE
//                    fm.idmoneda='.$mon['idmonedaentidad'].' AND
//                    sp.idcontrato='.$valor['idcontrato'].' GROUP BY fm.idmoneda'
//                );
//                $result['data'][$pos]['monedas'][$index]['monto_solicitud']=$dato[0]['sum'];
//                $result['data'][$pos]['monedas'][$index]['monto_restante']=$mon['monto']-$dato[0]['sum'];
//            }
//        }
//        $result['metaData']['fields'][]=array('name'=>'montos_solicitudes', 'type'=>'array');
        return $result;
    }
     public function cargarHitos($params){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $instance = $conexionActual->fetchAll(
            'SELECT sp.idsolicitudpago, spo.hitos FROM mod_crmcontratacion.dat_solicitudpago sp
                      LEFT JOIN mod_crmcontratacion.dat_solicitudpagoobjetivo spo ON sp.idsolicitudpago=spo.idsolicitudpago 
                      WHERE sp.idsolicitudpago='.$params['idsolicitudpago'] . ' LIMIT 1');
        $result1 = array();
        if($instance[0]['hitos']) {
            $stringAux = substr($instance[0]['hitos'], 2, -2);
            $recorrer = split(",", $stringAux);
            foreach ($recorrer as $hito) {
                $resultaaa = $conexionActual->fetchAll('SELECT h.numero, h.descripcion, ne.nombre, ne.icono
                FROM mod_crmcontratacion.dat_hito h 
                LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON he.idhito=h.idhito
                LEFT JOIN mod_crmcontratacion.nom_estado ne ON he.idestado=ne.idestado
                WHERE h.idhito=' . $hito);
                if (count($resultaaa) > 0) {
                    $result1[] = $resultaaa[0];
                }

            }
        }
        return $result=array('data'=>$result1);
    }
    public function crearFiltrosContratoPorDefecto($params)
    {
        if (!$params['filter']) {
            $params['filter'] = [];
        }

        $params['filter'][] = array('field' => 'vigente', 'data' => array('type' => 'boolean', 'value' => true));
//        $params['filter'][] = array('field' => 'contratomarco', 'data' => array('type' => 'boolean', 'value' => no));
        $params['filter'][] = array('field' => 'cliente', 'data' => array('type' => 'boolean', 'value' => no));
        $params['filter'][] = array('field' => 'estadoinicial',
            'data'  => array('type'  => 'list',
                'value' => '['.$this->_idestadosAceptados.']'));
//        $params['filter'][] = array('field' => 'montototal',
//            'data'  => array('type' => 'numeric', 'comparison' => 'gt', 'value' => 0));
        return $params;
    }

    public function listarSolicitudesPago($params){
        $result=DatSolicitudPago::listarSolicitudesPago($params);
        $result['estados'] = $this->obtenerEstados();
//        $instance=null;
//        $instance=Doctrine::getTable('DatSolicitudPagoObjetivo')->findBy('idsolicitudpago', $params['idsolicitudpago'])->getFirst();
//        yo.todosHitos=[];
//        foreach(json_decode($instance->hitos) as yo.todosHitos){
        return $result;
    }

    public function obtenerEstados(){
        $idroles = $this->_facturas->getRoles();
        $result = $this->_transicion->getEstadoTransicionesPermisos($this->_idproceso, $idroles);
//        print_r($result);
        return $this->_facturas->changeResponse($result);
    }

    public function cargarEstados($idproceso, $mostrarInicial=true){
        if(is_null($idproceso)){
            $idproceso=$this->_idproceso;
        }
        $idroles = $this->_facturas->getRoles();
//        $result = $this->_transicion->getEstadoTransicionesPermisos($this->_idproceso, $idroles);
        try {
            if(!$this->_idproceso && !$idroles){
                return array();
            }
            $stringIdsRol = '(' . implode(",", $idroles) . ')';
            $result= Doctrine_Query::create()
                ->select('ne.*, nt.*,rt.*')
                ->from('NomEstado ne')
                ->leftJoin('ne.NomTransicion nt ON nt.idestadoinicial = ne.idestado OR nt.idestadofinal = ne.idestado')
                ->leftJoin('nt.DatRolTransicion rt WITH rt.idrol IN ' . $stringIdsRol)
                ->leftJoin('nt.NomProceso np')
                ->where('np.identificador =?', $idproceso);
            if(!$mostrarInicial){
                $result->andWhere('ne.inicial =?', 0);
            }
            return $result->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }

    }

    public function guardarSolicitudPago($params){
        try {
            $solicipago = new DatSolicitudPago();
            if ($params['idsolicitudpago'] != '') {
                $solicipago = Doctrine::getTable('DatSolicitudPago')->
                find($params['idsolicitudpago']);
            }
            $solicipago->descripcion = $params['descripcion'];
            $solicipago->objetivos = $params['objetivos'];
            $solicipago->codigo = $params['codigo'];
            $solicipago->idarea = $params['idarea'];
            $solicipago->idformapago = $params['idformapago'];
            $solicipago->fecharecibo = $params['fecharecibo'];
            $solicipago->idcontrato = $params['idcontrato'];
            $solicipago->idestructuracomun = $this->_idestructura;
            $solicipago->save();
            if ($params['idsolicitudpago'] == '') {
                $idestado = $this->obtenerEstadoinicial();
                $this->cambiarEstado(array('idestado' => $idestado,
                    'idsolicitudpago' => $solicipago->idsolicitudpago));
            }
            if ($params['facturas']) {
                $facturas = json_decode($params['facturas']);
                if ($facturas->modificadas) {
//                foreach($facturas->modificadas as $factura){
                    $this->guardarFacturasSolicitudPago(
                        $facturas->modificadas, $solicipago->idsolicitudpago,
                        $solicipago->idestructuracomun, $params);
//                }
                }
                if ($facturas->eliminadas) {
                    $this->eliminarFacturas($facturas->eliminadas);
                }
            }
            if(count(json_decode($params['hitos']))>0 || count(json_decode($params['indicadores']))>0){
                $instance=Doctrine::getTable('DatSolicitudPagoObjetivo')->
                findBy('idsolicitudpago', $solicipago->idsolicitudpago)->getFirst();
//                print_r(count($instance));die;
                if(!$instance){
//                    print('aaaaa');die;
                    $instance=new DatSolicitudPagoObjetivo();
                    $instance->idsolicitudpago=$solicipago->idsolicitudpago;
                }
                $instance->hitos=count(json_decode($params['hitos']))>0?json_encode($params['hitos']):null;
                $instance->indicadores=count(json_decode($params['indicadores']))>0?json_encode($params['indicadores']):null;
                $instance->save();
            }else{
                $instance=Doctrine::getTable('DatSolicitudPagoObjetivo')->
                findBy('idsolicitudpago', $solicipago->idsolicitudpago)->getFirst();
                if($instance){
                    $instance->delete();
                }
            }
            $cantArchivos=0;
            foreach($_FILES as $file){
                if($file['name']!='')
                    $cantArchivos+=1;
            }
            return array('success' => true, 'code' => 1,
                'gestordoc' => $this->existeGestorDocumental(),
                'archivos'=>$cantArchivos);
//                'archivos'=>count($_FILES));
        }catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
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

    public function cambiarEstado($params){
        try {
            $datosrolesobligatorios=NomTransicion::obtenerRolesObligatorios(array('idtransicion'=>$params['idtransicion']));
            $ultimoestado=$this->obtenerUltimoEstado($params['idsolicitudpago']);
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
            $this->actualizarRolesObligatorios(json_encode($rolesparticipados), $params['idsolicitudpago']);
            if($seguir) {
                $this->cambiarFechaFinEstado($params['idsolicitudpago']);
                $estado = new DatSolicitudPagoEstado();
                $estado->idsolicitudpago = $params['idsolicitudpago'];
                $estado->idestado = $params['idestado'];
                $estado->fechainicio = date('d/m/Y');
                $estado->idusuario = $this->global->Perfil->idusuario;
                $estado->save();
                $instance = null;
                $instance = Doctrine::getTable('DatSolicitudPagoObjetivo')->
                findBy('idsolicitudpago', $params['idsolicitudpago'])->getFirst();
                if ($instance != null && $instance->hitos) {
                    foreach (explode(',', substr(json_decode($instance->hitos), 1, strlen($instance->hitos) - 4)) as $hito) {
                        $anterior = Doctrine::getTable('DatHitoEstado')->findByDql(
                            'idhito=? and fechafin ISNULL', array($hito)
                        );
                        if (count($anterior)) {
                            $anterior = $anterior[0];
                            $anterior->fechafin = date('d/m/Y');
                            $anterior->save();
                        }
                        $instance = new DatHitoEstado();
                        $instance->idestado = $params['idestado'];
                        $instance->idhito = $hito;
                        $instance->idusuario = $this->global->Perfil->idusuario;
                        $instance->fechainicio = date('d/m/Y');
                        $instance->save();
                    }
                }
            }
            return array('code' => 1, 'success' => true, 'datos'=>array(
                'cantidadrolesobligatorios'=>count($datosrolesobligatorios), 'obligatoriosefectuados'=>$obligatoriosefectuados, 'nuevoestado'=>$seguir));
        }catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function obtenerUltimoEstado($idsolicitudpago)
    {
        $result=Doctrine_Query::create()
            ->select('*')
            ->from('DatSolicitudPagoEstado')
            ->where('fechafin is NULL and idsolicitudpago = ? ', $idsolicitudpago)->fetchArray();
        return count($result)?$result[0]:null;
    }

    public function actualizarRolesObligatorios($rolesobligatorios, $idsolicitudpago)
    {
        Doctrine_Query::create()
            ->update('DatSolicitudPagoEstado')
            ->set('rolesobligatorios', '?', $rolesobligatorios)
            ->where('fechafin is NULL AND idsolicitudpago =? ', $idsolicitudpago)->execute();
    }

    private function cambiarFechaFinEstado($idsolicitudpago)
    {
        try {
            $instance = Doctrine::getTable('DatSolicitudPagoEstado')
                ->findByDql('idsolicitudpago=? and fechafin ISNULL',
                    array($idsolicitudpago));
                      if (count($instance)) {
                $instance = $instance[0];
                $instance->fechafin = date('d/m/Y');
                $instance->save();
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function eliminarFacturas($idfacturas){
//        $query = Doctrine_Query::create();
//        $query->delete()->from('DatFacturaSolicitudPago')
//            ->whereIn('idfactura', $idfacturas)
//            ->execute();
//        $objDoctrine = Doctrine_Manager::getInstance();
//        $conexionActual = $objDoctrine->getCurrentConnection();
        foreach($idfacturas as $factura){
            if($factura->idnodoarchivo){
                $this->_gestordocumental->delFile(array($factura->idnodoarchivo));
            }
            $query = Doctrine_Query::create();
            $query->delete()->from('DatFacturaSolicitudPago')
                ->where('idfactura=?', $factura->idfactura)->execute();
        }
    }

    public function guardarFacturasSolicitudPago(
            $facturas, $idsolicitudpago, $idestructuracomun, $parametros){

        try {
            foreach($facturas as $params) {
                $factura = $params->idfactura ?
                    Doctrine::getTable('DatFacturaSolicitudPago')->find($params->idfactura)
                    : new DatFacturaSolicitudPago();
                $factura->numero = $params->numero;
                $factura->idsolicitudpago = $idsolicitudpago;
                if ($params->archivoid && $this->existeGestorDocumental()) {
                    if (!$factura->idespaciotrabajo) {
                        $idespacio = $this->crearEspacioClienteProveedor(
                            $parametros, $idsolicitudpago, $idestructuracomun);
                        $factura->idespaciotrabajo = $this->crearEspacioContrato(
                            $idespacio, $parametros, $params);
                    }
                    $this->guardarDocumento($factura->idespaciotrabajo, $params, $idsolicitudpago);
                }
                $factura->save();
                if ($params->monedas) {
                    foreach ($params->monedas as $moneda) {
                        DatFacturaMoneda::guardarFacturaMoneda(
                            $moneda, $factura->idfactura);
                    }
                }
            }
        } catch (Doctrine_Exception $e) {
//                print('/*error:' . $e->getCode() . '*/');
//                print_r($e->errorMessage());
            throw $e;
//                return array('code' => $e->getCode(), 'msg' => $e->errorMessage(), 'success' => false);
        }

    }

    private function guardarDocumento($idespacio, $params, $idsolicitudpago){
        $this->establecerNombreDocumento($params, $idsolicitudpago);
        if(count($_FILES) && $idespacio){
//            $gestordocumental=new GestorDocumentalComunicationInterface();
            if($this->_gestordocumental->testGD()){
                foreach($_FILES as $index=>$file){
                    if($index==$params->archivoid){
                        if($params->idfactura){
//                            $this->integrator->gestordocumental->editDocument(
//                                $idespacio, $file);
                            $this->_gestordocumental->delFile(array($params->idnodoarchivo));
                        }
                        $this->saveDocument($file, $idespacio);
                    }
                }
            }
//            $documento = $gestordocumental->saveDocument($idespacio);
//            if (count($documento) == 0) {
//                throw new Exception('Ocurrio un error al salvar el documento.', 335);
//            }
        }
    }

    public function saveDocument($file, $idnodo){

        if ($file['name']) {
            $result = $this->_gestordocumental->saveDocument($idnodo);
            if ($result->id) {
                $documentos[] = array('id' => $result->id, 'name' => $file['name']);
            } else {
                return;
            }
        }
    }

    public function crearEspacioClienteProveedor($parametros, $idsolicitudpago, $idestructuracomun)
    {
        try {
            $idespacio = $this->getIdEspacioTrabajo();
            $coneccion = Doctrine_Manager::getInstance()->getCurrentConnection()->getName();
            $parametros = array('idclientesproveedores' => $idsolicitudpago,
                'idestructuracomun'     => $idestructuracomun,
                'idespaciotrabajo'      => $idespacio,
                'coneccion'             => $coneccion);
//            $datosmaestros = new DatosMaestrosComunicationInterface();
            $resultado = $this->_datosmaestros->getEspacioTrabajoCliente($parametros);
            if (count($resultado)) {
                $idespacio = $resultado['idespaciotrabajo'];
            }
            return $idespacio;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function crearEspacioContrato($idespacio, $parametros, $params){
        try {
            $idespacio1 = $this->_gestordocumental->CreateWorkSpace(
                $idespacio, 'Contrato '.$parametros['contrato']);
            $idespacio2 = $this->_gestordocumental->CreateWorkSpace(
                $idespacio1, 'Solicitud de pago '.$parametros['codigo']);
            $idespacio3 = $this->_gestordocumental->CreateWorkSpace(
                $idespacio2, 'Factura #'.$params->numero);
            return $idespacio3;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getIdEspacioTrabajo()
    {
//        $result = $this->_confcontratacion->loadContractdoc();
        $result = $this->_confcontratacion->loadConfSolicitudPago();
        return $result[0]['idespaciotrabajo'];
    }

    public function establecerNombreDocumento($parametros, $idsolicitudpago)
    {
        foreach ($_FILES as $k => $file) {
//            $id = explode("doc_", $k)[1];
            if ($_FILES[$k]['name']) {
                $_FILES[$k]['realname'] = $_FILES[$k]['name'];
            } else {
                unset($_FILES[$k]);
            }
        }
    }

    public function eliminarSolicitudesPago($solicitudes){
        $upEx = array();
//        try {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        foreach ($solicitudes as $del) {
            $facturas=$conexionActual->fetchAll('
                    SELECT f.idespaciotrabajo 
                    FROM mod_crmcontratacion.dat_facturasolicitudpago f
                    WHERE f.idsolicitudpago='.$del->id);
            foreach($facturas as $fac){
                if ($fac['idespaciotrabajo'] && $this->existeGestorDocumental()) {
                    $this->_gestordocumental->delFile(array($fac['idespaciotrabajo']));
                }
            }
            $query
                = "DELETE FROM mod_crmcontratacion.dat_solicitudpago ";
            $query .= " WHERE idsolicitudpago = " . $del->id;
            $query .= " RETURNING idsolicitudpago ;";

            $ex = $conexionActual->fetchAll($query);
            if (!$ex) {
                $upEx[] = $del->codigo;
            }
        }
//        }catch(Doctrine_Exception $e){
//            $upEx[] = $del->nombre;
//    //                $upEx[] = array(nombre=>$del->nombre, mensaje=>$e->getMessage());
//        }
        if (empty($upEx)) {
            return array('success' => true);
        }
        return array('success' => false, $upEx);
    }

    public function cargarFacturas($params){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $gestordoc=$this->existeGestorDocumental();
        $datos = $conexionActual->fetchAll(
            'SELECT fsp.* 
            FROM mod_crmcontratacion.dat_facturasolicitudpago fsp
            WHERE fsp.idsolicitudpago='.$params['idsolicitudpago'].
            'ORDER BY fsp.numero'
        );

        foreach($datos as $pos=>$valor){

            $monedas = $conexionActual->fetchAll(
                'SELECT fm.valor, m.codigoiso
                FROM mod_crmcontratacion.dat_facturamoneda fm
                LEFT JOIN mod_datosmaestros.nom_moneda m ON fm.idmoneda=m.idmoneda
                WHERE fm.idfactura='.$valor['idfactura']);
            foreach($monedas as $mon){
                $datos[$pos]['importe'.strtolower($mon['codigoiso'])]=$mon['valor'];
            }
            if($gestordoc){
                try {
                    $datosAnexo = $this->getFile($valor);
                    if (count($datosAnexo) > 0) {
                        $datos[$pos]['idnodoarchivo'] = $datosAnexo[0]['idnodo'];
                        $datos[$pos]['archivoNombre'] = $datosAnexo[0]['nombre'];
                        $datos[$pos]['archivo'] = $datosAnexo[0]['url'];
                    }
                }catch(Exception $e){
                    return array('code' => $e->getCode(), 'msg' => $e->errorMessage(), 'success' => false);
                }
            }
        }
        $cant = $conexionActual->fetchAll(
            'SELECT count(fsp.idfactura) 
            FROM mod_crmcontratacion.dat_facturasolicitudpago fsp
            WHERE fsp.idsolicitudpago='.$params['idsolicitudpago']
        );
        $result=array('data'=>$datos, 'total'=>$cant[0]['count'], 'gestordoc'=>$gestordoc);
        return $result;
    }

    public function getFile($params)
    {
        try {
            $resultado = [];
            $contrato = Doctrine::getTable("DatFacturaSolicitudPago")->find($params['idfactura']);
            if (
//                $this->existeGestorDocumental() &&
                !empty($contrato->idespaciotrabajo)) {

                $documentos = $this->_gestordocumental->getContenido(
                    array('idespaciotrabajo' => $contrato->idespaciotrabajo)
                );
                foreach ($documentos as $doc) {
                    $params['iddocument'] = $doc['idnodo'];
                    $result = $this->_gestordocumental->getFile($params);
//                    print_r($result);die;
                    if ($result) {
                        $resultado[] = array(
                            'nombre' => $doc['nombre'],
                            'url'    => $result,
                            'idnodo' => $doc['idnodo']
                        );
                    }
                }
                return $resultado;
            }
            return array();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function existeGestorDocumental()
    {
        try {
            $result = $this->_confcontratacion->loadConfSolicitudPago();
            if (count($result) && $result[0]['activo'] &&
                $this->_gestordocumental->testGD()) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerNumeroCodigo($params){
//        print_r($params['idarea'].'*/');
//        print_r(intval($params['idarea']).'*/');
//        print_r(json_decode($params['idarea']));
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $result=$conexionActual->fetchAll(
            "SELECT count(s.idsolicitudpago) FROM mod_crmcontratacion.dat_solicitudpago s
            WHERE s.idarea=".json_decode($params['idarea'])
        );
//        prunt_r(numfmt_format('', $result[0]['count']+1));
        return str_pad($result[0]['count']+1, 3, '0', STR_PAD_LEFT);
    }

    public function cargarMediosPago($params){
        $result=array();
        $extraWhere='';
        if($params['query']){
            $extraWhere=" mp.nombre ILIKE '%".$params['query']."%' ";
        }

        if($params['idcontrato']) {
            if($extraWhere!='')$extraWhere=" AND ".$extraWhere;
            $result = $this->doQuery(
                "SELECT mp.idmediodepago, mp.nombre
            FROM mod_crmcontratacion.dat_mediopagocontrato mpc
            LEFT JOIN mod_crmcontratacion.nom_mediodepago mp ON mpc.idmediopago=mp.idmediodepago
            WHERE mpc.idcontrato=" . $params['idcontrato']." ".$extraWhere
            );
        }
        if(count($result)==0) {
            if($extraWhere!='')$extraWhere=" WHERE ".str_replace(' AND ', '',$extraWhere);
            $result= $this->doQuery(
                "SELECT mp.idmediodepago, mp.nombre
                    FROM mod_crmcontratacion.nom_mediodepago mp ".$extraWhere
            );
        }
        return $result;
    }

    public function getHitos($params){
//        $filt = new stdClass();
//        $filt->property = 'idcontrato';
//        $filt->value = $params['idcontrato'];
//        $filt->idestructura = $this->_idestructura;
        $params['idestructura'] = $this->_idestructura;
        $params['idcontratos'] = $params['idcontrato'];
//        print_r($filt);die;
//        $filt->listofactura = $params['listofactura'];
        $result= $this->_hito->cargarhitoscontrato($params);
        return $result;
    }

    public function getProductos($params){
        $params['idestructura']=$this->_idestructura;
        $result= $this->_producto->getByParams($params);
        return $result;
    }

    public function filterliststore(){
        return $this->_estadosAceptados;
    }

    public function doQuery($query){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        return $conexionActual->fetchAll($query);
    }

    public function obtenerContenidoCorreo($params){
        $model=new NomEstado();
        $solicitud=Doctrine::getTable('DatSolicitudPago')->find($params['idsolicitudpago']);
        $params['identificacion']= 'La solicitud de pago con nombre <b style="color:#3158a0">' .$solicitud['descripcion'].'</b> ';
        $params['destinatarios']=array();
        $transicion = Doctrine::getTable('NomTransicion')->find($params['idtransicion']);
        $params['destinatarios']=$transicion['notificaciones']?json_decode($transicion['notificaciones']):null;
        if($params['destinatarios']==null)throw new Exception('No existen destinatarios.');
        return $model->obtenerContenidoCorreo($params);
    }

}
