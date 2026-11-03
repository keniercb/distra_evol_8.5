<?php


class DatconsolidacionparametrizacionproductosModel extends BaseModel
{

    private $conexion = null;

    public function __construct($esExterno = false)
    {
        parent::__construct($esExterno);
        $mg = Doctrine_Manager::getInstance();
        $this->conexion = $mg->getCurrentConnection();
    }

    public function obtenerConsolidacionParametrizacionProducto($idconf, $idestructura, $idlineaproducto = null, $idcentrologistico = null, $criterio = null)
    {
        $sql = "SELECT dpp.idindicador, i.numeropieza AS codigo, i.denominacion AS producto, nn.denominacion as lineaproducto,
	dpp.pa as \"p-0\", dpp.cu as \"p-3\", sum(dpp.valorplanificado) as presupuestoplanificado, sum(dpp.valorreal) as presupuestoreal, round(avg(dpp.cmd),4) as \"p-5\", 
	round(avg(dpp.cmde), 4) as \"p-16\", sum(dpp.emin) as \"p-24\", sum(dpp.eminp) as \"p-25\", sum(dpp.emax) as \"p-26\", sum(dpp.emaxp) as \"p-27\", sum(dpp.pp) as \"p-28\", 
	sum(dpp.ppp) as \"p-29\"               
          FROM mod_logabc.dat_consolidacionparametrizacionproductos dpp
          INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = dpp.idindicador
          INNER JOIN mod_datosmaestros.nom_naturaleza nn ON nn.idnaturaleza = i.idnaturaleza
          WHERE dpp.idconfperiodosclasificacionabc = ? AND dpp.idestructura = ?           
          
	    ";

        if (!empty($idlineaproducto)) {
            $sql .= " AND i.idnaturaleza = {$idlineaproducto}";
        }
        if (!empty($idcentrologistico)) {
            $sql .= " AND dpp.idcentrologistico = {$idcentrologistico}";
        }
        if (!empty($criterio)) {
            $sql .= " AND i.numeropieza ilike '%" . $criterio . "%'";
        }

        $sql .= "GROUP BY dpp.idindicador, i.numeropieza, i.denominacion, nn.denominacion, dpp.pa, dpp.cu
                 ORDER BY sum(dpp.valorreal) DESC";

        $r = $this->conexion->fetchAll($sql, array($idconf, $idestructura));

        foreach ($r as &$item){
            $item['p-0'] = round($item['p-0'], 0);
            $item['p-3'] = round($item['p-3'], 2);
            $item['presupuestoreal'] = round($item['presupuestoreal'], 2);
            $item['presupuestoplanificado'] = round($item['presupuestoplanificado'], 2);
            $item['p-24'] = round($item['p-24'], 0);
            $item['p-25'] = round($item['p-25'], 0);
            $item['p-26'] = round($item['p-26'], 0);
            $item['p-27'] = round($item['p-27'], 0);
            $item['p-28'] = round($item['p-28'], 0);
            $item['p-29'] = round($item['p-29'], 0);
        }

        return array('datos' => $r, 'cantidad' => count($r));
    }


