<?php

/**
 * Controlador para gestionar elementos salariales a las personas.
 *
 * @author Ing. Milena Gainza Rodríguez.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses
 * @copyright UCID
 * @version 1.0
 */
class Mipdf extends fpdf
{

    private $arrayEncabezado;
    private $arrayDatos;
    private $agrupador;
    private $tamannoLetraContenido;
    private $tamannoLetraEncabezado;
    private $ajusteancho;
    private $ajustepos;
    private $arraytamannosencabezados;
    private $arrayposicionencabezados;
    private $ancho;
    private $largo;

    function __construct($arrayDatos, $arrayEncabezado, $orientation = 'L', $unit = 'mm', $format = 'A4')
    {
        parent::fpdf($orientation, $unit, $format);
        $this->arrayDatos = $arrayDatos;
        $this->arrayEncabezado = $arrayEncabezado;
        $this->tamannoLetraContenido = 6;
        $this->tamannoLetraEncabezado = 8;
        $this->ajusteancho = 0;
        $this->ajustepos = 0;
        $this->arraytamannosencabezados = array();
        $this->arrayposicionencabezados = array();
        $this->SetX(-1);
        $this->ancho = $this->GetX() + 1;
        $this->SetX(0);
        $this->SetY(-1);
        $this->largo = $this->GetY() + 1;
        $this->SetY(0);
        $this->guardarAnchosColumnas();
    }

    /**
     * @param mixed $arrayEncabezado
     */
    public function setArrayEncabezado($arrayEncabezado)
    {
        $this->arrayEncabezado = $arrayEncabezado;
    }

    /**
     * @return mixed
     */
    public function getArrayEncabezado()
    {
        return $this->arrayEncabezado;
    }

    /**
     * @param mixed $arrayDatos
     */
    public function setArrayDatos($arrayDatos)
    {
        $this->arrayDatos = $arrayDatos;
    }

    /**
     * @return mixed
     */
    public function getArrayDatos()
    {
        return $this->arrayDatos;
    }

    /**
     * @param mixed $tamannoLetraEncabezado
     */
    public function setTamannoLetraEncabezado($tamannoLetraEncabezado)
    {
        $this->tamannoLetraEncabezado = $tamannoLetraEncabezado;
    }

    /**
     * @return mixed
     */
    public function getTamannoLetraEncabezado()
    {
        return $this->tamannoLetraEncabezado;
    }

    /**
     * @param mixed $tamannoLetraContenido
     */
    public function setTamannoLetraContenido($tamannoLetraContenido)
    {
        $this->tamannoLetraContenido = $tamannoLetraContenido;
    }

    /**
     * @return mixed
     */
    public function getTamannoLetraContenido()
    {
        return $this->tamannoLetraContenido;
    }

    function Footer()
    {
        $fecha = date('d-m-Y');
        $hora = date('h:i:s A');

        $this->SetFont('Arial', 'B', 4);
        $this->SetY(-30);
        $this->SetX(20);
        $this->Write(5, 'POR RECURSOS HUMANOS');
//      $this->SetX(135);
//      $this->Write(5, 'POR EL AREA CONTABLE');
        $this->SetX(230);
        $this->Write(5, 'FECHA IMPRESION: ');
        $this->SetFont('Arial', '', 4);
        $this->Write(5, $fecha);
        $this->SetFont('Arial', 'B', 4);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'ELABORADO POR:');
//      $this->SetX(135);
//      $this->Write(5, 'REVISADO POR:');
        $this->SetX(230);
        $this->Write(5, 'HORA IMPRESION: ');
        $this->SetFont('Arial', '', 4);
        $this->Write(5, $hora);
        $this->SetFont('Arial', 'B', 4);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'REVISADO Y APROBADO POR:');
//      $this->SetX(135);
//      $this->Write(5, 'CONTABILIZADO POR:');
        $this->SetFont('Arial', 'B', 6);
        $this->Ln(10);
        $this->Cell(0, 5, ' ' . $this->PageNo(), 0, 0, 'C');


    }

    public function pintarPdf()
    {


    }

    public function pintarEncabezado()
    {

        $this->SetFont('Arial', 'B', $this->tamannoLetraEncabezado);
        foreach ($this->arrayEncabezado as $clave => $texto) {
            $anchoCelda = $this->arraytamannosencabezados[$clave];
            $posCelda = $this->arrayposicionencabezados[$clave];
            /*echo 'indice '.$clave.'<br/>';
            echo 'posicion '.$posCelda.'<br/>';
            echo 'ancho '.$anchoCelda.'<br/><br/>';*/
            $this->pintarCelda($texto, $anchoCelda, $posCelda, 'L', true);
        }
        $this->Ln();
        $this->SetFont('Arial', '', $this->tamannoLetraContenido);
    }

    private function dameAgrupador()
    {
        return array_keys($this->arrayDatos[0])[count(array_keys($this->arrayDatos[0])) - 1];
    }

    private function adicionarPagina()
    {
        /*print_r($this->largo-150);
        echo('<br/>');
        print_r($this->ancho);
        die;*/
        if ($this->GetY() >= ($this->largo - 40)) {
            $this->AddPage();
        }
    }

    public function pintarContenido()
    {
        $cant = count(array_keys($this->arrayEncabezado));
        // print_r($cant);die;
        $datos = $this->arrayDatos;
        $agrupador = $this->dameAgrupador();

        $copiaagrupador = $datos[0][$agrupador];

        $this->pintarCelda($this->arrayDatos[0][$agrupador], $this->ancho, 0, 'C', true, 1);
        $this->pintarEncabezado();
        foreach ($datos as $clave => $valor) {
            if ($valor[$agrupador] != $copiaagrupador) {
                $this->pintarCelda($valor[$agrupador], $this->ancho, 0, 'C', false, 1);
                $this->pintarEncabezado();
            }
            $i = 0;
            foreach ($valor as $c => $texto) {
                if ($i == $cant) {
                    continue;
                } else {
                    $anchoCelda = $this->arraytamannosencabezados[$i];
                    $posCelda = $this->arrayposicionencabezados[$i];
                    $this->pintarCelda($texto, $anchoCelda, $posCelda, 'L', false);
                    $i++;

                }

            }

            $this->Ln();

            $copiaagrupador = $valor[$agrupador];
        }
    }

    private function guardarAnchosColumnas()
    {
        $pos = 1;
        $clavesDatos = array_keys($this->arrayDatos[0]);
        $cant = count(array_keys($this->arrayEncabezado));
        // print_r($cant);die;

        foreach ($this->arrayEncabezado as $clave => $valor) {
            $this->SetFont('Arial', 'B', $this->tamannoLetraEncabezado);
            $largoinicialEncabezado = $this->GetStringWidth($valor) + 2;
            $mayor = -9999999999;
            foreach ($this->arrayDatos as $key => $val) {
                if ($key == $cant) {
                    continue;
                } else {
                    //print_r($val[$clavesDatos[$clave]]);echo'<br/>';
                    $this->SetFont('Arial', '', $this->tamannoLetraContenido);
                    $largo = $this->GetStringWidth($val[$clavesDatos[$clave]]);

                    if ($largo > $mayor) {
                        $mayor = $largo;
                    }
                }

            }
            if ($largoinicialEncabezado >= $mayor) {
                $this->arraytamannosencabezados[$clave] = $largoinicialEncabezado + 1.5;
            } else {
                $this->arraytamannosencabezados[$clave] = $mayor + 1.5;
            }
            $this->arrayposicionencabezados[$clave] = $pos;
            $pos += $this->arraytamannosencabezados[$clave];

        }
        // print_r($this->arraytamannosencabezados);  die;
        $this->SetFont('Arial', '', $this->tamannoLetraContenido);
        return $this->arraytamannosencabezados;
    }

    public function pintarCelda($texto, $ancho = false, $posicion = false, $alineacion = 'L', $encabezado = false, $saltodelinea = 0)
    {
        $posicion = ($posicion) ? $posicion : $this->GetX();
        // $ancho    = ($ancho) ? $ancho : $this->GetStringWidth($texto);
        $this->SetFillColor(200);
        $tamannoletra = ($encabezado) ? $this->tamannoLetraEncabezado : $this->tamannoLetraContenido;
        $this->SetX($posicion - $this->ajustepos);
        $this->adicionarPagina();
        if ($encabezado) {
            $this->Cell($ancho - $this->ajusteancho, $tamannoletra, utf8_decode($texto), 0, $saltodelinea, $alineacion, 1);
        } else {
            $this->Cell($ancho - $this->ajusteancho, $tamannoletra, utf8_decode($texto), 0, $saltodelinea, $alineacion);
        }
    }


}

