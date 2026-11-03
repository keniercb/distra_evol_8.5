<?php

/**
 * Modelo para hacer el reporte del Submayor de Vacaciones.
 *
 * @author Ing. Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Models.
 * @category Clase Modelo.
 * @uses
 * @copyright UCID
 * @version 1.0
 */
class PDFSubMayorVacaciones extends fpdf
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
        $this->Ln(180 - $altoHoja);
        $this->Ln(10);
        $this->SetFont('Arial', 'B', 8);
        //$this->SetY(-30);
//        $this->SetX(20);
//        $this->Write(5, 'POR RECURSOS HUMANOS');
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
//      $this->SetX(135);
//      $this->Write(5, 'REVISADO POR:');
        $this->SetX($cordX);
        $this->Write(5, 'HORA IMPRESION: ');
        $this->SetFont('Arial', '', 8);
        $this->Write(5, $hora);
        $this->SetFont('Arial', 'B', 8);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'REVISADO Y APROBADO POR:');
//      $this->SetX(135);
//      $this->Write(5, 'CONTABILIZADO POR:');
        $this->SetFont('Arial', 'B', 8);
        $this->Ln(5);
        $this->Cell(0, 5, ' ' . $this->PageNo(), 0, 0, 'C');
    }
}

class PDFSubMayorVacacionesCombinado extends fpdf
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
        //$this->Ln(30 - $altoHoja);
        $this->Ln(5);
        $this->SetFont('Arial', 'B', 8);
        //$this->SetY(-30);
//        $this->SetX(20);
//        $this->Write(5, 'POR RECURSOS HUMANOS');
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
//      $this->SetX(135);
//      $this->Write(5, 'REVISADO POR:');
        $this->SetX($cordX);
        $this->Write(5, 'HORA IMPRESION: ');
        $this->SetFont('Arial', '', 8);
        $this->Write(5, $hora);
        $this->SetFont('Arial', 'B', 8);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'REVISADO Y APROBADO POR:');
//      $this->SetX(135);
//      $this->Write(5, 'CONTABILIZADO POR:');
        $this->SetFont('Arial', 'B', 8);
        $this->Ln(1);
        $this->Cell(0, 5, ' ' . $this->PageNo(), 0, 0, 'C');
    }
}

class PDF_Rotate extends fpdf
{
    var $angle = 0;

    function Rotate($angle, $x = -1, $y = -1)
    {
        if ($x == -1)
            $x = $this->x;
        if ($y == -1)
            $y = $this->y;
        if ($this->angle != 0)
            $this->_out('Q');
        $this->angle = $angle;
        if ($angle != 0) {
            $angle *= M_PI / 180;
            $c = cos($angle);
            $s = sin($angle);
            $cx = $x * $this->k;
            $cy = ($this->h - $y) * $this->k;
            $this->_out(sprintf('q %.5F %.5F %.5F %.5F %.2F %.2F cm 1 0 0 1 %.2F %.2F cm', $c, $s, -$s, $c, $cx, $cy, -$cx, -$cy));
        }
    }

    function _endpage()
    {
        if ($this->angle != 0) {
            $this->angle = 0;
            $this->_out('Q');
        }
        parent::_endpage();
    }
}

class ReporteSubVacacionespdfModel extends ZendExt_Model
{

    private $identidad;
    private $tipofaltante;

    public function ReporteSubVacacionespdfModel()
    {
        parent::ZendExt_Model();

    }

