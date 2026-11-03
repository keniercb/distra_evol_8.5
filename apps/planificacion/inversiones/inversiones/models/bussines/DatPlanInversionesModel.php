<?php

class DatPlanInversionesModel extends ZendExt_Model {

    protected $totalesentidad;
    protected $totalgeneral;
    protected $totalesorg;
    protected $totalorgent = 0, $total = 0;

    /* public function __construct() { 

      echo $this->totalesorg;

      } */

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function reporteAcredorInversiones($parametros) {
        $data = DatInversion::listarAcredorInversion($parametros);
    }

    public function ListarMonedas($params) {
        $monedas = $this->integrator->datosmaestros->obtenerMonedasPorEntidad($params['identidad']);
        $array = $monedas['datos'];
        $resultado = array();
        foreach ($array as $key => $val) {
            if ($val['idmonedaentidad'] == 990000000149) {
                $resultado[0]['denominacion'] = $val['nombremoneda'];
                $resultado[0]['idmoneda'] = $val['idmonedaentidad'];
            }
            if ($val['idmonedaentidad'] == 990000000171) {
                $resultado[1]['denominacion'] = $val['nombremoneda'];
                $resultado[1]['idmoneda'] = $val['idmonedaentidad'];
            }
        }
        $result['data'] = $resultado;
        return $result;
    }

    public function ListarMonedaPorEntidad($params) {

        $data = DatInversion::ListarMonedaPorEntidad();
        return $data;
    }

    public function exportarAExcel($params) {


        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=EquiposAutomotores.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';

        echo "
        <table border=1 cellspacing=0 width=60%>       
        <tr>
            <th align=center>Clasificaci&oacute;n /Tipo de equipo</th>             
             <th align=center>Cantidad Reposici&oacute;n</th>
             <th align=center >Cantidad Incremento</th>
             <th align=center >Cantidad Total</th>
             <th align=center >De ello Donaci&oacute;n</th>
             <th align=center >Valor Total (MP)</th>
         </tr>";
        $aux = explode(',', $params['identiDen']);
        $aux1 = explode(',', $params['entidades']);

        foreach ($aux1 as $key => $valor) {
            $idestructurasaux[$key]['identidad'] = $valor;
            $idestructurasaux[$key]['entidad'] = $aux[$key];
        }

        global $totalesorg;
        foreach ($idestructurasaux as $key => $valOrg) {
            $totalesorg = array();
            $totalesorg['planrep'] = 0;
            $totalesorg['planinc'] = 0;
            $totalesorg['total'] = 0;
            $totalesorg['donacion'] = 0;
            $totalesorg['valor'] = 0;
            self::pintarDatos($valOrg, $params);
            $hijasorg = self::cargarEntidades($valOrg['identidad'], $params);

            foreach ($hijasorg as $key => $valEnt) {
                self::pintarDatos($valEnt, $params);
            }

            echo " <tr>
            <th align=left style = 'background-color: #CBCBCB'>" . 'Total del organismo ' . $valOrg['entidad'] . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . $totalesorg['planrep'] . "</th>
             <th align=right  style = 'background-color: #CBCBCB'>" . $totalesorg['planinc'] . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . $totalesorg['total'] . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . $totalesorg['donacion'] . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . $totalesorg['valor'] . "</th>
         </tr>";


            $totalgeneral['planrep']+=$totalesorg['planrep'];
            $totalgeneral['planinc']+=$totalesorg['planinc'];
            $totalgeneral['total']+=$totalesorg['total'];
            $totalgeneral['donacion']+=$totalesorg['donacion'];
            $totalgeneral['valor']+=$totalesorg['valor'];
        }

        echo "<tr>                     
             <th align=left style = 'background-color: #CBCBCB'>Total de Equipos Automotores:</th>
             <th align=right style = 'background-color: #CBCBCB'>" . $totalgeneral['planrep'] . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . $totalgeneral['planinc'] . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . $totalgeneral['total'] . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . $totalgeneral['donacion'] . "</th>
                  <th align=right style = 'background-color: #CBCBCB'>" . $totalgeneral['valor'] . "</th>
         </tr>
            


</table>";
    }

    public function exportarEquiposExcel($params) {//AUTOMOTORES EXCELLL
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=EquiposAutomotores.xls");
        header("Content-Transfer-Encoding: binary ");
// echo '<caption> ' . $array_etiq['lbNivelActividad'] . 'Entidad: ' . $params['text'] . ' </caption>';
        echo "
        <table border=1 cellspacing=0 width=60%>       
        <tr>
            <th align=center>OACE/OSDE</th>              
             <th align=center>Entidad</th>
             <th align=center >Inversi�n</th>
             <th align=center >Descripci�n</th>
             <th align=center >Organismo Rector</th>
             <th align=center >Forma de Propiedad</th>
             <th align=center >Adquirir</th>
             <th align=center >Comprar</th>
             <th align=center >Pa�s</th>
              <th align=center>Cantidad Reposici&oacute;n</th>
             <th align=center >Cantidad Incremento</th>
             <th align=center >Cantidad Total</th>
             <th align=center >Valor Total</th>
         </tr>";

        $datospintar = DatEtapaEquipo::ExportarEquiposAutomotoresExcel($params);
        $totales = array();
        foreach ($datospintar as $key => $value) {
            echo " <tr>
             <th align=left style = 'font-weight:normal'>" . '  ' . $value['organismo'] . "</th>
            <th align=left style = 'font-weight:normal'>" . '  ' . $value['estructura'] . "</th>
            <th align=left style = 'font-weight:normal'>" . '  ' . $value['inversion'] . "</th>
            <th align=left style = 'font-weight:normal'>" . '  ' . $value['indicador'] . "</th> 
            <th align=left style = 'font-weight:normal'>" . '  ' . $value['organosatisface'] . "</th> 
            <th align=left style = 'font-weight:normal'>" . '  ' . $value['formapropiedad'] . "</th> 
            <th align=left style = 'font-weight:normal'>" . '  ' . $value['adquirir'] . "</th> 
            <th align=left style = 'font-weight:normal'>" . '  ' . $value['comprar'] . "</th> 
            <th align=left style = 'font-weight:normal'>" . '  ' . $value['pais'] . "</th>

            <th align=left style = 'font-weight:normal'>" . number_format($value['planrep'], '0', '.', '') . "</th>
            <th align=left style = 'font-weight:normal'>" . number_format($value['planinc'], '0', '.', '') . "</th> 
            <th align=left style = 'font-weight:normal'>" . number_format($value['total'], '0', '.', '') . "</th> 
            <th align=left style = 'font-weight:normal'>" . number_format($value['valortotal'], '0', '.', ',') . "</th> 
                
             

            </tr>";
            $totales['planrep']+=$value['planrep'];
            $totales['planinc']+=$value['planinc'];
            $totales['total']+=$value['total'];
            $totales['valortotal']+=$value['valortotal'];
        }


        echo "<tr>                     
             <th align=left style = 'background-color: #CBCBCB'>Total de Equipos Automotores:</th>
              <th></th>
               <th></th>
                <th></th>
                 <th></th>
               <th></th>
                <th></th>
                 <th></th>
                  <th align=left style = 'font-weight:normal'>" . number_format($totales['planrep'], '0', '.', '') . "</th> 
            <th align=left style = 'font-weight:normal'>" . number_format($totales['planinc'], '0', '.', '') . "</th> 
            <th align=left style = 'font-weight:normal'>" . number_format($totales['total'], '0', '.', '') . "</th> 
            <th align=left style = 'font-weight:normal'>" . number_format($totales['valortotal'], '0', '.', '') . "</th> 
         </tr>
            


</table>";
    }

    public function exportarConstructoresAExcel($parametros) {

        $total = array();
        $totalorgent = array();
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=CyMporConstructores.xls");
        header("Content-Transfer-Encoding: binary ");
// echo '<caption> ' . $array_etiq['lbNivelActividad'] . 'Entidad: ' . $params['text'] . ' </caption>';

        if ($parametros['chequeado'] == 1) {
            echo "
        <table border=1 cellspacing=0 width=60%>
        <tr>
            <th></th>
             <th></th>
             <th></th>
             <th align=center >PLAN</th>

         </tr>";
            echo"

          <tr>
            <th align=center>Organismo inversionista/Constructor/Inversi&oacute;n</th>
             <th align=center>Provincia</th>
             <th align=center >MP</th>
             <th align=center >MUSD</th>

         </tr>

         ";
        } else {
            echo "
        <table border=1 cellspacing=0 width=60%>
        <tr>
            <th></th>
             <th></th>
             <th align=center >PLAN</th>

         </tr>";
            echo"

          <tr>
            <th align=center>Organismo inversionista/Constructor/Inversi&oacute;n</th>
             <th align=center >MP</th>
             <th align=center >MUSD</th>

         </tr>

         ";
        }


        $aux = explode(',', $parametros['organismoden']);
        $aux1 = explode(',', $parametros['idorganismo']);

        foreach ($aux1 as $key => $valor) {
            $idestructurasaux[$key]['identidad'] = $valor;
            $idestructurasaux[$key]['entidad'] = $aux[$key];
        }
        //   print_r($parametros['chequeado']);die;
        foreach ($idestructurasaux as $key => $valOrg) {
            // $totalorgent = array();
            global $totalorgent, $total;
            self::pintarConst($valOrg, $parametros);
            $hijasorg = self::cargarEntidades($valOrg['identidad']);
            foreach ($hijasorg as $k => $val) {
                self::pintarConst($val, $parametros);
            }

            if ($parametros['chequeado'] == 1) {
                echo " <tr>
            <th align=left style = 'background-color: #CBCBCB'>" . 'Total del organismo ' . $valOrg['entidad'] . "</th>
             <th align=right style = 'background-color: #CBCBCB'></th>
             <th align=right style = 'background-color: #CBCBCB'>" . number_format($totalorgent['cup'], '0', '.', ',') . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . number_format($totalorgent['usd'], '0', '.', ',') . "</th>
            </tr>";
            } else {
                echo " <tr>
            <th align=left style = 'background-color: #CBCBCB'>" . 'Total del organismo ' . $valOrg['entidad'] . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . number_format($totalorgent['cup'], '0', '.', ',') . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . number_format($totalorgent['usd'], '0', '.', ',') . "</th>
            </tr>";
            }
        }
        if ($parametros['chequeado'] == 1) {
            echo " <tr>
            <th align=left style = 'background-color: #CBCBCB'>TOTAL</th>
             <th align=right style = 'background-color: #CBCBCB'></th>
             <th align=right style = 'background-color: #CBCBCB'>" . number_format($total['cup'], '0', '.', ',') . "</th>
             <th align=right style = 'background-color: #CBCBCB'> " . number_format($total['usd'], '0', '.', ',') . "</th>
            </tr>";
        } else {
            echo " <tr>
             <th align=left style = 'background-color: #CBCBCB'>TOTAL</th>
             <th align=right style = 'background-color: #CBCBCB'>" . number_format($total['cup'], '0', '.', ',') . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . number_format($total['usd'], '0', '.', ',') . "</th>
            </tr>";
        }
        echo "</table>";
    }