class PDFNomina extends fpdf
{
    function Footer()
    {
        $fecha = date('d-m-Y');
        $hora = date('h:i:s A');

        $this->SetFont('Arial', 'B', 6);
        $this->SetY(-20);
        $this->SetX(20);
        $this->Write(5, 'POR RECURSOS HUMANOS');
        $this->SetX(230);
        $this->Write(5, 'FECHA IMPRESION: ');
        $this->Write(5, $fecha);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'ELABORADO POR: ');
        $this->SetX(230);
        $this->Write(5, 'HORA IMPRESION: ');
        $this->Write(5, $hora);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'REVISADO Y APROBADO POR: ');
        $this->Ln();
        $this->Cell(0, 5, ' ' . $this->PageNo(), 0, 0, 'C');


    }
}

class ExportarPDF extends fpdf
{
    private $tamannoLetraEncabezado = 8;
    private $tamannoLetraContenido = 6;


    function Footer()
    {
        $fecha = date('d-m-Y');
        $hora = date('h:i:s A');

        $this->SetFont('Arial', 'B', 4);
        $this->SetY(-30);
        $this->SetX(20);
        $this->Write(5, 'POR RECURSOS HUMANOS');
//      $this->SetX(135);
//      $this->Write(5, 'POR EL AREA CONTABLE');
        $this->SetX(230);
        $this->Write(5, 'FECHA IMPRESION: ');
        $this->SetFont('Arial', '', 4);
        $this->Write(5, $fecha);
        $this->SetFont('Arial', 'B', 4);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'ELABORADO POR:');
//      $this->SetX(135);
//      $this->Write(5, 'REVISADO POR:');
        $this->SetX(230);
        $this->Write(5, 'HORA IMPRESION: ');
        $this->SetFont('Arial', '', 4);
        $this->Write(5, $hora);
        $this->SetFont('Arial', 'B', 4);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'REVISADO Y APROBADO POR:');
//      $this->SetX(135);
//      $this->Write(5, 'CONTABILIZADO POR:');
        $this->SetFont('Arial', 'B', 6);
        $this->Ln(10);
        $this->Cell(0, 5, ' ' . $this->PageNo(), 0, 0, 'C');


    }
}

class ReporteExportarExcelModel extends ZendExt_Model
{
    private $largos = Array();
    private $pdf = null;
    private $tamannoLetraContenido = 6;
    private $tamannoLetraEncabezado = 7;
    private $ajustepos = 0;
    private $ajusteancho = 0;
    private $posci = 20;
    private $posnombre = 40;
    private $poscargo = 90;
    private $poscentroc = 184;
    private $posctamn = 250;
    private $posctacuc = 275;
    private $anchocdgctb = 20;
    private $anchoci = 68;
    private $anchonombre = 92;
    private $anchocargo = 94;
    private $anchocentroc = 80;
    private $anchoctamn = 40;
    private $anchoctacuc = 40;
    private $identidad;

    public function ReporteExportarExcelModel()
    {
        parent::ZendExt_Model();

    }

    public function exportarReporte($idconfreportescertificaciones, $idreportescertificaciones, $tipoelemento, $historico, $identidad, $tipodocumento, $tipoexcel)
    {
        $this->identidad = $identidad;
        $obj = new DatReportesCertificaciones();
        $indicadores = $obj->obtenerDatosConfVariables($idconfreportescertificaciones);
        $estado = DatElementosReportesCertificaciones::obtenerElementosReportesCertificacionesXid($idreportescertificaciones, $identidad);

        if ($historico == 0) {
            $objE = new DatElementosReportesCertificaciones();
            if ($estado == 1) {
                $datos = $objE->obtenerElementosReportesCertificacionesPersonaPDF($idreportescertificaciones, $identidad);
            }else {
                $datos = $objE->obtenerElementosReportesCertificacionesPersonaPDFDatos($idreportescertificaciones, $identidad);
                $datos = unserialize($datos[0]['datos']); 
                $datos = array_map("unserialize", array_unique(array_map("serialize", $datos)));               
            } 
            $datos = array_map("unserialize", array_unique(array_map("serialize", $datos)));
            $cabecera = $objE->obtenerCabeceraReportesCertificacionesPersona($idreportescertificaciones);

        } else {
            $objE = new HisElementosReportesCertificaciones();
            $datos = $objE->obtenerElementosReportesCertificacionesPersonaPDF($idreportescertificaciones, $identidad);
            $cabecera = $objE->obtenerCabeceraReportesCertificacionesPersona($idreportescertificaciones);
        }
        //Buscando los indicadores vacios
        $flagnoesta = 0;
        $arrindnoestan = array();
        foreach ($indicadores as $key => $val) {
            $flagesta = 0;
            foreach ($datos as $k => $v) {
                if ($v[$val->idvariable] != 0 || $v[$val->idvariable] != "") {
                    $flagesta = 1;
                    break;
                }
            }
            if ($flagesta == 0) {
                $arrindnoestan[$val->idvariable] = $val->variable;
            }
        }

        if ($tipodocumento == 2) {//Borrando los indicadores q no tienen valores en el PDF
            //Borrando los indicadores q no tienen valores
            foreach ($arrindnoestan as $iindno => $rindnoestan) {
                foreach ($indicadores as $iind => $rind) {
                    if ($iindno == $rind->idvariable) {
                        unset($indicadores[$iind]);
                        $indicadores = array_values($indicadores);
                    }
                }
            }
            //Borrando los datos de los indicadores con 0
            foreach ($arrindnoestan as $iindno => $rindnoestan) {
                foreach ($datos as $idat => $rdatos) {
                    unset($datos[$idat][$iindno]);
                }
            }
        }


        foreach ($indicadores as $key => $val) {
            foreach ($datos as $k => $v) {
                $datos[$k][$val->variable] = $v[$val->idvariable];
                $nombreplantilla = (!empty($v['plantilla'])) ? $v['plantilla'] : 'Sin plantilla nominal';
                if ($nombreplantilla != 'Sin plantilla nominal') {
                    list($ordenplantilla,) = explode('--', $v['plantilla']);
                    $longorden = strlen($ordenplantilla . '');
                    $datos[$k]['plantilla'] = chr(96 + $longorden) . $v['plantilla'];//chr(96) caracter antes de letra "a"
                } else {
                    $datos[$k]['plantilla'] = $nombreplantilla;
                }
            }
        }
        $fechaDesde = $cabecera[0]['fechainicio'];
        $fechaHasta = $cabecera[0]['fechafin'];
        $tituloReporte = $cabecera[0]['denominacion'];
        $entidad = $cabecera[0]['entidad'];
        $codigo = $cabecera[0]['codigo'];

        if ($tipodocumento == 1) {//Excel
            //Con Encabezado
            if($tipoexcel == 1){
                $this->exportarReporteExcelConEncabezado($datos, $indicadores, $entidad, $tituloReporte, $codigo, $fechaDesde, $fechaHasta);
            //Sin Encabezado
            }else{
                $this->exportarReporteExcelSinEncabezado($datos, $indicadores, $entidad, $tituloReporte, $codigo, $fechaDesde, $fechaHasta);
            }

        } else {//PDF
            $pdf = new PDFNomina('l', 'mm', 'Letter');
            $this->pdf = $pdf;
            $this->DatosGenerales($pdf);
            $this->crearCabezera($pdf, $entidad, $tituloReporte, $codigo, $fechaDesde, $fechaHasta);
            $this->crearCuerpo($pdf, $datos, $indicadores);
            $pdf->Output();
        }
    }

