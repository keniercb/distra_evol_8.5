<?php

class AnexoOrganigrama
{
    private $pdf;
    private $table;
    private $config;
    private $datosAnexoUno;
    private $proyecto;
    private $organigrama;

    public function __construct($pdf, $table, $config, $datos)
    {
        $this->pdf = $pdf;
        $this->table = $table;
        $this->config = $config; 
        $this->datosAnexoUno = $datos;
        $proyecto = $datos['proyecto'];
        $this->proyecto = $proyecto;
        $this->pageNum = $this->config['hoja'];
        $this->pageNum -= 1;
        $this->organigrama = $this->datosAnexoUno['organigrama'];
        $this->pdf->SetX(0);
        $this->pdf->SetY(0);
        $this->pdf->SetTopMargin(10);
    }

    public function createAnexo()
    {
        foreach ($this->organigrama as $organigrama) {
            $this->pdf->SetTopMargin(10);
            $this->pdf->SetLeftMargin(10);
            $this->pdf->SetRightMargin(12);
            $this->pdf->AddPage('L');
            $this->pageNum += 1;
            $this->createHeaderProyecto();
            $this->createHeaderAnexo();
            $orga = new OrganigramaGenerator($this->pdf, $this->config, $this->pageNum, $organigrama);
            $this->pageNum = $orga->createOrganigrama();
        }

        return $this->pageNum;
    }

    private function createHeaderAnexo()
    {
        $this->pdf->SetFont('Arial', 'B', 10);
        $this->pdf->Cell(0, 5, 'ANEXO 1', 0, 1, 'C');
        if ($this->config['idresolucion']) {
            $this->pdf->Ln(2);
            $this->pdf->SetFont('Arial', 'I', 13);
            $this->pdf->Cell(0, 5, utf8_decode($this->config['resolucion']), 0, 1, 'C');
        }
        $this->pdf->Ln(5);
    }

    private function createHeaderProyecto()
    {
        $dir = $_SERVER['DOCUMENT_ROOT'] . '/metadatos/comun/recursos/imagenes/borde.jpg';
        $this->pdf->Image($dir, 0, 0, 0, 30, 'jpg', '');
        $datos = $this->proyecto;
        if ($datos && $this->config['infoProyecto']) {
            $this->pdf->SetY(10);
            $this->pdf->SetFont('Arial', 'B', 10);
            $this->pdf->Cell(0, 5, 'PROYECTO', 0, 1, 'L');
            $this->pdf->SetFont('Arial', '', 8);
            $this->pdf->MultiCell(60, 5, utf8_decode(Util::fixTitle($datos)), 0, 1, 'L');
        }
    }
}