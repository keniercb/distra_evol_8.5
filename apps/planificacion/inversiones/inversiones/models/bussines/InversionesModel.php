<?php

include_once (Zend_Registry::get('config')->dir_aplication . '/planmeta/lib/PHPExcel/Classes/PHPExcel.php');
include_once (Zend_Registry::get('config')->dir_aplication . '/planmeta/lib/PHPExcel/PHPExcel/Classes/PHPExcel/IOFactory.php');

class InversionesModel extends ZendExt_Model {

    public function cargarEntidades($node, $valor) {
        ($node) ? $idEstructura = $node : $idEstructura = 0;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras($this->global->Perfil->iddominio, $idEstructura, 0, 0, 3);
        if ($idEstructuraPadre == 'undefined' && $idEstructura != '0') {
            $idEstructuraPadre = $idEstructura;
        }
        $result = array();
        foreach ($dominios as $key => $val) {
            $result[$key] = $val;
            $result[$key]['idEstructuraPadre'] = $idEstructuraPadre;
            $result[$key]['entidades_productoras'] = "";
            $result[$key]['qtip'] = $val['text'];
        }
        if ($valor != null) {
            foreach ($result as $key => $value) {
                if (stristr($value['text'], $valor) == false) {
                    unset($result[$key]);
                }
            }
            $res = array();
            $i = 0;
            foreach ($result as $key => $val) {
                $res[$i++] = $val;
            }
        }
        if ($res != null) {
            $result = $res;
        }
        return $result;
    }

    public function cargarNomencladorInversion($node, $valor) {
        $nomencladores = NomNomenclador::getNomencladores($node, $valor);

        $datos = array();
        foreach ($nomencladores as $key => $val) {
            $datos[$key]['id'] = $val['idnomenclador'];
            $datos[$key]['text'] = $val['nombrecampo'];
            $datos[$key]['leaf'] = true;
            $datos[$key]['qtip'] = $val['nombrecampo'];
        }
        return $datos;
    }

    public function buscarEspacioFactibilidadByTipoInv($idTipoInversion) {
        $espacio = DatInversion::buscarEspacioFactibilidadByTipoInv($idTipoInversion);
        return $espacio;
    }

    public function GetDocumentosFactibilidadByInversion($param) {
        $datos = DatInversion::GetDocumentosFactibilidadByInversion($param);
        return $datos;
    }

    public function verDetalles($parametros, $datosInv) {
        $datosInv['start'] = 0;
        $datosInv['limit'] = 10000;
        $datos = DatInversion::listarComponentes($datosInv);
        $cuerporeporte = $this->configurarDetalles($parametros);
        $cuerporeporte .=self::obtenerCuerpoReporte($parametros, $datos, $datosInv);


        return $cuerporeporte;
    }

