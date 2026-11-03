<?php

class PDFModeloFondoTiempo extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $entidad = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($datentidad->idestructura);
        $this->SetY(-15);
        $this->SetX(5);
        $this->SetFont('Arial', 'I', 10);
        $this->Cell(150, 10, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 0, 'L');
        $this->Cell(100, 10, utf8_decode('Generado por: ' . $perfil['usuario']) . ' el ' . date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 10, utf8_decode('Página ' . $this->PageNo()), 0, 0, 'R');
    }
}

class DatpdfmodelofondotiempoModel extends ZendExt_Model
{
    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($datostrimestre,$datosacumulado,$trimestre, $denomtrimestre, $year, $idestructura,$denomestructura)
    {
        $pdf = new PDFModeloFondoTiempo('P', 'mm', 'A3');
        $pdf->AddPage();
        $this->table = new Tableml($pdf);
        $pdffinal = $this->crearEncabezadoPrincipal($pdf, $trimestre, $denomtrimestre, $year, $idestructura,$denomestructura);
        $pdffinal = $this->crearCuerpo($pdf, $datostrimestre,$datosacumulado, $trimestre, $year, $idestructura);
        ob_clean();
        $pdffinal->Output();
    }

    private function crearCuerpo($pdf, $datostrimestre,$datosacumulado, $trimestre, $year, $idestructura)
    {
        $pdf->SetFont('Arial', '', 11);

        $pdf->Cell(100, 10, utf8_decode('Total de trabajadores según registro'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(1), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('UNO'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datostrimestre['totaltrabajadores']), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datosacumulado['totaltrabajadores']), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('Días laborables del período'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(2), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('UNO'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datostrimestre['diaslaborables']), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datosacumulado['diaslaborables']), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('Días de vacaciones'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(3), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('H/D'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datostrimestre['diasvacaciones']), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datosacumulado['diasvacaciones']), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('Fondo de tiempo máximo utilizable'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(4), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('H/D'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datostrimestre['fondotiempomaxutiliz']), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datosacumulado['fondotiempomaxutiliz']), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('Fondo de tiempo no utilizado por ausentismo'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(5), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('H/D'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datostrimestre['fondotiemponoutilizausent']), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datosacumulado['fondotiemponoutilizausent']), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('    Por enfermedad'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(6), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('H/D'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datostrimestre['porenfermedad']), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datosacumulado['porenfermedad']), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('           Accidentes del trabajo'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(7), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('H/D'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datostrimestre['acctrabajo']), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datosacumulado['acctrabajo']), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('           Enfermedad profesional'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(8), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('H/D'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datostrimestre['enfprofesional']), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datosacumulado['enfprofesional']), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('           Enfermedad o accidente común'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(9), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('H/D'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datostrimestre['enfacccomun']), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datosacumulado['enfacccomun']), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('    Enfermedad o accidente común'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(10), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('H/D'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datostrimestre['autadministrativa']), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datosacumulado['autadministrativa']), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('           Licencias no retribuidas'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(11), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('H/D'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datostrimestre['licnoretribuida']), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datosacumulado['licnoretribuida']), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('           Ausencias Justificadas'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(12), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('H/D'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datostrimestre['ausjustuficada']), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datosacumulado['ausjustuficada']), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('    Por ausencias injustificadas'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(13), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('H/H'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datostrimestre['ausinjustuficada']), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datosacumulado['ausinjustuficada']), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('Total de certificados médicos recibidos'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(14), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('UNO'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datostrimestre['certmedico']), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode($datosacumulado['certmedico']), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('Tiempo de trabajo extraordinario pagado'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, utf8_decode(15), 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('H/H'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode(0), 1, 0, 'C', false);
        $pdf->Cell(60, 10, utf8_decode(0), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('% Ausentimo'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, '', 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('%'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, number_format($datostrimestre['indiceausentismo'],0,'.', ''), 1, 0, 'C', false);
        $pdf->Cell(60, 10, number_format($datosacumulado['indiceausentismo'],0,'.', ''), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('% por enfermedad'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, '', 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('%'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, number_format($datostrimestre['indiceporenf'],0,'.', ''), 1, 0, 'C', false);
        $pdf->Cell(60, 10, number_format($datosacumulado['indiceporenf'],0,'.', ''), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('% por autorizaciones administrativas'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, '', 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('%'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, number_format($datostrimestre['indiceautadministrativa'],0,'.', ''), 1, 0, 'C', false);
        $pdf->Cell(60, 10, number_format($datosacumulado['indiceautadministrativa'],0,'.', ''), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(100, 10, utf8_decode('% por ausencias injustificadas'), 1, 0, 'L', false);
        $pdf->Cell(20, 10, '', 1, 0, 'C', false);
        $pdf->Cell(40, 10, utf8_decode('%'), 1, 0, 'C', false);
        $pdf->Cell(60, 10, number_format($datostrimestre['indiceausenciainjust'],0,'.', ''), 1, 0, 'C', false);
        $pdf->Cell(60, 10, number_format($datosacumulado['indiceausenciainjust'],0,'.', ''), 1, 0, 'C', false);
        $pdf->Ln(10);
        $pdf->Cell(280, 20, utf8_decode('OBSERVACIONES:'), 1, 0, 'L', false);
        $pdf->Ln(20);
        $contA = 1;
        $widthHeaderTable = array(100, 60, 120);
        $align = ['J', 'C', 'C'];
        $arr = array();
        array_push($arr, utf8_decode('Certificamos que los datos contenidos en esta información se corresponden con los que aparecen en los registros primarios en nuestro centro.       Fecha: '. date('d/M/Y')));
        array_push($arr, utf8_decode('Revisado  por:'));
        array_push($arr, utf8_decode('Aprobado por:'));
        $this->alingsArray = $align;
        $this->table->SetAligns($this->alingsArray);
        $this->table->SetWidths($widthHeaderTable);
        $this->table->Row($arr, 0, 0, 12);
        $contA++;

        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $trimestre, $denomtrimestre, $year, $idestructura,$denomestructura)
    {
        $pdf->SetLeftMargin(10);
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->SetLineWidth(0);
        $pdf->Cell(300, 5, utf8_decode('Modelo 241- 488-02 Utilización del Fondo de Tiempo'), 0, 1, 'C', 0);
        $pdf->Ln(5);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(30, 5, utf8_decode('Entidad: '. $denomestructura), 0, 1, 'L', 0);
        $pdf->Ln(5);
        $pdf->Cell(30, 5, utf8_decode($denomtrimestre), 0, 1, 'L', 0);
        $pdf->Ln(5);
        $pdf->Cell(30, 5, utf8_decode('Año: ' . $year), 0, 1, 'L', 0);

        $pdf->SetLeftMargin(10);
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->SetFillColor(200);
        $pdf->Cell(100, 10, utf8_decode('Conceptos'), 1, 0, 'C', true);
        $pdf->Cell(20, 10, utf8_decode('Fila'), 1, 0, 'C', true);
        $pdf->Cell(40, 10, utf8_decode('Unidad Medida'), 1, 0, 'C', true);
        $pdf->Cell(60, 10, utf8_decode('Este Trimestre'), 1, 0, 'C', true);
        $pdf->Cell(60, 10, utf8_decode('Acumulado'), 1, 0, 'C', true);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Ln(10);

        return $pdf;
    }


}

