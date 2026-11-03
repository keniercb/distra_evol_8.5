<?php

class DatProduccionModel extends ZendExt_Model {

    public function init() {
        parent::ZendExt_Model();
    }

    public function listarPlanProduccion($params) {
        if ($params['tipo'] == 2 || $params['tipo'] == 3) {
            //proveedor y rector
            $data = DatDemandatiempo::listarPlanProduccionProveedor($params);
        } elseif ($params['tipo'] == 1) {
            //ejecutor(productor)           
            $data = DatDemandatiempo::listarPlanProduccionProductor($params);
        }
        return $data;
    }

    public function listarPlanProduccionDesagregado($params) {
        if ($params['tipo'] == 2 || $params['tipo'] == 3) {
            $data = DatDemandatiempo::listarPlanProduccionDesagregado($params);
        }
        return $data;
    }

    public function listarProgramas() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT dn.denominacion,dn.iddatosnomenclador FROM mod_planificacion.nom_datosnomenclador dn
                    INNER JOIN mod_planificacion.nom_tiponomenclador tn on dn.idtiponomenclador = tn.idtiponomenclador
                    WHERE upper(uritiponomenclador) = 'PROGRAMA'";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarMeses() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT dn.denominacion,dn.iddatosnomenclador FROM mod_planificacion.nom_datosnomenclador dn
                    INNER JOIN mod_planificacion.nom_tiponomenclador tn on dn.idtiponomenclador = tn.idtiponomenclador
                    WHERE upper(uritiponomenclador) = 'MES' And iddatosnomenclador <> 1128";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarClientes() {
        $identidad = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $clientes = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad[0]['identidad'], true);
        return $clientes;
    }

    public function listarProductores($params = null) {
        $dominiosTmp = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidadselected'], true);
        return $dominiosTmp;
    }

    public function guardarPlanProduccionTalleres($params) {
        $arrayProduccion = array();
        $arrayProduccion = $params['demandatiempo'];
        $idusuario = $this->global->Perfil->idusuario;
        $fecha = strftime("%d/%m/%Y %T", time());
        $actualizados = 0;
        $total = count($arrayProduccion);

        foreach ($arrayProduccion as $produccion) {
            $obj = Doctrine::getTable('DatDemandatiempo')->findByDql("iddemandatiempo = {$produccion->iddemandatiempo}");
            $objDemanda = Doctrine::getTable('DatDemanda')->findByDql("iddemanda = {$obj[0]->iddemanda}");
            if (count($obj) > 0 && count($objDemanda) > 0) {
                if ($objDemanda[0]->idaprobacionplan == 1) {
                    if (isset($produccion->cantidaddesglosada)) {
                        $obj[0]->cantidaddesglosada = $produccion->cantidaddesglosada;
                    }if (isset($produccion->preciodesglosado)) {
                        $obj[0]->preciodesglosado = $produccion->preciodesglosado;
                    }if (isset($produccion->preciodesglosadodivisa)) {
                        $obj[0]->preciodesglosadodivisa = $produccion->preciodesglosadodivisa;
                    }if (isset($produccion->enero)) {
                        $obj[0]->enero = $produccion->enero;
                    }if (isset($produccion->febrero)) {
                        $obj[0]->febrero = $produccion->febrero;
                    }if (isset($produccion->marzo)) {
                        $obj[0]->marzo = $produccion->marzo;
                    }if (isset($produccion->abril)) {
                        $obj[0]->abril = $produccion->abril;
                    }if (isset($produccion->mayo)) {
                        $obj[0]->mayo = $produccion->mayo;
                    }if (isset($produccion->junio)) {
                        $obj[0]->junio = $produccion->junio;
                    }if (isset($produccion->julio)) {
                        $obj[0]->julio = $produccion->julio;
                    }if (isset($produccion->agosto)) {
                        $obj[0]->agosto = $produccion->agosto;
                    }if (isset($produccion->septiembre)) {
                        $obj[0]->septiembre = $produccion->septiembre;
                    }if (isset($produccion->octubre)) {
                        $obj[0]->octubre = $produccion->octubre;
                    }if (isset($produccion->noviembre)) {
                        $obj[0]->noviembre = $produccion->noviembre;
                    }if (isset($produccion->diciembre)) {
                        $obj[0]->diciembre = $produccion->diciembre;
                    }
                    if (isset($produccion->cantidaddesglosada)) {
                        $obj[0]->importe = $obj[0]->cantidaddesglosada * $obj[0]->preciodesglosado;
                        $obj[0]->importedivisa = $obj[0]->cantidaddesglosada * $obj[0]->preciodesglosadodivisa;
                        $obj[0]->importeajustado = ($obj[0]->cantidaddesglosada + $obj[0]->ajusteplan) * $obj[0]->preciodesglosado;
                        $obj[0]->importeajustadodivisa = ($obj[0]->cantidaddesglosada + $obj[0]->ajusteplan) * $obj[0]->preciodesglosadodivisa;
                    }
                    if (isset($produccion->preciodesglosado)) {
                        $obj[0]->importe = $obj[0]->cantidaddesglosada * $obj[0]->preciodesglosado;
                        $obj[0]->importeajustado = ($obj[0]->cantidaddesglosada + $obj[0]->ajusteplan) * $obj[0]->preciodesglosado;
                    }
                    if (isset($produccion->preciodesglosadodivisa)) {
                        $obj[0]->importedivisa = $obj[0]->cantidaddesglosada * $obj[0]->preciodesglosadodivisa;
                        $obj[0]->importeajustadodivisa = ($obj[0]->cantidaddesglosada + $obj[0]->ajusteplan) * $obj[0]->preciodesglosadodivisa;
                    }
                    $obj[0]->fecha = $fecha;
                    $obj[0]->idusuario = $idusuario;
                    $obj->save();
                    $actualizados++;
                }
            }
        }
        if ($actualizados == $total)
            return 1;
        else if ($actualizados == 0) {
            return 0;
        } else if ($actualizados < $total) {
            return 2;
        }
    }

