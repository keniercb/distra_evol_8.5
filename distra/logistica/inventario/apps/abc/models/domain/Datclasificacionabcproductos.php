<?php

class Datclasificacionabcproductos extends BaseDatclasificacionabcproductos
{

    public function setUp()
    {
        $this->hasMany('Confperiodosclasificacionabc', array('local' => 'idconfperiodosclasificacionabc', 'foreign' => 'idconfperiodosclasificacionabc'));
        $this->hasMany('Nomclasificacionabc', array('local' => 'idclasificacionabc', 'foreign' => 'idclasificacionabc'));
        parent::setUp();
    }

    public function obtenerClasificacionProducto($limit, $start, $idconf, $arrEstructuras, $criterio, $idlineaproducto, $idestructura, $idclasificacionabc)
    {
        $mg = Doctrine_Manager::getInstance();
        $conexion = $mg->getCurrentConnection();

        $sql = "SELECT dc.idclasificacionabcproductos, dc.idestructura, dc.idindicador, nc.denominacion as clasificacion, i.numeropieza AS codigo,
                i.denominacion AS producto, nn.denominacion as lineaproducto, dc.peso, ncm.denominacion as clasificacionmodificada,
                nct.denominacion as clasificaciontotal                
            FROM mod_logabc.dat_clasificacionabcproductos dc 
            INNER JOIN mod_logabc.nom_clasificacionabc nc ON (nc.idclasificacionabc = dc.idclasificacionabc) 
            LEFT JOIN mod_logabc.nom_clasificacionabc nct ON (nct.idclasificacionabc = dc.idclasificacionabctotal)  
            INNER JOIN mod_logabc.nom_clasificacionabc ncm ON (ncm.idclasificacionabc = dc.idclasificacionabcmodificada) 
            INNER JOIN mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = dc.idestructura and deop.idproyecto = 0) 
            INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = dc.idindicador
            INNER JOIN mod_datosmaestros.nom_naturaleza nn ON nn.idnaturaleza = dc.idlineaproducto
            WHERE dc.idconfperiodosclasificacionabc = {$idconf} ";

        if(!empty($criterio)){
            $sql .= " AND i.numeropieza ilike '%".$criterio."%'";
        }
        if(!empty($idlineaproducto)){
            $sql .= " AND dc.idlineaproducto = {$idlineaproducto}";
        }
        if(!empty($idclasificacionabc)){
            $sql .= " AND dc.idclasificacionabc = {$idclasificacionabc}";
        }
        /*if(!empty($idestructura)){
            $sql .= " AND dc.idestructura = {$idestructura}";
        }*/
        if (!empty($arrEstructuras)) {
            $sql .= " AND dc.idestructura IN (" . implode(',', $arrEstructuras) . ")";
        } else {
            $sql .= " AND dc.idestructura = {$idestructura}";
        }

        $sql .= " order by dc.peso DESC";

        $r = $conexion->fetchAll($sql);

        if(empty($r)){
            return array('datos' => array(), 'cantidad' => 0);
        }
        /*Creo el array con las uebs*/
        $resultado = array();
        $r1 = array();
        $idorgano = ZendExt_GlobalConcept::getInstance()->Estructura->idorgano;
        foreach ($r as $v) {
             foreach ($arrEstructuras as $e) {
                 $resultado[$v['idindicador']]['codigo'] = $v['codigo'];
                 $resultado[$v['idindicador']]['idindicador'] = $v['idindicador'];
                 $resultado[$v['idindicador']]['producto'] = $v['producto'];
                 $resultado[$v['idindicador']]['lineaproducto'] = $v['lineaproducto'];
                 if($idorgano == -2){
                     $resultado[$v['idindicador']]['clasificaciontotal'] = $v['clasificacionmodificada'];
                 }else{
                     $resultado[$v['idindicador']]['clasificaciontotal'] = $v['clasificaciontotal'];
                 }

                 $resultado[$v['idindicador']]['c-' . $e] = '';
                 $resultado[$v['idindicador']]['m-' . $e] = '';
                 $resultado[$v['idindicador']]['id-' . $e] = '';
                 //$aC[] = $v['idindicador'];
            }
             $r1[$v['idindicador']][$v['idestructura']] = $v;
        }

        /*Lleno los valores de los pesos y clasificacion*/
        foreach ($resultado as &$p1) {
            if(array_key_exists($p1['idindicador'], $r1)){
                foreach ($r1[$p1['idindicador']] as $est){
                    $p1['c-' . $est['idestructura']] = $est['clasificacion'];
                    $p1['m-' . $est['idestructura']] = $est['clasificacionmodificada'];
                    $p1['id-' . $est['idestructura']] = $est['idclasificacionabcproductos'];
                }
            }
        }

