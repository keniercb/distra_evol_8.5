<?php

/**
 * Clase para crear la planilla evaluativa en formato PDF
 * Created by Ing. Javier Rodriguez Lopez.
 * Date: 14/03/14
 * Time: 10:28
 */
class PrintEvaluacionComplementoModel extends ZendExt_Model
{

    private $pdf;
    private $widthInd;
    private $hInd;

    public function PrintEvaluacionComplementoModel($orientation = 'P', $unit = 'mm', $format)
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
        try {
            $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);

            //Logo de la entidad
            $this->pdf->Image($arrEstruct[0]->logo, 5, 5, 30, 10);
            $this->pdf->SetX(40);
            $this->pdf->SetFont('helvetica', 'B', 12);
            $this->pdf->MultiCell(null, 5, $nombreproceso, 0, 'C');

            $this->pdf->SetFont('helvetica', 'B', 8);
            $this->pdf->Ln(6);
            $this->pdf->Cell(156, 4, 'DATOS PERSONALES', 1, 0, 'C');
            $this->pdf->Cell(2, 4, ''); //Celda Vacia
            $this->pdf->Cell(null, 4, 'PERÍODO A EVALUAR', 1, 0, 'C');

            $imgdata = base64_decode($evaldo['foto']);
            // The '@' character is used to indicate that follows an image data stream and not an image file name
            $this->pdf->Image('@' . $imgdata, 5, 21, 25, 25);

            $this->pdf->SetFont('helvetica', 'B', 7);
            $this->pdf->SetXY(31, 21);
            $this->pdf->Cell(25, 4, 'Carnet de identidad', 1, 0, 'C');
            $this->pdf->Cell(30, 4, 'Nombre', 1, 0, 'C');
            $this->pdf->Cell(30, 4, 'Primer apellido', 1, 0, 'C');
            $this->pdf->Cell(30, 4, 'Segundo apellido', 1, 0, 'C');
            $this->pdf->Cell(15, 4, 'Sexo', 1, 0, 'C');
            $this->pdf->Cell(2, 4, ''); //Celda vacia
            $this->pdf->Cell(20, 4, 'Desde', 1, 0, 'C');
            $this->pdf->Cell(null, 4, 'Hasta', 1, 1, 'C');

            $this->pdf->SetFont('helvetica', '', 7);
            $this->pdf->SetX(31);
            $this->pdf->Cell(25, 4, $evaldo['numid'], 1);
            $this->pdf->Cell(30, 4, $evaldo['nombre'] . ' ' . $evaldo['snombre'], 1);
            $this->pdf->Cell(30, 4, $evaldo['papel'], 1);
            $this->pdf->Cell(30, 4, $evaldo['sapel'], 1);
            $this->pdf->Cell(15, 4, $evaldo['sexo'], 1, 0, 'C');
            $this->pdf->Cell(2, 4, ''); //Celda vacia
            $this->pdf->Cell(20, 4, $startDate, 1, 0, 'C');
            $this->pdf->Cell(null, 4, $endDate != 'null' ? $endDate : '', 1, 0, 'C');

            $this->pdf->Ln(5);
            $this->pdf->SetX(31);
            $this->pdf->SetFont('helvetica', 'B', 8);
            $this->pdf->Cell(130, 4, 'Denominación del cargo', 1, 0, 'C');
            $this->pdf->Cell(2, 4, ''); //Celda vacia
            $this->pdf->SetFont('helvetica', 'B', 8);
            $this->pdf->Cell(null, 4, 'EVALUACION', 1, 1, 'C');

            $this->pdf->SetX(31);
            $this->pdf->SetFont('helvetica', '', 7);
            $this->pdf->Cell(130, 4, $evaldo['cargo'], 1);
            $this->pdf->Cell(2, 4, ''); //Celda vacia
            $this->pdf->SetFont('helvetica', 'B', 8);

            if (empty($evaldo['idescala'])) {
                $this->pdf->Cell(null, 4, $evaldo['valor'], 1, 0, 'C'); //Resultado final de la evaluacion
            } else {
//                if ($idescalaTemp != $evaldo['idescala']) {
                $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($evaldo['idescala']);
//                    $idescalaTemp = $evaldo['idescala'];
//                }

                foreach ($valoresEscala as $valorEscala) {
                    if ($valorEscala['valor'] == $evaldo['valor']) {
                        $evaldo['valor'] = $valorEscala['denom'];
                        //Elimina el caracter de # del hexadecimal
                        $color = substr($valorEscala['color'], 1);
                        //Convierte a RGB el color que estaba en hexadecimal
                        list($r, $g, $b) = array_map('hexdec', str_split($color, 2));
                        //Establece el color del texto
                        $this->pdf->SetTextColor($r, $g, $b);
                        //Resultado final de la evaluacion
                        $this->pdf->Cell(null, 4, $valorEscala['denom'], 1, 0, 'C');
                        //Vuelve a poner el color negro para el texto
                        $this->pdf->SetTextColor(0, 0, 0);
                        break;
                    }
                }
            }
            $this->pdf->ln(5);
            $this->pdf->SetX(31);
            $this->pdf->Cell(null, 4, 'Área', 1, 1, 'C');
            $this->pdf->SetX(31);
            $this->pdf->SetFont('helvetica', '', 7);
            $this->pdf->Cell(null, 4, $evaldo['area'], 1);