//    public function guardarDesgloseXmes($params, $object, $produccion) {
//        $conn = Doctrine_Manager::connection();
//        $obj = Doctrine::getTable('DatDemandatiempo')->findByDql("iddemanda = {$object->iddemanda}");
//        $meses = self::listarMeses();
//        $idusuario = $this->global->Perfil->idusuario;
//        if (count($obj) > 0) {
//            foreach ($meses as $mes) {
//                $objMes = Doctrine::getTable('DatDemandatiempo')->findByDql("iddemanda = {$object->iddemanda} AND  iddatosnomenclador = {$mes['iddatosnomenclador']}");
//                $nombreMes = strtolower($mes['denominacion']);
//                $cantidad = "" == $produccion->$nombreMes ? 0 : intval($produccion->$nombreMes);
//                $objMes[0]->cantidaddesglosada = $cantidad;
//                $obj->save();
//            }
//        } else {
//            foreach ($meses as $mesNew) {
//                $nombreMes = strtolower($mesNew['denominacion']);
//                $cantidad = "" == $produccion->$nombreMes ? 0 : intval($produccion->$nombreMes);
//                $sql = "INSERT INTO
//                              mod_planproeza.dat_demandatiempo
//                            (iddemanda,iddatosnomenclador, idejercicio, idusuario, cantidaddesglosada)
//                            VALUES (?,?,?,?,?);";
//                $cantidadTotal = $cantidad ? $cantidad : 0;
//                $conn->execute($sql, array($object->iddemanda, $mesNew['iddatosnomenclador'], $params['idejercicio'], $idusuario, $cantidadTotal));
//            }
//        }
//    }

    public function exportarPlan($params) {
        //Ajustando los parámetros de los filtros al formato 'listar'
        $nuevos_filtros = [];
        foreach ($params['filtros'] as $filtro) {
            $obj_filtro['field'] = $filtro->field;
            $obj_filtro['data']['type'] = $filtro->data->type;
            if ($obj_filtro['data']['type'] == 'numeric') {
                $obj_filtro['data']['comparison'] = $filtro->data->comparison;
            }
            if ($obj_filtro['data']['type'] == 'list') {
                $obj_filtro['data']['value'] = $filtro->data->value[0];
            } else {
                $obj_filtro['data']['value'] = $filtro->data->value;
            }
            $nuevos_filtros[] = $obj_filtro;
        }
        $params['filtros'] = $nuevos_filtros;
        //Fin de los filtros
        //Simulando stores para hacer render
        //UM
        $params['array_um'] = array();
        foreach ($params['um'] as $valorUM) {
            $params['array_um'][$valorUM['idunidadmedida']] = $valorUM['abreviaturaunidadmedida'];
        }
        unset($params['um']);

        $entidadesdenom = array();
        $entidades = $params['entidades'];

        $cadenaidentidades = $entidades[0]['id'];
        foreach ($entidades as $key => $value) {
            if ($key != 0)
                $cadenaidentidades.="," . $value['id'];
            $entidadesdenom[$value['id']] = $value['text'];
        }
        $identidades = DatEntidaddatosnomenclador::obtenerEntDadoCompArrayEnt($cadenaidentidades, 'organoconsumidor');
        $data_entidades = array();
        foreach ($identidades as $k => $v) {
            $data_entidades[$k]['idestructura'] = $v;
            $data_entidades[$k]['denominacion'] = $entidadesdenom[$v];
        }
        $params['array_entidad'] = array();
        foreach ($data_entidades as $entidad) {
            $params['array_entidad'][$entidad['idestructura']] = $entidad['denominacion'];
        }
        unset($data_entidades);
        $data_programas = DemandaproduccionModel::cargarProgramas();
        $params['array_programa'] = array();
        foreach ($data_programas as $programa) {
            $params['array_programa'][$programa['iddatosnomenclador']] = $programa['denominacion'];
        }
        unset($data_programas);
        //Destinos
        $data_destinos = DemandaproduccionModel::cargarDestinos();
        $params['array_destino'] = array();
        foreach ($data_destinos as $destino) {
            $params['array_destino'][$destino['iddatosnomenclador']] = $destino['denominacion'];
        }
        unset($data_destinos);

        //FIn de los stores
        //Creando el encabezado
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=plan.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        if ($params['tipo'] == 1) { //Si es ejecutor
            echo"<H2 align=center>Desagregación del Plan</H2>";
        } else {
            echo"<H2 align=center>Plan</H2>";
        }

        echo"<H3>Ejercicio: {$params['denoejercicio']} <br/>
                 Entidad: {$params['denoentidad']} <br/>
                 Comportamiento: {$params['denotipo']}</H3>";
        echo "<tr>
        <table border=1 cellspacing=0 width=60%>  
             <th align=center>Código</th>
             <th align=center>Denominación</th>
             <th align=center>UM</th>
             <th align=center>Cliente</th>
             <th align=center>Programa</th>
             <th align=center>Destino</th>
             <th align=center>Cantidad</th>
             <th align=center>Total desagregado</th>
             <th align=center>Diferencia</th>         
            <th align=center>Importe total</th> 
            <th align=center>Importe total divisa</th> 
            <th align=center>Nivel de aprobación</th>
            <th align=center>Enero</th>
             <th align=center>Febrero</th>
             <th align=center>Marzo</th>
             <th align=center>Abril</th>
             <th align=center>Mayo</th>
             <th align=center>Junio</th>
             <th align=center>Julio</th>
             <th align=center>Agosto</th>
             <th align=center>Septiembre</th>
             <th align=center>Octubre</th>
             <th align=center>Noviembre</th>
             <th align=center>Diciembre</th>            
             ";
        echo "</tr>";
        //Obteniendo los datos
        $datos = self::listarPlanProduccion($params);
        //Mostrando los datos
        foreach ($datos as $value) {
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacion'] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\" >" . $params['array_um'][$value['idumedida']] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_entidad'][$value['identidadcliente']] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_programa'][$value['idprograma']] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_destino'][$value['iddestino']] . "</td>";

            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['cantidadconfirmada'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['totaldesagregado'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['diferencia'] . "</td>";      //poner importe total  
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['importetotal'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['importetotaldivisa'] . "</td>";
            if ($value['idaprobacion'] == 1)
                $aprobación = "No";
            else
            if ($value['idaprobacion'] == 2)
                $aprobación = "Aprobado (Proveedor)";
            else
            if ($value['idaprobacion'] == 3)
                $aprobación = "Aprobado (Cliente)";
            else
            if ($value['idaprobacion'] == 4)
                $aprobación = "Aprobado (Rector)";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $aprobación . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['enero'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['febrero'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['marzo'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['abril'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['mayo'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['junio'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['julio'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['agosto'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['septiembre'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['octubre'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['noviembre'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['diciembre'] . "</td>";
            echo "</tr>";
        }
        echo "<tr>";
        echo"<td align=left >Totales</td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($datos[0]['importetotalmn'], 3, ".", ",") . "</td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($datos[0]['importetotalcuc'], 3, ".", ",") . "</td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo "</tr>";
        echo "</table>\n";
        echo"<H6 align=right>Documento generado por PROEZA<br/>";
        $fecha = strftime("%Y/%m/%d %T", time());
        echo"Fecha: {$fecha}</H6>.";
        echo '</BODY></HTML>';
    }

    public function exportarDesagregacionPlan($params) {
        //Ajustando los parámetros de los filtros al formato 'listar'
        $nuevos_filtros = [];
        foreach ($params['filtros'] as $filtro) {
            $obj_filtro['field'] = $filtro->field;
            $obj_filtro['data']['type'] = $filtro->data->type;
            if ($obj_filtro['data']['type'] == 'numeric') {
                $obj_filtro['data']['comparison'] = $filtro->data->comparison;
            }
            if ($obj_filtro['data']['type'] == 'list') {
                $obj_filtro['data']['value'] = $filtro->data->value[0];
            } else {
                $obj_filtro['data']['value'] = $filtro->data->value;
            }
            $nuevos_filtros[] = $obj_filtro;
        }
        $params['filtros'] = $nuevos_filtros;
        //Fin de los filtros
        //Simulando stores para hacer render
        //UM
//        $params['array_um'] = array();
//        foreach ($params['um'] as $valorUM) {
//            $params['array_um'][$valorUM['idunidadmedida']] = $valorUM['abreviaturaunidadmedida'];
//        }
//        unset($params['um']);
        // Tratamiento para listar las entidades ejecutoras
        $entidadesdenom = array();
        $entidades = $params['entidades'];
        $cadenaidentidades = $entidades[0]['id'];
        foreach ($entidades as $key => $value) {
            if ($key != 0)
                $cadenaidentidades.="," . $value['id'];
            $entidadesdenom[$value['id']] = $value['text'];
        }
        $identidades = DatEntidaddatosnomenclador::obtenerEntDadoCompArrayEnt($cadenaidentidades, 'ejecutor');
        $data_entidades = array();
        foreach ($identidades as $k => $v) {
            $data_entidades[$k]['idestructura'] = $v;
            $data_entidades[$k]['denominacion'] = $entidadesdenom[$v];
        }
        $params['array_entidad'] = array();
        foreach ($data_entidades as $entidad) {
            $params['array_entidad'][$entidad['idestructura']] = $entidad['denominacion'];
        }

        unset($data_entidades);

        //FIn de los stores
        //Creando el encabezado
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=desagregacion.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo"<H2 align=center>Desagregación del Plan</H2>";
        echo"<H3>Ejercicio: {$params['denoejercicio']} <br/>
                 Entidad: {$params['denoentidad']} <br/>
                 Comportamiento: {$params['denotipo']} <br/>
                 Indicador: {$params['denomindicador']} <br/>
                 Código: {$params['codindicador']} <br/>
                 Cantidad: {$params['cantidadconfirmada']}</H3>";

        echo "<tr>
        <table border=1 cellspacing=0 width=60%>  
             <th align=center>Ejecutor</th>
             <th align=center>Cantidad desglosada</th>
             <th align=center>Total desagregado</th>
             <th align=center>Diferencia</th>
             <th align=center>Precio desglosado</th>
             <th align=center>Precio desglosado divisa</th>         
             <th align=center>Importe total</th>
             <th align=center>Importe total divisa</th>
             <th align=center>Enero</th>
             <th align=center>Febrero</th>
             <th align=center>Marzo</th>
             <th align=center>Abril</th>
             <th align=center>Mayo</th>
             <th align=center>Junio</th>
             <th align=center>Julio</th>
             <th align=center>Agosto</th>
             <th align=center>Septiembre</th>
             <th align=center>Octubre</th>
             <th align=center>Noviembre</th>
             <th align=center>Diciembre</th>
             
             ";

        echo "</tr>";
        //Obteniendo los datos
        $datos = self::listarPlanProduccionDesagregado($params);
        //Mostrando los datos
        foreach ($datos as $value) {
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_entidad'][$value['identidad']] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['cantidaddesglosada'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['totaldesagregado'] . "</td>";
            //echo "<td align=left style=\"mso-number-format:'@';\" >" . $params['array_um'][$value['idumedida']] . "</td>";

            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['diferencia'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['preciodesglosado'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['preciodesglosadodivisa'] . "</td>";

            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['importetotal'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['importetotaldivisa'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['enero'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['febrero'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['marzo'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['abril'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['mayo'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['junio'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['julio'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['agosto'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['septiembre'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['octubre'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['noviembre'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'@';\" >" . $value['diciembre'] . "</td>";

            echo "</tr>";
        }
        echo "</table>\n";
        echo"<H6 align=right>Documento generado por PROEZA<br/>";
        $fecha = strftime("%Y/%m/%d %T", time());
        echo"Fecha: {$fecha}</H6>.";
        echo '</BODY></HTML>';
    }

}
