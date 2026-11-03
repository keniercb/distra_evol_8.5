<?php
class PDFRelacionCargos extends fpdf
{
    private $table;
    private $alingsArray;
    private $decisorio;
    private $facultad;

}

class ReportepdfrelacioncargosModel extends ZendExt_Model
{
    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura, $decisorios, $facultad, $denfacultad)
    {
        $this->decisorio = $decisorios;
        $this->facultad = $denfacultad;
        $pdf = new PDFRelacionCargos('L', 'mm', 'A4');
        $this->table = new Tableml($pdf);
        $this->getEncabezado($pdf);
        $pdfNGeneral = $this->crearCuerpo($pdf, $idestructura, $decisorios, $facultad);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $idestructura, $decisorios, $facultad)
    {
        $data = $this->obtenerDatos($idestructura, $decisorios, $facultad);//print_r($data);die;
        $total = 0;
        $subtotal = 0;
        foreach ($data as $key => $value) {
            $y = $pdf->GetY();
            if ($key == 0 || $value['idarea'] != $data[$key - 1]['idarea']) {
                $subtotal = 0;
                $pdf->SetFont('Arial', 'B', 10);
                $pdf->SetX(15);
                if ($y >= '190' ) {
                    //$pdf->AddPage();
                    $this->getEncabezado($pdf);
                }
                $pdf->Cell(272, 8, utf8_decode($value['area']), 1, 1);
            } else {
                if ($y >= '190' ) {
                    //$pdf->AddPage();
                    $this->getEncabezado($pdf);
                }
            }
            
            $subtotal += $value['cantidad'];
            $total += $value['cantidad'];
            $widthHeaderTable = array(100, 30, 20, 30, 20, 72);
            $align = ['L', 'C', 'C', 'C', 'C', 'C'];
            $this->alingsArray = $align;
            $this->table->SetAligns($this->alingsArray);
            $this->table->SetWidths($widthHeaderTable);
            $arr = array(
                utf8_decode($value['denomcargo']),
                utf8_decode($value['categocup']),
                utf8_decode($value['cantidad']),
                utf8_decode($value['denompreparacion']),
                ($value['decisorio']==1)?'Si':'No',
                utf8_decode($value['facultad'])
            );
            $this->table->Row($arr, null, null, 8);

            /*if ($value['idarea'] != $data[$key + 1]['idarea']) {
                $pdf->SetFont('Arial', 'B', 10);
                $pdf->Cell(130, 8, utf8_decode('Subtotal'), 1, 0, 'R');
                $pdf->Cell(20, 8, utf8_decode($subtotal), 1, 0, 'C');
                $pdf->Cell(122, 8, '', 1, 1, 'C');
            }*/
        }
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(130, 8, utf8_decode('Total'), 1, 0, 'R');
        $pdf->Cell(20, 8, utf8_decode($total), 1, 0, 'C');
        $pdf->Cell(122, 8, '', 1, 1, 'C');
        $pdf->ln(20);
        $pdf->SetFont('Arial', 'B', 15);
        $this->getEncabezado($pdf, 1);
        $pdf->Cell(0,12, utf8_decode('RESUMEN DE LA PLANTILLA DE CARGOS'),0,1,'L', 0);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(120,8, utf8_decode('Denominación del cargo'),1,0,'C', 0);
        $pdf->Cell(40,8, utf8_decode('Cantidad'), 1, 1,'C', 0);
        $arrayresumen = Array();
        foreach ($data as $h=>$val) {
            if ($h == 0) {
                array_push($arrayresumen, $val);
            } else {
                $esta = false;
                $pp = 0;
                foreach ($arrayresumen as $f => $valarray) {
                    if ($val['idnomcargo'] == $valarray['idnomcargo']) {
                        $esta = true;
                        $pp = $f;
                    }
                }
                if ($esta == false) {
                    array_push($arrayresumen, $val);
                } else {
                    $arrayresumen[$pp]['cantidad'] += $val['cantidad'];
                }
            }
        }
        foreach ($arrayresumen as $value) {
            $pdf->SetX(15);
            $widthHeaderTable = array(120, 40);
            $align = ['L', 'C'];
            $this->alingsArray = $align;
            $this->table->SetAligns($this->alingsArray);
            $this->table->SetWidths($widthHeaderTable);
            $arr = array(
                utf8_decode($value['denomcargo']),
                utf8_decode($value['cantidad'])
            );
            $this->table->Row($arr, null, null, 8);
        }
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(120,8, 'Total',1,0,'R', 0);
        $pdf->Cell(40,8, $total, 1, 1,'C', 0);
        return $pdf;
    }

    function getEncabezado($pdf, $col)
    {
        $pdf->SetLeftMargin(3);
        $pdf->SetAutoPageBreak(true, 5);
        $pdf->AddPage();
        $pdf->SetFillColor(200, 200, 200);
        $pdf->SetFont('Arial','B',15);
        $pdf->SetLeftMargin(15);
        $x = $pdf->GetX();
        $y = $pdf->GetY();
        $pdf->Cell(0,8, utf8_decode('RELACIÓN DE CARGOS'),'LTR',0,'C', 1);

        $pdf->Ln(7.7);
        $enc = '';
        if (!empty($this->decisorio)) {
            if ($enc != '') {
                $enc .= ', ';
            }
            $enc .= 'DECISORIOS';
        }
        if (!empty($this->facultad)){
            if ($enc != '') {
                $enc .= ', ';
            }
            $enc .= 'FACULTAD: '.$this->facultad;
        }
        $pdf->Cell(240, 10, utf8_decode($enc), 'BL', 0, 'C', 1);
        $pdf->SetFont('Arial','B',8);
        $pdf->Cell(32, 8, utf8_decode('Hoja No. '.$pdf->PageNo()), 'R', 0, 'R', 1);
        $pdf->Ln(7);
        $pdf->Cell(0, 5, utf8_decode($this->obtenerFecha()), 'LRB', 0, 'R', 1);
        $pdf->Ln(5);
        if ($col != 1) {
            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Cell(100, 5, utf8_decode('Denominación'), 'LRT', 0, 'C');
            $pdf->Cell(30, 10, utf8_decode('Categoría'), 'LRT', 0, 'C');
            $pdf->Cell(20, 10, utf8_decode('Cantidad'), 1, 0, 'C');
            $pdf->Cell(30, 5, utf8_decode('Nivel de'), 'LRT', 0, 'C');
            $pdf->Cell(20, 10, utf8_decode('Decisorio'), 1, 0, 'C');
            $pdf->Cell(72, 10, utf8_decode('Facultad'), 1, 0, 'C');
            $pdf->Ln();
            $pdf->SetY(35);
            $pdf->Cell(100, 5, utf8_decode('Órgano / Cargo'), 'LRB', 0, 'C');
            //$this->Cell(30, 5, utf8_decode(''), 'LRB', 0, 'C');
            $pdf->SetX(165);
            $pdf->Cell(30, 5, utf8_decode('Preparación'), 'LRB', 1, 'C');
        }
        $x1 = $pdf->GetX();
        $y1 = $pdf->GetY();
        $pdf->SetY($y+2.35);
        $pdf->SetX($x+2.35);
        $pdf->Cell(15.5, 15.5, '', 'LRTB', 0, 'C');
        $pdf->Image('views/images/escudo.png', $x+2.5, $y+2.5, 15, 15);
        $pdf->SetX($x1);
        $pdf->SetY($y1);

    }

    public function obtenerDatos($idestructura, $decisorios, $facultad)
    {
        $hijos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);
        $sitLab = new DatSituacionlaboralModel();
        $cargos = $sitLab->getIdCargos($hijos);
        $sql = "SELECT
                    nfe.idfila,
                    nfe.idpadre as idarea,
                    nc.denominacion AS denomcargo,
                    dc.cantidad,
                    nco.denominacion AS categocup,
                    np.denominacion AS denompreparacion,
                    dc.decisorio, dc.idcargo, dc.idnomcargo,
                    (SELECT aux_nc.denominacion FROM mod_estructuracomp.nom_cargo AS aux_nc WHERE aux_nc.facultado = 1 AND aux_nc.idnomcargo = dc.idfacultado) AS facultad,
                    CASE WHEN ((SELECT aux_nfe.idconcepto FROM mod_estructuracomp.nom_filaestruc AS aux_nfe WHERE aux_nfe.idfila = nfe.idpadre) IN (1, 2, 3, 4))
                        THEN (SELECT aux_de.denominacion FROM mod_estructuracomp.dat_estructura AS aux_de WHERE aux_de.idestructura = nfe.idpadre)
                        ELSE (SELECT aux_deop.denominacion FROM mod_estructuracomp.dat_estructuraop AS aux_deop WHERE aux_deop.idestructuraop = nfe.idpadre)
                        END AS area
                FROM mod_estructuracomp.nom_filaestruc nfe
                INNER JOIN mod_estructuracomp.dat_cargo AS dc ON (nfe.idfila = dc.idcargo)
                INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
                INNER JOIN mod_estructuracomp.dat_cargocivil AS dcc ON (nfe.idfila = dcc.idcargo)
                INNER JOIN mod_estructuracomp.nom_categocup AS nco ON (dcc.idcategocup = nco.idcategocup)
                INNER JOIN mod_estructuracomp.nom_preparacion AS np ON (dc.idpreparacion = np.idpreparacion)
                WHERE dc.idproyecto = 0 AND dcc.idproyecto = 0 AND idconcepto = 7 AND nfe.idfila IN (". implode(',', $cargos) .")
		AND nco.idcategocup IN (SELECT mapeo.idcategocup FROM mod_rrhhmaestro.conf_mapeocategocup AS mapeo WHERE mapeo.idcategoriareporteresumenmov IN (5, 6))";
        if ($decisorios == 1) {
            $sql = $sql." AND dc.decisorio = 1";
        }
        if (!empty($facultad)) {
            $sql = $sql." AND dc.idfacultado = $facultad";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $resp = $conn->fetchAll($sql);
        $datos = DatSituacionlaboralModel::ordenarInfoByCargo($cargos, $resp);
        return $datos;
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