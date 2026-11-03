<?php

class GenerarPdfModeloProduccion {

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
        $this->pdf->Cell(120, 5, 'RESUMEN DE PRODUCCIÓN', 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->setColor('text', 240, 32, 16);
        $this->pdf->Cell(25, 5, 'MODELO 1', 0, 1, 'R', false, '', 1);
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
        $paramsQuery = array($this->params->identidades, $this->params->idejercicio);
// pre_r($this->params);die;		
        $query = "select * from mod_planificacion.f_reporteproduccion (?,?);";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query, $paramsQuery);
        $resultadoPrimero = $res->fetchAll(PDO::FETCH_ASSOC);
        $resultadoPrimero =$resultadoPrimero[0];
        //DIBUJANDO DATOS        
        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->SetFillColor(255, 255, 255);

        $this->pdf->Cell(120, 5, '        VENTAS FAR CUP', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['ventafarcup'], 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, ($resultadoPrimero['ventafarcup']/1000), 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '        VENTAS ECONOMÍA CUP', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['ventaeconom'], 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, ($resultadoPrimero['ventaeconom']/1000), 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '        VENTAS DE EXPORTACIONES CUP', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['ventaexport'], 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['ventaexport']/1000, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '        VENTAS CUC TOTAL ', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['ventacuc'], 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['ventacuc']/1000, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '        VENTAS ALTA DEMANDA', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '        VENTAS DE MERCANCÍAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '( -) IMPUESTOS SOBRE VENTAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'B', 8);
        $this->pdf->Cell(120, 5, '        VENTAS NETAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['ventaneta'], 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['ventaneta']/1000, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->Cell(120, 5, '( -) SALDO INICIAL INV PROD. TERMINADA A PRECIO VENTA', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(+) SALDO FINAL INV PROD. TERMINADA A PRECIO VENTA', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'B', 8);
        $this->pdf->Cell(120, 5, '      PRODUCCIÓN MERCANTIL', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->Cell(120, 5, '', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(-) SALDO INICIAL PROD. EN PROCESO', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(+) SALDO FINAL PROD. EN PROCESO', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(+) INVERSIONES CON MEDIOS PROPIOS TERMINADAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['invmedpropio'], 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['invmedpropio']/1000, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(+) REP. CAPITALES CON MEDIOS PROPIOS TERMINADAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['invrepcapmedpropio'], 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['invrepcapmedpropio']/1000, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'B', 8);
        $this->pdf->Cell(120, 5, '      PRODUCCIÓN BRUTA', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->Cell(120, 5, '(-) GASTO MATERIAL TOTAL', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(-) SERVICIOS DE TERCEROS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '(+) MARGEN COMERCIAL BRUTO', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'B', 8);
        $this->pdf->Cell(120, 5, '      VALOR AGREGADO BRUTO', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '      VENTAS SELECCIONADAS O ENCARGO ESTATAL', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['encargoestatal'], 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['encargoestatal']/1000, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '      % ENCARGO ESTATAL EN VENTAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['porcientoencargoestatal'], 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['porcientoencargoestatal']/1000, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '      VENTAS DE EXPORTACIONES CUC', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['ventaexportcuc'], 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, $resultadoPrimero['ventaexportcuc']/1000, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '      % EXPORTACIONES EN VENTAS EN CUC', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '      % DEL VALOR AGREGADO EN PRODUCCIÓN BRUTA', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, '      % DE UTILIDADES EN VALOR AGREGADO', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);
    }
}