<?php

/**
 * ExportarActividadesController
 * Controlador para gestionar las importaciones al sistema.
 *
 * @ author
 * @ package Planificación
 * @ subpackage Planificación
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class ExportarNivelesActividadController extends ZendExt_Controller_Secure
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

    function exportarnivelesactividadAction()
    {
        $this->render();
    }

    function cargarfiltroplanesAction()
    {
        $identidad = $this->global->Estructura->idestructura;
        $model = new DatEntidadmodelo();
        $result = $model->getModeloAsocEntidad($identidad);
        echo json_encode(array("data" => $result));
    }

    function cargarfiltroespecialidadesAction()
    {
        $result = DatExportarModel::listarEspecialidades();
        echo json_encode(array('data' => $result));
    }

    function listarnivelesactividadAction()
    {
        $start = $this->_request->getParam('start');
        $limit = $this->_request->getParam('limit');
        $filtros = $this->_request->getParam('filtros');
        $idespecialidad = $this->global->Estructura->idespecialidad;
        $identidad = $this->global->Estructura->idestructura;
        $result = NomActividad::listarActividadesNivelesParaExportar(
            $filtros, $idespecialidad, $identidad, $start, $limit
        );
        echo json_encode(array('data' => $result));
    }

}

