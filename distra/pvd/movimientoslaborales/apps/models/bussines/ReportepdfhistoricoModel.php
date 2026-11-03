<?php
class PDFReportehist extends fpdf
{

    private $pdf;
    private $table;
    private $alingsArray;
    function Footer()
    {

    }
}

class ReportepdfhistoricoModel extends ZendExt_Model
{

    public function ReportepdfhistoricoModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura, $idcategocup, $categocup, $decisorios, $idfacultado, $facultado, $finicio, $ffin)
    {

        $pdf = new PDFReportehist('L', 'mm', 'a4');
        $this->pdf = $pdf;
        $this->table = new Tableml($this->pdf);
        $objDS = new DatSituacionlaboralModel();
        $datos = $objDS->getReportHist($idestructura, $idcategocup, $decisorios, $idfacultado, $finicio, $ffin);
        $titulo = 'RELACIÓN DE CARGOS HISTÓRICO';
        $this->crearEncabezado($titulo, $datos, $categocup, $decisorios, $facultado, $finicio, $ffin, 1);
        $pdfNGeneral = $this->crearCuerpo($datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($datos)
    {
        $this->pdf->SetFont('Arial', '', 10);
        foreach ($datos as $k=>$val) {
            $y = $this->pdf->GetY();
            if ($val['idarea'] != $datos[$k - 1]['idarea']) {
                $this->pdf->SetFont('Arial', 'B', 10);
                $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['idarea']);
                if ($y >= '190' ) {
                    $this->pdf->AddPage();
                    $this->crearEncabezado();
                }
                $this->pdf->Cell(291.5, 8, utf8_decode($area[0]->denominacion), 1, 1, 'L', 0);;
            } else {
                if ($y >= '190' ) {
                    $this->pdf->AddPage();
                    $this->crearEncabezado();
                }
            }
            $this->pdf->SetFont('Arial', '', 10);
            $widthHeaderTable = array(48, 13, 45, 10, 12, 20, 18.5, 35, 20, 20, 20, 30);
            $align = ['L', 'C', 'L', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'];
            $this->alingsArray = $align;
            $this->table->SetAligns($this->alingsArray);
            $this->table->SetWidths($widthHeaderTable);
            $neduc = ZendExt_IoC_Inter::getInstance()->persona->getNivelEduByPersona($val['idpersona']);
            $abrtitulo = (isset($neduc[0]['tituloabr']))
                ? utf8_decode($neduc[0]['tituloabr']) : utf8_decode(
                    $neduc[0]['titulo']
                );
            $abrne = (isset($neduc[0]['neabr']))? utf8_decode($neduc[0]['neabr']): utf8_decode($neduc[0]['niveleducacional']);
            $nimos = ($abrne)?utf8_decode($abrne.' / '. $abrtitulo):'';
            $arr = array(
                utf8_decode($val['cargo']),
                utf8_decode($val['coabrev']),
                utf8_decode($val['nombreyapellidos']),
                $val['sexo'],
                $val['colorpiel'][0],
                $val['fechanacimiento'].'  '.$val['edad'],
                $val['militancia'],
                utf8_decode($nimos),
                $val['fnombr'],
                $val['fmov'],
                utf8_decode($val['tiempoa'].' a '.$val['tiempom'].' m'),
                (!empty($val['mm']))? utf8_decode($val['mm']): utf8_decode($val['mb'])
            );
            $this->table->Row($arr);
        }
        return $this->pdf;
    }

    private function crearEncabezado($titulo, $datos, $categocup, $decisorios, $facultado, $finicio, $ffin, $p)
    {
        if ($datos == 2) {
            $men = 'Disculpe, no se pudieron obtener todos los datos.';
            $this->pdf->Cell(291, 40, $men, 1, 0, 'C', 0);
        } else {
            if ($p == 1) {
                $this->pdf->SetLeftMargin(3);
                $this->pdf->SetAutoPageBreak(true, 5);
                $this->pdf->AddPage();
            }
                $this->pdf->SetFont('Arial', 'B', 12);
                $this->pdf->SetLineWidth(0.3);
                $this->pdf->SetFillColor(200);

                $this->pdf->Cell(290, 6, utf8_decode($titulo), 'TRL', 1, 'C', 1);
                $this->pdf->SetFont('Arial','B',8);
                $x1 = $this->pdf->GetX();
                $y1 = $this->pdf->GetY();
                $this->pdf->SetY($y1-5);
                $this->pdf->SetX(253);
                $this->pdf->Cell(40, 5, 'Hoja No: '.$this->pdf->PageNo(), 'R', 1, 'R', 1);
                $this->pdf->SetX(258);
                $this->pdf->Cell(35, 10, utf8_decode($this->obtenerFecha()), 'BR', 0, 'R', 1);
                $this->pdf->SetX($x1);
                $this->pdf->SetY($y1);
                $this->pdf->SetFont('Arial', 'B', 11);
                $enc = '';
                if (!empty($categocup)) {
                    $enc .= $categocup;
                }
                if (!empty($decisorios)) {
                    if ($enc != '') {
                        $enc .= ', ';
                    }
                    $enc .= 'DECISORIO';
                }
                if (!empty($facultado)){
                    if ($enc != '') {
                        $enc .= ', ';
                    }
                    $enc .= 'FACULTAD: '.$facultado;
                }

                $this->pdf->Cell(255, 10, utf8_decode($enc), 'L', 0, 'C', 1);

                if (!empty($finicio) && !empty($ffin)) {
                    $this->pdf->Ln(9);
                    $this->pdf->Cell(290, 5, 'Desde: '.$finicio.'  Hasta: '.$ffin, 'BRL', 0, 'C', 1);
                } else {
                    $this->pdf->Ln(9);
                    $this->pdf->Cell(290, 5, '', 'BRL', 0, 'C', 1);
                }
                $x1 = $this->pdf->GetX();
                $y1 = $this->pdf->GetY();
                $this->pdf->SetY(12.35);
                $this->pdf->SetX(5.35);
                $this->pdf->Cell(15.5, 15.5, '', 'LRTB', 0, 'C');
                $this->pdf->Image('views/images/escudo.png', 5.5, 12.5, 15, 15);
                $this->pdf->SetX($x1);
                $this->pdf->SetY($y1);
                $this->pdf->Ln(15);

            //Creando el encabezado inicial estatico
            $this->pdf->SetFont('Arial', 'B', 10);
            $this->pdf->Cell(48, 16, utf8_decode('Denominación del Cargo'), 1, 0, 'C', 0);
            $x = $this->pdf->GetX();
            $y = $this->pdf->GetY();
            $this->pdf->MultiCell(13, 16, 'Categ.', 1, 'C', 0);
            $x += 13;
            $this->pdf->SetY($y);
            $this->pdf->SetX($x);
            $this->pdf->Cell(45, 16, 'Nombres y Apellidos', 1, 0, 'C',0);
            $this->pdf->Cell(10, 16, 'Sexo', 1, 0, 'C', 0);
            $this->pdf->MultiCell(12, 8, 'Color piel', 1, 'C', 0);
            $x += 67;
            $this->pdf->SetY($y);
            $this->pdf->SetX($x);
            $this->pdf->MultiCell(20, 5.3, 'Fecha Nacimien. Edad', 1, 'C', 0);
            $x += 20;
            $this->pdf->SetY($y);
            $this->pdf->SetX($x);
            $this->pdf->MultiCell(18.5, 8, utf8_decode('Militancia Política'), 1, 'C', 0);
            $x += 18.5;
            $this->pdf->SetY($y);
            $this->pdf->SetX($x);
            $this->pdf->MultiCell(35, 8, utf8_decode('Nivel Escolar     Título de Graduado'), 1, 'C', 0);
            $x += 35;
            $this->pdf->SetY($y);
            $this->pdf->SetX($x);
            $this->pdf->MultiCell(20, 8, utf8_decode('Fecha Nombra.'), 1, 'C', 0);
            $x += 20;
            $this->pdf->SetY($y);
            $this->pdf->SetX($x);
            $this->pdf->MultiCell(20, 8, utf8_decode('Fecha Movim.'), 1, 'C', 0);
            $x += 20;
            $this->pdf->SetY($y);
            $this->pdf->SetX($x);
            $this->pdf->MultiCell(20, 8, utf8_decode('Tiempo en el cargo'), 1, 'C', 0);
            $x += 20;
            $this->pdf->SetY($y);
            $this->pdf->SetX($x);
            $this->pdf->MultiCell(30, 8, 'Causa del Movimiento', 1, 'C', 0);
        }
    }
    private function obtenerFecha() {
        $fecha = explode('/', date('d/m/Y'));
        return $fecha[0] . ' de ' . $this->obtenerDenomMes($fecha[1]) . ' de ' . $fecha[2];
    }

    private function obtenerDenomMes($nummes) {
        $mes = '';
        if ($nummes == '01') {
            $mes = 'Enero';
        } else if ($nummes == '02') {
            $mes = 'Febrero';
        } else if ($nummes == '03') {
            $mes = 'Marzo';
        } else if ($nummes == '04') {
            $mes = 'Abril';
        } else if ($nummes == '05') {
            $mes = 'Mayo';
        } else if ($nummes == '06') {
            $mes = 'Junio';
        } else if ($nummes == '07') {
            $mes = 'Julio';
        } else if ($nummes == '08') {
            $mes = 'Agosto';
        } else if ($nummes == '09') {
            $mes = 'Septiembre';
        } else if ($nummes == '10') {
            $mes = 'Obtubre';
        } else if ($nummes == '11') {
            $mes = 'Noviembre';
        } else if ($nummes == '12') {
            $mes = 'Diciembre';
        }
        return $mes;
    }
}