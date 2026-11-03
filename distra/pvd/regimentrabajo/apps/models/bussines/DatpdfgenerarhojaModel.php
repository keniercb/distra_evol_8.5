<?php

class PDFGenerarhoja extends fpdf
{

    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $entidad = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($datentidad->idestructura);
        $this->SetY(-15);
        $this->SetX(5);
        $this->SetFont('Arial', 'I', 7);
        if(!empty($entidad[0]->direccion) && !empty($entidad[0]->telefono)){
            $this->Cell(110, 10, utf8_decode($entidad[0]->denominacion . ' [' . $entidad[0]->abreviatura . ']'), 0, 0, 'L');
            $this->MultiCell(85, 5, "" . utf8_decode($entidad[0]->direccion . ' Teléfono: ' . $entidad[0]->telefono), 0, 'R', 0);
        }else{
            $this->Cell(70, 10, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 0, 'L');
            $this->Cell(100, 10, utf8_decode('Generado por: ' . $perfil['usuario']) . ' el ' . date('d/m/Y H:i'), 0, 0, 'R');
            $this->Cell(0, 10, utf8_decode('Página ' . $this->PageNo()), 0, 0, 'R');
        }
    }
}


class DatpdfgenerarhojaModel extends ZendExt_Model
{

    public function DatpdfModel()
    {
        parent::ZendExt_Model();

    }

    public function construirReporte($asistencia, $person, $fechdesde, $fechhasta, $mes, $year, $period, $configSesiones/*,$data*/)
    {
        $pdf = new PDFGenerarhoja('P', 'mm', 'a4');
        foreach ($person as $k => $v) {
            $this->crearEncabezadoPrincipal($pdf, $v, $asistencia, $fechdesde, $fechhasta, $period, $k + 1, $configSesiones);
            $pdfNGeneral = $this->crearCuerpo($pdf, $v, $asistencia, $mes, $year, $configSesiones/*,$data*/);
        }
        ob_clean();
        $pdfNGeneral->Output();
    }
    

