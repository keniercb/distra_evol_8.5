<?php
class PDFListadoCuadros extends fpdf
{
    function Footer()
    {
    }
}

class ReportepdfListadoCuadrosModel extends ZendExt_Model
{
    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura)
    {
        $datos = $this->obtenerDatos($idestructura);
        $pdf = new PDFListadoCuadros('P', 'mm', 'a4');
        $this->crearEncabezadoPrincipal(
            $pdf,
            'Listado de Cuadros'
        );
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {
        $pdf->SetFont('Arial', '', 8);

        // Agrupar datos por área
        $datosAgrupados = [];
        $denEntAreas = $this->GetDenomEntAreas($datos);
        foreach ($datos as $val) {
            $datosAgrupados[$val['idarea']]['area'] = $denEntAreas[$val['idarea']]['denominacion'];
            $datosAgrupados[$val['idarea']]['personas'][] = $val;
        }

        // Imprimir datos agrupados
        foreach ($datosAgrupados as $idarea => $grupo) {
            // Imprimir el encabezado del área
            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Cell(0, 10, utf8_decode('Área: ' . $grupo['area']), 0, 1, 'L');
            $pdf->SetFont('Arial', '', 8);

            // Imprimir los datos de las personas en esta área
            foreach ($grupo['personas'] as $k => $val) {
                $y = $pdf->GetY();
                if ($y >= '510') {
                    $pdf->AddPage();
                    $this->getEncabezado($pdf);
                }
                $pdf->Cell(10, 8, $k + 1, 1, 0, 'C', 0);
                $pdf->Cell(30, 8, utf8_decode(' ' . $val['numid']), 1, 0, 'L', 0);
                $pdf->Cell(85, 8, utf8_decode(' ' . $val['nombreyapellidos']), 1, 0, 'L', 0);
                $pdf->Cell(75, 8, utf8_decode(' ' . $val['cargo']), 1, 1, 'L', 0);
            }
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
        // Creando el encabezado inicial estático
        $pdf->Ln(8);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(10, 8, 'No.', 1, 0, 'C', 0);
        $pdf->Cell(30, 8, 'No. de identidad', 1, 0, 'C', 0);
        $pdf->Cell(85, 8, 'Nombres y Apellidos', 1, 0, 'C', 0);
        $pdf->Cell(75, 8, 'Cargo', 1, 1, 'C', 0);
    }

    private function getEncabezado(&$pdf)
    {
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->SetLineWidth(0.5);
        // Creando el encabezado inicial estático
        $pdf->Ln(8);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(10, 8, 'No.', 1, 0, 'C', 0);
        $pdf->Cell(30, 8, 'No. de identidad', 1, 0, 'C', 0);
        $pdf->Cell(85, 8, 'Nombres y Apellidos', 1, 0, 'C', 0);
        $pdf->Cell(45, 8, 'Cargo', 1, 1, 'C', 0);
        $pdf->SetFont('Arial', '', 8);
    }

    private function obtenerDatos($idestructura)
    {
        $sql = "SELECT
            dsl.idarea AS idarea,dpe.identidad,
            ddi.numero AS numid,
            CASE 
                WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.nombre || ' ' || dp.papel
                WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL) THEN dp.nombre || ' ' || dp.snombre || ' ' || dp.papel
                WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL) THEN dp.nombre || ' ' || dp.papel || ' ' || dp.sapel
                ELSE dp.nombre || ' ' || dp.snombre || ' ' || dp.papel || ' ' || dp.sapel
            END AS nombreyapellidos,
            nc.denominacion AS cargo
        FROM mod_persona.dat_situacionlaboral AS dsl
        INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
        INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
        INNER JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona AND ddi.principal = 1)
        INNER JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = dsl.idcargo AND dc.idproyecto = 0)
        INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
        INNER JOIN mod_estructuracomp.dat_cargocivil AS dcc ON (dc.idcargo = dcc.idcargo)
        INNER JOIN mod_estructuracomp.nom_categocup AS nco ON (dcc.idcategocup = nco.idcategocup)
        INNER JOIN mod_estructuracomp.nom_categoria AS nca ON (nco.idcategoria = nca.idcategoria)
        WHERE dp.feliminado IS NULL AND (dsl.estado = 0 OR (dsl.fhasta IS NULL OR dsl.fhasta >= CURRENT_DATE))
        AND nca.idcategoria = 1";

        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);
        if (count($cargos) > 0) {
            $idcargos = DatSituacionlaboralModel::getIdCargos($cargos);
            $sql = $sql . " AND dsl.idcargo IN (" . implode(',', $idcargos) . ")";
        }

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function GetDenomEntAreas($datos)
    {
        foreach ($datos as $rep) {
            if (!empty($rep['idarea'])) {
                $idareas[] = $rep['idarea'];
            }
            if (!empty($rep['identidad'])) {
                $identidades[] = $rep['identidad'];
            }
        }
        $entarea = array_merge($idareas, $identidades);
        $entarealimpios = array_unique($entarea);
        if (count($entarealimpios) > 0) {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "SELECT nfe.idfila AS id,
                    (CASE WHEN de.idestructura IS NOT NULL THEN de.denominacion
                          WHEN deop.idestructuraop IS NOT NULL THEN deop.denominacion
                          WHEN dc.idcargo IS NOT NULL THEN nc.denominacion ELSE 'NO CONOCIDO' END
                    ) AS denominacion,
                    nfe.idconcepto

                    FROM mod_estructuracomp.nom_filaestruc nfe
                    LEFT JOIN mod_estructuracomp.dat_estructura de ON (de.idestructura = nfe.idfila)
                    LEFT JOIN mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = nfe.idfila)
                    LEFT JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = nfe.idfila)
                    LEFT JOIN mod_estructuracomp.nom_cargo nc ON (nc.idnomcargo = dc.idnomcargo)
                    WHERE nfe.idfila IN (" . implode(',', $entarealimpios) . ")";
            $entAreas = $conn->fetchAll($sql);
            $denEntAreas = array();
            foreach ($entAreas as $entareas) {
                $denEntAreas[$entareas['id']] = $entareas;
            }
            return $denEntAreas;
        } else {
            return array();
        }
    }
}