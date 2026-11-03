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

class PDFSNC extends fpdf
{
    private $longitudhoja = 216;

    function Footer()
    {
        $this->SetFont('Arial', 'B', 8);
        $this->SetY(-10);
        $this->SetX(2);
        /*$this->Cell($this->longitudhoja, 5, utf8_decode("POR EL AREA DE RECURSOS HUMANOS"), 0, 1, "C");
        $this->Cell($this->longitudhoja * 0.70, 10, utf8_decode("NOMBRE Y APELLIDOS DEL JEFE DE AREA: _____________________________________________________"), 0, 0, "L");
        $this->Cell($this->longitudhoja * 0.30, 10, utf8_decode("FIRMA DEL JEFE DE AREA: _________"), 0, 1, "C");*/
        $this->Cell(0, 5, ' ' . $this->PageNo(), 0, 0, 'C');

    }
}

class ReporteSNCpdfModel extends ZendExt_Model
{
    private $identidad;
    private $datosentidad;
    private $longitudhoja = 216;
    private $altocelda = 6;
    private $tamannoletra = 6;
    private $annoalta;
    private $leyendanominas;

    public function ReporteSNCpdfModel()
    {
        parent::ZendExt_Model();

    }

    public function construirReporte($datospersona, $objdatossalario, $variblesSNC, $identidad)
    {
        $this->identidad = $identidad;
        $this->datosentidad = HisRetencionesPersona::obtenerDatosEntidadDadoId($identidad);
        $this->leyendanominas = $variblesSNC;

        $pdf = new PDFSNC('P', 'mm', 'Letter');//$pdf = new PDFSNC('L', 'mm', array(440, 560));
        $pdf->SetTitle("SNC-225");
        $pdf->SetAuthor("Tte. Ing. Frank Rodriguez Berroa; Ing. Dainier Velzquez Labrada");
        $pdf->SetLeftMargin(2);
        $pdf->SetTopMargin(2);
        $pdf->AddPage();

        $this->cabeceraReporte($pdf, $datospersona, $identidad);
        $this->cuerpoReporte($pdf, $objdatossalario, $identidad);
        $pdf->Output();
    }

