<?php
/**
 * Controlador para gestionar elementos salariales a las personas.
 *
 * @author Ing. Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses 
 * @copyright UCID
 * @version 1.0
 */
class PDFNomina extends fpdf
{
    public function CoordenadaXSegundaColumnaPiePagina()
    {
        $posinicial = $this->GetX();
        $this->Cell(0, 5, ' ', 0, 0, 'R');
        $posfinal = $this->GetX();
        return round($posfinal) - round($posinicial) - 10;
    }

    function Footer()
    {
        $fecha = date('d-m-Y');
        $hora = date('h:i:s A');
        $altoHoja = $this->GetY();
        $this->Ln(5);
        $this->SetFont('Arial', 'B', 8);
        $this->SetX(20);
        $this->Write(5, 'POR EL AREA CONTABLE:');

        $cordX = $this->CoordenadaXSegundaColumnaPiePagina();
        $this->SetX($cordX);
        $this->Write(5, 'FECHA IMPRESION: ');
        $this->SetFont('Arial', '', 8);
        $this->Write(5, $fecha);
        $this->SetFont('Arial', 'B', 8);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'ELABORADO POR:');
        $this->SetX($cordX);
        $this->Write(5, 'HORA IMPRESION: ');
        $this->SetFont('Arial', '', 8);
        $this->Write(5, $hora);
        $this->SetFont('Arial', 'B', 8);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'REVISADO Y APROBADO POR:');
        $this->SetFont('Arial', 'B', 8);
        $this->Ln(1);
        $this->Cell(0, 5, ' ' . $this->PageNo(), 0, 0, 'C');

    }
}

class ReporteExportarPDFPagoDestajoModel extends ZendExt_Model {

    public function ReporteExportarPDFPagoDestajoModel() {
        parent::ZendExt_Model();
    
	}

    public function construirReporte($identidad, $dfFInicio, $dfFFin, $idnomtipodestajo, $datos) 
    {
        $pdf = new PDFNomina('L', 'mm', 'A4');
        $pdf->SetTitle("Reporte datos pago destajo");
        $pdf->SetAuthor("Ing. Aroldo L. Hechavarría Hechavarría");
        $pdf->SetLeftMargin(2);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 16);//print_r($datos);die;

        $pdffinal = $this->cabeceraReportes($pdf, $identidad);
        $pdffinal = $this->cuerpoReporte($pdf, $datos, $identidad);

