<?php

/*
 * IncidenciaService
 * Comentario
 * @author Seniors Jesus Ariel & Dasley
 * @package
 * @subpackage
 * @copyright
 * @version
 */

class ReportesService
{

    private $reportesModel;

    public function __construct() {
        $this->reportesModel = new ReportesModel();
    }

    /**
     *
     * Servicio que implementa el retornpo los js de los elementos comunes de prospectiva
     * @author Seniors Jesus Ariel & Dasley
     * @return direccion de un js
     */
    function devolverJS() {

        $dir_apps 	= Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml 	= $dir_apps . 'planificacion/reportes/views/scripts/reportes/reportes.phtml';
        $phtml = file_get_contents($dir_phtml);
        return $phtml;
    }

    /**
     *
     * Servicio que implementa el retornpo los js de los elementos comunes de prospectiva
     * @author Seniors Jesus Ariel & Dasley
     * @return direccion de un js
     */
    public function obtenerReporte($params) {
        return $this->reportesModel->obtenerReporte($params);
    }
}
