<?php

/**
 * Created by PhpStorm.
 * User: madrid
 * Date: 25/02/2016
 * Time: 16:15
 */
class GenerarPdfPresupuestoDelEstado extends TCPDF
{

    protected $pdf;
    protected $table;
    protected $withArray;
    protected $alignsArray;

    function __construct($parametros)
    {

        //$this->idejercicio = $parametros->idejercicio;
        // Create new PDF document
        $this->pdf = new TCPDF('P', PDF_UNIT, 'Carta', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);
        $this->idejercicio = $parametros->idejercicio;
        $this->ejercicio = $parametros->ejercicio;
        // Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('SISPLAN');
        $this->pdf->SetTitle('Control de las Aprobaciones');
        $this->pdf->SetSubject(
            'Ministerio de las Fuerzas Armadas Revolucionarias'
        );
        $this->pdf->SetKeywords('Indicadores, Control, SISPLAN');
        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);

        // set default monospaced font
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $this->pdf->SetMargins(5, 15, 3);

        // set auto page breaks
        $this->pdf->SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);

        // set image scale factor
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
    }

    public function export()
    {

        $this->pdf->AddPage();
        $this->createHeader();
        $this->pdf->Ln(5);
        $this->createHeaderTable();
        //$this->createBodyTable();
        // $this->pdf->setY(267);
        //$this->createBodyTable();
        //$this->addContenido();
        if ($this->pdf->GetY() > 258) {
            $this->pdf->setY(262);
            //$this->piedePagina();
            $this->pdf->AddPage();
        } else {
            $this->pdf->setY(262);
            //$this->piedePagina();
        }
        ob_clean();

        $this->pdf->Output("Planificacion del Presupuesto del Estado", 'I');
        return true;
    }


    private function createHeader()
    {
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 12);
        $this->pdf->Cell(200, 5, "MINISTERIO DE FINANZAS Y PRECIOS", 0, 1, 'C');
        $this->pdf->SetFont('Times', 'N', 11);
        $this->pdf->Cell(
            200, 5, "PLANIFICACION DEL PRESUPUESTO DEL ESTADO", 0, 1, 'C'
        );
        $this->pdf->SetFont('Times', 'N', 10);
        $this->pdf->Ln();
        $this->pdf->Cell(100, 5, "Unidad Presupuestada: ", 0, 0, 'L');
        $this->pdf->Cell(100, 5, "Codigo: 1", 0, 1, 'R');
        $this->pdf->Cell(100, 5, "Entidad Empresarial: ", 0, 0, 'L');
        $this->pdf->Cell(100, 5, "Codigo: 2", 0, 1, 'R');
        $this->pdf->Cell(100, 5, "Organizacion o Asociacion: ", 0, 0, 'L');
        $this->pdf->Cell(100, 5, "Codigo: 3", 0, 1, 'R');
        $this->pdf->Cell(43, 5, "Organo, Organismo u OSDE: ", 0, 0, 'L');
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(57, 5, "MINFAR", 0, 0, 'L');
        $this->pdf->SetFont('Times', 'N', 10);
        $this->pdf->Cell(100, 5, "Codigo: 4", 0, 1, 'R');
        $this->pdf->Cell(8, 5, "Ano: ", 0, 0, 'L');
        $this->pdf->Cell(92, 5, $this->ejercicio, 0, 0, 'L');
        $this->pdf->Cell(100, 5, "Codigo: 271-0", 0, 1, 'R');
        $this->pdf->Cell(
            200, 5, "UM: Miles de pesos con un decimal", 0, 1, 'R'
        );
    }

    private function createHeaderTable()
    {
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 10);
        //primera fila
        $this->pdf->Cell(20, 5, "", 'LRT', 0, 'L');
        $this->pdf->Cell(50, 5, "", 'LRT', 0, 'L');
        $this->pdf->Cell(20, 5, "", 'LRT', 0, 'L');
        $this->pdf->Cell(30, 5, "Ano " . ($this->ejercicio - 1), 1, 0, 'L');
        $this->pdf->Cell(30, 5, "Proyeccion" , 'LRT', 0, 'C');
        $this->pdf->Cell(50, 5, "Relaciones (%)" , 1, 1, 'C');
        //segunda fila
        $altura = self::CalcularAltura(30,15);
        $this->pdf->Cell(20, $altura, "Fila", 'LRB', 0, 'C');
        $this->pdf->Cell(50, $altura, "Conceptos", 'LRB', 0, 'C');
        $this->pdf->Cell(20, $altura, "Ano Anterior", 'LRB', 0, 'L', false, '', 2);
        $this->pdf->Cell(15, $altura,"Presupuesto Actualizado", 'LRB', 0, 'L', false, '', 2);
        $this->pdf->Cell(15, $altura,"Estimado Ejecucion" , 'LRB', 0, 'L', false, '', 2);
        $this->pdf->Cell(30, $altura, "Presupuesto ".$this->ejercicio , 'LRB', 0, 'C');
        $this->pdf->Cell(18, $altura, "Prop/Real Ano Anterior" , 'LRB', 0, 'C', false, '', 2);
        $this->pdf->Cell(16, $altura, "Prop/Plan" , 'LRB', 0, 'C', false, '', 2);
        $this->pdf->Cell(16, $altura, "Prop/Real Estimado" ,'LRB', 1, 'C', false, '', 2);
    }

    public function CalcularAltura($texto, $ancho) {
        $cantidad_lineas = strlen($texto);
        $aux = $cantidad_lineas / $ancho;
        if (is_float($aux)) {
            $aux1 = explode(".", $aux);
        }
        $aux2 = $aux1[0] + 1;
        $altura = 8 * $aux2;
        return $altura;
    }


}