    public function verCuadre($datosInv) {

        $inversion['id'] = $datosInv['idinversion'];
        /* lista el plan de preparacion de la inversion */
        $valorPlanPreparacion = DatInversion::listarPlanPresupuesto($inversion);
        /* lista los financiamineto de la inversion */
        $valorFinanciamiento = DatInversion::listarFinan($inversion);
        /* lista los valores de los componentes inversion */

        $valorComponentes = DatInversion::listarValorInversion($inversion);
//die('eee');
        $monedas = array(array('tipo' => 'CUP', 'idmoneda' => 9900000103, 'planPreparacion' => $valorPlanPreparacion, 'financiamiento' => $valorFinanciamiento, 'componentes' => $valorComponentes),
            array('tipo' => 'USD', 'idmoneda' => 9900000046, 'planPreparacion' => $valorPlanPreparacion, 'financiamiento' => $valorFinanciamiento, 'componentes' => $valorComponentes));

        //Nuevo: Cuadre de la inversion
        $cuerpocuadre = "<style type='text/css'>
                 @media all {body{display: block; background: none no-repeat scroll 100% 100% #666666;}}
                 @media print {*{visibility: visible;  padding: 0 !important; } div{ top:0; right:0; bottom:0; left:0; #AP{margin-top: 1cm;}}}

				 @page{height:700 cm;width: 200 cm;size:500;}
				 </style>";

        $cuerpocuadre .= "<div style='margin:auto;width:700 cm;height:auto;background-color:white;padding:1cm 0.5cm 1cm 0.5cm;'>";
        $cuerpocuadre .= "<div style='width:100%;'>";

        $cuerpocuadre.= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;">
                        <center><tr style="text-align:center" > <b>CUADRE DE LA INVERSI&OacuteN </b>  </tr></center>
                        </table>';

        $cuadreTotal = 'SI';
        foreach ($monedas as $key => $moneda) {
            $valPlan = 0;
            $valFinan = 0;
            $valComp = 0;

            foreach ($moneda['planPreparacion'] as $key => $p) {
                if ($p['idmoneda'] == $moneda['idmoneda']) {
                    $valPlan = $p['valor'];
                    break;
                }
            }
            foreach ($moneda['financiamiento'] as $key => $f) {
                if ($f['idmoneda'] == $moneda['idmoneda']) {
                    $valFinan = $f['sum'];
                    break;
                }
            }
            foreach ($moneda['componentes'] as $key => $c) {
                if ($c['idmoneda'] == $moneda['idmoneda']) {
                    $valComp = $c['sum'];
                    break;
                }
            }

            if ($valFinan == $valPlan + $valComp)
                $cuadrePorMoneda = 'SI';
            else {
                $cuadrePorMoneda = 'No';
                $cuadreTotal = 'NO';
            }

            $cuerpocuadre.= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:2cm;">';

            $cuerpocuadre.= '<tr>
                            <td colspan="5">&nbsp Moneda:&nbsp' . $moneda['tipo'] . '</td>
                          </tr>
                          <tr>
                            <td width="25%">&nbsp Financiamiento:</td>
                            <td width="25%">&nbsp Plan de preparaci&oacute;n: </td>
                            <td width="25%">&nbsp Componentes:</td>
                            <td width="25%">&nbsp Cuadre:</td>
                          </tr>

                          <tr>
                            <td width="25%" >&nbsp ' . $valFinan . '</td>
                            <td width="25%" >&nbsp ' . $valPlan . ' </td>
                            <td width="25%">&nbsp ' . $valComp . '</td>
                            <td width="25%">&nbsp ' . $cuadrePorMoneda . '</td>
                          </tr>';

            $cuerpocuadre.= '<table>';
        }
        $cuerpocuadre.= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:2cm;">';
        $cuerpocuadre.= '<tr>
                          <td width="25%">&nbsp INVERSI&OacuteN CUADRADA:</td>
                          <td >&nbsp ' . $cuadreTotal . ' </td>
                         </tr>';

        $cuerpocuadre.= '<table>';

        return $cuerpocuadre;
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

    public function obtenerCuerpoReporte($parametros, $datos, $datosInv) {
        $iddominio = $this->global->Perfil->iddominio;
        //print_r('entra');die;
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
                .= '<table  border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;table-layout:fixed;">
      <thead>
    <tr <td colspan=500, style="text-align:CENTER" ><b>VER DETALLE DE LA INVERSI&Oacute;N </b></td> </tr>
      <tr style="text-align:LEFT" ><td colspan=100><b>C&oacute;digo:</b>&nbsp' . $parametros->datosinv->codigo . '</td> 
         &nbsp&nbsp&nbsp  <td colspan=100><b>Denominaci&oacute;n:</b>&nbsp' . $parametros->datosinv->denominacion . '</td>
              &nbsp&nbsp&nbsp  <td colspan=100><b>Clasificaci&oacute;n:</b>&nbsp' . $parametros->datosinv->clasificacion . '</td>
                   &nbsp&nbsp&nbsp  <td colspan=100><b>Tipo INVERSI&Oacute;N:</b>&nbsp' . $parametros->datosinv->tipoinv . '</td></tr>  
                       
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
                       
        
                   </tr>
	</thead>';
        if (count($liquido) != 0) {
            $cuerporeporte
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;">
                        <center><tr style="text-align:center" > <b>EROGACION A LIQUIDO DE IMPORTACION </b>  </tr></center>
                        <thead>';
        }

        foreach ($liquido as $ke => $val) {

            $cuerporeporte .= '<tr style="text-align:LEFT" >
                        <td colspan=100><b>Valor :</b>&nbsp' . $val['valor'] . '</td> 
                        &nbsp&nbsp&nbsp  <td colspan=100><b>Moneda :</b>&nbsp' . $val['moneda'] . '</td>
                  </tr>  </thead>';
        }
        if (count($presupuesto) != 0) {
            $cuerporeporte
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;">
                        <center><tr style="text-align:center" > <b>PLAN DE PREPARACION </b>  </tr></center>
                        <thead>';
        }

        foreach ($presupuesto as $ke => $val) {

            $cuerporeporte .= '<tr style="text-align:LEFT" >
                        <td colspan=100><b>Valor :</b>&nbsp' . $val['valor'] . '</td> 
                        &nbsp&nbsp&nbsp  <td colspan=100><b>Moneda :</b>&nbsp' . $val['moneda'] . '</td>
                  </tr>  </thead>';
        }
        if (count($financiamiento) != 0) {
            $cuerporeporte
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;">
                        <center><tr style="text-align:center" > <b>FINANCIAMIENTO </b>  </tr></center>
                        <thead>';
        }

        foreach ($financiamiento as $ke => $val) {

            $cuerporeporte .= '<tr style="text-align:LEFT" >
                        <td colspan=100><b>Qui&eacute;n financia :</b>&nbsp' . $val['financi'] . '</td> 
                        &nbsp&nbsp&nbsp  <td colspan=100><b>Como se financia :</b>&nbsp' . $val['tipo'] . '</td>
                        &nbsp&nbsp&nbsp  <td colspan=100><b>Gracia</b>&nbsp&nbsp' . $val['gracia'] . '</td>
                        &nbsp&nbsp&nbsp  <td colspan=100><b>Porciento Inter&eacute;s :</b>&nbsp' . $val['porcientointeres'] . '</td>
                        &nbsp&nbsp&nbsp  <td colspan=100><b>Plazo de amortizaci&oacute;n :</b>&nbsp' . $val['plazoamortizacion'] . '</td>
                       &nbsp&nbsp&nbsp  <td colspan=100><b>Valor :</b>&nbsp' . $val['valor'] . '</td>
                       &nbsp&nbsp&nbsp  <td colspan=100><b>Moneda :</b>&nbsp' . $val['moneda'] . '</td>
                  </tr>  </thead>';
        }


        foreach ($datos as $key => $val) {
            $cuerporeporte
                    .= '<table border="0" bordercolor="white"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">
      <thead>
	</thead>';
            $cuerporeporte
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;table-layout:fixed;">
                        <trstyle="text-align:CENTER" ><b> COMPONENTE:</b>&nbsp ' . $val['denominacion'] . '  </tr>
      <thead>';
            $cuerporeporte
                    .= '<tr style="text-align:LEFT" ><td width="' . 120 / 20 . '%"colspan=100><b>Denominaci&oacute;n :</b>&nbsp' . $val['denominacion'] . '</td> 
               &nbsp&nbsp&nbsp  <td width="' . 120 / 20 . '%" colspan=100><b> Orden :</b>&nbsp' . $val['orden'] . '</td>
         &nbsp&nbsp&nbsp  <td width="' . 120 / 20 . '%" colspan=100><b>Estado :</b>&nbsp' . $val['estado'] . '</td>
         </tr>          
</thead>';

            $datosInv ['idcomponente'] = $val['idetapa'];
            $dato = DatInversion::listarElementos($datosInv);

            if (count($dato->data) != 0) {
                $cuerporeporte
                        .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;">
                        <center><tr style="text-align:center" > <b>ELEMENTOS </b>  </tr></center>
                        <thead>';
            }

            /*  foreach ($dato->data as $val) {
              if ($val['documento'] == 1) {
              $doc = 'Si';
              } else {
              $doc = 'No';
              }
              if ($val['parametrosdinamicos'] == 1) {
              $par = 'Si';
              } else {
              $par = 'No';
              }
              $idcontenido = DatElementodocgestordoc::contenidoPorIdEle($val['idetapaelementoinversion']);
              $array[0] = $idcontenido[0]['idcontenido'];
              $espacio = $this->integrator->gestordocumental->obtenerContenidos($array, $iddominio, $datosInv['identidad']);
              if ($espacio['espacioactual'][0] != "") {
              $cuerporeporte .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;">
              <center><tr style="text-align:center" > <b>Documentos</b>  </tr></center>
              <thead>';
              foreach ($contendio as $va) {
              $cuerporeporte .= '<tr style="text-align:LEFT" >
              <td width="' . 100 / 25 . '%"colspan=100><b>' . $va['name'] . ' :</b>&nbsp </td>
              </tr>';
              }
              }
              $cuerporeporte .= '<tr style="text-align:LEFT" >
              <td width="' . 100 / 25 . '%"colspan=100><b>Denominaci&oacute;n :</b>&nbsp' . $val['denominacion'] . '</td>
              &nbsp&nbsp&nbsp  <td width="' . 100 / 25 . '%" colspan=100><b>Documento :</b>&nbsp' . $doc . '</td>
              &nbsp&nbsp&nbsp  <td width="' . 100 / 25 . '%"colspan=100><b>P�rametros din�micos :</b>&nbsp' . $par . '</td>
              </tr>  </thead>';
              } */
        }


        return $cuerporeporte;
    }

    public function parametrosDinamicosColumnas($idtabla, $idelemento) {
        try {
            if ($idtabla != "") {
                $parmDinamic = self::obtenerDatosColumnasDinamicas($idtabla, $idelemento);
                $result = $this->_meta->Metadata()->obtenerConfigGridPanel($idtabla);
            }
            return $result;
        } catch (Exception $e) {
            return 0;
        }
    }

    public function parametrosDinamicosDatos($idtabla, $idelemento) {
        try {
            if ($idtabla != "") {
                $resultado = self::obtenerDatosColumnasDinamicas($idtabla, $idelemento);
            }
            return $resultado;
        } catch (Exception $e) {
            return 0;
        }
    }

    public function verPresup($parametros, $datosInv) {
        $idinversion = $parametros->idinversion;
        $datosInv['start'] = 0;
        $datosInv['limit'] = 10000;
        $datos = DatInversion::listarVerPre($datosInv);

        foreach ($datos as $key => $val) {
            $moneda = $this->integrator->datosmaestros->buscarMonedaPorIdMonedaentidad($val['idmonedaentidad']);

            $datos[$key]['moneda'] = $moneda->NomMoneda['codigoiso'];
            $datos[$key]['valor'] = number_format($val['valor'], '2', '.', ',');
        }

        $cuerporeporte = $this->configurarDetallesP($parametros);
        $cuerporeporte .=self::obtenerCuerpoReportePresupuesto($parametros, $datos, $datosInv);


        return $cuerporeporte;
    }

    public function configurarDetallesP($parametros) {
        $cuerporeporte = "<style type='text/css'>
                 @media all {body{display: block; background: none no-repeat scroll 100% 100% #666666;}}
                 @media print {*{visibility: visible;  padding: 0 !important; } div{ top:0; right:0; bottom:0; left:0; #AP{margin-top: 1cm;}}}
                 
				 @page{height:700 cm;width: 200 cm;size:500;}
				 </style>";

        $cuerporeporte .= "<div style='margin:auto;width:
                700 cm;height:auto;background-color:white;padding:1cm 0.5cm 1cm 0.5cm;'>";
        $cuerporeporte .= "<div style='width:100%;'>";


        return $cuerporeporte;
    }

    public function obtenerCuerpoReportePresupuesto($parametros, $datos, $datosInv) {

        $presupuesto = InversionesModel::listarP($datosInv);
        foreach ($presupuesto as $ke => $val) {
            $presupuesto[0]['den'] = 'PLAN DE PREPARACI&Oacute;N';
            //$presupuesto[$ke]['valor'] = number_format($val['valor'], '0', '.', ',');
            $presupuesto[$ke]['valor'] = $val['valor'];
        }

        $dat = DatInversion::listarTotalP($datosInv);
        $data = DatInversion::listarTotal($datosInv);

        foreach ($data as $key => $va) {
            $moneda = $this->integrator->datosmaestros->buscarMonedaPorIdMonedaentidad($va['idmonedaentidad']);
            //print_r($moneda);die('de');
            $data[$key]['denmoneda'] = $moneda->NomMoneda['codigoiso'];
            $data[0]['total'] = 'TOTAL';
        }
        $array = array_merge($dat, $data);

        $cuerporeporte = '';
        $cuerporeporte
                .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;table-layout:fixed;">
      <thead>
	</thead>';

        if (count($presupuesto) != 0) {
            $cuerporeporte
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;">
                        <center><tr style="text-align:center" > <b>DETALLE DEL PRESUPUESTO </b>  </tr></center>
                        <thead>';
        }
        $cuerporeporte .= '<tr style="text-align:LEFT;background-color:#BBBBBB;" >
                     <td width=30"%"colspan=100><b>COMPONENTE</b>&nbsp</td> 
                        <td width=30"%"colspan=100; align=center><b>Valor</b>&nbsp</td> 
                        &nbsp&nbsp&nbsp  <td width=30"%"colspan=100; align=center><b>Moneda</b>&nbsp</td>
                  </tr>  </thead>';

        //print_r($presupuesto);die;
        $presupuestoTotalCUP = 0;
        $presupuestoTotalUSD = 0;



        foreach ($presupuesto as $ke => $val) {
            //print_r($val);die;
            if ($val['moneda'] == 'CUP') {
                $presupuestoTotalCUP += $val['valor'];
                //print_r('entra cup');die;
            }

            if ($val['moneda'] == 'USD') {
                //print_r('entra usd');die;
                $presupuestoTotalUSD += $val['valor'];
            }

            if ($val['den'] != null) {
                $cuerporeporte .= '<tr style="text-align:LEFT;background-color:#DDDDDD;" >
                     <td width=30"%"colspan=100><b></b>&nbsp' . $val['den'] . '</td> 
                        <td width=30"%"colspan=100; align=right><b></b>&nbsp' . $val['valor'] . '</td> 
                        &nbsp&nbsp&nbsp  <td width=30"%"colspan=100; align=right><b></b>&nbsp' . $val['moneda'] . '</td>
                  </tr>  </thead>';
            } else {
                $cuerporeporte .= '<tr style="text-align:LEFT" >
                     <td width=30"%"colspan=100></td> 
                        <td width=30"%"colspan=100; align=right><b></b>&nbsp' . $val['valor'] . '</td> 
                        &nbsp&nbsp&nbsp  <td width=30"%"colspan=100; align=right><b></b>&nbsp' . $val['moneda'] . '</td>
                  </tr>  </thead>';
            }
        }
        //print_r($datos);die;

        $denominacion = '';
        foreach ($datos as $key => $val) {

            //print_r($val);die;

            $valor = str_replace(',', '', $val['valor']);


            if ($val['moneda'] == 'CUP')
                $presupuestoTotalCUP += $valor;
            if ($val['moneda'] == 'USD')
                $presupuestoTotalUSD += $valor;


            if ($denominacion != $val['denominacion']) {
                $denotabla = $val['denominacion'];
                $denominacion = $val['denominacion'];
                $cuerporeporte
                        .= '<tr style="text-align:LEFT;background-color:#DDDDDD;" >
                        <td width=30"%"colspan=100><b></b>&nbsp' . $denotabla . '</td> 
                        <td width=30"%"colspan=100; align=right><b></b>&nbsp' . $valor . '</td>
                       <td width=30"%"colspan=100; align=right><b></b>&nbsp' . $val['moneda'] . '</td>
                       
                       
         </tr>          
        </thead>';


                $cuerporeporte .= ' </thead>';
            } else {
                $denotabla = '';
                $cuerporeporte
                        .= '<tr style="text-align:LEFT" >
                       <td width=30"%"colspan=100></td>
                        <td width=30"%"colspan=100; align=right><b></b>&nbsp' . $valor . '</td>
                       <td width=30"%"colspan=100; align=right><b></b>&nbsp' . $val['moneda'] . '</td>
                       
                       
         </tr>          
        </thead>';


                $cuerporeporte .= ' </thead>';
            }
        }
        //print_r($presupuestoTotalCUP);die;
        $totalesNuevo = array(array('total' => 'TOTAL', 'valorT' => $presupuestoTotalCUP, 'moneda' => 'CUP'), array('total' => '', 'valorT' => $presupuestoTotalUSD, 'moneda' => 'USD'));

        $nuevo = array();
        foreach ($array as $parte) {
            $clave[] = $parte['idmonedaentidad'];
        }
        $unico = array_unique($clave);

        foreach ($unico as $un) {
            foreach ($array as $original) {
                if ($un == $original['idmonedaentidad']) {
                    $suma = $suma + $original['sum'];
                }
            }
            $ele['idmonedaentidad'] = $un;
            $ele['sumatotal'] = $suma;
            array_push($nuevo, $ele);
            $suma = 0;
        }
        foreach ($nuevo as $key => $v) {
            $moneda = $this->integrator->datosmaestros->buscarMonedaPorIdMonedaentidad($v['idmonedaentidad']);
            $nuevo[$key]['denmoneda'] = $moneda->NomMoneda['codigoiso'];
            $nuevo[0]['total'] = 'TOTAL';
            $nuevo[$key]['sumatotal'] = number_format($v['sumatotal'], '2', '.', ',');
        }
        /* foreach ($nuevo as $key => $valores) {
          $moneda = $this->integrator->datosmaestros->buscarMonedaPorIdMonedaentidad($valores['idmonedaentidad']);
          $nuevo[$key]['denmoneda'] = $moneda->NomMoneda['codigoiso'];
          $nuevo[0]['total'] = 'TOTAL';

          //print_r($valores);die;

          if ($valores['total'] != null) {
          $cuerporeporte
          .= '<tr style="text-align:LEFT;background-color:#DDDDDD;" >
          <td width=30"%"colspan=100><b>&nbsp' . $valores['total'] . '</b></td>
          <td width=30"%"colspan=100; align=right><b>&nbsp' . $valores['sumatotal'] . '</b></td>
          <td width=30"%"colspan=100; align=right><b>&nbsp' . $valores['denmoneda'] . '</b></td>

          </tr>
          </thead>';

          $cuerporeporte .= ' </thead>';
          } else {
          $cuerporeporte
          .= '<tr style="text-align:LEFT" >
          <td width=30"%"colspan=100></td>
          <td width=30"%"colspan=100; align=right><b>&nbsp' . $valores['sumatotal'] . '</b></td>
          <td width=30"%"colspan=100; align=right><b>&nbsp' . $valores['denmoneda'] . '</b></td>
          </tr>
          </thead>';

          $cuerporeporte .= ' </thead>';
          }
          } */

        foreach ($totalesNuevo as $key => $total) {
            if ($total['total'] != '') {
                $cuerporeporte
                        .= '<tr style="text-align:LEFT;background-color:#DDDDDD;" >
                        <td width=30"%"colspan=100><b>&nbsp' . $total['total'] . '</b></td>
                         <td width=30"%"colspan=100; align=right><b>&nbsp' . number_format($total['valorT'], '2', '.', ',') . '</b></td>
                        <td width=30"%"colspan=100; align=right><b>&nbsp' . $total['moneda'] . '</b></td>

         </tr>
        </thead>';

                $cuerporeporte .= ' </thead>';
            } else {
                $cuerporeporte
                        .= '<tr style="text-align:LEFT" >
                        <td width=30"%"colspan=100></td>
                         <td width=30"%"colspan=100; align=right><b>&nbsp' . number_format($total['valorT'], '2', '.', ',') . '</b></td>
                        <td width=30"%"colspan=100; align=right><b>&nbsp' . $total['moneda'] . '</b></td>
         </tr>
        </thead>';

                $cuerporeporte .= ' </thead>';
            }
        }




        return $cuerporeporte;
    }

    public function ListarMonedas($params) {
        $monedas = $this->integrator->datosmaestros->obtenerMonedasPorEntidad($params['identidad']);
        $array = $monedas['datos'];

        $index = 0;
        foreach ($array as $key => $val) {
            //print_r($val);die;
            if ($params['idmonedaentidad']) {
                if (!in_array($val['idmonedaentidad'], $params['idmonedaentidad'])) {
                    $mo[$index]['denominacion'] = $val['nombremoneda'];
                    $mo[$index]['idmoneda'] = $val['idmonedaentidad'];
                    $index+=1;
                }
            } else {
                $mo[$index]['denominacion'] = $val['nombremoneda'];
                $mo[$index]['idmoneda'] = $val['idmonedaentidad'];
                $index+=1;
            }
        }
        $result['data'] = $mo;
        return $result;
    }

    public function listarTodosDatosMoneda($params) {

        $monedas = DatInversion::obtenerMonedasPorEntidad($params['identidad']);
        //print_r($monedas);die;
        //$array = $monedas['datos'];

        foreach ($monedas as $key => $val) {
            //print_r($val);die;
            $mo[$key]['denominacion'] = $val['nombremoneda'];
            $mo[$key]['idmonedaentidad'] = $val['idmonedaentidad'];
            $mo[$key]['moneda'] = $val['codigoiso'];
        }
        $result['data'] = $mo;
        return $result;
    }

    public function verFinan($parametros, $datosInv) {
        $idinversion = $parametros->idinversion;
        $datosInv['start'] = 0;
        $datosInv['limit'] = 10000;
        $cuerporeporte = $this->configurarDetallesF($parametros);
        $cuerporeporte .=self::obtenerCuerpoReporteFinanciamiento($parametros, $datos, $datosInv);


        return $cuerporeporte;
    }

    public function configurarDetallesF($parametros) {
        $cuerporeporte = "<style type='text/css'>
                 @media all {body{display: block; background: none no-repeat scroll 100% 100% #666666;}}
                 @media print {*{visibility: visible;  padding: 0 !important; } div{ top:0; right:0; bottom:0; left:0; #AP{margin-top: 1cm;}}}
                 
				 @page{height:700 cm;width: 200 cm;size:500;}
				 </style>";

        $cuerporeporte .= "<div style='margin:auto;width:
                700 cm;height:auto;background-color:white;padding:1cm 0.5cm 1cm 0.5cm;'>";
        $cuerporeporte .= "<div style='width:100%;'>";


        return $cuerporeporte;
    }

    public function obtenerCuerpoReporteFinanciamiento($parametros, $datos, $datosInv) {
        $financiamiento = InversionesModel::listarF($datosInv);
        foreach ($financiamiento as $key => $v) {
            $financiamiento[$key]['valor'] = number_format($v['valor'], '2', '.', ' ');
        }
        $data = DatInversion::listarTotalF($datosInv);
        foreach ($data as $key => $va) {
            $moneda = $this->integrator->datosmaestros->buscarMonedaPorIdMonedaentidad($va['idmonedaentidad']);
            $data[$key]['denmoneda'] = $moneda->NomMoneda['codigoiso'];
            $data[$key]['sum'] = number_format($va['sum'], '2', '.', ' ');
            $data[0]['total'] = 'TOTAL';
        }
        $cuerporeporte = '';
        $cuerporeporte
                .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;table-layout:fixed;">
      <thead>
	</thead>';

        if (count($financiamiento) != 0) {
            $cuerporeporte
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;">
                        <center><tr style="text-align:center" > <b>DETALLE DEL FINANCIAMIENTO </b>  </tr></center>
                        <thead>';
        }
        $cuerporeporte .= '<tr style="text-align:LEFT;background-color:#BBBBBB " >
                     <td colspan=100><b>Qui&eacute;n Financia</b>&nbsp</td> 
                     <td colspan=100><b>C&oacute;mo se financia</b>&nbsp</td>
                    &nbsp&nbsp&nbsp  <td colspan=100; align=center><b>Gracia</b>&nbsp</td>
                    &nbsp&nbsp&nbsp  <td colspan=100; align=center><b>Porciento Inter&eacute;s</b>&nbsp</td>
                    &nbsp&nbsp&nbsp  <td colspan=100; align=center><b>Plazo</b>&nbsp</td>
                    &nbsp&nbsp&nbsp  <td colspan=100; align=center><b>Valor</b>&nbsp</td>
                    &nbsp&nbsp&nbsp  <td colspan=100; align=center><b>Moneda</b>&nbsp</td>
                  </tr>  </thead>';

        foreach ($financiamiento as $ke => $val) {
            $cuerporeporte .= '<tr style="text-align:LEFT" >
                        <td colspan=100>&nbsp' . $val['financi'] . '</td> 
                        &nbsp&nbsp&nbsp  <td colspan=100>&nbsp' . $val['tipo'] . '</td>
                       &nbsp&nbsp&nbsp  <td colspan=100; align=right>&nbsp' . $val['gracia'] . '</td>
                        &nbsp&nbsp&nbsp  <td colspan=100; align=right>&nbsp' . $val['porcientointeres'] . '</td>
                        &nbsp&nbsp&nbsp  <td colspan=100; align=right>&nbsp' . $val['plazoamortizacion'] . '</td>
                       &nbsp&nbsp&nbsp  <td colspan=100; align=right>&nbsp' . $val['valor'] . '</td>
                       &nbsp&nbsp&nbsp  <td colspan=100; align=right></b>&nbsp' . $val['moneda'] . '</td>
                  </tr>  </thead>';
        }
        foreach ($data as $key => $value) {
            if ($value['total'] != null) {
                $cuerporeporte
                        .= '<tr style="text-align:LEFT;background-color:#DDDDDD" >
                         <td colspan=100></td>
                         <td colspan=100></td>
                         <td colspan=100></td>
                         <td colspan=100></td>
                         <td colspan=100><b>&nbsp' . $value['total'] . '</b></td> 
                        <td width="%"colspan=100; align=right><b>&nbsp' . $value['sum'] . '</b></td> 
                        <td width="%"colspan=100; align=right><b>&nbsp' . $value['denmoneda'] . '</b></td>
         </tr>          
        </thead>';


                $cuerporeporte .= ' </thead>';
            } else {
                $cuerporeporte
                        .= '<tr style="text-align:LEFT" >
                         <td colspan=100></td>
                         <td colspan=100></td>
                         <td colspan=100></td>
                         <td colspan=100></td>
                         <td colspan=100></td> 
                        <td width="%"colspan=100; align=right><b>&nbsp' . $value['sum'] . '</b></td> 
                        <td width="%"colspan=100; align=right><b>&nbsp' . $value['denmoneda'] . '</b></td>
         </tr>          
        </thead>';


                $cuerporeporte .= ' </thead>';
            }
        }
        return $cuerporeporte;
    }

    public function reporteViviendaHabitacion($parametros) {

        $cuerporeporte = $this->configurarDetallesR($parametros);


        $cuerporeporte .=self::obtenerCuerpoReporteVH($parametros);


        return $cuerporeporte;
    }

    public function configurarDetallesR($parametros) {

        $cuerporeporte = "<style type='text/css'>
                 @media all {body{display: block; background: none no-repeat scroll 100% 100% #66666;}}
                 @media print {*{visibility: visible;  padding: 0 !important; } div{ top:0; right:0; bottom:0; left:0; #AP{margin-top: 1cm;}}}
                 
				 @page{height:700 cm;width: 200 cm;size:500;}
				 </style>";

        $cuerporeporte .= "<div style='margin:auto;width:
                700 cm;height:auto;background-color:white;padding:1cm 0.5cm 1cm 0.5cm;'>";
        $cuerporeporte .= "<div style='width:100%;'>";

        return $cuerporeporte;
    }

    public function cargarEntHijas($idorganismo, $text) {
//pre_r($idorganismo);
//pre_r($text);die;
        $entidades = array();
        if ($idorganismo == "") {
            return $entidades;
        } else {
//pre_r($idorganismo);
            $dominios = $this->integrator->metadatos->DameHijosEstructura($idorganismo);
//pre_r(count($dominios));die;
            if ($dominios[0] != "") {
                foreach ($dominios as $key => $k) {
                    $entidades_hijas = array();
                    $entidades_hijas = self::entidadesHijas($k->id, $k->text);
                    $entidades = array_merge($entidades_hijas, $entidades);
                }
                $entidades[count($entidades)]['identidad'] = $idorganismo;
                $entidades[count($entidades) - 1]['entidad'] = $text;
            }
            return $entidades;
        }
    }

    public function idcargarEntHijas($idorganismo) {
        $entidades = array();
        if ($idorganismo == "") {
            return $entidades;
        } else {
            $dominios = $this->integrator->metadatos->DameHijosEstructura($idorganismo);
            if ($dominios[0] != "") {
                foreach ($dominios as $key => $k) {
                    $entidades_hijas = array();
                    $entidades_hijas = self::entidadesHijas($k->id, $k->text);
                    $entidades = array_merge($entidades_hijas, $entidades);
                }
                $entidades[count($entidades)]/* ['identidad'] */ = $idorganismo;
                //$entidades[count($entidades) - 1]['entidad'] = $text;
            }
            //print_r($entidades);die;
            return $entidades;
        }
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
                // $entidades_hijas[] = $entidad_hija->id;
                $entidades_hijas = array_merge($entidades_hijas, self::entidadesHijas($entidad_hija->id, $entidad_hija->text));
            }
        }
        return $entidades_hijas;
    }

    public function dadoArrayEntidades($idOrganismo, $text, $arrayEntidades) {
        $dominios = $this->integrator->metadatos->DameHijosEstructura($idOrganismo);
        $entidades_result = array();
        foreach ($dominios as $key => $entidad_hija) {
            foreach ($arrayEntidades as $key => $ent) {
                if ($entidad_hija->id == $ent) {
                    $entidades_result[count($entidades_result)]['identidad'] = $entidad_hija->id;
                    $entidades_result[count($entidades_result) - 1]['entidad'] = $entidad_hija->text;
                }
            }
        }
        $entidades_result[count($entidades_result)]['identidad'] = $idOrganismo;
        $entidades_result[count($entidades_result) - 1]['entidad'] = $text;
        return $entidades_result;
    }

    public function obtenerCuerpoReporteVH($parametros) {
        $nuevo = array();
        $identidades = array();
        $arrayEnt = array();
        $arrayDen = array();
        $array1 = array();
        $array2 = array();
        if ($parametros['reporte'] == 1) {
            $nuevo[0]['descripcion'] = 'Descripci&oacuten';
            $nuevo[0]['habita'] = 'Viviendas';
            $tipo = 'VIVIENDAS';
        } else if ($parametros['reporte'] == 0) {
            $nuevo[0]['descripcion'] = 'Descripci&oacuten';
            $nuevo[0]['habita'] = 'Habitaciones nuevas';
            $tipo = 'HABITACIONES';
        }


        $organismoden = explode(",", $parametros['organismoden']);
        $organismo = explode(",", $parametros['idorganismo']);
        if ($parametros['idorganismo'] != "") {
            foreach ($organismoden as $ka => $valor) {
                $array1[] = $valor;
            }
            foreach ($organismo as $ka => $valor) {
                $array2[] = $valor;
            }
        }
        for ($i = 0; $i < count($array1); $i++) {
            $fin[$i]['denominacion'] = $array1[$i];
            $fin[$i]['id'] = $array2[$i];
        }


        $fecha = date("d-m-Y");
        $hoy = date("H:i:s");
        $cuerporeporte = '';

        $cuerporeporte
                .= '<table border="2" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;">
                        <center><tr width="%"colspan=100><b>' . $tipo . ' </b>  </tr></center>
                        <thead>';


        $cuerporeporte
                .= '<table bordercolor="white"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;table-layout:fixed;">
   
         <thead>
         <tr <td><b>PLAN:</b>&nbsp' . $parametros['idejercicioden'] . '</td> </tr>
          <br></br> 
	 </thead>';

        $cuerporeporte
                .= '<table bordercolor="white"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;table-layout:fixed;">
   
         <thead>
         <tr <td><b>MINISTERIO DE ECONOM&IacuteA Y PLANIFICACI&OacuteN</b></td> </tr>
          <br></br> 
	 </thead>';
        $cuerporeporte
                .= '<table bordercolor="white"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;table-layout:fixed;">
   
         <thead>
           <tr style="text-align:RIGHT" ><td colspan=""><b>Fecha:</b>&nbsp' . $fecha . '
               &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<b>Hora:</b>&nbsp' . $hoy . '</td> </tr>   
              <br></br> 
	 </thead>';
        $cuerporeporte
                .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;table-layout:fixed;">
   
         <thead>
         <tr <td><b>Observaciones:</b></td> 
         <td colspan=100>&nbsp' . $parametros['observacion'] . '</td> 
             </tr>
          
	 </thead>';

        $cuerporeporte
                .= '<table border="1" bordercolor="black" width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;table-layout:fixed;">
         <thead>
         <tr </tr>
          <br></br> 
	 </thead>';
        foreach ($nuevo as $key => $value) {
            $cuerporeporte .= '<tr style="text-align:CENTER ;background: none" >
                     <td colspan=100><b>' . $value['descripcion'] . '</b>&nbsp</td> 
                     <td colspan=50; align=center><b>' . $value['habita'] . '</b>&nbsp</td> 
                 
                  </tr>  </thead>';
        }
        foreach ($fin as $key => $val) {
            $sumOrganis = 0;
            $IdOrganismo = $val['id'];
            if ($parametros['identidad'] != null) {
                $IDEntidades = explode(",", $parametros['identidad']);
                $idSeleccionadas = self::dadoArrayEntidades($val['id'], $val['denominacion'], $IDEntidades); //ENTIDADES HIJAS seleccionadas
                if (count($idSeleccionadas) > 1) {
                    $identidades = array();
                    $idestructuras = $idSeleccionadas;
                    foreach ($idestructuras as $key => $value) {
                        $identidades[$key] = $value['identidad'];
                    }
                } else {
                    $identidades = array();
                    $idestructuras = self::cargarEntHijas($val['id'], $val['denominacion']); //ENTIDADES HIJAS
                    foreach ($idestructuras as $key => $value) {
                        $identidades[$key] = $value['identidad'];
                    }
                }
            } else {
                $identidades = array();
                $idestructuras = self::cargarEntHijas($val['id'], $val['denominacion']); //ENTIDADES HIJAS
                foreach ($idestructuras as $key => $value) {
                    $identidades[$key] = $value['identidad'];
                }
            }



            if (count($identidades) > 0) {
                $sumOrganis = DatInversion::sumaTotal($parametros, $identidades); //SUMA TOTAL DEL ORGANISMO
            } else {
                $sumOrganis[0]['sum'] = 0; //SUMA TOTAL DEL ORGANISMO
            }


            $InversionesOrg = DatInversion::listarInversionesPorIdOr($parametros, $val['id']); //inversiones del organismo


            if (count($InversionesOrg) > 0) {
                $ent[] = $val['id'];
                $sumOrg = DatInversion::sumaTotal($parametros, $ent); //SUMA  ORGANISMO
                $cuerporeporte
                        .= '<tr style="text-align:LEFT; background: #CCFFCC" >
                   <td colspan=100><b>' . 'Entidad - ' . $val['denominacion'] . '</b></td> 
                   <td colspan=50; align=right><b>' . number_format($sumOrg[0]['sum'], '2', '.', ' ') . '</b></td> 
                   </tr>          
                   </thead>';
            }
            foreach ($InversionesOrg as $key => $value) {
                $sumaorganimso+=$value['plan'];
                $cuerporeporte
                        .= '<tr style="text-align:LEFT" >
              <td colspan=100>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' . $value['denominacion'] . '</td> 
              <td colspan=50; align=right>' . number_format($value['plan'], '2', '.', '0') . '</td> 
              </tr>          
              </thead>';
            }

            foreach ($idestructuras as $key => $value) {
                if ($IdOrganismo != $value['identidad']) {

                    $arrayEnt[0] = $value['identidad'];
                    $sumaEntidad = DatInversion::listarSumaEntidades($parametros, $arrayEnt); //inversiones del entidad
                    $InversionesEnt = DatInversion::listarInversionesPorIdOr($parametros, $value['identidad']); //inversiones de la entidad

                    if (count($InversionesEnt) > 0) {
                        $cuerporeporte
                                .= '<tr style="text-align:LEFT; background: #CCFFCC " >
              <td colspan=100><b>&nbsp&nbsp&nbsp' . 'Entidad - ' . $value['entidad'] . '</b></td> 
              <td colspan=50; align=right><b>' . number_format($sumaEntidad[0]['sum'], '2', '.', ' ') . '</b></td> 
              </tr>          
              </thead>';
                    }

                    foreach ($InversionesEnt as $key => $value) {
                        $sumaentidades+=$value['plan'];
                        $cuerporeporte
                                .= '<tr style="text-align:LEFT" >
              <td colspan=100>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' . $value['denominacion'] . '</td> 
              <td colspan=50; align=right>' . number_format($value['plan'], '2', '.', ' ') . '</td> 
              </tr>          
              </thead>';
                    }
                }
            }
            $cuerporeporte
                    .= '<tr style="text-align:LEFT; background: #DCDDD9" >
                   <td colspan=100><b>' . 'Total del organismo ' . $val['denominacion'] . '</b></td> 
                   <td colspan=50; align=right><b>' . number_format($sumOrganis[0]['sum'], '2', '.', ' ') . '</b></td> 
                   </tr>          
                   </thead>';
        }
        $sumatotal = $sumaentidades + $sumaorganimso;
        $cuerporeporte
                .= '<tr style="text-align:right; font-size:16px; background: #DCDDD9 !important" >
                   <td colspan=100; align=left><b>TOTAL</b></td> 
                   <td colspan=50; align=right><b>' . number_format($sumatotal, '2', '.', ' ') . '</b></td> 
                   </tr>          
                   </thead>';
        $cuerporeporte

                .= '<table bordercolor="white"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;table-layout:fixed;">
         <thead>
         <tr </tr>
          <br></br> 
	 </thead>';

        $cuerporeporte
                .= '<table bordercolor="white"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;table-layout:fixed;">
   
         <thead>
         <tr <td><b>Elaborado por:</b>&nbsp' . $parametros['elaboradopor'] . '</td>
             </tr>
             <br></br>
             <tr <td><b>Aprobado por:</b>&nbsp' . $parametros['aprobadopor'] . '</td>
             </tr>
          <br></br> 
	 </thead>';
        return $cuerporeporte;
    }

    public function adicionarInversiones($params, $idUser) {
        $fina = json_decode(stripslashes($params['financiamiento']));
        $presu = json_decode(stripslashes($params['presupuesto']));
        $liqui = json_decode(stripslashes($params['liquido']));
        $arre = Array();
        $arrep = Array();
        $arrel = Array();
        if ($params['idinversion'] != 0) {
            //ACCION MODIFICAR INVERSION
            $objInv = Doctrine::getTable('DatInversion')->find($params['idinversion']);

            $acc = 'modificar';
            $tabla = "dat_inversion";
            $des = "Se ha modificado la inversión: ". $objInv->codigo;
            $inversion = $params['denominacion'];
            $idestructura = $params['idespecialidad'];
            
            
            
            $denom = "Se ha modificado la inversión: " . $objInv->codigo;
            $params['id'] = DatInversion::adicionarInversiones($params, $objInv);

            if ($params['changeClasif'] == 'true') {//SE BORRAN LAS ETAPAS Y ELEMENTOS DE LA CLASIFICACION CAMBIADA
                $des = $des . " Se modificó la clasificación, se eliminó todos los datos de los componentes";
                $denom = $denom . " Se modificó la clasificación, se eliminó todos los datos de los componentes";
                InversionesModel::modClasificacion($params, $objInv);
            }
        } else {
            //ACCION ADICIONAR INVERSION
            $acc = 'adicionar';
            $tabla = "dat_inversion";
            $des = "Se ha adicionado la inversión: ". $objInv->codigo;


            $params['codigo'] = self::getCodigoInversion($params['ejercicio'], $params['idespecialidad'], $params['idejercicio']);
            $denom = "Se ha adicionado la inversión: ". $objInv->codigo;

            $params['id'] = DatInversion::adicionarInversiones($params);
            InversionesModel::addCmpInvElement($params, $params['id']);
        }
        foreach ($fina as $key => $dat) {

            if ($dat->idfinanciamiento) {
                if ($params['idinversion'] != 0) {
                    $tipo = is_numeric($dat->tipo) ? $dat->tipo : $dat->idtipofinanciamiento;
                    $financista = is_numeric($dat->financi) ? $dat->financi : $dat->idfinancista;
                    $devolverFinanciamt = DatFinanciamiento::buscarfinanDadoTipoF($dat->idfinanciamiento);
                    $devolverF = DatFinanciamiento::buscartipoF($tipo, $params['idinversion']);
                    if ($devolverF[0] != '') {
                        if ($dat->plazoamortizacion != $devolverFinanciamt[0]['plazoamortizacion'] || $dat->gracia != $devolverFinanciamt[0]['gracia'] || (is_numeric($dat->moneda) && $dat->idmoneda != $devolverFinanciamt[0]['idmonedaentidad']) || $dat->porcientointeres != $devolverFinanciamt[0]['porcientointeres'] || (is_numeric($dat->financi) && $dat->financi != $devolverFinanciamt[0]['idfinancista']) || (is_numeric($dat->tipo) && $dat->tipo != $devolverFinanciamt[0]['idtipofinanciamiento'])) {

                            $del9 = DatInversfinancejecutado::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $params['idinversion']);
                            $del1 = DatInversfinancestimado::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $params['idinversion']);
                            $del2 = DatInversfinancplan::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $params['idinversion']);
                            $del3 = DatInversfinancproyectado::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $params['idinversion']);
                        }
                    } else if ($devolverFinanciamt[0]['idtipofinanciamiento'] != $tipo) {
                        if ($dat->porcientointeres > 0) {
                            $act9 = DatInversfinancejecutado::actualizarTipoFinanc($params['idinversion'], $tipo, $devolverFinanciamt[0]['idtipofinanciamiento']);
                            $act8 = DatInversfinancestimado::actualizarTipoFinanc($params['idinversion'], $tipo, $devolverFinanciamt[0]['idtipofinanciamiento']);
                            $act7 = DatInversfinancplan::actualizarTipoFinanc($params['idinversion'], $tipo, $devolverFinanciamt[0]['idtipofinanciamiento']);
                            $act6 = DatInversfinancproyectado::actualizarTipoFinanc($params['idinversion'], $tipo, $devolverFinanciamt[0]['idtipofinanciamiento']);
                        }
                    }


                    if ($devolverFinanciamt[0]['idfinancista'] != $financista) {
                        //  -----------------QUIEN FINANCIA-----------------------
                        $devolverFinacistas = DatFinanciamiento::buscarFinancista($financista, $params['idinversion']);
                        if ($devolverFinacistas[0] != '') {
                            $del9 = DatInversfinancistaestimado::EliminarDadoIdFinanc($devolverFinanciamt[0]['idfinancista'], $params['idinversion']);
                            $del1 = DatInversfinancistaejecutado::EliminarDadoIdFinanc($devolverFinanciamt[0]['idfinancista'], $params['idinversion']);
                            $del2 = DatInversfinancistaplan::EliminarDadoIdFinanc($devolverFinanciamt[0]['idfinancista'], $params['idinversion']);
                            $del3 = DatInversfinancistaproyectado::EliminarDadoIdFinanc($devolverFinanciamt[0]['idfinancista'], $params['idinversion']);
                        } else if ($devolverFinanciamt[0]['idfinancista'] != $tipo) {
                            $act9 = DatInversfinancistaestimado::actualizarFinanc($params['idinversion'], $financista, $devolverFinanciamt[0]['idfinancista']);
                            $act8 = DatInversfinancistaejecutado::actualizarFinanc($params['idinversion'], $financista, $devolverFinanciamt[0]['idfinancista']);
                            $act7 = DatInversfinancistaplan::actualizarFinanc($params['idinversion'], $financista, $devolverFinanciamt[0]['idfinancista']);
                            $act6 = DatInversfinancistaproyectado::actualizarFinanc($params['idinversion'], $financista, $devolverFinanciamt[0]['idfinancista']);
                        }
                    }
                }
                $objFinan = Doctrine::getTable('DatFinanciamiento')->find($dat->idfinanciamiento);

                $des = $des . " Se modificó modificó el financiamiento: {$dat->idfinanciamiento}";

                $arre['idmoneda'] = is_numeric($dat->moneda) ? $dat->moneda : $dat->idmonedaentidad;
                $arre['tipo'] = is_numeric($dat->tipo) ? $dat->tipo : $dat->idtipofinanciamiento;
                $arre['financista'] = is_numeric($dat->financi) ? $dat->financi : $dat->idfinancista;
                $arre['valor'] = $dat->valor ? $dat->valor : 0;
                $arre['plazoamortizacion'] = $dat->plazoamortizacion ? $dat->plazoamortizacion : 0;
                $arre['porcientointeres'] = $dat->porcientointeres ? $dat->porcientointeres : 0;
                $arre['gracia'] = $dat->gracia;
                $datosfinan = DatFinanciamiento::adicionarFinan($params, $arre, $objFinan);
                if (is_numeric($dat->tipo)) {
                    DatInversfinancplan::actualizarTipoFinanc($params['idinversion'], $dat->tipo, $arre['idmoneda']);
                }
            } else {
                $arre['idmoneda'] = is_numeric($dat->moneda) ? $dat->moneda : $dat->idmonedaentidad;
                $arre['tipo'] = is_numeric($dat->tipo) ? $dat->tipo : $dat->idtipofinanciamiento;
                $arre['financista'] = is_numeric($dat->financi) ? $dat->financi : $dat->idfinancista;
                $arre['valor'] = $dat->valor ? $dat->valor : 0;
                $arre['plazoamortizacion'] = $dat->plazoamortizacion ? $dat->plazoamortizacion : 0;
                $arre['porcientointeres'] = $dat->porcientointeres;
                $arre['gracia'] = $dat->gracia ? $dat->gracia : 0;
                $datosfinan = DatFinanciamiento::adicionarFinan($params, $arre);

                $des = $des . " Se adicionó el financiamiento: {$dat->financi}";
            }
        }
        foreach ($presu as $key => $dat) { ///
            if ($dat->idpresanteproy) {
                $objPRE = Doctrine::getTable(DatPresanteproy)->find($dat->idpresanteproy);
                $arrep['idmoneda'] = is_numeric($dat->moneda) ? $dat->moneda : $dat->idmonedaentidad;
                $arrep['valor'] = $dat->valor ? $dat->valor : 0;
                $datospresup = DatPresanteproy::adicionarPreMod($params, $arrep, $objPRE);
                $des = $des . " Se modificó el presupuesto: {$dat->idpresanteproy}";
            } else {
                $arrep['idmoneda'] = is_numeric($dat->moneda) ? $dat->moneda : $dat->idmonedaentidad;
                $arrep['valor'] = $dat->valor ? $dat->valor : 0;
                $datospresup = DatPresanteproy::adicionarPre($params, $arrep);
                $des = $des . " Se adicionó un presupuesto de: {$dat->valor} en la moneda: {$dat->moneda}";
            }
        }

        if ($liqui != null) {
            foreach ($liqui as $key => $dat) {
                if ($dat->iderogacionliquido) {
                    $objLiquido = Doctrine::getTable(DatErogacionliquido)->find($dat->iderogacionliquido);
                    $arrel['idmoneda'] = is_numeric($dat->moneda) ? $dat->moneda : $dat->idmonedaentidad;
                    $arrel['valor'] = $dat->valor ? $dat->valor : 0;
                    $datosliqui = DatErogacionliquido::adicionarLiquido($params, $arrel, $objLiquido);
                    $des = $des . " Se modificó la erogación a líquido {$dat->iderogacionliquido} a {$dat->valor} en la moneda {$dat->moneda}";
                } else {
                    $arrel['idmoneda'] = is_numeric($dat->moneda) ? $dat->moneda : $dat->idmonedaentidad;
                    $arrel['valor'] = $dat->valor ? $dat->valor : 0;
                    $datosliqui = DatErogacionliquido::adicionarLiquido($params, $arrel);
                    $des = $des . " Se adicionó una erogación a líquido de: {$dat->valor} en la moneda: {$dat->moneda}";
                }
            }
        }
        //  if ($params['idinversion'] != 0){
        $result = self::actualizarCuadrada($params);
        //  }

        //HisTrazasinversionesModel::seveTrazasInversiones('Inversión', $acc, $tabla, $params['id'], $des, $idUser,$denom,$inversion,$idestructura);
        return true;
    }

    public function getCodigoInversion($ejercicio, $idespecialidad, $idejercicio) {
        $con = Doctrine_Manager::connection();
        $integrator = ZendExt_IoC::getInstance();
        $estructura = $integrator->metadatos->DameEstructura($idespecialidad);
        $codigoEntidad = $estructura [0]->codigo;
        $var = $ejercicio . $codigoEntidad;
        $var1 = $var . '1';

        $query = "select coalesce ('$var' ||  (select substr((select max(codigo::numeric(19,0))
                FROM 
                  mod_planifinversiones.dat_inversion 
                  where idestructuracomun = $idespecialidad and idejercicio=$idejercicio)::varchar, length('$var')+1, length((select max(codigo::numeric(19,0))
                FROM 
                  mod_planifinversiones.dat_inversion 
                  where idestructuracomun = $idespecialidad and idejercicio=$idejercicio)::varchar) -  length('$var')+1) ::numeric(19,0) +1), '$var1') as codigo";
//        $query = "select coalesce ((SELECT max (codigo::numeric)+1
//                    FROM mod_planifinversiones.dat_inversion
//                    where idestructuracomun = $idespecialidad 
//                    and idejercicio=$idejercicio
//                    and codigo like '$var%'),'$var1'); ";
        $res = $con->execute($query)->fetchAll();
        return $res[0][0];
    }

    /* public function getCodigoInversion($ejercicio, $idespecialidad, $idejercicio) {
      $integrator = ZendExt_IoC::getInstance();
      $estructura = $integrator->metadatos->DameEstructura($idespecialidad);
      $codigoEntidad = $estructura [0]->codigo;
      $numConsecutivo = self::getNumConsecutivo($idespecialidad, $idejercicio);
      if (count($numConsecutivo) == 1)
      // $codigo = $ejercicio . $codigoEntidad . '0' . '0' . $numConsecutivo;
      $codigo = $ejercicio . $codigoEntidad . $numConsecutivo;
      elseif (count($numConsecutivo) == 2)
      //$codigo = $ejercicio . $codigoEntidad . '0' . $numConsecutivo;
      $codigo = $ejercicio . $codigoEntidad . $numConsecutivo;
      else
      $codigo = $ejercicio . $codigoEntidad . $numConsecutivo;
      //    print_r($codigo);die('de');
      return $codigo;
      } */

    private function getNumConsecutivo($idespecialidad, $idejecicio) {
        $datos = DatInversion::getUltimoCodigo($idespecialidad, $idejecicio);
        //print_r($datos[0]['MAX']);die;
        if (count($datos) > 0) {
            // $numconsecutivos = $datos[0]['MAX'][9] . $datos[0]['MAX'][10] . $datos[0]['MAX'][11] + 1;
            $numconsecutivos = $datos[0]['MAX'][9] . $datos[0]['MAX'][10] . $datos[0]['MAX'][11] + 1;
        } else {
            $numconsecutivos = '1';
        }
        //  print_r($numconsecutivos);die;
        return $numconsecutivos;
    }

    public function cargarHijasDireccionInv($idorganismo) {
        $entidades = array();
        if ($idorganismo == "") {
            return $entidades;
        } else {
            $dominios = $this->integrator->metadatos->DameHijosEstructura($idorganismo);
            if ($dominios[0] != "") {
                foreach ($dominios as $key => $k) {
                    $entidades_hijas = array();
                    $entidades_hijas = self::entidadesHijas($k->id, $k->text);
                    $entidades = array_merge($entidades_hijas, $entidades);
                }
            }
            return $entidades;
        }
    }

    public function addCmpInvElement($params, $objInv) {
        $arreEtapas = Array();
        $cmpts = DatEtapa::buscarCmp($params, $objInv); //print_r($cmpts);die;
        //   print_r($cmpts);die;
        if ($cmpts[0] != "") {
            foreach ($cmpts as $key => $dat) {
                $arreEtapas['idetapa'] = $dat['idetapa'];
                $arreEtapas['idinversion'] = $params['id'];
                $arreEtapas['idestadoflujotrabajo'] = $dat['idestadoflujotrabajo'] ? $dat['idestadoflujotrabajo'] : 0;
                $datosEtapasInv = DatEtapaInversion::adicionarEtInv($arreEtapas);
            }
        }
        $elemts = DatElemento::buscarElemt($params, $objInv); //print_r($elemts);die;
        if ($elemts->data[0] != "") {
            foreach ($elemts->data as $key => $dat) {//print_r($params);die;
                $arreEtapas['idelemento'] = $dat['idelemento'];
                // $arreEtapas['idinversion'] = $params['id'];
                $arreEtapas['idetapainversion'] = $dat['idetapa'];
                $arreEtapas['parametrodinamico'] = null;
                $arreEtapas['idcontenido'] = 0;
                $datosEtapasInv = DatEtapaElementoinversion::adicionarElemtInv($arreEtapas);
            }
        }
    }

    public function modClasificacion($params, $objInv) {//print_r($params);die;
        $estapas = DatEtapaInversion::buscarCmp($params['idinversion']); //print_r($estapas);die;
        foreach ($estapas as $key => $dat) {
            $idelemento = DatElementodocgestordoc::contenidoPorIdEtapa($dat['idetapainversion']);

            if ($idelemento[0] != "") {
                foreach ($idelemento as $dal) {
                    DatElementodocgestordoc::deleteElemDoc($dal['idelementodocgestordoc']);
                }
            }
            $idelems = DatElementovalor::CargarElemement($dat['idetapainversion']);
            // print_r($idelems);die;
            if ($idelems[0] != "") {
                foreach ($idelems as $d) {
                    DatElementovalor::eliminarValorPorIdEInv($d['idetapaelementoinversion']);
                }
            }
            if ($dat['idetapainversion']) {
                DatEtapaElementoinversion::deleteEt($dat);
            }
        }
        DatEtapaInversion::deleteEtInv($params);
        if ($objInv) {
            InversionesModel::addCmpInvElement($params, $objInv);
        }
    }

    public function cargarInversiones($params, $identidad, $idinvers) {
        //print_r($params);die;
        $datos = DatInversion::listarInversiones($params, $identidad, $idinvers);
        $count = 0;
        foreach ($datos as $key => $inversion) {

            $params['idinversion'] = $inversion['idinversion'];
            $fechas = DatInversion::getFechas($params);
            if ($fechas[0]['fechamax'] != null) {
                $datos[$key]['fechamax'] = $fechas[0]['fechamax'];
                $datos[$key]['fechamin'] = $fechas[0]['fechamin'];
            } else {
                $datos[$key]['fechamax'] = 'nolimit';
                $datos[$key]['fechamin'] = 'nolimit';
            }
        }
        /* foreach ($datos as $key => $dat) {
          if ($datos[$key]['idprovincia']) {
          $provincia = $this->integrator->datosmaestros->getElementoid($datos[$key]['idprovincia']);
          $datos[$key]['provincia'] = $provincia[0]['denominacion'];
          } else {
          $datos[$key]['provincia'] = "Ninguna";
          }
          $count = $count + 1;
          } */
        $result['data'] = $datos;
        $result['total'] = $count;
        return $result;
    }

    public function actualizarCuadrada($params) {
        /* lista los presupuesto de la inversion */
        $dat = DatInversion::listarPlanPresupuesto($params);
        /* lista los financiamineto de la inversion */
        $data = DatInversion::listarFinan($params);
        /* lista los valores de la inversion */
        $datas = DatInversion::listarValorInversion($params);

        $totalSumCmp['cup'] = 0;
        $totalSumCmp['usd'] = 0;
        foreach ($datas as $key => $v) {
            if ($v['idmoneda'] == 9900000103)
                $totalSumCmp['cup'] += $v['sum'];
            if ($v['idmoneda'] == 9900000046)
                $totalSumCmp['usd'] += $v['sum'];
        }

        $totalPlanPrep['cup'] = 0;
        $totalPlanPrep['usd'] = 0;
        foreach ($dat as $key => $v) {
            if ($v['idmoneda'] == 9900000103)
                $totalPlanPrep['cup'] += $v['valor'];
            if ($v['idmoneda'] == 9900000046)
                $totalPlanPrep['usd'] += $v['valor'];
        }

        $totalFinanciamiento['cup'] = 0;
        $totalFinanciamiento['usd'] = 0;
        foreach ($data as $key => $v) {
            if ($v['idmoneda'] == 9900000103)
                $totalFinanciamiento['cup'] += $v['sum'];
            if ($v['idmoneda'] == 9900000046)
                $totalFinanciamiento['usd'] += $v['sum'];
        }
//print_r($totalFinanciamiento);
//print_r('--');
//print_r($totalPlanPrep);
//print_r('--');
//print_r($totalSumCmp);die('dddd');

        $banderaCuadrada = false;
        if ($totalFinanciamiento['cup'] == $totalPlanPrep['cup'] + $totalSumCmp['cup']) {
            $banderaCuadrada = true;
        } else {
            $banderaCuadrada = false;
        }
        if ($banderaCuadrada) {
            if ($totalFinanciamiento['usd'] == $totalPlanPrep['usd'] + $totalSumCmp['usd']) {
                $banderaCuadrada = true;
            } else {
                $banderaCuadrada = false;
            }
        }
        if ($banderaCuadrada) {
            $d = DatInversion::ObternerCuadrada($params);
            return true;
        } else {
            $d = DatInversion::ObternerNoCuadrada($params);
            return true;
        }
    }

    public function EliminarAss($parametros) {
        if ($parametros['iddoc'] != '') {
            $gestionando = DatElementodocgestordoc::EliminarDocdadoIdElem($parametros['idelemento']);
            $parametros['asso'] = 0; //CUANDO SE ASOCIA UN DOCUMENTO TOMA VALOR 0 EL ATRIB DOCUMENTO
            $datos = DatEtapaElementoinversion::getByid($parametros['idelemento']);
            // DatElemento::UpDocumento($parametros, $datos->idelemento);
            if ($gestionando == 1) {
                return json_encode(array('codMsgM' => 1));
            } else if ($gestionando == 0) {
                return json_encode(array('codMsgM' => 21));
            }
        } else {
            return json_encode(array('codMsgM' => 21));
        }
    }

    public function listarProvincias() {
        $provincia = $this->integrator->datosmaestros->cargarEstruturadpa();
        $pro = array();
        foreach ($provincia as $key => $dat) {
            $pro[$key]['idprovincia'] = $dat['iddpt'];
            $pro[$key]['provincia'] = $dat['denominacion'];
            $pro[$key]['nivel'] = $dat['idnivelestructural'];
        }
        $result['data'] = $pro;

        return $result;
    }

    public function cargarComponentes($params) {
        $datos = DatInversion::listarComponentes($params);
        $result['data'] = $datos; //print_r($result);die;
        return $result;
    }

    public function cambiarEstado($params) {
        //SE VALIDA TODAS LAS TRANSICIONES DE LAS ETAPAS.
        //$cmps =  DatEtapa::ComponentPT($params);//print_r($cmps);die; 
        //$estado =  InversionesModel::validarCmp($cmps,$params); //print_r($estado);die;
        //$resp =  DatEtapa::TransDadocmp($cmps);
        //if($estado == 0){
        $datos = DatEtapa::cambiarEstado($params);
        //$cmpsPorInv =  DatEtapa::ListarTracc($params);//print_r($cmps);die; 
        //$validarInv =  InversionesModel::validarCmp($cmpsPorInv,$params); //print_r($estado);die;
        //$datos = ($validarInv==1)?DatInversion::cambiarInversion($params):Array();
        //}
        //return ($validarCMP==1)?true:false;
        return ($datos) ? true : false;
    }

    public function validarCmp($params, $param) {
        $result = 0;
        $cmp = 0;
        $est = Array();
        $cont = count($params);
        if ($cont >= 1) {
            foreach ($params as $key => $dat) {
                $inicial = $dat['idestadoinicial']; /* print_r($param['idestadoflujotrabajo']);
                  echo('--');print_r($inicial);print_r($result);die; */
                if ($param['idestadoflujotrabajo'] == $inicial || $result == 1) {
                    for ($i = $key; $i < $cont; $i++) {// print_r($dat['idestadofinal']);echo('--');print_r($params[$i]['idestadoinicial']);die;
                        if (($dat['idestadofinal'] == $params[$i]['idestadoinicial']) || $cont == $i) {
                            $result = 1;
                            break;
                        } else if ($cont == $i && $result = 0) {//print_r($dat['idestadofinal']);echo('--');print_r($params[$i]['idestadoinicial']);die;
                            $result = 0;
                        }
                    }
                    $cmp = ($result == 1) ? 1 : 0;
                }
            }
        } else {
            $cmp = 0;
        }
        return $cmp;
    }

    /* public function validarCmp($params,$param) {
      $result = 0;
      $cmp = 0;
      $est = Array();
      $post = 1;
      $cont = count($params);
      if($cont >= 1){
      for($i = $key; $i< $cont ; $i++){
      while($cont != 0){
      if(($params[$i]['idestadofinal'] == $params[$i+$post]['idestadoinicial']){
      $result = 1;
      $i = $i+$post;
      $post = $post + 1;
      break;
      }else if($cont == $i && $result = 0){//print_r($dat['idestadofinal']);echo('--');print_r($params[$i]['idestadoinicial']);die;
      $result = 0;
      }
      }
      }
      }else {
      $cmp = 0;
      }
      return $cmp;
      } */

    public function cargarElementos($params) {
        $datos = DatInversion::listarElementos($params);
        return $datos;
    }

    public function cargarClasificacion() {
        $datos = DatInversion::listarClasificacion($params);
        return $datos;
    }

    public function EliminarInversion($parametros) {
        //  $inversiones = implode(',', $parametros['idinversion']);
        /* foreach ($parametros['idinversion'] as $key => $dat) {
          $delPre = DatPresanteproy::EliminarP($dat);
          $delFin = DatFinanciamiento::EliminarF($dat);
          if ($parametros['idinversion'][0] != '') {
          $params['idinversion'] = $dat; */
        //  InversionesModel::modClasificacion($params); //ELIMINA TODAS LAS ETAPAS Y ELEMENTOS ASOCIADOS
        //$datosAddEta = DatElementoInversion::deleteEt($dat);
        //$datosAddEta = DatEtapaInversion::deleteEtInv($dat);
        /* }
          } */
        $des='Se eliminó la inversión($idinvers)';
        $idinvers = ''.implode(',', $parametros['idinversion']).'';
        $des='Se eliminó la inversión(es) ('.$idinvers.')';
        DatInversion::EliminarInc($parametros, $parametros['idinversion']);
        foreach ($parametros['idinversion'] as $value){
//            HisTrazasinversionesModel::seveTrazasInversiones('Inversión', 'elimanado', 'dat_inversion', $value, $des, $parametros['iduser']);
        }
        
    }

    public function eliminarValor($parametros, $idInver, $idUser) {
        $del = DatElementovalor::eliminarValor($parametros, $idInver, $idUser);
        return $del;
    }

    public function eliminarPresupuesto($parametros) {
        //$id = implode(',', $parametros['idpresanteproy']);
        $del = DatPresanteproy::EliminarDadoIdP($parametros['idpresanteproy']);
        return $del;
    }

    public function eliminarFin($parametros) {
        //$id = implode(',', $parametros['idfinanciamiento']);
        $devolverFinanciamt = DatFinanciamiento::buscarfinanDadoTipoF($parametros['idfinanciamiento']);
        $moEntUsd = InversionesModel::devolverIdMonedaEnt($parametros['usd'], $parametros['identidad']);
        $moEntMp = InversionesModel::devolverIdMonedaEnt($parametros['mp'], $parametros['identidad']);

        $del9 = DatInversfinancistaestimado::EliminarDadoIdFinanc($devolverFinanciamt[0]['idfinancista'], $parametros['idinversion']);
        $del1 = DatInversfinancistaejecutado::EliminarDadoIdFinanc($devolverFinanciamt[0]['idfinancista'], $parametros['idinversion']);
        $del2 = DatInversfinancistaplan::EliminarDadoIdFinanc($devolverFinanciamt[0]['idfinancista'], $parametros['idinversion']);
        $del3 = DatInversfinancistaproyectado::EliminarDadoIdFinanc($devolverFinanciamt[0]['idfinancista'], $parametros['idinversion']);
        if ($devolverFinanciamt[0]['porcientointeres'] > 0) {//ACREEDORES
            $presupuestomp = DatFinanciamiento::presuTFinanci($parametros['mp'], $parametros['idinversion'], 0);
            $presupuestousd = DatFinanciamiento::presuTFinanci($parametros['usd'], $parametros['idinversion'], 0);
            $del = DatFinanciamiento::EliminarDadoIdF($parametros['idfinanciamiento']);
            //   if ($presupuestomp[0]['total'] == 0) {
            $del9 = DatInversfinancejecutado::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $parametros['idinversion']);
            $del1 = DatInversfinancestimado::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $parametros['idinversion']);
            $del2 = DatInversfinancplan::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $parametros['idinversion']);
            $del3 = DatInversfinancproyectado::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $parametros['idinversion']);
            // }
            // if ($presupuestousd[0]['total'] == 0) {
            /* $del4 = DatInversfinancejecutado::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $parametros['idinversion'], $moEntUsd[0]['idmonedaentidad']);
              $del5 = DatInversfinancestimado::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $parametros['idinversion'], $moEntUsd[0]['idmonedaentidad']);
              $del6 = DatInversfinancplan::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $parametros['idinversion'], $moEntUsd[0]['idmonedaentidad']);
              $del7 = DatInversfinancproyectado::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $parametros['idinversion'], $moEntUsd[0]['idmonedaentidad']);
             */ //  }
        } else {//CONTADO
            // print_r($parametros['idinversion']);die;
            $presupuestomp = DatFinanciamiento::presuTFinanci($parametros['mp'], $parametros['idinversion'], 1);
            $presupuestousd = DatFinanciamiento::presuTFinanci($parametros['usd'], $parametros['idinversion'], 1);


            if (($presupuestomp[0]['total'] - $devolverFinanciamt[0]['valor'] ) == 0) {

                $del9 = DatInverscontadoejecutado::EliminarDadoIdinv($parametros['idinversion'], $moEntMp[0]['idmonedaentidad']);
                $del1 = DatInverscontadoestimado::EliminarDadoIdinv($parametros['idinversion'], $moEntMp[0]['idmonedaentidad']);
                $del2 = DatInverscontadoplan::EliminarDadoIdinv($parametros['idinversion'], $moEntMp[0]['idmonedaentidad']);
                $del3 = DatInverscontadoproyectado::EliminarDadoIdinv($parametros['idinversion'], $moEntMp[0]['idmonedaentidad']);
            }
            if (($presupuestousd[0]['total'] - $devolverFinanciamt[0]['valor'] ) == 0) {
                $del4 = DatInverscontadoejecutado::EliminarDadoIdinv($parametros['idinversion'], $moEntUsd[0]['idmonedaentidad']);
                $del5 = DatInverscontadoestimado::EliminarDadoIdinv($parametros['idinversion'], $moEntUsd[0]['idmonedaentidad']);
                $del6 = DatInverscontadoplan::EliminarDadoIdinv($parametros['idinversion'], $moEntUsd[0]['idmonedaentidad']);
                $del7 = DatInverscontadoproyectado::EliminarDadoIdinv($parametros['idinversion'], $moEntUsd[0]['idmonedaentidad']);
            }
            $del = DatFinanciamiento::EliminarDadoIdF($parametros['idfinanciamiento']);
        }
        return $del;
    }

    public function eliminarLiq($parametros) {
        $del = DatErogacionliquido::EliminarLiquidos($parametros);
        return $del;
    }

    public function aprobar_desaproInv($parametros) {

        if ($parametros['idinversion'][0] != '') {
//            $datos = DatInversion::listarComponentes($parametros);
//print_r($datos);die('ccc');
            $gestionando = DatInversion::AprobarDes($parametros);
            if ($gestionando == 1) {
                return json_encode(array('codMsgM' => 1));
            } else if ($gestionando == 0) {
                return json_encode(array('codMsgM' => 21));
            }
        } else {
            return json_encode(array('codMsgM' => 21));
        }
    }

    public function aprobar_desaproICmp($parametros) {
        if ($parametros['idcomponente'] != '') {
            $gestionando = DatEtapa::AprobarDes($parametros);
            if ($gestionando == 1) {
                return json_encode(array('codMsgM' => 1));
            } else if ($gestionando == 0) {
                return json_encode(array('codMsgM' => 21));
            }
        } else {
            return json_encode(array('codMsgM' => 21));
        }
    }

    public function activar_desactivarInv($parametros) {
        if ($parametros['idinversion'][0] != '') {
            $gestionando = DatInversion::ActDesactInv($parametros);

            if ($gestionando == 1) {
                if ($parametros['idestado'] == 2) {
//                    self::EliminarPresupuestoPlan($parametros);
//                    self::EliminarFinanciamientoContadoPlan($parametros);
//                    self::EliminarFinanciamientoAcreedorPlan($parametros);
//                    self::EliminarFinanciamientoFinancistaPlan($parametros);
//                    self::EliminarPlanPreparacionPlan($parametros);
//                    self::EliminarEquipoPlan($parametros);
//                    self::EliminarConstructorPlan($parametros);
//                    self::EliminarOtrosIndicadoresPlan($parametros);
//                    self::EliminarMedioAmbientePlan($parametros);
                }

                return json_encode(array('codMsgM' => 1));
            } else if ($gestionando == 0) {
                return json_encode(array('codMsgM' => 21));
            }
        } else {
            return json_encode(array('codMsgM' => 21));
        }
    }
    
    public function Bloquear_DesbloquearInv($parametros) {
        if ($parametros['idinversion'][0] != '') {
            $gestionando = DatInversion::BloqDesactivarInv($parametros);

            if ($gestionando == 1) {
                if ($parametros['idestado'] == 2) {
//                    self::EliminarPresupuestoPlan($parametros);
//                    self::EliminarFinanciamientoContadoPlan($parametros);
//                    self::EliminarFinanciamientoAcreedorPlan($parametros);
//                    self::EliminarFinanciamientoFinancistaPlan($parametros);
//                    self::EliminarPlanPreparacionPlan($parametros);
//                    self::EliminarEquipoPlan($parametros);
//                    self::EliminarConstructorPlan($parametros);
//                    self::EliminarOtrosIndicadoresPlan($parametros);
//                    self::EliminarMedioAmbientePlan($parametros);
                }

                return json_encode(array('codMsgM' => 1));
            } else if ($gestionando == 0) {
                return json_encode(array('codMsgM' => 21));
            }
        } else {
            return json_encode(array('codMsgM' => 21));
        }
    }

    public function EliminarPresupuestoPlan($parametros) {

        $conceptos = array('DatInversetapaplan');
        $etapaInversion = DatEtapaInversion::getByidInversion($parametros['idinversion'][0]);
        $selectIdMonedaentidad = 0;
        $monedas = AnalisisInversiones::monedasPorEntidad($parametros['identidad'], $selectIdMonedaentidad);
        foreach ($conceptos as $concepto) {
            foreach ($etapaInversion as $idetapaInversion) {
                $query = new Doctrine_Query();
                $result = $query->delete()
                                ->from($concepto)
                                ->where("idejercicio =? and idetapainversion =?  ", array($parametros['idejercicio'],
                                    $idetapaInversion['idetapainversion']))->execute();
            }
        }
    }

    public function EliminarFinanciamientoContadoPlan($parametros) {

        $conceptos = array('DatInverscontadoplan');
        foreach ($conceptos as $concepto) {
            $query = new Doctrine_Query();
            $result = $query->delete()
                            ->from($concepto)
                            ->where("idejercicio =? and idinversion =?  ", array($parametros['idejercicio'],
                                $parametros['idinversion'][0]))->execute();
        }
    }

    public function EliminarFinanciamientoAcreedorPlan($parametros) {

        $conceptos = array('DatInversfinancplan');
        foreach ($conceptos as $concepto) {
            $query = new Doctrine_Query();
            $result = $query->delete()
                            ->from($concepto)
                            ->where("idejercicio =? and idinversion =?  ", array($parametros['idejercicio'],
                                $parametros['idinversion'][0]))->execute();
        }
    }

    public function EliminarFinanciamientoFinancistaPlan($parametros) {

        $conceptos = array('DatInversfinancistaplan');
        foreach ($conceptos as $concepto) {
            $query = new Doctrine_Query();
            $result = $query->delete()
                            ->from($concepto)
                            ->where("idejercicio =? and idinversion =?  ", array($parametros['idejercicio'],
                                $parametros['idinversion'][0]))->execute();
        }
    }

    public function EliminarPlanPreparacionPlan($parametros) {
        $planPreparacion = DatPresanteproy::getPlanPreparacionByInversion($parametros['idinversion'][0]);
        $conceptos = array('dat_presupplan');
        if (!empty($planPreparacion)) {
            foreach ($conceptos as $concepto) {
                $query = "DELETE FROM mod_planifinversiones." . $concepto . "
                                WHERE (idejercicio = {$parametros['idejercicio']}
                                AND idpresanteproy = {$planPreparacion[0]['idpresanteproy']})";
                $conn = Doctrine_Manager::connection();
                $conn->execute($query);
            }
        }
    }

    public function EliminarEquipoPlan($parametros) {
        $equipoGlobal = DatEtapaEquipo::getEquipoGlobalByInversion($parametros['idinversion'][0]);
        $conceptos = array('dat_etapaequipoplan');
        if (!empty($equipoGlobal)) {
            foreach ($equipoGlobal as $equipo) {
                $idEquiposGlobal[] = $equipo['idetapaequipoglobal'];
            }
            $idEquiposGlobal = implode(',', $idEquiposGlobal);
            foreach ($conceptos as $concepto) {
                $query = "DELETE FROM mod_planifinversiones." . $concepto . "
                            WHERE (idejercicio = {$parametros['idejercicio']}
                            AND idetapaequipoglobal in ($idEquiposGlobal))";
                $conn = Doctrine_Manager::connection();
                $conn->execute($query);
            }
        }
    }

    public function EliminarConstructorPlan($parametros) {
        $constructores = DatEtapainverconsprov::getConstructoresByInversion($parametros['idinversion'][0]);
        $conceptos = array('dat_etapinverconsprovplan');
        if (!empty($constructores)) {
            foreach ($constructores as $constructor) {
                $idEtapaConstructores[] = $constructor['idetapinverconsprov'];
            }
            $idEtapaConstructores = implode(',', $idEtapaConstructores);
            foreach ($conceptos as $concepto) {
                $query = "DELETE FROM mod_planifinversiones." . $concepto . "
                            WHERE (idejercicio = {$parametros['idejercicio']}
                            AND idetapinverconsprov in ($idEtapaConstructores))";
                $conn = Doctrine_Manager::connection();
                $conn->execute($query);
            }
        }
    }

    public function EliminarOtrosIndicadoresPlan($parametros) {
        $query = "UPDATE
                          mod_planifinversiones.dat_otrosindicadares
                        SET
                          plan = 0
                        WHERE
                          idejercicio = {$parametros['idejercicio']}
                        AND idinversion = {$parametros['idinversion'][0]}";
        $conn = Doctrine_Manager::connection();
        $conn->execute($query);
    }

    public function EliminarMedioAmbientePlan($parametros) {

        $medioAmbiente = DatMedioambglobal::getMedioAmbByInversion($parametros['idinversion'][0]);
        $conceptos = array('dat_medioambplan');
        if (!empty($medioAmbiente)) {
            foreach ($medioAmbiente as $medio) {
                $idmedioAmbiente[] = $medio['idmedioambglobal'];
            }
            $idmedioAmbiente = implode(',', $idmedioAmbiente);
            foreach ($conceptos as $concepto) {
                $query = "DELETE FROM mod_planifinversiones." . $concepto . "
                            WHERE (idejercicio = {$parametros['idejercicio']}
                            AND idmedioambglobal in ($idmedioAmbiente))";
                $conn = Doctrine_Manager::connection();
                $conn->execute($query);
            }
        }
    }

    public function cargarTipoInversion() {
        $datos = DatInversion::listarTipoInversion();
        return $datos;
    }

    public function cargarProgramada() {
        $datos = DatInversion::listarProgramada();
        return $datos;
    }

    public function cargarCaracteristica() {
        $datos = DatInversion::listarCaracteristica();
        return $datos;
    }

    public function listarCmbMedioAmbiente() {
        $datos = DatInversion::listarCmbMedioAmbiente();
        return $datos;
    }

    public function listarCreditos() {
        $datos = DatInversion::listarCreditos();
        return $datos;
    }

//listarCreditos

    public function cargarForma() {
        $datos = DatInversion::listarFormaPlan();
        return $datos;
    }

    public function cargarGrupoObra() {
        $datos = DatInversion::listarGrupoObra();
        return $datos;
    }

    public function cargarEstado() {
        $datos = DatInversion::listarEstado();
        return $datos;
    }

    public function cargarSectorEstrategico() {
        $datos = DatInversion::listarSectorEstrategico();
        return $datos;
    }

    public function listarObjetivo() {

        $datos = DatInversion::listarObjetivo();
        return $datos;
    }

    public function listarDesempenno() {
        $datos = DatInversion::listarDesempeno();
        return $datos;
    }

    public function listarEfecto() {
        $datos = DatInversion::listarEfecto();
        return $datos;
    }

    //**
    /* /public function listarPlan() {
      $datos = DatInversion::listarPlan();
      return $datos;
      } */
    //**
    public function listarEstados($params) {
        $resultado = Array();
        //print_r($params);die;
        if ($params['idetapa'] != "") {
            if ($params['idestadoflujotrabajo'] != "") {
                $resultado = DatEtapa::BuscarTF($params);
//                $estFinal = DatEtapa::BuscarTF($params);
//                if ($estFinal[0] != "") {
//                    $resultado = DatEtapa::listarEstadosPorId($params, $estFinal);
//print_r($resultado);die('INVERSIONESMODEL 978');
//                    //print_r($resu);die;
//                    /* if ($resu[0] != ""){
//                      foreach ($resu as $key => $dat) {//print_r($dat['idetapa']);die;
//                      $resultado[$key]['idetapa'] = $dat['idetapa'];
//                      $resultado[$key]['idestadosft'] = $dat['idestadosft'];
//                      $resultado[$key]['denominacion'] = $dat['denominacion'];
//                      }//print_r($resultado);die;
//                      } */
//                    //		$resultado[count($resultado)+1] = $estFinal[0];//print_r($resultado);die;
//                }
            } else {
                return $resultado;
            }
        } else {
            $resultado = DatEtapa::listarEstados();
        }
        //print_r($resultado);die;
        return $resultado;
    }

    public function listarTipoFinan() {
        $datos = DatInversion::listarTipoFinan();
        return $datos;
    }

    public function listarFinancista() {
        $datos = DatInversion::listarFinancista();
        return $datos;
    }

    public function guardarValor($params, $param, $idUser) {
        $arrep = Array();
        $acc;
        $des;
        foreach ($param['val'] as $key => $dat) {
            $arrep['idmoneda'] = is_numeric($dat->moneda) ? $dat->moneda : $dat->idmonedaentidad;
            $arrep['valor'] = $dat->valor;
            $arrep['idelementovalor'] = $dat->idelementovalor; //print_r($params);die;
            $datos = DatElementovalor::adicionarElem($params, $arrep, $idUser);
        }
        return $datos;
    }

//GUARDA LOS VALORES DE CADA TABLA QUE CONTIENE LAS MONEDAS MP Y USD DE CADA CONTRUCTOR
    public function guardarValorConstructor($parametros) {
        $ejercicio = Array();
        $moneda = Array();
        $ejercicio[0]['id'] = DatInversion::idejercicioPorDenominacion($parametros['aaejercicio']);
        $ejercicio[1]['id'] = DatInversion::idejercicioPorDenominacion($parametros['aejercicio']);
        $ejercicio[2]['id'] = $parametros['idejercicio'];
        $ejercicio[3]['id'] = DatInversion::idejercicioPorDenominacion($parametros['pejercicio']);
        $cont = 1;
        $moneda[0]['id'] = $parametros['MP'];
        $moneda[0]['name'] = 'mp';
        $moneda[1]['id'] = $parametros['USD'];
        $moneda[1]['name'] = 'usd';

        foreach ($parametros['valores'] as $key => $valor) {//RECORRE EL ARREGLO DE FILAS MODIFICADAS
            foreach ($ejercicio as $value) {//REINICIA EL CONTADOR
                $estadoEjer = DatInversion::estadoEjercicioPorEjercicio($value['id']);
                foreach ($moneda as $value1) {//DEFINE LAS DOS MONEDAS QUE SE VAN A LISTAR
                    if (($estadoEjer != 'Cerrado' && $estadoEjer != 'Listo' && $estadoEjer != 'Ejecución') || ($parametros['ajustar'] == 'true')) { //Creado --Elaboracion
                        $pos1 = "ejecutado" . $value1['name'] . $cont; //POSICION DEL VALOR A MODIFICAR
                        $pos2 = "idetapinverconsprovejecutado" . $value1['name'] . $cont; //POSICION DEL VALOR QUE TIENE EL ID QUE SE ACTUALIZARA

                        $pos3 = "proyec" . $value1['name'] . $cont;
                        $pos4 = "idetapinverconsprovproyeccion" . $value1['name'] . $cont;

                        $pos5 = "estimado" . $value1['name'] . $cont;
                        $pos6 = "idetapinverconsprovestimado" . $value1['name'] . $cont;

                        $pos7 = "plan" . $value1['name'] . $cont;
                        $pos8 = "idetapinverconsprovplan" . $value1['name'] . $cont;

                        self::saveEstimado($valor->$pos5, $valor->$pos6, $value['id'], $value1['id'], $valor->idetapinverconsprov, $parametros['idetapainversion'], $parametros['usuario']);

                        self::saveEjecutado($valor->$pos1, $valor->$pos2, $value['id'], $valor->idetapinverconsprov, $value1['id'], $parametros['idetapainversion'], $parametros['usuario']);

                        self::saveProyeccion($valor->$pos3, $valor->$pos4, $value['id'], $value1['id'], $valor->idetapinverconsprov, $parametros['idetapainversion'], $parametros['usuario']);

                        self::saveplan($valor->$pos7, $valor->$pos8, $value['id'], $value1['id'], $valor->idetapinverconsprov, $parametros['idetapainversion'], $parametros['usuario']);
                    } else if ($estadoEjer == 'Listo') {
                        $pos1 = "ejecutado" . $value1['name'] . $cont;
                        $pos2 = "idetapinverconsprovejecutado" . $value1['name'] . $cont;

                        $pos5 = "estimado" . $value1['name'] . $cont;
                        $pos6 = "idetapinverconsprovestimado" . $value1['name'] . $cont;

                        self::saveEstimado($valor->$pos5, $valor->$pos6, $value['id'], $value1['id'], $valor->idetapinverconsprov, $parametros['idetapainversion'], $parametros['usuario']);

                        self::saveEjecutado($valor->$pos1, $valor->$pos2, $value['id'], $valor->idetapinverconsprov, $value1['id'], $parametros['idetapainversion'], $parametros['usuario']);
                    } else if ($estadoEjer == 'Ejecución') {
                        $pos1 = "ejecutado" . $value1['name'] . $cont;
                        $pos2 = "idetapinverconsprovejecutado" . $value1['name'] . $cont;

                        self::saveEjecutado($valor->$pos1, $valor->$pos2, $value['id'], $valor->idetapinverconsprov, $value1['id'], $parametros['idetapainversion'], $parametros['usuario']);
                    }
                }
                $cont = $cont + 1;
            }
            $cont = 1;
        }
    }

    private function saveEjecutado($valorPos1, $valorPos2, $id, $idetapaincconsprov, $idmeneda, $idinversion, $iduser) {
        $boolSaveTrazas = false;
        if ($valorPos2 != "") {
            $objMod = DatInversion::getValue("dat_etapinverconsprovejecutado", "idetapinverconsprovejecutado", $valorPos2, $id);
            if ($valorPos1 != 0 && $objMod[0]['valor'] != $valorPos1) {
                $boolSaveTrazas = true;
                $acc = "actualizar";
                $des = "Se actualizó el valor del constructorProvincia: {$idetapaincconsprov} a: {$valorPos1} en la moneda {$idmeneda}";
                DatInversion::updatevalor("dat_etapinverconsprovejecutado", $valorPos1, "idetapinverconsprovejecutado", $valorPos2, $id);
            } else if ($valorPos1 == 0 && $objMod[0]['valor'] != $valorPos1) {
                $boolSaveTrazas = true;
                $acc = "eliminar";
                $des = "Se eliminó el valor del constructorProvincia: {$idetapaincconsprov} en la moneda {$idmeneda} del ejercicio {id}";
                DatInversion::eliminarDesgloseEquipo("dat_etapinverconsprovejecutado", "idetapinverconsprovejecutado", $valorPos2);
            }
        } else if ($valorPos1 != '') {//print_r($valor->$pos7);die;
            $boolSaveTrazas = true;
            $acc = "adicionar";
            $des = "Se adicionó {$valorPos1} en la moneda {$idmeneda} del constructorProvincia: {$idetapaincconsprov}";
            DatInversion::addvalorConstr("dat_etapinverconsprovejecutado", $valorPos1, $idmeneda, $id, $idetapaincconsprov);
        }
        if ($boolSaveTrazas) {
//            HisTrazasinversionesModel::seveTrazasInversiones('Desglose Constructores', $acc, dat_etapinverconsprovejecutado, $idinversion, $des, $iduser);
        }
    }

    private function saveProyeccion($valorPos3, $valorPos4, $idEjer, $idmoneda, $idetapinverconsprov, $idinversion, $iduser) {
        $boolSaveTrazas = false;
        if ($valorPos4 != "") {
            $objMod = DatInversion::getValue("dat_etapinverconsprovproyeccion", "idetapinverconsprovproyeccion", $valorPos4, $idEjer);
            if ($valorPos3 != 0 && $objMod[0]['valor'] != $valorPos3) {
                $boolSaveTrazas = true;
                $acc = "actualizar";
                $des = "Se actualizó el valor del constructorProvincia: {$idetapinverconsprov} a: {$valorPos3} en la moneda {$idmoneda}";
                DatInversion::updatevalor("dat_etapinverconsprovproyeccion", $valorPos3, "idetapinverconsprovproyeccion", $valorPos4, $idEjer);
            } else if ($valorPos3 == 0 && $objMod[0]['valor'] != $valorPos3) {
                $boolSaveTrazas = true;
                $acc = "eliminar";
                $des = "Se eliminó el valor del constructorProvincia: {$idetapinverconsprov} en la moneda {$idmoneda} del ejercicio {$idEjer}";
                DatInversion::eliminarDesgloseEquipo("dat_etapinverconsprovproyeccion", "idetapinverconsprovproyeccion", $valorPos4);
            }
        } else if ($valorPos3 != '') {
            $boolSaveTrazas = true;
            $acc = "adicionar";
            $des = "Se adicionó {$valorPos3} en la moneda {$idmoneda} del constructorProvincia: {$idetapinverconsprov} del ejercicio {$idEjer}";
            DatInversion::addvalorConstr("dat_etapinverconsprovproyeccion", $valorPos3, $idmoneda, $idEjer, $idetapinverconsprov);
        }
        if ($boolSaveTrazas) {
//            HisTrazasinversionesModel::seveTrazasInversiones('Desglose Constructores', $acc, dat_etapinverconsprovejecutado, $idinversion, $des, $iduser);
        }
    }

    private function saveEstimado($valorPos5, $valorPos6, $idEjer, $idmoneda, $idetapinverconsprov, $idinversion, $iduser) {
        $boolSaveTrazas = false;
        if ($valorPos6 != "") {
            $objMod = DatInversion::getValue("dat_etapinverconsprovestimado", "idetapinverconsprovestimado", $valorPos6, $idEjer);
            if ($valorPos5 != 0 && $objMod[0]['valor'] != $valorPos5) {
                $boolSaveTrazas = true;
                $acc = "actualizar";
                $des = "Se actualizó el valor del constructorProvincia: {$idetapinverconsprov} a: {$valorPos5} en la moneda {$idmoneda}";
                DatInversion::updatevalor("dat_etapinverconsprovestimado", $valorPos5, "idetapinverconsprovestimado", $valorPos6, $idEjer);
            } else if ($valorPos5 == 0 && $objMod[0]['valor'] != $valorPos5) {
                $boolSaveTrazas = true;
                $acc = "eliminar";
                $des = "Se eliminó el valor del constructorProvincia: {$idetapinverconsprov} en la moneda {$idmoneda} del ejercicio {$idEjer}";
                DatInversion::eliminarDesgloseEquipo("dat_etapinverconsprovestimado", "idetapinverconsprovestimado", $valorPos6);
            }
        } else if ($valorPos5 != '') {
            $boolSaveTrazas = true;
            $acc = "adicionar";
            $des = "Se adicionó {$valorPos5} en la moneda {$idmoneda} del constructorProvincia: {$idetapinverconsprov} del ejercicio {$idEjer}";
            DatInversion::addvalorConstr("dat_etapinverconsprovestimado", $valorPos5, $idmoneda, $idEjer, $idetapinverconsprov);
        }
        if ($boolSaveTrazas) {
//            HisTrazasinversionesModel::seveTrazasInversiones('Desglose Constructores', $acc, dat_etapinverconsprovestimado, $idinversion, $des, $iduser);
        }
    }

    private function saveplan($valorPos7, $valorPos8, $idEjer, $idmoneda, $idetapinverconsprov, $idinversion, $iduser) {
        $boolSaveTrazas = false;
        if ($valorPos8 != "") {
            $objMod = DatInversion::getValue("dat_etapinverconsprovplan", "idetapinverconsprovplan", $valorPos8, $idEjer);
            if ($valorPos7 != 0 && $objMod[0]['valor'] != $valorPos7) {
                $boolSaveTrazas = true;
                $acc = "actualizar";
                $des = "Se actualizó el valor del constructorProvincia: {$idetapinverconsprov} a: {$valorPos7} en la moneda {$idmoneda}";
                DatInversion::updatevalor("dat_etapinverconsprovplan", $valorPos7, "idetapinverconsprovplan", $valorPos8, $idEjer);
            } else if ($valorPos7 == 0 && $objMod[0]['valor'] != $valorPos7) {
                $boolSaveTrazas = true;
                $acc = "eliminar";
                $des = "Se eliminó el valor del constructorProvincia: {$idetapinverconsprov} en la moneda {$idmoneda} del ejercicio {$idEjer}";
                DatInversion::eliminarDesgloseEquipo("dat_etapinverconsprovplan", "idetapinverconsprovplan", $valorPos8);
            }
        } else if ($valorPos7 != '') {
            $boolSaveTrazas = true;
            $acc = "adicionar";
            $des = "Se adicionó {$valorPos7} en la moneda {$idmoneda} del constructorProvincia: {$idetapinverconsprov} del ejercicio {$idEjer}";
            DatInversion::addvalorConstr("dat_etapinverconsprovplan", $valorPos7, $idmoneda, $idEjer, $idetapinverconsprov);
        }
        if ($boolSaveTrazas) {
//            HisTrazasinversionesModel::seveTrazasInversiones('Desglose Constructores', $acc, dat_etapinverconsprovplan, $idinversion, $des, $iduser);
        }
    }

    public function guardarValorTotalConstuctoresEnEtapa($parametros) {
        $model = new DatInversion();
        $ejercicios[0]['idejercicio'] = $model->idejercicioPorDenominacion($parametros['aaejercicio']);
        $ejercicios[1]['idejercicio'] = $model->idejercicioPorDenominacion($parametros['aejercicio']);
        $ejercicios[2]['idejercicio'] = $parametros['idejercicio'];
        $ejercicios[3]['idejercicio'] = $model->idejercicioPorDenominacion($parametros['pejercicio']);


        $conceptos = array('plan' => 'DatInversetapaplan', 'ejec' => 'DatInversetapaejecutado', 'est' => 'DatInversetapaestimado', 'proy' => 'DatInversetapaproyectado');


//print_r($ejercicios);
        foreach ($ejercicios as $key => $value) {

            $constructoresMPAA = $model->TotalesValConst($parametros, $parametros['MP'], $value['idejercicio']);
            $constructoresUSDAA = $model->TotalesValConst($parametros, $parametros['USD'], $value['idejercicio']);
            foreach ($conceptos as $key => $concepto) {
                //Para adicionar con MP
                if ($constructoresMPAA[0][$key] != 0) {
                    $model->GuardarInversionEtapaDesglose($concepto, $parametros['MP'], $value['idejercicio'], $parametros['idetapainversion'], $constructoresMPAA[0][$key]);
                } else {
                    $model->EliminarInversionEtapaDesglose($concepto, $parametros['MP'], $value['idejercicio'], $parametros['idetapainversion']);
                }
                //Para adicionar con USD
                if ($constructoresUSDAA[0][$key] != 0) {
                    $model->GuardarInversionEtapaDesglose($concepto, $parametros['USD'], $value['idejercicio'], $parametros['idetapainversion'], $constructoresUSDAA[0][$key]);
                } else {
                    $model->EliminarInversionEtapaDesglose($concepto, $parametros['USD'], $value['idejercicio'], $parametros['idetapainversion']);
                }
            }
        }
//        die;
    }

    public function eliminarConstEnEtapa($params, $parametros) {

        $model = new DatInversion();
        $ejercicios[0]['idejercicio'] = $model->idejercicioPorDenominacion($parametros['aaejercicio']);
        $ejercicios[1]['idejercicio'] = $model->idejercicioPorDenominacion($parametros['aejercicio']);
        $ejercicios[2]['idejercicio'] = $parametros['idejercicio'];
        $ejercicios[3]['idejercicio'] = $model->idejercicioPorDenominacion($parametros['pejercicio']);
        $conceptos = array('plan' => 'mod_planifinversiones.dat_etapinverconsprovplan', 'ejec' => 'mod_planifinversiones.dat_etapinverconsprovejecutado', 'est' => 'mod_planifinversiones.dat_etapinverconsprovestimado', 'proy' => 'mod_planifinversiones.dat_etapinverconsprovproyeccion');

        foreach ($ejercicios as $key => $value) {
            foreach ($conceptos as $key => $concept) {
                foreach ($params as $index => $idelementotipomodelovalor) {
                    $objetapinvconsprov = $model->EliminarInversionConstrE($concept, $parametros['MP'], $value['idejercicio'], $idelementotipomodelovalor);
                    $objetapinvconsprov = $model->EliminarInversionConstrE($concept, $parametros['USD'], $value['idejercicio'], $idelementotipomodelovalor);
                }
            }
        }
    }

    public function adicionarEquipos($array_equipo) {
        $datos = DatEtapaEquipos::adiconarEqui($array_equipo);
        return $datos;
    }

    public function listarParam() {
        //	$datos = DatInversion::gestionarparametros($params);
        return 1;
    }

    public function listarGestionarParam($params) {
        $datos = DatInversion::gestionarparametros($params);
        return $datos;
    }

    public function listarIndicadores($params, $unidades, $centrobalances, $paises, $naturaleza) {
        $data = DatInversion::listarIndicadores($params);
//print_r($data);die;
        foreach ($data->data as $key => $value) {
            $colon = '';
            $data->data[$key]['denomviaadquisicion'] = null;
            $data->data[$key]['denomorgansatisface'] = null;
            $data->data[$key]['coeficiente'] = number_format(($value['coeficiente']), '6', '.', ',');
            $indicador = $data->data[$key]['idindicador'];

            if (is_array($value['DatIndicadorviaadquisicion'])) {
                foreach ($value['DatIndicadorviaadquisicion'] as $indice => $v) {
                    $coma = '';
                    foreach ($v['DatIndicadorviaadquisicionorganosatisface'] as $ind => $d) {
                        $data->data[$key]['denomorgansatisface'] = $data->data[$key]['denomorgansatisface'] . $coma . $d['NomOrganosatisface']['denominacion'];
                        $coma = ',';
                    }
                    $data->data[$key]['denomviaadquisicion'] = $data->data[$key]['denomviaadquisicion'] . $colon . $v['NomViaadquisicion']['denominacion'];
                    $colon = ',';
                }
            }
            foreach ($unidades as $k => $v) {
                if ($value['idumedida'] == $v['idunidadmedida']) {
                    $data->data[$key]['denoum'] = strtoupper($v['denominacionunidadmedida']);
                    $data->data[$key]['abreviaturaum'] = strtoupper($v['abreviaturaunidadmedida']);
                    break;
                }
            }

            $data->data[$key]['denompais'] = '';
            foreach ($paises as $key1 => $value1) {
                if ($value['idpais'] == $value1['idpais']) {
                    $data->data[$key]['denompais'] = $value1['nombrepais'];
                    break;
                }
            }
            $coma = '';
            $coma1 = '';
            $data->data[$key]['denocentrobalance'] = '';
            $data->data[$key]['idcentrobalance'] = '';
            foreach ($value['DatIndicadorcentrobalance'] as $k => $v) {
                foreach ($centrobalances as $k1 => $v1) {
                    if ($v['identidaddatosnomenclador'] == $v1['identidaddatosnomenclador']) {
                        $data->data[$key]['denocentrobalance'] = $data->data[$key]['denocentrobalance'] . $coma . $v1['denom'];

                        $coma = ',';
                        break;
                    }
                }
                $data->data[$key]['idcentrobalance'] = $data->data[$key]['idcentrobalance'] . $coma1 . $v['identidaddatosnomenclador'];
                $coma1 = ',';
            }

            /* $idnaturaleza = $data->data [$key]['idnaturaleza'];
              $denomnat = NomDatosnomenclador::ObtenerDatosDadoIdDatosNom($idnaturaleza);
              $data->data[$key]['naturaleza'] = $denomnat[0]['denominacion'];
              $data->data[$key]['idmodelo'] = $value['DatIndicadormodelo'][0]['idmodelo'];
              unset($data->data [$k] ['DatIndicadorcentrobalance']);
              unset($data->data [$k] ['DatIndicadormodelo']);
              $idnaturaleza = $data->data[$key]['idnaturaleza'];
              $denomnat = NomDatosnomenclador::ObtenerDatosDadoIdDatosNom($idnaturaleza);
              // print_r($denomnat);die;
              $data->data[$key]['naturaleza'] = $denomnat[0]['denominacion'];
              $data->data[$key]['idmodelo'] = $value['DatIndicadormodelo'][0]['idmodelo'];
              unset($data->data [$k] ['DatIndicadorcentrobalance']);
              unset($data->data [$k] ['DatIndicadormodelo']); */
            foreach ($naturaleza as $k => $n) {
                if ($value['idnaturaleza'] == $n['idnaturaleza']) {
                    $data->data[$key]['naturaleza'] = strtoupper($n['text']);
                    $data->data[$key]['idnaturaleza'] = strtoupper($v['idnaturaleza']);
                    break;
                }
            }

            if (!$value['indicadorplanif'] && !$value['indicadornorma'])
                $data->data[$key]['uso'] = 0;
            else
                $data->data[$key]['uso'] = 1;
        }
        // print_r( $data->data);die;
        /* $data->data = array_values($data->data);
          if ($cont == 1) {
          $data->total = count($data->data);
          } */
        return $data;
    }

    public function validarExistencia($params) {
        $accion = DatElementodocgestordoc::validarExistencia($params['idelemento']); //param idetapaelementoinversion

        if ($accion[0] != "") {
            return 1;
        } else {
            return 0;
        }
    }

    public function listarGestionarDoc($params, $idcontenido) {
        $accion = DatElementodocgestordoc::listarGestionarDoc($params, $idcontenido);
        $params['asso'] = 1; //CUANDO SE ASOCIA UN DOCUMENTO TOMA VALOR 1 EL ATRIB DOCUMENTO
        // $datos = DatEtapaElementoinversion::getByid($params['idelemento']);
        //DatElemento::UpDocumento($params, $datos->idelemento);
        return $accion;
    }

    public function buscarContenido($params) {
        $id = DatElementodocgestordoc::contenidoPorIdEle($params);
        return $id;
    }

    public function cargarGruposNomencladores($node) {
        $dir2 = split("web", $_SERVER['DOCUMENT_ROOT']);
        require_once '' . $dir2[0] .  '/apps/planificacion/planmeta/models/domain/NomTiponomenclador.php';
        $nomencladores = NomTiponomenclador::listarArbol($parametros, $node);
        
        $datos = array();
        foreach ($nomencladores as $key => $val) {
            $datos[$key]['text'] = $val['denominacion'];
            if ($node != 0) {
                $datos[$key]["checked"] = false;
                $datos[$key]['iddatosnomenclador'] = $val['iddatosnomenclador'];
            } else {
                $datos[$key]['id'] = $val['idtiponomenclador'];
            }
            $datos[$key]['leaf'] = ($val['iddatonomenclador']) ? false : true;
            $datos[$key]['qtip'] = $val['denominacion'];
        }
        return $datos;
    }

    public function listarDoc($params) {
        $arrayexis = DatElemento::ListarDoc($params);
        return $arrayexis;
    }

    public function AbrirDoc($params) {
        $arrayexis = DatElemento::ListarDoc($params);
        return $arrayexis;
    }

    public function listarP($params) {

        $datos = DatInversion::getPreInv($params);
        foreach ($datos as $key => $val) {
            $moneda = $this->integrator->datosmaestros->buscarMonedaPorIdMonedaentidad($val['idmonedaentidad']);
            $datos[$key]['moneda'] = $moneda->NomMoneda['codigoiso'];
        }
        return $datos;
    }

    public function listarF($params) {
        $datos = DatInversion::listarF($params);
        foreach ($datos as $key => $val) {
            $moneda = $this->integrator->datosmaestros->buscarMonedaPorIdMonedaentidad($val['idmonedaentidad']);
            $datos[$key]['moneda'] = $moneda->NomMoneda['codigoiso'];
        }
        return $datos;
    }

    public function listarFinanciamientoParaInversion($params) {

        $params['denom_aaejercicio'] = $params['aaejercicio'];
        $params['denom_aejercicio'] = $params['aejercicio'];
        $params['denom_pejercicio'] = $params['pejercicio'];
        $params['denom_ejercicio'] = DatInversion::ejercicioPorId($params['idejercicio']);
        //print_r($params['denom_ejercicio']);die;

        $aaejercicio = DatInversion::idejercicioPorDenominacion($params['aaejercicio']);
        if (isset($aaejercicio)) {
            $params['aaejercicio'] = $aaejercicio;
        } else
            $params['aaejercicio'] = 0;
        $aejercicio = DatInversion::idejercicioPorDenominacion($params['aejercicio']);
        if (isset($aejercicio)) {
            $params['aejercicio'] = $aejercicio;
        } else
            $params['aejercicio'] = 0;
        $pejercicio = DatInversion::idejercicioPorDenominacion($params['pejercicio']);
        if (isset($pejercicio)) {
            $params['pejercicio'] = $pejercicio;
        } else
            $params['pejercicio'] = 0;
        //print_r($params);die;
        $datosFinanciamientos = DatInversion::listarFinanciamientoParaInversion($params);
        //print_r($datosFinanciamientos);die;
        return $datosFinanciamientos;
    }

    public function listarFinancistas($params) {

        $aaejercicio = DatInversion::idejercicioPorDenominacion($params['aaejercicio']);
        if (isset($aaejercicio)) {
            $params['aaejercicio'] = $aaejercicio;
        } else
            $params['aaejercicio'] = 0;
        $aejercicio = DatInversion::idejercicioPorDenominacion($params['aejercicio']);
        if (isset($aejercicio)) {
            $params['aejercicio'] = $aejercicio;
        } else
            $params['aejercicio'] = 0;
        $pejercicio = DatInversion::idejercicioPorDenominacion($params['pejercicio']);
        if (isset($pejercicio)) {
            $params['pejercicio'] = $pejercicio;
        } else
            $params['pejercicio'] = 0;

        $datosFinanciamientos = DatInversion::listarFinancistas($params);
        //print_r($datosFinanciamientos);die;
        return $datosFinanciamientos;
    }

    public function listarFinanciamientoContado($params) {
        $aaejercicio = DatInversion::idejercicioPorDenominacion($params['aaejercicio']);
        if (isset($aaejercicio)) {
            $params['aaejercicio'] = $aaejercicio;
        } else
            $params['aaejercicio'] = 0;
        $aejercicio = DatInversion::idejercicioPorDenominacion($params['aejercicio']);
        if (isset($aejercicio)) {
            $params['aejercicio'] = $aejercicio;
        } else
            $params['aejercicio'] = 0;
        $pejercicio = DatInversion::idejercicioPorDenominacion($params['pejercicio']);
        if (isset($pejercicio)) {
            $params['pejercicio'] = $pejercicio;
        } else
            $params['pejercicio'] = 0;

        $datosFinanciamientos = DatInversion::listarFinanciamientoContado($params);

        return $datosFinanciamientos;
    }

    public function listarLiq($params) {
        $datos = DatInversion::ListarLiquidos($params);
        foreach ($datos as $key => $val) {

            $moneda = $this->integrator->datosmaestros->buscarMonedaPorIdMonedaentidad($val['idmonedaentidad']);
            $datos[$key]['moneda'] = $moneda->NomMoneda['codigoiso'];
        }
        return $datos;
    }

    public function ListarElementoV($params) {
        $datos = DatElementovalor::listarValorPorElem($params);
        $datosEquipos = DatElementovalor::CargarValorEquiposXInver($params);
        $datosPintados = count($datos);
        if ($params['idelemento'] != 0) {
            foreach ($datos as $key => $val) {
                $moneda = $this->integrator->datosmaestros->buscarMonedaPorIdMonedaentidad($val['idmonedaentidad']);
                $datos[$key]['moneda'] = $moneda->NomMoneda['codigoiso'];
                $datos[$key]['valor'] = $val['valor'];
//                $datos[$key]['valor'] = number_format($val['valor'], '2', '.', ' ');
                $datos[$key]['pintar'] = 0;
            }
            if (count($datosEquipos) > 0) {
                if ($datosEquipos[0]['importedivisa'] != 0) {
                    $datos[$datosPintados]['moneda'] = 'USD';
                    $datos[$datosPintados]['valor'] = $datosEquipos[0]['importedivisa'];
                    $datos[$datosPintados]['pintar'] = 1;
                }

                if ($datosEquipos[0]['importe'] != 0) {
                    if ($datosEquipos[0]['importedivisa'] != 0)
                        $datosPintados = $datosPintados + 1;
                    $datos[$datosPintados]['moneda'] = 'CUP';
                    $datos[$datosPintados]['valor'] = $datosEquipos[0]['importe'];
                    $datos[$datosPintados]['pintar'] = 1;
                }
            }
            return $datos;
        } else {
            $array = [];
            return $array;
        }
    }

    public function modificarPlanInv($parametros) {
        $objinversion = Doctrine::getTable('DatInversion')->find($parametros->idinversion);
        $objinversion->denominacion = $parametros->denominacion;
        $objinversion->fechainicio = $parametros->fechainicio;
        $objinversion->fechafin = $parametros->fechafin;
        $objinversion->idtipoinversion = $parametros->idtipoinversion;
        $objinversion->idobjetivo = $parametros->idobjetivo;
        $objinversion->idformapropiedad = $parametros->idformapropiedad;
        $objinversion->idmedioambiente = $parametros->idmedioambiente;
        $objinversion->idtipoinversionprograma = $parametros->idtipoinversionprograma;
        $objinversion->idcaracteristica = $parametros->idcaracteristica;
        $objinversion->idefectocomercial = $parametros->idefectocomercial;
        $objinversion->fasttrack = $parametros->fasttrack;
        $objinversion->iddatdesempenno = $parametros->iddatdesempenno;
        $objinversion->idprograma = $parametros->idprograma;
        $objinversion->analpostinversiones = $parametros->analpostinversiones;
        if ($parametros->idprovincia != null) {
            $objinversion->idprovincia = $parametros->idprovincia;
        }
        $objinversion->save();
        $respuesta = 1;

        /*  $idUSD = InversionesModel::devolverIdMonedaEnt($parametros->mp, $objinversion->idestructuracomun);
          $iddMP = InversionesModel::devolverIdMonedaEnt($parametros->usd, $objinversion->idestructuracomun);
          $datosInv['USD'] = $idUSD[0]['idmonedaentidad'] ? $idUSD[0]['idmonedaentidad'] : 0;
          $datosInv['MP'] = $iddMP[0]['idmonedaentidad'] ? $iddMP[0]['idmonedaentidad'] : 0; */

        foreach ($parametros->presupuesto as $key => $data) {
            if ($data->idpresanteproy != null) {
                $objPresupuesto = Doctrine::getTable('DatPresanteproy')->find($data->idpresanteproy);
                $objPresupuesto->valor = $data->valor;
                $objPresupuesto->idmonedaentidad = is_numeric($data->moneda) ? $data->moneda : $data->idmonedaentidad;
                $objPresupuesto->save();
                $respuesta = 1;
            } else {
                $objPresupuesto = new DatPresanteproy();
                $objPresupuesto->valor = $data->valor;
                $objPresupuesto->idmonedaentidad = $data->moneda;
                $objPresupuesto->idinversion = $parametros->idinversion;
                $objPresupuesto->save();
                $respuesta = 1;
            }
        }
        foreach ($parametros->financiamiento as $key => $data) {
            $tipo = is_numeric($data->tipo) ? $data->tipo : $data->idtipofinanciamiento;
            $financista = is_numeric($data->financi) ? $data->financi : $data->idfinancista;
            if ($data->idfinanciamiento != '') {
//-------------------------------ACREEDORES-------------------------------------
                $devolverFinanciamt = DatFinanciamiento::buscarfinanDadoTipoF($data->idfinanciamiento);
                $devolverF = DatFinanciamiento::buscartipoF($tipo, $parametros->idinversion);
                if ($devolverF[0] != '') {
                    $del9 = DatInversfinancejecutado::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $parametros->idinversion);
                    $del1 = DatInversfinancestimado::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $parametros->idinversion);
                    $del2 = DatInversfinancplan::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $parametros->idinversion);
                    $del3 = DatInversfinancproyectado::EliminarDadoIdTf($devolverFinanciamt[0]['idtipofinanciamiento'], $parametros->idinversion);
                } else if ($devolverFinanciamt[0]['idtipofinanciamiento'] != $tipo) {
                    if ($data->porcientointeres > 0) {
                        $act9 = DatInversfinancejecutado::actualizarTipoFinanc($parametros->idinversion, $tipo, $devolverFinanciamt[0]['idtipofinanciamiento']);
                        $act8 = DatInversfinancestimado::actualizarTipoFinanc($parametros->idinversion, $tipo, $devolverFinanciamt[0]['idtipofinanciamiento']);
                        $act7 = DatInversfinancplan::actualizarTipoFinanc($parametros->idinversion, $tipo, $devolverFinanciamt[0]['idtipofinanciamiento']);
                        $act6 = DatInversfinancproyectado::actualizarTipoFinanc($parametros->idinversion, $tipo, $devolverFinanciamt[0]['idtipofinanciamiento']);
                    }
                }

                if ($devolverFinanciamt[0]['idfinancista'] != $financista) {
                    //  -----------------QUIEN FINANCIA-----------------------
                    $devolverFinacistas = DatFinanciamiento::buscarFinancista($financista, $parametros->idinversion);
                    if ($devolverFinacistas[0] != '') {
                        $del9 = DatInversfinancistaestimado::EliminarDadoIdFinanc($devolverFinanciamt[0]['idfinancista'], $parametros->idinversion);
                        $del1 = DatInversfinancistaejecutado::EliminarDadoIdFinanc($devolverFinanciamt[0]['idfinancista'], $parametros->idinversion);
                        $del2 = DatInversfinancistaplan::EliminarDadoIdFinanc($devolverFinanciamt[0]['idfinancista'], $parametros->idinversion);
                        $del3 = DatInversfinancistaproyectado::EliminarDadoIdFinanc($devolverFinanciamt[0]['idfinancista'], $parametros->idinversion);
                    } else if ($devolverFinanciamt[0]['idfinancista'] != $tipo) {
                        $act9 = DatInversfinancistaestimado::actualizarFinanc($parametros->idinversion, $financista, $devolverFinanciamt[0]['idfinancista']);
                        $act8 = DatInversfinancistaejecutado::actualizarFinanc($parametros->idinversion, $financista, $devolverFinanciamt[0]['idfinancista']);
                        $act7 = DatInversfinancistaplan::actualizarFinanc($parametros->idinversion, $financista, $devolverFinanciamt[0]['idfinancista']);
                        $act6 = DatInversfinancistaproyectado::actualizarFinanc($parametros->idinversion, $financista, $devolverFinanciamt[0]['idfinancista']);
                    }
                }
            }


            if ($data->idfinanciamiento != null) {
                $objFinanciamineto = Doctrine::getTable('DatFinanciamiento')->find($data->idfinanciamiento);
                $objFinanciamineto->idfinancista = is_numeric($data->financi) ? $data->financi : $data->idfinancista;
                $objFinanciamineto->idtipofinanciamiento = is_numeric($data->tipo) ? $data->tipo : $data->idtipofinanciamiento;
                $objFinanciamineto->valor = $data->valor;
                $objFinanciamineto->idmonedaentidad = is_numeric($data->moneda) ? $data->moneda : $data->idmonedaentidad;
                $objFinanciamineto->plazoamortizacion = $data->plazoamortizacion;
                $objFinanciamineto->porcientointeres = $data->porcientointeres;
                $objFinanciamineto->gracia = $data->gracia;
                $objFinanciamineto->save();
                $respuesta = 1;
            } else {
                $objFinanciamineto = new DatFinanciamiento();
                $objFinanciamineto->idfinancista = $data->financi;
                $objFinanciamineto->idtipofinanciamiento = $data->tipo;
                $objFinanciamineto->valor = $data->valor;
                $objFinanciamineto->idmonedaentidad = $data->moneda;
                $objFinanciamineto->plazoamortizacion = $data->plazoamortizacion;
                $objFinanciamineto->porcientointeres = $data->porcientointeres;
                $objFinanciamineto->gracia = $data->gracia;
                $objFinanciamineto->idinversion = $parametros->idinversion;
                $objFinanciamineto->save();
                $respuesta = 1;
            }
        }
        if ($parametros->liquidos != null) {
            foreach ($parametros->liquidos as $key => $data) {
                if ($data->iderogacionliquido != null) {
                    $objLiq = Doctrine::getTable('DatErogacionliquido')->find($data->iderogacionliquido);
                    $objLiq->valor = $data->valor;
                    $objLiq->idmonedaentidad = is_numeric($data->moneda) ? $data->moneda : $data->idmonedaentidad;
                    $objLiq->save();
                    $respuesta = 1;
                } else {
                    $objLiq = new DatErogacionliquido();
                    $objLiq->valor = $data->valor;
                    $objLiq->idmonedaentidad = $data->moneda;
                    $objLiq->idinversion = $parametros->idinversion;
                    $objLiq->save();
                    $respuesta = 1;
                }
            }
        }
        $arrayrespuesta = array('mensaje' => $respuesta);
        return $arrayrespuesta;
    }

