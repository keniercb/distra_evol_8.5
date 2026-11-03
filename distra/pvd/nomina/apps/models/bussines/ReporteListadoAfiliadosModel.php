<?php

/**
 * @author Ing. Dainier Valazquez Labrada
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses
 * @copyright UCID
 * @version 1.0
 */
class PdfClass extends fpdf
{
    function Footer()
    {
        $fecha = date('d-m-Y');
        $hora = date('h:i:s A');
        $this->SetFont('Arial', 'B', 8);
        $this->SetY(-30);
        $this->SetX(20);
        $this->Write(5, 'POR RECURSOS HUMANOS');
        $this->SetX(215);
        $this->Write(5, 'FECHA IMPRESION: ');
        $this->SetFont('Arial', '', 8);
        $this->Write(5, $fecha);
        $this->SetFont('Arial', 'B', 8);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'ELABORADO POR:');
        $this->SetX(215);
        $this->Write(5, 'HORA IMPRESION: ');
        $this->SetFont('Arial', '', 8);
        $this->Write(5, $hora);
        $this->SetFont('Arial', 'B', 8);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'REVISADO Y APROBADO POR:');
        $this->SetFont('Arial', 'B', 8);
        $this->Ln(10);
        $this->Cell(0, 5, ' ' . $this->PageNo(), 0, 0, 'C');
    }
}

class ReporteListadoAfiliadosModel extends ZendExt_Model
{
    private $identidad = 0;
    private $arridfechascierre = null;
    private $tipoafiliacion = 0;
    private $organizacion = '';
    private $personas = null;
    private $columnas = null;
    private $escala = '';

    public function ReporteListadoAfiliadosModel()
    {
        parent::ZendExt_Model();

    }

    public function fnMostrarEscala($escala)
    {
        $escala = str_ireplace('SI_', 'Si', $escala);
        $escala = str_ireplace('SINO', '', $escala);
        $escala = str_ireplace('ISalario_0', 'total', $escala);
        $escala = str_ireplace('ENTONCES DEVOLVER', 'Pagar', $escala);
        $escala = str_ireplace('==', '=', $escala);
        $escala = str_ireplace('&&', 'y', $escala);

        $escala = str_ireplace('total * 0.03', '3% del total', $escala);
        $escala = str_ireplace('total * 0.02', '2% del total', $escala);


        $escala = trim($escala, ';');
        $arrescala = explode(';', $escala);
//        $escala = '';
//        foreach ($arrescala as $parte) {
//            // $escala .= $parte . "</br>";
//        }
        return $escala;
    }

    public function exportarReporte($identidad, $arridfechascierre, $tipoafiliacion, $personas, $columnas, $escala)
    {
        $this->identidad = $identidad;
        $this->arridfechascierre = $arridfechascierre;
        $this->tipoafiliacion = $tipoafiliacion;
        $this->organizacion = $tipoafiliacion;
        $this->personas = $personas;
        $this->columnas = $columnas;
        $this->escala = $this->fnMostrarEscala($escala);
        $pdf = new PdfClass('L', 'mm', 'Letter');
        $pdf->SetLeftMargin(2);
        $pdf->SetTopMargin(2);
        $pdf->AddPage();
        $this->fnCrearCuerpo($pdf);
        $pdf->Output();
    }

    public function fnLongitudesColumnas(&$pdf)
    {
        $longtotalcol = 210;
        $longrealcol = 0;
        $cantcolumnas = count($this->columnas);
        $cantcolumnas = 4;
        $longmediador = $longtotalcol / $cantcolumnas;

        $r = array();
        foreach ($this->columnas as $col) {
            if ($col == 'Total' || $col == 'Escala' || $col == 'Redondeo' || $col == 'Pago') {
                $longrealcol += intval($pdf->GetStringWidth($col));
            }
            //$longrealcol += intval($pdf->GetStringWidth($col));
        }

        if ($longrealcol <= $longtotalcol) {
            foreach ($this->columnas as $i => $col) {
                if ($col == 'Total' || $col == 'Escala' || $col == 'Redondeo' || $col == 'Pago') {
                    $r[$col] = $pdf->GetStringWidth($col) + (($longtotalcol - $longrealcol) / $cantcolumnas);
                }
                //$r[$col] = $pdf->GetStringWidth($col) + (($longtotalcol - $longrealcol) / count($this->columnas));
            }
        } else {
            foreach ($this->columnas as $i => $col) {
                if ($col == 'Total' || $col == 'Escala' || $col == 'Redondeo' || $col == 'Pago') {
                    $r[$col] = $longmediador;
                }
                //$r[$col] = $longmediador;
            }
            $r['cantcaracteres'] = 7;
        }

        return $r;
    }

