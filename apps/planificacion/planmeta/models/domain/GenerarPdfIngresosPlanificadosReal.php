<?php

/**
 * Created by PhpStorm.
 * User: madrid
 * Date: 15/11/2016
 * Time: 14:35
 */
class GenerarPdfIngresosPlanificadosReal {

    protected $pdf;
    protected $table;
    protected $withArray;
    protected $alignsArray;

    function __construct($parametros) {
        $this->identidad = $parametros->identidad;
        $this->idejercicio = $parametros->idejercicio;
        $this->totalImpPlanif = 0;
        $this->totalImpReal = 0;
        $this->params = $parametros;

        $this->pdf = new TCPDF('P', PDF_UNIT, 'Carta', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

// Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('MEP');
        $this->pdf->SetTitle('Ejecucion ');
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
        $this->pdf->Ln(50);
        if ($this->pdf->GetY() > 276) {
            $this->createHeader();
            $this->pdf->AddPage();
        }
        $this->pdf->Ln();
        $this->pdf->SetAutoPageBreak(TRUE, 20);

// Close and output PDF document
        ob_clean();
        $this->pdf->Output("Ingresos Planificados Real.pdf", 'I');
        return true;
    }

    private function createHeader() {
        $modelPlan = new DatPlanModel();
        $planesIngresosGastos = $modelPlan->getModelosIngresosgastos($this->params);
        $planesIngresosGastosReal = $modelPlan->listarModelosIngresosGastosReales($this->params);
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 13);
        $this->pdf->Cell(190, 5, 'RESUMEN DE LOS INGRESOS PLANIFICADOS Y REAL', 0, 1, 'C', false, '', 1);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Ln(10);
        $this->pdf->Cell(100, 5, 'Ingresos Planificados ', 0, 0, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 10);
        $this->pdf->Cell(50, 5, number_format($planesIngresosGastos[0]['cantidadingreso'], '3', '.', ','), 0, 1, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(100, 5, 'Ingresos Real', 0, 0, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 10);
        $this->pdf->Cell(50, 5, number_format($planesIngresosGastosReal[0]['cantidadingresoreal'], '3', '.', ','), 0, 1, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(100, 5, 'Diferencia', 0, 0, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 10);
        $this->pdf->Cell(50, 5, number_format($planesIngresosGastos[0]['cantidadingreso'] - $planesIngresosGastosReal[0]['cantidadingresoreal'], '3', '.', ','), 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(5);
        self::valoresTabla($planesIngresosGastos, $planesIngresosGastosReal);
    }

    private function valoresTabla($planesIngresosGastos, $planesIngresosGastosReal) {
        $objConcepModel = new NomConceptoAportesModel();
        $resultConceptos = $objConcepModel->listarConceptosAportes();
        $totalValor = 0;
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(80, 5, 'Denominacion', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(30, 5, 'Valor (%)', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(40, 5, 'Importe Planificado', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(40, 5, 'Importe Real', 1, 1, 'C', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 10);
        foreach ($resultConceptos as $valueConcepto) {
            $this->pdf->Cell(80, 5, $valueConcepto['denominacion'], 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(30, 5, $valueConcepto['valor'], 1, 0, 'C', false, '', 1);
            $impPlanif = $planesIngresosGastosReal[0]['cantidadingresoreal'] * ($valueConcepto['valor'] / 100);
            $impReal = $planesIngresosGastosReal[0]['cantidadgastoreal'] * ($valueConcepto['valor'] / 100);
            $this->pdf->Cell(40, 5, number_format($impPlanif, '3', '.', ','), 1, 0, 'C', false, '', 1);
            $this->pdf->Cell(40, 5, number_format($impReal, '3', '.', ','), 1, 1, 'C', false, '', 1);
            $totalValor += $valueConcepto['valor'];
            $this->totalImpPlanif += $impPlanif;
            $this->totalImpReal += $impReal;
        }

        //totales de las columnas
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(80, 5, 'Total', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(30, 5, $totalValor, 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(40, 5, number_format($this->totalImpPlanif, '3', '.', ','), 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(40, 5, number_format($this->totalImpReal, '3', '.', ','), 1, 0, 'C', false, '', 1);
        $this->pdf->Ln(10);

        self::valoresTotales($planesIngresosGastos, $planesIngresosGastosReal);
    }

    private function valoresTotales($planesIngresosGastos, $planesIngresosGastosReal) {
        $quedaIngrePlanif = 0;
        $quedaIngrePlanifReal = 0;
        $utilidadesPlanif = 0;
        $utilidadesReal = 0;
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(100, 5, 'Queda de Ingresos Planificados:', 0, 0, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 10);
        $quedaIngrePlanif = $planesIngresosGastos[0]['cantidadingreso'] - $this->totalImpPlanif;
        $quedaIngrePlanifReal = $planesIngresosGastosReal[0]['cantidadingresoreal'] - $this->totalImpReal;
        $this->pdf->Cell(50, 5, number_format($quedaIngrePlanif, '3', '.', ','), 0, 1, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(100, 5, 'Queda de Ingresos Real:', 0, 0, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 10);
        $this->pdf->Cell(50, 5, number_format($quedaIngrePlanifReal, '3', '.', ','), 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(5);

        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(100, 5, 'Total Gastos Planificados:', 0, 0, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 10);
        $this->pdf->Cell(50, 5, number_format($planesIngresosGastos[0]['cantidadgasto'], '3', '.', ','), 0, 1, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(100, 5, 'Total Gastos Real:', 0, 0, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 10);
        $this->pdf->Cell(50, 5, number_format($planesIngresosGastosReal[0]['cantidadgastoreal'], '3', '.', ','), 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(5);
        $utilidadesPlanif = $quedaIngrePlanif - $planesIngresosGastos[0]['cantidadgasto'];
        $utilidadesReal = $quedaIngrePlanifReal - $planesIngresosGastosReal[0]['cantidadgastoreal'];
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(100, 5, 'Utilidades Planificadas:', 0, 0, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 10);
        $this->pdf->Cell(50, 5, number_format($utilidadesPlanif, '3', '.', ','), 0, 1, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(100, 5, 'Utilidades Real:', 0, 0, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 10);
        $this->pdf->Cell(50, 5, number_format($utilidadesReal, '3', '.', ','), 0, 1, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(100, 5, 'Eficiencia:', 0, 0, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 10);
        $this->pdf->Cell(50, 5, $utilidadesReal - $utilidadesPlanif, 0, 1, 'L', false, '', 1);
    }

}
