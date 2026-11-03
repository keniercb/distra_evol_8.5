<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 04/11/2015
 * Time: 12:39
 */
class ResumenRtdModel extends ZendExt_Model {

    public function __construct() {
        parent::ZendExt_Model();
    }

    public function getResumenAnual($idgrupodescanso, $idregimentrabajo,$anno) {  
        $result = ResumenRtdModel::getTotalMes($idgrupodescanso, $idregimentrabajo,$anno);
        $cant = 0;
        foreach ($result AS $k => $v) {
            $cant += $v['cantidad'];
        }
        $resumen['total'] = $cant;
        $resumen['promedio'] = round($resumen['total'] / 12, 2);//print_r(round($resumen['promedio']/12,2));die;
        return $resumen;
    }

    public function getTotalMes($idgrupodescanso, $idregimentrabajo,$anno) {
        $totalmes = Array();
        $totalmes[1]['mes'] = "Enero";
        $totalmes[2]['mes'] = "Febrero";
        $totalmes[3]['mes'] = "Marzo";
        $totalmes[4]['mes'] = "Abril";
        $totalmes[5]['mes'] = "Mayo";
        $totalmes[6]['mes'] = "Junio";
        $totalmes[7]['mes'] = "Julio";
        $totalmes[8]['mes'] = "Agosto";
        $totalmes[9]['mes'] = "Septiembre";
        $totalmes[10]['mes'] = "Octubre";
        $totalmes[11]['mes'] = "Noviembre";
        $totalmes[12]['mes'] = "Diciembre";

        $objRegimen = new NomRegimentrabajo();
        $regimen = $objRegimen->getById($idregimentrabajo)->toArray();
        if($regimen['tipofondotiempo'] == 3){
            foreach ($totalmes AS $i => $val) {
                if($regimen['fondotiempo'] != null){
                    $totalmes[$i]['cantidad'] = $regimen['fondotiempo'];
                }else{
                    $totalmes[$i]['cantidad'] = null;
                }
            }
        }
        $periodo = DatPeriodomes::getPeriodo($anno);
        foreach($totalmes AS $k => $v) {
            $fdesde = "";
            $fhasta = "";
            if($periodo!=null){
                $fdesde = $periodo[$k - 1]['fdesde'];
                $fhasta = $periodo[$k - 1]['fhasta'];
            }else{
                $cantDiasMes = date('t', mktime(0, 0, 0, $k, 1, $anno));
                $mes = $k;
                if ($mes < 10) {
                    $mes1 = '0' . $mes;
                } else {
                    $mes1 = $mes;
                }
                $fdesde = '01/'.$mes.'/'.$anno;
                $fhasta = $cantDiasMes.'/'.$mes.'/'.$anno;
            }
            if($regimen['tipofondotiempo'] == 1){
                $suma = ConfCalendario::HrsByDateRange($fdesde, $fhasta, $idgrupodescanso);
                if($suma[0]['sum'] != null){
                    $cant  = explode(':',$suma[0]['sum']);
                    $totalmes[$k]['cantidad'] = $cant[0].':'.$cant[1];
                }else{
                    $totalmes[$i]['cantidad'] = null;
                }
            }else if($regimen['tipofondotiempo'] == 2){
                $cont = 0;
                $configuracion = ConfCalendario::getCalendarioByGrupoandYear($idgrupodescanso,$anno);
                foreach ($configuracion AS $x => $j) {
                    $cont+=$j['horas'];
                }
                foreach ($totalmes AS $i => $val) {
                    $totalmes[$i]['cantidad'] = round($cont/12,2);
                }
            }
        }
        $resultado = Array();
        foreach($totalmes AS $k => $v) {
            $aux['key'] = $k;
            $aux['mes'] = $totalmes[$k]['mes'];
            $aux['cantidad'] = $totalmes[$k]['cantidad'];
            array_push($resultado, $aux);
        }
        return $resultado;
    }

    public function getResumenAnualQuincenal($idgrupodescanso, $idregimentrabajo,$anno) {
        $result = ResumenRtdModel::getTotalQuincena($idgrupodescanso, $idregimentrabajo,$anno);
        $cant = 0;
        foreach ($result AS $k => $v) {
            $cant += $v['primquincena'] + $v['segquincena'];
        }
        $resumen['total'] = $cant;
        $resumen['promedio'] = round($resumen['total'] / 12, 2);
        return $resumen;
    }