    public function consolidarParametrizacionProducto($idestructura, $idconfperiodosclasificacionabc)
    {
        $m = array();
        $m['codigo'] = 1;

        /*Cargo los centros logisticos con sus ueb*/
        $arrCL = $this->cargarCentrosLogisticosyUEB($idestructura);

        if (empty($arrCL)) {
            $m['codigo'] = 3;
            $m['mensaje'] = "Los centros logísticos no están configurados.";
            return $m;
        }

        /*Cargo la configuracion de los parametros que se van a consolidar*/
        $arrPC = $this->cargarParametrosConsolidar($idestructura);

        if (empty($arrPC)) {
            $m['codigo'] = 3;
            $m['mensaje'] = "No existe ningún parámetro configurado para su consolidación.";
            return $m;
        }

        /*Cargo los valores de los parametros a consolidar*/
        $arrValParamsConsolidar = $this->cargarValoresParametrosConsolidar($idconfperiodosclasificacionabc, $arrCL, $arrPC);

        if (empty($arrValParamsConsolidar)) {
            $m['codigo'] = 3;
            $m['mensaje'] = "La parametrización no se ha realizado en las UEB.";
            return $m;
        }

        $arrUEBNoparametrizacion = array();

        try {
            $this->conexion->beginTransaction();
            $sqlDel = "DELETE FROM mod_logabc.dat_consolidacionparametrizacionproductos WHERE idestructura = ? AND idconfperiodosclasificacionabc = ?";
            $this->conexion->execute($sqlDel, array($idestructura, $idconfperiodosclasificacionabc));
            $presupuesto = 0;
            foreach ($arrCL as $idcl => $cl) {
                foreach ($cl as $ueb) {
                    if (array_key_exists($ueb, $arrValParamsConsolidar)) {
                        foreach ($arrValParamsConsolidar[$ueb] as $i){
                            $valorplanificado = $i['pa'] * $i['cu'] * $i['cmde'];
                            $presupuesto = $presupuesto + $valorplanificado;
                            $sqlIns = "INSERT INTO mod_logabc.dat_consolidacionparametrizacionproductos(valorplanificado, valorreal, idestructura, idcentrologistico, 
                                idconfperiodosclasificacionabc, idindicador, idproducto, idueb, pa, cu, cmd, cmde, emin, eminp, emax, emaxp, pp, ppp) 
                                VALUES ({$valorplanificado}, {$valorplanificado}, {$idestructura}, {$idcl}, {$idconfperiodosclasificacionabc},
                                 '{$i['idindicador']}', {$i['idproducto']}, {$ueb}, {$i['pa']}, {$i['cu']}, {$i['cmd']}, {$i['cmde']}, {$i['emin']}, {$i['eminp']}
                                 , {$i['emax']}, {$i['emaxp']}, {$i['pp']}, {$i['ppp']});";
                            $this->conexion->execute($sqlIns);
                        }
                    }
                }
            }

            $this->conexion->commit();
        } catch (Exception $e) {
            $this->conexion->rollback();
        }

        $presupuesto = round($presupuesto, 2);

        $sqlIP = "UPDATE mod_logabc.conf_periodosclasificacionabc SET presupuesto = {$presupuesto}, serecalculopresupuesto = 0
 WHERE idconfperiodosclasificacionabc = {$idconfperiodosclasificacionabc}";
        $this->conexion->execute($sqlIP);

        $m['presupuesto'] = $presupuesto;

        if (!empty($arrUEBNoparametrizacion)) {
            $objABC = new AbcModel();
            $rrUEBs = $objABC->obtenerUEBs($idestructura, false);
            $msg = array();
            foreach ($rrUEBs as $u) {
                if (array_key_exists($u['idestructura'], $arrUEBNoparametrizacion)) {
                    $msg[] = $u['denominacion'];
                }
            }
            $m['codigo'] = 2;
            $m['mensaje'] = " Las siguientes UEB faltan por su parametrización: " . implode(', ', $msg);
        }

