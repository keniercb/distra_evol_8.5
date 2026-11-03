<?php

/**
 * ExportarIndicadoresController
 * Controlador para gestionar las importaciones al sistema.
 *
 * @ author Leinier Alvarez Armas
 * @ package Planificación
 * @ subpackage Planificación
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class ExportarIndicadoresController extends ZendExt_Controller_Secure
{

    /**
     * init
     * Inicializar los atributos de la clase
     *
     * @return void
     */
    function init()
    {
        parent::init();
    }

    //fin de la función init


    function exportarindicadoresAction()
    {
        $this->render();
    }

    function cargarfiltronaturalezaAction()
    {
        $obj = new NomDatosnomenclador();
        $naturalezas = $obj->ObtenerDatosNomenclador(2);
        echo json_encode(array('data' => $naturalezas));
    }

    function cargarfiltrocentrobalanceAction()
    {
        $obj = new DatEntidaddatosnomenclador();
        $ids = $obj->getEntidadDadoComportamiento(1);
        foreach ($ids as $k => $valor) {
            $dat[$k]['idcentrobalance'] = $valor['identidad'];
            $datosentidad = $this->integrator->metadatos->DameEstructura(
                $valor['identidad']
            );
            $dat[$k]['centrobalance'] = $datosentidad[0]->denominacion;
            $dat[$k]['identidaddatosnomenclador']
                = $valor['identidaddatosnomenclador'];
        }
        echo json_encode(array('data' => $dat));
    }

    function cargarfiltroorganoAction()
    {
        $result = NomOrganosatisface::obtenerOS();
        echo json_encode(array('data' => $result));
    }

    function cargarfiltrounidadmedidaAction()
    {
        $result = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $result));
    }

    function cargarfiltroviaadquisicionAction()
    {
        $obj = new NomViaadquisicion();
        $via = $obj->Obtener_via_adquisicion();
        echo json_encode($via);
    }

    function listarindicadoresAction()
    {
        $filtros = $this->_request->getPost('filtros');
        $identidad = $this->global->Estructura->idestructura;
        $idejercicio = $this->_request->getPost('idejercicio');
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $result = NomIndicadorModel::listarIndicadoresParaExportar(
            $filtros, $identidad, $start, $limit, $idejercicio
        );
        $total = NomIndicadorModel::listarTotalIndicadoresParaExportar(
            $filtros, $identidad, $idejercicio
        );
        echo json_encode(array('data' => $result, 'total' => $total));
    }

    function exportarAction()
    {
        ini_set("max_execution_time", 60000000);
        ini_set('memory_limit', '3024M');
        $filtros = json_decode(
            stripslashes($this->_request->getParam('filtros'))
        );
        $ejercicio = $this->_request->getParam('idejercicio');
        NomIndicadorModel::exportarIndicadores($filtros, $ejercicio);
    }

    function cargarindparaexportarAction()
    {
        ini_set("max_execution_time", 60000000);
        ini_set('memory_limit', '464M');
        $global = ZendExt_GlobalConcept::getInstance();
        $globalEstructura = $global->Estructura;
        $identidad = $globalEstructura->idestructura;
        $filtros = $this->_request->getParam('filtros');
        $filtros = json_decode(stripslashes($filtros));

        $cantIndicadoresExportar
            = NomIndicadorModel::listarIndicadoresParaExportar_Object(
                $filtros, $identidad, 10, 1, true
            );
        $cantRegistro = 500;
        $cantPaginas = (int)($cantIndicadoresExportar[0]['cantidadIndicador']
            / $cantRegistro);
        if (fmod(
            $cantIndicadoresExportar[0]['cantidadIndicador'], $cantRegistro
        ) > 0
        ) {
            $cantPaginas++;
        }

        $start = 0;

        $result = NomIndicadorModel::listarIndicadoresParaExportar_Object(
            $filtros, $identidad, 20000, $start, false
        );
        $total = count($result);
        echo json_encode(array('data' => $result, 'total' => $total));
    }

    function pruebaAction()
    {
        $filtros = $this->_request->getParam('filtros');
        $filtros = json_decode($filtros);
        $identidad = $this->global->Estructura->idestructura;
        $result = NomIndicadorModel::listarIndicadoresParaExportar_Object(
            $filtros, $identidad, false, false
        );
        NomIndicadorModel::prueba($result);
    }

    public function getEjerciciosAction()
    {

        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri();
        $data->idejercicioactual
            = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }

}