    public function cabeceraReporte(&$pdf, $datospersona, $identidad)
    {
        $nombre = $datospersona->data[0]['nombre'] . '  ' . $datospersona->data[0]['snombre'];
        $papell = $datospersona->data[0]['papel'];
        $sapell = $datospersona->data[0]['sapel'];
        $numid = $datospersona->data[0]['numid'];
        list($diaalta, $mesalta, $annoalta) = explode('/', $datospersona->data[0]['DatPersonaentidad'][0]['falta']);
        $this->annoalta = $annoalta;
        list($diabaja, $mesbaja, $annobaja) = explode('/', $datospersona->data[0]['DatPersonaentidad'][0]['fbaja']);
        $datosentidade = HisRetencionesPersona::obtenerDatosEntidadDadoId($identidad);
        $idconcepto = $datosentidade[0]['idconcepto'];
        $organismo = '';
        $empresa = '';
        $entidad = $datosentidade[0]['denominacion'];
        //Entidad o UEB
        $organismo = $datosentidade[0]['sector'];
        $codigo = $datosentidade[0]['codigo'];
        $direccion = $datosentidade[0]['direccion'];
        //Logo Entidad
        if($idconcepto == 3){
            //Logo de la entidad
            $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
            list($imagenBase64,) = explode(';', $arrEstruct[0]->logo);
            list(, $extension) = explode('/', $imagenBase64);
            if (!empty($arrEstruct[0]->logo)) {
                $pdf->Image($arrEstruct[0]->logo, 3, 2.5, 20, 8, $extension);
            }
            //UEB se coje el logo de la entidad padre
        }else{
            //Entidad padre
            $arrEstructP = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($identidad);
            $idestructurapadre = $arrEstructP[0]->idestructura;
            //Logo de la entidad
            list($imagenBase64,) = explode(';', $arrEstructP[0]->logo);
            list(, $extension) = explode('/', $imagenBase64);
            if (!empty($arrEstructP[0]->logo)) {
                $pdf->Image($arrEstructP[0]->logo, 3, 2.5, 20, 8, $extension);
            }
        }




        //Tamaño de letra del encabezado
        $pdf->SetFont('Arial', 'B', $this->tamannoletra + 4);

        //1era fila del encabezado
        $pdf->Cell($this->longitudhoja * 0.9 - 2, 5, "          Registro de Salarios y Tiempo de Servicio", "L,T", 0, 'C');
        $pdf->Cell($this->longitudhoja * 0.1 - 2, 5, "", "T,R", 1, 'C');

        //2da fila del encabezado
        $pdf->Cell($this->longitudhoja * 0.9 - 2, 5, "          SC-4-08", "L,B", 0, 'C');
        $pdf->SetFont('Arial', 'B', $this->tamannoletra + 2);
        $pdf->Cell($this->longitudhoja * 0.1 - 2, 5, "\nNo:", "R,B", 1, 'L');

        //3era fila del encabezado
        $pdf->SetFont('Arial', '', $this->tamannoletra);
        $pdf->Cell($this->longitudhoja * 0.2, 5, "    Primer apellido", "L,T,R", 0, 'L');
        $pdf->Cell($this->longitudhoja * 0.2, 5, "    Segundo apellido", "L,T,R", 0, 'L');
        $pdf->Cell($this->longitudhoja * 0.4, 5, "    Nombres", "L,T,R", 0, 'L');
        $pdf->Cell($this->longitudhoja * 0.1 - 2, 5, "Exp. Laboral", "L,T,R", 0, 'C');
        $pdf->Cell($this->longitudhoja * 0.1 - 2, 5, "C. Identidad", "L,T,R", 1, 'C');

        //4ta fila del encabezado
        $pdf->SetFont('Arial', 'B', $this->tamannoletra + 2);
        $pdf->Cell($this->longitudhoja * 0.2, 5, utf8_decode($papell), "L,B,R", 0, 'C');
        $pdf->Cell($this->longitudhoja * 0.2, 5, utf8_decode($sapell), "L,B,R", 0, 'C');
        $pdf->Cell($this->longitudhoja * 0.4, 5, utf8_decode($nombre), "L,B,R", 0, 'C');
        $pdf->Cell($this->longitudhoja * 0.1 - 2, 5, utf8_decode($numid), "L,B,R", 0, 'C');
        $pdf->Cell($this->longitudhoja * 0.1 - 2, 5, utf8_decode($numid), "L,B,R", 1, 'C');

        //5ta fila del encabezado
        $pdf->SetFont('Arial', '', $this->tamannoletra);
        $pdf->Cell($this->longitudhoja * 0.08, 5, "Organismo", "L,T,R", 0, 'C');
        $pdf->Cell($this->longitudhoja * 0.32, 5, "    Entidad: " . $empresa, "L,T,R", 0, 'L');
        $pdf->Cell($this->longitudhoja * 0.1, 5, utf8_decode("    Código"), "L,T,R", 0, 'L');
        $pdf->Cell($this->longitudhoja * 0.3, 5, utf8_decode("    Dirección"), "L,T,R", 0, 'L');
        $pdf->Cell($this->longitudhoja * 0.2 - 4, 5, "FECHA DE", 1, 1, 'C');

        //6ta fila del encabezado
        $pdf->SetFont('Arial', 'B', $this->tamannoletra);
        $pdf->Cell($this->longitudhoja * 0.08, 10, $organismo, "L,B,R", 0, 'C');
        $pdf->Cell($this->longitudhoja * 0.32, 10, utf8_decode($entidad), "L,B,R", 0, 'C');
        $pdf->Cell($this->longitudhoja * 0.1, 10, utf8_decode($codigo), "L,B,R", 0, 'C');
        $pdf->SetFont('Arial', 'B', $this->tamannoletra);
        //---------------------Direccion------------------------------------------------------------------------------------------------
        $longitudtexto = $pdf->GetStringWidth($direccion);
        $rexplodetexto = explode(' ', $direccion);
        $textodir1 = '';
        $textodir2 = '';
        $textodir3 = '';
        $longcelda = $this->longitudhoja * 0.3 - 10;
        foreach ($rexplodetexto as $iet => $ret) {
            $auxtextodir1 = '';
            $auxtextodir2 = '';
            if ($iet == 0) {
                $textodir1 = $ret;
            } else {
                $auxtextodir1 = $textodir1 . ' ' . $ret;
                $tamanodir1 = $pdf->GetStringWidth($textodir1);
                if ($tamanodir1 <= $longcelda) {
                    $textodir1 = $textodir1 . ' ' . $ret;
                } else {
                    if ($textodir2 == '') {
                        $textodir2 = $ret;
                    } else {
                        $auxtextodir2 = $textodir2 . ' ' . $ret;
                        $tamanodir2 = $pdf->GetStringWidth($auxtextodir2);
                        if ($tamanodir2 <= $longcelda) {
                            $textodir2 = $textodir2 . ' ' . $ret;
                        } else {
                            if ($textodir3 == '') {
                                $textodir3 = $ret;
                            } else {
                                $textodir3 = $textodir3 . ' ' . $ret;
                            }
                        }
                    }
                }

            }
        }
        $pdf->Cell($this->longitudhoja * 0.3, 10, utf8_decode(''), "L,B,R", 0, 'C');
        $xdir = $pdf->getX();
        $ydir = $pdf->getY();
        //---------------------------------------------------------------------------------------------------------------------------------
        $pdf->Text($xdir - 64.5, $ydir + 3, utf8_decode($textodir1));
        $pdf->Text($xdir - 64.5, $ydir + 6, utf8_decode($textodir2));
        $pdf->Text($xdir - 64.5, $ydir + 9, utf8_decode($textodir3));
        $pdf->SetFont('Arial', '', $this->tamannoletra);
        $pdf->Cell($this->longitudhoja * 0.1 - 2, 5, "ALTA", 1, 0, 'C');
        $pdf->Cell($this->longitudhoja * 0.1 - 2, 5, "BAJA", 1, 1, 'C');
        $pdf->SetX($this->longitudhoja * 0.8 + 2);
        $pdf->SetFont('Arial', '', $this->tamannoletra);
        $pdf->Cell($this->longitudhoja * (1 / 30) - (2 / 3), 5, $diaalta, 1, 0, 'C');
        $pdf->Cell($this->longitudhoja * (1 / 30) - (2 / 3), 5, $mesalta, 1, 0, 'C');
        $pdf->Cell($this->longitudhoja * (1 / 30) - (2 / 3), 5, $annoalta, 1, 0, 'C');
        $pdf->Cell($this->longitudhoja * (1 / 30) - (2 / 3), 5, $diabaja, 1, 0, 'C');
        $pdf->Cell($this->longitudhoja * (1 / 30) - (2 / 3), 5, $mesbaja, 1, 0, 'C');
        $pdf->Cell($this->longitudhoja * (1 / 30) - (2 / 3), 5, $annobaja, 1, 1, 'C');
    }

