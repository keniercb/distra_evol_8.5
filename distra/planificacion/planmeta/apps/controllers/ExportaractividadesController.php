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
/* temporal eliminar este controler */

class ExportarActividadesController extends ZendExt_Controller_Secure
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

    function exportaractividadesAction()
    {
        $this->render();
    }

    function cargarfiltroespecialidadesAction()
    {
        $result = DatExportarModel::listarEspecialidades();
        echo json_encode(array('data' => $result));
    }

    function cargarfiltroplanesAction()
    {
        $identidad = $this->global->Estructura->idestructura;
        $model = new DatEntidadmodelo();
        $result = $model->getModeloAsocEntidad($identidad);
        echo json_encode(array("data" => $result));
    }

    function listaractividadesAction()
    {
        $start = $this->_request->getParam('start');
        $limit = $this->_request->getParam('limit');
        $filtros = $this->_request->getParam('filtros');
        $idespecialidad = $this->global->Estructura->idespecialidad;
        $result = NomActividad::listarActvsParaExportar(
            $filtros, $idespecialidad, $start, $limit
        );
        $total = NomActividad::listarTotalActividadesParaExportar(
            $filtros, $idespecialidad
        );
        echo json_encode(array('data' => $result, 'total' => $total));
    }

    function exportarAction()
    {
        ini_set("max_execution_time", 600); //10 min de conexion
        $filtros = json_decode(
            stripslashes($this->_request->getParam('filtros'))
        );
        $tipoexp = $this->_request->getParam('tipoexp');
        $idespecialidad = $this->global->Estructura->idespecialidad;
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = $this->global->Perfil->idioma;
        $dirEtiquetas
            = $dirApps
            . "/planificacion/planmeta/views/idioma/{$idioma}/exportaractividades/exportaractividades.json";
        $etiquetas = file_get_contents($dirEtiquetas);
        $etiquetas = str_replace("{", "", $etiquetas);
        $etiquetas = str_replace("}", "", $etiquetas);
        $etiquetas = str_replace("\n", "", $etiquetas);
        $etiquetas = str_replace("'", "", $etiquetas);
        $etiquetas = split(",", $etiquetas);
        $arrayEtiq = array();
        foreach ($etiquetas as $key => $valor) {
            $arrayEtiqueta = split(":", $valor);
            $indice = str_replace("\r", "", $arrayEtiqueta[0]);
            $indice = str_replace(" ", "", $indice);
            $arrayEtiq[$indice] = $arrayEtiqueta[1];
            unset($etiquetas[$key]);
        }
        unset($etiquetas);
        NomActividad::exportarActividades(
            $filtros, $idespecialidad, $arrayEtiq, $tipoexp
        );
    }

    /**
     * listarNiveles
     * Lista los niveles de las actividades
     *
     * @return array, devuelve un listado de niveles con la denominacion del nivel
     * */
    public function listarNivelesAction()
    {
        /* Obtener el formato de las actividades guardadas en la Base de Datos */
        $idformato = NomActividad::formato($this->integrator);
//Obtener la configuración por nodos de un formato
        $result = array();
        $ultimonivel = 0;
        if ($idformato != null) {
            $result = $this->integrator->datosmaestros->buscarParteFormato(
                $idformato
            );
            foreach ($result as $value) {
                if ($value->nivel > $ultimonivel) {
                    $ultimonivel = $value->nivel;
                }
            }
        }
        echo json_encode(array('data' => $result));
    }

}

