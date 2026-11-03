<?php

/**
 * Clase para crear la planilla evaluativa en formato PDF
 * Created by Ing. Javier Rodriguez Lopez.
 * Date: 14/03/14
 * Time: 10:28
 */
class PrintEvaluacionCuadrosModel extends ZendExt_Model
{
    private $widthInd;
    private $hInd;

    public function PrintEvaluacionCuadrosModel($orientation = 'P', $unit = 'mm', $format)
    {
        parent::ZendExt_Model();
        $this->widthInd = 300;
        $this->hInd = 4;

        $this->pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, $format, true, 'UTF-8', false);

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
    public function createPDF($arrEvaluados, $startDate, $endDate, $idestructura, $formato, $firma)
    {
        $idperiodoproceso = $arrEvaluados[0]['idperiodoproceso'];
        $sqlproceso = "SELECT  def.denom as proceso, detpe.idtipoprocesoevaluativo
                                FROM mod_evaluaciones.dat_periodoproceso p
                                INNER JOIN mod_evaluaciones.dat_evalpreprocesoevaluativo pre ON (p.idpreprocesoevaluativo = pre.idpreprocesoevaluativo)
                                INNER JOIN mod_evaluaciones.dat_evaldefprocesoevaluativo def ON (def.iddefprocesoevaluativo = pre.iddefprocesoevaluativo)
                                LEFT JOIN  mod_evaluaciones.nom_evaltipoprocesoevaluativo detpe on (def.idtipoprocesoevaluativo = detpe.idtipoprocesoevaluativo)
                                WHERE p.idperiodoproceso = $idperiodoproceso";
        $proceso = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlproceso);
        $nombreproceso = $proceso[0]['proceso'];
        $variables = array();
        foreach ($arrEvaluados as $evaldo) {
            $this->pdf->AddPage();
            $this->createHeader($evaldo, $startDate, $endDate, $idestructura, $nombreproceso);
            $this->createBody($evaldo['DatEvalindicadoresevaluacion']);
            $this->createFooter($evaldo);
            $nombreevaluado = $evaldo['nombre'];
            $idpersonaevaluacion = $evaldo['idpersonaevaluacion'];
            if ($proceso[0]['idtipoprocesoevaluativo'] == 5) {
                $variables['V_tipo_evaluacion'] = 1;
                $variables['V_tipo_evaluacion_label'] = 'Mensual';
            } else if ($proceso[0]['idtipoprocesoevaluativo'] == 6) {
                $variables['V_tipo_evaluacion'] = 2;
                $variables['V_tipo_evaluacion_label'] = 'Anual';
            } else if ($proceso[0]['idtipoprocesoevaluativo'] == 2 || $proceso[0]['idtipoprocesoevaluativo'] == 7) {
                $variables['V_tipo_evaluacion'] = 3;
                $variables['V_tipo_evaluacion_label'] = 'Trimestral';
            }
            $periodo = explode('/', $evaldo['DatPeriodoproceso']['fdesde']);
            $variables['VAnno'] = $periodo[2];
            $variables['VMes'] = intval($periodo[1]);
            if ($variables['VMes'] == 1 || $variables['VMes'] == 2 || $variables['VMes'] == 3) {
                $variables['VTrimestre'] = 1;
                $variables['VTrimestre_label'] = 'I Trimestre';
            }
            if ($variables['VMes'] == 4 || $variables['VMes'] == 5 || $variables['VMes'] == 6) {
                $variables['VTrimestre'] = 2;
                $variables['VTrimestre_label'] = 'II Trimestre';
            }
            if ($variables['VMes'] == 7 || $variables['VMes'] == 8 || $variables['VMes'] == 9) {
                $variables['VTrimestre'] = 3;
                $variables['VTrimestre_label'] = 'III Trimestre';
            }
            if ($variables['VMes'] == 10 || $variables['VMes'] == 11 || $variables['VMes'] == 12) {
                $variables['VTrimestre'] = 4;
                $variables['VTrimestre_label'] = 'IV Trimestre';
            }
            $variables['suggestVar_lista_trabajador'] = $evaldo['idpersona'];
            $variables['suggestVar_lista_trabajador_label'] = $evaldo['nombrecompleto'];
            $variables['V_Trabajador_cargo'] = $evaldo['cargo'];
            $variables['VArea'] = $evaldo['area'];
            $variables['V_id_area'] = $evaldo['idarea'];
            $variables['V_Trabajador_nombre'] = $evaldo['nombrecompleto'];
            $variables['V_Trabajador_correo'] = $evaldo['correo'];
            $variables['V_Trabajador_ci'] = $evaldo['numid'];
        }

