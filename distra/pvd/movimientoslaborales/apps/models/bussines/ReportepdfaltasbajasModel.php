<?php
class PDFFuerzatrabajo extends fpdf
{
    private $pdf;
    private $table;
    private $alingsArray;
    private $datos;
    function Footer()
    {

    }
}
class ReportepdfaltasbajasModel extends ZendExt_Model
{
    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura, $idconcepto, $fdesde, $fhasta, $altaobaja)
    {
        $pdf = new PDFFuerzatrabajo('L', 'mm', 'a3');
        $this->pdf = $pdf;
        $this->table = new Tableml($this->pdf);
        $DatSituacionlaboralModel = new DatSituacionlaboralModel();
        $datos = $DatSituacionlaboralModel->getRegistroAltasBajas($idestructura, $idconcepto, $fdesde, $fhasta, $altaobaja);
        $this->crearEncabezadoPrincipal('Registro de altas y bajas');
        $pdfNGeneral = $this->crearCuerpo($datos);
        $pdfNGeneral->Output();

    }

    private function crearCuerpo($datos)
    {
        $this->pdf->SetFont('Times', '', 12);
        foreach ($datos as $k=>$valores) {
            $valores['area'] = (empty($valores['area']))?'Eliminada':$valores['area'];
            if ($valores['idarea'] != $datos[$k-1]['idarea']) {
                $y = $this->pdf->GetY();
                if ($y >= '230' ) {
                    $this->pdf->AddPage();
                    $this->getEncabezado($valores['area'].' ('.count($valores['datos']).')', true);
                } else {
                    $this->getEncabezado($valores['area'].' ('.count($valores['datos']).')', false);
                }
            }
            foreach ($valores['datos'] as $i=>$val) {
                $y = $this->pdf->GetY();
                if ($y >= '240') {
                    $this->pdf->AddPage();
                    $this->getEncabezado($valores['area'].' ('.count($valores['datos']).')', true);
                }
                $direccion = 'Dirección principal no definida.';
                if (isset($val['direccion'])) {
                    $direccion = $val['direccion'].', ';
                    if ($val['municipio']!='' && $val['provincia'] != '') {
                        $direccion .= $val['municipio'].', '.$val['provincia'];
                    } else if ($val['provincia']!='') {
                        $direccion .= $val['provincia'];
                    } else if ($val['municipio']!='') {
                        $direccion .= $val['municipio'];
                    }
                }


                $widthHeaderTable = array(17, 40, 150, 50, 50, 40, 16, 16, 16, 16, 16, 16, 24, 16, 16, 16, 16);
                $align = ['C', 'C', 'L', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'];
                $this->alingsArray = $align;
                $this->table->SetAligns($this->alingsArray);
                $this->table->SetWidths($widthHeaderTable);
                $motbaja = $val['motivobaja'];
                $otros = '';
                if (!empty($motbaja)) {
                    $confimotivos = ConfMotivosbaja::getConfiguraciones();
                    if (count($confimotivos) == 0) {
                        $otros = 'X';
                    } else {
                        if ($confimotivos[0]['idmotivobaja'] != $val['idmotivo'] &&
                            $confimotivos[1]['idmotivobaja'] != $val['idmotivo'] &&
                            $confimotivos[2]['idmotivobaja'] != $val['idmotivo'] &&
                            $confimotivos[3]['idmotivobaja'] != $val['idmotivo'] &&
                            $confimotivos[4]['idmotivobaja'] != $val['idmotivo'] &&
                            $confimotivos[5]['idmotivobaja'] != $val['idmotivo'] &&
                            $confimotivos[6]['idmotivobaja'] != $val['idmotivo'] &&
                            $confimotivos[7]['idmotivobaja'] != $val['idmotivo'] &&
                            $confimotivos[8]['idmotivobaja'] != $val['idmotivo'] &&
                            $confimotivos[9]['idmotivobaja'] != $val['idmotivo']) {
                            $otros = 'X';
                        }
                    }
                }
                $arr = array(
                    ($i+1),
                    utf8_decode($val['numid']),
                    utf8_decode($val['nombreyapellidos'].' ('.$direccion.')'),
                    $val['fdesde'].' - '.$val['noalta'],
                    $val['procedenciasocial'], /*$val['fhasta'],*/(!empty($motbaja))?$val['fhasta']:'',
                    (!empty($val['idmotivo']) && $confimotivos[0]['idmotivobaja'] == $val['idmotivo'])?'X':'',
                    (!empty($val['idmotivo']) && $confimotivos[1]['idmotivobaja'] == $val['idmotivo'])?'X':'',
                    (!empty($val['idmotivo']) && $confimotivos[2]['idmotivobaja'] == $val['idmotivo'])?'X':'',
                    (!empty($val['idmotivo']) && $confimotivos[3]['idmotivobaja'] == $val['idmotivo'])?'X':'',
                    (!empty($val['idmotivo']) && $confimotivos[4]['idmotivobaja'] == $val['idmotivo'])?'X':'',
                    (!empty($val['idmotivo']) && $confimotivos[5]['idmotivobaja'] == $val['idmotivo'])?'X':'',
                    (!empty($val['idmotivo']) && $confimotivos[6]['idmotivobaja'] == $val['idmotivo'])?'X':'',
                    (!empty($val['idmotivo']) && $confimotivos[7]['idmotivobaja'] == $val['idmotivo'])?'X':'',
                    (!empty($val['idmotivo']) && $confimotivos[8]['idmotivobaja'] == $val['idmotivo'])?'X':'',
                    (!empty($val['idmotivo']) && $confimotivos[9]['idmotivobaja'] == $val['idmotivo'])?'X':'',
                    $otros
                );
                $this->table->Row($arr);
            }
        }
        return $this->pdf;
    }

    private function crearEncabezadoPrincipal($titulo)
    {
        $this->pdf->SetLeftMargin(15);
        $this->pdf->AddPage();
        $this->pdf->SetFont('Times', 'B', 20);
        $this->pdf->SetLineWidth(0.5);
        $this->pdf->Cell(551, 10, utf8_decode($titulo), 0, 0, 'C', 0);
        $this->pdf->Ln(20);
        $this->pdf->SetFont('Times', 'B', 18);
        $this->pdf->Cell(17, 50, 'No.', 1, 0, 'C', 0);
        $this->pdf->Cell(40, 50, utf8_decode('No. Carné'), 1, 0, 'C', 0);
        $this->pdf->Cell(150, 50, utf8_decode('Dirección particular del trabajador'), 1, 0, 'C', 0);
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->MultiCell(100, 10, utf8_decode('Alta'), 1, 'C');
        $y += 10;
        $this->pdf->SetY($y);
        $this->pdf->SetX($x);
        $this->pdf->MultiCell(50, 20, utf8_decode('Fecha y no. de alta'), 1, 'C');
        $this->pdf->SetY($y);
        $this->pdf->SetX($x+50);
        $this->pdf->MultiCell(50, 20, utf8_decode('Fuente de procedencia'), 1, 'C');
        $this->pdf->SetY($y-10);
        $this->pdf->SetX($x+100);
        $this->pdf->Cell(40, 50, utf8_decode('Fecha de baja'), 1, 0, 'C', 0);
        $this->pdf->MultiCell(184, 10, utf8_decode('Motivo de la baja'), 1, 'C');
        $this->pdf->SetY($y);
        $this->pdf->SetX($x+140);
        $this->addVerticalColumn(40, 'Salarial', 2, 2);
        $this->addVerticalColumn(40, 'Jubilación', 2, 2);
        $this->addVerticalColumn(40, 'Fallecimiento', 2, 2);
        $this->addVerticalColumn(40, 'Invalidez total', 2);
        $this->addVerticalColumn(40, 'Invalidez parcial', 2);
        $this->addVerticalColumn(40, 'Privación de libertad', 2);
        $this->addVerticalColumn(40, 'Paso a formas no estatales', 3);
        $this->addVerticalColumn(40, 'Proceso de disponibilid.', 2);
        $this->addVerticalColumn(40, 'Sanción administ.', 2);
        $this->addVerticalColumn(40, 'Salida del país', 2);
        $this->addVerticalColumn(40, 'Otras', 2, 2);
        $this->pdf->Ln(40);
    }

    private function getEncabezado($newarea, $completo)
    {
        $this->pdf->SetFont('Times', 'B', 20);
        $this->pdf->SetLineWidth(0.5);
        if ($completo == true) {
            $this->pdf->SetFont('Times', 'B', 18);
            $this->pdf->Ln(10);
            $no = 'No.';
            $this->pdf->Cell(17, 50, $no, 1, 0, 'C', 0);
            $this->pdf->Cell(40, 50, utf8_decode('No. Carné'), 1, 0, 'C', 0);
            $this->pdf->Cell(150, 50, utf8_decode('Dirección particular del trabajador'), 1, 0, 'C', 0);
            $x = $this->pdf->GetX();
            $y = $this->pdf->GetY();
            $this->pdf->MultiCell(100, 10, utf8_decode('Alta'), 1, 'C');
            $y += 10;
            $this->pdf->SetY($y);
            $this->pdf->SetX($x);
            $this->pdf->MultiCell(50, 20, utf8_decode('Fecha y no. de alta'), 1, 'C');
            $this->pdf->SetY($y);
            $this->pdf->SetX($x + 50);
            $this->pdf->MultiCell(50, 20, utf8_decode('Fuente de procedencia'), 1, 'C');
            $this->pdf->SetY($y - 10);
            $this->pdf->SetX($x + 100);
            $this->pdf->Cell(40, 50, utf8_decode('Fecha de baja'), 1, 0, 'C', 0);
            $this->pdf->MultiCell(184, 10, utf8_decode('Motivo de la baja'), 1, 'C');
            $this->pdf->SetY($y);
            $this->pdf->SetX($x + 140);
            $this->addVerticalColumn(40, 'Salarial', 2, 2);
            $this->addVerticalColumn(40, 'Jubilación', 2, 2);
            $this->addVerticalColumn(40, 'Fallecimiento', 2, 2);
            $this->addVerticalColumn(40, 'Invalidez total', 2);
            $this->addVerticalColumn(40, 'Invalidez parcial', 2);
            $this->addVerticalColumn(40, 'Privación de libertad', 2);
            $this->addVerticalColumn(40, 'Paso a formas no estatales', 3);
            $this->addVerticalColumn(40, 'Proceso de disponibilid.', 2);
            $this->addVerticalColumn(40, 'Sanción administ.', 2);
            $this->addVerticalColumn(40, 'Salida del país', 2);
            $this->addVerticalColumn(40, 'Otras', 2, 2);
            $this->pdf->Ln(40);
        }
        if ($newarea != '') {
            $this->pdf->Cell(531, 10, utf8_decode('Área: '.$newarea), 1, 0, 'L', 0);
        } else {
            $this->pdf->Cell(531, 10, utf8_decode('Área: SIN ASIGNAR'), 1, 0, 'L', 0);
        }
        $this->pdf->Ln(10);
        $this->pdf->SetFont('Times', '', 12);
    }

    private function addVerticalColumn($w, $text, $salto, $space = 1)
    {
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->Rotate(90, $x + ($w / 2), $y + ($w / 2));
        $this->pdf->MultiCell($w, $space * 8, utf8_decode($text), 1, 'C');
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + (8 * $salto));
        $this->pdf->Rotate(0);
    }
}