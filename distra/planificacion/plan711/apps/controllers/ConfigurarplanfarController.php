<?php

require_once __DIR__ . '/../../planmeta/controllers/ConfigurarejercicioController.php';
require_once __DIR__ . '/../../planmeta/controllers/GestionarplanesController.php';

class ConfigurarplanfarController extends ConfigurarejercicioController {

    private $auxgridsalva = array();
    private $cont = 0;

    public function init() {
        parent::init();
        $this->_meta = ZendExt_Metadata::getInstance();
    }

    public function configurarplanfarAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function listarPlanes711Action() {

        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['tipoplan'] = 1255;
        $parametros['filtros'] = $this->_request->getPost('filtros');

        ini_set("max_execution_time", 3600); //1hora
        //Creando el modelo de negocio de gestion de usuarios.
        $modeloplan = new DatPlan711Model();
        $data = $modeloplan->listarPlanes711($parametros);
        echo json_encode(array("data" => $data, "total" => count($data)));
    }

    public function listarCCAction() {
        $valor->uri = 'CCFar';
        $data = array();
        $modelonomenclador = new NomDatosnomenclador();
        $data = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
//        for ($index = 0; $index < count($resultados); $index++) {
//            if ($resultados[$index]['denominacion'] != '-') {
//                $resultados[$index]['iddatos'] = $resultados[$index]['iddatosnomenclador'];
//                $data[] = $resultados[$index];
//            }
//        }
        echo json_encode(array("data" => $data));
    }

    public function listarFFyCCAction() {
        $valor;
        $paramestros['accion'] = $this->_request->getPost('accion');
        $paramestros['idejercicio'] = $this->_request->getPost('idejercicio');
        $paramestros['idplan711'] = $this->_request->getPost('idplan711');
        $paramestros['idempimp'] = $this->_request->getPost('idempimp');
        $cont = 0;
        $data = array();
        $modelonomenclador = new NomDatosnomenclador();
        $valor->uri = 'CCFar';
        $resultados1 = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        for ($index1 = 0; $index1 < count($resultados1); $index1++) {
            if ($resultados1[$index1]['denominacion'] != '-') {
                $data[$cont]['idplanfuentescc'] = $resultados1[$index1]['iddatosnomenclador'];
                $data[$cont]['iddatoscodigo'] = $resultados1[$index1]['iddatosnomenclador'];
                $data[$cont]['denominacion'] = $resultados1[$index1]['denominacion'];
                $data[$cont]['monto'] = 0;
                $cont++;
            }
        }
        if (!is_null($paramestros['accion'])) {
            $modeloplanes = new DatPlan711Model();
            $paramestros['uri'] = $valor->uri;
            $resultados3 = $modeloplanes->listarFFyCC($paramestros);
            $cont = 0;
            for ($i = 0; $i < count($resultados3); $i++) {
                $data[$cont]['idplanfuentescc'] = $resultados3[$i]['idplanfuentescc'];
                $data[$cont]['iddatoscodigo'] = $resultados3[$i]['iddatoscc'];
                $data[$cont]['denominacion'] = $resultados3[$i]['denominacioncc'];
                $data[$cont]['monto'] = $resultados3[$i]['monto'];
                $cont++;
            }
        }
        echo json_encode(array("data" => $data, "total" => count($data)));
    }

    public function listarDistribucionCodAction() {
        $paramestros['idplan711'] = $this->_request->getPost('idplan711');
        $modeloplanes = new DatPlan711Model();
        $data = $modeloplanes->listarDistribucionCod($paramestros);
        echo json_encode(array("data" => $data, "total" => count($data)));
    }

