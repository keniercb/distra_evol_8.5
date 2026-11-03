<?php

class ControlModel extends ZendExt_Model {

    public function init() {
        parent::ZendExt_Model();
    }

    public function listarIndicadores($params) {
        $objIndicadores = new DatControlejecucion();
        $data = $objIndicadores->listarIndicadores($params);
        return $data;
    }

    public function listarControlEmpresaRector($params) {
        return DatControlejecucion::listarControlEmpresaRector($params);
    }

    public function listarObservacionesControl($params) {
        return HisObservacioncontrol::listarObservacionesControl($params);
    }

    public function listarControlEmpresaTaller($params) {
        return DatControlejecucion::listarControlEmpresaTaller($params);
    }

    public function listarControlEjecucionProductor($params) {
        return DatControlejecucion::listarControlEjecucionProductor($params);
    }

    public function obtenerEjecucionByDemanda($params) {
        return DatControlejecucion::listarControlEjecucionProductorxFecha($params);
    }

    public function exportarControl_Empresa_Taller_Rector($params) {
        $integrator = ZendExt_IoC::getInstance();
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
        //programas
        $params['array_programas'] = array();
        foreach ($params['programas'] as $valorPrograma) {
            $params['array_programas'][$valorPrograma['iddatosnomenclador']] = $valorPrograma['denominacion'];
        }
        unset($params['programas']);
        //destinos
        $params['array_destinos'] = array();
        foreach ($params['destinos'] as $valorPrograma) {
            $params['array_destinos'][$valorPrograma['iddatosnomenclador']] = $valorPrograma['denominacion'];
        }
        unset($params['destinos']);
        //Creando el encabezado
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=control.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo"<H2 align=center>Control</H2>";
        echo"<H3>Ejercicio: {$params['denoejercicio']} <br/>
                 Entidad: {$params['denoentidad']} <br/>
                 Comportamiento: {$params['denotipo']}</H3>";
        echo "<tr>
        <table border=1 cellspacing=0 width=60%>  
             <th align=center>Código</th>
             <th align=center>Denominación</th>
             <th align=center>UM</th>";
        if ($params['panel'] == 'rector') {
            echo "<th align=center>Entidad UIM</th>";
        }
        echo " <th align=center>Cliente</th>
             <th align=center>Programa</th>
             <th align=center>Destino</th>";
        if ($params['panel'] == 'taller') {
            echo "<th align=center>Precio total</th>";
            echo "<th align=center>Precio divisa</th>";
        }
        if ($params['panel'] == 'rector' || $params['panel'] == 'empresa') {
            echo "<th align=center>Estimado</th>";
        }
        echo " <th align=center>Plan</th>
                <th align=center>Ajuste</th>
                <th align=center>Plan final</th>";
        echo "<th align=center>Real</th>
             <th align=center>Diferencia</th>         
             <th align=center>Importe plan</th>
             <th align=center>Importe ajustado</th>
             <th align=center>Importe real</th>
             <th align=center>Diferencia importe</th>
             <th align=center>Importe plan divisa</th>
             <th align=center>Importe divisa ajustado</th>
             <th align=center>Importe real divisa</th>
             <th align=center>Diferencia importe divisa</th>
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
             <th align=center>Diciembre</th>";
        echo "</tr>";
        //Obteniendo los datos
        if ($params['panel'] == 'taller')
            $datos = self::listarControlEjecucionProductor($params);
        if ($params['panel'] == 'empresa' || $params['panel'] == 'rector')
            $datos = self::listarControlEmpresaRector($params);
        //Mostrando los datos
        foreach ($datos->data as $value) {
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacion'] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\" >" . $params['array_um'][$value['idumedida']] . "</td>";
            if ($params['panel'] == 'rector') {
                $datoestructura = $integrator->metadatos->DameEstructura($value['identidaduim']);
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $datoestructura[0]->denominacion . "</td>";
            }
            $datoestructura = $integrator->metadatos->DameEstructura($value['identidadcliente']);
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $datoestructura[0]->denominacion . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\" >" . $params['array_programas'][$value['idprograma']] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\" >" . $params['array_destinos'][$value['iddestino']] . "</td>";
            if ($params['panel'] == 'taller') {
                echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['precio'] . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['preciodivisa'] . "</td>";
            }
            if ($params['panel'] == 'rector' || $params['panel'] == 'empresa') {
                echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['estimado'] . "</td>";
            }
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['plan'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['ajuste'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['planfinal'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['cantreal'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['diferencia'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importeplan'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importeajustado'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importereal'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['diferenciaimporte'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importeplandivisa'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importeajustadodivisa'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importerealdivisa'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['diferenciaimportedivisa'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['enero'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['febrero'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['marzo'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['abril'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['mayo'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['junio'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['julio'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['agosto'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['septiembre'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['octubre'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['noviembre'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['diciembre'] . "</td>";
            echo "</tr>";
        }

        echo "<tr>";
        echo"<td align=left >Totales</td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        if ($params['panel'] == 'rector') {
            echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        }
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        if ($params['panel'] == 'taller') {
            echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
            echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        }
        if ($params['panel'] == 'rector' || $params['panel'] == 'empresa') {
            echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        }
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($datos->data[0]['importeplantotalmn'], 3, ".", ",") . "</td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($datos->data[0]['importeajustadototalmn'], 3, ".", ",") . "</td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($datos->data[0]['importerealtotalmn'], 3, ".", ",") . "</td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($datos->data[0]['diferenciaimportetotalmn'], 3, ".", ",") . "</td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($datos->data[0]['importeplantotalcuc'], 3, ".", ",") . "</td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($datos->data[0]['importeajustadototalcuc'], 3, ".", ",") . "</td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($datos->data[0]['importerealtotalcuc'], 3, ".", ",") . "</td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($datos->data[0]['diferenciaimportetotalcuc'], 3, ".", ",") . "</td>";
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

    public function guardarEjecucionPlan($params) {
        foreach ($params['datos'] as $k => $value) {
            if ($value->idcontrolejecucion) {
                $editarejecucion = Doctrine::getTable('DatControlejecucion')->findByDql("idcontrolejecucion = $value->idcontrolejecucion");
                $editarejecucion[0]->cantidadproducida = $value->cantidadproducida;
                $editarejecucion[0]->idusuario = $params['idusuario'];
                $editarejecucion[0]->fechamodificacion = null;
                $editarejecucion[0]->fecha = $value->fecha;
                $editarejecucion[0]->save();
            } else {
                $editarejecucion = new DatControlejecucion();
                $editarejecucion->iddemandatiempo = $value->iddemandatiempo;
                $editarejecucion->idusuario = $params['idusuario'];
                $editarejecucion->fechamodificacion = NULL;
                $editarejecucion->fecha = $value->fecha;
                $editarejecucion->cantidadproducida = $value->cantidadproducida;
                //if ($value->cantidadproducida > 0) {
                $editarejecucion->save();
                //}
            }
        }
        return 1;
    }

    public function guardarEstimadoControlEmpresa($params) {
        foreach ($params['datos'] as $value) {
            if ($value->iddemanda) {
                $editarAjuste = Doctrine::getTable('DatDemanda')->findByDql("iddemanda = $value->iddemanda");
                if (isset($value->estimado)) {
                    $editarAjuste[0]->estimacion = $value->estimado;
                    $editarAjuste[0]->idusuario = $params['idusuario'];
                    $editarAjuste[0]->fecha = $value->fecha;
                    $editarAjuste[0]->save();
                }
            }
        }
        return 1;
    }

    public function guardarAjusteControlEmpresaTaller($params) {
        foreach ($params['datos'] as $value) {
            if ($value->iddemandatiempo) {
                $editarAjuste = Doctrine::getTable('DatDemandatiempo')->findByDql("iddemandatiempo = $value->iddemandatiempo");
                if (isset($value->ajuste)) {
                    $editarAjuste[0]->ajusteplan = $value->ajuste;
                    $editarAjuste[0]->idusuario = $params['idusuario'];
                    $editarAjuste[0]->fecha = NULL;
                    $editarAjuste[0]->importeajustado = ($value->plan + $value->ajuste) * $value->precio;
                    $editarAjuste[0]->importeajustadodivisa = ($value->plan + $value->ajuste) * $value->preciodivisa;
                    $editarAjuste[0]->save();
                }
            }
        }
        return 1;
    }

    public function eliminarEjecucionPlan($params) {
        foreach ($params['idejecuciones'] as $k => $value) {
            $editarejecucion = Doctrine::getTable('DatControlejecucion')->findByDql("idcontrolejecucion = $value->idcontrolejecucion");
            $editarejecucion[0]->delete();
        }
    }

    public function guardarDemandaExtraPlan($params) {
        $demandaExtraplan = new DatDemanda();
        $demandaExtraplan->idindicador = $params['idindicador'];
        $demandaExtraplan->identidadcliente = $params['idcliente'];
        $demandaExtraplan->identidadorganosatisface = $params['identidadorganosatisface'];
        $demandaExtraplan->idprograma = $params['idprograma'];
        $demandaExtraplan->iddestino = $params['iddestino'];
        $demandaExtraplan->idejercicio = $params['idejercicio'];
        $demandaExtraplan->idusuario = $params['idusuario'];
        $demandaExtraplan->idusuariocrea = $params['idusuario'];
        $demandaExtraplan->idaprobacion = 4;
        $demandaExtraplan->idaprobacionplan = 4;
        $demandaExtraplan->cantidadinicial = $params['cantfinal'];
        $demandaExtraplan->cantidadconfirmada = $params['cantfinal'];
        $demandaExtraplan->extraplan = 1;
        $demandaExtraplan->fecha = NULL;
        if ($params['cantfinal'] > 0) {
            $demandaExtraplan->save();
        }
        return 1;
    }

    public function eliminarDemandaExtraPlan($params) {
        $demanda = Doctrine::getTable('DatDemanda')->findByDql("iddemanda = {$params['iddemanda']}");
        $demanda[0]->delete();
        return 1;
    }

    public function eliminarDesgloseDemandaExtraPlan($params) {
        $demanda = Doctrine::getTable('DatDemandatiempo')->findByDql("iddemandatiempo = {$params['iddemandatiempo']}");
        $demanda[0]->delete();
        return 1;
    }

    public function guardarDatosDesgExtraplan($params) {
        foreach ($params['datos'] as $value) {
            if ($value->iddemandatiempo) {
                $editarDatosDesgExtraplan = Doctrine::getTable('DatDemandatiempo')->findByDql("iddemandatiempo = $value->iddemandatiempo");
            }if ($value->enero) {
                $editarDatosDesgExtraplan[0]->enero = $value->enero;
            }if ($value->febrero) {
                $editarDatosDesgExtraplan[0]->febrero = $value->febrero;
            }if ($value->marzo) {
                $editarDatosDesgExtraplan[0]->marzo = $value->marzo;
            }if ($value->abril) {
                $editarDatosDesgExtraplan[0]->abril = $value->abril;
            }if ($value->mayo) {
                $editarDatosDesgExtraplan[0]->mayo = $value->mayo;
            }if ($value->junio) {
                $editarDatosDesgExtraplan[0]->junio = $value->junio;
            }if ($value->julio) {
                $editarDatosDesgExtraplan[0]->julio = $value->julio;
            }if ($value->agosto) {
                $editarDatosDesgExtraplan[0]->agosto = $value->agosto;
            }if ($value->septiembre) {
                $editarDatosDesgExtraplan[0]->septiembre = $value->septiembre;
            }if ($value->octubre) {
                $editarDatosDesgExtraplan[0]->octubre = $value->octubre;
            }if ($value->noviembre) {
                $editarDatosDesgExtraplan[0]->noviembre = $value->noviembre;
            }if ($value->diciembre) {
                $editarDatosDesgExtraplan[0]->diciembre = $value->diciembre;
            }
            if ($value->cantidaddesglosada) {
                $editarDatosDesgExtraplan[0]->cantidaddesglosada = $value->cantidaddesglosada;
                $editarDatosDesgExtraplan[0]->importe = $editarDatosDesgExtraplan[0]->cantidaddesglosada * $editarDatosDesgExtraplan[0]->preciodesglosado;
                $editarDatosDesgExtraplan[0]->importedivisa = $editarDatosDesgExtraplan[0]->cantidaddesglosada * $editarDatosDesgExtraplan[0]->preciodesglosadodivisa;
                $editarDatosDesgExtraplan[0]->importeajustado = ($editarDatosDesgExtraplan[0]->cantidaddesglosada + $editarDatosDesgExtraplan[0]->ajusteplan) * $editarDatosDesgExtraplan[0]->preciodesglosado;
                $editarDatosDesgExtraplan[0]->importeajustadodivisa = ($editarDatosDesgExtraplan[0]->cantidaddesglosada + $editarDatosDesgExtraplan[0]->ajusteplan) * $editarDatosDesgExtraplan[0]->preciodesglosadodivisa;
            }
            if ($value->preciodesglosado) {
                $editarDatosDesgExtraplan[0]->preciodesglosado = $value->preciodesglosado;
                $editarDatosDesgExtraplan[0]->importe = $editarDatosDesgExtraplan[0]->cantidaddesglosada * $editarDatosDesgExtraplan[0]->preciodesglosado;
                $editarDatosDesgExtraplan[0]->importeajustado = ($editarDatosDesgExtraplan[0]->cantidaddesglosada + $editarDatosDesgExtraplan[0]->ajusteplan) * $editarDatosDesgExtraplan[0]->preciodesglosado;
            }
            if ($value->preciodesglosadodivisa) {
                $editarDatosDesgExtraplan[0]->preciodesglosadodivisa = $value->preciodesglosadodivisa;
                $editarDatosDesgExtraplan[0]->importedivisa = $editarDatosDesgExtraplan[0]->cantidaddesglosada * $editarDatosDesgExtraplan[0]->preciodesglosadodivisa;
                $editarDatosDesgExtraplan[0]->importeajustadodivisa = ($editarDatosDesgExtraplan[0]->cantidaddesglosada + $editarDatosDesgExtraplan[0]->ajusteplan) * $editarDatosDesgExtraplan[0]->preciodesglosadodivisa;
            }

            $editarDatosDesgExtraplan->idusuario = $params['idusuario'];
            $editarDatosDesgExtraplan->fecha = NULL;
            $editarDatosDesgExtraplan[0]->save();
        }
        return 1;
    }

    //metodo para guardar las observaciones
    public function guardarObservacionControl($params) {
        //obtengo el objeto observacion para saber si existe alguna en ese mes
        //puesto que solo puede haber una por mes
        $observacion = Doctrine::getTable('HisObservacioncontrol')->findByDql("iddemandatiempo = {$params['iddemandatiempo']} AND idmes = {$params['idmes']}");

        if ($observacion[0]->iddemandatiempo) {
            //si ya existe se actualiza        
            $observacion[0]->observacion = $params['observacion'];
            $observacion[0]->idusuario = $params['idusuario'];
            $observacion[0]->identidad = $params['identidad'];
            $observacion[0]->fecha = NULL;
            $observacion[0]->save();
        } else {
            //si no se inserta la nueva observacion        
            $observacion = new HisObservacioncontrol();
            $observacion->iddemandatiempo = $params['iddemandatiempo'];
            $observacion->iddemanda = $params['iddemanda'];
            $observacion->idusuario = $params['idusuario'];
            $observacion->idmes = $params['idmes'];
            $observacion->identidad = $params['identidad'];
            $observacion->observacion = $params['observacion'];
            $observacion->fecha = NULL;
            $observacion->save();
            //pregunta si esa demanda no tenia ninguna observacion
            $demandatiempo = Doctrine::getTable('DatDemandatiempo')->findByDql("iddemandatiempo = {$params['iddemandatiempo']} AND tieneobservacion = 0");
            if ($demandatiempo[0]->iddemandatiempo) {
                //si esta es la 1ra observacion se le setea el campo tieneobservacion            
                $demandatiempo[0]->tieneobservacion = 1;
                $demandatiempo->save();
            }
        }
        //si se inserto o se actualizo alguna observacion
        if ($observacion->idobservacioncontrol || $observacion[0]->idobservacioncontrol) {
            return 1;
        } else {
            return 0;
        }
    }

}
