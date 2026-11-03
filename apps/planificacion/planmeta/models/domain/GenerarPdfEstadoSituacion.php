<?php

class GenerarPdfEstadoSituacion {

    protected $pdf;
    protected $table;

    function __construct($parametros) {
        $this->params = $parametros;
        $this->pdf = new TCPDF('P', PDF_UNIT, 'A3', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

// Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('XETID');
        $this->pdf->SetTitle('EstadoSituacion');
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
        $this->pdf->Output("EstadoSituacion.pdf", 'I');
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
        $this->pdf->Cell(120, 5, 'ESTADO SITUACION', 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->setColor('text', 240, 32, 16);
        $this->pdf->Cell(25, 5, 'MODELO 4', 0, 1, 'R', false, '', 1);
        $this->pdf->setColor('text', 0, 0, 0);
        $this->pdf->Ln(3);

        //COLUMNAS
        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(120, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'SALDO INICIAL', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'AUMENTO', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'DISMINUCION', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'SALDO FINAL', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'VARIACION', LRT, 1, 'C', true, '', 1);

        $this->pdf->Cell(120, 5, 'CONCEPTO', 'LRB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 'REAL O ESTIMADO', 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'PLANIFICADO', 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'PLANIFICADA', LRB, 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'PLAN', LRB, 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'SF - SI', LRB, 1, 'C', true, '', 1);
        
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

        $this->pdf->Cell(120, 5, 'INDICE DE LIQUIDEZ GENERAL', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'INDICE DE LIQUIDEZ INMEDIATA', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 0, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'INDICE DE TESORERIA O CAJA', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Cap Trab = AC - PC', 'LB', 0, 'L', FALSE, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);
  
        $this->pdf->Cell(120, 5, 'Cap Trab = MRN', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Exceso (defecto) kw ó Liquidez', 'LRB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Exceso (defecto) Financ. M.R.N', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Exceso (defecto) Financ. A.F.T', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Cuentas x cobrar vencidas', 'LRB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Cuentas x cobrar diversas', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Medios inmovilizados', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Reservas Varias', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Utilidades Netas', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'CUADRE (exc odef kw)', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Rotación del capital de trabajo', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Ciclo del capital de trabajo', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Ciclos de los Inventarios', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Ciclo de Producción en Proceso', 'LRB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Ciclo de Producción Terminada', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Ciclo de Cobro', 'LRB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(120, 5, 'Ciclo de Pago', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);
    }

}