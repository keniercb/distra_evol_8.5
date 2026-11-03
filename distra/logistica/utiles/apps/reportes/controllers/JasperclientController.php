<?php

/**
 * @class JasperclientController
 * A simple application controller extension
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class JasperclientController extends ZendExt_Controller_Secure
{
    private $model;

    public function init()
    {
        parent:: init();
        $this->model = new JasperClientModel();
    }

    /**
     * Obtiene el reporte del jasperserver.
     * @author Yadrian
     * * @param string $uri URI for the report you wish to run (is not null)
     * @param string $format The format you wish to receive the report in (default: pdf)
     * @param string $pages Request a specific page, or range of pages. Separate multiple pages or ranges by commas.
     *                          (e.g: "1,4-22,42,55-100")(default: null)
     * @param string $attachmentsPrefix a URI to prefix all image attachment sources with
     *                                  (must include trailing slash if needed)(default: null)
     * @param array $inputControls associative array of key => value for any input controls(default: null)
     * @param boolean $interactive Should reports using Highcharts be interactive?(default: false)
     * @param boolean $onePagePerSheet Produce paginated XLS or XLSX?(default: false)
     * @param boolean $freshData (default: false)
     * @param boolean $saveDataSnapshot (default: false)
     * @param string $transformerKey For use when running a report as a JasperPrint. Specifies print element transformers (default: null)
     * @return string Binary data of report los formatos de los reportes(HTML/PDF/DOCX/XLS/XLSX/ODT/ODS)
     */
    public function runReportAction()
    {
        $datas = Zend_Json::decode($this->_getAllParams()['datas']);
        return $this->model->runReport($datas);
    }

    public function exportReportAction()
    {
        $datas = Zend_Json::decode($this->_getAllParams()['datas']);
        return $this->model->exportReport($datas);
    }


}
