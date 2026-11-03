<?php

class GenerarPdfFlujoCaja {

    protected $pdf;
    protected $table;

    function __construct($parametros) {
        $this->params = $parametros;
        $this->pdf = new TCPDF('P', PDF_UNIT, 'A3', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

// Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('XETID');
        $this->pdf->SetTitle('FlujoCaja');
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
        $this->pdf->Output("FlujoCaja.pdf", 'I');
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
        $this->pdf->Cell(120, 5, 'FLUJO DE CAJA', 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->setColor('text', 240, 32, 16);
        $this->pdf->Cell(25, 5, 'MODELO 5', 0, 1, 'R', false, '', 1);
        $this->pdf->setColor('text', 0, 0, 0);
        $this->pdf->Ln(3);

        //COLUMNAS
        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(160, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'TOTAL', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'SUBTOTAL', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'SUBTOTAL', LRT, 1, 'C', true, '', 1);

        $this->pdf->Cell(160, 5, 'FLUJO DE CAJA PROYECTADO', 'LRB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 'MP', 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'CUP', 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'CUC', LRB, 1, 'C', true, '', 1);
        
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

        $this->pdf->Cell(160, 5, 'Saldo Inicial de Efectivo en Banco Operaciones', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(160, 5, 'MAS: Entradas (Cobros):', 'LB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', true, '', 1);
        $this->pdf->SetFillColor(255, 255, 255);

        $this->pdf->Cell(160, 5, '(+)Cuentas y Efectos por cobrar Inicio', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, '(+)Ventas Netas', 'LB', 0, 'L', FALSE, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);
  
        $this->pdf->Cell(160, 5, '(-)Cuentas y Efectos por cobrar final', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, '(+)Ventas de Activos', 'LRB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, '(+)Préstamos a recibir', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, '(+)Otros Ingresos', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, '(+)Otros Cobros', 'LRB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, 'Total Entradas', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(160, 5, 'MENOS: Salidas (Pagos):', 'LB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', true, '', 1);
        $this->pdf->SetFillColor(255, 255, 255);

        $this->pdf->Cell(160, 5, '(+)Cuentas por Pagar Inicio', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, '(+)Compra a Proveedores', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, '(-)Cuentas por Pagar Final', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, '(+)Pagos de Nóminas y Tiendas CUC', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, '(+)Pagos a ONAT y Presupuesto', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, '(+)Pagos a la OSDE', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, '(+)Pagos de Servivios recibidos (elec, agua, telef, etc)', 'LRB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, '(+)Pagos de Retenciones al Banco', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, '(+)Pagos de Préstamos', 'LRB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, '(+)Otros Pagos', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(160, 5, 'Total Salidas', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(160, 5, 'Saldo Final de Efectivo en Banco Operaciones', 'LB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', true, '', 1);
        $this->pdf->SetFillColor(255, 255, 255);
    }

}