<?php

/**
 * ComponenteReporteDService
 *
 * @package    Domain.
 * @subpackage Domain services.
 * @copyright  UCID
 * @version    1.0
 */
define('APP_HOME', realpath(dirname(__FILE__)) . '/');
require APP_HOME.'../../../../../lib/JasperReports/JasperClient/autoload.php';
use Jaspersoft\Client\JasperClient;

class ComponenteReporteDService
{
    private $_reporteRepository;
    private $_reportefilterRepository;
    private $_fileconfig;
    private $_config;

    public function __construct()
    {
        $this->_fileconfig = APP_HOME . '../../../comun/recursos/server_config.ini';
        $this->_config = $this->getConfig();
        $this->_reporteRepository = new ReporteRepository();
        $this->_reportefilterRepository = new ReporteFiltroRepository();
        $this->client = new JasperClient();
        set_time_limit(0);
        ini_set('max_execution_time', 0);
    }

    public function getConfig()
    {
//        if (file_exists($this->_fileconfig)) {
//            return parse_ini_file($this->_fileconfig, true)['jasper'];
//        }
        $instance = (new ConfContratoGeneral())->getConfig();
        return array('datasource'=>$instance['confgjasper']);
//        throw new Exception('EL FICHERO DE CONFIGURACION ' . $this->_fileconfig . ' NO EXISTE');
    }

    public function getReportesByIdentificadorModulo($identifmodulo)
    {

        $reportes = $this->_reporteRepository->getRecordsByIdentifModule(
            $identifmodulo, array('sort' => 'idpadre ASC')
        );
        return $this->getTreeChildren($reportes);
    }

    private function getTreeChildren($reportes, $idnode = 'root')
    {
        $result = array();

        foreach ($reportes as $value) {
            if ($this->isChildNode($idnode, $value)) {
                $value['children'] = $this->getTreeChildren($reportes, $value['idreporte']);
                $value['leaf'] = (count($value['children'])) ? false : true;
                $value['text'] = $value['denominacion'];
                $value['expanded'] = true;
                $value['filtros'] = $this->estructurarFiltros($value['ReporteFiltro']);
                unset($value['ReporteFiltro']);

                array_push($result, $value);
            }
        }
        return $result;
    }

    private function isChildNode($idpadre, $reporte)
    {
        if ($idpadre == 'root') {
            return $reporte['idpadre'] == $reporte['idreporte'];
        }
        return $idpadre == $reporte['idpadre'] && $reporte['idpadre'] != $reporte['idreporte'];
    }

    public function estructurarFiltros($filtros)
    {
        $result = array();
        $filtroEntity = new ReporteFiltro();
        foreach ($filtros as $value) {
            array_push($result, $filtroEntity->formatValuesToLinealArray($value));
        }
        return $result;
    }

    public function getFilterNomencladorData($idfiltro, $query)
    {
        $filter = $this->_reportefilterRepository->getFilterNomencladorById($idfiltro);
        return $filter->getNomencladorData($query);
    }

    public function getFilterNomencladorDataCount($idfiltro, $query)
    {
        $filter = $this->_reportefilterRepository->getFilterNomencladorById($idfiltro);
        return $filter->getNomencladorDataSqlCount($query);
    }

