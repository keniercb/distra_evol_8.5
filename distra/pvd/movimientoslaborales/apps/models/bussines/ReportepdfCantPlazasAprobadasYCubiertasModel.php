<?php
class PDFReportePlazas extends FPDF
{
    function Footer()
    {
        $this->SetY(-15);
        $this->SetFont('Arial','I',8);
        $this->Cell(0,10,'Pagina '.$this->PageNo().'/{nb}',0,0,'C');
    }
}

class ReportepdfCantPlazasAprobadasYCubiertasModel extends ZendExt_Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function CrearReportePDF($idestructura)
    {
        $datos = $this->obtenerDatos($idestructura);
        $pdf = new PDFReportePlazas('P', 'mm', 'A4');
        $pdf->AliasNbPages();
        $pdf->SetAutoPageBreak(true, 15);
        $pdf->AddPage();

        // Encabezado principal
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(0, 8, utf8_decode('Reporte de Cantidad de Plazas Aprobadas y Cubiertas'), 0, 1, 'C');
        $pdf->Ln(2);
        
        // Denominación de la entidad
        $pdf->SetFont('Arial', 'B', 12);
        $nombreEntidad = $this->obtenerNombreEntidad($idestructura);
        $pdf->Cell(0, 8, utf8_decode('Denominación de la entidad: ' . $nombreEntidad), 0, 1, 'L');
        $pdf->Ln(8);

        // Crear tabla
        $this->crearEncabezado($pdf);
        $this->crearCuerpo($pdf, $datos);
        
        $pdf->Output();
    }

    private function crearEncabezado(&$pdf)
    {
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(150, 8, 'Estructura y Composicion', 1, 0, 'C', true);
        $pdf->Cell(20, 8, 'Aprobadas', 1, 0, 'C', true);
        $pdf->Cell(20, 8, 'Cubiertas', 1, 1, 'C', true);
    }

   /* private function crearCuerpo(&$pdf, $datos)
    {
        $pdf->SetFont('Arial', '', 9);
        $totalGeneralAprobadas = 0;
        $totalGeneralCubiertas = 0;

        // Agrupar datos por área
        $datosAgrupados = [];
        $datosAgrupadosAreas = [];
        $denEntAreas = $this->GetDenomEntAreas($datos);
       // print_r($datos);die;
        foreach ($datos as $val) {
            if ($val['idconcepto'] == 5) {
                $datosAgrupadosAreas[$val['idarea']] = $val;
            }
            if ($val['idconcepto'] == 7) {
                $datosAgrupados[$val['idpadre']]['area'] = $denEntAreas[$val['idpadre']]['denominacion'];
                $datosAgrupados[$val['idpadre']]['cargos'][] = $val;
                $datosAgrupados[$val['idpadre']]['plazas_aprobadas'] = $datosAgrupadosAreas[$val['idpadre']]['plazas_aprobadas'];
                $datosAgrupados[$val['idpadre']]['plazas_cubiertas'] = $datosAgrupadosAreas[$val['idpadre']]['plazas_cubiertas'];
            }
        }

        foreach ($datosAgrupados as $idarea => $grupo) {
            // Encabezado del área
            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Cell(150, 8, utf8_decode($grupo['area']), 1, 0, 'L');
            $pdf->Cell(20, 8, $grupo['plazas_aprobadas'], 1, 0, 'C');
            $pdf->Cell(20, 8, $grupo['plazas_cubiertas'], 1, 1, 'C');
            
            // Detalle de cargos
            $subtotalAprobadas = 0;
            $subtotalCubiertas = 0;
            foreach ($grupo['cargos'] as $cargo) {
                if ($pdf->GetY() > 260) $pdf->AddPage();
                
                $pdf->SetFont('Arial', '', 9);
                $pdf->Cell(150, 8, utf8_decode('' . $cargo['cargo']), 1, 0, 'L');
                $pdf->Cell(20, 8, $cargo['plazas_aprobadas'], 1, 0, 'C');
                $pdf->Cell(20, 8, $cargo['plazas_cubiertas'], 1, 1, 'C');
                
                $subtotalAprobadas += $cargo['plazas_aprobadas'];
                $subtotalCubiertas += $cargo['plazas_cubiertas'];
            }
            
            // Subtotales por área
            $pdf->SetFont('Arial', 'B', 9);
            $pdf->SetFillColor(220, 220, 220);
            $pdf->Cell(150, 8, 'Subtotal Area', 1, 0, 'R', true);
            $pdf->Cell(20, 8, $subtotalAprobadas, 1, 0, 'C', true);
            $pdf->Cell(20, 8, $subtotalCubiertas, 1, 1, 'C', true);
            
            $totalGeneralAprobadas += $subtotalAprobadas;
            $totalGeneralCubiertas += $subtotalCubiertas;
        }

        // Total general
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(150, 8, 'TOTAL GENERAL', 1, 0, 'R', true);
        $pdf->Cell(20, 8, $totalGeneralAprobadas, 1, 0, 'C', true);
        $pdf->Cell(20, 8, $totalGeneralCubiertas, 1, 1, 'C', true);

        // Porcentaje de completamiento
        $porcentaje = ($totalGeneralAprobadas > 0) 
            ? round(($totalGeneralCubiertas / $totalGeneralAprobadas) * 100, 2) 
            : 0;
            
        $pdf->Cell(150, 8, 'Porcentaje de completamiento', 1, 0, 'R', true);
        $pdf->Cell(40, 8, $porcentaje . '%', 1, 1, 'C', true);
    }
*/

