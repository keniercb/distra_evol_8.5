<?php

class PDFConfigRegimen extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $this->SetY(-15);
        $this->SetFont('Arial','I',8);
        $this->Cell(70, 10, utf8_decode($datentidad->denominacion.' ['.$datentidad->abreviatura.']'), 0, 0, 'L');
        $this->Cell(100, 10, utf8_decode('Generado por: '.$perfil['usuario']).' el '.date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 10, utf8_decode('Página '.$this->PageNo()), 0, 0, 'R');
    }
}

class ReportepdfConfigRegimenModel extends ZendExt_Model {

    public function ReportepdfModel() {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($finicio, $ffin, $columnasGrid, $quincena, $columnasGridSeg, $rangos)
    {
	    $pdf = new PDFConfigRegimen('L', 'mm', array(500,645));
        $cantidadColumna = 31;
        $datos = ConfCalendario::getConfiguracionDelAnno($finicio, $ffin);
        $ArrayAncho = $this->crearEncabezadoPrincipal($pdf, $cantidadColumna, $datos);
        $pdfNGeneral = $this->crearCuerpo($pdf, $ArrayAncho, $datos, $columnasGrid, $cantidadColumna, $quincena, $columnasGridSeg, $rangos);
        ob_clean();
        $pdfNGeneral->Output();

    }

    private function agrupaRegimen($datos){
        $result = Array();
        $post = 0;
        foreach ($datos as $k => $sit) {
            $esta = false;
            foreach ($result as $i => $rs) {
                if ($rs['idregimentrabajo'] == $sit['idregimentrabajo']) {
                    $esta = true;
                }
            }
            if ($esta == false) {
                $result[$post]['idregimentrabajo'] = $sit['idregimentrabajo'];
                $result[$post]['denregimentrabajo'] = $sit['denregimentrabajo'];
                $posicion = 0;
                foreach ($datos as $a => $d) {
                    if ($result[$post]['idregimentrabajo'] == $d['idregimentrabajo']) {
                        $result[$post]['datos'][$posicion] = $d;
                        $posicion++;
                    }
                }
                $post++;
            }
        }
        return $result;
    }

    private function agrupaMes($datos){
        //Agrupando por mes
        $result = Array();
        $post = 0;
        foreach ($datos as $k => $sit) {
            $esta = false;
            foreach ($result as $i => $rs) {
                if ($rs['mesrango'] == $sit['mesrango']) {
                    $esta = true;
                }
            }
            if ($esta == false) {
                $result[$post]['mesrango'] = $sit['mesrango'];
                $posicion = 0;
                foreach ($datos as $a => $d) {
                    if ($result[$post]['mesrango'] == $d['mesrango']) {
                        $result[$post]['datos'][$posicion] = $d;
                        $posicion++;
                    }
                }
                $post++;
            }
        }
        $post = 0;
        foreach ($result as $key => $mes){
            $result[$post]['datos'] = self::organizaRegimen($mes['datos']);
            $post2 = 0;
            foreach ($result[$post]['datos'] as $key2 => $grupo){
                $result[$post]['datos'][$post2]['datos'] = self::organizaGrupo($grupo['datos']);
                $post2++;
            }
            $post++;
        }
        return $result;
    }

    private function organizaRegimen($datos)
    {
        $result = Array();
        $post = 0;
        foreach ($datos as $k => $sit) {
            $esta = false;
            foreach ($result as $i => $rs) {
                if ($rs['idregimentrabajo'] == $sit['idregimentrabajo']) {
                    $esta = true;
                }
            }
            if ($esta == false) {
                $result[$post]['idregimentrabajo'] = $sit['idregimentrabajo'];
                $result[$post]['denregimentrabajo'] = $sit['denregimentrabajo'];
                $posicion = 0;
                foreach ($datos as $a => $d) {
                    if ($result[$post]['idregimentrabajo'] == $d['idregimentrabajo']) {
                        $result[$post]['datos'][$posicion] = $d;
                        $posicion++;
                    }
                }
                $post++;
            }
        }
        return $result;
    }

    private function organizaGrupo($datos)
    {
        $result = Array();
        $post = 0;
        foreach ($datos as $k => $sit) {
            $esta = false;
            foreach ($result as $i => $rs) {
                if ($rs['idgrupodescanso'] == $sit['idgrupodescanso']) {
                    $esta = true;
                }
            }
            if ($esta == false) {
                $result[$post]['idgrupodescanso'] = $sit['idgrupodescanso'];
                $result[$post]['dengrupodescanso'] = $sit['dengrupodescanso'];
                $posicion = 0;
                foreach ($datos as $a => $d) {
                    if ($result[$post]['idgrupodescanso'] == $d['idgrupodescanso']) {
                        $result[$post]['datos'][$posicion] = $d;
                        $posicion++;
                    }
                }
                $post++;
            }
        }
        return $result;
    }

    private function getTotal($idgrupodescanso,$idregimentrabajo,$year, $mes, $quincena){
        if(!$quincena)
            $total = ResumenRtdModel::getTotalMes($idgrupodescanso,$idregimentrabajo,$year);
        else
            $total = ResumenRtdModel::getTotalQuincena($idgrupodescanso,$idregimentrabajo,$year);
        foreach ($total as $key=>$value){
            if($value['key'] == $mes)
                return $value;
        }
    }

    private function organizaRangos($rangos, $quincena){
        $datos = Array();
        foreach ($rangos as $key => $value){
            $datos[$key] = Array();

            if($quincena)
                $datos[$key]['datos'] = ConfCalendario::getConfiguracionDelAnno($value['fdesdeprimquincena'], $value['fhastasegquincena']);
            else
                $datos[$key]['datos'] = ConfCalendario::getConfiguracionDelAnno($value['fdesde'], $value['fhasta']);
            for ($i = 0;$i < count($datos[$key]['datos']);$i++){
                $datos[$key]['datos'][$i]['mesrango'] = $value['mes'];
            }
            $datos[$key]['mes'] = $value['mes'];
        }
        return $datos;
    }

    private function crearCuerpo($pdf, $ArrayAncho, $datos, $columnasGrid, $cantidadColumna, $quincena, $columnasGridSeg, $rangos)
    {
        $porrangos = $this->organizaRangos($rangos, $quincena);
        $pdf->SetFont('Times', '', 17);
        foreach ($porrangos as $keyran => $dat) {
            $datos = $this->agrupaMes($dat['datos']);
            foreach ($datos as $keym => $mes) {
                $y = $pdf->GetY();
                if ($y >= '480') {
                    $pdf->AddPage();
                    $this->getEncabezado($ArrayAncho, $pdf);
                }
                $nommes = $this->getMes($mes['mesrango']);
                $pdf->Ln(20);
                $pdf->SetFont('Times', '', 17);
                $nomeswidth = 582;
                if ($quincena) {
                    $nomeswidth += 32;
                }
                $pdf->Cell($nomeswidth, 10, $nommes, 1, 1, 'C', 1);
                $pdf->SetFillColor(230, 230, 230);
                if ($quincena) {
                    $pdf->Ln(0);
                    $pdf->Cell(70, 10, '', 1, 0, 'C', 1);
                    $pdf->Cell(count($columnasGrid[$mes['mesrango']]) * 16 + 16, 10, "Primera quincena", 1, 0, 'C', 1);

                    $suma = ((31 - (count($columnasGridSeg[$mes['mesrango']]) + count($columnasGrid[$mes['mesrango']]))) + count($columnasGridSeg[$mes['mesrango']])) * 16 + 16;
                    $pdf->Cell($suma, 10, "Segunda quincena", 1, 0, 'C', 1);
                    $pdf->Cell(16, 10, "", 1, 1, 'C', 1);
                    $pdf->Ln(0);
                }
                $pdf->Cell(70, 10, 'Grupo', 1, 0, 'C', 1);
                $a = 0;
                while ($a < count($columnasGrid[$mes['mesrango']])) {
                    $pdf->Cell(16, 10, $columnasGrid[$mes['mesrango']][$a], 1, 0, 'C', 1);
                    $a++;
                }
                if ($quincena)
                    $pdf->Cell(16, 10, 'SubT', 1, 0, 'C', 1);

                $b = 0;
                while ($b < count($columnasGridSeg[$mes['mesrango']])) {
                    $pdf->Cell(16, 10, $columnasGridSeg[$mes['mesrango']][$b], 1, 0, 'C', 1);
                    $b++;
                }
                if ($a + $b < $cantidadColumna) {
                    for ($i = $a + $b; $i < $cantidadColumna; $i++)
                        $pdf->Cell(16, 10, "", 1, 0, 'C', 1);
                }
                if ($quincena)
                    $pdf->Cell(16, 10, 'SubT', 1, 0, 'C', 1);
                $pdf->Cell(16, 10, 'Total', 1, 1, 'C', 1);
                foreach ($mes['datos'] as $keyr => $regimen) {
                    $pdf->Cell($nomeswidth, 10, utf8_decode('Régimen: ' . $regimen['denregimentrabajo']), 1, 0, 'L', 1);
                    $pdf->Ln(10);
                    foreach ($regimen['datos'] as $keyg => $grupo) {
                        $total = $this->getTotal($grupo['idgrupodescanso'], $grupo['datos'][0]['idregimentrabajo'], $grupo['datos'][0]['year'], $grupo['datos'][0]['mesrango'], $quincena);
                        $pdf->Cell(70, 10, utf8_decode($grupo['dengrupodescanso']), 1, 0, 'C', 1);
                        $celdas = 0;
                        $pos = 0;
                        foreach ($columnasGrid[$mes['mesrango']] as $keyc => $columnas){
                            if (!is_numeric($columnas)) {
                                $part = explode('/', $columnas);
                                $dia = intval($part[0]);
                                $m = intval($part[1]);
                            }
                            else{
                                $dia = $columnas;
                                $m = $mes['mesrango'];
                            }
                            $d = $grupo['datos'][$pos];
                            $horas = $d['horas'];
                            $temp = explode(':',$horas);
                            $h = $temp[0].':'.$temp[1];
                            if(intval($d['dia']) == intval($dia)){
                                $texto = ($h != '') ? $h : $d['abreviatura'];
                                $pdf->Cell(16, 10, $texto, 1, 0, 'C', 0);
                                $celdas++;
                                $pos++;
                            }
                            else{
                                $pdf->Cell(16, 10, '', 1, 0, 'C', 0);
                                $celdas++;
                            }
                            if ($quincena && count($columnasGrid[$mes['mesrango']]) == $celdas) {
                                $pdf->Cell(16, 10, $total['primquincena'], 1, 0, 'C', 0);
                                $celdas++;
                            }
                        }
                        if ($quincena && $celdas < count($columnasGrid[$mes['mesrango']])) {
                            for ($i = $celdas; $i < count($columnasGrid[$mes['mesrango']]); $i++) {
                                $pdf->Cell(16, 10, "", 1, 0, 'C', 0);
                                $celdas++;
                            }
                        }
                        if ($quincena && count($columnasGrid[$mes['mesrango']]) == $celdas){
                            $pdf->Cell(16, 10, $total['primquincena'], 1, 0, 'C', 0);
                            $celdas++;
                        }
                        if ($quincena){
                            foreach ($columnasGridSeg[$mes['mesrango']] as $keycs => $columnas){
                                $dia = $columnas;
                                $m = $mes['mesrango'];
                                $d = $grupo['datos'][$pos];
                                if(intval($d['dia']) == intval($dia)){
                                    $texto = ($d['horas'] != '') ? $d['horas'] : $d['abreviatura'];
                                    $pdf->Cell(16, 10, $texto, 1, 0, 'C', 0);
                                    $celdas++;
                                    $pos++;
                                }
                                else{
                                    $pdf->Cell(16, 10, '', 1, 0, 'C', 0);
                                    $celdas++;
                                }
                            }
                        }
                        if($quincena)
                            $cantidadC = $cantidadColumna + 1;
                        else
                            $cantidadC = $cantidadColumna;
                        if ($celdas < $cantidadC) {
                            for ($i = $celdas; $i < $cantidadC; $i++)
                                $pdf->Cell(16, 10, "", 1, 0, 'C', 0);
                        }
                        if ($quincena)
                            $pdf->Cell(16, 10, $total['segquincena'], 1, 0, 'C', 0);
                        $pdf->SetFont('Times', 'B', 17);
                        $pdf->Cell(16, 10, $total['cantidad'], 1, 1, 'C', 0);
                    }
                }
            }
        }
        /***********************LEYENDA***************************/
        $pdf->Ln(20);
        $pdf->SetFillColor(200,220,255);
        $pdf->Cell(130, 10, 'Leyenda', 1, 0, 'C', 1);
        $pdf->Ln(10);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(80, 10, utf8_decode('Tipos de día'), 1, 0, 'C', 1);
        $pdf->Cell(50, 10, utf8_decode('Abreviatura'), 1, 0, 'C', 1);
        $pdf->Ln(10);
        $pdf->Cell(80, 10, utf8_decode('Laborable'), 1, 0, '', 0);
        $pdf->Cell(50, 10, 'LAB', 1, 0, '', 0);
        $pdf->Ln(10);
        $pdf->Cell(80, 10, utf8_decode('No Laborable'), 1, 0, '', 0);
        $pdf->Cell(50, 10, 'NLAB', 1, 0, '', 0);
        $pdf->Ln(10);
        $pdf->Cell(80, 10, utf8_decode('Feriado'), 1, 0, '', 0);
        $pdf->Cell(50, 10, 'FER', 1, 0, '', 0);
        $pdf->Ln(10);
        $pdf->Cell(80, 10, utf8_decode('Festivo'), 1, 0, '', 0);
        $pdf->Cell(50, 10, 'FES', 1, 0, '', 0);
        $pdf->Ln(10);

        return $pdf;
    }

    /**
     * @param PDFConfigRegimen $pdf
     * @param $cantidadColumna
     * @param $datos
     * @return array
     */
    private function crearEncabezadoPrincipal(&$pdf, $cantidadColumna, $datos)
    {
        $datosreg = $this->agrupaRegimen($datos);
	    $ArrayAncho = Array(0 => 35, 1 => 65, 2 => 23, 3 => 31, 4 => 25, 5 => 25, 6 => 25, 7 => 25, 8 => 25, 9 => 25, 10 => 25, 11 => 25, 12 => 25, 13 => 20, 14 => 25, 15 => 25, 16 => 25);
        $i=0;
        $valoranchodefecto=20;
        //Agrego posicioens de ancho para el caso de que se necesite cuadrar la tabla
        while ($i<$cantidadColumna-32){
          array_push($ArrayAncho, $valoranchodefecto) ;
          $i++;
        }
        $pdf->SetLeftMargin(15);
        $pdf->AddPage();
        $pdf->SetFont('Times', 'B', 20);
        $pdf->SetLineWidth(0.5);
        //////////////////////////////////////////////////////
        $pdf->SetY(20);
        $pdf->Cell(560, 10, utf8_decode( 'Resumen del régimen de trabajo y descanso del '.$datos[0]['year']), 0, 0, 'C', 0);
        $pdf->SetLeftMargin(207);
        $pdf->Ln(10);
        foreach ($datosreg as $k=>$valores) {
            $y = $pdf->GetY();
            if ($y >= '480') {
                $pdf->AddPage();
            }
            $pdf->Ln(10);
            $pdf->SetFont('Times', 'B', 17);
            $pdf->SetFillColor(200,220,255);
            $pdf->Cell(160, 10, utf8_decode('Régimen: '.$valores['denregimentrabajo']), 1, 1, 'C', 1);
            $pdf->SetFillColor(230, 230, 230);

            $pdf->Cell(60, 10, 'Grupo', 1, 0, 'C', 1);
            $pdf->Cell(50, 10, 'Total anual', 1, 0, 'C', 1);
            $pdf->Cell(50, 10, 'Promedio mensual', 1, 1, 'C', 1);
            $pdf->SetFont('Times', '', 17);
            $pdf->SetFillColor(230, 230, 230);
            $porgrupo = $this->orgGrupoDespuesDeRegimen($valores['datos']);
            foreach ($porgrupo as $i=>$val) {
                $pdf->Cell(60, 10, utf8_decode($val['dengrupodescanso']), 1, 0, 'C', 1);
                $pormes = $this->orgMesDespuesDeGrupo($val['datosgrupo']);
                $resumen = ResumenRtdModel::getResumenAnual($val['datosgrupo'][0]['idgrupodescanso'], $val['datosgrupo'][0]['idregimentrabajo'] , $val['datosgrupo'][0]['year']);

                $pdf->Cell(50, 10,$resumen['total'], 1, 0, 'C', 0);

                $pdf->Cell(50, 10, $resumen['promedio'], 1, 1, 'C', 0);
            }
        }
        $pdf->AddPage();
        $pdf->SetLeftMargin(15);
        $pdf->SetFont('Times', 'B', 20);
        $pdf->Ln(10);
        $pdf->Cell(560, 10, utf8_decode( 'Configuración de los régimenes de trabajo y descanso del '.$datos[0]['year']), 0, 0, 'C', 0);
        $pdf->Ln(10);

        return $ArrayAncho;
    }

    private function getEncabezado($ArrayAncho, &$pdf)
    {
        $cantidadColumna = 32;
        $i = 0;
        $valoranchodefecto = 20;
        while ($i < $cantidadColumna - 32) {
            array_push($ArrayAncho, $valoranchodefecto);
            $i++;
        }
        
        $pdf->SetFont('Times', 'B', 20);
        $pdf->SetLineWidth(0.5);
    }

	private function getMes($mesnum)
    {
		if ($mesnum == 1){ return 'Enero';
		} else if ($mesnum == 2){ return 'Febrero';
		} else if ($mesnum == 3){ return 'Marzo';
		} else if ($mesnum == 4){ return 'Abril';
		} else if ($mesnum == 5){ return 'Mayo';
		} else if ($mesnum == 6){ return 'Junio';
		} else if ($mesnum == 7){ return 'Julio';
		} else if ($mesnum == 8){ return 'Agosto';
		} else if ($mesnum == 9){ return 'Septiembre';
		} else if ($mesnum == 10){ return 'Octubre';
		} else if ($mesnum == 11){ return 'Noviembre';
		} else if ($mesnum == 12){ return 'Diciembre';
		} else {return '';}
	}
    //Organizar por mes después de haber organizado por régimen
	private function organizarmes($arraydatos)
    {		
		$result = Array();
		$post = 0;
		foreach ($arraydatos as $k => $sit) {
			$esta = false;
			foreach ($result as $i => $rs) {
				if ($rs['mes'] == $sit['mes']) {
					$esta = true;
				}
			}
			if ($esta == false) {
				$result[$post]['mes'] = $sit['mes'];
				$posicion = 0;
				foreach ($arraydatos as $a => $d) {
					if ($result[$post]['mes'] == $d['mes']) {
						$result[$post]['datosmes'][$posicion] = $d;
						$posicion++;
					}
				}
				$post++;
			}
		}
		return $result;
	}
	//Organizar por grupo después de haber organizado por mes
	private function organizarporgrupo($arraydatos)
    {		
		$result = Array();
		$post = 0;
		foreach ($arraydatos as $k => $sit) {
			$esta = false;
			foreach ($result as $i => $rs) {
				if ($rs['dengrupodescanso'] == $sit['dengrupodescanso']) {
					$esta = true;
				}
			}
			if ($esta == false) {
				$result[$post]['dengrupodescanso'] = $sit['dengrupodescanso'];
				$posicion = 0;
                $total = 0;
				foreach ($arraydatos as $a => $d) {
					if ($result[$post]['dengrupodescanso'] == $d['dengrupodescanso']) {
						$result[$post]['datosgrupo'][$posicion] = $d;
                        if ($d['horas']!='') {
                            $total += $d['horas'];
                        }
						$posicion++;
					}
				}
                $result[$post]['total'] = $total;
				$post++;
			}
		}
		return $result;
	}
    //Organizar por grupo despues de haber organizado por régimen
    private function orgGrupoDespuesDeRegimen($arraydatos)
    {
        $result = Array();
        $post = 0;
        foreach ($arraydatos as $k => $sit) {
            $esta = false;
            foreach ($result as $i => $rs) {
                if ($rs['dengrupodescanso'] == $sit['dengrupodescanso']) {
                    $esta = true;
                }
            }
            if ($esta == false) {
                $result[$post]['dengrupodescanso'] = $sit['dengrupodescanso'];
                $posicion = 0;
                foreach ($arraydatos as $a => $d) {
                    if ($result[$post]['dengrupodescanso'] == $d['dengrupodescanso']) {
                        $result[$post]['datosgrupo'][$posicion] = $d;
                        $posicion++;
                    }
                }
                $post++;
            }
        }
        return $result;
    }

    //Organizar por mes después de haber organizado por grupo
    private function orgMesDespuesDeGrupo($arraydatos)
    {
        $result = Array();
        $post = 0;
        foreach ($arraydatos as $k => $sit) {
            $esta = false;
            foreach ($result as $i => $rs) {
                if ($rs['mes'] == $sit['mes']) {
                    $esta = true;
                }
            }
            if ($esta == false) {
                $result[$post]['mes'] = $sit['mes'];
                $posicion = 0;
                foreach ($arraydatos as $a => $d) {
                    if ($result[$post]['mes'] == $d['mes']) {
                        $result[$post]['datosmes'][$posicion] = $d;
                        $posicion++;
                    }
                }
                $post++;
            }
        }
        return $result;
    }
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