        return array('datos' => array_slice($resultado, $start, $limit), 'cantidad' => count($resultado));

    }

    public function obtenerClasificacionProductoTotal($idconf, $arrEstructuras)
    {
        $mg = Doctrine_Manager::getInstance();
        $conexion = $mg->getCurrentConnection();
        $sql = "SELECT idclasificacionabcproductos, idindicador, idclasificacionabcmodificada, idclasificacionabctotal
            FROM mod_logabc.dat_clasificacionabcproductos 
            WHERE idconfperiodosclasificacionabc = {$idconf} ";

        $sql .= " AND idestructura IN (" . implode(',', $arrEstructuras) . ")";
        $rr = $conexion->fetchAll($sql);

        $resultado = array();
        foreach ($rr as $v) {
            $resultado[$v['idindicador']]['idindicador'] = $v['idindicador'];
            $resultado[$v['idindicador']]['cantidadA'] = 0;
            $resultado[$v['idindicador']]['cantidadB'] = 0;
            $resultado[$v['idindicador']]['cantidadC'] = 0;
            $resultado[$v['idindicador']]['cantidadNC'] = 0;
        }

        foreach ($rr as $v) {
            if($v['idclasificacionabcmodificada'] == 1) {
                $resultado[$v['idindicador']]['cantidadA'] += 1;
            }else if($v['idclasificacionabcmodificada'] == 2) {
                $resultado[$v['idindicador']]['cantidadB'] += 1;
            }else if($v['idclasificacionabcmodificada'] == 3) {
                $resultado[$v['idindicador']]['cantidadC'] += 1;
            }else{
                $resultado[$v['idindicador']]['cantidadNC'] += 1;
            }
        }

        foreach ($resultado as &$r){
            if(empty($r['cantidadA']) && empty($r['cantidadB']) && empty($r['cantidadC']) && empty($r['cantidadNC'])){
                $r['idclasificacionabctotal'] = 4;
            }else if(!empty($r['cantidadA']) && empty($r['cantidadB']) && empty($r['cantidadC'])){
                $r['idclasificacionabctotal'] = 1;
            }else if(empty($r['cantidadA']) && !empty($r['cantidadB']) && empty($r['cantidadC'])){
                $r['idclasificacionabctotal'] = 2;
            }else if(empty($r['cantidadA']) && empty($r['cantidadB']) && !empty($r['cantidadC'])){
                $r['idclasificacionabctotal'] = 3;
            }else if(empty($r['cantidadA']) && empty($r['cantidadB']) && empty($r['cantidadC'])){
                $r['idclasificacionabctotal'] = 4;
            }else if($r['cantidadA'] >= $r['cantidadB'] && $r['cantidadA'] >= $r['cantidadC'] && $r['cantidadA'] >= $r['cantidadNC']){
                $r['idclasificacionabctotal'] = 1;
            }else if($r['cantidadB'] >= $r['cantidadA'] && $r['cantidadB'] >= $r['cantidadC'] && $r['cantidadB'] >= $r['cantidadNC']){
                $r['idclasificacionabctotal'] = 2;
            }else if($r['cantidadC'] >= $r['cantidadA'] && $r['cantidadC'] >= $r['cantidadB'] && $r['cantidadC'] >= $r['cantidadNC']){
                $r['idclasificacionabctotal'] = 3;
            }else if($r['cantidadA'] >= $r['cantidadB'] || ($r['cantidadA'] >= $r['cantidadC'] && $r['cantidadA'] >= $r['cantidadNC'])){
                $r['idclasificacionabctotal'] = 1;
            }else if($r['cantidadA'] >= $r['cantidadC'] || ($r['cantidadA'] >= $r['cantidadB'] && $r['cantidadA'] >= $r['cantidadNC'])){
                $r['idclasificacionabctotal'] = 1;
            }else if($r['cantidadA'] >= $r['cantidadNC'] || ($r['cantidadA'] >= $r['cantidadB'] && $r['cantidadA'] >= $r['cantidadC'])){
                $r['idclasificacionabctotal'] = 1;
            }else if($r['cantidadB'] >= $r['cantidadA'] || ($r['cantidadB'] >= $r['cantidadC'] && $r['cantidadB'] >= $r['cantidadNC'])){
                $r['idclasificacionabctotal'] = 2;
            }else if($r['cantidadB'] >= $r['cantidadC'] || ($r['cantidadB'] >= $r['cantidadA'] && $r['cantidadB'] >= $r['cantidadNC'])){
                $r['idclasificacionabctotal'] = 2;
            }else if($r['cantidadB'] >= $r['cantidadNC'] || ($r['cantidadB'] >= $r['cantidadA'] && $r['cantidadB'] >= $r['cantidadC'])){
                $r['idclasificacionabctotal'] = 2;
            }else if($r['cantidadC'] >= $r['cantidadA'] || ($r['cantidadC'] >= $r['cantidadB'] && $r['cantidadC'] >= $r['cantidadNC'])){
                $r['idclasificacionabctotal'] = 3;
            }else if($r['cantidadC'] >= $r['cantidadB'] || ($r['cantidadC'] >= $r['cantidadA'] && $r['cantidadC'] >= $r['cantidadNC'])){
                $r['idclasificacionabctotal'] = 3;
            }else if($r['cantidadC'] >= $r['cantidadNC'] || ($r['cantidadC'] >= $r['cantidadA'] && $r['cantidadC'] >= $r['cantidadB'])){
                $r['idclasificacionabctotal'] = 3;
            }else{
                $r['idclasificacionabctotal'] = 4;
            }
        }

        foreach ($rr as &$vr) {
            $vr['idclasificacionabctotal'] = $resultado[$vr['idindicador']]['idclasificacionabctotal'];
        }

        return $rr;

    }

    public function calcularClasificacionProductoTotal(&$arrProd)
    {

        $resultado = array();
        foreach ($arrProd as $v) {
            $resultado[$v[3]]['idindicador'] = $v[3];
            $resultado[$v[3]]['cantidadA'] = 0;
            $resultado[$v[3]]['cantidadB'] = 0;
            $resultado[$v[3]]['cantidadC'] = 0;
            $resultado[$v[3]]['cantidadNC'] = 0;
        }

        foreach ($arrProd as $v) {
            if($v[6] == 1) {
                $resultado[$v[3]]['cantidadA'] += 1;
            }else if($v[6] == 2) {
                $resultado[$v[3]]['cantidadB'] += 1;
            }else if($v[6] == 3) {
                $resultado[$v[3]]['cantidadC'] += 1;
            }else{
                $resultado[$v[3]]['cantidadNC'] += 1;
            }
        }

        foreach ($resultado as &$r){
            if(empty($r['cantidadA']) && empty($r['cantidadB']) && empty($r['cantidadC']) && empty($r['cantidadNC'])){
                $r['clasificaciontotal'] = 4;
            }else if(!empty($r['cantidadA']) && empty($r['cantidadB']) && empty($r['cantidadC'])){
                $r['clasificaciontotal'] = 1;
            }else if(empty($r['cantidadA']) && !empty($r['cantidadB']) && empty($r['cantidadC'])){
                $r['clasificaciontotal'] = 2;
            }else if(empty($r['cantidadA']) && empty($r['cantidadB']) && !empty($r['cantidadC'])){
                $r['clasificaciontotal'] = 3;
            }else if(empty($r['cantidadA']) && empty($r['cantidadB']) && empty($r['cantidadC'])){
                $r['clasificaciontotal'] = 4;
            }else if($r['cantidadA'] >= $r['cantidadB'] && $r['cantidadA'] >= $r['cantidadC'] && $r['cantidadA'] >= $r['cantidadNC']){
                $r['clasificaciontotal'] = 1;
            }else if($r['cantidadB'] >= $r['cantidadA'] && $r['cantidadB'] >= $r['cantidadC'] && $r['cantidadB'] >= $r['cantidadNC']){
                $r['clasificaciontotal'] = 2;
            }else if($r['cantidadC'] >= $r['cantidadA'] && $r['cantidadC'] >= $r['cantidadB'] && $r['cantidadC'] >= $r['cantidadNC']){
                $r['clasificaciontotal'] = 3;
            }else if($r['cantidadA'] >= $r['cantidadB'] || ($r['cantidadA'] >= $r['cantidadC'] && $r['cantidadA'] >= $r['cantidadNC'])){
                $r['clasificaciontotal'] = 1;
            }else if($r['cantidadA'] >= $r['cantidadC'] || ($r['cantidadA'] >= $r['cantidadB'] && $r['cantidadA'] >= $r['cantidadNC'])){
                $r['clasificaciontotal'] = 1;
            }else if($r['cantidadA'] >= $r['cantidadNC'] || ($r['cantidadA'] >= $r['cantidadB'] && $r['cantidadA'] >= $r['cantidadC'])){
                $r['clasificaciontotal'] = 1;
            }else if($r['cantidadB'] >= $r['cantidadA'] || ($r['cantidadB'] >= $r['cantidadC'] && $r['cantidadB'] >= $r['cantidadNC'])){
                $r['clasificaciontotal'] = 2;
            }else if($r['cantidadB'] >= $r['cantidadC'] || ($r['cantidadB'] >= $r['cantidadA'] && $r['cantidadB'] >= $r['cantidadNC'])){
                $r['clasificaciontotal'] = 2;
            }else if($r['cantidadB'] >= $r['cantidadNC'] || ($r['cantidadB'] >= $r['cantidadA'] && $r['cantidadB'] >= $r['cantidadC'])){
                $r['clasificaciontotal'] = 2;
            }else if($r['cantidadC'] >= $r['cantidadA'] || ($r['cantidadC'] >= $r['cantidadB'] && $r['cantidadC'] >= $r['cantidadNC'])){
                $r['clasificaciontotal'] = 3;
            }else if($r['cantidadC'] >= $r['cantidadB'] || ($r['cantidadC'] >= $r['cantidadA'] && $r['cantidadC'] >= $r['cantidadNC'])){
                $r['clasificaciontotal'] = 3;
            }else if($r['cantidadC'] >= $r['cantidadNC'] || ($r['cantidadC'] >= $r['cantidadA'] && $r['cantidadC'] >= $r['cantidadB'])){
                $r['clasificaciontotal'] = 3;
            }else{
                $r['clasificaciontotal'] = 4;
            }
        }

        foreach ($arrProd as &$vr) {
            $vr[7] = $resultado[$vr[3]]['clasificaciontotal'];
        }
    }


}
