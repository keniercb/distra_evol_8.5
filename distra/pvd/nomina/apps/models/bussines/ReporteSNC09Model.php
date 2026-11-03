<?php

/**
 * Controlador para gestionar elementos salariales a las personas.
 *
 * @author Ing. Tte. Frank Rodriguez Berroa e Ing. Dainier Velázquez Labrada.
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

    private $longitudhoja = 280;

    function Footer()
    {
        $this->SetFont('Arial', 'B', 8);
        $this->SetY(-20);
        $this->SetX(2);
        $this->Cell($this->longitudhoja, 5, utf8_decode("POR EL AREA DE RECURSOS HUMANOS"), 0, 1, "C");
        $this->Cell($this->longitudhoja * 0.70, 10, utf8_decode("NOMBRE Y APELLIDOS DEL JEFE DE AREA: ____________________________________________________________________________________"), 0, 0, "L");
        $this->Cell($this->longitudhoja * 0.30, 10, utf8_decode("FIRMA DEL JEFE DE AREA: _______________"), 0, 1, "C");
        $this->Cell(0, 5, ' ' . $this->PageNo(), 0, 0, 'C');
    }
}

class ReporteSNC09Model extends ZendExt_Model
{
    private $anchohoja = 216;
    private $tamannoletra = 12;
    private $altocelda = 5;
    private $marginleft = 20;

    public function construirReporteSNC09($datospersona, $operaciones, $idestructura)
    {
        //Obteniendo los datos de la entidad
        $arrUM = HisRetencionesPersona::obtenerDatosEntidadDadoId($idestructura);

        //Obteniendo las operaciones del SNC de la persona en grupos de 10
        $operacionesaux = array();
        foreach ($operaciones as &$datos) {
            $datos = array_pad($datos, 10, array());//rellenando los grupos en el caso que no lleguen a 10
            $operacionesaux[] = array_chunk($datos, 5);//dividiendo los grupos de 10 en 5
        }

        //Definiendo el arreglo de meses
        $fechaactual = getdate();
        $meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        //Creando el reporte PDF
        $pdf = new fpdf('P', 'mm', 'Letter');
        $pdf->SetAuthor("Tte. Ing. Frank Rodriguez Berroa, Ing. Dainier Velázquez Labrada");
        $pdf->SetTitle("Modelo-SC-4-09");
        $pdf->SetLeftMargin(2);

        //Iterando todas las operaciones de 10 en 10 por hojas
        foreach ($operacionesaux as $objdatossalario) {
            //Pintando el encabezado-------------------------
            $pdf->AddPage();
            $pdf->SetFont('Arial', 'B', $this->tamannoletra);
            $pdf->Cell($this->anchohoja - 4, $this->altocelda, utf8_decode("CERTIFICACIÓN DE AÑOS DE SERVICIOS Y SALARIOS DEVENGADOS"), 0, 1, 'C');
            $pdf->Cell($this->anchohoja - 4, $this->altocelda, utf8_decode("SC-4-09"), 0, 1, 'C');
            $pdf->Ln(5);

            //Pintando el cuerpo-----------------------------
            $pdf->SetLeftMargin($this->marginleft);

            //Pintando la 1era fila
            $texto = "El trabajador";
            $valor = $datospersona->data[0]['nombreapellidos'];
            $this->fnPintarTextoValorFila($pdf, $texto, $valor, $this->anchohoja, $this->altocelda, 0, 1, 'L');

            //Pintando la 2da fila
            $pdf->Ln(3);
            $texto = "con Expediente Laboral";
            $valor = $datospersona->data[0]['numid'];
            $this->fnPintarTextoValorFila($pdf, $texto, $valor, $this->anchohoja * 0.6, $this->altocelda, 0, 0, 'C');
            $texto = "y Carnet de identidad No.";
            $valor = $datospersona->data[0]['numid'];
            $this->fnPintarTextoValorFila($pdf, $texto, $valor, $this->anchohoja * 0.605, $this->altocelda, 0, 1, 'C');

            //Pintando la 3era fila
            $pdf->Ln(3);
            $texto = "que ocupa la plaza de";
            $valor = $datospersona->data[0]['denomcargo'];
            $this->fnPintarTextoValorFila($pdf, $texto, $valor, $this->anchohoja, $this->altocelda, 0, 1, 'L');

            //Pintando la 4ta fila
            $pdf->Ln(3);
            $texto = "según documentos que obran en nuestro poder, ha prestado servicios en la entidad";
            $this->fnPintarTextoValorFila($pdf, $texto, null, $this->anchohoja, $this->altocelda, 1, null, 'C');

            //Pintando la 5ta fila
            $pdf->Ln(3);
            $valor = $arrUM[0]['codigo'] . '-' . $arrUM[0]['denominacion'];
            $this->fnPintarTextoValorFila($pdf, null, $valor, $this->anchohoja, $this->altocelda, null, 1, 'C');

            //Pintando la 6ta fila
            $pdf->Ln(3);
            $longtexto = $this->anchohoja - (2 * $this->marginleft) - 4;
            $pdf->SetFont('Arial', 'I', $this->tamannoletra);
            $pdf->MultiCell($longtexto, $this->altocelda, utf8_decode($arrUM[0]['direccion']), 0);

            //Pintando la 7ma fila
            $pdf->Ln(3);
            $texto = "Desde el mes de ________";
            $this->fnPintarTextoValorFila($pdf, $texto, null, $this->anchohoja * 0.3, $this->altocelda, 0, null, 'C');
            $texto = "de ____";
            $this->fnPintarTextoValorFila($pdf, $texto, null, $this->anchohoja * 0.1, $this->altocelda, 0, null, 'C');
            $texto = "al mes de ________";
            $this->fnPintarTextoValorFila($pdf, $texto, null, $this->anchohoja * 0.2, $this->altocelda, 0, null, 'C');
            $texto = "de ____.";
            $this->fnPintarTextoValorFila($pdf, $texto, null, $this->anchohoja * 0.1, $this->altocelda, 0, null, 'C');
            //Obteniendo los días trabajados
            $diastrab = 0;
            foreach ($objdatossalario as $robj)
                foreach ($robj as $rannos)
                    foreach ($rannos->meses as $rmeses)
                        $diastrab += $rmeses['diastrabajados'];
            $texto = "Días trabajados";
            $valor = $diastrab;
            $this->fnPintarTextoValorFila($pdf, $texto, $valor, $this->anchohoja * 0.4, $this->altocelda, 0, 1, 'C');

            //Pintando la 8va fila
            $pdf->Ln(3);
            $texto = "Y ha devengado en los últimos 10 años los salarios que se relacionan a continuación:";
            $this->fnPintarTextoValorFila($pdf, $texto, null, $this->anchohoja, $this->altocelda, 1, 1, 'C');

            //Pintando la 9na fila
            $pdf->Ln(2);
            $long = $this->anchohoja - (2 * $this->marginleft) - 4;
            $textoanno = "AÑO";
            $textoimporte = "IMPORTE RECIBIDO";

            $pdf->Cell($long * 0.1, $this->altocelda, utf8_decode($textoanno), 0, 0, 'C');
            $pdf->Cell($long * 0.05, $this->altocelda, '', 0, 0, 'C');
            $pdf->Cell($long * 0.3, $this->altocelda, utf8_decode($textoimporte), 0, 0, 'C');
            $pdf->Cell($long * 0.05, $this->altocelda, '', 0, 0, 'C');
            $pdf->Cell($long * 0.1, $this->altocelda, utf8_decode($textoanno), 0, 0, 'C');
            $pdf->Cell($long * 0.05, $this->altocelda, '', 0, 0, 'C');
            $pdf->Cell($long * 0.3, $this->altocelda, utf8_decode($textoimporte), 0, 0, 'C');
            $pdf->Cell($long * 0.05, $this->altocelda, '', 0, 1, 'C');
            $pdf->Ln(3);

            //Pintando la 10ma a la 14ta fila
            $x_segundacolumna = -1;
            $y_segundacolumna = -1;
            foreach ($objdatossalario[0] as $pos => $rannos) {//5 años de la columna izquierda
                $anno = $rannos->anno;
                $salariodevengadoanno = 0;
                foreach ($rannos->meses as $rmeses) {
                    $salariodevengadoanno += $rmeses['salariodevengado'];
                }
                $salariodevengadoanno = (!empty($anno)) ? number_format($salariodevengadoanno, 2, '.', '') : null;
                $pdf->Cell($long * 0.1, $this->altocelda, $anno, 'B', 0, 'C');
                $pdf->Cell($long * 0.05, $this->altocelda, '', 0, 0, 'C');
                $pdf->Cell($long * 0.3, $this->altocelda, $salariodevengadoanno, 'B', 0, 'C');
                //obteniendo las coordenadas donde se pintará el primer elemento de la columna derecha
                if ($pos == 0) {
                    $x_segundacolumna = $pdf->GetX();
                    $y_segundacolumna = $pdf->GetY();
                }
                $pdf->Cell($long * 0.05, $this->altocelda, '', 0, 1, 'C');
            }

            $pdf->SetY($y_segundacolumna);//seteando la Y
            foreach ($objdatossalario[1] as $rannos) {//5 años de la columna derecha
                $pdf->SetX($x_segundacolumna + $long * 0.05);//seteando la X en cada iteración(salto de línea)
                $anno = $rannos->anno;
                $salariodevengadoanno = 0;
                foreach ($rannos->meses as $rmeses) {
                    $salariodevengadoanno += $rmeses['salariodevengado'];
                }
                $salariodevengadoanno = (!empty($anno)) ? number_format($salariodevengadoanno, 2, '.', '') : null;
                $pdf->Cell($long * 0.1, $this->altocelda, $anno, 'B', 0, 'C');
                $pdf->Cell($long * 0.05, $this->altocelda, '', 0, 0, 'C');
                $pdf->Cell($long * 0.3, $this->altocelda, $salariodevengadoanno, 'B', 0, 'C');
                $pdf->Cell($long * 0.05, $this->altocelda, '', 0, 1, 'C');
            }

            //Pintando la 15ta fila
            $pdf->Ln(10);

            $texto = "Y para constancia se expide esta certificación por el Jefe del área de Economía de ";
            $this->fnPintarTextoValorFila($pdf, $texto, null, $this->anchohoja, $this->altocelda, 1, 1, 'C');

            //Pintando la 16ta fila
            $pdf->Ln(3);
            $texto = "acuerdo con los requisitos establecidos en la Legislación de Seguridad Social vigente.";
            $this->fnPintarTextoValorFila($pdf, $texto, null, $this->anchohoja, $this->altocelda, 1, 1, 'C');

            //Pintando la 17ma fila
            $pdf->Ln(3);
            $texto = "Dado en  ____________________";
            $this->fnPintarTextoValorFila($pdf, $texto, null, $this->anchohoja * 0.2, $this->altocelda, 0, 0, 'C');
            $texto = ", a los";
            $valor = $fechaactual['mday'];
            $this->fnPintarTextoValorFila($pdf, $texto, $valor, $this->anchohoja * 0.3, $this->altocelda, 0, 0, 'C');
            $texto = "días del mes de";
            $valor = $meses[$fechaactual['mon'] - 1];
            $this->fnPintarTextoValorFila($pdf, $texto, $valor, $this->anchohoja * 0.5, $this->altocelda, 0, 0, 'C');
            $texto = "de";
            $valor = $fechaactual['year'];
            $this->fnPintarTextoValorFila($pdf, $texto, $valor, $this->anchohoja * 0.3, $this->altocelda, 0, 1, 'C');

            //Pintando la 18va fila
            $pdf->Ln(3);
            $texto = "OBSERVACIONES:";
            $this->fnPintarTextoValorFila($pdf, $texto, null, $this->anchohoja, $this->altocelda, 1, 1, 'C');

            //Pintando el pie de firma
            $pdf->Ln(30);
            $long = $this->anchohoja - (2 * $this->marginleft) - 4;
            $texto = "NOMBRES Y APELLIDOS DE QUIEN CERTIFICA";
            $pdf->Cell($long * 0.6, $this->altocelda, utf8_decode($texto), "T", 0, 'C');
            $pdf->Cell($long * 0.2, $this->altocelda, "", 0, 0, 'L');
            $texto = "FIRMA Y CUÑO";
            $pdf->Cell($long * 0.2, $this->altocelda, utf8_decode($texto), "T", 0, 'C');
        }

        $pdf->Output();
    }

    private function fnPintarTextoValorFila(&$pdf, $texto = null, $valor = null, $ancho, $altocelda, $saltolinea_t, $saltolinea_v, $alineacionvalor)
    {
        //Pintando el texto en la primera celda
        $longtexto = 0;
        if (!empty($texto)) {
            $longtexto = $pdf->GetStringWidth(utf8_decode($texto)) + 2;
            $pdf->SetFont('Arial', '', $this->tamannoletra);
            $pdf->Cell($longtexto, $altocelda, utf8_decode($texto), 0, $saltolinea_t, 'L');
        }

        //Pintando el valor en la segunda celda
        if (!empty($valor)) {
            $longvalor = $ancho - (2 * $this->marginleft) - $longtexto - 4;
            $pdf->SetFont('Arial', '', $this->tamannoletra);
            $pdf->Cell($longvalor, $altocelda, utf8_decode($valor), "B", $saltolinea_v, $alineacionvalor);
        }
    }
}

 

