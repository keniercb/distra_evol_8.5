<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 013 xetid
 * @version   Release: @package_version@
 */
class ReportePlantilla extends fpdf
{
    private $pdf;
    private $table;
    private $widthInd;
    private $aprueba;
    private $elabora;
    private $datosPlantilla;
    private $config;

    /**
     * Descripción del método: Inserta una nueva configuración.
     *
     * @author    : Ing. Osvaldo M. Gonzalez.
     * @modify    : Ing. Yoandry Borges.
     * @modify    : Ing. Pedro Jiménez.
     *
     * @param $config Configuración del reporte.
     *
     * @copyright Copyright (c) 013 xetid.
     */
    public function __construct($config)
    {
        $this->pdf = new fpdf('L', 'mm', $config['formato']);
        $this->table = new Table($this->pdf);
        $this->config = $config;
        $this->aprueba = $config['aprueba'];
        $this->elabora = $config['elabora'];

        $this->pdf->SetMargins(5, 5, 5);
        $this->widthInd = 300;
        $this->pdf->SetFillColor(200, 200, 200);
    }

    /**
     * Descripción del método: Crea los datos para los reportes de la configuración.
     *
     * @author    : Ing. Osvaldo M. Gonzalez.
     * @modify    : Ing. Yoandry Borges.
     * @modify    : Ing. Pedro Jiménez.
     *
     * @param $datos para establecer la configuración.
     *
     * @copyright Copyright (c) 013 xetid.
     */
    public function createPDF($datos, $aprueba, $elabora)
    {

        ob_start();
        $this->datosPlantilla = $datos;
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetRightMargin(1);
        $compare = $datos['proyecto'] ? 1 : 0;
        $header = true;
        if (count($datos) > $compare) {
            if ($this->config['anexoOrganigrama'] && count($datos['organigrama']) > 0) {
                $anexoUno = new AnexoOrganigrama($this->pdf, $this->table, $this->config, $datos);
                $pageNum = $anexoUno->createAnexo();
                $this->config['hoja'] = $pageNum + 1;
                $header = false;
            }
            $this->ordenAnexos($datos, $header, $aprueba, $elabora);
            //print_r($datos);die;
            //si se marcó a guardar en el historial
            if ($datos['historial'] == 1) {
                $idproyecto = $datos['idproyecto'];
                $idestructura = $datos['plantilla'][0];
                // print_r($idestructura); die;
                $pdf = $this->pdf->Output('', 'S');
                $r = $this->guardarPdf($pdf, $idproyecto,$idestructura);
            }
            $this->pdf->Output();
            ob_flush();
        } else {
            echo(Zend_Json::encode(
                          array(
                              "codMsg" => "1", "mensaje" => "No existen valores disponibles para generar el reporte.")
            ));
        }
    }

    public function guardarPdf($pdf, $idproyecto,$idestructura)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sqlnombreproyecto = "SELECT idproyecto, denominacion, descripcion, idusuario, fecha, modificado, 
         idpadre, aprobado, fechafin
         FROM mod_estructuracomp.dat_proyecto
         WHERE idproyecto= $idproyecto;";
        $proyecto = $conn->fetchAll($sqlnombreproyecto);

        $hoy = date("m.d.y");
        $nombreproyecto = $proyecto[0]['denominacion'];
        $nombrereporte = $idestructura.'_'.$nombreproyecto . '_' . $hoy;

        $file_location = $_SERVER['DOCUMENT_ROOT'] . "/metadatos/proyecto/reportes/" . $nombrereporte . ".pdf";
        file_put_contents($file_location, $pdf);
        /**/
        $sqlidreporteplantilla = "SELECT idreporteplantilla
                   FROM mod_estructuracomp.his_reporteplantilla
                  WHERE nombrereporte='$nombrereporte';";

        $idreporteplantilla = $conn->fetchAll($sqlidreporteplantilla);
        //print_r($idreporteplantilla);die;
        if(!$idreporteplantilla[0]){
            $sqldoc = "INSERT INTO mod_estructuracomp.his_reporteplantilla(
                nombrereporte, fechavigor, fechaderogacion,  nombreproyecto,idestructura)
              VALUES ('$nombrereporte', now(), now(),  '$nombreproyecto',$idestructura);";

            $r = $conn->fetchAll($sqldoc);
        }

    }

    private function ordenAnexos($datos, $header, $aprueba, $elabora)
    {
        $this->config['header'] = $header;
        $isGAE = $this->config['idresolucion'] == 'GAE';
        if ($isGAE) {
            $this->config['header'] = true;
            if ($this->config['anexoPlantilla']) {
                $header = true;
                $anexoPlantilla = new PlantillaGeneral($this->pdf, $this->config, $datos);
                $pageNum = $anexoPlantilla->createPlantilla();
                $this->config['hoja'] = $pageNum;
            }
            if ($this->config['anexoResumen']) {
                $anexo = new AnexoResumenPersonal($this->pdf, $this->table, $this->config, $datos);
                $anexo->createPresentation();
            }
        } else {
            if ($this->config['anexoResumen']) {
                $header = true;
                $anexo = new AnexoResumenPersonal($this->pdf, $this->table, $this->config, $datos);
                $pageNum = $anexo->createPresentation();
                $this->config['hoja'] = $pageNum;
            }
            if ($this->config['anexoPlantilla']) {
                $header = true;
                $anexoPlantilla = new PlantillaGeneral($this->pdf, $this->config, $datos);
                $anexoPlantilla->createPlantilla($aprueba, $elabora);
            }
        }
        
        return $header;
    }
}