    public function fnCrearCuerpo(&$pdf)
    {
        $arrlongitudes = $this->fnLongitudesColumnas($pdf);
        $this->fnCrearCabezera($pdf, $arrlongitudes);

        //Definiendo el array de plantillas nominales
        $aux = array();
        foreach ($this->personas as $key => $row) {
            $aux[$row['idarea']] = $row['area'];
        }
        //Determinando la cantidad de personas por areas.
        $arrayplantillas = array();
        foreach ($aux as $a => $area) {
            $cont = 0;
            foreach ($this->personas as $i => $persona) {
                $cont += ($persona['idarea'] == $a) ? 1 : 0;
            }
            $arrayplantillas[$a]['denominacion'] = (count(explode('-', $area)) > 1) ? explode('-', $area)[1] : $area;;
            $arrayplantillas[$a]['cantpersonas'] = $cont;
        }

        $arrtotales = array();
        $cont = 0;
        foreach ($arrayplantillas as $a => $area) {
            $arrsubtotales = array();
            $this->fnAdicionarPagina($pdf, $arrlongitudes);
            $pdf->SetFillColor(200);//Definiendo el color de celdas
            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Cell(276, 6, utf8_decode($area['denominacion'] . ' : (' . $area['cantpersonas'] . ' ' . (($area['cantpersonas'] > 1) ? 'personas' : 'persona') . ')'), 1, 1, 'L', 1);
            foreach ($this->personas as $p => $persona) {
                if ($persona['idarea'] == $a) {//Personas del area especifica
                    $this->fnAdicionarPagina($pdf, $arrlongitudes);
                    if ($persona['organizacion'] == $this->organizacion) {
                        $cont++;
                        //Letra del cuerpo de la tabla
                        $pdf->SetFont('Arial', '', 8);
                        $pdf->Cell(6, 6, $cont, 1, 0, 'C');
                        $pdf->Cell(60, 6, utf8_decode($persona['nombreapellidos']), 1, 0, 'L');

                        foreach ($this->columnas as $col) {
                            if ($col == 'Total' || $col == 'Escala' || $col == 'Redondeo' || $col == 'Pago') {
                                $pdf->SetFillColor(240);//Definiendo el color de celdas
                                $fill = ($col == 'Total' || $col == 'Pago') ? 1 : 0;
                                $pdf->Cell($arrlongitudes[$col], 6, $persona[$col], 1, 0, 'R', $fill);
                                $arrsubtotales[$col] += $persona[$col];
                                $arrtotales[$col] += $persona[$col];
                            }
                        }
                        $pdf->Cell(1, 6, '', 0, 1);
                    }
                }
            }
            //Subtotales
            $pdf->SetFont('Arial', 'B', 8);
            $pdf->SetFillColor(200);//Definiendo el color de celdas
            $pdf->Cell(66, 5, utf8_decode('Subtotales:'), 1, 0, 'C', 0);

            foreach ($arrsubtotales as $s => $subt) {
                $pdf->SetFillColor(240);//Definiendo el color de celdas
                $fill = ($s == 'Total' || $s == 'Pago') ? 1 : 0;
                $pdf->Cell($arrlongitudes[$s], 5, number_format($subt, 2, '.', ''), 1, 0, 'R',$fill);
                $arrsubtotales[$s] = 0;//Vaciando el arreglo de subtotales
            }
            $pdf->Cell(1, 6, '', 0, 1);
        }

        //Totales
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->SetFillColor(200);//Definiendo el color de celdas
        $pdf->Cell(66, 5, utf8_decode('Total'), 1, 0, 'C', 1);
        foreach ($arrtotales as $t => $tot) {
            $pdf->SetFillColor(240);//Definiendo el color de celdas
            $fill = ($t == 'Total' || $t == 'Pago') ? 1 : 0;
            $pdf->Cell($arrlongitudes[$t], 5, number_format($tot, 2, '.', ''), 1, 0, 'R',$fill);
        }

        //Escala
        $pdf->Cell(1, 6, '', 0, 1);
        $pdf->SetFont('Arial', '', 8);
        $pdf->SetFillColor(240);//Definiendo el color de celdas
        $pdf->Cell(66, 5, 'Escala', 1, 0, 'C', 1);
        $pdf->MultiCell(210, 5, utf8_decode($this->escala));
    }

    public function fnCrearCabezera(&$pdf, $arrlongitudes)
    {
        $pdf->SetFont('Arial', 'B', 10);
        //Titulo
        $genero = ($this->tipoafiliacion == "PCC") ? "AL " : "A LA ";
        $pdf->Text(105, 10, "LISTADO DE PERSONAS AFILIADAS " . $genero . $this->organizacion);
        $pdf->Ln(5);

        //Logo de la entidad
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        list($imagenBase64,) = explode(';',  $arrEstruct[0]->logo);
        list(,$extension) = explode('/',  $imagenBase64);
        if(!empty($arrEstruct[0]->logo)){
            $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }
        $pdf->Ln(8);

        /*$register = Zend_Registry::getInstance();
        $direccion = $register->config->modulo_path . 'views/images/logotrd.jpg';
        $pdf->Image($direccion, 5, 5, 22, 10);
        $pdf->Ln(8);*/

        //Nombre de la empresa
        $nombreempresa = utf8_decode(ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($this->identidad)[0]->denominacion);
        $pdf->SetX(0);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(20, 10, 'Empresa: ', 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(90, 10, $nombreempresa, 0, 0, 'L', 0);
        $pdf->Ln(8);

        //Encabezado
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(6, 5, 'No.', 1, 0, 'C', 0);
        //$pdf->Cell(20, 5, 'CI', 1, 0, 'C', 0);
        $pdf->Cell(60, 5, 'Nombre y apellidos', 1, 0, 'C', 0);
        $pdf->SetFillColor(240);//Definiendo el color de celdas
        foreach ($this->columnas as $col) {
            if ($col == 'Total' || $col == 'Escala' || $col == 'Redondeo' || $col == 'Pago') {
                $fill = ($col == 'Total' || $col == 'Pago') ? 1 : 0;
                $pdf->Cell($arrlongitudes[$col], 5, utf8_decode($col), 1, 0, 'C', $fill);
            }
        }
        $pdf->Cell(1, 5, '', 0, 1);
        return $pdf;
    }


    public function fnAdicionarPagina(&$pdf, $arrlongitudes)
    {
        //Cambio de hoja
        $y = $pdf->GetY();
        if ($y >= '180') {
            $pdf->AddPage();
            $this->fnCrearCabezera($pdf, $arrlongitudes);
        }
    }
}