            $this->pdf->Ln(5);
            $this->pdf->SetFont('helvetica', 'B', 8);
            $this->pdf->Cell(null, 4, 'DESGLOSE DE LA EVALUACION POR INDICADORES', 1, 0, 'C');
            //Establece el ancho que debe tomar cada columna que sea indicador
            $this->widthInd = $this->pdf->GetX() - 40;
            $this->pdf->Ln(4);
            $this->pdf->Cell(10, 4, 'No.', 1, 0);
            $this->pdf->Cell($this->widthInd, 4, 'Denominación del indicador', 1, 0);
            $this->pdf->Cell(null, 4, 'Evaluación', 1, 0, 'C');
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    private function createBody($evaluacion)
    {

        $cont = 0;
        $subCont = 1;
        $lastIdpadre = null;
        $this->pdf->SetFont('helvetica', '', 7);
//        foreach ($evaluacion as $indicador) {
//            $this->pdf->Ln(4);
//            //Para generar el numerador
//            if ($indicador['DatEvalindicadoresplanilla']['idindicadorplanilla'] ==
//                $indicador['DatEvalindicadoresplanilla']['idpadre']
//            ) {
//                $subCont = 1;
//                if ($lastIdpadre != $indicador['DatEvalindicadoresplanilla']['idpadre']) {
//                    $lastIdpadre = $indicador['DatEvalindicadoresplanilla']['idpadre'];
//                    $cont++;
//                }
//                $this->pdf->Cell(10, 4, $cont, 'B', 0);
//            } else {
//                $this->pdf->Cell(10, 4, $cont . '.' . $subCont++, 'B', 0);
//            }
//            $this->pdf->Cell(
//                $this->widthInd, 4,
//                $indicador['DatEvalindicadoresplanilla']['NomEvalindicadortexto']['denom'], 'B', 0
//            );
//            $this->pdf->Cell(null, 4, $indicador['valorMostrar'], 'B', 0, 'C');
//
//            if($indicador['complementotextual']!=null || $indicador['complementotextual']!=''){
//                $this->pdf->Ln(4);
//                $this->pdf->SetFont('helvetica', 'B', 7);
//                $this->pdf->Cell(40, 0, 'COMPLEMENTO TEXTUAL:', '', 0, 'C');
//                $this->pdf->SetFont('helvetica', '', 7);
//                $this->pdf->MultiCell(150, 0,$indicador['complementotextual'], 0, 'L', 0);
//            }
//        }
        $this->pdf->Ln(4);
        foreach ($evaluacion as $indicador) {
            $height = $this->pdf->getStringHeight($this->widthInd,$indicador['DatEvalindicadoresplanilla']['NomEvalindicadortexto']['denom'], false, true, '', 1);

            //Para generar el numerador
            if ($indicador['DatEvalindicadoresplanilla']['idindicadorplanilla'] ==
                $indicador['DatEvalindicadoresplanilla']['idpadre']
            ) {
                $subCont = 1;
                if ($lastIdpadre != $indicador['DatEvalindicadoresplanilla']['idpadre']) {
                    $lastIdpadre = $indicador['DatEvalindicadoresplanilla']['idpadre'];
                    $cont++;
                }
                $this->pdf->Cell(10, $height, $cont, 'B', 0);
            } else {
                $this->pdf->Cell(10, $height, $cont . '.' . $subCont++, 'B', 0);
            }

            // Primero me guardo las coordenadas donde comienza la celda multilinea.
            $y1 = $this->pdf->GetY();
            $x1 = $this->pdf->GetX();

            // Pinto la celda multilinea.
            $this->pdf->MultiCell(
                $this->widthInd, $height,
                $indicador['DatEvalindicadoresplanilla']['NomEvalindicadortexto']['denom'], 'B', 'L'
            );

            // Aquí obtengo la coordenada X donde quiero comenzar la siguiente columna, que no es otra cosa que la posición original más el ancho de la primera celda, en el caso del ejemplo es $this->widthInd.
            $posicionX = $x1 + $this->widthInd;

            // Por último, me sitúo en las coordenadas correspondientes a la misma fila y siguiente columna.
            $this->pdf->SetXY($posicionX,$y1);

            // Y ahora a pintar el resto de celdas con el mismo tamaño de alto para toda la fila.
            $this->pdf->Cell(null, $height, $indicador['valorMostrar'], 'B', 0, 'C');

            if($indicador['complementotextual']!=null || $indicador['complementotextual']!=''){
                $this->pdf->Ln($height);
                $this->pdf->SetFont('helvetica', 'B', 7);
                $this->pdf->Cell(40, 0, 'COMPLEMENTO TEXTUAL:', '', 0, 'C');
                $this->pdf->SetFont('helvetica', '', 7);
                $this->pdf->MultiCell(150, 0,$indicador['complementotextual'], 0, 'L', 0);
            }
            $this->pdf->Ln($height);
        }
    }

