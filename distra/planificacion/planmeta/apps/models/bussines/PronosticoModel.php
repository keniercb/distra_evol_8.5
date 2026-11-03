<?php

class PronosticoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    //Lista los indicadores planificados con cantidad mayor que cero dada una entidad y un ejercicio
    public function listarIndEjec($parametros) {
        $Having = "";
        $condiciones = array();
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $datos) {

                if ($datos['field'] == 'codigo') {
                    $condiciones[] = " ind.codigo LIKE '"
                            . $datos['data']['value']
                            . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condiciones[] = "upper(ind.denominacion) LIKE  "
                                . ("'%"
                                . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                    } else {
                        if ($datos['field'] == 'cantfinal') {
                            if ($datos['data']['comparison'] == 'lt') {
                                $Having = " and sum (p.cantidad + p.ajuste) <{$datos['data']['value']}";
                            } else {
                                if ($datos['data']['comparison'] == 'gt') {
                                    $Having = " and sum (p.cantidad + p.ajuste) >{$datos['data']['value']}";
                                } else {
                                    $Having = " and sum (p.cantidad + p.ajuste) ={$datos['data']['value']}";
                                }
                            }
                        } else {
                            if ($datos['field'] == 'umedida') {
                                $condiciones[] = " p.idunidadmedida = "
                                        . $datos['data']['value'];
                            }
                        }
                    }
                }
            }
        }
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }
        if (!$parametros['limit']) {
            $parametros['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$parametros['start']}
                          LIMIT  {$parametros['limit']}";

        $parametros['identidades'] = implode(',', $parametros['entidades']);
        $data = DatPronostico::listarIndEjec($parametros, $WHERE, $Having, $offsetLimit);

        return $data;
    }

    public function getMeses($params) {

        $conn = Doctrine_Manager::connection();

        $paginado = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $paginado = " OFFSET $start LIMIT $limit ";
        }

        $sql = "SELECT dn.iddatosnomenclador,
                        dn.denominacion as mes,
                        COUNT(*) OVER() as total
                FROM mod_planificacion.nom_datosnomenclador dn
                      INNER JOIN mod_planificacion.nom_tiponomenclador tn ON
                dn.idtiponomenclador
                        = tn.idtiponomenclador
                WHERE tn.uritiponomenclador = 'mes' and dn.uridatosnomenclador <> '-'
                ORDER BY dn.iddatosnomenclador " . $paginado;

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public function getIndWitOrganos($params) {

        $conn = Doctrine_Manager::connection();


        $filtros = array();
        $filtros = $params['filtros'];
        $whereFilter = '';

        if (count($filtros) > 0) {

            foreach ($filtros as $i => $value) {

                switch ($value->data->type) {

                    case 'string':
                        if ($value->field == 'codigo') {
                            $arrayPa = "%" . strtolower($value->data->value) . "%";
                            $whereFilter .= " AND lower(ind.codigo)::varchar LIKE'" . $arrayPa . "' ";
                        }
                        if ($value->field == 'idunidadmedida') {
                            $arrayPa = intval($value->data->value);
                            $whereFilter .= " AND (p.idunidadmedida) =" . $arrayPa;
                        }
                        if ($value->field == 'denominacion') {
                            $arrayPa = "%" . strtolower($value->data->value) . "%";
                            $whereFilter .= " AND  lower(ind.denominacion)::varchar LIKE '" . $arrayPa . "' ";
                        }
                        break;


                    case 'numeric':
                        $valor = $value->data->value;
                        if ($value->field == 'pocientopron') {
                            $value->field = "ROUND((o.cantpron * 100) /((p.cantidad +p.ajuste)/12),6)";
                        }
                        if ($value->field == 'cantpron') {
                            $value->field = "o.cantpron";
                        }
                        if ($value->field == 'cantplanif') {
                            $value->field = "ROUND((p.cantidad + p.ajuste) / 12, 6)";
                        }
                        $comparission = "=";
                        if ($value->data->comparison == 'gt') {
                            $comparission = ">";
                        }
                        if ($value->data->comparison == 'lt') {
                            $comparission = "<";
                        }
                        if ($value->data->comparison == 'eq') {
                            $comparission = "=";
                        }
                        $whereFilter .= " AND " . $value->field . ' ' . $comparission . ' ' . strtolower($value->data->value) . "";
                        break;
                }
            }
        }

        $paginado = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $paginado = " OFFSET $start LIMIT $limit ";
        }

        $sql = "WITH organos AS (
                             SELECT DISTINCT ios.idindicador,
                                    LIST(os.denominacion) as organo,
                                    LIST((COALESCE(pr.pronostico, 0))::VARCHAR) as
                                      pronostico,
                                    SUM((COALESCE(pr.pronostico, 0))) as cantpron,
                                    LIST((COALESCE(ios.idorganosatisface, 0))::VARCHAR)
                                      as idorganosatisface
                             FROM  mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios
                             INNER JOIN
                                   mod_datosmaestros.nom_organosatisface os ON (ios.idorganosatisface = os.idorganosatisface AND os.ordender - os.ordenizq = 1)
                             LEFT JOIN
                                   mod_planificacion.dat_pronostico pr ON ( ios.idindicador = pr.idindicador AND   pr.idorganosatisface = ios.idorganosatisface AND
                                    pr.idmes = {$params['idMes']} AND pr.idejercicio = {$params['idEjercicio']} AND pr.identidad IN ({$params['idEntidad']}))
                             GROUP BY ios.idindicador)

                            SELECT DISTINCT x.idindicador,
                                           x.codigo,
                                           x.denominacion,
                                           x.idunidadmedida,
                                           x.cantplanif,
                                           x.organo,
                                           x.pronostico,
                                           x.cantpron,
                                           x.pocientopron,
                                           x.idorganosatisface,
                             COUNT (*) OVER() as total
                            from ((
                                    SELECT DISTINCT p.idindicador,
                                           ind.codigo,
                                           ind.denominacion,
                                           p.idunidadmedida,
                                           ROUND(SUM(p.cantidad + p.ajuste) / 12, 6) as cantplanif,
                                           o.organo,
                                           o.pronostico,
                                           o.cantpron,
                                           ROUND((o.cantpron * 100) /(SUM(p.cantidad +p.ajuste)/12),6) as pocientopron,
                                           o.idorganosatisface

                                    FROM mod_planificacion.dat_planificacion p
                                         INNER JOIN mod_planificacion.dat_entidadmodelo em ON
                                           p.identidadmodelo = em.identidadmodelo
                                         INNER JOIN mod_datosmaestros.nom_indicador ind ON
                                           p.idindicador = ind.idindicador
                                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON
                                           ip.idindicador = ind.idindicador
                                         INNER JOIN organos o ON (o.idindicador = ip.idindicador)
                                    where em.identidad IN ({$params['idEntidad']}) AND
                                          p.idejercicio = {$params['idEjercicio']} AND
                                          ip.nivelplanif = 1 AND
                                          ip.idaprobacion = 4 AND
                                          p.idaprobaciondemanda = 4 AND
                                          ind.estado = 1 " . $whereFilter . "
                                    GROUP BY p.idindicador,
                                             ind.codigo,
                                             ind.denominacion,
                                             p.idunidadmedida,
                                             o.organo,
                                             o.pronostico,
                                             o.cantpron,
                                             o.idorganosatisface
                                    HAVING sum(p.cantidad + p.ajuste) > 0
                                    ORDER BY ind.codigo  " . $paginado . " )
                            UNION (
                                    SELECT DISTINCT pr.idindicador,
                                           ind.codigo,
                                           ind.denominacion,
                                           ind.idumedida as idunidadmedida,
                                           0 as cantplanif,
                                           o.organo,
                                           o.pronostico,
                                           o.cantpron,
                                           0 as pocientopron,
                                           o.idorganosatisface
                                    FROM mod_planificacion.dat_pronostico pr
                                         LEFT JOIN mod_planificacion.dat_planificacion p ON (
                                           p.idindicador = pr.idindicador AND p.idejercicio  = 15)
                                         LEFT JOIN mod_planificacion.dat_entidadmodelo em ON (
                                           p.identidadmodelo = em.identidadmodelo AND em.identidad IN
                                           ({$params['idEntidad']}))
                                         INNER JOIN mod_datosmaestros.nom_indicador ind ON
                                           pr.idindicador = ind.idindicador
                                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON
                                           ip.idindicador = ind.idindicador
                                         INNER JOIN organos o ON (o.idindicador = ip.idindicador)
                                    where p.idplanificacion IS NULL AND
                                          pr.identidad IN ({$params['idEntidad']}) AND
                                          pr.idejercicio = {$params['idEjercicio']} AND
                                          pr.idmes = {$params['idMes']} AND
                                          ip.nivelplanif = 1 AND
                                          ip.idaprobacion = 4 AND
                                          ind.estado = 1 " . $whereFilter . "
                                    GROUP BY pr.idindicador,
                                             ind.codigo,
                                             ind.denominacion,
                                             ind.idumedida,
                                             o.organo,
                                             o.pronostico,
                                             o.cantpron,
                                             o.idorganosatisface
                                    ORDER BY ind.codigo " . $paginado . ")) x";


        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public function listarOrganosSatisface($parametros) {
        return DatPronostico::listarOrganosSatisface($parametros);
    }

    public function getOrganosSatisface() {

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
              idorganosatisface,
              denominacion
            FROM
              mod_datosmaestros.nom_organosatisface
              where ordender - ordenizq = 1 order by denominacion; ";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public function setPronosticos($params, $pronosticos, $idOrganos) {

        foreach ($pronosticos as $i => $pr) {

            if ($this->exisPronostico($pr->idindicador, $params['idEntidad'], $params['idMes'], $params['idEjercicio']) > 0) {
                $del = $this->delPronostico(intval($pr->idindicador), $params['idEntidad'], $params['idMes'], intval($params['idEjercicio']));
            }

            $res = $this->insertPronostico($pr, $idOrganos, $params['idEntidad'], $params['idMes'], intval($params['idEjercicio']), $params['total']);
        }
    }

    public function exisPronostico($idIndicador, $idEntidad, $idMes, $idEjercicio) {
        $conn = Doctrine_Manager::connection();

        $sql = "SELECT count(*)
                    FROM mod_planificacion.dat_pronostico where idindicador = " . $idIndicador . " AND identidad =" . $idEntidad . " AND idmes=" . $idMes . " AND idejercicio=" . $idEjercicio;

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $data[0]['count'];
    }

    /*     * eliminar pronosticos
     * @param $idIndicador
     * @param $idEntidad
     * @param $idMes
     * @param $idEjercicio
     * @return int
     */

    public function delPronostico($idIndicador, $idEntidad, $idMes, $idEjercicio) {
        $conn = Doctrine_Manager::connection();
        $codMsj = 3;

        try {
            $sql = "DELETE FROM mod_planificacion.dat_pronostico where idindicador = " . $idIndicador . " AND identidad =" . $idEntidad . " AND idmes=" . $idMes . " AND idejercicio=" . $idEjercicio;

            $data = $conn->execute($sql);
            $codMsj = 1;
            return $codMsj;
        } catch (Exception $e) {

            return $codMsj;
        }
    }

    public function insertPronostico($pronostico, $idOrganos, $idEntidad, $idMes, $idEjercicio, $total) {
        $conn = Doctrine_Manager::connection();
        $codMsj = 3;


        try {
            $sql = "INSERT INTO mod_planificacion.dat_pronostico(idindicador, idorganosatisface, pronostico, idmes,identidad, idejercicio)
                           VALUES (?, ?, ?, ?, ?, ?);";
            foreach ($idOrganos as $i => $organo) {
                $data = $conn->execute($sql, array(intval($pronostico->idindicador), intval($organo), floatval($pronostico->$i), $idMes, $idEntidad, $idEjercicio));
            }

            $codMsj = 1;
            return $codMsj;
        } catch (Exception $e) {

            return $codMsj;
        }
    }

    public function getIndicadores($params) {

        $conn = Doctrine_Manager::connection();


        $filtros = array();
        $filtros = $params['filtros'];
        $whereFilter = '';

        if (count($filtros) > 0) {

            foreach ($filtros as $i => $value) {

                switch ($value->data->type) {

                    case 'string':
                        if ($value->field == 'codigo') {
                            $arrayPa = "%" . strtolower($value->data->value) . "%";
                            $whereFilter .= " AND lower(ind.codigo)::varchar LIKE'" . $arrayPa . "' ";
                        }
                        if ($value->field == 'idumedida') {
                            $arrayPa = intval($value->data->value);
                            $whereFilter .= " AND (ind.idumedida) =" . $arrayPa;
                        }
                        if ($value->field == 'denominacion') {
                            $arrayPa = "%" . strtolower($value->data->value) . "%";
                            $whereFilter .= " AND  lower(ind.denominacion)::varchar LIKE '" . $arrayPa . "' ";
                        }
                        if ($value->field == 'organo') {
                            $arrayPa = intval($value->data->value);
                            $whereFilter .= "AND os.idorganosatisface IN ({$arrayPa})";
                        }


                        break;

                    case 'numeric':
                        $valor = $value->data->value;
                        if ($value->field == 'precio') {
                            $value->field = "ip.precio";
                        }
                        $comparission = "=";
                        if ($value->data->comparison == 'gt') {
                            $comparission = ">";
                        }
                        if ($value->data->comparison == 'lt') {
                            $comparission = "<";
                        }
                        if ($value->data->comparison == 'eq') {
                            $comparission = "=";
                        }
                        $whereFilter .= " AND " . $value->field . ' ' . $comparission . ' ' . strtolower($value->data->value) . "";
                        break;
                }
            }
        }


        $paginado = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $paginado = " OFFSET $start LIMIT $limit ";
        }

        $sql = "SELECT ind.idindicador,
                           ind.codigo,
                           ind.denominacion,
                           ind.idumedida,
                           ip.precio,
                           LIST(os.denominacion) as organo,
                           LIST(os.idorganosatisface::varchar) as idorganosatisface,
                           COUNT(*) OVER() as total
                    FROM mod_datosmaestros.nom_indicador ind
                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
                           ind.idindicador
                         INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios
                           ON ios.idindicador = ip.idindicador
                         INNER JOIN mod_datosmaestros.nom_organosatisface os ON (
                           ios.idorganosatisface = os.idorganosatisface AND os.ordender -
                           os.ordenizq = 1)
                         LEFT JOIN mod_planificacion.dat_pronostico pr ON (ios.idindicador =
                           pr.idindicador AND pr.idejercicio = {$params['idEjercicio']} AND pr.identidad IN ({$params['idEntidad']}))
                         LEFT JOIN mod_planificacion.dat_planificacion p ON (p.idindicador =
                           ind.idindicador AND p.idejercicio = {$params['idEjercicio']})
                         LEFT JOIN mod_planificacion.dat_entidadmodelo em ON (p.identidadmodelo =
                           em.identidadmodelo AND em.identidad IN ({$params['idEjercicio']}))
                    WHERE pr.idpronostico IS NULL AND
                          p.idplanificacion IS NULL AND
                          ip.nivelplanif = 1 AND
                          ip.idaprobacion = 4 AND
                          ind.estado = 1 --AND
                          --ip.precio > 0 
                          $whereFilter
                    GROUP BY ind.idindicador,
                             ind.codigo,
                             ind.denominacion,
                             ip.precio,
                             ind.idumedida
                    ORDER BY ind.codigo " . $paginado;

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);


        return $data;
    }

    public function exportarPronostico($params) {

        $cantColumnas = 6 + count($params['colunmasDinamicas']);
        $tabla = "<table border='1'>
            <thead>
                <tr>
                    <td align=left colspan= " . $cantColumnas . "><b>Entidad: </b> " . utf8_decode($params['textEntidad']) . " &nbsp;&nbsp;&nbsp;</td>
                </tr>
            </thead>
            <tbody>
                <tr>";

        $columnas = "<th width='100'>C&oacute;digo</th>
                    <th width='100'>Producto</th>
                    <th width='100'>UM</th>
                    <th width='100'>Cantidad planificada</th>
                    <th width='100'>Cantidad pronosticada</th>
                    <th width='100'>Porciento pronosticado</th>";
        //construccion de las columnas

        foreach ($params['colunmasDinamicas'] as $ind => $etiq) {
            $columnas .= '<th align=left>' . $etiq . '</th>';
        }
        $tabla = $tabla . $columnas;


        $object = new PronosticoModel();
        $data = $object->getIndWitOrganos($params);

        foreach ($data as $i => $value) {

            $unidades = $params->integrator->datosmaestros->listarUnidadesMedidaTodas();
            foreach ($unidades as $value) {
                $unidades [$value['idunidadmedida']] = $value['abreviaturaunidadmedida'];
            }

            $um = $unidades[$value['idunidadmedida']];

            $filaResumen .= "<tr><td width='100'>" . $value['codigo'] . "</td>
                                <td width='100'>" . $value['denominacion'] . "</td>
                                <td width='100'>" . $um . "</td>
                                <td width='100'>" . $value['cantplanif'] . "</td>
                                <td width='100'>" . $value['cantpron'] . "</td>
                                <td width='100'>" . $value['pocientopron'] . "</td>";

            foreach ($params['colunmasDinamicas'] as $ind => $etiq) {
                $filaResumen .= "<td width='100'> - </td>";
            }
            $filaResumen .= '</tr>';
        }

        $cant = count($params['colunmasDinamicas']);
        $abc = "LMNOPQRSTUVWXYZA";
        $abcuno = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        if ($cant < 16) {
            $LETRAFINAL = substr($abc, $cant, 1);
        } else {
            $LETRAFINAL = 'A' . substr($abcuno, ($cant - 16), 1);
        }
        $LETRAFINAL = 'O';

        $filaResumen
                .= '<td></td>
                                <td></td>
                                <td>Importe Total:</td>
                                <td>20</td>
                                ';
        $tabla .= $filaResumen;

        $filaResumenuno = '
                                <td>44</td>
                               ';
        $tabla .= $filaResumenuno;
        $filaResumendos = '
                                <td>44</td>
                                ';
        $tabla .= $filaResumendos;

        $tabla
                .= '
            </tbody>
        </table>';

        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=planes.xls");
        header("Content-Transfer-Encoding: utf8_decode ");

        echo $tabla;
    }

}
