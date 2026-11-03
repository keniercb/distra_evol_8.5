<?php

/**
 * DesgloseindicadoresporfechaController
 * Controlador para gestionar los desgloses por fecha
 *
 * @ author 
 * @ package Planificaci?n
 * @ subpackage Planificaci?n Empresarial y Presupuestaria
 * @ copyright Planificacion
 * @ version 1.0-0
 * */
class Gestsolicitudes711Controller extends ZendExt_Controller_Secure {

    public function init() {
        $this->_meta = ZendExt_Metadata::getInstance();
        parent::init();
    }

    public function gestsolicitudes711Action() {

        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    /*     * Ejercicio actual y la lista de ejecicios
     */

    public function getEjerciciosAction() 
    {
        $data = null;
//        $data->data = $this->pIntegrator->planmeta->obtenerEjercicios();
//        $data->idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        
        $parametros['tipoplan'] = 1254;

        ini_set("max_execution_time", 3600); //1hora
        //Creando el modelo de negocio de gestion de usuarios.
        $modeloplan = new DatPlan711Model();
        $data->data = $modeloplan->listarPlanes711($parametros);
        echo json_encode($data);
    }

    public function listarDatosAction(){
        $uri= $this->_request->getPost('uri');
//        $valor=null;
//        if($uri==1){
//            $valor->uri='FuentesdeFinanciamiento';
//        }
        if($uri==2){
//            $valor->uri='Conceptodecompra';
            $rolepersona= $this->_request->getPost('rolepersona');
        }
//        if($uri==3){
//            $valor->uri='EmpresaImportadora';
//        }
//        if($uri==4){
//            $valor->uri='SituaciondelPedido';
//        }
//        if($uri==5){
//            $valor->uri='PRODUCTO';
//        }
//        if($uri==6){
//            $valor->uri='Gerente';
//        }
//        if($uri==7){
//            $valor->uri='Unidaddecompra';
//        }
//        if($uri==14){
//            $valor->uri='Cubicaje';
//        }
//        if($uri==15){
//            $valor->uri='Accionesencontrato';
//        }
//        if($uri==16){
//            $valor->uri='Formasdepago';
//        }
//        if($uri==20){
//            $valor->uri='GrupoComercial';
//        }
//        if($uri==21){
//            $valor->uri='Condiciondecompra';
//        }
//        if($uri==22){
//            $valor->uri='Proveedor';
//        }
//        $data = array();
//        $modelonomenclador = new NomDatosnomenclador();
//        $resultados = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        $modelPlan = new DatPlan711Model();
        $resultados = $modelPlan->listarDatos($uri);
        for ($index = 0; $index < count($resultados); $index++) {
            if ($resultados[$index]['denominacion'] != '-') {
                $resultados[$index]['iddatos'] = $resultados[$index]['iddatosnomenclador'];
                $data[] = $resultados[$index];
            }
        }
        if($rolepersona==300000000402){
            $data = array();
            for ($index = 0; $index < count($resultados); $index++) {
                if ($resultados[$index]['denominacion'] != '-' && $resultados[$index]['iddatosnomenclador']== 5004) {
                    $resultados[$index]['iddatos'] = $resultados[$index]['iddatosnomenclador'];
                    $data[] = $resultados[$index];
                }
            }      
        }
         if($rolepersona==300000000403||rolepersona==300000000404){
            $data = array();
            for ($index = 0; $index < count($resultados); $index++) {
                if ($resultados[$index]['denominacion'] != '-' && $resultados[$index]['iddatosnomenclador']== 5003) {
                    $resultados[$index]['iddatos'] = $resultados[$index]['iddatosnomenclador'];
                    $data[] = $resultados[$index];
                }
            }      
         }
         if($uri==15){
            $condicion= $this->_request->getPost('condicion');
            foreach ($data as $value) {
                if ($value['descripcion'] == $condicion) {
                    $resul[] = $value;
                }
            }
            $data = $resul;
        }
        echo json_encode(array("data" => $data)); 
    }

    public function MontoTotalAction() {
        
        $parametros['idejercicio']= $this->_request->getPost('idejercicio');
        $parametros['identidad']= $this->_request->getPost('identidad');
        $parametros['idempimp']= $this->_request->getPost('idempimp');
        $parametros['idcc']= $this->_request->getPost('idcc');
        $parametros['idff']= $this->_request->getPost('idff');
        $parametros['tipoplan']= $this->_request->getPost('tipoplan');
        $parametros['idplan711']= $parametros['idejercicio'];
        $modeldist = new DatDistribucionModel();
        $data=$modeldist->MontoTotal($parametros);
        echo json_encode(array("data" => $data)); 
    }
    
    public function listarSolicitudes711Action() {
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 50;  
        $parametros['filtros']= $this->_request->getPost('filtros');
        $parametros['idejercicio']= $this->_request->getPost('idejercicio');
        $parametros['identidad']= $this->_request->getPost('identidad');
        $parametros['idempimp']= $this->_request->getPost('idempimp');
        $parametros['idcc']= $this->_request->getPost('idcc');
        $parametros['idff']= $this->_request->getPost('idff');
        $parametros['tipoplan']= $this->_request->getPost('tipoplan');
        
        $data=array();
        $modelSolicitud = new DatSolicitud711Model();
        $data = $modelSolicitud->listarSolicitudes711($parametros);
        echo json_encode(array("data" => $data, "total" => $data[0]['totalsolitudes'], "codMsgD" => 1));
    }
    
    public function VerificarCreditoAction(){
        $parametros['idejercicio']= $this->_request->getPost('idejercicio');
        $parametros['identidad']= $this->_request->getPost('identidad');
        $modelodistr = new DatCodigodeCCModel();
        $resultados3 = $modelodistr->listarCodigo($parametros);
        $aprobado=array();
        if($resultados3){
            $aprobado[0]['aprobado']=1;
            echo json_encode(array("codMsgD" => $aprobado));
        }else{
            $aprobado[0]['aprobado']=0;
            echo json_encode(array("codMsgD" => $aprobado));
        }
    }
    
    public function ListarCodigoCCAction(){
        $parametros['idejercicio']= $this->_request->getPost('idejercicio');
        $parametros['identidad']= $this->_request->getPost('identidad');
        $parametros['idempimp']= $this->_request->getPost('idempimp');
        $parametros['idcc']= $this->_request->getPost('idcc');
        $modelodistr = new DatCodigodeCCModel();
        $data = $modelodistr->listarCodigo($parametros);
        echo json_encode(array("data" => $data, "total"=> count($data), "codMsgD" => 1));
    }
    
    public function adicionarModificarSolicitudAction(){
        $parametros['idejercicio']= $this->_request->getPost('idejercicio');
        $parametros['ejercicio']= $this->_request->getPost('ejercicio');
        $parametros['nombreentidad']= $this->_request->getPost('nombreentidad');
        $parametros['idempcliente']= $this->_request->getPost('idempcliente');
        $jsestructura = $this->integrator->metadatos->DameEstructura($parametros['idempcliente']);
        $parametros['abreviatura']=$jsestructura[0]->abreviatura;
        
        $parametros['iddirector']= $this->_request->getPost('iddirector');
        $parametros['iddirectorecon']= $this->_request->getPost('iddirectorecon');
        $parametros['idespecialista']= $this->_request->getPost('idespecialista');
        $parametros['idespecialistacs']= $this->_request->getPost('idespecialistacs');
        $parametros['idcomprador']= $this->_request->getPost('idcomprador');
        
        $parametros['idempimp']= $this->_request->getPost('idempimp');
        $parametros['idgrupcom']= $this->_request->getPost('idgrupcom');
        $parametros['idcc']= $this->_request->getPost('idcc');
        $parametros['idff']= $this->_request->getPost('idff');
        $parametros['idcodigodecc']= $this->_request->getPost('idcodigodecc');
        $parametros['productos']= json_decode($this->_request->getPost('productos'), true);
        $parametros['descripgen']= $this->_request->getPost('descripgen');
        $parametros['suminist']= $this->_request->getPost('suminist');
        $parametros['otrosg']= $this->_request->getPost('otrosg');
        $parametros['totalg']= $this->_request->getPost('totalg');
        $parametros['antecedentes']= $this->_request->getPost('antecedentes');
        $parametros['lugarent']= $this->_request->getPost('lugarent');
        $parametros['servsol']= json_decode($this->_request->getPost('servsol'));
        $parametros['accion']= $this->_request->getPost('accion');
        $parametros['tipoplan']= $this->_request->getPost('tipoplan');
        
        $modelSolicitud = new DatSolicitud711Model();
        if($parametros['accion']==1){
            $result = $modelSolicitud->adicionarSolicitud711($parametros);
        }
        if($parametros['accion']==2){
            $parametros['idsolicitud711']= $this->_request->getPost('idsolicitud711');
            $result = $modelSolicitud->modificarSolicitud711($parametros);
        }
        echo json_encode(array("mensaje" => $result)); 
    }
    
    public function listarConfEntidadesDestinoAction() {
        $idEstructura = ($this->_request->getPost('node')) ? $this->_request->getPost('node') : 0;
        $idcategoria = $this->_request->getPost('idcategoria');
        $dominios = $this->integrator->metadatos->DameHijosEstructura($idEstructura);
        echo json_encode($dominios);
    }
    
    public function listarConfEntidadesDestino2Action() {
        $idEstructura = $this->_request->getPost('node');
        $dominios = $this->integrator->metadatos->DameEstructura($idEstructura);
        echo json_encode($dominios);
    }
    
    public function listarProductosAction() {        
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['idempimp']= $this->_request->getPost('idempimp');
        $parametros['filtros']= $this->_request->getPost('filtros');
        $modelSolicitud = new DatSolicitud711Model();
        $data = $modelSolicitud->listarProductos($parametros);
        echo json_encode(array("data" => $data, "total"=> $data[0]['total']));
    }
    
    public function listarProductosSeleccionadosAction() {
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['idempimp']= $this->_request->getPost('idempimp');
        $parametros['productossel']= json_decode($this->_request->getPost('productossel'));
        $parametros['idsolicitud711'] = $this->_request->getPost('idsolp');
        $modelSolicitud = new DatSolicitud711Model();
        if($parametros['idsolicitud711']){
            $data = $modelSolicitud->listarProductosSolitud($parametros);
            echo json_encode(array("data" => $data, "total"=> count($data))); 
            //return;
        }
        if($parametros['productossel']) {
            $parametros['filtros'] = $this->_request->getPost('filtros');
            $result = $modelSolicitud->listarProductos($parametros);
            $data = array();
            for ($i = 0; $i < count($result); $i++) {
                $data[$i] = $result[$i];
                $data[$i]['cantidad'] = 0;
                $data[$i]['valor'] = 0;
                $data[$i]['trimestre1'] = null;
                $data[$i]['trimestre2'] = null;
                $data[$i]['trimestre3'] = null;
                $data[$i]['trimestre4'] = null;
            }
            echo json_encode(array("data" => $data, "total" => count($data)));
        }
    }
    
    public function listarPersonasAction() {
	    
        $parametros['identidad']= $this->_request->getPost('identidad');
        $parametros['idempimp']= $this->_request->getPost('idempimp');
        $parametros['tipopers']= $this->_request->getPost('tipopers');
                /**
         *  1281;"Especialista de CS"
            1282;"Director económico"
            1283;"Comprador"
            5056;"Gerente"
            5057;"Director"
            5058;"Espcialista"
         */
        if($parametros['tipopers']==1){
            $parametros['uri']= 5057;
        }
        if($parametros['tipopers']==2){
            $parametros['uri']= 5058;
        }
        if($parametros['tipopers']==3){
            $parametros['uri']= 5056;
        }
        if($parametros['tipopers']==4){
            $parametros['uri']= 1281;
        }
        if($parametros['tipopers']==5){
            $parametros['uri']= 1282;
        }
        if($parametros['tipopers']==6){
            $parametros['uri']= 1283;
        }
        $modelSolicitud = new DatSolicitud711Model();
        $result = $modelSolicitud->listarPersonas($parametros);
        $data = array();
        for ($i = 0; $i < count($result); $i++) {
            $data[$i]['idpersonadel711']=$result[$i]['idpersonadel711'];
            $data[$i]['nombreapell']=$result[$i]['categoria'].' '.$result[$i]['nombre'].' '.$result[$i]['apellidos'];
        }
        echo json_encode(array("data" => $data, "total"=> count($data)));
    }
    
    public function AprobarDesaprobarAction() {

        $parametros['accion']= $this->_request->getPost('accion');
        $parametros['idsolicitud711']= $this->_request->getPost('idsolicitud711');
        $parametros['motivo']= $this->_request->getPost('textorchazo');
        $parametros['usuario'] = $this->global->Perfil->usuario;
        $parametros['aprobacion'] = $this->_request->getPost('aprobacion');

        $modelSolicitud = new DatSolicitud711Model();
        if ($parametros['accion'] == 1) {            
            $parametros['motivo']="Aprobador por {$parametros['usuario']}";
            $parametros['tipo'] = 3;
            $modelmotivo = new DatMotivoModificacionModel();
            $salida = $modelmotivo->AdicionarMotivo($parametros);
            $result = $modelSolicitud->Aprobar($parametros);
        }
        if ($parametros['accion'] == 2) {
            $parametros['motivo']="Desaprobado por {$parametros['usuario']}";
            $parametros['motivo'].= " Motivo:".$this->_request->getPost('textorchazo');
            $parametros['usuario'] = $this->global->Perfil->usuario;
            $parametros['tipo'] = 3;
            $modelmotivo = new DatMotivoModificacionModel();
            $salida = $modelmotivo->AdicionarMotivo($parametros);
            $result = $modelSolicitud->Desaprobar($parametros);
        }
        echo json_encode(array("msg" => $result['resulatdo'], "usuarios"=>$result['usuarios']));
    }
    
    public function listarEmbarquesAction(){
        $fuentes= json_decode($this->_request->getPost('fuentes'));
        $data = array();
        $valor->uri='FuentesdeFinanciamiento';
        $modelonomenclador = new NomDatosnomenclador();
        $resultados = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        for ($i = 0; $i < count($fuentes); $i++) {
            for ($index = 0; $index < count($resultados); $index++) {
                if ($resultados[$index]['iddatosnomenclador'] == $fuentes[$i]) {
                    $data[$i]['iddatosff'] = $resultados[$index]['iddatosnomenclador'];
                    $data[$i]['fuentes'] =  $resultados[$index]['denominacion'];
                    $data[$i]['monto'] = 0;
                    $data[$i]['fechaposible'] = null;
                }
            }
        }
        echo json_encode(array("data" => $data, "total"=> count($data)));
    }
    
    public function listarDetallesEmbarquesAction(){
        $cubicaje= json_decode($this->_request->getPost('cubicaje'));
        $data = array();
        $valor->uri='Cubicaje';
        $modelonomenclador = new NomDatosnomenclador();
        $resultados = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        for ($i = 0; $i < count($cubicaje); $i++) {
            for ($index = 0; $index < count($resultados); $index++) {
                if ($resultados[$index]['iddatosnomenclador'] == $cubicaje[$i]) {
                    $data[$i]['iddatoscubicaje'] = $resultados[$index]['iddatosnomenclador'];
                    $data[$i]['cubicaje'] =  $resultados[$index]['denominacion'];
                    $data[$i]['cantidad'] = 0;
                }
            }
        }
        echo json_encode(array("data" => $data, "total"=> count($data)));
    }
    
    public function adicionarModificarContratoAction(){
        $parametros['idsolicitud711']= $this->_request->getPost('idsolicitud711');
        $parametros['nocontrato']= $this->_request->getPost('nocontrato');
        $parametros['fechacontrat']= $this->_request->getPost('fechacontrat');
        $parametros['totalcont']= $this->_request->getPost('totalcont');
        $parametros['montoreal']= $this->_request->getPost('montoreal');
        $parametros['accionescontrato']= json_decode($this->_request->getPost('accionescontrato'));
        $parametros['formapagolista']= json_decode($this->_request->getPost('formapagolista'));
        $parametros['cubicajelista']= json_decode($this->_request->getPost('cubicajelista'));
        $parametros['accion']= $this->_request->getPost('accion');
        $parametros['idcontrato']= $this->_request->getPost('idcontrato');
        $parametros['iddatosproveedor']= $this->_request->getPost('iddatosproveedor');
        //print_r($parametros);
        //echo json_encode(array("mensaje" => 1)); 
        $modelSolicitud = new DatSolicitud711();
        $modelSolicitud->ActualizarValorReal($parametros); 
        $modelcontrato = new DatContratoModel();
        if($parametros['accion']==1){
            $result = $modelcontrato->adicionarContrato($parametros);
        }
        if($parametros['accion']==2){
            $result = $modelcontrato->modificarContrato($parametros);
        }
        echo json_encode(array("mensaje" => $result)); 
    }
    
    public function listarContratoAction(){
        $parametros['idsolicitud711']= $this->_request->getPost('idsolicitud711');
        $modelcontrato = new DatContratoModel();
        $result = $modelcontrato->listarContrato($parametros);
        echo json_encode(array("data" => $result, "total"=>  count($result))); 
    }
    
    public function listarAccionesEmbarquesCtAction(){
        $parametros['idcontrato']= $this->_request->getPost('idcontrato');
        $modelcontrato = new DatContratoModel();
        $result = $modelcontrato->listarAccionesEmbarquesCt($parametros);
        echo json_encode(array("data" => $result, "total"=>  count($result))); 
    }
    
    public function listarCtEmbFormaPagoAction(){
        $parametros['idembarque']= $this->_request->getPost('idembarque');
        $modelcontrato = new DatContratoModel();
        $result = $modelcontrato->listarCtEmbFormaPago($parametros);
        echo json_encode(array("data" => $result, "total"=>  count($result))); 
    }
    
    public function listarCtEmbFormaPagoTodoAction(){
        $parametros['idcontrato']= $this->_request->getPost('idcontrato');
        $modelcontrato = new DatContratoModel();
        $result = $modelcontrato->listarCtEmbFormaPagoTodo($parametros);
        echo json_encode(array("data" => $result, "total"=>  count($result))); 
    }
    
    public function listarDetallesEmbarqAction(){
        $parametros['idembarque']= $this->_request->getPost('idembarque');
        $modelcontrato = new DatContratoModel();
        $result = $modelcontrato->listarDetallesEmbarq($parametros);
        echo json_encode(array("data" => $result, "total"=>  count($result))); 
    }
    
    public function listarDetallesEmbarqTodoAction(){
        $parametros['idcontrato']= $this->_request->getPost('idcontrato');
        $modelcontrato = new DatContratoModel();
        $result = $modelcontrato->listarDetallesEmbarqTodo($parametros);
        echo json_encode(array("data" => $result, "total"=>  count($result))); 
    }
    
    public function SalvarFechasAction(){
        $parametros['listafechareal']= json_decode($this->_request->getPost('listafechareal'), true);
        $parametros['tipo']= $this->_request->getPost('tipo');
        //var_dump($parametros); die;
        $modelcontrato = new DatContratoModel();
        $result = $modelcontrato->SalvarFechas($parametros);
        echo json_encode(array("mensage" => $result)); 
    }
    
    public function ActualizarDatosGerenteAction(){
        $parametros['idsolicitud711']= $this->_request->getPost('idsolicitud711');
        $parametros['nopedido']= $this->_request->getPost('nopedido');
        $parametros['idgerente']= $this->_request->getPost('idgerente');
        $parametros['fechapres']= $this->_request->getPost('fechapres');
        $modelSolicitud = new DatSolicitud711Model();
        $result = $modelSolicitud->ActualizarDatosGerente($parametros);
        echo json_encode(array("codMsgD" => $result)); 
    }
    
    public function listarServicEnSolAction(){
        $parametros['idsolicitud711']= $this->_request->getPost('idsolicitud711');
        $modelSolicitud = new DatSolicitud711Model();
        $result = $modelSolicitud->listarServicEnSol($parametros);
        echo json_encode(array("lista" =>$result)); 
    }
    
    public function listarProductosSolitudAction(){
        $parametros['idsolicitud711']= $this->_request->getPost('idsolicitud711');
        $modelSolicitud = new DatSolicitud711Model();
        $result = $modelSolicitud->listarProductosSolitud($parametros);
        echo json_encode(array("lista" =>$result)); 
    }
    
    public function CambiarSituacionPedidoAction(){
        $parametros['idsolicitud711']= $this->_request->getPost('idsolicitud711');
        $parametros['idsituacionpedido']= $this->_request->getPost('idsituacionpedido');
        $parametros['motivo']= $this->_request->getPost('msgmotivo');
        $parametros['tipo'] = 3;
        $parametros['usuario'] = $this->global->Perfil->usuario;
        
        $modelSolicitud = new DatSolicitud711Model();
        $result = $modelSolicitud->CambiarSituacionPedido($parametros);
        if($parametros['motivo']!="" && $result == 1){
            $modelmotivo = new DatMotivoModificacionModel();
            $salida = $modelmotivo->AdicionarMotivo($parametros);
        }
        echo json_encode(array("codMsgD" => $result['resulatdo'], "usuarios"=>$result['usuarios'])); 
    }    
    
    public function AperturarCancelarAction(){
        $parametros['idsolicitud711']= $this->_request->getPost('idsolicitud711');
        $parametros['aperturacredito']= $this->_request->getPost('fecha');
        $modelSolicitud = new DatSolicitud711Model();
        $result = $modelSolicitud->AperturarCancelar($parametros);
        echo json_encode(array("codMsgD" => $result)); 
    } 
    
    public function listarModifAction()
    {

        $modelomodif = new DatMotivoModificacionModel();
        $paramestros['idsolicitud711'] = $this->_request->getPost('idsolicitud711');
        $paramestros['tipo'] = 3;
        $data = $modelomodif->listarModif($paramestros);
        echo json_encode(array("data" => $data, "total" => count($data)));
    }
    
    public function EliminarCTAction()
    {
        $paramestros['idsolicitud711'] = $this->_request->getPost('idsolicitud711');
        $paramestros['montoreal'] = $this->_request->getPost('montoreal');
        $paramestros['idcontrato'] = $this->_request->getPost('idcontrato');
        $modelcontrato = new DatContratoModel();
        $result = $modelcontrato->EliminarCT($paramestros);
        $modelSolicitud = new DatSolicitud711();
        $modelSolicitud->ActualizarValorReal($paramestros); 
        echo json_encode(array("mensaje" => $result)); 
    }
    
    public function ActualizarSuministrosAction()
    {
        $parametros['idsolicitud711'] = $this->_request->getPost('idsolicitud711');
        $parametros['productos'] = json_decode($this->_request->getPost('productos'),true);
        //print_r($parametros); die;
        $modelsolicitud = new DatSolicitud711Model();
        $result = $modelsolicitud->ActualizarSuministros($parametros);
//        $parametros['idsituacionpedido']= 8;
//        $result = $modelsolicitud->CambiarSituacionPedido($parametros);
        echo json_encode(array("codMsgD" => $result)); 
    }
    
    public function listarProductos711Action()
    {
        $parametros['filtros']['field'] = 'codigocup';
        $parametros['filtros']['data']['value'] = $this->_request->getPost('codigocup');
        $parametros['tipo'] = $this->_request->getPost('tipo');
        $modeloplan = new DatProducto711Model();
        $data = $modeloplan->ExisteProductos711($parametros);
        //var_dump($data); die;
        echo json_encode(array('data' => $data, 'mensaje' => $data[0]['total']));
    }

    public function adicionarProductosAction()
    {   
        $paramestros['tipo'] = $this->_request->getPost('tipo');
        $paramestros['accion'] = 1;
        $paramestros['denom'] = $this->_request->getPost('denom');
        
        if($paramestros['tipo']==0){
            $paramestros['um'] = $this->_request->getPost('um');
            $paramestros['idempimp'] = $this->_request->getPost('idempimp');
            $paramestros['precio'] = $this->_request->getPost('precio');
            $paramestros['codigocup'] = $this->_request->getPost('codigocup');
            $paramestros['numeropieza'] = $this->_request->getPost('numeropieza');
        }
        if($paramestros['tipo']==1){
            $paramestros['iddatostipocodigo'] = $this->_request->getPost('iddatostipocodigo');
            $paramestros['iddatoscodigo'] = 1247;
        }
        if($paramestros['tipo']==2){
            $paramestros['idplan711'] = $this->_request->getPost('idplan711');
        }
        
        //este param viene si es modificicacion        
        $paramestros['idproducto711'] = $this->_request->getPost('idproducto711');
        $paramestros['filtros']['field'] = 'codigocup';
        $paramestros['filtros']['data']['value'] = $this->_request->getPost('codigocup');
        $modeloplan = new DatProducto711Model();
        $data = $modeloplan->ExisteProductos711($paramestros);
        $mensage=1;
        //var_dump($data); die;
        if($data!=null){
            $mensage="El producto que intenta adicionar ya existe su codigocup";
        }
        if($mensage==1){
            $modelproducto = new DatProducto711Model();
            $modelproducto->adicionarModificarProductos($paramestros);       
        }
        echo json_encode(array('mensaje' => $mensage));
        
    }

    public function listarIndicadoresAction() {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $tipoplan = $this->_request->getPost('tipoplan');
        $filtros = $this->_request->getPost('filtros');
        $auxfilt=count($filtros) + 1;
        $filtros[$auxfilt]['field'] = 'viaadquisicion';
        $filtros[$auxfilt]['data']['type'] = 'string';
        $filtros[$auxfilt]['data']['value'] = 'Importacion directa';

        $indicadores = DatSolicitud711::ListarIndNivelPlanif(
                        $filtros, $start, $limit, $tipoplan
        );

        //var_dump($indicadores); die;
        $data = array();
        foreach ($indicadores->data as $k => $direction) {
            $data[$k]['codigo'] = $indicadores->data[$k]['codigo'];
            $data[$k]['estado'] = $indicadores->data[$k]['estado'];
            $data[$k]['idindicador'] = $indicadores->data[$k]['idindicador'];
            $data[$k]['idformato'] = $indicadores->data[$k]['idformato'];
            $data[$k]['viaadquisicion'] = $indicadores->data[$k]['viaadquisicion'];
            $data[$k]['denominacion'] = $indicadores->data[$k]['denominacion'];
            /* if ($tipoplan == 1)
              $data[$k]['precio'] = $indicadores->data[$k]['precioventa'];
              else */
            $data[$k]['precio'] = $indicadores->data[$k]['precio'];

            $data[$k]['numeropieza'] = $indicadores->data[$k]['numeropieza'];
            $datosentidad = $this->integrator->metadatos->DameEstructura($indicadores->data[$k]['identidad']);
            $data[$k]['centrobalance'] = $datosentidad[0]->denominacion;
            //busco la unidad de medida por el idunidad
            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($direction['idumedida']));
            $data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
        }

        echo json_encode(array('total' => $indicadores->total, 'data' => $data));
    }

