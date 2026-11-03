<?php

class DatBasescalculoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listar($params) {
        $params['tabla'] = '';
        //preguntar si viene normas o salidas
        //para setear el nombre de la tabla en el listar
        if ($params['tipocalc'] == '2') {
            $params['tabla'] = 'salida';
        }
        if ($params['glob'] == 'true' && $params['hoja'] == 'false') {
            //se consolida
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
            $entidades = implode(',', $entidades);
        } else {
            //no se consolida
            $entidades = $params['identidad'];
        }
        $params['identidades'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($entidades);
        if ($params['identidades'][0] == null || $params['identidades'][0] == '' || !$params['identidades'][0]) {
            //no hay entidades OD
            $data->data = array();
            $data->total = 0;
            return $data;
        } else {
            $params['identidades'] = implode(',', $params['identidades']);
        }
        return DatBasescalculo::listarCalculos($params);
    }

    public function exportarAExcel($params) {
        //indica que es el exportar para que no ponga offset y limit
        $params['exportar'] = 1;
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
        //obteniendo unidades de medida
        $UnidadMed = $params['integrator']->datosmaestros->listarUnidadesMedidaTodas();
        $arrayUms = array();
        foreach ($UnidadMed as $um) {
            $arrayUms[$um ['idunidadmedida']] = $um ['denominacionunidadmedida'];
        }
        unset($UnidadMed);
        //obteniendo naturalezas
        $Naturalezas = DatBasescalculoModel::obtenerNaturalezas();
        $arrayNaturalezas = array();
        foreach ($Naturalezas as $naturaleza) {
            $arrayNaturalezas[$naturaleza['naturaleza']] = $naturaleza ['denominacion'];
        }
        unset($Naturalezas);
        //obteniendo centros de balance
        $CentroBalance = ComportamientoEntidaddinamicoModel::listarCentroBalance();
        $arrayCb = array();
        foreach ($CentroBalance as $cb) {
            $arrayCb[$cb ['idcentrobalance']] = $cb ['centrobalance'];
        }
        unset($CentroBalance);
        //obtener los paises
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $pais = $this->nomenclador->selectParam('nom_pais', array('idpais', 'nombrepais'));
        $arraypais = array();
        foreach ($pais as $k => $valor) {
            $arraypais[$valor ['idpais']] = $valor ['nombrepais'];
        }
        unset($pais);
        //preparando excel
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        if ($params['tipocalc'] == 1) {
            header('Content-Disposition: attachment;filename=Calculos.xls');
        } else {
            header('Content-Disposition: attachment;filename=Salidas.xls');
        }
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";
        //titulo
        if ($params['tipocalc'] == 1) {
            echo "<H2 align=left>Cálculos de la entidad: {$params['text']}</H2>";
        } else {
            echo "<H2 align=left>Salidas de la entidad: {$params['text']}</H2>";
        }
        echo "</tr>";
        //columnas
        echo '<th>Código</th>';
        echo '<th align=left>Nro. de pieza</th>';
        echo '<th align=left>Denominación</th>';
        echo '<th>UM</th>';
        echo '<th align=left>Centro balance</th>';
        echo '<th>Naturaleza</th>';
        echo '<th align=left>Vía adquisición</th>';
        echo '<th align=left>Órgano que satisface</th>';
        echo '<th align=left>País</th>';
        echo '<th>Plan</th>';
        echo '<th>Tipo de plan</th>';
        echo '<th align=left>Precio MN</th>';
        echo '<th align=left>Precio MLC</th>';
        echo '<th align=left>Necesidad</th>';
        echo '<th align=left>Importe</th>';
        echo '<th align=left>Importe MLC</th>';
        echo '<th align=left>Contingencia</th>';
        echo '<th align=left>Flete</th>';
        echo '<th align=left>Importe flete</th>';
        echo '<th align=left>Importe cont.</th>';
        echo "</tr>";
        //Obteniendo los datos
        $datos = self::listar($params);
        //Mostrando los datos
        foreach ($datos->data as $value) {
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['numeropieza'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacion'] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\" >" . $arrayUms[$value['idumedida']] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\" >" . $arrayCb[$value['identidaddatosnomenclador']] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\" >" . $arrayNaturalezas[$value['idnaturaleza']] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['idvia'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['idorgano'] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\" >" . $arraypais[$value['idpais']] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['modelo'] . "</td>";
            if ($value['idtipoplan'] == 1) {
                echo"<td align=left style=\"mso-number-format:'@';\" >" . 'Ingreso' . "</td>";
            } else {
                echo"<td align=left style=\"mso-number-format:'@';\" >" . 'Gasto' . "</td>";
            }
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['precio'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['preciodivisa'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['necesidad'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importe'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importedivisa'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['contingencia'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['flete'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importeflete'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importecontingencia'] . "</td>";
            echo "</tr>";
        }
        echo " <tr >
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=right style=\"mso-number-format:'#,##0.000000';\">" . $value['importetotal'] . "</th>
             <th align=right style=\"mso-number-format:'#,##0.000000';\">" . $value['importedivisatotal'] . "</th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=right style=\"mso-number-format:'#,##0.000000';\">" . $value['importefletetotal'] . "</th>
             <th align=right style=\"mso-number-format:'#,##0.000000';\">" . $value['importecontingenciatotal'] . "</th>
             </tr>";
        echo "</table>\n";
        $fecha = strftime("%Y/%m/%d %T", time());
        echo"Fecha: {$fecha}</H6>.";
        echo '</BODY></HTML>';
    }

//actualizar cálculos o salidas
    public function generarBaseDeCalculoDeUnaEntidad($arrayParaleloentesp, $idtipocalc, $idejercicio,$idusuario) {
        $strarrayentidades = implode(',', $arrayParaleloentesp['identidad']);
        $strarrayentidades = "{" . $strarrayentidades . "}";
        $strarrayespecialidades = implode(',', $arrayParaleloentesp['idespecialidad']);
        $strarrayespecialidades = "{" . $strarrayespecialidades . "}";
        $arrayParametros = array();
        $conn = Doctrine_Manager::connection();
        if ($idtipocalc == 1) {
            $arrayParametros[0] = $strarrayentidades;
            $arrayParametros[1] = $idejercicio;
            $arrayParametros[2] = $strarrayespecialidades;
            $arrayParametros[3] = $idusuario;
            $query = "select * from mod_planificacion.f_basedeplan10(?,?,?,?)";
        } else {
            $arrayParametros[0] = $strarrayentidades;
            $arrayParametros[1] = $idejercicio;
            $arrayParametros[2] = $strarrayespecialidades;
            $arrayParametros[3] = $idusuario;
            $query = "select * from mod_planificacion.f_basedeplansalidasinmodelo(?,?,?,?)";
        }
        $res = $conn->execute($query, $arrayParametros);
        $resultUno = $res->fetchAll();
        if ($idtipocalc == 1) {
            $query = "select * from mod_planificacion.f_basedeplan11(?,?,?,?)";
        } else {
            $query = "select * from mod_planificacion.f_basedeplansalidaconmodelo(?,?,?,?)";
        }
       // print_r($arrayParametros);die;
        $res = $conn->execute($query, $arrayParametros);
        $resultDos = $res->fetchAll();
        if ($idtipocalc == 1) {
            return ($resultUno[0]['f_basedeplan10'] || $resultDos[0]['f_basedeplan11']);
        } else {
            return ($resultUno[0]['f_basedeplansalidasinmodelo'] || $resultDos[0]['f_basedeplansalidaconmodelo']);
        }
    }

//eliminar cálculos o salidas
    public function eliminarBaseDeCalculoDeUnaEntidad($identidad, $idtipocalc, $idejercicio) {
        $conn = Doctrine_Manager::connection();
        if ($idtipocalc == 1) {
            $arrayParametros[0] = $identidad;
            $arrayParametros[1] = $idejercicio;
            $query = "select * from mod_planificacion.f_eliminar_calculo_entidad(?,?)";
        } else {
            $arrayParametros[0] = $identidad;
            $arrayParametros[1] = $idejercicio;
            $query = "select * from mod_planificacion.f_eliminar_calculosalida_entidad(?,?)";
        }
        $conn->execute($query, array("{" . $identidad . "}", $idejercicio));
        return true;
    }

//actualiza los datos de calculo o salida en el plan
    public function actualizarPlanes($idmodelo, $idestructura, $idespecialidad, $idejercicio, $idtipocalc,$idusuario) {
        $paramsQuery = array($idestructura, $idmodelo, $idespecialidad, $idejercicio,$idusuario);
        $conn = Doctrine_Manager::connection();
        if ($idtipocalc == 1) {
            $query = "select * from mod_planificacion.f_integracion_basecalculo(?, ?, ?, ?, ?)";
        } else {
            $query = "select * from mod_planificacion.f_integracion_basecalculosalida(?, ?, ?, ?, ?)";
        }
        $res = $conn->execute($query, $paramsQuery);
        $result = $res->fetchAll();
        return $result;
    }

    /* metodos auxiliares */

    public function obtenerNaturalezas() {
        $con = Doctrine_Manager::connection();
        $query = "SELECT idnaturaleza as naturaleza, denominacion
                    FROM mod_datosmaestros.nom_naturaleza
                    ORDER BY upper(denominacion)";
        $res = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

//se usa para actualizar los calculos
    public function getArrayEspecialidades($arrayIdentidad, $porEntidadAssoc = 0) {
        $integrator = ZendExt_IoC::getInstance();
        $datosEntidad = array();
        if ($arrayIdentidad [0] != null) {
            $datosEntidad = $integrator->metadatos->ObtenerDatosEstructuraPorArrayID($arrayIdentidad);
        }

        $arrayIdespecialidades = array();
        $arrayParaleloEntesp = array();
        if (is_array($datosEntidad)) {
            if ($porEntidadAssoc == '1') {
                foreach ($datosEntidad as $valorEntidad) {
                    $arrayIdespecialidades['identidad' . $valorEntidad->idestructura] = $valorEntidad->idespecialidad;
                }
            } else {
                if ($porEntidadAssoc == '3') {
                    foreach ($datosEntidad as $valorEntidad) {
                        if ($valorEntidad) {
                            $arrayIdespecialidades[] = $valorEntidad[0]->idespecialidad;
                            $arrayParaleloEntesp['identidad'][] = $valorEntidad[0]->idestructura;
                            $arrayParaleloEntesp['idespecialidad'][] = $valorEntidad[0]->idespecialidad;
                        }
                    }

                    return $arrayParaleloEntesp;
                } else {
                    foreach ($datosEntidad as $valorEntidad) {
                        $arrayIdespecialidades[] = $valorEntidad[0]->idespecialidad;
                    }
                }
            }
        }
        return $arrayIdespecialidades;
    }

//es usado en el componenete niveles de actividad
    public function exportarCalculoAExcel($params) {
        $conn = Doctrine_Manager::connection();
        $params['entidades'] = implode(',', $params['entidades']);
        $params['idactividad'] = implode(',', $params['idactividad']);
        $sql = "SELECT
                    distinct alias.indicador,
                    alias.denominacion,
                    alias.precio,
                    alias.preciodivisa,
                    alias.codigo,
                    alias.um,
                    alias.abrevum,
                    alias.denominacionmod,
                    round( SUM( alias.cant *  ((alias.nivelprod+alias.nivelauto+alias.nivelmanual+alias.ajuste)) ) ,6) as  necesidadredondeada,
                    round( SUM( alias.cant *  ((alias.nivelprod+alias.nivelauto+alias.nivelmanual+alias.ajuste)) ) * alias.precio,6)  as  importe,
                    round( SUM(((alias.nivelprod+alias.nivelauto+alias.nivelmanual+alias.ajuste)) ) ,6) as  nivelactividad,
                    alias.denomactividad,
                    alias.codactividad
                  FROM (SELECT
                          i.idindicador AS indicador,
                          i.codigo AS codigo,
                          i.denominacion as denominacion,
                          ip.precio AS precio,
                          ip.preciodivisa as preciodivisa,
                          a.idactividad AS actividad,
                          COALESCE(nivp.nivelactividadproduccion,0) AS nivelprod,
                          COALESCE(niva.nivelactividadautomatico,0) AS nivelauto,
                          COALESCE(nivm.nivelactividadmanual,0) AS nivelmanual,
                          nor.cantplanif*nor.cantbase AS cant,
                          i.idumedida as um,
                          um.abreviaturaunidadmedida as abrevum,
                          mod.denominacion as denominacionmod,
                          aen.ajuste,
                          a.denominacion as denomactividad,
                          a.codigo as codactividad,
                          nivm.nivelactividadmanual
                        FROM
                          mod_planificacion.nom_actividad a
                          INNER JOIN mod_planificacion.dat_actividadentidad aen ON (a.idactividad = aen.idactividad)
                          LEFT OUTER JOIN mod_planificacion.dat_actividadmodelo amod ON (amod.idactividad = aen.idactividad)
                          LEFT OUTER JOIN mod_planificacion.dat_modelo mod ON (amod.idmodelo  = mod.idmodelo )
                          LEFT OUTER JOIN mod_planificacion.dat_actividadentidadautomatico niva ON (aen.idactividadentidad = niva.idactividadentidad)
                          LEFT OUTER JOIN mod_planificacion.dat_actividadentidadmanual nivm ON (aen.idactividadentidad = nivm.idactividadentidad)
                          LEFT OUTER JOIN mod_planificacion.dat_actividadentidadproduccion nivp ON (aen.idactividadentidad = nivp.idactividadentidad)
                          INNER JOIN mod_planificacion.dat_norma nor ON (a.idactividad = nor.idactividad)
                          INNER JOIN mod_datosmaestros.nom_indicador i ON (nor.idindicador = i.idindicador)
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (ip.idindicador = i.idindicador)
                         LEFT OUTER JOIN mod_datosmaestros.nom_unidadmedida um ON (um.idunidadmedida = i.idumedida)
                        WHERE
                          aen.identidad in ({$params['entidades']}) AND
                          a.estado = 1 AND
                          i.estado = 1 AND
                          ip.nivelplanif = 1 AND
                          a.idactividad in({$params['idactividad']})
                          AND aen.idejercicio = {$params['idejercicio']}  AND
                          nor.idejercicio =  {$params['idejercicio']}

                          ) as alias

                        GROUP BY
                         alias.indicador,
                         alias.denominacionmod,
                         alias. precio,
                         alias.codigo,
                         alias.denominacion,
                         alias.preciodivisa,
                         alias.denominacion,
                         alias.um,
                         alias.abrevum,
                         alias.abrevum,
                         alias.denomactividad,
                         alias.codactividad
                         ORDER BY alias.codactividad ";
        $temp = $conn->execute($sql);
        $data->data = $temp->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function exportarCalculoOSalida($params) {
        $conn = Doctrine_Manager::connection();
        $params['entidades'] = implode(',', $params['entidades']);
        $params['idactividad'] = implode(',', $params['idactividad']);
        $tabla = "";
        if ($params['tipo'] == 1) {
            $cantidad = "norSal.necesidad AS cant,";
            $join = "INNER JOIN mod_planificacion.dat_norma norSal ON
                     a.idactividad = norSal.idactividad AND
                      norSal.idejercicio =  {$params['idejercicio']}";
        } else {
            $cantidad = " norSal.cantidad as cant,";
            $join = " INNER JOIN mod_planificacion.dat_salida norSal ON
                      a.idactividad = norSal.idactividad";
            $tabla = "salida";
        }
        $sql = "SELECT distinct alias.indicador,
       alias.denominacion,
       alias.precio,
       alias.preciodivisa,
       alias.codigo,
       alias.um,
       alias.abrevum,
       alias.denominacionmod,
       round(COALESCE(SUM(alias.cant *(( alias.nivelauto +
         alias.nivelmanual + alias.ajuste))), 0), 6) as necesidadredondeada,
       round(COALESCE(SUM(alias.cant *(( alias.nivelauto +
         alias.nivelmanual + alias.ajuste))) * alias.precio, 0), 6) as importe,
       round(COALESCE(SUM(alias.cant *(( alias.nivelauto +
         alias.nivelmanual + alias.ajuste))) * alias.preciodivisa, 0), 6) as
         importemlc,
       round(COALESCE(SUM(((alias.nivelauto + alias.nivelmanual +
         alias.ajuste))), 0), 6) as nivelactividad,
       alias.denomactividad,
       alias.codactividad
FROM ( SELECT i.idindicador AS indicador,
              i.codigo AS codigo,
              i.denominacion as denominacion,
              ip.precio AS precio,
              ip.preciodivisa as preciodivisa,
              a.idactividad AS actividad,
              COALESCE(niva.nivelactividadautomatico, 0) AS nivelauto,
              COALESCE(nivm.nivelactividadmanual, 0) AS nivelmanual,
              $cantidad
              i.idumedida as um,
              um.abreviaturaunidadmedida as abrevum,
              mod.denominacion as denominacionmod,
              aen.ajuste,
              a.denominacion as denomactividad,
              a.codigo as codactividad
                        FROM
                          mod_planificacion.nom_actividad a
                          INNER JOIN mod_planificacion.dat_actividadentidad aen ON (a.idactividad = aen.idactividad)
                          INNER  JOIN mod_planificacion.dat_actividadmodelo$tabla amod ON (amod.idactividad = aen.idactividad)
                          INNER  JOIN mod_planificacion.dat_modelo mod ON (amod.idmodelo  = mod.idmodelo )
                          $join
                          INNER JOIN mod_datosmaestros.nom_indicador i ON (norSal.idindicador = i.idindicador)
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (ip.idindicador = i.idindicador)
                          INNER JOIN mod_datosmaestros.nom_unidadmedida um ON (um.idunidadmedida = i.idumedida)
                          LEFT  JOIN mod_planificacion.dat_actividadentidadautomatico niva ON (aen.idactividadentidad = niva.idactividadentidad)
                          LEFT  JOIN mod_planificacion.dat_actividadentidadmanual nivm ON (aen.idactividadentidad = nivm.idactividadentidad)
                        WHERE
                          aen.identidad in ({$params['entidades']}) AND
                          a.estado = 1 AND
                          i.estado = 1 AND
                          ip.nivelplanif = 1 AND
                          a.idactividad in({$params['idactividad']})
                          AND aen.idejercicio = {$params['idejercicio']}
                          ) as alias

                        GROUP BY
                         alias.indicador,
                         alias.denominacionmod,
                         alias. precio,
                         alias.codigo,
                         alias.denominacion,
                         alias.preciodivisa,
                         alias.denominacion,
                         alias.um,
                         alias.abrevum,
                         alias.abrevum,
                         alias.denomactividad,
                         alias.codactividad
                         ORDER BY alias.codactividad ";
        //  print_r($sql);die;
        $temp = $conn->execute($sql);
        $data->data = $temp->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