    public function exportarReportePdf($identidad)
    {
        $arrdatosentidad = $this->integrator->metadatos->DameEstructura($identidad);
        $entidad = $arrdatosentidad[0]->denominacion;
        $codigo = $arrdatosentidad[0]->codigo;
        $tituloReporte = 'Reporte de códigos contables por persona';

        $objE = new DatElementosReportesCertificaciones();
        $datos = $objE->obtenerDatosPDF($identidad);

        //print_r($datos);die;

        $pdf = new PDFNomina('l', 'mm', 'a4');
        $this->pdf = $pdf;
        $pdf->SetLeftMargin(50);

        $pdf = $this->DatosGenerales($pdf);

        $pdf = $this->crearCabezeraPdf($pdf, $entidad, $tituloReporte, $codigo);

        $pdf = $this->crearCuerpoPdf($pdf, $datos);

        $pdf->Output();

    }

    public function exportarReportePdfdescuento($identidad)
    {
        $arrdatosentidad = $this->integrator->metadatos->DameEstructura($identidad);
        $entidad = $arrdatosentidad[0]->denominacion;
        $codigo = $arrdatosentidad[0]->codigo;
        $tituloReporte = 'Descuentos por persona';

        $objE = new DatElementosReportesCertificaciones();
        $datos = $objE->obtenerDatosPDF($identidad);

        //print_r(count($datos));die;

        $pdf = new Mipdf('l', 'mm');
        $this->pdf = $pdf;
        $pdf->SetLeftMargin(50);

        $pdf = $this->DatosGenerales($pdf);

        $pdf = $this->crearCabezeraPdf($pdf, $entidad, $tituloReporte, $codigo);

        //$pdf = $this->crearCuerpoPdf($pdf, $datos);

        $pdf->Output();

    }

    //pdf
    private function dameTamanno($pdf, $palabra)
    {
        $tamannoTitulo = $pdf->GetStringWidth($palabra);
        $centro = (297 - $tamannoTitulo) / 2 + 2;
        return $centro;
    }

