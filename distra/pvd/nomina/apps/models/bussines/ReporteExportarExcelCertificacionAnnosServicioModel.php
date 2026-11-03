<?php

include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');

/**
 * Controlador para gestionar la certificación de los años de servicio de las personas.
 *
 * @author Ing. Jorge Martínez Rodríguez.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses
 * @copyright XETID
 * @version 1.0
 */
class ReporteExportarExcelCertificacionAnnosServicioModel extends ZendExt_Model
{

    public function GestionarcertificaciondeannosserviciosModel()
    {
        parent::ZendExt_Model();

    }

    public function obtenerCodigoCargoAux($arreglo, $identidad)
    {
        $cont = 0;
        foreach ($arreglo as $i => $valor) {
            $cargo = $this->integrator->metadatos->DameEstructura($valor['idcargo']);
            $arreglo[$cont]['cargo'] = $cargo[0]->denominacion;
            $codigo = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersonaEntidad($valor['idpersona'], $identidad);
            $cont++;
        }
        return $arreglo;
    }

    public function exportarReporte($identidad, $fechaactual)
    {
        $objCertificar = new ConfCertificacionAnnoServic();
        $arraycertificacion = $objCertificar->obtenerPersonasCertificadas($identidad);

        $cont = 0;
        $cont2 = 0;
        $arraycambiocategoria = $objCertificar->obtenerPersonasCambioCategoria($identidad);

        $arraycertificacion = $this->obtenerCodigoCargoAux($arraycertificacion, $identidad);
        $arraycambiocategoria = $this->obtenerCodigoCargoAux($arraycambiocategoria, $identidad);

        $objPHPExcel = $this->pintarCabecera($arraycertificacion, $arraycambiocategoria);
        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Certificación de años de servicio.xls" ');
        header('Cache-Control: max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');

        //$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        echo json_encode('OK');
    }//excel

