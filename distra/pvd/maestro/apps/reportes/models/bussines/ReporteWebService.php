<?php

/**
 * ReporteWebService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class ReporteWebService
{
    private $_user;
    private $_password;
    private $_baseUrl;
    private $_fileName;

    public function __construct()
    {
        $this->_user = 'administrador';
        $this->_password = 'admin123';
        $this->_baseUrl = "http://10.12.162.80:8080/Distra_Server/ServiceReport?datas=";
        //$this->_baseUrl = "http://10.12.162.153:8080/Distra_Server/ServiceReport?datas=";
        $this->_fileName = 'prueba';
    }

    public function getReportDataFromJasperServer($resource, $format, $filters)
    {
        $handler = curl_init($this->getUrl($resource, $format, $filters));
        curl_setopt($handler, CURLOPT_RETURNTRANSFER, TRUE);
        $response = curl_exec($handler);
        curl_close($handler);
        return $response;
    }

    private function getUrl($resource, $format, $filters)
    {//var_dump($filters);die;
        $params = array();
        $params['usuario'] = "administrador";
        $params['clave'] = "admin123";
        $params['recurso'] = $resource;
        $params['formato'] = $format;
        $params['parametros'] = (empty($filters[0]['value']))?null:$filters;
       // var_dump($params);die;
		return $this->_baseUrl.base64_encode(json_encode($params));
       // var_dump(_baseUrl);die;
    }

    public function getResponseHeaderConfigByFormat($format)
    {
        switch($format){
            case 'PDF':
                return array(
                    'disposition' => 'inline; filename=\"'.$this->_fileName.'.pdf\"',
                    'type' => 'application/pdf'
                );
            case 'ODT':
                return array(
                    'disposition' => 'inline; filename=\"'.$this->_fileName.'.odt\"',
                    'type' => 'application/vnd.oasis.opendocument.text'
                );
            case 'RTF':
                return array(
                    'disposition' => 'inline; filename=\"'.$this->_fileName.'.rtf\"',
                    'type' => 'application/rtf'
                );
            case 'XLS':
                return array(
                    'disposition' => 'inline; filename=\"'.$this->_fileName.'.xls\"',
                    'type' => 'application/xls'
                );
            case 'CSV':
                return array(
                    'disposition' => 'inline; filename=\"'.$this->_fileName.'.csv\"',
                    'type' => 'application/csv'
                );
            case 'DOCX':
                return array(
                    'disposition' => 'inline; filename=\"'.$this->_fileName.'.docx\"',
                    'type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                );
            case 'XLSX':
                return array(
                    'disposition' => 'inline; filename=\"'.$this->_fileName.'.xlsx\"',
                    'type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                );
            case 'PPTX':
                return array(
                    'disposition' => 'inline; filename=\"'.$this->_fileName.'.pptx\"',
                    'type' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                );
        }
    }
}