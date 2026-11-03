<?php
class PDFNivelCargo extends fpdf
{
    function Footer()
    {
    }
}

class ReportepdtrabajadoresnivelcargoModel extends ZendExt_Model
{

    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura)
    {
	$datos = $this->obtenerDatos($idestructura);
        $pdf = new PDFNivelCargo('P', 'mm', 'a4');
        $this->crearEncabezadoPrincipal(
            $pdf,
            'Listado de trabajadores que no cumplen requisitos de preparación del cargo'
        );
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {
        $pdf->SetFont('Arial', '', 8);
        foreach ($datos as $k=>$val) {
            $y = $pdf->GetY();
            if ($y >= '510' ) {
                $pdf->AddPage();
                $this->getEncabezado($pdf);
            }
            $pdf->Cell(10, 8, $k+1, 1, 0, 'C', 0);
            $pdf->Cell(30, 8, utf8_decode(' '.$val['numid']), 1, 0, 'L', 0);
            $pdf->Cell(85, 8, utf8_decode(' '.$val['nombreyapellidos']), 1, 0, 'L', 0);
	    	$pdf->Cell(38, 8, utf8_decode(' '.$val['niveleduc']), 1, 0, 'L', 0);
	    	$pdf->Cell(38, 8, utf8_decode(' '.$val['nivelcargo']), 1, 1, 'L', 0);
        }
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $titulo)
    {
        $pdf->SetLeftMargin(5);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->SetLineWidth(0.5);
        $pdf->Cell(215, 10, utf8_decode($titulo), 0, 0, 'C', 0);
        $pdf->Ln(8);
        $pdf->SetFont('Arial', 'B', 8);
        //Creando el encabezado inicial estatico
        $pdf->Ln(8);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(10, 8, 'No.', 1, 0, 'C', 0);
        $pdf->Cell(30, 8, 'No. de identidad', 1, 0, 'C', 0);
        $pdf->Cell(85, 8, 'Apellidos y nombres', 1, 0, 'C', 0);
        $pdf->Cell(38, 8, 'Nivel educacional', 1, 0, 'C', 0);
		$pdf->Cell(38, 8, 'Nivel cargo', 1, 1, 'C', 0);
    }

    private function getEncabezado(&$pdf)
    {
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->SetLineWidth(0.5);
        //Creando el encabezado inicial estatico
        $pdf->Ln(8);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(10, 8, 'No.', 1, 0, 'C', 0);
        $pdf->Cell(30, 8, 'No. de identidad', 1, 0, 'C', 0);
        $pdf->Cell(85, 8, 'Apellidos y nombres', 1, 0, 'C', 0);
        $pdf->Cell(38, 8, 'Nivel educacional', 1, 0, 'C', 0);
		$pdf->Cell(38, 8, 'Nivel cargo', 1, 1, 'C', 0);
        $pdf->SetFont('Arial', '', 8);
    }

    private function obtenerDatos($idestructura) {
		$sql = "SELECT
				ddi.numero AS numid, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN  dp.nombre || ' ' || dp.papel
						WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						THEN dp.nombre || ' ' || dp.snombre || ' ' || dp.papel
						WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						THEN dp.nombre || ' ' || dp.papel || ' ' || dp.sapel
						ELSE dp.nombre || ' ' || dp.snombre || ' ' || dp.papel || ' ' || dp.sapel
						END AS nombreyapellidos, nne.denominacion AS niveleduc, np.denominacion AS nivelcargo
				FROM mod_persona.dat_situacionlaboral AS dsl
				INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
				INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
				INNER JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona AND ddi.principal = 1)
				LEFT JOIN mod_personaext.dat_niveleducacional AS dne ON (dp.idpersona = dne.idpersona)
				INNER JOIN mod_personaext.nom_niveleducacional AS nne ON (dne.idniveleducacional = nne.idniveleducacional)
				INNER JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = dsl.idcargo AND dc.idproyecto = 0)
				INNER JOIN mod_estructuracomp.nom_preparacion AS np ON (dc.idpreparacion = np.idpreparacion)
				WHERE dp.feliminado IS NULL AND (dsl.estado = 0 OR (dsl.fhasta IS NULL OR dsl.fhasta >= CURRENT_DATE))
				AND (dne.idniveleducacional not in (SELECT cn.idniveleducacional FROM mod_fuerzatrabajo.conf_niveles AS cn WHERE dc.idpreparacion = cn.idpreparacion))
				AND (dne.idniveleducacional is not null)";
		$cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);
		if (count($cargos) > 0) {
            $idcargos = DatSituacionlaboralModel::getIdCargos($cargos);
            $sql = $sql." AND dsl.idcargo IN (".implode(',', $idcargos).")";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}
