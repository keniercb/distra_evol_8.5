<?php

/**
 * Clase para crear la planilla evaluativa en formato PDF
 * Created by Ing. Javier Rodriguez Lopez.
 * Date: 14/03/14
 * Time: 10:28
 */
class ReporteEvaluacionModel extends ZendExt_Model
{

    private $pdf;
    private $widthInd;

    public function ReporteEvaluacionModel($orientation = 'L', $unit = 'mm', $format = 'A4')
    {
        parent::ZendExt_Model();
        $this->widthInd = 300;

        $this->pdf = new TCPDF('L', PDF_UNIT, 'A3', true, 'UTF-8', false);
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('Sistema de Evaluación del Desempeño');
        $this->pdf->SetTitle('EVALUACIÓN');
        $this->pdf->SetSubject('Sistema de Evaluación del Desempeño');
        $this->pdf->SetKeywords('Evaluación');
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

    /**
     * Crea la planilla en formato listo para impresion
     *
     * @param $arrEvaluados
     * @param $startDate
     * @param $endDate
     */
    public function createPDF($arrEvaluados, $startDate, $endDate)
    {
        $this->pdf->AddPage();
        $this->createHeader($arrEvaluados,$startDate, $endDate);
        $this->createBody($arrEvaluados);
        $this->createFooter();

        // Close and output PDF document
        ob_clean();
        $this->pdf->Output("EVALUACIONES.pdf", 'I');
        return true;
    }

    private function createHeader( $arrEvaluados,$startDate, $endDate)
    {
        try {

            //Logo de la entidad
            $this->pdf->SetFont('helvetica', 'B', 8);
            $this->pdf->MultiCell(null, 5, 'Anexo 3', 0, 'C');
            $this->pdf->MultiCell(null, 5, '', 0, 'C');
            $this->pdf->SetFont('helvetica', '', 8);
            $this->pdf->MultiCell(null, 5, 'Mes:', 0, 'L');
            $this->pdf->MultiCell(null, 5, 'Trimestre:', 0, 'L');
            $this->pdf->MultiCell(null, 5, '', 0, 'C');
            //$this->pdf->SetX(40);			
            $this->pdf->SetFont('helvetica', 'B', 12);
            $this->pdf->MultiCell(null, 5, 'RESUMEN DEL REGISTRO DE LOS RESULTADOS DE LA EVALUACION', 0, 'C');
            $this->pdf->SetFont('helvetica', 'B', 10);
            $this->pdf->MultiCell(null, 5,'', 0, 'L');
            $this->pdf->MultiCell(null, 5, 'Proceso:', 0, 'L');
            $this->pdf->SetFont('helvetica', 'C', 10);
            $this->pdf->MultiCell(null, 5, $arrEvaluados[0]['proceso'], 0, 'L');
            $this->pdf->MultiCell(null, 5, '', 0, 'L');

            $this->pdf->SetFont('helvetica', 'B', 10);
            $this->pdf->MultiCell(null, 5, 'Período:', 0, 'L');

            $this->pdf->SetFont('helvetica', 'C', 10);

            $this->pdf->MultiCell(null, 15, $arrEvaluados[0]['periodo'], 0, 'L');





        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    private function createBody($evaldo)
    {
        $cont = 0;
        $subCont = 1;
        global $total;
        $lastIdpadre = null;
        $this->pdf->SetFont('helvetica', 'B', 8);
        $this->pdf->Ln(5);
        $this->pdf->SetFont('helvetica', 'B', 7);
        $this->pdf->Cell(5, 35, 'No', 1, 0, 'C');
        $this->pdf->Cell(30, 35, 'CI', 1, 0, 'C');
        $this->pdf->Cell(30, 35, 'Nombre', 1, 0, 'C');
        $this->pdf->Cell(20, 35, '1er apellido', 1, 0, 'C');
        $this->pdf->Cell(20, 35, '2do apellido', 1, 0, 'C');
        $this->pdf->Cell(65, 35, 'Cargo en el que se desempeña', 1, 0, 'C');

        $this->pdf->StartTransform();
        $this->pdf-> Rotate(90,"","");
        $this->pdf-> Translate (-35, "");
        $this->pdf->Cell(35, 15, 'Resultado de la evaluación', 1, 0, 'C');
        $this->pdf->StopTransform();
        $this->pdf->StartTransform();
        $this->pdf-> Rotate(90,"","");
        $this->pdf-> Translate (-35, -20);
        $this->pdf->Cell(35, 10, 'Calificación del desempeño', 1, 0, 'C');
        $this->pdf->StopTransform();
        $this->pdf->StartTransform();
        $this->pdf-> Rotate(90,"","");
        $this->pdf-> Translate (-35, -45);
        $this->pdf->Cell(35, 15, '%Otorgado para estimulación', 1, 0, 'C');
        $this->pdf->StopTransform();
        $this->pdf->StartTransform();
        $this->pdf-> Translate (-65, 0);
        $this->pdf->Cell(70, 35, ' Valoración cualitativa de las conclusiones ', 1, 0, 'C');
        $this->pdf->StopTransform();

        $this->pdf->Ln(0);
        $this->pdf->SetX(285);
        $this->pdf->Cell(20, 35, ' ', 1, 0, 'C');
        $this->pdf->Ln(0);
        $this->pdf->SetX(285);
        $this->pdf->Cell(20, 20, 'Conformidad', 1, 0, 'C');
        $this->pdf->Ln(20);
        $this->pdf->SetX(285);
        $this->pdf->Cell(10, 15, 'No', 1, 0, 'C');
        $this->pdf->SetX(295);
        $this->pdf->Cell(10, 15, 'Si', 1, 0, 'C');
        $this->pdf->Ln(-20);
        $this->pdf->SetX(305);
        $this->pdf->Cell(40, 35, 'Firma', 1, 1, 'C');

        $this->pdf->SetFont('helvetica', '', 7);
        $this->pdf->Ln(0);
        foreach ($evaldo as $k => $eval) {
            $this->pdf->Cell(5, 10, $k+1, 1, 0);
            $this->pdf->Cell(30, 10, $eval['numid'], 1);
            $this->pdf->Cell(30, 10, $eval['nombre'] . ' ' . $eval['snombre'], 1);
            $this->pdf->Cell(20, 10, $eval['papel'], 1);
            $this->pdf->Cell(20, 10, $eval['sapel'], 1);
            $this->pdf->MultiCell(65, 10, $eval['denomcargo'],1,'L');

            $this->pdf->Ln(-10);
            $this->pdf->SetX(175);
            $this->pdf->Cell(15, 10, $eval['evaluacion'], 1, 0, 'C');
            $this->pdf->Cell(10, 10, $eval['estadodesarrollo'], 1, 0, 'C');
            $this->pdf->Cell(15, 10, $eval['otorgado'], 1, 0, 'C');
            $this->VariasLineasValoracion($eval['valoracion'],$total);

            $this->pdf->Ln(-10);
            $this->pdf->SetX(285);
            $this->pdf->Cell(10, 10, '', 1, 0, 'C');
            $this->pdf->Cell(10, 10, '', 1, 0, 'C');
            $this->pdf->Cell(40, 10, $eval['firma'], 1, 1);

        }
    }

    private function createFooter()
    {
        $this->pdf->Ln(10);
        $this->pdf->SetFont('helvetica', 'B', 8);
        $this->pdf->MultiCell(null, 5, 'Firma del Jefe que evalúa:______________', 0, 'L');
		$this->pdf->Ln(-2);
        $this->pdf->MultiCell(null, 5, '', 0, 'L');
        $this->pdf->MultiCell(null, 5, 'Fecha:______________', 0, 'L');
        $this->pdf->Ln(12);
        $this->pdf->SetFont('helvetica', 'B', 8);
        $this->pdf->MultiCell(null, 5, 'Leyenda: Calificación Desempeño Laboral:', 0, 'L');
        $this->pdf->Ln(-2);
        $this->pdf->MultiCell(null, 5, '', 0, 'L');
        $this->pdf->MultiCell(null, 5, 'Superior:    S', 0, 'L');
        $this->pdf->Ln(-2);
        $this->pdf->SetTextColor (0,102,255);
        $this->pdf->MultiCell(null, 5, 'Adecuado: A', 0, 'L');
        $this->pdf->Ln(-2);
        $this->pdf->SetTextColor (255,51,0);
        $this->pdf->MultiCell(null, 5, 'Deficiente: D', 0, 'L');


    }

    public function VariasLineasValoracion($cadena, $total)
    {

        while (!(strlen($cadena) == '')) {

            $subcadena = substr($cadena, 12, 50);
            $total.= $subcadena;
            $cadena = substr($cadena, 50);

        }

        $this->pdf->MultiCell(70,10, "" . utf8_decode($total),1,'L');

    }

}
