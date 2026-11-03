<?php

class GenerarPdfEjecucion {

    protected $pdf;
    protected $table;
    protected $withArray;
    protected $alignsArray;
    protected $ejercicio;
    protected $idejercicio;
    protected $tipos;
    protected $arrayUM;
    protected $integrator;

    function __construct($parametros, $integ) {

        $this->params = $parametros;
        $this->reporte = $parametros['reporte'];
        $this->integra = $integ;
        $this->pdf = new TCPDF('P', PDF_UNIT, 'Carta', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

// Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('MEP');
        $this->pdf->SetTitle('Ejecucion');
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
        if ($this->pdf->GetY() > 276) {
            $this->createHeader();
            $this->pdf->AddPage();
        }
        $this->pdf->Ln();
        $this->pdf->SetAutoPageBreak(TRUE, 20);



// Close and output PDF document
        ob_clean();
        $this->pdf->Output(" Ejecucion.pdf", 'I');
        return true;
    }

    private function createHeader() {
        if ($this->params['numero'] == 1) {
            // set JPEG quality
            //$idorganos=explode(',',$this->params['idorgano']);
            //$cbname=explode(',',$this->params['cbname']);
            //$denorgano=explode(',',$this->params['organo']);
            //$centros=explode(',',$this->params['centrobalance']);
            $obj = new ControlejecuciondemandaModel();
            $this->pdf->setJPEGQuality(75);
            $this->pdf->SetFont('Times', 'B', 10);
            $this->pdf->Cell(120, 5, 'DIRECCION ECONOMÍA', 0, 1, 'R', false, '', 1);
            $this->pdf->Ln(3);
            $this->pdf->Cell(125, 5, 'RESUMEN DE CONTRATACIÓN', 0, 1, 'R', false, '', 1);
            $this->pdf->Ln(3);

            $seleccionOrg = false;
            if ($this->params['organo'] != null || $this->params['organo'] != "") {
                $denorgano = explode(',', $this->params['organo']);
                $idorganos = explode(',', $this->params['idorgano']);
                $seleccionOrg = true;
            } /* else {
              $objet= new NomOrganosatisface();
              $result = $objet->obtenerOS();
              foreach($result as $ki=> $valor){
              $denorgano[$ki] = $valor['denominacion'];
              $idorganos[$ki] = $valor['idorganosatisface'];
              }
              } */
            $seleccion = false;

            if ($this->params['centrobalance'] != null || $this->params['centrobalance'] != "") {
                $centros = explode(',', $this->params['centrobalance']);
                $cbname = explode(',', $this->params['cbname']);
                $seleccion = true;
            } else {
                $seleccion = false;
                $idcentrobalance = 1;
                $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento($idcentrobalance);
                foreach ($centrobalance as $k => $valor) {
                    $centros[] = $this->integra->metadatos->DameEstructura($valor['identidad']);
                }
            }
            $objCtrEjecDem = new ControlejecuciondemandaModel();

            foreach ($centros as $k => $valor) {
                $cont = 0;
                $datos = [];
                $entidadesHijas = "";
                if ($seleccion) {
                    $datos = DatActividadentidad::auxObtenerEntidadesHijasComun($valor);
                } else {
                    $datos = DatActividadentidad::auxObtenerEntidadesHijasComun($valor[0]->idestructura);
                }

                $entidadesHijas = implode(',', $datos);

                $canttotal = 0;
                $importetotal = 0;
                $totalejecutado = 0;
                $cantidadejecutada = 0;
                $sumcant = 0;
                $sumimporte = 0;
                $canttotalGeneral = 0;
                $importetotalGeneral = 0;
                $pt = 0;
                $pintarEncabezadoTabla = true;
                $pintarEncabezadoInici = false;
                $pintarTotal = false;
                if ($seleccionOrg) {
                    foreach ($idorganos as $i => $val) {
                        $todos = [];
                        $todos = $obj->listarRelacionCBxOACE($this->params['idejercicio'], $entidadesHijas, $val);
                        if ($todos[0] != null) {
                            $pintarEncabezadoInici = true;
                            $pintarTotal = true;
                        }
                    }
                } else {
                    $todos = [];
                    $todos = $obj->listarRelacionCBxOACE($this->params['idejercicio'], $entidadesHijas, $val = null);
                    if ($todos[0] != null) {
                        $pintarEncabezadoInici = true;
                        $pintarTotal = true;
                    }
                }


                if ($seleccion) {
                    if ($pintarEncabezadoInici) {
                        $this->pdf->setJPEGQuality(75);
                        $this->pdf->SetFont('Times', 'B', 10);
                        $this->pdf->Cell(80, 5, 'Centro de Balance: ' . $cbname[$k], 0, 1, 'L', false, '', 1);
                        $this->pdf->Ln(5);
                        $pintarEncabezadoInici = false;
                    }
                } else {
                    if ($pintarEncabezadoInici) {
                        $this->pdf->setJPEGQuality(75);
                        $this->pdf->SetFont('Times', 'B', 10);
                        $this->pdf->Cell(80, 5, 'Centro de Balance: ' . $valor[0]->denominacion, 0, 1, 'L', false, '', 1);
                        $this->pdf->Ln(5);
                        $pintarEncabezadoInici = false;
                    }
                }

                if ($seleccionOrg) {

                    foreach ($idorganos as $i => $val) {
                        $todos = [];
                        $todos = $obj->listarRelacionCBxOACE($this->params['idejercicio'], $entidadesHijas, $val);
                        if ($todos[0] != null) {
                            if ($pintarEncabezadoTabla) {
                                $this->pdf->Cell(20, 5, 'Código', 1, 0, 'L', false, '', 1);
                                $this->pdf->Cell(35, 5, 'Denominación', 1, 0, 'L', false, '', 1);
                                $this->pdf->Cell(20, 5, 'C. Aprobada', 1, 0, 'L', false, '', 1);
                                $this->pdf->Cell(20, 5, 'Imp. Aprobado', 1, 0, 'L', false, '', 1);
                                $this->pdf->Cell(20, 5, 'C. Contratada', 1, 0, 'L', false, '', 1);
                                $this->pdf->Cell(20, 5, 'Imp. Contratado', 1, 0, 'L', false, '', 1);
                                $this->pdf->Cell(20, 5, 'C. Ejecutada', 1, 0, 'L', false, '', 1);
                                $this->pdf->Cell(20, 5, 'Imp. Ejecutado', 1, 0, 'L', false, '', 1);
                                $this->pdf->Cell(10, 5, '% Cont', 1, 0, 'C', false, '', 1);
                                $this->pdf->Cell(15, 5, 'OACE', 1, 1, 'L', false, '', 1);
                                $cont++;
                                $pintarEncabezadoTabla = false;
                            }

                            foreach ($todos as $pos => $k_data) {
                                $porciento = ($k_data['cantcontratada'] * 100) / $k_data['cantfinal'];
                                $this->pdf->SetFont('Times', 'Arial', 8);
                                $this->pdf->Cell(20, 5, $k_data['codigo'], 1, 0, 'L', false, '', 1);
                                $this->pdf->Cell(35, 5, $k_data['denominacion'], 1, 0, 'L', false, '', 1);
                                $this->pdf->Cell(20, 5, number_format($k_data['cantfinal'], '3', '.', ','), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(20, 5, number_format($k_data['importe'], '3', '.', ','), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(20, 5, number_format($k_data['cantcontratada'], '3', '.', ','), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(20, 5, number_format($k_data['importecontratado'], '3', '.', ','), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(20, 5, number_format($k_data['cantreal'], '3', '.', ','), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(20, 5, number_format($k_data['importeejecutado'], '3', '.', ','), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(10, 5, number_format($porciento, '1', '.', ','), 1, 0, 'C', false, '', 1);
                                $this->pdf->Cell(15, 5, $k_data['organo'], 1, 1, 'C', false, '', 1);
                                $sumcant += $k_data['cantfinal'];
                                $sumimporte += $k_data['importe'];
                                $canttotal += $k_data['cantcontratada'];
                                $importetotal += $k_data['importecontratado'];
                                $cantidadejecutada += $k_data['cantreal'];
                                $totalejecutado += $k_data['importeejecutado'];
                                $pt += number_format($porciento, '1', '.', ',');
                            }
                        }
                    }
                } else {
                    $todos = [];
                    $todos = $obj->listarRelacionCBxOACE($this->params['idejercicio'], $entidadesHijas, $val = null);
                    if ($todos[0] != null) {
                        if ($pintarEncabezadoTabla) {
                            $this->pdf->Cell(20, 5, 'Código', 1, 0, 'L', false, '', 1);
                            $this->pdf->Cell(35, 5, 'Denominación', 1, 0, 'L', false, '', 1);
                            $this->pdf->Cell(20, 5, 'C. Aprobada', 1, 0, 'L', false, '', 1);
                            $this->pdf->Cell(20, 5, 'Imp. Aprobado', 1, 0, 'L', false, '', 1);
                            $this->pdf->Cell(20, 5, 'C. Contratada', 1, 0, 'L', false, '', 1);
                            $this->pdf->Cell(20, 5, 'Imp. Contratado', 1, 0, 'L', false, '', 1);
                            $this->pdf->Cell(20, 5, 'C. Ejecutada', 1, 0, 'L', false, '', 1);
                            $this->pdf->Cell(20, 5, 'Imp. Ejecutado', 1, 0, 'L', false, '', 1);
                            $this->pdf->Cell(10, 5, '% Cont', 1, 0, 'C', false, '', 1);
                            $this->pdf->Cell(15, 5, 'OACE', 1, 1, 'L', false, '', 1);
                            $cont++;
                            $pintarEncabezadoTabla = false;
                        }

                        foreach ($todos as $pos => $k_data) {
                            //$organo = $k_data->data[0]['organosatisface'];
                            //$suc = $pos + 1;
                            //$integrator = ZendExt_IoC::getInstance();
                            //$datosentidad = $integrator->metadatos->DameEstructura($valor[0]->idestructura);
                            //$importeejecutado = $k_data['cantejecutada'] * $k_data['precioejecutado'];
                            $porciento = ($k_data['cantcontratada'] * 100) / $k_data['cantfinal'];
                            $this->pdf->SetFont('Times', 'Arial', 8);
                            $this->pdf->Cell(20, 5, $k_data['codigo'], 1, 0, 'L', false, '', 1);
                            $this->pdf->Cell(35, 5, $k_data['denominacion'], 1, 0, 'L', false, '', 1);
                            $this->pdf->Cell(20, 5, number_format($k_data['cantfinal'], '3', '.', ','), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(20, 5, number_format($k_data['importe'], '3', '.', ','), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(20, 5, number_format($k_data['cantcontratada'], '3', '.', ','), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(20, 5, number_format($k_data['importecontratado'], '3', '.', ','), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(20, 5, number_format($k_data['cantreal'], '3', '.', ','), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(20, 5, number_format($k_data['importeejecutado'], '3', '.', ','), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(10, 5, number_format($porciento, '1', '.', ','), 1, 0, 'C', false, '', 1);
                            $this->pdf->Cell(15, 5, $k_data['organo'], 1, 1, 'C', false, '', 1);
                            $sumcant += $k_data['cantfinal'];
                            $sumimporte += $k_data['importe'];
                            $canttotal += $k_data['cantcontratada'];
                            $importetotal += $k_data['importecontratado'];
                            $cantidadejecutada += $k_data['cantreal'];
                            $totalejecutado += $k_data['importeejecutado'];
                            $pt += number_format($porciento, '1', '.', ',');
                        }
                    }
                }

                if ($pintarTotal) {
                    $this->pdf->SetFont('Times', 'B', 8);
                    $this->pdf->SetFillColor(204, 255, 204);
                    $this->pdf->Cell(20, 5, 'Total:', 1, 0, 'L', true, '', 1);
                    $this->pdf->Cell(35, 5, '', 1, 0, 'L', true, '', 1);
                    $this->pdf->Cell(20, 5, number_format($sumcant, '3', '.', ','), 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(20, 5, number_format($sumimporte, '3', '.', ','), 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(20, 5, number_format($canttotal, '3', '.', ','), 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(20, 5, number_format($importetotal, '3', '.', ','), 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(20, 5, number_format($cantidadejecutada, '3', '.', ','), 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(20, 5, number_format($totalejecutado, '3', '.', ','), 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(10, 5, $pt, 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(15, 5, '', 1, 1, 'R', true, '', 1);
                    $this->pdf->Ln(5);
                    $pintarTotal = false;
                }
            }
        } else if ($this->params['numero'] == 2) {

            if ($this->params['organo'] != null || $this->params['organo'] != "") {
                $denorgano = explode(',', $this->params['organo']);
                $idorganos = explode(',', $this->params['idorgano']);
            } /* else {
              $objet= new NomOrganosatisface();
              $result = $objet->obtenerOS();
              foreach($result as $ki=> $valor){
              $denorgano[$ki] = $valor['denominacion'];
              $idorganos[$ki] = $valor['idorganosatisface'];
              }
              } */
            $seleccion1 = false;

            if ($this->params['centrobalance'] != null || $this->params['centrobalance'] != "") {
                $centros = explode(',', $this->params['centrobalance']);
                $cbname = explode(',', $this->params['cbname']);
                $seleccion1 = true;
            } else {
                $seleccion1 = false;
                $idcentrobalance = 1;
                $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento($idcentrobalance);
                foreach ($centrobalance as $k => $valor) {
                    $centros[] = $this->integra->metadatos->DameEstructura($valor['identidad']);
                }
            }


            $obj = new ControlejecuciondemandaModel();
            $this->pdf->setJPEGQuality(75);
            $this->pdf->SetFont('Times', 'B', 10);
            $this->pdf->Cell(125, 5, 'DIRECCION ECONOMÍA', 0, 1, 'R', false, '', 1);
            $this->pdf->Ln(3);
            $this->pdf->Cell(125, 5, 'RESUMEN DE EJECUCIÓN', 0, 1, 'R', false, '', 1);
            $this->pdf->Ln(3);

            $this->pdf->setJPEGQuality(75);
            $this->pdf->SetFont('Times', 'B', 10);

            //  $this->pdf->Cell(20, 5, 'Código', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(50, 5, 'Centros de Balance', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(20, 5, 'C. Aprobada', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(20, 5, 'Imp. Aprobado', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(20, 5, 'C. Contratada', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(20, 5, 'Imp. Contratado', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(20, 5, 'C. Ejecutada', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(20, 5, 'Imp. Ejecutado', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(10, 5, '%Cont', 1, 0, 'C', false, '', 1);
            $this->pdf->Cell(10, 5, '%Ejec', 1, 1, 'C', false, '', 1);


            foreach ($centros as $k => $valor) {
                $cont = 0;
                $orgdesglo = implode(',', $idorganos);

                if ($seleccion1) {
                    $todos = $obj->listarResumenCB($this->params['idejercicio'], $valor, $orgdesglo);
                } else {
                    $todos = $obj->listarResumenCB($this->params['idejercicio'], $valor[0]->idestructura, $orgdesglo);
                }


                if ($todos[0] != null) {
                    $cont++;
                    $canttotal = 0;
                    $importetotal = 0;
                    $totalejecutado = 0;
                    $cantidadejecutada = 0;
                    $sumcant = 0;
                    $sumimporte = 0;
                    $canttotalGeneral = 0;
                    $importetotalGeneral = 0;
                    $pt = 0;
                    $ptEjec = 0;
                    $porcientoEjec = 0;


                    foreach ($todos as $pos => $k_data) {
                        $integrator = ZendExt_IoC::getInstance();
                        $sumcant = $sumcant + $k_data['cantfinal'];
                        $sumimporte += $k_data['importe'];
                        $canttotal += $k_data['cantcontratada'];
                        $importetotal += $k_data['importecontratado'];
                        $cantidadejecutada+=$k_data['cantreal'];
                        $totalejecutado+=$k_data['importeejecutado'];
                    }

                    $porcientoCont = ($canttotal * 100) / $sumcant;
                    $porcientoEjec = ($cantidadejecutada * 100) / $canttotal;

                    $this->pdf->SetFont('Times', 'Arial', 8);
                    if ($seleccion1) {
                        $this->pdf->Cell(50, 5, $cbname[$k], 1, 0, 'L', false, '', 1);
                    } else {
                        $this->pdf->Cell(50, 5, $valor[0]->denominacion, 1, 0, 'L', false, '', 1);
                    }

                    $this->pdf->Cell(20, 5, number_format($sumcant, '3', '.', ','), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, 5, number_format($sumimporte, '3', '.', ','), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, 5, number_format($canttotal, '3', '.', ','), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, 5, number_format($importetotal, '3', '.', ','), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, 5, number_format($cantidadejecutada, '3', '.', ','), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, 5, number_format($totalejecutado, '3', '.', ','), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(10, 5, number_format($porcientoCont, '3', '.', ','), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(10, 5, number_format($porcientoEjec, '3', '.', ','), 1, 1, 'R', false, '', 1);
                }
            }
        } else {

            if ($this->params['organo'] != null || $this->params['organo'] != "") {
                $denorgano = explode(',', $this->params['organo']);
                $idorganos = explode(',', $this->params['idorgano']);
            } else {
                $objet = new NomOrganosatisface();
                $result = $objet->obtenerOS();
                foreach ($result as $ki => $valor) {
                    $denorgano[$ki] = $valor['denominacion'];
                    $idorganos[$ki] = $valor['idorganosatisface'];
                }
            }
            $seleccion2 = false;

            if ($this->params['centrobalance'] != null || $this->params['centrobalance'] != "") {
                $centros = explode(',', $this->params['centrobalance']);
                $cbname = explode(',', $this->params['cbname']);
                $seleccion2 = true;
            } else {
                $seleccion2 = false;
                $idcentrobalance = 1;
                $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento($idcentrobalance);
                foreach ($centrobalance as $k => $valor) {
                    $centros[] = $this->integra->metadatos->DameEstructura($valor['identidad']);
                }
            }

            //$denorgano=explode(',',$this->params['organo']);
            //$centros=explode(',',$this->params['centrobalance']);
            $obj = new ControlejecuciondemandaModel();
            $this->pdf->setJPEGQuality(75);
            $this->pdf->SetFont('Times', 'B', 10);
            $this->pdf->Cell(125, 5, 'DIRECCION ECONOMÍA', 0, 1, 'R', false, '', 1);
            $this->pdf->Ln(3);
            $this->pdf->Cell(125, 5, 'RESUMEN DE PENDIENTES', 0, 1, 'R', false, '', 1);
            $this->pdf->Ln(3);

            $this->pdf->setJPEGQuality(75);
            $this->pdf->SetFont('Times', 'B', 10);

            //  $this->pdf->Cell(20, 5, 'Código', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(50, 5, 'Centros de Balance', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(20, 5, 'C. Aprobada', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(20, 5, 'Imp. Aprobado', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(20, 5, 'C. Contratada', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(20, 5, 'Imp. Contratado', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(20, 5, 'C. Ejecutada', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(20, 5, 'Imp. Ejecutado', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(15, 5, 'Pendiente', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(10, 5, '%', 1, 1, 'C', false, '', 1);


            foreach ($centros as $k => $valor) {
                $cont = 0;

                $orgdesglo = implode(',', $idorganos);

                if ($seleccion2) {
                    $todos = $obj->listarPendientesCB($this->params['idejercicio'], $valor, $orgdesglo);
                } else {
                    $todos = $obj->listarPendientesCB($this->params['idejercicio'], $valor[0]->idestructura, $orgdesglo);
                }


                if ($todos[0] != null) {
                    $cont++;
                    $canttotal = 0;
                    $importetotal = 0;
                    $totalejecutado = 0;
                    $cantidadejecutada = 0;
                    $sumcant = 0;
                    $sumimporte = 0;
                    $pendiente = 0;
                    $canttotalGeneral = 0;
                    $importetotalGeneral = 0;
                    $pt = 0;
                    foreach ($todos as $pos => $k_data) {
                        $integrator = ZendExt_IoC::getInstance();
                        $porciento = ($k_data['cantcontratada'] * 100) / $k_data['cantplanificada'];
                        $sumcant+=$k_data['cantplanificada'];
                        $sumimporte += $k_data['importeplan'];
                        $canttotal += $k_data['cantcontratada'];
                        $importetotal += $k_data['importecontratado'];
                        $cantidadejecutada+=$k_data['cantejecutada'];
                        $totalejecutado+=$k_data['importeejecutado'];
                        $pendiente+=$k_data['pendiente'];
                        $pt+= number_format($porciento, '1', '.', ',');
                    }

                    $this->pdf->SetFont('Times', 'B', 8);
                    // $this->pdf->SetFillColor(204, 255, 204);
                    // $this->pdf->Cell(20, 5, 'Total:', 1, 0, 'L', true, '', 1);
                    if ($seleccion2) {
                        $this->pdf->Cell(50, 5, $cbname[$k], 1, 0, 'L', false, '', 1);
                    } else {
                        $this->pdf->Cell(50, 5, $valor[0]->denominacion, 1, 0, 'L', false, '', 1);
                    }
                    $this->pdf->Cell(20, 5, number_format($sumcant, '3', '.', ','), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, 5, number_format($sumimporte, '3', '.', ','), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, 5, number_format($canttotal, '3', '.', ','), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, 5, number_format($importetotal, '3', '.', ','), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, 5, number_format($cantidadejecutada, '3', '.', ','), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, 5, number_format($totalejecutado, '3', '.', ','), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(15, 5, number_format($pendiente, '3', '.', ','), 1, 0, 'L', false, '', 1);
                    $this->pdf->Cell(10, 5, $pt, 1, 1, 'R', false, '', 1);
                }
            }
        }
    }

}

?>