    private function crearCuerpo($pdf, $person, $asistencia, $mes, $year, $configSesiones/*,$data*/)
    {
		$confCalendarioPersona = new ConfCalendariopersona();
        $datAsistenciaModel = new DatAsistenciaModel();
        if ($configSesiones == 1) {
            if ($asistencia[$person['idpersona']]) {
                foreach ($asistencia[$person['idpersona']]['asistencia'] as $keymes => $mesanno) {
                    $pdf->SetFont('Arial', 'B', 7);
                    $pdf->SetFillColor(200);
                    $pdf->Cell(200, 5, "" . utf8_decode("" . $keymes), 1, 0, "L", 1);
                    $pdf->Ln(5);
                    foreach ($mesanno as $k => $val) {
                        $pdf->SetFont('Arial', '', 7);
                        $time = strtotime($val['mes'] . '/' . $val['dia'] . '/' . $val['year']);
                        $newformat = date('Y-m-d', $time);
                        $iswend = $this->isWeekend($newformat);
                        if ($val['fechahoraentradaps']) $hentradaps = $val['fechahoraentradaps']; else $hentradaps = '';
                        if ($val['fechahorasalidaps']) $hsalidaps = $val['fechahorasalidaps']; else $hsalidaps = '';

                        if ($val['fechahoraentradass']) $hentradass = $val['fechahoraentradass']; else $hentradass = '';
                        if ($val['fechahorasalidass']) $hsalidass = $val['fechahorasalidass']; else $hsalidass = '';

                        $causaps = $val['denominacionps'];
                        $causass = $val['denominacionss'];
                        $hrsdescontadasps = $val['hrsdescontadasps'];
                        $hrsdescontadasss = $val['hrsdescontadasss'];
                        $horasextrasps = $val['horasextrasps'];
                        $horasextrasss = $val['horasextrasss'];

                        $pdf->SetFont('Arial', '', 7);
                        $pdf->SetDrawColor(0, 0, 0);
                        $pdf->SetLineWidth(0);

                        $pdf->Cell(6, 5, "" . utf8_decode("" . $k), 1, 0, '', 0);
                        if ($iswend) {
                            $pdf->SetFillColor(200);
                            if ($val['idcausa']) {
                                if($val['idcausa'] == -1)
                                    $pdf->Cell(194, 5, "" . utf8_decode("Multiples Causas"), 1, 0, 'C', 1);
                                else
                                    $pdf->Cell(194, 5, "" . utf8_decode("" . $val['causa']), 1, 0, 'C', 1);
                            } else {
                                $pdf->SetX(11);
                                $pdf->Cell(13, 5, "" . utf8_decode("" . $hentradaps), 1, 0, '', 1);
                                $pdf->Cell(10, 5, "" . utf8_decode("" . $hsalidaps), 1, 0, '', 1);
                                $pdf->Cell(47, 5, "" . utf8_decode("" . $causaps), 1, 0, '', 1);
                                $pdf->Cell(15, 5, "" . utf8_decode("" . $hrsdescontadasps), 1, 0, '', 1);
                                $pdf->Cell(12, 5, "" . utf8_decode("" . $horasextrasps), 1, 0, '', 1);

                                $pdf->SetX(108);
                                $pdf->Cell(13, 5, "" . utf8_decode("" . $hentradass), 1, 0, '', 1);
                                $pdf->Cell(10, 5, "" . utf8_decode("" . $hsalidass), 1, 0, '', 1);
                                $pdf->Cell(47, 5, "" . utf8_decode("" . $causass), 1, 0, '', 1);
                                $pdf->Cell(15, 5, "" . utf8_decode("" . $hrsdescontadasss), 1, 0, '', 1);
                                $pdf->Cell(12, 5, "" . utf8_decode("" . $horasextrasss), 1, 0, '', 1);
                            }
                            $pdf->Ln(5);
                            //$pdf->SetFillColor(0, 0, 0);
                            continue;
                        } else {
                            if ($val['idcausa']) { 
                                $pdf->Cell(194, 5, "" . utf8_decode("" . $val['causa']), 1, 0, 'C', 0);
                            } else {
                                $pdf->SetX(11);
                                $pdf->Cell(13, 5, "" . utf8_decode("" . $hentradaps), 1, 0, '', 0);
                                $pdf->Cell(10, 5, "" . utf8_decode("" . $hsalidaps), 1, 0, '', 0);
                                $pdf->Cell(47, 5, "" . utf8_decode("" . $causaps), 1, 0, '', 0);
                                $pdf->Cell(15, 5, "" . utf8_decode("" . $hrsdescontadasps), 1, 0, '', 0);
                                $pdf->Cell(12, 5, "" . utf8_decode("" . $horasextrasps), 1, 0, '', 0);

                                $pdf->SetX(108);
                                $pdf->Cell(13, 5, "" . utf8_decode("" . $hentradass), 1, 0, '', 0);
                                $pdf->Cell(10, 5, "" . utf8_decode("" . $hsalidass), 1, 0, '', 0);
                                $pdf->Cell(47, 5, "" . utf8_decode("" . $causass), 1, 0, '', 0);
                                $pdf->Cell(15, 5, "" . utf8_decode("" . $hrsdescontadasss), 1, 0, '', 0);
                                $pdf->Cell(12, 5, "" . utf8_decode("" . $horasextrasss), 1, 0, '', 0);
                            }
                        }
                        $pdf->Ln(5);
                    }
                }
            } else {
                $pdf->SetFont('Arial', '', 7);
                $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
                for ($j = 1; $j <= $cantDiasMes; $j++) {
                    $time1 = strtotime($mes . '/' . $j . '/' . $year);
                    $newformat1 = date('Y-m-d', $time1);
                    $iswend1 = $this->isWeekend($newformat1);
                    if ($iswend1) {
                        $pdf->SetFillColor(200);
                        $pdf->SetX(11);
                        $pdf->Cell(13, 5, "", 1, 0, '', 1);
                        $pdf->Cell(10, 5, "", 1, 0, '', 1);
                        $pdf->Cell(47, 5, "", 1, 0, '', 1);
                        $pdf->Cell(15, 5, "", 1, 0, '', 1);
                        $pdf->Cell(12, 5, "", 1, 0, '', 1);

                        $pdf->SetX(108);
                        $pdf->Cell(13, 5, "", 1, 0, '', 1);
                        $pdf->Cell(10, 5, "", 1, 0, '', 1);
                        $pdf->Cell(47, 5, "", 1, 0, '', 1);
                        $pdf->Cell(15, 5, "", 1, 0, '', 1);
                        $pdf->Cell(12, 5, "", 1, 0, '', 1);
                        $pdf->Ln(5);
                        //$pdf->SetFillColor(0, 0, 0);
                        continue;
                    } else {
                        $pdf->SetX(11);
                        $pdf->Cell(13, 5, "", 1, 0, '', 0);
                        $pdf->Cell(10, 5, "", 1, 0, '', 0);
                        $pdf->Cell(47, 5, "", 1, 0, '', 0);
                        $pdf->Cell(15, 5, "", 1, 0, '', 0);
                        $pdf->Cell(12, 5, "", 1, 0, '', 0);

                        $pdf->SetX(108);
                        $pdf->Cell(13, 5, "", 1, 0, '', 0);
                        $pdf->Cell(10, 5, "", 1, 0, '', 0);
                        $pdf->Cell(47, 5, "", 1, 0, '', 0);
                        $pdf->Cell(15, 5, "", 1, 0, '', 0);
                        $pdf->Cell(12, 5, "", 1, 0, '', 0);
                    }
                    $pdf->Ln(5);
                }
            }
        } else {
            if ($asistencia[$person['idpersona']]['otrodia'] == true) {
                if ($asistencia[$person['idpersona']]) {
                    foreach ($asistencia[$person['idpersona']]['asistencia'] as $keymes => $mesanno) {
                        $pdf->SetFont('Arial', 'B', 7);
                        $pdf->SetFillColor(200);
                        $pdf->Cell(197, 5, "" . utf8_decode("" . $keymes), 1, 0, "L", 1);
                        $pdf->Ln(5);
                        foreach ($mesanno as $k => $val) {
                            $pdf->SetFont('Arial', '', 7);
                            $time = strtotime($val['mes'] . '/' . $val['dia'] . '/' . $val['year']);
                            $newformat = date('Y-m-d', $time);
                            $iswend = $this->isWeekend($newformat);
                            $fechent = explode(' ', $val['fechahoraentrada']);
                            $fechsal = explode(' ', $val['fechahorasalida']);
                            $fechent1 = explode(':', $fechent[1]);
                            $fechsal1 = explode(':', $fechsal[1]);
                            if ($val['fechahoraentrada']) {
                                $hentrada = $fechent1[0] . ':' . $fechent1[1];
                                $fentrada = $fechent[0];
                            } else {
                                $hentrada = '';
                                $fentrada = '';
                            }

                            if ($val['fechahorasalida']) {
                                $hsalida = $fechsal1[0] . ':' . $fechsal1[1];
                                $fsalida = $fechsal[0];
                            } else {
                                $hsalida = '';
                                $fsalida = '';
                            }
                            $confCalendario = new ConfCalendario();
                            $nomGrupodescanso = new NomGrupodescanso();
                            $confHabgrupospredeterminados = new ConfHabgrupospredeterminados();
                            $existegrupo = $confHabgrupospredeterminados->existe($valor['idgrupodescanso']);
                            $grupopredeterminado = $nomGrupodescanso->getGrupoPredeterminado();
                            if(!empty($grupopredeterminado) && count($existegrupo) != 0 && !empty($val['fdesde']) && !empty($val['fhasta']))
                                $calendario = $confCalendario->CalendarioByDateRangeTrabajo($newformat,$newformat,$grupopredeterminado[0]['idgrupodescanso']);
                            else
                                $calendario = $confCalendarioPersona->getCalendarioPersona($val['fecharegistro'],$val['fecharegistro'], $person['idpersona']);
                            $diaferiadohab = $datAsistenciaModel->GetDiaFeriadoHabilitado($person['idpersona'], $val['fecharegistro']);
                            if (($calendario[0]['feriado'] == 1 && count($diaferiadohab) == 0) && empty($val['idcausa']))
                                $causa = 'FERIADO';
                            else if ($calendario[0]['idtipodedia'] == 13)
                                $causa = 'RECESO LABORAL';
                            else
                                $causa = $val['causa'];
                            if(!empty($grupopredeterminado) && count($existegrupo) != 0 && !empty($val['fdesde']) && !empty($val['fhasta']) && !empty($val['idcausa']) && $val['afectasalario'] == 1) {
                                $hrsdescont = explode(':', $calendario[0]['horas']);
                                $hrsdescontadas = $hrsdescont[0] . ':' . $hrsdescont[1];
                            }else if (empty($val['idcausa']) || $val['afectasalario'] == 1 && !empty($calendario[0]['horas'])) {
                                $hrsdescontadas = $val['hrsdescontadas'];
                            } else if ($val['idcausa'] == -1 && !empty($val['hrsdescontadas'])) {
                                $hrsdescontadas = $val['hrsdescontadas'];
                            }
                            else
                                $hrsdescontadas = '';
                            if ($val['hrsdescontadas'] == '00:00:00')
                                $hrsdescontadas = '';
                            if ($val['hrstrabajadas'] == '00:00:00')
                                $hrstrabajadas = '';
                            else {
                                if(!empty($val['hrstrabajadas'])){
                                    $hrstrab = explode(':', $val['hrstrabajadas']);
                                    $hrstrabajadas = $hrstrab[0].':'.$hrstrab[1];} else $hrstrabajadas = '';
                            }
                            $personacontrola = $val['personacontrola'];
                            if($calendario[0]['trabajo'] == 1 && empty($val['idcausa']) && empty($val['fechahoraentrada']) && empty($val['fechahorasalida'])){
                                $causa = 'SIN REGISTRO ';
                                $hrsdesc = explode(':',$calendario[0]['horas']);
                                $hrsdescontadas = $hrsdesc[0].':'.$hrsdesc[1];
                            }

                            if($val['idcausa'] == -1)
                                $causa = 'MULTIPLES CAUSAS ';

                            $pdf->SetFont('Arial', '', 7);
                            if ($iswend) {
                                $pdf->Cell(7, 5, "" . utf8_decode("" . $k), 1, 0, 1, 1);
                                if($calendario[0]['trabajo'] == 1 || $calendario[0]['feriado'] == 1){
                                    $pdf->Cell(25, 5, "" . utf8_decode("" . $fentrada), 1, 0, 'C', 1);
                                    $pdf->Cell(25, 5, "" . utf8_decode("" . $hentrada), 1, 0, 'C', 1);
                                    $pdf->Cell(25, 5, "" . utf8_decode("" . $fsalida), 1, 0, 'C', 1);
                                    $pdf->Cell(25, 5, "" . utf8_decode("" . $hsalida), 1, 0, 'C', 1);
                                    $pdf->Cell(50, 5, "" . utf8_decode("" . $causa), 1, 0, 'C', 1);
                                    $pdf->Cell(20, 5, "" . utf8_decode("" . $hrsdescontadas), 1, 0, 'C', 1);
                                    $pdf->Cell(20, 5, "" . utf8_decode("" . $hrstrabajadas), 1, 0, 'C', 1);
                                }else{
                                    $pdf->Cell(25, 5, "" . utf8_decode(""), 1, 0, 'C', 1);
                                    $pdf->Cell(25, 5, "" . utf8_decode(""), 1, 0, 'C', 1);
                                    $pdf->Cell(25, 5, "" . utf8_decode(""), 1, 0, 'C', 1);
                                    $pdf->Cell(25, 5, "" . utf8_decode(""), 1, 0, 'C', 1);
                                    $pdf->Cell(50, 5, "" . utf8_decode(""), 1, 0, 'C', 1);
                                    $pdf->Cell(20, 5, "" . utf8_decode(""), 1, 0, 'C', 1);
                                    $pdf->Cell(20, 5, "" . utf8_decode(""), 1, 0, 'C', 1);
                                }
                            }else{
                                $pdf->Cell(7, 5, "" . utf8_decode("" . $k), 1, 0, 1, 0);
                                $pdf->Cell(25, 5, "" . utf8_decode("" . $fentrada), 1, 0, 'C', 0);
                                $pdf->Cell(25, 5, "" . utf8_decode("" . $hentrada), 1, 0, 'C', 0);
                                $pdf->Cell(25, 5, "" . utf8_decode("" . $fsalida), 1, 0, 'C', 0);
                                $pdf->Cell(25, 5, "" . utf8_decode("" . $hsalida), 1, 0, 'C', 0);
                                $pdf->Cell(50, 5, "" . utf8_decode("" . $causa), 1, 0, 'C', 0);
                                $pdf->Cell(20, 5, "" . utf8_decode("" . $hrsdescontadas), 1, 0, 'C', 0);
                                $pdf->Cell(20, 5, "" . utf8_decode("" . $hrstrabajadas), 1, 0, 'C', 0);
                            }
                            $pdf->Ln(5);
                        }
                    }
                } else {
                    $pdf->SetFont('Arial', '', 7);
                    $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
                    for ($j = 1; $j <= $cantDiasMes; $j++) {
                        $time1 = strtotime($mes . '/' . $j . '/' . $year);
                        $newformat1 = date('Y-m-d', $time1);
                        $iswend1 = $this->isWeekend($newformat1);
                        if ($iswend1) {
                            $pdf->Cell(7, 5, $j, 1, 0, 1, 0);
                            $pdf->SetFillColor(200);
                            $pdf->SetFont('Arial', '', 7);
                            $pdf->Cell(7, 5, $j, 1, 0, 1, 1);
                            $pdf->Cell(25, 5, "", 1, 0, 'C', 1);
                            $pdf->Cell(25, 5, "", 1, 0, 'C', 1);
                            $pdf->Cell(25, 5, "", 1, 0, 'C', 1);
                            $pdf->Cell(25, 5, "", 1, 0, 'C', 1);
                            $pdf->Cell(50, 5, "", 1, 0, 'C', 1);
                            $pdf->Cell(20, 5, "", 1, 0, 'C', 1);
                            $pdf->Cell(20, 5, "", 1, 0, 'C', 1);
                            $pdf->Ln(5);
                            $pdf->SetFillColor(0, 0, 0);
                            continue;
                        } else {
                            $pdf->SetFont('Arial', '', 7);
                            $pdf->Cell(7, 5, $j, 1, 0, 1, 0);
                            $pdf->Cell(25, 5, "", 1, 0, 'C', 0);
                            $pdf->Cell(25, 5, "", 1, 0, 'C', 0);
                            $pdf->Cell(25, 5, "", 1, 0, 'C', 0);
                            $pdf->Cell(25, 5, "", 1, 0, 'C', 0);
                            $pdf->Cell(50, 5, "", 1, 0, 'C', 0);
                            $pdf->Cell(20, 5, "", 1, 0, 'C', 0);
                            $pdf->Cell(20, 5, "", 1, 0, 'C', 0);
                        }
                        $pdf->Ln(5);

                    }
                }
            } else {
                if ($asistencia[$person['idpersona']]) {
                    foreach ($asistencia[$person['idpersona']]['asistencia'] as $keymes => $mesanno) {
                        $pdf->SetFont('Arial', 'B', 7);
                        $pdf->SetFillColor(200);
                        $pdf->Cell(197, 5, "" . utf8_decode("" . $keymes), 1, 0, "L", 1);
                        $pdf->Ln(5);
                        foreach ($mesanno as $k => $val) {
                            $pdf->SetFont('Arial', '', 7);

                            $time = strtotime($val['mes'] . '/' . $val['dia'] . '/' . $val['year']);
                            $newformat = date('Y-m-d', $time);
                            $iswend = $this->isWeekend($newformat);

                            $fechent = explode(' ', $val['fechahoraentrada']);
                            $fechsal = explode(' ', $val['fechahorasalida']);
                            $fechent1 = explode(':', $fechent[1]);
                            $fechsal1 = explode(':', $fechsal[1]);
                            if ($val['fechahoraentrada']) $hentrada = $fechent1[0] . ':' . $fechent1[1]; else $hentrada = '';
                            if ($val['fechahorasalida']) $hsalida = $fechsal1[0] . ':' . $fechsal1[1]; else $hsalida = '';

                            $calendario = $confCalendarioPersona->getCalendarioPersona($val['fecharegistro'],$val['fecharegistro'], $person['idpersona']);
                            $diaferiadohab = $datAsistenciaModel->GetDiaFeriadoHabilitado($person['idpersona'], $val['fecharegistro']);
                            if (($calendario[0]['feriado'] == 1 && count($diaferiadohab) == 0) && empty($val['idcausa']))
                                $causa = 'FERIADO';
                            else if ($calendario[0]['idtipodedia'] == 13 && empty($val['idcausa']))
                                $causa = 'RECESO LABORAL';
                            else
                                $causa = $val['causa'];

                            if($val['causa'] == -1)
                                $causa = 'MULTIPLES CAUSAS ';

                            if (empty($val['idcausa']) || $val['afectasalario'] == 1 && !empty($val['hrsdescontadas'])) {
                                $hrsdescontadas = $val['hrsdescontadas'];
                            } else if ($val['idcausa'] == -1 && !empty($val['hrsdescontadas'])) {
                                $hrsdescontadas = $val['hrsdescontadas'];
                            } else
                                $hrsdescontadas = '';
                            if ($val['hrsdescontadas'] == '00:00')
                                $hrsdescontadas = '';
                            if ($val['hrstrabajadas'] == '00:00:00')
                                $hrstrabajadas = '';
                            else {
                                if(!empty($val['hrstrabajadas'])){
                                    $hrstrab = explode(':', $val['hrstrabajadas']);
                                    $hrstrabajadas = $hrstrab[0].':'.$hrstrab[1];} else $hrstrabajadas = '';
                            }
                            $personacontrola = $val['personacontrola'];
                            /*if(!empty($val['fechahoraentrada']) && empty($val['fechahorasalida']) && empty($val['fdesde']) && empty($val['fhasta'])){
                                $hsalida = 'Sin salida';
                                $hrsdesc = explode(':',$calendario[0]['horas']);
                                $hrsdescontadas = $hrsdesc[0].':'.$hrsdesc[1];
                                $hrstrabajadas = '';
                            }*/
//                            if(($calendario[0]['trabajo'] == 1 || count($diaferiadohab) > 0) && empty($val['idcausa']) && empty($val['fechahoraentrada']) && empty($val['fechahorasalida']) && $calendario[0]['idtipodedia'] != 8){
//                                $causa = 'SIN REGISTRO ';
//                                $hrsdesc = explode(':',$calendario[0]['horas']);
//                                $hrsdescontadas = $hrsdesc[0].':'.$hrsdesc[1];
//                            }

                            if ($iswend) {
                                $pdf->SetFillColor(200);
                                $pdf->Cell(7, 5, "" . utf8_decode("" . $k), 1, 0, 1, 1);
                                $calendario1 = $confCalendarioPersona->getCalendarioPersona($newformat,$newformat, $person['idpersona']);
                                if($calendario1[0]['trabajo'] == 1){
                                    $pdf->Cell(30, 5, "" . utf8_decode("" . $hentrada), 1, 0, 'C', 1);
                                    $pdf->Cell(30, 5, "" . utf8_decode("" . $hsalida), 1, 0, 'C', 1);
                                    $pdf->Cell(70, 5, "" . utf8_decode("" . $causa), 1, 0, 'C', 1);
                                    $pdf->Cell(30, 5, "" . utf8_decode("" . $hrsdescontadas), 1, 0, 'C', 1);
                                    $pdf->Cell(30, 5, "" . utf8_decode("" . $hrstrabajadas), 1, 0, 'C', 1);
                                }else{
                                    $pdf->Cell(30, 5, "" . utf8_decode(""), 1, 0, 'C', 1);
                                    $pdf->Cell(30, 5, "" . utf8_decode(""), 1, 0, 'C', 1);
                                    $pdf->Cell(70, 5, "" . utf8_decode(""), 1, 0, 'C', 1);
                                    $pdf->Cell(30, 5, "" . utf8_decode(""), 1, 0, 'C', 1);
                                    $pdf->Cell(30, 5, "" . utf8_decode(""), 1, 0, 'C', 1);
                                }

                                $pdf->Ln(5);
                                //$pdf->SetFillColor(0, 0, 0);
                                continue;
                            } else {
                                $pdf->SetFont('Arial', '', 7);
                                $pdf->Cell(7, 5, "" . utf8_decode("" . $k), 1, 0, 1, 0);
                                $pdf->Cell(30, 5, "" . utf8_decode("" . $hentrada), 1, 0, 'C', 0);
                                $pdf->Cell(30, 5, "" . utf8_decode("" . $hsalida), 1, 0, 'C', 0);
                                $pdf->Cell(70, 5, "" . utf8_decode("" . $causa), 1, 0, 'C', 0);
                                $pdf->Cell(30, 5, "" . utf8_decode("" . $hrsdescontadas), 1, 0, 'C', 0);
                                $pdf->Cell(30, 5, "" . utf8_decode("" . $hrstrabajadas), 1, 0, 'C', 0);
                            }
                            $pdf->Ln(5);
                        }
                    }
                } else {
                    $pdf->SetFont('Arial', '', 7);
                    $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
                    for ($j = 1; $j <= $cantDiasMes; $j++) {
                        $time1 = strtotime($mes . '/' . $j . '/' . $year);
                        $newformat1 = date('Y-m-d', $time1);
                        $iswend1 = $this->isWeekend($newformat1);
                        if ($iswend1) {
                            $pdf->SetFillColor(200);
                            $pdf->Cell(7, 5, $j, 1, 0, 1, 1);
                            $pdf->Cell(30, 5, "", 1, 0, 'C', 1);
                            $pdf->Cell(30, 5, "", 1, 0, 'C', 1);
                            $pdf->Cell(70, 5, "", 1, 0, 'C', 1);
                            $pdf->Cell(30, 5, "", 1, 0, 'C', 1);
                            $pdf->Cell(30, 5, "", 1, 0, 'C', 1);
                            $pdf->Ln(5);
                            continue;
                        } else {
                            $pdf->SetFont('Arial', '', 7);
                            $pdf->Cell(7, 5, $j, 1, 0, 1, 0);
                            $pdf->Cell(30, 5, "", 1, 0, 'C', 0);
                            $pdf->Cell(30, 5, "", 1, 0, 'C', 0);
                            $pdf->Cell(70, 5, "", 1, 0, 'C', 0);
                            $pdf->Cell(30, 5, "", 1, 0, 'C', 0);
                            $pdf->Cell(30, 5, "", 1, 0, 'C', 0);
                        }
                        $pdf->Ln(5);

                    }
                }
            }
        }
//        $pdf->Ln(5);
//        if($data[$person['idpersona']]){
//            $pdf->Cell(15, 5, "" . utf8_decode("FT"), 1, 0, 'C', 1);
//            $pdf->Cell(15, 5, "" . utf8_decode("TRT"), 1, 0, 'C', 1);
//            $pdf->Cell(15, 5, "" . utf8_decode("HP"), 1, 0, 'C', 1);
//            $pdf->Cell(15, 5, "" . utf8_decode("HE"), 1, 0, 'C', 1);
//            $pdf->Cell(15, 5, "" . utf8_decode("DiasLab"), 1, 0, 'C', 1);
//            $pdf->Cell(15, 5, "" . utf8_decode("DiasTrab"), 1, 0, 'C', 1);
//            $pdf->Cell(15, 5, "" . utf8_decode("HF"), 1, 0, 'C', 1);
//            $pdf->Cell(15, 5, "" . utf8_decode("HFT"), 1, 0, 'C', 1);
//            $pdf->Cell(15, 5, "" . utf8_decode("HTE"), 1, 0, 'C', 1);
//            $pdf->Cell(15, 5, "" . utf8_decode("HRL"), 1, 0, 'C', 1);
//            $pdf->Ln(5);
//            $pdf->Cell(15, 5, "" . utf8_decode("".$data[$person['idpersona']]['ft']), 1, 0, 'C', 0);
//            $pdf->Cell(15, 5, "" . utf8_decode("".$data[$person['idpersona']]['trt']), 1, 0, 'C', 0);
//            $pdf->Cell(15, 5, "" . utf8_decode("".$data[$person['idpersona']]['hp']), 1, 0, 'C', 0);
//            $pdf->Cell(15, 5, "" . utf8_decode("".$data[$person['idpersona']]['he']), 1, 0, 'C', 0);
//            $pdf->Cell(15, 5, "" . utf8_decode("".$data[$person['idpersona']]['diaslab']), 1, 0, 'C', 0);
//            $pdf->Cell(15, 5, "" . utf8_decode("".$data[$person['idpersona']]['diastrab']), 1, 0, 'C', 0);
//            $pdf->Cell(15, 5, "" . utf8_decode("".$data[$person['idpersona']]['hf']), 1, 0, 'C', 0);
//            $pdf->Cell(15, 5, "" . utf8_decode("".$data[$person['idpersona']]['hft']), 1, 0, 'C', 0);
//            $pdf->Cell(15, 5, "" . utf8_decode("".$data[$person['idpersona']]['hte']), 1, 0, 'C', 0);
//            $pdf->Cell(15, 5, "" . utf8_decode("".$data[$person['idpersona']]['hrl']), 1, 0, 'C', 0);
//        }

        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Ln(15);
//        $pdf->SetX(20);
//        $pdf->Write(10, 'Firma del Trabajador:');
//        $pdf->SetX(55);
//
//        $pdf->Write(10, '________________');
        $pdf->SetX(120);
        $pdf->Write(10, 'Firma del Jefe:');

        $pdf->SetX(145);
        $pdf->Write(10, '________________');
        $pdf->SetX(300);
        $pdf->Ln();

        return $pdf;

    }