    public function cuerpoReporte(&$pdf, $datospersona, $identidad)
    {
        //Reestructurando el array de personas
        $rpersona = array();
        $primerannodevengado = 9999;
        $ultimoannodevengado = 0;
        foreach ($datospersona as $persona) {
            foreach ($persona->meses as $idmes => $datos) {
                $rpersona[$persona->anno][$idmes]['diastrabajados'] = $datos['diastrabajados'];
                $rpersona[$persona->anno][$idmes]['salariodevengado'] = $datos['salariodevengado'];
                $rpersona[$persona->anno][$idmes]['leyenda'] = $datos['leyenda'];
            }
            $primerannodevengado = ($persona->anno < $primerannodevengado) ? $persona->anno : $primerannodevengado;
            $ultimoannodevengado = ($persona->anno > $ultimoannodevengado) ? $persona->anno : $ultimoannodevengado;
        }
        $diferencia = $ultimoannodevengado - $primerannodevengado;
        $ultimoannoapintar = ($diferencia < 10) ? $ultimoannodevengado + (10 - $diferencia) : $ultimoannodevengado;

        //Definiendo el array de meses
        $arraymeses = array('mes-1' => 'ENERO', 'mes-2' => 'FEBRERO', 'mes-3' => 'MARZO', 'mes-4' => 'ABRIL', 'mes-5' => 'MAYO', 'mes-6' => 'JUNIO', 'mes-7' => 'JULIO', 'mes-8' => 'AGOSTO', 'mes-9' => 'SEPTIEMBRE', 'mes-10' => 'OCTUBRE', 'mes-11' => 'NOVIEMBRE', 'mes-12' => 'DICIEMBRE');
        $cantannos = 0;
        $cantiteraciones = 0;
        $flag = ($ultimoannodevengado - $primerannodevengado) / 5;
        for ($anno = $primerannodevengado; $anno < $ultimoannoapintar; $anno += 5) {
            $cantannos += 5;
            $cantiteraciones++;
            //1era fila
            $longannos = ($this->longitudhoja - 34) / 5;
            $pdf->SetFont('Arial', '', $this->tamannoletra);
            $pdf->Cell(30, 5, "", "L,T,R", 0);
            $pdf->Cell($this->longitudhoja - 34, 3, utf8_decode("AÑOS"), 1, 1, 'C');

            //2era fila
            $arrayannosmeses = array();
            $pdf->SetFont('Arial', 'B', $this->tamannoletra + 2);
            $pdf->Cell(30, 3, "", "L,R", 0);
            for ($i = $anno; $i < $anno + 5; $i++) {
                $pdf->Cell($longannos, 3, $i, 1, 0, "C");
                foreach ($arraymeses as $imes => $mes) {
                    $arrayannosmeses[$i][$imes] = $imes;
                }
            }
            $pdf->Cell(0.09, 3, "", 0, 1);

            //3era
            $pdf->SetFont('Arial', '', $this->tamannoletra);
            $pdf->Cell(30, 3, "", "L,R", 0);
            $longdiastrabj = ($this->longitudhoja - 34) / 13;
            $longsalariodev = $longannos - $longdiastrabj;
            $pdf->Cell($longdiastrabj, 3, utf8_decode("Días"), "L,T,R", 0, "C");
            $pdf->Cell($longsalariodev, 3, "Salario", "L,T,R", 0, "C");
            $pdf->Cell($longdiastrabj, 3, utf8_decode("Días"), "L,T,R", 0, "C");
            $pdf->Cell($longsalariodev, 3, "Salario", "L,T,R", 0, "C");
            $pdf->Cell($longdiastrabj, 3, utf8_decode("Días"), "L,T,R", 0, "C");
            $pdf->Cell($longsalariodev, 3, "Salario", "L,T,R", 0, "C");
            $pdf->Cell($longdiastrabj, 3, utf8_decode("Días"), "L,T,R", 0, "C");
            $pdf->Cell($longsalariodev, 3, "Salario", "L,T,R", 0, "C");
            $pdf->Cell($longdiastrabj, 3, utf8_decode("Días"), "L,T,R", 0, "C");
            $pdf->Cell($longsalariodev, 3, "Salario", "L,T,R", 1, "C");

            //4ta
            $pdf->Cell(30, 3, "", "L,B,R", 0);
            $pdf->Cell($longdiastrabj, 3, "Trabajados", "L,B,R", 0, "C");
            $pdf->Cell($longsalariodev, 3, "Devengado", "L,B,R", 0, "C");
            $pdf->Cell($longdiastrabj, 3, "Trabajados", "L,B,R", 0, "C");
            $pdf->Cell($longsalariodev, 3, "Devengado", "L,B,R", 0, "C");
            $pdf->Cell($longdiastrabj, 3, "Trabajados", "L,B,R", 0, "C");
            $pdf->Cell($longsalariodev, 3, "Devengado", "L,B,R", 0, "C");
            $pdf->Cell($longdiastrabj, 3, "Trabajados", "L,B,R", 0, "C");
            $pdf->Cell($longsalariodev, 3, "Devengado", "L,B,R", 0, "C");
            $pdf->Cell($longdiastrabj, 3, "Trabajados", "L,B,R", 0, "C");
            $pdf->Cell($longsalariodev, 3, "Devengado", "L,B,R", 1, "C");

            //Pintando los datos de la persona
            $arraytotales = array();
            foreach ($arraymeses as $imes => $mes) {
                $pdf->Cell(30, $this->altocelda, $mes, 1, 0, 'C');
                foreach ($arrayannosmeses as $ia => $mesxanno) {
                    $pdf->SetFont('Arial', '', $this->tamannoletra);
                    if ($rpersona[$ia][$imes]) {
                        $dias = ($rpersona[$ia][$imes]['diastrabajados'] != null) ? $rpersona[$ia][$imes]['diastrabajados'] : 0;
                        $pdf->Cell($longdiastrabj, $this->altocelda, $dias, 1, 0, 'C');
                        $x = $pdf->GetX();
                        $salario = ($rpersona[$ia][$imes]['salariodevengado'] != null) ? number_format($rpersona[$ia][$imes]['salariodevengado'], 2, '.', '') : number_format(0, 2, '.', '');
                        $pdf->Cell($longsalariodev, $this->altocelda, $salario, 1, 0, 'C');
                    } else {
                        $pdf->Cell($longdiastrabj, $this->altocelda, null, 1, 0, 'C');
                        $x = $pdf->GetX();
                        $pdf->Cell($longsalariodev, $this->altocelda, null, 1, 0, 'C');
                    }

                    //Pintando la leyenda
                    if (!empty($rpersona[$ia][$imes]['leyenda'])) {
                        $pdf->SetFont('Arial', 'B', $this->tamannoletra - 2);
                        $longleyenda = $pdf->GetStringWidth('(' . utf8_decode($rpersona[$ia][$imes]['leyenda']) . ')');
                        $pdf->Text($x + $longsalariodev - $longleyenda - 1, $pdf->GetY() + $this->altocelda - 0.5, '(' . utf8_decode($rpersona[$ia][$imes]['leyenda']) . ')');
                    }

                    //Subtotales
                    $arraytotales[$ia]['diastrabajados'] += (!empty($rpersona[$ia][$imes]['diastrabajados'])) ? $rpersona[$ia][$imes]['diastrabajados'] : 0;
                    $arraytotales[$ia]['salariodevengado'] += (!empty($rpersona[$ia][$imes]['salariodevengado'])) ? $rpersona[$ia][$imes]['salariodevengado'] : 0;
                }
                $pdf->SetFont('Arial', '', $this->tamannoletra);
                $pdf->Cell(0.09, $this->altocelda, "", 0, 1);
            }

            //Pintando el total, firmas
            $pdf->SetFont('Arial', 'B', $this->tamannoletra);
            $pdf->Cell(30, 5, "Total", 1, 0, 'C');
            foreach ($arraytotales as $totalanno) {
                $pdf->Cell($longdiastrabj, 5, ((!empty($totalanno['diastrabajados'])) ? $totalanno['diastrabajados'] : ''), 1, 0, 'C');
                $pdf->Cell($longsalariodev, 5, ((!empty($totalanno['salariodevengado'])) ? number_format($totalanno['salariodevengado'], 2, '.', '') : ''), 1, 0, 'C');
            }
            $pdf->Cell(0.09, 5, "", 0, 1);
            $pdf->Cell(30, 3, "Firma", "L,T,R", 0, 'C');
            $pdf->Cell($longannos, 3, "", "L,T,R", 0);
            $pdf->Cell($longannos, 3, "", "L,T,R", 0);
            $pdf->Cell($longannos, 3, "", "L,T,R", 0);
            $pdf->Cell($longannos, 3, "", "L,T,R", 0);
            $pdf->Cell($longannos, 3, "", "L,T,R", 1);
            $pdf->Cell(30, 3, "trabajador", "L,B,R", 0, 'C');
            $pdf->Cell($longannos, 3, "", "L,B,R", 0);
            $pdf->Cell($longannos, 3, "", "L,B,R", 0);
            $pdf->Cell($longannos, 3, "", "L,B,R", 0);
            $pdf->Cell($longannos, 3, "", "L,B,R", 0);
            $pdf->Cell($longannos, 3, "", "L,B,R", 1);

            $pdf->Cell(30, 3, "Firma Jefe", "L,T,R", 0, 'C');
            $pdf->Cell($longannos, 3, "", "L,T,R", 0);
            $pdf->Cell($longannos, 3, "", "L,T,R", 0);
            $pdf->Cell($longannos, 3, "", "L,T,R", 0);
            $pdf->Cell($longannos, 3, "", "L,T,R", 0);
            $pdf->Cell($longannos, 3, "", "L,T,R", 1);
            $pdf->Cell(30, 3, utf8_decode("Área Personal"), "L,B,R", 0, 'C');
            $pdf->Cell($longannos, 3, "", "L,B,R", 0);
            $pdf->Cell($longannos, 3, "", "L,B,R", 0);
            $pdf->Cell($longannos, 3, "", "L,B,R", 0);
            $pdf->Cell($longannos, 3, "", "L,B,R", 0);
            $pdf->Cell($longannos, 3, "", "L,B,R", 1);

            //Pintando las operaciones por cada hoja, y creando una nueva de 10 en 10
            if ($cantannos % 10 == 0) {
                $this->observacionesReporte($pdf);
                if ($flag > $cantiteraciones) {
                    $pdf->AddPage();
                    $this->cabeceraReporte($pdf, $datospersona, $identidad);
                }
            } else {
                //Pintando las operaciones en la última hoja
                /*
                if ($flag <= $cantiteraciones)
                    $this->observacionesReporte($pdf);
                */
            }
        }
    }