    public function adicionarModificarPlanAction() {

        /*         * *
         * [[["1264"],[[1,"15","BCDT08-VRA-120-18TB-6",0,2500,5],[2,"5","Panasonic WV-SFN480",0,"1134.00",0],[3,"11","HP V193 18.5-inch LED Backlit",0,"250.00",0]]],
         * [["1265"],[[1,"11","HP V193 18.5-inch LED Backlit",0,"250.00",5],[2,"5","Panasonic WV-SFN480",0,"1134.00",0]]]]
         */

        $paramestros['idejercicio'] = $this->_request->getPost('ejercicio');
        $paramestros['montototal'] = $this->_request->getPost('montototal');
        $distribuc = json_decode($this->_request->getPost('distribuc'), true);
        $paramestros['relcodind'] = json_decode($this->_request->getPost('relcodind'), true);
        //$paramsejerc->ejercicioactual = ($this->_request->getParam('planactual') == 'true') ? 1 : 0;
        $paramestros['idempimp'] = $this->_request->getPost('idempimp');
        $accion = $this->_request->getPost('accion');

        $paramsejerc->accion = $accion;
        $modelosplan = new DatPlan711Model();

        $modelonomenclador = new NomDatosnomenclador();
        $paramestros['tipoplan'] = 1255;
        if ($paramestros['tipoplan'] == 1255) {
            $valor->uri = 'CCFar';
            //$paramsejerc->denom= $paramsejerc->denominacion;
            //$paramsejerc->denominacion= $paramsejerc->denominacion.'F';
        }
        $resultados2 = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        $arrayaux = array();
        $montodist = 0;
        $cont = 0;
        foreach ($distribuc as $value) {
            $arrayaux[$cont]['iddatosff'] = null;
            $arrayaux[$cont]['iddatoscc'] = $value[1];
            $arrayaux[$cont]['monto'] = floatval(str_replace(',', '', $value[3]));
            $arrayaux[$cont]['iddatosempimp'] = $paramestros['idempimp'];
            $cont++;
            $montodist += floatval(str_replace(',', '', $value[3]));
        }
        if (bcsub(floatval($paramestros['montototal']), floatval($montodist), 6)==0.000000) {
            if ($accion == 1) {
                $resp = $modelosplan->adicionarPlan($paramestros, $paramestros['idejercicio'], $arrayaux);
                echo json_encode(array('mensaje' => $resp));
            } else {
                //este param viene si es modificicacion        
                $paramestros['idp711'] = $this->_request->getPost('idp711');
                $resp = $modelosplan->modificarPlan($paramestros, $arrayaux);
                $result = $plan = Doctrine::getTable('DatPlan711')
                        ->find($paramestros['idp711']);
                $paramestros['idejercicio'] = $result->idejercicio;
                $paramestros['usuario'] = $this->global->Perfil->usuario;
                $modelmotivo = new DatMotivoModificacionModel();
                $paramestros['tipo'] = 1;
                $paramestros['motivo'] = $this->_request->getPost('motivo');
                $salida = $modelmotivo->AdicionarMotivo($paramestros);
                echo json_encode(array('mensaje' => 1));
            }
        } else {
            $montosinasignar = bcsub(floatval($paramestros['montototal']), floatval($montodist), 6);
            echo json_encode(array('mensaje' => 'La suma de la distribución no es igual al monto asignado, error en monto de: ' . $montosinasignar));
        }
    }

    public function listarProductosAction() {
        $parametros['idempimp'] = $this->_request->getPost('idempimp');
        $parametros['iddatoscodigo'] = $this->_request->getPost('iddatoscodigo');
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = $this->_request->getPost('filtros');

        $modelSolicitud = new DatSolicitud711Model();
        $data = $modelSolicitud->listarProductos($parametros);
        echo json_encode(array("data" => $data, "total" => $data[0]['total']));
    }

    public function SalvarGridAction() {
        $distribuc = json_decode($this->_request->getPost('distribuc'), true);
        $paramestros['idempimp'] = $this->_request->getPost('idempimp');

        //if(empty($this->auxgridsalva)){
        $this->auxgridsalva[$this->cont]['datos'] = $distribuc;
        $this->auxgridsalva[$this->cont]['idempimp'] = $paramestros['idempimp'];
        $this->cont++;
        //var_dump($this->auxgridsalva); die;
        //}
        echo json_encode(array('mensaje' => 1));
    }

    public function listarModifAction() {

        $modelomodif = new DatMotivoModificacionModel();
        $paramestros['idplan711'] = $this->_request->getPost('idplan711');
        $paramestros['idejercicio'] = $this->_request->getPost('idejercicio');
        $paramestros['tipo'] = 1;
        $data = $modelomodif->listarModif($paramestros);
        echo json_encode(array("data" => $data, "total" => count($data)));
    }

    public function cambiarEstadoAction() {
        $paramestros['idejercicio'] = $this->_request->getParam('idejercicio');
        $paramestros['estado'] = $this->_request->getParam('estado');
        $modelosplan = new DatPlan711Model();
        $result = $modelosplan->cambiarEstado($paramestros);
        echo json_encode(array('mensaje' => $result));
    }

