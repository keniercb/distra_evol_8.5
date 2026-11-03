<?php

class GenerarPdfAcredirInversion {

    protected $pdf;
    protected $table;
    protected $entidad;
    protected $identidad;
    protected $fechainicio;
    protected $fechafin;
    protected $confeccionadopor;
    protected $aprobadopor;
    protected $observaciones;
    protected $withArray;
    protected $alignsArray;
    protected $ejercicio;
    protected $idejercicio;
    protected $tipos;
    protected $arrayUM;
    protected $integrator;

    function __construct($parametros) {
        $this->idorganismo = $parametros['idorganismo'];
        $this->integrator = $parametros['integrator'];
        $this->identidad = $parametros['identidad'];
        $this->idejercicioden = $parametros['idejercicioden'];
        $this->idejercicio = $parametros['idejercicio'];
        $this->aprobadopor = $parametros['aprobadopor'];
        $this->elaboradopor = $parametros['elaboradopor'];
        $this->organismoden = $parametros['organismoden'];
        $this->observacion = $parametros['observacion'];
        $this->identiDen = $parametros['identiDen'];
        $this->reporte = $parametros['reporte'];
        $this->entidadeshijas = $parametros['entidadeshijas'];
        $this->entidadesDen = $parametros['entidadesDen'];
        $this->params = $parametros;
        $this->ids = $parametros['entidades'];
        $this->objinversion = new DatInversion();
        $this->objinversionModel = new InversionesModel();

        $this->pdf = new TCPDF('P', PDF_UNIT, 'A3', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

// Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('MEP');
        $this->pdf->SetTitle('Inversion Acreedor');
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

    public function export() {

        $this->pdf->AddPage();
        $this->createHeader();
        $this->pdf->Ln(5);
       /* if ($this->pdf->GetY() > 258) {
            $this->pdf->setY(265);
            $this->piedePagina();
            $this->pdf->AddPage();
        } else {
            $this->pdf->setY(265);
            $this->piedePagina();
        }*/
        $this->pdf->Ln();
        $this->pdf->SetAutoPageBreak(TRUE, 20);



// Close and output PDF document
        ob_clean();
        $this->pdf->Output("Inversion Acreedor.pdf", 'I');
        return true;
    }

    private function createHeader() {
        //print_r('prueba');die;

        $organismosArray = explode(',', $this->idorganismo); //$this->organismoden
        $orgaDenArray = explode(',', $this->organismoden); //$this->organismoden
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(70, 5, 'Plan:' . $this->idejercicioden, 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(3);
        $this->pdf->Cell(50, 5, 'Ministerio de economía y planificación', 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(3);
        $this->pdf->Cell(100, 5, '', 0, 0, 'R', false, '', 1);
        $this->pdf->Cell(50, 5, 'Fecha: ' . date('d-m-Y'), 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Hora: ' . date('H:i:s'), 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Observaciones:', 0, 1, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 8);
        $this->pdf->MultiCell(280, 15, $this->observacion, 1, 'L', 0, 3, '', '', true, 0, true);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Ln(6);
        $this->pdf->Cell(130, 5, 'Inversión/Acreedor', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, 'Plan', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, 'Crédito', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, 'Gracia', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, 'Amortización', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, '% Interés', 1, 1, 'C', false, '', 1);
        $denominacion = '';
        //  print_r($organismosArray);die;
        foreach ($organismosArray as $ey => $valOrg) {
            $totalorgentCredito = 0;
            $totalorgentPlan = 0;
            $monedaentidad = InversionesModel::devolverIdMonedaEnt($this->params['idmoneda'], $valOrg);
            $datosM['idmoneda'] = $monedaentidad ? $monedaentidad[0]['idmonedaentidad'] : 0;

            $datos = $this->objinversion->listarAcredorInversion($this->idejercicio, $this->ids, $this->params, $valOrg, $datosM['idmoneda']);

            $data = $this->objinversion->listarAcredorInversionC($this->idejercicio, $this->ids, $this->params, $valOrg, $datosM['idmoneda']);

            if (count($data) > 0) {
                foreach ($data as $k => $v) {
                    $aux13 = $v['idinversfinancplan'] + $v['placontado'];
                    $sumaTotalCredito+=$aux13;
                    $sumaorg1+=$v['idinversfinancplan'];
                }
                if ($this->pdf->GetY() > 385) {
                    self::encabezado();
                }

                $this->pdf->SetFont('Times', 'B', 10);
                $this->pdf->SetFillColor(204, 255, 204);
                $this->pdf->Cell(130, 5, 'Entidad-' . $orgaDenArray[$ey], 1, 'L', true, '', 1);
                $this->pdf->Cell(30, 5, number_format($sumaTotalCredito, '2', '.', ' '), 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, number_format($sumaorg1, '2', '.', ' '), 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, '', 1, 1, 'L', true, '', 1);
                $this->pdf->SetFillColor(255, 255, 255);
                // $totalorgentCredito+=$sumaTotalCredito;
                $totalorgentPlan+=$sumaorg1;
                $sumaorg1 = 0;
                $sumaTotalCredito = 0;
                $sumcredtinv = 0;
                $sumplaninv = 0;
                foreach ($data as $k => $value) {

                    if ($denominacion != $value['denominacion']) {
                        foreach ($datos as $key => $k) {
                            if ($k['denominacion'] == $value['denominacion']) {
                                $aux12 = $k['idinversfinancplan'] + $k['placontado'];
                                $sumcredtinv+=$aux12;
                                $sumplaninv+=$k['idinversfinancplan'];
                            }
                        }
                        $denomacredor = array();
                        $denotabla = $value['denominacion'];
                        $denominacion = $value['denominacion'];
                        if ($this->pdf->GetY() > 385) {
                            self::encabezado();
                        }
                        $this->pdf->SetFont('Times', 'B', 10);
                        $this->pdf->Cell(130, 5, $denotabla, 1, 0, 'L', false, '', 1);
                        $this->pdf->Cell(30, 5, number_format($sumcredtinv, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                        $this->pdf->Cell(30, 5, number_format($sumplaninv, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                        $this->pdf->SetFont('Times', 'Arial', 10);
                        /* $this->pdf->Cell(30, 5, '', 'TB', 0, 'L', false, '', 1);
                          $this->pdf->Cell(30, 5, '', 'TB', 0, 'L', false, '', 1);
                          $this->pdf->Cell(30, 5, '', 'TBR', 1, 'L', false, '', 1); */
                        $this->pdf->Cell(30, 5, '', 1, 0, 'R', false, '', 1);
                        $this->pdf->Cell(30, 5, '', 1, 0, 'R', false, '', 1);
                        $this->pdf->Cell(30, 5, '', 1, 1, 'L', false, '', 1);

                        $sumcredtinv = 0;
                        $sumplaninv = 0;
                    }
                    foreach ($datos as $key => $val) {
                        if ($this->pdf->GetY() > 385) {
                            self::encabezado();
                        }
                        $this->pdf->SetFont('Times', 'Arial', 10);
                        if ($value['denominacion'] == $val['denominacion'] && !in_array($val['acredor'], $denomacredor)) {
                            $denomacredor[] = $val['acredor'];
                            $this->pdf->Cell(130, 5, $val['acredor'], 1, 0, 'L', false, '', 1);
                            $this->pdf->Cell(30, 5, number_format($val['idinversfinancplan'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $aux11 = $val['idinversfinancplan'] + $val['placontado'];
                            $this->pdf->Cell(30, 5, number_format($aux11, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(30, 5, number_format($val['gracia'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(30, 5, number_format($val['plazoamortizacion'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(30, 5, number_format($val['porcientointeres'], '2', '.', ' '), 1, 1, 'R', false, '', 1);
                        }
                    }
                }
            }
            $aux = explode(',', $this->identiDen);
            $aux1 = explode(',', $this->identidad);

            foreach ($aux1 as $key => $valor) {
                $idestructurasaux[$key]['identidad'] = $valor;
                $idestructurasaux[$key]['entidad'] = $aux[$key];
            }
            $hijasorg = self::cargarEntidades($valOrg);
            $idestructuras = array();

            if ($idestructurasaux[0] != null) {
                foreach ($idestructurasaux as $key => $valor) {
                    if (in_array($valor, $hijasorg))
                        $idestructuras[] = $valor;
                }
                if ($idestructuras[0] == null)
                    $idestructuras = $hijasorg;
            } else {
                $idestructuras = $hijasorg;
            }

            $denominacion = '';
            foreach ($idestructuras as $key => $valor) {
                $denominacion = '';
                $monedaentidad = InversionesModel::devolverIdMonedaEnt($this->params['idmoneda'], $valor['identidad']);
                $idmonedaent = $monedaentidad ? $monedaentidad[0]['idmonedaentidad'] : 0;
                $datosM = $this->objinversion->listarAcredorInversion($this->idejercicio, $this->ids, $this->params, $valor['identidad'], $idmonedaent);
                $dataM = $this->objinversion->listarAcredorInversionC($this->idejercicio, $this->ids, $this->params, $valor['identidad'], $idmonedaent);

                if (count($datosM) > 0) {
                    /* print_r('<pre>');
                      print_r($datosM);
                      die; */

                    /*  foreach ($datosM as $k => $kol) {
                      $denomacredorent = array(); */
                    /* foreach ($datosM as $ket => $volu) {//print_r('<pre>');print_r($volu);print_r('---');
                      if ($kol['denominacion'] == $volu['denominacion'] && !in_array($volu['acredor'], $denomacredorent)) {
                      $denomacredorent[] = $volu['acredor'];
                      $aux10 = $volu['idinversfinancplan'] + $volu['placontado'];
                      $sumaTotalCreditoM+=$aux10;
                      $sumaorgM+=$volu['idinversfinancplan'];

                      }
                      } */// print_r('<pre>');print_r($sumaTotalCreditoM);print_r('---');
                    /* foreach ($datosM as $key => $k) {
                      if ($k['denominacion'] == $kol['denominacion'] && !in_array($k['acredor'], $denomacredorent)) {
                      $aux6 = $k['idinversfinancplan'] + $k['placontado'];
                      $sumaTotalCreditoM+=$aux6;
                      $denomacredorent[] = $k['acredor'];
                      $sumaorgM+=$k['idinversfinancplan'];
                      }
                      } */

                    /*  }/ *///die;
                    //  $totalorgentCredito+=$sumaTotalCreditoM;
                    //  $totalorgentPlan+=$sumaorgM;
                    /*  if ($this->pdf->GetY() > 385) {
                      self::encabezado();
                      }
                      $this->pdf->SetFont('Times', 'B', 10);
                      $this->pdf->SetFillColor(204, 255, 204);
                      $this->pdf->Cell(130, 5, 'Entidad ' . $valor['entidad'], 1, 0, 'L', true, '', 1);
                      $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                      $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                      $this->pdf->SetFont('Times', 'Arial', 10);
                      $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                      $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                      $this->pdf->Cell(30, 5, '', 1, 1, 'L', true, '', 1);
                      $this->pdf->SetFillColor(255, 255, 255); */
                       if ($this->pdf->GetY() > 385) {
                    self::encabezado();
                }
                 $this->pdf->SetFillColor(204, 255, 204);
                $this->pdf->SetFont('Times', 'B', 10);
                $this->pdf->Cell(130, 5, 'Entidad ' . $valor['entidad'], 1, 0, 'L', true, '', 1);
                $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                $this->pdf->SetFont('Times', 'Arial', 10);
                $this->pdf->Cell(30, 5, '', 1, 0, 'L', true, '', 1);
                $this->pdf->Cell(30, 5, '', 1, 0, 'L', true, '', 1);
                $this->pdf->Cell(30, 5, '', 1, 1, 'R', true, '', 1);
                $this->pdf->SetFillColor(255, 255, 255);
                    $sumaorgM = 0;
                    $sumaTotalCreditoM = 0;

                    $sumcredtinvM = 0;
                    $sumplaninvM = 0;

                    foreach ($datosM as $k => $value) {
                        $denomacredorInv = array();                //  print_r('<pre>');print_r($datosM);die;

                        if ($denominacion != $value['denominacion']) {
                            foreach ($datosM as $key => $k) {
                                if ($k['denominacion'] == $value['denominacion'] && !in_array($k['acredor'], $denomacredorInv)) {
                                    $aux6 = $k['idinversfinancplan'] + $k['placontado'];
                                    $sumcredtinvM+=$aux6;
                                    $totalorgentCredito+=$aux6;
                                    $totalorgentPlan+=$k['idinversfinancplan'];
                                    $sumaTotalCreditoM+=$k['idinversfinancplan'];
                                    $sumaorgM+=$aux6;
                                    $denomacredorInv[] = $k['acredor'];
                                    $sumplaninvM+=$k['idinversfinancplan'];
                                }
                            }
                            $denomacredor = array();
                            $denotabla = $value['denominacion'];
                            $denominacion = $value['denominacion'];
                            if ($this->pdf->GetY() > 385) {
                                self::encabezado();
                            }
                            $this->pdf->SetFont('Times', 'B', 10);
                            $this->pdf->Cell(130, 5, $denotabla, 1, 0, 'L', false, '', 1);
                            $this->pdf->Cell(30, 5, number_format($sumcredtinvM, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(30, 5, number_format($sumplaninvM, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->SetFont('Times', 'Arial', 10);
                            /* $this->pdf->Cell(30, 5, '', 'TB', 0, 'L', false, '', 1);
                              $this->pdf->Cell(30, 5, '', 'TB', 0, 'L', false, '', 1);
                              $this->pdf->Cell(30, 5, '', 'TBR', 1, 'L', false, '', 1); */
                            $this->pdf->Cell(30, 5, '', 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(30, 5, '', 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(30, 5, '', 1, 1, 'L', false, '', 1);

                            $sumcredtinvM = 0;
                            $sumplaninvM = 0;
                        }
                        foreach ($datosM as $key => $val) {
                            if ($this->pdf->GetY() > 385) {
                                self::encabezado();
                            }
                            $this->pdf->SetFont('Times', 'Arial', 10);
                            if ($value['denominacion'] == $val['denominacion'] && !in_array($val['acredor'], $denomacredor)) {
                                $denomacredor[] = $val['acredor'];
                                // $this->pdf->Cell(130, 5, $val['denominacion'] . '/' . $val['acredor'], 1, 0, 'L', false, '', 1);
                                $this->pdf->Cell(130, 5, $val['acredor'], 1, 0, 'L', false, '', 1);
                                $aux7 = $val['idinversfinancplan'] + $val['placontado'];
                                $this->pdf->Cell(30, 5, number_format($aux7, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(30, 5, number_format($val['idinversfinancplan'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(30, 5, number_format($val['gracia'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(30, 5, number_format($val['plazoamortizacion'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(30, 5, number_format($val['porcientointeres'], '2', '.', ' '), 1, 1, 'R', false, '', 1);
                            }
                        }
                    }
                }
                if (count($datosM) > 0) {

                    if ($this->pdf->GetY() > 385) {
                        self::encabezado();
                    }
                    $this->pdf->SetFont('Times', 'B', 10);
                     $this->pdf->SetFillColor(220, 221, 217);
                    $this->pdf->Cell(130, 5, 'Total-Entidad ' . $valor['entidad'], 1, 0, 'L', true, '', 1);
                    $this->pdf->Cell(30, 5, number_format($sumaorgM, '2', '.', ' '), 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(30, 5, number_format($sumaTotalCreditoM, '2', '.', ' '), 1, 0, 'R', true, '', 1);
                    $this->pdf->SetFont('Times', 'Arial', 10);
                    $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(30, 5, '', 1, 1, 'L', true, '', 1);
                    $this->pdf->SetFillColor(255, 255, 255);
                }
            }
          /*  if ($totalorgentCredito != 0 || $totalorgentPlan != 0) {

                if ($this->pdf->GetY() > 385) {
                    self::encabezado();
                }
                $this->pdf->SetFillColor(220, 221, 217);
                $this->pdf->SetFont('Times', 'B', 10);
                $this->pdf->Cell(130, 5, 'Total del organismo ' . $orgaDenArray[$ey], 1, 0, 'L', true, '', 1);
                $this->pdf->Cell(30, 5, number_format($totalorgentCredito, '2', '.', ' '), 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, number_format($totalorgentPlan, '2', '.', ' '), 1, 0, 'R', true, '', 1);
                $this->pdf->SetFont('Times', 'Arial', 10);
                $this->pdf->Cell(30, 5, '', 1, 0, 'L', true, '', 1);
                $this->pdf->Cell(30, 5, '', 1, 0, 'L', true, '', 1);
                $this->pdf->Cell(30, 5, '', 1, 1, 'R', true, '', 1);
                $this->pdf->SetFillColor(255, 255, 255);
            }*/
        }
    }

//   public function piedePagina() {
//        $this->pdf->Cell(90, 5, 'Aprobado por: ' . $this->aprobadopor, 0, 0, 'L', false, '', 1);
//        $this->pdf->Cell(50, 5, 'Elaborado por: ' . $this->elaboradopor, 0, 1, 'R', false, '', 1);
//    }

    public function cargarEntidades($idorg) {
        $entidades = array();
        $dominios = $this->integrator->metadatos->DameHijosEstructura($idorg);
        if ($dominios[0] != "") {
            foreach ($dominios as $key => $k) {
                $entidades_hijas = array();
                $entidades_hijas = self::entidadesHijas($k->id, $k->text);
                $entidades = array_merge($entidades_hijas, $entidades);
            }
        }
        return $entidades;
    }

    public function entidadesHijas($identidad, $text) {
        $dominios = $this->integrator->metadatos->DameHijosEstructura($identidad);
        $entidades_hijas = array();
        $entidades_hijas[0]['identidad'] = $identidad;
        $entidades_hijas[0]['entidad'] = $text;
        foreach ($dominios as $key => $entidad_hija) {
            if ($entidad_hija->leaf == 1) {
                $entidades_hijas[$key + 1]['identidad'] = $entidad_hija->id;
                $entidades_hijas[$key + 1]['entidad'] = $entidad_hija->text;
            } else {
                $entidades_hijas = array_merge($entidades_hijas, self::entidadesHijas($entidad_hija->id, $entidad_hija->text));
            }
        }
        return $entidades_hijas;
    }

    public function encabezado() {
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Ln(6);
        $this->pdf->Cell(130, 5, 'Acreedor/Inversión', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, 'Plan', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, 'Crédito', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, 'Gracia', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, 'Amortización', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, '% Interés', 1, 1, 'C', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 10);
    }

}