    public function observacionesReporte(&$pdf)
    {
        //Imprimiendo las observaciones
        $longobserv = 30;
        $pdf->SetFont('Arial', 'B', $this->tamannoletra);
        //$pdf->Cell($this->longitudhoja - 4, 5, '', 'L,T,R', 1);
        $pdf->Cell($longobserv, 5, 'OBSERVACIONES:', 'L', 0);
        $longleyenda = 0;
        $cont = 0;
        foreach ($this->leyendanominas as $i => $leyendanomina) {
            $cont++;
            $valor = utf8_decode($leyendanomina['denom'] . ':') .
                utf8_decode('(' . $leyendanomina['denominacion'] . ') ;');
            if (!empty($leyendanomina['anotaciones'])) {
                $valor .= ' - ' . $leyendanomina['anotaciones'];
            }
            $long = $pdf->GetStringWidth($valor) + 4;
            $longleyenda += $long;
            $border = '';
            if ($longleyenda >= ($this->longitudhoja - $longobserv)) {
                $pdf->Cell($this->longitudhoja - ($pdf->GetX() + 2), 5, '', 'R', 1);
                $longleyenda = 0;
                $border = 'L';
            }
            $pdf->SetFont('Arial', '', $this->tamannoletra);
            $denom = utf8_decode($leyendanomina['denom'] . ':');
            $pdf->Cell($pdf->GetStringWidth($denom) + 2, 5, $denom, $border, 0, 'C');

            $pdf->SetFont('Arial', 'B', $this->tamannoletra);
            $abrev = utf8_decode('(' . $leyendanomina['denominacion'] . ')');
            $pdf->Cell($pdf->GetStringWidth($abrev) + 2, 5, $abrev, 0, 0, 'C');

            if (!empty($leyendanomina['anotaciones'])) {
                $pdf->SetFont('Arial', 'B', $this->tamannoletra);
                $abrev = utf8_decode(' - ' . $leyendanomina['anotaciones']);
                $pdf->Cell($pdf->GetStringWidth($abrev) + 2, 5, $abrev, 0, 0, 'C');
            }

            $pdf->SetFont('Arial', 'B', $this->tamannoletra);
            $abrev = ';';
            $pdf->Cell($pdf->GetStringWidth($abrev), 5, $abrev, 0, 0, 'C');

            if ($cont == count($this->leyendanominas))
                $pdf->Cell($this->longitudhoja - ($pdf->GetX() + 2), 5, '', 'R', 1, 'C');
        }
        $x = $pdf->GetX();
        $pdf->Line(2, $pdf->GetY(), $this->longitudhoja - 2, $pdf->GetY());
    }
}

 

