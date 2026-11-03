<?php
class PDFResumenplantillacargos extends fpdf
{
    private $pdf;
    private $table;
    private $alingsArray;
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 9);
        $this->Cell(150, 10, utf8_decode($datentidad->denominacion.' ['.$datentidad->abreviatura.']'), 0, 0, 'L');
        $this->Cell(100, 10, utf8_decode('Generado por: '.$perfil['usuario']).' el '.date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 10, utf8_decode('Página '.$this->PageNo()), 0, 0, 'R');
    }
}

class ReportepdfresumenplantillacargosModel extends ZendExt_Model
{

    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura, $desde, $hasta)
    {
        $pdf = new PDFResumenplantillacargos('L', 'mm', 'a4');
        $this->pdf = $pdf;
        $this->table = new Tableml($this->pdf);
        $datos = $this->getDatosPlantilla($idestructura, $desde, $hasta);
        $title = 'Resumen general de la plantilla de cargos';
        if (!empty($desde)) {
            $f = explode('T', $desde);
            $title .= ' desde '.$f[0];
        }
        if (!empty($hasta)) {
            $fh = explode('T', $hasta);
            $title .= ' hasta '.$fh[0];
        }
        $this->crearEncabezadoPrincipal($pdf, $title,  $idestructura);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos, $idestructura);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {
        $pdf->SetFont('Arial', '', 8);
        $aprobsub = 0;
        $cubsub = 0;
        $vacsub = 0;
        $detsub = 0;
        $mascsub = 0;
        $femsub = 0;
		$aprob = 0;
        $cub = 0;
        $vac = 0;
        $det = 0;
        $masc = 0;
        $fem = 0;
        foreach ($datos as $k=>$val) {
            $y = $this->pdf->GetY();
            if ($val['idpadre'] != $datos[$k - 1]['idpadre']) {
                $this->pdf->SetFont('Arial', 'B', 8);
                if ($y >= '180' ) {
                    $this->pdf->AddPage();
                    $this->getEncabezado($pdf);
                }
				if ($k > 0) {
					$pdf->SetFont('Arial', 'B', 8);
					$pdf->Cell(100, 6, 'Subtotal', 1, 0, 'R', 1);
					$pdf->Cell(30, 6, $aprobsub, 1, 0, 'C', 1);
					$pdf->Cell(30, 6, $cubsub, 1, 0, 'C', 1);
					$pdf->Cell(30, 6, $vacsub, 1, 0, 'C', 1);
					$pdf->Cell(30, 6, $detsub, 1, 0, 'C', 1);
					$pdf->Cell(20, 6, $mascsub, 1, 0, 'C', 1);
					$pdf->Cell(20, 6, $femsub, 1, 1, 'C', 1);
					$aprobsub = 0;
					$cubsub = 0;
					$vacsub = 0;
					$detsub = 0;
					$mascsub = 0;
					$femsub = 0;
				}
                $this->pdf->Cell(260, 6,  utf8_decode($val['padre']), 1, 1, 'L', 0);;
            } else {
                if ($y >= '180' ) {
                    $this->pdf->AddPage();
                    $this->getEncabezado($pdf);
                }
            }
			$aprobsub += $val['cantidad'];
            $cubsub += $val['pcubierta'];
            $vacsub += $val['pvacantes'];
            $detsub += $val['determinado'];
            $mascsub += $val['masc'];
            $femsub += $val['fem'];
            $aprob += $val['cantidad'];
            $cub += $val['pcubierta'];
            $vac += $val['pvacantes'];
            $det += $val['determinado'];
            $masc += $val['masc'];
            $fem += $val['fem'];
            $widthHeaderTable = array(80, 20, 30, 30, 30, 30, 20, 20);
            $align = ['L', 'C', 'C', 'C', 'C', 'C', 'C', 'C'];
            $this->alingsArray = $align;
            $this->table->SetAligns($this->alingsArray);
            $this->table->SetWidths($widthHeaderTable);
            $arr = array(
                utf8_decode(' '.$val['denominacion']),
                $val['grupocomplejidad'],
                $val['cantidad'],
                $val['pcubierta'],
                $val['pvacantes'],
                $val['determinado'],
                $val['masc'],
                $val['fem']
            );
            $this->table->Row($arr, 0, 0, 8);
        }
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(100, 6, 'Total', 1, 0, 'R', 1);
        $pdf->Cell(30, 6, $aprob, 1, 0, 'C', 1);
        $pdf->Cell(30, 6, $cub, 1, 0, 'C', 1);
        $pdf->Cell(30, 6, $vac, 1, 0, 'C', 1);
        $pdf->Cell(30, 6, $det, 1, 0, 'C', 1);
        $pdf->Cell(20, 6, $masc, 1, 0, 'C', 1);
        $pdf->Cell(20, 6, $fem, 1, 1, 'C', 1);
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $titulo, $idestructura)
    {
        $pdf->SetLeftMargin(15);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->SetLineWidth(0.1);
        $pdf->SetFillColor(200);
        $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $pdf->Cell(260, 8, utf8_decode($titulo) , 0, 1, 'C', 0);
        $pdf->Cell(260, 8, utf8_decode('Estructura organizativa: '.$entidad[0]->denominacion) , 0, 0, 'L', 0);
        $pdf->Ln(8);
        $pdf->SetFont('Arial', 'B', 8);
        //Creando el encabezado inicial estatico
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(80, 8, utf8_decode('Denominación del cargo'), 1, 0, 'C', 1);
        $pdf->Cell(20, 8, 'Grupo', 1, 0, 'C', 1);
        $pdf->Cell(30, 8, 'Plantilla Aprobada', 1, 0, 'C', 1);
        $pdf->Cell(30, 8, 'Plantilla Cubierta', 1, 0, 'C', 1);
        $pdf->Cell(30, 8, 'Plazas Vacantes', 1, 0, 'C', 1);
        $pdf->Cell(30, 8, 'Contratos Determ.', 1, 0, 'C', 1);
        $pdf->Cell(20, 8, 'Masc.', 1, 0, 'C', 1);
        $pdf->Cell(20, 8, 'Fem.', 1, 1, 'C', 1);
    }

    private function getEncabezado(&$pdf)
    {
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->SetLineWidth(0.3);
        $pdf->SetFillColor(200);
        //Creando el encabezado inicial estatico
        $pdf->Ln(8);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(80, 8, utf8_decode('Denominación del cargo'), 1, 0, 'C', 1);
        $pdf->Cell(20, 8, 'Grupo', 1, 0, 'C', 1);
        $pdf->Cell(30, 8, 'Plantilla Aprobada', 1, 0, 'C', 1);
        $pdf->Cell(30, 8, 'Plantilla Cubierta', 1, 0, 'C', 1);
        $pdf->Cell(30, 8, 'Plazas Vacantes', 1, 0, 'C', 1);
        $pdf->Cell(30, 8, 'Contratos Determ.', 1, 0, 'C', 1);
        $pdf->Cell(20, 8, 'Masc.', 1, 0, 'C', 1);
        $pdf->Cell(20, 8, 'Fem.', 1, 1, 'C', 1);
        $pdf->SetFont('Arial', '', 8);
    }

    private function getDatosPlantilla($idestructura, $fdesde, $fhasta)
    {
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
        if (count($cargos) > 0) {
            $idcargos = DatSituacionlaboralModel::getIdCargos($cargos);
            $cargosd = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($idcargos);
            $stringIdsCargos = DatSituacionlaboralModel::arrayToString($idcargos);
            $datosBasicos = $this->getDatosCargos($stringIdsCargos, $fdesde, $fhasta);
            foreach ($cargosd as $p => $carg) {
                $cargosd[$p]['pcubierta'] = 0;
                foreach ($datosBasicos as $h => $sl) {
                    if ($carg['idcargo'] == $sl['idcargo']) {
                        if ($h == 0 || $sl['idarea'] != $datosBasicos[$h-1]['idarea']) {
                            $cargosd[$p]['idarea'] = $sl['idarea'];
                        }
                        if ($sl['determinado'] == 1) {
                            $cargosd[$p]['determinado']++;
                        } else {
                            $cargosd[$p]['pcubierta']++;
                        }
                        if ($sl['sexo'] == 1) {
                            $cargosd[$p]['masc']++;
                        } else {
                            $cargosd[$p]['fem']++;
                        }
                    }
                }
                $cargosd[$p]['pvacantes'] = $cargosd[$p]['cantidad'] - $cargosd[$p]['pcubierta'];
            }
        }
        $cargosd = DatSituacionlaboralModel::ordenarInfoByCargo($idcargos, $cargosd);
        return $cargosd;
    }

    private function getDatosCargos($stringIdsCargos, $fdesde, $fhasta)
    {
        $sql = "SELECT dp.sexo, ntc.determinado, sl.idcargo, nc.denominacion as cargo, cc.cantidad as aprobada, sl.idarea
            FROM mod_persona.dat_situacionlaboral AS sl
            INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
            INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
            INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (sl.idtipocontrato = ntc.idtipocontrato)
            INNER JOIN mod_estructuracomp.dat_cargo AS cc ON (cc.idcargo = sl.idcargo AND idproyecto = 0)
            INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (nc.idnomcargo = cc.idnomcargo)
            WHERE (sl.idcargo IN ($stringIdsCargos)";

        if (!empty($fdesde) && !empty($fhasta)) {
            $sql = $sql." AND sl.fdesde <= '$fdesde' AND (sl.fhasta IS NULL OR sl.fhasta >= '$fhasta')";
        } else if (!empty($fdesde)) {
            $sql = $sql." AND ('$fdesde' < sl.fhasta OR sl.fhasta IS NULL) AND sl.estado = 0";
        } else if (!empty($fhasta)) {
            $sql = $sql." AND dp.feliminado IS NULL AND '$fhasta' >= sl.fdesde AND (sl.fhasta IS NULL OR sl.fhasta >= '$fhasta') AND sl.estado <> 1";
        }
        if (empty($fdesde) && empty($fhasta)) {
            $sql = $sql." AND dp.feliminado IS NULL AND (sl.fhasta IS NULL OR sl.fhasta >= CURRENT_DATE AND sl.estado = 0)";
        }
        $sql = $sql.") ORDER BY sl.idarea, sl.idcargo";//print_r($sql);die;
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}