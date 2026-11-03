<?php

include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');

/**
 * Reporte comprobante x centros de costo excel.
 *
 * @author 1er Tte. Ing. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Model.
 * @category Clase controladora.
 * @uses
 * @copyright XETID
 * @version 1.0
 */
class PDFNomina extends fpdf
{

    function Footer()
    {

    }
}

class ReporteExportarComprobantesCentroCostoModel extends ZendExt_Model
{
    private $longitudhoja = 210;
    private $identidad = -1;
    private $objdatosperiodo = array();
    private $borderceldas = 1;
    private $fontsizeletra = 8;

    public function ReporteExportarComprobantesCentroCostoModel()
    {
        parent::ZendExt_Model();

    }

    //Por centros de costos
    public function exportarReporte($arrdatcentroscosto)
    {

        $objPHPExcel = new PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Comprobante Centros Costo');

        //Tamaños
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(60);
        //Concatenando la 1ra fila para escribir "Comprobante de salario"
        $objPHPExcel->getActiveSheet()->mergeCells('A1:G1');
        $objPHPExcel->getActiveSheet()->setCellValue('A1', 'Comprobante Centros Costo');
        //Dandole formato 'center' a Comprobante de salario
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getAlignment()->applyFromArray(
            array(
                'bold' => TRUE,
                'horizontal' => 'center',
                'vertical' => 'center',
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Dandole formato 'bold' al titulo Comprobante de salario
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getFont()->applyFromArray(
            array(
                'name' => 'Arial',
                'bold' => TRUE,
                'italic' => FALSE,
                'strike' => FALSE,
                'size' => 13,
                'color' => array(
                    'rgb' => '000000'
                )
            )
        );
        //Pintando 'Hoja 1' en F2
        $objPHPExcel->getActiveSheet()->setCellValue('F2', 'Hoja:   1');
        //Pintando el periodo
        $objPHPExcel->getActiveSheet()->setCellValue('C3', 'Período:');
        $objPHPExcel->getActiveSheet()->setCellValue('D3', '');
        //Pintando 'Cuenta', 'Titulo 'Debe', 'Haber'
        $objPHPExcel->getActiveSheet()->setCellValue('A5', 'Cuenta');
        $objPHPExcel->getActiveSheet()->setCellValue('B5', 'Título');
        $objPHPExcel->getActiveSheet()->setCellValue('E5', 'Debe');
        $objPHPExcel->getActiveSheet()->setCellValue('G5', 'Haber');
        //Dandole formato 'center' a la fila 5
        $objPHPExcel->getActiveSheet()->getStyle('A5:G5')->getAlignment()->applyFromArray(
            array(
                'bold' => TRUE,
                'horizontal' => 'center',
                'vertical' => 'center',
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Dandole border 'buttoms' a la fila 5
        $objPHPExcel->getActiveSheet()->getStyle('A5:B5')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E5')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('G5')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        //Dandole border 'top' a la fila 5
        $objPHPExcel->getActiveSheet()->getStyle('A5:B5')->getBorders()->applyFromArray(
            array(
                'top' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E5')->getBorders()->applyFromArray(
            array(
                'top' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('G5')->getBorders()->applyFromArray(
            array(
                'top' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        //Dandole border 'right' a la fila 5
        $objPHPExcel->getActiveSheet()->getStyle('A5')->getBorders()->applyFromArray(
            array(
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('B5')->getBorders()->applyFromArray(
            array(
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E5')->getBorders()->applyFromArray(
            array(
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('G5')->getBorders()->applyFromArray(
            array(
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        //Dandole border 'left' a la fila 5
        $objPHPExcel->getActiveSheet()->getStyle('E5')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('G5')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        //Recorriendo los datos del comprobante por centros de costo
        $fila = 6;
        $totalgeneraldebito = 0;
        $totalgeneralcredito = 0;
        foreach ($arrdatcentroscosto as $rcc) {
            //Concatenando la fila para escribir el cento de costo
            $objPHPExcel->getActiveSheet()->mergeCells('A' . $fila . ':G' . $fila);
            $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, 'Centro Costo: ' . $rcc['codigocentrogrupo'] . '-' . $rcc['descripcioncentrogrupo']);
            //Dandole formato 'bold' al Centro Costo
            $objPHPExcel->getActiveSheet()->getStyle('A' . $fila)->getFont()->applyFromArray(
                array(
                    'name' => 'Arial',
                    'bold' => TRUE,
                    'italic' => FALSE,
                    'strike' => FALSE,

                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            );
            $fila++;
            //Si tiene cuentas
            if (count($rcc['comprobante']) > 0) {
                $totaldebito = 0;
                $totalcredito = 0;
                foreach ($rcc['comprobante'] as $cuenta) {
                    $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, $cuenta['cuenta']);
                    $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $cuenta['denomcuenta']);
                    $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, ($cuenta['debitocredito'] == 0) ? number_format($cuenta['importe'], 2, '.', '') : 0.00);
                    if ($cuenta['debitocredito'] == 0) {
                        $totalgeneraldebito += $cuenta['importe'];
                        $totaldebito = number_format($totaldebito, 2, '.', '') + number_format($cuenta['importe'], 2, '.', '');
                    }
                    $objPHPExcel->getActiveSheet()->getStyle('E' . $fila)->getNumberFormat()->applyFromArray(
                        array(
                            'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
                        )
                    );
                    $objPHPExcel->getActiveSheet()->setCellValue('G' . $fila, ($cuenta['debitocredito'] == 1) ? number_format($cuenta['importe'], 2, '.', '') : 0.00);
                    if ($cuenta['debitocredito'] == 1) {
                        $totalgeneralcredito += $cuenta['importe'];
                        $totalcredito = number_format($totalcredito, 2, '.', '') + number_format($cuenta['importe'], 2, '.', '');
                    }
                    $objPHPExcel->getActiveSheet()->getStyle('G' . $fila)->getNumberFormat()->applyFromArray(
                        array(
                            'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
                        )
                    );
                    $fila++;
                }
                //Subtotales por centros de Costo
                $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, 'Subtotales:');
                $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, $totaldebito);
                $objPHPExcel->getActiveSheet()->setCellValue('G' . $fila, $totalcredito);
                $objPHPExcel->getActiveSheet()->getStyle('A' . $fila . ':G' . $fila)->getFont()->applyFromArray(
                    array(
                        'name' => 'Arial',
                        'bold' => TRUE,
                        'italic' => FALSE,
                        'strike' => FALSE,

                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                );
                //$objPHPExcel->getActiveSheet()->setCellValue('E'.$fila, '=SUM('. 'E' . $filaicialsum . ':E' . $fila . ')');
                $fila++;
            }

        }
        $objPHPExcel->getActiveSheet()->getStyle('E' . $fila)->getNumberFormat()->applyFromArray(
            array(
                'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
            )
        );$objPHPExcel->getActiveSheet()->getStyle('G' . $fila)->getNumberFormat()->applyFromArray(
        array(
            'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
        )
    );
        //Total general
        $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, 'Total General:');
        $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, $totalgeneraldebito);
        $objPHPExcel->getActiveSheet()->setCellValue('G' . $fila, $totalgeneralcredito);
        $objPHPExcel->getActiveSheet()->getStyle('A' . $fila . ':G' . $fila)->getFont()->applyFromArray(
            array(
                'name' => 'Arial',
                'bold' => TRUE,
                'italic' => FALSE,
                'strike' => FALSE,

                'color' => array(
                    'rgb' => '000000'
                )
            )
        );
        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        //header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Comprobante Centros Costo.xls" ');
        header('Cache-Control: max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objWriter->disconnectWorksheets();
        unset($objPHPExcel);
        echo json_encode('OK');
    }

    public function exportarReportePDF($arrdatcentroscosto, $identidad, $idelaborarpagos)
    {
        $objdatosperiodo['datosentidad'] = HisRetencionesPersona::obtenerDatosEntidadDadoId($identidad);
        $periodo = DatElaborarPagos::obtenerFechaInicioPeriodoPago($idelaborarpagos);
        list($dia, $mes, $anno) = explode('/', $periodo);
        $objdatosperiodo['periodo'] = $mes;
        $this->identidad = $identidad;
        $this->objdatosperiodo = $objdatosperiodo;

        //PDF
        $pdf = new PDFNomina('p', 'mm', 'Letter');//279mm x 216mm
        $pdf->AddPage();
        $this->fnPintarEncabezado($pdf, "Comprobante Centros Costo");
        //Recorriendo los datos del comprobante por centros de costo
        $totalgeneraldebito = 0;
        $totalgeneralcredito = 0;
        foreach ($arrdatcentroscosto as $rcc) {
            $pdf->SetX(15);
            $pdf->SetFillColor(220);//Definiendo el color de celdas
            $pdf->Cell($this->longitudhoja - 25, 5, utf8_decode('Centro Costo: ' . $rcc['codigocentrogrupo'] . '-' . $rcc['descripcioncentrogrupo']), 1, 1, 'L', 1);
            $this->fnNuevaPagina($pdf);
            //Si tiene cuentas
            $totaldebito = 0;
            $totalcredito = 0;
            if (count($rcc['comprobante']) > 0) {
                foreach ($rcc['comprobante'] as $rcomp) {
                    $pdf->SetFont('Arial', '', 10);
                    $pdf->SetX(15);
                    $pdf->Cell($this->longitudhoja / 4, 5, $rcomp['cuenta'], 0, 0, 'L', 0);
                    $pdf->Cell($this->longitudhoja / 2 - 25, 5, utf8_decode(substr($rcomp['denomcuenta'], 0, 48)), 0, 0, 'L', 0);
                    $pdf->Cell($this->longitudhoja / 8, 5, (($rcomp['debitocredito'] == 0) ? number_format($rcomp['importe'], 2, '.', '') : number_format(0, 2, '.', '')), 0, 0, 'R', 0);
                    $totaldebito += ($rcomp['debitocredito'] == 0) ? $rcomp['importe'] : 0;
                    $pdf->Cell($this->longitudhoja / 8, 5, (($rcomp['debitocredito'] == 1) ? number_format($rcomp['importe'], 2, '.', '') : number_format(0, 2, '.', '')), 0, 1, 'R', 0);
                    $totalcredito += ($rcomp['debitocredito'] == 1) ? $rcomp['importe'] : 0;
                    $this->fnNuevaPagina($pdf);
                }
                $pdf->SetFont('Arial', 'B', 10);
                $pdf->SetX(15);
                $pdf->SetFillColor(245);//Definiendo el color de celdas
                $pdf->Cell($this->longitudhoja / 4 + $this->longitudhoja / 2 - 25, 5, 'Subtotales:', 0, 0, 'C', 0);
                $pdf->Cell($this->longitudhoja / 8, 5, number_format($totaldebito, 2, '.', ''), 1, 0, 'R', 1);
                $pdf->Cell($this->longitudhoja / 8, 5, number_format($totalcredito, 2, '.', ''), 1, 1, 'R', 1);
                $this->fnNuevaPagina($pdf);
                $pdf->Cell(1, 3, '', 0, 1);
            }
            $totalgeneraldebito += $totaldebito;
            $totalgeneralcredito += $totalcredito;
        }

        $pdf->SetFont('Arial', 'B', 10);
        $pdf->SetX(15);
        $pdf->SetFillColor(245);//Definiendo el color de celdas
        $pdf->Cell($this->longitudhoja / 4 + $this->longitudhoja / 2 - 25, 5, 'Total:', 0, 0, 'C', 0);
        $pdf->Cell($this->longitudhoja / 8, 5, number_format($totalgeneraldebito, 2, '.', ''), 1, 0, 'R', 1);
        $pdf->Cell($this->longitudhoja / 8, 5, number_format($totalgeneralcredito, 2, '.', ''), 1, 1, 'R', 1);
        $pdf->Output();
    }

    //Descuadres
    public function exportarReporteComprobacion($arrdescuadresasociaciones)
    {
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Comprobante de comprobación');

        //Tamaños
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(60);
        //Concatenando la 1ra fila para escribir "Comprobante de comprobación"
        $objPHPExcel->getActiveSheet()->mergeCells('A1:G1');
        $objPHPExcel->getActiveSheet()->setCellValue('A1', 'Comprobante de comprobación');
        //Dandole formato 'center' a Comprobante de comprobación
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getAlignment()->applyFromArray(
            array(
                'bold' => TRUE,
                'horizontal' => 'center',
                'vertical' => 'center',
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Dandole formato 'bold' al titulo Comprobante de comprobación
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getFont()->applyFromArray(
            array(
                'name' => 'Arial',
                'bold' => TRUE,
                'italic' => FALSE,
                'strike' => FALSE,
                'size' => 13,
                'color' => array(
                    'rgb' => '000000'
                )
            )
        );
        //Pintando 'Hoja 1' en F2
        $objPHPExcel->getActiveSheet()->setCellValue('F2', 'Hoja:   1');
        /* //Pintando el periodo
         $objPHPExcel->getActiveSheet()->setCellValue('C3', 'Período:');
         $objPHPExcel->getActiveSheet()->setCellValue('D3', '');*/
        //Pintando 'Cuenta', 'Titulo 'Debe', 'Haber'
        //Dandole formato 'bold' al Centro Costo
        $objPHPExcel->getActiveSheet()->getStyle('A5')->getFont()->applyFromArray(
            array(
                'name' => 'Arial',
                'bold' => TRUE,
                'italic' => FALSE,
                'strike' => FALSE,

                'color' => array(
                    'rgb' => '000000'
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('B5')->getFont()->applyFromArray(
            array(
                'name' => 'Arial',
                'bold' => TRUE,
                'italic' => FALSE,
                'strike' => FALSE,

                'color' => array(
                    'rgb' => '000000'
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E5')->getFont()->applyFromArray(
            array(
                'name' => 'Arial',
                'bold' => TRUE,
                'italic' => FALSE,
                'strike' => FALSE,

                'color' => array(
                    'rgb' => '000000'
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('G5')->getFont()->applyFromArray(
            array(
                'name' => 'Arial',
                'bold' => TRUE,
                'italic' => FALSE,
                'strike' => FALSE,

                'color' => array(
                    'rgb' => '000000'
                )
            )
        );
        $objPHPExcel->getActiveSheet()->setCellValue('A5', 'Cuenta');
        $objPHPExcel->getActiveSheet()->setCellValue('B5', 'Título');
        $objPHPExcel->getActiveSheet()->setCellValue('E5', 'Debe');
        $objPHPExcel->getActiveSheet()->setCellValue('G5', 'Haber');
        //Dandole formato 'center' a la fila 5
        $objPHPExcel->getActiveSheet()->getStyle('A5:G5')->getAlignment()->applyFromArray(
            array(
                'bold' => TRUE,
                'horizontal' => 'center',
                'vertical' => 'center',
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Dandole border 'buttoms' a la fila 5
        $objPHPExcel->getActiveSheet()->getStyle('A5:B5')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E5')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('G5')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        //Dandole border 'top' a la fila 5
        $objPHPExcel->getActiveSheet()->getStyle('A5:B5')->getBorders()->applyFromArray(
            array(
                'top' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E5')->getBorders()->applyFromArray(
            array(
                'top' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('G5')->getBorders()->applyFromArray(
            array(
                'top' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        //Dandole border 'right' a la fila 5
        $objPHPExcel->getActiveSheet()->getStyle('A5')->getBorders()->applyFromArray(
            array(
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('B5')->getBorders()->applyFromArray(
            array(
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E5')->getBorders()->applyFromArray(
            array(
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('G5')->getBorders()->applyFromArray(
            array(
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        //Dandole border 'left' a la fila 5
        $objPHPExcel->getActiveSheet()->getStyle('E5')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('G5')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        //Recorriendo los datos del comprobante por centros de costo
        $fila = 6;
        $totalgeneraldebito = 0;
        $totalgeneralcredito = 0;
        foreach ($arrdescuadresasociaciones as $asociacion) {
            $objPHPExcel->getActiveSheet()->mergeCells('A' . $fila . ':G' . $fila);
            $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, 'Asociación: ' . $asociacion['asociacion']);
            //Dandole formato 'bold' al Centro Costo
            $objPHPExcel->getActiveSheet()->getStyle('A' . $fila)->getFont()->applyFromArray(
                array(
                    'name' => 'Arial',
                    'bold' => TRUE,
                    'italic' => FALSE,
                    'strike' => FALSE,

                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            );
            $fila++;
            //Si tiene cuentas
            if (!empty($asociacion)) {
                $totaldebito = 0;
                $totalcredito = 0;
                //cuentas deudoras
                foreach ($asociacion['cdeudoras'] as $cuenta) {
                    $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, $cuenta['cuenta']);
                    $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $cuenta['denomcuenta']);
                    $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, number_format($cuenta['importe'], 2, '.', ''));
                    $objPHPExcel->getActiveSheet()->getStyle('E' . $fila)->getNumberFormat()->applyFromArray(
                        array(
                            'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
                        )
                    );
                    $totaldebito += $cuenta['importe'];
                    $fila++;
                }
                //cuentas acreedoras
                foreach ($asociacion['cacreedoras'] as $cuenta) {
                    $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, $cuenta['cuenta']);
                    $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $cuenta['denomcuenta']);
                    $objPHPExcel->getActiveSheet()->setCellValue('G' . $fila, number_format($cuenta['importe'], 2, '.', ''));
                    $objPHPExcel->getActiveSheet()->getStyle('G' . $fila)->getNumberFormat()->applyFromArray(
                        array(
                            'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
                        )
                    );
                    $totalcredito += $cuenta['importe'];
                    $fila++;
                }
                $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, 'Subtotales:');
                $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, number_format($totaldebito, 2, '.', ''));
                $objPHPExcel->getActiveSheet()->setCellValue('G' . $fila, number_format($totalcredito, 2, '.', ''));
                $objPHPExcel->getActiveSheet()->getStyle('A' . $fila . ':G' . $fila)->getFont()->applyFromArray(
                    array(
                        'name' => 'Arial',
                        'bold' => TRUE,
                        'italic' => FALSE,
                        'strike' => FALSE,

                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('E' . $fila)->getNumberFormat()->applyFromArray(
                    array(
                        'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('G' . $fila)->getNumberFormat()->applyFromArray(
                    array(
                        'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
                    )
                );

                //Cambiando el color de subtotales
                $fontcolor = ($totaldebito != $totalcredito) ? '990000' : '009900';
                $objPHPExcel->getActiveSheet()->getStyle('E' . $fila)->getFont()->applyFromArray(
                    array(
                        'color' => array(
                            'rgb' => $fontcolor
                        )
                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('G' . $fila)->getFont()->applyFromArray(
                    array(
                        'color' => array(
                            'rgb' => $fontcolor
                        )
                    )
                );

                $fila++;
            }
            $totalgeneraldebito += $totaldebito;
            $totalgeneralcredito += $totalcredito;
        }

        $fila++;
        $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, 'Total:');
        $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, number_format($totalgeneraldebito, 2, '.', ''));
        $objPHPExcel->getActiveSheet()->setCellValue('G' . $fila, number_format($totalgeneralcredito, 2, '.', ''));
        $objPHPExcel->getActiveSheet()->getStyle('A' . $fila . ':G' . $fila)->getFont()->applyFromArray(
            array(
                'name' => 'Arial',
                'bold' => TRUE,
                'italic' => FALSE,
                'strike' => FALSE,

                'color' => array(
                    'rgb' => '000000'
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E' . $fila)->getNumberFormat()->applyFromArray(
            array(
                'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('G' . $fila)->getNumberFormat()->applyFromArray(
            array(
                'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
            )
        );

        //Cambiando el color de los totales
        $fontcolor = ($totalgeneraldebito != $totalgeneralcredito) ? '990000' : '009900';
        $objPHPExcel->getActiveSheet()->getStyle('E' . $fila)->getFont()->applyFromArray(
            array(
                'color' => array(
                    'rgb' => $fontcolor
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('G' . $fila)->getFont()->applyFromArray(
            array(
                'color' => array(
                    'rgb' => $fontcolor
                )
            )
        );

        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        //header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Comprobante Centros Costo.xls" ');
        header('Cache-Control: max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objWriter->disconnectWorksheets();
        unset($objPHPExcel);
        echo json_encode('OK');
    }

    public function exportarReporteComprobacionPdf($arrdescuadresasociaciones, $identidad, $idelaborarpagos)
    {
        $objdatosperiodo['datosentidad'] = HisRetencionesPersona::obtenerDatosEntidadDadoId($identidad);
        $periodo = DatElaborarPagos::obtenerFechaInicioPeriodoPago($idelaborarpagos);
        list($dia, $mes, $anno) = explode('/', $periodo);
        $objdatosperiodo['periodo'] = $mes;
        $this->identidad = $identidad;
        $this->objdatosperiodo = $objdatosperiodo;

        //PDF
        $pdf = new PDFNomina('p', 'mm', 'Letter');//279mm x 216mm
        $pdf->AddPage();
        $this->fnPintarEncabezado($pdf, "Comprobante de comprobación");
        //Recorriendo los datos del comprobante por centros de costo
        $totalgeneraldebito = 0;
        $totalgeneralcredito = 0;
        foreach ($arrdescuadresasociaciones as $asociacion) {
            $pdf->SetX(15);
            $pdf->SetFillColor(220);//Definiendo el color de celdas
            $pdf->Cell($this->longitudhoja - 25, 5, utf8_decode('Asociación: ' . $asociacion['asociacion']), 1, 1, 'L', 1);
            $this->fnNuevaPagina($pdf);
            //Si tiene cuentas
            $totaldebito = 0;
            $totalcredito = 0;
            if (!empty($asociacion)) {
                //cuentas deudoras
                foreach ($asociacion['cdeudoras'] as $cuenta) {
                    $pdf->SetX(15);
                    $pdf->SetFont('Arial', '', $this->fontsizeletra);
                    $pdf->Cell($this->longitudhoja / 4, 5, $cuenta['cuenta'], 0, 0, 'L', 0);
                    $pdf->SetFont('Arial', '', $this->fontsizeletra - 1);
                    $pdf->Cell($this->longitudhoja / 2 - 25, 5, utf8_decode(substr($cuenta['denomcuenta'], 0, 60)), 0, 0, 'L', 0);
                    $pdf->SetFont('Arial', '', $this->fontsizeletra);
                    $pdf->Cell($this->longitudhoja / 8, 5, number_format($cuenta['importe'], 2, '.', ''), 0, 0, 'R', 0);
                    $pdf->Cell($this->longitudhoja / 8, 5, '', 0, 1, 'R', 0);
                    $totaldebito += $cuenta['importe'];
                    $this->fnNuevaPagina($pdf);
                }

                //cuentas acreedoras
                foreach ($asociacion['cacreedoras'] as $cuenta) {
                    $pdf->SetX(15);
                    $pdf->SetFont('Arial', '', $this->fontsizeletra);
                    $pdf->Cell($this->longitudhoja / 4, 5, $cuenta['cuenta'], 0, 0, 'L', 0);
                    $pdf->SetFont('Arial', '', $this->fontsizeletra - 1);
                    $pdf->Cell($this->longitudhoja / 2 - 25, 5, utf8_decode(substr($cuenta['denomcuenta'], 0, 60)), 0, 0, 'L', 0);
                    $pdf->SetFont('Arial', '', $this->fontsizeletra);
                    $pdf->Cell($this->longitudhoja / 8, 5, '', 0, 0, 'R', 0);
                    $pdf->Cell($this->longitudhoja / 8, 5, number_format($cuenta['importe'], 2, '.', ''), 0, 1, 'R', 0);
                    $totalcredito += $cuenta['importe'];
                    $this->fnNuevaPagina($pdf);
                }
                $pdf->SetFont('Arial', 'B', $this->fontsizeletra);
                $pdf->SetX(15);

                //Definiendo el color de celdas  -  Comparacion de dos valores float(valores de punto flotante) con el epsilon
                $epsilon = 0.00001;
                $bool = (abs($totaldebito - $totalcredito) < $epsilon) ? true : false;
                $r = (!$bool) ? 999 : 0;
                $g = (!$bool) ? 0 : 999;
                $pdf->SetFillColor($r, $g, 0);

                $pdf->Cell($this->longitudhoja / 4 + $this->longitudhoja / 2 - 25, 5, 'Subtotales:', $this->borderceldas, 0, 'C', 0);
                $pdf->Cell($this->longitudhoja / 8, 5, number_format($totaldebito, 2, '.', ''), $this->borderceldas, 0, 'R', 1);
                $pdf->Cell($this->longitudhoja / 8, 5, number_format($totalcredito, 2, '.', ''), $this->borderceldas, 1, 'R', 1);
                $this->fnNuevaPagina($pdf);
                $pdf->Cell(1, 3, '', 0, 1);
            }
            $totalgeneraldebito += $totaldebito;
            $totalgeneralcredito += $totalcredito;
        }

        $pdf->SetFont('Arial', 'B', $this->fontsizeletra);
        $pdf->SetX(15);

        //Definiendo el color de celdas  -  Comparacion de dos valores float(valores de punto flotante) con el epsilon
        $epsilon = 0.00001;
        $bool = (abs($totalgeneraldebito - $totalgeneralcredito) < $epsilon) ? true : false;
        $r = (!$bool) ? 999 : 0;
        $g = (!$bool) ? 0 : 999;
        $pdf->SetFillColor($r, $g, 0);

        $pdf->Cell($this->longitudhoja / 4 + $this->longitudhoja / 2 - 25, 5, 'Total:', $this->borderceldas, 0, 'C', 0);
        $pdf->Cell($this->longitudhoja / 8, 5, number_format($totalgeneraldebito, 2, '.', ''), $this->borderceldas, 0, 'R', 1);
        $pdf->Cell($this->longitudhoja / 8, 5, number_format($totalgeneralcredito, 2, '.', ''), $this->borderceldas, 1, 'R', 1);
        $pdf->Output();
    }

    //Comunes
    private function fnPintarEncabezado(&$pdf, $titulo)
    {
        //Titulo
        $pdf->SetFont('Arial', 'B', 14);//El GetStringWith no funciona si no tiene una fuente definida
        $pdf->Cell($this->longitudhoja - 30, 10, $titulo, 0, 0, 'C', 0);
        //Hoja
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(10, 10, "Hoja: ", 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(10, 10, $pdf->PageNo(), 0, 1, 'L', 0);
        //Periodo
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell($this->longitudhoja / 2, 10, utf8_decode("Período: "), 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell($this->longitudhoja / 2, 10, $this->objdatosperiodo['periodo'], 0, 1, 'L', 0);

        //Logo de la entidad
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        list($imagenBase64,) = explode(';', $arrEstruct[0]->logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($arrEstruct[0]->logo)) {
            $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }
        $pdf->Ln(0);

        //Campos encabezado
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->SetX(15);
        $pdf->Cell($this->longitudhoja / 4, 5, 'Cuenta', 1, 0, 'C', 0);
        $pdf->Cell($this->longitudhoja / 2 - 25, 5, utf8_decode('Título'), 1, 0, 'C', 0);
        $pdf->Cell($this->longitudhoja / 8, 5, 'Debe', 1, 0, 'C', 0);
        $pdf->Cell($this->longitudhoja / 8, 5, 'Haber', 1, 1, 'C', 0);
        $this->fnNuevaPagina($pdf);
    }

    private function fnNuevaPagina(&$pdf)
    {
        if ($pdf->GetY() > 250) {
            $pdf->AddPage();
            $this->fnPintarEncabezado($pdf);
        }

    }

}