    public function getTotalQuincena($idgrupodescanso, $idregimentrabajo,$anno) {
        $totalmes = Array();
        $totalmes[1]['mes'] = "Enero";
        $totalmes[2]['mes'] = "Febrero";
        $totalmes[3]['mes'] = "Marzo";
        $totalmes[4]['mes'] = "Abril";
        $totalmes[5]['mes'] = "Mayo";
        $totalmes[6]['mes'] = "Junio";
        $totalmes[7]['mes'] = "Julio";
        $totalmes[8]['mes'] = "Agosto";
        $totalmes[9]['mes'] = "Septiembre";
        $totalmes[10]['mes'] = "Octubre";
        $totalmes[11]['mes'] = "Noviembre";
        $totalmes[12]['mes'] = "Diciembre";

        $objRegimen = new NomRegimentrabajo();
        $regimen = $objRegimen->getById($idregimentrabajo)->toArray();
        if($regimen['tipofondotiempo'] == 3){
            foreach ($totalmes AS $i => $val) {
                $totalmes[$i]['primquincena'] = round($regimen['fondotiempo']/2,2);
                $totalmes[$i]['segquincena'] = round($regimen['fondotiempo']/2,2);
                $totalmes[$i]['cantidad'] = $regimen['fondotiempo'];
            }
        }
        $periodo = DatPeriodoquincena::getPeriodo($anno);
        foreach($totalmes AS $k => $v) {
            $fdesde = "";
            $fhasta = "";
            if($periodo!=null){
                $fdesdeprimquincena = $periodo[$k - 1]['fdesdeprimquincena'];
                $fhastaprimquincena = $periodo[$k - 1]['fhastaprimquincena'];

                $fdesdesegquincena = $periodo[$k - 1]['fdesdesegquincena'];
                $fhastasegquincena = $periodo[$k - 1]['fhastasegquincena'];
            }
            if($regimen['tipofondotiempo'] == 1){
                $sumaprim = ConfCalendario::HrsByDateRange($fdesdeprimquincena, $fhastaprimquincena, $idgrupodescanso);
                $sumaseg = ConfCalendario::HrsByDateRange($fdesdesegquincena, $fhastasegquincena, $idgrupodescanso);
                $totalmes[$k]['primquincena'] = $sumaprim[0]['sum'];
                $totalmes[$k]['segquincena'] = $sumaseg[0]['sum'];
                $totalmes[$k]['cantidad'] = $sumaprim[0]['sum'] + $sumaseg[0]['sum'];
            }else if($regimen['tipofondotiempo'] == 2){
                $cont = 0;
                $configuracion = ConfCalendario::getCalendarioByGrupoandYear($idgrupodescanso,$anno);
                foreach ($configuracion AS $x => $j) {
                    $cont+=$j['horas'];
                }
                foreach ($totalmes AS $i => $val) {
                    $totalmes[$i]['cantidad'] = round($cont/12,2);
                    $totalmes[$i]['primquincena'] = round($totalmes[$i]['cantidad']/2,2);
                    $totalmes[$i]['segquincena'] = round($totalmes[$i]['cantidad']/2,2);
                }
            }
        }
        $resultado = Array();
        foreach($totalmes AS $k => $v) {
            $aux['key'] = $k;
            $aux['mes'] = $totalmes[$k]['mes'];
            $aux['primquincena'] = $totalmes[$k]['primquincena'];
            $aux['segquincena'] = $totalmes[$k]['segquincena'];
            $aux['cantidad'] = $totalmes[$k]['cantidad'];

            array_push($resultado, $aux);
        }
        return $resultado;
    }

    //DEVUELVE EL TOTAL DE HORAS POR MESES PARA EL RANGO DE FECHAS
    public function getTotalMesRangos($anno) {
        $totalmes = Array();
        $totalmes[1]['mes'] = "Enero";
        $totalmes[2]['mes'] = "Febrero";
        $totalmes[3]['mes'] = "Marzo";
        $totalmes[4]['mes'] = "Abril";
        $totalmes[5]['mes'] = "Mayo";
        $totalmes[6]['mes'] = "Junio";
        $totalmes[7]['mes'] = "Julio";
        $totalmes[8]['mes'] = "Agosto";
        $totalmes[9]['mes'] = "Septiembre";
        $totalmes[10]['mes'] = "Octubre";
        $totalmes[11]['mes'] = "Noviembre";
        $totalmes[12]['mes'] = "Diciembre";

        $resultado = Array();
        foreach($totalmes AS $k => $v) {
            $periodo = DatPeriodomes::getPeriodoMes($k,$anno);
            $aux['key'] = $k;
            $aux['mes'] = $totalmes[$k]['mes'];
            $aux['desde'] = $periodo[0]['fdesde'];
            $aux['hasta'] = $periodo[0]['fhasta'];
            array_push($resultado, $aux);
        }
        return $resultado;
    }

    //DEVUELVE EL TOTAL DE HORAS POR MESES PARA EL RANGO DE FECHAS QUINCENAL
    public function getTotalRangosQuincenal($anno) {
        $totalmes = Array();
        $totalmes[1]['mes'] = "Enero";
        $totalmes[2]['mes'] = "Febrero";
        $totalmes[3]['mes'] = "Marzo";
        $totalmes[4]['mes'] = "Abril";
        $totalmes[5]['mes'] = "Mayo";
        $totalmes[6]['mes'] = "Junio";
        $totalmes[7]['mes'] = "Julio";
        $totalmes[8]['mes'] = "Agosto";
        $totalmes[9]['mes'] = "Septiembre";
        $totalmes[10]['mes'] = "Octubre";
        $totalmes[11]['mes'] = "Noviembre";
        $totalmes[12]['mes'] = "Diciembre";

        $resultado = Array();
        foreach($totalmes AS $k => $v) {
            $periodo = DatPeriodoquincena::getPeriodoQuincenal($k,$anno);
            $aux['key'] = $k;
            $aux['mes'] = $totalmes[$k]['mes'];
            $aux['desdeprimquincena'] = $periodo[0]['fdesdeprimquincena'];
            $aux['hastaprimquincena'] = $periodo[0]['fhastaprimquincena'];
            $aux['desdesegquincena'] = $periodo[0]['fdesdesegquincena'];
            $aux['hastasegquincena'] = $periodo[0]['fhastasegquincena'];
            array_push($resultado, $aux);
        }
        return $resultado;
    }
}