    public function verDetallesPlan($parametros, $datosInv) {
        $idinversion = $parametros->idinversion;
        $datosInv['start'] = 0;
        $datosInv['limit'] = 10000;
        //   print_r($datosInv);die;
        $datos = DatInversion::listarComponentes($datosInv);
        $cuerporeporte = $this->configurarDetalles($parametros);
        /*  $totalcolumnas = count($parametros->totalservicios) + 2;
          //$porcientoxcolumna = 100 / $totalcolumnas;
          $parametros->anchocolspan = $totalcolumnas;
          $parametros->fechacreacion = $fecha;

          $cuerporeporte .=self::obtenerCuerpoReporte($parametros); */
        $cuerporeporte .=self::obtenerCuerpoReportePlan($parametros, $datos, $datosInv);


        return $cuerporeporte;
    }

    public function configurarDetallesPlan($parametros) {




        $cuerporeporte = "<style type='text/css'>
                 @media all {body{display: block; background: none no-repeat scroll 100% 100% #666666;}}
                 @media print {*{visibility: visible;  padding: 0 !important; } div{ top:0; right:0; bottom:0; left:0; #AP{margin-top: 1cm;}}}

				 @page{height:700 cm;width: 200 cm;size:500;}
				 </style>";

        $cuerporeporte .= "<div style='margin:auto;width:
                700 cm;height:auto;background-color:white;padding:1cm 0.5cm 1cm 0.5cm;'>";
        $cuerporeporte .= "<div style='width:100%;'>";


        return $cuerporeporte;
    }

    public function obtenerCuerpoReportePlan($parametros, $datos, $datosInv) {

        $presupuesto = InversionesModel::listarP($datosInv);
        $financiamiento = InversionesModel::listarF($datosInv);


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
        $cuerporeporte = '';
        $cuerporeporte
                .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;table-layout:fixed;">
      <thead>
    <tr <td colspan=500, style="text-align:CENTER" ><b>VER DETALLE DEL PLAN DE LA INVERSION </b></td> </tr>
      <tr style="text-align:LEFT" ><td colspan=100><b>C&oacute;digo:</b>&nbsp' . $parametros->datosinv->codigo . '</td>
         &nbsp&nbsp&nbsp  <td colspan=100><b>Denominaci&oacute;n:</b>&nbsp' . $parametros->datosinv->denominacion . '</td>
              &nbsp&nbsp&nbsp  <td colspan=100><b>Clasificaci&oacute;n:</b>&nbsp' . $parametros->datosinv->clasificacion . '</td>
                   &nbsp&nbsp&nbsp  <td colspan=100><b>Tipo INVERSI&Oacute;N:</b>&nbsp' . $parametros->datosinv->tipoinv . '</td></tr>

      <tr style="text-align:LEFT" ><td colspan=100><b>Caracter&iacute;sticas:</b>&nbsp' . $parametros->datosinv->caracteristicas . '</td>
         &nbsp&nbsp&nbsp  <td colspan=100><b>Forma propiedad:</b>&nbsp' . $parametros->datosinv->forma . '</td>
              &nbsp&nbsp&nbsp  <td colspan=100><b>Provincia:</b>&nbsp' . $parametros->datosinv->provincia . '</td>
                   &nbsp&nbsp&nbsp  <td colspan=100><b>Fecha inicial:</b>&nbsp' . $parametros->datosinv->fechainicio . '</td></tr>

      <tr style="text-align:LEFT" ><td colspan=100><b>Fecha fin:</b>&nbsp' . $parametros->datosinv->fechafin . '</td>
         &nbsp&nbsp&nbsp  <td colspan=100><b>Objetivo:</b>&nbsp' . $parametros->datosinv->objetivo . '</td>
              &nbsp&nbsp&nbsp  <td colspan=100><b>Efecto comercial:</b>&nbsp' . $parametros->datosinv->efecto . '</td>
                  &nbsp&nbsp&nbsp  <td colspan=100><b>Aprobado:</b>&nbsp' . $aprob . '</td>
                   </tr>
                   <tr style="text-align:LEFT" ><td colspan=100><b>Fasttrack:</b>&nbsp' . $fastt . '</td>

                   </tr>
	</thead>';
        if (count($presupuesto) != 0) {
            $cuerporeporte
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;">
                        <center><tr style="text-align:center" > <b>PLAN DE PREPARACION </b>  </tr></center>
                        <thead>';
        }

        foreach ($presupuesto as $ke => $val) {

            $cuerporeporte .= '<tr style="text-align:LEFT" >
                        <td colspan=100><b>Valor :</b>&nbsp' . $val['valor'] . '</td>
                        &nbsp&nbsp&nbsp  <td colspan=100><b>Moneda :</b>&nbsp' . $val['moneda'] . '</td>
                  </tr>  </thead>';
        }
        if (count($financiamiento) != 0) {
            $cuerporeporte
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;">
                        <center><tr style="text-align:center" > <b>FINANCIAMIENTO </b>  </tr></center>
                        <thead>';
        }

        foreach ($financiamiento as $ke => $val) {

            $cuerporeporte .= '<tr style="text-align:LEFT" >
                        <td colspan=100><b>Tipo de financiamiento :</b>&nbsp' . $val['tipo'] . '</td>
                        &nbsp&nbsp&nbsp  <td colspan=100><b>Financista :</b>&nbsp' . $val['financi'] . '</td>
                            &nbsp&nbsp&nbsp  <td colspan=100><b>Valor :</b>&nbsp' . $val['valor'] . '</td>
                                &nbsp&nbsp&nbsp  <td colspan=100><b>Moneda :</b>&nbsp' . $val['moneda'] . '</td>
                  </tr>  </thead>';
        }

        return $cuerporeporte;
    }

    public function obtenerConfigParamsDinam($result, $idtabla) {
        $this->_meta = ZendExt_Metadata::getInstance();


        $array = array();
        $i = 0;
        $j = 1;

        foreach ($result->cm as $r) {
            //para quitar las cadenas largas que vienen y dejarlo en algo corto
            if (substr_count($r['dataIndex'], '.') == 2) {
                $explode = explode('.', $r['dataIndex'], 2);
                $replace = str_replace('.', '', $explode[1]);
                $array['cm'][$i]['dataIndex'] = $replace;
                $array['cm'][$i]['header'] = $r['header'];
                $i++;
            } else {
                $replace = str_replace('.', '_', $r['dataIndex']);
                $array['cm'][$i]['dataIndex'] = $replace;
                $array['cm'][$i]['header'] = $r['header'];
                $i++;
            }
            //	print_r($array['cm']);die;
        }
        $array['rd'][0]['name'] = 'iddatosnomenclador';
        foreach ($result->rd as $r) {
            if (substr_count($r['name'], '.') == 2) {
                $explode = explode('.', $r['name'], 2);
                $replace = str_replace('.', '', $explode[1]);
                $array['rd'][$j]['name'] = $replace;
                $j++;
            } else {
                $replace = str_replace('.', '_', $r['name']);
                $array['rd'][$j]['name'] = $replace;
                $j++;
            }
        }

        $editors = $this->_meta->Metadata()->obtenerConfigFormulario($idtabla);
        // print_r($editors);die;
        foreach ($array['cm'] as $k => $col) {
            foreach ($editors->items as $j => $editor) {
                if ($editor['xtype'] == 'combo') {
                    $explode = explode('_', $editor['hiddenName']);
                    $data = ereg_replace("[^0-9]", "", $explode[4]);
                    //print_r($data);die;
                    $valores = NomDatosnomenclador::ObtenerDatosNomenclador($data, $editor['displayField']);
                    //print_r($valores);die;
                    $editor['store'] = $valores;
                    $array['cm'][$j]['edit'] = $editor;
                } elseif ($col['dataIndex'] == $editor['name'] || $col['dataIndex'] == $editor['displayField']) {
                    $array['cm'][$j]['edit'] = $editor;
                }
            }
        }
        $array['datoscolumnas'] = [];
        $primero['iddatosnomenclador'] = 0;
        $primero['nom_datosnomenclador_denominacion'] = 'Ninguno';
        array_unshift($array['cm'][0]['edit']['store'], $primero);
        array_unshift($array['cm'][1]['edit']['store'], $primero);
        return $array;
    }

    public function obtenerDatosColumnasDinamicas($idTabla, $idelemento) {
        $idelementotipomodelovalor = DatEtapaElementoinversion::getIdelementotipomodelovalor($idelemento);
        $ids = Array();
        foreach ($idelementotipomodelovalor as $key => $value) {
            $ids[$key] = $value['idelementotipomodelovalor'];
        }
        $idele = implode(",", $ids);

        $this->_meta = ZendExt_Metadata::getInstance();
        $infoTabla = $this->_meta->Metadata()->obtenerInfoTabla($idTabla);
        $dat = self::camposdadoTabla($idTabla);
        foreach ($dat as $d) {
            $temp = $d['denomcampo'];
            $infoTabla->select("meta.$temp as meta_$temp");
        }
        $infoTabla->where_in("meta.idelementotipomodelovalor", $ids);
        return $infoTabla->get()->result_array();
    }

    private function camposdadoTabla($idtabla) {
        $this->_meta = ZendExt_Metadata::getInstance();
        $data = $this->_meta->Attribute()->cargarCampos($idtabla);
        $campos = array();
        $x = 0;

        foreach ($data->data as $d) {
            //Para poder excluir el id planificacion/inversion que no tiene representacion visual y nunca se modifica
            if (!($d['denominacion'] == 'idelementotipomodelovalor')) {
                $array [$x] ['denomcampo'] = $d['denominacion'];
                $array [$x] ['idcampo'] = $d['idcampo'];
            }
            $x++;
        }

        return $array;
    }

    public function guardarDatosColumnasDinamicas($idtabla, $datos, $idelemento, $idetapaelementoinversion, $transicion, $idelemtipomodelovalor) {
        $this->_meta = ZendExt_Metadata::getInstance();
        $idelementotipomodelo = self::getIdelementotipomodeloByIdelemento($idelemento);
        if ($transicion == 1) {
            //mando a insertar ese indicador en metadatos y asi con el arreglo entero
            return self::insertarDatelementotipomodelovalor($idtabla, $idelemento, $idetapaelementoinversion, $idelementotipomodelo);
        } else {
            foreach ($datos as $dat) {
                //Convertir un stdClass en array
                $parametros = get_object_vars($dat);
                $insertaok = $this->_meta->Metadata()->insertarEnMetadatos($idtabla, $parametros, array('idelementotipomodelovalor' => $idelemtipomodelovalor));
                if ($insertaok != true) {
                    $this->conn->rollback();
                }
            }
            return true;
        }
    }

    private function insertarDatelementotipomodelovalor($idtabla, $idelemento, $idetapaelementoinversion, $idelementotipomodelo) {
        $objdatelementotipomodelovalor = new Datelementotipomodelovalor();
        $objdatelementotipomodelovalor->idelementotipomodelo = $idelementotipomodelo[0]['idelementotipomodelo'];
        $objdatelementotipomodelovalor->idtabla = $idtabla;
        $objdatelementotipomodelovalor->idelemento = $idetapaelementoinversion;
        return $objdatelementotipomodelovalor->salvar($objdatelementotipomodelovalor);
    }

    private function getIdelementotipomodeloByIdelemento($idelemento) {
        return DatElementotipomodelo::getIdelementotipomodeloByIdelemento($idelemento);
    }

    public function eliminar($param) {
        try {
            $collectionElementosTipoValor = new Doctrine_Collection('Datelementotipomodelovalor');
            foreach ($param as $index => $idelementotipomodelovalor) {
                $objelementotipomodelovalor = Datelementotipomodelovalor::getByid($idelementotipomodelovalor);
                $collectionElementosTipoValor[$index] = $objelementotipomodelovalor;
            }
            $collectionElementosTipoValor->delete();
        } catch (Doctrine_Exception $ee) {
            return '-4';
        }
        return true;
    }

    public function listarComponentes($datosInv, $datos) {
        $componentes = DatInversion::listarComponentes($datosInv);
        $result = array();

        foreach ($componentes as $key => $value) {
            $datosInv['idetapa'] = $value['idetapa'];
            $datosInv['valormp'] = $datos[0]['valormp'];
            $datosInv['valorusd'] = $datos[0]['valorusd'];
            $datosInv['idejercicio'] = $datos[0]['idejercicio'];
            $datosInv['ejercicio'] = $datos[0]['ejercicio'];
            $datosInv['denominacion'] = $value['denominacion'];
            $const = DatConstructor::cargarIdEtapaInversion($value['idetapa']);
            if ($const[0] != null) {
                $datosInv['constructor'] = 1;
            } else {
                $datosInv['constructor'] = 0;
            }
            $presupuesto[] = self::cargarPresupuesto($datosInv, $datos);
        }
        return $presupuesto;
    }

    public function TotalesValConst($datosInv, $result, $ejercicios) {
        foreach ($ejercicios as $key => $value) {
            $constructoresMPAA = DatInversion::TotalesValConst($datosInv, $datosInv['monedamp'], $value['id']);
            $constructoresUSDAA = DatInversion::TotalesValConst($datosInv, $datosInv['monedausd'], $value['id']);

            foreach ($result as $key => $val) {
                if ($val['denominacion'] == 'CONST. Y MONTAJE') {
                    $result[$key]['mp' . $value['den'] . 'ejecutado'] = $constructoresMPAA[0]['ejec'];
                    $result[$key]['usd' . $value['den'] . 'ejecutado'] = $constructoresUSDAA[0]['ejec'];

                    $result[$key]['mp' . $value['den'] . 'estimado'] = $constructoresMPAA[0]['est'];
                    $result[$key]['usd' . $value['den'] . 'estimado'] = $constructoresUSDAA[0]['est'];

                    $result[$key]['mp' . $value['den'] . 'plan'] = $constructoresMPAA[0]['plan'];
                    $result[$key]['usd' . $value['den'] . 'plan'] = $constructoresUSDAA[0]['plan'];

                    $result[$key]['mp' . $value['den'] . 'proyeccion'] = $constructoresMPAA[0]['proy'];
                    $result[$key]['usd' . $value['den'] . 'proyeccion'] = $constructoresUSDAA[0]['proy'];
                    break;
                }
            }
        }  //print_r($result);die;
        return $result;
    }

    public function listarOtrosindicadores($datosInv) {
        $indCuota = 126; //indicador cuotas de inversiones en proceso.
        $indRendi = 127; //indicador rendimiento de la inversion.
        $indFondosB = 124; //indicador  fondos basicos
        $indInvProc = 125; //indicador  inversiones en proceso.
        //print_r($datosInv['idmonedaentidadmp'][0]);die;
        $tol = 0;
        $totalInv = DatInversion::totalInversiones($datosInv, $datosInv['idmonedaentidadmp']);

        if (count($totalInv) > 0) {
            foreach ($totalInv as $key => $value) {
                $tol = $value['sum'] + $tol;
            }
        }
        $planP = DatInversion::planPrep($datosInv, $datosInv['idmonedaentidadmp']);
        $pPre = $planP[0] ? $planP[0]['valor'] : 0; //para utilizarlo en la formula de rendimiento de la inv .
        $aaejercicio = DatInversion::idejercicioPorDenominacion(
                        $datosInv['aaejercicio']
        );
        $aejercicio = DatInversion::idejercicioPorDenominacion(
                        $datosInv['aejercicio']
        );
        $pejercicio = DatInversion::idejercicioPorDenominacion(
                        $datosInv['pejercicio']
        );
        $idejercicio = $datosInv['idejercicio'];
        $nomotrosind = DatInversion::listarNomOtrosind(); //TODOS LOS INDICADORES
        $otrosind = DatInversion::listarOtrosindicadores($datosInv); //TODOS LOS INDICADORES PARA ESA INVERSION
        // print_r($otrosind);die;
        $annospcant = DatInversion::listarOtrosindAnnosPCant($datosInv); //TODOS LOS INDICADORES PARA ESA INVERSION Y ANNOS POSTERIORES
        $otrosindicadores = array();



        foreach ($nomotrosind as $key => $valor) {

            $var = false;
            foreach ($otrosind as $key => $value) {
                //print_r($otrosind);die;
                //Cuando el id ejercicio es antes antes del actual *******
                if ($aaejercicio == $value['idejercicio']) {
                    $otrosindicadores[$value['idnomotrosindicadores']]['aantetotal'] = $value['ejecutado'];
                    $otrosindicadores[$value['idnomotrosindicadores']]['aanteestimado'] = $value['estimado'];
                    $otrosindicadores[$value['idnomotrosindicadores']]['aanteplan'] = $value['plan'];
                    $otrosindicadores[$value['idnomotrosindicadores']]['aanteproyeccion'] = $value['proyeccion'];
                    $otrosindicadores[$value['idnomotrosindicadores']]['idaante'] = $value['iddatotrosindicadares'];
                } else {//Cuando el id ejercicio es antes del actual *******
                    if ($aejercicio == $value['idejercicio']) {
                        $otrosindicadores[$value['idnomotrosindicadores']]['antetotal'] = $value['ejecutado'];
                        $otrosindicadores[$value['idnomotrosindicadores']]['anteestimado'] = $value['estimado'];
                        $otrosindicadores[$value['idnomotrosindicadores']]['anteplan'] = $value['plan'];
                        $otrosindicadores[$value['idnomotrosindicadores']]['anteproyeccion'] = $value['proyeccion'];
                        $otrosindicadores[$value['idnomotrosindicadores']]['idante'] = $value['iddatotrosindicadares'];
                    } else {//Cuando el id ejercicio el actual *******
                        if ($idejercicio == $value['idejercicio']) {
                            $otrosindicadores[$value['idnomotrosindicadores']]['actualtotal'] = $value['ejecutado'];
                            $otrosindicadores[$value['idnomotrosindicadores']]['actualestimado'] = $value['estimado'];
                            $otrosindicadores[$value['idnomotrosindicadores']]['actualplan'] = $value['plan'];
                            $otrosindicadores[$value['idnomotrosindicadores']]['actualproyeccion'] = $value['proyeccion'];
                            $otrosindicadores[$value['idnomotrosindicadores']]['idactual'] = $value['iddatotrosindicadares'];
                        } else {//Cuando el id ejercicio es posterior *******
                            if ($pejercicio == $value['idejercicio']) {
                                $otrosindicadores[$value['idnomotrosindicadores']]['postotal'] = $value['ejecutado'];
                                $otrosindicadores[$value['idnomotrosindicadores']]['posestimado'] = $value['estimado'];
                                $otrosindicadores[$value['idnomotrosindicadores']]['posplan'] = $value['plan'];
                                $otrosindicadores[$value['idnomotrosindicadores']]['posproyeccion'] = $value['proyeccion'];
                                $otrosindicadores[$value['idnomotrosindicadores']]['idpos'] = $value['iddatotrosindicadares'];
                            }
                        }
                    }
                }
                $otrosindicadores[$value['idnomotrosindicadores']]['otrosindicadores'] = $value['otrosindicadores'];
                $otrosindicadores[$value['idnomotrosindicadores']]['idnomotrosindicadores'] = $value['idnomotrosindicadores'];
                if ($valor['id'] == $otrosind['idnomotrosindicadores']) {
                    $var = true;
                }
            }



            foreach ($annospcant as $key => $value) {
                $otrosindicadores[$value['idnomotrosindicadores']]['cantidad'] = $value['cantidad'];
                $otrosindicadores[$value['idnomotrosindicadores']]['annospos'] = $value['annospos'];
                $otrosindicadores[$value['idnomotrosindicadores']]['idotrosindicadoresannospostcant'] = $value['idotrosindicadoresannospostcant'];
                if ($valor['id'] == $annospcant['idnomotrosindicadores']) {
                    $var = true;
                }
            }
            if ($var == false) {
                $otrosindicadores[$valor['id']]['idnomotrosindicadores'] = $valor['id'];
                $otrosindicadores[$valor['id']]['otrosindicadores'] = $valor['denominacion'];
                $otrosindicadores[$valor['id']]['descripcion'] = $valor['descripcion'];
            }
        }
        $result = array();
        $cont = 0;
        // print_r($otrosindicadores);die;
        foreach ($otrosindicadores as $key => $value) {
            if ($value['idnomotrosindicadores'] == $indInvProc) {
                $indInvValores = $otrosindicadores[$key];
            } else if ($value['idnomotrosindicadores'] == $indFondosB) {
                $indFondosValores = $otrosindicadores[$key];
            }
            $result[$cont] = $otrosindicadores[$key];
            $cont++;
        }//print_r($result);die;
        //print_r($otrosindicadores);die;

        foreach ($otrosind as $key => $value) {
            //Cuando el id ejercicio es antes antes del actual *******
            if ($aaejercicio == $value['idejercicio']) {
                //Buscar el Total de inversion y Plan de preparacion para este anno
                $totalInversion_aaejercicio = DatInversion::CalcularTotalInversionByAnno($datosInv['idinversion'], $value['idejercicio']);
                //$otrosindicadores['planPreparacion_aaejercicio'] = DatInversion::CalcularPlanPreparacionByAnno($datosInv['idinversion'],$value['idejercicio']);
            } else {//Cuando el id ejercicio es antes del actual *******
                if ($aejercicio == $value['idejercicio']) {
                    $totalInversion_aejercicio = DatInversion::CalcularTotalInversionByAnno($datosInv['idinversion'], $value['idejercicio']);
                    //$otrosindicadores['planPreparacion_aejercicio'] = DatInversion::CalcularPlanPreparacionByAnno($datosInv['idinversion'],$value['idejercicio']);
                } else {//Cuando el id ejercicio el actual *******
                    if ($idejercicio == $value['idejercicio']) {
                        $totalInversion_idejercicio = DatInversion::CalcularTotalInversionByAnno($datosInv['idinversion'], $value['idejercicio']);
                        //$otrosindicadores['planPreparacion_idejercicio'] = DatInversion::CalcularPlanPreparacionByAnno($datosInv['idinversion'],$value['idejercicio']);
                    } else {//Cuando el id ejercicio es posterior *******
                        if ($pejercicio == $value['idejercicio']) {
                            $totalInversion_pejercicio = DatInversion::CalcularTotalInversionByAnno($datosInv['idinversion'], $value['idejercicio']);
                            //$otrosindicadores['planPreparacion_pejercicio'] = DatInversion::CalcularPlanPreparacionByAnno($datosInv['idinversion'],$value['idejercicio']);
                        }
                    }
                }
            }
        }

        //print_r($totalInversion_aaejercicio[0]['valejec']);die;


        foreach ($result as $key => $value) {

            if ($value['idnomotrosindicadores'] == $indCuota) {

                $result[$key]['aantetotal'] = ($indInvValores['aantetotal'] / ($totalInversion_aaejercicio[0]['valejec']));
                $result[$key]['aanteestimado'] = ($indInvValores['aanteestimado'] / ($totalInversion_aaejercicio[0]['valest']));
                $result[$key]['aanteplan'] = ($indInvValores['aanteplan'] / ($totalInversion_aaejercicio[0]['valplan']));
                $result[$key]['aanteproyeccion'] = ($indInvValores['aanteproyeccion'] / ($totalInversion_aaejercicio[0]['valpro']));
                $result[$key]['anteestimado'] = ($indInvValores['anteestimado'] / ($totalInversion_aejercicio[0]['valest']));
                $result[$key]['antetotal'] = ($indInvValores['antetotal'] / ($totalInversion_aejercicio[0]['valejec']));
                $result[$key]['anteplan'] = ($indInvValores['anteplan'] / ($totalInversion_aejercicio[0]['valplan']));
                $result[$key]['anteproyeccion'] = ($indInvValores['anteproyeccion'] / ($totalInversion_aejercicio[0]['valpro']));
                $result[$key]['actualtotal'] = ($indInvValores['actualtotal'] / ($totalInversion_idejercicio[0]['valejec']));
                $result[$key]['actualestimado'] = ($indInvValores['actualestimado'] / ($totalInversion_idejercicio[0]['valest']));
                $result[$key]['actualplan'] = ($indInvValores['actualplan'] / ($totalInversion_idejercicio[0]['valplan']));
                $result[$key]['actualproyeccion'] = ($indInvValores['actualproyeccion'] / ($totalInversion_idejercicio[0]['valpro']));
                $result[$key]['postotal'] = ($indInvValores['postotal'] / ($totalInversion_pejercicio[0]['valejec']));
                $result[$key]['posestimado'] = ($indInvValores['posestimado'] / ($totalInversion_pejercicio[0]['valest']));
                $result[$key]['posplan'] = ($indInvValores['posplan'] / ($totalInversion_pejercicio[0]['valplan']));
                $result[$key]['posproyeccion'] = ($indInvValores['posproyeccion'] / ($totalInversion_pejercicio[0]['valpro']));
                $result[$key]['cantidad'] = $indInvValores['cantidad'] / ($tol + $pPre);
                $result[$key]['annospos'] = $indInvValores['annospos'] / ($tol + $pPre);
                //$result[$key]['cantidad'] = ($indInvValores['cantidad'] + ($tol + $pPre)) - $indFondosValores['cantidad'];
                //$result[$key]['annospos'] = ($indInvValores['annospos'] + ($tol + $pPre)) - $indFondosValores['annospos'];
            } else if ($value['idnomotrosindicadores'] == $indRendi) {
                $result[$key]['aantetotal'] = $resultado2 = number_format($indFondosValores['aantetotal'] / $totalInversion_aaejercicio[0]['valejec']/* $tol */, '2', '.', ',');
                $result[$key]['aanteestimado'] = number_format($indFondosValores['aanteestimado'] / $totalInversion_aaejercicio[0]['valest']/* $tol */, '2', '.', ',');
                $result[$key]['aanteplan'] = number_format($indFondosValores['aanteplan'] / $totalInversion_aaejercicio[0]['valplan']/* $tol */, '2', '.', ',');
                $result[$key]['aanteproyeccion'] = number_format($indFondosValores['aanteproyeccion'] / $totalInversion_aaejercicio[0]['valpro']/* $tol */, '2', '.', ',');
                $result[$key]['antetotal'] = number_format($indFondosValores['antetotal'] / $totalInversion_aejercicio[0]['valejec']/* $tol */, '2', '.', ',');
                $result[$key]['anteestimado'] = number_format($indFondosValores['anteestimado'] / $totalInversion_aejercicio[0]['valest']/* $tol */, '2', '.', ',');
                $result[$key]['anteplan'] = number_format($indFondosValores['anteplan'] / $totalInversion_aejercicio[0]['valplan']/* $tol */, '2', '.', ',');
                $result[$key]['anteproyeccion'] = number_format($indFondosValores['anteproyeccion'] / $totalInversion_aejercicio[0]['valpro']/* $tol */, '2', '.', ',');
                $result[$key]['actualtotal'] = number_format($indFondosValores['actualtotal'] / $totalInversion_idejercicio[0]['valejec']/* $tol */, '2', '.', ',');
                $result[$key]['actualestimado'] = number_format($indFondosValores['actualestimado'] / $totalInversion_idejercicio[0]['valest']/* $tol */, '2', '.', ',');
                $result[$key]['actualplan'] = number_format($indFondosValores['actualplan'] / $totalInversion_idejercicio[0]['valplan']/* $tol */, '2', '.', ',');
                $result[$key]['actualproyeccion'] = number_format($indFondosValores['actualproyeccion'] / $totalInversion_idejercicio[0]['valpro']/* $tol */, '2', '.', ',');
                $result[$key]['postotal'] = number_format($indFondosValores['postotal'] / $totalInversion_pejercicio[0]['valejec']/* $tol */, '2', '.', ',');
                $result[$key]['posestimado'] = number_format($indFondosValores['posestimado'] / $totalInversion_pejercicio[0]['valest']/* $tol */, '2', '.', ',');
                $result[$key]['posplan'] = number_format($indFondosValores['posplan'] / $totalInversion_pejercicio[0]['valplan']/* $tol */, '2', '.', ',');
                $result[$key]['posproyeccion'] = number_format($indFondosValores['posproyeccion'] / $totalInversion_pejercicio[0]['valpro']/* $tol */, '2', '.', ',');
                $result[$key]['cantidad'] = number_format($indFondosValores['cantidad'] / $tol, '2', '.', ',');
                $result[$key]['annospos'] = number_format($indFondosValores['annospos'] / $tol, '2', '.', ',');
            }
        } //print_r($result);die;
        return $result;
    }

    private function CalcularTotalInversionByAnno($idInversion, $idEjercicio) {
        
    }

    //***
    public function guardarOtrosindicadores($params) {
        $aaejercicio = DatInversion::idejercicioPorDenominacion($params['aaejercicio']);
        $aejercicio = DatInversion::idejercicioPorDenominacion($params['aejercicio']);
        $pejercicio = DatInversion::idejercicioPorDenominacion($params['pejercicio']);
        $idejercicio = $params['idejercicio'];
        $idinversion = $params['idinversion'];
        $otrosind = $params['valores'];
        foreach ($otrosind as $key => $value) {
            $boolSaveTrazas = false;
            if (($value->aantetotal >= 0 || $value->aanteestimado >= 0 || $value->aanteplan >= 0 || $value->aanteproyeccion >= 0) && $aaejercicio != '') {
                $estadoEjer = DatInversion::estadoEjercicioPorEjercicio($aaejercicio);

                $boolSaveTrazas = true;
                $boolAdd = false;

                if ($value->idaante) {
                    $acc = "modificar";
                    $objOtrosInd = Doctrine::getTable('DatOtrosIndicadares')->find($value->idaante);

                    $objOtrosInd->ejecutado = $objOtrosInd->ejecutado;
                    $objOtrosInd->estimado = $objOtrosInd->estimado;
                    $objOtrosInd->plan = $objOtrosInd->plan;
                    $objOtrosInd->proyeccion = $objOtrosInd->proyeccion;
                } else {
                    $acc = "adicionar";
                    $boolAdd = true;

                    $objOtrosInd = new DatOtrosIndicadares();
                    $objOtrosInd->ejecutado = 0;
                    $objOtrosInd->estimado = 0;
                    $objOtrosInd->plan = 0;
                    $objOtrosInd->proyeccion = 0;
                }
                $objOtrosInd->idejercicio = $aaejercicio;
                $objOtrosInd->idinversion = $idinversion;
                $objOtrosInd->idnomotrosindicadores = $value->idnomotrosindicadores;
                if ($estadoEjer != 'Cerrado' || $params['ajustar'] == 'true') {
                    $objOtrosInd->ejecutado = ($value->aantetotal) ? $value->aantetotal : 0;
                }
                if (($estadoEjer != 'Cerrado' && $estadoEjer != 'Ejecución') || ($params['ajustar'] == 'true')) {
                    $objOtrosInd->estimado = ($value->aanteestimado) ? $value->aanteestimado : 0;
                }
                if (($estadoEjer != 'Cerrado' && $estadoEjer != 'Listo' && $estadoEjer != 'Ejecución') || ($params['ajustar'] == 'true')) {
                    $objOtrosInd->plan = ($value->aanteplan) ? $value->aanteplan : 0;
                    $objOtrosInd->proyeccion = ($value->aanteproyeccion) ? $value->aanteproyeccion : 0;
                }
                if ($objOtrosInd->ejecutado != 0 || $objOtrosInd->estimado != 0 ||
                        $objOtrosInd->plan != 0 || $objOtrosInd->proyeccion != 0) {
                    $des = "El idnomotrosindicadores {$objOtrosInd->idnomotrosindicadores} se {$acc} y quedó:
                    ejecutado: {$objOtrosInd->ejecutado} estimado: {$objOtrosInd->estimado}
                    plan: {$objOtrosInd->plan} proyección: {$objOtrosInd->proyeccion} del ejercicio: {$objOtrosInd->idejercicio}";

                    $objOtrosInd->save();
                } else if (($objOtrosInd->ejecutado == 0 && $objOtrosInd->estimado == 0 && $objOtrosInd->plan == 0 && $objOtrosInd->proyeccion == 0) && (!$boolAdd)) {
                    $acc = "eliminar";
                    $des = "Se eliminó el idnomotrosindicadores {$objOtrosInd->idnomotrosindicadores}
                    del ejercicio: {$objOtrosInd->idejercicio}";
                    $objOtrosInd->delete();
                }
            }
            if (($value->antetotal >= 0 || $value->anteestimado >= 0 || $value->anteplan >= 0 || $value->anteproyeccion >= 0) && $aejercicio != '') {

                $estadoEjer = DatInversion::estadoEjercicioPorEjercicio($aejercicio);

                $boolSaveTrazas = true;
                $boolAdd = false;

                if ($value->idante) {
                    $acc = "modificar";

                    $objOtrosInd = Doctrine::getTable('DatOtrosIndicadares')->find($value->idante);
                    $objOtrosInd->ejecutado = $objOtrosInd->ejecutado;
                    $objOtrosInd->estimado = $objOtrosInd->estimado;
                    $objOtrosInd->plan = $objOtrosInd->plan;
                    $objOtrosInd->proyeccion = $objOtrosInd->proyeccion;
                } else {
                    $acc = "adicionar";
                    $boolAdd = true;

                    $objOtrosInd = new DatOtrosIndicadares();
                    $objOtrosInd->ejecutado = 0;
                    $objOtrosInd->estimado = 0;
                    $objOtrosInd->plan = 0;
                    $objOtrosInd->proyeccion = 0;
                }
                $objOtrosInd->idejercicio = $aejercicio;
                $objOtrosInd->idinversion = $idinversion;
                $objOtrosInd->idnomotrosindicadores = $value->idnomotrosindicadores;
                if ($estadoEjer != 'Cerrado' || $params['ajustar'] == 'true') {
                    $objOtrosInd->ejecutado = ($value->antetotal) ? $value->antetotal : 0;
                }
                if (($estadoEjer != 'Cerrado' && $estadoEjer != 'Ejecución') || ($params['ajustar'] == 'true')) {
                    $objOtrosInd->estimado = ($value->anteestimado) ? $value->anteestimado : 0;
                }
                if (($estadoEjer != 'Cerrado' && $estadoEjer != 'Listo' && $estadoEjer != 'Ejecución') || ($params['ajustar'] == 'true')) {
                    $objOtrosInd->plan = ($value->anteplan) ? $value->anteplan : 0;
                    $objOtrosInd->proyeccion = ($value->anteproyeccion) ? $value->anteproyeccion : 0;
                }

                if ($objOtrosInd->ejecutado != 0 || $objOtrosInd->estimado != 0 ||
                        $objOtrosInd->plan != 0 || $objOtrosInd->proyeccion != 0) {
                    $des = "El idnomotrosindicadores {$objOtrosInd->idnomotrosindicadores} se {$acc} y quedó:
                    ejecutado: {$objOtrosInd->ejecutado} estimado: {$objOtrosInd->estimado}
                    plan: {$objOtrosInd->plan} proyección: {$objOtrosInd->proyeccion} del ejercicio: {$objOtrosInd->idejercicio}";

                    $objOtrosInd->save();
                } else if (($objOtrosInd->ejecutado == 0 && $objOtrosInd->estimado == 0 && $objOtrosInd->plan == 0 && $objOtrosInd->proyeccion == 0) && (!$boolAdd)) {
                    $acc = "eliminar";
                    $des = "Se eliminó el idnomotrosindicadores {$objOtrosInd->idnomotrosindicadores}
                    del ejercicio: {$objOtrosInd->idejercicio}";
                    $objOtrosInd->delete();
                }
            }
            if (($value->actualtotal >= 0 || $value->actualestimado >= 0 || $value->actualplan >= 0 || $value->actualproyeccion >= 0) && $idejercicio != '') {

                $estadoEjer = DatInversion::estadoEjercicioPorEjercicio($idejercicio);

                $boolSaveTrazas = true;
                $boolAdd = false;

                if ($value->idactual) {
                    $acc = "modificar";

                    $objOtrosInd = Doctrine::getTable('DatOtrosIndicadares')->find($value->idactual);
                    $objOtrosInd->ejecutado = $objOtrosInd->ejecutado;
                    $objOtrosInd->estimado = $objOtrosInd->estimado;
                    $objOtrosInd->plan = $objOtrosInd->plan;
                    $objOtrosInd->proyeccion = $objOtrosInd->proyeccion;
                } else {
                    $acc = "adicionar";
                    $boolAdd = true;

                    $objOtrosInd = new DatOtrosIndicadares();
                    $objOtrosInd->ejecutado = 0;
                    $objOtrosInd->estimado = 0;
                    $objOtrosInd->plan = 0;
                    $objOtrosInd->proyeccion = 0;
                }
                $objOtrosInd->idejercicio = $idejercicio;
                $objOtrosInd->idinversion = $idinversion;
                $objOtrosInd->idnomotrosindicadores = $value->idnomotrosindicadores;
                if ($estadoEjer != 'Cerrado' || $params['ajustar'] == 'true') {
                    $objOtrosInd->ejecutado = ($value->actualtotal) ? $value->actualtotal : 0;
                }
                if (($estadoEjer != 'Cerrado' && $estadoEjer != 'Ejecución') || ($params['ajustar'] == 'true')) {
                    $objOtrosInd->estimado = ($value->actualestimado) ? $value->actualestimado : 0;
                }
                if (($estadoEjer != 'Cerrado' && $estadoEjer != 'Listo' && $estadoEjer != 'Ejecución') || ($params['ajustar'] == 'true')) {
                    $objOtrosInd->plan = ($value->actualplan) ? $value->actualplan : 0;
                    $objOtrosInd->proyeccion = ($value->actualproyeccion) ? $value->actualproyeccion : 0;
                }

                if ($objOtrosInd->ejecutado != 0 || $objOtrosInd->estimado != 0 ||
                        $objOtrosInd->plan != 0 || $objOtrosInd->proyeccion != 0) {
                    $des = "El idnomotrosindicadores {$objOtrosInd->idnomotrosindicadores} se {$acc} y quedó:
                    ejecutado: {$objOtrosInd->ejecutado} estimado: {$objOtrosInd->estimado}
                    plan: {$objOtrosInd->plan} proyección: {$objOtrosInd->proyeccion} del ejercicio: {$objOtrosInd->idejercicio}";

                    $objOtrosInd->save();
                } else if (($objOtrosInd->ejecutado == 0 && $objOtrosInd->estimado == 0 && $objOtrosInd->plan == 0 && $objOtrosInd->proyeccion == 0) && (!$boolAdd)) {
                    $acc = "eliminar";
                    $des = "Se eliminó el idnomotrosindicadores {$objOtrosInd->idnomotrosindicadores}
                    del ejercicio: {$objOtrosInd->idejercicio}";
                    $objOtrosInd->delete();
                }
            }
            if (($value->postotal >= 0 || $value->posestimado >= 0 || $value->posplan >= 0 || $value->posproyeccion >= 0) && $pejercicio != '') {

                $estadoEjer = DatInversion::estadoEjercicioPorEjercicio($pejercicio);

                $boolSaveTrazas = true;
                $boolAdd = false;

                if ($value->idpos) {
                    $acc = "modificar";

                    $objOtrosInd = Doctrine::getTable('DatOtrosIndicadares')->find($value->idpos);
                    $objOtrosInd->ejecutado = $objOtrosInd->ejecutado;
                    $objOtrosInd->estimado = $objOtrosInd->estimado;
                    $objOtrosInd->plan = $objOtrosInd->plan;
                    $objOtrosInd->proyeccion = $objOtrosInd->proyeccion;
                } else {
                    $acc = "adicionar";
                    $boolAdd = true;

                    $objOtrosInd = new DatOtrosIndicadares();
                    $objOtrosInd->ejecutado = 0;
                    $objOtrosInd->estimado = 0;
                    $objOtrosInd->plan = 0;
                    $objOtrosInd->proyeccion = 0;
                }
                $objOtrosInd->idejercicio = $pejercicio;
                $objOtrosInd->idinversion = $idinversion;
                $objOtrosInd->idnomotrosindicadores = $value->idnomotrosindicadores;
                if ($estadoEjer != 'Cerrado' || $params['ajustar'] == 'true') {
                    $objOtrosInd->ejecutado = ($value->postotal) ? $value->postotal : 0;
                }
                if (($estadoEjer != 'Cerrado' && $estadoEjer != 'Ejecución') || ($params['ajustar'] == 'true')) {
                    $objOtrosInd->estimado = ($value->posestimado) ? $value->posestimado : 0;
                }
                if (($estadoEjer != 'Cerrado' && $estadoEjer != 'Listo' && $estadoEjer != 'Ejecución') || ($params['ajustar'] == 'true')) {
                    $objOtrosInd->plan = ($value->posplan) ? $value->posplan : 0;
                    $objOtrosInd->proyeccion = ($value->posproyeccion) ? $value->posproyeccion : 0;
                }

                if ($objOtrosInd->ejecutado != 0 || $objOtrosInd->estimado != 0 ||
                        $objOtrosInd->plan != 0 || $objOtrosInd->proyeccion != 0) {
                    $des = "El idnomotrosindicadores {$objOtrosInd->idnomotrosindicadores} se {$acc} y quedó:
                    ejecutado: {$objOtrosInd->ejecutado} estimado: {$objOtrosInd->estimado}
                    plan: {$objOtrosInd->plan} proyección: {$objOtrosInd->proyeccion} del ejercicio: {$objOtrosInd->idejercicio}";

                    $objOtrosInd->save();
                } else if (($objOtrosInd->ejecutado == 0 && $objOtrosInd->estimado == 0 && $objOtrosInd->plan == 0 && $objOtrosInd->proyeccion == 0) && (!$boolAdd)) {
                    $acc = "eliminar";
                    $des = "Se eliminó el idnomotrosindicadores {$objOtrosInd->idnomotrosindicadores}
                    del ejercicio: {$objOtrosInd->idejercicio}";
                    $objOtrosInd->delete();
                }
            }
            if ($value->annospos >= 0 || $value->cantidad >= 0) {
                if ($value->idotrosindicadoresannospostcant) {
                    $objAnnosPCant = Doctrine::getTable('DatOtrosIndicadoresAnnosPostCant')->find($value->idotrosindicadoresannospostcant);
                } else {
                    $objAnnosPCant = new DatOtrosIndicadoresAnnosPostCant();
                }
                $objAnnosPCant->idinversion = $idinversion;
                $objAnnosPCant->idnomotrosindicadores = $value->idnomotrosindicadores;
                $objAnnosPCant->valor = ($value->annospos) ? $value->annospos : 0;
                $objAnnosPCant->cantidad = ($value->cantidad) ? $value->cantidad : 0;
                $objAnnosPCant->save();
            }

            if ($boolSaveTrazas) {
//                HisTrazasinversionesModel::seveTrazasInversiones('Desglose Otros Indicadores', $acc, "DatOtrosIndicadares", $params['idinversion'], $des, $params['usuario']);
            }
        }
        return 1;
    }

    //****listar Capacidades a poner en explotacion para otros inicadores *****
    /* public function listarInvCapExplotacion($datosInv) {
      $aaejercicio = DatInversion::idejercicioPorDenominacion(
      $datosInv['aaejercicio']
      );
      $aejercicio = DatInversion::idejercicioPorDenominacion(
      $datosInv['aejercicio']
      );
      $pejercicio = DatInversion::idejercicioPorDenominacion(
      $datosInv['pejercicio']
      );
      $idejercicio = $datosInv['idejercicio'];
      $explotacion = DatInversion::listarInvCapExplotacion($datosInv);
      $annosPCant = DatInversion::listarCapExplotAnnosPCant($datosInv);
      $capexplot = array();

      foreach ($explotacion as $key => $value) {

      if ($aaejercicio == $value['idejercicio']) {
      $capexplot[$value['iddatcapexplotacion']]['aantetotal'] = $value['ejecutado'];
      $capexplot[$value['iddatcapexplotacion']]['aanteestimado'] = $value['estimado'];
      $capexplot[$value['iddatcapexplotacion']]['aanteplan'] = $value['plan'];
      $capexplot[$value['iddatcapexplotacion']]['aanteproyeccion'] = $value['proyeccion'];
      $capexplot[$value['iddatcapexplotacion']]['idaante'] = $value['idinverscapexplot'];
      } else {
      if ($aejercicio == $value['idejercicio']) {
      $capexplot[$value['iddatcapexplotacion']]['antetotal'] = $value['ejecutado'];
      $capexplot[$value['iddatcapexplotacion']]['anteestimado'] = $value['estimado'];
      $capexplot[$value['iddatcapexplotacion']]['anteplan'] = $value['plan'];
      $capexplot[$value['iddatcapexplotacion']]['anteproyeccion'] = $value['proyeccion'];
      $capexplot[$value['iddatcapexplotacion']]['idante'] = $value['idinverscapexplot'];
      } else {
      if ($idejercicio == $value['idejercicio']) {
      $capexplot[$value['iddatcapexplotacion']]['actualtotal'] = $value['ejecutado'];
      $capexplot[$value['iddatcapexplotacion']]['actualestimado'] = $value['estimado'];
      $capexplot[$value['iddatcapexplotacion']]['actualplan'] = $value['plan'];
      $capexplot[$value['iddatcapexplotacion']]['actualproyeccion'] = $value['proyeccion'];
      $capexplot[$value['iddatcapexplotacion']]['idactual'] = $value['idinverscapexplot'];
      } else {
      if ($pejercicio == $value['idejercicio']) {
      $capexplot[$value['iddatcapexplotacion']]['postotal'] = $value['ejecutado'];
      $capexplot[$value['iddatcapexplotacion']]['posestimado'] = $value['estimado'];
      $capexplot[$value['iddatcapexplotacion']]['posplan'] = $value['plan'];
      $capexplot[$value['iddatcapexplotacion']]['posproyeccion'] = $value['proyeccion'];
      $capexplot[$value['iddatcapexplotacion']]['idpos'] = $value['idinverscapexplot'];
      }
      }
      }
      }

      $capexplot[$value['iddatcapexplotacion']]['nivelact'] = $value['nivelact'];
      $capexplot[$value['iddatcapexplotacion']]['um'] = $value['um'];
      $capexplot[$value['iddatcapexplotacion']]['iddatcapexplotacion'] = $value['iddatcapexplotacion'];
      }

      foreach ($annosPCant as $key => $value) {
      $capexplot[$value['iddatcapexplotacion']]['nivelact'] = $value['nivelact'];
      $capexplot[$value['iddatcapexplotacion']]['um'] = $value['um'];
      $capexplot[$value['iddatcapexplotacion']]['cantidad'] = $value['cantidad'];
      $capexplot[$value['iddatcapexplotacion']]['annospos'] = $value['annospos'];
      $capexplot[$value['iddatcapexplotacion']]['iddatcapexplotacion'] = $value['iddatcapexplotacion'];
      $capexplot[$value['iddatcapexplotacion']]['idcapexplotannospostcant'] = $value['idcapexplotannospostcant'];
      }
      $result = array();
      $cont = 0;
      foreach ($capexplot as $key => $value) {
      $result[$cont] = $capexplot[$key];
      $cont++;
      }
      return $result;
      } */

    //*** listar desglose Niveles de actividad para plataforma integrada ****
    public function listarInvCapExplotacion($params) {
        $aaejercicio = DatInversion::idejercicioPorDenominacion($params['aaejercicio']);
        $aejercicio = DatInversion::idejercicioPorDenominacion($params['aejercicio']);
        $pejercicio = DatInversion::idejercicioPorDenominacion($params['pejercicio']);

        $params['aaejercicio'] = $aaejercicio;
        $params['aejercicio'] = $aejercicio;
        $params['pejercicio'] = $pejercicio;

        $explotacion = DatInversion::listarInvNivelActividad($params);

        return $explotacion;
    }

    //***
    /* public function guardarNiveles($params) {
      $aaejercicio = DatInversion::idejercicioPorDenominacion(
      $params['aaejercicio']
      );
      $aejercicio = DatInversion::idejercicioPorDenominacion(
      $params['aejercicio']
      );
      $pejercicio = DatInversion::idejercicioPorDenominacion(
      $params['pejercicio']
      );
      $idejercicio = $params['idejercicio'];
      $idinversion = $params['idinversion'];
      $niveles = $params['valores'];
      foreach ($niveles as $key => $value) {
      if (($value->aantetotal || $value->aanteestimado || $value->aanteplan || $value->aanteproyeccion) && $aaejercicio != ''
      ) {
      if ($value->idaante) {
      $objNiveles = Doctrine::getTable('DatInverscapexplot')
      ->find($value->idaante);
      } else {
      $objNiveles = new DatInverscapexplot();
      }
      $objNiveles->idejercicio = $aaejercicio;
      $objNiveles->idinversion = $idinversion;
      $objNiveles->iddatcapexplotacion = $value->iddatcapexplotacion;
      $objNiveles->ejecutado = ($value->aantetotal) ? $value->aantetotal : 0;
      $objNiveles->estimado = ($value->aanteestimado) ? $value->aanteestimado : 0;
      $objNiveles->plan = ($value->aanteplan) ? $value->aanteplan : 0;
      $objNiveles->proyeccion = ($value->aanteproyeccion) ? $value->aanteproyeccion : 0;
      $objNiveles->save();
      }
      if (($value->antetotal || $value->anteestimado || $value->anteplan || $value->anteproyeccion) && $aejercicio != ''
      ) {
      if ($value->idante) {
      $objNiveles = Doctrine::getTable('DatInverscapexplot')
      ->find($value->idante);
      } else {
      $objNiveles = new DatInverscapexplot();
      }
      $objNiveles->idejercicio = $aejercicio;
      $objNiveles->idinversion = $idinversion;
      $objNiveles->iddatcapexplotacion = $value->iddatcapexplotacion;
      $objNiveles->ejecutado = ($value->antetotal) ? $value->antetotal : 0;
      $objNiveles->estimado = ($value->anteestimado) ? $value->anteestimado : 0;
      $objNiveles->plan = ($value->anteplan) ? $value->anteplan : 0;
      $objNiveles->proyeccion = ($value->anteproyeccion) ? $value->anteproyeccion : 0;
      $objNiveles->save();
      }
      if (($value->actualtotal || $value->actualestimado || $value->actualplan || $value->actualproyeccion) && $idejercicio != ''
      ) {
      if ($value->idactual) {
      $objNiveles = Doctrine::getTable('DatInverscapexplot')
      ->find($value->idactual);
      } else {
      $objNiveles = new DatInverscapexplot();
      }
      $objNiveles->idejercicio = $idejercicio;
      $objNiveles->idinversion = $idinversion;
      $objNiveles->iddatcapexplotacion = $value->iddatcapexplotacion;
      $objNiveles->ejecutado = ($value->actualtotal) ? $value->actualtotal : 0;
      $objNiveles->estimado = ($value->actualestimado) ? $value->actualestimado : 0;
      $objNiveles->plan = ($value->actualplan) ? $value->actualplan : 0;
      $objNiveles->proyeccion = ($value->actualproyeccion) ? $value->actualproyeccion : 0;
      $objNiveles->save();
      }
      if (($value->postotal || $value->posestimado || $value->posplan || $value->posproyeccion) && $pejercicio != ''
      ) {
      if ($value->idpos) {
      $objNiveles = Doctrine::getTable('DatInverscapexplot')
      ->find($value->idpos);
      } else {
      $objNiveles = new DatInverscapexplot();
      }
      $objNiveles->idejercicio = $pejercicio;
      $objNiveles->idinversion = $idinversion;
      $objNiveles->iddatcapexplotacion = $value->iddatcapexplotacion;
      $objNiveles->ejecutado = ($value->postotal) ? $value->postotal : 0;
      $objNiveles->estimado = ($value->posestimado) ? $value->posestimado : 0;
      $objNiveles->plan = ($value->posplan) ? $value->posplan : 0;
      $objNiveles->proyeccion = ($value->posproyeccion) ? $value->posproyeccion : 0;
      $objNiveles->save();
      }
      if ($value->annospos || $value->cantidad) {
      if ($value->idcapexplotannospostcant) {
      $objAnnosPCant = Doctrine::getTable(
      'DatCapExplotAnnosPostCant'
      )->find($value->idcapexplotannospostcant);
      } else {
      $objAnnosPCant = new DatCapExplotAnnosPostCant();
      }
      $objAnnosPCant->idinversion = $idinversion;
      $objAnnosPCant->iddatcapexplotacion = $value->iddatcapexplotacion;
      $objAnnosPCant->valor = ($value->annospos) ? $value->annospos : 0;
      $objAnnosPCant->cantidad = ($value->cantidad) ? $value->cantidad : 0;
      $objAnnosPCant->save();
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
      } */



    //** Adicionar niveles **
    public function adicionarInvCapExp($params) {
        $idejercicio = $params['idejercicio'];
        $idinversion = $params['idinversion'];
        $niveles = $params['arrayidniveles'];
        foreach ($niveles as $key => $value) {
            $existe = Doctrine::getTable('DatInverscapexplot')->findByDql(
                    "iddatcapexplotacion = $value->iddatcapexplotacion AND idinversion= $idinversion"
            );
            if ($existe[0]->iddatcapexplotacion == null) {
                $objNiveles = new DatInverscapexplot();
                $objNiveles->idejercicio = $idejercicio;
                $objNiveles->idinversion = $idinversion;
                $objNiveles->iddatcapexplotacion = $value->iddatcapexplotacion;
                $objNiveles->ejecutado = 0;
                $objNiveles->estimado = 0;
                $objNiveles->plan = 0;
                $objNiveles->proyeccion = 0;
                $objNiveles->save();
            }
        }
        return 1;
    }

    public function eliminarInvCapExp($params) {
        $niveles = $params['array_niveles'];
        foreach ($niveles as $key => $value) {
            if ($value->idcapexplotannospostcant) {
                $objAnnosPCant = Doctrine::getTable('DatCapExplotAnnosPostCant')
                        ->find($value->idcapexplotannospostcant);
                $objAnnosPCant->delete();
            }
            if ($value->idaante) {
                $objNiveles = Doctrine::getTable('DatInverscapexplot')->find(
                        $value->idaante
                );
                $objNiveles->delete();
            }
            if ($value->idante) {
                $objNiveles = Doctrine::getTable('DatInverscapexplot')->find(
                        $value->idante
                );
                $objNiveles->delete();
            }
            if ($value->idactual) {
                $objNiveles = Doctrine::getTable('DatInverscapexplot')->find(
                        $value->idactual
                );
                $objNiveles->delete();
            }
            if ($value->idpos) {
                $objNiveles = Doctrine::getTable('DatInverscapexplot')->find(
                        $value->idpos
                );
                $objNiveles->delete();
            }
        }
        return 1;
    }

    public function listarCapExplotacion($datosInv) {
        $otrosindicadores = DatInversion::listarCapExplotacion($datosInv);
        return $otrosindicadores;
    }

    public function listarCmpConstructor($datos) {
        //$cmp = DatInversion::listarCmpConstructor($datos);
        $pres = self::listarConstructorPorEjercicio($datos);
        return $pres;
    }

    public function listarConstructorPorEjercicio($datosInv) {
        //ARREGLO DE CADA EJERCICIO QUE SE LISTA POR CONSTRUCTOR
        $ejercicio = array();
        $moneda = array();
        $moneda[0]['id'] = $datosInv['idmp'];
        $moneda[0]['name'] = 'mp';
        $moneda[1]['id'] = $datosInv['idusd'];
        $moneda[1]['name'] = 'usd';
        $ejercicio[0]['id'] = DatInversion::idejercicioPorDenominacion($datosInv['aaejercicio']);
        $ejercicio[1]['id'] = DatInversion::idejercicioPorDenominacion($datosInv['aejercicio']);
        $ejercicio[2]['id'] = $datosInv['idejercicio'];
        $ejercicio[3]['id'] = DatInversion::idejercicioPorDenominacion($datosInv['pejercicio']);
        $cont = 1; //CONTADOR CON EL QUE SE CONCADENA LOS PARAMETROS MANDADOS
        //ARREGLO LAS DOS MONEDAS QUE SE VAN A LISTAR PARA CADA EJERCICIO POR CONSTRUCTOR
        $constructores = DatInversion::Listarconstructores($datosInv); //TODOS LOS CONSTRUCTORES POR EJERC ENTIDAD INVERSION
        //print_r($constructores);die;
        foreach ($constructores as $key => $valor) {//RECORRO LOS CONSTRUCTORES
            foreach ($ejercicio as $ke => $value) {//REINICIA EL CONTADOR
                foreach ($moneda as $value1) {//PARA LAS DOS MONEDAS
                    $provincia = $this->integrator->datosmaestros->getElementoid($valor['iddpt']);
                    $constructores[$key]['denominacion'] = $valor['den'] . '-' . $provincia[0]['denominacion'];
                    $ejecutar = DatInversion::listarejecutado($value['id'], $value1['id'], $valor['idetapinverconsprov'], $datosInv);
                    $constructores[$key]['ejecutado' . $value1['name'] . $cont] = $ejecutar[0]['valor'] ? $ejecutar[0]['valor'] : 0;
                    if ($ejecutar[0]['idetapinverconsprovejecutado'] != "") {
                        $constructores[$key]['idetapinverconsprovejecutado' . $value1['name'] . $cont] = $ejecutar[0]['idetapinverconsprovejecutado'] ? $ejecutar[0]['idetapinverconsprovejecutado'] : 0;
                    }
                    $estima = DatInversion::listarestimado($value['id'], $value1['id'], $valor['idetapinverconsprov'], $datosInv);
                    $constructores[$key]['estimado' . $value1['name'] . $cont] = $estima[0]['valor'] ? $estima[0]['valor'] : 0;
                    if ($estima[0]['idetapinverconsprovestimado'] != "") {
                        $constructores[$key]['idetapinverconsprovestimado' . $value1['name'] . $cont] = $estima[0]['idetapinverconsprovestimado'];
                    }
                    $proyec = DatInversion::listarproyecc($value['id'], $value1['id'], $valor['idetapinverconsprov'], $datosInv);
                    $constructores[$key]['proyec' . $value1['name'] . $cont] = $proyec[0]['valor'] ? $proyec[0]['valor'] : 0;
                    if ($proyec[0]['idetapinverconsprovproyeccion'] != "") {
                        $constructores[$key]['idetapinverconsprovproyeccion' . $value1['name'] . $cont] = $proyec[0]['idetapinverconsprovproyeccion'];
                    }
                    $plan = DatInversion::listarplanconts($value['id'], $value1['id'], $valor['idetapinverconsprov'], $datosInv);
                    //print_r($plan);die;
                    $constructores[$key]['plan' . $value1['name'] . $cont] = $plan[0]['valor'] ? $plan[0]['valor'] : 0;
                    if ($plan[0]['idetapinverconsprovplan'] != "") {
                        $constructores[$key]['idetapinverconsprovplan' . $value1['name'] . $cont] = $plan[0]['idetapinverconsprovplan'];
                    }
                }
                $cont = $cont + 1;
            }
            $cont = 1;
        }
        return $constructores;
    }

    public function listPres($datos) {
        $parametros->ejercicio = NomEjercicioplanificacion::getAnno($datos['idejercicio']);
        $parametros->posteriores = 1;
        $parametros->anteriores = 2;
        $arrayejercicios = NomEjercicioplanificacion::getEjerciciosAntePosteriores($parametros);
        $datos['cadenaejercicios'] = $arrayejercicios;
        $datos['denomejercicio'] = $parametros->ejercicio;
        $resultado = array();
        $resultado['presupuestomp'] = DatInversion::cargarPresPorConstructorEtapaMoneda($datos, $datos['MP']);
        $resultado['presupuestousd'] = DatInversion::cargarPresPorConstructorEtapaMoneda($datos, $datos['USD']);
        $temp = DatEtapaInversion::cargarPreConstInvXEj($datos);
    }

    public function listarum($datosInv) {
        return DatInversion::listarum($datosInv);
    }

    public function cargarPresupuesto($datosInv, $datos) {
        $parametros->ejercicio = NomEjercicioplanificacion::getAnno($datosInv['idejercicioparam']);
        $parametros->posteriores = 1;
        $parametros->anteriores = 2;
        $arrayejercicios = NomEjercicioplanificacion::getEjerciciosAntePosteriores($parametros);
        $datosInv['denomejercicio'] = $parametros->ejercicio;
        $monedas = [$datosInv['monedamp'], $datosInv['monedausd']];
        $resultado = array();

        $params['idetapainversion'] = $datosInv['idetapa'];
        $params['denominacionetapa'] = $datosInv['denominacion'];
        $resultado['denominacion'] = $datosInv['denominacion'];
        $resultado['idetapa'] = $datosInv['idetapa'];
        $resultado['constructor'] = $datosInv['constructor'];
        $datosEquipos = DatElementovalor::CargarValorEquiposXInver($params);

        $mpPresupuesto = DatInversion::cargarPresupuestoEtapaxMoneda($datosInv, $datosInv['MP']) + $datosEquipos[0]['importe'];
        $usdPresupuesto = DatInversion::cargarPresupuestoEtapaxMoneda($datosInv, $datosInv['USD']) + $datosEquipos[0]['importedivisa'];
        $resultado['mppresumuesto'] = number_format($mpPresupuesto, '2', '.', '');
        $resultado['usdpresumuesto'] = number_format($usdPresupuesto, '2', '.', '');

        foreach ($arrayejercicios as $idejercicio) {
            $datosInv['idejercicio'] = $idejercicio;
            foreach ($monedas as $moneda) {
                $datosInv['idmoneda'] = $moneda;
                $temp = DatEtapaInversion::cargarPresupuestoInversionXEjercicio($datosInv);
                $prefijo = 'usd';
                if ($moneda == $datosInv['monedamp']) {
                    $prefijo = 'mp';
                }

                $resultado[$prefijo . $temp['ejercicio'] . 'ejecutado'] = number_format($temp['ejecutado'], '2', '.', '');
                $resultado[$prefijo . $temp['ejercicio'] . 'estimado'] = number_format($temp['estimado'], '2', '.', '');
                $resultado[$prefijo . $temp['ejercicio'] . 'plan'] = number_format($temp['plan'], '2', '.', '');
                $resultado[$prefijo . $temp['ejercicio'] . 'proyeccion'] = number_format($temp['proyeccion'], '2', '.', '');
                //    $resultado[$prefijo . $temp['ejercicio'] . 'proyeccion'] = number_format($temp['proyeccion'], '2', '.', '');
                $resultado['valormp'] = number_format($datos[0]['valormp'], '2', '.', '');
                $resultado['valorusd'] = number_format($datos[0]['valorusd'], '2', '.', '');
                $resultado['idejercicio'] = $datos[0]['idejercicio'];
                $resultado['ejercicio'] = $datos[0]['ejercicio'];
            }
        }

        return $resultado;
    }

    public function guardarDatosPresupuesto($parametros) {
        $conceptos = ['ejecutado', 'estimado', 'plan', 'proyeccion'];
        $conceptosclase = ['DatInversetapaejecutado', 'DatInversetapaestimado', 'DatInversetapaplan', 'DatInversetapaproyectado'];
        //$clases =[new DatInversetapaejecutado(),new DatInversetapaestimado(),new DatInversetapaplan(),new DatInversetapaproyectado()];
        foreach ($parametros->datos as $key => $value) {
            $parametros->actual = (array) $value;
            foreach ($conceptos as $pos => $concepto) {

                $parametros->concepto = $concepto;
                $parametros->claseconcepto = $conceptosclase[$pos];

                $parametros->ejerciciousar = $parametros->ejercicio;
                $ejercicios = [];
                $ejercicios[] = $parametros->ejercicio - 2;
                $ejercicios[] = $parametros->ejercicio - 1;
                $ejercicios[] = $parametros->ejercicio;
                $ejercicios[] = $parametros->ejercicio + 1;
                //self::auxPresupuestoInversion($parametros, $ejercicios);

                $parametros->ejerciciousar = $parametros->ejercicio - 2;
//pre_r($parametros->ejerciciousar);die;
                self::auxPresupuestoInversion($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio - 1;
                self::auxPresupuestoInversion($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio;
                self::auxPresupuestoInversion($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio + 1;
                self::auxPresupuestoInversion($parametros);
            }
        }
        return 1;
    }

    //public function guardarDatosPresupuestoAjuste($parametros) {
    public function guardarDatosPresupuestoAjuste($parametros) {
        $conceptos = ['ejecutado', 'estimado', 'plan', 'proyeccion'];
        $conceptosclase = ['DatInversetapaejecutado', 'DatInversetapaestimado', 'DatInversetapaplan', 'DatInversetapaproyectado'];
        //$clases =[new DatInversetapaejecutado(),new DatInversetapaestimado(),new DatInversetapaplan(),new DatInversetapaproyectado()];
        foreach ($parametros->datos as $key => $value) {
            $parametros->actual = (array) $value;
            // if($key == 1)
            foreach ($conceptos as $pos => $concepto) {

                $parametros->concepto = $concepto;
                $parametros->claseconcepto = $conceptosclase[$pos];
                //$parametros->clase = $clases[$pos];
                $parametros->ejerciciousar = $parametros->ejercicio;
                self::auxPresupuestoInversionAjuste($parametros);
                $parametros->ejerciciousar = $parametros->ejercicio - 1;
                self::auxPresupuestoInversionAjuste($parametros);
                $parametros->ejerciciousar = $parametros->ejercicio - 2;
                self::auxPresupuestoInversionAjuste($parametros);
                $parametros->ejerciciousar = $parametros->ejercicio + 1;
                self::auxPresupuestoInversionAjuste($parametros);
            }
        }
        return 1;
    }

    public function guardarDatosPlanPreparacion($parametros) {
        //$conceptos = ['ejecutado', 'estimado', 'plan', 'proyeccion'];
        //$conceptosclase = ['DatInversetapaejecutado', 'DatInversetapaestimado', 'DatInversetapaplan', 'DatInversetapaproyectado'];
        //$clases =[new DatInversetapaejecutado(),new DatInversetapaestimado(),new DatInversetapaplan(),new DatInversetapaproyectado()];

        $ejercicio = Array();
        $moneda = Array();
        $ejercicio[0]['id'] = DatInversion::idejercicioPorDenominacion($parametros['aaejercicio']);
        $ejercicio[1]['id'] = DatInversion::idejercicioPorDenominacion($parametros['aejercicio']);
        $ejercicio[2]['id'] = $parametros['idejercicio'];
        $ejercicio[3]['id'] = DatInversion::idejercicioPorDenominacion($parametros['pejercicio']);
        $moneda[0]['id'] = $parametros['MP'];
        $moneda[0]['name'] = 'mp';
        $moneda[1]['id'] = $parametros['USD'];
        $moneda[1]['name'] = 'usd';

        self::fnGuardarGlobal($ejercicio, $moneda, $parametros);
        return 1;
    }

    public function fnGuardarGlobal($ejercicios, $monedas, $parametros) {
        $valor = $parametros['datos'];
        foreach ($ejercicios as $k => $ejercicio) {//REINICIA EL CONTADOR
            $indice = $k + 1;
            foreach ($monedas as $moneda) {//DEFINE LAS DOS MONEDAS QUE SE VAN A LISTAR
                $pos1 = "ejecutado_" . $moneda['name'] . $indice; //POSICION DEL VALOR A MODIFICAR
                $pos1_id = "idpresupejecutado"; //POSICION DEL VALOR QUE TIENE EL ID QUE SE ACTUALIZARA

                $pos2 = "estimado_" . $moneda['name'] . $indice;
                $pos2_id = "idpresupestimado";

                $pos3 = "plan_" . $moneda['name'] . $indice;
                $pos3_id = "idpresupplan";

                $pos4 = "proyec_" . $moneda['name'] . $indice;
                $pos4_id = "idpresupproyectado";

                $planPrep = ($moneda['name'] == 'mp') ? $parametros['planPrepMP'] : $parametros['planPrepUSD'];

                if ($planPrep != null) {


                    //Ejecutado
                    if ($valor->$pos1 != "" && $valor->$pos1 != 0) {
                        self::addvalorGlobalPlanPreparacion("dat_presupejecutado", $pos1_id, $valor->$pos1, $moneda['id'], $ejercicio['id'], $parametros['idinversion'], $parametros['identidad'], $planPrep);
                    } else {
                        //print_r($pos1);
                        //print_r($valor->$pos1);die;
                        if ($valor->$pos1 == 0)
                            self::eliminarGlobalPlanPrepracion("dat_presupejecutado", $pos1_id, $valor->$pos1, $moneda['id'], $ejercicio['id'], $parametros['idinversion'], $parametros['identidad'], $planPrep);
                    }

                    //Estimado
                    if ($valor->$pos2 != "" && $valor->$pos2 != 0) {
                        self::addvalorGlobalPlanPreparacion("dat_presupestimado", $pos2_id, $valor->$pos2, $moneda['id'], $ejercicio['id'], $parametros['idinversion'], $parametros['identidad'], $planPrep);
                    } else {
                        if ($valor->$pos2 == 0)
                            self::eliminarGlobalPlanPrepracion("dat_presupestimado", $pos2_id, $valor->$pos2, $moneda['id'], $ejercicio['id'], $parametros['idinversion'], $parametros['identidad'], $planPrep);
                    }

                    //Plan
                    if ($valor->$pos3 != "" && $valor->$pos3 != 0) {
                        self::addvalorGlobalPlanPreparacion("dat_presupplan", $pos3_id, $valor->$pos3, $moneda['id'], $ejercicio['id'], $parametros['idinversion'], $parametros['identidad'], $planPrep);
                    } else {
                        if ($valor->$pos3 == 0)
                            self::eliminarGlobalPlanPrepracion("dat_presupplan", $pos3_id, $valor->$pos3, $moneda['id'], $ejercicio['id'], $parametros['idinversion'], $parametros['identidad'], $planPrep);
                    }

                    //Proyectado
                    if ($valor->$pos4 != "" && $valor->$pos4 != 0) {
                        self::addvalorGlobalPlanPreparacion("dat_presupproyectado", $pos4_id, $valor->$pos4, $moneda['id'], $ejercicio['id'], $parametros['idinversion'], $parametros['identidad'], $planPrep);
                    } else {
                        if ($valor->$pos4 == 0)
                            self::eliminarGlobalPlanPrepracion("dat_presupproyectado", $pos4_id, $valor->$pos4, $moneda['id'], $ejercicio['id'], $parametros['idinversion'], $parametros['identidad'], $planPrep);
                    }
                }
            }
        }
    }

    private function addvalorGlobalPlanPreparacion($tabla, $idTabla, $valor, $idmonedaentidad, $idejercicio, $idinversion, $idestructura, $planPrep) {
//print_r($planPrep);die;
        $boolSaveTrazas = false;
        $inv = new DatInversion();
        $desglose = $inv->BuscarDesglosePlan($tabla, $idTabla, $valor, $idmonedaentidad, $idejercicio, $idinversion, $idestructura);
        if (empty($desglose)) {
            $boolSaveTrazas = true;
            $acc = "adicionar";
            $des = "Se adicionó un desglose de PP en {$tabla} con valor de: {$valor} con idmonedaentidad: {$idmonedaentidad}";
            $inv->addvalorGlobalPlanPreparacion($tabla, $valor, $planPrep, $idejercicio);
        } else {
            if ($desglose[0]['valor'] != $valor) {
                $boolSaveTrazas = true;
                $acc = "actualizar";
                $des = "Se actualizó un desglose de PP en {$tabla} con valor de: {$desglose[0]['valor']} a: {$valor} con idmonedaentidad: {$idmonedaentidad}";
                $inv->updatevalor($tabla, $valor, $idTabla, $desglose[0]['id'], $idejercicio);
            }
        }
        if ($boolSaveTrazas) {
//            HisTrazasinversionesModel::seveTrazasInversiones('Desglose Presupuesto PP', $acc, $tabla, $idinversion, $des, $this->global->Perfil->usuario);
        }
    }

    private function eliminarGlobalPlanPrepracion($tabla, $idTabla, $valor, $idmonedaentidad, $idejercicio, $idinversion, $idestructura, $planPrep) {
        $inv = new DatInversion();
        $desglose = $inv->BuscarDesglosePlan($tabla, $idTabla, $valor, $idmonedaentidad, $idejercicio, $idinversion, $idestructura);
        if (!empty($desglose)) {
            //eliminar
            $inv->eliminarGlobal($tabla, $idTabla, $desglose[0]['id']);
        }
    }

    private function auxPresupuestoInversionAuxiliar($parametros, $numejercicio) {
        $procede = true;
        $ejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = {$numejercicio}");
        //print_r($parametros);die;
        if ($parametros->concepto == 'plan' /* && $parametros->ejercicio == $parametros->ejerciciousar */) {
            $etapa = Doctrine::getTable('DatEtapaInversion')->find($parametros->actual['idetapa']);
            if ($etapa) {
                $inversion = Doctrine::getTable('DatInversion')->find($etapa->idinversion);
                
                if ($inversion) {
                    $inicio = explode('/', $inversion->fechainicio);
                    $fin = explode('/', $inversion->fechafin);
                    $inicio = $inicio[2];
                    $fin = $fin[2];

                    if ($parametros->ejerciciousar > $fin || $parametros->ejerciciousar < $inicio) {
                        $procede = false;
                    }
                }
            }
        }
        $inversion2 = Doctrine::getTable('DatInversion')->find($parametros->idinversion);
        
        //$datosentidad = $this->integrator->metadatos->DameEstructura($inversion2->idestructuracomun);
        //print_r($datosentidad);die;
        if ($ejercicio[0]->idejercicio != null && $procede) {
            
            $boolSaveTrazas = false;
            $idejercicio = $ejercicio[0]->idejercicio;

            if (($parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto] != '' ||
                    $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto] == 0) ||
                    ($parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto] != '' ||
                    $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto] == 0)) {
                if ($parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto] != '' ||
                        $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto] == 0) {
                    
                    $existe = Doctrine::getTable($parametros->claseconcepto)->
                            findByDql("idejercicio = {$idejercicio} AND idetapainversion = {$parametros->actual['idetapa']} AND idmoneda = {$parametros->mp}");


                    if ($existe[0]->idmoneda != null) {
                        //print_r('ssfds222');die;
                        $estado = DatInversion::estadoEjercicioPorEjercicio($existe[0]->idejercicio);
                        if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                            $v = $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto];
                            if ($v == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} 
                                        que era de: {$existe[0]->valor} MP";
                                $desreal = "Se eliminó el {$parametros->concepto} del componente: {$parametros->actual['denominacion']}
                                        que era de: {$existe[0]->valor} MP a {$v} MP";           
                                $existe[0]->delete();
                            } else {
                                if ($v != $existe[0]->valor) {
                                    $boolSaveTrazas = true;
                                    $acc = "actualizar";
                                    $des = "Se actualizó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} 
                                        que era de: {$existe[0]->valor} MP a {$v} MP";
                                    $desreal = "Se actualizó el {$parametros->concepto} del componente: {$parametros->actual['denominacion']}
                                        que era de: {$existe[0]->valor} MP a {$v} MP";       
                                    $existe[0]->valor = $v ? $v : 0;
                                    $existe[0]->save();
                                }
                            }
                        } else if ($estado == 'Listo') {
                            if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion')
                                $v = $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto];
                            if ($v == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} 
                                        que era de: {$existe[0]->valor} MP";
                                $desreal = "Se eliminó el {$parametros->concepto} del componente: {$parametros->actual['denominacion']}
                                        que era de: {$existe[0]->valor} MP a {$v} MP";         
                                $existe[0]->delete();
                            } else {
                                if ($v != $existe[0]->valor) {
                                    $boolSaveTrazas = true;
                                    $acc = "actualizar";
                                    $des = "Se actualizó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} 
                                        que era de: {$existe[0]->valor} MP a {$v} MP";
                                    $desreal = "Se actualizó el {$parametros->concepto} del componente: {$parametros->actual['denominacion']}
                                        que era de: {$existe[0]->valor} MP a {$v} MP";     
                                    $existe[0]->valor = $v ? $v : 0;
                                    $existe[0]->save();
                                }
                            }
                        } else if ($estado == 'Ejecución') {
                            if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado')
                                $v = $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto];
                            if ($v == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} 
                                        que era de: {$existe[0]->valor} MP";
                                $desreal = "Se eliminó el {$parametros->concepto} del componente: {$parametros->actual['denominacion']}
                                        que era de: {$existe[0]->valor} MP a {$v} MP";        
                                $existe[0]->delete();
                            } else {
                                if ($v != $existe[0]->valor) {
                                    $boolSaveTrazas = true;
                                    $acc = "actualizar";
                                    $des = "Se actualizó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} 
                                        que era de: {$existe[0]->valor} MP a {$v} MP";
                                    $desreal = "Se actualizó el {$parametros->concepto} del componente: {$parametros->actual['denominacion']}
                                        que era de: {$existe[0]->valor} MP a {$v} MP";
                                          
                                    $existe[0]->valor = $v ? $v : 0;
                                    $existe[0]->save();
                                }
                            }
                        }
                    } else {
                        //print_r('ssfds22233');die;
                        $guardar = new DatInversetapaejecutado();
                        if ($parametros->concepto == 'estimado')
                            $guardar = new DatInversetapaestimado();
                        elseif ($parametros->concepto == 'plan')
                            $guardar = new DatInversetapaplan();
                        elseif ($parametros->concepto == 'proyeccion')
                            $guardar = new DatInversetapaproyectado();
                        $v = $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto];
                        $estado = DatInversion::estadoEjercicioPorEjercicio($ejercicio[0]->idejercicio);
                        
                        

                        if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                            self::insertarDesglosePresupuesto($parametros, $ejercicio, $guardar, $v, $parametros->mp);
                            $boolSaveTrazas = true;
                        } else if ($estado == 'Listo') {
                            if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion'){
                                self::insertarDesglosePresupuesto($parametros, $ejercicio, $guardar, $v, $parametros->mp);
                                $boolSaveTrazas = true;
                            }
                        }else if ($estado == 'Ejecución') {
                            //pre_r('entra');
                            if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado'){
                                self::insertarDesglosePresupuesto($parametros, $ejercicio, $guardar, $v, $parametros->mp);
                                $boolSaveTrazas = true;
                            }
                        }
                        if ($boolSaveTrazas) {
                            $boolSaveTrazas = true;
                            $acc = "adicionar";
                            $des = "Se adicionó {$v} MP en {$parametros->concepto} del año {$ejercicio[0]->ejercicio}
                                del componente: {$parametros->actual['idetapa']}";
                            $desreal = "Se adicionó {$v} MP en {$parametros->concepto} del año {$ejercicio[0]->ejercicio}
                                del componente: {$parametros->actual['denominacion']}";
                        }
                    }
                }
                if ($boolSaveTrazas) {
//                    HisTrazasinversionesModel::seveTrazasInversiones('Desglose Presupuesto', $acc, $parametros->claseconcepto, $parametros->idinversion, $des, $this->global->Perfil->usuario, $desreal, $inversion2->denominacion,$inversion2->idestructuracomun);
                }
                if ($parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto] != '' ||
                        $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto] == 0) {
                    $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idetapainversion = {$parametros->actual['idetapa']} AND idmoneda = {$parametros->usd}");
                    if ($existe[0]->idmoneda != null) {

                        $estado = DatInversion::estadoEjercicioPorEjercicio($existe[0]->idejercicio);
                        if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                            $v = $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto];
                            if ($v == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} 
                                        que era de: {$existe[0]->valor} MUSD";
                                $desreal = "Se eliminó el {$parametros->concepto} del componente: {$parametros->actual['denominacion']}
                                        que era de: {$existe[0]->valor} MUSD";           
                                $existe[0]->delete();
                            } else {
                                if ($v != $existe[0]->valor) {
                                    $boolSaveTrazas = true;
                                    $acc = "actualizar";
                                    $des = "Se actualizó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} 
                                        que era de: {$existe[0]->valor} MUSD a {$v} MUSD";
                                    $desreal = "Se actualizó el {$parametros->concepto} del componente: {$parametros->actual['denominacion']}
                                        que era de: {$existe[0]->valor} MUSD";     
                                    $existe[0]->valor = $v ? $v : 0;
                                    $existe[0]->save();
                                }
                            }
                        } else if ($estado == 'Listo') {
                            if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion')
                                $v = $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto];
                            if ($v == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} 
                                        que era de: {$existe[0]->valor} MUSD";
                                $desreal = "Se eliminó el {$parametros->concepto} del componente: {$parametros->actual['denominacion']}
                                        que era de: {$existe[0]->valor} MUSD";          
                                $existe[0]->delete();
                            } else {
                                if ($v != $existe[0]->valor) {
                                    $boolSaveTrazas = true;
                                    $acc = "actualizar";
                                    $des = "Se actualizó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} 
                                        que era de: {$existe[0]->valor} MUSD a {$v} MUSD";
                                    $desreal = "Se actualizó el {$parametros->concepto} del componente: {$parametros->actual['denominacion']}
                                        que era de: {$existe[0]->valor} MUSD";  
                                    $existe[0]->valor = $v ? $v : 0;
                                    $existe[0]->save();
                                }
                            }
                        } else if ($estado == 'Ejecución') {
                            //pre_r('entra');
                            if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado')
                                $v = $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto];
                            if ($v == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} 
                                        que era de: {$existe[0]->valor} MUSD";
                                $desreal = "Se eliminó el {$parametros->concepto} del componente: {$parametros->actual['denominacion']}
                                        que era de: {$existe[0]->valor} MUSD";         
                                $existe[0]->delete();
                            } else {
                                if ($v != $existe[0]->valor) {
                                    $boolSaveTrazas = true;
                                    $acc = "actualizar";
                                    $des = "Se actualizó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} 
                                        que era de: {$existe[0]->valor} MUSD a {$v} MUSD";
                                    $desreal = "Se actualizó el {$parametros->concepto} del componente: {$parametros->actual['denominacion']}
                                        que era de: {$existe[0]->valor} MUSD";     
                                    $existe[0]->valor = $v ? $v : 0;
                                    $existe[0]->save();
                                }
                            }
                        }
                    } else {
                        $guardar = new DatInversetapaejecutado();
                        if ($parametros->concepto == 'estimado')
                            $guardar = new DatInversetapaestimado();
                        elseif ($parametros->concepto == 'plan')
                            $guardar = new DatInversetapaplan();
                        elseif ($parametros->concepto == 'proyeccion')
                            $guardar = new DatInversetapaproyectado();

                        $v = $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto];
                        $estado = DatInversion::estadoEjercicioPorEjercicio($ejercicio[0]->idejercicio);

                        

                        if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                            self::insertarDesglosePresupuesto($parametros, $ejercicio, $guardar, $v, $parametros->usd);
                            $boolSaveTrazas = true;
                        } else if ($estado == 'Listo') {
                            if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion'){
                                self::insertarDesglosePresupuesto($parametros, $ejercicio, $guardar, $v, $parametros->usd);
                                $boolSaveTrazas = true;
                            }
                        }else if ($estado == 'Ejecución') {
                            if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado'){
                                self::insertarDesglosePresupuesto($parametros, $ejercicio, $guardar, $v, $parametros->usd);
                                $boolSaveTrazas = true;
                            }
                        }
                        if ($boolSaveTrazas) {
                            $acc = "adicionar";
                            $des = "Se adicionó {$v} MUSD en {$parametros->concepto} del año {$ejercicio[0]->ejercicio}
                                del componente: {$parametros->actual['denominacion']}";
                            $desreal = "Se adicionó {$v} MUSD en {$parametros->concepto} del año {$ejercicio[0]->ejercicio}
                                del componente: {$parametros->actual['denominacion']}";    
                        }
                    }
                }
                if ($boolSaveTrazas) {
//                    HisTrazasinversionesModel::seveTrazasInversiones('Desglose Presupuesto', $acc, $parametros->claseconcepto, $parametros->idinversion, $des, $this->global->Perfil->usuario, $desreal, $inversion2->denominacion,$inversion2->idestructuracomun);
                }
            }
        }
    }

    private function auxPresupuestoInversionAuxiliarAjuste($parametros, $numejercicio) {
        $procede = true;
        $ejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = {$numejercicio}");
        if ($parametros->concepto == 'plan' /* && $parametros->ejercicio == $parametros->ejerciciousar */) {
            $etapa = Doctrine::getTable('DatEtapaInversion')->find($parametros->actual['idetapa']);
            if ($etapa) {
                $inversion = Doctrine::getTable('DatInversion')->find($etapa->idinversion);

                if ($inversion) {
                    $inicio = explode('/', $inversion->fechainicio);
                    $fin = explode('/', $inversion->fechafin);
                    $inicio = $inicio[2];
                    $fin = $fin[2];

                    if ($parametros->ejerciciousar > $fin || $parametros->ejerciciousar < $inicio) {
                        $procede = false;
                    }
                }
            }
        }


        if ($ejercicio[0]->idejercicio != null && $procede) {
            $idejercicio = $ejercicio[0]->idejercicio;

            if (($parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto] != '' ||
                    $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto] == 0) ||
                    ($parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto] != '' ||
                    $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto] == 0)) {
                if ($parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto] != '' || $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto] == 0) {

                    $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idetapainversion = {$parametros->actual['idetapa']} AND idmoneda = {$parametros->mp}");
                    if ($existe[0]->idmoneda != null) {

                        $v = $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto];
                        $existe[0]->valor = $v ? $v : 0;
                        $existe[0]->save();
                    } else {
                        $guardar = new DatInversetapaejecutado();
                        if ($parametros->concepto == 'estimado')
                            $guardar = new DatInversetapaestimado();
                        elseif ($parametros->concepto == 'plan')
                            $guardar = new DatInversetapaplan();
                        elseif ($parametros->concepto == 'proyeccion')
                            $guardar = new DatInversetapaproyectado();

                        $v = $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto];
                        //self::insertarDesglosePresupuestoAjuste($parametros, $ejercicio, $guardar, $v);


                        $guardar->idmoneda = $parametros->mp;
                        $guardar->idejercicio = $ejercicio[0]->idejercicio;
                        $guardar->idetapainversion = $parametros->actual['idetapa'];
                        $guardar->valor = $v ? $v : 0;
                        $guardar->save();
                    }
                }
                if ($parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto] != '' ||
                        $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto] == 0) {
                    $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idetapainversion = {$parametros->actual['idetapa']} AND idmoneda = {$parametros->usd}");
                    if ($existe[0]->idmoneda != null) {

                        $v = $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto];
                        $existe[0]->valor = $v ? $v : 0;
                        $existe[0]->save();
                    } else {
                        $guardar = new DatInversetapaejecutado();
                        if ($parametros->concepto == 'estimado')
                            $guardar = new DatInversetapaestimado();
                        elseif ($parametros->concepto == 'plan')
                            $guardar = new DatInversetapaplan();
                        elseif ($parametros->concepto == 'proyeccion')
                            $guardar = new DatInversetapaproyectado();

                        $v = $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto];
                        $guardar->idmoneda = $parametros->usd;
                        $guardar->idejercicio = $ejercicio[0]->idejercicio;
                        $guardar->idetapainversion = $parametros->actual['idetapa'];
                        $guardar->valor = $v ? $v : 0;
                        $guardar->save();
                    }
                }
            }
        }
    }

    private function insertarDesglosePresupuesto($parametros, $ejercicio, $guardar, $v, $idMoneda) {
        $guardar->idmoneda = $idMoneda;
        $guardar->idejercicio = $ejercicio[0]->idejercicio;
        $guardar->idetapainversion = $parametros->actual['idetapa'];
        $guardar->valor = $v ? $v : 0;
        if ($guardar->valor != 0) {
            $guardar->save();
        }
    }

    private function insertarDesglosePresupuestoAjuste($parametros, $ejercicio, $guardar, $v) {

        $guardar->idmoneda = $parametros->usd;
        $guardar->idejercicio = $ejercicio[0]->idejercicio;
        $guardar->idetapainversion = $parametros->actual['idetapa'];
        //$v = $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto];
        $guardar->valor = $v ? $v : 0;
        $guardar->save();
    }

    private function auxPresupuestoInversion($parametros, $ejercicios) {
        $numejercicio = "'" . $parametros->ejerciciousar . "'";
        self::auxPresupuestoInversionAuxiliar($parametros, $numejercicio);
    }

    //private function auxPresupuestoInversionAjuste($parametros, $ejercicios) {
    private function auxPresupuestoInversionAjuste($parametros) {
        $numejercicio = "'" . $parametros->ejerciciousar . "'";
        $procede = true;
        $ejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = {$numejercicio}");
        if ($parametros->concepto == 'plan' /* && $parametros->ejercicio == $parametros->ejerciciousar */) {
            $etapa = Doctrine::getTable('DatEtapaInversion')->find($parametros->actual['idetapa']);
            if ($etapa) {
                $inversion = Doctrine::getTable('DatInversion')->find($etapa->idinversion);

                if ($inversion) {
                    $inicio = explode('/', $inversion->fechainicio);
                    $fin = explode('/', $inversion->fechafin);
                    $inicio = $inicio[2];
                    $fin = $fin[2];

                    if ($parametros->ejerciciousar > $fin || $parametros->ejerciciousar < $inicio) {
                        $procede = false;
                    }
                }
            }
        }


        if ($ejercicio[0]->idejercicio != null && $procede) {
            $boolSaveTrazas = false;
            $idejercicio = $ejercicio[0]->idejercicio;

            if (($parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto] != '' || $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto] == 0) || ($parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto] != '' || $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto] == 0)) {
                if ($parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto] != '' || $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto] == 0) {

                    $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idetapainversion = {$parametros->actual['idetapa']} AND idmoneda = {$parametros->mp}");
                    $v = $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto];
                    if ($existe[0]->idmoneda != null) {
                        if ($v == 0) {
                            $boolSaveTrazas = true;
                            $acc = "eliminar";
                            $des = "Se eliminó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} del año {$ejercicio[0]->ejercicio} 
                                        que era de: {$existe[0]->valor} MP";
                            $existe[0]->delete();
                        } else {
                            if ($v != $existe[0]->valor) {
                                $boolSaveTrazas = true;
                                $acc = "actualizar x btn Ajuste";
                                $des = "Se actualizó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} del año {$ejercicio[0]->ejercicio} 
                                        que era de: {$existe[0]->valor} MP a {$v} MP";
                                $existe[0]->valor = $v ? $v : 0;
                                $existe[0]->save();
                            }
                        }
                    } else {
                        if ($v != 0) {
                            $boolSaveTrazas = true;
                            $acc = "adicionar x btn Ajuste";
                            $des = "Se adicionó {$v} MP en {$parametros->concepto} del año {$ejercicio[0]->ejercicio}
                                del componente: {$parametros->actual['idetapa']}";
                            $guardar = new DatInversetapaejecutado();
                            if ($parametros->concepto == 'estimado')
                                $guardar = new DatInversetapaestimado();
                            elseif ($parametros->concepto == 'plan')
                                $guardar = new DatInversetapaplan();
                            elseif ($parametros->concepto == 'proyeccion')
                                $guardar = new DatInversetapaproyectado();
                            $guardar->idmoneda = $parametros->mp;
                            $guardar->idejercicio = $ejercicio[0]->idejercicio;
                            $guardar->idetapainversion = $parametros->actual['idetapa'];
                            $v = $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto];
                            $guardar->valor = $v ? $v : 0;
                            $guardar->save();
                        }
                    }
                    if ($boolSaveTrazas) {
//                        HisTrazasinversionesModel::seveTrazasInversiones('Desglose Presupuesto', $acc, $parametros->claseconcepto, $parametros->idinversion, $des, $this->global->Perfil->usuario);
                    }
                }
                if ($parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto] != '' || $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto] == 0) {
                    $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idetapainversion = {$parametros->actual['idetapa']} AND idmoneda = {$parametros->usd}");
                    $v = $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto];
                    if ($existe[0]->idmoneda != null) {
                        if ($v == 0) {
                            $boolSaveTrazas = true;
                            $acc = "eliminar";
                            $des = "Se eliminó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} del año {$ejercicio[0]->ejercicio}
                                        que era de: {$existe[0]->valor} MUSD";
                            $existe[0]->delete();
                        } else {
                            if ($v != $existe[0]->valor) {
                                $boolSaveTrazas = true;
                                $acc = "actualizar x btn Ajuste";
                                $des = "Se actualizó el {$parametros->concepto} del componente: {$existe[0]->idetapainversion} del año {$ejercicio[0]->ejercicio} 
                                        que era de: {$existe[0]->valor} MP a {$v} MP";
                                $existe[0]->valor = $v ? $v : 0;
                                $existe[0]->save();
                            }
                        }
                    } else {
                        if ($v != 0) {
                            $boolSaveTrazas = true;
                            $acc = "adicionar x btn Ajuste";
                            $des = "Se adicionó {$v} MUSD en {$parametros->concepto} del año {$ejercicio[0]->ejercicio}
                                del componente: {$parametros->actual['idetapa']}";
                            $guardar = new DatInversetapaejecutado();
                            if ($parametros->concepto == 'estimado')
                                $guardar = new DatInversetapaestimado();
                            elseif ($parametros->concepto == 'plan')
                                $guardar = new DatInversetapaplan();
                            elseif ($parametros->concepto == 'proyeccion')
                                $guardar = new DatInversetapaproyectado();

                            $guardar->idmoneda = $parametros->usd;
                            $guardar->idejercicio = $ejercicio[0]->idejercicio;
                            $guardar->idetapainversion = $parametros->actual['idetapa'];
                            $v = $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto];
                            $guardar->valor = $v ? $v : 0;
                            $guardar->save();
                        }
                    }
                    if ($boolSaveTrazas) {
//                        HisTrazasinversionesModel::seveTrazasInversiones('Desglose Presupuesto', $acc, $parametros->claseconcepto, $parametros->idinversion, $des, $this->global->Perfil->usuario);
                    }
                }
            }
        }
    }

    public function guardarDatosFinanciamiento($parametros) {
        $conceptos = ['estimado', 'ejecutado', 'plan', 'proyeccion'];
        $conceptosclase = ['DatInversfinancestimado', 'DatInversfinancejecutado', 'DatInversfinancplan', 'DatInversfinancproyectado'];

        foreach ($parametros->datos as $key => $value) {
            $parametros->actual = (array) $value;
            $parametros->identidadusd = InversionesModel::devolverIdMonedaEnt($parametros->usd, $parametros->identidad);
            $parametros->identidadmp = InversionesModel::devolverIdMonedaEnt($parametros->mp, $parametros->identidad);
            $parametros->actual['idmonedaentidad_mp'] = $parametros->identidadmp[0]['idmonedaentidad'];
            $parametros->actual['idmonedaentidad_usd'] = $parametros->identidadusd[0]['idmonedaentidad'];

            foreach ($conceptos as $pos => $concepto) {
                $parametros->concepto = $concepto;
                $parametros->claseconcepto = $conceptosclase[$pos];

                $parametros->ejerciciousar = $parametros->ejercicio;
                $parametros->pos = 3;
                self::addFinanciamiento($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio - 1;
                $parametros->pos = 2;
                self::addFinanciamiento($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio - 2;
                $parametros->pos = 1;
                self::addFinanciamiento($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio + 1;
                $parametros->pos = 4;
                self::addFinanciamiento($parametros);
            }
        }
        return 1;
    }

    public function guardarDatosFinanciamientoAjuste($parametros) {
        $conceptos = ['estimado', 'ejecutado', 'plan', 'proyeccion'];
        $conceptosclase = ['DatInversfinancestimado', 'DatInversfinancejecutado', 'DatInversfinancplan', 'DatInversfinancproyectado'];

        foreach ($parametros->datos as $key => $value) {
            $parametros->actual = (array) $value;
            $parametros->identidadusd = InversionesModel::devolverIdMonedaEnt($parametros->usd, $parametros->identidad);
            $parametros->identidadmp = InversionesModel::devolverIdMonedaEnt($parametros->mp, $parametros->identidad);
            $parametros->actual['idmonedaentidad_mp'] = $parametros->identidadmp[0]['idmonedaentidad'];
            $parametros->actual['idmonedaentidad_usd'] = $parametros->identidadusd[0]['idmonedaentidad'];

            foreach ($conceptos as $pos => $concepto) {
                $parametros->concepto = $concepto;
                $parametros->claseconcepto = $conceptosclase[$pos];

                $parametros->ejerciciousar = $parametros->ejercicio;
                $parametros->pos = 3;
                self::addFinanciamientoAjuste($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio - 1;
                $parametros->pos = 2;
                self::addFinanciamientoAjuste($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio - 2;
                $parametros->pos = 1;
                self::addFinanciamientoAjuste($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio + 1;
                $parametros->pos = 4;
                self::addFinanciamientoAjuste($parametros);
            }
        }
        return 1;
    }

    private function addFinanciamiento($parametros) {
        $numejercicio = "'" . $parametros->ejerciciousar . "'";
        $ejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = {$numejercicio}");
        if ($ejercicio[0]->idejercicio != null) {
            $idejercicio = $ejercicio[0]->idejercicio;
            if ($parametros->actual['idmonedaentidad_mp']) {
                $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idtipofinanciamiento = {$parametros->actual['idtipofinanciamiento']} AND idmonedaentidad = {$parametros->actual['idmonedaentidad_mp']} AND idinversion = {$parametros->actual['idinversion']}");

                if ($existe[0]->idejercicio != null) {

                    $parametros->valor_concepto = $parametros->actual['ejecutado_mp' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $parametros->valor_concepto = $parametros->actual['estimado_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $parametros->valor_concepto = $parametros->actual['plan_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $parametros->valor_concepto = $parametros->actual['proyec_mp' . $parametros->pos];
                    }

                    $estado = DatInversion::estadoEjercicioPorEjercicio($ejercicio[0]->idejercicio);
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        $existe[0]->valor = $parametros->valor_concepto;
                        $existe[0]->save();
                    } else if ($estado == 'Listo') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion')
                            $existe[0]->valor = $parametros->valor_concepto;
                        $existe[0]->save();
                    }else if ($estado == 'Ejecución') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado')
                            $existe[0]->valor = $parametros->valor_concepto;
                        $existe[0]->save();
                    }
                } else {

                    $guardar = new DatInversfinancejecutado();
                    $parametros->valor_concepto = $parametros->actual['ejecutado_mp' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $guardar = new DatInversfinancestimado();
                        $parametros->valor_concepto = $parametros->actual['estimado_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $guardar = new DatInversfinancplan();
                        $parametros->valor_concepto = $parametros->actual['plan_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $guardar = new DatInversfinancproyectado();
                        $parametros->valor_concepto = $parametros->actual['proyec_mp' . $parametros->pos];
                    }

                    $estado = DatInversion::estadoEjercicioPorEjercicio($ejercicio[0]->idejercicio);
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_mp'];
                        /* $guardar->idejercicio = $ejercicio[0]->idejercicio;
                          $guardar->idinversion = $parametros->actual['idinversion'];
                          $guardar->idtipofinanciamiento = $parametros->actual['idtipofinanciamiento'];
                          $guardar->valor = $parametros->valor_concepto;
                          $guardar->save(); */
                    } else if ($estado == 'Listo') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion')
                            $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_mp'];
                        /* $guardar->idejercicio = $ejercicio[0]->idejercicio;
                          $guardar->idinversion = $parametros->actual['idinversion'];
                          $guardar->idtipofinanciamiento = $parametros->actual['idtipofinanciamiento'];
                          $guardar->valor = $parametros->valor_concepto;
                          $guardar->save(); */
                    }else if ($estado == 'Ejecución') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado')
                            $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_mp'];
                    }
                    $guardar->idejercicio = $ejercicio[0]->idejercicio;
                    $guardar->idinversion = $parametros->actual['idinversion'];
                    $guardar->idtipofinanciamiento = $parametros->actual['idtipofinanciamiento'];
                    $guardar->valor = $parametros->valor_concepto;
                    if ($guardar->valor != 0) {
                        $guardar->save();
                    } else {
                        
                    }
                }
            }

            // tipo de moneda USD    
            if ($parametros->actual['idmonedaentidad_usd']) {

                $existe = Doctrine::getTable($parametros->claseconcepto)
                        ->findByDql("idejercicio = {$idejercicio} AND idtipofinanciamiento = {$parametros->actual['idtipofinanciamiento']} AND idmonedaentidad = {$parametros->actual['idmonedaentidad_usd']} AND idinversion = {$parametros->actual['idinversion']}");

                if ($existe[0]->idejercicio != null) {

                    $parametros->valor_concepto = $parametros->actual['ejecutado_usd' . $parametros->pos];

                    if ($parametros->concepto == 'estimado') {
                        $parametros->valor_concepto = $parametros->actual['estimado_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $parametros->valor_concepto = $parametros->actual['plan_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $parametros->valor_concepto = $parametros->actual['proyec_usd' . $parametros->pos];
                    }

                    $estado = DatInversion::estadoEjercicioPorEjercicio($ejercicio[0]->idejercicio);
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        $existe[0]->valor = $parametros->valor_concepto;
                        $existe[0]->save();
                    } else if ($estado == 'Listo') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion')
                            $existe[0]->valor = $parametros->valor_concepto;
                        $existe[0]->save();
                    }else if ($estado == 'Ejecución') {
                        //pre_r('entra');
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado')
                            $existe[0]->valor = $parametros->valor_concepto;
                        $existe[0]->save();
                    }
                } else {

                    $guardar = new DatInversfinancejecutado();
                    $parametros->valor_concepto = $parametros->actual['ejecutado_usd' . $parametros->pos];

                    if ($parametros->concepto == 'estimado') {
                        $guardar = new DatInversfinancestimado();
                        //   print_r( $parametros->actual['estimado_usd' . $parametros->pos]);die;
                        $parametros->valor_concepto = $parametros->actual['estimado_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $guardar = new DatInversfinancplan();
                        $parametros->valor_concepto = $parametros->actual['plan_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $guardar = new DatInversfinancproyectado();
                        $parametros->valor_concepto = $parametros->actual['proyec_usd' . $parametros->pos];
                    }

                    $estado = DatInversion::estadoEjercicioPorEjercicio($ejercicio[0]->idejercicio);
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_usd'];
                        /* $guardar->idejercicio = $ejercicio[0]->idejercicio;
                          $guardar->idinversion = $parametros->actual['idinversion'];
                          $guardar->idtipofinanciamiento = $parametros->actual['idtipofinanciamiento'];
                          $guardar->valor = ($parametros->valor_concepto) ? $parametros->valor_concepto : 0;
                          pre_r($guardar->toArray());
                          $guardar->save(); */
                    } else if ($estado == 'Listo') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion')
                            $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_usd'];
                        /* $guardar->idejercicio = $ejercicio[0]->idejercicio;
                          $guardar->idinversion = $parametros->actual['idinversion'];
                          $guardar->idtipofinanciamiento = $parametros->actual['idtipofinanciamiento'];
                          $guardar->valor = ($parametros->valor_concepto) ? $parametros->valor_concepto : 0;
                          pre_r($guardar->toArray());
                          $guardar->save(); */
                    }else if ($estado == 'Ejecución') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado')
                            $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_usd'];
                    }
                    $guardar->idejercicio = $ejercicio[0]->idejercicio;
                    $guardar->idinversion = $parametros->actual['idinversion'];
                    $guardar->idtipofinanciamiento = $parametros->actual['idtipofinanciamiento'];
                    $guardar->valor = ($parametros->valor_concepto) ? $parametros->valor_concepto : 0;
//pre_r($guardar->toArray());
                    if ($guardar->valor != 0) {
                        $guardar->save();
                    } else {
                        
                    }
                }
            }
        }
    }

    private function addFinanciamientoAjuste($parametros) {


        $numejercicio = "'" . $parametros->ejerciciousar . "'";

        $ejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = {$numejercicio}");
        if ($ejercicio[0]->idejercicio != null) {
            $idejercicio = $ejercicio[0]->idejercicio;

            //print_r($parametros->actual);die;
            if ($parametros->actual['idmonedaentidad_mp']) {
                $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idtipofinanciamiento = {$parametros->actual['idtipofinanciamiento']} AND idmonedaentidad = {$parametros->actual['idmonedaentidad_mp']} AND idinversion = {$parametros->actual['idinversion']}");


                if ($existe[0]->idejercicio != null) {

                    $parametros->valor_concepto = $parametros->actual['ejecutado_mp' . $parametros->pos];
                    //print_r('ejecutado_mp' . $parametros->pos);die;

                    if ($parametros->concepto == 'estimado') {
                        $parametros->valor_concepto = $parametros->actual['estimado_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $parametros->valor_concepto = $parametros->actual['plan_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $parametros->valor_concepto = $parametros->actual['proyec_mp' . $parametros->pos];
                    }

                    $existe[0]->valor = $parametros->valor_concepto;
                    $existe[0]->save();
                } else {

                    $guardar = new DatInversfinancejecutado();
                    $parametros->valor_concepto = $parametros->actual['ejecutado_mp' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $guardar = new DatInversfinancestimado();
                        $parametros->valor_concepto = $parametros->actual['estimado_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $guardar = new DatInversfinancplan();
                        $parametros->valor_concepto = $parametros->actual['plan_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $guardar = new DatInversfinancproyectado();
                        $parametros->valor_concepto = $parametros->actual['proyec_mp' . $parametros->pos];
                    }

                    $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_mp'];
                    $guardar->idejercicio = $ejercicio[0]->idejercicio;
                    $guardar->idinversion = $parametros->actual['idinversion'];
                    $guardar->idtipofinanciamiento = $parametros->actual['idtipofinanciamiento'];
                    $guardar->valor = $parametros->valor_concepto;
                    $guardar->save();
                }
            }

            // tipo de moneda USD
            if ($parametros->actual['idmonedaentidad_usd']) {

                $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idtipofinanciamiento = {$parametros->actual['idtipofinanciamiento']} AND idmonedaentidad = {$parametros->actual['idmonedaentidad_usd']} AND idinversion = {$parametros->actual['idinversion']}");

                if ($existe[0]->idejercicio != null) {

                    $parametros->valor_concepto = $parametros->actual['ejecutado_usd' . $parametros->pos];

                    if ($parametros->concepto == 'estimado') {
                        $parametros->valor_concepto = $parametros->actual['estimado_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $parametros->valor_concepto = $parametros->actual['plan_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $parametros->valor_concepto = $parametros->actual['proyec_usd' . $parametros->pos];
                    }

                    $existe[0]->valor = $parametros->valor_concepto;
                    $existe[0]->save();
                } else {

                    $guardar = new DatInversfinancejecutado();
                    $parametros->valor_concepto = $parametros->actual['ejecutado_usd' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $guardar = new DatInversfinancestimado();
                        //   print_r( $parametros->actual['estimado_usd' . $parametros->pos]);die;
                        $parametros->valor_concepto = $parametros->actual['estimado_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $guardar = new DatInversfinancplan();
                        $parametros->valor_concepto = $parametros->actual['plan_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $guardar = new DatInversfinancproyectado();
                        $parametros->valor_concepto = $parametros->actual['proyec_usd' . $parametros->pos];
                    }

                    $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_usd'];
                    $guardar->idejercicio = $ejercicio[0]->idejercicio;
                    $guardar->idinversion = $parametros->actual['idinversion'];
                    $guardar->idtipofinanciamiento = $parametros->actual['idtipofinanciamiento'];
                    $guardar->valor = $parametros->valor_concepto;
                    $guardar->save();
                }
            }
        }
    }

    public function guardarDatosQuienFinancia($parametros) {
        $conceptos = ['ejecutado', 'estimado', 'plan', 'proyeccion'];
        $conceptosclase = ['DatInversfinancistaejecutado', 'DatInversfinancistaestimado', 'DatInversfinancistaplan', 'DatInversfinancistaproyectado'];

        foreach ($parametros->datos as $key => $value) {
            $parametros->actual = (array) $value;
            if ($parametros->actual['idmonedaentidad_mp'] == null) {
                $parametros->identidadmp = InversionesModel::devolverIdMonedaEnt($parametros->mp, $parametros->identidad);
                $parametros->actual['idmonedaentidad_mp'] = $parametros->identidadmp[0]['idmonedaentidad'];
            }
            if ($parametros->actual['idmonedaentidad_usd'] == null) {
                $parametros->identidadusd = InversionesModel::devolverIdMonedaEnt($parametros->usd, $parametros->identidad);
                $parametros->actual['idmonedaentidad_usd'] = $parametros->identidadusd[0]['idmonedaentidad'];
            }
            foreach ($conceptos as $pos => $concepto) {
                $parametros->concepto = $concepto;
                $parametros->claseconcepto = $conceptosclase[$pos];

                $parametros->ejerciciousar = $parametros->ejercicio;
                $parametros->pos = 3;
                self::addDatosQuienFinancia($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio - 1;
                $parametros->pos = 2;
                self::addDatosQuienFinancia($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio - 2;
                $parametros->pos = 1;
                self::addDatosQuienFinancia($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio + 1;
                $parametros->pos = 4;
                self::addDatosQuienFinancia($parametros);
            }
        }
        return 1;
    }

    public function guardarDatosQuienFinanciaAjuste($parametros) {
        $conceptos = ['ejecutado', 'estimado', 'plan', 'proyeccion'];
        $conceptosclase = ['DatInversfinancistaejecutado', 'DatInversfinancistaestimado', 'DatInversfinancistaplan', 'DatInversfinancistaproyectado'];

        foreach ($parametros->datos as $key => $value) {
            $parametros->actual = (array) $value;
            if ($parametros->actual['idmonedaentidad_mp'] == null) {
                $parametros->identidadmp = InversionesModel::devolverIdMonedaEnt($parametros->mp, $parametros->identidad);
                $parametros->actual['idmonedaentidad_mp'] = $parametros->identidadmp[0]['idmonedaentidad'];
            }
            if ($parametros->actual['idmonedaentidad_usd'] == null) {
                $parametros->identidadusd = InversionesModel::devolverIdMonedaEnt($parametros->usd, $parametros->identidad);
                $parametros->actual['idmonedaentidad_usd'] = $parametros->identidadusd[0]['idmonedaentidad'];
            }
            foreach ($conceptos as $pos => $concepto) {
                $parametros->concepto = $concepto;
                $parametros->claseconcepto = $conceptosclase[$pos];

                $parametros->ejerciciousar = $parametros->ejercicio;
                $parametros->pos = 3;
                self::addDatosQuienFinanciaAjuste($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio - 1;
                $parametros->pos = 2;
                self::addDatosQuienFinanciaAjuste($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio - 2;
                $parametros->pos = 1;
                self::addDatosQuienFinanciaAjuste($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio + 1;
                $parametros->pos = 4;
                self::addDatosQuienFinanciaAjuste($parametros);
            }
        }
        return 1;
    }

    private function addDatosQuienFinancia($parametros) {
        $boolSaveTrazas = false;
        $numejercicio = "'" . $parametros->ejerciciousar . "'";
        $ejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = {$numejercicio}");
        if ($ejercicio[0]->idejercicio != null) {
            $idejercicio = $ejercicio[0]->idejercicio;

            if ($parametros->actual['idmonedaentidad_mp']) {
                $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idfinancista = {$parametros->actual['idfinancista']} AND idmonedaentidad = {$parametros->actual['idmonedaentidad_mp']} AND idinversion = {$parametros->actual['idinversion']}");

                if ($existe[0]->idejercicio != null) {

                    $parametros->valor_concepto = $parametros->actual['ejecutado_mp' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $parametros->valor_concepto = $parametros->actual['estimado_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $parametros->valor_concepto = $parametros->actual['plan_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $parametros->valor_concepto = $parametros->actual['proyec_mp' . $parametros->pos];
                    }

                    $estado = DatInversion::estadoEjercicioPorEjercicio($ejercicio[0]->idejercicio);
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        if ($existe[0]->valor != $parametros->valor_concepto) {
                            if ($parametros->valor_concepto == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} que era de: {$existe[0]->valor} MP";
                                $existe[0]->delete();
                            } else {
                                $boolSaveTrazas = true;
                                $acc = "actualizar";
                                $des = "Se actualizó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} que era de: {$existe[0]->valor} MP a {$parametros->valor_concepto}MP";

                                $existe[0]->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                                $existe[0]->save();
                            }
                        }

//                        $existe[0]->valor = $parametros->valor_concepto;
//                        $existe[0]->save();
                    } else if ($estado == 'Listo') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion') {
                            if ($existe[0]->valor != $parametros->valor_concepto) {
                                if ($parametros->valor_concepto == 0) {
                                    $boolSaveTrazas = true;
                                    $acc = "eliminar";
                                    $des = "Se eliminó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} que era de: {$existe[0]->valor} MP";
                                    $existe[0]->delete();
                                } else {
                                    $boolSaveTrazas = true;
                                    $acc = "actualizar";
                                    $des = "Se actualizó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} que era de: {$existe[0]->valor} MP a {$parametros->valor_concepto}MP";

                                    $existe[0]->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                                    $existe[0]->save();
                                }
                            }
//                            $existe[0]->valor = $parametros->valor_concepto;
//                            $existe[0]->save();
                        }
                    } else if ($estado == 'Ejecución') {
                        //pre_r('entra');
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado') {
                            if ($existe[0]->valor != $parametros->valor_concepto) {
                                if ($parametros->valor_concepto == 0) {
                                    $boolSaveTrazas = true;
                                    $acc = "eliminar";
                                    $des = "Se eliminó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} que era de: {$existe[0]->valor} MP";
                                    $existe[0]->delete();
                                } else {
                                    $boolSaveTrazas = true;
                                    $acc = "actualizar";
                                    $des = "Se actualizó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} que era de: {$existe[0]->valor} MP a {$parametros->valor_concepto}MP";

                                    $existe[0]->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                                    $existe[0]->save();
                                }
                            }
//                            $existe[0]->valor = $parametros->valor_concepto;
//                            $existe[0]->save();
                        }
                    }
                } else {

                    $guardar = new DatInversfinancistaejecutado();
                    $parametros->valor_concepto = $parametros->actual['ejecutado_mp' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $guardar = new DatInversfinancistaestimado();
                        $parametros->valor_concepto = $parametros->actual['estimado_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $guardar = new DatInversfinancistaplan();
                        $parametros->valor_concepto = $parametros->actual['plan_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $guardar = new DatInversfinancistaproyectado();
                        $parametros->valor_concepto = $parametros->actual['proyec_mp' . $parametros->pos];
                    }

                    $estado = DatInversion::estadoEjercicioPorEjercicio($ejercicio[0]->idejercicio);
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_mp'];
                        /* $guardar->idejercicio = $ejercicio[0]->idejercicio;
                          $guardar->idinversion = $parametros->actual['idinversion'];
                          $guardar->idfinancista = $parametros->actual['idfinancista'];
                          $guardar->valor = $parametros->valor_concepto;
                          $guardar->save(); */
                    } else if ($estado == 'Listo') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion')
                            $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_mp'];
                        /* $guardar->idejercicio = $ejercicio[0]->idejercicio;
                          $guardar->idinversion = $parametros->actual['idinversion'];
                          $guardar->idfinancista = $parametros->actual['idfinancista'];
                          $guardar->valor = $parametros->valor_concepto;
                          $guardar->save(); */
                    }else if ($estado == 'Ejecución') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado')
                            $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_mp'];
                    }
                    $guardar->idejercicio = $ejercicio[0]->idejercicio;
                    $guardar->idinversion = $parametros->actual['idinversion'];
                    $guardar->idfinancista = $parametros->actual['idfinancista'];
                    $guardar->valor = $parametros->valor_concepto;
                    if ($guardar->valor != 0) {
                        $boolSaveTrazas = true;
                        $acc = "adicionar";
                        $des = "Se adicionó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} con valor de: {$parametros->valor_concepto} MP";
                        $guardar->save();
                    }
                }
            }

            if ($boolSaveTrazas) {
//                HisTrazasinversionesModel::seveTrazasInversiones('Desglose Financiamiento / Quién financia', $acc, $parametros->claseconcepto, $parametros->actual['idinversion'], $des, $this->global->Perfil->usuario);
            }
            // tipo de moneda USD    
            if ($parametros->actual['idmonedaentidad_usd']) {

                $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idfinancista = {$parametros->actual['idfinancista']} AND idmonedaentidad = {$parametros->actual['idmonedaentidad_usd']} AND idinversion = {$parametros->actual['idinversion']}");

                if ($existe[0]->idejercicio != null) {

                    $parametros->valor_concepto = $parametros->actual['ejecutado_usd' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $parametros->valor_concepto = $parametros->actual['estimado_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $parametros->valor_concepto = $parametros->actual['plan_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $parametros->valor_concepto = $parametros->actual['proyec_usd' . $parametros->pos];
                    }

                    $estado = DatInversion::estadoEjercicioPorEjercicio($ejercicio[0]->idejercicio);
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        if ($existe[0]->valor != $parametros->valor_concepto) {
                            if ($parametros->valor_concepto == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} que era de: {$existe[0]->valor} USD";
                                $existe[0]->delete();
                            } else {
                                $boolSaveTrazas = true;
                                $acc = "actualizar";
                                $des = "Se actualizó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} que era de: {$existe[0]->valor} USD a {$parametros->valor_concepto}USD";

                                $existe[0]->valor = $parametros->valor_concepto;
                                $existe[0]->save();
                            }
                        }
                    } else if ($estado == 'Listo') {
                        if ($existe[0]->valor != $parametros->valor_concepto) {
                            if ($parametros->valor_concepto == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} que era de: {$existe[0]->valor} USD";
                                $existe[0]->delete();
                            } else {
                                if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion') {
                                    $boolSaveTrazas = true;
                                    $acc = "actualizar";
                                    $des = "Se actualizó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} que era de: {$existe[0]->valor} USD a {$parametros->valor_concepto}USD";

                                    $existe[0]->valor = $parametros->valor_concepto;
                                    $existe[0]->save();
                                }
                            }
                        }
                    } else if ($estado == 'Ejecución') {
                        if ($existe[0]->valor != $parametros->valor_concepto) {
                            if ($parametros->valor_concepto == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} USD";
                                $existe[0]->delete();
                            } else {
                                if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado') {
                                    $boolSaveTrazas = true;
                                    $acc = "actualizar";
                                    $des = "Se actualizó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} que era de: {$existe[0]->valor} USD a {$parametros->valor_concepto}USD";

                                    $existe[0]->valor = $parametros->valor_concepto;
                                    $existe[0]->save();
                                }
                            }
                        }
                    }
                } else {

                    $guardar = new DatInversfinancistaejecutado();
                    $parametros->valor_concepto = $parametros->actual['ejecutado_usd' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $guardar = new DatInversfinancistaestimado();
                        $parametros->valor_concepto = $parametros->actual['estimado_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $guardar = new DatInversfinancistaplan();
                        $parametros->valor_concepto = $parametros->actual['plan_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $guardar = new DatInversfinancistaproyectado();
                        $parametros->valor_concepto = $parametros->actual['proyec_usd' . $parametros->pos];
                    }

                    $estado = DatInversion::estadoEjercicioPorEjercicio($ejercicio[0]->idejercicio);
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_usd'];
                        /* $guardar->idejercicio = $ejercicio[0]->idejercicio;
                          $guardar->idinversion = $parametros->actual['idinversion'];
                          $guardar->idfinancista = $parametros->actual['idfinancista'];
                          $guardar->valor = $parametros->valor_concepto;
                          $guardar->save(); */
                    } else if ($estado == 'Listo') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion') {
                            $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_usd'];
                        }
                        /* $guardar->idejercicio = $ejercicio[0]->idejercicio;
                          $guardar->idinversion = $parametros->actual['idinversion'];
                          $guardar->idfinancista = $parametros->actual['idfinancista'];
                          $guardar->valor = $parametros->valor_concepto;
                          $guardar->save(); */
                    } else if ($estado == 'Ejecución') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado') {
                            $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_usd'];
                        }
                    }
                    $guardar->idejercicio = $ejercicio[0]->idejercicio;
                    $guardar->idinversion = $parametros->actual['idinversion'];
                    $guardar->idfinancista = $parametros->actual['idfinancista'];
                    $guardar->valor = $parametros->valor_concepto;
                    if ($guardar->valor != 0) {
                        $boolSaveTrazas = true;
                        $acc = "adicionar";
                        $des = "Se adicionó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} con valor de: {$parametros->valor_concepto} USD";
                        $guardar->save();
                    }
                }
            }

            if ($boolSaveTrazas) {
//                HisTrazasinversionesModel::seveTrazasInversiones('Desglose Financiamiento / Quién financia', $acc, $parametros->claseconcepto, $parametros->actual['idinversion'], $des, $this->global->Perfil->usuario);
            }
        }
    }

    private function addDatosQuienFinanciaAjuste($parametros) {
        $numejercicio = "'" . $parametros->ejerciciousar . "'";
        $ejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = {$numejercicio}");
        if ($ejercicio[0]->idejercicio != null) {
            $idejercicio = $ejercicio[0]->idejercicio;

            //print_r($parametros->actual);die;
            if ($parametros->actual['idmonedaentidad_mp']) {
                $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idfinancista = {$parametros->actual['idfinancista']} AND idmonedaentidad = {$parametros->actual['idmonedaentidad_mp']} AND idinversion = {$parametros->actual['idinversion']}");

                if ($existe[0]->idejercicio != null) {

                    $parametros->valor_concepto = $parametros->actual['ejecutado_mp' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $parametros->valor_concepto = $parametros->actual['estimado_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $parametros->valor_concepto = $parametros->actual['plan_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $parametros->valor_concepto = $parametros->actual['proyec_mp' . $parametros->pos];
                    }

//                    $existe[0]->valor = $parametros->valor_concepto;
//                    $existe[0]->save();
                    if ($existe[0]->valor != $parametros->valor_concepto) {
                        if ($parametros->valor_concepto == 0) {
                            $boolSaveTrazas = true;
                            $acc = "eliminar x btn Ajustar";
                            $des = "Se eliminó el Quién Financia de {$parametros->concepto} que era de: {$existe[0]->valor} MP";
                            $existe[0]->delete();
                        } else {
                            $boolSaveTrazas = true;
                            $acc = "actualizar x btn Ajustar";
                            $des = "Se actualizó el Quién Financia de {$parametros->concepto} que era de: {$existe[0]->valor} MP a {$parametros->valor_concepto}MP";

                            $existe[0]->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                            $existe[0]->save();
                        }
                    }
                } else {

                    $guardar = new DatInversfinancistaejecutado();
                    $parametros->valor_concepto = $parametros->actual['ejecutado_mp' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $guardar = new DatInversfinancistaestimado();
                        $parametros->valor_concepto = $parametros->actual['estimado_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $guardar = new DatInversfinancistaplan();
                        $parametros->valor_concepto = $parametros->actual['plan_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $guardar = new DatInversfinancistaproyectado();
                        $parametros->valor_concepto = $parametros->actual['proyec_mp' . $parametros->pos];
                    }

                    if ($parametros->valor_concepto != 0) {
                        $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_mp'];
                        $guardar->idejercicio = $ejercicio[0]->idejercicio;
                        $guardar->idinversion = $parametros->actual['idinversion'];
                        $guardar->idfinancista = $parametros->actual['idfinancista'];
                        $guardar->valor = $parametros->valor_concepto;

                        $boolSaveTrazas = true;
                        $acc = "adicionar x btn Ajustar";
                        $des = "Se adicionó el Quién Financia de {$parametros->concepto} con valor de: {$parametros->valor_concepto} MP";

                        $guardar->save();
                    }
                }
            }

            if ($boolSaveTrazas) {
//                HisTrazasinversionesModel::seveTrazasInversiones('Desglose Financiamiento / Como se financia', $acc, $parametros->claseconcepto, $parametros->actual['idinversion'], $des, $this->global->Perfil->usuario);
            }
            // tipo de moneda USD
            if ($parametros->actual['idmonedaentidad_usd']) {
//        print_r($parametros);die;
                $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idfinancista = {$parametros->actual['idfinancista']} AND idmonedaentidad = {$parametros->actual['idmonedaentidad_usd']} AND idinversion = {$parametros->actual['idinversion']}");

                if ($existe[0]->idejercicio != null) {

                    $parametros->valor_concepto = $parametros->actual['ejecutado_usd' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $parametros->valor_concepto = $parametros->actual['estimado_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $parametros->valor_concepto = $parametros->actual['plan_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $parametros->valor_concepto = $parametros->actual['proyec_usd' . $parametros->pos];
                    }

//                    $existe[0]->valor = $parametros->valor_concepto;
//                    $existe[0]->save();
                    if ($existe[0]->valor != $parametros->valor_concepto) {
                        if ($parametros->valor_concepto == 0) {
                            $boolSaveTrazas = true;
                            $acc = "eliminar x btn Ajustar";
                            $des = "Se eliminó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} que era de: {$existe[0]->valor} MP";
                            $existe[0]->delete();
                        } else {
                            $boolSaveTrazas = true;
                            $acc = "actualizar x btn Ajustar";
                            $des = "Se actualizó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} que era de: {$existe[0]->valor} MP a {$parametros->valor_concepto}MP";

                            $existe[0]->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                            $existe[0]->save();
                        }
                    }
                } else {

                    $guardar = new DatInversfinancistaejecutado();
                    $parametros->valor_concepto = $parametros->actual['ejecutado_usd' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $guardar = new DatInversfinancistaestimado();
                        $parametros->valor_concepto = $parametros->actual['estimado_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $guardar = new DatInversfinancistaplan();
                        $parametros->valor_concepto = $parametros->actual['plan_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $guardar = new DatInversfinancistaproyectado();
                        $parametros->valor_concepto = $parametros->actual['proyec_usd' . $parametros->pos];
                    }
                    if ($parametros->valor_concepto != 0) {
                        $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_usd'];
                        $guardar->idejercicio = $ejercicio[0]->idejercicio;
                        $guardar->idinversion = $parametros->actual['idinversion'];
                        $guardar->idfinancista = $parametros->actual['idfinancista'];
                        $guardar->valor = $parametros->valor_concepto;

                        $boolSaveTrazas = true;
                        $acc = "adicionar x btn Ajustar";
                        $des = "Se adicionó el Quién Financia ({$parametros->actual['quienfinac']}) de {$parametros->concepto} con valor de: {$parametros->valor_concepto} MP";

                        $guardar->save();
                    }
                }
            }

            if ($boolSaveTrazas) {
//                HisTrazasinversionesModel::seveTrazasInversiones('Desglose Financiamiento / Como se financia', $acc, $parametros->claseconcepto, $parametros->actual['idinversion'], $des, $this->global->Perfil->usuario);
            }
        }
    }

    public function guardarDatosAlContado($parametros) {
        //    print_r($parametros);die;
        $conceptos = ['ejecutado', 'estimado', 'plan', 'proyeccion'];
        $conceptosclase = ['DatInverscontadoejecutado', 'DatInverscontadoestimado', 'DatInverscontadoplan', 'DatInverscontadoproyectado'];
//print_r($parametros->datos);die;
        foreach ($parametros->datos as $key => $value) {

            $parametros->actual = (array) $value;
            if ($parametros->actual['idmonedaentidad_mp'] == null) {
                $parametros->identidadmp = InversionesModel::devolverIdMonedaEnt($parametros->mp, $parametros->identidad);
                $parametros->actual['idmonedaentidad_mp'] = $parametros->identidadmp[0]['idmonedaentidad'];
            }
            if ($parametros->actual['idmonedaentidad_usd'] == null) {
                $parametros->identidadusd = InversionesModel::devolverIdMonedaEnt($parametros->usd, $parametros->identidad);
                $parametros->actual['idmonedaentidad_usd'] = $parametros->identidadusd[0]['idmonedaentidad'];
            }

//    print_r($parametros->actual);die;
            foreach ($conceptos as $pos => $concepto) {
                $parametros->concepto = $concepto;
                $parametros->claseconcepto = $conceptosclase[$pos];

                $parametros->ejerciciousar = $parametros->ejercicio;
                $parametros->pos = 3;
                self::addDatosAlContado($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio - 1;
                $parametros->pos = 2;
                self::addDatosAlContado($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio - 2;
                $parametros->pos = 1;
                self::addDatosAlContado($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio + 1;
                $parametros->pos = 4;
                self::addDatosAlContado($parametros);
            }
        }
        return 1;
    }

    public function guardarDatosAlContadoAjuste($parametros) {
        //    print_r($parametros);die;
        $conceptos = ['ejecutado', 'estimado', 'plan', 'proyeccion'];
        $conceptosclase = ['DatInverscontadoejecutado', 'DatInverscontadoestimado', 'DatInverscontadoplan', 'DatInverscontadoproyectado'];

        foreach ($parametros->datos as $key => $value) {

            $parametros->actual = (array) $value;
            if ($parametros->actual['idmonedaentidad_mp'] == null) {
                $parametros->identidadmp = InversionesModel::devolverIdMonedaEnt($parametros->mp, $parametros->identidad);
                $parametros->actual['idmonedaentidad_mp'] = $parametros->identidadmp[0]['idmonedaentidad'];
            }
            if ($parametros->actual['idmonedaentidad_usd'] == null) {
                $parametros->identidadusd = InversionesModel::devolverIdMonedaEnt($parametros->usd, $parametros->identidad);
                $parametros->actual['idmonedaentidad_usd'] = $parametros->identidadusd[0]['idmonedaentidad'];
            }

            //     print_r($parametros->actual);die;
            foreach ($conceptos as $pos => $concepto) {
                $parametros->concepto = $concepto;
                $parametros->claseconcepto = $conceptosclase[$pos];

                $parametros->ejerciciousar = $parametros->ejercicio;
                $parametros->pos = 3;
                self::addDatosAlContadoAjuste($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio - 1;
                $parametros->pos = 2;
                self::addDatosAlContadoAjuste($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio - 2;
                $parametros->pos = 1;
                self::addDatosAlContadoAjuste($parametros);

                $parametros->ejerciciousar = $parametros->ejercicio + 1;
                $parametros->pos = 4;
                self::addDatosAlContadoAjuste($parametros);
            }
        }
        return 1;
    }

//guarda el desglose del COMO SE FINANCIA al contado.... btn guardar
    private function addDatosAlContado($parametros) {
        $numejercicio = "'" . $parametros->ejerciciousar . "'";
        $ejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = {$numejercicio}");
        if ($ejercicio[0]->idejercicio != null) {
            $boolSaveTrazas = false;
            $idejercicio = $ejercicio[0]->idejercicio;
            if ($parametros->actual['idmonedaentidad_mp']) {
                $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idinversion = {$parametros->actual['idinversion']} AND idmonedaentidad = {$parametros->actual['idmonedaentidad_mp']}");
                //print_r($existe);die;
                if ($existe[0]->idejercicio != null) {
                    $r = $parametros->actual['ejecutado_mp' . $parametros->pos];
                    //print_r($r);die;

                    $parametros->valor_concepto = $parametros->actual['ejecutado_mp' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $parametros->valor_concepto = $parametros->actual['estimado_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $parametros->valor_concepto = $parametros->actual['plan_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $parametros->valor_concepto = $parametros->actual['proyec_mp' . $parametros->pos];
                    }

                    $estado = DatInversion::estadoEjercicioPorEjercicio($ejercicio[0]->idejercicio);
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        if ($existe[0]->valor != $parametros->valor_concepto) {
                            if ($parametros->valor_concepto == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} MP";
                                $existe[0]->delete();
                            } else {
                                $boolSaveTrazas = true;
                                $acc = "actualizar";
                                $des = "Se actualizó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} MP a {$parametros->valor_concepto}MP";

                                $existe[0]->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                                $existe[0]->save();
                            }
                        }
                    } else if ($estado == 'Listo') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion') {
                            if ($parametros->valor_concepto == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} MP";
                                $existe[0]->delete();
                            } else {
//                                if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion') {
                                if ($existe[0]->valor != $parametros->valor_concepto) {
                                    $boolSaveTrazas = true;
                                    $acc = "actualizar";
                                    $des = "Se actualizó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} MP a {$parametros->valor_concepto}MP";

                                    $existe[0]->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                                    $existe[0]->save();
                                }
//                                }
                            }
                        }
                    } else if ($estado == 'Ejecución') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado') {
                            if ($parametros->valor_concepto == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} MP";
                                $existe[0]->delete();
                            } else {
//                                if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado') {
                                if ($existe[0]->valor != $parametros->valor_concepto) {
                                    $boolSaveTrazas = true;
                                    $acc = "actualizar";
                                    $des = "Se actualizó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} MP a {$parametros->valor_concepto}MP";

                                    $existe[0]->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                                    $existe[0]->save();
                                }
//                                }
                            }
                        }
                    }
                } else {

                    $guardar = new DatInverscontadoejecutado();
                    $parametros->valor_concepto = $parametros->actual['ejecutado_mp' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $guardar = new DatInverscontadoestimado();
                        $parametros->valor_concepto = $parametros->actual['estimado_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $guardar = new DatInverscontadoplan();
                        $parametros->valor_concepto = $parametros->actual['plan_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $guardar = new DatInverscontadoproyectado();
                        $parametros->valor_concepto = $parametros->actual['proyec_mp' . $parametros->pos];
                    }

                    $estado = DatInversion::estadoEjercicioPorEjercicio($ejercicio[0]->idejercicio);
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_mp'] ? $parametros->actual['idmonedaentidad_mp'] : 0;
                        /* $guardar->idejercicio = $ejercicio[0]->idejercicio;
                          $guardar->idinversion = $parametros->actual['idinversion'];
                          $guardar->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                          $guardar->save(); */
                    } else if ($estado == 'Listo') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion') {
                            $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_mp'] ? $parametros->actual['idmonedaentidad_mp'] : 0;
                        }
                        /* $guardar->idejercicio = $ejercicio[0]->idejercicio;
                          $guardar->idinversion = $parametros->actual['idinversion'];
                          $guardar->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                          $guardar->save(); */
                    } else if ($estado == 'Ejecución') {
                        //pre_r('entra');
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado') {
                            $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_mp'] ? $parametros->actual['idmonedaentidad_mp'] : 0;
                        }
                    }
                    $guardar->idejercicio = $ejercicio[0]->idejercicio;
                    $guardar->idinversion = $parametros->actual['idinversion'];
                    $guardar->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                    if ($guardar->valor != 0) {
                        $boolSaveTrazas = true;
                        $acc = "adicionar";
                        $des = "Se adicionó el CONTADO de {$parametros->concepto} con valor de: {$parametros->valor_concepto} MP";
                        $guardar->save();
                    }
                }
                if ($boolSaveTrazas) {
//                    HisTrazasinversionesModel::seveTrazasInversiones('Desglose Financiamiento / Como se financia', $acc, $parametros->claseconcepto, $parametros->actual['idinversion'], $des, $this->global->Perfil->usuario);
                }
            }

            // tipo de moneda USD    
            if ($parametros->actual['idmonedaentidad_usd']) {
//                if ($parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto] != '' ||
//                        $parametros->actual['usd' . ($parametros->ejerciciousar) . $parametros->concepto] == 0) {

                $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idinversion = {$parametros->actual['idinversion']} AND idmonedaentidad = {$parametros->actual['idmonedaentidad_usd']}");

                if ($existe[0]->idejercicio != null) {

                    $parametros->valor_concepto = $parametros->actual['ejecutado_usd' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $parametros->valor_concepto = $parametros->actual['estimado_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $parametros->valor_concepto = $parametros->actual['plan_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $parametros->valor_concepto = $parametros->actual['proyec_usd' . $parametros->pos];
                    }

                    $estado = DatInversion::estadoEjercicioPorEjercicio($ejercicio[0]->idejercicio);
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
//                        $v = $parametros->actual['mp' . ($parametros->ejerciciousar) . $parametros->concepto];
                        if ($existe[0]->valor != $parametros->valor_concepto) {
                            if ($parametros->valor_concepto == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} USD";
                                $existe[0]->delete();
                            } else {
                                $boolSaveTrazas = true;
                                $acc = "actualizar";
                                $des = "Se actualizó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} USD a {$parametros->valor_concepto}USD";

                                $existe[0]->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                                $existe[0]->save();
                            }
                        }
                    } else if ($estado == 'Listo') {
                        if ($existe[0]->valor != $parametros->valor_concepto) {
                            if ($parametros->valor_concepto == 0) {
                                $boolSaveTrazas = true;
                                $acc = "eliminar";
                                $des = "Se eliminó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} USD";
                                $existe[0]->delete();
                            } else {
                                if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion') {
                                    $boolSaveTrazas = true;
                                    $acc = "actualizar";
                                    $des = "Se actualizó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} USD a {$parametros->valor_concepto}USD";

                                    $existe[0]->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                                    $existe[0]->save();
                                }
                            }
                        }
                    } else if ($estado == 'Ejecución') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado') {

                            if ($existe[0]->valor != $parametros->valor_concepto) {
                                if ($parametros->valor_concepto == 0) {
                                    $boolSaveTrazas = true;
                                    $acc = "eliminar";
                                    $des = "Se eliminó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} USD";
                                    $existe[0]->delete();
                                } else {
//                                if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado')
                                    $boolSaveTrazas = true;
                                    $acc = "actualizar";
                                    $des = "Se actualizó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} USD a {$parametros->valor_concepto}USD";
                                    $existe[0]->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                                    $existe[0]->save();
                                }
                            }
                        }
                    }
                } else {

                    $guardar = new DatInverscontadoejecutado();
                    $parametros->valor_concepto = $parametros->actual['ejecutado_usd' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $guardar = new DatInverscontadoestimado();
                        $parametros->valor_concepto = $parametros->actual['estimado_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $guardar = new DatInverscontadoplan();
                        $parametros->valor_concepto = $parametros->actual['plan_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $guardar = new DatInverscontadoproyectado();
                        $parametros->valor_concepto = $parametros->actual['proyec_usd' . $parametros->pos];
                    }

                    $estado = DatInversion::estadoEjercicioPorEjercicio($ejercicio[0]->idejercicio);
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_usd'];
                        /* $guardar->idejercicio = $ejercicio[0]->idejercicio;
                          $guardar->idinversion = $parametros->actual['idinversion'];
                          $guardar->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                          $guardar->save(); */
                    } else if ($estado == 'Listo') {
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion') {
                            $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_usd'];
                        }
                        /* $guardar->idejercicio = $ejercicio[0]->idejercicio;
                          $guardar->idinversion = $parametros->actual['idinversion'];
                          $guardar->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                          $guardar->save(); */
                    } else if ($estado == 'Ejecución') {
                        //pre_r('entra');
                        if ($parametros->concepto != 'plan' && $parametros->concepto != 'proyeccion' && $parametros->concepto != 'estimado') {
                            $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_usd'];
                        }
                    }
                    $guardar->idejercicio = $ejercicio[0]->idejercicio;
                    $guardar->idinversion = $parametros->actual['idinversion'];
                    $guardar->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                    if ($guardar->valor != 0) {
//        pre_r($guardar->toArray());
                        $boolSaveTrazas = true;
                        $acc = "adicionar";
                        $des = "Se adicionó el CONTADO de {$parametros->concepto} con valor de: {$parametros->valor_concepto} USD";
                        $guardar->save();
                    }
                }
            }
            if ($boolSaveTrazas) {
//        print_r($parametros->actual['idinversion']);die;
//                HisTrazasinversionesModel::seveTrazasInversiones('Desglose Financiamiento / Como se financia', $acc, $parametros->claseconcepto, $parametros->actual['idinversion'], $des, $this->global->Perfil->usuario);
            }
        }
