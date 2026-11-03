<?php

class ReportesproezaModel extends ZendExt_Model {

    public function cargarEntidadesUIM($identidad) {
        $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad, false);
        $identidades = implode(',', $entidades);
        $data = DatDemanda::listarEntidadesProductoras($identidades);

        $integrator = ZendExt_IoC::getInstance();
        foreach ($data as $k => $value) {
            $datosentidad = $integrator->metadatos->DameEstructura($value['identidad']);
            $data[$k]['denominacion'] = $datosentidad[0]->denominacion;
        }
        return $data;
    }

    public function listarEntidadesDadoComp($comp) {
        $params['comp'] = $comp;
        $integrator = ZendExt_IoC::getInstance();
        $idEstructura = DatEntidaddatosnomenclador::obtenerEntidadRectora();

        $entidadesdenom = array();
        $entidades = $integrator->integrator->metadatos->getEstructurasHijasById(0, $idEstructura[0]['identidad']);
        $cadenaidentidades = $entidades[0]['id'];
        foreach ($entidades as $key => $value) {
            if ($key != 0)
                $cadenaidentidades.="," . $value['id'];
            $entidadesdenom[$value['id']] = $value['text'];
        }
        $identidades = DatEntidaddatosnomenclador::obtenerEntDadoCompArrayEnt($cadenaidentidades, $params['comp']);
        $result = array();
        foreach ($identidades as $k => $v) {
            $result[$k]['idestructura'] = $v;
            $result[$k]['denominacion'] = $entidadesdenom[$v];
        }
        return $result;
    }

    public function cargarColumnasPorPeriodo($params) {
        $uridatosnomenclador = mb_convert_case($params['uridatosnomenclador'], MB_CASE_UPPER, 'UTF-8');
        $result = NomDatosnomenclador::getDatosNomPorUriTipoNom($uridatosnomenclador, false, "-");
        return $result;
    }

    public function obtenerEntidadesDemandantes() {
        $integrator = ZendExt_IoC::getInstance();
        $data = DatEntidaddatosnomenclador::getTodosLosOrganosDemandantes();
        $result = array();
        foreach ($data as $key => $entidad) {
            $datosentidad = $integrator->metadatos->DameEstructura($entidad);
            $result[$key]['identidad'] = $datosentidad[0]->id;
            $result[$key]['denominacion'] = $datosentidad[0]->denominacion;
        }
        unset($data);
        return $result;
    }

    public function exportarReportes($params) {
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
        //Entidades UIM (Empresas)
        $integrator = ZendExt_IoC::getInstance();
        $idEstructura = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $entidadesdenom = array();
        $entidades = $integrator->metadatos->getEstructurasHijasById(0, $idEstructura[0]['identidad']);
        $cadenaidentidades = $entidades[0]['id'];
        foreach ($entidades as $key => $value) {
            if ($key != 0)
                $cadenaidentidades.="," . $value['id'];
            $entidadesdenom[$value['id']] = $value['text'];
        }
        $identidades = DatEntidaddatosnomenclador::obtenerEntDadoCompArrayEnt($cadenaidentidades, 'organoempresarial');
        $result = array();
        foreach ($identidades as $k => $v) {
            $result[$k]['idestructura'] = $v;
            $result[$k]['denominacion'] = $entidadesdenom[$v];
        }
        $data_entidades = DatProduccionModel::listarClientes($params);
        $params['array_entidad'] = array();
        foreach ($result as $entidad) {
            $params['array_entidad'][$entidad['idestructura']] = $entidad['denominacion'];
        }

        unset($entidadesdenom);
        unset($cadenaidentidades);
        unset($entidades);
        unset($identidades);
        unset($result);
        unset($data_entidades);
        //traer los clientes
        $params['comp'] = 'organoconsumidor';
        $clientes = ReportesproezaModel::listarEntidadesDadoComp($params['comp']);
        $params['array_clientes'] = array();
        foreach ($clientes as $entidad) {
            $params['array_clientes'][$entidad['idestructura']] = $entidad['denominacion'];
        }

        unset($data_entidades);
        //FIn de los stores
        //Procesando los parámetros        
        $idEntidadesUIM = explode(',', $params['entidadesUIM']);

        $denoEntidadesUIM = "";
        foreach ($idEntidadesUIM as $identidad) {
            $datosentidad = $integrator->metadatos->DameEstructura($identidad);
            if ($denoEntidadesUIM == "")
                $denoEntidadesUIM = $datosentidad[0]->denominacion;
            else
                $denoEntidadesUIM = $denoEntidadesUIM . ', ' . $datosentidad[0]->denominacion;
            unset($datosentidad);
        }

        $idClientes = explode(',', $params['clientes']);
        $denoClientes = "";
        foreach ($idClientes as $identidad) {
            $datosentidad = $integrator->metadatos->DameEstructura($identidad);
            if ($denoClientes == "")
                $denoClientes = $datosentidad[0]->denominacion;
            else
                $denoClientes = $denoClientes . ', ' . $datosentidad[0]->denominacion;
            unset($datosentidad);
        }

        $denoProgramas = "";
        $params['idprogramas'] = "";
        foreach ($params['programas'] as $programa) {
            if ($denoProgramas == "") {
                $denoProgramas = $programa->denominacion;
                $params['idprogramas'] = $programa->iddatosnomenclador;
            } else {
                $denoProgramas = $denoProgramas . ', ' . $programa->denominacion;
                $params['idprogramas'] = $params['idprogramas'] . ', ' . $programa->iddatosnomenclador;
            }
        }
        unset($params['programas']);
        $denoDestinos = "";
        $params['iddestinos'] = "";
        foreach ($params['destinos'] as $destino) {
            if ($denoDestinos == "") {
                $denoDestinos = $destino->denominacion;
                $params['iddestinos'] = $destino->iddatosnomenclador;
            } else {
                $denoDestinos = $denoDestinos . ', ' . $destino->denominacion;
                $params['iddestinos'] = $params['iddestinos'] . ', ' . $destino->iddatosnomenclador;
            }
        }
        unset($params['destinos']);

        //Creando el encabezado
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=reporteCP-1_general.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "<H2 align=center>Demandas</H2>";
        echo "<H3>Ejercicio: {$params['denoejercicio']} <br/>";
        echo "Período: {$params['denoperiodo']} <br/>";
        if ($denoEntidadesUIM)
            echo "Entidades UIM: {$denoEntidadesUIM} <br/>";
        if ($denoClientes)
            echo "Clientes: {$denoClientes} <br/>";
        if ($denoProgramas)
            echo "Programas: {$denoProgramas} <br/>";
        if ($denoDestinos)
            echo "Destinos: {$denoDestinos} <br/>";
        echo "</H3>";
        echo "<TABLE border=1 align=left cellpadding=1 cellspacing=0>";
        echo "<TR>";
        echo "  <TD width=81 ROWSPAN=4 align=center><FONT face=Calibri size=2 color=#000000><B>Código</B></FONT></TD>
                <TD width=183 ROWSPAN=4 align=center><FONT face=Calibri size=2 color=#000000><B>Denominación</B></FONT></TD>
                <TD width=52 ROWSPAN=4 align=center><FONT face=Calibri size=2 color=#000000><B>UM</B></FONT></TD>
                <TD width=158 ROWSPAN=4 align=center><FONT face=Calibri size=2 color=#000000><B>Programa</B></FONT></TD>
                <TD width=54 ROWSPAN=4 align=center><FONT face=Calibri size=2 color=#000000><B>Destino</B></FONT></TD>
                <TD width=374 ROWSPAN=4 align=center><FONT face=Calibri size=2 color=#000000><B>Entidad UIM</B></FONT></TD>
                <TD width=348 ROWSPAN=4 align=center><FONT face=Calibri size=2 color=#000000><B>Cliente</B></FONT></TD>
                <TD width=335 ROWSPAN=2 COLSPAN=4 align=center><FONT face=Calibri size=2 color=#000000><B>Plan</B></FONT></TD>
                <TD width=335 ROWSPAN=2 COLSPAN=4 align=center><FONT face=Calibri size=2 color=#000000><B>Real acumulado</B></FONT></TD>";
   
        foreach ($params['columnas'] as $columna) {
            echo "<TD width=671 COLSPAN=8 align=center><FONT face=Calibri size=2 color=#000000><B>" . $columna->denominacion . "</B></FONT></TD>";
        }
        echo "</TR>";
        echo "<TR>";
        foreach ($params['columnas'] as $columna) {
            echo "<TD width=335 COLSPAN=4 align=center><FONT face=Calibri size=2 color=#000000><B>Plan</B></FONT></TD>";
            echo "<TD width=335 COLSPAN=4 align=center><FONT face=Calibri size=2 color=#000000><B>Real</B></FONT></TD>";
        }
        echo "</TR>";
        echo "<TR>";
        echo "  <TD width=84 ROWSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>UF</B></FONT></TD>
                <TD width=252 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>Importe</B></FONT></TD>
                <TD width=84 ROWSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>UF</B></FONT></TD>
                <TD width=252 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>Importe</B></FONT></TD>";
        foreach ($params['columnas'] as $columna) {
            echo "<TD width=84 ROWSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>UF</B></FONT></TD>";
            echo "<TD width=252 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>Importe</B></FONT></TD>";
            echo "<TD width=84 ROWSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>UF</B></FONT></TD>";
            echo "<TD width=252 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>Importe</B></FONT></TD>";
        }
        echo "</TR>";
        echo "<TR>";
        echo "  <TD width=84 align=left><FONT face=Calibri size=2 color=#000000><B>Total</B></FONT></TD>
                <TD width=84 align=left><FONT face=Calibri size=2 color=#000000><B>MN</B></FONT></TD>
                <TD width=84 align=left><FONT face=Calibri size=2 color=#000000><B>CUC</B></FONT></TD>
                <TD width=84 align=left><FONT face=Calibri size=2 color=#000000><B>Total</B></FONT></TD>
                <TD width=84 align=left><FONT face=Calibri size=2 color=#000000><B>MN</B></FONT></TD>
                <TD width=84 align=left><FONT face=Calibri size=2 color=#000000><B>CUC</B></FONT></TD>";
        foreach ($params['columnas'] as $columna) {
            echo "<TD width=84 align=center><FONT face=Calibri size=2 color=#000000><B>Total</B></FONT></TD>";
            echo "<TD width=84 align=center><FONT face=Calibri size=2 color=#000000><B>MN</B></FONT></TD>";
            echo "<TD width=84 align=center><FONT face=Calibri size=2 color=#000000><B>CUC</B></FONT></TD>";
            echo "<TD width=84 align=center><FONT face=Calibri size=2 color=#000000><B>Total</B></FONT></TD>";
            echo "<TD width=84 align=center><FONT face=Calibri size=2 color=#000000><B>MN</B></FONT></TD>";
            echo "<TD width=84 align=center><FONT face=Calibri size=2 color=#000000><B>CUC</B></FONT></TD>";
        }
        echo "</TR>";
        //Datos
        $datos = Reportesproeza:: listarReportePlanControlxMes($params);
        $totalmn = 0;
        $totalcuc = 0;
        $totalmt = 0;
        $arraymn = array();
        $arraycuc = array();
        $arraymt = array();
        foreach ($datos as $value) {
            // calculo del importe total real en MN
            $totalmn = $totalmn + $value['importerealmn'];
            // calculo del importe total real en CUC
            $totalcuc = $totalcuc + $value['importerealcuc'];
            echo "<TR>";
            //codigo
            echo "<TD width=81 align=left style=\"mso-number-format:'@';\"><FONT face=Calibri size=2 color=#000000>" . $value['codigo'] . "</FONT></TD>";
            //denominacion
            echo "<TD width=183 align=left style=\"mso-number-format:'@';\"><FONT face=Calibri size=2 color=#000000>" . $value['denominacion'] . "</FONT></TD>";
            //um
            echo "<TD width=52 align=left style=\"mso-number-format:'@';\"><FONT face=Calibri size=2 color=#000000>" . $params['array_um'][$value['idumedida']] . "</FONT></TD>";
            //programa
            echo "<TD width=158 align=left style=\"mso-number-format:'@';\"><FONT face=Calibri size=2 color=#000000>" . $params['array_programa'][$value['idprograma']] . "</FONT></TD>";
            //destino
            echo "<TD width=54 align=left style=\"mso-number-format:'@';\"><FONT face=Calibri size=2 color=#000000>" . $params['array_destino'][$value['iddestino']] . "</FONT></TD>";
            //entidad UIM
            echo "<TD width=374 align=left style=\"mso-number-format:'@';\"><FONT face=Calibri size=2 color=#000000>" . $params['array_entidad'][$value['identidadproveedor']] . "</FONT></TD>";
            //cliente
            echo "<TD width=348 align=left style=\"mso-number-format:'@';\"><FONT face=Calibri size=2 color=#000000>" . $params['array_clientes'][$value['identidadcliente']] . "</FONT></TD>";
            //plan (anual)
            echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value['plan'] . "</FONT></TD>";
            echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value['importeplantotal'] / 1000 . "</FONT></TD>";
            echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value['importeplanmn'] / 1000 . "</FONT></TD>";
            echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value['importeplancuc'] / 1000 . "</FONT></TD>";
            //real (acumulado)
            echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value['cantreal'] . "</FONT></TD>";
            echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value['importerealtotal'] / 1000 . "</FONT></TD>";
            echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value['importerealmn'] / 1000 . "</FONT></TD>";
            echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value['importerealcuc'] / 1000 . "</FONT></TD>";

            //datos de las columnas dinamicas
            foreach ($params['columnas'] as $columna) {
                //plan
                $mes = mb_convert_case($columna->uridatosnomenclador, MB_CASE_LOWER, 'UTF-8');
                $arraymn[$mes] = $arraymn[$mes] + $value['importe' . $mes . 'mn'];
                $arraycuc[$mes] = $arraycuc[$mes] + $value['importe' . $mes . 'cuc'];
                $arraymt[$mes] = $arraymt[$mes] + $value['importe' . $mes . 'total'];
                echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value[$mes . 'plan'] . "</FONT></TD>";
                echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value['importeplan' . $mes . 'total'] / 1000 . "</FONT></TD>";
                echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value['importeplan' . $mes . 'mn'] / 1000 . "</FONT></TD>";
                echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value['importeplan' . $mes . 'cuc'] / 1000 . "</FONT></TD>";
                //real
                echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value[$mes] . "</FONT></TD>";
                echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value['importe' . $mes . 'total'] / 1000 . "</FONT></TD>";
                echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value['importe' . $mes . 'mn'] / 1000 . "</FONT></TD>";
                echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $value['importe' . $mes . 'cuc'] / 1000 . "</FONT></TD>";
            }
            echo "</TR>";
        }

        // calculo del importe total real en moneda total
        $totalmt = $totalmn + $totalcuc;
        //Pinatando la fila de los totales
        echo "<tr>";
        echo"<td align=left >Totales</td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($datos[0]['importeplantotalmonedatotal'] / 1000, 3, ".", ",") . "</td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($datos[0]['importeplantotalmn'] / 1000, 3, ".", ",") . "</td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($datos[0]['importeplantotalcuc'] / 1000, 3, ".", ",") . "</td>";
        echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($totalmt / 1000, 3, ".", ",") . "</td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($totalmn / 1000, 3, ".", ",") . "</td>";
        echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . number_format($totalcuc / 1000, 3, ".", ",") . "</td>";

        //pintar totales de las columnas dinamicas   
        foreach ($params['columnas'] as $columna) {
            //plan
            $mes = mb_convert_case($columna->uridatosnomenclador, MB_CASE_LOWER, 'UTF-8');
            echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
            echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . number_format($datos[0]['importeplantotalmt' . $mes] / 1000, 3, ".", ",") . "</FONT></TD>";
            echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . number_format($datos[0]['importeplantotalmn' . $mes] / 1000, 3, ".", ",") . "</FONT></TD>";
            echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . number_format($datos[0]['importeplantotalcuc' . $mes] / 1000, 3, ".", ",") . "</FONT></TD>";

            //real
            echo"<td align=left style=\"mso-number-format:'@';\" ></td>";
            echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $arraymt[$mes] / 1000 . "</FONT></TD>";
            echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $arraymn[$mes] / 1000 . "</FONT></TD>";
            echo "<TD width=84 align=right style=\"mso-number-format:'#,##0.000';\"><FONT face=Calibri size=2 color=#000000>" . $arraycuc[$mes] / 1000 . "</FONT></TD>";
        }
        echo "</tr>";
        echo "</TABLE>\n";
        echo "<br/>\n";

        //Insertando las observaciones del control al final del reporte
        $params['urimes'] = "";
        foreach ($params['columnas'] as $columna) {
            if ($params['uriperiodo'] == 'Mes')
                $params['urimes'] = $params['urimes'] . "'" . strtolower($columna->uridatosnomenclador) . "'" . ',';
            else if ($params['uriperiodo'] == 'Trimestre' || 'Semestre') {
                if ($columna->uridatosnomenclador == 'ITRIMESTRE' || $columna->uridatosnomenclador == 'ISEMESTRE') {
                    $params['urimes'] = $params['urimes'] . "'" . 'enero' . "'" . ',';
                    $params['urimes'] = $params['urimes'] . "'" . 'febrero' . "'" . ',';
                    $params['urimes'] = $params['urimes'] . "'" . 'marzo' . "'" . ',';
                }
                if ($columna->uridatosnomenclador == 'IITRIMESTRE' || $columna->uridatosnomenclador == 'ISEMESTRE') {
                    $params['urimes'] = $params['urimes'] . "'" . 'abril' . "'" . ',';
                    $params['urimes'] = $params['urimes'] . "'" . 'mayo' . "'" . ',';
                    $params['urimes'] = $params['urimes'] . "'" . 'junio' . "'" . ',';
                }
                if ($columna->uridatosnomenclador == 'IIITRIMESTRE' || $columna->uridatosnomenclador == 'IISEMESTRE') {
                    $params['urimes'] = $params['urimes'] . "'" . 'julio' . "'" . ',';
                    $params['urimes'] = $params['urimes'] . "'" . 'agosto' . "'" . ',';
                    $params['urimes'] = $params['urimes'] . "'" . 'septiembre' . "'" . ',';
                }
                if ($columna->uridatosnomenclador == 'IVTRIMESTRE' || $columna->uridatosnomenclador == 'IISEMESTRE') {
                    $params['urimes'] = $params['urimes'] . "'" . 'octubre' . "'" . ',';
                    $params['urimes'] = $params['urimes'] . "'" . 'noviembre' . "'" . ',';
                    $params['urimes'] = $params['urimes'] . "'" . 'diciembre' . "'" . ',';
                }
            }
        }
        $params['urimes'] = rtrim($params['urimes'], ', ');

        //Entidades ejecutoras
        $integrator = ZendExt_IoC::getInstance();
        $idEstructura = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $entidadesdenom = array();
        $entidades = $integrator->metadatos->getEstructurasHijasById(0, $idEstructura[0]['identidad']);
        $cadenaidentidades = $entidades[0]['id'];
        foreach ($entidades as $key => $value) {
            if ($key != 0)
                $cadenaidentidades.="," . $value['id'];
            $entidadesdenom[$value['id']] = $value['text'];
        }
        $identidades = DatEntidaddatosnomenclador::obtenerEntDadoCompArrayEnt($cadenaidentidades, 'ejecutor');
        $result = array();
        foreach ($identidades as $k => $v) {
            $result[$k]['idestructura'] = $v;
            $result[$k]['denominacion'] = $entidadesdenom[$v];
        }
        $data_entidades = DatProduccionModel::listarClientes($params);
        $params['array_entidadejecutora'] = array();
        foreach ($result as $entidad) {
            $params['array_entidadejecutora'][$entidad['idestructura']] = $entidad['denominacion'];
        }
        unset($entidadesdenom);
        unset($cadenaidentidades);
        unset($entidades);
        unset($identidades);
        unset($result);
        unset($data_entidades);

        foreach ($datos as $value) {
            $params['iddemanda'] = $value['iddemanda'];
            $observaciones = HisObservacioncontrol::listarObservacionesReportes($params);
            if ($observaciones[0]['idobservacioncontrol'] != null) {
                echo "<TABLE border=1 align=left cellpadding=1 cellspacing=0>";
                echo "<H3>Demanda: {$value['codigo']} / {$value['denominacion']}<br/>";
                echo "<TR>";
                echo "  <TD width=81 align=center><FONT face=Calibri size=2 color=#000000><B>Período</B></FONT></TD>
          <TD width=183 align=center><FONT face=Calibri size=2 color=#000000><B>Ejecutor</B></FONT></TD>
          <TD width=52 colspan=5 align=center><FONT face=Calibri size=2 color=#000000><B>Texto</B></FONT></TD>";
                echo "</TR>";
                foreach ($observaciones as $v) {
                    echo "<TR>";
                    echo "<TD width=183 align=left style=\"mso-number-format:'@';\"><FONT face=Calibri size=2 color=#000000>" . $v['mes'] . "</FONT></TD>";
                    echo "<TD width=183 align=left style=\"mso-number-format:'@';\"><FONT face=Calibri size=2 color=#000000>" . $params['array_entidadejecutora'][$v['identidad']] . "</FONT></TD>";
                    echo "<TD width=183 colspan=5 align=left style=\"mso-number-format:'@';\"><FONT face=Calibri size=2 color=#000000>" . $v['observacion'] . "</FONT></TD>";
                    echo "</TR>";
                }
                echo "</TABLE>\n";
            }
        }
        echo"<H6 align=right>Documento generado por PROEZA<br/>";
        $fecha = strftime("%Y/%m/%d %T", time());
        echo"Fecha: {$fecha}</H6>.";
        echo '</BODY></HTML>';
    }

}
