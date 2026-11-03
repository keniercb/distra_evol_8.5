<?php

/**
 * Gestenmarcamiento
 * Controlador para gestionar los reportes del enmarcamiento
 *
 * @ author Roberto Aguilar Hidalgo
 * @ package Planificacion
 * @ subpackage Planificacion
 * @ copyright XETID-ERP Cuba
 * @ version 2.x
 * */
class ReporteenmarcamientoController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    public function reporteenmarcamientoAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function listarComportamientoAction() {
        $params['idestructura'] = $this->global->Estructura->idestructura;
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['limit'] = $this->_request->getPost('limit');
        $params['start'] = $this->_request->getPost('start');
        $resenmmodel = new ReporteenmarcamientoModel();
        $data = $resenmmodel->listarComportamientos($params);
        $sobrepasado = 0;
        foreach ($data['data'] as $k => $value) {
            $data['data'][$k]['enmarcamientoreal'] = number_format(
                    $value['enmarcamientoreal'], 3
            );
            $data['data'][$k]['enmarcamientoplan'] = number_format(
                    $value['enmarcamientoplan'], 3
            );
            $data['data'][$k]['diferencia'] = number_format(
                    $value['diferencia'], 3
            );
            if ($value['enmarcamientoplan'] < $value['enmarcamientoreal']) {
                $sobrepasado = 1;
            }
        }
        $data['sobrepasado'] = $sobrepasado;
        echo json_encode($data);
    }

    public function listarPlanesAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['limit'] = $this->_request->getPost('limit');
        $params['start'] = $this->_request->getPost('start');
        $resenmmodel = new ReporteenmarcamientoModel();
        $data = $resenmmodel->listarPlanes($params);
        $sobrepasado = 0;

        foreach ($data['data'] as $k => $value) {
            $data['data'][$k]['enmarcamientoreal'] = number_format(
                    $value['enmarcamientoreal'], 3
            );
            $data['data'][$k]['enmarcamientoplan'] = number_format(
                    $value['enmarcamientoplan'], 3
            );
            $data['data'][$k]['diferencia'] = number_format(
                    $value['diferencia'], 3
            );
            if ($value['enmarcamientoplan'] < $value['enmarcamientoreal']) {
                $sobrepasado = 1;
            }
        }
        $data['sobrepasado'] = $sobrepasado;
        echo json_encode($data);
    }

    public function listarViaAdqAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['limit'] = $this->_request->getPost('limit');
        $params['start'] = $this->_request->getPost('start');
        $resenmmodel = new ReporteenmarcamientoModel();
        $data = $resenmmodel->listarViaAdq($params);
        $sobrepasado = 0;
        foreach ($data['data'] as $k => $value) {
            $data['data'][$k]['enmarcamientoreal'] = number_format(
                    $value['enmarcamientoreal'], 3
            );
            $data['data'][$k]['enmarcamientoplan'] = number_format(
                    $value['enmarcamientoplan'], 3
            );
            $data['data'][$k]['diferencia'] = number_format(
                    $value['diferencia'], 3
            );
            if ($value['enmarcamientoplan'] < $value['enmarcamientoreal']) {
                $sobrepasado = 1;
            }
        }
        $data['sobrepasado'] = $sobrepasado;
        echo json_encode($data);
    }

    public function exportarODAction() {
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['filtros'] = json_decode(
                stripslashes($this->_request->getParam('filtros'))
        );
        //   $params['idpadre'] = $this->_request->getParam('idpadre');
        $params['idestructura'] = $this->global->Estructura->idestructura;
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
        $resenmmodel = new ReporteenmarcamientoModel();
        $resenmmodel->exportarOD($params);
    }

    public function exportarenmarcplanAction() {
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['filtros'] = json_decode(
                stripslashes($this->_request->getParam('filtros'))
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
        $resenmmodel = new ReporteenmarcamientoModel();
        $resenmmodel->exportarenmarcplan($params);
    }

    public function exportarViaAdqAction() {
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['filtros'] = json_decode(
                stripslashes($this->_request->getParam('filtros'))
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
        $resenmmodel = new ReporteenmarcamientoModel();
        $resenmmodel->exportarViaAdq($params);
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
            );
            $dat[$k]['denominacion'] = $datosentidad[0]->denominacion;
        }
        echo json_encode(array('data' => $dat));
    }

    public function cargarEntidadesAction() {
        $idEstructura = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $result = DatActividadentidad::auxObtenerEntidadesHijasComun($idEstructura[0]['identidad']);

        echo json_encode(array('data' => $result));
    }


    public function cargarEntidadesPadreAction() {
        $idEstructura = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $datosentidad = $this->integrator->metadatos->DameEstructura(
                $idEstructura[0]['identidad']
        );
        $entrectora = Array();
        $entrectora[0]['id'] = $idEstructura[0]['identidad'];
        $entrectora[0]['text'] = $datosentidad[0]->denominacion;
        $result = DatActividadentidad::auxObtenerEntidadesHijasComun($idEstructura[0]['identidad']);
        $result = array_merge($result, $entrectora);
        echo json_encode(array('data' => $result));
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

}
