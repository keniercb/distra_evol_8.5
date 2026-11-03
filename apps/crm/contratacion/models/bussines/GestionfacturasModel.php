<?php

/**
 * Clase encargada de la gestion de solicitudes del
 * comite de aprobacion
 *
 * @author         Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Models/Bussines
 * @copyright (c)  2016, XETID
 * @versiond        1.0
 */
class GestionfacturasModel extends ZendExt_Model
{
    private $_contratomodel;
    private $_hito;
    private $_indicador;
    private $_datosmaestros;
    private $_transicion;
    private $_indicadorhito;
    private $_idproceso;
    private $_concat;
    private $_gestordocumental;
    private $_estadoRepository;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_contratomodel = new GestioncontratoModel();
        $this->_hito = new DatHitoContrato();
        $this->_indicador = new DatIndicadorContrato();
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->_transicion = new NomTransicion();
        $this->_indicadorhito = new DatIndicadorHito();
        $this->_idproceso = 'hitospagos';
        $this->_concat = 'montomoneda_';
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_estadoRepository = new TrabajoTerminadoRepository();
        $estado = new NomEstado();
        $this->_estadosAceptados = $estado->getEstadoTrabajoTerminado();
        $estados=array();
        foreach($this->_estadosAceptados as $est){
            $estados[]=$est['idestado'];
        }
        $this->_idestadosAceptados=implode(',', $estados);
    }

    public function getEstadoTrazas($idhito)
    {
        $listEstados = $this->_estadoRepository->getEstados(array('equalIdHito' => $idhito));
        foreach ($listEstados as &$value) {
            $persona = (new PersonaComunicationInterface())->getPersona($value['idpersona']);
            $estruc = (new EstructuraComunicationInterface())->getEstructuraById($persona['idarea']);
            $value['nombreapellidos'] = $persona['nombreapellidos'];
            $value['area'] = $estruc[0]->denominacion;
            $value['duracionestado'] = $this->calcularDuracionEstado($value);
        }
        return $listEstados;
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

    public function cargarContratos($params)
    {
        $params = $this->crearFiltrosContratoPorDefecto($params);
        return $this->_contratomodel->getContratos($params);
    }

    public function crearFiltrosContratoPorDefecto($params)
    {
        if (!$params['filter']) {
            $params['filter'] = [];
        }

        if($params['listofactura']){
            $params['filter'][] = array('field' => 'listofactura',
                                        'data'  => array('type'  => 'other',
                                                         'value' => true));
        }

//        $params['filter'][] = array('field' => 'vigente',
//                                    'data'  => array('type'  => 'boolean',
//                                                     'value' => true));
        $params['filter'][] = array('field' => 'filtrodetrabajoterminado',
                                    'data'  => array('type'  => 'other',
                                                     'value' => true));
        $params['filter'][] = array('field' => 'contratomarco',
                                    'data'  => array('type'  => 'boolean',
                                                     'value' => false));
        $params['filter'][] = array('field' => 'cliente',
                                    'data'  => array('type'  => 'boolean',
                                                     'value' => true));
        $params['filter'][] = array('field' => 'montototal',
                                    'data'  => array('type'       => 'numeric',
                                                     'comparison' => 'gt',
                                                     'value'      => 0));
        $params['filter'][] = array('field' => 'estadoinicial',
                                    'data'  => array('type'  => 'list',
                                                     'value' => '['.$this->_idestadosAceptados.']'));

        return $params;
    }

    public function cargarHitos($params)
    {   
	   // print_r($params);die;
        $monedas = $this->obtenerColumnasMonedas();
        if (!count($monedas['columns']) && !count($monedas['group'])
            && !count(
                $monedas['sum']
            )
        ) {
            return array();
        }
		
		
        $params['monedas'] = $monedas['group'];
        $params['ultimocontrato'] = false;
        $params = $this->crearFiltrosHitosPorDefecto($params);
		 //die('fdsfdsfsdf');
//        $filt = new stdClass();
//        if($params['idcontratos']){
//            $filt->property = 'idcontrato';
//            $filt->value = json_decode($params['idcontratos']);
//        }
//        $filt->idestructura = $this->global->Estructura->idestructura;
//        $filt->filter=$params['filter'];
        $params['idestructura']=$this->global->Estructura->idestructura;
        $result = $this->_hito->cargarhitoscontrato($params);
//        $result = $this->_hito->getHitosDominio(
//            $params, $monedas['columns'], $monedas['group'], $monedas['sum']
//        );

        $metaData = $this->getMetaData($result[0]);
        $estados = $this->getConfiguracionEstados();
        return array('data'           => $result,
                     'cant' => $result[0]['count'],
                     'monedasentidad' => $monedas['monedas'],
                     'metaData'       => $metaData,
                     'estados' => $estados);
    }

    public function crearFiltrosHitosPorDefecto($params)
    {
        if (!$params['filter']) {
            $params['filter'] = [];
        }
        if ($params['idcontratos']) {
            $params['filter'][] = array('field' => 'dh.idcontrato',
                                        'data'  => array('type'  => 'numeric',
                                                         'value' => json_decode(
                                                             $params['idcontratos']
                                                         )));
        }
        $params['filter'][] = array('field' => 'nfe.dominiofila',
                                    'data'  => array('type'  => 'bit',
                                                     'value' => 1));
//        $params['filter'][] = array('field' => 'vigente',
//                                    'data'  => array('type'  => 'boolean',
//                                                     'value' => false));
        $params['filter'][] = array('field' => 'dc.contratomarco',
                                    'data'  => array('type'  => 'numeric',
                                                     'value' => 0));
        $params['filter'][] = array('field' => 'dc.cliente',
                                    'data'  => array('type'  => 'numeric',
                                                     'value' => 1));
        /*$params['filter'][] = array('field' => 'dc.montototal',
                                    'data'  => array('type'       => 'numeric',
                                                     'comparison' => 'gt',
                                                     'value'      => 0));
        $params['filter'][] = array('field' => 'montototal',
                                    'data'  => array('type'       => 'numeric',
                                                     'comparison' => 'gt',
                                                     'value'      => 0));
        $params['filter'] = array_merge(
            $params['filter'], $this->crearFiltroMontosNull($params['monedas'])
        );*/
        return $params;
    }

    public function crearFiltroMontosNull($monedas)
    {
        $result = [];
        foreach ($monedas as $moneda) {
            if (preg_match("/$this->_concat/i", $moneda)) {
                $result[] = array('field' => $moneda,
                                  'data'  => array('type'       => 'numeric',
                                                   'comparison' => 'null',
                                                   'value'      => 'NOTNULL'));
            }
        }
        return $result;
    }

    public function cargarProductosServicios($params)
    {
        //$params = $this->crearFiltrosProductosServiciosPorDefecto($params);
        $result = $this->_indicadorhito->cargarIndicadoresHito($params);
        foreach ($result as $indexindi => $indi) {
            $moneda = DatMonedaIndicador::cargarMonedasIndicador(
                array('idindicador' => $indi['idindicadorcontrato'],
                    'idestructura' => $this->global->Estructura->idestructura)
            );
            if (count($moneda)) {
                foreach ($moneda as $mon) {
                    if ($mon['moneda'] == 'CUP') {
                        $result[$indexindi]['precio']
                            = $mon['monto'];
                    }
                    if ($mon['moneda'] == 'CUC') {
                        $result[$indexindi]['preciodivisa']
                            = $mon['monto'];
                    }
                }
            }
//            $result[$indexindi]['indicadores'] = $indicadores;
        }
        return array('data' => $result, 'cant' => $result[0]['count']);
    }

    public function crearFiltrosProductosServiciosPorDefecto($params)
    {
        if (!$params['filter']) {
            $params['filter'] = [];
        }

        if ($params['idhito']) {
            $params['filter'][] = array('field' => 'dic.idhito',
                                        'data'  => array('type'  => 'numeric',
                                                         'value' => $params['idcontratos']));
        }


        return $params;
    }

    public function cargarFacturas($params)
    {
        return array();
    }

    public function facturar($params)
    {
        return array();
    }

    public function obtenerColumnasMonedas()
    {
        $iddominio = $this->global->Perfil->iddominio;
        $monedas = $this->_hito->obtenerMonedaDominio($iddominio);
        if (!count($monedas)) {
            return array();
        }
        $columns[] = "\"idhito\" NUMERIC";
        $group[] = "dmh.\"idhito\"";
        $sum = array();
        foreach ($monedas as $moneda) {
            $columns[]
                = "\"" . $this->_concat . strtolower($moneda['codigoiso'].'_'.$moneda['idmoneda'])
                . "\" NUMERIC";
            $group[] = "dmh.\"" . $this->_concat . strtolower(
                    $moneda['codigoiso'].'_'.$moneda['idmoneda']
                ) . "\"";
            $sum[]
                = "COALESCE(dmh.\"" . $this->_concat . strtolower(
                    $moneda['codigoiso'].'_'.$moneda['idmoneda']
                ) . "\",0)";
        }
        return array('group'   => $group, 'columns' => $columns, 'sum' => $sum,
                     'monedas' => $monedas);
    }

    public function getMetaData($record)
    {
        $keys = array_keys($record);
        $fields = [];
        foreach ($keys as $key => $value) {
            $field = array('name' => $value);
            if ($value == 'fechafin' || $value == 'fechareplanificada' || $value == 'fechaestimada') {
                $field['type'] = 'date';
                $field['dateFormat'] = 'd/m/Y';
            }
            $fields[] = $field;
        }
        return array('fields' => $fields, 'idProperty' => 'idhito');
    }

    public function getConfiguracionEstados()
    {
        $idroles = $this->getRoles();
        $result = $this->_transicion->getEstadoTransicionesPermisos(
            $this->_idproceso, $idroles
        );
        return $this->changeResponse($result);
    }

    public function getRoles()
    {
        $roles = (new SeguridadComunicationInterface())->getRolsByUser(
            $this->global->Perfil->idusuario
        );
        $idroles = array();
        foreach ($roles as $val) {
            array_push($idroles, $val['idrol']);
        }

        return $idroles;
    }

    public function changeResponse($result)
    {
        foreach ($result as &$value) {
            $transicionesAutorizadas = array();
            foreach ($value['NomTransicion'] as $val) {
                if (empty($val['DatRolTransicion'])
                    || $val['idestadofinal'] == $value['idestado']
                ) {
                    continue;
                }
                array_push($transicionesAutorizadas,
                    array(
                        'idtransicion'=>$val['idtransicion'],
                        'idestado'=>$val['idestadofinal'],
                        'notificar'=>$val['notificar']
                    ));
            }

            unset($value['NomTransicion']);
            $value['transiciones'] = $transicionesAutorizadas;
            $value['acciones'] = Zend_Json::decode($value['acciones']);
        }
        return $result;
    }

    public function cambiarEstado($params)
    {
        try {
            $idhitos = is_array($params['idhitos']) ? $params['idhitos']
                : json_decode($params['idhitos']);

                foreach ($idhitos as $idhito) {
                    $datosrolesobligatorios=NomTransicion::obtenerRolesObligatorios(array('idtransicion'=>$params['idtransicion']));
                    $ultimoestado=$this->obtenerUltimoEstado($idhito);
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
                    $this->actualizarRolesObligatorios(json_encode($rolesparticipados), $idhito);
                    if($seguir) {
                        $this->cambiarFechaFinEstado($idhito);
                        $instance = new DatHitoEstado();
                        $instance->idestado = $params['idestado'];
                        $instance->idhito = $params['idhito'] = $idhito;
                        $instance->idusuario = $this->global->Perfil->idusuario;
                        $instance->fechainicio = date('d/m/Y');
                        $instance->save();

                        if ($instance->idhitoestado && count($_FILES) != 0
                            && $this->existeGestorDocumental()
                        ) {
                            $this->adicionarDocumento($params);
                        }
                    }
                }
            return array('code' => 1, 'success' => true, 'datos'=>array(
                'cantidadrolesobligatorios'=>count($datosrolesobligatorios), 'obligatoriosefectuados'=>$obligatoriosefectuados, 'nuevoestado'=>$seguir));
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function obtenerUltimoEstado($idhito)
    {
        $result=Doctrine_Query::create()
            ->select('*')
            ->from('DatHitoEstado')
            ->where('fechafin is NULL and idhito = ? ', $idhito)->fetchArray();
        return count($result)?$result[0]:null;
    }

    public function actualizarRolesObligatorios($rolesobligatorios, $idhito)
    {
        Doctrine_Query::create()
            ->update('DatHitoEstado')
            ->set('rolesobligatorios', '?', $rolesobligatorios)
            ->where('fechafin is NULL AND idhito =? ', $idhito)->execute();
    }

    private function cambiarFechaFinEstado($idhito)
    {
        try {
            $instance = Doctrine::getTable('DatHitoEstado')->findByDql(
                'idhito=? and fechafin ISNULL', array($idhito)
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

    public function cargarEstados()
    {
        try {
            return $this->_transicion->getEstadoTransicionesPermisos(
                $this->_idproceso, null, false
            );
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function modificarFechaEstimada($params)
    {
        try {
            if ($params['idhito'] && $params['fechafin']) {
                $idhitos=explode(',', $params['idhito']);
                foreach ($idhitos as $id){
                    $hito = Doctrine::getTable('DatHitoContrato')->find($id);
                    $hito->fechareplanificada = $params['fechafin'];
                    $hito->save();
                }
//                $hito = Doctrine::getTable('DatHitoContrato')->find(
//                    $params['idhito']
//                );
//                $hito->fechareplanificada = $params['fechafin'];
//                $hito->save();
            }
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function adicionarDocumento($params)
    {
        try {
            $idespacio = $this->crearEspacioTrabajoHito($params);
			//print_r($idespacio);die;
            if ($idespacio) {
                $_FILES['documento']['realname'] = $params['nombre'] . '-'
                    . date('dmYHis');
				//print_r($_FILES['documento']['realname']);die;
                return $this->_gestordocumental->saveDocument($idespacio);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function crearEspacioTrabajoHito($params)
    {
        try {
            $contrato = $this->getContratoById($params['idcontrato']);
            $hito = $this->getHitoById($params['idhito']);
            if ($hito->idespaciotrabajo) {
                return $hito->idespaciotrabajo;
            }
            if (!$contrato->idespaciotrabajo) {
                $contrato->idespaciotrabajo
                    = $this->_contratomodel->crearEspacioContrato(
                    $contrato->toArray(), $contrato->idcontrato
                );
            }
            $hito->idespaciotrabajo = $this->_gestordocumental->CreateWorkSpace(
                $contrato->idespaciotrabajo,
                $hito->numero . ' - ' . $hito->descripcion
            );
            $hito->save();
            return $hito->idespaciotrabajo;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getContratoById($idcontrato)
    {
        try {
            return Doctrine::getTable('DatContrato')->find($idcontrato);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getHitoById($idhito)
    {
        try {
            return Doctrine::getTable('DatHitoContrato')->find($idhito);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerDocumentos($params)
    {
        try {
            $result = array();
            if ($this->existeGestorDocumental()) {
                $hito = $this->getHitoById($params['idhito']);
               return $this->_gestordocumental->getContenidoDocuemtos(
                    $hito->idespaciotrabajo
                );
            }
            return $result;
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'success' => false,
                         'msg'  => $e->getMessage());
        }
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

    public function modificarServicios($params){
        $indicadores=json_decode($params['indicadores']);
        foreach ($indicadores as $i){
            $indicador=Doctrine::getTable('DatIndicadorHito')->find($i->indicadores);
            if($indicador){
                $indicador->denominacion=$i->denominacion;
                $indicador->idindicador=$i->idindicador;
                $indicador->save();
            }
        }
        return array('success'=>true);
    }

    public function filterliststore(){
        return $this->_estadosAceptados;
    }

    public function modificarArea($params){
        try {
            if ($params['idhito'] && $params['idarea']) {
                $idhitos=explode(',', $params['idhito']);
                foreach ($idhitos as $id){
                    $hito = Doctrine::getTable('DatHitoContrato')->find($id);
                    $hito->idarea = $params['idarea'];
                    $hito->save();
                }
            }
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }
    public function guardarDocumentosHitos($params){
//        print_r($params);print_r(' / ');
//        print_r($params['editfile']);print_r(' / ');
//        print_r(json_decode($params['delfile']));print_r(' / ');die;
        $existegd = $this->existeGestorDocumental();
        if ($existegd && count($_FILES) != 0) {
            $modificados = json_decode($params['editfile']);
            $eliminados = json_decode($params['delfile']);
			//print_r($params);die;
            $documento=$this->adicionarDocumento($params);
            if (count($documento) == 0) {
                throw new Exception(
                    'Ocurrio un error al salvar el documento.', 335
                );
            }
            if (count($modificados)) {
                $this->modificarDocumentos($modificados);
            }
            if (count($eliminados)) {
                $this->eliminarDocumentos($eliminados);
            }
        }
        return array('success'=>true);
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

    public function getFacturaHito($params){
        try {
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $result = $conexionActual->fetchAll("
              SELECT ef.preciotarifaoriginal, df.nrofactura, df.fechavencimiento, df.dias, 
              d.nrodoc, d.anno, d.fechacontable, d.observaciones, tp.nombre as condicionpago,
              COALESCE (ef.preciotarifaoriginal*ef.cantidad, ef.preciotarifabase*ef.cantidad) as importecontable, 0 as importealt
              FROM  mod_logfacturacion.dat_elementosfactura ef 
               INNER JOIN mod_logfacturacion.dat_docfactura df ON (df.idfactura=ef.idfactura) 
               INNER JOIN mod_logistica.dat_documento d ON (d.iddocumento=df.idfactura)
               LEFT JOIN mod_datosmaestros.nom_terminosdepago tp ON (tp.idterminodepago=df.idcondicionpago)
               WHERE d.estado=4 and ef.idhito=".$params['idhito']
            );
            return array('success' => true, 'data' => $result[0]);
//            return array('success' => true, 'data' => count($result)>0?$result[0]:array());
        }catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerContenidoCorreo($params){
        $model=new NomEstado();
        $idhitos = is_array($params['idhitos']) ? $params['idhitos']: json_decode($params['idhitos']);
//        print_r(implode(',',$idhitos));die;
//        $hitos=Doctrine::getTable('DatHito')->findByDql('idhito IN (?)', array($idhitos));
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
//        print_r("SELECT h.descripcion, h.numero, c.nombre as nombrecontrato, c.numero as numerocontrato
//                FROM mod_crmcontratacion.dat_hito h
//                LEFT JOIN mod_crmcontratacion.dat_contrato c ON (c.idcontrato=h.idcontrato)
//                WHERE h.idhito IN (".implode(',',$idhitos).")");die;
        $hitos=$conexionActual->fetchAll(
            "SELECT h.descripcion, h.numero, c.nombre as nombrecontrato, c.numero as numerocontrato 
                FROM mod_crmcontratacion.dat_hito h 
                LEFT JOIN mod_crmcontratacion.dat_contrato c ON (c.idcontrato=h.idcontrato)
                WHERE h.idhito IN (".implode(',',$idhitos).")"
        );

        if(count($hitos)>1) {
            $params['identificacion']='Las obligaciones financieras:';
            foreach ($hitos as $actual) {
                $params['identificacion'] .= '<br>-Número <b style="color:#3158a0">' .$actual['numero'].
                    '</b> con descipción <b style="color:#3158a0">' .$actual['descripcion'].'</b> del contrato 
                    <b style="color:#3158a0">'.$actual['nombrecontrato'].'</b> con número 
                    <b style="color:#3158a0">'.$actual['numerocontrato'].'</b> ';
            }
            $params['identificacion'] .= '<br>';
        }else if(count($hitos)==1){
            $params['identificacion'] = 'La obligación financiera número <b style="color:#3158a0">' .$hitos[0]['numero'].
                '</b> y con decripción <b style="color:#3158a0">' .$hitos[0]['descripcion'].'</b> del contrato 
                    <b style="color:#3158a0">'.$hitos[0]['nombrecontrato'].'</b> con número 
                    <b style="color:#3158a0">'.$hitos[0]['numerocontrato'].'</b> ';
        }
        $params['destinatarios']=array();
        $transicion = Doctrine::getTable('NomTransicion')->find($params['idtransicion']);
        $params['destinatarios']=$transicion['notificaciones']?json_decode($transicion['notificaciones']):null;
        if($params['destinatarios']==null)throw new Exception('No existen destinatarios.');
        return $model->obtenerContenidoCorreo($params);
    }

    public function limpiarEspacioTrabajo($params)
    {
        try {
            if ($params['idhito']) {
                $hito = Doctrine::getTable('DatHitoContrato')->find(
                    $params['idhito']
                );
                if ($hito) {
                    $hito->idespaciotrabajo = null;
                    $hito->save();
                } else {
                    throw new Exception('El hito ha sido eliminado. Recarge la lista de contratos.', 333);
                }
            }
            return array('success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }
} 