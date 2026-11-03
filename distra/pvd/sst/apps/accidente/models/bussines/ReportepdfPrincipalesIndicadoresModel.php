<?php

class PDFPrincipalesIndicadores extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->Cell(100, 8, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 0, 'L');
        $this->Cell(20, 8, utf8_decode('Generado por: ' . $perfil['usuario']) . ' el ' . date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 8, utf8_decode('Página ' . $this->PageNo()), 0, 0, 'R');
    }
}


class ReportepdfPrincipalesIndicadoresModel extends ZendExt_Model
{
    public function InfoGeneralpdf()
    {
        parent::ZendExt_Model();

    }

    public function CrearReportePDF($idestructura, $trimestre)
    {

        $pdf = new PDFPrincipalesIndicadores('L', 'mm', 'letter');
        $pdf->AddPage();
        $modeloNegocio = new DatAnalisisModel();
        $datos = $modeloNegocio->getPrincipalesIndicadores($idestructura,$trimestre);
        $pdfNGeneral = $this->crearCuerpo($pdf,$trimestre,$datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $trimestre,$datos)
    {
        $pdf->SetX(24);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(20, 8, 'Cod.', 'LTR', 0, 'C');
        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(40, 8, '5.05.04.01 ', 'T', 0, 'C');
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(143, 8, ' PRINCIPALES INDICADORES DE ACCIDENTALIDAD', 'TR', 0, 'C');
        $pdf->Cell(25, 8, 'Minfar', 'TLR', 1, 'C');

        $pdf->SetX(24);
        $pdf->Cell(20, 7, '', 'LRB', 0, 'L');
        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(40, 7, '038', 1, 0, 'C');
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(143, 7, 'Seguridad del Trabajo', 1, 0, 'C');
        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(25, 7, 'St-1', 'BRL', 1, 'C');
        $pdf->SetFont('Arial', 'B', 12);

        $pdf->SetX(24);
        $pdf->Cell(20, 10, 'No.', 'LR', 0, 'C');
        $pdf->Cell(163, 10, 'INDICADORES', 'LR', 0, 'C');
        $pdf->Cell(20, 10, 'UM', 'LR', 0, 'C');
        $pdf->Cell(25, 10, 'Cant. real', 'LR', 1, 'C');

        $pdf->SetX(24);
        $pdf->Cell(20, 6, 'indicador', 'LR', 0, 'C');
        $pdf->Cell(163, 6, '', 'LR', 0, 'C');
        $pdf->Cell(20, 6, '', 'LR', 0, 'C');
        $pdf->Cell(25, 6, 'del trimestre', 'LR', 1, 'C');

        //Datos
     /*   $datos = array(
            ['no' => '01', 'indicadores' => 'Trabajadores civiles lesionados por accidente de trabajo', 'um' => 'uno', 'cant' => '', 'encabezado' => 'si'],
            ['no' => '01.01', 'indicadores' => 'De ellos fatales', 'um' => 'uno', 'cant' => '', 'encabezado' => 'no'],
            ['no' => '01.02', 'indicadores' => 'Hombres/dias perdidos por accidentes de trabajo', 'um' => 'h/d', 'cant' => '', 'encabezado' => 'no'],
            ['no' => '01.03', 'indicadores' => 'Subsidio pagado por accidentes de trabajo', 'um' => 'peso', 'cant' => '', 'encabezado' => 'no'],
            ['no' => '01.04', 'indicadores' => 'Daños materiales por accidentes de trabajo y averías con o son lesiones', 'um' => 'peso', 'cant' => '', 'encabezado' => 'no'],

            ['no' => '02', 'indicadores' => 'Trabajadores civiles lesionados por accidentes de trayecto', 'um' => 'uno', 'cant' => '', 'encabezado' => 'si'],
            ['no' => '02.01', 'indicadores' => 'De ellos fatales', 'um' => 'uno', 'cant' => '', 'encabezado' => 'no'],
            ['no' => '02.02', 'indicadores' => 'Hombres/dias perdidos por accidentes de trayecto', 'h/d' => 'uno', 'cant' => '', 'encabezado' => 'no'],
            ['no' => '02.03', 'indicadores' => 'Subsidio pagado por accidentes de trayecto', 'um' => 'peso', 'cant' => '', 'encabezado' => 'no'],

            ['no' => '03', 'indicadores' => 'Trabajadores civiles lesionados por otros accidentes equiparados', 'um' => 'uno', 'cant' => '', 'encabezado' => 'si'],
            ['no' => '03.01', 'indicadores' => 'De ellos fatales', 'um' => 'uno', 'cant' => '', 'encabezado' => 'no'],
            ['no' => '03.02', 'indicadores' => 'Hombres/dias perdidos por otros accidentes equiparados', 'h/d' => 'uno', 'cant' => '', 'encabezado' => 'no'],
            ['no' => '03.03', 'indicadores' => 'Subsidio pagado por otros accidentes equiparados', 'um' => 'peso', 'cant' => '', 'encabezado' => 'no'],

            ['no' => '04', 'indicadores' => 'Promedio de trabajdores total', 'um' => 'uno', 'cant' => '', 'encabezado' => 'si'],

            ['no' => '05', 'indicadores' => 'Tiempo trabajado', 'um' => 'h/h', 'cant' => '', 'encabezado' => 'si'],

            ['no' => '06', 'indicadores' => 'Personal militar lesionado por accidentes de trabajo', 'um' => 'uno', 'cant' => '', 'encabezado' => 'si'],
            ['no' => '06.01', 'indicadores' => 'De ellos fatales', 'um' => 'uno', 'cant' => '', 'encabezado' => 'no'],
            ['no' => '06.02', 'indicadores' => 'Hombres/dias perdidos del personal militar por accidentes de trabajo', 'h/d' => 'uno', 'cant' => '', 'encabezado' => 'no'],
            ['no' => '06.03', 'indicadores' => 'Haberes pagados al personal militar por accidentes de trabajo', 'um' => 'peso', 'cant' => '', 'encabezado' => 'no'],

            ['no' => '07', 'indicadores' => 'Personal militar lesionado por accidentes de trayecto', 'um' => 'uno', 'cant' => '', 'encabezado' => 'si'],
            ['no' => '07.01', 'indicadores' => 'De ellos fatales', 'um' => 'uno', 'cant' => '', 'encabezado' => 'no'],
            ['no' => '07.02', 'indicadores' => 'Hombres/dias perdidos del personal militar por accidentes de trayecto', 'h/d' => 'uno', 'cant' => '', 'encabezado' => 'no'],
            ['no' => '07.03', 'indicadores' => 'Haberes pagados al personal militar por accidentes de trayecto', 'um' => 'peso', 'cant' => '', 'encabezado' => 'no'],

            ['no' => '08', 'indicadores' => 'Personal militar lesionado en actividades Puramente militares', 'um' => 'uno', 'cant' => '', 'encabezado' => 'si'],
            ['no' => '08.01', 'indicadores' => 'De ellos fatales', 'um' => 'uno', 'cant' => '', 'encabezado' => 'no'],
            ['no' => '08.02', 'indicadores' => 'Hombres/dias perdidos del personal militar por accidentes en actividades puramente militares', 'um' => 'h/d', 'cant' => '', 'encabezado' => 'no'],
            ['no' => '08.03', 'indicadores' => 'Haberes pagados al personal militar por accidentes en actividades puramente militares', 'um' => 'peso', 'cant' => '', 'encabezado' => 'no'],
        );
*/

        $negrita = '';
        foreach ($datos as $key => $dat) {
            $pdf->SetX(24);
            if ($dat['encabezado'] == 1) {
                $negrita = 'B';
            } else {
                $negrita = '';
            }
            $pdf->SetFont('Arial', $negrita, 11);
            $pdf->Cell(20, 8, $dat['no'], 1, 0, 'C');
            $pdf->Cell(163, 8, utf8_decode($dat['indicadores']), 1, 0, 'L');
            $pdf->Cell(20, 8, $dat['um'], 1, 0, 'C');
            $pdf->Cell(25, 8, $dat['cant'], 1, 1, 'C');
        }
        $fecha = date('d/m/Y');
        $anno = explode('/', $fecha)[2];

        $pdf->SetX(24);
        $pdf->Cell(20, 8, utf8_decode('Año'), 'LR', 0, 'C');
        $pdf->Cell(70, 8, utf8_decode('Entidad militar'), 'LR', 0, 'L');
        $pdf->Cell(80, 8, utf8_decode('Mando o territorio'), 'LR', 0, 'L');
        $pdf->Cell(58, 8, utf8_decode('Trimestre terminado en :'), 1, 1, 'L');
        $pdf->SetX(24);
        $pdf->Cell(20, 20,  $anno, 1, 0, 'C');
        $pdf->Cell(70, 20, '______________________________', 1, 0, 'L');
        $pdf->Cell(80, 20, '__________________________________', 1, 0, 'L');
        $pdf->SetX(194);

        ($trimestre == 1) ? $pdf->Cell(58, 5, 'Marzo ....X.......', 1, 1, 'L') : $pdf->Cell(58, 5, 'Marzo ...........', 1, 1, 'L');

        $pdf->SetX(194);
        ($trimestre == 2) ? $pdf->Cell(58, 5, 'Junio .....X......', 1, 1, 'L') : $pdf->Cell(58, 5, 'Junio ...........', 1, 1, 'L');

        $pdf->SetX(194);
        ($trimestre == 3) ? $pdf->Cell(58, 5, 'Septiembre ......X.....', 1, 1, 'L') : $pdf->Cell(58, 5, 'Septiembre ...........', 1, 1, 'L');

        $pdf->SetX(194);
        ($trimestre == 4) ? $pdf->Cell(58, 5, 'Dieciembre .....X......', 1, 1, 'L') : $pdf->Cell(58, 5, 'Dieciembre ...........', 1, 1, 'L');
        $pdf->SetX(24);
        $pdf->Cell(76, 5, 'Elaborado por:', 1, 0, 'L');
        $pdf->Cell(96, 5, 'Jefe o director de la entidad', 1, 0, 'L');
        $pdf->Cell(56, 5, 'Fecha', 1, 1, 'L');
        $pdf->SetX(24);
        $pdf->Cell(76, 5, 'Nombre:', 1, 0, 'L');
        $pdf->Cell(96, 5, 'Nombre:', 1, 0, 'L');
        $pdf->Cell(19, 5, 'D', 1, 0, 'C');
        $pdf->SetX(215);
        $pdf->Cell(18, 5, 'M', 1, 0, 'C');
        $pdf->SetX(233);
        $pdf->Cell(19, 5, 'A', 1, 1, 'C');

        $pdf->SetX(24);
        $pdf->Cell(34, 8, 'Cargo', 1, 0, 'L');
        $pdf->Cell(42, 8, 'Firma:', 1, 0, 'L');
        $pdf->Cell(96, 8, 'Firma:', 1, 0, 'L');
        $pdf->Cell(19, 8, '', 1, 0, 'L');
        $pdf->Cell(18, 8, '', 1, 0, 'L');
        $pdf->Cell(19, 8, '', 1, 1, 'L');
        $pdf->SetX(24);
        $pdf->Cell(228, 8, 'Observaciones', 1, 1, 'L');


        return $pdf;
    }
}