    public function crearCabezera(&$pdf, $entidad, $tituloReporte, $codigo, $desde, $hasta)
    {
        $tamannoTituloReporte = $pdf->GetStringWidth($tituloReporte);
        $centro = $this->dameTamanno($pdf, $tituloReporte);

        $pdf->Cell(270, 7, utf8_decode($tituloReporte), 0, 1, 'C');
        $pdf->SetLeftMargin(5);

        //Logo de la entidad
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        //print_r($arrEstruct);die;
        list($imagenBase64,) = explode(';', $arrEstruct[0]->logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($arrEstruct[0]->logo)) {
            $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }
        $pdf->Ln(3);

        /*$register = Zend_Registry::getInstance();
        $direccion = $register->config->modulo_path . 'views/images/logotrd.jpg';
        $pdf->Image($direccion, 5, 5, 22, 10);
        $pdf->Ln(8);*/

        //Entidad
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(13, 10, 'Entidad: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell($pdf->GetStringWidth($entidad), 10, utf8_decode($entidad), 0, 1, 'L', 0);

        //Codigo
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(13, 10, utf8_decode('Código: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell($pdf->GetStringWidth($codigo), 10, utf8_decode($codigo), 0, 1, 'L', 0);

        //Desde
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(13, 10, 'Desde: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell($pdf->GetStringWidth($desde), 10, utf8_decode($desde), 0, 0, 'L', 0);
        $pdf->SetX(245);

        //Hasta
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(13, 10, 'Hasta: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell($pdf->GetStringWidth($hasta), 10, utf8_decode($hasta), 0, 1, 'L', 0);
        return $pdf;
    }

    public function crearCabezeraPdf($pdf, $entidad, $tituloReporte, $codigo)
    {
        $tamannoTituloReporte = $pdf->GetStringWidth($tituloReporte);
        $centro = $this->dameTamanno($pdf, $tituloReporte);

        $pdf->Cell(297, $this->tamannoLetraContenido, utf8_decode($tituloReporte), 0, 1, 'C');
        $pdf->Line($centro, $pdf->GetY(), $centro + $tamannoTituloReporte, $pdf->GetY());
        $pdf->Cell($pdf->GetStringWidth($entidad) + $pdf->GetStringWidth('Entidad: ') - 2,
            $this->tamannoLetraContenido, utf8_decode('Entidad: ' . $entidad), 0, 0, 'L');
        $pdf->SetX(297 - ($pdf->GetStringWidth($codigo) + $pdf->GetStringWidth("Código: ")) - 5);
        $pdf->Cell(26, $this->tamannoLetraContenido, utf8_decode("Código: " . $codigo), 0, 1, 'L');

        return $pdf;
    }

    private function calcularLargoTabla($indicadores)
    {

        $largo = 0;
        foreach ($indicadores as $key => $val) {
            $lengthIndicador = $this->largo($indicadores[$key]->variable);
            $lengthValorIndicador = $this->largos[$indicadores[$key]->variable];
            if ($lengthIndicador > $lengthValorIndicador) {
                $largo += $lengthIndicador;
            } else {
                $largo += $lengthValorIndicador;
            }

        }
        return $largo;
    }

    private function verificarQueCabe($pdf)
    {
        if ($pdf->GetY() >= 160) {
            $pdf->AddPage();
        }
        return $pdf;
    }

    private function calcularLargoCelda($datos, $indicadores)
    {
        $mayor = -9999999999;
        foreach ($indicadores as $key => $val) {
            foreach ($datos as $k => $v) {
                $largo = $this->largo($datos[$k][$indicadores[$key]->variable]);
                if ($largo > $mayor) {
                    $mayor = $largo;
                }
            }
            $this->largos[$indicadores[$key]->variable] = $mayor;
        }
        return $this->largos;
    }

    private function redimensionarLetra()
    {

    }

    /**
     * Autor: Ing. Dainier Velazquez Labrada
     */
    private function fnLongitudesIndicadores(&$pdf, $indicadores)
    {
        $longtotalind = 200;
        $longrealind = 0;
        $longmediador = $longtotalind / count($indicadores);
        $r = array();
        foreach ($indicadores as $i => $ind) {
            $longrealind += $pdf->GetStringWidth($ind->variable);
        }

        if ($longrealind <= $longtotalind) {
            foreach ($indicadores as $i => $ind) {
                $r[$i] = $pdf->GetStringWidth($ind->variable) + (($longtotalind - $longrealind) / count($indicadores));
            }
        } else {
            foreach ($indicadores as $i => $ind) {
                $r[$i] = $longmediador;
            }
            $r['cantcaracteres'] = 7;
        }
        return $r;
    }

    private function pintarEncabezadoTabla(&$pdf, $indicadores, $centro, $arrlongitudes)
    {
        $rexplode = explode('-', $centro);
        $centro = (count($rexplode) > 1) ? $rexplode[1] : $rexplode[0];
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->SetFillColor(200);//Definiendo el color de celdas
        $pdf->SetLeftMargin(5);
        $x = $pdf->GetX();
        $pdf->MultiCell(270, 6, utf8_decode($centro), 1, 'L', 1);
        $pdf->Cell(20, 8, 'CI', 1, 0, 'C');
        $pdf->Cell(50, 8, 'Nombre y Apellidos', 1, 0, 'C');
        foreach ($indicadores as $key => $val) {
            $salto = ((count($indicadores) - 1) == $key) ? 1 : 0;
            $denominacion = ($arrlongitudes['cantcaracteres']) ?
                substr(utf8_decode($indicadores[$key]->variable), 0, $arrlongitudes['cantcaracteres']) :
                utf8_decode($indicadores[$key]->variable);
            $pdf->Cell($arrlongitudes[$key], 8, $denominacion, 1, $salto, 'C');
        }
        return $x;
    }

    public function crearCuerpo(&$pdf, $datos, $indicadores)
    {
        $pdf->SetX(5);
        $this->calcularLargoCelda($datos, $indicadores);

        $arrlongitudes = $this->fnLongitudesIndicadores($pdf, $indicadores);

        $xinicial = $this->pintarEncabezadoTabla($pdf, $indicadores, $datos[0]['plantilla'], $arrlongitudes);

        $centro = $datos[0]['plantilla'];

        //Capturando el indicador de observaciones(tipovalor == 3)
        $keyobserv = -1;
        foreach ($indicadores as $i => $ind) {
            if ($ind->tipovalor == 3) {
                $keyobserv = $i;
                break;
            }
        }
        $bordercell = 1;
        $arrsubtotales = array();
        $arrtotales = array();
        foreach ($datos as $k => $v) {
            $this->fnAddPagina($pdf, $indicadores, $centro, $arrlongitudes);
            if ($datos[$k]['plantilla'] != $centro) {
                $centro = $datos[$k]['plantilla'];//print_r($centro);die;
                $this->fnAddPagina($pdf, $indicadores, $centro, $arrlongitudes);
                $pdf->SetFont('Arial', 'B', 6);
                //Subtotales
                $pdf->SetFillColor(200);//Definiendo el color de celdas
                $pdf->Cell(70, 5, utf8_decode('Subtotales:'), 1, 0, 'C', 0);
                //$bordercellsubt = ($keyobserv == -1) ? 1 : 'T';
                $pdf->SetFont('Arial', 'B', $this->tamannosubtotales);
                foreach ($arrsubtotales as $s => $subt) {
                    list($numeroentero, $decimales) = explode('.', $subt);
                    $lugaresdecimales = strlen($decimales);

                    $valobserv = ($s != $keyobserv) ? number_format($subt, $lugaresdecimales, '.', '') : "";
                    $pdf->Cell($arrlongitudes[$s], 5, $valobserv,  /*$bordercellsubt*/
                        1, 0, 'R');
                    $arrsubtotales[$s] = 0;//Vaciando el arreglo de subtotales
                }
                $pdf->Cell(0.001, 5, '', 'R', 1);

                //Firma
                $pdf->Cell(270, 5, utf8_decode('Firma Jefe Área:'), 1, 1, 'L');
                //$pdf->Line($xinicial, 5, $pdf->GetX(), 5); //Vertical izquierda por centro
                $pdf->Line($xinicial, 5, $pdf->GetX(), 5); //Vertical izquierda por centro
                $pdf->Ln(5);
                $this->pintarEncabezadoTabla($pdf, $indicadores, $datos[$k]['plantilla'], $arrlongitudes);
            }

            //Letra del cuerpo de la tabla
            $pdf->SetFont('Arial', '', 6);
            $pdf->Cell(20, 6, utf8_decode($datos[$k]['numero']), $bordercell, 0, 'L');
            $pdf->Cell(50, 6, utf8_decode($datos[$k]['nombreyapellidos']), $bordercell, 0, 'L');

            $flag = false;
            $x = 0;
            $y = 0;
            $height = 0;
            foreach ($indicadores as $key => $val) {
                $salto = ((count($indicadores) - 1) == $key) ? 1 : 0;
                $valor = ($val->tipovalor == 3) ? $datos[$k][$indicadores[$key]->variable] :
                    number_format($datos[$k][$indicadores[$key]->variable], $val->lugaresdecimales, '.', '');
                $align = ($key == $keyobserv) ? 'L' : 'R';

                if (($keyobserv == -1)) {
                    $pdf->Cell($arrlongitudes[$key], 6, $valor, 1, $salto, $align);
                } else {
                    if ($val->tipovalor == 3) {
                        $x = $pdf->GetX() + $arrlongitudes[$key];
                        $y = $pdf->GetY();
                        $pdf->MultiCell($arrlongitudes[$key], 6, $valor, $bordercell, 'L');
                        $height = $pdf->GetY() - $y;
                        $flag = true;
                    } else {
                        if ($flag) {
                            $pdf->SetY($y);
                            $pdf->SetX($x);
                            $pdf->Cell($arrlongitudes[$key], 6, $valor, $bordercell, 1, $align);
                            $pdf->SetX($x);
                            $pdf->Cell($arrlongitudes[$key], $height - 6, '', $bordercell, $salto);
                            $flag = false;
                        } else
                            $pdf->Cell($arrlongitudes[$key], 6, $valor, $bordercell, $salto, $align);

                    }
                }

                /*$arrsubtotales[$key] += $datos[$k][$indicadores[$key]->variable];
                $arrtotales[$key] += $datos[$k][$indicadores[$key]->variable];*/

                $arrsubtotales[$key] += $valor;
                $arrtotales[$key] += $valor;
            }
            $this->fnAddPagina($pdf, $indicadores, $centro, $arrlongitudes);
            $centro = $datos[$k]['plantilla'];
            if (count($datos) - 1 == $k) {
                $this->fnAddPagina($pdf, $indicadores, $centro, $arrlongitudes);
                $pdf->SetFont('Arial', 'B', 6);
                //Subtotales
                $pdf->SetFillColor(200);//Definiendo el color de celdas
                $pdf->Cell(70, 5, utf8_decode('Subtotales:'), 1, 0, 'C', 0);
                $pdf->SetFont('Arial', 'B', $this->tamannosubtotales);
                //$bordercellsubt = ($keyobserv == -1) ? 1 : 'T';	
                foreach ($arrsubtotales as $s => $subt) {
                    list($numeroentero, $decimales) = explode('.', $subt);
                    $lugaresdecimales = strlen($decimales);
                    $valobserv = ($s != $keyobserv) ? number_format($subt, $lugaresdecimales, '.', '') : "";
                    $pdf->Cell($arrlongitudes[$s], 5, $valobserv, /*$bordercellsubt*/
                        1, 0, 'R');

                    $arrsubtotales[$s] = 0;//Vaciando el arreglo de subtotales
                }
                $pdf->Cell(0.001, 5, '', 'R', 1);

                //Firma
                $pdf->Cell(270, 5, utf8_decode('Firma Jefe Área:'), 1, 1, 'L');
                $pdf->Line($xinicial, 5, $pdf->GetX(), 5); //Vertical izquierda por centro
                $pdf->Ln(5);
            }

            $pdf->Line(5, $pdf->GetY(), 275, $pdf->GetY()); //Horizontal por persona
        }
        $this->fnAddPagina($pdf, $indicadores, $centro, $arrlongitudes);

        //Totales
        $pdf->SetFont('Arial', 'B', 6);
        $pdf->SetFillColor(200);//Definiendo el color de celdas
        $pdf->Cell(70, 5, utf8_decode('Totales:'), 1, 0, 'L', 1);
        $pdf->SetFont('Arial', 'B', $this->tamannosubtotales);
        foreach ($arrtotales as $t => $tot) {
            list($numeroentero, $decimales) = explode('.', $tot);
            $lugaresdecimales = strlen($decimales);
            $valobserv = ($t != $keyobserv) ? number_format($tot, $lugaresdecimales, '.', '') : "";
            $pdf->Cell($arrlongitudes[$t], 5, $valobserv, 1, 0, 'R');
        }

        return $pdf;
    }

    private function fnAddPagina(&$pdf, $indicadores, $centro, $arrlongitudes)
    {
        if ($pdf->GetY() >= 170) {
            $pdf->AddPage();
            return $this->pintarEncabezadoTabla($pdf, $indicadores, $centro, $arrlongitudes);
        }
    }

    private function pintarEncabezadoTablaPdf($pdf, $plantillanominal)
    {
        $pdf = $this->verificarQueCabe($pdf);
        $pdf->SetFont('Arial', 'B', $this->tamannoLetraEncabezado);
        $pdf->SetFillColor(200);


        $pdf->Cell(238, $this->tamannoLetraEncabezado, utf8_decode($plantillanominal), 0, 1, 'C');
        // $pdf->SetX(100);
        $pdf->Cell($this->anchocdgctb - $this->ajusteancho, $this->tamannoLetraEncabezado, utf8_decode('Cdgo ctble'), 0, 0, 'L', 1);
        $pdf->SetX($this->posci - $this->ajustepos);
        $pdf->Cell($this->anchoci - $this->ajusteancho, $this->tamannoLetraEncabezado, 'CI', 0, 0, 'L', 1);
        $pdf->SetX($this->posnombre - $this->ajustepos);
        $pdf->Cell($this->anchonombre - $this->ajusteancho, $this->tamannoLetraEncabezado, 'Nombre y apellidos', 0, 0, 'L', 1);
        $pdf->SetX($this->poscargo - $this->ajustepos);
        $pdf->Cell($this->anchocargo - $this->ajusteancho, $this->tamannoLetraEncabezado, 'Cargo', 0, 0, 'L', 1);
        $pdf->SetX($this->poscentroc - $this->ajustepos);
        $pdf->Cell($this->anchocentroc - $this->ajusteancho, $this->tamannoLetraEncabezado, 'Centro de costo', 0, 0, 'L', 1);
        $pdf->SetX($this->posctamn - $this->ajustepos);
        $pdf->Cell($this->anchoctamn - $this->ajusteancho, $this->tamannoLetraEncabezado, 'Cuenta mn', 0, 0, 'L', 1);
        $pdf->SetX($this->posctacuc - $this->ajustepos);
        $pdf->Cell($this->anchoctacuc - $this->ajusteancho, $this->tamannoLetraEncabezado, 'Cuenta cuc', 0, 1, 'L', 1);

        //Letra del cuerpo de la tabla
        $pdf->SetFont('Arial', '', $this->tamannoLetraContenido);
        return $pdf;
    }

    private function largo($palabra)
    {
        return (strlen($palabra) == 1) ? 5 : (strlen($palabra) * 2 + 2);
    }

    public function crearCuerpoPDF($pdf, $datos)
    {
        $centro = $datos[0]['plantilla_nominal'];
        $pdf = $this->pintarEncabezadoTablaPdf($pdf, $centro);
        foreach ($datos as $k => $v) {
            if ($datos[$k]['plantilla_nominal'] != $centro) {
                $pdf = $this->pintarEncabezadoTablaPdf($pdf, $datos[$k]['plantilla_nominal']);
            }
            $pdf->Cell($this->anchocdgctb - $this->ajusteancho, $this->tamannoLetraContenido, utf8_decode($datos[$k]['cdgocontable']), 0, 0, 'L');
            $pdf->SetX($this->posci - $this->ajustepos);
            $pdf->Cell($this->anchoci - $this->ajusteancho, $this->tamannoLetraContenido, utf8_decode($datos[$k]['ci']), 0, 0, 'L');
            $pdf->SetX($this->posnombre - $this->ajustepos);
            $pdf->Cell($this->anchonombre - $this->ajusteancho, $this->tamannoLetraContenido, utf8_decode($datos[$k]['nombre']), 0, 0, 'L');
            $pdf->SetX($this->poscargo - $this->ajustepos);
            $pdf->Cell($this->anchocargo - $this->ajusteancho, $this->tamannoLetraContenido, utf8_decode($datos[$k]['cargo']), 0, 0, 'L');
            $pdf->SetX($this->poscentroc - $this->ajustepos);
            $pdf->Cell($this->anchocentroc - $this->ajusteancho, $this->tamannoLetraContenido, utf8_decode($datos[$k]['centrocosto']), 0, 0, 'L');
            $pdf->SetX($this->posctamn - $this->ajustepos);
            $pdf->Cell($this->anchoctamn - $this->ajusteancho, $this->tamannoLetraContenido, utf8_decode($datos[$k]['cuentamn']), 0, 0, 'L');
            $pdf->SetX($this->posctacuc - $this->ajustepos);
            $pdf->Cell($this->anchoctacuc - $this->ajusteancho, $this->tamannoLetraContenido, utf8_decode($datos[$k]['cuentacuc']), 0, 1, 'L');

            if ($pdf->GetY() >= 160) {
                $pdf->AddPage();
                /* if (!count($datos) == $k) {
                   $pdf = $this->pintarEncabezadoTablaPdf($pdf, $datos[$k]['plantilla_nominal']);
                 }*/
            }
            $centro = $datos[$k]['plantilla_nominal'];
        }
        return $pdf;
    }

    public function DatosGenerales(&$pdf)
    {
        $pdf->SetTitle("SNC-225");
        $pdf->SetAuthor("Tte. Ing. Roberto León Socarrás");
        $pdf->SetLeftMargin(2);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 10);
        return $pdf;
    }

    public function exportarReporteExcelConEncabezado($datos, $indicadores, $entidad, $tituloReporte, $codigo, $fechaDesde, $fechaHasta)
    {
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(50);

        /*ENCABEZADO*/
        $numero = 1;
        //titulo
        $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':N' . $numero);
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, $tituloReporte, null, '000000', 'Arial', 13, '000000', 'center', 'center', 0, 1);
        $numero++;
        //Entidad y Código
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, 'Entidad: ', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('B' . $numero . ':J' . $numero);
        $this->fnPintarCelda($objPHPExcel, 'B', $numero, $entidad, null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
        $this->fnPintarCelda($objPHPExcel, 'K', $numero, 'Código: ', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('L' . $numero . ':N' . $numero);
        $this->fnPintarCelda($objPHPExcel, 'L', $numero, $codigo, null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
        $numero++;
        //Desde y Hasta
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, 'Desde: ', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('B' . $numero . ':J' . $numero);
        $this->fnPintarCelda($objPHPExcel, 'B', $numero, $fechaDesde, null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
        $this->fnPintarCelda($objPHPExcel, 'K', $numero, 'Hasta: ', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('L' . $numero . ':N' . $numero);
        $this->fnPintarCelda($objPHPExcel, 'L', $numero, $fechaHasta, null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
        $numero++;

        //Pintando la denominacion de los campos(columnas)
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, 'CI', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'B', $numero, 'Nombre y apellidos', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $letra = 3;
        foreach ($indicadores as $key => $val) {
            $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
            $objPHPExcel->getActiveSheet()->getColumnDimension($letraconvertida)->setWidth(15);
            $this->fnPintarCelda($objPHPExcel, $letraconvertida, $numero, $indicadores[$key]->variable, 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $letra++;
        }
        $numero++;
        $objPHPExcel->getActiveSheet()->freezePane('A5');

        /*CUERPO*/
        $plantilla = null;
        $pintarsubtotal = false;
        $cantcolumnas = count($indicadores) + 2;
        $letraconvertida = ($cantcolumnas < 27) ? chr($cantcolumnas + 64) : 'A' . chr($cantcolumnas + 38);
        $arrsubtotales = array();
        $arrtotales = array();
        foreach ($datos as $i => $persona) {
            //Si es una nueva plantilla se pinta la denominacion de la misma
            if ($persona['plantilla'] != $plantilla) {
                //pintando el subtotal
                if ($pintarsubtotal) {//para no pintar el 1er subtotal
                    $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':B' . $numero);
                    $this->fnPintarCelda($objPHPExcel, 'A', $numero, 'Subtotal', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $this->fnPintarBordes($objPHPExcel, 'B' . $numero, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                    $letra = 3;
                    foreach ($indicadores as $ind) {
                        $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                        $this->fnPintarCelda($objPHPExcel, $letraconvertida, $numero, $arrsubtotales[$ind->idvariable], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                        $letra++;
                    }
                    $numero++;
                    $arrsubtotales = array();//vaciando array subtotales
                }

                //pintando la plantilla
                $plantilla = $persona['plantilla'];
                list($orden, $denomplantilla) = explode('-', $persona['plantilla']);
                $denomplantillas = (!empty($denomplantilla)) ? $denomplantilla : /*$orden*/'Sin plantilla nominal';
                $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':' . $letraconvertida . $numero);
                $this->fnBackgroundCeldas($objPHPExcel, 'A' . $numero . ':' . $letraconvertida . $numero, PHPExcel_Style_Color::COLOR_DARKYELLOW);
                $this->fnPintarCelda($objPHPExcel, 'A', $numero, $denomplantillas, 'l,t,r,b', '000000', 'Arial', 10, '000000', 'left', 'center', 0, 1);
                $this->fnPintarBordes($objPHPExcel, $letraconvertida . $numero, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $numero++;
            }

            //Pintando los valores de cada persona por celda
            $this->fnPintarCelda($objPHPExcel, 'A', $numero, $persona['numero'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $this->fnPintarCelda($objPHPExcel, 'B', $numero, $persona['nombreyapellidos'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
            $letra = 3;
            foreach ($indicadores as $key => $val) {
                $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                $this->fnPintarCelda($objPHPExcel, $letraconvertida, $numero, $persona[$indicadores[$key]->variable], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                $arrsubtotales[$val->idvariable] += $persona[$indicadores[$key]->variable];
                $arrtotales[$val->idvariable] += $persona[$indicadores[$key]->variable];
                $letra++;
            }

            $numero++;
            $pintarsubtotal = true;

            //pintando el ultimo subtotal
            if ($i == count($datos) - 1) {
                $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':B' . $numero);
                $this->fnPintarCelda($objPHPExcel, 'A', $numero, 'Subtotal', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                $this->fnPintarBordes($objPHPExcel, 'B' . $numero, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $letra = 3;
                foreach ($indicadores as $ind) {
                    $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                    $this->fnPintarCelda($objPHPExcel, $letraconvertida, $numero, $arrsubtotales[$ind->idvariable], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $letra++;
                }
                $numero += 2;
            }
        }

        //pintando el total
        $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':B' . $numero);
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, 'Total', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarBordes($objPHPExcel, 'B' . $numero, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B' . $numero, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $letra = 3;
        foreach ($indicadores as $ind) {
            $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
            $this->fnPintarCelda($objPHPExcel, $letraconvertida, $numero, $arrtotales[$ind->idvariable], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $letra++;
        }

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        //header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Reporte.xls" ');
        header('Cache-Control: max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');

        //$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        return 1;
    }

    public function exportarReporteExcelSinEncabezado($datos, $indicadores, $entidad, $tituloReporte, $codigo, $fechaDesde, $fechaHasta)
    {
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(50);

        /*ENCABEZADO*/
        $numero = 1;

        //Pintando la denominacion de los campos(columnas)
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, 'CI', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'B', $numero, 'Nombre y apellidos', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $letra = 3;
        foreach ($indicadores as $key => $val) {
            $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
            $objPHPExcel->getActiveSheet()->getColumnDimension($letraconvertida)->setWidth(15);
            $this->fnPintarCelda($objPHPExcel, $letraconvertida, $numero, $indicadores[$key]->variable, 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $letra++;
        }
        $numero++;
        $objPHPExcel->getActiveSheet()->freezePane('A5');

        /*CUERPO*/
        $plantilla = null;
        $pintarsubtotal = false;
        $cantcolumnas = count($indicadores) + 2;
        $letraconvertida = ($cantcolumnas < 27) ? chr($cantcolumnas + 64) : 'A' . chr($cantcolumnas + 38);
        $arrsubtotales = array();
        $arrtotales = array();
        foreach ($datos as $i => $persona) {
            //Pintando los valores de cada persona por celda
            $this->fnPintarCelda($objPHPExcel, 'A', $numero, $persona['numero'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $this->fnPintarCelda($objPHPExcel, 'B', $numero, $persona['nombreyapellidos'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
            $letra = 3;
            foreach ($indicadores as $key => $val) {
                $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                $this->fnPintarCelda($objPHPExcel, $letraconvertida, $numero, $persona[$indicadores[$key]->variable], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                $arrsubtotales[$val->idvariable] += $persona[$indicadores[$key]->variable];
                $arrtotales[$val->idvariable] += $persona[$indicadores[$key]->variable];
                $letra++;
            }

            $numero++;
            $pintarsubtotal = true;

        }



        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        //header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Reporte.xls" ');
        header('Cache-Control: max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');

        //$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
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

    public function fnBackgroundCeldas(&$objPHPExcel, $celda, $color)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFill()
            ->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
            ->getStartColor()->setARGB($color);
    }

    //Modelo SC-4-04 Notificación de Licencias y Subsidios
    public function fnExportarReporteSC404($idconfreportescertificaciones, $idreportescertificaciones, $tipoelemento, $historico, $identidad, $tipodocumento, $idpersona)
    {
        $this->identidad = $identidad;
        $obj = new DatReportesCertificaciones();
        $indicadores = $obj->obtenerDatosConfVariables($idconfreportescertificaciones, 2,$idreportescertificaciones, $idpersona);

        if ($historico == 0) {
            $objE = new DatElementosReportesCertificaciones();
            $datos = $objE->obtenerElementosReportesCertificacionesPersonaPDF($idreportescertificaciones, $identidad);
            $cabecera = $objE->obtenerCabeceraReportesCertificacionesPersona($idreportescertificaciones);
            $datos = $this->fnInArrayField($idpersona, 'idelemento', $datos);
        } else {
            $objE = new HisElementosReportesCertificaciones();
            $datos = $objE->obtenerElementosReportesCertificacionesPersonaPDF($idreportescertificaciones, $identidad);
            $cabecera = $objE->obtenerCabeceraReportesCertificacionesPersona($idreportescertificaciones);
            $datos = $this->fnInArrayField($idpersona, 'idelemento', $datos);
        }
        //Adicionando al arreglo datos los valores indexados por denominacion
        foreach ($indicadores as $key => $val) {
            foreach ($datos as $k => $v) {
                $datos[$k]['dataindex'][$val->variable] = $v[$val->idvariable];
            }
        }
        $array_conf_doc = array(
            'hoja_ancho' => 216,
            'hoja_alto' => 280,
            'hoja_modo' => 'p',//portrait
            'letra_tamanno' => 10,
            'celda_alto' => 7,
            'celda_color' => 220
        );

        $array_data_doc = array(
            'datos' => $datos[0],
            'indicadores' => $indicadores,
            //'MODELO SC-4-04 NOTIFICACIÓN DE LICENCIAS Y SUBSIDIOS'
            'encabezado' => 'MODELO SC-4-04 NOTIFICACIÓN DE' . ' ' . $cabecera[0]['denominacion'],
            'fechainicio' => $cabecera[0]['fechainicio'],
            'fechafin' => $cabecera[0]['fechafin'],
            'entidad' => $cabecera[0]['entidad'],
            'codigo' => $cabecera[0]['codigo'],
        );

        if ($tipodocumento == 1) {//Excel
            $this->fnCrearEXCEL_SC404($array_conf_doc, $array_data_doc);
        } else {//PDF
            $pdf = new fpdf('p', 'mm', 'Letter');
            $this->pdf = $pdf;
            $this->fnCrearPDF_SC404($pdf, $array_conf_doc, $array_data_doc);
            $pdf->Output();
        }
    }

    public function fnCrearPDF_SC404(&$pdf, $conf, $data)
    {
        //function Cell( $w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=0, $link='')
        $pdf->AddPage();
        $pdf->SetTitle("MODELO SC-4-04");
        $pdf->SetAuthor("Ing. Dainier Velázquez Labrada");
        $pdf->SetFillColor($conf['celda_color']);//Definiendo el color de celdas

        //1era fila----------------------------------------------------------------------------------------------------
        //Encabezado
        $pdf->SetX(0);
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno'] + 2);
        $pdf->Cell($conf['hoja_ancho'], $conf['celda_alto'] + 5, utf8_decode(strtoupper($data['encabezado'])), 0, 1, 'C');
        $pdf->SetX(10);

        //2da fila-----------------------------------------------------------------------------------------------------
        //Entidad
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.1, $conf['celda_alto'], utf8_decode('Entidad'), 1, 0, 'L', 1);

        //Valor Entidad
        $pdf->SetFont('Arial', '', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.4, $conf['celda_alto'], utf8_decode($data['entidad']), 1, 0, 'L');

        //REEUP
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.1, $conf['celda_alto'], 'REEUP', 1, 0, 'C', 1);

        //Valor REEUP
        $pdf->SetFont('Arial', '', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.1, $conf['celda_alto'], $data['codigo'], 1, 0, 'C');

        //Fecha emision
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.2, $conf['celda_alto'], utf8_decode('Fecha emisión'), 1, 1, 'C', 1);

        //3era fila----------------------------------------------------------------------------------------------------
        //Area
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.1, $conf['celda_alto'], utf8_decode('Área'), 1, 0, 'L', 1);

        //Valor Area
        $plantilla = explode('-', $data['datos']['plantilla']);
        $pdf->SetFont('Arial', '', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.6, $conf['celda_alto'], utf8_decode($plantilla[1]), 1, 0, 'L');

        //Valor Fecha emision
        $pdf->SetFont('Arial', '', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.2, $conf['celda_alto'], str_replace('-', '/', date('d-m-Y')), 1, 1, 'C');

        //4ta fila-----------------------------------------------------------------------------------------------------
        //Nombre
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.1, $conf['celda_alto'], 'Nombre', 1, 0, 'L', 1);

        //Valor Nombre
        $pdf->SetFont('Arial', '', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.5, $conf['celda_alto'], utf8_decode($data['datos']['nombreyapellidos']), 1, 0, 'L');

        //Expediente
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.1, $conf['celda_alto'], 'Expediente', 1, 0, 'C', 1);

        //Valor Expediente
        $pdf->SetFont('Arial', '', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.2, $conf['celda_alto'], $data['datos']['numero'], 1, 1, 'C');

        //5ta fila-----------------------------------------------------------------------------------------------------
        //Concepto
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.1, $conf['celda_alto'], 'Concepto', 1, 0, 'L', 1);

        //Valor Concepto
        $pdf->SetFont('Arial', '', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.8, $conf['celda_alto'], utf8_decode(''), 1, 1, 'L');

        //6ta fila-----------------------------------------------------------------------------------------------------
        //Fecha inicio
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.45, $conf['celda_alto'], 'Fecha inicio', 1, 0, 'C', 1);

        //Fecha fin
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.45, $conf['celda_alto'], 'Fecha fin', 1, 1, 'C', 1);

        //7ma fila-----------------------------------------------------------------------------------------------------
        //Valor Fecha inicio
        $pdf->SetFont('Arial', '', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.45, $conf['celda_alto'], $data['fechainicio'], 1, 0, 'C');

        //Valor Fecha fin
        $pdf->SetFont('Arial', '', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.45, $conf['celda_alto'], $data['fechafin'], 1, 1, 'C');

        //8va fila-----------------------------------------------------------------------------------------------------
        //Conceptos
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.7, $conf['celda_alto'], 'Conceptos', 1, 0, 'C', 1);

        //Valor
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.2, $conf['celda_alto'], 'Valor', 1, 1, 'C', 1);

        //9na fila-----------------------------------------------------------------------------------------------------
        foreach ($data['datos']['dataindex'] as $key => $valor) {
            if($valor != 0){
                //Valor Conceptos
                $pdf->SetFont('Arial', '', $conf['letra_tamanno']);
                $pdf->Cell($conf['hoja_ancho'] * 0.7, $conf['celda_alto'], utf8_decode($key), 1, 0, 'L');

                //Valor Valor
                $pdf->SetFont('Arial', '', $conf['letra_tamanno']);
                $pdf->Cell($conf['hoja_ancho'] * 0.2, $conf['celda_alto'], utf8_decode($valor), 1, 1, 'R');
            }
        }

        //10ma fila----------------------------------------------------------------------------------------------------
        //Elabora Modelo
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.175, $conf['celda_alto'], utf8_decode('Elabora Modelo'), 1, 0, 'C', 1);

        //Aprueba Modelo
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.175, $conf['celda_alto'], utf8_decode('Aprueba Modelo'), 1, 0, 'C', 1);

        //Revisa Nómina
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.175, $conf['celda_alto'], utf8_decode('Revisa Nómina'), 1, 0, 'C', 1);

        //Elabora Nómina
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.175, $conf['celda_alto'], utf8_decode('Elabora Nómina'), 1, 0, 'C', 1);

        //Número
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.2, $conf['celda_alto'], utf8_decode('Número'), 1, 1, 'C', 1);

        //11na fila----------------------------------------------------------------------------------------------------
        //Valor Elabora Modelo
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.175, $conf['celda_alto'] * 2, '', 1, 0, 'C');

        //Valor Aprueba Modelo
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.175, $conf['celda_alto'] * 2, '', 1, 0, 'C');

        //Valor Revisa Nómina
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.175, $conf['celda_alto'] * 2, '', 1, 0, 'C');

        //Valor Elabora Nómina
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.175, $conf['celda_alto'] * 2, '', 1, 0, 'C');

        //Valor Número
        $pdf->SetFont('Arial', 'B', $conf['letra_tamanno']);
        $pdf->Cell($conf['hoja_ancho'] * 0.2, $conf['celda_alto'] * 2, '', 1, 1, 'C');

        //print_r($data['datos']);die;
        return $pdf;
    }

    public function fnCrearEXCEL_SC404($conf, $data)
    {
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(20);

        //1era fila----------------------------------------------------------------------------------------------------
        $numero = 1;
        $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':E' . $numero);
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, strtoupper($data['encabezado']), null, '000000', 'Arial', $conf['letra_tamanno'] + 2, '000000', 'center', 'center', 0, 1);
        $numero++;

        //2da fila-----------------------------------------------------------------------------------------------------
        $this->fnBackgroundCeldas($objPHPExcel, 'A' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, 'Entidad', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'left', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'B', $numero, $data['entidad'], 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'left', 'center', 0, 0);
        $this->fnBackgroundCeldas($objPHPExcel, 'C' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'C', $numero, 'REEUP', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'D', $numero, $data['codigo'] . ' ', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 0);
        $this->fnBackgroundCeldas($objPHPExcel, 'E' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'E', $numero, 'Fecha emisión', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $numero++;

        //3era fila----------------------------------------------------------------------------------------------------
        $this->fnBackgroundCeldas($objPHPExcel, 'A' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, 'Área', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'left', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('B' . $numero . ':D' . $numero);
        $plantilla = explode('-', $data['datos']['plantilla']);
        $this->fnPintarCelda($objPHPExcel, 'B', $numero, $plantilla[1], 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'left', 'center', 0, 0);
        $objPHPExcel->getActiveSheet()->getStyle('C' . $numero)->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                )
            )
        );
        $this->fnPintarCelda($objPHPExcel, 'E', $numero, str_replace('-', '/', date('d-m-Y')), 'r,t,l,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
        $numero++;

        //4ta fila-----------------------------------------------------------------------------------------------------
        $this->fnBackgroundCeldas($objPHPExcel, 'A' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, 'Nombre', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'left', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('B' . $numero . ':C' . $numero);
        $this->fnPintarCelda($objPHPExcel, 'B', $numero, $data['datos']['nombreyapellidos'], 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'left', 'center', 0, 0);
        $this->fnBackgroundCeldas($objPHPExcel, 'C' . $numero, '#9b9b9b');
        $objPHPExcel->getActiveSheet()->getStyle('C' . $numero)->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                )
            )
        );
        $this->fnPintarCelda($objPHPExcel, 'D', $numero, 'Expediente', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'E', $numero, $data['datos']['numero'], 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 0);
        $numero++;

        //5ta fila-----------------------------------------------------------------------------------------------------
        $this->fnBackgroundCeldas($objPHPExcel, 'A' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, 'Concepto', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'left', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('B' . $numero . ':E' . $numero);
        $this->fnPintarCelda($objPHPExcel, 'B', $numero, '', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'left', 'center', 0, 0);
        $objPHPExcel->getActiveSheet()->getStyle('C' . $numero)->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('D' . $numero)->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E' . $numero)->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                ),
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                )
            )
        );
        $numero++;

