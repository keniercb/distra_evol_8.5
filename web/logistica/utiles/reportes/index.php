<?php

if (isset($_REQUEST['datas'])) {
    /**
     * Fichero de inicio del modulo de gestion del Portal
     *
     * @author Yoandry Morejon Borbon
     * @copyright UCID-ERP Cuba
     * @version 1.0-0
     */
    //Direccion de la servidora
    $dir_index = $_SERVER['SCRIPT_FILENAME'];
    $config_file_jasper = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'lib/JasperReports/JasperClient/autoload.php';
    if (!file_exists($config_file_jasper)) {
        throw new Exception('El fichero de configuracion del reporte no existe');
    } elseif (!is_readable($config_file_jasper)) {
        throw new Exception('No se pudo leer el fichero de configuracion del reporte. Acceso denegado.');
    } else {
        require_once $config_file_jasper;
    }
    $config = array();
    $config['include_path'] = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'apps/logistica/utiles/reportes/models';
    $config['include_path'] .= PATH_SEPARATOR . substr($dir_index, 0, strrpos($dir_index, 'web')) . 'apps/logistica/utiles/reportes/services';
    set_include_path($config['include_path']);
    require_once 'JasperClientModel.php';
    require_once 'JasperClientService.php';

    $model = new JasperClientModel();
    $datas = json_decode($_REQUEST['datas'], 1);
    return $model->runReport($datas);
} else {
    echo 'Mensaje: </br>';
    echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
    echo '&nbsp;&nbsp;' . 'Parametros vacios';
    echo '</pre>' . '</br>';
    echo 'Detalles:';
    echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
    print_r('Parametros vacios');
    echo '</pre>';
}