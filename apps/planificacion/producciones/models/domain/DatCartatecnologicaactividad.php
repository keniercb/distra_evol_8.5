<?php

class DatCartatecnologicaactividad extends BaseDatCartatecnologicaactividad {

    public function setUp() {
        parent::setUp();
    }

    public function listarActividadesCT($params, $exportar = null) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "act." . $datos['field'] . " LIKE '" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(act." . $datos['field'] . ") LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } else
                if ($datos['field'] == 'plazo' || $datos['field'] == 'duracion' || $datos['field'] == 'porciento' /* || $datos['field'] == 'numero' */) {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $condiciones[] = "cact." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                } else
                if ($datos['field'] == 'idetapa') {
                    $condiciones[] = "cact.idetapa = " . $datos['data']['value'] . " ";
                } else
                if ($datos['field'] == 'diacero') {
                    if ($datos['data']['value'] == 'Sí') {
                        $valor = 1;
                    } else {
                        $valor = 0;
                    }
                    $condiciones[] = "cact." . $datos['field'] . " =" . $valor;
                }
                if ($datos['field'] == 'fecha') {
                    $fecha = explode('/', $datos['data']['value']);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $condiciones[] = "cact.fecha" . " <= '" . $fecha . "'";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $condiciones[] = "cact.fecha" . " >= '" . $fecha . "'";
                        } else {
                            $condiciones[] = "cact.fecha" . " = '" . $fecha . "'";
                        }
                    }
                }
                if ($datos['field'] == 'idusuario') {
                    $condiciones[] = "cact." . $datos['field'] . " =" . $datos['data']['value'];
                }
            }
        }//Fin de los filtros
        $WHERE = " AND TRUE ";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
        $SelectExp = "";
        $InnerJoinExp = "";
        if ($exportar) {
            $SelectExp = ",nom.denominacion as denometapa";
            $InnerJoinExp = "INNER JOIN mod_planificacion.nom_datosnomenclador nom ON cact.idetapa = nom.iddatosnomenclador";
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT cact.idcartatecnologicaactividad,
                        cact.idactividad,
                        '-' as numero,
                        act.codigo,
                        act.denominacion,
                        act.descripcion,
                        cact.plazo,
                        cact.duracion,
                        cact.idetapa,
                        cact.diacero,
                        cact.idusuario,
                        cact.fecha,
                        cact.porciento,
                        count(*) over() as total $SelectExp
                 FROM mod_spouam.dat_cartatecnologicaactividad cact
                      INNER JOIN mod_planificacion.nom_actividad act ON act.idactividad = cact.idactividad
                      $InnerJoinExp
                    WHERE (cact.idcartatecnologica = {$params['idcartatecnologica']}) $WHERE
                    ORDER BY cact.plazo, act.codigo, cact.idcartatecnologicaactividad ASC
                    $delimitando";
        $data = $conn->execute($query)
                ->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarActividadesCTDependencia($params, $exportar = null) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "act." . $datos['field'] . " LIKE '" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(act." . $datos['field'] . ") LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } else
                if ($datos['field'] == 'plazo' || $datos['field'] == 'duracion' /* || $datos['field'] == 'numero' */) {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $condiciones[] = "cact." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                } else
                if ($datos['field'] == 'idetapa') {
                    $condiciones[] = "cact.idetapa = " . $datos['data']['value'] . " ";
                } else
                if ($datos['field'] == 'diacero') {
                    if ($datos['data']['value'] == 'Sí') {
                        $valor = 1;
                    } else {
                        $valor = 0;
                    }
                    $condiciones[] = "cact." . $datos['field'] . " =" . $valor;
                }
            }
        }//Fin de los filtros
        $idPadreAct = get_object_vars($params['actPadres']);
        $arrayNotIn = array();
        foreach ($params['actPadres'] as $padre) {
            if (is_object($padre)) {
                $padre = get_object_vars($padre);
            }
            $arrayChildren = array();
            $dat = self::childrenDependenciaById($padre['idcartatecnologicaactividad'], $arrayChildren);
            $arrayNotIn[] = $padre['idcartatecnologicaactividad'];
            if (is_numeric($dat[0])) {
                $arrayNotIn = array_merge($dat, $arrayNotIn);
            }
            $arrayPdres = array();
            $padres = self::padresDependenciaById($padre['idcartatecnologicaactividad'], $arrayPdres);
            if (is_numeric($padres[0])) {
                $arrayNotIn = array_merge($padres, $arrayNotIn);
            }
        }
        $arrayNotIn = implode(',', $arrayNotIn);
        $WHERE = " AND TRUE ";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
        $SelectExp = "";
        $InnerJoinExp = "";
        if ($exportar) {
            $SelectExp = ",nom.denominacion as denometapa";
            $InnerJoinExp = "INNER JOIN mod_planificacion.nom_datosnomenclador nom 
                            ON cact.idetapa = nom.iddatosnomenclador";
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT cact.idcartatecnologicaactividad,
                        cact.idactividad,
                        '-' as numero,
                        act.codigo,
                        act.denominacion,
                        act.descripcion,
                        cact.plazo,
                        cact.duracion,
                        cact.idetapa,
                        cact.diacero,
                        count(*) over() as total $SelectExp
                 FROM mod_spouam.dat_cartatecnologicaactividad cact
                      INNER JOIN mod_planificacion.nom_actividad act ON act.idactividad = cact.idactividad
                      $InnerJoinExp
                    WHERE (cact.idcartatecnologica = {$params['idcartatecnologica']}) AND idcartatecnologicaactividad NOT IN ({$arrayNotIn}) $WHERE
                    ORDER BY cact.plazo ASC
                    $delimitando";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function childrenDependenciaById($idPadre, $arrayChildren) {
        $arrayChildrentmp = array();
        $resultado = array();
        $arrayChildrentmp = $arrayChildren;
        $conn = Doctrine_Manager::connection();
        $sqlChildren = "SELECT idcartatecnologicaactividaddestino
                            FROM mod_spouam.dat_dependenciasactividad 
                            where idcartatecnologicaactividadorigen = ? ";
        $result = $conn->execute($sqlChildren, array($idPadre));
        $data = $result->fetchAll(PDO::FETCH_COLUMN);
        if (count($data) > 0) {
            foreach ($data as $id) {
                $arrayChildrentmp[] = $id;
            }
            foreach ($data as $d) {
                self::childrenDependenciaById($d, $arrayChildrentmp);
            }
        } else {
            $arrayChildrentmp[] = $data;
        }
        return $arrayChildrentmp;
    }

    public function padresDependenciaById($idPadre, $arrayChildren) {
        $arrayChildrentmp = array();
        $resultado = array();
        $arrayChildrentmp = $arrayChildren;
        $conn = Doctrine_Manager::connection();
        $sqlChildren = "SELECT  idcartatecnologicaactividadorigen
                            FROM mod_spouam.dat_dependenciasactividad 
                            where idcartatecnologicaactividaddestino = ? ";
        $result = $conn->execute($sqlChildren, array($idPadre));
        $data = $result->fetchAll(PDO::FETCH_COLUMN);
        if (count($data) > 0) {
            foreach ($data as $id) {
                $arrayChildrentmp[] = $id;
            }
            foreach ($data as $d) {
                self::childrenDependenciaById($d, $arrayChildrentmp);
            }
        } else {
            $arrayChildrentmp[] = $data;
        }
        return $arrayChildrentmp;
    }

    public function listarEquipoDeUnaCT($params) {
        /* filtrar por naturaleza equipo e implemento */
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT nor.idindicador,ind.codigo,ind.denominacion,
            indplanif.precio,ind.numeropieza,ind.idumedida,'-' AS centrobalance
            FROM mod_spouam.dat_cartatecnologicaactividad cta
            INNER JOIN mod_planificacion.nom_actividad act
            USING(idactividad) INNER JOIN mod_planificacion.dat_norma nor
            USING(idactividad) INNER JOIN mod_datosmaestros.nom_indicador ind
            ON(nor.idindicador = ind.idindicador AND ind.idindicador NOT IN(
             SELECT arr.idindicador FROM mod_spouam.dat_arrendamiento arr
             WHERE arr.idaplicacioncartatec = ? ))
            INNER JOIN mod_datosmaestros.nom_indicadorplanif indplanif ON(indplanif.idindicador = ind.idindicador)
            INNER JOIN mod_spouam.nom_indicadoruam induam
            ON(induam.idindicador = ind.idindicador) WHERE cta.idcartatecnologica = ?
            OFFSET ? LIMIT ?";
        $data->data = $conn->execute(
                        $query, array($params['idaplicacioncartatec'],
                    $params['idcartatecnologica'], $params['start'],
                    $params['limit'])
                )
                ->fetchAll(PDO::FETCH_ASSOC);
        $queryTotal = "SELECT COUNT( DISTINCT nor.idindicador) AS total
            FROM mod_spouam.dat_cartatecnologicaactividad cta
            INNER JOIN mod_planificacion.nom_actividad act
            USING(idactividad) INNER JOIN mod_planificacion.dat_norma nor
            USING(idactividad) INNER JOIN mod_datosmaestros.nom_indicador ind
            ON(nor.idindicador = ind.idindicador AND ind.idindicador NOT IN(
            SELECT arr.idindicador FROM mod_spouam.dat_arrendamiento arr
            WHERE arr.idaplicacioncartatec = ? ))
            INNER JOIN mod_spouam.nom_indicadoruam induam
            ON(induam.idindicador = ind.idindicador ) WHERE cta.idcartatecnologica = ?";
        $res = $conn->execute($queryTotal, array($params['idaplicacioncartatec'], $params['idcartatecnologica']));
        $arrayTotal = $res->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $arrayTotal[0]['total'];
        return $data;
    }

    public function obtenerMinYMaxCartaTecAct($idcartatecnologica) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT apct.idaplicacioncartatec,
                MIN(cta.plazo) as min,
                round( MAX ( cta.plazo*1440 + (nor.cantplanif/cantbase) ),3) as tiempototalnormado_horas
                FROM mod_spouam.dat_aplicacioncartatec apct
                INNER JOIN mod_spouam.dat_cartatecnologicaactividad cta
                ON( cta.idcartatecnologica = apct.idcartatecnologica)
                INNER JOIN mod_planificacion.dat_norma nor
                ON( nor.idactividad = cta.idactividad
                AND idindicador IN(SELECT idindicador FROM mod_spouam.nom_indicadoruam induam
                WHERE idnaturalezauam = 12)) WHERE apct.idcartatecnologica = ?
                GROUP BY apct.idaplicacioncartatec";
        $res = $conn->execute($sql, array($idcartatecnologica));
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        if ($result[0]['min'] != null) {
            return array("min" => $result[0]['min'],
                "max" => $result[0]['tiempototalnormado_horas']);
        } else {
            return array("min" => 0, "max" => 0);
        }
    }

    public function obtenerCartaTecAct($idcartatecnologica) {
        $query = new Doctrine_Query();
        $result = $query
                ->from("DatCartatecnologicaactividad cta")
                ->addWhere('cta.idcartatecnologica = ?', $idcartatecnologica)
                ->execute();
        return $result;
    }

    public function obtenerIdEtapa($idcartatecnologica, $idactividad) {
        $query = new Doctrine_Query();
        $result = $query
                        ->from("DatCartatecnologicaactividad cta")
                        ->addWhere('cta.idcartatecnologica = ?', $idcartatecnologica)
                        ->addWhere('cta.idactividad = ?', $idactividad)->execute()->toArray();
        return $result;
    }

    public function deleteDependencia($idactividad) {
        $conn = Doctrine_Manager::connection();
        $sqlDelete = "DELETE FROM mod_spouam.dat_dependenciasactividad
             WHERE idcartatecnologicaactividadorigen = ?";
        $conn->execute($sqlDelete, array($idactividad));
    }

    public function insertDependencia($idactPadre, $idactChildren) {
        $conn = Doctrine_Manager::connection();
        $sqlAdd = "INSERT INTO mod_spouam.dat_dependenciasactividad( idcartatecnologicaactividadorigen, idcartatecnologicaactividaddestino)
                              VALUES (?, ?)";
        $conn->execute($sqlAdd, array($idactPadre, $idactChildren));
    }

    public function listarActividades($params, $idactividad) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "actv." . $datos['field'] . " LIKE '" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(actv." . $datos['field'] . ") LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                }
            }
        }//Fin de los filtros
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $start = $params['start'];
        $limit = $params['limit'];
        if ($idactividad)
            $addwhere = "actv.idactividad not in($idactividad) AND";
        else {
            $addwhere = "";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT actv.idactividad,
                        actv.codigo,
                        actv.denominacion,
                        actv.descripcion,
                        count(*) over() as total
                 FROM mod_planificacion.nom_actividad actv
                   INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON (
                    actv.idactividad = aec.idactividad AND aec.idespecialidad = {$params['idespecialidad']})
                  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON
                    aec.iddatosnomenclador = dn.iddatosnomenclador
                 WHERE actv.estado = 1 AND
                       actv.idaprobacion = 4 AND
                       actv.nivel = 4 AND
                       $addwhere
                        (dn.uridatosnomenclador = 'propia' OR
                        dn.uridatosnomenclador = 'compartida') $WHERE
                 OFFSET $start LIMIT $limit";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function setDiaCero($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "UPDATE 
                    mod_spouam.dat_cartatecnologicaactividad 
                  SET 
                    diacero = 0
                  WHERE 
                    idcartatecnologica = {$params['idcartatecnologica']}";
        $conn->execute($sql);
        $conn2 = Doctrine_Manager::connection();
        $sql2 = "UPDATE 
                    mod_spouam.dat_cartatecnologicaactividad 
                  SET 
                    diacero = 1
                  WHERE 
                    plazo = 0 AND idcartatecnologica = {$params['idcartatecnologica']} 
                    AND idactividad = {$params['idactividad']}
                    AND idcartatecnologicaactividad = {$params['idcartatecnologicaactividad']}";
        $conn2->execute($sql2);
    }

    public function obtenerEtapasCarta($idproduccion) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
DISTINCT ca.idetapa, dn.denominacion as denominacionetapa
FROM mod_spouam.dat_aplicacioncartatec p  
  INNER JOIN  mod_spouam.dat_cartatecnologica c
  on(c.idcartatecnologica=p.idcartatecnologica)
  INNER JOIN mod_spouam.dat_cartatecnologicaactividad ca
  on(ca.idcartatecnologica=c.idcartatecnologica)
  INNER JOIN  mod_planificacion.nom_datosnomenclador dn
  on(dn.iddatosnomenclador=ca.idetapa)
  where p.idaplicacioncartatec=$idproduccion";
        $res = $conn->execute($sql);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}

//fin clase 
