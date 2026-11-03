<?php

class GenerarPdfModeloEstadoResultado {

    protected $pdf;
    protected $table;

    function __construct($parametros) {
        $this->params = $parametros;
        $this->pdf = new TCPDF('P', PDF_UNIT, 'A3', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

// Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('XETID');
        $this->pdf->SetTitle('Produccion');
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
        $this->pdf->Output(" Produccion.pdf", 'I');
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
        $this->pdf->Cell(120, 5, 'ESTADO DE RESULTADO', 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->setColor('text', 240, 32, 16);
        $this->pdf->Cell(25, 5, 'MODELO 3', 0, 1, 'R', false, '', 1);
        $this->pdf->setColor('text', 0, 0, 0);
        $this->pdf->Ln(3);

        //COLUMNAS
        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(120, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'PERIODO', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'PERIODO', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(50, 5, 'CRECIMIENTO', 1, 1, 'C', true, '', 1);

        $this->pdf->Cell(120, 5, 'DESCRIPCIÓN', 'LRB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 'BASE', 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'PLANIFICADO', 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'EN MP', 1, 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'EN %', 1, 1, 'C', true, '', 1);
        
        //OBTENIENDO DATOS
//        $paramsQuery = array($this->params->identidades, $this->params->idejercicio);       
//        $query = "select * from mod_planificacion.f_reporteproduccion (?,?);";
//        $conn = Doctrine_Manager::connection();
//        $res = $conn->execute($query, $paramsQuery);
//        $resultadoPrimero = $res->fetchAll(PDO::FETCH_ASSOC);
//        $resultadoPrimero =$resultadoPrimero[0];
        
        //DIBUJANDO DATOS        
        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->SetFillColor(255, 255, 255);

        $this->pdf->Cell(120, 5, 'VENTAS NETAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(-)COSTO DE VENTAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(-)COSTO MERCANCIAS VENDIDAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(120, 5, 'UTILIDAD BRUTA EN VENTAS', 'LB', 0, 'L', true, '', 1);
        $this->pdf->SetFillColor(255, 255, 255);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);
  
        $this->pdf->Cell(120, 5, '(-)GASTOS DISTRIBUCION Y VENTAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(120, 5, 'UTILIDAD NETA EN VENTAS', 'LRB', 0, 'L', true, '', 1);
        $this->pdf->SetFillColor(255, 255, 255);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(-)GASTOS ADMINISTRACION', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(-)GASTOS DE OPERACIONES', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(120, 5, 'UTILIDAD EN OPERACIONES', 'LRB', 0, 'L', true, '', 1);
        $this->pdf->SetFillColor(255, 255, 255);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(-)GASTOS FINANCIEROS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(-)GASTOS FINANCIEROS OSDE', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(-)IMPUESTOS Y CONTRIBUCIONES', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(-)OTROS GASTOS COMEDOR Y CAFET.', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(-)OTROS GASTOS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(+)INGRESOS FINANCIEROS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(+)INGRESOS COMEDOR Y CAFETERIA', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(+)OTROS INGRESOS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(120, 5, 'UTILIDAD TOTAL O ANTES DE IMPUESTOS', 'LRB', 0, 'L', true, '', 1);
        $this->pdf->SetFillColor(255, 255, 255);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(-)IMPUESTOS SOBRE UTILIDADES', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(120, 5, 'UTILIDAD DESPUES DE IMPUESTOS', 'LRB', 0, 'L', true, '', 1);
        $this->pdf->SetFillColor(255, 255, 255);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(-)RESERVA DE CONTINGENCIAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(-)RENDIMIENTO INVERSION ESTATAL', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(120, 5, 'UTILIDADES RETENIDAS', 'LRB', 0, 'L', true, '', 1);
        $this->pdf->SetFillColor(255, 255, 255);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Gastos Faltantes y otros', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'RENTABILIDAD BRUTA EN VENTAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'RENTABILIDAD NETA EN VENTAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'RENTABILIDAD OPERACIONES EN VENTAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'RENTABILIDAD TOTAL EN VENTAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);
    }

}
