<?php

class PDFCategoria extends fpdf
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


class ReportepdfiCategoriaModel extends ZendExt_Model
{
    public function AtendiendoCategoriapdf()
    {
        parent::ZendExt_Model();

    }

    public function CrearReportePDF($idestructura, $categoria, $annoini, $annofin)
    {

        $pdf = new PDFCategoria('L', 'mm', 'letter');
        $pdf->AddPage();
        $modeloNegocio = new DatAnalisisModel();
        $datos = $modeloNegocio->getDatoscategoriaReporte($idestructura, $categoria, $annoini, $annofin);

        $rdenomincategoria = $modeloNegocio->getCategoriasActivas($categoria);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos, $annoini, $annofin, $rdenomincategoria);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos, $annoini, $annofin, $rdenomincategoria)
    {
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetX(68);
        $pdf->Cell(143, 8, utf8_decode('DESGLOSE DE LOS ACCIDETES DE TRABAJO ATENDIENDO A LA CATEGORÍA DEL PERSONAL LESIONADO'), 0, 1, 'C');
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->SetX(5);
        $pdf->Cell(50, 16, utf8_decode('CATEGORÍA  DEL PERSONAL'), 1, 0, 'C');
        $pdf->Cell(220, 8, utf8_decode('AÑO'), 1, 1, 'C');


        $rannos = array();
        $result = array();
        $init = $annoini;
        $longannos = (220 / ($annofin - $annoini + 1));
        $pdf->SetX(55);
        while ($init <= $annofin) {
            $rannos[$init] = $init;
            $pdf->Cell($longannos, 8, utf8_decode($init), 1, 0, 'C');
            foreach ($datos as $dat) {
                if ($init == $dat['anno']) {
                    $result[$dat['anno']][$dat['denominacion']] += $dat['cantidad'];
                }
            }
            $init++;
        }
        $pdf->Ln();
        $pdf->SetFont('Arial', '', 9);
        foreach ($rdenomincategoria as $categoria) {
            $concat = ($pdf->GetStringWidth($categoria['denominacion']) > 70) ? '...' : '';
            $pdf->SetX(5);
            $pdf->Cell(50, 8, utf8_decode(substr($categoria['denominacion'], 0, 44)) . $concat, 1, 0, 'L');
            foreach ($rannos as $anno) {
                $pdf->Cell($longannos, 8, ($result[$anno][$categoria['denominacion']] ? utf8_decode($result[$anno][$categoria['denominacion']]) : 0), 1, 0, 'C');
            }
            $pdf->Cell(0.1, 8, '', 0, 1);
        }
        return $pdf;
    }
}