    public function pintarConst($valOrg, $parametros) {
        global $totalorgent, $total;
        //  $total = array();
        // $totalorgent = array();
        //  print_r($parametros);die;
        $obj = new DatInversion();
        $datos = $obj->listarConstructorDenominacionC($parametros, $parametros['entidades'], $valOrg['identidad']); //ojooo es akii
        //  print_r($datos);die;
        if (count($datos) > 0) {
            //  print_r($datos);die;
            $totUSDent = 0;
            $totMPent = 0;
            $longitud = count($datos);
            for ($k = 0; $k <= $longitud; $k++) {
                $totUSDent+=$datos[$k]['usd'];
                $totMPent+=$datos[$k]['cup'];
            }
            $total['usd']+=$totUSDent;
            $total['cup']+=$totMPent;

            if ($parametros['chequeado'] == 1) {
                echo " <tr>
            <th align=left style = 'background-color: #CCFFCC'>" . 'Entidad - ' . $valOrg['entidad'] . "</th>
             <th align=right style = 'background-color: #CCFFCC'></th>
             <th align=right style = 'background-color: #CCFFCC'>" . number_format($totMPent, '0', '.', ' ') . "</th>
             <th align=right style = 'background-color: #CCFFCC'>" . number_format($totUSDent, '0', '.', ' ') . "</th>
            </tr>";
            } else {

                echo " <tr>
            <th align=left style = 'background-color: #CCFFCC'>" . 'Entidad - ' . $valOrg['entidad'] . "</th>
             <th align=right style = 'background-color: #CCFFCC'>" . number_format($totMPent, '0', '.', ' ') . "</th>
             <th align=right style = 'background-color: #CCFFCC'>" . number_format($totUSDent, '0', '.', ' ') . "</th>
            </tr>";
            }

            $totalorgent['usd']+=$totUSDent;
            $totalorgent['cup']+=$totMPent;

            $totUSDinv = 0;
            $totMPinv = 0;
            $totalesInv = array();
            $denomcont = $datos[0]['dencont'];
            $ident = $datos[0]['idestructuracomun'];
            for ($ke = 0; $ke <= $longitud; $ke++) {
                if ($ident == $datos[$ke]['idestructuracomun']) {
                    if ($denomcont == $datos[$ke]['dencont']) {
                        $totUSDinv+=$datos[$ke]['usd'];
                        $totMPinv+=$datos[$ke]['cup'];
                    } else {
                        $totalesInv[$datos[$ke - 1]['idconstructor']] ['usd'] = $totUSDinv;
                        $totalesInv[$datos[$ke - 1]['idconstructor']] ['cup'] = $totMPinv;
                        $denomcont = $datos[$ke]['dencont'];
                        $totUSDinv = 0;
                        $totMPinv = 0;
                        $totUSDinv+=$datos[$ke]['usd'];
                        $totMPinv+=$datos[$ke]['cup'];
                    }
                } else {
                    $totalesInv[$datos[$ke - 1]['idconstructor']] ['usd'] = $totUSDinv;
                    $totalesInv[$datos[$ke - 1]['idconstructor']] ['cup'] = $totMPinv;
                    $ident = $datos[$ke]['idestructuracomun'];
                    $denomcont = $datos[$ke]['dencont'];
                    $totUSDinv = 0;
                    $totMPinv = 0;
                }
            }

            $denomcont = "";
            foreach ($datos as $key => $value) {


                if ($parametros['chequeado'] == 1) {
                    if ($denomcont != $value['dencont']) {

                        echo " <tr>
            <th align=left >" . '  ' . $value['dencont'] . "</th>
             <th align=right ></th>
             <th align=right >" . number_format($totalesInv[$value['idconstructor']] ['cup'], '0', '.', ' ') . "</th>
             <th align=right >" . number_format($totalesInv[$value['idconstructor']] ['usd'], '0', '.', ' ') . "</th>
            </tr>";
                        echo " <tr>
            <th align=left style = 'font-weight:normal'>" . '  ' . $value['denominacion'] . "</th>
             <th align=right style = 'font-weight:normal'>" . $value['prov'] . "</th>
             <th align=right style = 'font-weight:normal'>" . number_format($value['cup'], '0', '.', ' ') . "</th>
             <th align=right style = 'font-weight:normal'>" . number_format($value['usd'], '0', '.', ' ') . "</th>
            </tr>";
                        $denomcont = $value['dencont'];
                    } else {
                        echo " <tr>
            <th align=left style = 'font-weight:normal'>" . '  ' . $value['denominacion'] . "</th>
             <th align=right style = 'font-weight:normal'>" . $value['prov'] . "</th>
             <th align=right style = 'font-weight:normal'>" . number_format($value['cup'], '0', '.', ' ') . "</th>
             <th align=right style = 'font-weight:normal'>" . number_format($value['usd'], '0', '.', ' ') . "</th>
            </tr>";
                    }
                } else {
                    if ($denomcont != $value['dencont']) {

                        echo " <tr>
            <th align=left style = 'font-weight:normal'>" . '  ' . $value['dencont'] . "</th>

             <th align=right style = 'font-weight:normal'>" . number_format($totalesInv[$value['idconstructor']] ['cup'], '0', '.', ' ') . "</th>
             <th align=right style = 'font-weight:normal'>" . number_format($totalesInv[$value['idconstructor']] ['usd'], '0', '.', ' ') . "</th>
            </tr>";
                        $denomcont = $value['dencont'];
                    }
                }
            }
        }
    }

