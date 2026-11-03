<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);


class PDFResumenAusentismo extends fpdf
{
}

class ExportarResumenAusentismoModel extends ZendExt_Model
{
    public function ExportarResumenAusentismoModel()
    {
        parent::ZendExt_Model();

    }

    public function construirReporte($result)
    {
        $pdf = new PDFResumenAusentismo('L', 'mm','A3');
        $pdf->AddPage();
        $this->table = new Tableml($pdf);
        $pdffinal = $this->cabeceraReporte($pdf,$result['mes'],$result['year']);
        $pdffinal = $this->cuerpoReporte($pdf, $result['reporte']);
        $pdffinal = $this->totalesReporte($pdf, $result['totales'],$result['promhombresdianotrab'],
                          $result['porccausalesxcanthrsnotrab'],$result['tmponolabmes'],$result['canthrslabmes']);
        ob_clean();
        $pdffinal->Output();
    }

    public function totalesReporte($pdf, $totales,$promhombresdianotrab, $porccausalesxcanthrsnotrab,$tmponolabmes,$canthrslabmes)
    {

            $y = $pdf->GetY();
            if ($y >= '250') {
                $pdf->AddPage();
                $this->cabeceraReporte($pdf,$totales);
            }
            $value = $totales;
            $pdf->SetFont('Times', 'B', 14);
            $pdf->SetX(15);           
            $pdf->Cell(130, 10, "" . utf8_decode("TOTAL"), 1, 0, "R");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tdiasnaturales']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['ttotaltrabajadores']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tfondotiempocalendario']), 1, 0, "");
            $pdf->SetFillColor(255,204,153);
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['ttiemponolaborable']), 1, 0, "",1);
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tvacaciones']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['ttiemponotrabporalta']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['ttiemponotrabporbaja']), 1, 0, "");
            $pdf->SetFillColor(255,255,153);
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tfdotiempomaxutilizable']), 1, 0, "",1);
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tfdotiemponoutilizado']), 1, 0, "", 1);
            $pdf->SetFillColor(204,255,204);
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tlicenciaamparoleymatern']), 1, 0, "", 1);
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tlicenciamaternidad']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tprestacionsocial']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tlicsinsueldxleymatern']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tautorizlegalesvigentes']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tinterrupcionesdiascomletos']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['taccidentetrabytray']), 1, 0, "", 1);
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['taccidentetrabajo']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['taccidentetrayecto']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tenfermedad']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tautorizadministrativas']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tausenciajustif']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tfondotiempoutilizado']), 1, 0, "", 1);
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tIndiceutilizfdotpo']), 1, 0, "", 1);
            $pdf->SetFillColor(250,191,143);
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tindiceausencia']), 1, 0, "", 1);
            $pdf->SetFillColor(255,255,153);
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tindiceausentismo']), 1, 0, "", 1);
            $pdf->SetFillColor(255,255,0);
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['thombresxdiastrabajado']), 1, 0, "", 1);
            $pdf->SetFillColor(255,255,153);
            $pdf->Cell(15, 10, "" . utf8_decode("" . $value['tporcientoausentismototal']), 1, 0, "", 1);
            $pdf->Ln(20);

        $pdf->SetFont('Times', 'B', 16);
        $pdf->SetX(15);
        $pdf->SetFillColor(204,255,204);
        $pdf->Cell(130, 10, "" . utf8_decode("Promedio hombres/dia no trabajado"), 1, 0, "C",1);
        $pdf->SetX(15 + 130 + 15*8);
        $pdf->Cell(15, 10, "" . utf8_decode("".$promhombresdianotrab[0]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$promhombresdianotrab[1]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$promhombresdianotrab[2]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$promhombresdianotrab[3]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$promhombresdianotrab[4]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$promhombresdianotrab[5]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$promhombresdianotrab[6]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$promhombresdianotrab[7]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$promhombresdianotrab[8]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$promhombresdianotrab[9]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$promhombresdianotrab[10]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$promhombresdianotrab[11]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$promhombresdianotrab[12]), 1, 0, "", 1);
        $pdf->Ln(20);
        $pdf->SetX(15);
        $pdf->SetFillColor(255,255,153);
        $pdf->Cell(190, 10, "" . utf8_decode("Porciento de las causales contra el total de horas dejadas de trabajar"), 1, 0, "C",1);
        $pdf->SetX(15 + 130 + 15*9);
        $pdf->Cell(15, 10, "" . utf8_decode("".$porccausalesxcanthrsnotrab[0]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$porccausalesxcanthrsnotrab[1]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$porccausalesxcanthrsnotrab[2]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$porccausalesxcanthrsnotrab[3]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$porccausalesxcanthrsnotrab[4]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$porccausalesxcanthrsnotrab[5]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$porccausalesxcanthrsnotrab[6]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$porccausalesxcanthrsnotrab[7]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$porccausalesxcanthrsnotrab[8]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$porccausalesxcanthrsnotrab[9]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$porccausalesxcanthrsnotrab[10]), 1, 0, "", 1);
        $pdf->Cell(15, 10, "" . utf8_decode("".$porccausalesxcanthrsnotrab[11]), 1, 0, "", 1);
        $pdf->Ln(20);
        $pdf->SetX(15);
        $pdf->SetFillColor(255,255,153);
        $pdf->Cell(130, 10, "" . utf8_decode("Tiempo no laborable del mes"), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode("".$tmponolabmes), 1, 1, "");
        $pdf->Ln(20);
        $pdf->SetX(15);
        $pdf->SetFillColor(255,255,153);
        $pdf->Cell(130, 10, "" . utf8_decode("Cantidad de horas laborables en el mes"), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode("".$canthrslabmes), 1, 1, "");

        return $pdf;
    }

    public function cuerpoReporte($pdf, $result)
    {
        $pdf->SetFont('Times', '', 14);
        foreach ($result as $j => $value) {
            $y = $pdf->GetY();
            if ($y >= '250') {
                $pdf->AddPage();
                $this->cabeceraReporte($pdf,$result);
            }
            $pdf->SetX(15);
            $widthHeaderTable = array(130,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15);
            $align = ['L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L'];
            $arr = array(utf8_decode($value['organo']));
            array_push($arr, utf8_decode($value['diasnaturales']));
            array_push($arr, utf8_decode($value['totaltrabajadores']));
            array_push($arr, utf8_decode($value['fondotiempocalendario']));
            array_push($arr, utf8_decode($value['tiemponolaborable']));
            array_push($arr, utf8_decode($value['vacaciones']));
            array_push($arr, utf8_decode($value['tiemponotrabporalta']));
            array_push($arr, utf8_decode($value['tiemponotrabporbaja']));
            array_push($arr, utf8_decode($value['fdotiempomaxutilizable']));
            array_push($arr, utf8_decode($value['fdotiemponoutilizado']));
            array_push($arr, utf8_decode($value['licenciaamparoleymatern']));
            array_push($arr, utf8_decode($value['licenciamaternidad']));
            array_push($arr, utf8_decode($value['prestacionsocial']));
            array_push($arr, utf8_decode($value['licsinsueldxleymatern']));
            array_push($arr, utf8_decode($value['autorizlegalesvigentes']));
            array_push($arr, utf8_decode($value['interrupcionesdiascomletos']));
            array_push($arr, utf8_decode($value['accidentetrabytray']));
            array_push($arr, utf8_decode($value['accidentetrabajo']));
            array_push($arr, utf8_decode($value['accidentetrayecto']));
            array_push($arr, utf8_decode($value['enfermedad']));
            array_push($arr, utf8_decode($value['autorizadministrativas']));
            array_push($arr, utf8_decode($value['ausenciajustif']));
            array_push($arr, utf8_decode($value['fondotiempoutilizado']));
            array_push($arr, utf8_decode($value['Indiceutilizfdotpo']));
            array_push($arr, utf8_decode($value['indiceausencia']));
            array_push($arr, utf8_decode($value['indiceausentismo']));
            array_push($arr, utf8_decode($value['hombresxdiastrabajado']));
            array_push($arr, utf8_decode($value['porcientoausentismototal']));

            $this->alingsArray = $align;
            $this->table->SetAligns($this->alingsArray);
            $this->table->SetWidths($widthHeaderTable);
            $this->table->Row($arr,0,0,12);
        }
        return $pdf;
    }

    public function cabeceraReporte($pdf,$mes,$year)
    {
        $mes = $this->getMes($mes);

        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Text(15, 20, utf8_decode('REPORTE DE AUSENTISMO ANEXO AL MODELO 18'));
        $pdf->Ln(10);
        $pdf->Text(15, 30, "RESUMEN  EMPRESA");
        $pdf->Cell(560, 10, utf8_decode($mes.' '.$year), 0, 0, 'C', 0);
        $pdf->Ln(20);

        $pdf->SetFont('Times', 'B', 14);
        $pdf->SetX(15);
        $pdf->SetFillColor(255, 255, 255);
        $x = $pdf->GetX();
        $y = $pdf->GetY();
        $pdf->Cell(130, 90, "" . utf8_decode("ORGANOS"), 1, 0, "C", true);

        $pdf->SetY($y);
        $pdf->SetX($x + 130);  
        $this->addVerticalColumn(90, 'Días naturales del mes', 1, 1.875, $pdf);
        $pdf->SetX($x + 145);
        $this->addVerticalColumn(90, 'Total de trabajadores', 1.875, 1.875, $pdf);
        $this->addVerticalColumn(90, 'Fondo de Tiempo Calendario', 1.875, 1.875, $pdf);
        $pdf->SetFillColor(255,204,153);
        $this->addVerticalColumn(90, 'Tiempo no laborable del mes', 1.875, 1.875, $pdf, 1);
        $this->addVerticalColumn(90, 'Vacaciones', 1.875, 1.875, $pdf);
        $this->addVerticalColumn(90, 'Tiempo no trabajado por alta', 1.875, 1.875, $pdf);
        $this->addVerticalColumn(90, 'Tiempo no trabajado por baja', 1.875, 1.875, $pdf);
        $pdf->SetFillColor(255,255,153);
        $this->addVerticalColumn(90, 'Fondo de tiempo máximo utilizable', 1.875, 1.875, $pdf, 1);
        $this->addVerticalColumn(90, 'Fondo de tiempo no utilizado', 1.875, 1.875, $pdf, 1);
        $pdf->SetFillColor(204,255,204);
        $this->addVerticalColumn(90, 'Licencia al amparo ley maternidad', 1.875, 1.875, $pdf, 1);
        $this->addVerticalColumn(90, 'Licencia de Maternidad', 1.875, 1.875, $pdf);
        $this->addVerticalColumn(90, 'Prestacion Social', 1.875, 1.875, $pdf);
        $this->addVerticalColumn(90, 'Licencia sin sueldo por ley maternidad', 1.875, 1.875, $pdf);
        $this->addVerticalColumn(90, 'Autorizaciones Legales vigentes', 1.875, 1.875, $pdf);
        $this->addVerticalColumn(90, 'Interrupciones de dias completos', 1.875, 1.875, $pdf);        
        $this->addVerticalColumn(90, 'Accidente de trabajo y trayecto', 1.875, 1.875, $pdf, 1);
        $this->addVerticalColumn(90, 'Accidente de trabajo', 1.875, 1.875, $pdf);
        $this->addVerticalColumn(90, 'Accidente de trayecto', 1.875, 1.875, $pdf);
        $this->addVerticalColumn(90, 'Enfermedad (Certificado médico)', 1.875, 1.875, $pdf);
        $this->addVerticalColumn(90, 'Autorizaciones administrativas', 1.875, 1.875, $pdf);
        $this->addVerticalColumn(90, 'Ausencias Justificadas', 1.875, 1.875, $pdf);
        $this->addVerticalColumn(90, 'Fondo de tiempo utilizado', 1.875, 1.875, $pdf, 1);
        $this->addVerticalColumn(90, 'Índice de utilización Fondo de Tiempo', 1.875, 1.875, $pdf, 1);
        $pdf->SetFillColor(250,191,143);
        $this->addVerticalColumn(90, 'Índice de ausencia', 1.875, 1.875, $pdf, 1);
        $pdf->SetFillColor(255,255,153);
        $this->addVerticalColumn(90, 'Índice de ausentismo', 1.875, 1.875, $pdf, 1);
        $pdf->SetFillColor(255,255,0);
        $this->addVerticalColumn(90, 'Hombres/Días Trabajado', 1.875, 1.875, $pdf, 1);
        $pdf->SetFillColor(255,255,153);
        $this->addVerticalColumn(90, 'Porciento de ausentismo total', 1.875, 1.875, $pdf, 1);

        $pdf->Ln(90);
        return $pdf;
    }

     private function addVerticalColumn($w, $text, $salto, $space = 1, &$pdf, $fill = 0)
    {
        $x = $pdf->GetX();
        $y = $pdf->GetY();
        $pdf->Rotate(90, $x + ($w / 2), $y + ($w / 2));
        $pdf->MultiCell($w, $space * 8, utf8_decode($text), 1, 'C', $fill);
        $pdf->SetY($y);
        $pdf->SetX($x + (8 * $salto));
        $pdf->Rotate(0);
    }

    private function getMes($mesnum)
    {
        if ($mesnum == 1) {
            return 'ENERO';
        } else if ($mesnum == 2) {
            return 'FEBRERO';
        } else if ($mesnum == 3) {
            return 'MARZO';
        } else if ($mesnum == 4) {
            return 'ABRIL';
        } else if ($mesnum == 5) {
            return 'MAYO';
        } else if ($mesnum == 6) {
            return 'JUNIO';
        } else if ($mesnum == 7) {
            return 'JULIO';
        } else if ($mesnum == 8) {
            return 'AGOSTO';
        } else if ($mesnum == 9) {
            return 'SEPTIEMBRE';
        } else if ($mesnum == 10) {
            return 'OCTUBRE';
        } else if ($mesnum == 11) {
            return 'NOVIEMBRE';
        } else if ($mesnum == 12) {
            return 'DICIEMBRE';
        } else {
            return '';
        }
    }
}