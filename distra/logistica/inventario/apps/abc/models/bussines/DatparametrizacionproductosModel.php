<?php


class DatparametrizacionproductosModel extends BaseModel
{

    private $conexion = null;

    public function __construct($esExterno = false)
    {
        parent::__construct($esExterno);
        $mg = Doctrine_Manager::getInstance();
        $this->conexion = $mg->getCurrentConnection();
    }


    public function obtenerParametrizacionProducto($limit, $start, $idconf, $idestructura, $idueb, $idlineaproducto = null, $criterio = null, $iddeposito = null)
    {
        $sql = "SELECT i.numeropieza AS codigo, i.denominacion AS producto, dpp.idparametrizacionproductos, dpp.idparametrosinventario, 
        dpp.valor, dpp.idestructura, dpp.iddeposito, dpp.idconfperiodosclasificacionabc, nn.denominacion as lineaproducto, 
        (deop.codigo ||' '||deop.denominacion) as deposito
          FROM mod_logabc.dat_parametrizacionproductos dpp
          INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = dpp.idproducto
          INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = dp.idindicador
          INNER JOIN mod_datosmaestros.nom_naturaleza nn ON nn.idnaturaleza = i.idnaturaleza
          INNER JOIN mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = dpp.iddeposito)
          WHERE dpp.idestructura = ? AND dpp.idconfperiodosclasificacionabc = ? ";

        if (!empty($idlineaproducto)) {
            $sql .= " AND i.idnaturaleza = {$idlineaproducto}";
        }
        if (!empty($iddeposito)) {
            $sql .= " AND dpp.iddeposito = {$iddeposito}";
        }
        if (!empty($criterio)) {
            $sql .= " AND i.numeropieza ilike '%" . $criterio . "%'";
        }
        $r = $this->conexion->fetchAll($sql, array($idueb, $idconf));
       // print_r($r);die;


        $arrPI = $this->cargarConfiguracionParametros($idestructura);
        //print_r($arrPI);die;

        $arrR = array();
        foreach ($r as $v) {
            foreach ($arrPI as $p) {
                $arrR[$v['codigo']]['codigo'] = $v['codigo'];
                $arrR[$v['codigo']]['producto'] = $v['producto'];
                $arrR[$v['codigo']]['lineaproducto'] = $v['lineaproducto'];
                $arrR[$v['codigo']]['iddeposito'] = $v['iddeposito'];
                $arrR[$v['codigo']]['deposito'] = $v['deposito'];
                if ($p['idparametrosinventario'] == $v['idparametrosinventario']) {
                    $arrR[$v['codigo']]['p-' . $p['idparametrosinventario']] = round($v['valor'], $p['lugaresdecimales']);
                }

            }
        }

        $arrResultado = array();

        foreach ($arrR as $v) {
            $arrResultado[] = $v;
        }