    public function getReportDataFromJasperServer($resource, $format, $idtemplate, $filters)
    {
        $handler = curl_init($this->getUrl($resource, $format,$idtemplate, $filters));
        curl_setopt($handler, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($handler);
        curl_close($handler);
        return $response;
    }

    private function getUrl($resource, $format, $idtemplate, $filters)
    {
        $params = array();
        $params['usuario'] = $this->_config['user'];
        $params['clave'] = $this->_config['password'];
        $params['recurso'] = $resource;
        $params['formato'] = $format;
        $params['parametros'] = (empty($filters)) ? null : $filters;
        if(!empty($idtemplate)){
            $params['idplantilla'] = $idtemplate;
        }
        print_r($this->_config['baseurl'] . '?datas=' . base64_encode(json_encode($params)));die;
        return $this->_config['baseurl'] . '?datas=' . base64_encode(json_encode($params));
    }

    public function getResponseHeaderConfigByFormat($format)
    {
        switch ($format) {
            case 'PDF':
                return array(
                    'disposition' => 'inline; filename=\"' . $this->_config['filename'] . '.pdf\"',
                    'type'        => 'application/pdf'
                );
            case 'ODT':
                return array(
                    'disposition' => 'inline; filename=\"' . $this->_config['filename'] . '.odt\"',
                    'type'        => 'application/vnd.oasis.opendocument.text'
                );
            case 'RTF':
                return array(
                    'disposition' => 'inline; filename=\"' . $this->_config['filename'] . '.rtf\"',
                    'type'        => 'application/rtf'
                );
            case 'XLS':
                return array(
                    'disposition' => 'inline; filename=\"' . $this->_config['filename'] . '.xls\"',
                    'type'        => 'application/xls'
                );
            case 'CSV':
                return array(
                    'disposition' => 'inline; filename=\"' . $this->_config['filename'] . '.csv\"',
                    'type'        => 'application/csv'
                );
            case 'DOCX':
                return array(
                    'disposition' => 'inline; filename=\"' . $this->_config['filename'] . '.docx\"',
                    'type'        => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                );
            case 'XLSX':
                return array(
                    'disposition' => 'inline; filename=\"' . $this->_config['filename'] . '.xlsx\"',
                    'type'        => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                );
            case 'PPTX':
                return array(
                    'disposition' => 'inline; filename=\"' . $this->_config['filename'] . '.pptx\"',
                    'type'        => 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                );
        }
    }

    private function getApplicationType($format){
        switch ($format){
            case 'PDF':
                return 'application/pdf';
            case 'RTF':
                return 'application/rtf';
            case 'DOCX':
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'ODT':
                return 'application/vnd.oasis.opendocument.text';
            case 'ODS':
                return 'application/vnd.oasis.opendocument.spreadsheet';
            case 'CSV':
                return 'application/csv';
            case 'XLS':
                return 'application/vnd.ms-excel';
            case 'XLSX':
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        }
    }

    public function  runReport($datas)
    {
        if($this->client->getDatasource()){
            if ($datas) {
                try {
                    $resource = $this->client->repositoryService()->getResource($datas['dirReport']); //obtener el resourse del reporte
//                    if(strcmp($resource->getDatasource(), $this->client->getDatasource()) != 0 ){
//                        $resource->setDataSource($this->client->getDatasource());
//                        $updateDataSource = $this->client->repositoryService()->updateResource($resource,true);
//                    } else {
//                        $updateDataSource = true;
//                    }
//                    print_r(strcmp($this->_config['datasource'], $this->client->getDatasource()));
//                    print_r($this->_config['datasource']);die;
//                    $updateDataSource=false;
                    if($this->_config){
                        if($this->_config['datasource']){
                            $resource->setDataSource($this->_config['datasource']); //poner el del archivo server_config.ini
                            $updateDataSource = $this->client->repositoryService()->updateResource($resource,true);
                        }else{
                            $updateDataSource = true;
                        }
                    }
                    if($updateDataSource) {
//                        $datas['params']['serverName'] = 'http://10.12.162.220:8081';
                        $datas['params']['serverName'] = 'http://' . $_SERVER['SERVER_NAME'] . ":" . $_SERVER['SERVER_PORT'];
                        // $datas['params']['idestructura'] = $this->global->Estructura->idestructura;
                        $report = $this->client->reportService()->runReport($datas['dirReport'],
                            $datas['typeFormat'], $datas['pages'], $datas['attachmentsPrefix'], $datas['params'],
                            $datas['interactive'], $datas['paginated']);
                        if (isset($datas['useFirma'])) {
                            $result = new stdClass();
                            $result->success = true;
                            $result->data = $report;
                            return $result;
                        } else {
                            $this->autoShow = false;
                            if ($datas['isAttachment']) {
                                header('Cache-Control: must-revalidate');
                                header('Pragma: public');
                                header('Content-Description: File Transfer');
                                header('Content-Disposition: attachment; filename='.ucfirst($datas['name']) . "." . strtolower($datas['typeFormat']));
                                header('Content-Transfer-Encoding: binary');
                                header('Content-Length: ' . strlen($report));
                            }
                            header ('Content-Type: ' . $this->getApplicationType($datas['typeFormat']) .'; charset=utf-8');
                            echo $report;
                        }
                    } else {
                        echo 'Mensaje: </br>';
                        echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                        echo '&nbsp;&nbsp;' . 'Error en la fuente de datos';
                        echo '</pre>' . '</br>';
                        echo 'Detalles:';
                        echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                        print_r('La fuente de dato no se actualiz&oacute;. Vuelve a intentarlo.');
                        echo '</pre>';
                    }
                } catch (Exception $exc) {
                    $this->autoShow = false;
                    switch($exc->getCode()){
                        case 0:{
                            echo 'Mensaje: </br>';
                            echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                            echo '&nbsp;&nbsp;' . 'Error de conexi&oacute;n';
                            echo '</pre>' . '</br>';
                            echo 'Detalles:';
                            echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                            //print_r('El servidor no se encuentra disponible.</br> &nbsp;&nbsp; 1- El servidor puede estar apagado.</br> &nbsp;&nbsp; 2- El servidor no esta corriendo.</br> &nbsp;&nbsp; 3- El cliente debe estar configurado correctamente.</br> &nbsp;&nbsp; 4- Revisar elementos de seguridad(Firewall,Antivirus,IDS/IDP,Otros...).');
                            //echo '</pre>' . '</br>';
                            // echo 'Otros Detalles:';
                            //   echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                            print_r($exc);
                            echo '</pre>';
                            break;
                        };
                        case 200:{
                            break;
                        };
                        default: {
                            echo 'Mensaje: </br>';
                            echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                            echo '&nbsp;&nbsp;' . 'Error.Por favor contacte al administrador.';
                            echo '</pre>' . '</br>';
                            echo 'Detalles:';
                            echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                            echo $exc->getMessage();
                            echo '</pre>';
                        }
                            break;
                    };
                }
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
        } else {
            echo 'Mensaje: </br>';
            echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
            echo '&nbsp;&nbsp;' . 'Error en la configuraci&oacute;n';
            echo '</pre>' . '</br>';
            echo 'Detalles:';
            echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
            print_r('Por favor configure la fuente de dato en el archivo config.ini en la ruta /lib/JasperReports/JasperClient/class/Jaspersoft/Config/config.ini .');
            echo '</pre>';
        }
    }
}