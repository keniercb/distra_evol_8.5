<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);


class PDFEstado extends fpdf
{
}

class ExportarCandidatosSelecModel extends ZendExt_Model
{
    private $pdf;
    private $datos;
    private $procesos;
    private $objprocesos;
    public function ExportarCandidatosSelecModel()
    {
        parent::ZendExt_Model();

    }

    public function export($estructura,$provincia,$municipio,$idestructura)
    {
        $this->pdf = new PDFEstado('L', 'mm', 'A3');
        $this->pdf->AddPage();
        $obj=new DatResultadoseleccion();
        $this->datos=$obj->getCandidatosSelecc($estructura,$provincia,$municipio,$idestructura);
      /*  echo '<pre>';
        print_r($this->datos);die;*/
        $this->objprocesos=new DatProceso();
        $this->crearCuerpo();
        $this->pdf->Output();
    }

    public function crearCuerpo()
    {
        $this->pdf->SetFont('Arial', 'B', 15);
        $this->pdf->SetMargins(50, 10);

        $w = 0;
        if( $this->datos) {

            $proc = $this->datos[$w]['idproceso'];
            while ($this->datos[$w]['idproceso'] == $proc) {

                $procesos = $this->objprocesos->getProcesosById($this->datos[$w]['idproceso']);
                $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($procesos[0]['idestructura']);
                $this->pdf->SetX(20);
                $this->pdf->SetFont('Arial', 'B', 15);
                $this->pdf->Cell(25, 15, "Entidad:", "LTB", 0, "");
                $this->pdf->SetFont('Arial', '', 15);
                $this->pdf->Cell(375, 15, utf8_decode("" . $estructura[0]->denominacion), "TB", 0, "");

                $this->pdf->SetFont('Arial', 'B', 15);
                $this->pdf->Cell(70, 15, "Fecha:", "TB", 0, 'R');
                $this->pdf->SetFont('Arial', '', 15);
                $this->pdf->Cell(30, 15, $procesos[0]['fdesde'], "RTB", 0, 'L');

                $this->pdf->ln(15);
                $this->pdf->SetX(20);
                $this->pdf->SetFont('Arial', 'B', 15);
                $this->pdf->Cell(25, 15, "Proceso:", "L", 0, "");
                $this->pdf->SetFont('Arial', '', 15);
                $this->pdf->Cell(475, 15, utf8_decode("" . $procesos[0]['denominacion']), "R", 0, "L");

                $this->pdf->ln(15);
                $this->pdf->SetX(20);
                $this->pdf->SetFont('Arial', 'B', 15);
                $this->pdf->Cell(40, 15, "No. identidad", 1, 0, "C");
                $this->pdf->Cell(80, 15, "Candidato", 1, 0, "C");
                $this->pdf->Cell(160, 15, utf8_decode("" . "Preubicación"), 1, 0, "C");
                $this->pdf->Cell(60, 15, "Provincia", 1, 0, "C");
                $this->pdf->Cell(60, 15, "Municipio", 1, 0, "C");
                $this->pdf->Cell(100, 15, utf8_decode("Dirección"), 1, 0, "C");

                do {
                    $this->pdf->ln(15);
                    $this->pdf->SetX(20);
                    $this->pdf->SetFont('Arial', '', 15);
                    $this->pdf->Cell(40, 15, $this->datos[$w]['numid'], 1, 0, "");
                    $this->pdf->Cell(80, 15, utf8_decode($this->datos[$w]['nombreapellidos']), 1, 0, "");
                    $this->pdf->Cell(160, 15, utf8_decode($estructura[0]->denominacion), 1, 0, "");
                    $this->pdf->Cell(60, 15, utf8_decode($this->datos[$w]['provincia']), 1, 0, "");
                    $this->pdf->Cell(60, 15, utf8_decode($this->datos[$w]['municipio']), 1, 0, "");
                    $this->pdf->Cell(100, 15, utf8_decode($this->datos[$w]['direccion']), 1, 0, "");

                    $w++;
                } while ($this->datos[$w]['idproceso'] == $proc);
                $proc = $this->datos[$w]['idproceso'];

                $this->pdf->ln(30);
                if ($w == count($this->datos)) {
                    break;
                }
            }

        }
        return $this->pdf;
    }









       /* foreach($this->datos as $k => $dat) {
            $procesos = $this->objprocesos->getProcesosById($dat['idproceso']);
            if ($proc != $dat['idproceso']) {
                $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($procesos[0]['idestructura']);
                $this->pdf->SetX(20);
                $this->pdf->Cell(250, 15, "Entidad:" . ' ' . "" . utf8_decode("" . $estructura[0]->denominacion), "LTB", 0, "");
                $this->pdf->Cell(250, 15, "Fecha:" . ' ' . $procesos[0]['fdesde'], "TRB", 0, 'R');

                $this->pdf->ln(15);
                $this->pdf->SetX(20);
                $this->pdf->Cell(500, 15, "Proceso:" . "" . utf8_decode("" . $procesos[0]['denominacion']), 1, 0, "");

                $this->pdf->ln(15);
                $this->pdf->SetX(20);
                $this->pdf->Cell(40, 15, "No. identidad", 1, 0, "C");
                $this->pdf->Cell(80, 15, "Candidato", 1, 0, "C");
                $this->pdf->Cell(160, 15, utf8_decode("" . "Preubicación"), 1, 0, "C");
                $this->pdf->Cell(60, 15, "Provincia", 1, 0, "C");
                $this->pdf->Cell(60, 15, "Municipio", 1, 0, "C");
                $this->pdf->Cell(100, 15, utf8_decode("Dirección"), 1, 0, "C");


                foreach ($this->datos as $k => $dat) {
                    $process = $dat['idproceso'];
                    if ($process == $dat['idproceso']) {
                        $this->pdf->ln(15);
                        $this->pdf->SetX(20);
                        $this->pdf->Cell(40, 15, $dat['numid'], 1, 0, "");
                        $this->pdf->Cell(80, 15, utf8_decode($dat['nombreapellidos']), 1, 0, "");
                        $this->pdf->Cell(160, 15, utf8_decode($estructura[0]->denominacion), 1, 0, "");
                        $this->pdf->Cell(60, 15, 'Guantanamo', 1, 0, "");
                        $this->pdf->Cell(60, 15, 'Baracoa', 1, 0, "");
                        $this->pdf->Cell(100, 15, utf8_decode($dat['direccion']), 1, 0, "");
                        $this->pdf->ln(30);

                    }
                }
                $proc = $dat['idproceso'];

            }
        }*/





    public function pintarTabla(){

        foreach ($this->datos as $k => $dat) {

            $this->pdf->ln(15);
            $this->pdf->SetX(20);
            $this->pdf->Cell(84, 15, "No. identidad:", 1, 0, "");
            $this->pdf->Cell(84, 15, "Candidato:", 1, 0, "");
            $this->pdf->Cell(83, 15, "Preubicacion:", 1, 0, "");
            $this->pdf->Cell(83, 15, "Provincia:", 1, 0, "");
            $this->pdf->Cell(83, 15, "Municipio:", 1, 0, "");
            $this->pdf->Cell(83, 15, "Direccion:", 1, 0, "");
            return $this->pdf;
        }



    }
}