    private function crearEncabezadoPrincipal(&$pdf, $persona, $asistencia, $fechdesde, $fechhasta, $period, $no, $configSesiones)
    {
        $pdf->SetLeftMargin(5);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetLineWidth(0);
        $x = $pdf->GetX();
        $pdf->SetX($x - 0.3);
        $pdf->Cell(187, 0, utf8_decode('Registro de asistencia'), 0, 0, 'C', 0);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(8, 0, utf8_decode('No: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(0, 0, $no, 0, 1, 'L', 0);

        $pdf->Ln(5);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(32, 5, utf8_decode('Nombre y apellidos: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(0, 5, utf8_decode($persona['nombreapellidos']), 0, 1, 'L', 0);

        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(32, 5, utf8_decode('Carné de Identidad: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(0, 5, utf8_decode($persona['noidentidad']), 0, 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 9);

        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(14, 5, utf8_decode('Entidad: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(30, 5, utf8_decode($persona['denomentidad']), 0, 1, 'L', 0);

        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(9, 5, utf8_decode('Área: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 9);
        $area = array();
        $denomestructura = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($persona['idarea']), false);
        $partes = explode('/', $denomestructura[0]['rutaId']);
        foreach ($partes as $j => $v) {
            if($v){
                 $p = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v);
                    if($p[0]->idconcepto == 5){
                        array_push($area,$p[0]->denominacion);
                    }
            }           
        }        
        if(count($area)>0)
            $denomarea = implode('->',$area);
        else
            $denomarea = '-';
       
        $pdf->Cell(0, 5, utf8_decode($denomarea), 0, 1, 'L', 0); 
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(11, 5, utf8_decode('Cargo: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(0, 5, utf8_decode($persona['denomcargo']), 0, 1, 'L', 0);

        $pdf->SetX(92);
        $pdf->Cell(186, 0, utf8_decode($period), 0, 1, 'C', 0);

        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Ln(5);
        $pdf->SetLineWidth(0);
        $pdf->SetFillColor(200);
        $pdf->SetFont('Arial', 'B', 9);

        if ($configSesiones == 1) {
            $pdf->Cell(6, 8, utf8_decode('Día'), 1, 0, 'C', 1);
            $pdf->Cell(97, 4, utf8_decode('Primera sesión'), 1, 0, 'C', 1);
            $pdf->Cell(97, 4, utf8_decode('Segunda sesión'), 1, 0, 'C', 1);
            $pdf->Ln(4);
            $pdf->SetX(11);
            $pdf->Cell(13, 4, 'Entrada', 1, 0, 'C', 1);
            $pdf->Cell(10, 4, 'Salida', 1, 0, 'C', 1);
            $pdf->Cell(47, 4, 'Causa', 1, 0, 'C', 1);
            $pdf->Cell(15, 4, 'Perdidas', 1, 0, 'C', 1);
            $pdf->Cell(12, 4, 'Trabajadas', 1, 0, 'C', 1);

            $pdf->SetX(108);
            $pdf->Cell(13, 4, 'Entrada', 1, 0, 'C', 1);
            $pdf->Cell(10, 4, 'Salida', 1, 0, 'C', 1);
            $pdf->Cell(47, 4, 'Causa', 1, 0, 'C', 1);
            $pdf->Cell(15, 4, 'Perdidas', 1, 0, 'C', 1);
            $pdf->Cell(12, 4, 'Trabajadas', 1, 0, 'C', 1);
            $pdf->Ln(4);
        } else {
            if ($asistencia[$persona['idpersona']]['otrodia'] == true) {
                $pdf->Cell(7, 5, utf8_decode('Día'), 1, 0, 'C', 1);
                $pdf->Cell(25, 5, 'Fecha entrada', 1, 0, 'C', 1);
                $pdf->Cell(25, 5, 'Hora entrada', 1, 0, 'C', 1);
                $pdf->Cell(25, 5, 'Fecha salida', 1, 0, 'C', 1);
                $pdf->Cell(25, 5, 'Hora salida', 1, 0, 'C', 1);
                $pdf->Cell(50, 5, 'Causa', 1, 0, 'C', 1);
                $pdf->Cell(20, 5, 'Perdidas', 1, 0, 'C', 1);
                $pdf->Cell(20, 5, 'Trabajadas', 1, 0, 'C', 1);
            } else {
                $pdf->Cell(7, 5, utf8_decode('Día'), 1, 0, 'C', 1);
                $pdf->Cell(30, 5, 'Entrada', 1, 0, 'C', 1);
                $pdf->Cell(30, 5, 'Salida', 1, 0, 'C', 1);
                $pdf->Cell(70, 5, 'Causa', 1, 0, 'C', 1);
                $pdf->Cell(30, 5, 'Perdidas', 1, 0, 'C', 1);
                $pdf->Cell(30, 5, 'Trabajadas', 1, 0, 'C', 1);
            }
            $pdf->Ln(5);
        }

    }

    function isWeekend($date)
    {
        return (date('N', strtotime($date)) >= 6);
    }

    private function getMes($mesnum)
    {
        if ($mesnum == 1) {
            return 'Enero';
        } else if ($mesnum == 2) {
            return 'Febrero';
        } else if ($mesnum == 3) {
            return 'Marzo';
        } else if ($mesnum == 4) {
            return 'Abril';
        } else if ($mesnum == 5) {
            return 'Mayo';
        } else if ($mesnum == 6) {
            return 'Junio';
        } else if ($mesnum == 7) {
            return 'Julio';
        } else if ($mesnum == 8) {
            return 'Agosto';
        } else if ($mesnum == 9) {
            return 'Septiembre';
        } else if ($mesnum == 10) {
            return 'Octubre';
        } else if ($mesnum == 11) {
            return 'Noviembre';
        } else if ($mesnum == 12) {
            return 'Diciembre';
        } else {
            return '';
        }
    }

}