    private function createFooter($evaldo)
    {

        $this->pdf->Ln(2);
        $this->pdf->SetFont('helvetica', 'B', 8);
        $this->pdf->Cell(null, 4, 'CONCLUSIONES SOBRE EL ESTADO DE DESARROLLO DEL EVALUADO', 1, 1, 'C');
        $this->pdf->SetFont('helvetica', 'B', 7);
        $this->pdf->Cell(20, 4, 'Estado', 1);
        $this->pdf->SetFont('helvetica', '', 7);
        $this->pdf->Cell(null, 4, $evaldo['estadodesarrollo'], 1, 1);

        $this->pdf->Ln(2);
        $this->pdf->SetFont('helvetica', 'B', 8);
        $this->pdf->Cell(null, 4, 'OPINION DEL EVALUADO', 1, 1, 'C');
        $this->pdf->SetFont('helvetica', '', 7);
        $this->pdf->Cell(5, 4, ($evaldo['deacuerdo'] == 1 ? 'X' : ''), 'B', 0, 'C');
        $this->pdf->Cell(20, 4, 'De acuerdo');
        $this->pdf->Cell(4, 4, ($evaldo['deacuerdo'] == 2 ? 'X' : ''), 'B', 0, 'C');
        $this->pdf->Cell(20, 4, 'En desacuerdo');
        $this->pdf->Cell(30, 4, '¿Reclama?', 0, 0, 'C');
        $this->pdf->Cell(4, 4, ($evaldo['hareclamado'] == 1 ? 'X' : ''), 'B', 0, 'C');
        $this->pdf->Cell(10, 4, 'Si');
        $this->pdf->Cell(4, 4, ($evaldo['hareclamado'] == 0 ? 'X' : ''), 'B', 0, 'C');
        $this->pdf->Cell(10, 4, 'No');
        $this->pdf->Cell(20, 4, 'Fecha:', 0, 0, 'R');
        $this->pdf->Cell(20, 4, '', 'B', 0, 'C');
        $this->pdf->Cell(20, 4, 'Firma:', 0, 0, 'R');

        $this->pdf->Ln(7);
        $this->pdf->SetFont('helvetica', 'B', 8);
        $this->pdf->Cell(null, 4, 'Datos de la persona que certifica', 1, 1, 'C');
        $this->pdf->SetFont('helvetica', 'B', 7);
        $this->pdf->Cell(25, 4, 'Carnet de identidad', 1, 0, 'C');
        $this->pdf->Cell(30, 4, 'Nombre', 1, 0, 'C');
        $this->pdf->Cell(30, 4, 'Primer apellido', 1, 0, 'C');
        $this->pdf->Cell(30, 4, 'Segundo apellido', 1, 0, 'C');
        $this->pdf->Cell(null, 4, 'Cargo', 1, 0, 'C');

        $this->pdf->Ln(4);
        $this->pdf->SetFont('helvetica', '', 7);
        $this->pdf->Cell(25, 4, $evaldo['evaluador']['numid'], 1);
        $this->pdf->Cell(30, 4, $evaldo['evaluador']['nombre'] . ' ' . $evaldo['evaluador']['snombre'], 1);
        $this->pdf->Cell(30, 4, $evaldo['evaluador']['papel'], 1);
        $this->pdf->Cell(30, 4, $evaldo['evaluador']['sapel'], 1);
        $this->pdf->Cell(null, 4, $evaldo['evaluador']['cargo'], 1, 0, 'L');
//        $this->pdf->MultiCell(null, 4, , 1);

        $this->pdf->Ln(4);
        $this->pdf->Cell($this->widthInd - 30, 4, 'Fecha:', 0, 0, 'R');
        $this->pdf->Cell(20, 4, '', 'B', 0, 'C');
        $this->pdf->Cell(20, 4, 'Firma:', 0, 0, 'R');

    }

}