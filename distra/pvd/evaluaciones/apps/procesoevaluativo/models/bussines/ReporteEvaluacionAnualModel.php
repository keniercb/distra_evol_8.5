<?php

/**
 * Clase para crear la planilla evaluativa en formato PDF
 * Created by Ing.Juan Manuel Elias.
 * Date: 14/03/14
 * Time: 10:28
 */
class ReporteEvaluacionAnualModel extends ZendExt_Model
{

    private $pdf;
    private $widthInd;

    public function ReporteEvaluacionAnualModel($orientation = 'L', $unit = 'mm', $format = 'A4')
    {
        parent::ZendExt_Model();
        $this->widthInd = 300;

        $this->pdf = new TCPDF('L', PDF_UNIT, 'A2', true, 'UTF-8', false);
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('Sistema de Evaluación del Desempeño');
        $this->pdf->SetTitle('CERTIFICACIÓN ANUAL');
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
    public function createPDF($arrEvaluados, $startDate, $endDate,$idestructura,$paramsreporte,$evaluador)
    {
        $this->pdf->AddPage();
        $this->createHeader($idestructura);
        $this->createBody($arrEvaluados,$paramsreporte,$evaluador);
        $this->createFooter();

        // Close and output PDF document
        ob_clean();
        $this->pdf->Output("CERTIFICACIÓN.pdf", 'I');
        return true;
    }

    private function createHeader($idestructura)
    {
        try {
            //Logo de la entidad
            $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
            $this->pdf->Image($arrEstruct[0]->logo, 5, 5, 30, 10);
            $this->pdf->SetFont('helvetica', 'B', 10);
            $this->pdf->MultiCell(null, 5, '', 0, 'C');
            $this->pdf->SetFont('helvetica', 'B', 12);
            $this->pdf->MultiCell(null, 5, 'MODELO DE EVALUACIÓN                                ANEXO No 1', 0, 'C');
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    private function createBody($evaldo,$paramsreporte,$evaluador)
    {

        $lastIdpadre = null;
        $idpreprocesoevaluativo = $evaldo[0]->idpreprocesoevaluativo;
        $this->pdf->SetFont('helvetica', 'B', 8);
        $this->pdf->SetFillColor(230);
        $this->pdf->Ln(20);
        $this->pdf->SetX(15);
        $this->pdf->SetFont('helvetica', 'B', 10);
        $this->pdf->Cell(565, 10, 'MODELO DE EVALUACIÓN DEL RESULTADO DEL TRABAJO MENSUAL', 1, 0, 'C',1);
        $this->pdf->Ln(10);
        $this->pdf->SetX(15);
        $this->pdf->Cell(565, 10, 'Año:________________________                                                          Nombre y Apellidos:  '.$evaldo[0]->nombrecompleto, 1, 0, 'L',0);
        $this->pdf->Ln(10);
        $this->pdf->SetX(15);
        $this->pdf->Cell(565, 10, 'Cargo:  '.$paramsreporte[0]['cargo'].'                  Área de trabajo:  '.$paramsreporte[0]['area'], 1, 0, 'L',0);
        $this->pdf->Ln(10);
        $this->pdf->SetX(15);
        $this->pdf->Cell(70, 10, 'Aspectos/Calificación', 1, 0, 'L',1);
        $this->pdf->Cell(40, 10, 'PUNTOS', 1, 0, 'L',1);
        $this->pdf->Cell(35, 10, 'Enero', 1, 0, 'C',1);
        $this->pdf->Cell(35, 10, 'Febrero', 1, 0, 'C',1);
        $this->pdf->Cell(35, 10, 'Marzo', 1, 0, 'C',1);
        $this->pdf->Cell(35, 10, 'Abril', 1, 0, 'C',1);
        $this->pdf->Cell(35, 10, 'Mayo', 1, 0, 'C',1);
        $this->pdf->Cell(40, 10, 'Junio', 1, 0, 'C',1);
        $this->pdf->Cell(40, 10, 'Julio', 1, 0, 'C',1);
        $this->pdf->Cell(40, 10, 'Agosto', 1, 0, 'C',1);
        $this->pdf->Cell(40, 10, 'Septiembre', 1, 0, 'C',1);
        $this->pdf->Cell(40, 10, 'Octubre', 1, 0, 'C',1);
        $this->pdf->Cell(40, 10, 'Noviembre', 1, 0, 'C',1);
        $this->pdf->Cell(40, 10, 'Diciembre', 1, 0, 'C',1);

        foreach($paramsreporte as $r){
            foreach($r['DatEvalindicadoresevaluacion'] as $t){
                $this->pdf->Ln(10);
                $this->pdf->SetX(15);
                $indicador = $t['DatEvalindicadoresplanilla'] ['NomEvalindicadortexto'] ['denom'];
                if($t['DatEvalindicadoresplanilla']['idindicadorplanilla']!=null ){
                    $this->pdf->Cell(110, 10,$indicador, 1, 0, 'L',0);
                }

                if($indicador!='Trabajo en Equipo y participación en la solución de problemas' ||  $indicador!='Cumplimiento de las regulaciones de la actividad de Seguridad y Salud en el Trabajo'){
                    $this->pdf->Ln(10);
                    $this->pdf->SetX(15);
                    $this->pdf->Cell(70, 10,'Mala', 1);
                    $this->pdf->Cell(40, 10,'Hasta 9', 1);
                    $this->pdf->Ln(10);
                    $this->pdf->SetX(15);
                    $this->pdf->Cell(70, 10,'Regular', 1);
                    $this->pdf->Cell(40, 10,'de 10 a 15', 1);
                    $this->pdf->Ln(10);
                    $this->pdf->SetX(15);
                    $this->pdf->Cell(70, 10,'Buena', 1);
                    $this->pdf->Cell(40, 10,'de 16 a 20', 1);
                }else{
                    $this->pdf->Ln(10);
                    $this->pdf->SetX(15);
                    $this->pdf->Cell(70, 10,'Mala', 1);
                    $this->pdf->Cell(40, 10,'Hasta 4', 1);
                    $this->pdf->Ln(10);
                    $this->pdf->SetX(15);
                    $this->pdf->Cell(70, 10,'Regular', 1);
                    $this->pdf->Cell(40, 10,'de 5 a 7', 1);
                    $this->pdf->Ln(10);
                    $this->pdf->SetX(15);
                    $this->pdf->Cell(70, 10,'Buena', 1);
                    $this->pdf->Cell(40, 10,'de 8 a 10', 1);
                }




            }
        }


        $sql = "SELECT p.idperiodoproceso,p.denominacion
                        from mod_evaluaciones.dat_periodoproceso p
                        where p.idpreprocesoevaluativo = $idpreprocesoevaluativo
                        order by p.idperiodoproceso ASC
                        ";
        $arrperiodo = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        $count = 0;
        $personabuscar = array();
        foreach($evaldo as $r){
            $personabuscar[$count] = $r->idpersona;
            $count++;
        }
        $objEvaluados = new DatEvalpersonaevaluacion();

        $setx = 125;
        foreach($arrperiodo as $p){
            $this->pdf->SetX($setx);
            $idperiodoproceso = $p['idperiodoproceso'];
            $arrEvaluados = $objEvaluados->getEvaluacionCert(
                $idperiodoproceso, $evaluador,$personabuscar
            );

            $this->pdf->Ln(-270);
            $count =1;
            foreach($arrEvaluados[0]['DatEvalindicadoresevaluacion'] as $t){
                $this->pdf->SetX($setx);
                $this->pdf->Cell(35, 10,$t['valorMostrar'], 1, 0, 'C',0);
                $this->pdf->Ln(10);
                $this->pdf->SetX($setx);
                $this->pdf->Cell(35, 10,'  ', 1, 0, 'L',0);
                $this->pdf->Ln(10);
                $this->pdf->SetX($setx);
                $this->pdf->Cell(35, 10,' ', 1, 0, 'L',0);
                $this->pdf->Ln(10);
                $this->pdf->SetX($setx);
                $this->pdf->Cell(35, 10,' ', 1, 0, 'L',0);
                if( $count < count($arrEvaluados[0]['DatEvalindicadoresevaluacion'])){
                    $this->pdf->Ln(10);
                }
                $count++;

            }
            $setx = $setx + 35;
        }

        $this->pdf->Ln(10);
        $this->pdf->SetX(15);
        $this->pdf->Cell(110, 10,'TOTAL', 1, 0, 'C',0);

        $setx = 125;
        foreach($arrperiodo as $p){
            $this->pdf->SetX($setx);
            $idperiodoproceso = $p['idperiodoproceso'];
            $arrEvaluados = $objEvaluados->getEvaluacionCert(
                $idperiodoproceso, $evaluador,$personabuscar
            );
            $this->pdf->Cell(35, 10,$arrEvaluados[0]['valor'], 1, 0, 'C',0);

            $setx = $setx + 35;
        }
        $this->pdf->Ln(10);
        $this->pdf->SetX(15);
        $this->pdf->Cell(110, 10,'Firma del Trabajador:___________________________________', 0, 0, 'L',0);
        $this->pdf->Cell(50, 10,'LEYENDA:', 0, 0, 'L',0);
        $this->pdf->Cell(100, 10,'Muy Bien (de 91 a 100 puntos)', 0, 0, 'L',0);
        $this->pdf->Cell(100, 10,'Aceptable (de 70 a 80 puntos)', 0, 0, 'L',0);

        $this->pdf->Ln(10);
        $this->pdf->SetX(15);
        $this->pdf->Cell(110, 10,'Firma del Jefe Inmediato:_________________________________', 0, 0, 'L',0);
        $this->pdf->Cell(50, 10,' ', 0, 0, 'L',0);
        $this->pdf->Cell(100, 10,'Satisfactorio (de 81 a 90 puntos)', 0, 0, 'L',0);
        $this->pdf->Cell(100, 10,'Deficiente (menos de 70 puntos)', 0, 0, 'L',0);

    }

    private function createFooter()
    {
        $fecha = Date('d/m/Y');
        $arrayfecha = explode('/',$fecha);
        $this->pdf->Ln(10);
        $this->pdf->SetX(400);
        $this->pdf->SetFont('helvetica', '', 11);
        $this->pdf->MultiCell(null, 5, 'Y para que así conste firmamos la presente a los '. $arrayfecha[0].' días del mes '.$arrayfecha[1]. ' de '.$arrayfecha[2].', "Año 60 de la Revolución".', 0, 'L');


    }

    public function VariasLineasValoracion($cadena, $total)
    {

        while (!(strlen($cadena) == '')) {
            $subcadena = substr($cadena, 12, 50);
            $total.= $subcadena;
            $cadena = substr($cadena, 50);

        }

        $this->pdf->MultiCell(70,10, "" . utf8_decode($total),1,'L');

    }

}