        return array('datos' => array_slice($arrResultado, $start, $limit), 'cantidad' => count($arrResultado));
    }


    public function calcularParametrizacionProducto($idconf, $idestructura, $idueb, $fechainicio, $fechafin, $iddeposito)
    {
        /*Cargo la configuracion de los parametros a calcular*/
        $arrConfParam = $this->cargarConfiguracionParametros($idestructura);

        /*Cargo los productos que se van a calcular, clasificacion A*/
        $arrProductosA = $this->cargarProductosClasificacionTotalA($idconf, $idueb, $iddeposito);

        if (empty($arrProductosA)) {
            return array('codigo' => 3, 'success' => false, 'mensaje' => "No existen productos en el depósito a parametrizar.");
        }

        /*Cargo los valores que se extraen del sistema y no de una formula o definido por el usuario*/
        $this->cargarValoresSistemaProductos($arrProductosA, $idueb, $fechainicio, $fechafin, $idconf, $iddeposito);



        try {
            $resultado = array();
            /*La forma de calulo 3, ya previamente se obtuvo del sistema, solo se calcula la 2 y 1*/
            foreach ($arrProductosA as $pppp) {
                $resultado[$pppp['idproducto']] = $pppp;
                foreach ($arrConfParam as $cppp) {
                    if ($cppp['formacalculo'] == 2) {/*Definida por el usuario*/
                        $resultado[$pppp['idproducto']]['p-' . $cppp['idparametrosinventario']] = round($cppp['valorusuario'], $cppp['lugaresdecimales']);
                    } else if ($cppp['formacalculo'] == 1) {/*Formula*/
                        $valor = $this->calcularParametro($resultado[$pppp['idproducto']], $arrConfParam, $cppp);
                        $resultado[$pppp['idproducto']]['p-' . $cppp['idparametrosinventario']] = round($valor, $cppp['lugaresdecimales']);
                    }
                }
            }

            $this->conexion->beginTransaction();

            $sqlDel = "DELETE FROM mod_logabc.dat_parametrizacionproductos WHERE idestructura = ? AND idconfperiodosclasificacionabc = ? AND iddeposito = ?";
            $this->conexion->execute($sqlDel, array($idueb, $idconf, $iddeposito));

            foreach ($resultado as $p) {
                $idproducto = $p['idproducto'];
                foreach ($arrConfParam as $cp) {
                    $idparametrosinventario = $cp['idparametrosinventario'];
                    $pi = 'p-' . $cp['idparametrosinventario'];
                    $valor = empty($p[$pi]) ? 0 : $p[$pi];
                    $sqlInsert = "INSERT INTO mod_logabc.dat_parametrizacionproductos(idparametrosinventario, valor, idestructura, idconfperiodosclasificacionabc, idproducto, iddeposito)
                                    VALUES ({$idparametrosinventario}, {$valor}, {$idueb}, {$idconf}, {$idproducto}, {$iddeposito});";
                    $this->conexion->execute($sqlInsert);
                }
            }
            $this->conexion->commit();
            return array('codigo' => 1, 'success' => true);

        } catch (Exception $e) {
            $this->conexion->rollback();
            return array('codigo' => 3, 'success' => false, 'mensaje' => $e->getMessage());
        }


    }

    private function calcularParametro(&$producto, $arrConfParam, $parametro)
    {
        if ($parametro['formacalculo'] == 2) {/*Definida por el usuario*/
            return round($parametro['valorusuario'], $parametro['lugaresdecimales']);
        } else if ($parametro['formacalculo'] == 1) {/*Formula*/
            $arrIndicadores = $parametro['indicadores'];
            $arrValorIndicadores = array();

            foreach ($arrIndicadores as $i) {
                $ip = 'p-' . $i;
                $valor = 0;
                if (array_key_exists($ip, $producto)) {
                    $valor = $producto[$ip];
                }

                if ($arrConfParam[$i]['porcentual'] == 1) {
                    $valor = $valor / 100;
                }

                $arrValorIndicadores[] = array('idindicador' => $i, 'valor' => $valor);
            }

            $r = $this->EvaluarExpresionMatematica($arrValorIndicadores, $parametro['formulacalcular']);

            if ($r->codigo == 1) {
                return $r->valor;
            } else {
                return 0;
            }

        }
        return 0;
    }

    private function cargarConfiguracionParametros($idestructura, $soloIds = false)
    {
        $objConfP = new ConfparametrosinventarioModel();
        $arrPI = $objConfP->obtenerConfiguracionParametrosInventario($idestructura);

        $r = array();
        foreach ($arrPI as &$p) {
            if ($soloIds) {
                $r[$p['idparametrosinventario']] = $p['idparametrosinventario'];
            } else {
                $p['indicadores'] = array();
                if ($p[formacalculo] == 1) {
                    $sqlInd = "select em.idindicador from mod_utiles.dat_elementoexpresionmatematica em where em.idexpresionmatematica = {$p['idformulaovalorsistema']} 
                               and em.tipoelemento = 6 ";
                    $indicadores = Doctrine_Manager::connection()->execute($sqlInd)->fetchAll(PDO::FETCH_COLUMN);

                    /*$dir = $_SERVER ['DOCUMENT_ROOT'] . "/pvd/comun/indicadoresexpresonmatematica/{$p['idformulaovalorsistema']}.iem";
                    $fp = fopen($dir, "r");
                    if ($fp != FALSE) {
                        $contenido = fread($fp, filesize($dir));
                        $s = unserialize($contenido);
                        $p['indicadores'] = $s;
                        fclose($fp);
                    }*/
                    if (count($indicadores)) {
                        $p['indicadores'] = $indicadores;
                    }
                }
                $r[$p['idparametrosinventario']] = $p;
            }

        }
        return $r;
    }

    private function cargarProductosClasificacionTotalA($idconf, $idueb, $iddeposito)
    {
        $sql = "SELECT t.idindicador, dp.idproducto, i.numeropieza as codigo, i.denominacion as producto
        FROM mod_logabc.dat_clasificacionabcproductos t
        INNER JOIN mod_logistica.dat_producto dp ON (dp.idestructura = {$iddeposito} AND dp.idindicador = t.idindicador)
        INNER JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = dp.idindicador)
        WHERE t.idestructura = ? AND t.idconfperiodosclasificacionabc = ? AND t.idclasificacionabcmodificada = 1";

        $r = $this->conexion->fetchAll($sql, array($idueb, $idconf));
        $arrP = array();
        foreach ($r as $p) {
            $arrP[$p['idindicador']] = $p;
            //$arrP[$p['codigo']] = $p;
        }

        return $arrP;
    }


    private function cargarValoresSistemaProductos(&$arrProductos, $idueb, $fechainicio, $fechafin, $idconf, $iddeposito)
    {
        $objConf = new ConfparametrosinventarioModel();
        $arrVS = $objConf->valoresSistema();

        $resultado = array();

        $arrIdsProductos = array();
        $arrIdsIndicador = array();
        foreach ($arrVS as $vs) {
            foreach ($arrProductos as &$p) {
                $p['p-' . $vs['id']] = 0;
            }
        }


        $arrP = array();

        foreach ($arrVS as $vs) {
            switch ($vs['id']) {
                case 0:
                { /*Periodo a analizar*/
                    $a = explode('/', $fechainicio);
                    $fia = $a[2];
                    $fim = $a[1];
                    $fid = $a[0];

                    $cantidadDias = 0;
                    $i = 0;
                    $fecha = $fechainicio;
                    $arrDomingos = array();
                    $arrNoDomingos = array();
                    While ($fecha != $fechafin) {
                        $marcaTiempo = mktime(0, 0, 0, $fim, $fid + $i, $fia);

                        $diaSemana = date("N", $marcaTiempo);
                        $fecha = date("d/m/Y", $marcaTiempo);

                        if ($diaSemana != 7) {
                            $cantidadDias++;
                            $arrNoDomingos[] = $fecha;
                        } else {
                            $arrDomingos[$fecha] = $fecha;
                        }

                        $i++;
                    }

                    $resultado['domingos'] = $arrDomingos;
                    $resultado['nodomingos'] = $arrNoDomingos;

                    foreach ($arrProductos as &$p) {
                        $p['p-0'] = $cantidadDias;
                        $arrIdsIndicador[] = $p['idindicador'];
                        $arrIdsProductos[] = $p['idproducto'];
                    }

                    break;
                }

                case 1:
                { /*Unidades vendidas*/
                    $sql = "SELECT idindicador, valor2
                          FROM mod_logabc.dat_valorcriteriosproductos
                          WHERE idestructura = ? AND idconfperiodosclasificacionabc = ? AND idindicador IN (" . implode(',', $arrIdsIndicador) . ") ";

                    $rp = $this->conexion->fetchAll($sql, array($idueb, $idconf));

                    foreach ($rp as $pp) {
                        $arrP[$pp['idindicador']] = $pp['valor2'];
                    }

                    foreach ($arrProductos as &$p) {
                        $p['p-1'] = $arrP[$p['idindicador']];
                    }

                    break;
                }

                case 2:
                {/*Dias en que el inventario se hizo cero y tambien calculo la existencia minima(id = 31)*/

                    /*Busco todos los movimientos de cada producto en el periodo de tiempo a analizar */

                    $sql = "select dm.existenciaactual, (dm.importetotal + dm.importetotalalt) as importetotal, dd.fechacontable, dm.idproducto, dm.signo, dm.cantidad
                            from mod_logistica.dat_movimiento dm
                            inner join mod_logistica.dat_documento dd ON (dd.iddocumento = dm.iddocumento AND (dd.fechacontable >= '{$fechainicio}'::date AND dd.fechacontable <= '$fechafin'::date) AND dd.estado = 4)
                            where dm.idproducto IN (" . implode(',', $arrIdsProductos) . ") order by dm.idproducto, dm.cronologia";

                    $aMP = $this->conexion->fetchAll($sql);

                    $aMovProd = array();
                    $aExistenciaPromedio = array();
                    foreach ($aMP as $m) {
                        $aMovProd[$m['idproducto']][$m['fechacontable']] = $m;
                        $aExistenciaPromedio[$m['idproducto']]['importetotal'] += $m['importetotal'];
                        $aExistenciaPromedio[$m['idproducto']]['cantidad'] += 1;
                    }

                    foreach ($arrProductos as &$p) {
                        /* Busco la existencia del producto antes del inicio del periodo a analizar */
                        $existenciaactual = 0;

                        foreach ($aMovProd[$p['idproducto']] as $idf => $valor) {
                            if ($valor['cantidad'] != $valor['existenciaactual']) {
                                $existenciaactual = $valor['existenciaactual'];
                            } else if ($valor['cantidad'] == $valor['existenciaactual'] && $valor['signo'] == '-') {
                                $existenciaactual = $valor['existenciaactual'];
                            }
                            break;
                        }


                        $diascero = 0;

                        $fecha = $fechainicio;

                        $a = explode('/', $fecha);
                        $fia = $a[2];
                        $fim = $a[1];
                        $fid = $a[0];

                        $fechaF = $fechafin;

                        $i = 0;

                        $arrDiasCero = array();

                        While ($fecha != $fechaF) {
                            $marcaTiempo = mktime(0, 0, 0, $fim, $fid + $i, $fia);
                            $fecha = date("d/m/Y", $marcaTiempo);

                            if (array_key_exists($fecha, $aMovProd[$p['idproducto']])) {
                                $existenciaactual = $aMovProd[$p['idproducto']][$fecha]['existenciaactual'];

                                if ($existenciaactual > 0) {
                                    $arrDiasCero[$fecha] = 0;
                                } else if (array_key_exists($fecha, $resultado['domingos'])) {
                                    $arrDiasCero[$fecha] = 0;
                                }
                            } else {
                                if ($existenciaactual <= 0) {
                                    if (array_key_exists($fecha, $resultado['domingos'])) {
                                        $arrDiasCero[$fecha] = 0;
                                    } else {
                                        $diascero = $diascero + 1;
                                        $arrDiasCero[$fecha] = 1;
                                    }

                                } else {
                                    $arrDiasCero[$fecha] = 0;
                                }
                            }
                            $i++;
                        }
                        /*Caso particular del inicio de la migracion a DISTRA que se registro informacion el dia
                        01/03/2020 y ese dia era domingo y la existencia del producto quedo en 0.*/
                        if (array_key_exists($fechainicio, $aMovProd[$p['idproducto']])) {
                            $existenciaactual = $aMovProd[$p['idproducto']][$fechainicio]['existenciaactual'];
                            if ($existenciaactual <= 0) {
                                if ($diascero > 0) {
                                    $diascero = $diascero - 1;
                                }
                            }
                        }

                        $p['p-2'] = $diascero;

                    }
                    
                    /*Calculo la existencia promedio del período*/
                    foreach ($arrProductos as &$pp) {
                        $pp['p-31'] = round($aExistenciaPromedio[$pp['idproducto']]['importetotal']
                            / $aExistenciaPromedio[$pp['idproducto']]['cantidad'], 2);
                    }

                    break;
                }

                case 3:
                {/*Costo x unidad*/

                    $sqlP = "SELECT DISTINCT dp.idindicador, dp.idproducto, i.precio
                                FROM mod_logistica.dat_producto dp
                                INNER JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = dp.idindicador)
                                WHERE  dp.idestructura = ? AND dp.idindicador IN (" . implode(',', $arrIdsIndicador) . ")";

                    $aPPro = $this->conexion->fetchAll($sqlP, array($iddeposito));
                    $arrPP = array();
                    foreach ($aPPro as $item) {
                        $arrPP[$item['idindicador']] = $item;
                    }

                    foreach ($arrProductos as &$p) {
                        $p['p-3'] = $arrPP[$p['idindicador']]['precio'];
                    }

                    break;
                }
            }
        }

        return $resultado;

    }

    /* Funcion que evalua la expresion matematica a calcular */
    public function EvaluarExpresionMatematica($arrIndicadoresValor, $expresionacalcular)
    {
        $r = new stdClass();
        /* Busco los indicadores dentro de la expresion matematica y compruebo que esten todos */
        /* Reemplaza los indicadores por sus valores */
        foreach ($arrIndicadoresValor as $i => $v) {
            $ind = 'I' . $v['idindicador'];
            /* Tiene en cuenta la exactitud de la variable */
            $expresionacalcular = preg_replace_callback(
                '/' . $ind . '(\D|\Z)/', function ($matches) use ($v) {
                return $v['valor'] . $matches[1];
            }, $expresionacalcular
            );
        }

        /* Reemplaza los operadores condicionales */
        $expresionacalcular = str_replace('SI_', ' if( ', $expresionacalcular);
        $expresionacalcular = str_replace('ENTONCES', ' ) ', $expresionacalcular);
        $expresionacalcular = str_replace('SINO', ' else ', $expresionacalcular);
        $expresionacalcular = str_replace('DEVOLVER', " \$resultadoexpresion = ", $expresionacalcular);

        /* Compruebo si quedaron indicadores sin reemplazar por su valor */
        $pos = strpos($expresionacalcular, 'I');
        if ($pos === FALSE) {

            /* Si me encuentro el operador if la expresion no se considera booleana y la expresion no es lineal */
            $esLineal = 1;
            if (strpos($expresionacalcular, 'if') !== FALSE) {
                $esbooleana = 0;
                $esLineal = 0;
            }

            /* Evaluo la expresion matematica y almaceno en la variable $resultadoexpresion el valor */
            try {
                /* Desabilito todos los errores */
                error_reporting(0);
                if ($esLineal == 1)
                    $expresionacalcular = "\$resultadoexpresion = " . $expresionacalcular . " ;";
                else
                    $expresionacalcular = "\$resultadoexpresion = NULL; " . $expresionacalcular;
                $resultado = eval($expresionacalcular);
                /* Si la funcion eval devuelve falso es que hubo error sino la expresion está bien */
                if ($resultado === false) {
                    $r->codigo = 3;
                    $r->valor = number_format(0, 2, '.', '');
                    $r->booleana = 0;
                    $r->expresionacalcular = $expresionacalcular;
                    $r->error = "Error de sintaxis en la formula a evaluar. Formula: " . $expresionacalcular;
                    return $r;
                }
            } catch (Exception $e) {
                throw $e;
            }

            $r->codigo = 1;
            $r->expresionacalcular = $expresionacalcular;
            $r->valor = $resultadoexpresion;

            /*
             * El valor a devolver siempre va a ser un objeto y con valor numérico
             * codigo: 1 ok, 3 error
             * booleana: 0 no, 1 si
             * valor: numero
             * error: Mensaje del error
             */
            return $r;
        } else {
            $r->codigo = 3;
            $r->booleana = 0;
            $r->valor = number_format(0, 2, '.', '');
            $r->expresionacalcular = $expresionacalcular;
            $r->error = "Existe(n) " . substr_count($expresionacalcular, 'I') . " indicador(es) que no se encuentra(n) en la expresi&oacute;n matem&aacute;tica. Formula: " . $expresionacalcular;
            return $r;
        }
    }

    public function obtenerParametrizacionProductosConsolidar($idconf, $arrUEBs, $arrParametros = null)
    {
        $sql = "SELECT i.idindicador, dp.idproducto, dpp.idparametrizacionproductos, dpp.idparametrosinventario, dpp.valor, dpp.idestructura
          FROM mod_logabc.dat_parametrizacionproductos dpp
          INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = dpp.idproducto
          INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = dp.idindicador
          WHERE dpp.idestructura IN (" . implode(',', $arrUEBs) . ") AND dpp.idparametrosinventario IN (0,3,5,16,24,25,26,27,28,29) AND dpp.idconfperiodosclasificacionabc = ? ";

        $r = $this->conexion->fetchAll($sql, array($idconf));
        $resultado = array();

        foreach ($r as $p) {
            $resultado[$p['idestructura']][$p['idindicador']]['idindicador'] = $p['idindicador'];
            $resultado[$p['idestructura']][$p['idindicador']]['idproducto'] = $p['idproducto'];
            $resultado[$p['idestructura']][$p['idindicador']]['idestructura'] = $p['idestructura'];
            switch ($p['idparametrosinventario']) {
                case 0:
                {
                    $resultado[$p['idestructura']][$p['idindicador']]['pa'] = $p['valor'];
                    break;
                }
                case 3:
                {
                    $resultado[$p['idestructura']][$p['idindicador']]['cu'] = $p['valor'];
                    break;
                }
                case 5:
                {
                    $resultado[$p['idestructura']][$p['idindicador']]['cmd'] = $p['valor'];
                    break;
                }
                case 16:
                {
                    $resultado[$p['idestructura']][$p['idindicador']]['cmde'] = $p['valor'];
                    break;
                }
                case 24:
                {
                    $resultado[$p['idestructura']][$p['idindicador']]['emin'] = $p['valor'];
                    break;
                }
                case 25:
                {
                    $resultado[$p['idestructura']][$p['idindicador']]['eminp'] = $p['valor'];
                    break;
                }
                case 26:
                {
                    $resultado[$p['idestructura']][$p['idindicador']]['emax'] = $p['valor'];
                    break;
                }
                case 27:
                {
                    $resultado[$p['idestructura']][$p['idindicador']]['emaxp'] = $p['valor'];
                    break;
                }
                case 28:
                {
                    $resultado[$p['idestructura']][$p['idindicador']]['pp'] = $p['valor'];
                    break;
                }
                case 29:
                {
                    $resultado[$p['idestructura']][$p['idindicador']]['ppp'] = $p['valor'];
                    break;
                }
            }
        }

        return $resultado;
    }

    public function obtenerMovimientosProductos($idconf, $idestructura, $iddeposito, $fechainicio, $fechafin)
    {
        $sql = "SELECT dp.idproducto, dp.idindicador, i.numeropieza as codigo, i.denominacion as producto, dm.existenciaactual, dd.fechacontable, dm.signo, dm.cantidad,
            nabc.denominacion as clasificacionabc, dp.minimo, dp.maximo, nop.denominacion as operacion
            FROM mod_logistica.dat_movimiento dm
            left join mod_logistica.dat_documento dd ON (dd.iddocumento = dm.iddocumento AND (dd.fechacontable >= '{$fechainicio}'::date AND dd.fechacontable <= '{$fechafin}'::date) AND dd.estado = 4)
            left join mod_datosmaestros.nom_operacion nop ON (nop.idnomoperaciones = dd.idoperacion)
            left JOIN mod_logistica.dat_producto dp ON (dp.idproducto = dm.idproducto)
            left JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = dp.idindicador)
            left JOIN mod_logabc.dat_clasificacionabcproductos dc ON (dc.idindicador = dp.idindicador)
            left JOIN mod_logabc.nom_clasificacionabc nabc ON (nabc.idclasificacionabc = dc.idclasificacionabcmodificada)
            WHERE dp.idestructura = ? AND dc.idestructura = ? AND dc.idconfperiodosclasificacionabc = ? AND dc.idclasificacionabcmodificada = 1
             ORDER BY dc.idclasificacionabcmodificada, dm.cronologia";

        return $this->conexion->fetchAll($sql, array($iddeposito, $idestructura, $idconf));
    }

    public function reparametrizarProductos($idconf, &$datosProductos, &$conn)
    {
        $sql = "SELECT npi.abreviatura as parametroinventario, npi.idtipoparametrosinventario, cpi.*
          FROM mod_logabc.conf_parametrosinventario cpi
          INNER JOIN mod_logabc.nom_parametrosinventario npi ON npi.idparametrosinventario = cpi.idparametrosinventario
          ORDER BY npi.idparametrosinventario";
        $rC = $conn->fetchAll($sql);
        $arrConfParam = array();
        foreach ($rC as $c) {
            if ($c['formacalculo'] == 1) {
                $sqlInd = "select em.idindicador from mod_utiles.dat_elementoexpresionmatematica em where em.idexpresionmatematica = {$c['idformulaovalorsistema']} 
                               and em.tipoelemento = 6 ";
                $indicadores = Doctrine_Manager::connection()->execute($sqlInd)->fetchAll(PDO::FETCH_COLUMN);

                /*$dir = $_SERVER ['DOCUMENT_ROOT'] . "/pvd/comun/indicadoresexpresonmatematica/{$c['idformulaovalorsistema']}.iem";
                $fp = fopen($dir, "r");
                if ($fp != FALSE) {
                    $contenido = fread($fp, filesize($dir));
                    $s = unserialize($contenido);
                    $c['indicadores'] = $s;
                    fclose($fp);
                }*/
                if (count($indicadores)) {
                    $c['indicadores'] = $indicadores;
                }
            }
            $arrConfParam[$c['idparametrosinventario']] = $c;
        }

        $arrProdRecalculados = array();

        foreach ($datosProductos as $idueb => &$datosP) {
            $sql = "SELECT dpp.*
              FROM mod_logabc.dat_parametrizacionproductos dpp
              INNER JOIN mod_logabc.nom_parametrosinventario npi ON npi.idparametrosinventario = dpp.idparametrosinventario
              WHERE dpp.idconfperiodosclasificacionabc = ? AND dpp.idestructura = ? 
              AND (npi.idtipoparametrosinventario = 5 OR npi.idparametrosinventario = 16 OR npi.idparametrosinventario = 5)";
            $rParamProductos = $conn->fetchAll($sql, array($idconf, $idueb));

            foreach ($rParamProductos as $pp) {
                if (array_key_exists($pp['idproducto'], $datosP)) {
                    $sqlUpd = "";
                    switch ($pp['idparametrosinventario']) {
                        case 5:
                        {
                            $sqlUpd = "UPDATE mod_logabc.dat_parametrizacionproductos SET valor = {$pp['valor']} 
                            WHERE idparametrizacionproductos = {$pp['idparametrizacionproductos']}";
                            $arrProdRecalculados[$pp['idproducto']][5] = $pp['valor'];
                            break;
                        }
                        case 16:
                        {
                            $sqlUpd = "UPDATE mod_logabc.dat_parametrizacionproductos SET valor = {$datosP[$pp['idproducto']]['cmde']} 
                            WHERE idparametrizacionproductos = {$pp['idparametrizacionproductos']}";
                            $arrProdRecalculados[$pp['idproducto']][16] = $datosP[$pp['idproducto']]['cmde'];
                            break;
                        }
                        case 18:
                        {
                            $arrProdRecalculados[$pp['idproducto']][18] = $this->recalcularParametro($arrConfParam, $arrConfParam[18], $arrProdRecalculados[$pp['idproducto']]);
                            $sqlUpd = "UPDATE mod_logabc.dat_parametrizacionproductos SET valor = {$arrProdRecalculados[$pp['idproducto']][18]} 
                            WHERE idparametrizacionproductos = {$pp['idparametrizacionproductos']}";
                            break;
                        }
                        case 19:
                        {
                            $arrProdRecalculados[$pp['idproducto']][19] = $this->recalcularParametro($arrConfParam, $arrConfParam[19], $arrProdRecalculados[$pp['idproducto']]);
                            $sqlUpd = "UPDATE mod_logabc.dat_parametrizacionproductos SET valor = {$arrProdRecalculados[$pp['idproducto']][19]} 
                            WHERE idparametrizacionproductos = {$pp['idparametrizacionproductos']}";
                            break;
                        }
                        case 20:
                        {
                            $arrProdRecalculados[$pp['idproducto']][20] = $this->recalcularParametro($arrConfParam, $arrConfParam[20], $arrProdRecalculados[$pp['idproducto']]);
                            $sqlUpd = "UPDATE mod_logabc.dat_parametrizacionproductos SET valor = {$arrProdRecalculados[$pp['idproducto']][20]} 
                            WHERE idparametrizacionproductos = {$pp['idparametrizacionproductos']}";
                            break;
                        }
                        case 21:
                        {
                            $arrProdRecalculados[$pp['idproducto']][21] = $this->recalcularParametro($arrConfParam, $arrConfParam[21], $arrProdRecalculados[$pp['idproducto']]);
                            $sqlUpd = "UPDATE mod_logabc.dat_parametrizacionproductos SET valor = {$arrProdRecalculados[$pp['idproducto']][21]} 
                            WHERE idparametrizacionproductos = {$pp['idparametrizacionproductos']}";
                            break;
                        }
                        case 22:
                        {
                            $arrProdRecalculados[$pp['idproducto']][22] = $this->recalcularParametro($arrConfParam, $arrConfParam[22], $arrProdRecalculados[$pp['idproducto']]);
                            $sqlUpd = "UPDATE mod_logabc.dat_parametrizacionproductos SET valor = {$arrProdRecalculados[$pp['idproducto']][22]} 
                            WHERE idparametrizacionproductos = {$pp['idparametrizacionproductos']}";
                            break;
                        }
                        case 23:
                        {
                            $arrProdRecalculados[$pp['idproducto']][23] = $this->recalcularParametro($arrConfParam, $arrConfParam[23], $arrProdRecalculados[$pp['idproducto']]);
                            $sqlUpd = "UPDATE mod_logabc.dat_parametrizacionproductos SET valor = {$arrProdRecalculados[$pp['idproducto']][23]} 
                            WHERE idparametrizacionproductos = {$pp['idparametrizacionproductos']}";
                            break;
                        }
                        case 24:
                        {
                            $arrProdRecalculados[$pp['idproducto']][24] = $this->recalcularParametro($arrConfParam, $arrConfParam[24], $arrProdRecalculados[$pp['idproducto']]);
                            $sqlUpd = "UPDATE mod_logabc.dat_parametrizacionproductos SET valor = {$arrProdRecalculados[$pp['idproducto']][24]} 
                            WHERE idparametrizacionproductos = {$pp['idparametrizacionproductos']}";
                            $datosP[$pp['idproducto']]['emin'] = $arrProdRecalculados[$pp['idproducto']][24];
                            break;
                        }
                        case 25:
                        {
                            $arrProdRecalculados[$pp['idproducto']][25] = $this->recalcularParametro($arrConfParam, $arrConfParam[25], $arrProdRecalculados[$pp['idproducto']]);
                            $sqlUpd = "UPDATE mod_logabc.dat_parametrizacionproductos SET valor = {$arrProdRecalculados[$pp['idproducto']][25]} 
                            WHERE idparametrizacionproductos = {$pp['idparametrizacionproductos']}";
                            $datosP[$pp['idproducto']]['eminp'] = $arrProdRecalculados[$pp['idproducto']][25];
                            break;
                        }
                        case 26:
                        {
                            $arrProdRecalculados[$pp['idproducto']][26] = $this->recalcularParametro($arrConfParam, $arrConfParam[26], $arrProdRecalculados[$pp['idproducto']]);
                            $sqlUpd = "UPDATE mod_logabc.dat_parametrizacionproductos SET valor = {$arrProdRecalculados[$pp['idproducto']][26]} 
                            WHERE idparametrizacionproductos = {$pp['idparametrizacionproductos']}";
                            $datosP[$pp['idproducto']]['emax'] = $arrProdRecalculados[$pp['idproducto']][26];
                            break;
                        }
                        case 27:
                        {
                            $arrProdRecalculados[$pp['idproducto']][27] = $this->recalcularParametro($arrConfParam, $arrConfParam[27], $arrProdRecalculados[$pp['idproducto']]);
                            $sqlUpd = "UPDATE mod_logabc.dat_parametrizacionproductos SET valor = {$arrProdRecalculados[$pp['idproducto']][27]} 
                            WHERE idparametrizacionproductos = {$pp['idparametrizacionproductos']}";
                            $datosP[$pp['idproducto']]['emaxp'] = $arrProdRecalculados[$pp['idproducto']][27];
                            break;
                        }
                        case 28:
                        {
                            $arrProdRecalculados[$pp['idproducto']][28] = $this->recalcularParametro($arrConfParam, $arrConfParam[28], $arrProdRecalculados[$pp['idproducto']]);
                            $sqlUpd = "UPDATE mod_logabc.dat_parametrizacionproductos SET valor = {$arrProdRecalculados[$pp['idproducto']][28]} 
                            WHERE idparametrizacionproductos = {$pp['idparametrizacionproductos']}";
                            $datosP[$pp['idproducto']]['pp'] = $arrProdRecalculados[$pp['idproducto']][28];
                            break;
                        }
                        case 29:
                        {
                            $arrProdRecalculados[$pp['idproducto']][29] = $this->recalcularParametro($arrConfParam, $arrConfParam[29], $arrProdRecalculados[$pp['idproducto']]);
                            $sqlUpd = "UPDATE mod_logabc.dat_parametrizacionproductos SET valor = {$arrProdRecalculados[$pp['idproducto']][29]} 
                            WHERE idparametrizacionproductos = {$pp['idparametrizacionproductos']}";
                            $datosP[$pp['idproducto']]['ppp'] = $arrProdRecalculados[$pp['idproducto']][29];
                            break;
                        }
                    }

                    $conn->execute($sqlUpd);
                }

            }
        }

    }

    private function recalcularParametro(&$arrConfParam, $parametro, &$producto)
    {
        if ($parametro['formacalculo'] == 2) {/*Definida por el usuario*/
            return round($parametro['valorusuario'], $parametro['lugaresdecimales']);
        } else if ($parametro['formacalculo'] == 1) {/*Formula*/
            $arrIndicadores = $parametro['indicadores'];
            $arrValorIndicadores = array();

            foreach ($arrIndicadores as $i) {
                $valor = 0;
                if (array_key_exists($i, $producto)) {
                    $valor = $producto[$i];
                }

                if ($arrConfParam[$i]['porcentual'] == 1) {
                    $valor = $valor / 100;
                }

                if ($arrConfParam[$i]['formacalculo'] == 2) {
                    $valor = round($arrConfParam[$i]['valorusuario'], $arrConfParam[$i]['lugaresdecimales']);
                }

                $arrValorIndicadores[] = array('idindicador' => $i, 'valor' => $valor);
            }

            $r = $this->EvaluarExpresionMatematica($arrValorIndicadores, $parametro['formulacalcular']);

            if ($r->codigo == 1) {
                return $r->valor;
            } else {
                return 0;
            }

        }
        return 0;
    }

}