    private function pintarDatos($valOrg, $params) {
        global $totalesorg;
        $idplanes = DatEtapaEquipo::listarPlanesReporte($valOrg['identidad']);
        if ($idplanes[0]['idmodelo'] != null) {
            $datospintar = DatEtapaEquipo::listarDatosEquipos($params, $valOrg['identidad'], $idplanes);

            if ($datospintar[0]['idorganosatisface'] != null) {

                $totalesentidad = array();

                $totalorganismos = array();

                foreach ($datospintar as $datos) {
                    $totalesentidad['planrep']+=$datos['planrep'];
                    $totalesentidad['planinc']+=$datos['planinc'];
                    $totalesentidad['total']+=$datos['total'];
                    $totalesentidad['donacion']+=$datos['donacion'];
                    $totalesentidad['valor']+=$datos['total'] * $datos['precio'];

                    $totalorganismos[$datos['idorganosatisface']]['planrep']+=$datos['planrep'];
                    $totalorganismos[$datos['idorganosatisface']]['planinc']+=$datos['planinc'];
                    $totalorganismos[$datos['idorganosatisface']]['total']+=$datos['total'];
                    $totalorganismos[$datos['idorganosatisface']]['donacion']+=$datos['donacion'];
                    $totalorganismos[$datos['idorganosatisface']]['valor']+=$datos['total'] * $datos['precio'];
                }
                if ($totalesentidad['planinc'] > 0 || $totalesentidad['planrep'] > 0 || $totalesentidad['total'] > 0 || $totalesentidad['donacion'] > 0 || $totalesentidad['valor'] > 0) {
                    echo " 
             <th align=left style = 'background-color: #90EE90' >" . 'Entidad - ' . $valOrg['entidad'] . "</th>             
             <th align=right style = 'background-color: #90EE90'>" . $totalesentidad['planrep'] . "</th>
             <th align=right style = 'background-color: #90EE90'>" . $totalesentidad['planinc'] . "</th>
             <th align=right style = 'background-color: #90EE90'>" . $totalesentidad['total'] . "</th>
             <th align=right style = 'background-color: #90EE90'>" . $totalesentidad['donacion'] . "</th>
             <th align=right style = 'background-color: #90EE90'>" . $totalesentidad['valor'] . "</th>
         </tr>";
                }

                $totalesorg['planrep']+=$totalesentidad['planrep'];
                $totalesorg['planinc']+=$totalesentidad['planinc'];
                $totalesorg['total']+=$totalesentidad['total'];
                $totalesorg['donacion']+=$totalesentidad['donacion'];
                $totalesorg['valor']+=$totalesentidad['valor'];

                $orgsat = 0;
                $idpadre = 0;
                $totalesesp = array();
                $totalesesp['planinc'] = 0;
                $totalesesp['planrep'] = 0;
                $totalesesp['total'] = 0;
                $totalesesp['donacion'] = 0;
                $totalesesp['valor'] = 0;
                $longitud = count($datospintar);

                for ($ke = 0; $ke < $longitud; $ke++) {
                    if ($orgsat != $datospintar[$ke]['idorganosatisface']) {
                        if ($totalorganismos[$datospintar[$ke]['idorganosatisface']]['total'] > 0) {
                            echo " <tr>
            <th align=left>" . $datospintar[$ke]['organosat'] . "</th>             
             <th align=right >" . $totalorganismos[$datospintar[$ke]['idorganosatisface']]['planrep'] . "</th>
             <th align=right >" . $totalorganismos[$datospintar[$ke]['idorganosatisface']]['planinc'] . "</th>
             <th align=right >" . $totalorganismos[$datospintar[$ke]['idorganosatisface']]['total'] . "</th>
             <th align=right >" . $totalorganismos[$datospintar[$ke]['idorganosatisface']]['donacion'] . "</th>
             <th align=right >" . $totalorganismos[$datospintar[$ke]['idorganosatisface']]['valor'] . "</th>
         </tr>";
                        }
                        $orgsat = $datospintar[$ke]['idorganosatisface'];
                        $idpadre = $datospintar[$ke]['idpadre'];
                        if ($ke == $longitud - 1) {
                            if ($datospintar[$ke]['total'] > 0) {
                                $denomindespec = DatEtapaEquipo::listarDemonIndEsp($datospintar[$ke]['idpadre']);
                                echo " <tr>
            <th align=left style = 'font-weight:normal'>" . $denomindespec[0]['denominacion'] . "</th>             
              <th align=right style = 'font-weight:normal'>" . number_format($datospintar[$ke]['planrep'], '0', '.', ' ') . "</th>
             <th align=right style = 'font-weight:normal'>" . number_format($datospintar[$ke]['planinc'], '0', '.', ' ') . "</th>
             <th align=right style = 'font-weight:normal'>" . number_format($datospintar[$ke]['total'], '0', '.', ' ') . "</th>
             <th align=right style = 'font-weight:normal'>" . number_format($datospintar[$ke]['donacion'], '0', '.', ' ') . "</th>
             <th align=right style = 'font-weight:normal'>" . number_format($datospintar[$ke]['precio'] * $datospintar[$ke]['total'], '0', '.', ' ') . "</th>
                                </tr>";
                            }
                        }
                    } else {

                        if ($idpadre == $datospintar[$ke]['idpadre']) {

                            if ($datospintar[$ke]['total'] + $datospintar[$ke - 1]['total'] > 0) {
                                // print_r('idpadre');die;
                                $denomindespec = DatEtapaEquipo::listarDemonIndEsp($datospintar[$ke]['idpadre']);
                                $var1 = $datospintar[$ke]['planrep'] + $datospintar[$ke - 1]['planrep'];
                                $var2 = $datospintar[$ke]['planinc'] + $datospintar[$ke - 1]['planinc'];
                                $var3 = $datospintar[$ke]['total'] + $datospintar[$ke - 1]['total'];
                                $var4 = $datospintar[$ke]['donacion'] + $datospintar[$ke - 1]['donacion'];
                                $var5 = ($datospintar[$ke]['precio'] * $datospintar[$ke]['total']) + ($datospintar[$ke - 1]['precio'] * $datospintar[$ke - 1]['total']);
                                echo " <tr>
            <th align=left style = 'font-weight:normal'>" . $denomindespec[0]['denominacion'] . "</th>             
              <th align=right style = 'font-weight:normal'>" . $var1 . "</th>
             <th align=right style = 'font-weight:normal'>" . $var2 . "</th>
             <th align=right style = 'font-weight:normal'>" . $var3 . "</th>
             <th align=right style = 'font-weight:normal'>" . $var4 . "</th>
             <th align=right style = 'font-weight:normal'>" . $var5 . "</th>
                                </tr>";
                            }
                        } else {
                            if ($datospintar[$ke]['total'] > 0) {
                                $denomindespec = DatEtapaEquipo::listarDemonIndEsp($datospintar[$ke]['idpadre']);
                                echo " <tr>
            <th align=left style = 'font-weight:normal'>" . $denomindespec[0]['denominacion'] . "</th>             
              <th align=right style = 'font-weight:normal'>" . $datospintar[$ke]['planrep'] . "</th>
             <th align=right style = 'font-weight:normal'>" . $datospintar[$ke]['planinc'] . "</th>
             <th align=right style = 'font-weight:normal'>" . $datospintar[$ke]['total'] . "</th>
             <th align=right style = 'font-weight:normal'>" . $datospintar[$ke]['donacion'] . "</th>
             <th align=right style = 'font-weight:normal'>" . $datospintar[$ke]['precio'] * $datospintar[$ke]['total'] . "</th>
                                </tr>";
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
            } else {
                $entidades_hijas = array_merge($entidades_hijas, self::entidadesHijas($entidad_hija->id, $entidad_hija->text));
            }
        }
        return $entidades_hijas;
    }

    public function exportarConstMontajeExcelModel($parametros, $idejercicio, $forma) {

        $ejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=construccion y montaje.xls");
        header("Content-Transfer-Encoding: binary ");

        echo " <table border=0 >
            <th align=left >Ministerio de Econom&iacute;a y Planificaci&oacute;n </th>
            <tr>
            <th align=left >Direcci&oacute;n de Inversiones </th>
            <th align=right >         </th>
            <th align=right >         </th>
            <th align=right >         </th>
            <th align=left >PLAN: " . $ejercicioactual['ejercicio'] . " </th>
            </tr>
            </table >
            <table border=1 cellspacing=0 width=80%>
            <tr>
            <th align=left colspan= 6 >CONSTRUCCION Y MONTAJE </th>
            <th align=center colspan=2 >PLAN: " . $ejercicioactual['ejercicio'] . " </th>
            </tr>
            <th align=center  style = 'background-color: #CBCBCB'>INVERSI&Oacute;N </th>
            <th align=center  style = 'background-color: #CBCBCB'>ORG. INVERS.</th>
            <th align=center  style = 'background-color: #CBCBCB'>ENTIDAD</th>
            <th align=center  style = 'background-color: #CBCBCB'>PROV. INVERS.</th>
               <th align=center  style = 'background-color: #CBCBCB'>FORMA DE PROPIEDAD</th>
            <th align=center  style = 'background-color: #CBCBCB'>CONSTRUCTOR</th>
            <th align=center  style = 'background-color: #CBCBCB'>PROVINCIA DEL CONSTRUCTOR</th>
          
            <th align=center  style = 'background-color: #CBCBCB'>Construc. Y Montaje <br> Moneda Total</th>
            <th align=center  style = 'background-color: #CBCBCB'>Construc. Y Montaje <br> Moneda Convertible</th>
            <th align=center  style = 'background-color: #CBCBCB'>Grupo de Obra</th>
            </tr>";

        $sumatoriamp = 0;
        $sumatoriausd = 0;
        foreach ($parametros as $value) {
            $denomorganismo = DatInversion::listarDenomOrganismo($value['idorganismo']);
            if ($value['entidades']) {
                $inversiones = DatInversion::listarInversionesConstrucMontaje($value['entidades'], $idejercicio, $forma);
                foreach ($inversiones as $value1) {
                    $datos = DatInversion::listarConstProv($idejercicio, $value1['idinversion']);
                    if (count($datos) != 0) {
                        foreach ($datos as $valorProv) {
                            echo " <tr>
              <th align=left >" . $value1['codigo'] . ' - '
                            . $value1['denominacion'] . "</th>
              <th align=left '>" . $denomorganismo[0]['denominacion'] . "</th>
              <th align=left '>" . $value1['denominacioneentidad'] . "</th>
              <th align=center '>" . $value1['provincia'] . "</th>
              <th align=center '>" . $value1['forma'] . "</th>
              <th align=center '>" . $valorProv['denomconstructor'] . "</th>
              <th align=center '>" . $valorProv['provconstructor'] . "</th>
              <th align=right '>" . number_format($valorProv['valormp'], '0', '.', ' ') . "</th>
              <th align=right '>" . number_format($valorProv['valorusd'], '0', '.', ' ') . "</th>
              <th align=left '>" . '' . "</th>
              </tr>";
                            $sumatoriamp += $valorProv['valormp'];
                            $sumatoriausd += $valorProv['valorusd'];
                        }
                    }
                }
            }
        }

        echo "<tr>                     
             <th align=left style = 'background-color: #CBCBCB'>Totales:</th>
             <th align=right style = 'background-color: #CBCBCB'>" . '' . "</th>
             <th align=right style = 'background-color: #CBCBCB '>" . '' . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . '' . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . '' . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . '' . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . '' . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . number_format($sumatoriamp, '0', '.', ' ') . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . number_format($sumatoriausd, '0', '.', ' ') . "</th>
             <th align=right style = 'background-color: #CBCBCB'>" . '' . "</th>
         </tr>
         </table>";
    }

    public function exportarPlanPreparacion($parametros) {

        //$ejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        $inversiones = ($parametros['vigente'] ==1)? 'Vigentes':'Ejercicio'.$parametros['ejercicio'];
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=Plan de Preparacion Inversiones.xls");
//        header("Content-Disposition: attachment;filename=Plan de Preparacion Inversiones $inversiones.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        
        echo " <table border=0 >
            <tr>
            <th align=left >" . $parametros['ejercicio'] . " </th>
            </tr>
            <tr>
            <th align=left >Plan de Preparaci&oacute;n </th>
            </tr>
            <tr>
            <th align=left > </th>
            </tr>
            <tr>
            <th align=left >Entidad " . $parametros['identidad'] . " </th>
            <th align=right >         </th>
            <th align=right >         </th>
            <th align=right >         </th>
            </tr>
            <tr>
            <th align=left >Inversiones: " . $inversiones . " </th>
            </table >

            <table border=1 cellspacing=0 width=80%>
            <tr>
            <th align=center  style = 'background-color: #CBCBCB'>CONCEPTO </th>
            <th align=center  style = 'background-color: #CBCBCB'>EJERC. ACTUAL </th>
            <th align=center  style = 'background-color: #CBCBCB'>INVERSION.</th>
                    <th align=center  style = 'background-color: #CBCBCB'>VERSION.</th>
            <th align=center  style = 'background-color: #CBCBCB'>COMPONENTE</th>
            <th align=center  style = 'background-color: #CBCBCB'>ACREEDOR.</th>
            <th align=center  style = 'background-color: #CBCBCB'>FINANCISTA</th>
            <th align=center  style = 'background-color: #CBCBCB'>EQUIPO</th>
            <th align=center  style = 'background-color: #CBCBCB'>PLAN</th>

            <th align=center  style = 'background-color: #CBCBCB'>CONSTRUCTOR <br> </th>
            <th align=center  style = 'background-color: #CBCBCB'>PROVINCIA </th>
            <th align=center  style = 'background-color: #CBCBCB'>OTROS IND.</th>
            <th align=center  style = 'background-color: #CBCBCB'>OTROS IND. CANT.</th>
            <th align=center  style = 'background-color: #CBCBCB'>OTROS IND. POSTERIORES</th>
            <th align=center  style = 'background-color: #CBCBCB'>NIVEL ACT.</th>
            <th align=center  style = 'background-color: #CBCBCB'>NIVEL ACT. CANT.</th>
            <th align=center  style = 'background-color: #CBCBCB'>NIVEL ACT. POSTERIORES </th>

            <th align=center  style = 'background-color: #CBCBCB'>MEDIO AMB. </th>
            <th align=center  style = 'background-color: #CBCBCB'>TIPO </th>
            <th align=center  style = 'background-color: #CBCBCB'>MEDIO AMB. PADRE </th>
            <th align=center  style = 'background-color: #CBCBCB'>TIPO PADRE </th>
            <th align=center  style = 'background-color: #CBCBCB'>MEDIO AMB. PRESUPUESTO </th>

            <th align=center  style = 'background-color: #CBCBCB'>MONEDA </th>

            <th align=center  style = 'background-color: #CBCBCB'>AANT. EJECUTADO </th>
            <th align=center  style = 'background-color: #CBCBCB'>AANT. ESTIMADO </th>
            <th align=center  style = 'background-color: #CBCBCB'>AANT. PLAN </th>
            <th align=center  style = 'background-color: #CBCBCB'>AANT. PROYECCION </th>

            <th align=center  style = 'background-color: #CBCBCB'>ANT. EJECUTADO </th>
            <th align=center  style = 'background-color: #CBCBCB'>ANT. ESTIMADO </th>
            <th align=center  style = 'background-color: #CBCBCB'>ANT. PLAN </th>
            <th align=center  style = 'background-color: #CBCBCB'>ANT. PROYECCION </th>

            <th align=center  style = 'background-color: #CBCBCB'>ACT. EJECUTADO </th>
            <th align=center  style = 'background-color: #CBCBCB'>ACT. ESTIMADO </th>
            <th align=center  style = 'background-color: #CBCBCB'>ACT. PLAN </th>
            <th align=center  style = 'background-color: #CBCBCB'>ACT. PROYECCION </th>

            <th align=center  style = 'background-color: #CBCBCB'>POST. EJECUTADO </th>
            <th align=center  style = 'background-color: #CBCBCB'>POST. ESTIMADO </th>
            <th align=center  style = 'background-color: #CBCBCB'>POST. PLAN </th>
            <th align=center  style = 'background-color: #CBCBCB'>POST. PROYECCION </th>

            </tr>
           ";

        $selectIdMonedaEntidad = 1;
        //print_r($selectIdMonedaEntidad);die('ebtytuyg');
        $monedas = AnalisisInversiones::monedasPorEntidad($parametros['identidad'],$selectIdMonedaEntidad);


        $ejercicios = AnalisisInversiones::buscarEjercicioAnterior($parametros['ejercicio']);
        foreach ($ejercicios as $ejer) {
            $ejers[] = $ejer['idejercicio'];
        }
        $ejers[] = $parametros['idejercicio'];

        $parametros['monedas'] = $monedas;
        $parametros['ejercicios'] = $ejers;

        $parametros['concepto'] = 'Presupuesto';
        $parametros['tablas_desglose'] = array('ejecutado'=>'dat_inversetapaejecutado', 'plan'=>'dat_inversetapaplan', 'estimado'=>'dat_inversetapaestimado', 'proyectado'=>'dat_inversetapaproyectado');
        $presupuesto = self::listarPlanPrepPresupuestoExportar($parametros);

        $parametros['concepto'] = 'Contado';
        $parametros['tablas_desglose'] = array('ejecutado'=>'dat_inverscontadoejecutado', 'plan'=>'dat_inverscontadoplan', 'estimado'=>'dat_inverscontadoestimado', 'proyectado'=>'dat_inverscontadoproyectado');
        $presupuesto = self::listarPlanPrepContadoExportar($parametros);

        $parametros['concepto'] = 'Acreedor';
        $parametros['tablas_desglose'] = array('ejecutado'=>'dat_inversfinancejecutado', 'plan'=>'dat_inversfinancplan', 'estimado'=>'dat_inversfinancestimado', 'proyectado'=>'dat_inversfinancproyectado');
        $presupuesto = self::listarPlanPrepAcreedorExportar($parametros);

        $parametros['concepto'] = 'Financista';
        $parametros['tablas_desglose'] = array('ejecutado'=>'dat_inversfinancistaejecutado', 'plan'=>'dat_inversfinancistaplan', 'estimado'=>'dat_inversfinancistaestimado', 'proyectado'=>'dat_inversfinancistaproyectado');
        $presupuesto = self::listarPlanPrepFinancistaExportar($parametros);

        $parametros['concepto'] = 'Plan de Prep.';
        $parametros['tablas_desglose'] = array('ejecutado'=>'dat_presupejecutado', 'plan'=>'dat_presupplan', 'estimado'=>'dat_presupestimado', 'proyectado'=>'dat_presupproyectado');
        $presupuesto = self::listarPlanPrepPlanPrepracionExportar($parametros);

        $parametros['concepto'] = 'Equipo';
        $parametros['tablas_desglose'] = array('ejecutado'=>'dat_etapaequipoejecutado', 'plan'=>'dat_etapaequipoplan', 'estimado'=>'dat_etapaequipoestimado', 'proyectado'=>'dat_etapaequipoproyectado');
        $presupuesto = self::listarPlanPrepEquipoExportar($parametros);

        $parametros['concepto'] = 'Constructor';
        $parametros['tablas_desglose'] = array('ejecutado'=>'dat_etapinverconsprovejecutado', 'plan'=>'dat_etapinverconsprovplan', 'estimado'=>'dat_etapinverconsprovestimado', 'proyectado'=>'dat_etapinverconsprovproyeccion');
        $presupuesto = self::listarPlanPrepConstructorExportar($parametros);

        $parametros['concepto'] = 'Otros indicadores';
        //$parametros['tablas_desglose'] = array('ejecutado'=>'dat_otrosindicadares', 'plan'=>'dat_otrosindicadares', 'estimado'=>'dat_otrosindicadares', 'proyectado'=>'dat_otrosindicadares');
        $presupuesto = self::listarPlanPrepOtrosIndicadoresExportar($parametros);

        $parametros['concepto'] = 'Otros indicadores desglose';
        $parametros['tablas_desglose'] = array('ejecutado'=>'dat_otrosindicadares', 'plan'=>'dat_otrosindicadares', 'estimado'=>'dat_otrosindicadares', 'proyectado'=>'dat_otrosindicadares');
        $presupuesto = self::listarPlanPrepOtrosIndicadoresDesgloseExportar($parametros);

        $parametros['concepto'] = 'Nivel de actividad';
        $presupuesto = self::listarPlanPrepNivelActividadExportar($parametros);

        $parametros['concepto'] = 'Nivel de actividad desglose';
        $parametros['tablas_desglose'] = array('ejecutado'=>'dat_inverscapexplot', 'plan'=>'dat_inverscapexplot', 'estimado'=>'dat_inverscapexplot', 'proyectado'=>'dat_inverscapexplot');
        $presupuesto = self::listarPlanPrepNivelActividadDesgloseExportar($parametros);

        $parametros['concepto'] = 'Medio ambiente';
        $presupuesto = self::listarPlanPrepMedioAmbienteExportar($parametros);

        $parametros['concepto'] = 'Medio ambiente presupuesto';
        $presupuesto = self::listarPlanPrepMedioAmbientePresupuestoExportar($parametros);

        $parametros['concepto'] = 'Medio ambiente desglose';
        $parametros['tablas_desglose'] = array('ejecutado'=>'dat_medioambejecutado', 'plan'=>'dat_medioambplan', 'estimado'=>'dat_medioambestimado', 'proyectado'=>'dat_medioambproyectado');
        $presupuesto = self::listarPlanPrepMedioAmbienteDesgloseExportar($parametros);
//        //die;

        echo "</table>";




    }
    
    public function exportarIndSCP($parametros) {
        $datos= DatInversion::exportarIndSCP($parametros);
        
        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=Inv-Ind-SCP.xls');
        header('Content-Transfer-Encoding: binary ');
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo
        "<TABLE border=1 align=left cellpadding=1 cellspacing=0>
            <TR>
                <TD width=300 align=center><FONT face=Arial size=2 color=#000000><B>Entidad</B></FONT></TD>
                <TD width=300 align=center><FONT face=Arial size=2 color=#000000><B>Código</B></FONT></TD>
                <TD width=372 align=center><FONT face=Arial size=2 color=#000000><B>Denominación</B></FONT></TD>
                <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>UM</B></FONT></TD>
                <TD width=100 align=center><FONT face=Arial size=2 color=#000000><B>PLAN</B></FONT></TD>
            </TR>"; 
            $cont=1;
            foreach ($datos as $value){ 
                $i= strval($value['indicador']);
                echo "
            <TR>              
                <TD width=300 align=left>{$parametros['entidad']}</TD>
                <TD width=300 align=left style=\"mso-number-format:'@';\" >" . $value['codigo']."</TD>
                <TD width=372 align=left>{$i}</TD>
                <TD width=55 align=center>{$value['unidadmedida']}</TD>
                <TD width=100 align=rigth style=\"mso-number-format:'#,##0.00';\">".$value['plan']."";
                echo "</TD>";
                $cont++;
        }
        echo
        "</TR>
    
        </TABLE>"
        ;
    
    }

    private function listarPlanPrepPresupuestoExportar ($parametros) {

        $componentes = DatInversion::listarPlanPrepComponentesPresupuestoExportar($parametros);
        foreach ($componentes as $componente) {
            foreach ($parametros['monedas'] as $moneda) {
                $parametros['idetapainversion'] = $componente['idetapainversion'];
                $parametros['idmoneda'] = $moneda['idmoneda'];
                echo " <tr>
                       <th align=left >" . 'Presupuesto' . "</th>
                       <th align=left '>" . $parametros['ejercicio'] . "</th>
                       <th align=left '>" . $componente['codigo'] . "</th>
                       <th align=left '>" . $componente['version'] . "</th>
                       <th align=left '>" . $componente['denominacion'] . "</th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '>" . $moneda['codigoiso'] . "</th>";

                $desglose = DatInversion::listarPlanPrepDesgloseExportar($parametros);
                foreach ($desglose as $desglose) {
                    echo "<th align=left '>" . $desglose['valor'] . "</th>";
                }
                echo" </tr>";
            }
        }

    }

    private function listarPlanPrepContadoExportar($parametros) {

        $inversionesContado = DatInversion::listarPlanPrepInversionesContadoExportar($parametros);
        foreach ($inversionesContado as $inversion) {
            foreach ($parametros['monedas'] as $moneda) {
                $parametros['idinversion'] = $inversion['idinversion'];
                $parametros['idmonedaentidad'] = $moneda['idmonedaentidad'];
                echo " <tr>
                       <th align=left >" . 'Contado' . "</th>
                       <th align=left '>" . $parametros['ejercicio'] . "</th>
                       <th align=left '>" . $inversion['codigo'] . "</th>
                       <th align=left '>" . $inversion['version'] . "</th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '>" . $moneda['codigoiso'] . "</th>";

                       $desglose = DatInversion::listarPlanPrepDesgloseExportar($parametros);
                       foreach ($desglose as $desglose) {
                           echo "<th align=left '>" . $desglose['valor'] . "</th>";
                       }
                echo" </tr>";
            }
        }

    }

    private function listarPlanPrepAcreedorExportar ($parametros) {

        $acreedores = DatInversion::listarPlanPrepInversionesAcreedorExportar($parametros);
        foreach ($acreedores as $acreedor) {
            foreach ($parametros['monedas'] as $moneda) {
                $parametros['idtipofinanciamiento'] = $acreedor['idtipofinanciamiento'];
                $parametros['idmonedaentidad'] = $moneda['idmonedaentidad'];
                $parametros['idinversion'] = $acreedor['idinversion'];
                echo " <tr>
                       <th align=left >" . 'Acreedor' . "</th>
                       <th align=left '>" . $parametros['ejercicio'] . "</th>
                       <th align=left '>" . $acreedor['codigo'] . "</th>
                       <th align=left '>" . $acreedor['version'] . "</th>
                       <th align=left '> </th>

                       <th align=left '>" . $acreedor['denominacion'] . "</th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '>" . $moneda['codigoiso'] . "</th>";

                $desglose = DatInversion::listarPlanPrepDesgloseExportar($parametros);
                foreach ($desglose as $desglose) {
                    echo "<th align=left '>" . $desglose['valor'] . "</th>";
                }
                echo" </tr>";
            }
        }

    }

    private function listarPlanPrepFinancistaExportar ($parametros) {

        $financistas = DatInversion::listarPlanPrepInversionesFinancistaExportar($parametros);
        foreach ($financistas as $financista) {
            foreach ($parametros['monedas'] as $moneda) {
                $parametros['idfinancista'] = $financista['idfinancista'];
                $parametros['idmonedaentidad'] = $moneda['idmonedaentidad'];
                $parametros['idinversion'] = $financista['idinversion'];
                echo " <tr>
                       <th align=left >" . 'Financista' . "</th>
                       <th align=left '>" . $parametros['ejercicio'] . "</th>
                       <th align=left '>" . $financista['codigo'] . "</th>
                       <th align=left '>" . $financista['version'] . "</th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '>" . $financista['denominacion'] . "</th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '>" . $moneda['codigoiso'] . "</th>";

                $desglose = DatInversion::listarPlanPrepDesgloseExportar($parametros);
                foreach ($desglose as $desglose) {
                    echo "<th align=left '>" . $desglose['valor'] . "</th>";
                }
                echo" </tr>";
            }
        }

    }

    private function listarPlanPrepPlanPrepracionExportar ($parametros) {

        $planesPrep = DatInversion::listarPlanPrepInversionesPlanPreparacionExportar($parametros);
        foreach ($parametros['monedas'] as $moneda) {
            foreach ($planesPrep as $plan) {
                if($moneda['idmonedaentidad'] == $plan['idmonedaentidad']){
                    $parametros['idpresanteproy'] = $plan['idpresanteproy'];
                    $parametros['idmonedaentidad'] = $plan['idmonedaentidad'];

                    echo " <tr>
                       <th align=left >" . 'Plan de Prep.' . "</th>
                       <th align=left '>" . $parametros['ejercicio'] . "</th>
                       <th align=left '>" . $plan['codigo'] . "</th>
                       <th align=left '>" . $plan['version'] . "</th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '>" . $moneda['codigoiso'] . "</th>";

                    $desglose = DatInversion::listarPlanPrepDesgloseExportar($parametros);
                    foreach ($desglose as $desglose) {
                        echo "<th align=left '>" . $desglose['valor'] . "</th>";
                    }
                    echo" </tr>";
                }

            }
        }

    }


    private function listarPlanPrepEquipoExportar ($parametros) {

        $equipos = DatInversion::listarPlanPrepInversionesEquiposExportar($parametros);

            foreach ($equipos as $equipo) {
                //if($moneda['idmonedaentidad'] == $plan['idmonedaentidad']){
                    $parametros['idetapaequipoglobal'] = $equipo['idetapaequipoglobal'];

                    echo " <tr>
                       <th align=left >" . 'Equipo' . "</th>
                       <th align=left '>" . $parametros['ejercicio'] . "</th>
                       <th align=left '>" . $equipo['codigo'] . "</th>
                       <th align=left '>" . $equipo['version'] . "</th>
                       <th align=left '>" . $equipo['etapa'] . "</th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '>" . $equipo['indcodigo'] . "</th>
                       <th align=left '>" . $equipo['plan'] . "</th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>";

                    $desglose = DatInversion::listarPlanPrepDesgloseExportar($parametros);
                    foreach ($desglose as $desglose) {
                        echo "<th align=left '>" . $desglose['valor'] . "</th>";
                    }
                    echo" </tr>";
                //}

            }


    }


    private function listarPlanPrepConstructorExportar ($parametros) {

        $constructores = DatInversion::listarPlanPrepConstructoresExportar($parametros);
        foreach ($constructores as $constructor) {
            foreach ($parametros['monedas'] as $moneda) {
                $parametros['idetapinverconsprov'] = $constructor['idetapinverconsprov'];
                $parametros['idmoneda'] = $moneda['idmoneda'];
                echo " <tr>
                       <th align=left >" . 'Constructor' . "</th>
                       <th align=left '>" . $parametros['ejercicio'] . "</th>
                       <th align=left '>" . $constructor['codigo'] . "</th>
                       <th align=left '>" . $constructor['version'] . "</th>
                       <th align=left '>" . $constructor['etapa'] . "</th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '>" . $constructor['denominacion'] . "</th>
                       <th align=left '> " . $constructor['provincia'] . "</th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '>" . $moneda['codigoiso'] . "</th>";

                $desglose = DatInversion::listarPlanPrepDesgloseExportar($parametros);
                foreach ($desglose as $desglose) {
                    echo "<th align=left '>" . $desglose['valor'] . "</th>";
                }
                echo" </tr>";
            }
        }

    }

    private function listarPlanPrepOtrosIndicadoresExportar ($parametros) {

        $otrosIndicadores = DatInversion::listarPlanPrepOtrosIndicadoresExportar($parametros);
        //pre_r($otrosIndicadores);die;
        foreach ($otrosIndicadores as $otroInd) {

                $parametros['idinversion'] = $otroInd['idinversion'];
                $parametros['idnomotrosindicadores'] = $otroInd['idnomotrosindicadores'];

                echo " <tr>
                       <th align=left >" . 'Otros indicadores' . "</th>
                       <th align=left '>" . $parametros['ejercicio'] . "</th>
                       <th align=left '>" . $otroInd['codigo'] . "</th>
                       <th align=left '>" . $otroInd['version'] . "</th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> " . $otroInd['denominacion'] . "</th>
                       <th align=left '> " . $otroInd['cantidad'] . "</th>
                       <th align=left '> " . $otroInd['valor'] . "</th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>";

                echo" </tr>";

        }

    }


    private function listarPlanPrepOtrosIndicadoresDesgloseExportar ($parametros) {

        $otrosIndicadoresDesg = DatInversion::listarPlanPrepOtrosIndicadoresDesgloseExportar($parametros);
        //pre_r($otrosIndicadoresDesg);die;
        foreach ($otrosIndicadoresDesg as $otroInd) {

            $parametros['idinversion'] = $otroInd['idinversion'];
            $parametros['idnomotrosindicadores'] = $otroInd['idnomotrosindicadores'];

            echo " <tr>
                       <th align=left >" . 'Otros indicadores desglose' . "</th>
                       <th align=left '>" . $parametros['ejercicio'] . "</th>
                       <th align=left '>" . $otroInd['codigo'] . "</th>
                       <th align=left '>" . $otroInd['version'] . "</th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> " . $otroInd['denominacion'] . "</th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>

                       ";
            $desglose = DatInversion::listarPlanPrepDesgloseExportar($parametros);
            foreach ($desglose as $desglose) {
                echo "<th align=left '>" . $desglose['valor'] . "</th>";
            }

            echo" </tr>";

        }

    }


    private function listarPlanPrepNivelActividadExportar ($parametros) {

        $nivelesActividad = DatInversion::listarPlanPrepNivelesActividadExportar($parametros);
        //pre_r($otrosIndicadores);die;
        foreach ($nivelesActividad as $nivelAct) {

            $parametros['idinversion'] = $nivelAct['idinversion'];
            $parametros['idnomotrosindicadores'] = $nivelAct['idnomotrosindicadores'];

            echo " <tr>
                       <th align=left >" . 'Nivel de actividad' . "</th>
                       <th align=left '>" . $parametros['ejercicio'] . "</th>
                       <th align=left '>" . $nivelAct['codigo'] . "</th>
                       <th align=left '>" . $nivelAct['version'] . "</th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '>" . $nivelAct['denominacion'] . "</th>
                       <th align=left '>" . $nivelAct['cantidad'] . "</th>

                       <th align=left '>" . $nivelAct['valor'] . " </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>";

            echo" </tr>";

        }

    }

    private function listarPlanPrepNivelActividadDesgloseExportar ($parametros) {

        $nivelActDesg = DatInversion::listarPlanPrepNivelesActividadDesgloseExportar($parametros);
        //pre_r($otrosIndicadoresDesg);die;
        foreach ($nivelActDesg as $nivAct) {

            $parametros['idinversion'] = $nivAct['idinversion'];
            $parametros['iddatcapexplotacion'] = $nivAct['iddatcapexplotacion'];

            echo " <tr>
                       <th align=left >" . 'Nivel de actividad desglose' . "</th>
                       <th align=left '>" . $parametros['ejercicio'] . "</th>
                       <th align=left '>" . $nivAct['codigo'] . "</th>
                       <th align=left '>" . $nivAct['version'] . "</th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '>" . $nivAct['denominacion'] . "</th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>

                       ";
            $desglose = DatInversion::listarPlanPrepDesgloseExportar($parametros);
            foreach ($desglose as $desglose) {
                echo "<th align=left '>" . $desglose['valor'] . "</th>";
            }

            echo" </tr>";

        }

    }

    private function listarPlanPrepMedioAmbienteExportar ($parametros) {

        $medioAmbiente = DatInversion::listarPlanPrepMedioAmbienteExportar($parametros);
        foreach ($medioAmbiente as $medioAmb) {
            //foreach ($parametros['monedas'] as $moneda) {
                //$parametros['idmedioambglobal'] = $componente['idmedioambglobal'];
                //$parametros['idmoneda'] = $moneda['idmoneda'];
                echo " <tr>
                       <th align=left >" . 'Medio ambiente' . "</th>
                       <th align=left '>" . $parametros['ejercicio'] . "</th>
                       <th align=left '>" . $medioAmb['codigo'] . "</th>
                       <th align=left '>" . $medioAmb['version'] . "</th>
                       <th align=left '></th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '>" . $medioAmb['denommedioambiente'] . "</th>
                       <th align=left '>" . $medioAmb['tipohijo'] . "</th>
                       <th align=left '>" . $medioAmb['denommedioambientepadre'] . "</th>
                       <th align=left '>" . $medioAmb['tipopadre'] . "</th>
                       <th align=left '> </th>

                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>";

                /*$desglose = DatInversion::listarPlanPrepDesgloseExportar($parametros);
                foreach ($desglose as $desglose) {
                    echo "<th align=left '>" . $desglose['valor'] . "</th>";
                }*/
                echo" </tr>";
            //}
        }

    }


    private function listarPlanPrepMedioAmbientePresupuestoExportar ($parametros) {

        $medioAmbiente = DatInversion::listarPlanPrepMedioAmbientePresupuestoExportar($parametros);
        foreach ($parametros['monedas'] as $moneda){
            foreach ($medioAmbiente as $medioAmb){
                if($moneda['idmonedaentidad'] == $medioAmb['idmonedaentidad']){
                    //$parametros['idmedioambglobal'] = $componente['idmedioambglobal'];
                    //$parametros['idmoneda'] = $moneda['idmoneda'];
                    echo " <tr>
                       <th align=left >" . 'Medio ambiente presupuesto' . "</th>
                       <th align=left '>" . $parametros['ejercicio'] . "</th>
                       <th align=left '>" . $medioAmb['codigo'] . "</th>
                       <th align=left '>" . $medioAmb['version'] . "</th>
                       <th align=left '></th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '>" . $medioAmb['denommedioambiente'] . "</th>
                       <th align=left '>" . $medioAmb['tipohijo'] . "</th>
                       <th align=left '>" . $medioAmb['denommedioambientepadre'] . "</th>
                       <th align=left '>" . $medioAmb['tipopadre'] . "</th>
                       <th align=left '>" . $medioAmb['valor'] . "</th>

                       <th align=left '>" . $moneda['codigoiso'] . "</th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>";

                    /*$desglose = DatInversion::listarPlanPrepDesgloseExportar($parametros);
                    foreach ($desglose as $desglose) {
                        echo "<th align=left '>" . $desglose['valor'] . "</th>";
                    }*/
                    echo" </tr>";
                }

            }
        }

    }


    private function listarPlanPrepMedioAmbienteDesgloseExportar ($parametros) {

        $medioAmbDesg = DatInversion::listarPlanPrepMedioAmbienteDesgloseExportar($parametros);
        foreach ($medioAmbDesg as $medioAmb) {
            foreach ($parametros['monedas'] as $moneda) {
                $parametros['idmedioambglobal'] = $medioAmb['idmedioambglobal'];
                $parametros['idmonedaentidad'] = $moneda['idmonedaentidad'];
                echo " <tr>
                       <th align=left >" . 'Medio ambiente desglose' . "</th>
                       <th align=left '>" . $parametros['ejercicio'] . "</th>
                       <th align=left '>" . $medioAmb['codigo'] . "</th>
                       <th align=left '>" . $medioAmb['version'] . "</th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>
                       <th align=left '> </th>

                       <th align=left '> </th>
                       <th align=left '>" . $medioAmb['denommedioambiente'] . "</th>
                       <th align=left '>" . $medioAmb['tipohijo'] . "</th>
                       <th align=left '>" . $medioAmb['denommedioambientepadre'] . "</th>
                       <th align=left '>" . $medioAmb['tipopadre'] . "</th>
                       <th align=left '> </th>

                       <th align=left '>" . $moneda['codigoiso'] . "</th>";

                $desglose = DatInversion::listarPlanPrepDesgloseExportar($parametros);
                foreach ($desglose as $desglose) {
                    echo "<th align=left '>" . $desglose['valor'] . "</th>";
                }
                echo" </tr>";
            }
        }

    }


    public function equiposEsp($datospintar, $text, $tipoE, $n, $parametros) {//nomAdquisicion
        echo "<tr> <th align=left >" . $text . "</th>";
        $totalFila = 0;
        for ($ind = 0; $ind <= $tipoE; $ind++) {
            $ad = $datospintar[$ind]['adq'];
            for ($in = 0; $in < count($ad); $in++) {
                $cantEspeNuevo[0]['sum'] = 0;
                if ($n == 1) {
                    $cantEspeNuevo = DatEtapaEquipo::cantEspecifico(array(107), $ad[$in]['idadquisicion'], $datospintar[$ind]['idindicador'], $n, $parametros); //ids plaza y nuevo
                } else if ($n == 2) {
                    $cantEspeNuevo = DatEtapaEquipo::cantEspecifico(array(108), $ad[$in]['idadquisicion'], $datospintar[$ind]['idindicador'], $n, $parametros); //ids plaza y nuevo
                } else if ($n == 5) {
                    $cantEspeNuevo = DatEtapaEquipo::cantEspecifico(array(107), $ad[$in]['idadquisicion'], $datospintar[$ind]['idindicador'], $n, $parametros); //ids plaza y nuevo
                } else if ($n == 4 || $n == 3 || $n == 6 || $n == 7) {
                    $cantEspeNuevo = DatEtapaEquipo::cantEspecifico([107, 108], $ad[$in]['idadquisicion'], $datospintar[$ind]['idindicador'], $n, $parametros); //ids plaza y nuevo
                } else if ($n == 8) {
                    $cantEspeNuevo = DatEtapaEquipo::cantEspecifico([107, 108], $ad[$in]['idadquisicion'], $datospintar[$ind]['idindicador'], $n, $parametros); //ids plaza y nuevo
                } else if ($n == 12) {
                    $cantEspeNuevo = DatEtapaEquipo::cantEspecifico([107, 108], $ad[$in]['idadquisicion'], $datospintar[$ind]['idindicador'], $n, $parametros); //ids plaza y nuevo
                }
                $totalFila = $cantEspeNuevo[0]['sum'] + $totalFila;
                if ($n == 4 || $n == 3 || $n == 6 || $n == 7 || $n == 2 || $n == 1 || $n == 5 || $n == 8 || $n == 12) {
                    echo "  <td >" . number_format($cantEspeNuevo[0]['sum'], '0', '.', ' ') . "</td>";
                } else {
                    echo "  <td ></td>";
                }
            }
        }
        echo "<td >" . number_format($totalFila, '0', '.', ' ') . "</td></tr>";
    }

    public function reporteBVAutomotor($parametros) {
        $tipoE = 0;
        $ejercicio = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        $parametros['idejercicio'] = $ejercicio['idejercicio'];
        $datospintar = DatEtapaEquipo::EquiposTercerN($parametros);
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=BalanceAutomotor.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo " <table border=1 cellspacing=0 width=60%> <tr> <th rowspan='2'>BALANCE " . $ejercicio['ejercicio'] . " VEHICULOS DE MOTOR</th>";
        foreach ($datospintar as $key => $value) {
            $adquirir = DatEtapaEquipo::nomAdquisicion($value['idindicador'], 2, 1, $parametros);
            if (count($adquirir) > 0) {
                $datospintar[$key]['adq'] = $adquirir;
                echo " <th colspan= " . count($datospintar[$key]['adq']) . " align=left style = 'font-weight:normal'>" . $value['denominacion'] . "</th>";
                $tipoE = $tipoE + 1;
            } else {
                unset($datospintar[$key]);
            }
        }
        echo " <th rowspan='2'>Total</th> </tr> <tr>";
        $datospintar = array_values($datospintar);
        for ($index = 0; $index < count($datospintar); $index++) {
            for ($in = 0; $in < count($datospintar[$index]['adq']); $in++) {
                $st = $datospintar[$index]['adq'][$in]['denominacion'];
                echo "  <td >" . $st . "</td>";
            }
        }
        echo "</tr>";
        self::equiposEsp($datospintar, 'TOTAL FUENTES', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'Inventario Comercializadoras(' . ($ejercicio['ejercicio'] - 1) . ')', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'Bajas Turisticas (TRANSTUR y TRANSGAVIOTA)', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'PRODUCCION NACIONAL', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'A importar', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'Importaciones Centralizadas(MINSAP y Comunales)', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'Inventario en TRANSIMPORT', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'Otras fuentes', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'TOTAL DESTINOS', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'REPOSICION DEL SEGURO (PERSONAS JURIDICAS)', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'REPOSICION DEL SEGURO (PERSONAS NATURALES)', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'REPOSICION EQUIPOS A LA EMAE', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'VEHICULOS P ETT', $tipoE, 3, $parametros);
        self::equiposEsp($datospintar, 'VEHICULOS P TAXICUBA', $tipoE, 4, $parametros);
        self::equiposEsp($datospintar, 'GLORIAS DEPORTIVAS', $tipoE, 5, $parametros);
        self::equiposEsp($datospintar, 'REORDENAMIENTO DE PIQUERAS TOTAL', $tipoE, 8, $parametros);
        self::equiposEsp($datospintar, 'REORDENAMIENTO PIQUERAS OACES', $tipoE, 6, $parametros);
        self::equiposEsp($datospintar, 'REORDENAMIENTO PIQUERAS CAP', $tipoE, 7, $parametros);
        self::equiposEsp($datospintar, 'CIMEX (Ventas personas naturales Cubanas)', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'RESERVA PARA EL ESTADO', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'OTRAS INVERSIONES APROBADAS', $tipoE, 12, $parametros);
        self::equiposEsp($datospintar, 'EN PLAZA', $tipoE, 1, $parametros);
        //   self::equiposEsp($datospintar, 'PRODUCCIONES NACIONALES', $tipoE, 11, $parametros);
        self::equiposEsp($datospintar, 'DE IMPORTACION', $tipoE, 2, $parametros);
        self::equiposEsp($datospintar, 'RESULTADO ', $tipoE, 10, $parametros);

        echo " </table>";
        echo " 
            <span > <b>Aprobado por: <br><br><br> Marino Murillo Jorge &nbsp &nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp &nbsp &nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp  &nbsp &nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp &nbsp &nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Fecha<br>Ministro </b></span><br>
           ";
//        
    }

    /*    public function reporteResumenMPExcel($parametros) {
      header("Pragma: public");
      header("Expires: " . date("D:M:Y"));
      header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
      header("Content-Type: application/force-download");
      header("Content-Type: application/octet-stream");
      header("Content-Type: application/download");
      header("Content-Disposition: attachment;filename=ResumenMP.xls");
      header("Content-Transfer-Encoding: binary ");
      echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
      echo "  <h3 align=center'>Reporte Resumen MP &nbsp&nbsp&nbsp&nbsp&nbsp Plan " . $parametros['idejercicioden'] . "<h3>";
      echo "  <h3>Ministerio de economía y planificación &nbsp&nbsp&nbsp&nbsp&nbsp UM: Miles de Pesos<h3>";
      echo "  <br><br>";
      echo " <table border=1 cellspacing=0 width=60%> <tr style = 'background-color: #CBCBCB'>";

      $this->objinversion = new DatInversion();
      $this->objinversionModel = new InversionesModel();

      foreach ($parametros['ids'] as $ident) {
      $organismos = stripslashes($ident);
      $arrayOrganismos[] = explode(',', $organismos);
      }

      if (count($arrayOrganismos[1]) > 0) {
      $entidades = array_merge($arrayOrganismos[0], $arrayOrganismos[1]);
      } else {
      $entidades = $arrayOrganismos[0];
      }
      $arrayDeOrganismos = explode(',', $parametros['organismoden']);
      $idEntidades = array();
      $idEstr = array();
      if ($parametros['identidad'] == null) {
      foreach ($arrayOrganismos[0] as $key => $ident) {
      $hijas = $this->objinversionModel->cargarEntHijas($ident, $arrayDeOrganismos[$key]);
      if (count($hijas) > 0) {
      $idEntidades = array_merge($idEntidades, $hijas);
      } else {
      $idEntidades[count($idEntidades)]['identidad'] = $ident;
      $idEntidades[count($idEntidades) - 1]['entidad'] = $arrayDeOrganismos[$key];
      }
      }
      foreach ($idEntidades as $key => $valu) {
      $idEstr[] = $valu['identidad'];
      }
      } else {
      $IDEntidades = explode(",", $parametros['identidad']);
      foreach ($arrayOrganismos[0] as $key => $ident) {
      $idEstr = array();
      $idSeleccionadas = $this->objinversionModel->dadoArrayEntidades($ident, $arrayDeOrganismos[$key], $IDEntidades); //ENTIDADES HIJAS seleccionadas
      if (count($idSeleccionadas) > 0) {
      $idEntidades = $idSeleccionadas;
      foreach ($idEntidades as $key => $valu) {
      $idEstr[] = $valu['identidad'];
      }
      }
      }
      }
      //print_r($idEstr);die;
      $arrEntidades = implode(",", $idEstr);
      $inversionesXentidad = $this->objinversion->listarInversionesXentidad($parametros['idejercicio'], $arrEntidades);

      array_unshift($parametros['entidadesDen'], $parametros['organismoden']);
      $totalPlan = array();
      $totalComoFinancia = array();
      $totalCredito = array();
      $totalContado = array();
      $totalFondoBasico = array();
      $totalRendimientoInver = array();
      $totalInversInicioAno = array();
      $totalCuotaInversProceso = array();
      $totalQuienfinancia = array();

      $idFinancistas = array();
      foreach ($inversionesXentidad as $valIn) {
      $quienFinancia = $this->objinversion->listarDenomFinancista($valIn['idinversion'], 9900000103, '', $parametros['idejercicio']);

      foreach ($quienFinancia as $key => $quien) {
      if (!in_array($quien['denominacion'], $quienPintados)) {
      $quienPintados[] = $quien['denominacion'];
      $idFinancistas[] = $quien['idfinancista'];
      }
      }
      $totalPlan[$k] += $valIn['plan'];
      $totalComoFinancia[$k] += $valIn['totalcomosefinancia'];
      $totalCredito[$k] += $valIn['credito'];
      $totalContado[$k] += $valIn['contado'];
      $totalFondoBasico[$k] += $valIn['fondobasico'];
      $totalRendimientoInver[$k] += $valIn['rendinversion'];
      $totalInversInicioAno[$k] += $valIn['inverprocpniano'];
      $totalCuotaInversProceso[$k] += $valIn['cuotainverproc'];
      $totalQuienfinancia[$k] += $valIn['totalquienfinancia'];
      }


      echo " <th  align=left'> OACE/Entidad/Inversiones  </th>";
      echo " <th  align=left'> ORGANISMO  </th>";
      echo " <th  align=left'> Plan(Incluye plan de preparacion)  </th>";
      echo " <th  align=left'> Total Cómo se financia  </th>";
      echo " <th  align=left'> Crédito  </th>";
      echo " <th  align=left'> Contado  </th>";
      echo " <th  align=left'> Total Quién financia  </th>";
      foreach ($quienPintados as $key => $quien) {
      echo " <th  align=left'> " . $quien . " </th>";
      }
      echo " <th  align=left'> Fondos básicos a poner en explotacion  </th>";
      echo " <th  align=left'> Rendimiento de la inversión  </th>";
      echo " <th  align=left'> Inversiones en proceso al inicio del año  </th>";
      echo " <th  align=left'> Cuota de inversiones en proceso  </th>";
      echo " <tr> <th align=left > Total OACE";
      echo " <th  align=left'>  </th>"; //
      echo " <th > " . number_format(array_sum($totalPlan), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalComoFinancia), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalCredito), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalContado), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalQuienfinancia), '3', '.', '') . " </th>";

      foreach ($quienPintados as $quienP) {
      $totalQuienXfinancista = $this->objinversion->listarTotalQuienXfinancista($arrEntidades, 9900000103, $parametros['idejercicio']);
      $valor = 0;
      foreach ($totalQuienXfinancista as $totalXQuien) {
      if ($quienP == $totalXQuien['denominacion']) {
      $valor = $totalXQuien['totalquien'];
      break;
      }
      }
      echo " <th> " . $valor . " </th>";
      }

      echo " <th > " . number_format(array_sum($totalFondoBasico), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalRendimientoInver), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalInversInicioAno), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalCuotaInversProceso), '3', '.', '') . " </th>";

      echo " </tr>";

      $denomOrganismos = explode(",", $parametros['organismoden']);
      foreach ($denomOrganismos as $k => $value) {
      $totalPlanOrg[] += $val['plan'];
      $idorg = $arrayOrganismos[0][$k];
      $totalPlanOrg = array();
      $totalComoFinanciaOrg = array();
      $totalCreditoOrg = array();
      $totalContadoOrg = array();
      $totalFondoBasicoOrg = array();
      $totalRendimientoInverOrg = array();
      $totalInversInicioAnoOrg = array();
      $totalCuotaInversProcesoOrg = array();
      $totalQuienfinanciaOrg = array();
      foreach ($inversionesXentidad as $key => $val) {
      if ($arrayOrganismos[0][$k] == $val['idestructuracomun']) {
      $totalPlanOrg[] += $val['plan'];
      $totalComoFinanciaOrg[] = $val['totalcomosefinancia'];
      $totalCreditoOrg[] = $val['credito'];
      $totalContadoOrg[] = $val['contado'];
      $totalFondoBasicoOrg[] += $val['fondobasico'];
      $totalRendimientoInverOrg[] += $val['rendinversion'];
      $totalInversInicioAnoOrg[] += $val['inverprocpniano'];
      $totalCuotaInversProcesoOrg[] += $val['cuotainverproc'];
      $totalQuienfinanciaOrg[] += $val['totalquienfinancia'];
      }
      }
      $organismo = $arrayOrganismos[0][$k];
      echo "<tr>";
      echo " <th  align=left > " . $value . " </th>";
      echo " <th  align=left > " . $value . " </th>";
      echo " <th > " . number_format(array_sum($totalPlanOrg), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalComoFinanciaOrg), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalCreditoOrg), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalContadoOrg), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalQuienfinanciaOrg), '3', '.', '') . " </th>";

      foreach ($quienPintados as $quienP) {
      $totalQuienXfinancista = $this->objinversion->listarTotalQuienXfinancista($arrayOrganismos[0][$k], 9900000103, $parametros['idejercicio']);
      $valor = 0;
      foreach ($totalQuienXfinancista as $totalXQuien) {
      if ($quienP == $totalXQuien['denominacion']) {
      $valor = $totalXQuien['totalquien'];
      break;
      }
      }
      echo " <th > " . number_format(0, '3', '.', '') . " </th>";
      }
      echo " <th > " . number_format(0, '3', '.', '') . " </th>";
      echo " <th > " . number_format(0, '3', '.', '') . " </th>";
      echo " <th > " . number_format(0, '3', '.', '') . " </th>";
      echo " <th > " . number_format(0, '3', '.', '') . " </th>
      </tr>";


      foreach ($inversionesXentidad as $key => $val) {

      if ($arrayOrganismos[0][$k] == $val['idestructuracomun']) {
      echo "<tr>";
      echo " <th align=left> " . $val['denominacion'] . " </th>";
      echo " <th align=left> " . $val['organismo'] . " </th>";
      echo " <th > " . number_format($val['plan'], '3', '.', '') . " </th>";
      echo " <th > " . number_format($val['totalcomosefinancia'], '3', '.', '') . " </th>";
      echo " <th > " . number_format($val['credito'], '3', '.', '') . " </th>";
      echo " <th > " . number_format($val['contado'], '3', '.', '') . " </th>";
      echo " <th > " . number_format($val['totalquienfinancia'], '3', '.', '') . " </th>";
      foreach ($idFinancistas as $quienP) {
      //$valorquienFinancia = $this->objinversion->listarDenomFinancista($val['idinversion'], 9900000103);
      $valorquienFinancia = $this->objinversion->listarValorPlanPorFinancista($val['idinversion'], 9900000103, $parametros['idejercicio']);

      if (count($valorquienFinancia) > 0) {
      foreach ($valorquienFinancia as $quien) {
      $valor = 0;
      if ($quienP == $quien['idfinancista']) {
      $valor = $quien['valor'];
      break;
      }
      }
      }
      echo " <th > " . number_format($valor, '3', '.', '') . " </th>";
      }
      echo " <th > " . number_format($totalFondoBasicoOrg, '3', '.', '') . " </th>";

      echo " <th > " . number_format($totalRendimientoInverOrg, '3', '.', '') . " </th>";
      echo " <th > " . number_format($totalInversInicioAnoOrg, '3', '.', '') . " </th>";

      echo " <th > " . number_format($totalCuotaInversProcesoOrg, '3', '.', '') . " </th>
      </tr>";
      }
      }

      foreach ($idEntidades as $pos => $value) {
      $totalPlanEnt = array();
      $totalComoFinanciaEnt = array();
      $totalCreditoEnt = array();
      $totalContadoEnt = array();
      $totalFondoBasicoEnt = array();
      $totalRendimientoInverEnt = array();
      $totalInversInicioAnoEnt = array();
      $totalCuotaInversProcesoEnt = array();
      $totalQuienfinanciaEnt = array();
      foreach ($inversionesXentidad as $key => $val) {
      if ($value['identidad'] == $val['idestructuracomun'] && $idorg != $value['identidad']) {
      $totalPlanEnt[] += $val['plan'];
      $totalComoFinanciaEnt[] = $val['totalcomosefinancia'];
      $totalCreditoEnt[] = $val['credito'];
      $totalContadoEnt[] = $val['contado'];
      $totalFondoBasicoEnt[] += $val['fondobasico'];
      $totalRendimientoInverEnt[] += $val['rendinversion'];
      $totalInversInicioAnoEnt[] += $val['inverprocpniano'];
      $totalCuotaInversProcesoEnt[] += $val['cuotainverproc'];
      $totalQuienfinanciaEnt[] += $val['totalquienfinancia'];
      }
      }
      $denotabla = $value['entidad'];
      if ($organismo != $value['identidad']) {
      echo "<tr>";
      echo " <th  align=left > " . $denotabla . " </th>";
      echo " <th  align=left > " . $denotabla . "  </th>";
      echo " <th > " . number_format(array_sum($totalPlanEnt), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalComoFinanciaEnt), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalCreditoEnt), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalContadoEnt), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalQuienfinanciaEnt), '3', '.', '') . " </th>";


      foreach ($quienPintados as $p => $quienP) {
      $totaQuienXfinancista = $this->objinversion->listarTotalQuienXfinancista($value['identidad'], 9900000103, $parametros['idejercicio']); //$arrayOrganismos[0]
      $valor = 0;
      foreach ($totaQuienXfinancista as $totalXQuien) {
      if ($quienP == $totalXQuien['denominacion']) {
      $valor = $totalXQuien['totalquien'];
      break;
      }
      }
      echo " <th > " . number_format($valor, '3', '.', '') . " </th>";
      }
      echo " <th > " . number_format(array_sum($totalFondoBasicoEnt), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalRendimientoInverEnt), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalInversInicioAnoEnt), '3', '.', '') . " </th>";
      echo " <th > " . number_format(array_sum($totalCuotaInversProcesoEnt), '3', '.', '') . " </th>
      </tr>";


      foreach ($inversionesXentidad as $key => $val) {
      //                if ($entidades[$k] == $val['idestructuracomun']) {
      if ($value['identidad'] == $val['idestructuracomun']) {
      echo "<tr>";
      echo " <th  align=left > " . $val['denominacion'] . " </th>";
      echo " <th  align=left > " . $val['organismo'] . " </th>";
      echo " <th > " . number_format($val['plan'], '3', '.', '') . " </th>";
      echo " <th > " . number_format($val['totalcomosefinancia'], '3', '.', '') . " </th>";
      echo " <th > " . number_format($val['credito'], '3', '.', '') . " </th>";
      echo " <th > " . number_format($val['contado'], '3', '.', '') . " </th>";
      echo " <th > " . number_format($val['totalquienfinancia'], '3', '.', '') . " </th>";

      foreach ($idFinancistas as $quienP) {
      //$valorquienFinancia = $this->objinversion->listarDenomFinancista($val['idinversion'], 9900000103);
      $valorquienFinancia = $this->objinversion->listarValorPlanPorFinancista($val['idinversion'], 9900000103, $parametros['idejercicio']);
      if (count($valorquienFinancia) > 0) {
      foreach ($valorquienFinancia as $quien) {
      $valor = 0;
      if ($quienP == $quien['idfinancista']) {
      $valor = $quien['valor'];
      break;
      }
      }
      echo " <th > " . number_format($valor, '3', '.', '') . " </th>";
      } else {
      echo " <th > " . number_format(0, '3', '.', '') . " </th>";
      }
      }
      echo " <th > " . number_format($val['fondobasico'], '3', '.', '') . " </th>";
      echo " <th > " . number_format($val['rendinversion'], '3', '.', '') . " </th>";
      echo " <th > " . number_format($val['inverprocpniano'], '3', '.', '') . " </th>";
      echo " <th > " . number_format($val['cuotainverproc'], '3', '.', '') . " </th>
      </tr>";
      }
      }
      }
      }
      }

      echo " </table>";

      //
      } */

    public function reporteResumenMPExcel($parametros) {
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=ResumenMP.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "  <h3 align=center'>Reporte Resumen MP &nbsp&nbsp&nbsp&nbsp&nbsp Plan " . $parametros['idejercicioden'] . "<h3>";
        echo "  <h3>Ministerio de economía y planificación &nbsp&nbsp&nbsp&nbsp&nbsp UM: Miles de Pesos<h3>";
        echo "  <br><br>";
        echo " <table border=1 cellspacing=0 width=60%> <tr style = 'background-color: #CBCBCB'>";

        $this->objinversion = new DatInversion();
        $this->objinversionModel = new InversionesModel();

        foreach ($parametros['ids'] as $ident) {
            $organismos = stripslashes($ident);
            $arrayOrganismos[] = explode(',', $organismos);
        }

        if (count($arrayOrganismos[1]) > 0) {
            $entidades = array_merge($arrayOrganismos[0], $arrayOrganismos[1]);
        } else {
            $entidades = $arrayOrganismos[0];
        }
        $arrayDeOrganismos = explode(',', $parametros['organismoden']);
        $idEntidades = array();
        $idEstr = array();
        if ($parametros['identidad'] == null) {
            foreach ($arrayOrganismos[0] as $key => $ident) {
                $hijas = $this->objinversionModel->cargarEntHijas($ident, $arrayDeOrganismos[$key]);
                if (count($hijas) > 0) {
                    $idEntidades = array_merge($idEntidades, $hijas);
                } else {
                    $idEntidades[count($idEntidades)]['identidad'] = $ident;
                    $idEntidades[count($idEntidades) - 1]['entidad'] = $arrayDeOrganismos[$key];
                }
            }
            foreach ($idEntidades as $key => $valu) {
                $idEstr[] = $valu['identidad'];
            }
        } else {
            $IDEntidades = explode(",", $parametros['identidad']);
            foreach ($arrayOrganismos[0] as $key => $ident) {
                $idEstr = array();
                $idSeleccionadas = $this->objinversionModel->dadoArrayEntidades($ident, $arrayDeOrganismos[$key], $IDEntidades); //ENTIDADES HIJAS seleccionadas
                if (count($idSeleccionadas) > 0) {
                    $idEntidades = $idSeleccionadas;
                    foreach ($idEntidades as $key => $valu) {
                        $idEstr[] = $valu['identidad'];
                    }
                }
            }
        }
        //print_r($idEstr);die;
        $arrEntidades = implode(",", $idEstr);
        $inversionesXentidad = $this->objinversion->listarInversionesXentidad($parametros['idejercicio'], $arrEntidades);

        array_unshift($parametros['entidadesDen'], $parametros['organismoden']);
        /* $totalPlan = array();
          $totalComoFinancia = array();
          $totalCredito = array();
          $totalContado = array();
          $totalFondoBasico = array();
          $totalRendimientoInver = array();
          $totalInversInicioAno = array();
          $totalCuotaInversProceso = array();
          $totalQuienfinancia = array();

          $idFinancistas = array();
          foreach ($inversionesXentidad as $valIn) {
          $quienFinancia = $this->objinversion->listarDenomFinancista($valIn['idinversion'], 9900000103, '', $parametros['idejercicio']);

          foreach ($quienFinancia as $key => $quien) {
          if (!in_array($quien['denominacion'], $quienPintados)) {
          $quienPintados[] = $quien['denominacion'];
          $idFinancistas[] = $quien['idfinancista'];
          }
          }
          $totalPlan[$k] += $valIn['plan'];
          $totalComoFinancia[$k] += $valIn['totalcomosefinancia'];
          $totalCredito[$k] += $valIn['credito'];
          $totalContado[$k] += $valIn['contado'];
          $totalFondoBasico[$k] += $valIn['fondobasico'];
          $totalRendimientoInver[$k] += $valIn['rendinversion'];
          $totalInversInicioAno[$k] += $valIn['inverprocpniano'];
          $totalCuotaInversProceso[$k] += $valIn['cuotainverproc'];
          $totalQuienfinancia[$k] += $valIn['totalquienfinancia'];
          } */


        echo " <th  align=left'> OACE/Entidad/Inversiones  </th>";
        echo " <th  align=left'> ORGANISMO  </th>";
        echo " <th  align=left'> Plan(Incluye plan de preparacion)  </th>";
        echo " <th  align=left'> Total Cómo se financia  </th>";
        echo " <th  align=left'> Crédito  </th>";
        echo " <th  align=left'> Contado  </th>";
        echo " <th  align=left'> Total Quién financia  </th>";
        foreach ($quienPintados as $key => $quien) {
            echo " <th  align=left'> " . $quien . " </th>";
        }
        echo " <th  align=left'> Fondos básicos a poner en explotacion  </th>";
        echo " <th  align=left'> Rendimiento de la inversión  </th>";
        echo " <th  align=left'> Inversiones en proceso al inicio del año  </th>";
        echo " <th  align=left'> Cuota de inversiones en proceso  </th>";
        /*   echo " <tr> <th align=left > Total OACE";
          echo " <th  align=left'>  </th>"; //
          echo " <th > " . number_format(array_sum($totalPlan), '3', '.', '') . " </th>";
          echo " <th > " . number_format(array_sum($totalComoFinancia), '3', '.', '') . " </th>";
          echo " <th > " . number_format(array_sum($totalCredito), '3', '.', '') . " </th>";
          echo " <th > " . number_format(array_sum($totalContado), '3', '.', '') . " </th>";
          echo " <th > " . number_format(array_sum($totalQuienfinancia), '3', '.', '') . " </th>";

          foreach ($quienPintados as $quienP) {
          $totalQuienXfinancista = $this->objinversion->listarTotalQuienXfinancista($arrEntidades, 9900000103, $parametros['idejercicio']);
          $valor = 0;
          foreach ($totalQuienXfinancista as $totalXQuien) {
          if ($quienP == $totalXQuien['denominacion']) {
          $valor = $totalXQuien['totalquien'];
          break;
          }
          }
          echo " <th> " . $valor . " </th>";
          }

          echo " <th > " . number_format(array_sum($totalFondoBasico), '3', '.', '') . " </th>";
          echo " <th > " . number_format(array_sum($totalRendimientoInver), '3', '.', '') . " </th>";
          echo " <th > " . number_format(array_sum($totalInversInicioAno), '3', '.', '') . " </th>";
          echo " <th > " . number_format(array_sum($totalCuotaInversProceso), '3', '.', '') . " </th>";

          echo " </tr>"; */

        $denomOrganismos = explode(",", $parametros['organismoden']);
        //  foreach ($denomOrganismos as $k => $value) {
        //   $idorg = $arrayOrganismos[0][$k];
        /*  $totalPlanOrg[] += $value['plan'];
          $totalPlanOrg = array();
          $totalComoFinanciaOrg = array();
          $totalCreditoOrg = array();
          $totalContadoOrg = array();
          $totalFondoBasicoOrg = array();
          $totalRendimientoInverOrg = array();
          $totalInversInicioAnoOrg = array();
          $totalCuotaInversProcesoOrg = array();
          $totalQuienfinanciaOrg = array();
          foreach ($inversionesXentidad as $key => $val) {
          if ($arrayOrganismos[0][$k] == $val['idestructuracomun']) {
          $totalPlanOrg[] += $val['plan'];
          $totalComoFinanciaOrg[] = $val['totalcomosefinancia'];
          $totalCreditoOrg[] = $val['credito'];
          $totalContadoOrg[] = $val['contado'];
          $totalFondoBasicoOrg[] += $val['fondobasico'];
          $totalRendimientoInverOrg[] += $val['rendinversion'];
          $totalInversInicioAnoOrg[] += $val['inverprocpniano'];
          $totalCuotaInversProcesoOrg[] += $val['cuotainverproc'];
          $totalQuienfinanciaOrg[] += $val['totalquienfinancia'];
          }
          } */
        //  $organismo = $arrayOrganismos[0][$k];
        /* echo "<tr>";
          echo " <th  align=left > " . $value . " </th>";
          echo " <th  align=left > " . $value . " </th>";
          echo " <th > " . number_format(array_sum($totalPlanOrg), '3', '.', '') . " </th>";
          echo " <th > " . number_format(array_sum($totalComoFinanciaOrg), '3', '.', '') . " </th>";
          echo " <th > " . number_format(array_sum($totalCreditoOrg), '3', '.', '') . " </th>";
          echo " <th > " . number_format(array_sum($totalContadoOrg), '3', '.', '') . " </th>";
          echo " <th > " . number_format(array_sum($totalQuienfinanciaOrg), '3', '.', '') . " </th>";

          foreach ($quienPintados as $quienP) {
          $totalQuienXfinancista = $this->objinversion->listarTotalQuienXfinancista($arrayOrganismos[0][$k], 9900000103, $parametros['idejercicio']);
          $valor = 0;
          foreach ($totalQuienXfinancista as $totalXQuien) {
          if ($quienP == $totalXQuien['denominacion']) {
          $valor = $totalXQuien['totalquien'];
          break;
          }
          }
          echo " <th > " . number_format(0, '3', '.', '') . " </th>";
          }
          echo " <th > " . number_format(0, '3', '.', '') . " </th>";
          echo " <th > " . number_format(0, '3', '.', '') . " </th>";
          echo " <th > " . number_format(0, '3', '.', '') . " </th>";
          echo " <th > " . number_format(0, '3', '.', '') . " </th>
          </tr>"; */


        /*    foreach ($inversionesXentidad as $key => $val) {

          if ($arrayOrganismos[0][$k] == $val['idestructuracomun']) {
          echo "<tr>";
          echo " <th align=left> " . $val['denominacion'] . " </th>";
          echo " <th align=left> " . $val['organismo'] . " </th>";
          echo " <th > " . number_format($val['plan'], '3', '.', '') . " </th>";
          echo " <th > " . number_format($val['totalcomosefinancia'], '3', '.', '') . " </th>";
          echo " <th > " . number_format($val['credito'], '3', '.', '') . " </th>";
          echo " <th > " . number_format($val['contado'], '3', '.', '') . " </th>";
          echo " <th > " . number_format($val['totalquienfinancia'], '3', '.', '') . " </th>";
          foreach ($idFinancistas as $quienP) {
          //$valorquienFinancia = $this->objinversion->listarDenomFinancista($val['idinversion'], 9900000103);
          $valorquienFinancia = $this->objinversion->listarValorPlanPorFinancista($val['idinversion'], 9900000103, $parametros['idejercicio']);

          if (count($valorquienFinancia) > 0) {
          foreach ($valorquienFinancia as $quien) {
          $valor = 0;
          if ($quienP == $quien['idfinancista']) {
          $valor = $quien['valor'];
          break;
          }
          }
          }
          echo " <th > " . number_format($valor, '3', '.', '') . " </th>";
          }
          echo " <th > " . number_format($totalFondoBasicoOrg, '3', '.', '') . " </th>";

          echo " <th > " . number_format($totalRendimientoInverOrg, '3', '.', '') . " </th>";
          echo " <th > " . number_format($totalInversInicioAnoOrg, '3', '.', '') . " </th>";

          echo " <th > " . number_format($totalCuotaInversProcesoOrg, '3', '.', '') . " </th>
          </tr>";
          }
          } */

        foreach ($idEntidades as $pos => $value) {
            $totalPlanEnt = array();
            $totalComoFinanciaEnt = array();
            $totalCreditoEnt = array();
            $totalContadoEnt = array();
            $totalFondoBasicoEnt = array();
            $totalRendimientoInverEnt = array();
            $totalInversInicioAnoEnt = array();
            $totalCuotaInversProcesoEnt = array();
            $totalQuienfinanciaEnt = array();
            foreach ($inversionesXentidad as $key => $val) {
                if ($value['identidad'] == $val['idestructuracomun'] /* && $idorg != $value['identidad'] */) {
                    $totalPlanEnt[] += $val['plan'];
                    $totalComoFinanciaEnt[] = $val['totalcomosefinancia'];
                    $totalCreditoEnt[] = $val['credito'];
                    $totalContadoEnt[] = $val['contado'];
                    $totalFondoBasicoEnt[] += $val['fondobasico'];
                    $totalRendimientoInverEnt[] += $val['rendinversion'];
                    $totalInversInicioAnoEnt[] += $val['inverprocpniano'];
                    $totalCuotaInversProcesoEnt[] += $val['cuotainverproc'];
                    $totalQuienfinanciaEnt[] += $val['totalquienfinancia'];
                }
            }
            /* echo "<tr>";
              echo " <th  align=left > " . $denotabla . " </th>";
              echo " <th  align=left > " . $denotabla . "  </th>";
              echo " <th > " . number_format(array_sum($totalPlanEnt), '3', '.', '') . " </th>";
              echo " <th > " . number_format(array_sum($totalComoFinanciaEnt), '3', '.', '') . " </th>";
              echo " <th > " . number_format(array_sum($totalCreditoEnt), '3', '.', '') . " </th>";
              echo " <th > " . number_format(array_sum($totalContadoEnt), '3', '.', '') . " </th>";
              echo " <th > " . number_format(array_sum($totalQuienfinanciaEnt), '3', '.', '') . " </th>";


              foreach ($quienPintados as $p => $quienP) {
              $totaQuienXfinancista = $this->objinversion->listarTotalQuienXfinancista($value['identidad'], 9900000103, $parametros['idejercicio']); //$arrayOrganismos[0]
              $valor = 0;
              foreach ($totaQuienXfinancista as $totalXQuien) {
              if ($quienP == $totalXQuien['denominacion']) {
              $valor = $totalXQuien['totalquien'];
              break;
              }
              }
              echo " <th > " . number_format($valor, '3', '.', '') . " </th>";
              }
              echo " <th > " . number_format(array_sum($totalFondoBasicoEnt), '3', '.', '') . " </th>";
              echo " <th > " . number_format(array_sum($totalRendimientoInverEnt), '3', '.', '') . " </th>";
              echo " <th > " . number_format(array_sum($totalInversInicioAnoEnt), '3', '.', '') . " </th>";
              echo " <th > " . number_format(array_sum($totalCuotaInversProcesoEnt), '3', '.', '') . " </th>
              </tr>"; */

            foreach ($inversionesXentidad as $key => $val) {
                //                if ($entidades[$k] == $val['idestructuracomun']) {
                if ($value['identidad'] == $val['idestructuracomun']) {
                    echo "<tr>";
                    echo " <th  align=left > " . $val['denominacion'] . " </th>";
                    echo " <th  align=left > " . $val['organismo'] . " </th>";
                    echo " <th > " . number_format($val['plan'], '3', '.', '') . " </th>";
                    echo " <th > " . number_format($val['totalcomosefinancia'], '3', '.', '') . " </th>";
                    echo " <th > " . number_format($val['credito'], '3', '.', '') . " </th>";
                    echo " <th > " . number_format($val['contado'], '3', '.', '') . " </th>";
                    echo " <th > " . number_format($val['totalquienfinancia'], '3', '.', '') . " </th>";

                    foreach ($idFinancistas as $quienP) {
                        //$valorquienFinancia = $this->objinversion->listarDenomFinancista($val['idinversion'], 9900000103);
                        $valorquienFinancia = $this->objinversion->listarValorPlanPorFinancista($val['idinversion'], 9900000103, $parametros['idejercicio']);
                        if (count($valorquienFinancia) > 0) {
                            foreach ($valorquienFinancia as $quien) {
                                $valor = 0;
                                if ($quienP == $quien['idfinancista']) {
                                    $valor = $quien['valor'];
                                    break;
                                }
                            }
                            echo " <th > " . number_format($valor, '3', '.', '') . " </th>";
                        } else {
                            echo " <th > " . number_format(0, '3', '.', '') . " </th>";
                        }
                    }
                    echo " <th > " . number_format($val['fondobasico'], '3', '.', '') . " </th>";
                    echo " <th > " . number_format($val['rendinversion'], '3', '.', '') . " </th>";
                    echo " <th > " . number_format($val['inverprocpniano'], '3', '.', '') . " </th>";
                    echo " <th > " . number_format($val['cuotainverproc'], '3', '.', '') . " </th>
                                 </tr>";
                }
            }
        }
        // }

        echo " </table>";

//        
    }

    public function reporteXComponeteExcel($parametros) {
          header("Pragma: public");
          header("Expires: " . date("D:M:Y"));
          header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
          header("Content-Type: application/force-download");
          header("Content-Type: application/octet-stream");
          header("Content-Type: application/download");
          header("Content-Disposition: attachment;filename=Componente.xls");
          header("Content-Transfer-Encoding: binary "); 

        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "  <h3>Reporte Componentes en Moneda Total y en Divisa<h3>";
        echo "  <h3>Plan " . $parametros->ejercicioden . "<h3>";
        echo "  <h3>Ministerio de economía y planificación<h3>";
        echo "  <br><br>";
        echo " <table border=1 cellspacing=0 width=60%> <tr>";

        $this->objinversion = new DatInversion();
        $this->objinversionModel = new InversionesModel();
        $componentes = $this->objinversion->getComponentes();

        echo " <th   border=0 align=left'></th>";
        echo " <th  border=0 align=left'></th>";
        echo " <th  align=left' colspan='6' align=center> Plan  " . $parametros->ejercicioden . " MONEDA TOTAL </th>";
        echo " <th  align=left' colspan='6' align=center> Plan  " . $parametros->ejercicioden . " DIVISA  </th> </tr>";
        echo " <tr> <th  align=left'> ORGANISMO / PRESUPUESTO MEP </th>";
        echo " <th  align=left'> ORGANISMO</th>";

        foreach ($componentes as $value) {
            echo " <th  align=left'> " . $value['denominacion'] . "  </th>";
        }

        echo " <th  align=left'> TOTAL INVERSION</th>";
        echo " <th  align=left'> PLAN DE PREPARACION</th>";
        foreach ($componentes as $value) {
            echo " <th  align=left'> " . $value['denominacion'] . "</th>";
        }
        echo " <th  align=left'> TOTAL INVERSION </th>";
        echo " <th  align=left'> PLAN DE PREPARACION </th>";

        echo "</tr>";
        $organismo = explode(",", $parametros->idorganismo);
        $organismoden = explode(",", $parametros->organismo);

        //print_r($organismo);die;

        foreach ($organismo as $ki => $value) {//organismos

            $identidades = Array();
            $valorescompCUP = Array();
            $entidades_hijas = Array();
            if ($parametros->identidad != null) {
                $IDEntidades = explode(",", $parametros->identidad);
                $idSeleccionadas = $this->objinversionModel->dadoArrayEntidades($value, $organismoden[$ki], $IDEntidades); //ENTIDADES HIJAS seleccionadas
                if (count($idSeleccionadas) > 0) {
                    $idestructuras = $idSeleccionadas;
                    foreach ($idestructuras as $key => $valu) {
                        $identidades[$key] = $valu['identidad'];
                    }
                }
            } else {
                $idestructuras = $this->objinversionModel->cargarEntHijas($value, $organismoden[$ki]); //ENTIDADES HIJAS
                foreach ($idestructuras as $key => $valor) {
                    $identidades[$key] = $valor['identidad'];
                }
            }
            if (count($identidades) > 0) {
                $arrayEntXOrg[$ki] = $identidades;
                $arrayDenEntXOrg[$ki] = $idestructuras;
                $entidades_hijas = array_merge($identidades, $entidades_hijas);
            } else {
                $arrayEntXOrg[$ki][0] = $value;
                $arrayDenEntXOrg[$ki][0] = $organismoden[$ki];
                $entidades_hijas[count($entidades_hijas)] = $value;
            }
            // $totalesXcomponentes = [];
            // $totalesXcomponentes = $this->objinversion->getDatosRptComponentes($parametros->idejercicio, implode(',', $entidades_hijas), 0);
            self::mostrarInversiones($parametros->idejercicio, implode(',', $entidades_hijas), $componentes, $this->objinversion, $this->objinversionModel, $parametros);
        }
        echo " </table>";
        echo "  <br><br>";
        echo " 
            <span > <b>Aprobado por: <br><br><br> Marino Murillo Jorge &nbsp &nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp &nbsp &nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp  &nbsp &nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp &nbsp &nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Fecha<br>Ministro </b></span><br>
           ";
    }

    public function mostrarInversiones($idejercicio, $entidades_hijas, $componentes, $datinv, $model, $parametros) {
        $this->objinversion = $datinv;
        $this->objinversionModel = $model;
        $invXcomponentes = [];
        $monedas[0] = 'CUP';
        $monedas[1] = 'USD';
        //pre_r(explode(',', $entidades_hijas));die;
        $inversionesSegunFiltros = $datinv->listarTipInversion($entidades_hijas, (array)$parametros,'componente');
        $totalizarPorOrganismo = 1;
        $invXcomponentes = $this->objinversion->getDatosRptComponentes($idejercicio, $entidades_hijas, $totalizarPorOrganismo, $inversionesSegunFiltros);
        //print_r($invXcomponentes);die;

        $inversiones = array();
        $organismos = array();
        $denominversiones = array();
        foreach ($invXcomponentes as $p => $dato) {
            if (!in_array($dato['idinversion'], $inversiones)) {
                $inversiones[] = $dato['idinversion'];
                $denominversiones[] = $dato['inversion'];
                $organismos[] = $dato['organismopadre'];
            }
        }

        foreach ($inversiones as $pos => $dato) {

            echo " <tr> <th align=left'> " . $denominversiones[$pos] . "</th> ";
            echo " <th  align=left'> " . $organismos[$pos] . "</th>";
            foreach ($monedas as $moneda) {
                $totalInversiones = 0;
                foreach ($componentes as $comp) {
                    $encuentra = false;
                    $valComponente = 0;
                    foreach ($invXcomponentes as $p => $datoInv) {
                        if ($datoInv['idinversion'] == $dato) {

                            if ($moneda == $datoInv['codigoiso']) {
                                $planPreparacion = $datoInv['planpreparacion'];
                                if ($comp['idnombreetapa'] == $datoInv['idnombreetapa']) {
                                    $encuentra = true;
                                    $valComponente = $datoInv['valor'];
                                    break;
                                }
                            }
                        }
                    }

                    $val = ($encuentra) ? number_format($valComponente, '3', ',', '') : 0;
                    $totalInversiones += ($encuentra) ? $valComponente : 0;
                    echo " <th > " . $val . "</th>";
                }
                echo " <th > " . number_format($totalInversiones, '3', ',', ''). "</th>";
                echo " <th > " . number_format($planPreparacion, '3', ',', '') . "</th>";
            }
            echo "</tr>";
        }
    }

    public function getEjercicioEstado($params){
        $params['ejercicios'] .= "'".$params['ejercicio']."'".',';
        $params['ejercicios'] .= "'".($params['ejercicio']+1)."'".',';
        $params['ejercicios'] .= "'".($params['ejercicio']-1)."'".',';
        $params['ejercicios'] .= "'".($params['ejercicio']-2)."'";
        $result = array();
        $datos = NomEjercicioplanificacion::listarEjercicioActualByUri($params);
        foreach($datos as $dato){
            $result[$dato['ejercicio']]=$dato;
            //$result[$dato['ejercicio']]['nombreestado']=self::normaliza($dato['nombreestado']);
            $result[$dato['ejercicio']]['nombreestado']=$dato['nombreestado'];
        }
        return $result;
    }

    public function normaliza ($cadena){
        $originales = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ
            ßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŔŕ';
        $modificadas = 'aaaaaaaceeeeiiiidnoooooouuuuy
            bsaaaaaaaceeeeiiiidnoooooouuuyybyRr';
        $cadena = utf8_decode($cadena);
        $cadena = strtr($cadena, utf8_decode($originales), $modificadas);
        $cadena = strtolower($cadena);
        return utf8_encode($cadena);
    }


    public function calcularEquipos ($parametros){
        $datos = DatEtapaEquipo::calcularImporteEquiposPorAnno($parametros);
//pre_r($datos);die('dddd');
        $cuerporeporte = '';

        $encabezados ='<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:0cm;table-layout:fixed;">
                          <tr>';
        $encabezadosImporte ='<tr>';
        $valores = '<tr>';
        //pre_r($datos);die;
        if(!empty($datos))
            foreach($datos as $dato){

                $precioInc = ($dato['precio'])? $dato['precio']:0;
                $preciodivisaInc = ($dato['preciodivisa'])? $dato['preciodivisa']:0;

                $encabezados .='<td colspan="2">'.$dato['denominacion'].'</td>';
                $encabezadosImporte .='<td>Importe</td>
                                       <td>Importe divisa</td>';
                $valores .= '<td>'.number_format($precioInc, '2', '.', '').'</td>
                             <td>'.number_format($preciodivisaInc, '2', '.', '').'</td>';
            }
        else
            return 'No existen equipos en el plan actual';

        $encabezados .='</tr>';
        $encabezadosImporte .='</tr>';
        $valores .= '</tr></table>';
        $cuerporeporte.= $encabezados.$encabezadosImporte.$valores;

        return $cuerporeporte ;
    }

}
