<?php
class PDFRegistrodatos extends fpdf
{

    private $pdf;
    private $concept;
    private $table;
    private $alingsArray;
    function Footer()
    {

    }
}

class ReportepdftrabajadoresModel extends ZendExt_Model
{

    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura, $idconcepto)
    {

        $pdf = new PDFRegistrodatos('L', 'mm', 'a4');
        $this->pdf = $pdf;
        $this->table = new Tableml($this->pdf);
        $this->concept = NomConceptosalarial::getConceptosSalarialesFijos(1);
        $objDS = new DatSituacionlaboralModel();
        $datos = $objDS->getRegistroAltas($idestructura, $idconcepto);
        $titulo = 'Registro de datos principales ';
        $this->crearEncabezadoPrincipal($titulo, $datos);
        $pdfNGeneral = $this->crearCuerpo($datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($datos)
    {
        $this->pdf->SetFont('Arial', '', 12);
        $arraydeterminados = Array();
        $contB = 0;
        $canttrab = 0;
        foreach ($datos as $k=>$valores) {
            if ($valores['idarea'] != $datos[$k - 1]['idarea']) {
                $y = $this->pdf->GetY();
                if ($y >= '190' ) {
                    $this->pdf->AddPage();
                    $this->getEncabezado($valores['area'], true);
                } else {
                    $this->getEncabezado($valores['area'], false);
                }
            }
            $contA = 0;
            foreach ($valores['datos'] as $val) {
                if ($val['determinado'] == 0) {
                    $y = $this->pdf->GetY();
                    if ($y >= '190' ) {
                        $this->pdf->AddPage();
                        $this->getEncabezado($valores['area'], true);
                    }
                    $canttrab++;
                    $widthHeaderTable = array(10, 62, 25, 45, 8, 25, 12, 12, 15, 12, 12, 16, 11, 11, 13);
                    $align = ['C', 'L', 'C', 'L', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'];
                    $this->alingsArray = $align;
                    $this->table->SetAligns($this->alingsArray);
                    $this->table->SetWidths($widthHeaderTable);
                    $arr = array(
                        ($contA + 1),
                        utf8_decode($val['cargo']),
                        utf8_decode($val['categoria']),
                        utf8_decode($val['nombreapellidos']),
                        $val['denomsexo'],
                        $val['numid'],
                        utf8_decode($val['preparacion']),
                        utf8_decode($val['grupocomplejidad']),
                        ($val['total'] == '')?$val['escala']:$val['total'],
                        $val['escala'],
                        $val['salario'][1],
                        $val['salario'][2],
                        $val['salario'][3],
                        $val['salario'][4],
                        $val['salario'][5]
                    );
                    $this->table->Row($arr, null, null, 9);
                    $contA++;
                } else {
                    $arraydeterminados[$contB] = $val;
                    $arraydeterminados[$contB]['area'] = $valores['area'];
                    $arraydeterminados[$contB]['idarea'] = $valores['idarea'];
                    $contB++;
                }
            }
        }
        if (count($arraydeterminados) > 0) {
            $cargosdeter = $this->organizarPorArea($arraydeterminados);
            $this->crearEncabezadoPrincipal(
                'Anexo: Registro del personal con contratos determinados',
                $cargosdeter
            );
            $this->crearAnexo($cargosdeter, $canttrab);
        } else {
            $this->pdf->SetFont('Arial', 'B', 12);
            $this->pdf->Ln(14);
            $ti = utf8_decode('TOTAL DE TRABAJADORES EN PLANTILLA: '.$canttrab);
            $this->pdf->Cell(290, 20, $ti, 0, 0, 'C', 0);
            $this->pdf->Ln(10);
            $td = utf8_decode('TOTAL DE TRABAJADORES POR PERIODO DETERMINADO: 0');
            $this->pdf->Cell(290, 20, $td, 0, 0, 'C', 0);
            $this->pdf->Ln(40);
        }
        return $this->pdf;
    }

    private function crearEncabezadoPrincipal($titulo, $datos)
    {
        $this->pdf->SetLeftMargin(5);
        $this->pdf->SetAutoPageBreak(true, 5);
        $this->pdf->AddPage();
        $this->pdf->SetFont('Arial', 'B', 12);
        $this->pdf->SetLineWidth(0.4);
        if ($datos == 2) {
            $men = 'Disculpe, no se pudieron obtener todos los datos.';
            $this->pdf->Cell(290, 40, $men, 1, 0, 'C', 0);
        } else {
            $this->pdf->Cell(290, 10, utf8_decode($titulo), 0, 0, 'C', 0);
            $this->pdf->Ln(10);
            //Creando el encabezado inicial estatico
            $this->pdf->SetFont('Arial', 'B', 11);
            $this->pdf->Cell(10, 35, 'No.', 1, 0, 'C', 0);
            $this->pdf->Cell(62, 35, utf8_decode('Descripción órganos y cargos'), 1, 0, 'C', 0);
            $this->pdf->Cell(25, 35, utf8_decode('Cat. Ocup.'), 1, 0, 'C', 0);
            $this->pdf->Cell(45, 35, utf8_decode('Nombre y apellidos'), 1, 0, 'C', 0);
            $this->addVerticalColumn(35, 'Sexo', 1, 1);
            $this->addVerticalColumn(35, 'Carné de identidad', 3.2, 1.6);
            $this->addVerticalColumn(35, 'Nivel de preparación', 1.4, 0.7);
            $this->addVerticalColumn(35, 'Grupo escala', 1.5, 1.5);
            $x = $this->pdf->GetX();
            $y = $this->pdf->GetY();
            $this->pdf->MultiCell(90, 10, utf8_decode('Salario'), 1, 'C');
            $y += 10;
            $this->pdf->SetY($y);
            $this->pdf->SetX($x);
            $this->addVerticalColumn(25, 'Total', 1.85, 1.85);
            $this->addVerticalColumn(25, 'Escala', 1.5, 1.5);
            $this->addVerticalColumn(25, /*($this->concept[0]['denominacion'])? $this->concept[0]['denominacion']:*/'CLA', 1.5, 1.5); 
            $this->addVerticalColumn(25, /*($this->concept[1]['denominacion']) ? $this->concept[1]['denominacion'] :*/'Turnos nocturnos y mixtos', 2.1, 0.7);
            $this->addVerticalColumn(25,/* ($this->concept[2]['denominacion']) ? $this->concept[2]['denominacion'] :*/'Maestría doctorado', 1.4, 0.7);
            $this->addVerticalColumn(25, /*($this->concept[3]['denominacion']) ? $this->concept[3]['denominacion'] :*/'Años de servicio', 1.4, 0.7);
            $this->addVerticalColumn(25, /*($this->concept[4]['denominacion']) ? $this->concept[4]['denominacion'] :*/'Otros', 2, 1.5);
        //Se comentario arriba para que el diseño del pdf fuese estatico en toda su estructura ...Day
        }
        $this->pdf->Ln(25);
    }

    private function getEncabezado($newarea, $completo)
    {
        $this->pdf->SetFont('Arial', 'B', 12);
        $this->pdf->SetLineWidth(0.4);
        if ($completo == true) {
            //Creando el encabezado inicial estatico
            //Creando el encabezado inicial estatico
            $this->pdf->SetFont('Arial', 'B', 11);
            $this->pdf->Cell(10, 35, 'No.', 1, 0, 'C', 0);
            $this->pdf->Cell(62, 35, utf8_decode('Descripción órganos y cargos'), 1, 0, 'C', 0);
            $this->pdf->Cell(25, 35, utf8_decode('Cat. Ocup.'), 1, 0, 'C', 0);
            $this->pdf->Cell(45, 35, utf8_decode('Nombre y apellidos'), 1, 0, 'C', 0);
            $this->addVerticalColumn(35, 'Sexo', 1, 1);
            $this->addVerticalColumn(35, 'Carné de identidad', 3.2, 1.6);
            $this->addVerticalColumn(35, 'Nivel de preparación', 1.4, 0.7);
            $this->addVerticalColumn(35, 'Grupo escala', 1.5, 1.5);
            $x = $this->pdf->GetX();
            $y = $this->pdf->GetY();
            $this->pdf->MultiCell(90, 10, utf8_decode('Salario'), 1, 'C');
            $y += 10;
            $this->pdf->SetY($y);
            $this->pdf->SetX($x);
            $this->addVerticalColumn(25, 'Total', 1.85, 1.85);
            $this->addVerticalColumn(25, 'Escala', 1.5, 1.5);
            $this->addVerticalColumn(25, ($this->concept[0]['denominacion']) ? $this->concept[0]['denominacion'] :'CLA', 1.5, 1.5);
            $this->addVerticalColumn(25, ($this->concept[1]['denominacion']) ? $this->concept[1]['denominacion'] :'Turnos nocturnos y mixtos', 2.1, 0.7);
            $this->addVerticalColumn(25, ($this->concept[2]['denominacion']) ? $this->concept[2]['denominacion'] :'Maestría doctorado', 1.4, 0.7);
            $this->addVerticalColumn(25, ($this->concept[3]['denominacion']) ? $this->concept[3]['denominacion'] :'Años de servicio', 1.4, 0.7);
            $this->addVerticalColumn(25, ($this->concept[4]['denominacion']) ? $this->concept[4]['denominacion'] :'Otros', 2, 1.5);
            $this->pdf->Ln(25);
        }
        $this->pdf->SetFont('Arial', 'B', 10);
        if ($newarea != '') {
            $this->pdf->Cell(289, 9, utf8_decode('Área: '.$newarea), 1, 0, 'L', 0);
        } else {
            $this->pdf->Cell(289, 9, utf8_decode('Área: SIN ASIGNAR'), 1, 0, 'L', 0);
        }
        $this->pdf->Ln(9);
        $this->pdf->SetFont('Arial', '', 12);
    }

    private function crearAnexo($datos, $canttrab)
    {
        $this->pdf->SetFont('Arial', '', 12);
        $canttrabDeterm = 0;
        foreach ($datos as $k=>$valores) {
            if ($valores['idarea'] != $datos[$k-1]['idarea'] || $valores['idarea'] == '') {
                $y = $this->pdf->GetY();
                if ($y >= '300' ) {
                    $this->pdf->AddPage();
                    $this->getEncabezado($valores['area'], true);
                } else {
                    $this->getEncabezado($valores['area'], false);
                }
            }
            $contA = 0;
            foreach ($valores['datos'] as $val) {
                $y = $this->pdf->GetY();
                if ($y >= '300' ) {
                    $this->pdf->AddPage();
                    $this->getEncabezado($valores['area'], true);
                }
                $canttrabDeterm++;
                $widthHeaderTable = array(10, 62, 25, 45, 8, 25, 12, 12, 15, 12, 12, 16, 11, 11, 13);
                $align = ['C', 'L', 'C', 'L', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'];
                $this->alingsArray = $align;
                $this->table->SetAligns($this->alingsArray);
                $this->table->SetWidths($widthHeaderTable);
                $arr = array(
                    ($contA + 1),
                    utf8_decode($val['cargo']),
                    utf8_decode($val['categoria']),
                    utf8_decode($val['nombreapellidos']),
                    $val['denomsexo'],
                    $val['numid'],
                    utf8_decode($val['preparacion']),
                    utf8_decode($val['grupocomplejidad']),
                    ($val['total'] == '')?$val['escala']:$val['total'],
                    $val['escala'],
                    $val['salario'][1],
                    $val['salario'][2],
                    $val['salario'][3],
                    $val['salario'][4],
                    $val['salario'][5]
                    
                ); 

                $this->table->Row($arr, null, null, 9);
                $contA++;
            }
            if ($y >= '300' ) {
                $this->pdf->AddPage();
            }
        }
        $this->pdf->SetFont('Arial', 'B', 12);
        $this->pdf->Ln(14);
        $this->pdf->Cell(290, 20, utf8_decode('TOTAL DE TRABAJADORES EN PLANTILLA: '.$canttrab), 0, 0, 'C', 0);
        $this->pdf->Ln(10);
        $this->pdf->Cell(
            290,
            20,
            utf8_decode('TOTAL DE TRABAJADORES POR PERIODO DETERMINADO : '.$canttrabDeterm),
            0,
            0,
            'C',
            0
        );
        return $this->pdf;
    }


    private function organizarPorArea($arraydatos)
    {
        $result = Array();
        $post = 0;
        foreach ($arraydatos as $sit) {
            $esta = false;
            foreach ($result as $i => $rs) {
                if ($rs['idarea'] == $sit['idarea']) {
                    $pp = count($result[$i]['datos']);
                    $result[$i]['datos'][$pp] = $sit;
                    $esta = true;
                }
            }
            if ($esta == false) {
                $result[$post]['idarea'] = $sit['idarea'];
                $result[$post]['area'] = $sit['area'];
                $pp = count($result[$post]['datos']);
                $result[$post]['datos'][$pp] = $sit;
                $post++;
            }
        }
        return $result;
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