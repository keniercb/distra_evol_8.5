<?php

class ReporteModel extends ZendExt_Model
{
    private $pdf;
    private $title;
    private $columns;
    private $data;

    public function ReporteModel($title, $colums, $data)
    {

        parent::ZendExt_Model();
        $this->title = $title;
        $this->columns = $colums;
        $this->data = $data;

        // Create new PDF document
        $this->pdf = new TCPDF('L', PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('XETID');
        $this->pdf->SetTitle('Reporte');
        $this->pdf->SetSubject('Reporte generado');
        $this->pdf->SetKeywords('Reporte');

        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(true);

        // set default monospaced font
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $this->pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);

        // set auto page breaks
        $this->pdf->SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);

        // set image scale factor
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
    }

    public function export($dest = 'I')
    {
        $this->pdf->AddPage();

        $this->createHeader();

        $this->createBody();

        // Close and output PDF document
        ob_clean();
        $this->pdf->Output("Reporte", $dest);
        return true;
    }

    public function createHeader()
    {
        $this->pdf->SetFont('helvetica', 'B', 13);

        $this->pdf->Cell('', '', $this->title, 0, true, 'C', 0, '', 0, false);
    }

    public function createBody()
    {
        $this->pdf->ln(10);
        $tableHeader = '';

        foreach($this->columns as $columnHeader) {
            $tableHeader .= '<th bgcolor="#e3e1e6"><b>'.$columnHeader->text.'</b></th>';
        }

        $rows = '';
        foreach($this->data as $data) {
            $rows .= '<tr>';

            foreach($this->columns as $columnHeader) {
                if(array_key_exists($columnHeader->alias, $data)) {
                    $rows .= '<td>'.$data[$columnHeader->alias].'</td>';
                }else{
                    $rows .= '<td>'.' '.'</td>';
                }
            }
            $rows .= '</tr>';
        }
//        print_r($rows);die;
        $this->pdf->SetFont('helvetica', 'R', 9);
        $html = '<table border="1" cellspacing="0" cellpadding="2"><tr>'.$tableHeader.'</tr>'.$rows.'</table>';

        $this->pdf->writeHTML($html, true, false, true, false, '');
    }
}