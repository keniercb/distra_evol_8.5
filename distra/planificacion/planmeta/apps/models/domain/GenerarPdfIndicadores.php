<?php

class GenerarPdfIndicadores {

    protected $pdf;
    protected $table;

    function __construct($parametros) {
        $this->params = $parametros;
        $this->pdf = new TCPDF('P', PDF_UNIT, 'A3', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

// Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('XETID');
        $this->pdf->SetTitle('Indicadores');
        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);

// set default monospaced font
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
        $this->pdf->SetMargins(5, 5, 5);

// set auto page breaks
        $this->pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
    }

    public function export() {

        $this->pdf->AddPage();

        $this->createHeader();
        $this->pdf->Ln(5);
        if ($this->pdf->GetY() > 276) {
            $this->createHeader();
            $this->pdf->AddPage();
        }
        $this->pdf->Ln();
        $this->pdf->SetAutoPageBreak(TRUE, 20);



// Close and output PDF document
        ob_clean();
        $this->pdf->Output("Indicadores.pdf", 'I');
        return true;
    }

    private function createHeader() {
        $this->pdf->setJPEGQuality(75);
        //TÍTULO
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->setColor('red');
        $this->pdf->Cell(120, 5, 'ENTIDAD: ' . $this->params->denomentidad, 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 'PERIODO: ' . $this->params->denomejercicio, 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 'UM:  MP', 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(3);
        $this->pdf->Cell(120, 5, 'RESUMEN DE PRODUCCIÓN', 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->setColor('text', 240, 32, 16);
        $this->pdf->Cell(25, 5, 'MODELO 6', 0, 1, 'R', false, '', 1);
        $this->pdf->setColor('text', 0, 0, 0);
        $this->pdf->Ln(3);

        //COLUMNAS
        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(15, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(120, 5, 'DENOMINACIÓN', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(15, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'PERIODO', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'PERIODO', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(50, 5, 'CRECIMIENTO', 1, 1, 'C', true, '', 1);

        $this->pdf->Cell(15, 5, 'No', 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(120, 5, 'INDICADORES DIRECTIVOS', 1, 0, 'L', true, '', 1);
        $this->pdf->Cell(15, 5, 'UM', 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'BASE', 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'PLANIFICADO', 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'EN MP', 1, 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'EN %', 1, 1, 'C', true, '', 1);
        
//        //OBTENIENDO DATOS
//        $paramsQuery = array($this->params->identidades, $this->params->idejercicio);       
//        $query = "select * from mod_planificacion.f_reporteproduccion (?,?);";
//        $conn = Doctrine_Manager::connection();
//        $res = $conn->execute($query, $paramsQuery);
//        $resultadoPrimero = $res->fetchAll(PDO::FETCH_ASSOC);
//        $resultadoPrimero =$resultadoPrimero[0];
        
        //DIBUJANDO DATOS        
        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->SetFillColor(255, 255, 255);

        $this->pdf->Cell(15, 5, '1', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(120, 5, '      Ventas Netas Totales', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(15, 5, 'MP', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(15, 5, '2', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(120, 5, '      Ventas Exportaciones', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(15, 5, 'MP', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(15, 5, '3', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(120, 5, '      Ventas Seleccionadas (Encargo Estatal)', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(15, 5, 'MP', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(15, 5, '4', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(120, 5, '      Utilidades Totales', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(15, 5, 'MP', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(15, 5, '5', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(120, 5, '      Aportes en CUC', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(15, 5, 'MCUC', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(15, 5, '6', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(120, 5, '      Rotaciones del capital de trabajo', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(15, 5, 'VECES', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(15, 5, '7', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(120, 5, '      Aporte Rendimiento Inversion Estatal', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(15, 5, 'MP', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(15, 5, '', 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(120, 5, 'INDICADORES LÍMITES', 'LB', 0, 'L', true, '', 1);
        $this->pdf->Cell(15, 5, '', 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', true, '', 1);
        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->SetFillColor(255, 255, 255);

        $this->pdf->Cell(15, 5, '1', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(120, 5, '      Intensidaad Energética Total', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(15, 5, 'KW/MP', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(15, 5, '2', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(120, 5, '      Indice de Combustible Total', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(15, 5, 'KG/MP', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(15, 5, '3', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(120, 5, '      Salario por Peso de Valor Agregado', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(15, 5, 'MP', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(15, 5, '4', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(120, 5, '      Gasto de Estim Total en CUC', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(15, 5, 'MCUC', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(15, 5, '3', 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(120, 5, 'OTROS INDICADORES', 'LB', 0, 'L', true, '', 1);
        $this->pdf->Cell(15, 5, 'MP', 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', true, '', 1);
        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->SetFillColor(255, 255, 255);
    }

}