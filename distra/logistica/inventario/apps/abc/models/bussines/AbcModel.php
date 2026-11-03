<?php


class AbcModel extends BaseModel
{

    private $conexion = null;

    public function __construct($esExterno = false)
    {
        parent::__construct($esExterno);
        $mg = Doctrine_Manager::getInstance();
        $this->conexion = $mg->getCurrentConnection();
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");
    }

    public function obtenerUEBsDepositos($fechainicio, $fechafin, $arrDepostios, $arrNaturalezas)
    {
        $sql = "SELECT DISTINCT rpc.idestructura, deop.denominacion FROM mod_logfacturacion.rpt_facturacion_abc rpc
                INNER JOIN mod_estructuracomp.dat_estructuraop deop ON rpc.idestructura = deop.idestructuraop 
                WHERE (fecha >= '{$fechainicio}'::date AND fecha <= '{$fechafin}'::date)
               AND rpc.iddeposito IN(".implode(',', $arrDepostios).") AND rpc.idlineaproducto IN (".implode(',', $arrNaturalezas).");";
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");

        return $this->conexion->fetchAll($sql);

    }

    public function obtenerUEBsPeriodoAnalizar($idconfperiodosclasificacionabc)
    {
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");
        $sql = "SELECT uebs FROM mod_logabc.conf_periodosclasificacionabc WHERE idconfperiodosclasificacionabc = ?;";
        $aP = $this->conexion->fetchAll($sql, array($idconfperiodosclasificacionabc));

        $aUebs  = json_decode($aP[0]['uebs']);
        $aU = array();
        foreach ($aUebs as $u){
            $aU[] = $u;
        }

        $sql = "SELECT DISTINCT idestructuraop as idestructura, denominacion FROM mod_estructuracomp.dat_estructuraop
                WHERE idestructuraop IN (".implode(',', $aU).");";

        return $this->conexion->fetchAll($sql);

    }

