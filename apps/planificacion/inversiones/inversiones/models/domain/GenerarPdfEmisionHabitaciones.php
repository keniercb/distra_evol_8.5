<?php

class GenerarPdfEmisionHabitaciones {

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

    function __construct($parametros, $whereInversion, $whereOtrosIndicadores, $boolHabitaciones) {

        $this->idorganismo = $parametros['idorganismo'];
//        $this->identidad = $parametros['identidad'];
        $this->idejercicioden = $parametros['idejercicioden'];
        $this->idejercicio = $parametros['idejercicio'];
        $this->aprobadopor = $parametros['aprobadopor'];
        $this->elaboradopor = $parametros['elaboradopor'];
        $this->organismoden = $parametros['organismoden'];
        $this->forma = $parametros['forma'];
        $this->formaden = $parametros['formaden'];
        //print_r($this->formaden);die;
        $this->observacion = $parametros['observacion'];
        $this->identiDen = $parametros['identiDen'];
        $this->reporte = $parametros['reporte'];
        $this->entidadeshijas = $parametros['entidadeshijas'];
        $this->entidadesDen = $parametros['entidadesDen'];
        $this->pdf = new TCPDF('P', PDF_UNIT, 'Carta', true, 'UTF-8', false);
        $this->objinversion = new DatInversion();
        $this->objinversionModel = new InversionesModel();
        $this->objinversionreporte = new InversionesReportesModel();
        $this->table = new Table($this->pdf);
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('MEP');
        $this->pdf->SetTitle('INVERSION EMISIÓN');
        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);

        $this->params = $parametros;
        $this->hab = $boolHabitaciones;
		

        $this->whereInversion = $whereInversion;
        $this->whereOtrosIndicadores = $whereOtrosIndicadores;
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
        $this->pdf->SetMargins(15, 25, 15);
        $this->pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
    }

    public function export() {
        if ($this->idorganismo == "") {
            $organismosArray = $this->objinversionreporte->cargarOrganismosYNombre();
            unset($organismosArray[0]);
            //pre_r($organismosArray);die;
            //$organismosArray[0] =100000532 ;

            foreach ($organismosArray as $k => $orgPadre) {
                $datosEstructura = DatInversion::getDatosEstructura($orgPadre['id']);
                $vacia = $this->createHeader($orgPadre['id'], $orgPadre['denom'], $datosEstructura['codigo']);
                if ($vacia != 0) {
                    $this->pdf->Ln(5);
                    if ($this->pdf->GetY() > 210) {
                        $this->pdf->setY(210);
                        $this->piedePagina();
                        $this->pdf->AddPage();
                    } else {
                        $this->pdf->setY(210);
                        $this->piedePagina();
                    }
                    $this->pdf->Ln();
                    $this->pdf->SetAutoPageBreak(TRUE, 20);
                }
            }
        } else {
            $organismosArray = explode(',', $this->idorganismo);
            $orgaDenArray = explode(',', $this->organismoden);
            foreach ($organismosArray as $k => $orgPadre) {
                
        //el servicio esta dando error, buscar el codigo de la entidad padre sin 
        //servicio y paasarselo a este metodo y descomentariar donde esta comentariado
//                $datosEstructura = $this->integrator->metadatos->DameEstructura($orgPadre);//100000535
                $datosEstructura = DatInversion::getDatosEstructura($orgPadre);
                //pre_r($datosEstructura['codigo']);die;
                $vacia = $this->createHeader($orgPadre, $orgaDenArray[$k], $datosEstructura['codigo']);
                if ($vacia != 0) {
                    $this->pdf->Ln(5);
                    if ($this->pdf->GetY() > 210) {
                        $this->pdf->setY(210);
                        $this->piedePagina();
                        $this->pdf->AddPage();
                    } else {
                        $this->pdf->setY(210);
                        $this->piedePagina();
                    }
                    $this->pdf->Ln();
                    $this->pdf->SetAutoPageBreak(TRUE, 20);
                }
            }
        }
        ob_clean();
        $this->pdf->Output("INVERSION EMISIÓN.pdf", 'I');
        return true;
    }

