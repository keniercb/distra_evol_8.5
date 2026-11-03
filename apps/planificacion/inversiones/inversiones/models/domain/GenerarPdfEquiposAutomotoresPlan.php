<?php

class GenerarPdfEquiposAutomotoresPlan {

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
        $this->totalesorg = array();
        $this->totalgeneral = array();
        $this->totalesentidad = array();
        $this->idejercicioden = $parametros['idejercicioden'];
        $this->idejercicio = $parametros['idejercicio'];
        $this->aprobadopor = $parametros['aprobadopor'];
        $this->elaboradopor = $parametros['elaboradopor'];
        $this->organismoden = $parametros['organismoden'];
        $this->forma = $parametros['forma'];
        $this->formaden = $parametros['formaden'];
        $this->comprarden = $parametros['comprarden'];
        $this->observacion = $parametros['observacion'];
        $this->identiDen = $parametros['identiDen'];
        $this->reporte = $parametros['reporte'];
        $this->entidadeshijas = $parametros['entidadeshijas'];
        $this->entidadesDen = $parametros['entidadesDen'];
        $this->params = $parametros;
        $this->ids = $parametros['entidades'];
        $this->id = $parametros['id'];
        $this->codigoreu = $parametros['codigoreu'];
        $this->objequipos = new DatEtapaEquipo();
        $this->importeRep = 0;
        $this->importeInc = 0;
        $this->importeTot = 0;
        $this->importeDon = 0;
        $this->importeFin = 0;