    public function obtenerUEBs($idestructura, $soloIds = true)
    {
        $iddominio = ZendExt_GlobalConcept::getInstance()->Perfil->iddominio;
        $r = $this->conexion->fetchAll("select parent_path from mod_estructuracomp.nom_filaestruc where idfila = ?", array($idestructura));
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");
        if (count($r) > 0) {
            $parent_path = $r[0]['parent_path'];
            $sql = "select nfe.idfila as idestructura, deop.denominacion, parent_path, deop.codigo from mod_estructuracomp.nom_filaestruc nfe 
                    inner join mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = nfe.idfila and deop.idproyecto = 0 and deop.idorgano = -2)
                    where (nfe.parent_path operator (public.<@) ?) AND nfe.dominiofila[?]='1' AND nfe.fechafin is null and nfe.idconcepto = 5 ";

            $resultado = $this->conexion->fetchAll($sql, array($parent_path, $iddominio));
            if (!$soloIds) {
                return $resultado;
            }
            $r = array();
            foreach ($resultado as $i => $a) {
                $r[] = $a['idestructura'];
            }

            return $r;
        } else {
            return array();
        }
    }

    public function calcularValores($idestructura, $arrEstructura, $fechainicio, $fechafin, $idconfperiodosclasificacionabc)
    {
        /*Busco los criterios de valoracion configurados para la entidad*/
        $arrCriterios = $this->obtenerCriteriosAplicar($idestructura);
        if (empty($arrCriterios)) {
            return array('codigo' => 2, 'mensaje' => 'No hay criterios de valoraci&oacute;n configurados.');
        }

        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");

        /*Busco las naturalezas y depositos configuradas para la el periodo de clasificacion a analizar*/
        $arN = $this->obtenerLineasProductosPeriodoConfig($idconfperiodosclasificacionabc);
        $lp = json_decode($arN['naturalezas']);
        $depositos = json_decode($arN['depositos']);

        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");

        /*Busco los datos del periodo*/
        $sql = "SELECT idestructura, {$idconfperiodosclasificacionabc} as idconfperiodosclasificacionabc, idindicador, 
                COUNT(idindicador) as valor1, 
                SUM(cantidad) as valor2, 
                SUM(CASE WHEN importe_cup IS NOT NULL THEN importe_cup ELSE 0.00 END) + 
                SUM(CASE WHEN importe_cuc IS NOT NULL THEN importe_cuc ELSE 0.00 END) as valor3 
                FROM mod_logfacturacion.rpt_facturacion_abc 
                WHERE (fecha >= '{$fechainicio}'::date and fecha <= '{$fechafin}'::date) 
                    AND idlineaproducto IN (".implode(',', $lp).")".
                    " AND idestructura IN (" . implode(',', $arrEstructura) . ") ";


        /*Agrego en el where los depositos configurados en el periodo a analizar*/
        if(!empty($depositos)){
            $sql .= " AND iddeposito IN(".implode(',', $depositos).")";
        }
        $sql .= "
                GROUP BY idestructura, idindicador 
                ORDER BY idestructura, idindicador, valor1 DESC;";

        $arrDatos = $this->conexion->fetchAll($sql);
        if (empty($arrDatos)) {
            return array('codigo' => 2, 'mensaje' => 'No hay datos para este per&iacute;odo.');
        }

        try {
            $this->conexion->beginTransaction();
            $sqlElim = "DELETE FROM mod_logabc.dat_valorcriteriosproductos WHERE idconfperiodosclasificacionabc = ?;";
            $this->conexion->execute($sqlElim, array($idconfperiodosclasificacionabc));

            $sqlTrunc = "TRUNCATE TABLE mod_logabc.tmp_dat_productos_nc;";
            $this->conexion->execute($sqlTrunc);

            /*Inserto los valores de los criterios*/
            $insert = "INSERT INTO mod_logabc.dat_valorcriteriosproductos(idestructura, idconfperiodosclasificacionabc, idindicador, valor1, valor2, valor3) ";
            $insert .= $sql;
            $this->conexion->execute($insert);

            $this->conexion->execute("SET enable_indexscan TO TRUE;");
            $this->conexion->execute("SET enable_seqscan TO FALSE;");

            /*Inserto los valores de los criterios de los productos que no tuvieron ventas*/
            $sqlTodosProdNC = "select DISTINCT dp.idestructuracomun, {$idconfperiodosclasificacionabc} as idconfperiodosclasificacionabc,
            dp.idindicador, 0, 0, 0 
            FROM mod_logistica.dat_producto dp
            JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = dp.idindicador
            WHERE idestructura IN (".implode(',', $depositos).") AND i.idnaturaleza IN (".implode(',', $lp).")";

            $sqlTodosProdNC .= " AND dp.idproducto NOT IN (SELECT idproducto 
                FROM mod_logfacturacion.rpt_facturacion_abc 
                WHERE (fecha >= '{$fechainicio}'::date and fecha <= '{$fechafin}'::date) 
                    AND idestructura IN (" . implode(',', $arrEstructura) . ")
                    AND idlineaproducto IN (".implode(',', $lp).")".
                " AND iddeposito IN(".implode(',', $depositos)."))";


            $sqlTodosProdNCTMP = "select DISTINCT dp.idindicador,  dp.idestructuracomun
            FROM mod_logistica.dat_producto dp
            JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = dp.idindicador
            WHERE idestructura IN (".implode(',', $depositos).") AND i.idnaturaleza IN (".implode(',', $lp).")";

            $sqlTodosProdNCTMP .= " AND dp.idproducto NOT IN (SELECT idproducto 
                FROM mod_logfacturacion.rpt_facturacion_abc 
                WHERE (fecha >= '{$fechainicio}'::date and fecha <= '{$fechafin}'::date) 
                    AND idestructura IN (" . implode(',', $arrEstructura) . ")
                    AND idlineaproducto IN (".implode(',', $lp).")".
                " AND iddeposito IN(".implode(',', $depositos)."))";


            $insertNC = "INSERT INTO mod_logabc.dat_valorcriteriosproductos(idestructura, idconfperiodosclasificacionabc, idindicador, valor1, valor2, valor3) ";
            $insertNC .= $sqlTodosProdNC;
            $this->conexion->execute($insertNC);

            $insertNCTMP = "INSERT INTO mod_logabc.tmp_dat_productos_nc(idindicador, idestructura) ";
            $insertNCTMP .= $sqlTodosProdNCTMP;
            $this->conexion->execute($insertNCTMP);

            $this->conexion->commit();
        } catch (Exception $e) {
            $this->conexion->rollback();
            return array('codigo' => 3, 'mensaje' => $e->getMessage());
        }

        return array('codigo' => 1, 'success' => true);


    }

    private function calcularValoresCriterios($criterio, &$datos, $arrEstructura)
    {
        $resultado = array();
        switch ($criterio) {
            case 1:
            {/*Popularidad*/
                foreach ($arrEstructura as $e) {
                    $resultado[$e] = array();
                    $arrP = $datos[$e];
                    $arrContar = array();
                    if (!empty($arrP)) {
                        foreach ($arrP as $p) {
                            $arrContar[] = $p['idproducto'];
                        }
                        $arrPopularidad = array_count_values($arrContar);

                        foreach ($arrPopularidad as $id => $v) {
                            $resultado[$e][$id] = $v;
                        }
                    }
                }
                break;
            }

            case 2:
            {/*Cantidad de unidades vendidas*/
                foreach ($arrEstructura as $e) {
                    $resultado[$e] = array();
                    $arrP = $datos[$e];
                    $arrPopularidad = array();
                    if (!empty($arrP)) {
                        foreach ($arrP as $p) {
                            $arrPopularidad[$p['idproducto']] += $p['cantidad'];
                        }

                        foreach ($arrPopularidad as $id => $v) {
                            $resultado[$e][$id] = $v;
                        }
                    }
                }
                break;
            }

            case 3:
            {/*Importe en ventas CUC*/
                foreach ($arrEstructura as $e) {
                    $resultado[$e] = array();
                    $arrP = $datos[$e];
                    $arrPopularidad = array();
                    if (!empty($arrP)) {
                        foreach ($arrP as $p) {
                            $arrPopularidad[$p['idproducto']] += $p['importe_cuc'];
                        }

                        foreach ($arrPopularidad as $id => $v) {
                            $resultado[$e][$id] = $v;
                        }
                    }
                }
                break;
            }

            case 4:
            {/*Importe en ventas CUP*/
                foreach ($arrEstructura as $e) {
                    $resultado[$e] = array();
                    $arrP = $datos[$e];
                    $arrPopularidad = array();
                    if (!empty($arrP)) {
                        foreach ($arrP as $p) {
                            $arrPopularidad[$p['idproducto']] += $p['importe_cup'];
                        }

                        foreach ($arrPopularidad as $id => $v) {
                            $resultado[$e][$id] = $v;
                        }
                    }
                }
                break;
            }
        }

        return $resultado;
    }


    private function obtenerCriteriosAplicar($idestructura)
    {
        $oCV = new Confdefinicionpeso();
        $rC = $oCV->obtenerDefinicionPeso($idestructura);
        $resultado = array();
        if (count($rC) > 0) {
            $ar = array();
            foreach ($rC as $item) {
                $ar[] = $item['idcriteriovaloracion'];
            }
            $resultado = array_unique($ar);
        }
        return $resultado;
    }


    public function clasificarProductos($idestructura, $arrEstructura, $idconfperiodosclasificacionabc, $fechainicio, $fechafin)
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");

        /*Busco la configuracion de la clasificacion abc*/
        $arrClasificacionABC = $this->obtenerClasificacionABC($idestructura);

        /*Busco los pesos definidos por Clasificacion y Criterios*/
        $arrPesosCC = $this->obtenerPesosXClasificacionyCriterios($idestructura);

        /*Busco las lineas de productos por cada producto a clasificar del periodo de clasificacion a analizar*/
        $arN = $this->obtenerLineasProductosPeriodoConfig($idconfperiodosclasificacionabc);
        $lp = json_decode($arN['naturalezas']);
        $arrLineaProductosXProductos = $this->obtenerLineasProductos($arrEstructura, $fechainicio, $fechafin, $lp, $idconfperiodosclasificacionabc);

        /*Busco los valores de los criterios previamente calculados y ordenados de mayor a menor*/
        $arrValoresCriterios = $this->obtenerValoresCriteriosxProductos($arrEstructura, $idconfperiodosclasificacionabc, $arrLineaProductosXProductos['lineasxproductos']);

        try {
            $this->conexion->beginTransaction();

            $sqlElim = "DELETE FROM mod_logabc.dat_clasificacionabcproductos WHERE idconfperiodosclasificacionabc = ?;";
            $this->conexion->execute($sqlElim, array($idconfperiodosclasificacionabc));

            $sqlElim = "DELETE FROM mod_logabc.dat_clasificacionabcproductosdetalles WHERE idconfperiodosclasificacionabc = ?;";
            $this->conexion->execute($sqlElim, array($idconfperiodosclasificacionabc));
            $arrInsertarProd = array();
            $arrInsertarProdDetalles = array();
            foreach ($arrEstructura as $e) {
                foreach ($arrLineaProductosXProductos['lineas'] as $l) {
                    $arrProductos = $arrValoresCriterios[$e][$l];
                    if (!empty($arrProductos)) {
                        $arrClasifP = $this->calcularClasificacionCadaCriterios($arrProductos, $arrClasificacionABC, $arrPesosCC);
                        /*Inserto todas las clasificaciones*/
                        foreach ($arrClasifP as $prod){
                            $arrInsertarProd[] = array($prod['clasificaciontotal'], $e, $idconfperiodosclasificacionabc, $prod['idindicador'], $l,
                                $prod['pesototal'], $prod['clasificaciontotal']);

                            $arrInsertarProdDetalles[] = array(
                                $e, $idconfperiodosclasificacionabc, $prod['idindicador'], $prod['valor1'],$prod['valor2'],
                                $prod['valor3'],$prod['porciento1'],$prod['porciento2'],$prod['porciento3'],$prod['clasificacion1'],
                                $prod['clasificacion2'],$prod['clasificacion3'],$prod['peso1'],$prod['peso2'],$prod['peso3'],
                                $prod['pesototal'],$prod['clasificaciontotal']
                            );
                        }
                    }
                }
            }

            $objCP = new Datclasificacionabcproductos();
            $objCP->calcularClasificacionProductoTotal($arrInsertarProd);

            /*Inserto los productos con su clasificacion abc y los detalles*/
            foreach ($arrInsertarProd as $p){
                $sqlInsert = "INSERT INTO mod_logabc.dat_clasificacionabcproductos(idclasificacionabc, idestructura, 
                            idconfperiodosclasificacionabc,idindicador, idlineaproducto, peso, idclasificacionabcmodificada
                            , idclasificacionabctotal)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
                $this->conexion->execute($sqlInsert, $p);
            }

            foreach ($arrInsertarProdDetalles as $pd){
                $sqlInsertDetalles = "INSERT INTO mod_logabc.dat_clasificacionabcproductosdetalles(idestructura, 
                                    idconfperiodosclasificacionabc, idindicador, valor1, valor2, valor3, porciento1, porciento2, 
                                    porciento3, clasificacion1, clasificacion2, clasificacion3, peso1, peso2, peso3, pesototal, 
                                    clasificaciontotal)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 
                                    ?, ?, ?, ?, ?, ?, ?, ?, ?);";
                $this->conexion->execute($sqlInsertDetalles, $pd);
            }

            /*Inserto todos los productos que no tuvieron ventas*/
            $sqlInsertNC = "INSERT INTO mod_logabc.dat_clasificacionabcproductos(idclasificacionabc, idestructura, 
                            idconfperiodosclasificacionabc,idindicador, idlineaproducto, peso, idclasificacionabcmodificada)
                            SELECT 4, tnc.idestructura, {$idconfperiodosclasificacionabc}, tnc.idindicador, i.idnaturaleza, 0.00, 4 
                            FROM mod_logabc.tmp_dat_productos_nc tnc
                            JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = tnc.idindicador";
            $this->conexion->execute($sqlInsertNC);

            $sqlInsertDetallesNC = "INSERT INTO mod_logabc.dat_clasificacionabcproductosdetalles(idestructura, 
                                  idconfperiodosclasificacionabc, idindicador)
                                  SELECT tnc.idestructura, {$idconfperiodosclasificacionabc}, tnc.idindicador
                                  FROM mod_logabc.tmp_dat_productos_nc tnc
                                  JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = tnc.idindicador";
            $this->conexion->execute($sqlInsertDetallesNC);

            $this->conexion->commit();

            return array('codigo' => 1, 'success' => true);

        } catch (Exception $e) {
            $this->conexion->rollback();
            return array('codigo' => 3, 'mensaje' => $e->getMessage());
        }
    }

    private function calcularClasificacionCadaCriterios($arrProductos, &$arrClasificacionABC, &$arrPesosCC)
    {
        $arrPopularidad = array();
        $arrUnidades = array();
        $arrImporte = array();
        foreach ($arrProductos as $id => $valor){
            if($valor['valor1'] > 0) {
                $arrPopularidad[$id] = $valor['valor1'];
                $arrUnidades[$id] = $valor['valor2'];
                $arrImporte[$id] = $valor['valor3'];
            }
        }

        /*Ordeno descendentemente los valores de cada criterio*/
        arsort($arrPopularidad);
        arsort($arrUnidades);
        arsort($arrImporte);

        /*Popularidad*/
        $sumaTotal = array_sum($arrPopularidad);
        $resultadoPopularidad = array();
        $porcientoAcumulado = 0;
        foreach ($arrPopularidad as $id => $valor) {
            if($sumaTotal > 0) {
                if($valor > 0) {
                    $porciento = round(($valor * 100 / $sumaTotal), 2);
                    $porcientoAcumulado += $porciento;
                    $resultadoPopularidad[$id] = $this->clasificarABC(1, $porcientoAcumulado, $arrClasificacionABC);
                }else{
                    $resultadoPopularidad[$id] = array('clasificacion' => 4, 'porciento' => 0);
                }
            }else{
                //NC si la suma total de los valores es cero, es decir no hubo ventas.
                $resultadoPopularidad[$id] = array('clasificacion' => 4, 'porciento' => 0);
            }
        }


        /*Unidades vendidas*/
        $sumaTotal = array_sum($arrUnidades);
        $resultadoUnidades = array();
        $porcientoAcumulado = 0;
        foreach ($arrUnidades as $id => $valor) {
            if($sumaTotal > 0) {
                if($valor > 0) {
                    $porciento = round(($valor * 100 / $sumaTotal), 2);
                    $porcientoAcumulado += $porciento;
                    $resultadoUnidades[$id] = $this->clasificarABC(1, $porcientoAcumulado, $arrClasificacionABC);
                }else{
                    $resultadoUnidades[$id] = array('clasificacion' => 4, 'porciento' => 0);
                }
            }else{
                //NC si la suma total de los valores es cero, es decir no hubo ventas.
                $resultadoUnidades[$id] = array('clasificacion' => 4, 'porciento' => 0);
            }
        }

        /*Importe en ventas*/
        $sumaTotal = array_sum($arrImporte);
        $resultadoImporte = array();
        $porcientoAcumulado = 0;
        foreach ($arrImporte as $id => $valor) {
            if($sumaTotal > 0) {
                if($valor > 0) {
                    $porciento = round(($valor * 100 / $sumaTotal), 2);
                    $porcientoAcumulado += $porciento;
                    $resultadoImporte[$id] = $this->clasificarABC(1, $porcientoAcumulado, $arrClasificacionABC);
                }else{
                    $resultadoImporte[$id] = array('clasificacion' => 4, 'porciento' => 0);
                }
            }else{
                //NC si la suma total de los valores es cero, es decir no hubo ventas.
                $resultadoImporte[$id] = array('clasificacion' => 4, 'porciento' => 0);
            }
        }

        $resultado = array();
        foreach ($arrProductos as $id => $valor){
            if(array_key_exists($id, $arrPopularidad)) {
                $resultado[$id] = $valor;
                $resultado[$id]['porciento1'] = $resultadoPopularidad[$id]['porciento'];
                $resultado[$id]['porciento2'] = $resultadoUnidades[$id]['porciento'];
                $resultado[$id]['porciento3'] = $resultadoImporte[$id]['porciento'];
                $resultado[$id]['clasificacion1'] = $resultadoPopularidad[$id]['clasificacion'];
                $resultado[$id]['clasificacion2'] = $resultadoUnidades[$id]['clasificacion'];
                $resultado[$id]['clasificacion3'] = $resultadoImporte[$id]['clasificacion'];

                $resultado[$id]['peso1'] = $arrPesosCC[$resultado[$id]['clasificacion1']][1];
                $resultado[$id]['peso2'] = $arrPesosCC[$resultado[$id]['clasificacion2']][2];
                $resultado[$id]['peso3'] = $arrPesosCC[$resultado[$id]['clasificacion3']][3];

                $resultado[$id]['pesototal'] = $resultado[$id]['peso1'] + $resultado[$id]['peso2'] + $resultado[$id]['peso3'];
                $resultado[$id]['clasificaciontotal'] =
                    $this->clasificarABC(2, $resultado[$id]['pesototal'], $arrClasificacionABC);

            }
        }

        return $resultado;

    }

    private function clasificarABC($porciento_peso, $valor, $arrClasificacionABC)
    {
        foreach ($arrClasificacionABC as $id => $c) {
            if ($porciento_peso == 1) {
                if ($valor >= $c['limiteinferior'] && $valor <= $c['limitesuperior']) {
                    return array('clasificacion' => $id, 'porciento' => $valor);
                }
            } else {
                if ($valor >= $c['limiteinferiorpeso'] && $valor <= $c['limitesuperiorpeso']) {
                    return $id;
                }
            }
        }

        if($porciento_peso == 1){
            return array('clasificacion' => 4, 'porciento' => $valor);
        }

        return 4;
    }

    private function obtenerClasificacionABC($idestructura)
    {
        $oC = new Nomclasificacionabc();
        $arr = $oC->obtenerClasificacionABC();
        $result = array();
        foreach ($arr as $c) {
            $result[$c['idclasificacionabc']] = $c;
        }
        return $result;
    }

    private function obtenerCriterios($idestructura)
    {
        $oDP = new Confdefinicionpeso();
        $arr = $oDP->obtenerDefinicionPeso($idestructura);
        $result = array();
        foreach ($arr as $c) {
            $result[$c['idcriteriovaloracion']] = $c['idcriteriovaloracion'];
        }
        return array_unique($result);
    }

    private function obtenerPesosXClasificacionyCriterios($idestructura)
    {
        $oDP = new Confdefinicionpeso();
        $arr = $oDP->obtenerDefinicionPeso($idestructura);
        $result = array();
        foreach ($arr as $c) {
            $result[$c['idclasificacionabc']][$c['idcriteriovaloracion']] = $c['peso'];
        }
        return $result;
    }

    private function obtenerValoresCriteriosxProductos($arrEstructuras, $idconfPeriodo, $arrLP)
    {
        $oDVC = new Datvalorcriteriosproductos();
        $arr = $oDVC->obtenerValoresCriterios($arrEstructuras, $idconfPeriodo);

        $result = array();
        foreach ($arr as $c) {
            $idlineaproducto = $arrLP[$c['idindicador']];
            $result[$c['idestructura']][$idlineaproducto][$c['idindicador']] = $c;
        }

        return $result;
    }

    private function obtenerLineasProductosPeriodoConfig($idconfperiodosclasificacionabc)
    {
        $sql = "SELECT idconfperiodosclasificacionabc, fechainicio, fechafin, idestructura, analizar, naturalezas, depositos FROM mod_logabc.conf_periodosclasificacionabc WHERE idconfperiodosclasificacionabc = ?;";
        $r = $this->conexion->fetchAll($sql, array($idconfperiodosclasificacionabc));
        return (count($r) > 0 ? $r[0] : array());
    }

    private function obtenerLineasProductos($arrEstructura, $fechainicio, $fechafin, $lp, $idconfperiodosclasificacionabc = 1)
    {
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");
        $sql = "select DISTINCT dvp.idindicador, i.idnaturaleza as idlineaproducto  
                from mod_logabc.dat_valorcriteriosproductos dvp
                JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = dvp.idindicador
                where dvp.idconfperiodosclasificacionabc = {$idconfperiodosclasificacionabc} 
                and dvp.idestructura IN (" . implode(',', $arrEstructura) . ") AND 
                i.idnaturaleza IN (".implode(',', $lp).")";

        $arrDatos = $this->conexion->fetchAll($sql);
        $r = array();
        $l = array();
        foreach ($arrDatos as $lp) {
            $r[$lp['idindicador']] = $lp['idlineaproducto'];
            $l[$lp['idlineaproducto']] = $lp['idlineaproducto'];
        }
        return array('lineasxproductos' => $r, 'lineas' => $l);

    }

    public function obtenerLineasProductoBusqueda($idconf = null)
    {
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");
        if(empty($idconf)){
            return $this->conexion->fetchAll( "SELECT idnaturaleza as idlineaproducto, idnaturaleza, denominacion as lineaproducto, denominacion FROM mod_datosmaestros.nom_naturaleza order by denominacion");
        }
        $arN = $this->obtenerLineasProductosPeriodoConfig($idconf);
        $lp = json_decode($arN['naturalezas']);
        $sql = "SELECT idnaturaleza as idlineaproducto, idnaturaleza, denominacion as lineaproducto, denominacion FROM mod_datosmaestros.nom_naturaleza WHERE idnaturaleza IN (".implode(',',$lp).
            ") order by denominacion;";
        return $this->conexion->fetchAll($sql);
    }


    public function obtenerDetallesClasificacionProducto($idclasificacionabc)
    {
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");
        $sql = "SELECT n1.denominacion as clasificacionabc, p.peso, n2.denominacion as clasificacionabcdetalles, c.denominacion as criteriovaloracion, dp.idcriteriovaloracion, dp.peso as pesodetalles
          FROM mod_logabc.dat_clasificacionabcproductos p
          INNER JOIN mod_logabc.dat_clasificacionabcproductosdetalles dp ON (dp.idconfperiodosclasificacionabc = p.idconfperiodosclasificacionabc AND dp.idestructura = p.idestructura AND dp.idindicador = p.idindicador)
          INNER JOIN mod_logabc.nom_clasificacionabc n1 ON (n1.idclasificacionabc = p.idclasificacionabc)
          INNER JOIN mod_logabc.nom_clasificacionabc n2 ON (n2.idclasificacionabc = dp.idclasificacionabc)
          INNER JOIN mod_logabc.nom_criteriovaloracion c ON (c.idcriteriovaloracion = dp.idcriteriovaloracion)
          WHERE p.idclasificacionabcproductos = ?";
        $r =  $this->conexion->fetchAll($sql, array($idclasificacionabc));
        $arr = array();
        foreach ($r as $v){
            $arr['<a href="#"><b>Clasificacion ABC</b></a>'] = $v['clasificacionabc'];
            $arr['<a href="#"><b>Peso</b></a>'] = $v['peso'];
            $arr[$v['idcriteriovaloracion'].". ".$v['criteriovaloracion']] = $v['clasificacionabcdetalles'];
            $arr[($v['idcriteriovaloracion']+4).". ".'Peso de '.$v['criteriovaloracion']] = $v['pesodetalles'];
        }

        return $arr;
    }

    public function salvarClasificacionProductosModificados($idueb, $arrProd)
    {
        $arrC = $this->obtenerClasificacionABC(0);
        $clasificaciones = array();
        foreach ($arrC  as $id => $c){
            $clasificaciones[$c['denominacion']] = $id;
        }
        try {
            $this->conexion->beginTransaction();
            foreach ($arrProd as $p) {
                $m = "m-" . $idueb;
                $i = "id-" . $idueb;
                $c = $p->$m;
                $id = $p->$i;
                $sqlUpdate = "UPDATE mod_logabc.dat_clasificacionabcproductos SET idclasificacionabcmodificada= {$clasificaciones[$c]} WHERE idclasificacionabcproductos={$id};";
                $this->conexion->execute($sqlUpdate);
            }
            $this->conexion->commit();
            return array('codigo' => 1, 'success' => true);
        }catch (Exception $e){
            $this->conexion->rollback();
            return array('codigo' => 3, 'success' => false, 'mensaje' => $e->getMessage());
        }

        //return $arr;
    }


    public function calcularyGuardarClasificacionABCTotal($idconfperiodosclasificacionabc, $arrEstructura)
    {
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");
        $r = array();
        try {
            $objCP = new Datclasificacionabcproductos();
            $arrR = $objCP->obtenerClasificacionProductoTotal($idconfperiodosclasificacionabc, $arrEstructura);
            $this->conexion->beginTransaction();
            foreach ($arrR as $v) {
                $sqluptCT = "UPDATE mod_logabc.dat_clasificacionabcproductos SET idclasificacionabctotal = {$v['idclasificacionabctotal']}
                WHERE idclasificacionabcproductos = ?;";
                $this->conexion->execute($sqluptCT, array($v['idclasificacionabcproductos']));
            }
            $this->conexion->commit();
            $r['codigo'] = 1;
            $r['success'] = true;
        }catch (Exception $e){
            $this->conexion->rollback();
            $r['codigo'] = 3;
            $r['success'] = false;
            $r['mensaje'] = $e->getMessage();
        }
        return $r;
    }

    public function obtenerDepositos($idestructura)
    {
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");
        $arrUebs = $this->obtenerUEBs($idestructura, false);
        $r = array();
        $iddominio = ZendExt_GlobalConcept::getInstance()->Perfil->iddominio;

        if (count($arrUebs > 0)){
            foreach ($arrUebs as $ar) {
                $parent_path = $ar['parent_path'];
                $sql = "select nfe.idfila as iddeposito, (deop.codigo ||' '||deop.denominacion) as deposito from mod_estructuracomp.nom_filaestruc nfe 
                            inner join mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = nfe.idfila and deop.idproyecto = 0 and deop.idorgano = -1)
                            where (nfe.parent_path operator (public.<@) ?) AND nfe.dominiofila[?]='1' AND nfe.fechafin is null and nfe.idconcepto = 8 order by deop.codigo";
                $resultado = $this->conexion->fetchAll($sql, array($parent_path, $iddominio));
                foreach ($resultado as $item){
                    $item['ueb'] = $ar['codigo']." ".$ar['denominacion'];
                    $item['idueb'] = $ar['idestructura'];
                    $r[] = $item;
                }
            }
        }
        return array('datos' => $r);
    }

    public function obtenerConfDepositosParametrizar($idestructura, $datos)
    {
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");
        $r1 = array();
        $sql = "SELECT iddeposito, idueb FROM mod_logabc.conf_depositosparametrizacion WHERE idestructura = ?;";
        $resultado = $this->conexion->fetchAll($sql, array($idestructura));

        foreach ($resultado as $item){
            $r1[$item['idueb']][$item['iddeposito']] = $item['iddeposito'];
        }

        $r = array();
        foreach ($datos as $i => $d){
            $m = $d;
            $m['marcado'] = 0;
            if(array_key_exists($d['iddeposito'], $r1[$d['idueb']])){
                $m['marcado'] = 1;
            }
            $r[] = $m;
        }

        return $r;
    }

    public function obtenerDetallesClasificacionABC($idconf, $arrUEBs)
    {
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");

        $r = array();
        $sql = "SELECT DISTINCT (d.idestructura||'-'||i.idnaturaleza) as id, d.idestructura, (ve.codigo||' '||ve.denominacion) as estructura,
            i.idnaturaleza, n.denominacion as naturaleza
          FROM mod_logabc.dat_clasificacionabcproductosdetalles d
          LEFT JOIN mod_estructuracomp.v_dametodasestructuras ve ON (ve.idestructura = d.idestructura AND ve.idorgano = -2)
          LEFT JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = d.idindicador)
          LEFT JOIN mod_datosmaestros.nom_naturaleza n ON (n.idnaturaleza = i.idnaturaleza)
          WHERE d.idconfperiodosclasificacionabc = {$idconf} AND ve.idestructura IN (".implode(',', $arrUEBs).")
          AND d.valor1 <> 0
          ORDER BY estructura, n.denominacion ";

        $r = $this->conexion->fetchAll($sql);
        return array('datos' => $r);
    }

    public function obtenerPareto($tipo, $idconf, $idestructura, $idnaturaleza, $idcriterio)
    {
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");

        $r = array();

        $sql = "SELECT d.idindicador, i.numeropieza as codigo, i.denominacion as producto, valor{$idcriterio} as valor,
        porciento{$idcriterio} as porciento, clasificacion{$idcriterio} as clasificacion, peso{$idcriterio} as peso
        FROM mod_logabc.dat_clasificacionabcproductosdetalles d
        LEFT JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = d.idindicador)
        WHERE d.idconfperiodosclasificacionabc = {$idconf}
        AND d.idestructura = {$idestructura} AND i.idnaturaleza = {$idnaturaleza} 
        AND valor{$idcriterio} <> 0
        ORDER BY porciento{$idcriterio} ASC ";

        if($tipo == 2){
            $sql = "SELECT d.idindicador, i.numeropieza as codigo, i.denominacion as producto, clasificacion1, clasificacion2,
                    clasificacion3, pesototal, clasificaciontotal
             FROM mod_logabc.dat_clasificacionabcproductosdetalles d 
             LEFT JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = d.idindicador) 
            WHERE d.idconfperiodosclasificacionabc = {$idconf} 
            AND d.idestructura = {$idestructura} 
            AND i.idnaturaleza = {$idnaturaleza} 
            AND valor1 <> 0 
            ORDER BY pesototal DESC ";
        }

        $r = $this->conexion->fetchAll($sql);
        return array('datos' => $r);
    }
}
