<?php
class PDFFichaimplicado extends fpdf
{
    function Footer()
    {
    }
}

class FichaimplicadoModel extends ZendExt_Model
{
    public function fichaimplicadoModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearFichaPDF($idaccidentepersona)
    {
        $pdf = new PDFFichaimplicado('L', 'mm', 'a4');
        $datos = DatAccidenteimplicadoModel::getDatosImplicado($idaccidentepersona);
        $pdfNGeneral = $this->crearFicha($pdf, 'Datos del implicado', $datos[0]);
        $pdfNGeneral->Output();
    }

    private function crearFicha(&$pdf, $titulo, $persona)
    {
        $pdf->SetLeftMargin(15);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 22);
        $pdf->Cell(265, 10, utf8_decode($titulo), 0, 0, 'L', 0);
        $pdf->Ln(10);
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(27, 10, utf8_decode('Nombre: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 18);
        $pdf->Cell(110, 10, utf8_decode($persona['nombreyapellidos']), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(57, 10, utf8_decode('Nivel educacional: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 18);
        $pdf->Cell(80, 10, utf8_decode($persona['niveleducacional']), 0, 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(22, 10, utf8_decode('Cargo:'), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 18);
        $pdf->Cell(115, 10, utf8_decode($persona['cargo']), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(53, 10, utf8_decode('Tipo de contrato: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 18);
        $pdf->Cell(84, 10, utf8_decode($persona['tipocontrato']), 0, 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(19, 10, utf8_decode('Sexo: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 18);
        $pdf->Cell(118, 10, utf8_decode($persona['sexo']), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(72, 10, utf8_decode('Categoría ocupacional: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 18);
        $pdf->Cell(65, 10, utf8_decode($persona['categoria']), 0, 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(19, 10, utf8_decode('Edad: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 18);
        $edad = ($persona['edad'])?$persona['edad'].' años': 'No conocida';
        $pdf->Cell(118, 10, utf8_decode($edad), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(75, 10, utf8_decode('Cantidad de accidentes: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 18);
        $pdf->Cell(62, 10, utf8_decode($persona['cantaccidentes']), 0, 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(55, 10, utf8_decode('Tiempo en cargo: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 18);
        $uni = ($persona['antiguedad']>1)?' años': ' año';
        $pdf->Cell(82, 10, ($persona['antiguedad']>0)?utf8_decode($persona['antiguedad'].$uni):'', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(76, 10, utf8_decode('Realizaba tarea habitual: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 18);
        $pdf->Cell(115, 10, ($persona['tareahabitual'] == 1)?'Si':'No', 0, 1, 'L', 0);
        $pdf->Ln();
        return $pdf;
    }
}