        $this->pdf = new TCPDF('P', PDF_UNIT, 'Carta', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

// Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('MEP');
        $this->pdf->SetTitle('EMISIÓN EQUIPOS AUTOMOTORES');
        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);

// set default monospaced font
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
        $this->pdf->SetMargins(15, 25, 15);

// set auto page breaks
        $this->pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
    }

    public function export() {
        $this->pdf->AddPage();
        $this->createHeader();
        $this->pdf->Ln(5);
        if ($this->pdf->GetY() > 230) { //248
            $this->pdf->setY(215);  //250
            $this->piedePagina();
            //$this->pdf->AddPage();
        } else {
            $this->pdf->setY(215);
            $this->piedePagina();
        }
        $this->pdf->SetAutoPageBreak(TRUE, 20);
        ob_clean();
        $this->pdf->Output("Emisión de equipos automotores.pdf", 'I');
        return true;
    }

    private function createHeader() {
        $this->totalesorg = array();
        $idEntidesHijas = array();
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Helvetica', 'B', 10);
        $this->pdf->Cell(70, 5, 'Plan ' . $this->idejercicioden, 0, 1, 'L', false, '', 1);
        // $this->pdf->Ln(2);
        $this->pdf->Cell(150, 5, 'Ministerio de Economía y Planificación', 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(70, 5, 'Directivo Máximo', 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(145, 5, 'UM: Uno', 0, 1, 'R', false, '', 1);
        $this->pdf->Ln(2);
        $this->pdf->Cell(150, 5, 'EQUIPOS AUTOMOTORES', 0, 1, 'L', false, '', 1);
        if ($this->formaden != '') {
            $this->pdf->Cell(185, 5, 'INVERSIONES ' . $this->formaden, 0, 1, 'L', false, '');
            // $this->pdf->Ln(2);
        }
        if ($this->comprarden != '') {
            $this->pdf->Cell(50, 5, $this->comprarden, 0, 1, 'L', false, '', 1);
            // $this->pdf->Ln(2);
        }
        $this->pdf->Ln(2);
        $this->pdf->MultiCell(185, 5, /* 'Organismo: ' . */ $this->organismoden, 0, 'L', 0, 3, '', '', true, 0, true);
        // $this->pdf->MultiCell(200, 15, 'Organismo: ' . $this->codigoreu[0]['codigo'] . '-' . $this->organismoden, 0, 'L', 0, 3, '', '', true, 0, true);
        $this->pdf->SetFont('Helvetica', 'B', 8);
        $this->pdf->Ln(2);

        $this->pdf->SetFillColor(255, 255, 255);
        $this->pdf->SetFont('Helvetica', 'B', 8);
        // $this->pdf->Cell(100, 10, 'CLASIFICACION/TIPO DE EQUIPO', 0, 0, 'L', true, '', 1);
        $this->pdf->MultiCell(100, 10, 'CLASIFICACION / TIPO DE EQUIPO', 'TB', 'L', 1, 0, '', '', true, 0, false, true, 5, 'T', true);
        $this->pdf->MultiCell(17, 10, 'Cantidad Reposición', 'TB', 'C', 1, 0, '', '', true, 0, false, true, 5, 'T', true);
        $this->pdf->MultiCell(17, 10, 'Cantidad Incremento', 'TB', 'C', 1, 0, '', '', true, 0, false, true, 5, 'T', true);
        $this->pdf->MultiCell(17, 10, 'Cantidad Total', 'TB', 'C', 1, 0, '', '', true, 0, false, true, 5, 'T', true);
        $this->pdf->MultiCell(17, 10, 'De ello Donación', 'TB', 'C', 1, 0, '', '', true, 0, false, true, 5, 'T', true);
        $this->pdf->MultiCell(17, 10, 'Valor Total (MP)', 'TB', 'C', 1, 1, '', '', true, 0, false, true, 5, 'T', true);
        $this->pdf->SetTextColor(0, 0, 0);
        $aux = explode(',', $this->identiDen);
        $aux1 = explode(',', $this->ids);

        foreach ($aux1 as $key => $valor) {
            $idestructurasaux[$key]['identidad'] = $valor;
            $idestructurasaux[$key]['entidad'] = $aux[$key];
        }
        foreach ($idestructurasaux as $key => $valOrg) {

            $hijasorg = self::cargarEntidades($valOrg['identidad']);

            foreach ($hijasorg as $entH) {
                $idEntidesHijas[] = $entH['identidad'];
            }
// print_r('<pre>');print_r.(implode(',', $idEntidesHijas));die;


            $this->totalgeneral['planrep']+=$this->totalesorg['planrep'];
            $this->totalgeneral['planinc']+=$this->totalesorg['planinc'];
            $this->totalgeneral['total']+=$this->totalesorg['total'];
            $this->totalgeneral['donacion']+=$this->totalesorg['donacion'];
            $this->totalgeneral['valor']+=$this->totalesorg['valor'];
        }
        self::pintarDatos(implode(',', $idEntidesHijas));  //true para las entidades padres
        // self::pintarDatos($valOrg);  //true para las entidades padres
        // foreach ($hijasorg as $key => $valEnt) {
        // self::pintarDatos($valEnt);
        // }
        if ($this->pdf->GetY() > 220) {
            self::encabezado();
        }
        if ($this->pdf->GetY() > 215) {
            $this->pdf->setY(215);
            $this->piedePagina();
            $this->pdf->AddPage();
        }
        $this->pdf->SetFont('Helvetica', 'B', 8);
        $this->pdf->SetFillColor(255, 255, 255);
        if ($this->pdf->GetY() > 215) {
            $this->pdf->setY(215);
            $this->piedePagina();
            $this->pdf->AddPage();
        }
        if ($this->pdf->GetY() > 220) {
            self::encabezado();
        }

        $this->pdf->SetFont('Helvetica', 'B', 8);
        $this->pdf->SetFillColor(255, 255, 255);
    }

    private function pintarDatos($valOrg) {
        $idplanes = $this->objequipos->listarPlanesReporte($valOrg);
        // $idplanes = $this->objequipos->listarPlanesReporte($valOrg['identidad']);
        if ($idplanes[0]['idmodelo'] != null) {
            $datospintar = $this->objequipos->listarDatosEquipos($this->params, $valOrg, $idplanes);
            //  print_r('<pre>');print_r($datospintar);die;
            // $datospintar = $this->objequipos->listarDatosEquipos($this->params, $valOrg['identidad'], $idplanes);
// print_r('<pre>');print_r($datospintar);die;
            if ($datospintar[0]['idorganosatisface'] != null) {
                $this->totalesentidad = array();
                $totalorganismos = array();
                foreach ($datospintar as $datos) {
                    $this->totalesentidad['planrep']+=$datos['planrep'];
                    $this->totalesentidad['planinc']+=$datos['planinc'];
                    $this->totalesentidad['total']+=$datos['total'];
                    $this->totalesentidad['donacion']+=$datos['donacion'];
                    $this->totalesentidad['valor']+=$datos['importe'];
                    //$this->totalesentidad['valor']+=$datos['total'] * $datos['precio'];

                    $totalorganismos[$datos['idorganosatisface']]['planrep']+=$datos['planrep'];
                    $totalorganismos[$datos['idorganosatisface']]['planinc']+=$datos['planinc'];
                    $totalorganismos[$datos['idorganosatisface']]['total']+=$datos['total'];
                    $totalorganismos[$datos['idorganosatisface']]['donacion']+=$datos['donacion'];
                    $totalorganismos[$datos['idorganosatisface']]['valor']+=$datos['importe'];
                    //$totalorganismos[$datos['idorganosatisface']]['valor']+=$datos['total'] * $datos['precio'];
                }
                if ($this->totalesentidad['planinc'] > 0 || $this->totalesentidad['planrep'] > 0 ||
                        $this->totalesentidad['total'] > 0 || $this->totalesentidad['donacion'] > 0 ||
                        $this->totalesentidad['valor'] > 0) {
                    $altura = self::CalcularAltura('Organismo: ' . $this->organismoden, 100);
                    if ($this->pdf->GetY() + $altura > 215) {
                        $this->piedePagina();
                        self::encabezado();
                    }
                    $this->pdf->SetFont('Helvetica', 'B', 8);
                    //$this->pdf->SetFillColor(204, 255, 204);
                    $this->pdf->Cell(100, 5, 'TOTAL EQUIPOS AUTOMOTORES', 0, 0, 'L', true, '', 1);
//                    $this->pdf->Cell(100, 5, 'Organismo: ' . $this->organismoden, 0, 0, 'L', true, '', 1);
                    if ($this->totalesentidad['planrep'] == 0)
                        $this->pdf->Cell(17, 5, ' ', 0, 0, 'R', true, '', 1);
                    else
                        $this->pdf->Cell(17, 5, number_format($this->totalesentidad['planrep'], '0', '.', ' '), 0, 0, 'R', true, '', 1);
                    if ($this->totalesentidad['planinc'] == 0)
                        $this->pdf->Cell(17, 5, ' ', 0, 0, 'R', true, '', 1);
                    else
                        $this->pdf->Cell(17, 5, number_format($this->totalesentidad['planinc'], '0', '.', ' '), 0, 0, 'R', true, '', 1);
                    $this->pdf->Cell(17, 5, number_format($this->totalesentidad['total'], '0', '.', ' '), 0, 0, 'R', true, '', 1);


                    if ($this->totalesentidad['donacion'] == 0)
                        $this->pdf->Cell(17, $altura, ' ', 0, 0, 'R', false, '', 1);
                    else
                        $this->pdf->Cell(17, 5, number_format($this->totalesentidad['donacion'], '0', '.', ' '), 0, 0, 'R', true, '', 1);
                    //$this->pdf->Cell(20, 5, number_format($this->totalesentidad['valor'], '3', '.', ','), 1, 1, 'R', true, '', 1);
                    $valorE = explode('.', $this->totalesentidad['valor']);
                    if ($valorE[1] > 0 || $valorE[1])
                        $valor = (int) $this->totalesentidad['valor'] + 1;
                    else
                        $valor = (int) $this->totalesentidad['valor'];
                    $this->pdf->Cell(17, 5, number_format($valor, '0', '.', ' '), 0, 1, 'R', true, '', 1);
//                    $this->pdf->Cell(20, 5, number_format($this->totalesentidad['valor'], '3', '.', ''), 0, 1, 'R', true, '', 1);
                    //$this->pdf->SetFillColor(255, 255, 255);
                }

                $this->totalesorg['planrep']+=$this->totalesentidad['planrep'];
                $this->totalesorg['planinc']+=$this->totalesentidad['planinc'];
                $this->totalesorg['total']+=$this->totalesentidad['total'];
                $this->totalesorg['donacion']+=$this->totalesentidad['donacion'];
                $this->totalesorg['valor']+=$this->totalesentidad['valor'];

                $orgsat = 0;
                $idpadre = 0;
                $totalesesp = array();
                $totalesesp['planinc'] = 0;
                $totalesesp['planrep'] = 0;
                $totalesesp['total'] = 0;
                $totalesesp['donacion'] = 0;
                $totalesesp['valor'] = 0;
                $longitud = count($datospintar);
                $orgsat = $datospintar[0]['idorganosatisface'];
                for ($ke = 0; $ke < $longitud; $ke++) {
                    if ($orgsat != $datospintar[$ke]['idorganosatisface'] || $ke == 0) {
                        if ($totalorganismos[$datospintar[$ke]['idorganosatisface']]['total'] > 0) {
                            $altura = self::CalcularAltura($datospintar[$ke]['organosat'], 80);
                            if ($this->pdf->GetY() + $altura > 215) {
                                $this->piedePagina();
                                self::encabezado();
                            }
                            $this->pdf->SetFont('Helvetica', 'B', 8);
                            $this->pdf->Cell(100, 5, '    EQUIPOS BALANCEADOS POR ' . $datospintar[$ke]['organosat'], 0, 0, 'L', false, '', 1);
                            if ($totalorganismos[$datospintar[$ke]['idorganosatisface']]['planrep'] == 0)
                                $this->pdf->Cell(17, 5, ' ', 0, 'R', false, '', 1);
                            else
                                $this->pdf->Cell(17, 5, number_format($totalorganismos[$datospintar[$ke]['idorganosatisface']]['planrep'], '0', '.', ' '), 0, 0, 'R', false, '', 1);
                            if ($totalorganismos[$datospintar[$ke]['idorganosatisface']]['planinc'] == 0)
                                $this->pdf->Cell(17, 5, ' ', 0, 'R', false, '', 1);
                            else
                                $this->pdf->Cell(17, 5, number_format($totalorganismos[$datospintar[$ke]['idorganosatisface']]['planinc'], '0', '.', ' '), 0, 0, 'R', false, '', 1);
                            $this->pdf->Cell(17, 5, number_format($totalorganismos[$datospintar[$ke]['idorganosatisface']]['total'], '0', '.', ' '), 0, 0, 'R', false, '', 1);
                            if ($totalorganismos[$datospintar[$ke]['idorganosatisface']]['donacion'] == 0)
                                $this->pdf->Cell(17, $altura, ' ', 0, 0, 'R', false, '', 1);
                            else
                                $this->pdf->Cell(17, 5, number_format($totalorganismos[$datospintar[$ke]['idorganosatisface']]['donacion'], '0', '.', ' '), 0, 0, 'R', false, '', 1);
                            //$this->pdf->Cell(20, 5, /*number_format($totalorganismos[$datospintar[$ke]['idorganosatisface']]['valor'], '3', '.', '')*/'000', 1, 1, 'R', false, '', 1);
                            $this->pdf->Cell(17, 5, ' ', 0, 1, 'R', false, '', 1);
                        }
                        $orgsat = $datospintar[$ke]['idorganosatisface'];
                        $idpadre = $datospintar[$ke]['idpadre'];
                        if ($datospintar[$ke]['total'] > 0) {
                            if ($datospintar[$ke]['total'] > 0) {
                                $denomindespec = $this->objequipos->listarDemonIndEsp($datospintar[$ke]['idpadre']);
                                $altura = self::CalcularAltura($denomindespec[0]['denominacion'], 100);
                                if ($this->pdf->GetY() + $altura > 215) {
                                    $this->piedePagina();
                                    self::encabezado();
                                }
                                $this->pdf->SetFont('Helvetica', '', 8);
                                $this->pdf->MultiCell(100, $altura, '        ' . $denomindespec[0]['denominacion'], 0, 'T', 0, 0, '', '', true, 0, false, true, $altura, 'T', true);
                                if ($datospintar[$ke]['planrep'] == 0)
                                    $this->pdf->Cell(17, 5, ' ', 0, 'R', false, '', 1);
                                else
                                    $this->pdf->Cell(17, $altura, number_format($datospintar[$ke]['planrep'], '0', '.', ' '), 0, 0, 'R', false, '', 1);
                                if ($datospintar[$ke]['planinc'] == 0)
                                    $this->pdf->Cell(17, 5, ' ', 0, 'R', false, '', 1);
                                else
                                    $this->pdf->Cell(17, $altura, number_format($datospintar[$ke]['planinc'], '0', '.', ' '), 0, 0, 'R', false, '', 1);
                                $this->pdf->Cell(17, $altura, number_format($datospintar[$ke]['total'], '0', '.', ' '), 0, 0, 'R', false, '', 1);

                                if ($datospintar[$ke]['donacion'] == 0)
                                    $this->pdf->Cell(17, $altura, ' ', 0, 0, 'R', false, '', 1);
                                else
                                    $this->pdf->Cell(17, $altura, number_format($datospintar[$ke]['donacion'], '0', '.', ' '), 0, 0, 'R', false, '', 1);

                                $valorT = $datospintar[$ke]['total'] * $datospintar[$ke]['precio'];
//                                $this->pdf->Cell(20, $altura,number_format($datospintar[$ke]['importe'], '3', '.', ''), 1, 1, 'R', false, '', 1);
                                $this->pdf->Cell(20, $altura, ' ', 0, 1, 'R', false, '', 1);
                            }
                        }
                    } else {
                        if ($idpadre == $datospintar[$ke]['idpadre']) {
                            if ($datospintar[$ke]['total'] + $datospintar[$ke - 1]['total'] > 0) {
                                $denomindespec = $this->objequipos->listarDemonIndEsp($datospintar[$ke]['idpadre']);
                                $altura = self::CalcularAltura($denomindespec[0]['denominacion'], 100);
                                if ($this->pdf->GetY() + $altura > 215) {
                                    $this->piedePagina();
                                    self::encabezado();
                                }
                                $this->pdf->SetFont('Helvetica', '', 8);
                                $this->pdf->MultiCell(100, $altura, '        ' . $denomindespec[0]['denominacion'], 0, 'T', 0, 0, '', '', true, 0, false, true, $altura, 'T', true);
                                $this->pdf->Cell(17, $altura, number_format($datospintar[$ke]['planrep'] + $datospintar[$ke - 1]['planrep'], '0', '.', ' '), 0, 0, 'R', false, '', 1);
                                $this->pdf->Cell(17, $altura, number_format($datospintar[$ke]['planinc'] + $datospintar[$ke - 1]['planinc'], '0', '.', ' '), 0, 0, 'R', false, '', 1);
                                $this->pdf->Cell(17, $altura, number_format($datospintar[$ke]['total'] + $datospintar[$ke - 1]['total'], '0', '.', ' '), 0, 0, 'R', false, '', 1);

                                if ($datospintar[$ke]['donacion'] == 0)
                                    $this->pdf->Cell(17, $altura, ' ', 0, 0, 'R', false, '', 1);
                                else
                                    $this->pdf->Cell(17, $altura, number_format($datospintar[$ke]['donacion'] + $datospintar[$ke - 1]['donacion'], '0', '.', ' '), 0, 0, 'R', false, '', 1);
                                $valorT = $datospintar[$ke]['total'] * $datospintar[$ke]['precio'];
//                                $this->pdf->Cell(20, $altura, number_format($datospintar[$ke]['importe'], '3', '.', ''), 1, 1, 'R', false, '', 1);
                                $this->pdf->Cell(17, $altura, ' ', 0, 1, 'R', false, '', 1);
                            }
                        } else {
                            if ($datospintar[$ke]['total'] > 0) {
                                $denomindespec = $this->objequipos->listarDemonIndEsp($datospintar[$ke]['idpadre']);
                                $altura = self::CalcularAltura($denomindespec[0]['denominacion'], 100);
                                if ($this->pdf->GetY() + $altura > 215) {
                                    $this->piedePagina();
                                    self::encabezado();
                                }
                                $this->pdf->SetFont('Helvetica', '', 8);
                                $this->pdf->MultiCell(100, $altura, '        ' . $denomindespec[0]['denominacion'], 0, 'T', 0, 0, '', '', true, 0, false, true, $altura, 'T', true);
                                if ($datospintar[$ke]['planrep'] == 0)
                                    $this->pdf->Cell(17, 5, ' ', 0, 'R', false, '', 1);
                                else
                                    $this->pdf->Cell(17, $altura, number_format($datospintar[$ke]['planrep'], '0', '.', ' '), 0, 0, 'R', false, '', 1);
                                if ($datospintar[$ke]['planinc'] == 0)
                                    $this->pdf->Cell(17, 5, ' ', 0, 'R', false, '', 1);
                                
                                    else$this->pdf->Cell(17, $altura, number_format($datospintar[$ke]['planinc'], '0', '.', ' '), 0, 0, 'R', false, '', 1);
                                $this->pdf->Cell(17, $altura, number_format($datospintar[$ke]['total'], '0', '.', ' '), 0, 0, 'R', false, '', 1);

                                if ($datospintar[$ke]['donacion'] == 0)
                                    $this->pdf->Cell(17, $altura, ' ', 0, 0, 'R', false, '', 1);
                                else
                                    $this->pdf->Cell(17, $altura, number_format($datospintar[$ke]['donacion'], '0', '.', ' '), 0, 0, 'R', false, '', 1);
                                $valorT = $datospintar[$ke]['total'] * $datospintar[$ke]['precio'];
                                /* new *///$this->pdf->Cell(20, $altura, number_format($valorT, '0', '.', ','), 1, 0, 'R', false, '', 1);
                                //$this->pdf->Cell(20, $altura,number_format($datospintar[$ke]['importe']), 3, 1, 'R', false, '', 1);
                                //     $this->pdf->Cell(20, $altura,number_format($datospintar[$ke]['importe'], '3', '.', ''), 1, 1, 'R', false, '', 1);
                                $this->pdf->Cell(17, $altura, ' ', 0, 1, 'R', false, '', 1);
                            }
                        }
                    }
                }
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
                $entidades_hijas[$key + 1]['codigo'] = $entidad_hija->codigo;
            } else {
                $entidades_hijas = array_merge($entidades_hijas, self::entidadesHijas($entidad_hija->id, $entidad_hija->text));
            }
        }
        return $entidades_hijas;
    }

    public function piedePagina() {
        $this->pdf->Ln(3);
        $this->pdf->SetFont('Helvetica', 'B', 10);
        $this->pdf->MultiCell(185, 15, $this->observacion, 0, 'L', 0, 3, '', '', true, 0, true);
        $this->pdf->Ln(2);

        $this->pdf->Cell(90, 5, 'Aprobado por: ', 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(15);
        $this->pdf->Cell(90, 5, $this->aprobadopor, 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Fecha: ', 0, 1, 'R', false, '', 1);
        // $this->pdf->Cell(50, 5, 'Fecha: ' . date('d-m-Y'), 0, 1, 'R', false, '', 1);
        $this->pdf->Cell(90, 5, '      Ministro ', 0, 1, 'L', false, '', 1);
        $this->pdf->SetFont('Helvetica', 'B', 8);
    }

    public function encabezado() {
        $this->pdf->AddPage();
        $this->pdf->SetFont('Helvetica', 'B', 10);
        $this->pdf->Cell(70, 5, 'Plan ' . $this->idejercicioden, 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(2);
        $this->pdf->Cell(150, 5, 'Ministerio de Economía y Planificación', 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(70, 5, 'Directivo Máximo', 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(145, 5, 'UM: Uno', 0, 1, 'R', false, '', 1);
        $this->pdf->Ln(2);
        $this->pdf->Cell(150, 5, 'EQUIPOS AUTOMOTORES', 0, 1, 'L', false, '', 1);
        if ($this->formaden != '') {
            $this->pdf->Cell(200, 5, 'INVERSIONES ' . $this->formaden, 0, 1, 'L', false, '');
            // $this->pdf->Ln(2);
        }
        if ($this->comprarden != '') {
            $this->pdf->Cell(50, 5, $this->comprarden, 0, 1, 'L', false, '', 1);
            // $this->pdf->Ln(2);
        }
        $this->pdf->Ln(2);
        $this->pdf->MultiCell(185, 5, /* 'Organismo: ' . */ $this->organismoden, 0, 'L', 0, 3, '', '', true, 0, true);
        $this->pdf->SetFont('Helvetica', 'B', 8);
        // $this->pdf->Ln(2);

        $this->pdf->SetFillColor(255, 255, 255);
        $this->pdf->SetFont('Helvetica', 'B', 8);
        $this->pdf->SetFont('Helvetica', 'B', 8);

        // $this->pdf->Cell(100, 10, 'CLASIFICACION/TIPO DE EQUIPO', 0, 0, 'L', true, '', 1);
        $this->pdf->MultiCell(100, 10, 'CLASIFICACION / TIPO DE EQUIPO', 'TB', 'L', 1, 0, '', '', true, 0, false, true, 5, 'T', true);
        $this->pdf->MultiCell(17, 10, 'Cantidad Reposición', 'TB', 'C', 1, 0, '', '', true, 0, false, true, 5, 'T', true);
        $this->pdf->MultiCell(17, 10, 'Cantidad Incremento', 'TB', 'C', 1, 0, '', '', true, 0, false, true, 5, 'T', true);
        $this->pdf->MultiCell(17, 10, 'Cantidad Total', 'TB', 'C', 1, 0, '', '', true, 0, false, true, 5, 'T', true);
        $this->pdf->MultiCell(17, 10, 'De ello Donación', 'TB', 'C', 1, 0, '', '', true, 0, false, true, 5, 'T', true);
        $this->pdf->MultiCell(17, 10, 'Valor Total (MP)', 'TB', 'C', 1, 1, '', '', true, 0, false, true, 5, 'T', true);
    }

    public function CalcularAltura($texto, $ancho) {
        $altura = 0;
        $ancho = $ancho;
        $cantidad_lineas = strlen($texto);
        if ($cantidad_lineas > $ancho) {
            $aux = $cantidad_lineas / $ancho;
            if (is_float($aux)) {
                $aux1 = explode(".", $aux);
            }
            $aux2 = $aux1[0] + 1;
            $altura = 5 * $aux2;
        } else {
            $altura = 5;
        }
        return $altura;
    }

}