//encabezado de las paginas
    private function createHeaderTable($identidades, $denOrgPadre, $sumaOrg, $cmpsVal, $valorUSD, $codigoOrgPadre) {
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Helvetica', 'B', 10);
        $this->pdf->Cell(250, 5, '', 0, 1, 'C', false, '');
        $this->pdf->Cell(50, 5, 'Plan ' . $this->idejercicioden, 0, 1, 'L', false, '');
        $this->pdf->Cell(70, 5, 'Ministerio de Economía y Planificación', 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(70, 5, 'Directivo Anual Mínimo', 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(145, 5, 'UM: Unidad', 0, 1, 'R', false, '', 1);
        $this->pdf->Cell(60, 5, ($this->hab == 0) ? 'TERMINACION DE HABITACIONES NUEVAS' : 'TERMINACION DE VIVIENDAS NUEVAS', 0, 1, 'L', false, '', 1);
		$this->pdf->Ln(2);

        $this->pdf->MultiCell(185, 5, $codigoOrgPadre.' - '.$denOrgPadre, 0, 'L', 0, 3, '', '', true, 0, true);
        $this->pdf->Cell(100, 5, '', 0, 0, 'R', false, '', 1);
        $this->pdf->SetFont('Helvetica', 'B', 8);
        $this->pdf->Ln(3);
        $this->pdf->SetFillColor(220, 221, 217);
        $this->pdf->MultiCell(120, 10, 'DESCRIPCIÓN', 'TB', 'L', false, 0, '', '', true, 0, false, true, 5, 'T', true);
        $tipo_reporte = 'emision';

        $this->pdf->MultiCell(60, 10, ($this->hab == 0) ? 'HABITACIONES' : 'VIVIENDAS', 'TB', 'C', false, 1, '', '', true, 0, false, true, 5, 'T', true);
    }

    private function createHeader($idOrgPadre, $denOrgPadre, $codigoOrgPadre) {
        $invPro = 125;
        $fondo = 124;
// pre_r($idOrgPadre);
// pre_r($denOrgPadre);die;
//-----------------TOTAL DEL PADRE---------------------------
        $entidadesgeneral = $this->objinversionreporte->getEntidades(array($idOrgPadre), $this->entidadeshijas);
// pre_r($entidadesgeneral);die;
        $cont = 0;
        $tipo_reporte = 'emision';
		
        $totalizarPrograma = 1;
        $selectInversion = 0;


        $sumaOrg = 0;
        $cup = 0;
        //-----------------INVERSIONES DE CADA  ORGANISMO---------------------------
        $identidades = $entidadesgeneral;

		$this->pdf->AddPage();
		$this->createHeaderTable($entidadesgeneral, $denOrgPadre, $sumaOrg, $cmps, $valorUSD, $codigoOrgPadre);
		$this->pdf->SetFont('Helvetica', 'B', 8);
		
		$params['idejercicio'] = $this->idejercicio;
		
		if($this->hab == 0){
			$params['idnomotrosindicadores'] = 120;   //Físico de Habitaciones Nuevas
			
			if (count($identidades) > 0) {
				$sumOrganis = DatInversion::sumaTotal($params, $identidades); //SUMA TOTAL DEL ORGANISMO
			} else {
				$sumOrganis[0]['sum'] = 0; //SUMA TOTAL DEL ORGANISMO
			}
		} else {
			$params['idnomotrosindicadores'] = 119;   //Físico de Habitaciones Nuevas
			
			if (count($identidades) > 0) {
				$sumOrganis = DatInversion::sumaTotal($params, $identidades); //SUMA TOTAL DEL ORGANISMO
			} else {
				$sumOrganis[0]['sum'] = 0; //SUMA TOTAL DEL ORGANISMO
			}
		}


		$this->pdf->SetFillColor(220, 221, 217);
		$this->pdf->SetFont('Helvetica', 'B', 8);

		if ($this->pdf->GetY() > 210) {
			$this->piedePagina();
			$this->pdf->AddPage();
			$this->createHeaderTable($entidadesgeneral, $denOrgPadre, $sumaOrg, $cmps, $valorUSD, $codigoOrgPadre);
		}
		$this->pdf->Cell(120, 5, 'TOTAL ' . ' '. $codigoOrgPadre. ' - '. $denOrgPadre, 0, 0, 'L', false, '', 1);
		$this->pdf->Cell(60, 5, (count($sumOrganis[0]['sum']) > 0) ? $sumOrganis[0]['sum'] : '0', 0, 1, 'C', false, '', 1);
		
		foreach ($identidades as $pos => $entidad) {
			$invers = DatInversion::listarInversionesPorIdOr($params, $entidad);
			
			if (count($invers) > 0) {
				$ent = array();
				$ent[] = $entidad;

				foreach ($invers as $inversion) {
					$this->pdf->Cell(120, 5, '        ' . $inversion['denominacion'], 0, 0, 'L', false, '', 1);
					$this->pdf->Cell(60, 5, $inversion['plan'], 0, 1, 'C', false, '', 1);
				}
			}
		}
		

		if ($this->pdf->GetY() > 210) {
			$this->piedePagina();
			$this->pdf->AddPage();
			$this->createHeaderTable($entidadesgeneral, $denOrgPadre, $sumaOrg, $cmps, $valorUSD, $codigoOrgPadre);
		}

		$this->pintarFilas($contador);
		$this->pdf->SetTextColor(8, 8, 8);
		$denominacion = '';

	
		return 1;
        
    }

    public function piedePagina() {
        $this->pdf->Ln(5);
        $this->pdf->SetFont('Helvetica', 'B', 10);
        if ($this->observacion != '')
            $this->pdf->MultiCell(185, 15, $this->observacion, 0, 'L', 0, 3, '', '', true, 0, true);
        /*else
            $this->pdf->MultiCell(185, 15, 'Se faculta al Ministro de los OACE o al Presidente de las
           OSDE, de los CAP y del CAM Isla de la juventud, a decidir sobre la desagregación de las
           inversiones no nominales, sin exceder el total autorizado.', 0, 'L', 0, 3, '', '', true, 0, true);*/
        $this->pdf->Ln(5);

        $this->pdf->Cell(90, 0, 'Aprobado por: ', 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(10);
        if ($this->aprobadopor != '')
            $this->pdf->Cell(90, 0, $this->aprobadopor, 0, 0, 'L', false, '', 1);
        /*else{
            $this->pdf->Cell(90, 5, 'Ricardo Cabrisas Ruiz', 0, 0, 'L', false, '', 1);
        }*/



        $this->pdf->Cell(50, 0, 'Fecha: ', 0, 1, 'R', false, '', 1);
        $this->pdf->Cell(90, 5, '      Ministro ', 0, 1, 'L', false, '', 1);
        $this->pdf->SetFont('Helvetica', 'B', 8);
    }

    public function pintarFilas($cant) {
        for ($i = 0; $i < $cant - 1; $i++) {
            $this->pdf->Cell(20, 5, '', 0, 0, 'L', false, '', 1);
        }
        $this->pdf->Cell(20, 5, '', 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(20, 5, '', 0, 1, 'L', false, '', 1);
    }

    public function pintarFilasI($cant) {
        for ($i = 0; $i < $cant - 1; $i++) {
            $this->pdf->Cell(20, 5, '', 0, 0, 'L', false, '', 1);
        }
        $this->pdf->Cell(20, 5, '', 0, 0, 'L', false, '', 1);
    }

}
