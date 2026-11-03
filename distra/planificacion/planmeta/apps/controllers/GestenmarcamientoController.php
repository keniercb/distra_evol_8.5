<?php

/**
 * Gestenmarcamiento
 * Controlador para gestionar los elementos del enmarcamiento
 *
 * @ author Roberto Aguilar Hidalgo
 * @ package Planificacion
 * @ subpackage Planificacion
 * @ copyright XETID-ERP Cuba
 * @ version 2.x
 * */
class GestenmarcamientoController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    public function gestenmarcamientoAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function cargarEntidadesAction() {

        $node = $this->_request->getPost('node');
        if ($node) {
            $idEstructura = $this->_request->getPost('node');
        } else {
            $idEstructura = 0;
        }
        $entidadrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $iddominio = $this->global->Perfil->iddominio;
        $entidadlogueada = ZendExt_GlobalConcept::getInstance(
                )->Estructura->idestructura;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras(
                $iddominio, $idEstructura, 0, 0, 3
        );

        if ($idEstructuraPadre == 'undefined' && $idEstructura != '0') {
            $idEstructuraPadre = $idEstructura;
        }
        $result = array();
        if ($dominios[0]['id'] == 100000001) {
            unset($dominios[0]);
            $dominios = array_values($dominios);
        }
        foreach ($dominios as $key => $val) {
            $result[$key] = $val;
            $result[$key]['idEstructuraPadre'] = $idEstructuraPadre;
            $result[$key]['entidades_productoras'] = "";
            $result[$key]['qtip'] = $val['text'];
            $result[$key]['entidadlogueada'] = $entidadlogueada;
            $result[$key]['entidadrectora'] = $entidadrectora[0]['identidad'];
            $identidaddatosnomenclador = DatEntidaddatosnomenclador::getEntDatNom($val[id]);
            $result[$key]['identidaddatosnomenclador'] = $identidaddatosnomenclador[0]['identidaddatosnomenclador'];
        }
        echo json_encode($result);
    }

    public function cargaInicialAction() {
        $identidad = $this->global->Estructura->idestructura;
        $denoEntidad = $this->global->Estructura->denominacion;
        $compEntidad = DatEntidaddatosnomenclador::getComportamientoDadoEntidad(
                        $identidad
        );
        $entidadCB = NomIndicador::entidadEsCB($identidad);
        $entidadOD = NomIndicador::entidadEsOD($identidad);
        $formato = $this->integrator->datosmaestros->listarFormatos();
        foreach ($formato as $valor) {
            if ($valor->nombre == 'Indicadores') {
                $idformatoInd = $valor->idformato;
                $nombreFormatoInd = "Indicadores";
            }
        }
        if ($idformatoInd == '') {
            echo("{'codMsg':21 }");
        } else {
            echo json_encode(
                    array('identidad' => $identidad,
                        'idformatoInd' => $idformatoInd,
                        'nombreFormatoInd' => $nombreFormatoInd,
                        'entidadCB' => $entidadCB,
                        'entidadOD' => $entidadOD,
                        'denoEntidad' => $denoEntidad,
                        'compEntidad' => $compEntidad[0][identidaddatosnomenclador])
            );
        }
    }

    public function cargarEntidadesCBAction() {

        $entidadlogueada = ZendExt_GlobalConcept::getInstance(
                )->Estructura->idestructura;
        $node = $this->_request->getPost('node');
        if ($node) {
            $idEstructura = $this->_request->getPost('node');
        } else {
            $idEstructura = $entidadlogueada;
        }

        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $iddominio = $this->global->Perfil->iddominio;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras(
                $iddominio, $idEstructura, 0, 0, 3
        );
        if ($idEstructuraPadre == 'undefined' && $idEstructura != '0') {
            $idEstructuraPadre = $idEstructura;
        }
        $result = array();
        if ($dominios[0]['id'] == 100000001) {
            unset($dominios[0]);
            $dominios = array_values($dominios);
        }
        foreach ($dominios as $key => $val) {
            if (NomIndicador::entidadEsCB($val['id'])) {
                $result[$key] = $val;
                $result[$key]['idEstructuraPadre'] = $idEstructuraPadre;
                $result[$key]['entidades_productoras'] = "";
                $result[$key]['qtip'] = $val['text'];
                $result[$key]['entidadlogueada'] = $entidadlogueada;
                $result[$key]['entidadrectora'] = $identrectora[0]['identidad'];
                if ($val['id'] != $identrectora[0]['identidad']) {
                    $result[$key]['leaf'] = true;
                }
            }
        }
        $result = array_values($result);
        echo json_encode($result);
    }

    public function listarComportamientoAction() {
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['identdatnomodpadre'] = $this->_request->getPost(
                'identdatnomodpadre'
        );
        $params['limit'] = $this->_request->getPost('limit');
        $params['start'] = $this->_request->getPost('start');
        $enmcbmodel = new DatEnmarcamientocbModel();
        $data = $enmcbmodel->listarComportamientos($params);

        echo json_encode($data);
    }

    public function obtenerEntidadRectoraAction() {
        $identidad = $this->_request->getPost('identidad');
        $enmcbmodel = new DatEnmarcamientocbModel();
        $data = $enmcbmodel->obtenerEntidadRectora($identidad);
        echo json_encode(array('data' => $data));
    }

    public function guardarComportamientoAction() {
        $params['camposmod'] = json_decode(
                stripslashes($this->_request->getPost('camposmod'))
        );
        $params['identidadpadre'] = $this->_request->getPost('identidadpadre');
        $params['identidaddatosnomencladorod'] = $this->_request->getPost(
                'identidaddatosnomencladorod'
        );
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $enmcbmodel = new DatEnmarcamientocbModel();
        $data = $enmcbmodel->guardarComportamientoMod($params);
        echo json_encode(array('codMsg' => $data));
    }

    public function guardarPlanesAction() {
        $params['camposmod'] = json_decode(
                stripslashes($this->_request->getPost('camposmod'))
        );
        $params['identidadpadre'] = $this->_request->getPost('identidadpadre');
        $params['identidad'] = $this->_request->getPost(
                'identidaddatosnomencladorod'
        );
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $enmcbmodel = new DatEnmarcamientocbModel();
        $data = $enmcbmodel->guardarPlanesMod($params);
        echo json_encode(array('codMsg' => $data));
    }

    public function verificarEnmarcamientoAction() {
        $params['identidaddatosnomencladorcb'] = $this->_request->getPost(
                'identidaddatosnomencladorcb'
        );
        $params['identidadpadre'] = $this->_request->getPost('identidadpadre');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['enmarcamientomodificado'] = $this->_request->getPost(
                'enmarcamientomodificado'
        );
        $params['enmarcamiento'] = $this->_request->getPost('enmarcamiento');
        $params['entidadrectora'] = $this->_request->getPost('entidadrectora');
        $enmcbmodel = new DatEnmarcamientocbModel();
        $data = $enmcbmodel->verificarEnmarcamientoCB($params);
        echo json_encode(array('codMsg' => $data));
    }

    public function verificarEnmarcamientoPlanAction() {
        $params['disponiblepadre'] = $this->_request->getPost(
                'disponiblepadre'
        );
        $params['enmarcamientomodificado'] = $this->_request->getPost(
                'enmarcamientomodificado'
        );
        $params['enmarcamiento'] = $this->_request->getPost('enmarcamiento');
        $params['identidadpadre'] = $this->_request->getPost('identidadpadre');
        $enmcbmodel = new DatEnmarcamientocbModel();
        $data = $enmcbmodel->verificarEnmarcamientoPlan($params);
        echo json_encode(array('codMsg' => $data));
    }

    public function verificarEnmarcamientoViaAction() {
        $params['disponiblepadre'] = $this->_request->getPost(
                'disponiblepadre'
        );
        $params['enmarcamientomodificado'] = $this->_request->getPost(
                'enmarcamientomodificado'
        );
        $params['enmarcamiento'] = $this->_request->getPost('enmarcamiento');
        $params['identidadpadre'] = $this->_request->getPost('identidadpadre');
        $params['enmarcamientocb'] = $this->_request->getPost(
                'enmarcamientocb'
        );
        $params['suma'] = $this->_request->getPost('suma');
        $params['entidadrectora'] = $this->_request->getPost('entidadrectora');
        $enmcbmodel = new DatEnmarcamientocbModel();
        $data = $enmcbmodel->verificarEnmarcamientoVia($params);
        echo json_encode(array('codMsg' => $data));
    }

    public function guardarViaAction() {
        $params['camposmod'] = json_decode(
                stripslashes($this->_request->getPost('camposmod'))
        );
        $params['identidad'] = $this->_request->getPost(
                'identidaddatosnomencladorod'
        );
        $params['idenmarcamiento'] = $this->_request->getPost(
                'idenmarcamiento'
        );
        $enmcbmodel = new DatEnmarcamientocbModel();
        $data = $enmcbmodel->guardarViaMod($params);
        echo json_encode(array('codMsg' => $data));
    }

    public function listarPlanesAction() {
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['identdatnomodpadre'] = $this->_request->getPost(
                'identdatnomodpadre'
        );
        $params['limit'] = $this->_request->getPost('limit');
        $params['start'] = $this->_request->getPost('start');
        $enmcbmodel = new DatEnmarcamientocbModel();
        $data = $enmcbmodel->listarPlanes($params);
        echo json_encode($data);
    }

    public function listarViaAdqAction() {
        $params['idenmarcamiento'] = $this->_request->getPost(
                'idenmarcamiento'
        );
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['identidaddatosnomencladorcb'] = $this->_request->getPost(
                'identidaddatosnomencladorcb'
        );
        $params['identidaddatosnomencladorod'] = $this->_request->getPost(
                'identidaddatosnomencladorod'
        );
        $params['limit'] = $this->_request->getPost('limit');
        $params['start'] = $this->_request->getPost('start');
        $enmcbmodel = new DatEnmarcamientocbModel();
        $data = $enmcbmodel->listarViaAdq($params, true);
        echo json_encode($data);
    }

    public function listarFiltrosViaAdqAction() {
        $enmcbmodel = new DatEnmarcamientocbModel();
        $data = $enmcbmodel->listarFiltrosViaAdq();
        echo json_encode($data);
    }

    public function listarFiltrosPlanesAction() {
        $enmcbmodel = new DatEnmarcamientocbModel();
        $data = $enmcbmodel->listarFiltrosPlanes();
        echo json_encode(array('data' => $data));
    }

    public function listarFiltrosEntidadesAction() {
        $idEstructura = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $result = DatActividadentidad::auxObtenerEntidadesHijasComun($idEstructura[0]['identidad']);

        echo json_encode(array('data' => $result));
    }

    public function listarCBTGAction() {
        $params['identidadrectora'] = $this->_request->getPost(
                'identidadrectora'
        );
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['identcb'] = $this->_request->getPost('identcb');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['limit'] = $this->_request->getPost('limit');
        $params['start'] = $this->_request->getPost('start');
        $params['idpadre'] = ($this->_request->getPost('anode')) ? $this->_request->getPost('anode') : 0;
        $params['filtros'] = $this->_request->getPost('filtros');
        $enmcbmodel = new DatEnmarcamientocbModel();
        $data = $enmcbmodel->listarCBTG($params);
        echo json_encode($data);
    }

    public function exportarODAction() {
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['denominacioncb'] = $this->_request->getParam('denominacioncb');
        $params['idenmarcamiento'] = $this->_request->getParam(
                'idenmarcamiento'
        );
        $params['enmarcamiento'] = $this->_request->getParam('enmarcamiento');
        $params['enmarcamientodisp'] = $this->_request->getParam(
                'enmarcamientodisponible'
        );
        $params['identidaddatosnomencladorcb'] = $this->_request->getParam(
                'identidaddatosnomencladorcb'
        );
        $params['filtros'] = json_decode(
                stripslashes($this->_request->getParam('filtros'))
        );
        $params['identdatnomodpadre'] = $this->_request->getParam(
                'identdatnomodpadre'
        );
        $params['denominacionentidad'] = $this->_request->getParam(
                'denominacionentidad'
        );
        $params['limit'] = $this->_request->getPost('limit');
        $params['start'] = $this->_request->getPost('start');
        $tempfiltros = array();
        if ($params['filtros']) {
            foreach ($params['filtros'] as $key => $datos) {
                $tempfiltros[$key]['field'] = $datos->field;
                $tempfiltros[$key]['data'] ['value'] = $datos->data->value;
                if ($datos->data->comparison) {
                    $tempfiltros[$key]['data'] ['comparison'] = $datos->data->comparison;
                }
            }
        }
        $params['filtros'] = $tempfiltros;
        $enmcbmodel = new DatEnmarcamientocbModel();
        $enmcbmodel->exportarOD($params);
    }

    public function exportarCBAction() {
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['denominacionod'] = $this->_request->getParam('denominacionod');
        $params['idenmarcamiento'] = $this->_request->getParam(
                'idenmarcamiento'
        );
        $params['identidaddatosnomencladorod'] = $this->_request->getParam(
                'identidaddatosnomencladorod'
        );
        $params['enmarcamiento'] = $this->_request->getParam('enmarcamiento');
        $params['enmarcamientodisp'] = $this->_request->getParam(
                'enmarcamientodisponible'
        );
        $params['filtros'] = json_decode(
                stripslashes($this->_request->getParam('filtros'))
        );
        $params['denominacionentidad'] = $this->_request->getParam(
                'denominacionentidad'
        );
        $params['limit'] = $this->_request->getPost('limit');
        $params['start'] = $this->_request->getPost('start');
        $enmcbmodel = new DatEnmarcamientocbModel();
        $enmcbmodel->exportarCB($params);
    }

    public function exportarenmarcplanAction() {
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['filtros'] = json_decode(
                stripslashes($this->_request->getParam('filtros'))
        );
        $params['identdatnomodpadre'] = $this->_request->getParam(
                'identdatnomodpadre'
        );
        $params['denominacionentidad'] = $this->_request->getParam(
                'denominacionentidad'
        );
        $params['limit'] = $this->_request->getPost('limit');
        $params['start'] = $this->_request->getPost('start');
        $tempfiltros = array();
        if ($params['filtros']) {
            foreach ($params['filtros'] as $key => $datos) {
                $tempfiltros[$key]['field'] = $datos->field;
                $tempfiltros[$key]['data'] ['value'] = $datos->data->value;
                if ($datos->data->comparison) {
                    $tempfiltros[$key]['data'] ['comparison'] = $datos->data->comparison;
                }
            }
        }
        $params['filtros'] = $tempfiltros;
        $enmcbmodel = new DatEnmarcamientocbModel();
        $enmcbmodel->exportarenmarcplan($params);
    }

    public function exportarViaAdqAction() {
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['filtros'] = json_decode(
                stripslashes($this->_request->getParam('filtros'))
        );
        $params['identdatnomodpadre'] = $this->_request->getParam(
                'identdatnomodpadre'
        );
        $params['denominacionentidad'] = $this->_request->getParam(
                'denominacionentidad'
        );
        $params['limit'] = $this->_request->getPost('limit');
        $params['start'] = $this->_request->getPost('start');
        $tempfiltros = array();
        if ($params['filtros']) {
            foreach ($params['filtros'] as $key => $datos) {
                $tempfiltros[$key]['field'] = $datos->field;
                $tempfiltros[$key]['data'] ['value'] = $datos->data->value;
                if ($datos->data->comparison) {
                    $tempfiltros[$key]['data'] ['comparison'] = $datos->data->comparison;
                }
            }
        }
        $params['filtros'] = $tempfiltros;
        $enmcbmodel = new DatEnmarcamientocbModel();
        $enmcbmodel->exportarViaAdq($params);
    }

    public function listarCentroBalanceEnmarcadoAction() {

        $idcentrobalance = 1; //temporal numero fijo en la BD para Nomdatosnomenclador
        $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento(
                        $idcentrobalance
        );

        foreach ($centrobalance as $k => $valor) {
            $dat[$k]['idcentrobalance'] = $valor['identidaddatosnomenclador'];
            $datosentidad = $this->integrator->metadatos->DameEstructura(
                    $valor['identidad']
            ); //100000024
            $dat[$k]['denominacion'] = $datosentidad[0]->denominacion;
        }
        echo json_encode(array('data' => $dat));
    }

}