//        }
    }

    private function addDatosAlContadoAjuste($parametros) {
        $numejercicio = "'" . $parametros->ejerciciousar . "'";

        $ejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = {$numejercicio}");
        if ($ejercicio[0]->idejercicio != null) {
            $idejercicio = $ejercicio[0]->idejercicio;
            if ($parametros->actual['idmonedaentidad_mp']) {
                $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idinversion = {$parametros->actual['idinversion']} AND idmonedaentidad = {$parametros->actual['idmonedaentidad_mp']}");
                //print_r($existe);die;
                if ($existe[0]->idejercicio != null) {
                    $r = $parametros->actual['ejecutado_mp' . $parametros->pos];
                    //print_r($r);die;

                    $parametros->valor_concepto = $parametros->actual['ejecutado_mp' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $parametros->valor_concepto = $parametros->actual['estimado_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $parametros->valor_concepto = $parametros->actual['plan_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $parametros->valor_concepto = $parametros->actual['proyec_mp' . $parametros->pos];
                    }

//                    $existe[0]->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
//                    $existe[0]->save();
                    if ($existe[0]->valor != $parametros->valor_concepto) {
                        if ($parametros->valor_concepto == 0) {
                            $boolSaveTrazas = true;
                            $acc = "eliminar x btn Ajustar";
                            $des = "Se eliminó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} MP";
                            $existe[0]->delete();
                        } else {
                            $boolSaveTrazas = true;
                            $acc = "actualizar x btn Ajustar";
                            $des = "Se actualizó el CONTADO de {$parametros->concepto} que era de: {$existe[0]->valor} MP a {$parametros->valor_concepto}MP";

                            $existe[0]->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                            $existe[0]->save();
                        }
                    }
                } else {

                    $guardar = new DatInverscontadoejecutado();
                    $parametros->valor_concepto = $parametros->actual['ejecutado_mp' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $guardar = new DatInverscontadoestimado();
                        $parametros->valor_concepto = $parametros->actual['estimado_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $guardar = new DatInverscontadoplan();
                        $parametros->valor_concepto = $parametros->actual['plan_mp' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $guardar = new DatInverscontadoproyectado();
                        $parametros->valor_concepto = $parametros->actual['proyec_mp' . $parametros->pos];
                    }

                    if ($parametros->valor_concepto != 0) {
                        $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_mp'] ? $parametros->actual['idmonedaentidad_mp'] : 0;
                        $guardar->idejercicio = $ejercicio[0]->idejercicio;
                        $guardar->idinversion = $parametros->actual['idinversion'];
                        $guardar->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;

                        $boolSaveTrazas = true;
                        $acc = "adicionar x btn Ajustar";
                        $des = "Se adicionó el CONTADO de {$parametros->concepto} con valor de: {$parametros->valor_concepto} MP";

                        $guardar->save();
                    }
                }
            }
            if ($boolSaveTrazas) {
//                HisTrazasinversionesModel::seveTrazasInversiones('Desglose Financiamiento / Como se financia', $acc, $parametros->claseconcepto, $parametros->actual['idinversion'], $des, $this->global->Perfil->usuario);
            }

            // tipo de moneda USD
            if ($parametros->actual['idmonedaentidad_usd']) {

                $existe = Doctrine::getTable($parametros->claseconcepto)->findByDql("idejercicio = {$idejercicio} AND idinversion = {$parametros->actual['idinversion']} AND idmonedaentidad = {$parametros->actual['idmonedaentidad_usd']}");

                if ($existe[0]->idejercicio != null) {

                    $parametros->valor_concepto = $parametros->actual['ejecutado_usd' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $parametros->valor_concepto = $parametros->actual['estimado_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $parametros->valor_concepto = $parametros->actual['plan_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $parametros->valor_concepto = $parametros->actual['proyec_usd' . $parametros->pos];
                    }

                    $existe[0]->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                    $existe[0]->save();
                } else {

                    $guardar = new DatInverscontadoejecutado();
                    $parametros->valor_concepto = $parametros->actual['ejecutado_usd' . $parametros->pos];
                    if ($parametros->concepto == 'estimado') {
                        $guardar = new DatInverscontadoestimado();
                        $parametros->valor_concepto = $parametros->actual['estimado_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'plan') {
                        $guardar = new DatInverscontadoplan();
                        $parametros->valor_concepto = $parametros->actual['plan_usd' . $parametros->pos];
                    } elseif ($parametros->concepto == 'proyeccion') {
                        $guardar = new DatInverscontadoproyectado();
                        $parametros->valor_concepto = $parametros->actual['proyec_usd' . $parametros->pos];
                    }

                    $guardar->idmonedaentidad = $parametros->actual['idmonedaentidad_usd'];
                    $guardar->idejercicio = $ejercicio[0]->idejercicio;
                    $guardar->idinversion = $parametros->actual['idinversion'];
                    $guardar->valor = $parametros->valor_concepto ? $parametros->valor_concepto : 0;
                    $guardar->save();
                }
            }

            if ($boolSaveTrazas) {
//                HisTrazasinversionesModel::seveTrazasInversiones('Desglose Financiamiento / Como se financia', $acc, $parametros->claseconcepto, $parametros->actual['idinversion'], $des, $this->global->Perfil->usuario);
            }
        }
    }

    public function devolCodigoR($param) {
        return DatInversion::devolCodigoR($param);
    }

    public function cargarDenomInversiones($param) {
        return DatInversion::listarDenomInver($param);
    }

    public function devolverIdMonedaEnt($param, $entidad) {
        return DatInversion::devolverIdMonedaEnt($param, $entidad);
    }

    public function devolverIdMonedaXCodigo($param, $entidad) {
        return DatInversion::devolverIdMonedaXCodigo($param, $entidad);
    }

    public function listarAdquisicion() {
        $datos = DatInversion::listarAdquisicion();
        return $datos;
    }

    public function listarCompra() {
        $datos = DatInversion::listarCompra();
        return $datos;
    }

    public function arbolEntidades($identidad) {
        $datos = DatInversion::arbolEntidades($identidad);
        return $datos;
    }

    public function listarPlanesPreparacion($param) {
        $datos = DatInversion::listarPlanesPreparacionPorInversion($param);
        return $datos;
    }

    public function PlanPreparacion($param) {

        $arrayPlanPrep = array();
        $presupPlanPrep = self::listarPlanesPreparacion($param);

        $arrayPlanPrep['denominacion'] = "Plan de Preparaci&oacuten";
        $arrayPlanPrep['sumapresp_mp'] = number_format($presupPlanPrep[0]['valormp'], 2, '.', '');
        $arrayPlanPrep['sumapresp_usd'] = number_format($presupPlanPrep[0]['valorusd'], 2, '.', '');

        foreach ($param['ejercicios'] as $k => $ejercicio) {
            $pos = $k + 1;
            $valoresDesglose = array('ejecutado_mp', 'ejecutado_usd', 'estimado_mp', 'estimado_usd', 'plan_mp', 'plan_usd', 'proyec_mp', 'proyec_usd');
            foreach ($valoresDesglose as $valor) {
                $datos = self:: listarPlanesPreparacionDesglose($param, $ejercicio['id']);
                $encuentra = false;
                $valor_desglose = 0;
                $desglose = $valor . $pos;
                foreach ($datos as $dato) {
                    $var = (substr($dato['desglose'], 1)) . $pos;
                    if ($desglose == $var) {
                        $encuentra = true;
                        $valor_desglose = $dato['valor'];
                        break;
                    }
                }
                $arrayPlanPrep[$desglose] = ($encuentra == true) ? $valor_desglose : 0;
            }
        }
        $arrayPlanPrep['annospost_mp'] = number_format($arrayPlanPrep['sumapresp_mp'] - ($arrayPlanPrep['ejecutado_mp1'] + $arrayPlanPrep['estimado_mp2'] + $arrayPlanPrep['plan_mp3'] + $arrayPlanPrep['proyec_mp4']), 2, '.', '');
        $arrayPlanPrep['annospost_usd'] = number_format($arrayPlanPrep['sumapresp_usd'] - ($arrayPlanPrep['ejecutado_usd1'] + $arrayPlanPrep['estimado_usd2'] + $arrayPlanPrep['plan_usd3'] + $arrayPlanPrep['proyec_usd4']), 2, '.', '');
        $arrayPlanPrep['ppmp'] = $presupPlanPrep[0]['ppmp'];
        $arrayPlanPrep['ppusd'] = $presupPlanPrep[0]['ppusd'];

        //print_r($arrayPlanPrep); die();
        return $arrayPlanPrep;
    }

    public function listarPlanesPreparacionDesglose($param, $idEjercicic) {
        $datos = DatInversion::listarPlanesPreparacionPorInversionDesglose($param, $idEjercicic);
        return $datos;
    }

    public function exportarElemEqConst($param) {
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header('Content-Disposition: attachment;filename=Elementos-Constructor-Equipos.xls');
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';

        echo "<div > 
	<div style = 'margin-left: 40px'>
	<h2 style=\"font-family: Arial; font-size: 12px;\">" . $param['ejercicio'] . "</h2>
	<h2 style=\"font-family: Arial; font-size: 12px;\">Datos generales</h2>
	";

        $datosInversGral = DatInversion::inversionGral($param);

        $encabezadoInver = array_keys($datosInversGral[0]);

        echo "<table border=1>";
        echo "<tr>";
        foreach ($encabezadoInver as $encabI) {
            echo '<th>' . $encabI . '</th>';
        }
        echo "</tr>";

        foreach ($datosInversGral as $i => $datI) {
            echo "<tr>";
            foreach ($encabezadoInver as $j => $encabI) {
                echo '<th>' . $datI[$encabI] . '</th>';
            }
            echo "</tr>";
        }

        echo "</table>";

//datos Erogacion-Plan Prep- Financiamiento
        echo "<div > 
	<div style = 'margin-left: 40px'>  
	<h2 style=\"font-family: Arial; font-size: 12px;\">Erogacion-PP-Financiamiento
        </h2>";

        $datosErogPPfinanc = DatInversion::erogPPfinanciamiento($param);
        $encabezadoErogPPfinanc = array_keys($datosErogPPfinanc[0]);

        echo "<table border=1>";
        echo "<tr>";
        foreach ($encabezadoErogPPfinanc as $encabF) {
            echo '<th>' . $encabF . '</th>';
        }
        echo "</tr>";

        foreach ($datosErogPPfinanc as $i => $datI) {
            echo "<tr>";
            foreach ($encabezadoErogPPfinanc as $j => $encabF) {
                echo '<th>' . $datI[$encabF] . '</th>';
            }
            echo "</tr>";
        }

        echo "</table>";
//datos Elemento-Equipo-Constructor-Valor
        echo "<div > 
	<div style = 'margin-left: 40px'>  
	<h2 style=\"font-family: Arial; font-size: 12px;\">Elemento-Equipo-Constructor-Valor
        </h2>";


        $datosEleConstEq = DatInversion::eleConsEqValor($param);
        $encabezado = array_keys($datosEleConstEq[0]);

        echo "<table border=1>";
        echo "<tr>";
        foreach ($encabezado as $encab) {
            echo '<th>' . $encab . '</th>';
        }
        echo "</tr>";

        foreach ($datosEleConstEq as $i => $dat) {
            echo "<tr>";
            foreach ($encabezado as $j => $encab) {
                echo '<th>' . $dat[$encab] . '</th>';
            }
            echo "</tr>";
        }

        echo "</table>";
    }

}