    //Esta funcionalidad construye el submayor de vacaciones general dado un rango de fechas
    public function construirReporteGeneral($objNominaSaldoAcumLiq, $saldoinicial, $fechainicio, $fechafin, $nombreentidad, $identidad)
    {
        $this->identidad = $identidad;
        $pdf = new PDFSubMayorVacaciones('L', 'mm', 'A4');
        $pdf->SetTitle("Reporte Sub-Mayor de Vacaciones General");
        $pdf->SetAuthor("Tte. Ing. Frank Rodriguez Berroa");
        $pdf->SetLeftMargin(2);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 16);
        $pdffinal = $this->cabeceraReportesGeneral($pdf, $fechainicio, $fechafin, $nombreentidad);
        $pdffinal = $this->cuerpoReporteGeneral($pdf, $objNominaSaldoAcumLiq, $saldoinicial);
        $pdffinal->Output();
    }

    public function cuerpoReporteGeneral($pdf, $objNominaSaldoAcumLiq, $saldoinicial)
    {
        $pdf->SetFont('Arial', 'B', 15);
        //Capturo x,y
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        //Pinto la primera fila
        $pdf->Text($xpossition + 18, $ypossition + 23, utf8_decode("Fecha"));
        $pdf->Cell(55, 25, "", 1, 0);
        //Capturo x,y
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        //Pinto la segunda fila
        $pdf->Text($xpossition + 12, $ypossition + 23, utf8_decode("No. Nomina"));
        $pdf->Cell(55, 25, "", 1, 0);
        //Capturo x,y
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        //Pinto la tercera fila
        $pdf->Text($xpossition + 12, $ypossition + 9, utf8_decode("Importe de"));
        $pdf->Text($xpossition + 12, $ypossition + 16, utf8_decode("Vacaciones"));
        $pdf->Text($xpossition + 14, $ypossition + 23, utf8_decode("Pagadas"));
        $pdf->Cell(55, 25, "", 1, 0);
        //Capturo x,y
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        //Pinto la cuarta fila
        $pdf->Text($xpossition + 14, $ypossition + 9, utf8_decode("Importe de"));
        $pdf->Text($xpossition + 13, $ypossition + 16, utf8_decode("Vacaciones"));
        $pdf->Text($xpossition + 12, $ypossition + 23, utf8_decode("Acumuladas"));
        $pdf->Cell(55, 25, "", 1, 0);
        //Capturo x,y
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        //Pinto la quinta fila
        $pdf->Text($xpossition + 14, $ypossition + 16, utf8_decode("Saldo de"));
        $pdf->Text($xpossition + 12, $ypossition + 23, utf8_decode("Vacaciones"));
        $pdf->Cell(55, 25, "", 1, 0);
        //Salto de linea
        $pdf->Ln(25);
        //Calculo el saldo total y pinto las celdas de los datos
        $saldofinal = 0;
        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(55, 8, "", 1, 0);
        //Capturo x,y
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        $pdf->Cell(55, 8, "" . utf8_decode("Saldo Inicial"), 1, 0, "C");
        $pdf->Cell(55, 8, "", 1, 0);
        $pdf->Cell(55, 8, "", 1, 0);
        //Capturo x,y
        $xaux = $pdf->GetX();
        $yaux = $pdf->GetY();

        /* foreach($objNominaSaldoAcumLiq as $r=>$datosr){
            //Sumando los importes
            if($datosr->tipooperacion == 1){
            $saldofinal += $datosr->importeacumulado;
            }else{
            $saldofinal -= $datosr->importeacumulado;
            }
         }*/
        $pdf->Cell(55, 8, "" . $saldofinal, 1, 0, "R");
        $pdf->Ln(8);
        $saldovacaciones = 0;
        $vacacionespagadas = 0;
        $vacacionesacumuladas = 0;

        /* foreach($objNominaSaldoAcumLiq as $i=>$datos){
            //Sumando los importes
            if($datos->tipooperacion == 1){
            $vacacionesacumuladas += $datos->importeacumulado;
            $saldovacaciones += number_format($datos->importeacumulado, 2, '.', '');
            }else{
            $vacacionespagadas += $datos->importeacumulado;
            $saldovacaciones -= number_format($datos->importeacumulado, 2, '.', '');
            }
            //Capturo x,y y pinto la primera columna de la fila
            $xpossition = $pdf->GetX();
            $ypossition = $pdf->GetY();
            $pdf->Cell(55,8,"".$datos->fechaoperacion,1,0, "C");
            //Capturo x,y y pinto la segunda columna de la fila
            $xpossition = $pdf->GetX();
            $ypossition = $pdf->GetY();
            $pdf->Cell(55,8,"".$datos->numnomina,1,0, "C");
            //Capturo x,y y pinto la tercera columna de la fila
            $xpossition = $pdf->GetX();
            $ypossition = $pdf->GetY();
            $pdf->Cell(55,8,"".($datos->tipooperacion==2)?number_format($datos->importeacumulado, 2, '.', ''):number_format(0.00, 2, '.', ''),1,0, "R");
            $pdf->Cell(55,8,"".($datos->tipooperacion==2)?number_format($datos->importeacumulado, 2, '.', ''):number_format(0.00, 2, '.', ''),1,0, "R");
            //Capturo x,y y pinto la cuarta columna de la fila
            $xpossition = $pdf->GetX();
            $ypossition = $pdf->GetY();
            $pdf->Cell(55,8,"".($datos->tipooperacion==1)?number_format($datos->importeacumulado, 2, '.', ''):number_format(0.00, 2, '.', ''),1,0, "R");
            //Capturo x,y y pinto la cuarta columna de la fila
            $xpossition = $pdf->GetX();
            $ypossition = $pdf->GetY();
            $pdf->Cell(55,8,"".utf8_decode(number_format($saldovacaciones, 2, '.', '')),1,0, "R");
            //Salto de linea
            $pdf->Ln(8);
         }

    */
        //Total
        $pdf->SetFont('Arial', 'B', 12);
        //Capturo x,y y pinto la primera columna de la fila
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        $pdf->Cell(55, 8, "Total", 1, 0, "C");
        //Capturo x,y y pinto la segunda columna de la fila
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        $pdf->Cell(55, 8, "" . number_format($saldoinicial, 2, '.', ''), 1, 0, "R");
        // $pdf->Cell(55,8,"",1,0, "C");
        //Capturo x,y y pinto la tercera columna de la fila
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        // $pdf->Cell(55,8,"".number_format($vacacionespagadas, 2, '.', ''),1,0, "R");
        $pdf->Cell(55, 8, "" . number_format($objNominaSaldoAcumLiq['liquidacion'], 2, '.', ''), 1, 0, "R");
        //Capturo x,y y pinto la cuarta columna de la fila
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        // $pdf->Cell(55,8,"".number_format($vacacionesacumuladas, 2, '.', ''),1,0, "R");
        $pdf->Cell(55, 8, "" . number_format($objNominaSaldoAcumLiq['acumulacion'], 2, '.', ''), 1, 0, "R");
        //Capturo x,y y pinto la cuarta columna de la fila
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        $pdf->Cell(55, 8, "" . number_format(($saldoinicial + $objNominaSaldoAcumLiq['acumulacion']) - ($objNominaSaldoAcumLiq['liquidacion']), 2, '.', ''), 1, 0, "R");
        //Salto de linea
        $pdf->Ln(8);
        return $pdf;
    }

    public function cabeceraReportesGeneral($pdf, $fechainicio, $fechafin, $nombreentidad)
    {
        //Titulo
        $pdf->Text(110, 20, utf8_decode("SUB MAYOR VACACIONES"));
        $pdf->Text(130, 30, utf8_decode("GENERAL"));

        //Logo de la entidad
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        list($imagenBase64,) = explode(';', $arrEstruct[0]->logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($arrEstruct[0]->logo)) {
            $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }
        $pdf->Ln(5);
        /*$register = Zend_Registry::getInstance();
        $direccion = $register->config->modulo_path . 'views/images/logotrd.jpg';
        $pdf->Image($direccion, 5, 5, 22, 10);
        $pdf->Ln(8);*/

        // 	$pdf->Text(50, 40, utf8_decode("Entidad:".$nombreentidad.""));
        $pdf->Cell(300, 60, '' . utf8_decode('Entidad: ' . $nombreentidad . ''), 0, 0, "C");
        //	$pdf->Text(85, 50, utf8_decode("Periodo: Desde ".$fechainicio." Hasta ".$fechafin));
        $pdf->SetX(10);
        $pdf->SetY(60);
        return $pdf;
    }

    //Esta funcionalidad construye el submayor de vacaciones por trabajador dado un rango de fechas
    public function construirReportePorTrabajador($arrayidpersonas, $identidad, $nombreentidad)
    {
        $this->identidad = $identidad;
        $objNominaSaldoAcumLiq = null;
        $contobj = 0;
        $contador = 1;
        $pdf = new PDFSubMayorVacaciones('L', 'mm', 'A4');
        $pdf->SetTitle("Reporte Sub-Mayor de Vacaciones Por Trabajador");
        $pdf->SetAuthor("Tte. Ing. Frank Rodriguez Berroa");
        $pdf->SetLeftMargin(2);
        $pdf->AddPage();
        foreach ($arrayidpersonas as $i => $valor) {
            $idpersona = $valor->idpersona;
            //Busco los datos de la persona
            $sqlDatosPersona = "select dp.idpersona, dp.nombre, dp.snombre, dp.papel, dp.sapel,di.numero as ci,cpn.denominacion as area from mod_persona.dat_persona dp
                            inner join mod_nomina.dat_cargosocupados dcoc on(dcoc.idpersona = dp.idpersona)
                            left join mod_nomina.conf_plantillanominalcargo cpnca on(cpnca.idcargo = dcoc.idcargo)
                            left join mod_nomina.conf_plantillanominal cpn on(cpn.idplantillanominal = cpnca.idplantillanominal)
                            left join mod_persona.dat_docidentidad di on(di.idpersona = dp.idpersona) where dp.idpersona = $idpersona
                            and dp.feliminado is null
                            and dcoc.fechavencimiento is null;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrdatpersona = $conn->fetchAll($sqlDatosPersona);
            //Busco lo que acumulo cada persona o se le pago
            $sqlpersonasacumulanliquidan = "select hv.*, dvac.idpersona, nomtnom.denominacion, nomtnom.idtiponomina, delp.idelaborarpagos,
             delp.fechapago, dnom.numeronomina, dcnpp.consecutivo, dcnpp.anno
        from mod_nomina.his_vacacionespersona hv
        inner join mod_nomina.dat_vacacionespersona dvac on(dvac.idvacacionespersona = hv.idvacacionespersona)
        inner join mod_nomina.dat_nomina dnom on(dnom.idnomina = hv.idnomina)
        inner join mod_nomina.dat_elaborarpagos delp on(delp.idelaborarpagos = dnom.idelaborarpago)
        inner join mod_nomina.dat_consecutivosnominaporpagos dcnpp on(dcnpp.idelaborarpagos = delp.idelaborarpagos)
		inner join mod_nomina.conf_modelonomina cmodn on(cmodn.idtipopago = delp.idtipopago)
        inner join mod_nomina.nom_tiponomina nomtnom on(nomtnom.idtiponomina = cmodn.idtiponomina)
        where dvac.idpersona = $idpersona
		order by hv.idhisvacacionespersona ASC";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrpersonasacumulanliquidan = $conn->fetchAll($sqlpersonasacumulanliquidan);
            //print_r($arrpersonasacumulanliquidan);die;
            if (count($arrpersonasacumulanliquidan) > 0) {

                foreach ($arrpersonasacumulanliquidan as $i => $value) {
                    //$objNominaSaldoAcumLiq[$contobj]->numnomina = $value['idtiponomina'];
                    //$objNominaSaldoAcumLiq[$contobj]->numnomina = $value['numeronomina'];
                    $objNominaSaldoAcumLiq[$contobj]->numnomina = $value['consecutivo'] . "/" . $value['anno'];
                    $objNominaSaldoAcumLiq[$contobj]->tiponomina = $value['denominacion'];
                    $objNominaSaldoAcumLiq[$contobj]->idelaborarpagos = $value['idelaborarpagos'];
                    $objNominaSaldoAcumLiq[$contobj]->fechaoperacion = $value['fechaoperacion'];
                    $objNominaSaldoAcumLiq[$contobj]->fechapago = $value['fechapago'];
                    $objNominaSaldoAcumLiq[$contobj]->tipooperacion = $value['tipooperacion'];
                    $objNominaSaldoAcumLiq[$contobj]->importeacumulado = $value['importeacumulado'];
                    $objNominaSaldoAcumLiq[$contobj]->tiempoacumulado = $value['tiempoacumulado'];
                    $objNominaSaldoAcumLiq[$contobj]->saldoentiempo = $value['saldoentiempo'];
                    $objNominaSaldoAcumLiq[$contobj]->saldoenimporte = $value['saldoenimporte'];
                    $contobj++;
                }
            }
            $pdffinal = $this->cabeceraReportesPorTrabajador($pdf, $arrdatpersona, $identidad, $nombreentidad);
            $pdffinal = $this->cuerpoReportePorTrabajador($pdf, $objNominaSaldoAcumLiq, $contador, count($arrayidpersonas));
            $contador++;
        }
        $pdffinal->Output();
    }

    public function cabeceraReportesPorTrabajador($pdf, $arrdatpersona, $identidad, $nombreentidad)
    {
        //Titulo
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Cell(280, 10, 'SUB MAYOR VACACIONES', 0, 1, 'C', 0);
        $pdf->Cell(280, 10, 'INDIVIDUAL', 0, 1, 'C', 0);

        //Logo de la entidad
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        list($imagenBase64,) = explode(';', $arrEstruct[0]->logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($arrEstruct[0]->logo)) {
            $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }
        $pdf->Ln(5);
        /*$register = Zend_Registry::getInstance();
        $direccion = $register->config->modulo_path . 'views/images/logotrd.jpg';
        $pdf->Image($direccion, 5, 5, 22, 10);
        $pdf->Ln(8);*/

        //Nombre entidad
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(22, 10, 'Entidad: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 14);
        $pdf->Cell(280, 10, utf8_decode($nombreentidad), 0, 1, 'L', 0);
        //Codigo contable
        $cdgocontable = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersona($arrdatpersona[0]['idpersona'], $identidad);
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(53, 10, utf8_decode('Código del trabajador: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 14);
        $pdf->Cell(280, 10, utf8_decode($cdgocontable[0]['cdgocontable']), 0, 1, 'L', 0);
        //Nombre y apellidos
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(50, 10, utf8_decode('Nombre y apellidos: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 14);
        $pdf->Cell(280, 10, utf8_decode($arrdatpersona[0]['nombre'] . " " . $arrdatpersona[0]['snombre'] . " " . $arrdatpersona[0]['papel'] . " " . $arrdatpersona[0]['sapel']), 0, 1, 'L', 0);
        //Unidad Organizativa
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(52, 10, 'Unidad organizativa:', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 14);
        $pdf->Cell(280, 10, utf8_decode($arrdatpersona[0]['area']), 0, 1, 'L', 0);
        return $pdf;
    }

    public function cuerpoReportePorTrabajador($pdf, $objNominaSaldoAcumLiq, $contador, $longitudarray)
    {
        $pdf->SetFont('Arial', 'B', 12);
        //Pinto la primera columna
        $pdf->Cell(55, 25, utf8_decode("Fecha"), 1, 0, 'C');
        //Pinto la segunda columna
        $pdf->Cell(55, 25, utf8_decode("No. Nómina"), 1, 0, 'C');
        //Pinto la tercera columna
        $pdf->Cell(55, 15, "Vacaciones pagadas", 1, 0, 'C');
        //Pinto la cuarta columna
        $pdf->Cell(55, 15, "Vacaciones acumuladas", 1, 0, 'C');
        //Pinto la quinta columna
        $pdf->Cell(55, 15, "Saldo de vacaciones", 1, 1, 'C');

        $pdf->Cell(110, 10, "", 0, 0, 'C');
        $pdf->Cell(20, 10, "Dias", 1, 0, 'C');
        $pdf->Cell(35, 10, "Importe", 1, 0, 'C');
        $pdf->Cell(20, 10, "Dias", 1, 0, 'C');
        $pdf->Cell(35, 10, "Importe", 1, 0, 'C');
        $pdf->Cell(20, 10, "Dias", 1, 0, 'C');
        $pdf->Cell(35, 10, "Importe", 1, 1, 'C');
        //Calculo el saldo total y pinto las celdas de los datos
        $saldofinalimporte = 0;
        $saldofinaldias = 0;
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(55, 8, "", 1, 0);
        //Capturo x,y
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(55, 8, "Saldo inicial" . utf8_decode(""), 1, 0, "C");
        $pdf->Cell(20, 8, "" . utf8_decode(""), 1, 0, "C");
        $pdf->Cell(35, 8, "" . utf8_decode(""), 1, 0, "C");
        $pdf->Cell(20, 8, "" . utf8_decode(""), 1, 0, "C");
        $pdf->Cell(35, 8, "" . utf8_decode(""), 1, 0, "C");

        //Capturo x,y
        $xaux = $pdf->GetX();
        $yaux = $pdf->GetY();

        $pdf->Cell(20, 8, "" . number_format($objNominaSaldoAcumLiq[0]->saldoentiempo - $objNominaSaldoAcumLiq[0]->tiempoacumulado, 2, '.', ''), 1, 0, "C");
        $pdf->Cell(35, 8, "" . number_format($objNominaSaldoAcumLiq[0]->saldoenimporte - $objNominaSaldoAcumLiq[0]->importeacumulado, 2, '.', ''), 1, 0, "C");
        $pdf->Ln(8);
        $saldovacaciones = 0;
        $tiempoacumulado = 0;
        $importeacumulado = 0;
        $tiempoliquidado = 0;
        $importeliquidado = 0;
        $pdf->SetFont('Arial', '', 10);
        //print_r($objNominaSaldoAcumLiq) ;die;
        foreach ($objNominaSaldoAcumLiq as $i => $datos) {
            //Capturo x,y y pinto la primera columna de la fila
            $xpossition = $pdf->GetX();
            $ypossition = $pdf->GetY();
            $pdf->Cell(55, 8, "" . $datos->fechapago, 1, 0, "C");
            //Capturo x,y y pinto la segunda columna de la fila
            $xpossition = $pdf->GetX();
            $ypossition = $pdf->GetY();
            $pdf->Cell(55, 8, "" . $datos->numnomina, 1, 0, "C");
            //Capturo x,y y pinto la tercera columna de la fila
            $xpossition = $pdf->GetX();
            $ypossition = $pdf->GetY();
            $pdf->Cell(20, 8, "" . ($datos->tipooperacion == 2) ? $datos->tiempoacumulado : number_format(0.00, 2, '.', ''), 1, 0, "C");
            //Capturo x,y y pinto la cuarta columna de la fila
            $xpossition = $pdf->GetX();
            $ypossition = $pdf->GetY();
            $pdf->Cell(35, 8, "" . ($datos->tipooperacion == 2) ? $datos->importeacumulado : number_format(0.00, 2, '.', ''), 1, 0, "C");
            //Capturo x,y y pinto la quinta columna de la fila
            $xpossition = $pdf->GetX();
            $ypossition = $pdf->GetY();
            $pdf->Cell(20, 8, "" . ($datos->tipooperacion == 1) ? $datos->tiempoacumulado : number_format(0.00, 2, '.', ''), 1, 0, "C");
            //Capturo x,y y pinto la sexta columna de la fila
            $xpossition = $pdf->GetX();
            $ypossition = $pdf->GetY();
            $pdf->Cell(35, 8, "" . ($datos->tipooperacion == 1) ? $datos->importeacumulado : number_format(0.00, 2, '.', ''), 1, 0, "C");
            //Capturo x,y y pinto la septima columna de la fila
            $xpossition = $pdf->GetX();
            $ypossition = $pdf->GetY();
            $pdf->Cell(20, 8, "" . utf8_decode(number_format($datos->saldoentiempo, 2, '.', '')), 1, 0, "C");
            $pdf->Cell(35, 8, "" . utf8_decode(number_format($datos->saldoenimporte, 2, '.', '')), 1, 0, "C");
            //Salto de linea
            $pdf->Ln(8);
            //Incremento los totales
            if ($datos->tipooperacion == 1) {
                $tiempoacumulado += $datos->tiempoacumulado;
                $importeacumulado += $datos->importeacumulado;
            } else {
                $tiempoliquidado += $datos->tiempoacumulado;
                $importeliquidado += $datos->importeacumulado;
            }
        }
        //Capturo x,y y pinto la primera columna de la fila
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(55, 8, "Total", 1, 0, "C");
        //Capturo x,y y pinto la segunda columna de la fila
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        $pdf->Cell(55, 8, "", 1, 0, "C");
        //Capturo x,y y pinto la tercera columna de la fila
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        $pdf->Cell(20, 8, "" . number_format($tiempoliquidado, 2, '.', ''), 1, 0, "C");
        //Capturo x,y y pinto la cuarta columna de la fila
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        $pdf->Cell(35, 8, "" . number_format($importeliquidado, 2, '.', ''), 1, 0, "C");
        //Capturo x,y y pinto la quinta columna de la fila
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        $pdf->Cell(20, 8, "" . number_format($tiempoacumulado, 2, '.', ''), 1, 0, "C");
        //Capturo x,y y pinto la sexta columna de la fila
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        $pdf->Cell(35, 8, "" . number_format($importeacumulado, 2, '.', ''), 1, 0, "C");
        //Capturo x,y y pinto la septima columna de la fila
        $xpossition = $pdf->GetX();
        $ypossition = $pdf->GetY();
        $pdf->Cell(20, 8, "" . $objNominaSaldoAcumLiq[count($objNominaSaldoAcumLiq) - 1]->saldoentiempo, 1, 0, "C");
        $pdf->Cell(35, 8, "" . $objNominaSaldoAcumLiq[count($objNominaSaldoAcumLiq) - 1]->saldoenimporte, 1, 0, "C");
        //Salto de linea
        $pdf->Ln(8);
        if ($contador < $longitudarray) {
            $pdf->AddPage();
            $pdf->SetFont('Arial', 'B', 16);
        }
        return $pdf;
    }

    //Esta funcionalidad construye el submayor de vacaciones de todos los trabajadores
    public function construirReporteCombinado($objNominaSaldoAcumLiq, $limitetiempo, $identidad, $nombreentidad)
    {
        $this->identidad = $identidad;
        $pdf = new PDFSubMayorVacaciones('L', 'mm', 'Letter');
        if ($limitetiempo == 1) {
            $pdf->SetTitle("Reporte Sub-Mayor de Vacaciones de los Trabajadores con más de 20 días acumulados");
            $pdf->SetAuthor("Ing. Jorge Martínez Rodríguez ");
        } else {
            $pdf->SetTitle("Reporte Sub-Mayor de Vacaciones De Todos Los Trabajadores");
            $pdf->SetAuthor("Tte. Ing. Frank Rodriguez Berroa");
        }
        $pdf->SetLeftMargin(2);
        $pdf->AddPage();
        $pdffinal = $this->cabeceraReportesCombinado($pdf, $limitetiempo, $nombreentidad);
        $pdffinal = $this->encabezadoReportePorCombinado($pdf);
        $pdffinal = $this->cuerpoReportePorCombinado($pdf, $objNominaSaldoAcumLiq, $identidad);
        $pdffinal->Output();

    }

    public function construirReportePersonasLimiteTiempo($objNominaSaldoAcumLiq, $fechainicio, $fechafin, $identidad, $nombreentidad)
    {
        $this->identidad = $identidad;
        $pdf = new PDFSubMayorVacacionesCombinado('L', 'mm', 'Letter'); //216(ancho) X 279(alto)
        $pdf->SetTitle("Reporte Sub-Mayor de Vacaciones de los Trabajadores con más de 21 días acumulados");
        $pdf->SetAuthor("Ing. Jorge Martínez Rodriguez");
        $pdf->SetLeftMargin(2);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 16);
        $pdffinal = $this->cabeceraReportesCombinado($pdf, $fechainicio, $fechafin, $nombreentidad);
        $pdffinal = $this->encabezadoReportePorCombinado($pdf);
        $pdffinal = $this->cuerpoReportePorCombinado($pdf, $objNominaSaldoAcumLiq, $identidad);
        $pdffinal->Output();
    }

    public function cabeceraReportesCombinado($pdf, $limitetiempo, $nombreentidad)
    {
        $pdf->SetFont('Arial', 'B', 14);
        //Titulo
        $titulo = ($limitetiempo == 1) ? "TRABAJADORES CON MÁS DE 20 DÍAS ACUMULADOS" :
            "RELACIÓN DE TODOS LOS TRABAJADORES";
        $pdf->Cell(280, 10, 'SUB MAYOR VACACIONES', 0, 1, 'C', 0);
        $pdf->Cell(280, 10, utf8_decode($titulo), 0, 1, 'C', 0);

        //Logo de la entidad
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        list($imagenBase64,) = explode(';', $arrEstruct[0]->logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($arrEstruct[0]->logo)) {
            $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }
        $pdf->Ln(5);
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(30, 10, 'Entidad: ', 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 14);
        $pdf->Cell(280, 10, utf8_decode($nombreentidad), 0, 1, 'L', 0);
        return $pdf;
    }

    public function encabezadoReportePorCombinado($pdf)
    {
        $pdf->Ln(2);
        $pdf->SetFont('Arial', 'B', 10);
        //Primera columna
        $pdf->Cell(10, 15, "No.", 1, 0, "C");
        //Segunda columna
        $pdf->Cell(10, 15, "Cod.", 1, 0, "C");
        //Tercera columna
        $pdf->Cell(30, 15, "CI", 1, 0, "C");
        //Cuarta columna
        $pdf->Cell(105, 15, "Nombre y apellidos", 1, 0, "C");
        //Restantes columnas
        $pdf->Cell(30, 5, "Carga inicial", 1, 0, "C");
        $pdf->Cell(30, 5, "Total acumulado", 1, 0, "C");
        $pdf->Cell(30, 5, "Total pagado", 1, 0, "C");
        $pdf->Cell(30, 5, "Saldo final", 1, 1, "C");

        $pdf->Cell(155, 10, "", 0, 0, "C");
        //Carga inicial
        $pdf->Cell(15, 10, utf8_decode("Días"), 1, 0, "C");
        $pdf->Cell(15, 10, "Importe", 1, 0, "C");
        //Total acumulado
        $pdf->Cell(15, 10, utf8_decode("Días"), 1, 0, "C");
        $pdf->Cell(15, 10, "Importe", 1, 0, "C");
        //Total pagado
        $pdf->Cell(15, 10, utf8_decode("Días"), 1, 0, "C");
        $pdf->Cell(15, 10, "Importe", 1, 0, "C");
        //Saldo final
        $pdf->Cell(15, 10, utf8_decode("Días"), 1, 0, "C");
        $pdf->Cell(15, 10, "Importe", 1, 1, "C");
        return $pdf;
    }

    public function cuerpoReportePorCombinado($pdf, $objNominaSaldoAcumLiq, $identidad)
    {
        //Calculo el saldo total y pinto las celdas de los datos
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetFillColor(200);//Definiendo el color de celdas

        $tiempoinicialfinal = 0;
        $importeinicialfinal = 0;
        $tiempoacumuladofinal = 0;
        $importeacumuladofinal = 0;
        $tiempopagadofinal = 0;
        $importepagadofinal = 0;
        $saldofinaltiempofinal = 0;
        $saldofinalimportefinal = 0;
        $contcentros = 0;
        $no = 1;//numero de cada una de las personas en orden ascendente
        foreach ($objNominaSaldoAcumLiq as $i => $centro) {
            list($num, $denomarea) = explode('-', $centro['centro']);
            $contcentros++;
            $pdf->SetFillColor(240);//Definiendo el color de celdas
            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Line(2, $pdf->GetY(), 275, $pdf->GetY()); //Horizontal inicial
            $pdf->Cell(275, 6, utf8_decode($denomarea), 1, 1, 'L', 1);
            $pdf->Line(2, $pdf->GetY(), 275, $pdf->GetY()); //Horizontal inicial
            $y = $pdf->GetY();
            if ($y >= 180) {
                $pdf->AddPage();
                $this->encabezadoReportePorCombinado($pdf);
            }
            $pdf->SetFont('Arial', '', 10);
            $tiempoinicialcentro = 0;
            $importeinicialcentro = 0;
            $tiempoacumuladocentro = 0;
            $importeacumuladocentro = 0;
            $tiempopagadocentro = 0;
            $importepagadocentro = 0;
            $saldofinaltiempocentro = 0;
            $saldofinalimportecentro = 0;
            foreach ($centro as $p => $datos) {
                if ($p !== 'centro') {
                    //No
                    $pdf->Cell(10, 6, $no, 1, 0, "C");
                    //Codigo contable
                    $cdgocontable = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersona($datos->idpersona, $identidad);
                    $pdf->Cell(10, 6, $cdgocontable[0]['cdgocontable'], 1, 0, "C");
                    //CI
                    $pdf->Cell(30, 6, $datos->ci, 1, 0, "C");
                    //Nombre y apellidos
                    $pdf->Cell(105, 6, "" . utf8_decode(substr(($datos->nombreyapp), 0, 38)), 1, 0, "L");
                    //Carga inicial Dias - Importe
                    $pdf->Cell(15, 6, "" . number_format($datos->tiempoinicial, 2, '.', ''), 1, 0, "R");
                    $pdf->Cell(15, 6, "" . number_format($datos->importeinicial, 2, '.', ''), 1, 0, "R");
                    //Total acumulado Dias - Importe
                    $pdf->Cell(15, 6, "" . number_format($datos->tiempoacumulado, 2, '.', ''), 1, 0, "R");
                    $pdf->Cell(15, 6, "" . number_format($datos->importeacumulado, 2, '.', ''), 1, 0, "R");
                    //Total pagado Dias - Importe
                    $pdf->Cell(15, 6, "" . number_format($datos->tiempopagado, 2, '.', ''), 1, 0, "R");
                    $pdf->Cell(15, 6, "" . number_format($datos->importepagado, 2, '.', ''), 1, 0, "R");
                    //Saldo final Dias - Importe
                    $pdf->Cell(15, 6, "" . number_format($datos->saldofinaltiempo, 2, '.', ''), 1, 0, "R");
                    $pdf->Cell(15, 6, "" . number_format($datos->saldofinalimporte, 2, '.', ''), 1, 0, "R");

                    $pdf->Ln(6);
                    $y = $pdf->GetY();
                    if ($y >= 180) {
                        $pdf->AddPage();
                        $this->encabezadoReportePorCombinado($pdf);
                    }
                    $pdf->SetFont('Arial', '', 10);
                    //Sumando los valores para el subtotal por centro
                    $tiempoinicialcentro += $datos->tiempoinicial;
                    $importeinicialcentro += $datos->importeinicial;
                    $tiempoacumuladocentro += $datos->tiempoacumulado;
                    $importeacumuladocentro += $datos->importeacumulado;
                    $tiempopagadocentro += $datos->tiempopagado;
                    $importepagadocentro += $datos->importepagado;
                    $saldofinaltiempocentro += $datos->saldofinaltiempo;
                    $saldofinalimportecentro += $datos->saldofinalimporte;
                    $no++;
                }
            }
            $y = $pdf->GetY();
            if ($y >= 180) {
                $pdf->AddPage();
                $this->encabezadoReportePorCombinado($pdf);
            }
            //Pintando el Subtotal por Centro
            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Cell(155, 6, "Sub total", 1, 0, "C", 0);
            //Carga inicial Dias - Importe
            $pdf->Cell(15, 6, "" . number_format($tiempoinicialcentro, 2, '.', ''), 1, 0, "R");
            $pdf->Cell(15, 6, "" . number_format($importeinicialcentro, 2, '.', ''), 1, 0, "R");
            //Total acumulado Dias - Importe
            $pdf->Cell(15, 6, "" . number_format($tiempoacumuladocentro, 2, '.', ''), 1, 0, "R");
            $pdf->Cell(15, 6, "" . number_format($importeacumuladocentro, 2, '.', ''), 1, 0, "R");
            //Total pagado Dias - Importe
            $pdf->Cell(15, 6, "" . number_format($tiempopagadocentro, 2, '.', ''), 1, 0, "R");
            $pdf->Cell(15, 6, "" . number_format($importepagadocentro, 2, '.', ''), 1, 0, "R");
            //Saldo final Dias - Importe
            $pdf->Cell(15, 6, "" . number_format($saldofinaltiempocentro, 2, '.', ''), 1, 0, "R");
            $pdf->Cell(15, 6, "" . number_format($saldofinalimportecentro, 2, '.', ''), 1, 1, "R");

            //Sumando los valores para el total general
            $tiempoinicialfinal += $tiempoinicialcentro;
            $importeinicialfinal += $importeinicialcentro;
            $tiempoacumuladofinal += $tiempoacumuladocentro;
            $importeacumuladofinal += $importeacumuladocentro;
            $tiempopagadofinal += $tiempopagadocentro;
            $importepagadofinal += $importepagadocentro;
            $saldofinaltiempofinal += $saldofinaltiempocentro;
            $saldofinalimportefinal += $saldofinalimportecentro;

            if ($contcentros != count($centro)) {
                // $this->fnAdicionarPaginaPorPlantilla($pdf);
            }
        }

        //Pintando el Total General
        $pdf->Ln(5);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(155, 6, "Total", 1, 0, "C", 0);
        $pdf->SetFont('Arial', 'B', 9);

        //Carga inicial Dias - Importe
        $pdf->Cell(15, 6, "" . number_format($tiempoinicialfinal, 2, '.', ''), 1, 0, "R");
        $pdf->Cell(15, 6, "" . number_format($importeinicialfinal, 2, '.', ''), 1, 0, "R");
        //Total acumulado Dias - Importe
        $pdf->Cell(15, 6, "" . number_format($tiempoacumuladofinal, 2, '.', ''), 1, 0, "R");
        $pdf->Cell(15, 6, "" . number_format($importeacumuladofinal, 2, '.', ''), 1, 0, "R");
        //Total pagado Dias - Importe
        $pdf->Cell(15, 6, "" . number_format($tiempopagadofinal, 2, '.', ''), 1, 0, "R");
        $pdf->Cell(15, 6, "" . number_format($importepagadofinal, 2, '.', ''), 1, 0, "R");
        //Saldo final Dias - Importe
        $pdf->Cell(15, 6, "" . number_format($saldofinaltiempofinal, 2, '.', ''), 1, 0, "R");
        $pdf->Cell(15, 6, "" . number_format($saldofinalimportefinal, 2, '.', ''), 1, 1, "R");
        return $pdf;
    }

    //Esta funcionalidad construye la carga inicial
    public function construirReporteCargaInicial($identidad, $objCargaInicial, $nombreentidad)
    {
        $this->identidad = $identidad;
        $pdf = new PDFSubMayorVacaciones('L', 'mm', 'Letter');
        $pdf->SetTitle("Reporte de la Carga Inicial");
        $pdf->SetAuthor("Tte. Ing. Frank Rodriguez Berroa");
        $pdf->SetLeftMargin(2);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 12);
        $pdffinal = $this->cabeceraReportesCargaInicial($pdf, $nombreentidad);
        $pdffinal = $this->encabezadoReporteCargaInicial($pdf);
        $pdffinal = $this->cuerpoReporteCargaInicial($pdf, $objCargaInicial);
        $pdffinal->Output();
    }

    public function cabeceraReportesCargaInicial($pdf, $nombreentidad)
    {
        $pdf->SetFont('Arial', 'B', 14);
        //Titulo
        $pdf->Cell(280, 10, 'SUB MAYOR VACACIONES', 0, 1, 'C', 0);
        $pdf->Cell(280, 10, 'CARGA INICIAL', 0, 1, 'C', 0);

        //Logo de la entidad
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
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

        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(30, 10, 'Entidad: ', 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 14);
        $pdf->Cell(280, 10, utf8_decode($nombreentidad), 0, 1, 'L', 0);
        return $pdf;
    }

    public function encabezadoReporteCargaInicial($pdf)
    {
        $pdf->SetFont('Arial', 'B', 10);
        //Pinto la primera fila
        $pdf->Cell(20, 12, "No.", 1, 0, 'C');
        //Pinto la segunda fila
        $pdf->Cell(35, 12, "CI", 1, 0, 'C');
        //Pinto la tercera fila
        $pdf->Cell(100, 12, "Nombre y apellidos", 1, 0, 'C');
        //Pinto la cuarta fila
        $pdf->Cell(60, 12, "Tiempo acumulado", 1, 0, 'C');
        //Pinto la quinta fila
        $pdf->Cell(60, 12, "Importe acumulado", 1, 1, 'C');
        return $pdf;
    }

    public function cuerpoReporteCargaInicial($pdf, $objCargaInicial)
    {

        //Calculo el saldo total y pinto las celdas de los datos
        $pdf->SetFont('Arial', '', 8);
        $no = 0;
        $tiempototal = 0;
        $importetotal = 0;
        foreach ($objCargaInicial as $c => $centro) {
            $pdf->SetFillColor(240);//Definiendo el color de celdas
            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Cell(275, 6, utf8_decode($centro['centro']), 1, 1, 'L', 1);
            $y = $pdf->GetY();
            if ($y >= 178) {
                $pdf->AddPage();
                $this->encabezadoReporteCargaInicial($pdf);
                $pdf->SetFont('Arial', '', 8);
            }
            $tiempoacumuladoinicialtotal = 0;
            $importeacumuladoinicialtotal = 0;
            foreach ($centro['personas'] as $p => $datos) {
                $no++;
                $pdf->SetFont('Arial', '', 10);
                //Capturo x,y y pinto la primera columna de la fila
                $pdf->Cell(20, 6, "" . $no, 1, 0, "C");
                $pdf->Cell(35, 6, "" . $datos->ci, 1, 0, "C");
                //Capturo x,y y pinto la segunda columna de la fila
                $pdf->Cell(100, 6, "" . utf8_decode("" . $datos->nombre), 1, 0, "L");
                //Capturo x,y y pinto la tercera columna de la fila
                $pdf->Cell(60, 6, $datos->tiempoacumuladoinicial, 1, 0, "R");
                //Capturo x,y y pinto la cuarta columna de la fila
                $pdf->Cell(60, 6, "" . $datos->importeacumuladoinicial, 1, 0, "R");
                //Salto de linea
                $pdf->Ln(6);
                $y = $pdf->GetY();
                if ($y >= 178) {
                    //print_r($datos);die;
                    $pdf->AddPage();
                    $this->encabezadoReporteCargaInicial($pdf);
                    $pdf->SetFont('Arial', '', 8);
                }
                $tiempoacumuladoinicialtotal += $datos->tiempoacumuladoinicial;
                $importeacumuladoinicialtotal += $datos->importeacumuladoinicial;
                $tiempototal += $datos->tiempoacumuladoinicial;
                $importetotal += $datos->importeacumuladoinicial;
            }
            //Pintando los subtotales por centros
            $pdf->SetFillColor(240);//Definiendo el color de celdas
            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Cell(155, 6, "Subtotales", 1, 0, "C", 1);
            $pdf->Cell(60, 6, $tiempoacumuladoinicialtotal, 1, 0, "R");
            $pdf->Cell(60, 6, $importeacumuladoinicialtotal, 1, 1, "R");
        }
        $y = $pdf->GetY();
        if ($y >= 178) {
            $pdf->AddPage();
            $this->encabezadoReporteCargaInicial($pdf);
        }
        //Pinto los totales
        $pdf->SetFillColor(240);//Definiendo el color de celdas
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Ln(5);
        $pdf->Cell(155, 6, "Total", 1, 0, "C", 1);
        $pdf->Cell(60, 6, $tiempototal, 1, 0, "R");
        $pdf->Cell(60, 6, $importetotal, 1, 0, "R");
        //Salto de linea y cambio de fuente
        $pdf->Ln(6);
        $pdf->SetFont('Arial', '', 8);
        return $pdf;
    }

    //Esta funcionalidad construye el listado de saldos acumulados de vacaciones por personas
    public function construirListadoSaldosAcumulados($identidad, $arraypersonas, $mes, $anno, $formato)
    {
        $this->identidad = $identidad;
        $objConfigPersonaCodigoContable = new ConfigPersonaCodigoContable();
        //Definiendo el array de plantillas nominales
        $arrayplantillas = array();
        foreach ($arraypersonas as $key => $row) {
            if (!empty($row['idarea']))
                $arrayplantillas[$row['idarea']] = $row['area'];
        }

        $objdatosperiodo['datosentidad'] = HisRetencionesPersona::obtenerDatosEntidadDadoId($identidad);

        //Obteniendo el array de codigos contables por personas
        $arrcodigoscontables = $objConfigPersonaCodigoContable->obtenerConfigDadoIdEntidad($identidad);
        $arrcodigospersonas = array();
        foreach ($arrcodigoscontables as $codigopersona) {
            $arrcodigospersonas[$codigopersona['idpersona']]['cdg'] = $codigopersona['cdgocontable'];
            $arrcodigospersonas[$codigopersona['idpersona']]['name'] = $codigopersona['nombreapellido'];
        }
        //Obteniendo todas las personas bajas de la entidad que tienen operaciones en el periodo de pago seleccionado
        $personasbajasperiodo = HisVacacionesPersonaBajaModel::obtenerPersonasBajasPeriodo($identidad, $mes, $anno);

        //Si la persona fue baja en este periodo y ahora es alta en la entidad, se muestran solo las operaciones de baja
        foreach ($personasbajasperiodo as $personabaja) {
            foreach ($arraypersonas as $i => $personaalta) {
                if ($personabaja['idpersona'] == $personaalta['idpersona']) {
                    unset($arraypersonas[$i]);
                }
            }
        }
        $arraypersonas = array_values($arraypersonas);

        //Si por alguna casualidad en las bajas viene alguna plantilla nominal que no esta en las altas se agrega al arraylantillas
        foreach ($personasbajasperiodo as $key => $rowpb) {
            if (!empty($rowpb['idarea']))
                $arrayplantillas[$rowpb['idarea']] = $rowpb['area'];
        }

        //Creando el Reporte PDF
        if ($formato == 1) {
            //Creando el pdf
            $pdf = new PDFSubMayorVacaciones('L', 'mm', 'Letter'); //216(ancho) X 279(alto)
            $pdf->SetLeftMargin(2);
            $pdf->AddPage();

            $this->cabeceraListadoSaldosAcumulados($pdf, $objdatosperiodo, $mes);
            $this->cuerpoListadoSaldosAcumulados($pdf, $arrayplantillas, $arraypersonas, $arrcodigospersonas, $objdatosperiodo, $mes, $personasbajasperiodo);
            $pdf->Output();
        } else {
            $this->construirListadoSaldosAcumuladosExcel($arrayplantillas, $arraypersonas, $arrcodigospersonas, $objdatosperiodo, $mes, $personasbajasperiodo);
        }
    }

    public function cabeceraListadoSaldosAcumulados(&$pdf, $objdatosperiodo, $mes)
    {
        //Titulo
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Text(90, 10, "LISTADO DE SALDOS ACUMULADOS DE VACACIONES");
        $pdf->Ln(5);

        //Logo de la entidad
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        list($imagenBase64,) = explode(';', $arrEstruct[0]->logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($arrEstruct[0]->logo)) {
            $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }
        $pdf->Ln(5);
        /*$register = Zend_Registry::getInstance();
        $direccion = $register->config->modulo_path . 'views/images/logotrd.jpg';
        $pdf->Image($direccion, 5, 5, 22, 10);
        $pdf->Ln(8);*/

        //Nombre de la Empresa
        $nombreempresa = $arrEstruct[0]->denominacion;
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(20, 10, 'Empresa: ', 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(90, 10, utf8_decode($nombreempresa), 0, 0, 'L', 0);

        //Fecha y hora
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(20, 10, utf8_decode('Período:'), 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(90, 10, $mes);

        //Codigo
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(20, 10, utf8_decode('Código:'), 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(40, 10, utf8_decode($objdatosperiodo['datosentidad'][0]['codigo']), 0, 1, 'L', 0);

        $pdf->Ln(2);

        //Encabezado
        $pdf->SetFont('Arial', 'B', 7);
        $pdf->Cell(15, 5, '', 'L,T,R', 0, 'C', 0);                          //celdas vacias
        $pdf->Cell(20, 5, '', 'L,T,R', 0, 'C', 0);                          //celdas vacias
        $pdf->Cell(65, 5, '', 'T,R', 0, 'C', 0);                            //celdas vacias
        $pdf->Cell(35, 5, 'Saldo Inicial (Mes Anterior)', 1, 0, 'C', 0);    //Saldo Inicial (Mes Anterior)
        $pdf->Cell(35, 5, 'Acumulado Mes', 1, 0, 'C', 0);                   //Acumulado Mes
        $pdf->Cell(35, 5, 'Pagado', 1, 0, 'C', 0);                          //Pagado
        $pdf->Cell(35, 5, 'Ajustes', 1, 0, 'C', 0);                         //Ajustes
        $pdf->Cell(35, 5, 'Saldo Final', 1, 1, 'C', 0);                     //Saldo Final

        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(15, 15, 'Cod.', 'L,B,R', 0, 'C', 0);                     //Codigo
        $pdf->Cell(20, 15, 'CI', 'L,B,R', 0, 'C', 0);                       //CI
        $pdf->Cell(65, 15, 'Nombre y Apellidos', 'L,B,R', 0, 'C', 0);       //Nombre y Apellidos

        $pdf->Cell(17.5, 15, utf8_decode('Días'), 1, 0, 'C', 0);            //Días
        $pdf->Cell(17.5, 15, 'Importe', 1, 0, 'C', 0);                      //Importe

        $pdf->Cell(17.5, 15, utf8_decode('Días'), 1, 0, 'C', 0);            //Días
        $pdf->Cell(17.5, 15, 'Importe', 1, 0, 'C', 0);                      //Importe

        $pdf->Cell(17.5, 15, utf8_decode('Días'), 1, 0, 'C', 0);            //Días
        $pdf->Cell(17.5, 15, 'Importe', 1, 0, 'C', 0);                      //Importe

        $pdf->Cell(17.5, 15, utf8_decode('Días'), 1, 0, 'C', 0);            //Días
        $pdf->Cell(17.5, 15, 'Importe', 1, 0, 'C', 0);                      //Importe

        $pdf->Cell(17.5, 15, utf8_decode('Días'), 1, 0, 'C', 0);            //Días
        $pdf->Cell(17.5, 15, 'Importe', 1, 1, 'C', 0);                      //Importe

        return $pdf;
    }

    public function cuerpoListadoSaldosAcumulados(&$pdf, $arraplantillasaux, $arraypersonas, $arrcodigospersonas, $objdatosperiodo, $mes, $personasbajasperiodo)
    {
        //Determinando la cantidad de personas por areas.
        $arrayplantillas = array();
        foreach ($arraplantillasaux as $a => $area) {
            $cont = 0;
            foreach ($arraypersonas as $i => $persona) {
                $cont += ($persona['idarea'] == $a) ? 1 : 0;
            }
            $arrayplantillas[$a]['denominacion'] = (count(explode('-', $area)) > 1) ? explode('-', $area)[1] : $area;;
            $arrayplantillas[$a]['cantpersonas'] = $cont;
        }

        $contcentros = 0;
        $sumSubtotalGeneral = array();
        foreach ($arrayplantillas as $a => $area) {
            $sumPorCentro = array();
            $contcentros++;
            //Pintando la denominación de cada centro

            $this->fnAdicionarPagina($pdf, $objdatosperiodo, $mes);
            $pdf->SetFillColor(200);//Definiendo el color de celdas
            $pdf->SetFont('Arial', 'B', 8);
            $pdf->Cell(275, 6, utf8_decode($area['denominacion'] . ' : (' . $area['cantpersonas'] . ' ' . (($area['cantpersonas'] > 1) ? 'personas' : 'persona') . ')'), 0, 1, 'L', 1);
            //Pintando los datos de las personas
            foreach ($arraypersonas as $i => $persona) {
                $this->fnAdicionarPagina($pdf, $objdatosperiodo, $mes);
                if ($persona['idarea'] == $a) {//Personas del area especifica
                    $pdf->SetFont('Arial', '', 7);
                    //Codigo contable
                    $pdf->Cell(15, 5, $arrcodigospersonas[$persona['idpersona']]['cdg'], 1, 0, 'C', 0);
                    //CI
                    $pdf->Cell(20, 5, $persona['ci'], 1, 0, 'C', 0);
                    //Nombre y apellidos
                    //$pdf->Cell(65, 5, utf8_decode( $arrcodigospersonas[$persona['idpersona']]['name']), 1, 0, 'L', 0);
                    $pdf->Cell(65, 5, utf8_decode(substr(($persona['nombreyapellidos']), 0, 38)), 1, 0, 'L', 0);

                    //Saldo inicial (mes anterior)
                    $pdf->Cell(17.5, 5, number_format($persona['saldotiempomesanterior'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['mesanterior']['dias'] += $persona['saldotiempomesanterior'];
                    $pdf->Cell(17.5, 5, number_format($persona['saldoimportemesanterior'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['mesanterior']['importe'] += $persona['saldoimportemesanterior'];
                    //Acumulado
                    $pdf->Cell(17.5, 5, number_format($persona['tiempoacumulado'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['acumulado']['dias'] += $persona['tiempoacumulado'];
                    $pdf->Cell(17.5, 5, number_format($persona['importeacumulado'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['acumulado']['importe'] += $persona['importeacumulado'];
                    //Liquidado
                    $pdf->Cell(17.5, 5, number_format($persona['tiempoliquidado'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['liquidado']['dias'] += $persona['tiempoliquidado'];
                    $pdf->Cell(17.5, 5, number_format($persona['importeliquidado'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['liquidado']['importe'] += $persona['importeliquidado'];
                    //Ajustes
                    $concat = ($persona['tipoajuste'] == 1) ? '+' : (($persona['tipoajuste'] == 2) ? '-' : '');
                    $modulo = ($persona['tipoajuste'] == 1) ? 1 : (($persona['tipoajuste'] == 2) ? -1 : 0);
                    $pdf->Cell(17.5, 5, $concat . ' ' . number_format($persona['ajustetiempo'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['ajustes']['dias'] += $modulo * $persona['ajustetiempo'];   //subtotal
                    $pdf->Cell(17.5, 5, $concat . ' ' . number_format($persona['ajusteimporte'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['ajustes']['importe'] += $modulo * $persona['ajusteimporte'];   //subtotal
                    //Saldo final
                    $pdf->Cell(17.5, 5, number_format(($persona['saldoentiempo'] < 0 ? 0 : $persona['saldoentiempo']), 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['saldofinal']['dias'] += ($persona['saldoentiempo'] < 0 ? 0 : $persona['saldoentiempo']);   //subtotal
                    $pdf->Cell(17.5, 5, number_format(($persona['saldoenimporte'] < 0 ? 0 : $persona['saldoenimporte']), 2, '.', ''), 1, 1, 'R', 0);
                    $sumPorCentro['saldofinal']['importe'] += ($persona['saldoenimporte'] < 0 ? 0 : $persona['saldoenimporte']);   //subtotal
                }
            }

            //Pintando los datos de las personas que fueron bajas pero tienen operaciones en el periodo
            foreach ($personasbajasperiodo as $baja) {
                $this->fnAdicionarPagina($pdf, $objdatosperiodo, $mes);
                if ($baja['idarea'] == $a) {//Personas del area especifica
                    $pdf->SetTextColor(255, 10, 10);//Color rojo tomate
                    $pdf->SetFont('Arial', '', 7);
                    //Codigo contable
                    $pdf->Cell(15, 5, $baja['cdg'], 1, 0, 'C', 0);
                    //CI
                    $pdf->Cell(20, 5, $baja['ci'], 1, 0, 'C', 0);
                    //Nombre y apellidos
                    $pdf->Cell(65, 5, utf8_decode(substr(($baja['nombreyapellidos']), 0, 38)), 1, 0, 'L', 0);

                    //Saldo inicial (mes anterior)
                    $pdf->Cell(17.5, 5, number_format($baja['saldotiempomesanterior'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['mesanterior']['dias'] += $baja['saldotiempomesanterior'];
                    $pdf->Cell(17.5, 5, number_format($baja['saldoimportemesanterior'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['mesanterior']['importe'] += $baja['saldoimportemesanterior'];
                    //Acumulado
                    $pdf->Cell(17.5, 5, number_format($baja['tiempoacumulado'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['acumulado']['dias'] += $baja['tiempoacumulado'];
                    $pdf->Cell(17.5, 5, number_format($baja['importeacumulado'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['acumulado']['importe'] += $baja['importeacumulado'];
                    //Liquidado
                    $pdf->Cell(17.5, 5, number_format($baja['tiempoliquidado'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['liquidado']['dias'] += $baja['tiempoliquidado'];
                    $pdf->Cell(17.5, 5, number_format($baja['importeliquidado'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['liquidado']['importe'] += $baja['importeliquidado'];
                    //Ajustes
                    $concat = ($baja['tipoajuste'] == 1) ? '+' : (($baja['tipoajuste'] == 2) ? '-' : '');
                    $modulo = ($baja['tipoajuste'] == 1) ? 1 : (($baja['tipoajuste'] == 2) ? -1 : 0);
                    $pdf->Cell(17.5, 5, $concat . ' ' . number_format($baja['ajustetiempo'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['ajustes']['dias'] += $modulo * $baja['ajustetiempo'];   //subtotal
                    $pdf->Cell(17.5, 5, $concat . ' ' . number_format($baja['ajusteimporte'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['ajustes']['importe'] += $modulo * $baja['ajusteimporte'];   //subtotal
                    //Saldo final
                    $pdf->Cell(17.5, 5, number_format(($baja['saldoentiempo'] < 0 ? 0 : $baja['saldoentiempo']), 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['saldofinal']['dias'] += ($baja['saldoentiempo'] < 0 ? 0 : $baja['saldoentiempo']);   //subtotal
                    $pdf->Cell(17.5, 5, number_format(($baja['saldoenimporte'] < 0 ? 0 : $baja['saldoenimporte']), 2, '.', ''), 1, 1, 'R', 0);
                    $sumPorCentro['saldofinal']['importe'] += ($baja['saldoenimporte'] < 0 ? 0 : $baja['saldoenimporte']);   //subtotal
                    $pdf->SetTextColor(0, 0, 0);//Color negro

                }
            }

            //Pintando los Subtotales
            if ($contcentros <= count($arrayplantillas)) {
                $pdf->SetFont('Arial', 'B', 7);
                $pdf->Cell(100, 5, 'Subtotales', 1, 0, 'C', 1);
                $pdf->Cell(17.5, 5, number_format($sumPorCentro['mesanterior']['dias'], 2, '.', ''), 1, 0, 'R', 0);
                $pdf->Cell(17.5, 5, number_format($sumPorCentro['mesanterior']['importe'], 2, '.', ''), 1, 0, 'R', 0);
                $sumSubtotalGeneral['mesanterior']['dias'] += $sumPorCentro['mesanterior']['dias'];
                $sumSubtotalGeneral['mesanterior']['importe'] += $sumPorCentro['mesanterior']['importe'];

                $pdf->Cell(17.5, 5, number_format($sumPorCentro['acumulado']['dias'], 2, '.', ''), 1, 0, 'R', 0);
                $pdf->Cell(17.5, 5, number_format($sumPorCentro['acumulado']['importe'], 2, '.', ''), 1, 0, 'R', 0);
                $sumSubtotalGeneral['acumulado']['dias'] += $sumPorCentro['acumulado']['dias'];
                $sumSubtotalGeneral['acumulado']['importe'] += $sumPorCentro['acumulado']['importe'];

                $pdf->Cell(17.5, 5, number_format($sumPorCentro['liquidado']['dias'], 2, '.', ''), 1, 0, 'R', 0);
                $pdf->Cell(17.5, 5, number_format($sumPorCentro['liquidado']['importe'], 2, '.', ''), 1, 0, 'R', 0);
                $sumSubtotalGeneral['liquidado']['dias'] += $sumPorCentro['liquidado']['dias'];
                $sumSubtotalGeneral['liquidado']['importe'] += $sumPorCentro['liquidado']['importe'];

                $pdf->Cell(17.5, 5, number_format($sumPorCentro['ajustes']['dias'], 2, '.', ''), 1, 0, 'R', 0);
                $pdf->Cell(17.5, 5, number_format($sumPorCentro['ajustes']['importe'], 2, '.', ''), 1, 0, 'R', 0);
                $sumSubtotalGeneral['ajustes']['dias'] += $sumPorCentro['ajustes']['dias'];
                $sumSubtotalGeneral['ajustes']['importe'] += $sumPorCentro['ajustes']['importe'];

                $pdf->Cell(17.5, 5, number_format($sumPorCentro['saldofinal']['dias'], 2, '.', ''), 1, 0, 'R', 0);
                $pdf->Cell(17.5, 5, number_format($sumPorCentro['saldofinal']['importe'], 2, '.', ''), 1, 1, 'R', 0);
                $sumSubtotalGeneral['saldofinal']['dias'] += $sumPorCentro['saldofinal']['dias'];
                $sumSubtotalGeneral['saldofinal']['importe'] += $sumPorCentro['saldofinal']['importe'];
                $this->fnAdicionarPagina($pdf, $objdatosperiodo, $mes);
                //$this->fnAdicionarPaginaPorPlantilla($pdf, $objdatosperiodo);
            }
        }
        $flagpersonassinplantillas = 0;
        foreach ($personasbajasperiodo as $baja) {
            if (!$baja['idarea']) {
                $flagpersonassinplantillas = 1;
                break;
            }
        }
        //Si hay personas sin plantillas nominales
        if ($flagpersonassinplantillas == 1) {
            //Pintando los datos de las personas que fueron bajas pero tienen operaciones en el periodo y  no tienen plantillas nominales
            $pdf->SetFillColor(200);//Definiendo el color de celdas
            $pdf->SetFont('Arial', 'B', 8);
            $pdf->Cell(275, 6, 'Sin plantilla nominal', 0, 1, 'L', 1);
            $sumPorCentro = array();
            foreach ($personasbajasperiodo as $baja) {
                $this->fnAdicionarPagina($pdf, $objdatosperiodo, $mes);
                if (!$baja['idarea']) {//Personas del area especifica
                    $pdf->SetTextColor(255, 10, 10);//Color rojo tomate
                    $pdf->SetFont('Arial', '', 7);
                    //Codigo contable
                    $pdf->Cell(15, 5, $baja['cdg'], 1, 0, 'C', 0);
                    //CI
                    $pdf->Cell(20, 5, $baja['ci'], 1, 0, 'C', 0);
                    //Nombre y apellidos
                    $pdf->Cell(65, 5, utf8_decode(substr(($baja['nombreyapellidos']), 0, 38)), 1, 0, 'L', 0);

                    //Saldo inicial (mes anterior)
                    $pdf->Cell(17.5, 5, number_format($baja['saldotiempomesanterior'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['mesanterior']['dias'] += $baja['saldotiempomesanterior'];
                    $pdf->Cell(17.5, 5, number_format($baja['saldoimportemesanterior'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['mesanterior']['importe'] += $baja['saldoimportemesanterior'];
                    //Acumulado
                    $pdf->Cell(17.5, 5, number_format($baja['tiempoacumulado'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['acumulado']['dias'] += $baja['tiempoacumulado'];
                    $pdf->Cell(17.5, 5, number_format($baja['importeacumulado'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['acumulado']['importe'] += $baja['importeacumulado'];
                    //Liquidado
                    $pdf->Cell(17.5, 5, number_format($baja['tiempoliquidado'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['liquidado']['dias'] += $baja['tiempoliquidado'];
                    $pdf->Cell(17.5, 5, number_format($baja['importeliquidado'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['liquidado']['importe'] += $baja['importeliquidado'];
                    //Ajustes
                    $concat = ($baja['tipoajuste'] == 1) ? '+' : (($baja['tipoajuste'] == 2) ? '-' : '');
                    $modulo = ($baja['tipoajuste'] == 1) ? 1 : (($baja['tipoajuste'] == 2) ? -1 : 0);
                    $pdf->Cell(17.5, 5, $concat . ' ' . number_format($baja['ajustetiempo'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['ajustes']['dias'] += $modulo * $baja['ajustetiempo'];   //subtotal
                    $pdf->Cell(17.5, 5, $concat . ' ' . number_format($baja['ajusteimporte'], 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['ajustes']['importe'] += $modulo * $baja['ajusteimporte'];   //subtotal
                    //Saldo final
                    $pdf->Cell(17.5, 5, number_format(($baja['saldoentiempo'] < 0 ? 0 : $baja['saldoentiempo']), 2, '.', ''), 1, 0, 'R', 0);
                    $sumPorCentro['saldofinal']['dias'] += ($baja['saldoentiempo'] < 0 ? 0 : $baja['saldoentiempo']);   //subtotal
                    $pdf->Cell(17.5, 5, number_format(($baja['saldoenimporte'] < 0 ? 0 : $baja['saldoenimporte']), 2, '.', ''), 1, 1, 'R', 0);
                    $sumPorCentro['saldofinal']['importe'] += ($baja['saldoenimporte'] < 0 ? 0 : $baja['saldoenimporte']);   //subtotal
                    $pdf->SetTextColor(0, 0, 0);//Color negro

                }
            }
            //Pintando los Subtotales de las personas que no tienen plantillas nominales
            $pdf->SetFont('Arial', 'B', 7);
            $pdf->Cell(100, 5, 'Subtotales', 1, 0, 'C', 1);
            $pdf->Cell(17.5, 5, number_format($sumPorCentro['mesanterior']['dias'], 2, '.', ''), 1, 0, 'R', 0);
            $pdf->Cell(17.5, 5, number_format($sumPorCentro['mesanterior']['importe'], 2, '.', ''), 1, 0, 'R', 0);
            $sumSubtotalGeneral['mesanterior']['dias'] += $sumPorCentro['mesanterior']['dias'];
            $sumSubtotalGeneral['mesanterior']['importe'] += $sumPorCentro['mesanterior']['importe'];

            $pdf->Cell(17.5, 5, number_format($sumPorCentro['acumulado']['dias'], 2, '.', ''), 1, 0, 'R', 0);
            $pdf->Cell(17.5, 5, number_format($sumPorCentro['acumulado']['importe'], 2, '.', ''), 1, 0, 'R', 0);
            $sumSubtotalGeneral['acumulado']['dias'] += $sumPorCentro['acumulado']['dias'];
            $sumSubtotalGeneral['acumulado']['importe'] += $sumPorCentro['acumulado']['importe'];

            $pdf->Cell(17.5, 5, number_format($sumPorCentro['liquidado']['dias'], 2, '.', ''), 1, 0, 'R', 0);
            $pdf->Cell(17.5, 5, number_format($sumPorCentro['liquidado']['importe'], 2, '.', ''), 1, 0, 'R', 0);
            $sumSubtotalGeneral['liquidado']['dias'] += $sumPorCentro['liquidado']['dias'];
            $sumSubtotalGeneral['liquidado']['importe'] += $sumPorCentro['liquidado']['importe'];

            $pdf->Cell(17.5, 5, number_format($sumPorCentro['ajustes']['dias'], 2, '.', ''), 1, 0, 'R', 0);
            $pdf->Cell(17.5, 5, number_format($sumPorCentro['ajustes']['importe'], 2, '.', ''), 1, 0, 'R', 0);
            $sumSubtotalGeneral['ajustes']['dias'] += $sumPorCentro['ajustes']['dias'];
            $sumSubtotalGeneral['ajustes']['importe'] += $sumPorCentro['ajustes']['importe'];

            $pdf->Cell(17.5, 5, number_format($sumPorCentro['saldofinal']['dias'], 2, '.', ''), 1, 0, 'R', 0);
            $pdf->Cell(17.5, 5, number_format($sumPorCentro['saldofinal']['importe'], 2, '.', ''), 1, 1, 'R', 0);
            $sumSubtotalGeneral['saldofinal']['dias'] += $sumPorCentro['saldofinal']['dias'];
            $sumSubtotalGeneral['saldofinal']['importe'] += $sumPorCentro['saldofinal']['importe'];
            $this->fnAdicionarPagina($pdf, $objdatosperiodo, $mes);
        }


        //Total General
        $pdf->Ln(5);
        $pdf->SetFont('Arial', 'B', 7);
        $pdf->Cell(100, 5, 'Total', 1, 0, 'C', 1);
        $pdf->Cell(17.5, 5, number_format($sumSubtotalGeneral['mesanterior']['dias'], 2, '.', ''), 1, 0, 'R', 0);
        $pdf->Cell(17.5, 5, number_format($sumSubtotalGeneral['mesanterior']['importe'], 2, '.', ''), 1, 0, 'R', 0);

        $pdf->Cell(17.5, 5, number_format($sumSubtotalGeneral['acumulado']['dias'], 2, '.', ''), 1, 0, 'R', 0);
        $pdf->Cell(17.5, 5, number_format($sumSubtotalGeneral['acumulado']['importe'], 2, '.', ''), 1, 0, 'R', 0);

        $pdf->Cell(17.5, 5, number_format($sumSubtotalGeneral['liquidado']['dias'], 2, '.', ''), 1, 0, 'R', 0);
        $pdf->Cell(17.5, 5, number_format($sumSubtotalGeneral['liquidado']['importe'], 2, '.', ''), 1, 0, 'R', 0);

        $pdf->Cell(17.5, 5, number_format($sumSubtotalGeneral['ajustes']['dias'], 2, '.', ''), 1, 0, 'R', 0);
        $pdf->Cell(17.5, 5, number_format($sumSubtotalGeneral['ajustes']['importe'], 2, '.', ''), 1, 0, 'R', 0);

        $pdf->Cell(17.5, 5, number_format($sumSubtotalGeneral['saldofinal']['dias'], 2, '.', ''), 1, 0, 'R', 0);
        $pdf->Cell(17.5, 5, number_format($sumSubtotalGeneral['saldofinal']['importe'], 2, '.', ''), 1, 1, 'R', 0);
    }

    public function construirListadoSaldosAcumuladosExcel($arraplantillasaux, $arraypersonas, $arrcodigospersonas, $objdatosperiodo, $mes, $personasbajasperiodo)
    {
        $objDatNominaModel = new DatNominaModel();
        //Determinando la cantidad de personas por areas.
        $arrayplantillas = array();
        foreach ($arraplantillasaux as $a => $area) {
            $cont = 0;
            foreach ($arraypersonas as $i => $persona) {
                $cont += ($persona['idarea'] == $a) ? 1 : 0;
            }
            $arrayplantillas[$a]['denominacion'] = (count(explode('-', $area)) > 1) ? explode('-', $area)[1] : $area;;
            $arrayplantillas[$a]['cantpersonas'] = $cont;
        }


        //PHPExcel
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $this->cabeceraListadoSaldosAcumuladosExcel($objPHPExcel, $objdatosperiodo, $mes);

        $contcentros = 0;
        $sumSubtotalGeneral = array();
        $numero = 5;
        $contpers = 1;
        foreach ($arrayplantillas as $a => $area) {
            $sumPorCentro = array();
            $contcentros++;
            $denomarea = $area['denominacion'] . ' : (' . $area['cantpersonas'] . ' ' . (($area['cantpersonas'] > 1) ? 'personas' : 'persona') . ')';
            //Pintando la denominación de cada centro
            $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':M' . $numero);
            $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', $numero, $denomarea, null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 1);
            $numero++;

            //Pintando los datos de las personas
            foreach ($arraypersonas as $i => $persona) {
                if ($persona['idarea'] == $a) {//Personas del area especifica
                    //Codigo contable
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', $numero, $arrcodigospersonas[$persona['idpersona']]['cdg'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                    //CI
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'B', $numero, $persona['ci'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);

                    //Nombre y apellidos
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'C', $numero, $persona['nombreyapellidos'], null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);

                    //Saldo inicial (mes anterior)
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', $numero, number_format($persona['saldotiempomesanterior'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', $numero, number_format($persona['saldoimportemesanterior'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $sumPorCentro['mesanterior']['dias'] += $persona['saldotiempomesanterior'];
                    $sumPorCentro['mesanterior']['importe'] += $persona['saldoimportemesanterior'];

                    //Acumulado
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', $numero, number_format($persona['tiempoacumulado'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', $numero, number_format($persona['importeacumulado'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $sumPorCentro['acumulado']['dias'] += $persona['tiempoacumulado'];
                    $sumPorCentro['acumulado']['importe'] += $persona['importeacumulado'];

                    //Liquidado
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'H', $numero, number_format($persona['tiempoliquidado'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'I', $numero, number_format($persona['importeliquidado'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $sumPorCentro['liquidado']['dias'] += $persona['tiempoliquidado'];
                    $sumPorCentro['liquidado']['importe'] += $persona['importeliquidado'];

                    //Ajustes
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'J', $numero, number_format($persona['ajustetiempo'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'K', $numero, number_format($persona['ajusteimporte'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $sumPorCentro['ajustes']['dias'] += $persona['ajustetiempo'];
                    $sumPorCentro['ajustes']['importe'] += $persona['ajusteimporte'];

                    //Saldo final
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'L', $numero, number_format($persona['saldoentiempo'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'M', $numero, number_format($persona['saldoenimporte'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $sumPorCentro['saldofinal']['dias'] += ($persona['saldoentiempo'] < 0 ? 0 : $persona['saldoentiempo']);
                    $sumPorCentro['saldofinal']['importe'] += ($persona['saldoenimporte'] < 0 ? 0 : $persona['saldoenimporte']);
                    //Orden personas
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'N', $numero, $contpers, null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $contpers++;
                    $numero++;

                }
            }

            //Pintando los datos de las personas que fueron bajas pero tienen operaciones en el periodo
            foreach ($personasbajasperiodo as $baja) {
                if ($baja['idarea'] == $a) {//Personas del area especifica
                    //Codigo contable
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', $numero, $arrcodigospersonas[$baja['idpersona']]['cdg'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                    $objPHPExcel->getActiveSheet()->getStyle('A' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);

                    //CI
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'B', $numero, $baja['ci'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                    $objPHPExcel->getActiveSheet()->getStyle('B' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);

                    //Nombre y apellidos
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'C', $numero, $baja['nombreyapellidos'], null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
                    $objPHPExcel->getActiveSheet()->getStyle('C' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);

                    //Saldo inicial (mes anterior)
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', $numero, number_format($baja['saldotiempomesanterior'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', $numero, number_format($baja['saldoimportemesanterior'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objPHPExcel->getActiveSheet()->getStyle('D' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
                    $objPHPExcel->getActiveSheet()->getStyle('E' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
                    $sumPorCentro['mesanterior']['dias'] += $baja['saldotiempomesanterior'];
                    $sumPorCentro['mesanterior']['importe'] += $baja['saldoimportemesanterior'];

                    //Acumulado
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', $numero, number_format($baja['tiempoacumulado'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', $numero, number_format($baja['importeacumulado'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objPHPExcel->getActiveSheet()->getStyle('F' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
                    $objPHPExcel->getActiveSheet()->getStyle('G' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
                    $sumPorCentro['acumulado']['dias'] += $baja['tiempoacumulado'];
                    $sumPorCentro['acumulado']['importe'] += $baja['importeacumulado'];

                    //Liquidado
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'H', $numero, number_format($baja['tiempoliquidado'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'I', $numero, number_format($baja['importeliquidado'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objPHPExcel->getActiveSheet()->getStyle('H' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
                    $objPHPExcel->getActiveSheet()->getStyle('I' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
                    $sumPorCentro['liquidado']['dias'] += $baja['tiempoliquidado'];
                    $sumPorCentro['liquidado']['importe'] += $baja['importeliquidado'];

                    //Ajustes
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'J', $numero, number_format($baja['ajustetiempo'], 2, '.', ''), null, '#C80000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'K', $numero, number_format($baja['ajusteimporte'], 2, '.', ''), null, '#C80000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objPHPExcel->getActiveSheet()->getStyle('J' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
                    $objPHPExcel->getActiveSheet()->getStyle('K' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
                    $sumPorCentro['ajustes']['dias'] += $baja['ajustetiempo'];
                    $sumPorCentro['ajustes']['importe'] += $baja['ajusteimporte'];

                    //Saldo final//Centrando el texto de la celda
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'L', $numero, number_format($baja['saldoentiempo'], 2, '.', ''), null, '#C80000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'M', $numero, number_format($baja['saldoenimporte'], 2, '.', ''), null, '#C80000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objPHPExcel->getActiveSheet()->getStyle('L' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
                    $objPHPExcel->getActiveSheet()->getStyle('M' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
                    $sumPorCentro['saldofinal']['dias'] += ($baja['saldoentiempo'] < 0 ? 0 : $baja['saldoentiempo']);
                    $sumPorCentro['saldofinal']['importe'] += ($baja['saldoenimporte'] < 0 ? 0 : $baja['saldoenimporte']);
                    //Orden persona
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'N', $numero, $contpers, null, '#C80000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $contpers++;
                    $numero++;
                }
            }

            //Pintando los Subtotales
            if ($contcentros <= count($arrayplantillas)) {
                //Subtotales
                $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':C' . $numero);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', $numero, 'Subtotales', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', $numero, number_format($sumPorCentro['mesanterior']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', $numero, number_format($sumPorCentro['mesanterior']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $sumSubtotalGeneral['mesanterior']['dias'] += $sumPorCentro['mesanterior']['dias'];
                $sumSubtotalGeneral['mesanterior']['importe'] += $sumPorCentro['mesanterior']['importe'];

                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', $numero, number_format($sumPorCentro['acumulado']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', $numero, number_format($sumPorCentro['acumulado']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $sumSubtotalGeneral['acumulado']['dias'] += $sumPorCentro['acumulado']['dias'];
                $sumSubtotalGeneral['acumulado']['importe'] += $sumPorCentro['acumulado']['importe'];

                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'H', $numero, number_format($sumPorCentro['liquidado']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'I', $numero, number_format($sumPorCentro['liquidado']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $sumSubtotalGeneral['liquidado']['dias'] += $sumPorCentro['liquidado']['dias'];
                $sumSubtotalGeneral['liquidado']['importe'] += $sumPorCentro['liquidado']['importe'];

                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'J', $numero, number_format($sumPorCentro['ajustes']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'K', $numero, number_format($sumPorCentro['ajustes']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $sumSubtotalGeneral['ajustes']['dias'] += $sumPorCentro['ajustes']['dias'];
                $sumSubtotalGeneral['ajustes']['importe'] += $sumPorCentro['ajustes']['importe'];

                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'L', $numero, number_format($sumPorCentro['saldofinal']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'M', $numero, number_format($sumPorCentro['saldofinal']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $sumSubtotalGeneral['saldofinal']['dias'] += $sumPorCentro['saldofinal']['dias'];
                $sumSubtotalGeneral['saldofinal']['importe'] += $sumPorCentro['saldofinal']['importe'];
                $numero++;
            }
        }
        //Total General
        $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':C' . $numero);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', $numero, 'Total', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', $numero, number_format($sumSubtotalGeneral['mesanterior']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', $numero, number_format($sumSubtotalGeneral['mesanterior']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);

        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', $numero, number_format($sumSubtotalGeneral['acumulado']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', $numero, number_format($sumSubtotalGeneral['acumulado']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);

        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'H', $numero, number_format($sumSubtotalGeneral['liquidado']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'I', $numero, number_format($sumSubtotalGeneral['liquidado']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);

        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'J', $numero, number_format($sumSubtotalGeneral['ajustes']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'K', $numero, number_format($sumSubtotalGeneral['ajustes']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);

        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'L', $numero, number_format($sumSubtotalGeneral['saldofinal']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'M', $numero, number_format($sumSubtotalGeneral['saldofinal']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);


        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        //header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="SubmayorVacaciones.xls" ');
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

    public function cabeceraListadoSaldosAcumuladosExcel(&$objPHPExcel, $objdatosperiodo, $mes)
    {
        $objDatNominaModel = new DatNominaModel();
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        $nombreempresa = $arrEstruct[0]->denominacion;
        $objPHPExcel->getActiveSheet()->getRowDimension(1)->setRowHeight(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(50);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('K')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('L')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('M')->setWidth(15);
        $objPHPExcel->getActiveSheet()->freezePane('A5');

        //Row 1
        $objPHPExcel->getActiveSheet()->mergeCells('A1:M1');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', 1, 'LISTADO DE SALDOS ACUMULADOS DE VACACIONES', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        //Row 2
        $objPHPExcel->getActiveSheet()->mergeCells('A2:C2');
        $objPHPExcel->getActiveSheet()->mergeCells('D2:H2');
        $objPHPExcel->getActiveSheet()->mergeCells('I2:M2');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', 2, 'Empresa: ' . $nombreempresa, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', 2, 'Código: ' . $objdatosperiodo['datosentidad'][0]['codigo'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'I', 2, 'Período: ' . $mes, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        //Row 3
        $objPHPExcel->getActiveSheet()->getRowDimension(4)->setRowHeight(30);
        $objPHPExcel->getActiveSheet()->mergeCells('A3:A4');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', 3, 'Cod.', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('B3:B4');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'B', 3, 'CI', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('C3:C4');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'C', 3, 'Nombre y apellidos', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('D3:E3');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', 3, 'Saldo Inicial (Mes Anterior)', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('F3:G3');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', 3, 'Acumulado Mes', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('H3:I3');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'H', 3, 'Pagado', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('J3:K3');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'J', 3, 'Ajustes', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('L3:M3');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'L', 3, 'Saldo Final', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        //Row 4
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', 4, 'Días', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', 4, 'Importe', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', 4, 'Días', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', 4, 'Importe', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'H', 4, 'Días', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'I', 4, 'Importe', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'J', 4, 'Días', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'K', 4, 'Importe', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'L', 4, 'Días', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'M', 4, 'Importe', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'N', 4, 'Orden Personas', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

    }

    //Esta funcionalidad construye el listado de saldos iniciales y finales por periodos de pagos
    public function construirListadoSaldosInicialesFinalesPeriodos($identidad, $arrsaldosperiodos)
    {
        $this->identidad = $identidad;
        //Obteniendo datos de la entidad
        $objdatosperiodo['datosentidad'] = HisRetencionesPersona::obtenerDatosEntidadDadoId($identidad);

        //Definiendo el array de años
        $arrayannos = array();
        foreach ($arrsaldosperiodos as $key => $row) {
            $arrayannos[$row['anno']] = $row['anno'];
        }

        //Creando el pdf
        $pdf = new PDFSubMayorVacaciones('L', 'mm', 'Letter'); //216(ancho) X 279(alto)
        $pdf->SetLeftMargin(2);
        $pdf->AddPage();

        $this->cabeceraListadoSaldosInicialesFinalesPeriodos($pdf, $objdatosperiodo);
        $this->cuerpoListadoSaldosInicialesFinalesPeriodos($pdf, $objdatosperiodo, $arrayannos, $arrsaldosperiodos);
        $pdf->Output();
    }

    public function cabeceraListadoSaldosInicialesFinalesPeriodos(&$pdf, $objdatosperiodo)
    {
        $pdf->SetFillColor(200);//Definiendo el color de celdas
        //Titulo
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Text(90, 10, "LISTADO DE SALDOS INICIALES Y FINALES DE LOS PERIODOS DE VACACIONES");
        $pdf->Ln(5);

        //Logo de la entidad
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        list($imagenBase64,) = explode(';', $arrEstruct[0]->logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($arrEstruct[0]->logo)) {
            $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }
        $pdf->Ln(5);
        /*$register = Zend_Registry::getInstance();
        $direccion = $register->config->modulo_path . 'views/images/logotrd.jpg';
        $pdf->Image($direccion, 5, 5, 22, 10);
        $pdf->Ln(8);*/

        //Nombre de la Empresa
        $nombreempresa = $arrEstruct[0]->denominacion;
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(20, 10, 'Empresa: ', 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(40, 10, utf8_decode($nombreempresa), 0, 0, 'L', 0);

        //Nombre de la Entidad
        $nombreentidad = utf8_decode($objdatosperiodo['datosentidad'][0]['denominacion']);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(60, 10, 'Entidad: ', 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(100, 10, $nombreentidad, 0, 0, 'L', 0);

        //Codigo
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(20, 10, utf8_decode('Código:'), 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(40, 10, utf8_decode($objdatosperiodo['datosentidad'][0]['codigo']), 0, 1, 'L', 0);


        //TABLA*************************************************************************************
        //1era fila
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(50, 5, '', 'L,T,R', 0, 'C', 0);
        $pdf->Cell(112, 5, 'Saldos iniciales', 'T,R', 0, 'C', 0);
        $pdf->Cell(112, 5, 'Saldos finales', 'T,R', 1, 'C', 0);

        //2da fila
        $pdf->Cell(50, 10, utf8_decode('Períodos'), 'L,R', 0, 'C', 0);
        $pdf->Cell(56, 10, utf8_decode('Días'), 1, 0, 'C', 0);
        $pdf->Cell(56, 10, 'Importe', 1, 0, 'C', 1);
        $pdf->Cell(56, 10, utf8_decode('Días'), 1, 0, 'C', 0);
        $pdf->Cell(56, 10, 'Importe', 1, 1, 'C', 1);

        return $pdf;
    }

    public function cuerpoListadoSaldosInicialesFinalesPeriodos(&$pdf, $objdatosperiodo, $arrayannos, $arrsaldosperiodos)
    {
        foreach ($arrayannos as $anno) {
            //Pintando  el año
            $this->fnAdicionarPaginaPeriodos($pdf, $objdatosperiodo);
            $pdf->SetFillColor(230);//Definiendo el color de celdas
            $pdf->SetFont('Arial', 'B', 8);
            $pdf->Cell(274, 5, utf8_decode('Año ' . $anno), 1, 1, 'L', 1);
            //Pintando los datos de los periodos
            $pdf->SetFillColor(200);//Definiendo el color de celdas
            foreach ($arrsaldosperiodos as $i => $periodo) {
                $this->fnAdicionarPaginaPeriodos($pdf, $objdatosperiodo);
                if ($periodo['anno'] == $anno) {//Fecha del periodo del año especifico
                    $pdf->SetFont('Arial', '', 8);
                    //Mes del periodo
                    $pdf->Cell(50, 8, utf8_decode($periodo['fecha'] . ' (' . $periodo['mes'] . ')'), 1, 0, 'L', 0);

                    //Saldo inicial (mes anterior)
                    $pdf->Cell(56, 8, number_format($periodo['diasinicial'], 2, '.', ''), 1, 0, 'C', 0);
                    $pdf->Cell(56, 8, number_format($periodo['importeinicial'], 2, '.', ''), 1, 0, 'C', 1);

                    //Saldo final periodo
                    $pdf->Cell(56, 8, number_format($periodo['diasfinal'], 2, '.', ''), 1, 0, 'C', 0);
                    $pdf->Cell(56, 8, number_format($periodo['importefinal'], 2, '.', ''), 1, 1, 'C', 1);
                }
            }

        }
        $this->fnAdicionarPaginaPeriodos($pdf, $objdatosperiodo);
    }

    //Funcionalidades auxiliares
    public function fnAdicionarPagina(&$pdf, $objdatosperiodo, $mes)
    {
        //Cambio de hoja
        $y = $pdf->GetY();
        if ($y >= '180') {
            $pdf->AddPage();
            $this->cabeceraListadoSaldosAcumulados($pdf, $objdatosperiodo, $mes);
        }
    }

    public function fnAdicionarPaginaPorPlantilla(&$pdf, $objdatosperiodo, $mes)
    {
        $pdf->AddPage();
        $this->cabeceraListadoSaldosAcumulados($pdf, $objdatosperiodo, $mes);
    }

    public function fnCentrarTexto($longitudhoja, $longitudcadena)
    {
        return ($longitudhoja - $longitudcadena) / 2;
    }

    public function RotatedText($x, $y, $txt, $angle)
    {
        //Text rotated around its origin
        $this->Rotate($angle, $x, $y);
        $this->Text($x, $y, $txt);
        $this->Rotate(0);
    }

    public function RotatedImage($file, $x, $y, $w, $h, $angle)
    {
        //Image rotated around its upper-left corner
        $this->Rotate($angle, $x, $y);
        $this->Image($file, $x, $y, $w, $h);
        $this->Rotate(0);
    }

    public function fnAdicionarPaginaPeriodos(&$pdf, $objdatosperiodo)
    {
        //Cambio de hoja
        $y = $pdf->GetY();
        if ($y >= '180') {
            $pdf->AddPage();
            $this->cabeceraListadoSaldosInicialesFinalesPeriodos($pdf, $objdatosperiodo);
        }
    }

    //Descuadres del submayor por personas
    public function construirListadoDescuadresSubMayor($identidad, $arraypersonas, $mes, $anno)
    {
        $this->identidad = $identidad;
        //Definiendo el array de plantillas nominales
        $arrayplantillas = array();
        foreach ($arraypersonas as $key => $row) {
            if ($key != 'bajas')
                $arrayplantillas[$row['idarea']] = $row['area'];
        }
        foreach ($arraypersonas['bajas'] as $key => $row) {
            $arrayplantillas[$row['idarea']] = $row['area'];
        }

        $objdatosperiodo['datosentidad'] = HisRetencionesPersona::obtenerDatosEntidadDadoId($identidad);

        //Creando el Reporte PDF
        $this->construirListadoDescuadresSubMayorExcel($arrayplantillas, $arraypersonas, $objdatosperiodo, $mes, $anno);

    }

    public function cabeceraListadoDescuadresSubMayorExcel(&$objPHPExcel, $objdatosperiodo, $mes)
    {
        $objDatNominaModel = new DatNominaModel();
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        $nombreempresa = $arrEstruct[0]->denominacion;
        $objPHPExcel->getActiveSheet()->getRowDimension(1)->setRowHeight(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(50);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(15);
        $objPHPExcel->getActiveSheet()->freezePane('A5');

        //Row 1
        $objPHPExcel->getActiveSheet()->mergeCells('A1:G1');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', 1, 'PERSONAS CON DESCUADRES SUBMAYOR VACACIONES', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        //Row 2
        $objPHPExcel->getActiveSheet()->mergeCells('A2:C2');
        $objPHPExcel->getActiveSheet()->mergeCells('D2:E2');
        $objPHPExcel->getActiveSheet()->mergeCells('F2:G2');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', 2, 'Empresa: ' . $nombreempresa, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', 2, 'Código: ' . $objdatosperiodo['datosentidad'][0]['codigo'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', 2, 'Período: ' . $mes, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        //Row 3
        $objPHPExcel->getActiveSheet()->getRowDimension(4)->setRowHeight(30);
        $objPHPExcel->getActiveSheet()->mergeCells('A3:A4');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', 3, 'Cod.', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('B3:B4');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'B', 3, 'CI', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('C3:C4');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'C', 3, 'Nombre y apellidos', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('D3:E3');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', 3, 'Saldo final período', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('F3:G3');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', 3, 'Carga inicial período posterior', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        //Row 4
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', 4, 'Días', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', 4, 'Importe', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', 4, 'Días', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', 4, 'Importe', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
    }

    public function construirListadoDescuadresSubMayorExcel($arraplantillasaux, $arraypersonas, $objdatosperiodo, $mes, $anno)
    {
        $objDatNominaModel = new DatNominaModel();
        //Determinando la cantidad de personas por areas.
        $arrayplantillas = array();
        foreach ($arraypersonas as $i => $persona) {
            foreach ($arraplantillasaux as $a => $area) {
                $arrayplantillas[$a]['denominacion'] = (count(explode('-', $area)) > 1) ? explode('-', $area)[1] : $area;
                if ($i != 'bajas') {
                    $arrayplantillas[$a]['cantpersonas'] += ($persona['idarea'] == $a) ? 1 : 0;
                    $arrayplantillas[$a]['cantpersonasdesc'] += ($persona['idarea'] == $a && !$this->fnDeterminarPersonaConDescuadre($persona)) ? 1 : 0;
                }
            }
        }
        foreach ($arraypersonas['bajas'] as $i => $persona) {
            foreach ($arraplantillasaux as $a => $area) {
                $arrayplantillas[$a]['denominacion'] = (count(explode('-', $area)) > 1) ? explode('-', $area)[1] : $area;
                $arrayplantillas[$a]['cantpersonas'] += ($persona['idarea'] == $a) ? 1 : 0;
                $arrayplantillas[$a]['cantpersonasdesc'] += ($persona['idarea'] == $a && !$this->fnDeterminarPersonaConDescuadre($persona)) ? 1 : 0;
            }
        }

        //PHPExcel
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $this->cabeceraListadoDescuadresSubMayorExcel($objPHPExcel, $objdatosperiodo, $mes);

        $contcentros = 0;
        $sumSubtotalGeneral = array();
        $numero = 5;
        foreach ($arrayplantillas as $a => $area) {
            $sumPorCentro = array();
            $contcentros++;
            $denomarea = $area['denominacion'] . ' :   (Total persona(s) ' . $area['cantpersonas'] . ' - Con descuadres ' . $area['cantpersonasdesc'] . ')';
            //Pintando la denominación de cada centro
            $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':M' . $numero);
            $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', $numero, $denomarea, null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 1);
            $numero++;

            //Pintando los datos de las personas
            foreach ($arraypersonas as $i => $persona) {
                if ($persona['idarea'] == $a) {//Personas del area especifica
                    if (!$this->fnDeterminarPersonaConDescuadre($persona)) {
                        //CI
                        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'B', $numero, $persona['ci'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);

                        //Nombre y apellidos
                        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'C', $numero, $persona['nombreyapellidos'], null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);

                        //Saldo final periodo
                        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', $numero, number_format($persona['saldofinaltiempo'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', $numero, number_format($persona['saldofinalimporte'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);

                        //Carga inicial periodo posterior
                        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', $numero, number_format($persona['cargainicialtiempo'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', $numero, number_format($persona['cargainicialimporte'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                        $numero++;
                        $sumPorCentro['saldofinaltiempodesc']['dias'] += $persona['saldofinaltiempo'];
                        $sumPorCentro['saldofinalimportedesc']['importe'] += $persona['saldofinalimporte'];
                        $sumPorCentro['cargainicialtiempodesc']['dias'] += $persona['cargainicialtiempo'];
                        $sumPorCentro['cargainicialimportedesc']['importe'] += $persona['cargainicialimporte'];
                    }
                    $sumPorCentro['saldofinaltiempo']['dias'] += $persona['saldofinaltiempo'];
                    $sumPorCentro['saldofinalimporte']['importe'] += $persona['saldofinalimporte'];
                    $sumPorCentro['cargainicialtiempo']['dias'] += $persona['cargainicialtiempo'];
                    $sumPorCentro['cargainicialimporte']['importe'] += $persona['cargainicialimporte'];
                }
            }

            //Pintando los datos de las personas que fueron bajas pero tienen operaciones en el periodo
            foreach ($arraypersonas['bajas'] as $baja) {
                if ($baja['idarea'] == $a) {//Personas del area especifica
                    if (!$this->fnDeterminarPersonaConDescuadre($baja)) {
                        //CI
                        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'B', $numero, $baja['ci'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                        $objPHPExcel->getActiveSheet()->getStyle('B' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);

                        //Nombre y apellidos
                        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'C', $numero, $baja['nombreyapellidos'], null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
                        $objPHPExcel->getActiveSheet()->getStyle('C' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);

                        ////Saldo final periodo
                        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', $numero, number_format($baja['saldofinaltiempo'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', $numero, number_format($baja['saldofinalimporte'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                        $objPHPExcel->getActiveSheet()->getStyle('D' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
                        $objPHPExcel->getActiveSheet()->getStyle('E' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);

                        ////Carga inicial periodo posterior
                        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', $numero, number_format($baja['cargainicialtiempo'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', $numero, number_format($baja['cargainicialimporte'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                        $objPHPExcel->getActiveSheet()->getStyle('F' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
                        $objPHPExcel->getActiveSheet()->getStyle('G' . $numero)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
                        $numero++;
                        $sumPorCentro['saldofinaltiempodesc']['dias'] += $baja['saldofinaltiempo'];
                        $sumPorCentro['saldofinalimportedesc']['importe'] += $baja['saldofinalimporte'];
                        $sumPorCentro['cargainicialtiempodesc']['dias'] += $baja['cargainicialtiempo'];
                        $sumPorCentro['cargainicialimportedesc']['importe'] += $baja['cargainicialimporte'];
                    }
                    $sumPorCentro['saldofinaltiempo']['dias'] += $baja['saldofinaltiempo'];
                    $sumPorCentro['saldofinalimporte']['importe'] += $baja['saldofinalimporte'];
                    $sumPorCentro['cargainicialtiempo']['dias'] += $baja['cargainicialtiempo'];
                    $sumPorCentro['cargainicialimporte']['importe'] += $baja['cargainicialimporte'];
                }
            }

            //Pintando los Subtotales
            if ($contcentros <= count($arrayplantillas)) {
                //Subtotales descuadres
                $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':C' . $numero);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', $numero, 'Subtotales descuadres', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', $numero, number_format($sumPorCentro['saldofinaltiempodesc']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', $numero, number_format($sumPorCentro['saldofinalimportedesc']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $sumSubtotalGeneral['saldofinaltiempodesc']['dias'] += $sumPorCentro['saldofinaltiempodesc']['dias'];
                $sumSubtotalGeneral['saldofinalimportedesc']['importe'] += $sumPorCentro['saldofinalimportedesc']['importe'];

                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', $numero, number_format($sumPorCentro['cargainicialtiempodesc']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', $numero, number_format($sumPorCentro['cargainicialimportedesc']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $sumSubtotalGeneral['cargainicialtiempodesc']['dias'] += $sumPorCentro['cargainicialtiempodesc']['dias'];
                $sumSubtotalGeneral['cargainicialimportedesc']['importe'] += $sumPorCentro['cargainicialimportedesc']['importe'];
                $numero++;

                //Subtotales areas
                $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':C' . $numero);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', $numero, 'Subtotales áreas', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', $numero, number_format($sumPorCentro['saldofinaltiempo']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', $numero, number_format($sumPorCentro['saldofinalimporte']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $sumSubtotalGeneral['saldofinaltiempo']['dias'] += $sumPorCentro['saldofinaltiempo']['dias'];
                $sumSubtotalGeneral['saldofinalimporte']['importe'] += $sumPorCentro['saldofinalimporte']['importe'];

                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', $numero, number_format($sumPorCentro['cargainicialtiempo']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', $numero, number_format($sumPorCentro['cargainicialimporte']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $sumSubtotalGeneral['cargainicialtiempo']['dias'] += $sumPorCentro['cargainicialtiempo']['dias'];
                $sumSubtotalGeneral['cargainicialimporte']['importe'] += $sumPorCentro['cargainicialimporte']['importe'];

                $numero += 2;
            }
        }

        //Total General Descuadres
        $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':C' . $numero);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', $numero, 'Total descuadres', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', $numero, number_format($sumSubtotalGeneral['saldofinaltiempodesc']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', $numero, number_format($sumSubtotalGeneral['saldofinalimportedesc']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);

        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', $numero, number_format($sumSubtotalGeneral['cargainicialtiempodesc']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', $numero, number_format($sumSubtotalGeneral['cargainicialimportedesc']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
        $numero++;

        //Total General Areas
        $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':C' . $numero);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', $numero, 'Total áreas', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', $numero, number_format($sumSubtotalGeneral['saldofinaltiempo']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', $numero, number_format($sumSubtotalGeneral['saldofinalimporte']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);

        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', $numero, number_format($sumSubtotalGeneral['cargainicialtiempo']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', $numero, number_format($sumSubtotalGeneral['cargainicialimporte']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        //header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="SubmayorVacaciones.xls" ');
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

    private function fnDeterminarPersonaConDescuadre($persona)
    {
        //Comparacion de dos valores float(valores de punto flotante) con el epsilon
        $epsilon = 0.00001;
        $booltiempo = (abs($persona['saldofinaltiempo'] - $persona['cargainicialtiempo']) < $epsilon) ? true : false;
        $boolimporte = (abs($persona['saldofinalimporte'] - $persona['cargainicialimporte']) < $epsilon) ? true : false;
        return ($booltiempo && $boolimporte);
    }

    //Descuadres del submayor por nominas
    public function construirListadoDescuadresNominas($identidad, $arraypersonas, $mes, $anno, $tipofaltante)
    {
        $this->identidad = $identidad;
        $this->tipofaltante = $tipofaltante;
        //Definiendo el array de plantillas nominales
        $arrayplantillas = array();
        foreach ($arraypersonas as $key => $row) {
            $arrayplantillas[$row['idarea']] = $row['area'];
        }

        $objdatosperiodo['datosentidad'] = HisRetencionesPersona::obtenerDatosEntidadDadoId($identidad);

        //Creando el Reporte PDF
        $this->construirListadoDescuadresNominasExcel($arrayplantillas, $arraypersonas, $objdatosperiodo, $mes, $anno);

    }

    public function cabeceraListadoDescuadresNominasExcel(&$objPHPExcel, $objdatosperiodo, $mes)
    {
        $objDatNominaModel = new DatNominaModel();
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        $nombreempresa = $arrEstruct[0]->denominacion;
        $objPHPExcel->getActiveSheet()->getRowDimension(1)->setRowHeight(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(50);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(15);
        $objPHPExcel->getActiveSheet()->freezePane('A5');

        //Row 1
        $objPHPExcel->getActiveSheet()->mergeCells('A1:G1');
        $texto = ($this->tipofaltante == 1) ? 'PERSONAS EN NÓMINAS QUE NO EXISTEN EN EL SUBMAYOR' :
            'PERSONAS EN EL SUBMAYOR QUE NO EXISTEN EN LAS NÓMINAS';
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', 1, $texto, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        //Row 2
        $objPHPExcel->getActiveSheet()->mergeCells('A2:C2');
        $objPHPExcel->getActiveSheet()->mergeCells('D2:E2');
        $objPHPExcel->getActiveSheet()->mergeCells('F2:G2');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', 2, 'Empresa: ' . $nombreempresa, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', 2, 'Código: ' . $objdatosperiodo['datosentidad'][0]['codigo'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', 2, 'Período: ' . $mes, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        //Row 3
        $objPHPExcel->getActiveSheet()->getRowDimension(4)->setRowHeight(30);
        $objPHPExcel->getActiveSheet()->mergeCells('A3:A4');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', 3, 'Cod.', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('B3:B4');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'B', 3, 'CI', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('C3:C4');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'C', 3, 'Nombre y apellidos', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('D3:E3');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', 3, 'Saldo período nómina', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objPHPExcel->getActiveSheet()->mergeCells('F3:G3');
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', 3, 'Saldo período submayor', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        //Row 4
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', 4, 'Días', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', 4, 'Importe', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', 4, 'Días', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', 4, 'Importe', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
    }

    public function construirListadoDescuadresNominasExcel($arraplantillasaux, $arraypersonas, $objdatosperiodo, $mes, $anno)
    {
        $objDatNominaModel = new DatNominaModel();
        //Determinando la cantidad de personas por areas.
        $arrayplantillas = array();
        foreach ($arraypersonas as $i => $persona) {
            foreach ($arraplantillasaux as $a => $area) {
                $arrayplantillas[$a]['denominacion'] = (count(explode('-', $area)) > 1) ? explode('-', $area)[1] : $area;
            }
        }

        //PHPExcel
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $this->cabeceraListadoDescuadresNominasExcel($objPHPExcel, $objdatosperiodo, $mes);

        $contcentros = 0;
        $sumSubtotalGeneral = array();
        $numero = 5;
        foreach ($arrayplantillas as $a => $area) {
            $sumPorCentro = array();
            $contcentros++;
            $denomarea = $area['denominacion'];
            //Pintando la denominación de cada centro
            $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':M' . $numero);
            $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', $numero, $denomarea, null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 1);
            $numero++;

            //Pintando los datos de las personas
            foreach ($arraypersonas as $i => $persona) {
                if ($persona['idarea'] == $a) {//Personas del area especifica
                    //CI
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'B', $numero, $persona['ci'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);

                    //Nombre y apellidos
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'C', $numero, $persona['nombre'], null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);

                    //Saldo final periodo
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', $numero, number_format($persona['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', $numero, number_format($persona['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);

                    //Carga inicial periodo posterior
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', $numero, number_format($persona['diassubmayor'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', $numero, number_format($persona['importesubmayor'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 0);
                    $numero++;

                    $sumPorCentro['saldofinaltiempo']['dias'] += $persona['dias'];
                    $sumPorCentro['saldofinalimporte']['importe'] += $persona['importe'];
                    $sumPorCentro['cargainicialtiempo']['dias'] += $persona['diassubmayor'];
                    $sumPorCentro['cargainicialimporte']['importe'] += $persona['importesubmayor'];
                }
            }

            //Pintando los Subtotales
            if ($contcentros <= count($arrayplantillas)) {
                //Subtotales
                $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':C' . $numero);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', $numero, 'Subtotales', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', $numero, number_format($sumPorCentro['saldofinaltiempo']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', $numero, number_format($sumPorCentro['saldofinalimporte']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $sumSubtotalGeneral['saldofinaltiempo']['dias'] += $sumPorCentro['saldofinaltiempo']['dias'];
                $sumSubtotalGeneral['saldofinalimporte']['importe'] += $sumPorCentro['saldofinalimporte']['importe'];

                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', $numero, number_format($sumPorCentro['cargainicialtiempo']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', $numero, number_format($sumPorCentro['cargainicialimporte']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
                $sumSubtotalGeneral['cargainicialtiempo']['dias'] += $sumPorCentro['cargainicialtiempo']['dias'];
                $sumSubtotalGeneral['cargainicialimporte']['importe'] += $sumPorCentro['cargainicialimporte']['importe'];

                $numero++;
            }
        }

        //Total General
        $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':C' . $numero);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'A', $numero, 'Total', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'D', $numero, number_format($sumSubtotalGeneral['saldofinaltiempo']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'E', $numero, number_format($sumSubtotalGeneral['saldofinalimporte']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);

        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'F', $numero, number_format($sumSubtotalGeneral['cargainicialtiempo']['dias'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);
        $objDatNominaModel->fnPintarCelda($objPHPExcel, 'G', $numero, number_format($sumSubtotalGeneral['cargainicialimporte']['importe'], 2, '.', ''), null, '000000', 'Arial', 10, '000000', 'right', 'center', 0, 1);

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        //header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="SubmayorVacaciones.xls" ');
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
}