    public function EliminarPlanAction() {
        $paramestros['idplan711'] = $this->_request->getParam('idplan711');
        $modelosplan = new DatPlan711Model();
        $result = $modelosplan->EliminarPlan($paramestros);
        echo json_encode(array('mensaje' => $result));
    }

    public function cargarUsuariosAction() {
        $users = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $users));
    }

    public function listarDatosAction() {
        $uri = $this->_request->getPost('uri');
        $tipoplan = 1255;
        $modelPlan = new DatPlan711Model();
        $data = $modelPlan->listarDatos($uri);
        if ($tipoplan == 1255 && $uri == 3) {
            $resul = array();
            foreach ($data as $value) {
                //if ($value['denominacion'] == 'Tecnoimport') {
                    $resul[] = $value;
                //}
            }
            $data = $resul;
        }
        if ($uri == 16) {
            $resul = array();
            foreach ($data as $value) {
                if ($value['denominacion'] == 'Plan FAR') {
                    $resul[] = $value;
                }
            }
            $data = $resul;
        }

        echo json_encode(array("data" => $data));
    }

    public function listarEjercAction() {
        $parametros['tipoplan'] = 1255;
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = null;
        $planessisplan = new ConfigurarejercicioModel();
        $annossisplan = $planessisplan->obtenerListadoEjercicios($parametros);
        //print_r($annossisplan->data); die;
        $modeloplan = new DatPlan711Model();
        $arrEjercicios = $modeloplan->listarPlanes711($parametros);
        $salida = array();
        $cont = 0;
        foreach ($annossisplan->data as $val) {
            $band = false;
            foreach ($arrEjercicios as $value) {
                if ($value['idejercicio'] == $val['idejercicio']) {
                    $band = true;
                }
            }
            if ($band == false) {
                $salida[$cont]['ejercicio'] = $val['ejercicio'];
                $salida[$cont]['idejercicio'] = $val['idejercicio'];
                $cont++;
            }
        }
        echo json_encode(array("data" => $salida, "total" => 1));
    }

    public function listarProductos711Action() {
        $parametros['filtros']['field'] = 'codigocup';
        $parametros['filtros']['data']['value'] = $this->_request->getPost('codigocup');
        $parametros['tipo'] = $this->_request->getPost('tipo');
        $modeloplan = new DatProducto711Model();
        $data = $modeloplan->ExisteProductos711($parametros);
        //var_dump($data); die;
        echo json_encode(array('data' => $data, 'mensaje' => $data[0]['total']));
    }

    public function adicionarProductosAction() {
        $paramestros['tipo'] = $this->_request->getPost('tipo');
        $paramestros['accion'] = 1;
        $paramestros['denom'] = $this->_request->getPost('denom');

        if ($paramestros['tipo'] == 0) {
            $paramestros['um'] = $this->_request->getPost('um');
            $paramestros['idempimp'] = $this->_request->getPost('idempimp');
            $paramestros['precio'] = $this->_request->getPost('precio');
            $paramestros['codigocup'] = $this->_request->getPost('codigocup');
            $paramestros['numeropieza'] = $this->_request->getPost('numeropieza');
        }
        if ($paramestros['tipo'] == 1) {
            $paramestros['iddatostipocodigo'] = $this->_request->getPost('iddatostipocodigo');
            $paramestros['iddatoscodigo'] = 1247;
        }
        if ($paramestros['tipo'] == 2) {
            $paramestros['idplan711'] = $this->_request->getPost('idplan711');
        }

        //este param viene si es modificicacion        
        $paramestros['idproducto711'] = $this->_request->getPost('idproducto711');
        $paramestros['filtros']['field'] = 'codigocup';
        $paramestros['filtros']['data']['value'] = $this->_request->getPost('codigocup');
        $modeloplan = new DatProducto711Model();
        $data = $modeloplan->ExisteProductos711($paramestros);
        $mensage = 1;
        //var_dump($data); die;
        if ($data != null) {
            $mensage = "El producto que intenta adicionar ya existe su codigocup";
        }
        if ($mensage == 1) {
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
        $auxfilt = count($filtros) + 1;
        /*$filtros[$auxfilt]['field'] = 'viaadquisicion';
        $filtros[$auxfilt]['data']['type'] = 'string';
        $filtros[$auxfilt]['data']['value'] = 'Importacion directa';*/

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

}
