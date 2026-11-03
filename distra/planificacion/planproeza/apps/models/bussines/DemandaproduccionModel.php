<?php

class DemandaproduccionModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listarIndicadoresEmpresaAddDemanda($params) {
        $data = DatDemanda::listarIndicadoresEmpresaAddDemanda($params);
        return $data;
    }

    public function obtenerNaturalezas($params) {
        $objNaturalezas = new DatDemanda();
        $data = $objNaturalezas->obtenerNaturalezas($params);
        return $data;
    }

    public function listarDemandas($params) {
        $objDemandas = new DatDemanda();
        $data = $objDemandas->listarDemandas($params);
        return $data;
    }

    public function listarObservaciones($params) {
        $observaciones = new HisObservacion();
        $data = $observaciones->listarObservaciones($params);
        return $data;
    }

    public function listarEntidadesProductorasIndicador($params) {
        $integrator = ZendExt_IoC::getInstance();
        $data = DatDemanda::listarEntidadesProductorasIndicador($params['idindicador']);
        $result = array();
        foreach ($data as $key => $entidad) {
            $datosentidad = $integrator->metadatos->DameEstructura($entidad['identidad']);
            $result[$key]['identidadorganosatisface'] = $entidad['identidadorganosatisface'];
            $result[$key]['identidad'] = $datosentidad[0]->id;
            $result[$key]['denominacion'] = $datosentidad[0]->denominacion;
        }
        return $result;
    }

    public function cargarProgramas() {
        $objProgramas = new DatDemanda();
        $data = $objProgramas->cargarProgramas();
        return $data;
    }

    public function cargarDestinos() {
        $objDestinos = new DatDemanda();
        $data = $objDestinos->cargarDestinos();
        return $data;
    }

    public function aprobarDesaprobarDemanda($params) {
        $actualizados = 0;
        $total = count($params['demandas']);
        if ($params['demandas'][0]->iddemanda != null) {
            $integrator = ZendExt_IoC::getInstance();
            $idprogramaPorDefecto = NomDatosnomenclador::getDatosNomPorUriTipoNom("Programa", "-");
            $iddestinoPorDefecto = NomDatosnomenclador::getDatosNomPorUriTipoNom("Destino", "-");

            //$idprogramaPorDefecto = DatDemanda::selecIdDatosnomenclador(15093);
            //$iddestinoPorDefecto = DatDemanda::selecIdDatosnomenclador(15102);
            foreach ($params['demandas'] as $demanda) {
                $ObjDatDemanda = Doctrine::getTable('DatDemanda')->findByDql("iddemanda =" . $demanda->iddemanda);
                if ($ObjDatDemanda[0]->idaprobacion == $params['valorAComprobar']) {
                    //aprobando...
                    if ($params['accion'] == 0 || ($ObjDatDemanda[0]->cantidadconfirmada > 0 && $ObjDatDemanda[0]->iddestino != $iddestinoPorDefecto[0]['iddatosnomenclador'] && $ObjDatDemanda[0]->idprograma != $idprogramaPorDefecto[0]['iddatosnomenclador'])) {
                        //si estoy desaprobando... o la cantidad final es mayor que 0 (porque se está aprobando)
                        $fecha = strftime("%d/%m/%Y %T", time());
                        $ObjDatDemanda[0]->idaprobacion = $params['idaprobacion'];
                        if ($params['idaprobacion'] == 4) {
                            $ObjDatDemanda[0]->idaprobacionplan = 1;
                        }
                        $ObjDatDemanda[0]->idusuario = $params['idusuario'];
                        $ObjDatDemanda[0]->fecha = $fecha;
                        $ObjDatDemanda->save();
                        $actualizados++;
                    }
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

    public function eliminarDemanda($params) {
        $objDemanda = new DatDemanda();
        $demandas = $params['demandas'];
        $count = count($params['demandas']);
        $ok = 0;
        foreach ($demandas as $key => $demanda) {
            $params['iddemanda'] = $demanda->iddemanda;
            $observDel = new HisObservacion();
            $data = $objDemanda->eliminarDemanda($params);
            if ($data === 1) {
                $ok++;
            }
        }
        if ($ok == $count) {
            return 1;
        } else if ($ok == 0) {
            return 0;
        } else
            return 2;
    }

    public function guardarDemanda($params) {
        $actualizados = 0;

        $objDemanda = new DatDemanda();
        $demandas = $params['demandas'];
        $total = count($demandas);
        foreach ($demandas as $key => $demanda) {
            $filademanda = Doctrine::getTable('DatDemanda')->findByDql("iddemanda =" . $demanda->iddemanda);
            if ($filademanda[0]->iddemanda) {
                if (isset($demanda->cantidadinicial)) {
                    $filademanda[0]->cantidadinicial = $demanda->cantidadinicial;
                    $filademanda[0]->cantidadconfirmada = $filademanda[0]->cantidadinicial + $filademanda[0]->ajuste;
                }
                if (isset($demanda->ajuste)) {
                    $filademanda[0]->ajuste = $demanda->ajuste;
                    $filademanda[0]->cantidadconfirmada = $filademanda[0]->cantidadinicial + $filademanda[0]->ajuste;
                }
                if (isset($demanda->tieneobservacion)) {
                    $filademanda[0]->tieneobservacion = $demanda->tieneobservacion;
                }
                if (isset($demanda->idaprobacion)) {
                    $filademanda[0]->idaprobacion = $demanda->idaprobacion;
                }
                if (isset($demanda->idprograma)) {
                    $filademanda[0]->idprograma = $demanda->idprograma;
                }
                if (isset($demanda->iddestino)) {
                    $filademanda[0]->iddestino = $demanda->iddestino;
                }
                $fecha = strftime("%d/%m/%Y %T", time());
                $filademanda[0]->fecha = $fecha;
                $filademanda[0]->idusuario = $params['idusuario'];
                $filademanda->save();
                $actualizados++;
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

    public function guardarObservacion($params) {

        $filademanda = Doctrine::getTable('DatDemanda')->findByDql("iddemanda =" . $params['iddemanda']);
        if ($filademanda[0]->iddemanda) {
            $filademanda[0]->tieneobservacion = 1;
            $filademanda->save();

            $observacion = new HisObservacion();
            $observacion->iddemanda = $params['iddemanda'];
            $observacion->idusuario = $params['idusuario'];
            $observacion->observacion = $params['observacion'];
            $fecha = strftime("%d/%m/%Y %T", time());
            $observacion->fecha = $fecha;

            $observacion->save();
            return 1;
        } else {
            return 0;
        }
    }

    public function adicionarDemanda($params) {
        $idDatosNomencladorArray = NomDatosnomenclador::getDatosNomPorUriTipoNomArray("'Programa','Destino'", '-');
        $idDatosNomenclador[$idDatosNomencladorArray[0]['uritiponomenclador']] = $idDatosNomencladorArray[0]['iddatosnomenclador'];
        $idDatosNomenclador[$idDatosNomencladorArray[1]['uritiponomenclador']] = $idDatosNomencladorArray[1]['iddatosnomenclador'];
        $demanda = new DatDemanda();
        $demanda->idindicador = $params['idindicador'];
        $demanda->identidadcliente = $params['idcliente'];
        $demanda->identidadorganosatisface = $params['identidadorganosatisface'];
        $demanda->idprograma = $idDatosNomenclador['Programa'];
        $demanda->iddestino = $idDatosNomenclador['Destino'];
        $demanda->idejercicio = $params['idejercicio'];
        $demanda->fechalimite = $params['fechalimite'];
        $demanda->idusuario = $params['idusuario'];
        $demanda->idusuariocrea = $params['idusuario'];
        $demanda->idaprobacion = 1;
        $demanda->idaprobacionplan = 1;
        $demanda->cantidadinicial = $params['cant'];
        $demanda->cantidadconfirmada = $params['cant']; //Linea añadida para permitir obtener el importe al listar la demanda por primera vez
        $demanda->fecha = NULL;
        if ($params['cant'] > 0) {
            $demanda->save();
        }
        return 1;
    }

    public function obtenerComportamientoClienteProductor($params) {
        $comportamiento = array();
        $obj = DatEntidaddatosnomenclador::getComportamientoClienteProductor($params);


        $pos = 0;
        $organoconsumidor = NomDatosnomenclador::getDatosNomPorUriTipoNom("Comportamientodeentidad", "organoconsumidor");
        $organoempresarial = NomDatosnomenclador::getDatosNomPorUriTipoNom("Comportamientodeentidad", "organoempresarial");
        $organorector = NomDatosnomenclador::getDatosNomPorUriTipoNom("Comportamientodeentidad", "rectorbalance");
        foreach ($obj as $key => $entidad) {

            if ($entidad['iddatosnomenclador'] == $organoconsumidor[0]['iddatosnomenclador']) {//Organo consumidor
                $comportamiento[$pos]['idtipocomportamiento'] = 1;
                $comportamiento[$pos]['denominacion'] = "Cliente";
                $pos++;
            } else if ($entidad['iddatosnomenclador'] == $organoempresarial[0]['iddatosnomenclador']) {//Organo empresarial
                $comportamiento[$pos]['idtipocomportamiento'] = 2;
                $comportamiento[$pos]['denominacion'] = "Proveedor";
                $pos++;
            } else if ($entidad['iddatosnomenclador'] == $organorector[0]['iddatosnomenclador']) {//Organo rector
                $comportamiento[$pos]['idtipocomportamiento'] = 3;
                $comportamiento[$pos]['denominacion'] = "Rector";
                $pos++;
            }
        }
        return $comportamiento;
    }

    public function exportarDemandas($params) {
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
        //Programas
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

        //Entidades
        //$data_entidades = DatProduccionModel::listarClientes($params);



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
        //
        $params['array_entidad'] = array();
        foreach ($data_entidades as $entidad) {
            $params['array_entidad'][$entidad['idestructura']] = $entidad['denominacion'];
        }
        unset($data_entidades);

        unset($data_usuarios);
        //print_r($params);die();
        //FIn de los stores
        //Creando el encabezado
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-type: application/vnd.ms-excel; charset=UTF-8");
        header("Content-Encoding: utf-8");
        //header("Transfer-Encoding: chunked");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=demandas_.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo"<H2 align=center>Demandas</H2>";
        echo"<H3>Ejercicio: {$params['denoejercicio']} <br/>
                 Entidad: {$params['denoentidad']} <br/>
                 Comportamiento: {$params['denotipo']}</H3>";
        echo "<tr>
        <table border=1 cellspacing=0 width=60%>  
             <th align=center>Código</th>
             <th align=center>Denominación</th>
             <th align=center>UM</th>     
             <th align=center>Entidad UIM</th>   
              <th align=center>Cliente</th>
              
             <th align=center>Programa</th>
             <th align=center>Destino</th>
             <th align=center>Cantidad</th>
             <th align=center>Ajuste</th>
             <th align=center>Cantidad final</th>             
             <th align=center>Precio</th>
             <th align=center>Precio divisa</th>  
             <th align=center>Importe</th>
             <th align=center>Importe divisa</th>  
             <th align=center>Fecha límite</th>
             <th align=center>Aprobado</th>
             <th align=center>Observación</th>";
        echo "</tr>";
        //Obteniendo los datos
        $datos = self::listarDemandas($params);
        //Mostrando los datos
        foreach ($datos as $value) {
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacion'] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\" >" . $params['array_um'][$value['idumedida']] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_entidad'][$value['identidadproveedor']] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_entidad'][$value['identidadcliente']] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_programa'][$value['idprograma']] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_destino'][$value['iddestino']] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['cantidadinicial'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['ajuste'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['cantidadconfirmada'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . $value['precio'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . $value['preciodivisa'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . $value['importeestmn'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . $value['importeestcuc'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['fechalimite'] . "</td>";

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
            if ($value['tieneobservacion'] == 1)
                $observacion = "Sí";
            else
                $observacion = "No";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $observacion . "</td>";
            echo "</tr>";
        }
        echo "</table>\n";
        echo"<H6 align=right>Documento generado por PROEZA<br/>";
        $fecha = strftime("%Y/%m/%d %T", time());
        echo"Fecha: {$fecha}</H6>.";
        echo '</BODY></HTML>';
    }

    public function listarEntidadesProductoras($params) {
        $integrator = ZendExt_IoC::getInstance();
        $objEntidadesProductoras = new DatDemanda();
        $data = $objEntidadesProductoras->listarEntidadesProductoras();
        $result = array();
        foreach ($data as $key => $entidad) {
            $datosentidad = $integrator->metadatos->DameEstructura($entidad['identidad']);
            $result[$key]['identidadorganosatisface'] = $entidad['identidadorganosatisface'];
            $result[$key]['identidad'] = $datosentidad[0]->id;
            $result[$key]['denominacion'] = $datosentidad[0]->denominacion;
        }
        return $result;
    }

}
