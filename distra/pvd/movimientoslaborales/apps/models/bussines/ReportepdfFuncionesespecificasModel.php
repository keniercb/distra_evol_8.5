<?php
class PDFFunciones extends fpdf
{
    function Footer()
    {
    }
}

class ReportepdfFuncionesespecificasModel extends ZendExt_Model
{

    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idsituacionlaboralp)
    {
	$datos = $this->obtenerDatos($idsituacionlaboralp);
        $pdf = new PDFFunciones('P', 'mm', 'a4');
        $this->crearEncabezadoPrincipal(
            $pdf,
            'Funciones específicas'
        );
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos[0]);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $val)
    {
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(38, 8, 'Nombres y apellidos: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(150, 8, utf8_decode($val['nombreyapellidos']), 0, 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(30, 8, 'No. de identidad: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(30, 8, $val['numid'], 0, 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(17, 8, 'Entidad: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(150, 8, utf8_decode($val['entidad']), 0, 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(10, 8, utf8_decode('Área: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(150, 8, utf8_decode($val['area']), 0, 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(12, 8, 'Cargo: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(150, 8, utf8_decode($val['cargo']), 0, 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(200, 8, utf8_decode('Funciones específicas: '), 0, 1, 'L', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->MultiCell(200, 8, utf8_decode($val['funciones']), 0, 'L', 0);
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $titulo)
    {
        $pdf->SetLeftMargin(5);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetLineWidth(0.5);
        $pdf->Cell(200, 10, utf8_decode($titulo), 0, 0, 'C', 0);
        $pdf->Ln(20);
        $pdf->SetFont('Arial', 'B', 8);
        
    }


    private function obtenerDatos($idsituacionlaboralp) {
		$sql = "SELECT
				ddi.numero AS numid, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN  dp.nombre || ' ' || dp.papel
						WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						THEN dp.nombre || ' ' || dp.snombre || ' ' || dp.papel
						WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						THEN dp.nombre || ' ' || dp.papel || ' ' || dp.sapel
						ELSE dp.nombre || ' ' || dp.snombre || ' ' || dp.papel || ' ' || dp.sapel
						END AS nombreyapellidos, nc.denominacion as cargo, est.denominacion as entidad, 
						area.denominacion as area, dsl.funciones
				FROM mod_persona.dat_situacionlaboral AS dsl
				INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
				INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
				INNER JOIN mod_estructuracomp.dat_estructuraop AS area ON (area.idestructuraop = dsl.idarea AND area.idproyecto = 0)
				INNER JOIN mod_estructuracomp.dat_estructura AS est ON (est.idestructura = dpe.identidad AND est.idproyecto = 0)
				INNER JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona AND ddi.principal = 1)
				INNER JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = dsl.idcargo AND dc.idproyecto = 0)
				INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (nc.idnomcargo = dc.idnomcargo)
				WHERE dsl.idsituacionlaboralp = $idsituacionlaboralp";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}