    public function pintarCabecera($arraycertificacion, $arraycambiocategoria)
    {
        $objPHPExcel = new PHPExcel();
        $objPhPExelAux = null;
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('General');

        /*
        $objPHPExcel->getActiveSheet()->freezePane('A8');
        $objPHPExcel->getActiveSheet()->getRowDimension(7)->setRowHeight(40);
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(23);
        */

        //CABECERA DEL REPORTE
        //Concatenando la 1ra fila para escribir "Certificación de años de servicio"
        $objPHPExcel->getActiveSheet()->mergeCells('A1:K1');
        $objPHPExcel->getActiveSheet()->setCellValue('A1', 'Certificación de años de servicio');
        //Dandole formato 'center' a Certificación de años de servicio
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getAlignment()->applyFromArray(
            array(
                'bold' => TRUE,
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Dandole formato 'bold' al titulo Certificación de años de servicio
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getFont()->applyFromArray(
            array(
                'name' => 'Calibri',
                'bold' => TRUE,
                'italic' => FALSE,
                'strike' => FALSE,
                'size' => 13,
                'color' => array(
                    'rgb' => '000000'
                )
            )
        );

        //Aplicando borde negro a la celda Certificación de años de servicio
        $letrarecorrer = 1;
        $letraconvertidarecorrer = "";
        for ($i = 0; $i < 11; $i++) {
            $letraconvertidarecorrer = chr($letrarecorrer + 64);
            //Dandole border 'buttoms' a la celda 'Certificación de años de servicio'
            $objPHPExcel->getActiveSheet()->getStyle('' . $letraconvertidarecorrer . '1')->getBorders()->applyFromArray(
                array(
                    'bottom' => array(
                        'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                )
            );
            $letrarecorrer++;
        }
        //Concatenando el borde superior derecho
        $objPHPExcel->getActiveSheet()->mergeCells('G2:K4');

        //Dandole formato 'center' al borde superior derecho
        $objPHPExcel->getActiveSheet()->getStyle('G2')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );

        //Concatenando la segunda fila para escribir "Entidad"
        $objPHPExcel->getActiveSheet()->mergeCells('A2:C2');
        $objPHPExcel->getActiveSheet()->setCellValue('A2', 'Entidad');

        //Dandole formato 'center' a la palabra "Entidad"
        $objPHPExcel->getActiveSheet()->getStyle('A2')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando la segunda fila para escribir "Fecha"
        $objPHPExcel->getActiveSheet()->mergeCells('D2:F2');
        $objPHPExcel->getActiveSheet()->setCellValue('D2', 'Fecha');

        //Dandole formato 'center' a la palabra Fecha
        $objPHPExcel->getActiveSheet()->getStyle('D2')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );


        //Concatenando la tercera fila para escribir "Nombre"
        $objPHPExcel->getActiveSheet()->mergeCells('A3:B3');
        $objPHPExcel->getActiveSheet()->setCellValue('A3', 'Nombre');

        //Dandole formato 'center' a la palabra "Nombre"
        $objPHPExcel->getActiveSheet()->getStyle('A3')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );

        //capturo la celda C3 pra escribir "Código"
        $objPHPExcel->getActiveSheet()->setCellValue('C3', 'Código');

        //Dandole formato 'center' a la palabra "Código"
        $objPHPExcel->getActiveSheet()->getStyle('C3')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );

        //capturo la celda D3 pra escribir "Día"
        $objPHPExcel->getActiveSheet()->setCellValue('D3', 'Día');

        //Dandole formato 'center' a la palabra "Día"
        $objPHPExcel->getActiveSheet()->getStyle('D3')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //capturo la celda E3 pra escribir "Mes"
        $objPHPExcel->getActiveSheet()->setCellValue('E3', 'Mes');
        //Dandole formato 'center' a la palabra "Mes"
        $objPHPExcel->getActiveSheet()->getStyle('E3')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //capturo la celda F3 pra escribir "Año"
        $objPHPExcel->getActiveSheet()->setCellValue('F3', 'Año');
        //Dandole formato 'center' a la palabra "Mes"
        $objPHPExcel->getActiveSheet()->getStyle('F3')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en A5 "Código"
        $objPHPExcel->getActiveSheet()->mergeCells('A5:A6');
        $objPHPExcel->getActiveSheet()->setCellValue('A5', 'Código');
        //Dandole formato 'center' a la palabra "Código"
        $objPHPExcel->getActiveSheet()->getStyle('A5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en B5 "CI"
        $objPHPExcel->getActiveSheet()->mergeCells('B5:B6');
        $objPHPExcel->getActiveSheet()->setCellValue('B5', 'CI');
        //Dandole formato 'center' a la palabra "CI"
        $objPHPExcel->getActiveSheet()->getStyle('B5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en C5 "Cargo"
        $objPHPExcel->getActiveSheet()->mergeCells('C5:C6');
        $objPHPExcel->getActiveSheet()->setCellValue('C5', 'Cargo');
        //Dandole formato 'center' a la palabra "Cargo"
        $objPHPExcel->getActiveSheet()->getStyle('C5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en D5 "Nombre y apellidos"
        $objPHPExcel->getActiveSheet()->mergeCells('D5:F6');
        $objPHPExcel->getActiveSheet()->setCellValue('D5', 'Nombre y apellidos');
        //Dandole formato 'center' a la palabra "Nombre y apellidos"
        $objPHPExcel->getActiveSheet()->getStyle('D5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en A4 el texto
        $objPHPExcel->getActiveSheet()->mergeCells('A4:B4');
        //Dandole formato 'center' a la palabra "Nombre y apellidos"
        $objPHPExcel->getActiveSheet()->getStyle('A4')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en E5 "Fecha e certificación"
        $objPHPExcel->getActiveSheet()->mergeCells('G5:G6');
        $objPHPExcel->getActiveSheet()->setCellValue('G5', 'Fecha de certificación');
        //Dandole formato 'center' a la palabra "Fecha e certificación"
        $objPHPExcel->getActiveSheet()->getStyle('G5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en F5 "Años de servicio"
        $objPHPExcel->getActiveSheet()->mergeCells('H5:H6');
        $objPHPExcel->getActiveSheet()->setCellValue('H5', 'Años de servicio');
        //Dandole formato 'center' a la palabra "Años de servicio"
        $objPHPExcel->getActiveSheet()->getStyle('H5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en G5 "Meses de servicio"
        $objPHPExcel->getActiveSheet()->mergeCells('I5:I6');
        $objPHPExcel->getActiveSheet()->setCellValue('I5', 'Meses de servicio');
        //Dandole formato 'center' a la palabra "Meses de servicio"
        $objPHPExcel->getActiveSheet()->getStyle('I5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en H5 "Antiguedad en la entidad"
        $objPHPExcel->getActiveSheet()->mergeCells('J5:J6');
        $objPHPExcel->getActiveSheet()->setCellValue('J5', 'Antiguedad en la entidad');
        //Dandole formato 'center' a la palabra "Antiguedad en la entidad"
        $objPHPExcel->getActiveSheet()->getStyle('J5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en K5 "Antiguedad general"
        $objPHPExcel->getActiveSheet()->mergeCells('K5:K6');
        $objPHPExcel->getActiveSheet()->setCellValue('K5', 'Antiguedad general');
        //Dandole formato 'center' a la palabra "Antiguedad general"
        $objPHPExcel->getActiveSheet()->getStyle('K5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );

        //Aplicando todos los bordes a las celdas
        $letrarecorrer = 1;
        $letraconvertidarecorrer = "";
        for ($i = 0; $i < 7; $i++) {
            $letraconvertidarecorrer = chr($letrarecorrer + 64);
            //Dandole border 'buttoms' a la celda 'Certificación de años de servicio'
            $objPHPExcel->getActiveSheet()->getStyle('' . $letraconvertidarecorrer . '2')->getBorders()->applyFromArray(
                array(
                    'bottom' => array(
                        'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                )
            );
            $letrarecorrer++;
        }
        $objPHPExcel->getActiveSheet()->getStyle('A3:F3')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E3:E4')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('F3:F4')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('D2:D6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('J2')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('C3:C6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('G2:G6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('J2:J6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('D3:D4')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('D5:F6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                ),
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E3:E4')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('F3:F4')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('B5:B6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E5:E6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('F5:F6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('H5:H6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('I5:I6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('J5:J6')->getBorders()->applyFromArray(
            array(
                'top' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                ),
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('K5:K6')->getBorders()->applyFromArray(
            array(
                'top' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                ),
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                ),
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('L2:L6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('A5:I6')->getBorders()->applyFromArray(
            array(
                'top' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                ),
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );

        //Cambiandole la dimension a las columnas
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(8, 30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(14, 30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(49, 30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(26, 60);
        $objPHPExcel->getActiveSheet()->getColumnDimension('K')->setWidth(20, 60);


        $contFilas = 7;
        //Llenando el cuerpo del excel

        $idplantillanominal = 0;
        foreach ($arraycertificacion as $key => $val) {

            if ($val['idplantillanominal'] == $idplantillanominal) {
                $objPHPExcel->getActiveSheet()->mergeCells('D' . '' . ($contFilas) . ':F' . '' . ($contFilas));
                $objPHPExcel->getActiveSheet()->setCellValue('D' . '' . ($contFilas), $val['nombre'] . ' ' . $val['snombre'] . ' ' . $val['papel'] . ' ' . $val['sapel']);
                $objPHPExcel->getActiveSheet()->setCellValue('A' . '' . $contFilas, $val['codigo']);
                $objPHPExcel->getActiveSheet()->setCellValue('B' . '' . $contFilas, $val['ci']);
                $objPHPExcel->getActiveSheet()->setCellValue('C' . '' . $contFilas, $val['cargo']);
                $objPHPExcel->getActiveSheet()->setCellValue('G' . '' . $contFilas, $val['fechacertif']);
                $objPHPExcel->getActiveSheet()->setCellValue('H' . '' . $contFilas, $val['annosserv']);
                $objPHPExcel->getActiveSheet()->setCellValue('I' . '' . $contFilas, $val['mesesserv']);
                $antigEntidad = explode(',', $val['serventidad']);
                $antigEntidadTexto = $antigEntidad[0] . ' años y ' . $antigEntidad[1] . ' meses';

                $antigGeneral = explode(',', $val['antiguedad']);
                $antigGeneralTexto = $antigGeneral[0] . ' años y ' . $antigGeneral[1] . ' meses';
                //Añadiendo los estilos
                $objPHPExcel->getActiveSheet()->setCellValue('J' . '' . $contFilas, $antigEntidadTexto);
                $objPHPExcel->getActiveSheet()->setCellValue('K' . '' . $contFilas, $antigGeneralTexto);

                $objPHPExcel->getActiveSheet()->getStyle('A' . '' . $contFilas . ':K' . '' . $contFilas)->getBorders()->applyFromArray(
                    array(
                        'bottom' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        ),

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('L' . '' . ($contFilas) . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('B' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('C' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('D' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('G' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('H' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('I' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('J' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('K' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );

                $idplantillanominal = $val['idplantillanominal'];
                $contFilas++;
            } else {
                //   $contFilas++;
                $objPHPExcel->getActiveSheet()->mergeCells('A' . '' . ($contFilas) . ':K' . '' . ($contFilas));
                if ($val['nombreplantilla'] == null || $val['nombreplantilla'] == "") {
                    $objPHPExcel->getActiveSheet()->setCellValue('A' . '' . ($contFilas), 'Sin plantilla');
                } else {
                    $objPHPExcel->getActiveSheet()->setCellValue('A' . '' . ($contFilas), 'Plantilla: ' . $val['nombreplantilla']);
                }
                $contFilas++;
                $objPHPExcel->getActiveSheet()->mergeCells('D' . '' . ($contFilas) . ':F' . '' . ($contFilas));
                $objPHPExcel->getActiveSheet()->setCellValue('D' . '' . ($contFilas), $val['nombre'] . ' ' . $val['snombre'] . ' ' . $val['papel'] . ' ' . $val['sapel']);
                $objPHPExcel->getActiveSheet()->setCellValue('A' . '' . $contFilas, $val['codigo']);
                $objPHPExcel->getActiveSheet()->setCellValue('B' . '' . $contFilas, $val['ci']);
                $objPHPExcel->getActiveSheet()->setCellValue('C' . '' . $contFilas, $val['cargo']);
                $objPHPExcel->getActiveSheet()->setCellValue('G' . '' . $contFilas, $val['fechacertif']);
                $objPHPExcel->getActiveSheet()->setCellValue('H' . '' . $contFilas, $val['annosserv']);
                $objPHPExcel->getActiveSheet()->setCellValue('I' . '' . $contFilas, $val['mesesserv']);

                $antigEntidad = explode(',', $val['serventidad']);
                $antigEntidadTexto = $antigEntidad[0] . ' años y ' . $antigEntidad[1] . ' meses';

                $antigGeneral = explode(',', $val['antiguedad']);
                $antigGeneralTexto = $antigGeneral[0] . ' años y ' . $antigGeneral[1] . ' meses';


                $objPHPExcel->getActiveSheet()->setCellValue('J' . '' . $contFilas, $antigEntidadTexto);
                $objPHPExcel->getActiveSheet()->setCellValue('K' . '' . $contFilas, $antigGeneralTexto);

                //Añadiendo los estilos
                $objPHPExcel->getActiveSheet()->getStyle('A' . '' . $contFilas . ':K' . '' . $contFilas)->getBorders()->applyFromArray(
                    array(
                        'bottom' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        ),
                        'top' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('A' . '' . ($contFilas - 1) . '')->getFont()->applyFromArray(
                    array(
                        'name' => 'Calibri',
                        'bold' => TRUE,
                        'italic' => FALSE,
                        'strike' => FALSE,
                        'size' => 12,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('B' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('C' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('D' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('G' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('H' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('I' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('J' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('K' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );

                $objPHPExcel->getActiveSheet()->getStyle('L' . '' . ($contFilas) . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('L' . '' . ($contFilas - 1) . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
                    )
                );


                $idplantillanominal = $val['idplantillanominal'];
                $contFilas++;
            }
        }
        //Aqui empieza el código de la página 2
        $objPHPExcel->createSheet(1);
        $objPHPExcel->setActiveSheetIndex(1);
        $objPHPExcel->getActiveSheet()->setTitle('Cambio de escala');
        //CABECERA DEL REPORTE
        //Concatenando la 1ra fila para escribir "Certificación de años de servicio"
        $objPHPExcel->getActiveSheet()->mergeCells('A1:K1');
        $objPHPExcel->getActiveSheet()->setCellValue('A1', 'Certificación de años de servicio');
        //Dandole formato 'center' a Certificación de años de servicio
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getAlignment()->applyFromArray(
            array(
                'bold' => TRUE,
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Dandole formato 'bold' al titulo Certificación de años de servicio
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getFont()->applyFromArray(
            array(
                'name' => 'Calibri',
                'bold' => TRUE,
                'italic' => FALSE,
                'strike' => FALSE,
                'size' => 13,
                'color' => array(
                    'rgb' => '000000'
                )
            )
        );

        //Aplicando borde negro a la celda Certificación de años de servicio
        $letrarecorrer = 1;
        $letraconvertidarecorrer = "";
        for ($i = 0; $i < 11; $i++) {
            $letraconvertidarecorrer = chr($letrarecorrer + 64);
            //Dandole border 'buttoms' a la celda 'Certificación de años de servicio'
            $objPHPExcel->getActiveSheet()->getStyle('' . $letraconvertidarecorrer . '1')->getBorders()->applyFromArray(
                array(
                    'bottom' => array(
                        'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                )
            );
            $letrarecorrer++;
        }
        //Concatenando el borde superior derecho
        $objPHPExcel->getActiveSheet()->mergeCells('G2:K4');

        //Dandole formato 'center' al borde superior derecho
        $objPHPExcel->getActiveSheet()->getStyle('G2')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );

        //Concatenando la segunda fila para escribir "Entidad"
        $objPHPExcel->getActiveSheet()->mergeCells('A2:C2');
        $objPHPExcel->getActiveSheet()->setCellValue('A2', 'Entidad');

        //Dandole formato 'center' a la palabra "Entidad"
        $objPHPExcel->getActiveSheet()->getStyle('A2')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando la segunda fila para escribir "Fecha"
        $objPHPExcel->getActiveSheet()->mergeCells('D2:F2');
        $objPHPExcel->getActiveSheet()->setCellValue('D2', 'Fecha');

        //Dandole formato 'center' a la palabra Fecha
        $objPHPExcel->getActiveSheet()->getStyle('D2')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );


        //Concatenando la tercera fila para escribir "Nombre"
        $objPHPExcel->getActiveSheet()->mergeCells('A3:B3');
        $objPHPExcel->getActiveSheet()->setCellValue('A3', 'Nombre');

        //Dandole formato 'center' a la palabra "Nombre"
        $objPHPExcel->getActiveSheet()->getStyle('A3')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );

        //capturo la celda C3 pra escribir "Código"
        $objPHPExcel->getActiveSheet()->setCellValue('C3', 'Código');

        //Dandole formato 'center' a la palabra "Código"
        $objPHPExcel->getActiveSheet()->getStyle('C3')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );

        //capturo la celda D3 pra escribir "Día"
        $objPHPExcel->getActiveSheet()->setCellValue('D3', 'Día');

        //Dandole formato 'center' a la palabra "Día"
        $objPHPExcel->getActiveSheet()->getStyle('D3')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //capturo la celda E3 pra escribir "Mes"
        $objPHPExcel->getActiveSheet()->setCellValue('E3', 'Mes');
        //Dandole formato 'center' a la palabra "Mes"
        $objPHPExcel->getActiveSheet()->getStyle('E3')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //capturo la celda F3 pra escribir "Año"
        $objPHPExcel->getActiveSheet()->setCellValue('F3', 'Año');
        //Dandole formato 'center' a la palabra "Mes"
        $objPHPExcel->getActiveSheet()->getStyle('F3')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en A5 "Código"
        $objPHPExcel->getActiveSheet()->mergeCells('A5:A6');
        $objPHPExcel->getActiveSheet()->setCellValue('A5', 'Código');
        //Dandole formato 'center' a la palabra "Código"
        $objPHPExcel->getActiveSheet()->getStyle('A5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en B5 "CI"
        $objPHPExcel->getActiveSheet()->mergeCells('B5:B6');
        $objPHPExcel->getActiveSheet()->setCellValue('B5', 'CI');
        //Dandole formato 'center' a la palabra "CI"
        $objPHPExcel->getActiveSheet()->getStyle('B5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en C5 "Cargo"
        $objPHPExcel->getActiveSheet()->mergeCells('C5:C6');
        $objPHPExcel->getActiveSheet()->setCellValue('C5', 'Cargo');
        //Dandole formato 'center' a la palabra "Cargo"
        $objPHPExcel->getActiveSheet()->getStyle('C5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en D5 "Nombre y apellidos"
        $objPHPExcel->getActiveSheet()->mergeCells('D5:F6');
        $objPHPExcel->getActiveSheet()->setCellValue('D5', 'Nombre y apellidos');
        //Dandole formato 'center' a la palabra "Nombre y apellidos"
        $objPHPExcel->getActiveSheet()->getStyle('D5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en A4 el texto
        $objPHPExcel->getActiveSheet()->mergeCells('A4:B4');
        //Dandole formato 'center' a la palabra "Nombre y apellidos"
        $objPHPExcel->getActiveSheet()->getStyle('A4')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en E5 "Fecha e certificación"
        $objPHPExcel->getActiveSheet()->mergeCells('G5:G6');
        $objPHPExcel->getActiveSheet()->setCellValue('G5', 'Fecha de certificación');
        //Dandole formato 'center' a la palabra "Fecha e certificación"
        $objPHPExcel->getActiveSheet()->getStyle('G5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en F5 "Años de servicio"
        $objPHPExcel->getActiveSheet()->mergeCells('H5:H6');
        $objPHPExcel->getActiveSheet()->setCellValue('H5', 'Años de servicio');
        //Dandole formato 'center' a la palabra "Años de servicio"
        $objPHPExcel->getActiveSheet()->getStyle('H5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en G5 "Meses de servicio"
        $objPHPExcel->getActiveSheet()->mergeCells('I5:I6');
        $objPHPExcel->getActiveSheet()->setCellValue('I5', 'Meses de servicio');
        //Dandole formato 'center' a la palabra "Meses de servicio"
        $objPHPExcel->getActiveSheet()->getStyle('I5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en H5 "Antiguedad en la entidad"
        $objPHPExcel->getActiveSheet()->mergeCells('J5:J6');
        $objPHPExcel->getActiveSheet()->setCellValue('J5', 'Antiguedad en la entidad');
        //Dandole formato 'center' a la palabra "Antiguedad en la entidad"
        $objPHPExcel->getActiveSheet()->getStyle('J5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );
        //Concatenando las filas 5y6 para escribir en K5 "Antiguedad general"
        $objPHPExcel->getActiveSheet()->mergeCells('K5:K6');
        $objPHPExcel->getActiveSheet()->setCellValue('K5', 'Antiguedad general');
        //Dandole formato 'center' a la palabra "Antiguedad general"
        $objPHPExcel->getActiveSheet()->getStyle('K5')->getAlignment()->applyFromArray(
            array(
                'horizontal' => 'center',
                'vertical' => center,
                'rotation' => 0,
                'wrap' => TRUE
            )
        );

        //Aplicando todos los bordes a las celdas

        $letrarecorrer = 1;
        $letraconvertidarecorrer = "";
        for ($i = 0; $i < 7; $i++) {
            $letraconvertidarecorrer = chr($letrarecorrer + 64);
            //Dandole border 'buttoms' a la celda 'Certificación de años de servicio'
            $objPHPExcel->getActiveSheet()->getStyle('' . $letraconvertidarecorrer . '2')->getBorders()->applyFromArray(
                array(
                    'bottom' => array(
                        'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                )
            );
            $letrarecorrer++;
        }
        $objPHPExcel->getActiveSheet()->getStyle('A3:F3')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E3:E4')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('F3:F4')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('D2:D6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('J2')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('C3:C6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('G2:G6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('J2:J6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('D3:D4')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('D5:F6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                ),
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E3:E4')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('F3:F4')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('B5:B6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E5:E6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('F5:F6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('H5:H6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('I5:I6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('J5:J6')->getBorders()->applyFromArray(
            array(
                'top' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                ),
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('K5:K6')->getBorders()->applyFromArray(
            array(
                'top' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                ),
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                ),
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('L2:L6')->getBorders()->applyFromArray(
            array(
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('A5:I6')->getBorders()->applyFromArray(
            array(
                'top' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                ),
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );

        //Cambiandole la dimension a las columnas
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(8, 30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(14, 30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(49, 30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(24, 60);
        $objPHPExcel->getActiveSheet()->getColumnDimension('K')->setWidth(20, 60);


        $contFilas = 7;
        //Llenando el cuerpo del excel
        $idplantillanominal = 0;
        foreach ($arraycambiocategoria as $key => $val2) {

            if ($val2['idplantillanominal'] == $idplantillanominal) {
                $objPHPExcel->getActiveSheet()->mergeCells('D' . '' . ($contFilas) . ':F' . '' . ($contFilas));
                $objPHPExcel->getActiveSheet()->setCellValue('D' . '' . ($contFilas), $val2['nombre'] . ' ' . $val2['snombre'] . ' ' . $val2['papel'] . ' ' . $val2['sapel']);
                $objPHPExcel->getActiveSheet()->setCellValue('A' . '' . $contFilas, $val2['codigo']);
                $objPHPExcel->getActiveSheet()->setCellValue('B' . '' . $contFilas, $val2['ci']);
                $objPHPExcel->getActiveSheet()->setCellValue('C' . '' . $contFilas, $val2['cargo']);
                $objPHPExcel->getActiveSheet()->setCellValue('G' . '' . $contFilas, $val2['fechacertif']);
                $objPHPExcel->getActiveSheet()->setCellValue('H' . '' . $contFilas, $val2['annosserv']);
                $objPHPExcel->getActiveSheet()->setCellValue('I' . '' . $contFilas, $val2['mesesserv']);
                $antigEntidad = explode(',', $val2['serventidad']);
                $antigEntidadTexto = $antigEntidad[0] . ' años y ' . $antigEntidad[1] . ' meses';

                $antigGeneral = explode(',', $val2['antiguedad']);
                $antigGeneralTexto = $antigGeneral[0] . ' años y ' . $antigGeneral[1] . ' meses';
                //Añadiendo los estilos
                $objPHPExcel->getActiveSheet()->setCellValue('J' . '' . $contFilas, $antigEntidadTexto);
                $objPHPExcel->getActiveSheet()->setCellValue('K' . '' . $contFilas, $antigGeneralTexto);


                $objPHPExcel->getActiveSheet()->getStyle('A' . '' . $contFilas . '')->getAlignment()->applyFromArray(
                    array(
                        'horizontal' => 'center',
                        'vertical' => center,
                        'rotation' => 0,
                        'wrap' => TRUE
                    )
                );

                $objPHPExcel->getActiveSheet()->getStyle('A' . '' . $contFilas . ':K' . '' . $contFilas)->getBorders()->applyFromArray(
                    array(
                        'bottom' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        ),

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('L' . '' . ($contFilas) . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('B' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('C' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('D' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('G' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('H' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('I' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('J' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('K' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );

                $idplantillanominal = $val['idplantillanominal'];
                $contFilas++;
            } else {
                //   $contFilas++;
                $objPHPExcel->getActiveSheet()->mergeCells('A' . '' . ($contFilas) . ':K' . '' . ($contFilas));
                if ($val2['nombreplantilla'] == null || $val2['nombreplantilla'] == "") {
                    $objPHPExcel->getActiveSheet()->setCellValue('A' . '' . ($contFilas), 'Sin plantilla');
                } else {
                    $objPHPExcel->getActiveSheet()->setCellValue('A' . '' . ($contFilas), 'Plantilla: ' . $val2['nombreplantilla']);
                }
                $contFilas++;
                $objPHPExcel->getActiveSheet()->mergeCells('D' . '' . ($contFilas) . ':F' . '' . ($contFilas));
                $objPHPExcel->getActiveSheet()->setCellValue('D' . '' . ($contFilas), $val2['nombre'] . ' ' . $val2['snombre'] . ' ' . $val2['papel'] . ' ' . $val2['sapel']);
                $objPHPExcel->getActiveSheet()->setCellValue('A' . '' . $contFilas, $val2['codigo']);
                $objPHPExcel->getActiveSheet()->setCellValue('B' . '' . $contFilas, $val2['ci']);
                $objPHPExcel->getActiveSheet()->setCellValue('C' . '' . $contFilas, $val2['cargo']);
                $objPHPExcel->getActiveSheet()->setCellValue('G' . '' . $contFilas, $val2['fechacertif']);
                $objPHPExcel->getActiveSheet()->setCellValue('H' . '' . $contFilas, $val2['annosserv']);
                $objPHPExcel->getActiveSheet()->setCellValue('I' . '' . $contFilas, $val2['mesesserv']);

                $antigEntidad = explode(',', $val2['serventidad']);
                $antigEntidadTexto = $antigEntidad[0] . ' años y ' . $antigEntidad[1] . ' meses';

                $antigGeneral = explode(',', $val2['antiguedad']);
                $antigGeneralTexto = $antigGeneral[0] . ' años y ' . $antigGeneral[1] . ' meses';


                $objPHPExcel->getActiveSheet()->setCellValue('J' . '' . $contFilas, $antigEntidadTexto);
                $objPHPExcel->getActiveSheet()->setCellValue('K' . '' . $contFilas, $antigGeneralTexto);

                //Añadiendo los estilos

                $objPHPExcel->getActiveSheet()->getStyle('A' . '' . $contFilas . ':K' . '' . $contFilas)->getBorders()->applyFromArray(
                    array(
                        'bottom' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        ),
                        'top' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
                    )
                );

                $objPHPExcel->getActiveSheet()->getStyle('A' . '' . ($contFilas - 1) . '')->getFont()->applyFromArray(
                    array(
                        'name' => 'Calibri',
                        'bold' => TRUE,
                        'italic' => FALSE,
                        'strike' => FALSE,
                        'size' => 12,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('B' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('C' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('D' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('G' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('H' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('I' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('J' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('K' . '' . $contFilas . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )

                    )
                );

                $objPHPExcel->getActiveSheet()->getStyle('L' . '' . ($contFilas) . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
                    )
                );
                $objPHPExcel->getActiveSheet()->getStyle('L' . '' . ($contFilas - 1) . '')->getBorders()->applyFromArray(
                    array(
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
                    )
                );


                $idplantillanominal = $val2['idplantillanominal'];
                $contFilas++;
            }
        }
        $objPHPExcel->setActiveSheetIndex(0);

        return $objPHPExcel;
    }

    public function fnPintarCelda(&$objPHPExcel, $column, $row, $val, $border, $bordercolor, $font, $fontsize, $fontcolor, $alignhor, $alignver, $rotate)
    {
        //$this->fnPintarCelda($objPHPExcel, 'A', 2, 'Entidad prueba', 't,r', null, 'Arial', 10, '120', 'center', 'center', 0);

        //Pintando el valor de la celda
        $objPHPExcel->getActiveSheet()->setCellValue($column . $row, $val);

        //Pintando los bordes a la celda
        if (!empty($border)) {
            $arrbordes = explode(',', $border);
            foreach ($arrbordes as &$bord) {
                $bord = mb_strtolower($bord);
                $realborder = '';
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
                }

                $objPHPExcel->getActiveSheet()->getStyle($column . $row)->getBorders()->applyFromArray(
                    array(
                        $realborder => array(
                            'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
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
                'bold' => TRUE,
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

    public function fnAlinearTexto(&$objPHPExcel, $celda, $hor, $ver, $rot)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getAlignment()->applyFromArray(
            array(
                'horizontal' => $hor,
                'vertical' => $ver,
                'rotation' => $rot, //0 ó 90
                'wrap' => TRUE
            )
        );
    }

    public function fnFuenteTexto(&$objPHPExcel, $celda, $name, $size)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFont()->applyFromArray(
            array(
                'name' => $name,
                'bold' => TRUE,
                'italic' => FALSE,
                'strike' => FALSE,
                'size' => $size,
                'color' => array(
                    'rgb' => '000000'
                )
            )
        );
    }

    public function fnFormatoNumeros(&$objPHPExcel, $celda)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getNumberFormat()->applyFromArray(
            array(
                'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
            )
        );
    }

}