        $pdffinal->Output();
    
	}

    public function cabeceraReportes($pdf, $identidad)
    {
        $pdf->SetFillColor(200);

        //Titulo
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(280, 10, 'REPORTE LISTADO PERSONAS DESTAJO.', 0, 1, 'C', 0);

        //Logo de la entidad
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad);
        list($imagenBase64,) = explode(';', $arrEstruct[0]->logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($arrEstruct[0]->logo)) {
            $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }
        $pdf->Ln(5);

        //Nombre entidad
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(22, 10, 'Entidad: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(280, 10, utf8_decode($arrEstruct[0]->denominacion), 0, 1, 'L', 0);

        //Encabezado
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(7, 6,utf8_decode("No."), 1, 0, 'C', 0);
        $pdf->Cell(20, 6,utf8_decode("CI"), 1, 0, 'C', 0);
        $pdf->Cell(60, 6,utf8_decode("Nombre y apellidos"), 1, 0, 'C', 0);
        $pdf->Cell(20, 6,utf8_decode("G.E"), 1, 0, 'C', 0);
        $pdf->Cell(25, 6,utf8_decode("S.E"), 1, 0, 'C', 0);
        $pdf->Cell(25, 6,utf8_decode("TRT"), 1, 0, 'C', 0);
        $pdf->Cell(25, 6,utf8_decode("FT"), 1, 0, 'C', 0);
        $pdf->Cell(25, 6,utf8_decode("EVAL"), 1, 0, 'C', 0);
        $pdf->Cell(25, 6,utf8_decode("SALARIO X TRT"), 1, 0, 'C', 0);
        $pdf->Cell(25, 6,utf8_decode("SALARIO X EVAL"), 1, 0, 'C', 0);
        $pdf->Cell(30, 6,utf8_decode("SALARIO CREADO"), 1, 1, 'C', 0);

        return $pdf;
    }

    public function cuerpoReporte($pdf, $datos, $identidad){
        $no = 0;
        foreach ($datos as $key => $value) {

            $this->fnAdicionarPaginaexportar($pdf, $datos, $identidad);
            $pdf->SetFillColor(230);//Definiendo el color de celdas
            $pdf->SetFont('Arial', 'B', 8);
            $pdf->Ln(5);

            // Capturo x,y
            $xaux = $pdf->GetX();
            $yaux = $pdf->GetY();

            if ($key = 0 || $datos[$key]['denominacion'] != $datos[$key-1]['denominacion']) {
                $area = $value['denominacion']; 
                $pdf->Cell(287, 5, utf8_decode($area), 1, 0, 'C', 1);
                $pdf->Ln(5);          
            }             

            if ($datos[$key]['denominacion'] == $datos[$key]['denominacion']) {   
                $no ++;     
                // $pdf->SetX(20);
                $pdf->Cell(7, 6, utf8_decode($no), 1, 0, 'C', 0);
                $pdf->Cell(20, 6, utf8_decode($value['numid']), 1, 0, 'C', 0);
                $pdf->Cell(60, 6, utf8_decode($value['nombre'] . ' ' . $value['snombre'] . ' ' . $value['papel'] . ' ' . $value['sapel']), 1, 0, 'C', 0);
                $pdf->Cell(20, 6,utf8_decode($value['grupoescala']), 1, 0, 'C', 0);
                $pdf->Cell(25, 6,utf8_decode(number_format(floatval($value['importe']), 2)), 1, 0, 'R', 0);
                $pdf->Cell(25, 6,utf8_decode(number_format(floatval($value['trt']), 2)), 1, 0, 'R', 0);
                $pdf->Cell(25, 6,utf8_decode(number_format(floatval($value['ft']), 2)), 1, 0, 'R', 0);
                $pdf->Cell(25, 6,utf8_decode(number_format(floatval($value['evaluacion']), 2)), 1, 0, 'R', 0);
                $pdf->Cell(25, 6,utf8_decode(number_format(floatval($value['salariotrt']), 2)), 1, 0, 'R', 0);
                $pdf->Cell(25, 6,utf8_decode(number_format(floatval($value['salarioeval']), 2)), 1, 0, 'R', 0);
                $pdf->Cell(30, 6,utf8_decode(number_format(floatval($value['montocobrar']), 2)), 1, 1, 'R', 0);
                
            }

        }
        $this->fnAdicionarPaginaexportar($pdf, $datos, $identidad);

        return $pdf;
    }

    public function fnAdicionarPaginaexportar(&$pdf, $datos, $identidad)
    {
        //Cambio de hoja
        $y = $pdf->GetY();
        if ($y >= '180') {
            $pdf->AddPage();
            $this->cabeceraReportes($pdf, $identidad);
        }
    }

    public function construirReporteExcel($identidad, $dfFInicio, $dfFFin, $idnomtipodestajo, $datos, $plantillas)
    {
        //Pintando el Excel 
        $objPHPExcel = new PHPExcel();
        $row = 1;
        $objPHPExcel->getActiveSheet()->getStyle('A') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('B') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('C') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('D') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('E') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('F') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('G') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(14);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(40);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(15);

        //Encabezado
        $this->fnPintarCelda($objPHPExcel, 'A', $row, 'CI', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'B', $row, 'Nombre y Apellidos', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'C', $row, 'G.E', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'D', $row, 'S.E', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'E', $row, 'TRT', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'F', $row, 'FT', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'G', $row, 'EVAL', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'H', $row, 'Salario x TRT', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'I', $row, 'Salario x EVAL', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'J', $row, 'Salario creado', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        foreach ($plantillas as $pn){
            $row++;
            $objPHPExcel->getActiveSheet()->mergeCells('A'.$row.':J'.$row);
            $this->fnPintarCelda($objPHPExcel,'A',$row, " ".$pn, 'l,t,r,b', '000000', 'Arial', 10, '006600', 'center', 'center', 0, 1);
            foreach ($datos as $i=> $ps){
                if($pn == $ps['denominacion']){
                    $row++;
                    $this->fnPintarCelda($objPHPExcel, 'A', $row, " ".$ps['numid'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $this->fnPintarCelda($objPHPExcel, 'B', $row, $ps['nombre']." ".$ps['snombre']." ".$ps['papel']." ".$ps['sapel'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'left', 'center', 0, 1);
                    $this->fnPintarCelda($objPHPExcel, 'C', $row, $ps['grupoescala'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $this->fnPintarCelda($objPHPExcel, 'D', $row, $ps['importe'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $this->fnPintarCelda($objPHPExcel, 'E', $row, $ps['trt'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $this->fnPintarCelda($objPHPExcel, 'F', $row, $ps['ft'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $this->fnPintarCelda($objPHPExcel, 'G', $row, $ps['evaluacion'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $this->fnPintarCelda($objPHPExcel, 'H', $row, $ps['salariotrt'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $this->fnPintarCelda($objPHPExcel, 'I', $row, $ps['salarioeval'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $this->fnPintarCelda($objPHPExcel, 'J', $row, $ps['montocobrar'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                }
                
            }
    
        }

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="LISTADO PERSONAS DESTAJO.xls" ');
        header('Cache-Control: max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        return 1;
    }

    public function construirReporteConeniosExcel($identidad, $dfFInicio, $dfFFin, $idnomtipodestajo, $datos, $plantillas)
    {
        $objPHPExcel = new PHPExcel();
        $row = 1;
        $cont = 0;
        $objPHPExcel->getActiveSheet()->getStyle('A') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('B') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('C') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('D') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('E') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('f') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(8);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(25);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(40);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(12);

        //Encabezado
        $this->fnPintarCelda($objPHPExcel, 'A', $row, 'No.', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'B', $row, 'Denominación', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'C', $row, 'Obra', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'D', $row, 'Importe', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'E', $row, 'Fecha Inicio', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'F', $row, 'Fecha Fin', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        foreach ($plantillas as $pn){
            $row++;
            $objPHPExcel->getActiveSheet()->mergeCells('A'.$row.':E'.$row);
            $this->fnPintarCelda($objPHPExcel,'A',$row, " ".$pn, 'l,t,r,b', '000000', 'Arial', 10, '006600', 'center', 'center', 0, 1);
            foreach ($datos as $i=> $ps){
                if($pn == $ps['brigada']){
                    $row++;
                    $cont++;
                    $fechafin = $ps['fechafin'] ? $ps['fechafin'] : '-';
                    $this->fnPintarCelda($objPHPExcel, 'A', $row, $cont, 'l,t,r,b', '000000', 'Arial', 10, 'FF0000', 'center', 'center', 0, 1);
                    $this->fnPintarCelda($objPHPExcel, 'B', $row, $ps['denominacion'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $this->fnPintarCelda($objPHPExcel, 'C', $row, $ps['obra']." ".$ps['snombre']." ".$ps['papel']." ".$ps['sapel'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'left', 'center', 0, 1);
                    $this->fnPintarCelda($objPHPExcel, 'D', $row, $ps['importe'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $this->fnPintarCelda($objPHPExcel, 'E', $row, $ps['fechainicio'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $this->fnPintarCelda($objPHPExcel, 'F', $row, $ps['fechafin'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $row++;
                    $objPHPExcel->getActiveSheet()->mergeCells('B' . $row . ':E' . $row);
                    $this->fnPintarCelda($objPHPExcel, 'B', $row, 'Descripción:' . $ps['descripcion'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'left', 'center', 0, 1);
                    $this->fnPintarBordes($objPHPExcel, 'C' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, 'D' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, 'E' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, 'F' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                    $row++;
                }
                
            }
    
        }

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="LISTADO DE CONVENIOSPOR OBRA.xls" ');
        header('Cache-Control: max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        return 1;
    }

    public function fnPintarCelda(&$objPHPExcel, $column, $row, $val, $border = null, $bordercolor = null, $font = null, $fontsize = null, $fontcolor = null, $alignhor = null, $alignver = null, $rotate = null, $bold = null)
    {
        //Ejemplo
        //$this->fnPintarCelda($objPHPExcel, 'A', 3, 'Entidad prueba', 't,r,b,l', '700000', 'Arial', 10, '700000', 'center', 'center', 90, 0);

        //Pintando el valor de la celda
        $objPHPExcel->getActiveSheet()->setCellValue($column . $row, $val);

        //Pintando los bordes a la celda
        if (!empty($border)) {
            $arrbordes = explode(',', $border);
            foreach ($arrbordes as &$bord) {
                $bord = mb_strtolower($bord);
                switch ($bord) {
                    case 't':
                        $realborder = 'top';
                        break;
                    case 'top':
                        $realborder = 'top';
                        break;
                    case 'r':
                        $realborder = 'right';
                        break;
                    case 'right':
                        $realborder = 'right';
                        break;
                    case 'b':
                        $realborder = 'bottom';
                        break;
                    case 'bottom':
                        $realborder = 'bottom';
                        break;
                    case 'l':
                        $realborder = 'left';
                        break;
                    case 'left':
                        $realborder = 'left';
                        break;
                    default:
                        $realborder = null;
                        break;
                }

                $objPHPExcel->getActiveSheet()->getStyle($column . $row)->getBorders()->applyFromArray(
                    array(
                        $realborder => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                            )
                        )
                    )
                );
            }
        }

        //Dandole fuente a la celda
        $objPHPExcel->getActiveSheet()->getStyle($column . $row)->getFont()->applyFromArray(
            array(
                'name' => $font,
                'bold' => ($bold == 1) ? TRUE : FALSE,
                'italic' => FALSE,
                'strike' => FALSE,
                'size' => $fontsize,
                'color' => array(
                    'rgb' => (!empty($fontcolor)) ? $fontcolor : '000000'
                )
            )
        );

        //Centrando el texto de la celda
        $objPHPExcel->getActiveSheet()->getStyle($column . $row)->getAlignment()->applyFromArray(
            array(
                'horizontal' => $alignhor,
                'vertical' => $alignver,
                'rotation' => $rotate, //0 ó 90
                'wrap' => TRUE
            )
        );

    }

    public function construirReporteConenios($identidad, $dfFInicio, $dfFFin, $idnomtipodestajo, $datos) 
    {
        $pdf = new PDFNomina('L', 'mm', 'A4');
        $pdf->SetTitle("Reporte datos convenios destajo");
        $pdf->SetAuthor("Ing. Aroldo L. Hechavarría Hechavarría");
        $pdf->SetLeftMargin(2);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 16);

        $pdffinal = $this->cabeceraReportesConenios($pdf, $identidad);
        $pdffinal = $this->cuerpoReporteConenios($pdf, $datos, $identidad);

        $pdffinal->Output();
    
	}

    public function cabeceraReportesConenios($pdf, $identidad)
    {
        $pdf->SetFillColor(200);

        //Titulo
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(280, 10, 'REPORTE LISTADO CONVENIOS DESTAJO.', 0, 1, 'C', 0);

        //Logo de la entidad
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad);
        list($imagenBase64,) = explode(';', $arrEstruct[0]->logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($arrEstruct[0]->logo)) {
            $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }
        $pdf->Ln(5);

        //Nombre entidad
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(22, 10, 'Entidad: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(280, 10, utf8_decode($arrEstruct[0]->denominacion), 0, 1, 'L', 0);

        //Encabezado
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(10, 8,utf8_decode("No."), 1, 0, 'C', 0);
        $pdf->Cell(35, 8,utf8_decode("Denominacion"), 1, 0, 'C', 0);
        $pdf->Cell(150, 8,utf8_decode("Obra"), 1, 0, 'C', 0);
        $pdf->Cell(30, 8,utf8_decode("Importe"), 1, 0, 'C', 0);
        $pdf->Cell(25, 8,utf8_decode("Fecha Inicio"), 1, 0, 'C', 0);
        $pdf->Cell(25, 8,utf8_decode("Fecha Fin"), 1, 1, 'C', 0);
        // $pdf->Cell(65, 8,utf8_decode("Descripción"), 1, 1, 'C', 0);

        return $pdf;
    }

    public function cuerpoReporteConenios($pdf, $datos, $identidad){
        $no = 0;
        foreach ($datos as $key => $value) {//print_r($value);die;

            $this->fnAdicionarPaginaexportarCon($pdf, $datos, $identidad);
            $pdf->SetFillColor(230);//Definiendo el color de celdas
            $pdf->SetFont('Arial', 'B', 8);
            // $pdf->Ln(5);

            // Capturo x,y
            $xaux = $pdf->GetX();
            $yaux = $pdf->GetY();

            if ($key = 0 || $datos[$key]['brigada'] != $datos[$key-1]['brigada']) {
                $area = $value['brigada']; 
                $pdf->Cell(275, 5, utf8_decode($area), 1, 0, 'C', 1);
                $pdf->Ln(5);          
            }   
            
            $descripcion = $value['descripcion'] ? $value['descripcion'] : 'Sin descripción';

            if ($datos[$key]['brigada'] == $datos[$key]['brigada']) {   
                $no ++;     
                // $pdf->SetX(20);
                $pdf->Cell(10, 6, utf8_decode($no), 1, 0, 'C', 0);
                $pdf->Cell(35, 6, utf8_decode($value['denominacion']), 1, 0, 'C', 0);
                $pdf->Cell(150, 6,utf8_decode($value['obra']), 1, 0, 'L', 0);
                $pdf->Cell(30, 6,utf8_decode(number_format(floatval($value['importe']), 2)), 1, 0, 'R', 0);
                $pdf->Cell(25, 6, utf8_decode($value['fechainicio']), 1, 0, 'C', 0);
                $pdf->Cell(25, 6, utf8_decode($value['fechafin']), 1, 1, 'C', 0);
                $pdf->SetX(12);
                $pdf->Cell(265, 6, utf8_decode("Descripción: " . $value['descripcion']), 1, 1, 'L', 0);
                $pdf->Ln(6); 
                
            }

        }
        $this->fnAdicionarPaginaexportarCon($pdf, $datos, $identidad);

        return $pdf;
    }

    public function fnAdicionarPaginaexportarCon(&$pdf, $datos, $identidad)
    {
        //Cambio de hoja
        $y = $pdf->GetY();
        if ($y >= '180') {
            $pdf->AddPage();
            $this->cabeceraReportes($pdf, $identidad);
        }
    }

    public function fnPintarBordes(&$objPHPExcel, $celda, $lado, $tipoborde)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getBorders()->applyFromArray(
            array(
                $lado => array(
                    'style' => $tipoborde,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
    }


}
 