        return $m;

    }

    private function cargarCentrosLogisticosyUEB($idestructura)
    {
        $obj = new ConfparametrosinventarioModel();
        $aCL = $obj->obtenerCentrosLogisticos($idestructura);

        $sql = "SELECT * FROM mod_estructuracomp.dat_subordinacion where idnomsubordinacion = -1 AND idpadre <> ?";
        $aUEB = $this->conexion->fetchAll($sql, array($idestructura));

        $r = array();

        foreach ($aCL as $cl) {
            foreach ($aUEB as $u) {
                if ($cl['idcentrologistico'] == $u['idpadre']) {
                    $r[$cl['idcentrologistico']][$u['idhijo']] = $u['idhijo'];
                }
            }
        }

        return $r;
    }

    private function cargarParametrosConsolidar($idestructura)
    {
        $obj = new ConfparametrosinventarioModel();
        $aPC = $obj->obtenerConfiguracionParametrosInventario($idestructura);
        $r = array();
        foreach ($aPC as $p) {
            if ($p['consolida'] == 1) {
                $r[$p['idparametrosinventario']] = $p;
            }
        }

        return $r;
    }

    private function cargarValoresParametrosConsolidar($idconfperiodosclasificacionabc, $arrCentrosLogisticos, $arrParametrosConsolidar = null)
    {
        $arrUEBS = array();
        foreach ($arrCentrosLogisticos as $cl) {
            foreach ($cl as $u) {
                $arrUEBS[] = $u;
            }
        }
        $objP = new DatparametrizacionproductosModel();
        return $objP->obtenerParametrizacionProductosConsolidar($idconfperiodosclasificacionabc, $arrUEBS);

    }

    public function obtenerNaturalezasConsolidacion($idconf)
    {
        $sql = "SELECT n.idnaturaleza, n.denominacion as naturaleza, SUM(dcpp.valorreal) as presupuestoplan, 0 as presupuesto
          FROM mod_logabc.dat_consolidacionparametrizacionproductos dcpp
          INNER JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = dcpp.idindicador)
          INNER JOIN mod_datosmaestros.nom_naturaleza n ON (n.idnaturaleza = i.idnaturaleza)
          WHERE dcpp.idconfperiodosclasificacionabc = ?
          GROUP BY n.idnaturaleza, n.denominacion";

        $r =  $this->conexion->fetchAll($sql, array($idconf));
        foreach ($r as &$p){
            $p['presupuestoplan'] = round($p['presupuestoplan'], 2);
        }
        return $r;
    }


    public function recalcularPresupuesto($idconf, $idestructura, $arrPresupuesto, $recalculo = 1){

        $lineas = array();
        $presupuestos = array();
        foreach ($arrPresupuesto as $p){
            $lineas[] = $p->idnaturaleza;
            $presupuestos[$p->idnaturaleza] = $p->presupuesto;
        }

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();


        /*Busco los productos consolidados, agrupo por lineas de productos y consolido*/
        $sqlC = "SELECT i.idnaturaleza, dpp.idindicador, dpp.idproducto, dpp.pa, dpp.cu, count(dpp.idindicador) as cantidad, sum(dpp.valorplanificado) as valorplanificado, 
                sum(dpp.cmd) as cmd, sum(dpp.cmde) as cmde, sum(dpp.emin) as emin, sum(dpp.eminp) as eminp, sum(dpp.emax) as emax, 
                sum(dpp.emaxp) as emaxp, sum(dpp.pp) as pp, sum(dpp.ppp) as ppp               
          FROM mod_logabc.dat_consolidacionparametrizacionproductos dpp
          INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = dpp.idindicador
          WHERE dpp.idconfperiodosclasificacionabc = ? AND dpp.idestructura = ?           
          GROUP BY dpp.idindicador, dpp.idproducto, i.idnaturaleza, dpp.pa, dpp.cu
	      ORDER BY i.idnaturaleza, dpp.idindicador";
        $rC = $conn->fetchAll($sqlC, array($idconf, $idestructura));

        $obj = new ConfparametrosinventarioModel();
        $aparametros = $obj->obtenerConfiguracionParametrosInventario($idestructura);
        $arrConfParam = array();
        foreach ($aparametros as $p) {
            if ($p['consolida'] == 1) {
                $arrConfParam[$p['idparametrosinventario']] = $p;
            }
        }
        $arrConsolidacion = array();
        foreach ($rC as $v) {
            foreach ($arrConfParam as $p) {
                $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['idindicador'] = $v['idindicador'];
                $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['idproducto'] = $v['idproducto'];
                $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['valorplanificado'] = $v['valorplanificado'];
                $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['valorreal'] = $v['valorplanificado'];
                $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['cantidad'] = $v['cantidad'];

                if ($p['tipoconsolidacion'] == 1) {/*Suma*/
                    if ($p['idparametrosinventario'] == 24) {
                        $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['emin'] = $v['emin'];
                    }
                    if ($p['idparametrosinventario'] == 25) {
                        $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['eminp'] = $v['eminp'];
                    }
                    if ($p['idparametrosinventario'] == 26) {
                        $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['emax'] = $v['emax'];
                    }
                    if ($p['idparametrosinventario'] == 27) {
                        $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['emaxp'] = $v['emaxp'];
                    }
                    if ($p['idparametrosinventario'] == 28) {
                        $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['pp'] = $v['pp'];
                    }
                    if ($p['idparametrosinventario'] == 29) {
                        $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['ppp'] = $v['ppp'];
                    }

                } else if ($p['tipoconsolidacion'] == 2) {/*Promedio*/
                    if ($p['idparametrosinventario'] == 5) {
                        $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['cmd'] = round($v['cmd'] / $v['cantidad'], $p['lugaresdecimales']);
                    }
                    if ($p['idparametrosinventario'] == 16) {
                        $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['cmde'] = round($v['cmde'] / $v['cantidad'], $p['lugaresdecimales']);
                    }
                } else {
                    if ($p['idparametrosinventario'] == 0) {
                        $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['pa'] = round($v['pa'], $p['lugaresdecimales']);
                    }
                    if ($p['idparametrosinventario'] == 3) {
                        $arrConsolidacion[$v['idnaturaleza']][$v['idindicador']]['cu'] = round($v['cu'], $p['lugaresdecimales']);
                    }
                }
            }
        }

        $sqlC = "SELECT * FROM mod_logabc.dat_consolidacionparametrizacionproductos
          WHERE idconfperiodosclasificacionabc = ? AND idestructura = ?           
	      ORDER BY idindicador";
        $rCD = $conn->fetchAll($sqlC, array($idconf, $idestructura));
        $arrConsolidacionDesglozado  = array();
        foreach ($rCD as $c){
            $arrConsolidacionDesglozado[$c['idueb']][$c['idindicador']] = $c;
        }

        /*Busco el presupuesto planificado y el real*/
        $presupuestoPlanificado = 0;
        $presupuestoReal = 0;
        $sqlIP = "SELECT presupuesto FROM  mod_logabc.conf_periodosclasificacionabc WHERE idconfperiodosclasificacionabc = ?";
        $rPresup = $conn->fetchAll($sqlIP, array($idconf));
        $presupuestoPlanificado = $rPresup[0]['presupuesto'];
        $presupuestoReal = array_sum($presupuestos);

        if($recalculo == 1){/*Recalcular para todos los productos*/
            /*Calculo el porciento de cada indicador por linea para la distribucion del nuevo presupuesto*/
            $this->recalcularParaTodos($arrConsolidacion, $presupuestos);

        }else{/*Recalcular para los productos de mayor peso o prioridad*/

            /*Busco los productos consolidados de cada linea ordenados por su peso en forma descendente*/
            $sql = "SELECT dc.idindicador, dc.idlineaproducto, avg(dc.peso)       
                  FROM 
                    mod_logabc.dat_clasificacionabcproductos dc
                  WHERE 
                    dc.idconfperiodosclasificacionabc = 3 
                    AND dc.idlineaproducto IN (".implode(',', $lineas).")
                    AND dc.peso > 0 
                    AND dc.idindicador IN (SELECT c.idindicador FROM mod_logabc.dat_consolidacionparametrizacionproductos c WHERE c.idconfperiodosclasificacionabc = ? AND c.idestructura = ?) 
                  GROUP BY 
                    dc.idindicador, dc.idlineaproducto
                  ORDER BY 
                    avg(dc.peso) DESC";

            $rIndLin = $conn->fetchAll($sql, array($idconf, $idestructura));

            $arrIndLineas = array();
            foreach ($rIndLin as $l){
                $arrIndLineas[$l['idlineaproducto']][] = $l['idindicador'];
            }

            $presupuestosPlanificados = array();
            /*Calculo el presupuesto de cada linea y cambio los valores reales a cero*/
            foreach ($arrConsolidacion as $l => &$indicadores){
                $presupuestosPlanificados[$l] = 0;
                foreach ($indicadores as $i => &$in){
                    $in['valorreal'] = 0.00;
                    $presupuestosPlanificados[$l] += $in['valorplanificado'];
                }
            }

            foreach ($arrIndLineas as $l => $indic){
                /*Presupuesto planificado para la linea es mayor que el que se va a recalcular*/
                $pLinea = $presupuestos[$l];
                if($presupuestosPlanificados[$l] > $pLinea){
                    foreach ($indic as $vi){
                        if(($pLinea - $arrConsolidacion[$l][$vi]['valorplanificado']) < 0){
                            break;
                        }
                        $arrConsolidacion[$l][$vi]['valorreal'] = $arrConsolidacion[$l][$vi]['valorplanificado'];
                        $pLinea -= $arrConsolidacion[$l][$vi]['valorplanificado'];
                    }
                }else /*Presupuesto planificado para la linea es menor que el que se va a recalcular*/
                    if($presupuestosPlanificados[$l] < $pLinea){
                        $this->recalcularParaLinea($arrConsolidacion[$l], $pLinea);

                }else{/*El mismo presupuesto*/
                        foreach ($arrConsolidacion as $l => &$indics){
                            foreach ($indics as $index => &$indc){
                                $indc['valorreal'] = $indc['valorplanificado'];
                            }
                        }
                    }

            }

        }

        /*Redistribuyo el presupuesto real para cada indicador en cada ueb*/
        foreach ($arrConsolidacion as $l => $indicadores){
            foreach ($indicadores as $i1 => $indic){
                    foreach ($arrConsolidacionDesglozado as $ueb => $products){
                        if(array_key_exists($i1, $products)){
                            if($indic['cantidad'] > 1 && !empty($indic['valorreal'])){
                                /*Busco el porciento que representa el presupuesto de ese producto en esa ueb para distribuir el valor real*/
                                $porcientoProducto = $products[$i1]['valorplanificado']/$indic['valorplanificado'];
                                $arrConsolidacionDesglozado[$ueb][$i1]['valorreal'] = round($indic['valorreal'] * $porcientoProducto, 4);
                            }else{
                                $arrConsolidacionDesglozado[$ueb][$i1]['valorreal'] = $indic['valorreal'];
                            }
                            /*Recalculo el Consumo Medio Diario Deseado(CMDE) en base al valor real*/
                            if(empty($arrConsolidacionDesglozado[$ueb][$i1]['valorreal'])){
                                $arrConsolidacionDesglozado[$ueb][$i1]['cmde'] = 0.0000;
                            }else{
                                $arrConsolidacionDesglozado[$ueb][$i1]['cmde'] =
                                    $arrConsolidacionDesglozado[$ueb][$i1]['valorreal']/($arrConsolidacionDesglozado[$ueb][$i1]['pa'] * $arrConsolidacionDesglozado[$ueb][$i1]['cu']);
                                $arrConsolidacionDesglozado[$ueb][$i1]['cmde'] = round($arrConsolidacionDesglozado[$ueb][$i1]['cmde'], 4);
                            }
                        }
                    }
            }
        }



        /*Actualizo los productos consolidados con los valores calculados*/
        try {
            $conn->beginTransaction();
            foreach ($arrConsolidacionDesglozado as $ueb => $prts) {
                foreach ($prts as $pr) {
                    $sqlU = "UPDATE mod_logabc.dat_consolidacionparametrizacionproductos SET valorreal = {$pr['valorreal']}, cmde = {$pr['cmde']} 
                            WHERE idconsolidacionparametrizacionproductos = {$pr['idconsolidacionparametrizacionproductos']}";

                    $conn->execute($sqlU);
                }
            }

            $sqlIP = "UPDATE mod_logabc.conf_periodosclasificacionabc SET presupuesto = {$presupuestoReal}, serecalculopresupuesto = 1
 WHERE idconfperiodosclasificacionabc = {$idconf}";
            $this->conexion->execute($sqlIP);

            $conn->commit();
        }catch (Exception $e){
            $conn->rollback();
            return array('codigo' => 3, 'mensaje' => $e->getMessage());
        }

        return array('codigo' => 1, 'presupuesto' => $presupuestoReal);

    }

    private function recalcularParaTodos(&$arrConsolidacion, &$presupuestos){
        $arrPorcientoDistribucion = array();
        foreach ($arrConsolidacion as $l => $indicadores) {
            $arrPorcientoDistribucion[$l]['presupuesto'] = 0;
            foreach ($indicadores as $ind) {
                $arrPorcientoDistribucion[$l]['productos'][$ind['idindicador']]['valorplanificado'] = $ind['valorplanificado'];
                $arrPorcientoDistribucion[$l]['productos'][$ind['idindicador']]['porciento'] = 0;
                $arrPorcientoDistribucion[$l]['presupuesto'] += $ind['valorplanificado'];
            }
        }

        foreach ($arrPorcientoDistribucion as $li => &$productos) {
            foreach ($productos['productos'] as $idind => &$pr) {
                $pr['porciento'] = $pr['valorplanificado'] / $productos['presupuesto'];
                $pr['valorreal'] = round($presupuestos[$li] * $pr['porciento'], 4);
                /*Asigno el valor real en la distribucion al producto*/
                $arrConsolidacion[$li][$idind]['valorreal'] = $pr['valorreal'];
            }
        }

        return $arrPorcientoDistribucion;
    }

    private function recalcularParaLinea(&$arrConsolidacionLinea, $presupuestoLinea){
        $arrPorcientoDistribucion = array();
            $arrPorcientoDistribucion['presupuesto'] = 0;
        foreach ($arrConsolidacionLinea as $ind) {
            $arrPorcientoDistribucion['productos'][$ind['idindicador']]['valorplanificado'] = $ind['valorplanificado'];
            $arrPorcientoDistribucion['productos'][$ind['idindicador']]['porciento'] = 0;
            $arrPorcientoDistribucion['presupuesto'] += $ind['valorplanificado'];
        }

        foreach ($arrPorcientoDistribucion['productos'] as $idind => &$pr) {
            $pr['porciento'] = $pr['valorplanificado'] / $arrPorcientoDistribucion['presupuesto'];
            $pr['valorreal'] = round($presupuestoLinea * $pr['porciento'], 4);
            /*Asigno el valor real en la distribucion al producto*/
            $arrConsolidacionLinea[$idind]['valorreal'] = $pr['valorreal'];
        }

        return $arrPorcientoDistribucion;
    }

    public function reparametrizacionProductosConsolidados($periodo, $idestructura){
        $idconf = $periodo[0]['idconfperiodosclasificacionabc'];
        $serecalculopresupuesto = $periodo[0]['serecalculopresupuesto'];
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        try {

            $conn->beginTransaction();
            /*Se recalculó el presupuesto*/
            if(!empty($serecalculopresupuesto)){
                /*Busco los productos consolidados para reparametrizarlos*/
                $productosReparametrizar = $this->obtenerConsolidacionRecalculada($idconf, $idestructura, $conn);
                $objRep = new DatparametrizacionproductosModel();
                $objRep->reparametrizarProductos($idconf,  $productosReparametrizar, $conn);

                foreach ($productosReparametrizar as $idagencia => $pp){
                    foreach ($pp as $p){
                        $sqlUp = "UPDATE mod_logabc.dat_consolidacionparametrizacionproductos
                           SET emin={$p['emin']}, eminp={$p['eminp']}, emax={$p['emax']}, emaxp={$p['emaxp']}, pp={$p['pp']}, ppp={$p['ppp']}
                         WHERE idconsolidacionparametrizacionproductos = {$p['idconsolidacionparametrizacionproductos']};";
                        $conn->execute($sqlUp);
                    }
                }

            }

            $conn->execute("UPDATE mod_logabc.conf_periodosclasificacionabc SET cerrado = 1 WHERE idconfperiodosclasificacionabc = {$idconf}");
            $conn->commit();
            return array('codigo' => 1);

        }catch (Exception $e){
            $conn->rollback();
            return array('codigo' => 3, 'mensaje' => $e->getMessage());
        }


    }

    private function obtenerConsolidacionRecalculada($idconf, $idestructura, &$conn){
        $sql = "SELECT *
          FROM mod_logabc.dat_consolidacionparametrizacionproductos 
          WHERE idconfperiodosclasificacionabc = ? AND idestructura = ?;";
        $r = $conn->fetchAll($sql, array($idconf, $idestructura));
        $resultado = array();
        foreach ($r as $v){
            $resultado[$v['idueb']][$v['idproducto']] = $v;
        }

        return $resultado;
    }


}