    public function listarCentroBalanceAction() {
        $idcentrobalance = 1; //numero fijo en la BD para Nomdatosnomenclador
        $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento(
                        $idcentrobalance
        );
        foreach ($centrobalance as $k => $valor) {
            $dat [$k] ['idcentrobalance'] = $valor ['identidad'];
            $datosentidad = $this->integrator->metadatos->DameEstructura(
                    $valor ['identidad']
            );
            $dat [$k] ['centrobalance'] = $datosentidad [0]->denominacion;
            $dat [$k] ['identidaddatosnomenclador'] = $valor ['identidaddatosnomenclador'];
        }
        echo json_encode(array('data' => $dat));
    }

    public function cargarunidadmedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function cargarviaadquisionAction() {
        $datos = DatPlanificacionModel::cargarTodasViaAdquision();
        echo json_encode(array('data' => $datos->data));
    }
    
    public function GenerarNotificacionesAction() {
        $parametros['listauser']= json_decode($this->_request->getPost('listauser'), true);
        $parametros['tiponotificacion']= $this->_request->getPost('tiponotificacion');
        $modelnotificacion = new Notificaciones711Model();
        foreach ($parametros['listauser'] as $value) {
            $value['tiponotificacion']=$parametros['tiponotificacion'];
            $resp = $modelnotificacion->generarNotificacionSistema($value);
            if($resp[1]==1 || $resp[1]==2){
                break;
            }
        }
        //var_dump($resp); die;
        echo json_encode(array('codMsgD' => $resp[0], 'msg'=>$resp[2]));
    }