        // Close and output PDF document
        ob_clean();
        if ($firma == 1) {
            $dir_www = str_ireplace('apps', 'web', $_SERVER['DOCUMENT_ROOT']);
            $direccion = $dir_www . '/pvd/evaluaciones/procesoevaluativo/EVALUACION-' . $nombreevaluado . '.pdf';
            $this->pdf->Output($direccion, 'F');
            $r['direccion'] = $direccion;
            $r['nombre'] = $nombreevaluado;
            $r['idpersonaevaluacion'] = $idpersonaevaluacion;
            $r['variables'] = $variables;
            $r['success'] = true;
            return $r;
        } else {
            $this->pdf->Output("EVALUACION.pdf", 'I');
            return true;
        }

        return true;
    }

    private function createHeader($evaldo, $startDate, $endDate, $idestructura, $nombreproceso)
    {
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        //Logo de la entidad
        $this->pdf->SetX(10);
        if (!empty($arrEstruct[0]->logo)) {
            $image = explode(';', $arrEstruct[0]->logo);
            $extension = explode('/', $image[0]);
            $this->pdf->Image($arrEstruct[0]->logo, 5, 0, 45, 20, $extension[1]);
        }
        $this->pdf->SetX(40);
        $this->pdf->SetFont('helvetica', 'B', 10);
        $this->pdf->MultiCell(null, 5, 'EVALUACIÓN MENSUAL DEL DESEMPEÑO DE LOS CUADROS', 0, 'C');

        $this->pdf->SetFont('helvetica', '', 7);
        $this->pdf->Ln(10);

        $this->pdf->SetX(10);
        $this->pdf->Cell(120, 4, 'Nombres y Apellidos: ' . $evaldo['nombrecompleto'], 1, 0, 'L');
        $this->pdf->Cell(70, 4, 'Período a evaluar:', 1, 0, 'C');

        $this->pdf->Ln(4);
        $this->pdf->SetX(10);
        $this->pdf->Cell(120, 4, 'Cargo: ' . $evaldo['cargo'], 1, 0, 'L');
        $this->pdf->Cell(35, 4, $startDate, 1, 0, 'C');
        $this->pdf->Cell(35, 4, $endDate, 1, 0, 'C');

        $this->pdf->Ln(4);
        $this->pdf->SetX(10);
        $entidadarea = explode('/', $evaldo['area']);
        $this->pdf->Cell(100, 4, 'Área de trabajo: ' . $entidadarea[1], 1, 0, 'L');
        $this->pdf->Cell(55, 4, 'Categoría Ocupacional:', 1, 0, 'C');
        $this->pdf->SetFont('helvetica', 'U', 7);
        $this->pdf->Cell(35, 4, $evaldo['categoriaocup'], 1, 0, 'C');
        $this->pdf->SetFont('helvetica', '', 7);
        $this->pdf->Ln(4);
        $this->pdf->SetX(10);
        $this->pdf->Cell(190, 4, 'Entidad: ' . $entidadarea[0], 1, 0, 'L');

        $this->pdf->Ln(4);
        $this->pdf->SetX(10);
        $this->pdf->Cell(90, 20, 'Escala para otorgar valores:', 1, 0, 'C');
        $this->pdf->Cell(25, 4, 'Mal', 1, 0, 'C');
        $this->pdf->Cell(25, 4, 'Regular', 1, 0, 'C');
        $this->pdf->Cell(25, 4, 'Bien', 1, 0, 'C');
        $this->pdf->Cell(25, 4, 'Muy Bien', 1, 0, 'C');

        $this->pdf->Ln(4);
        $this->pdf->SetX(100);
        $this->pdf->Cell(100, 4, 'Escala 5', 1, 0, 'C');

        $this->pdf->Ln(4);
        $this->pdf->SetX(100);
        $this->pdf->Cell(25, 4, '2', 1, 0, 'C');
        $this->pdf->Cell(25, 4, '3', 1, 0, 'C');
        $this->pdf->Cell(25, 4, '4', 1, 0, 'C');
        $this->pdf->Cell(25, 4, '5', 1, 0, 'C');

        $this->pdf->Ln(4);
        $this->pdf->SetX(100);
        $this->pdf->Cell(100, 4, 'Escala 10', 1, 0, 'C');

        $this->pdf->Ln(4);
        $this->pdf->SetX(100);
        $this->pdf->Cell(25, 4, '0-3', 1, 0, 'C');
        $this->pdf->Cell(25, 4, '4-6', 1, 0, 'C');
        $this->pdf->Cell(25, 4, '7-8', 1, 0, 'C');
        $this->pdf->Cell(25, 4, '9-10', 1, 0, 'C');

        $this->pdf->SetFont('helvetica', 'B', 7);
        $this->pdf->Ln(4);
        $this->pdf->SetX(10);
        $this->pdf->Cell(190, 4, 'Indicadores y Puntuaciones Otorgadas a los rasgos', 1, 0, 'C');
        $this->pdf->Ln(4);
        $this->yaux = $this->pdf->GetY();
    }

    private function createBody($evaluacion)
    {
        $this->pdf->SetMargins(10, 0, 10);
        $contA = 1;
        $cont = 0;
        $subCont = 'a';
        $lastIdpadre = null;
        $this->pdf->SetFont('helvetica', '', 7);
        $mitad = count($evaluacion) / 2;
        $this->pdf->Ln(1);
        if (ctype_digit($mitad)) {
            foreach ($evaluacion as $k => $indicador) {
                if ($k <= intval($mitad)) {
                    $height = $this->pdf->getStringHeight(71, $indicador['DatEvalindicadoresplanilla']['NomEvalindicadortexto']['denom'], false, true, '', 1);
                    //Para generar el numerador
                    if ($indicador['DatEvalindicadoresplanilla']['idindicadorplanilla'] ==
                        $indicador['DatEvalindicadoresplanilla']['idpadre']
                    ) {
                        $subCont = 'a';
                        if ($lastIdpadre != $indicador['DatEvalindicadoresplanilla']['idpadre']) {
                            $lastIdpadre = $indicador['DatEvalindicadoresplanilla']['idpadre'];
                            $cont++;
                        }
                        $this->pdf->Cell(10, $height, $cont, 1, 0);
                    } else {
                        $this->pdf->Cell(10, $height, $cont . '.' . $subCont++, 1, 0);
                    }
                    // Primero me guardo las coordenadas donde comienza la celda multilinea.
                    $y1 = $this->pdf->GetY();
                    $x1 = $this->pdf->GetX();

                    // Pinto la celda multilinea.
                    $this->pdf->MultiCell(
                        71, $height,
                        $indicador['DatEvalindicadoresplanilla']['NomEvalindicadortexto']['denom'], 1, 'L'
                    );

                    // Aquí obtengo la coordenada X donde quiero comenzar la siguiente columna, que no es otra cosa que la posición original más el ancho de la primera celda, en el caso del ejemplo es $this->widthInd.
                    $posicionX = $x1 + 71;

                    // Por último, me sitúo en las coordenadas correspondientes a la misma fila y siguiente columna.
                    $this->pdf->SetXY($posicionX, $y1);

                    // Y ahora a pintar el resto de celdas con el mismo tamaño de alto para toda la fila.
                    $this->pdf->Cell(13, $height, $indicador['valorMostrar'], 1, 0, 'C');

                    $this->pdf->Ln($height);
                }else
                    break;
                $pdf->SetY($this->yaux);
                foreach ($evaluacion as $k => $indicador) {
                    if ($k > intval($mitad)) {
                        $x = $pdf->GetX();
                        $pdf->SetX($x + 10 + 71 + 13 + 2);
                        $height = $this->pdf->getStringHeight(71, $indicador['DatEvalindicadoresplanilla']['NomEvalindicadortexto']['denom'], false, true, '', 1);
                        //Para generar el numerador
                        if ($indicador['DatEvalindicadoresplanilla']['idindicadorplanilla'] ==
                            $indicador['DatEvalindicadoresplanilla']['idpadre']
                        ) {
                            $subCont = 'a';
                            if ($lastIdpadre != $indicador['DatEvalindicadoresplanilla']['idpadre']) {
                                $lastIdpadre = $indicador['DatEvalindicadoresplanilla']['idpadre'];
                                $cont++;
                            }
                            $this->pdf->Cell(10, $height, $cont, 1, 0);
                        } else {
                            $this->pdf->Cell(10, $height, $cont . '.' . $subCont++, 1, 0);
                        }
                        // Primero me guardo las coordenadas donde comienza la celda multilinea.
                        $y1 = $this->pdf->GetY();
                        $x1 = $this->pdf->GetX();

                        // Pinto la celda multilinea.
                        $this->pdf->MultiCell(
                            71, $height,
                            $indicador['DatEvalindicadoresplanilla']['NomEvalindicadortexto']['denom'], 1, 'L'
                        );

                        // Aquí obtengo la coordenada X donde quiero comenzar la siguiente columna, que no es otra cosa que la posición original más el ancho de la primera celda, en el caso del ejemplo es $this->widthInd.
                        $posicionX = $x1 + 71;

                        // Por último, me sitúo en las coordenadas correspondientes a la misma fila y siguiente columna.
                        $this->pdf->SetXY($posicionX, $y1);

                        // Y ahora a pintar el resto de celdas con el mismo tamaño de alto para toda la fila.
                        $this->pdf->Cell(13, $height, $indicador['valorMostrar'], 1, 0, 'C');

                        $this->pdf->Ln($height);
                    }
                }
            }
        } else {
            foreach ($evaluacion as $k => $indicador) {
                if ($k <= intval($mitad)) {
                    $height = $this->pdf->getStringHeight(71, $indicador['DatEvalindicadoresplanilla']['NomEvalindicadortexto']['denom'], false, true, '', 1);
                    //Para generar el numerador
                    if ($indicador['DatEvalindicadoresplanilla']['idindicadorplanilla'] ==
                        $indicador['DatEvalindicadoresplanilla']['idpadre']
                    ) {
                        $subCont = 'a';
                        if ($lastIdpadre != $indicador['DatEvalindicadoresplanilla']['idpadre']) {
                            $lastIdpadre = $indicador['DatEvalindicadoresplanilla']['idpadre'];
                            $cont++;
                        }
                        $this->pdf->Cell(10, $height, $cont, 1, 0);
                    } else {
                        $this->pdf->Cell(10, $height, $cont . '.' . $subCont++, 1, 0);
                    }
                    // Primero me guardo las coordenadas donde comienza la celda multilinea.
                    $y1 = $this->pdf->GetY();
                    $x1 = $this->pdf->GetX();

                    // Pinto la celda multilinea.
                    $this->pdf->MultiCell(
                        71, $height,
                        $indicador['DatEvalindicadoresplanilla']['NomEvalindicadortexto']['denom'], 1, 'L'
                    );

                    // Aquí obtengo la coordenada X donde quiero comenzar la siguiente columna, que no es otra cosa que la posición original más el ancho de la primera celda, en el caso del ejemplo es $this->widthInd.
                    $posicionX = $x1 + 71;

                    // Por último, me sitúo en las coordenadas correspondientes a la misma fila y siguiente columna.
                    $this->pdf->SetXY($posicionX, $y1);

                    // Y ahora a pintar el resto de celdas con el mismo tamaño de alto para toda la fila.
                    $this->pdf->Cell(13, $height, $indicador['valorMostrar'], 1, 0, 'C');

                    $this->pdf->Ln($height);
                } else
                    break;
            }
            $this->yaux1 = $this->pdf->GetY();
            $this->pdf->SetY($this->yaux);
            $this->pdf->Ln(1);
            foreach ($evaluacion as $k => $indicador) {
                if ($k > intval($mitad)) {
                    $x = $this->pdf->GetX();
                    $this->pdf->SetX($x + 10 + 71 + 13 + 2);
                    $height = $this->pdf->getStringHeight(71, $indicador['DatEvalindicadoresplanilla']['NomEvalindicadortexto']['denom'], false, true, '', 1);
                    //Para generar el numerador
                    if ($indicador['DatEvalindicadoresplanilla']['idindicadorplanilla'] ==
                        $indicador['DatEvalindicadoresplanilla']['idpadre']
                    ) {
                        $subCont = 'a';
                        if ($lastIdpadre != $indicador['DatEvalindicadoresplanilla']['idpadre']) {
                            $lastIdpadre = $indicador['DatEvalindicadoresplanilla']['idpadre'];
                            $cont++;
                        }
                        $this->pdf->Cell(10, $height, $cont, 1, 0);
                    } else {
                        $this->pdf->Cell(10, $height, $cont . '.' . $subCont++, 1, 0);
                    }
                    // Primero me guardo las coordenadas donde comienza la celda multilinea.
                    $y1 = $this->pdf->GetY();
                    $x1 = $this->pdf->GetX();

                    // Pinto la celda multilinea.
                    $this->pdf->MultiCell(
                        71, $height,
                        $indicador['DatEvalindicadoresplanilla']['NomEvalindicadortexto']['denom'], 1, 'L'
                    );

                    // Aquí obtengo la coordenada X donde quiero comenzar la siguiente columna, que no es otra cosa que la posición original más el ancho de la primera celda, en el caso del ejemplo es $this->widthInd.
                    $posicionX = $x1 + 71;

                    // Por último, me sitúo en las coordenadas correspondientes a la misma fila y siguiente columna.
                    $this->pdf->SetXY($posicionX, $y1);

                    // Y ahora a pintar el resto de celdas con el mismo tamaño de alto para toda la fila.
                    $this->pdf->Cell(13, $height, $indicador['valorMostrar'], 1, 0, 'C');

                    $this->pdf->Ln($height);
                }
            }
            $this->yaux2 = $this->pdf->GetY();
            $h = $this->yaux1 - $this->yaux2;

            $x = $this->pdf->GetX();
            $this->pdf->SetX($x + 10 + 70 + 13 + 3);
            $this->pdf->Cell(10, $h, '', 1, 0, 'L');
            $this->pdf->Cell(71, $h, '', 1, 0, 'L');
            $this->pdf->Cell(13, $h, '', 1, 0, 'L');
            $this->pdf->Ln($h);
        }

    }

    private function createFooter($evaldo)
    {   $this->pdf->SetMargins(10, 10, 10);
        $this->pdf->Ln(1);
        $this->pdf->SetFont('helvetica', '', 7);
        $this->pdf->SetX(10);
        $this->pdf->Cell(60, 6, 'Total puntos: ', 'LBT', 0, 'R');
        $this->pdf->SetFont('helvetica', 'U', 7);
        $this->pdf->Cell(35, 6, $evaldo['valor'], 'BT', 0, 'L');
        if ($evaldo['valor'] >= 60 && $evaldo['valor'] <= 69) {
            $calificacion = 'Mal';
        } else if ($evaldo['valor'] >= 70 && $evaldo['valor'] <= 85) {
            $calificacion = 'Regular';
        } else if ($evaldo['valor'] >= 86 && $evaldo['valor'] <= 94) {
            $calificacion = 'Bien';
        } else if ($evaldo['valor'] >= 95 && $evaldo['valor'] <= 100) {
            $calificacion = 'Muy Bien';
        }
        $this->pdf->SetFont('helvetica', '', 7);
        $this->pdf->Cell(60, 6, 'Calificación obtenida: ', 'BT', 0, 'R');
        $this->pdf->SetFont('helvetica', 'U', 7);
        $this->pdf->Cell(35, 6, $calificacion, 'BRT', 0, 'L');

        $this->pdf->SetFont('helvetica', 'B', 7);
        $this->pdf->Ln(10);
        $this->pdf->SetX(10);
        $height = $this->pdf->getStringHeight(40, 'RESULTADOS DE LA CALIFICACIÓN', false, true, '', 1);
        $this->pdf->MultiCell(40, $height, 'RESULTADOS DE LA CALIFICACIÓN', 1, 'C');
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y - $height);
        $this->pdf->SetX(50);
        $this->pdf->MultiCell(40, $height, 'PUNTUACIÓN OBTENIDA', 1, 'C');

        $this->pdf->SetFont('helvetica', '', 7);
        $this->pdf->SetX(10);
        $this->pdf->Cell(40, 4, 'Muy Bien', 1, 0, 'L');
        $this->pdf->Cell(40, 4, 'De 95 hasta 100', 1, 0, 'L');

        $this->pdf->Ln(4);
        $this->pdf->SetX(10);
        $this->pdf->Cell(40, 4, 'Bien', 1, 0, 'L');
        $this->pdf->Cell(40, 4, 'De 86 hasta 94', 1, 0, 'L');

        $this->pdf->Ln(4);
        $this->pdf->SetX(10);
        $this->pdf->Cell(40, 4, 'Regular', 1, 0, 'L');
        $this->pdf->Cell(40, 4, 'De 70 hasta 85', 1, 0, 'L');

        $this->pdf->Ln(4);
        $this->pdf->SetX(10);
        $this->pdf->Cell(40, 4, 'Mal', 1, 0, 'L');
        $this->pdf->Cell(40, 4, 'De 60 hasta 69', 1, 0, 'L');

        $this->pdf->AddPage();
        $this->pdf->SetMargins(10, 10, 10);
        $this->pdf->SetX(10);
        $this->pdf->MultiCell(190, 220, '', 1, 'J');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetX(10);
        $this->pdf->SetY(12);
        $this->pdf->SetFont('helvetica', 'B', 7);
        $this->pdf->Cell(190, 5, 'Precisiones del evaluador:', 0, 0, 'L');
        $this->pdf->Ln(7);
        $this->pdf->SetFont('helvetica', '', 7);
        foreach ($evaldo['DatEvalindicadoresevaluacion'] as $k => $indicador) {
            if($indicador['complementotextual']!=null || $indicador['complementotextual']!=''){
                $this->pdf->MultiCell(190, 5,  '- '.$indicador['complementotextual'], 0, 'L');
            }
        }
        $this->pdf->SetX($x);
        $this->pdf->SetY($y);
        $this->pdf->Cell(95, 15, 'Fecha y firma del Evaluador:', 1, 0, 'L');
        $this->pdf->Cell(95, 15, 'Fecha y firma del Evaluado:', 1, 0, 'L');

    }

}