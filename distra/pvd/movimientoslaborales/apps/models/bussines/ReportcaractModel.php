<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);


class PDFCaracterizacion extends fpdf
{
}

class ReportcaractModel extends ZendExt_Model
{
    public function ReportcaractModel()
    {
        parent::ZendExt_Model();

    }

    public function reporte($idestructura)
    {
        $pdf = new PDFCaracterizacion('L', 'mm', 'a3');
        $fechaactual = date('Y/m/d');
        $annoactu = split('/', $fechaactual);
        $annoactual=$annoactu[0];
        if ($idestructura) {
            $pdfNGeneral = $this->crearCuerpo($pdf, $idestructura, $annoactual);
            $pdfNGeneral = $this->crearCuerpoWoman($pdf, $idestructura, $annoactual);
        } else {
            $pdfNGeneral = $this->crearEncabezado($pdf, '');
        }

        $pdfNGeneral->Output();
    }

    private function crearEncabezado($pdf, $annoactual)
    {
        $pdf->SetLeftMargin(15);
        $pdf->AddPage();
        $pdf->SetFont('Times', 'B', 15);
        $pdf->Cell(
            540, 10, utf8_decode('CARACTERIZACION FUERZA DE TRABAJO 1ER TRIMESTRE DEL ' . $annoactual), 0, 0, 'C', 0
        );
        $pdf->Ln(15);
        $pdf->SetFont('Times', 'B', 10);
        $pdf->SetX(91);
        $pdf->Ln(5);
        $pdf->Cell(116, 31, "Unidades organizativas", 1, 0, 'C');

        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(16, 31, "Total", 1, 0, 'C');

        $pdf->SetX(147);
        $pdf->Cell(25, 12, utf8_decode("Integración"), 'LTR', 0, 'C');
        $pdf->Ln(5);
        $pdf->SetX(147);
        $pdf->Cell(25, 12, utf8_decode(" Política"), 'BR', 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Ln(12);
        $pdf->SetX(147);
        $pdf->Cell(12, 14, "PCC", 1, 'C');
        $pdf->Cell(13, 14, "UJC", 1, 0, 'C');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->SetY(30);
        $pdf->SetX(172);
        $pdf->Cell(80, 13, utf8_decode("Categoría Ocupacional"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Ln(13);
        $pdf->SetX(172);
        $pdf->Cell(12, 18, utf8_decode("O"), 1, 0, 'C');
        $pdf->Cell(12, 18, utf8_decode("S"), 1, 0, 'C');
        $pdf->Cell(12, 18, utf8_decode("T"), 1, 0, 'C');
        $pdf->Cell(12, 18, utf8_decode("A"), 1, 0, 'C');
        $pdf->SetY(43);
        $pdf->SetX(220);
        $pdf->Cell(32, 10, utf8_decode("Cuadros"), 1, 0, 'C');
        $pdf->Ln(10);
        $pdf->SetX(220);
        $pdf->Cell(10, 8, utf8_decode("DS"), 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(10, 8, utf8_decode("Dir"), 1, 0, 'C');
        $pdf->SetX(240);
        $pdf->Cell(12, 8, utf8_decode("Ejec"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->SetY(30);
        $pdf->SetX(252);
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(96, 13, utf8_decode("Grado Escolaridad"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Ln(13);
        $pdf->SetX(252);
        $pdf->Cell(18, 18, utf8_decode("Primaria"), 1, 0, 'C');
        $pdf->Cell(21, 18, utf8_decode("9no Grado"), 1, 0, 'C');

        $pdf->Cell(21, 18, utf8_decode("Medio Sub"), 1, 0, 'C');
        $pdf->Cell(23, 18, utf8_decode("Técnico Med"), 1, 0, 'C');
        $pdf->Cell(13, 18, utf8_decode("Univ"), 1, 0, 'C');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->SetY(30);
        $pdf->SetX(348);
        $pdf->Cell(33, 13, utf8_decode("Color de piel"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Ln(13);
        $pdf->SetX(348);
        $pdf->Cell(11, 18, utf8_decode("B"), 1, 0, 'C');
        $pdf->Cell(11, 18, utf8_decode("N"), 1, 0, 'C');
        $pdf->Cell(11, 18, utf8_decode("M"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->SetY(30);
        $pdf->SetX(381);
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(128, 13, utf8_decode("Rango de edades"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Ln(13);
        $pdf->SetX(381);
        $pdf->Cell(26, 18, utf8_decode("Hasta 30 años"), 1, 0, 'C');
        $pdf->Cell(26, 18, utf8_decode("Entre  31 y 35"), 1, 0, 'C');
        $pdf->Cell(26, 18, utf8_decode("Entre 36 y 45"), 1, 0, 'C');
        $pdf->Cell(25, 18, utf8_decode("Entre 45 y 55"), 1, 0, 'C');
        $pdf->Cell(25, 18, utf8_decode("Más de 56"), 1, 1, 'C');

        return $pdf;
    }


    private function crearCuerpo($pdf, $idestructura, $annoactual)
    {

        $datos = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructura);
        $this->crearEncabezado($pdf, $annoactual);
        $pcc = 0;
        $ujc = 0;
        $oper = 0;
        $ser = 0;
        $tecn = 0;
        $adm = 0;
        $dir = 0;
        $dirig = 0;
        $perUno = 0;
        $perDos = 0;
        $perTres = 0;
        $perCuatro = 0;
        $perCinco = 0;
        $primaria = 0;
        $noveno = 0;
        $mediosup = 0;
        $tecmedio = 0;
        $univ = 0;
        $blanca = 0;
        $negra = 0;
        $mest = 0;


        //---datos padre--///
        $res = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);

        if ($res[0]->idtipo != 7) {
            $pdf->Cell(116, 14, utf8_decode($res[0]->denominacion), 1, 0);
            $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);
            $arracargos = $this->getIdCargos($cargo);
            $datoscargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($arracargos);

            foreach ($datoscargo as $dat) {
                //Categoria ocupacional
                if ($dat['cantidadreal'] != 0) {
                    if ($dat['grupocategoria'] == 'NINGUNO') {
                        if ($dat['idcategoria'] == 1) { //'OPERARIO'
                            $oper++;
                        } else if ($dat['idcategoria'] == 4) { //'Técnico'
                            $tecn++;
                        } else if ($dat['idcategoria'] == 3) { //'Servicio'
                            $ser++;
                        } else if ($dat['idcategoria'] == 2) { //'Administrativo'
                            $adm++;
                        }

                    } else {
                        if ($dat['idcategoria'] == 6) { // 'Director'
                            $dir++;
                        } elseif ($dat['idcategoria'] == 5) { // 'Dirigente'
                            $dirig++;
                        }

                    }
                }

            }
            if ($res[0]->idtipo != 7) {
                if ($res[0]->idtipo = 3) {
                    $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(
                        null, null, null, null, $idestructura, null, null, 0, 0, 0, 0
                    ); //identidad
                } else {
                    $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(
                        null, null, null, null, null, null, $idestructura, 0, 0, 0, 0
                    );
                }
            }
            // print_r($persona->data);die;
            // print_r($persona->quantity);die;
            if ($persona->quantity != 0) {
                foreach ($persona->data as $k => $p) {
                   // print_r($p);
                    if ($p['preparacion'] == 'NIVEL SUPERIOR') {
                        $univ++;
                    } else if ($p['preparacion'] == 'Primaria') {
                        $primaria++;

                    } else if ($p['preparacion'] == 'Secundaria') {
                        $noveno++;

                    } else if ($p['preparacion'] == 'Preuniversitaria') {
                        $mediosup++;

                    } else if ($p['preparacion'] == 'Educación técnica profesional') {
                        $tecmedio++;
                    }
                    $fechanac = $p['fechanacimiento'];

                    if ($fechanac) {
                        $fecha = str_replace("/", "-", $fechanac);
                        $fecha = date('Y/m/d', strtotime($fecha));
                        $hoy = date('Y/m/d');
                        $edad = $hoy - $fecha;

                        if ($edad <= 30) {
                            $perUno++;
                        } else if ($edad >= 31 && $edad <= 35) {
                            $perDos++;
                        } else if ($edad >= 36 && $edad <= 45) {
                            $perTres++;
                        } else if ($edad >= 45 && $edad <= 55) {
                            $perCuatro++;
                        } else if ($edad >= 46) {
                            $perCinco++;
                        }
                    }
                    $color = ZendExt_IoC::getInstance()->pvd->getDatosFenotipicosPersona(array($p['idpersona']));
                    if ($color[0]['idcolorpiel'] == 1) {
                        $blanca++;
                    } elseif ($color[0]['idcolorpiel'] == 2) {
                        $negra++;
                    } elseif ($color[0]['idcolorpiel'] == 4) {
                        $mest++;
                    }

                    $afiliacion = ZendExt_IoC::getInstance()->pvd->getDatosAfiliacionPersona(array($p['idpersona']));
                    if ($afiliacion[0]['idorganizacion'] == 4) {
                        $ujc++;
                    } elseif ($afiliacion[0]['idorganizacion'] == 3) {
                        $pcc++;
                    }
                }
            }
            //integracion politica
            $pdf->Cell(16, 14, $persona->quantity, 1, 0, 'C'); //total
            $pdf->Cell(12, 14, $pcc, 1, 0, 'C');
            $pdf->Cell(13, 14, $ujc, 1, 0, 'C');

            //Categoria ocupacional
            $pdf->Cell(12, 14, $oper, 1, 0, 'C');
            $pdf->Cell(12, 14, $ser, 1, 0, 'C');
            $pdf->Cell(12, 14, $tecn, 1, 0, 'C');
            $pdf->Cell(12, 14, $adm, 1, 0, 'C');

            $pdf->Cell(10, 14, $dirig, 1, 0, 'C'); //ds
            $pdf->Cell(10, 14, $dir, 1, 0, 'C'); //dir
            $pdf->Cell(12, 14, '', 1, 0, 'C'); //ejec

            //Grado escolar
            $pdf->Cell(18, 14, $primaria, 1, 0, 'C');
            $pdf->Cell(21, 14, $noveno, 1, 0, 'C');
            $pdf->Cell(21, 14, $mediosup, 1, 0, 'C');
            $pdf->Cell(23, 14, $tecmedio, 1, 0, 'C');
            $pdf->Cell(13, 14, $univ, 1, 0, 'C');

            //Color de piel
            $pdf->Cell(11, 14, $blanca, 1, 0, 'C');
            $pdf->Cell(11, 14, $negra, 1, 0, 'C');
            $pdf->Cell(11, 14, $mest, 1, 0, 'C');

            //Edades
            $pdf->Cell(26, 14, $perUno, 1, 0, 'C');
            $pdf->Cell(26, 14, $perDos, 1, 0, 'C');
            $pdf->Cell(26, 14, $perTres, 1, 0, 'C');
            $pdf->Cell(25, 14, $perCuatro, 1, 0, 'C');
            $pdf->Cell(25, 14, $perCinco, 1, 1, 'C');

        }
        //---datos padre---
        foreach ($datos as $val) {
            $res = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val->id);
            if ($res[0]->idtipo != 7) {
                $pdf->Cell(116, 14, utf8_decode($res[0]->denominacion), 1, 0);
                $idestructura = $res[0]->idestructura;
                $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);
                $arracargos = $this->getIdCargos($cargo);
                $datoscargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($arracargos);

                foreach ($datoscargo as $dat) {
                    if ($dat['cantidadreal'] != 0) { //die('si');
                        if ($dat['grupocategoria'] == 'NINGUNO') {
                            if ($dat['idcategoria'] == 1) { //'OPERARIO'
                                $oper++;
                            } else if ($dat['idcategoria'] == 4) { //'Técnico'
                                $tecn++;
                            } else if ($dat['idcategoria'] == 3) { //'Servicio'
                                $ser++;
                            } else if ($dat['idcategoria'] == 2) { //'Administrativo'
                                $adm++;
                            }

                        } else {
                            if ($dat['idcategoria'] == 6) { // 'Director'
                                $dir++;
                            } elseif ($dat['idcategoria'] == 5) { // 'Dirigente'
                                $dirig++;
                            }

                        }
                    }

                }
                if ($res[0]->idtipo != 7) {
                    if ($res[0]->idtipo == 3) {
                        $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(
                            null, null, null, null, $idestructura, null, null, 0, 0, 0, 0
                        ); //identidad
                    } else {
                        $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(
                            null, null, null, null, null, null, $idestructura, 0, 0, 0, 0
                        );
                    }
                }

//print_r($persona->data);die;
                // print_r($persona->quantity);die;
                if ($persona->quantity != 0) {
                    foreach ($persona->data as $k => $p) {
                        if ($p['preparacion'] == 'NIVEL SUPERIOR') {
                            $univ++;
                        } else if ($p['preparacion'] == 'Primaria') {
                            $primaria++;

                        } else if ($p['preparacion'] == 'Secundaria') {
                            $noveno++;

                        } else if ($p['preparacion'] == 'Preuniversitaria') {
                            $mediosup++;

                        } else if ($p['preparacion'] == 'Educación técnica profesional') {
                            $tecmedio++;
                        }
                        // print_r($univ);die;
                        $fechanac = $p['fechanacimiento'];

                        // print_r($edad);die;
                        if ($fechanac) {
                            $fecha = str_replace("/", "-", $fechanac);
                            $fecha = date('Y/m/d', strtotime($fecha));
                            $hoy = date('Y/m/d');
                            $edad = $hoy - $fecha;

                            if ($edad <= 30) {
                                $perUno++;
                            } else if ($edad >= 31 && $edad <= 35) {
                                $perDos++;
                            } else if ($edad >= 36 && $edad <= 45) {
                                $perTres++;
                            } else if ($edad >= 45 && $edad <= 55) {
                                $perCuatro++;
                            } else if ($edad >= 46) {
                                $perCinco++;
                            }
                        }
                        $color = ZendExt_IoC::getInstance()->pvd->getDatosFenotipicosPersona(array($p['idpersona']));
                        if ($color[0]['idcolorpiel'] == 1) {
                            $blanca++;
                        } elseif ($color[0]['idcolorpiel'] == 2) {
                            $negra++;
                        } elseif ($color[0]['idcolorpiel'] == 4) {
                            $mest++;
                        }

                        $afiliacion = ZendExt_IoC::getInstance()->pvd->getDatosAfiliacionPersona(
                            array($p['idpersona'])
                        );
                        if ($afiliacion[0]['idorganizacion'] == 4) {
                            $ujc++;
                        } elseif ($afiliacion[0]['idorganizacion'] == 3) {
                            $pcc++;
                        }
                    }
                }
                //integracion politica
                $pdf->Cell(16, 14, $persona->quantity, 1, 0, 'C'); //total
                $pdf->Cell(12, 14, $pcc, 1, 0, 'C');
                $pdf->Cell(13, 14, $ujc, 1, 0, 'C');

                //Categoria ocupacional
                //print_r($tecn);die;
                $pdf->Cell(12, 14, $oper, 1, 0, 'C');
                $pdf->Cell(12, 14, $ser, 1, 0, 'C');
                $pdf->Cell(12, 14, $tecn, 1, 0, 'C');
                $pdf->Cell(12, 14, $adm, 1, 0, 'C');

                $pdf->Cell(10, 14, $dirig, 1, 0, 'C'); //ds
                $pdf->Cell(10, 14, $dir, 1, 0, 'C'); //dir
                $pdf->Cell(12, 14, '', 1, 0, 'C'); //ejec

                //Grado escolar
                $pdf->Cell(18, 14, $primaria, 1, 0, 'C');
                $pdf->Cell(21, 14, $noveno, 1, 0, 'C');
                $pdf->Cell(21, 14, $mediosup, 1, 0, 'C');
                $pdf->Cell(23, 14, $tecmedio, 1, 0, 'C');
                $pdf->Cell(13, 14, $univ, 1, 0, 'C');

                //Color de piel
                $pdf->Cell(11, 14, $blanca, 1, 0, 'C');
                $pdf->Cell(11, 14, $negra, 1, 0, 'C');
                $pdf->Cell(11, 14, $mest, 1, 0, 'C');

                //Edades
                $pdf->Cell(26, 14, $perUno, 1, 0, 'C');
                $pdf->Cell(26, 14, $perDos, 1, 0, 'C');
                $pdf->Cell(26, 14, $perTres, 1, 0, 'C');
                $pdf->Cell(25, 14, $perCuatro, 1, 0, 'C');
                $pdf->Cell(25, 14, $perCinco, 1, 1, 'C');

            }

            $hijos = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($val->id);
            if (count($hijos) != 0) {
                foreach ($hijos as $hij) {
                    $res = ZendExt_IoC::getInstance()->metadatos->DameEstructura($hij->id);
                    $idestructura = $res[0]->idestructura;
                    if ($res[0]->idtipo != 7) {
                        $pdf->Cell(116, 14, utf8_decode($res[0]->denominacion), 1, 0);

                        $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);
                        $arracargos = $this->getIdCargos($cargo);
                        $datoscargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($arracargos);
                        foreach ($datoscargo as $dat) {
                            //Categoria ocupacional
                            if ($dat['cantidadreal'] != 0) { //die('si');
                                if ($dat['grupocategoria'] == 'NINGUNO') {
                                    if ($dat['idcategoria'] == 1) { //'OPERARIO'
                                        $oper++;
                                    } else if ($dat['idcategoria'] == 4) { //'Técnico'
                                        $tecn++;
                                    } else if ($dat['idcategoria'] == 3) { //'Servicio'
                                        $ser++;
                                    } else if ($dat['idcategoria'] == 2) { //'Administrativo'
                                        $adm++;
                                    }
                                } else {
                                    if ($dat['idcategoria'] == 6) { // 'Director'
                                        $dir++;
                                    } elseif ($dat['idcategoria'] == 5) { // 'Dirigente'
                                        $dirig++;
                                    }

                                }
                            }

                        }
                        if ($res[0]->idtipo != 7) {
                            if ($res[0]->idtipo = 3) {
                                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(
                                    null, null, null, null, $idestructura, null, null, 0, 0, 0, 0
                                ); //identidad
                            } else {
                                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(
                                    null, null, null, null, null, null, $idestructura, 0, 0, 0, 0
                                );
                            }
                        }

//print_r($persona->data);die;

                        // print_r($persona->quantity);die;
                        if ($persona->quantity != 0) {
                            foreach ($persona->data as $k => $p) {
                                if ($p['preparacion'] == 'NIVEL SUPERIOR') {
                                    $univ++;
                                } else if ($p['preparacion'] == 'Primaria') {
                                    $primaria++;

                                } else if ($p['preparacion'] == 'Secundaria') {
                                    $noveno++;

                                } else if ($p['preparacion'] == 'Preuniversitaria') {
                                    $mediosup++;

                                } else if ($p['preparacion'] == 'Educación técnica profesional') {
                                    $tecmedio++;
                                }
                                // print_r($univ);die;
                                $fechanac = $p['fechanacimiento'];

                                // print_r($edad);die;
                                if ($fechanac) {
                                    $fecha = str_replace("/", "-", $fechanac);
                                    $fecha = date('Y/m/d', strtotime($fecha));
                                    $hoy = date('Y/m/d');
                                    $edad = $hoy - $fecha;

                                    if ($edad <= 30) {
                                        $perUno++;
                                    } else if ($edad >= 31 && $edad <= 35) {
                                        $perDos++;
                                    } else if ($edad >= 36 && $edad <= 45) {
                                        $perTres++;
                                    } else if ($edad >= 45 && $edad <= 55) {
                                        $perCuatro++;
                                    } else if ($edad >= 46) {
                                        $perCinco++;
                                    }
                                }
                                $color = ZendExt_IoC::getInstance()->pvd->getDatosFenotipicosPersona(
                                    array($p['idpersona'])
                                );
                                if ($color[0]['idcolorpiel'] == 1) {
                                    $blanca++;
                                } elseif ($color[0]['idcolorpiel'] == 2) {
                                    $negra++;
                                } elseif ($color[0]['idcolorpiel'] == 4) {
                                    $mest++;
                                }

                                $afiliacion = ZendExt_IoC::getInstance()->pvd->getDatosAfiliacionPersona(
                                    array($p['idpersona'])
                                );
                                if ($afiliacion[0]['idorganizacion'] == 4) {
                                    $ujc++;
                                } elseif ($afiliacion[0]['idorganizacion'] == 3) {
                                    $pcc++;
                                }
                            }
                        }
                        //integracion politica
                        $pdf->Cell(16, 14, 555, 1, 0, 'C'); //total
                        $pdf->Cell(12, 14, $pcc, 1, 0, 'C');
                        $pdf->Cell(13, 14, $ujc, 1, 0, 'C');

                        //Categoria ocupacional
                        //print_r($tecn);die;
                        $pdf->Cell(12, 14, $oper, 1, 0, 'C');
                        $pdf->Cell(12, 14, $ser, 1, 0, 'C');
                        $pdf->Cell(12, 14, $tecn, 1, 0, 'C');
                        $pdf->Cell(12, 14, $adm, 1, 0, 'C');

                        $pdf->Cell(10, 14, $dirig, 1, 0, 'C'); //ds
                        $pdf->Cell(10, 14, $dir, 1, 0, 'C'); //dir
                        $pdf->Cell(12, 14, '', 1, 0, 'C'); //ejec

                        //Grado escolar
                        $pdf->Cell(18, 14, $primaria, 1, 0, 'C');
                        $pdf->Cell(21, 14, $noveno, 1, 0, 'C');
                        $pdf->Cell(21, 14, $mediosup, 1, 0, 'C');
                        $pdf->Cell(23, 14, $tecmedio, 1, 0, 'C');
                        $pdf->Cell(13, 14, $univ, 1, 0, 'C');

                        //Color de piel
                        $pdf->Cell(11, 14, $blanca, 1, 0, 'C');
                        $pdf->Cell(11, 14, $negra, 1, 0, 'C');
                        $pdf->Cell(11, 14, $mest, 1, 0, 'C');

                        //Edades
                        $pdf->Cell(26, 14, $perUno, 1, 0, 'C');
                        $pdf->Cell(26, 14, $perDos, 1, 0, 'C');
                        $pdf->Cell(26, 14, $perTres, 1, 0, 'C');
                        $pdf->Cell(25, 14, $perCuatro, 1, 0, 'C');
                        $pdf->Cell(25, 14, $perCinco, 1, 1, 'C');

                    } //tipo !7

                }
            }
        }
        return $pdf;
    }

    private function crearCuerpoWoman($pdf, $idestructura, $annoactual)
    {
        $pdf->SetLeftMargin(15);
        $pdf->AddPage();
        $pdf->SetFont('Times', 'B', 15);
        $pdf->Cell(
            500, 10, utf8_decode('CARACTERIZACION FUERZA DE TRABAJO 1ER TRIMESTRE DEL '.$annoactual), 0, 1, 'C', 0
        );
        $pdf->Cell(500, 10, 'MUJERES', 0, 1, 'C', 0);
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(116, 31, "Unidades organizativas", 1, 0, 'C');

        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(16, 31, "Total", 1, 0, 'C');

        $pdf->SetX(147);
        $pdf->Cell(25, 12, utf8_decode("Integración"), 'LTR', 0, 'C');
        $pdf->Ln(5);
        $pdf->SetX(147);
        $pdf->Cell(25, 12, utf8_decode(" Política"), 'BR', 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Ln(12);
        $pdf->SetX(147);
        $pdf->Cell(12, 14, "PCC", 1, 'C');
        $pdf->Cell(13, 14, "UJC", 1, 0, 'C');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->SetY(30);
        $pdf->SetX(172);
        $pdf->Cell(80, 13, utf8_decode("Categoría Ocupacional"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Ln(13);
        $pdf->SetX(172);
        $pdf->Cell(12, 18, utf8_decode("O"), 1, 0, 'C');
        $pdf->Cell(12, 18, utf8_decode("S"), 1, 0, 'C');
        $pdf->Cell(12, 18, utf8_decode("T"), 1, 0, 'C');
        $pdf->Cell(12, 18, utf8_decode("A"), 1, 0, 'C');
        $pdf->SetY(43);
        $pdf->SetX(220);
        $pdf->Cell(32, 10, utf8_decode("Cuadros"), 1, 0, 'C');
        $pdf->Ln(10);
        $pdf->SetX(220);
        $pdf->Cell(10, 8, utf8_decode("DS"), 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(10, 8, utf8_decode("Dir"), 1, 0);
        $pdf->SetX(240);
        $pdf->Cell(12, 8, utf8_decode("Ejec"), 1, 0);
        $pdf->SetFont('Times', '', 10);
        $pdf->SetY(30);
        $pdf->SetX(252);
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(96, 13, utf8_decode("Grado Escolaridad"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Ln(13);
        $pdf->SetX(252);
        $pdf->Cell(18, 18, utf8_decode("Primaria"), 1, 0);
        $pdf->Cell(21, 18, utf8_decode("9no Grado"), 1, 0);
        $pdf->Cell(21, 18, utf8_decode("Medio Sub"), 1, 0);
        $pdf->Cell(23, 18, utf8_decode("Técnico Med"), 1, 0);
        $pdf->Cell(13, 18, utf8_decode("Univ"), 1, 0);
        $pdf->SetFont('Times', 'B', 10);
        $pdf->SetY(30);
        $pdf->SetX(348);
        $pdf->Cell(33, 13, utf8_decode("Color de piel"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Ln(13);
        $pdf->SetX(348);
        $pdf->Cell(11, 18, utf8_decode("B"), 1, 0, 'C');
        $pdf->Cell(11, 18, utf8_decode("N"), 1, 0, 'C');
        $pdf->Cell(11, 18, utf8_decode("M"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->SetY(30);
        $pdf->SetX(381);
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(128, 13, utf8_decode("Rango de edades"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Ln(13);
        $pdf->SetX(381);
        $pdf->Cell(26, 18, utf8_decode("Hasta 30 años"), 1, 0, 'C');
        $pdf->Cell(26, 18, utf8_decode("Entre  31 y 35"), 1, 0, 'C');
        $pdf->Cell(26, 18, utf8_decode("Entre 36 y 45"), 1, 0, 'C');
        $pdf->Cell(25, 18, utf8_decode("Entre 45 y 55"), 1, 0, 'C');
        $pdf->Cell(25, 18, utf8_decode("Más de 56"), 1, 1, 'C');
        $datos = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructura);

        $pcc = 0;
        $ujc = 0;
        $oper = 0;
        $ser = 0;
        $tecn = 0;
        $adm = 0;
        $dir = 0;
        $dirig = 0;
        $perUno = 0;
        $perDos = 0;
        $perTres = 0;
        $perCuatro = 0;
        $perCinco = 0;
        $primaria = 0;
        $noveno = 0;
        $mediosup = 0;
        $tecmedio = 0;
        $univ = 0;
        $blanca = 0;
        $negra = 0;
        $mest = 0;
        $fem = 0;
        //---datos padre--///
        $res = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        if ($res[0]->idtipo != 7) {
            $pdf->Cell(116, 14, utf8_decode($res[0]->denominacion), 1, 0);
            $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);
            $arracargos = $this->getIdCargos($cargo);
            $datoscargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($arracargos);

            foreach ($datoscargo as $dat) {
                //Categoria ocupacional
                if ($dat['cantidadreal'] != 0) {
                    $sexo = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(
                        null, null, null, null, null, array($dat['idcargo']), null, 0, 0, 0, 0
                    );
                    if ($sexo->data[0]['sexo'] == 0) {
                        if ($dat['grupocategoria'] == 'NINGUNO') {
                            if ($dat['idcategoria'] == 1) { //'OPERARIO'
                                $oper++;
                            } else if ($dat['idcategoria'] == 4) { //'Técnico'
                                $tecn++;
                            } else if ($dat['idcategoria'] == 3) { //'Servicio'
                                $ser++;
                            } else if ($dat['idcategoria'] == 2) { //'Administrativo'
                                $adm++;
                            }

                        } else {
                            if ($dat['idcategoria'] == 6) { // 'Director'
                                $dir++;
                            } elseif ($dat['idcategoria'] == 5) { // 'Dirigente'
                                $dirig++;
                            }

                        }
                    }

                }

            }
            if ($res[0]->idtipo != 7) {
                if ($res[0]->idtipo = 3) {
                    $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(
                        null, null, null, null, $idestructura, null, null, 0, 0, 0, 0
                    ); //identidad
                } else {
                    $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(
                        null, null, null, null, null, null, $idestructura, 0, 0, 0, 0
                    );
                }
            }
            if ($persona->quantity != 0) {
                foreach ($persona->data as $k => $p) {
                    // print_r($p);die;
                    if ($p['sexo'] == 0) {
                        if ($p['preparacion'] == 'NIVEL SUPERIOR') {
                            $univ++;
                        } else if ($p['preparacion'] == 'Primaria') {
                            $primaria++;

                        } else if ($p['preparacion'] == 'Secundaria') {
                            $noveno++;

                        } else if ($p['preparacion'] == 'Preuniversitaria') {
                            $mediosup++;

                        } else if ($p['preparacion'] == 'Educación técnica profesional') {
                            $tecmedio++;
                        }
                        $fem++;
                        $fechanac = $p['fechanacimiento'];

                        if ($fechanac) {
                            $fecha = str_replace("/", "-", $fechanac);
                            $fecha = date('Y/m/d', strtotime($fecha));
                            $hoy = date('Y/m/d');
                            $edad = $hoy - $fecha;

                            if ($edad <= 30) {
                                $perUno++;
                            } else if ($edad >= 31 && $edad <= 35) {
                                $perDos++;
                            } else if ($edad >= 36 && $edad <= 45) {
                                $perTres++;
                            } else if ($edad >= 45 && $edad <= 55) {
                                $perCuatro++;
                            } else if ($edad >= 46) {
                                $perCinco++;
                            }
                        }
                        $color = ZendExt_IoC::getInstance()->pvd->getDatosFenotipicosPersona(array($p['idpersona']));
                        if ($color[0]['idcolorpiel'] == 1) {
                            $blanca++;
                        } elseif ($color[0]['idcolorpiel'] == 2) {
                            $negra++;
                        } elseif ($color[0]['idcolorpiel'] == 4) {
                            $mest++;
                        }

                        $afiliacion = ZendExt_IoC::getInstance()->pvd->getDatosAfiliacionPersona(
                            array($p['idpersona'])
                        );
                        if ($afiliacion[0]['idorganizacion'] == 4) {
                            $ujc++;
                        } elseif ($afiliacion[0]['idorganizacion'] == 3) {
                            $pcc++;
                        }
                    }

                }
            }
            //integracion politica
            $pdf->Cell(16, 14, $fem, 1, 0, 'C'); //total
            $pdf->Cell(12, 14, $pcc, 1, 0, 'C');
            $pdf->Cell(13, 14, $ujc, 1, 0, 'C');

            //Categoria ocupacional
            $pdf->Cell(12, 14, $oper, 1, 0, 'C');
            $pdf->Cell(12, 14, $ser, 1, 0, 'C');
            $pdf->Cell(12, 14, $tecn, 1, 0, 'C');
            $pdf->Cell(12, 14, $adm, 1, 0, 'C');

            $pdf->Cell(10, 14, $dirig, 1, 0, 'C'); //ds
            $pdf->Cell(10, 14, $dir, 1, 0, 'C'); //dir
            $pdf->Cell(12, 14, '', 1, 0, 'C'); //ejec

            //Grado escolar
            $pdf->Cell(18, 14, $primaria, 1, 0, 'C');
            $pdf->Cell(21, 14, $noveno, 1, 0, 'C');
            $pdf->Cell(21, 14, $mediosup, 1, 0, 'C');
            $pdf->Cell(23, 14, $tecmedio, 1, 0, 'C');
            $pdf->Cell(13, 14, $univ, 1, 0, 'C');

            //Color de piel
            $pdf->Cell(11, 14, $blanca, 1, 0, 'C');
            $pdf->Cell(11, 14, $negra, 1, 0, 'C');
            $pdf->Cell(11, 14, $mest, 1, 0, 'C');

            //Edades
            $pdf->Cell(26, 14, $perUno, 1, 0, 'C');
            $pdf->Cell(26, 14, $perDos, 1, 0, 'C');
            $pdf->Cell(26, 14, $perTres, 1, 0, 'C');
            $pdf->Cell(25, 14, $perCuatro, 1, 0, 'C');
            $pdf->Cell(25, 14, $perCinco, 1, 1, 'C');

        }
        //---datos padre---
        foreach ($datos as $val) {
            $res = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val->id);
            if ($res[0]->idtipo != 7) {
                $pdf->Cell(116, 14, utf8_decode($res[0]->denominacion), 1, 0);
                $idestructura = $res[0]->idestructura;
                $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);
                $arracargos = $this->getIdCargos($cargo);
                $datoscargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($arracargos);

                foreach ($datoscargo as $dat) {
                    //Categoria ocupacional
                    if ($dat['cantidadreal'] != 0) { //die('si');
                        if ($dat['grupocategoria'] == 'NINGUNO') {
                            if ($dat['idcategoria'] == 1) { //'OPERARIO'
                                $oper++;
                            } else if ($dat['idcategoria'] == 4) { //'Técnico'
                                $tecn++;
                            } else if ($dat['idcategoria'] == 3) { //'Servicio'
                                $ser++;
                            } else if ($dat['idcategoria'] == 2) { //'Administrativo'
                                $adm++;
                            }

                        } else {
                            if ($dat['idcategoria'] == 6) { // 'Director'
                                $dir++;
                            } elseif ($dat['idcategoria'] == 5) { // 'Dirigente'
                                $dirig++;
                            }

                        }
                    }

                }
                if ($res[0]->idtipo != 7) {
                    if ($res[0]->idtipo = 3) {
                        $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(
                            null, null, null, null, $idestructura, null, null, 0, 0, 0, 0
                        ); //identidad
                    } else {
                        $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(
                            null, null, null, null, null, null, $idestructura, 0, 0, 0, 0
                        );
                    }
                }
                if ($persona->quantity != 0) {
                    foreach ($persona->data as $k => $p) {
                        if ($p['sexo'] == 0) {
                            if ($p['preparacion'] == 'NIVEL SUPERIOR') {
                                $univ++;
                            } else if ($p['preparacion'] == 'Primaria') {
                                $primaria++;

                            } else if ($p['preparacion'] == 'Secundaria') {
                                $noveno++;

                            } else if ($p['preparacion'] == 'Preuniversitaria') {
                                $mediosup++;

                            } else if ($p['preparacion'] == 'Educación técnica profesional') {
                                $tecmedio++;
                            }
                            $fechanac = $p['fechanacimiento'];
                            if ($fechanac) {
                                $fecha = str_replace("/", "-", $fechanac);
                                $fecha = date('Y/m/d', strtotime($fecha));
                                $hoy = date('Y/m/d');
                                $edad = $hoy - $fecha;
                                if ($edad <= 30) {
                                    $perUno++;
                                } else if ($edad >= 31 && $edad <= 35) {
                                    $perDos++;
                                } else if ($edad >= 36 && $edad <= 45) {
                                    $perTres++;
                                } else if ($edad >= 45 && $edad <= 55) {
                                    $perCuatro++;
                                } else if ($edad >= 46) {
                                    $perCinco++;
                                }
                            }
                            $color = ZendExt_IoC::getInstance()->pvd->getDatosFenotipicosPersona(
                                array($p['idpersona'])
                            );
                            if ($color[0]['idcolorpiel'] == 1) {
                                $blanca++;
                            } elseif ($color[0]['idcolorpiel'] == 2) {
                                $negra++;
                            } elseif ($color[0]['idcolorpiel'] == 4) {
                                $mest++;
                            }

                            $afiliacion = ZendExt_IoC::getInstance()->pvd->getDatosAfiliacionPersona(
                                array($p['idpersona'])
                            );
                            if ($afiliacion[0]['idorganizacion'] == 4) {
                                $ujc++;
                            } elseif ($afiliacion[0]['idorganizacion'] == 3) {
                                $pcc++;
                            }
                        }

                    }
                }
                //integracion politica
                $pdf->Cell(16, 14, $persona->quantity, 1, 0, 'C'); //total
                $pdf->Cell(12, 14, $pcc, 1, 0, 'C');
                $pdf->Cell(13, 14, $ujc, 1, 0, 'C');

                //Categoria ocupacional
                $pdf->Cell(12, 14, $oper, 1, 0, 'C');
                $pdf->Cell(12, 14, $ser, 1, 0, 'C');
                $pdf->Cell(12, 14, $tecn, 1, 0, 'C');
                $pdf->Cell(12, 14, $adm, 1, 0, 'C');

                $pdf->Cell(10, 14, $dirig, 1, 0, 'C'); //ds
                $pdf->Cell(10, 14, $dir, 1, 0, 'C'); //dir
                $pdf->Cell(12, 14, '', 1, 0, 'C'); //ejec

                //Grado escolar
                $pdf->Cell(18, 14, $primaria, 1, 0, 'C');
                $pdf->Cell(21, 14, $noveno, 1, 0, 'C');
                $pdf->Cell(21, 14, $mediosup, 1, 0, 'C');
                $pdf->Cell(23, 14, $tecmedio, 1, 0, 'C');
                $pdf->Cell(13, 14, $univ, 1, 0, 'C');

                //Color de piel
                $pdf->Cell(11, 14, $blanca, 1, 0, 'C');
                $pdf->Cell(11, 14, $negra, 1, 0, 'C');
                $pdf->Cell(11, 14, $mest, 1, 0, 'C');

                //Edades
                $pdf->Cell(26, 14, $perUno, 1, 0, 'C');
                $pdf->Cell(26, 14, $perDos, 1, 0, 'C');
                $pdf->Cell(26, 14, $perTres, 1, 0, 'C');
                $pdf->Cell(25, 14, $perCuatro, 1, 0, 'C');
                $pdf->Cell(25, 14, $perCinco, 1, 1, 'C');

            }

            $hijos = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($val->id);
            if (count($hijos) != 0) {
                foreach ($hijos as $hij) {
                    $res = ZendExt_IoC::getInstance()->metadatos->DameEstructura($hij->id);
                    $idestructura = $res[0]->idestructura;
                    if ($res[0]->idtipo != 7) {
                        $pdf->Cell(116, 14, utf8_decode($res[0]->denominacion), 1, 0);
                        $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);
                        $arracargos = $this->getIdCargos($cargo);
                        $datoscargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($arracargos);
                        foreach ($datoscargo as $dat) {
                            if ($dat['cantidadreal'] != 0) { //die('si');
                                if ($dat['grupocategoria'] == 'NINGUNO') {
                                    if ($dat['idcategoria'] == 1) { //'OPERARIO'
                                        $oper++;
                                    } else if ($dat['idcategoria'] == 4) { //'Técnico'
                                        $tecn++;
                                    } else if ($dat['idcategoria'] == 3) { //'Servicio'
                                        $ser++;
                                    } else if ($dat['idcategoria'] == 2) { //'Administrativo'
                                        $adm++;
                                    }
                                } else {
                                    if ($dat['idcategoria'] == 6) { // 'Director'
                                        $dir++;
                                    } elseif ($dat['idcategoria'] == 5) { // 'Dirigente'
                                        $dirig++;
                                    }
                                }
                            }

                        }
                        if ($res[0]->idtipo != 7) {
                            if ($res[0]->idtipo = 3) {
                                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(
                                    null, null, null, null, $idestructura, null, null, 0, 0, 0, 0
                                ); //identidad
                            } else {
                                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(
                                    null, null, null, null, null, null, $idestructura, 0, 0, 0, 0
                                );
                            }
                        }
                        if ($persona->quantity != 0) {
                            foreach ($persona->data as $k => $p) {
                                if ($p['preparacion'] == 'NIVEL SUPERIOR') {
                                    $univ++;
                                } else if ($p['preparacion'] == 'Primaria') {
                                    $primaria++;

                                } else if ($p['preparacion'] == 'Secundaria') {
                                    $noveno++;

                                } else if ($p['preparacion'] == 'Preuniversitaria') {
                                    $mediosup++;

                                } else if ($p['preparacion'] == 'Educación técnica profesional') {
                                    $tecmedio++;
                                }
                                $fechanac = $p['fechanacimiento'];
                                if ($fechanac) {
                                    $fecha = str_replace("/", "-", $fechanac);
                                    $fecha = date('Y/m/d', strtotime($fecha));
                                    $hoy = date('Y/m/d');
                                    $edad = $hoy - $fecha;

                                    if ($edad <= 30) {
                                        $perUno++;
                                    } else if ($edad >= 31 && $edad <= 35) {
                                        $perDos++;
                                    } else if ($edad >= 36 && $edad <= 45) {
                                        $perTres++;
                                    } else if ($edad >= 45 && $edad <= 55) {
                                        $perCuatro++;
                                    } else if ($edad >= 46) {
                                        $perCinco++;
                                    }
                                }
                                $color = ZendExt_IoC::getInstance()->pvd->getDatosFenotipicosPersona(
                                    array($p['idpersona'])
                                );
                                if ($color[0]['idcolorpiel'] == 1) {
                                    $blanca++;
                                } elseif ($color[0]['idcolorpiel'] == 2) {
                                    $negra++;
                                } elseif ($color[0]['idcolorpiel'] == 4) {
                                    $mest++;
                                }
                                $afiliacion = ZendExt_IoC::getInstance()->pvd->getDatosAfiliacionPersona(
                                    array($p['idpersona'])
                                );
                                if ($afiliacion[0]['idorganizacion'] == 4) {
                                    $ujc++;
                                } elseif ($afiliacion[0]['idorganizacion'] == 3) {
                                    $pcc++;
                                }
                            }
                        }
                        //integracion politica
                        $pdf->Cell(16, 14, 555, 1, 0, 'C'); //total
                        $pdf->Cell(12, 14, $pcc, 1, 0, 'C');
                        $pdf->Cell(13, 14, $ujc, 1, 0, 'C');

                        //Categoria ocupacional
                        //print_r($tecn);die;
                        $pdf->Cell(12, 14, $oper, 1, 0, 'C');
                        $pdf->Cell(12, 14, $ser, 1, 0, 'C');
                        $pdf->Cell(12, 14, $tecn, 1, 0, 'C');
                        $pdf->Cell(12, 14, $adm, 1, 0, 'C');

                        $pdf->Cell(10, 14, $dirig, 1, 0, 'C'); //ds
                        $pdf->Cell(10, 14, $dir, 1, 0, 'C'); //dir
                        $pdf->Cell(12, 14, '', 1, 0, 'C'); //ejec

                        //Grado escolar
                        $pdf->Cell(18, 14, $primaria, 1, 0, 'C');
                        $pdf->Cell(21, 14, $noveno, 1, 0, 'C');
                        $pdf->Cell(21, 14, $mediosup, 1, 0, 'C');
                        $pdf->Cell(23, 14, $tecmedio, 1, 0, 'C');
                        $pdf->Cell(13, 14, $univ, 1, 0, 'C');

                        //Color de piel
                        $pdf->Cell(11, 14, $blanca, 1, 0, 'C');
                        $pdf->Cell(11, 14, $negra, 1, 0, 'C');
                        $pdf->Cell(11, 14, $mest, 1, 0, 'C');

                        //Edades
                        $pdf->Cell(26, 14, $perUno, 1, 0, 'C');
                        $pdf->Cell(26, 14, $perDos, 1, 0, 'C');
                        $pdf->Cell(26, 14, $perTres, 1, 0, 'C');
                        $pdf->Cell(25, 14, $perCuatro, 1, 0, 'C');
                        $pdf->Cell(25, 14, $perCinco, 1, 1, 'C');

                    } //tipo !7

                }
            }
        }
        return $pdf;
    }

    public function getIdCargos($arryCargos)
    {
        foreach ($arryCargos as $h => $carg) {
            $idcargos[$h] = $carg['idcargo'];
        }
        return $idcargos;
    }
}