private function crearCuerpo(&$pdf, $datos)
    {
    $pdf->SetFont('Arial', '', 9);
    $totalGeneralAprobadas = 0;
    $totalGeneralCubiertas = 0;

    // Organizar datos jerárquicamente
    $estructura = [];
    foreach ($datos as $fila) {
    // Identificar áreas (idconcepto = 5)
    if ($fila['idconcepto'] == 5) {
    $estructura[$fila['idfila']] = [
    'idfila' => $fila['idfila'],
    'denominacion' => $fila['denominacion'],
    'plazas_aprobadas' => $fila['plazas_aprobadas'],
    'plazas_cubiertas' => $fila['plazas_cubiertas'],
    'cargos' => []
    ];
    }

    // Identificar cargos (idconcepto = 7)
    if ($fila['idconcepto'] == 7 && isset($estructura[$fila['idpadre']])) {
    $estructura[$fila['idpadre']]['cargos'][] = [
    'denominacion' => $fila['denominacion'],
    'plazas_aprobadas' => $fila['plazas_aprobadas'],
    'plazas_cubiertas' => $fila['plazas_cubiertas']
    ];
    }
    }

    // Recorrer la estructura jerárquica
    foreach ($estructura as $area) {
    // Verificar espacio en página
    if ($pdf->GetY() > 250) {
    $pdf->AddPage();
    $this->crearEncabezado($pdf);
    }

    // Encabezado del área (concepto 5)
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->SetFillColor(240, 240, 240);
    $pdf->Cell(150, 8, utf8_decode($area['denominacion']), 1, 0, 'L', true);
    $pdf->Cell(20, 8, $area['plazas_aprobadas'], 1, 0, 'C', true);
    $pdf->Cell(20, 8, $area['plazas_cubiertas'], 1, 1, 'C', true);

    $subtotalAprobadas = 0;
    $subtotalCubiertas = 0;

    // Detalle de cargos (concepto 7)
    if (!empty($area['cargos'])) {
    foreach ($area['cargos'] as $cargo) {
    // Verificar espacio en página para cada cargo
    if ($pdf->GetY() > 260) {
    $pdf->AddPage();
    $this->crearEncabezado($pdf);
    }

    $pdf->SetFont('Arial', '', 9);
    $pdf->Cell(150, 8, utf8_decode(' ' . $cargo['denominacion']), 1, 0, 'L');
    $pdf->Cell(20, 8, $cargo['plazas_aprobadas'], 1, 0, 'C');
    $pdf->Cell(20, 8, $cargo['plazas_cubiertas'], 1, 1, 'C');

    $subtotalAprobadas += $cargo['plazas_aprobadas'];
    $subtotalCubiertas += $cargo['plazas_cubiertas'];
    }

    // Verificar si el subtotal es diferente del total del área
    // Esto ayuda a identificar si hay datos consistentes
    if ($subtotalAprobadas != $area['plazas_aprobadas'] ||
    $subtotalCubiertas != $area['plazas_cubiertas']) {

    // Línea de verificación (opcional)
    $pdf->SetFont('Arial', 'I', 8);
    $pdf->SetTextColor(100, 100, 100);
    $pdf->Cell(150, 6, utf8_decode(' * Nota: Los subtotales no coinciden con el total del área'), 0, 1, 'L');
    $pdf->SetTextColor(0, 0, 0);
    }
    } else {
    // Si el área no tiene cargos, mostrar mensaje
    $pdf->SetFont('Arial', 'I', 8);
    $pdf->SetTextColor(150, 150, 150);
    $pdf->Cell(150, 6, utf8_decode(' Sin cargos asignados'), 1, 0, 'L');
    $pdf->Cell(20, 6, '', 1, 0, 'C');
    $pdf->Cell(20, 6, '', 1, 1, 'C');
    $pdf->SetTextColor(0, 0, 0);
    }

    // Línea separadora entre áreas
    $pdf->Ln(2);

    $totalGeneralAprobadas += $area['plazas_aprobadas'];
    $totalGeneralCubiertas += $area['plazas_cubiertas'];
    }

    // Espacio antes de totales
    $pdf->Ln(4);

    // Total general
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->SetFillColor(230, 230, 230);
    $pdf->Cell(150, 8, 'TOTAL GENERAL', 1, 0, 'R', true);
    $pdf->Cell(20, 8, $totalGeneralAprobadas, 1, 0, 'C', true);
    $pdf->Cell(20, 8, $totalGeneralCubiertas, 1, 1, 'C', true);

    // Porcentaje de completamiento
    $porcentaje = ($totalGeneralAprobadas > 0)
    ? round(($totalGeneralCubiertas / $totalGeneralAprobadas) * 100, 2)
    : 0;

    $pdf->SetFont('Arial', 'B', 10);
    $pdf->Cell(150, 8, 'Porcentaje de completamiento', 1, 0, 'R', true);
    $pdf->Cell(40, 8, $porcentaje . '%', 1, 1, 'C', true);
    }

    private function obtenerDatos($idestructura)
     {
    $idestructura = (int)$idestructura; 
    $sql = "with recursive cargos as (
                                        select
                                        f.idpadre,
                                        sum(fc.cantidad) as total_aprobadas,
                                        sum(fc.cantidadreal) as total_cubiertas
                                        from mod_estructuracomp.nom_filaestruc f
                                        inner join mod_estructuracomp.v_get_cargos fc on f.idfila = fc.idcargo
                                        where f.idconcepto = 7
                                        and f.parent_path operator(public.<@) (
                                        select parent_path from mod_estructuracomp.nom_filaestruc where idfila = $idestructura
                                        )
                                        group by f.idpadre
                                    )
            select f.idfila, f.idpadre, f.idconcepto,
            case when (f.idconcepto in (2,3,4,5)) then ve.denominacion
                else vc.denominacion
            end as denominacion,
            case when f.idconcepto = 5 then COALESCE(cg.total_aprobadas, 0)
                else vc.cantidad
            end as plazas_aprobadas,
            case when f.idconcepto = 5 then COALESCE(cg.total_cubiertas, 0)
                else vc.cantidadreal
            end as plazas_cubiertas,
            f.orden,
            f.parent_path,
            f.ordenunico
            from mod_estructuracomp.nom_filaestruc as f
            left join mod_estructuracomp.v_get_estructuras as ve on (f.idfila = ve.idestructura)
            left join mod_estructuracomp.v_get_cargos as vc on (f.idfila = vc.idcargo)
            left join cargos cg ON f.idfila = cg.idpadre
            where f.parent_path operator(public.<@) (select parent_path from mod_estructuracomp.nom_filaestruc where idfila = $idestructura)
            and (ve.denominacion is not null or vc.denominacion is not null)
            and f.idconcepto <> 6
            order by f.ordenunico;";

    $dm = Doctrine_Manager::getInstance();
    $conn = $dm->getCurrentConnection();
    return $conn->fetchAll($sql);
 }
    private function obtenerNombreEntidad($idestructura)
    {
        $sql = "SELECT COALESCE(
                (SELECT denominacion 
                 FROM mod_estructuracomp.dat_estructura 
                 WHERE idestructura = $idestructura),
                (SELECT denominacion 
                 FROM mod_estructuracomp.dat_estructuraop 
                 WHERE idestructuraop = $idestructura)
            ) AS denominacion";
        
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $result = $conn->fetchOne($sql);
        
        return $result ?: 'Entidad no identificada';
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