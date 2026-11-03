<?php

class ControldemandaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listarCentrosBalanceDominio($identidadLogueada) {
        $identidadesHijas = DatActividadentidad::auxObtenerEntidadesHijasComun($identidadLogueada);
        $identidadesHijas = implode(',', $identidadesHijas);
        return DatControldemanda::listarCentrosBalanceDominio($identidadesHijas);
    }

    public function listarOrganosDemandantesDominio($identidadLogueada) {
        $identidadrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $identidadrectora = $identidadrectora[0]['identidad'];
        $entidades = array();
        $integrator = ZendExt_IoC::getInstance();
        if ($identidadLogueada == $identidadrectora) {
            $dominios = $integrator->metadatos->DameHijosEstructura($identidadrectora);
            $cont = 0;
            foreach ($dominios as $value) {
                if ($value->idconcepto == 0 || $value->idconcepto == 1 || $value->idconcepto == 2 || $value->idconcepto == 3 ||
                        $value->idconcepto == 4 || $value->idconcepto == 5 || $value->idconcepto == 6 || $value->idconcepto == 9) {
                    $entidades[$cont][identidad] = $value->id;
                    $entidades[$cont][denominacion] = $value->denominacion;
                    $cont++;
                }
            }
        } else {
            $datosentidad = $integrator->metadatos->DameEstructura($identidadLogueada);
            $entidades[0][identidad] = $datosentidad[0]->id;
            $entidades[0][denominacion] = $datosentidad[0]->denominacion;
        }
        $data->data = $entidades;
        return $data;
    }

    public function cargarPlanAprobado($params) {
        $params['cadenaidentidades'] = implode(',', $params['identidades']);
        //eliminar los controles de ese ejercicio y esas entidades
        DatControldemanda::eliminarControles($params['idejercicio'], $params['cadenaidentidades']);
        //cargar el plan aprobado a la ejecucion
        $conn = Doctrine_Manager::connection();
        $array_params = array();
        $array_params[0] = $params['idejercicio'];
        if ($params['configuracion'] == 'true') {
            foreach ($params['idcentrosbalance'] as $value) {
                $array_params[1] = $value;
                $array_params[2] = $params['idusuario'];
                $query = "select * from mod_planificacion.f_cargar_plan_aprobadocb(?,?,?);";
                $res = $conn->execute($query, $array_params);
                $res->fetchAll(PDO::FETCH_ASSOC);
            }
        } else {
            foreach ($params['identidades'] as $value) {
                $array_params[1] = $value;

                $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($value);
                $var = implode(',', $entidades);
                $identiddaesdemandantes = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
                $strarrayentidades = implode(',', $identiddaesdemandantes);
                $array_params[2] = "{" . $strarrayentidades . "}";
                $array_params[3] = $params['idusuario'];
                $query = "select * from mod_planificacion.f_cargar_plan_aprobadood(?,?,?,?);";
                $res = $conn->execute($query, $array_params);
                $res->fetchAll(PDO::FETCH_ASSOC);
            }
        }
    }

    public function listarControlDemanda($params) {
        $addWhere = "";
        $addWhereAfuera = "WHERE true";
        $having = "HAVING true";
        if ($params['cbCant'] == 2) {
            //pendiente a contratar
            $having .= " AND (round(COALESCE(SUM(cdf.cantidadcontratada),0),3)<round(cd.cantidad,3))";
        }
        if ($params['cbCant'] == 3) {
            //algo contratado
            $having .= " AND (round(COALESCE(SUM(cdf.cantidadcontratada),0),3)>0)";
        }
        if ($params['cbCant'] == 4) {
            //pendiente a ejecutar
            $having .= " AND (round(COALESCE(SUM(cdf.cantidadejecutada),0),3)<round(cd.cantidad,3))";
        }
        if ($params['cbCant'] == 5) {
            //algo ejecutado
            $having .= " AND (round(COALESCE(SUM(cdf.cantidadejecutada),0),3)>0)";
        }
        if ($params['cbVal'] == 2) {
            //pendiente a contratar
            $having .= " AND round(COALESCE((SUM(cdf.cantidadcontratada * cdf.preciocontratacion)),0),3)<round((cd.cantidad * cd.precio),3)";
        }
        if ($params['cbVal'] == 3) {
            //algo contratado
            $having .= " AND round(COALESCE((SUM(cdf.cantidadcontratada * cdf.preciocontratacion)),0),3)>0";
        }
        if ($params['cbVal'] == 4) {
            //pendiente a ejecutar
            $having .= " AND round(COALESCE((SUM(cdf.cantidadejecutada * cdf.precioejecucion)),0),3)<round((cd.cantidad * cd.precio),3)";
        }
        if ($params['cbVal'] == 5) {
            //algo ejecutado
            $having .= " AND round(COALESCE((SUM(cdf.cantidadejecutada * cdf.precioejecucion)),0),3)>0";
        }
        if ($params['cbVA'] != 'false') {            
            //hay algo seleccionado
            $arrayDenomVias = explode(',', $params['cbVA']);           
            if (!in_array('Todas', $arrayDenomVias)) {
                //no esta marcado "Todas"
                $totalVias = count($arrayDenomVias) - 1;
                $addWhereAfuera .= " AND (";
                foreach ($arrayDenomVias as $k => $value) {
                    if ($k == $totalVias)
                        $addWhereAfuera .= " upper(r.viasadquisicion) LIKE '%" . strtoupper($value) . "%' )";
                    else
                        $addWhereAfuera .= " upper(r.viasadquisicion) LIKE '%" . strtoupper($value) . "%' OR";
                }
            }
        }        
        if ($params['demandaValida']) {
            //si es exportar solo quiero demandas mayores que 0
            $addWhere .= " AND round(cd.cantidad,3)>0";
        }
        foreach ($params['filtros'] as $value) {
            if ($value['field'] == 'codigo') {
                $addWhere .= " AND i.codigo LIKE '" . $value['data']['value'] . "%'";
            } else if ($value['field'] == 'denominacion') {
                $addWhere .= " AND upper(i." . $value['field'] . ") LIKE  " . "'%" . mb_convert_case($value['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
            } else if ($value['field'] == 'idunidadmedida') {
                $addWhere .= " AND i.idumedida=" . $value['data']['value'];
            } else if ($value['field'] == 'precio' || $value['field'] == 'demanda') {
                if ($value['field'] == 'precio')
                    $campo = "precio";
                else
                    $campo = "cantidad";
                if ($value['data']['comparison'] == 'gt')
                    $addWhere .= " AND round(cd.$campo,3)>" . $value['data']['value'];
                else if ($value['data']['comparison'] == 'lt')
                    $addWhere .= " AND round(cd.$campo,3)<" . $value['data']['value'];
                else
                    $addWhere .= " AND round(cd.$campo,3)=" . $value['data']['value'];
            } else if ($value['field'] == 'importe') {
                if ($value['data']['comparison'] == 'gt')
                    $addWhere .= " AND round((cd.cantidad * cd.precio),3)>" . $value['data']['value'];
                else if ($value['data']['comparison'] == 'lt')
                    $addWhere .= " AND round((cd.cantidad * cd.precio),3)<" . $value['data']['value'];
                else
                    $addWhere .= " AND round((cd.cantidad * cd.precio),3)=" . $value['data']['value'];
            } else if ($value['field'] == 'puntualizacion' || $value['field'] == 'adicionado') {
                if ($value['data']['value'] == 'No')
                    $addWhere .= " AND cd." . $value['field'] . "=0";
                else
                    $addWhere .= " AND cd." . $value['field'] . "=1";
            } else if ($value['field'] == 'idaprobacion') {
                if ($value['data']['value'] == 'No')
                    $addWhere .= " AND cd.idaprobacion=1";
                else
                    $addWhere .= " AND cd.idaprobacion=4";
            } else if ($value['field'] == 'organossatisface') {
                $arrayDenomOrg = explode(',', $value['data']['value']);
                $totalOrg = count($arrayDenomOrg) - 1;
                $addWhereAfuera .= " AND (";
                foreach ($arrayDenomOrg as $k => $value) {
                    if ($k == $totalOrg)
                        $addWhereAfuera .= " upper(r.organossatisface) LIKE '%" . strtoupper($value) . "%' )";
                    else
                        $addWhereAfuera .= " upper(r.organossatisface) LIKE '%" . strtoupper($value) . "%' OR";
                }
            } else if ($value['field'] == 'cantidadcontratada' || $value['field'] == 'cantidadejecutada') {
                if ($params['idmes']) {
                    if ($value['data']['comparison'] == 'gt')
                        $addWhere .= " AND round(COALESCE(cdf." . $value['field'] . ",0),3)>" . $value['data']['value'];
                    else if ($value['data']['comparison'] == 'lt')
                        $addWhere .= " AND round(COALESCE(cdf." . $value['field'] . ",0),3)<" . $value['data']['value'];
                    else
                        $addWhere .= " AND round(COALESCE(cdf." . $value['field'] . ",0),3)=" . $value['data']['value'];
                } else {
                    if ($value['data']['comparison'] == 'gt')
                        $having .= " AND round(COALESCE(SUM(cdf." . $value['field'] . "),0),3)>" . $value['data']['value'];
                    else if ($value['data']['comparison'] == 'lt')
                        $having .= " AND round(COALESCE(SUM(cdf." . $value['field'] . "),0),3)<" . $value['data']['value'];
                    else
                        $having .= " AND round(COALESCE(SUM(cdf." . $value['field'] . "),0),3)=" . $value['data']['value'];
                }
            } else if ($value['field'] == 'preciocontratacion' || $value['field'] == 'precioejecucion') {
                if ($value['data']['comparison'] == 'gt')
                    $addWhereAfuera .= " AND r." . $value['field'] . ">" . $value['data']['value'];
                else if ($value['data']['comparison'] == 'lt')
                    $addWhereAfuera .= " AND r." . $value['field'] . "<" . $value['data']['value'];
                else
                    $addWhereAfuera .= " AND r." . $value['field'] . "=" . $value['data']['value'];
            } else if ($value['field'] == 'importecontratacion') {
                if ($params['idmes']) {
                    if ($value['data']['comparison'] == 'gt')
                        $addWhere .= " AND round(COALESCE(cdf.cantidadcontratada,0) * COALESCE(cdf.preciocontratacion,0),3)>" . $value['data']['value'];
                    else if ($value['data']['comparison'] == 'lt')
                        $addWhere .= " AND round(COALESCE(cdf.cantidadcontratada,0) * COALESCE(cdf.preciocontratacion,0),3)<" . $value['data']['value'];
                    else
                        $addWhere .= " AND round(COALESCE(cdf.cantidadcontratada,0) * COALESCE(cdf.preciocontratacion,0),3)=" . $value['data']['value'];
                } else {
                    if ($value['data']['comparison'] == 'gt')
                        $having .= " AND round(COALESCE((SUM(cdf.cantidadcontratada * cdf.preciocontratacion)),0),3)>" . $value['data']['value'];
                    else if ($value['data']['comparison'] == 'lt')
                        $having .= " AND round(COALESCE((SUM(cdf.cantidadcontratada * cdf.preciocontratacion)),0),3)<" . $value['data']['value'];
                    else
                        $having .= " AND round(COALESCE((SUM(cdf.cantidadcontratada * cdf.preciocontratacion)),0),3)=" . $value['data']['value'];
                }
            } else if ($value['field'] == 'importeejecucion') {
                if ($params['idmes']) {
                    if ($value['data']['comparison'] == 'gt')
                        $addWhere .= " AND round(COALESCE(cdf.cantidadejecutada,0) * COALESCE(cdf.precioejecucion,0),3)>" . $value['data']['value'];
                    else if ($value['data']['comparison'] == 'lt')
                        $addWhere .= " AND round(COALESCE(cdf.cantidadejecutada,0) * COALESCE(cdf.precioejecucion,0),3)<" . $value['data']['value'];
                    else
                        $addWhere .= " AND round(COALESCE(cdf.cantidadejecutada,0) * COALESCE(cdf.precioejecucion,0),3)=" . $value['data']['value'];
                } else {
                    if ($value['data']['comparison'] == 'gt')
                        $having .= " AND round(COALESCE((SUM(cdf.cantidadejecutada * cdf.precioejecucion)),0),3)>" . $value['data']['value'];
                    else if ($value['data']['comparison'] == 'lt')
                        $having .= " AND round(COALESCE((SUM(cdf.cantidadejecutada * cdf.precioejecucion)),0),3)<" . $value['data']['value'];
                    else
                        $having .= " AND round(COALESCE((SUM(cdf.cantidadejecutada * cdf.precioejecucion)),0),3)=" . $value['data']['value'];
                }
            } else if ($value['field'] == 'idaprobacionejecucion' && $params['idmes']) {
                if ($value['data']['value'] == 'No')
                    $addWhere .= " AND COALESCE(cdf.idaprobacionejecucion,1)=1";
                else
                    $addWhere .= " AND COALESCE(cdf.idaprobacionejecucion,1)=4";
            } elseif ($datos['field'] == 'idusuario') {
                $addWhere .= " AND r.idusuario ={$datos['data']['value']}";
            } elseif ($datos ['field'] == 'fecha') {
                $fecha = explode('/', $datos ['data']['value']);
                $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                if ($datos['data']['comparison'] == 'lt') {
                    $addWhere .= "AND r.fecha::date<'{$fecha}'";
                }
                if ($datos['data']['comparison'] == 'gt') {
                    $addWhere .= "AND r.fecha::date>'{$fecha}'";
                }
                if ($datos['data']['comparison'] == 'eq') {
                    $addWhere .= "AND r.fecha::date='{$fecha}'";
                }
            }
        }
        $params['addWhere'] = $addWhere;
        $params['addWhereAfuera'] = $addWhereAfuera;
        $params['having'] = $having;
        return DatControldemanda::listarControlDemanda($params);
    }

    public function exportar($params) {
        //cargando etiquetas
        $params['array_etiq'] = FuncionesGlobalesModel::cargarEtiquetas('controldemanda');
        //Ajustando los parámetros de los filtros al formato 'listar'
        $nuevos_filtros = array();
        foreach ($params['filtros'] as $filtro) {
            $obj_filtro['field'] = $filtro->field;
            $obj_filtro['data']['type'] = $filtro->data->type;
            if ($obj_filtro['data']['type'] == 'numeric') {
                $obj_filtro['data']['comparison'] = $filtro->data->comparison;
            }
            if ($obj_filtro['data']['type'] == 'list') {
                $filtro_data_value = $filtro->data->value;
                $obj_filtro['data']['value'] = $filtro_data_value[0];
            } else {
                $obj_filtro['data']['value'] = $filtro->data->value;
            }
            $nuevos_filtros[] = $obj_filtro;
        }
        $params['filtros'] = $nuevos_filtros;
        //Fin de los filtros
        $integrator = ZendExt_IoC::getInstance();
        $unidades = $integrator->datosmaestros->listarUnidadesMedidaTodas();
        $params['unidadesmedida'] = array();
        foreach ($unidades as $unidad) {
            $params['unidadesmedida'][$unidad['idunidadmedida']] = $unidad['denominacionunidadmedida'];
        }
        unset($unidades);

        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=controldemanda.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo '<h2><caption>' . $params['array_etiq']['lbTituloGridPanel'] . '</caption></h2>';
        echo '<h3><caption>' . $params['array_etiq']['lbEjercicio'] . ': ' . $params['ejercicio'] . ' </caption></h3>';
        if ($params['idmes'])
            echo '<h3><caption>' . $params['array_etiq']['lbMes'] . ': ' . $params['denommes'] . ' </caption></h3>';
        if ($params['configuracion'] == 'true')
            echo '<h3><caption>' . $params['array_etiq']['lbCB'] . $params['denomentidad'] . ' </caption></h3>';
        else
            echo '<h3><caption>' . $params['array_etiq']['lbOD'] . $params['denomentidad'] . ' </caption></h3>';
        echo '<h3><caption>' . $params['array_etiq']['lbVias'] . ': ' . $params['cbVA'] . ' </caption></h3>';
        echo (($params['is_leaf'] == 'true') ? "" : "<table border =0 ><tr> </tr></table>") . "
        <tr >";
        echo "
        <table border=1 cellspacing=0 width=60%>";
        echo '<th>' . $params['array_etiq']['lbCodigo'] . '</th>';
        echo '<th>' . $params['array_etiq']['lbDenominacion'] . '</th>';
        echo '<th>' . $params['array_etiq']['lbUm'] . '</th>';
        echo '<th>' . $params['array_etiq']['lbVA'] . '</th>';
        echo '<th>' . $params['array_etiq']['lbOS'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbDemanda'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbPrecio'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbImporte'] . '</th>';
        echo '<th align=center>' . $params['array_etiq']['lbAdicion'] . '</th>';
        echo '<th align=center>' . $params['array_etiq']['lbPuntualizacion'] . '</th>';
        echo '<th align=center>' . $params['array_etiq']['lbAprobacion'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbCantidadContratada'] . '</th>';
        if ($params['idmes'])
            echo '<th align=left>' . $params['array_etiq']['lbPrecioContratacion'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbImporteContratacion'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbCantidadEjecutada'] . '</th>';
        if ($params['idmes'])
            echo '<th align=left>' . $params['array_etiq']['lbPrecioEjecutada'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbImporteEjecutada'] . '</th>';
        echo"</tr>";
        $params['demandaValida'] = true;
        $data = self::listarControlDemanda($params);
        foreach ($data->data as $value) {
            echo "<tr> <td align=left style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>
                        <td align=left>" . $value['denominacion'] . "</td>
                        <td align=left >" . $params['unidadesmedida'][$value['idunidadmedida']] . "</td>
                        <td align=left>" . $value['viasadquisicion'] . "</td>
                        <td align=left>" . $value['organossatisface'] . "</td>
                        <td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['demanda'] . "</td>
                        <td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['precio'] . "</td>
                        <td align=right style=\"mso-number-format:'#,##0.000';\">" . ($value['importe'] / 1000) . "</td>";
            if ($value['adicionado'] == 0) {
                echo "<td align=center>No</td>";
            } else {
                echo "<td align=center>Sí</td>";
            }
            if ($value['puntualizacion'] == 0) {
                echo "<td align=center>No</td>";
            } else {
                echo "<td align=center>Sí</td>";
            }
            if ($value['idaprobacion'] == 0) {
                echo "<td align=center>No</td>";
            } else {
                echo "<td align=center>Sí</td>";
            }
            echo "<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['cantidadcontratada'] . "</td>";
            if ($params['idmes']) {
                echo "<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['preciocontratacion'] . "</td>";
                $preciocontratacionblanco = '<th align=left> </th>';
            } else {
                $preciocontratacionblanco = '';
            }
            echo "<td align=right style=\"mso-number-format:'#,##0.000';\">" . ($value['importecontratacion'] / 1000) . "</td>
                    <td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['cantidadejecutada'] . "</td>";
            if ($params['idmes']) {
                echo "<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['precioejecucion'] . "</td>";
                $precioejecucionblanco = '<th align=left> </th>';
            } else {
                $precioejecucionblanco = '';
            }
            echo "<td align=right style=\"mso-number-format:'#,##0.000';\">" . ($value['importeejecucion'] / 1000) . "</td>";
        }
        echo " <tr >
             <th colspan = 7 align = left style = text-align:LEFT;>Total </th>
             <th align=right style=\"mso-number-format:'#,##0.000';\">" . ($value['importetotal'] / 1000) . "</th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             $preciocontratacionblanco
             <th align=right style=\"mso-number-format:'#,##0.000';\">" . ($value['importecontrataciontotal'] / 1000) . "</th>
             <th align=left> </th>
             $precioejecucionblanco
             <th align=right style=\"mso-number-format:'#,##0.000';\">" . ($value['importeejecuciontotal'] / 1000) . "</th>
             </tr>";
        echo "</table>\n";
        echo '</BODY></HTML>';
    }

    public function guardarControlDemanda($params) {
        foreach ($params['tuplasaguardar'] as $value) {
            if (isset($value->demanda) || isset($value->precio)) {
                $objControlDem = Doctrine::getTable('DatControldemanda')->findByDql("idcontroldemanda={$value->idcontroldemanda}");
                if (isset($value->demanda))
                    $objControlDem[0]->cantidad = $value->demanda;
                if (isset($value->precio))
                    $objControlDem[0]->precio = $value->precio;
                $objControlDem[0]->puntualizacion = 1;
                $objControlDem[0]->idaprobacion = 1;
                $objControlDem[0]->idusuario = $params['idusuario'];
                $objControlDem[0]->fecha = NULL;
                $objControlDem[0]->save();
            }
            if (isset($value->cantidadcontratada) || isset($value->preciocontratacion) || isset($value->cantidadejecutada) || isset($value->precioejecucion)) {
                //si se cambia alguno de los valores se actualiza tambien el user y la fecha de modificacion             
                if ($value->idcontroldemandafecha != null) {
                    $objControlDemFecha = Doctrine::getTable('DatControldemandafecha')->findByDql("idcontroldemandafecha={$value->idcontroldemandafecha}");
                    if (isset($value->cantidadcontratada))
                        $objControlDemFecha[0]->cantidadcontratada = $value->cantidadcontratada;
                    if (isset($value->preciocontratacion))
                        $objControlDemFecha[0]->preciocontratacion = $value->preciocontratacion;
                    if (isset($value->cantidadejecutada))
                        $objControlDemFecha[0]->cantidadejecutada = $value->cantidadejecutada;
                    if (isset($value->precioejecucion))
                        $objControlDemFecha[0]->precioejecucion = $value->precioejecucion;
                        $objControlDemFecha[0]->idusuario = $params['idusuario'];
                        $objControlDemFecha[0]->fecha = NULL;
                    $objControlDemFecha[0]->save();
                } else {
                    $objControlDemFecha = new DatControldemandafecha();
                    $objControlDemFecha->idcontroldemanda = $value->idcontroldemanda;
                    $objControlDemFecha->cantidadcontratada = $value->cantidadcontratada;
                    $objControlDemFecha->preciocontratacion = $value->precioc;
                    $objControlDemFecha->cantidadejecutada = $value->cantidadejecutada;
                    $objControlDemFecha->precioejecucion = $value->precioe;
                    $objControlDemFecha->iddatosnomenclador = $params['idmes'];
                    $objControlDemFecha->idusuario = $params['idusuario'];
                    $objControlDemFecha->fecha = NULL;
                    $objControlDemFecha->save();
                }
            }
        }
        return 1;
    }

    public function aprobarControlDemanda($params) {
        foreach ($params['tuplasaguardar'] as $value) {
            $objControlDem = Doctrine::getTable('DatControldemanda')->findByDql("idcontroldemanda=$value");
            $objControlDem[0]->idaprobacion = $params['idaprobacion'];
            $objControlDem[0]->save();
        }
        return 1;
    }

    public function aprobarEjecucion($params) {
        foreach ($params['tuplasaguardar'] as $value) {
            $objControlDem = Doctrine::getTable('DatControldemandafecha')->findByDql("idcontroldemandafecha=$value");
            $objControlDem[0]->idaprobacionejecucion = $params['idaprobacion'];
            $objControlDem[0]->save();
        }
        return 1;
    }

    public function listarIndicadoresAdd($params) {
        $addWhere = "";
        foreach ($params['filtros'] as $value) {
            if ($value['field'] == 'codigo') {
                $addWhere .= " AND r.codigo LIKE '" . $value['data']['value'] . "%'";
            } else if ($value['field'] == 'denominacion') {
                $addWhere .= " AND upper(r.denominacion) LIKE  " . "'%" . mb_convert_case($value['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
            } else if ($value['field'] == 'idunidadmedida') {
                $addWhere .= " AND r.idunidadmedida=" . $value['data']['value'];
            }
            if ($value['field'] == 'precio') {
                if ($value['data']['comparison'] == 'gt')
                    $addWhere .= " AND r.precio >" . $value['data']['value'];
                else if ($value['data']['comparison'] == 'lt')
                    $addWhere .= " AND r.precio <" . $value['data']['value'];
                else
                    $addWhere .= " AND r.precio =" . $value['data']['value'];
            }
        }
        $params['addWhere'] = $addWhere;
        if ($params['configuracion'] == 'true') {
            $objControlDemFecha = Doctrine::getTable('DatEntidaddatosnomenclador')->findByDql("identidad={$params['identidad']} AND iddatosnomenclador=1");
            $params['idcb'] = $objControlDemFecha[0]->identidaddatosnomenclador;
        }
        return DatControldemanda::listarIndicadoresAdd($params);
    }

    public function adicionarControlDemanda($params) {
        foreach ($params['tuplasaguardar'] as $value) {
            //buscando las va
            $vaind = DatIndicadorviaadquisicion::ObtenerViasAdquisIndicadorAsociado($value->idindicador);
            $dva = '';
            $vac = count($vaind);
            foreach ($vaind as $key => $va) {
                if ($key < $vac - 1) {
                    $dva .= $va['NomViaadquisicion']['denominacion'] . ', ';
                } else {
                    $dva .= $va['NomViaadquisicion']['denominacion'];
                }
            }
            //buscando las os
            $osind = DatIndicadorviaadquisicionorganosatisface::obtenerOrganoSatisfIndicadorAsociado($value->idindicador);
            $dos = '';
            $osc = count($osind);
            foreach ($osind as $key => $os) {
                if ($key < $osc - 1) {
                    $dos .= $os['NomOrganosatisface']['denominacion'] . ', ';
                } else {
                    $dos .= $os['NomOrganosatisface']['denominacion'];
                }
            }             
            $objControlDem = new DatControldemanda();
            $objControlDem->idejercicio = $params['idejercicio'];
            $objControlDem->identidad = $params['identidad'];
            $objControlDem->idindicador = $value->idindicador;
            $objControlDem->idunidadmedida = $value->idunidadmedida;
            $objControlDem->idusuario = $params['idusuario'];
            $objControlDem->fecha = NULL;
            $objControlDem->viasadquisicion = $dva;
            $objControlDem->organossatisface = $dos;
            $objControlDem->precio = $value->precio;
            $objControlDem->puntualizacion = 1;
            $objControlDem->idaprobacion = 1;
            $objControlDem->adicionado = 1;
            $objControlDem->save();
        }
        return 1;
    }

    public function eliminarControlDemanda($params) {
        $eliminados = 0;
        foreach ($params['tuplasaeliminar'] as $value) {
            $objControlDem = Doctrine::getTable('DatControldemanda')->findByDql("idcontroldemanda=$value");
            $objControlDem[0]->delete();
            $eliminados++;
        }
        return $eliminados;
    }

    public function exportarEjecucionAcumuladaMes($params) {
        $integrator = ZendExt_IoC::getInstance();
        $unidades = $integrator->datosmaestros->listarUnidadesMedidaTodas();
        $params['unidadesmedida'] = array();
        foreach ($unidades as $unidad) {
            $params['unidadesmedida'][$unidad['idunidadmedida']] = $unidad['denominacionunidadmedida'];
        }
        unset($unidades);

        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=ejecucionacumulada.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo '<h2><caption>Indicadores</caption></h2>';
        echo '<h3><caption>Ejercicio' . ': ' . $params['ejercicio'] . ' </caption></h3>';
        echo '<h3><caption>Mes' . ': ' . $params['denommes'] . ' </caption></h3>';
        echo '<h3><caption>Vías de adquisición' . ': ' . $params['cbVADenom'] . ' </caption></h3>';
        echo "<table border =0 ><tr> </tr></table><tr >";
        echo "
        <table border=1 cellspacing=0 width=60%>
             <th align=left>Centro de balance</th>
             <th align=left>VA</th>
             <th align=left>OSDE</th>
             <th align=left>OS</th>
             <th align=left>Código</th>
             <th align=left>Denominación</th>
             <th align=left>UM</th>
             <th align=left>Precio</th>
             <th align=left>Plan</th>
             <th align=left>Importe</th>
             <th align=left>Contratado</th>
             <th align=left>Importe contratado</th>
             <th align=left>Ejecutado</th>
             <th align=left>Importe ejecutado</th>";
        $params['delimitar'] = false;
        $params['fecha'] = ConfTiempoxnomenclador::obtenerFechaFin($params);
        $params['fecha'] = $params['fecha'][0];
        $params['idmes'] = null;
        $importeAprobado = 0;
        $importeContratadoTotal = 0;
        $importeEjecutadoTotal = 0;
        foreach ($params['idcentros'] as $v) {

            $params['idcb'] = $v->idcb;
            $params['demandaValida'] = true;
            $data = self::listarControlDemanda($params);

            foreach ($data->data as $value) {
                $osde = explode('-', $value['organossatisface']);
                echo "<tr> <td align=left>" . $v->denominacion . "</td>
                           <td align=left>" . $value['viasadquisicion'] . "</td>
                           <td align=left>" . $osde[0] . "</td>
                           <td align=left>" . $value['organossatisface'] . "</td>
                           <td align=left style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>
                           <td align=left>" . $value['denominacion'] . "</td>
                           <td align=left >" . $params['unidadesmedida'][$value['idunidadmedida']] . "</td>
                           <td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['precio'] . "</td>
                           <td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['demanda'] . "</td>
                           <td align=right style=\"mso-number-format:'#,##0.000';\">" . ($value['importe'] / 1000) . "</td>";
                echo "<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['cantidadcontratada'] . "</td>";
                echo "<td align=right style=\"mso-number-format:'#,##0.000';\">" . ($value['importecontratacion'] / 1000) . "</td>
                      <td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['cantidadejecutada'] . "</td>";
                echo "<td align=right style=\"mso-number-format:'#,##0.000';\">" . ($value['importeejecucion'] / 1000) . "</td> </tr>";
            }
            if ($data->data[0]) {
                $importeAprobado += $data->importeAprobado;
                $importeContratadoTotal += $data->importeContratadoTotal;
                $importeEjecutadoTotal += $data->importeEjecutadoTotal;
                echo "<tr style=text-align:LEFT;background-color:#717d7e>";
                echo "<td colspan = 9 align = left style = text-align:LEFT;
            background-color:#717d7e><b>Importe total del CB</b></td>
                  <td align=right style=\"mso-number-format:'#,##0.000';\"><b>" . ($data->importeAprobado / 1000) . "</b></td>"
                . "<td align=right style=\"mso-number-format:'#,##0.000';\"></td>"
                . "<td align=right style=\"mso-number-format:'#,##0.000';\"><b>" . ($data->importeContratadoTotal / 1000) . "</b></td>"
                . "<td align=right style=\"mso-number-format:'#,##0.000';\"></td>"
                . "<td align=right style=\"mso-number-format:'#,##0.000';\"><b>" . ($data->importeEjecutadoTotal / 1000) . "</b></td></tr>";
            }
        }
        echo "<th colspan = 9 align = left style = text-align:LEFT;>Total </th>
             <th align=right style=\"mso-number-format:'#,##0.000';\">" . ($importeAprobado / 1000) . "</th>
             <th align=left> </th>
              <th align=right style=\"mso-number-format:'#,##0.000';\">" . ($importeContratadoTotal / 1000) . "</th>
             <th align=left> </th>
             <th align=right style=\"mso-number-format:'#,##0.000';\">" . ($importeEjecutadoTotal / 1000) . "</th>
             </tr>";
        echo "</table>\n";
        echo '</BODY></HTML>';
    }

    public function exportarEjecucionOSDE($params) {
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        if ($params['tipo'] == 2)
            header("Content-Disposition: attachment;filename=ejecucionOSDE.xls");
        else if ($params['tipo'] == 3)
            header("Content-Disposition: attachment;filename=ejecucionOS.xls");
        else if ($params['tipo'] == 4)
            header("Content-Disposition: attachment;filename=ejecucionCBOS.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        if ($params['tipo'] == 2)
            echo '<h2><caption>Ejecución de la demanda por OSDE</caption></h2>';
        else if ($params['tipo'] == 3)
            echo '<h2><caption>Ejecución de la demanda por OS</caption></h2>';
        else if ($params['tipo'] == 4)
            echo '<h2><caption>Ejecución de la demanda de los centros de balance por OSDE</caption></h2>';
        echo '<h3><caption>Ejercicio: ' . $params['ejercicio'] . ' </caption></h3>';
        echo '<h3><caption>Vías de adquisición: ' . $params['cbVADenom'] . ' </caption></h3>';
        echo "<table border =0 ><tr> </tr></table><tr >";
        echo "
        <table border=1 cellspacing=0 width=60%>";
        if ($params['tipo'] == 4)
            echo "<th align=left>Centro de balance</th>";

        echo "<th align=left>OSDE</th>";
        if ($params['tipo'] == 3)
            echo "<th align=left>OS</th>";
        echo "<th align=left>Importe</th>
             <th align=left>Imp. contratado</th>
             <th align=left>% Contratado</th>
             <th align=left>Imp. ejecutado</th>
             <th align=left>% Ejecutado</th>
             <th align=left>% Ejec./plan</th>";
        $fecha = date("d/m");
        $auxDenom = explode('(', $params['ejercicio']);
        $params['ejercicio'] = $auxDenom[0];
        $fecha .= "/" . $params['ejercicio'];
        $iddatosnom = DatControldemanda::obtenerFecha($params, $fecha);
        $params['iddatosnom'] = $iddatosnom;
        if ($params['tipo'] == 2 || $params['tipo'] == 3) {
            $params['idcb'] = null;
            $data = DatControldemanda::exportarEjecucionOSDE($params);
            self::pintarEjecucionOSDE($data, $params);
        } else {
            //si es 4 (ejecucion de los CB por OSDE)
            //trabajo con los importes totales
            $importeAprobadoTotal = 0;
            $importeContratadoTotal = 0;
            $importeEjecutadoTotal = 0;
            foreach ($params['idcentros'] as $v) {
                $params['idcb'] = $v->idcb;
                $params['denom'] = $v->denominacion;
                $data = DatControldemanda::exportarEjecucionOSDE($params);

                if ($data->data[0]) {
                    $importeAprobadoTotal = $importeAprobadoTotal + $data->data[0]['importeaprobadototalafuera'] / 1000;
                    $importeContratadoTotal = $importeContratadoTotal + $data->data[0]['importecontratadototalafuera'] / 1000;
                    $importeEjecutadoTotal = $importeEjecutadoTotal + $data->data[0]['importeejecutadototalafuera'] / 1000;
                }
                self::pintarEjecucionOSDE($data, $params);
            }
            echo " <tr><td colspan = 2 align = left style = text-align:LEFT; ><b>Total</b></td>
             <th align=right style=\"mso-number-format:'#,##0.000';\">" . $importeAprobadoTotal . "</th>
             <th align=right style=\"mso-number-format:'#,##0.000';\">" . $importeContratadoTotal . "</th>
             <th align=left> </th>
             <th align=right style=\"mso-number-format:'#,##0.000';\">" . $importeEjecutadoTotal . "</th>
             <th align=left> </th>
             <th align=left> </th>
             </tr>";
        }
        echo "</table>\n";
        echo '</BODY></HTML>';
    }

    public function pintarEjecucionOSDE($data, $params) {
        foreach ($data->data as $value) {
            if ($params['tipo'] == 4) {
                echo "<tr><td align=left>" . $params['denom'] . "</td>
                      <td align=left>" . $value['osde'] . "</td>";
            } else
                echo "<tr><td align=left>" . $value['osde'] . "</td>";
            if ($params['tipo'] == 3)
                echo "<td align=left>" . $value['os'] . "</td>";
            echo "<td align=right style=\"mso-number-format:'#,##0.000';\">" . ($value['importeaprobado'] / 1000) . "</td>
                    <td align=right style=\"mso-number-format:'#,##0.000';\">" . ($value['importecontratadototal'] / 1000) . "</td>
                    <td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['porccont'] . "</td>
                        <td align=right style=\"mso-number-format:'#,##0.000';\">" . ($value['importeejecutadototal'] / 1000) . "</td>
                            <td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['porcejec'] . "</td>
                    <td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['porcejecplan'] . "</td></tr>";
        }
        $colspan = 0;
        $Total = "Total";
        $color = "";
        if ($params['tipo'] == 3) {
            $colspan = 2;
        }
        if ($params['tipo'] == 4) {
            $colspan = 2;
            $Total = "Importe total del CB";
            $color = "background-color:#717d7e";
        }
        if ($value) {
            echo "
             <tr style=text-align:LEFT;$color>
            <td colspan = $colspan align = left style = text-align:LEFT;><b>$Total</b></td>
             <td align=right style=\"mso-number-format:'#,##0.000';\" ><b>" . ($value['importeaprobadototalafuera'] / 1000) . "</b></td>
             <td align=right style=\"mso-number-format:'#,##0.000';\" ><b>" . ($value['importecontratadototalafuera'] / 1000) . "</b></td>
             <td align=left> </td>
             <td align=right style= \"mso-number-format:'#,##0.000';\" ><b>" . ($value['importeejecutadototalafuera'] / 1000) . "</b></td>
             <td align=left> </td>
             <td align=left> </td>
             </tr>";
        }
    }

    public function verCompImportes($params) {
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=resumenimportes.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo '<h2><caption> Importes totales por centro de balance</caption></h2>';
        echo '<h3><caption> Ejercicio ' . ': ' . $params['ejercicio'] . ' </caption></h3>';
        echo '<h3><caption> Vías de adquisición' . ': ' . $params['cbVADenom'] . ' </caption></h3>';
        echo (($params['is_leaf'] == 'true') ? "" : "<table border =0 ><tr> </tr></table>") . "
        <tr >";
        echo "
        <table border=1 cellspacing=0 width=60%>
             <th align=left>Centro de balance</th>
             <th align=left>Importe aprobado</th>
             <th align=left>Importe contratación</th>
             <th align=left>% Contratado</th>
             <th align=left>Importe ejecución</th>
             <th align=left>% Ejecutado</th>
             <th align=left>% Ejec./plan</th>";
        $fecha = date("d/m");
        $auxDenom = explode('(', $params['ejercicio']);
        $params['ejercicio'] = $auxDenom[0];
        $fecha .= "/" . $params['ejercicio'];
        $iddatosnom = DatControldemanda::obtenerFecha($params, $fecha);
        $params['iddatosnom'] = $iddatosnom;
        //trabajo con los importes totales
        $importeAprobadoTotal = 0;
        $importeContratadoTotal = 0;
        $importeEjecutadoTotal = 0;
        foreach ($params['idcb'] as $value) {
            $params['idcb'] = $value->idcb;
            $params['demandaValida'] = true;
            $importes = DatControldemanda::listarImportesTotalesCentrosBalanceEjercicio($params);
            if ($importes[0]['importeaprobado'] < $importes[0]['importecontratadototal'] ||
                    $importes[0]['importeaprobado'] < $importes[0]['importeejecutadototal']) {
                echo "<tr style=text-align:LEFT;background-color:#FE2E2E>";
            } else
                echo "<tr style=text-align:LEFT>";
            echo "<td align = left style = text-align:LEFT;
            background-color:#DDDDDD>" . $value->denominacion . "</td>
            <td align = right style = \"mso-number-format:'#,##0.000';\">" . ($importes[0]['importeaprobado'] / 1000) . "</td>
            <td align=right style=\"mso-number-format:'#,##0.000';\">" . ($importes[0]['importecontratadototal'] / 1000) . "</td>
            <td align = right style = \"mso-number-format:'#,##0.000';\">" . $importes[0]['porccont'] . "</td>
            <td align=right style=\"mso-number-format:'#,##0.000';\">" . ($importes[0]['importeejecutadototal'] / 1000) . "</td>
            <td align=right style=\"mso-number-format:'#,##0.000';\">" . $importes[0]['porcejec'] . "</td>
            <td align=right style=\"mso-number-format:'#,##0.000';\">" . $importes[0]['porcejecplan'] . "</td>";
            $importeAprobadoTotal = $importeAprobadoTotal + $importes[0]['importeaprobado'] / 1000;
            $importeContratadoTotal = $importeContratadoTotal + $importes[0]['importecontratadototal'] / 1000;
            $importeEjecutadoTotal = $importeEjecutadoTotal + $importes[0]['importeejecutadototal'] / 1000;
        }
        echo " <tr> <th align = left style = text-align:LEFT;>Total </th>
             <th align=right style=\"mso-number-format:'#,##0.000';\">" . $importeAprobadoTotal . "</th>
             <th align=right style=\"mso-number-format:'#,##0.000';\">" . $importeContratadoTotal . "</th>
             <th align=left> </th>
             <th align=right style=\"mso-number-format:'#,##0.000';\">" . $importeEjecutadoTotal . "</th>
             <th align=left> </th>
             <th align=left> </th>
        </tr>";
        echo "</table>\n";
        echo '</BODY></HTML>';
    }

}
