<?php

class GenerarPdfInversionAcredor {
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
        $this->identidad = $parametros['identidad'];
        $this->integrator = $parametros['integrator'];
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
        $this->pdf->SetTitle('Acreedor Inversion');
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
        //print_r('pruebaaa');die;
        $this->pdf->AddPage();
        $this->createHeader();
        $this->pdf->Ln(5);
        if ($this->pdf->GetY() > 360) {
            //$this->pdf->setY(285);
            $this->pdf->setY(320);
            $this->piedePagina();
            $this->pdf->AddPage();
        } else {
            //$this->pdf->setY(265);
            $this->pdf->setY(320);
            $this->piedePagina();
        }
        $this->pdf->Ln();
        $this->pdf->SetAutoPageBreak(TRUE, 20);

// Close and output PDF document
        ob_clean();
        $this->pdf->Output("Acreedor Inversion.pdf", 'I');
        return true;
    }

    private function createHeader() {
// set JPEG quality
        $organismosArray = explode(',', $this->idorganismo);
        $orgaDenArray = explode(',', $this->organismoden);
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
        $this->pdf->Cell(130, 5, 'Acreedor/Inversión', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, 'Plan', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, 'Crédito', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, 'Gracia', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, 'Amortización', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(30, 5, '% Interés', 1, 1, 'C', false, '', 1);
        $denominacion = '';



        foreach ($organismosArray as $ey => $valOrg) {
            $totalorgentCredito = 0;
            $totalorgentPlan = 0;
            $monedaentidad = InversionesModel::devolverIdMonedaEnt($this->params['idmoneda'], $valOrg);
            $datosM['idmoneda'] = $monedaentidad ? $monedaentidad[0]['idmonedaentidad'] : 0;
            $datos = $this->objinversion->listarInversionAcredor($this->idejercicio, $this->ids, $this->params, $valOrg, $datosM['idmoneda']);

            $data = $this->objinversion->listarInversionAcredorC($this->idejercicio, $this->ids, $this->params, $valOrg, $datosM['idmoneda']);
            //print_r(count($data));die;


            if (count($data) > 0) {
                foreach ($data as $k => $v) {
                    $sumaTotalCredito+=$v['idinversfinancplan'];
                    $aux9 = $v['idinversfinancplan'] + $v['placontado'];
                    $sumaorg1+=$aux9;
                }
                if ($this->pdf->GetY() > 360) {
                    self::piedePagina();
                    self::encabezado();
                }
                $this->pdf->SetFont('Times', 'B', 10);
                $this->pdf->SetFillColor(204, 255, 204);
                $this->pdf->Cell(130, 5, 'Entidad-' . $orgaDenArray[$ey], 1, 'L', true, '', 1);
                $this->pdf->Cell(30, 5, number_format($sumaorg1, '2', '.', ' '), 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, number_format($sumaTotalCredito, '2', '.', ' '), 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, '', 1, 1, 'L', true, '', 1);
                $this->pdf->SetFillColor(255, 255, 255);

                $sumaorg1 = 0;
                $sumaTotalCredito = 0;
                $sumcredtinv = 0;
                $sumplaninv = 0;
                foreach ($data as $k => $value) {
                    if ($denominacion != $value['denominacion']) {
                        foreach ($datos as $k) {
                            if ($k['denominacion'] == $value['denominacion']) {
                                $sumcredtinv+=$k['idinversfinancplan'];
                                $aux7 = $k['idinversfinancplan'] + $k['placontado'];
                                $sumplaninv+=$aux7;
                            }
                        }
                        $denomacredor = array();
                        $denotabla = $value['denominacion'];
                        $denominacion = $value['denominacion'];
                        if ($this->pdf->GetY() > 360) {
                            self::piedePagina();
                            self::encabezado();
                        }
                        $this->pdf->SetFont('Times', 'B', 10);
                        $this->pdf->Cell(130, 5, $denotabla, 1, 0, 'L', false, '', 1);
                        $this->pdf->Cell(30, 5, number_format($sumplaninv, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                        $this->pdf->Cell(30, 5, number_format($sumcredtinv, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                        $this->pdf->SetFont('Times', 'Arial', 10);
                        $this->pdf->Cell(30, 5, '', 'TB', 0, 'L', false, '', 1);
                        $this->pdf->Cell(30, 5, '', 'TB', 0, 'L', false, '', 1);
                        $this->pdf->Cell(30, 5, '', 'TBR', 1, 'L', false, '', 1);
                        $sumcredtinv = 0;
                        $sumplaninv = 0;
                    }
                    foreach ($datos as $val) {
                        $this->pdf->SetFont('Times', 'Arial', 10);
                        if ($value['denominacion'] == $val['denominacion'] && !in_array($val['deninv'], $denomacredor)) {
                            $denomacredor[] = $val['deninv'];
                            if ($this->pdf->GetY() > 360) {
                                self::piedePagina();
                                self::encabezado();
                            }
                            $this->pdf->Cell(130, 5, $val['deninv'], 1, 0, 'L', false, '', 1);
                            $aux6 = $val['idinversfinancplan'] + $val['placontado'];
                            $this->pdf->Cell(30, 5, number_format($aux6, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(30, 5, number_format($val['idinversfinancplan'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(30, 5, number_format($val['gracia'], '2', '.', ' '), 1, 0, 'R', false, ' ', 1);
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
                $datosM = $this->objinversion->listarInversionAcredor($this->idejercicio, $this->ids, $this->params, $valor['identidad'], $idmonedaent);

                $dataM = $this->objinversion->listarInversionAcredorC($this->idejercicio, $this->ids, $this->params, $valor['identidad'], $idmonedaent);

                if (count($dataM) > 0) {
                    /* foreach ($dataM as $k => $v) {
                      $sumaTotalCreditoM+=$v['idinversfinancplan'];
                      $aux = $v['idinversfinancplan'] + $v['placontado'];
                      $sumaorgM+=$aux;
                      } */
                    if ($this->pdf->GetY() > 360) {
                        self::piedePagina();
                        self::encabezado();
                    }
                    $this->pdf->SetFont('Times', 'B', 10);
                    $this->pdf->SetFillColor(204, 255, 204);
                    $this->pdf->Cell(130, 5, 'Entidad - ' . $valor['entidad'], 1, 0, 'L', true, '', 1);
                    $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                    $this->pdf->SetFont('Times', 'Arial', 10);
                    $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(30, 5, '', 1, 1, 'L', true, '', 1);
                    $this->pdf->SetFillColor(255, 255, 255);
                    /* $totalorgentCredito+=$sumaTotalCreditoM;
                      $totalorgentPlan+=$sumaorgM;
                      $sumaorgM = 0;
                      $sumaTotalCreditoM = 0; */

                    $sumcredtinvM = 0;
                    $sumplaninvM = 0;
                    foreach ($datosM as $k => $value) {

                        $denomacredorTipo = array();
                        if ($denominacion != $value['denominacion']) {
                            foreach ($datosM as $key => $k) {
                                if ($k['denominacion'] == $value['denominacion'] && !in_array($k['deninv'], $denomacredorTipo)) {
                                    $denomacredorTipo[] = $k['deninv'];
                                    $sumcredtinvM+=$k['idinversfinancplan'];
                                    $aux1 = $k['idinversfinancplan'] + $k['placontado'];
                                    $sumplaninvM+=$aux1;
                                    $totalorgentPlan+=$k['idinversfinancplan'] + $k['placontado'];
                                    $totalorgentCredito+=$k['idinversfinancplan'];
                                }
                            }
                            $denomacredor = array();
                            $denotabla = $value['denominacion'];
                            $denominacion = $value['denominacion'];
                            if ($this->pdf->GetY() > 360) {
                                self::piedePagina();
                                self::encabezado();
                            }
                            $this->pdf->SetFont('Times', 'B', 10);
                            $this->pdf->Cell(130, 5, $denotabla, 1, 0, 'L', false, '', 1);
                            $this->pdf->Cell(30, 5, number_format($sumplaninvM, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(30, 5, number_format($sumcredtinvM, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->SetFont('Times', 'Arial', 10);
                            $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                            $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                            $this->pdf->Cell(30, 5, '', 1, 1, 'L', true, '', 1);

                            $sumcredtinvM = 0;
                            $sumplaninvM = 0;
                        }
                        foreach ($datosM as $key => $val) {
                            $this->pdf->SetFont('Times', 'Arial', 10);
                            if ($value['denominacion'] == $val['denominacion'] && !in_array($val['deninv'], $denomacredor)) {
                                $denomacredor[] = $val['deninv'];
                                if ($this->pdf->GetY() > 360) {
                                    self::piedePagina();
                                    self::encabezado();
                                }
                                $this->pdf->Cell(130, 5, $val['deninv'], 1, 0, 'L', false, '', 1);
                                $sunc = $val['idinversfinancplan'] + $val['placontado'];
                                $this->pdf->Cell(30, 5, number_format($sunc, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(30, 5, number_format($val['idinversfinancplan'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(30, 5, number_format($val['gracia'], '2', '.', ''), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(30, 5, number_format($val['plazoamortizacion'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(30, 5, number_format($val['porcientointeres'], '2', '.', ' '), 1, 1, 'R', false, '', 1);
                            }
                        }
                    }
                }
            }
            if ($totalorgentPlan > 0 || $totalorgentCredito > 0) {
                if ($this->pdf->GetY() > 360) {
                    self::piedePagina();
                    self::encabezado();
                }
                $this->pdf->SetFillColor(220, 221, 217);
                $this->pdf->SetFont('Times', 'B', 10);
                $this->pdf->Cell(130, 5, 'Total del organismo ' . $orgaDenArray[$ey], 1, 0, 'L', true, '', 1);
                $this->pdf->Cell(30, 5, number_format($totalorgentPlan, '2', '.', ' '), 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, number_format($totalorgentCredito, '2', '.', ' '), 1, 0, 'R', true, '', 1);
                $this->pdf->SetFont('Times', 'Arial', 10);
                $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, '', 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, '', 1, 1, 'L', true, '', 1);
                $this->pdf->SetFillColor(255, 255, 255);
            }
        }
    }

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

    public function piedePagina() {
        $this->pdf->Ln(6);
        $this->pdf->Cell(90, 5, 'Aprobado por: ' . $this->aprobadopor, 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Elaborado por: ' . $this->elaboradopor, 0, 1, 'R', false, '', 1);
    }

    public function encabezado() {
        $this->pdf->AddPage();
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