        //6ta fila-----------------------------------------------------------------------------------------------------
        $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':B' . $numero);
        $this->fnBackgroundCeldas($objPHPExcel, 'A' . $numero . ':B' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, 'Fecha inicio', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->getStyle('B' . $numero)->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                ),
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->mergeCells('C' . $numero . ':E' . $numero);
        $this->fnBackgroundCeldas($objPHPExcel, 'C' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'C', $numero, 'Fecha fin', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->getStyle('D' . $numero)->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E' . $numero)->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                ),
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                )
            )
        );
        $numero++;

        //7ma fila-----------------------------------------------------------------------------------------------------
        $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':B' . $numero);
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, $data['fechainicio'], 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 0);
        $objPHPExcel->getActiveSheet()->getStyle('B' . $numero)->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                ),
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->mergeCells('C' . $numero . ':E' . $numero);
        $this->fnPintarCelda($objPHPExcel, 'C', $numero, $data['fechafin'], 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 0);
        $objPHPExcel->getActiveSheet()->getStyle('D' . $numero)->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('E' . $numero)->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                ),
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                )
            )
        );
        $numero++;

        //8va fila-----------------------------------------------------------------------------------------------------
        $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':C' . $numero);
        $this->fnBackgroundCeldas($objPHPExcel, 'A' . $numero . ':C' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, 'Conceptos', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->getStyle('B' . $numero)->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('C' . $numero)->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                ),
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->mergeCells('D' . $numero . ':E' . $numero);
        $this->fnBackgroundCeldas($objPHPExcel, 'D' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'D', $numero, 'Valor', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->getStyle('E' . $numero)->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                ),
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                    )
                )
            )
        );
        $numero++;

        //9na fila-----------------------------------------------------------------------------------------------------
        foreach ($data['datos']['dataindex'] as $key => $valor) {
            $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':C' . $numero);
            $this->fnPintarCelda($objPHPExcel, 'A', $numero, $key, 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'left', 'center', 0, 0);
            $objPHPExcel->getActiveSheet()->getStyle('B' . $numero)->getBorders()->applyFromArray(
                array(
                    'bottom' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                        )
                    )
                )
            );
            $objPHPExcel->getActiveSheet()->getStyle('C' . $numero)->getBorders()->applyFromArray(
                array(
                    'bottom' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                        )
                    ),
                    'right' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                        )
                    )
                )
            );
            $objPHPExcel->getActiveSheet()->mergeCells('D' . $numero . ':E' . $numero);
            $this->fnPintarCelda($objPHPExcel, 'D', $numero, $valor, 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'right', 'center', 0, 0);
            $objPHPExcel->getActiveSheet()->getStyle('E' . $numero)->getBorders()->applyFromArray(
                array(
                    'bottom' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                        )
                    ),
                    'right' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                        )
                    )
                )
            );
            $numero++;
        }

        //10ma fila----------------------------------------------------------------------------------------------------
        $this->fnBackgroundCeldas($objPHPExcel, 'A' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, 'Elabora Modelo', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $this->fnBackgroundCeldas($objPHPExcel, 'B' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'B', $numero, 'Aprueba Modelo', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $this->fnBackgroundCeldas($objPHPExcel, 'C' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'C', $numero, 'Revisa Nómina', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $this->fnBackgroundCeldas($objPHPExcel, 'D' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'D', $numero, 'Elabora Nómina', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $this->fnBackgroundCeldas($objPHPExcel, 'E' . $numero, '#9b9b9b');
        $this->fnPintarCelda($objPHPExcel, 'E', $numero, 'Número', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $numero++;

        //11na fila----------------------------------------------------------------------------------------------------
        $this->fnPintarCelda($objPHPExcel, 'A', $numero, '', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'B', $numero, '', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'C', $numero, '', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'D', $numero, '', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $this->fnPintarCelda($objPHPExcel, 'E', $numero, '', 'r,t,l,b', '000000', 'Arial', $conf['letra_tamanno'], '000000', 'center', 'center', 0, 1);
        $numero++;

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        //header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Modelo SC-4-04.xls" ');
        header('Cache-Control: max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');

        //$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        return 1;
    }

    public function fnInArrayField($needle, $needle_field, $haystack)
    {
        $array = array();
        foreach ($haystack as $item)
            if (isset($item[$needle_field]) && $item[$needle_field] == $needle)
                $array[] = $item;
        return $array;
    }
}