    public function Exportar711Action()
    {

        $model = new DatSolicitud711Model();
        $paramestros['solodescripcion'] = $this->_request->getParam('solodescripcion');
        if($paramestros['solodescripcion']==0){
            $paramestros['idsolicitud711'] = $this->_request->getParam('idsolicitud711');
            $paramestros['ejercicio'] = $this->_request->getParam('ejercicio');
            $model->Exportar711($paramestros);
        }
        if($paramestros['solodescripcion']==1){
            $paramestros['idsolicitud711'] = $this->_request->getParam('idsolicitud711');
            $model->ExportarDescripcion($paramestros);
        }
        if($paramestros['solodescripcion']==3){
            $paramestros['usuario'] = $this->global->Perfil->usuario;
            $paramestros['tipoaccion'] = $this->_request->getParam('tipaaccion');
            $model->ExportarIndicadoresExcel($paramestros);
        }
        if($paramestros['solodescripcion']==4){
            $model->ExportarIndicadoresPlanilla();
        }

    }

    public function importarficheroAction() {
        try {
            $filename = $_FILES['file']['tmp_name'];
            $filename = explode('.', $_FILES['file']['name']);
            $idconcepto = $this->_request->getParam('idconcepto');
            //print_r($this->global->Perfil->usuario);
            $parametros['usuario'] = $this->global->Perfil->usuario;
            $parametros['file'] = $_FILES["file"]["tmp_name"];
            if($idconcepto==1) {
                if ($filename[1] == 'jpg' || $filename[1] == 'png') {
                    $path = '' . $_SERVER['DOCUMENT_ROOT'] . '/planificacion/plan711/views/images/upload/' . $_FILES['file']['name'];
                    $lugar = '' . $_SERVER['SERVER_NAME'] . '/planificacion/plan711/views/images/upload/' . $_FILES['file']['name'];
                    move_uploaded_file($_FILES["file"]["tmp_name"], $path);
                    $data[0] = $lugar;
                    $data[1] = $_FILES['file']['name'];
                    echo json_encode(array('cod' => 1, 'data' => $data));
                } else {
                    echo json_encode(array('cod' => 53));
                }
            }
            if($idconcepto==2) {
                $parametros['tipoaccion'] = $this->_request->getParam('tipoaccion');
                $model = new DatSolicitud711Model();
                if ($filename[1] == 'xls' || $filename[1] == 'xlsx') {
                    $data = $model->importarProductos($parametros);
                    echo json_encode(array('cod' => 1, 'data' => $data));
                } else {
                    echo json_encode(array('cod' => 53));
                }
            }
        } catch (Doctrine_Exception $e) {
            echo json_encode(array('mensaje' => $e->getMessage()));
        }
    }    
}
