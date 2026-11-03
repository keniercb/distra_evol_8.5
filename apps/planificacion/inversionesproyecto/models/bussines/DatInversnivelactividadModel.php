<?php

/**
 * Created by JetBrains PhpStorm.
 * User: yosniel
 * Date: 6/05/16
 * Time: 9:23
 */
class DatInversnivelactividadModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function guardarNiveles($params) {
      $etapainversionactespcomportamiento = new DatInversnivelactividad();
      return $etapainversionactespcomportamiento->guardarNiveles($params);
    }

    //*** listar desglose Niveles de actividad para plataforma integrada ****
    public function listarInvNivelActividadDesglose($params) {
        $aaejercicio = DatInversion::idejercicioPorDenominacion($params['aaejercicio']);
        $aejercicio = DatInversion::idejercicioPorDenominacion($params['aejercicio']);
        $pejercicio = DatInversion::idejercicioPorDenominacion($params['pejercicio']);

        $params['aaejercicio'] = $aaejercicio;
        $params['aejercicio'] = $aejercicio;
        $params['pejercicio'] = $pejercicio;

        $explotacion = DatInversnivelactividaddesglose::listarInvNivelActividad($params);

        return $explotacion;
    }

    public function guardarNivelesDesglose($params) {
        $aaejercicio = DatInversion::idejercicioPorDenominacion($params['aaejercicio']);
        $aejercicio = DatInversion::idejercicioPorDenominacion($params['aejercicio']);
        $pejercicio = DatInversion::idejercicioPorDenominacion($params['pejercicio']);
        $idejercicio = $params['idejercicio'];
        $idinversion = $params['idinversion'];
        $niveles = $params['valores'];
        foreach ($niveles as $key => $value) {
            if (($value->aantetotal!= '' || $value->aanteestimado!= '' || $value->aanteplan!= '' || $value->aanteproyeccion!= '') && $aaejercicio != ''
            ) {

                if ($value->idaante != 0) {
                    $objNiveles = Doctrine::getTable('DatInversnivelactividaddesglose')->find($value->idaante);

                } else {

                    $objNiveles = new DatInversnivelactividaddesglose();
                    $objNiveles->idejercicio = $aaejercicio;
                    $objNiveles->idinversnivelactividad = $value->idinversnivelactividad;

                    $actividadEntidad = Doctrine::getTable('DatActividadentidad')->findByDql("
                                        identidad = $value->identidad and idactividad = $value->idactividad
                                        and idactespcomportamiento = $value->idactespcomportamiento
                                        and idejercicio = $aaejercicio");

                    if(!empty($actividadEntidad->toArray())){
                        $objNiveles->idactividadentidad = $actividadEntidad->toArray()[0]['idactividadentidad'];
                    }else{
                        $actividadEntidad = new DatActividadentidad();
                        $actividadEntidad->identidad = $value->identidad;
                        $actividadEntidad->idejercicio = $aaejercicio;
                        $actividadEntidad->idactividad = $value->idactividad;
                        $actividadEntidad->idaprobacion = 1;
                        $actividadEntidad->version = 0;
                        $actividadEntidad->idactespcomportamiento = $value->idactespcomportamiento;
                        $actividadEntidad->ajuste = 0;
                        $actividadEntidad->save();

                        $objNiveles->idactividadentidad = $actividadEntidad->idactividadentidad;
                    }

                }

                $objNiveles->ejecutado = ($value->aantetotal) ? $value->aantetotal : 0;
                $objNiveles->estimado = ($value->aanteestimado) ? $value->aanteestimado : 0;
                $objNiveles->plan = ($value->aanteplan) ? $value->aanteplan : 0;
                $objNiveles->proyeccion = ($value->aanteproyeccion) ? $value->aanteproyeccion : 0;
                $objNiveles->save();
            }
            if (($value->antetotal!= '' || $value->anteestimado!= '' || $value->anteplan!= '' || $value->anteproyeccion!= '') && $aejercicio != ''
            ) {
                if ($value->idante != 0) {
                    $objNiveles = Doctrine::getTable('DatInversnivelactividaddesglose')
                        ->find($value->idante);
                } else {

                    $objNiveles = new DatInversnivelactividaddesglose();
                    $objNiveles->idejercicio = $aejercicio;
                    $objNiveles->idinversnivelactividad = $value->idinversnivelactividad;

                    $actividadEntidad = Doctrine::getTable('DatActividadentidad')->findByDql("
                                        identidad = $value->identidad and idactividad = $value->idactividad
                                        and idactespcomportamiento = $value->idactespcomportamiento
                                        and idejercicio = $aejercicio");

                    if(!empty($actividadEntidad->toArray())){
                        $objNiveles->idactividadentidad = $actividadEntidad->toArray()[0]['idactividadentidad'];
                    }else{
                        $actividadEntidad = new DatActividadentidad();
                        $actividadEntidad->identidad = $value->identidad;
                        $actividadEntidad->idejercicio = $aejercicio;
                        $actividadEntidad->idactividad = $value->idactividad;
                        $actividadEntidad->idaprobacion = 1;
                        $actividadEntidad->version = 0;
                        $actividadEntidad->idactespcomportamiento = $value->idactespcomportamiento;
                        $actividadEntidad->ajuste = 0;
                        $actividadEntidad->save();

                        $objNiveles->idactividadentidad = $actividadEntidad->idactividadentidad;
                    }
                }

                $objNiveles->ejecutado = ($value->antetotal) ? $value->antetotal : 0;
                $objNiveles->estimado = ($value->anteestimado) ? $value->anteestimado : 0;
                $objNiveles->plan = ($value->anteplan) ? $value->anteplan : 0;
                $objNiveles->proyeccion = ($value->anteproyeccion) ? $value->anteproyeccion : 0;
                $objNiveles->save();
            }
            if (($value->actualtotal!= '' || $value->actualestimado!= '' || $value->actualplan!= '' || $value->actualproyeccion!= '') && $idejercicio != ''
            ) {
                if ($value->idactual != 0) {
                    $objNiveles = Doctrine::getTable('DatInversnivelactividaddesglose')
                        ->find($value->idactual);
                } else {
                    $objNiveles = new DatInversnivelactividaddesglose();
                    $objNiveles->idejercicio = $idejercicio;
                    $objNiveles->idinversnivelactividad = $value->idinversnivelactividad;

                    $actividadEntidad = Doctrine::getTable('DatActividadentidad')->findByDql("
                                        identidad = $value->identidad and idactividad = $value->idactividad
                                        and idactespcomportamiento = $value->idactespcomportamiento
                                        and idejercicio = $idejercicio");

                    if(!empty($actividadEntidad->toArray())){
                        $objNiveles->idactividadentidad = $actividadEntidad->toArray()[0]['idactividadentidad'];
                    }else{
                        $actividadEntidad = new DatActividadentidad();
                        $actividadEntidad->identidad = $value->identidad;
                        $actividadEntidad->idejercicio = $idejercicio;
                        $actividadEntidad->idactividad = $value->idactividad;
                        $actividadEntidad->idaprobacion = 1;
                        $actividadEntidad->version = 0;
                        $actividadEntidad->idactespcomportamiento = $value->idactespcomportamiento;
                        $actividadEntidad->ajuste = 0;
                        $actividadEntidad->save();

                        $objNiveles->idactividadentidad = $actividadEntidad->idactividadentidad;
                    }
                }

                $objNiveles->ejecutado = ($value->actualtotal) ? $value->actualtotal : 0;
                $objNiveles->estimado = ($value->actualestimado) ? $value->actualestimado : 0;
                $objNiveles->plan = ($value->actualplan) ? $value->actualplan : 0;
                $objNiveles->proyeccion = ($value->actualproyeccion) ? $value->actualproyeccion : 0;
                $objNiveles->save();
            }
            if (($value->postotal || $value->posestimado || $value->posplan || $value->posproyeccion) && $pejercicio != ''
            ) {
                if ($value->idpos != 0) {
                    $objNiveles = Doctrine::getTable('DatInversnivelactividaddesglose')
                        ->find($value->idpos);
                } else {
                    $objNiveles = new DatInversnivelactividaddesglose();
                    $objNiveles->idejercicio = $pejercicio;
                    $objNiveles->idinversnivelactividad = $value->idinversnivelactividad;

                    $actividadEntidad = Doctrine::getTable('DatActividadentidad')->findByDql("
                                        identidad = $value->identidad and idactividad = $value->idactividad
                                        and idactespcomportamiento = $value->idactespcomportamiento
                                        and idejercicio = $pejercicio");


                    if(!empty($actividadEntidad->toArray())){
                        $objNiveles->idactividadentidad = $actividadEntidad->toArray()[0]['idactividadentidad'];
                    }else{
                        $actividadEntidad = new DatActividadentidad();
                        $actividadEntidad->identidad = $value->identidad;
                        $actividadEntidad->idejercicio = $pejercicio;
                        $actividadEntidad->idactividad = $value->idactividad;
                        $actividadEntidad->idaprobacion = 1;
                        $actividadEntidad->version = 0;
                        $actividadEntidad->idactespcomportamiento = $value->idactespcomportamiento;
                        $actividadEntidad->ajuste = 0;
                        $actividadEntidad->save();

                        $objNiveles->idactividadentidad = $actividadEntidad->idactividadentidad;
                    }
                }

                $objNiveles->ejecutado = ($value->postotal) ? $value->postotal : 0;
                $objNiveles->estimado = ($value->posestimado) ? $value->posestimado : 0;
                $objNiveles->plan = ($value->posplan) ? $value->posplan : 0;
                $objNiveles->proyeccion = ($value->posproyeccion) ? $value->posproyeccion : 0;
                $objNiveles->save();
            }


        }
        $ejercicio = array();
        $cont = 0;
        if ($aaejercicio == '') {
            $ejercicio[$cont] = $params['aaejercicio'];
            $cont++;
        }
        if ($aejercicio == '') {
            $ejercicio[$cont] = $params['aejercicio'];
            $cont++;
        }
        if ($pejercicio == '') {
            $ejercicio[$cont] = $params['pejercicio'];
        }

        return 1;
    }

    public function verDetallesIntegracion($parametros, $datosInv) {
        $datosInv['start'] = 0;
        $datosInv['limit'] = 10000;
		
        $datosEntidad = $this->integrator->metadatos->DameEstructura($datosInv['identidad']);
        $idespecialidad = $datosEntidad [0]->idespecialidad;//990000000310;

        $datosActividad = DatInversnivelactividad::getActividadesByInversion($datosInv, $idespecialidad);
        $datosIndicadores = DatInversnivelactividad::getIndicadoresByInversion($datosInv, $idespecialidad);
        
        $idProy = DatInversnivelactividad::getProy($parametros);
        
        if(count($idProy)){
            $arrayTareas = array();
            self::getTareasProyecto($idProy[0]['idelemento'], $arrayTareas);
// pre_r($arrayTareas);die;
        }
		
        $cuerporeporte = $this->configurarDetalles($parametros);
        $cuerporeporte .=self::obtenerCuerpoDetallesIntegracion($parametros, $datosInv, $datosActividad, $datosIndicadores, $arrayTareas, $idProy);

        return $cuerporeporte;
    }
	
    public function configurarDetalles($parametros) {
        $cuerporeporte = "<style type='text/css'>
                 @media all {body{display: block; background: none no-repeat scroll 100% 100% #666666;}}
                 @media print {*{visibility: visible;  padding: 0 !important; } div{ top:0; right:0; bottom:0; left:0; #AP{margin-top: 1cm;}}}
                 
				 @page{height:700 cm;width: 200 cm;size:500;}
				 </style>";

        $cuerporeporte .= "<div style='margin:auto;width:700 cm;height:auto;background-color:white;padding:1cm 0.5cm 1cm 0.5cm;'>";
        $cuerporeporte .= "<div style='width:100%;'>";


        return $cuerporeporte;
    }
	
    public function obtenerCuerpoDetallesIntegracion($parametros, $datosInv, $datosActividad, $datosIndicadores, $arrayTareas, $idProy) {
        $iddominio = $this->global->Perfil->iddominio;
		
        $presupuesto = InversionesModel::listarP($datosInv);

        $financiamiento = InversionesModel::listarF($datosInv);
        $modelElem = new DatElementoModel();

        $liquido = InversionesModel::listarLiq($datosInv);

        $array = array();
        if ($parametros->datosinv->idestadoaprobacion == 1) {
            $aprob = 'Si';
        } else {
            $aprob = 'No';
        }
        if ($parametros->datosinv->fasttrack == 1) {
            $fastt = 'Si';
        } else {
            $fastt = 'No';
        }
        if ($parametros->datosinv->cuadrada == 1) {
            $cuadrada = 'Si';
        } else {
            $cuadrada = 'No';
        }


        $cuerporeporte = '';
        $cuerporeporte
                .= '<table  border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:1cm;table-layout:fixed;">

    <tr <td colspan=500, style="text-align:CENTER" ><b>VER DETALLE DE LA INVERSI&Oacute;N </b></td> </tr>
      <tr style="text-align:LEFT" ><td colspan=100><b>C&oacute;digo:</b>&nbsp' . $parametros->datosinv->codigo . '</td> 
         &nbsp&nbsp&nbsp  <td colspan=100><b>Denominaci&oacute;n:</b>&nbsp' . $parametros->datosinv->denominacion . '</td>
              &nbsp&nbsp&nbsp  <td colspan=100><b>Clasificaci&oacute;n:</b>&nbsp' . $parametros->datosinv->clasificacion . '</td>
                   &nbsp&nbsp&nbsp  <td colspan=100><b>Tipo inversi&oacute;n:</b>&nbsp' . $parametros->datosinv->tipoinv . '</td></tr>  
                       
      <tr style="text-align:LEFT" ><td colspan=100><b>Caracter&iacute;sticas:</b>&nbsp' . $parametros->datosinv->caracteristicas . '</td> 
         &nbsp&nbsp&nbsp  <td colspan=100><b>Forma propiedad:</b>&nbsp' . $parametros->datosinv->forma . '</td>
              &nbsp&nbsp&nbsp  <td colspan=100><b>Provincia:</b>&nbsp' . $parametros->datosinv->provincia . '</td>
                   &nbsp&nbsp&nbsp  <td colspan=100><b>Fecha inicial:</b>&nbsp' . $parametros->datosinv->fechainicio . '</td></tr>
                       
      <tr style="text-align:LEFT" ><td colspan=100><b>Fecha fin:</b>&nbsp' . $parametros->datosinv->fechafin . '</td> 
         &nbsp&nbsp&nbsp  <td colspan=100><b>Objetivo:</b>&nbsp' . $parametros->datosinv->objetivo . '</td>
              &nbsp&nbsp&nbsp  <td colspan=100><b>Efecto comercial:</b>&nbsp' . $parametros->datosinv->efecto . '</td>
                  &nbsp&nbsp&nbsp  <td colspan=100><b>Aprobado:</b>&nbsp' . $aprob . '</td>
                   </tr>
                   <tr style="text-align:LEFT" >
                  <td colspan=100><b>Desempe&ntilde;o:</b>&nbsp' . $parametros->datosinv->desempenno . '</td>
                    &nbsp&nbsp&nbsp <td colspan=100><b>Programa:</b>&nbsp' . $parametros->datosinv->programa . '</td> 
                    &nbsp&nbsp&nbsp <td colspan=100><b>V&iacute;a r&aacute;pida:</b>&nbsp' . $fastt . '</td> 
                    &nbsp&nbsp&nbsp <td colspan=100><b>Cuadrada:</b>&nbsp' . $cuadrada . '</td> 
                       
        
                   </tr>';

        if (count($liquido) != 0) {
            $cuerporeporte
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:1cm;">
                        <center><tr style="text-align:center" > <b>EROGACI&Oacute;N A L&Iacute;QUIDO DE IMPORTACION </b>  </tr></center>
                        ';
        }

        foreach ($liquido as $ke => $val) {

            $cuerporeporte .= '<tr style="text-align:LEFT" >
                        <td colspan=100><b>Valor :</b>&nbsp' . $val['valor'] . '</td> 
                        &nbsp&nbsp&nbsp  <td colspan=100><b>Moneda :</b>&nbsp' . $val['moneda'] . '</td>
                  </tr> ';
        }
        $cuerporeporte .= '</table>';

        if (count($presupuesto) != 0) {
            $cuerporeporte
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:1cm;">
                        <center><tr style="text-align:center" > <b>PLAN DE PREPARACI&Oacute;N </b>  </tr></center>
                        ';
        }

        foreach ($presupuesto as $ke => $val) {

            $cuerporeporte .= '<tr style="text-align:LEFT" >
                        <td colspan=100><b>Valor :</b>&nbsp' . $val['valor'] . '</td> 
                        &nbsp&nbsp&nbsp  <td colspan=100><b>Moneda :</b>&nbsp' . $val['moneda'] . '</td>
                  </tr>  ';
        }
        $cuerporeporte .= '</table>';
        
		if (count($financiamiento) != 0) {
            $cuerporeporte
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:1cm;">
                        <center><tr style="text-align:center" > <b>FINANCIAMIENTO </b>  </tr></center>
                        ';
        }

        foreach ($financiamiento as $ke => $val) {

            $cuerporeporte .= '<tr style="text-align:LEFT" >
                        <td colspan=100><b>Qui&eacute;n financia:</b>&nbsp' . $val['financi'] . '</td> 
                        &nbsp&nbsp&nbsp  <td colspan=100><b>Como se financia:</b>&nbsp' . $val['tipo'] . '</td>
                        &nbsp&nbsp&nbsp  <td colspan=100><b>Gracia:</b>&nbsp&nbsp' . $val['gracia'] . '</td>
                        &nbsp&nbsp&nbsp  <td colspan=100><b>Porciento Inter&eacute;s:</b>&nbsp' . $val['porcientointeres'] . '</td>
                        &nbsp&nbsp&nbsp  <td colspan=100><b>Plazo de amortizaci&oacute;n:</b>&nbsp' . $val['plazoamortizacion'] . '</td>
                       &nbsp&nbsp&nbsp  <td colspan=100><b>Valor:</b>&nbsp' . $val['valor'] . '</td>
                       &nbsp&nbsp&nbsp  <td colspan=100><b>Moneda:</b>&nbsp' . $val['moneda'] . '</td>
                  </tr>';
        }
        $cuerporeporte .= '</table>';
		
//antividad/ niveles de actividad/ precio
		if (count($datosActividad) != 0) {
            $cuerporeporte
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:1cm;">
                        <center><tr style="text-align:center" > <b>NIVELES DE ACTIVIDAD</b>  </tr></center>

						<tr style="text-align:center" >
							<td colspan=100><b>Actividad</b></td> 
							<td colspan=100><b>Nivel de actividad</b></td>
							<td colspan=100><b>Importe</b></td>
						</tr>  ';
        }
						
		foreach ($datosActividad as $ke => $val) {

			$cuerporeporte .= '<tr style="text-align:LEFT" >
						<td colspan=100><b></b>&nbsp' . $val['denominacionactividad'] . '</td> 
						<td style="text-align:right"  colspan=100><b></b>&nbsp' . $val['nivel'] . '</td>
						<td style="text-align:right"  colspan=100><b></b>&nbsp&nbsp' . $val['importeactividad'] . '</td>
				  </tr>';
		}
        $cuerporeporte .= '</table>';

		
//indicador/ cantidad/ precio
        if (count($datosIndicadores) != 0) {
            $cuerporeporte
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;">
                        <center><tr style="text-align:center" > <b>INDICADORES</b>  </tr></center>
						
					<tr style="text-align:center" >
                        <td colspan=100><b>Indicador</b></td> 
                        <td colspan=100><b>Cantidad</b></td>
                        <td colspan=100><b>Importe</b></td>
					</tr> ';            
        }

        foreach ($datosIndicadores as $ke => $val) {

            $cuerporeporte .= '<tr>
                        <td colspan=100><b></b>&nbsp' . $val['denominacionindicador'] . '</td>
                        <td style="text-align:right"  colspan=100><b></b>&nbsp' . $val['cantidad'] . '</td>
                        <td style="text-align:right"  colspan=100><b></b>&nbsp&nbsp' . $val['importe'] . '</td>
                  </tr>';
        }
        $cuerporeporte .= '</table>';
		
//tarea/ fecha inicio/ fecha fin
        if (count($arrayTareas) != 0) {
            $cuerporeporte
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;">
                        <center><tr style="text-align:center" > <br><b>PROYECTO: ' . $idProy[0]['denelemento'] . '</b>  </tr></center>
						
					<tr style="text-align:center" >
                        <td colspan=100><b>Tarea</b></td> 
                        <td colspan=100><b>% Cump.</b></td>
                        <td colspan=100><b>Fecha inicio</b></td>
                        <td colspan=100><b>Fecha fin</b></td>
					</tr> ';
        }

        foreach ($arrayTareas as $ke => $val) {

            $cuerporeporte .= '<tr>
                        <td colspan=100><b></b>&nbsp' . $val['denelemento'] . '</td>
                        <td style="text-align:center"  colspan=100><b></b>&nbsp' . $val['gradocumplimiento'] . '</td>
                        <td style="text-align:right"  colspan=100><b></b>&nbsp' . $val['fechainicio'] . '</td>
                        <td style="text-align:right"  colspan=100><b></b>&nbsp&nbsp' . $val['fechafin'] . '</td>
                  </tr>';
        }
        $cuerporeporte .= '</table>';

        return $cuerporeporte;
    }
	
    public function getTareasProyecto($idproyecto, &$arrayTareas){
            $hijos = DatInversnivelactividad::getHijosInmediatos($idproyecto);
// pre_r($hijos);die;
            foreach ($hijos as $hijo) {
                    if ($hijo['idtipoelemento'] == 10) {
                            $temp = DatInversnivelactividad::getDatosTarea($hijo['idelemento']);
                            $hijo['duracionestimada'] = $temp[0]['duracionestimada'];
                            $hijo['fechainicio'] = $temp[0]['fechainicio'];
                            $hijo['fechafin'] = $temp[0]['fechafin'];
                            $hijo['horainicio'] = $temp[0]['horainicio'];
                            $hijo['horafin'] = $temp[0]['horafin'];
                            $hijo['gradocumplimiento'] = $temp[0]['gradocumplimiento'];
                            array_push($arrayTareas, $hijo);
                    }
                    self::getTareasProyecto($hijo['idelemento'], $arrayTareas);
            }
            return $arrayTareas;
    }
}