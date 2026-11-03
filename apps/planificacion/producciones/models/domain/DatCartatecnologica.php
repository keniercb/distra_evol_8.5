<?php

class DatCartatecnologica extends BaseDatCartatecnologica {

    public function setUp() {
        parent::setUp();
    }

    public function aprobarCartaTecnologica($idaprobacion, $idcarta) {
        $query = new Doctrine_Query();
        $query->update("DatCartatecnologica")
                ->set("idaprobacion", $idaprobacion)
                ->addWhere('idcartatecnologica = ?', $idcarta);
        return $query->execute();
    }

    public function activarCartaTecnologica($activar, $cartas) {
        $query = new Doctrine_Query();
        $query->update("DatCartatecnologica")
                ->set("estado", $activar)
                ->whereIn("idcartatecnologica", $cartas);
        return $query->execute();
    }

    public function buscarCartaTecIndicador($idcartatecnologica) {
        $query = new Doctrine_Query();
        $result = $query->from("DatCartatecnologica ct")
                        ->innerJoin('ct.DatCartatecnologicaindicador cti')
                        ->innerJoin('cti.DatCartatecindicadordatosnom ctidn')
                        ->innerJoin('cti.NomIndicador in')
                        ->innerJoin('in.NomIndicador inplanif')
                        ->addWhere('idcartatecnologica = ?', $idcartatecnologica)
                        ->execute()->toArray(true);
        return $result;
    }

    public function obtenerFichaDeCosto($idcartatecnologica) {
        /*
         * Cultivo 1
         * Equipo 2
         * Agua 3
         * Insumo 4
         * Electricidad 5
         * Implemento 6
         * Combustible 7
         * Lubricante 8
         * Semilla 9
         * Medio material 10
         * Persona 11
         */
        $conn = Doctrine_Manager::connection();
        $query = self::consultaUno($idcartatecnologica);
        $result = $conn->execute($query)->fetchAll();
        if ($result[0] != null) {
            return $result;
        } else {
            return array(array('importeinsumos' => 0,
                    'importecomblub' => 0,
                    'importeenergiaelect' => 0,
                    'importeagua' => 0));
        }
    }

    public function select() {
        $consulta = "SELECT DISTINCT alias.idcartatecnologica,
                        SUM(alias.importeinsumos ) as importeinsumos,
                        SUM(alias.importecomblub ) as importecomblub,
                        SUM(alias.importeenergiaelect) as importeenergiaelect,
                        SUM(alias.importeagua) as importeagua,
                        SUM(alias.importesalario) as importesalario,
                        0 as importevacaciones,
                        0 as importecontsegsocial,
                        SUM(alias.importe_ogd_depreciacion) as importe_ogd_depreciacion,
                        SUM(alias.importe_ogd_mantenimiento) as importe_ogd_mantenimiento";
        return $consulta;
    }

    public function consultaUno($idcartatecnologica) {
        $select = self::select();
        $consulta = "$select FROM(SELECT  ct.idcartatecnologica,
                        COALESCE((SELECT SUM(subindplanif.precio)
                                FROM mod_datosmaestros.nom_indicador subind
                                INNER JOIN mod_datosmaestros.nom_indicadorplanif subindplanif ON(subindplanif.idindicador = subind.idindicador)
                                INNER JOIN mod_spouam.nom_indicadoruam induam
                                ON(subind.idindicador = induam.idindicador AND induam.idnaturalezauam = 4 )
                                WHERE subind.idindicador =  ind.idindicador
                                ),0)as importeinsumos,COALESCE((SELECT SUM(subindplanif.precio*(n.cantplanif/n.cantbase))
                                FROM mod_datosmaestros.nom_indicador subind
                                INNER JOIN mod_datosmaestros.nom_indicadorplanif subindplanif ON(subindplanif.idindicador = subind.idindicador)
                                INNER JOIN mod_spouam.nom_indicadoruam induam
                                ON(subind.idindicador = induam.idindicador
                                AND (induam.idnaturalezauam = 7 OR induam.idnaturalezauam = 8) )
                                WHERE subind.idindicador =  ind.idindicador
                                GROUP BY subind.idindicador),0) as importecomblub,

                        COALESCE(
                                (SELECT SUM(subindplanif.precio*(n.cantplanif/n.cantbase))
                                FROM mod_datosmaestros.nom_indicador subind
                                INNER JOIN mod_datosmaestros.nom_indicadorplanif subindplanif ON(subindplanif.idindicador = subind.idindicador)
                                INNER JOIN mod_spouam.nom_indicadoruam induam
                                ON(subind.idindicador = induam.idindicador AND (induam.idnaturalezauam = 5) )
                                WHERE subind.idindicador =  ind.idindicador),0) as importeenergiaelect,
                        COALESCE(
                                (SELECT SUM(subindplanif.precio*(n.cantplanif/n.cantbase))
                                FROM mod_datosmaestros.nom_indicador subind
                                INNER JOIN mod_datosmaestros.nom_indicadorplanif subindplanif ON(subindplanif.idindicador = subind.idindicador)
                                INNER JOIN mod_spouam.nom_indicadoruam induam
                                ON(subind.idindicador = induam.idindicador AND induam.idnaturalezauam = 3 )
                                WHERE subind.idindicador =  ind.idindicador),0) as importeagua,

                        /**************************************/
                        COALESCE(
                                (SELECT SUM(subindplanif.precio * (n.cantplanif/n.cantbase))
                                FROM mod_datosmaestros.nom_indicador subind
                                INNER JOIN mod_datosmaestros.nom_indicadorplanif subindplanif ON(subindplanif.idindicador = subind.idindicador)
                                INNER JOIN mod_spouam.nom_indicadoruam induam
                                ON(subind.idindicador = induam.idindicador AND (induam.idnaturalezauam = 11) )
                                WHERE subind.idindicador =  ind.idindicador),0) as importesalario,

                        /**************************************/
                        COALESCE(
                                (SELECT SUM(
                                CASE WHEN indtipdepr.idtipodepreciacion=1 THEN
                                   induam.capacidad * subindplanif.precio * induam.depreciacion /
                                   (365*24)*(SELECT sum(abs(cta.plazo))*24
                                        FROM mod_spouam.dat_cartatecnologicaactividad cta
                                        INNER JOIN  mod_spouam.dat_cartatecnologica ct
                                        ON (cta.idcartatecnologica = ct.idcartatecnologica AND ct.idcartatecnologica={$idcartatecnologica})
                                        GROUP BY ct.idcartatecnologica)
                                ELSE induam.capacidad * subindplanif.precio *
                                   induam.depreciacion /(365*24)*(n.cantplanif/n.cantbase) END)
                                FROM mod_datosmaestros.nom_indicador subind
                                INNER JOIN mod_datosmaestros.nom_indicadorplanif subindplanif ON(subindplanif.idindicador = subind.idindicador)
                                INNER JOIN mod_spouam.nom_indicadoruam induam
                                ON(subind.idindicador = induam.idindicador
                                AND (induam.idnaturalezauam = 2 OR induam.idnaturalezauam = 6) )
                                INNER JOIN mod_spouam.dat_indicadoruamtipodepreciacion indtipdepr
                                ON(induam.idindicador = indtipdepr.idindicador
                                AND (induam.idnaturalezauam = 2 OR induam.idnaturalezauam = 6) )
                                WHERE subind.idindicador =  ind.idindicador),0) as importe_ogd_depreciacion,

                        /**************************************/
                        COALESCE(
                                (SELECT SUM(induam.capacidad * subindplanif.precio * 0.04/(365*24)*(n.cantplanif/n.cantbase))
                                FROM mod_datosmaestros.nom_indicador subind
                                INNER JOIN mod_datosmaestros.nom_indicadorplanif subindplanif ON(subindplanif.idindicador = subind.idindicador)
                                INNER JOIN mod_spouam.nom_indicadoruam induam
                                ON(subind.idindicador = induam.idindicador
                                 AND (induam.idnaturalezauam = 2 OR induam.idnaturalezauam = 6) )
                                WHERE subind.idindicador =  ind.idindicador),0) as importe_ogd_mantenimiento

                        /*****************************************/
                                FROM mod_spouam.dat_cartatecnologica ct
                                INNER JOIN mod_spouam.dat_cartatecnologicaactividad cta
                                ON(cta.idcartatecnologica = ct.idcartatecnologica)
                                INNER JOIN mod_planificacion.nom_actividad a
                                ON(cta.idactividad = a.idactividad AND cta.idcartatecnologica = {$idcartatecnologica})
                                INNER JOIN mod_planificacion.dat_norma n
                                ON(n.idactividad = a.idactividad )
                                INNER JOIN mod_datosmaestros.nom_indicador ind
                                INNER JOIN mod_datosmaestros.nom_indicadorplanif subindplanif ON(subindplanif.idindicador = ind.idindicador)
                                ON(ind.idindicador = n.idindicador )
                                INNER JOIN mod_spouam.nom_indicadoruam induam
                                ON(ind.idindicador = induam.idindicador)
                                WHERE cta.idcartatecnologica ={$idcartatecnologica}) alias
                                GROUP BY alias.idcartatecnologica";
        return $consulta;
    }

    public function obtenerUMedidasRendimientoExistentes() {
        $conn = Doctrine_Manager:: connection();
        $query = "SELECT DISTINCT (ct.idumedidarendimiento || '-' || ct.idvariablecontrol) AS idumedidarendimiento
                          FROM mod_spouam.dat_cartatecnologica ct";
        $res = $conn->execute($query);
        return $res->fetchAll();
    }

    public function aprobacionCT($idcartatecnologica) {
        $query = new Doctrine_Query();
        $idaprob = $query->select('ct.idaprobacion')
                        ->from("DatCartatecnologica ct")
                        ->where('ct.idcartatecnologica= ?', $idcartatecnologica)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $idaprob;
    }

    public function listarEtapas($default = false) {
        $where = "";
        if ($default)
            $where = "AND nom.uridatosnomenclador='-'";
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT nom.denominacion,
                        nom.iddatosnomenclador as idetapa
                 FROM mod_planificacion.nom_datosnomenclador nom
                      INNER JOIN mod_planificacion.nom_tiponomenclador tnm ON (
                        nom.idtiponomenclador = tnm.idtiponomenclador)
                 WHERE tnm.uritiponomenclador = 'Etapas' $where;";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function obtenerFechaInicioFechaFinCT($idcartatecnologica, $fecha = false) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT min(cact.plazo) as fechainicio,
                        max(cact.plazo) as fechafin
                 FROM mod_spouam.dat_aplicacioncartatec act
                      INNER JOIN mod_spouam.dat_cartatecnologica ct 
                      on (act.idcartatecnologica = ct.idcartatecnologica)
                      INNER JOIN mod_spouam.dat_cartatecnologicaactividad cact 
                      ON (cact.idcartatecnologica = ct.idcartatecnologica)
                        WHERE act.idcartatecnologica = {$idcartatecnologica}";
        $plazos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $datos['fechainicio'] = $plazos[0]['fechainicio'];
        $datos['fechafin'] = $plazos[0]['fechafin'];
        if ($fecha != false) {
            list($anno, $mes, $dia) = split("/", $fecha);
            $formatoFecha = $mes . "/" . $dia . "/" . $anno;

            $date = new DateTime($formatoFecha);
            $datos['fechainicio'] = $datos['fechainicio'] * -1;
            $fechainicio = $date->sub(new DateInterval('P' . $datos['fechainicio'] . 'D'));
            $datos['fechainicio'] = $fechainicio->format('Y/m/d');

            $date = new DateTime($formatoFecha);
            $fechafin = $date->add(new DateInterval('P' . $datos['fechafin'] . 'D'));
            $datos['fechafin'] = $fechafin->format('Y/m/d');
        }
        return $datos;
    }

    public function asociarCTEntHija($idactividades, $idespecialidad) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT count(aec.idactividad) AS cant
                FROM mod_planificacion.dat_actespcomportamiento aec
                     INNER JOIN mod_planificacion.nom_datosnomenclador dn ON
                       aec.iddatosnomenclador = dn.iddatosnomenclador
                WHERE (dn.uridatosnomenclador = 'propia' OR
                      dn.uridatosnomenclador = 'compartida') AND
                      aec.idespecialidad = $idespecialidad AND
                      aec.idactividad IN ($idactividades)";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function listarIDActividades($idcarta) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT cact.idactividad
                  FROM mod_spouam.dat_cartatecnologicaactividad cact
                  WHERE (cact.idcartatecnologica = $idcarta)";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function actualizarEnUso($idcartatecnologica_lista) {
        $conn = Doctrine_Manager::connection();
        $query = "UPDATE mod_spouam.dat_cartatecnologica
                    SET enuso = 0";
        $conn->execute($query);

        if ($idcartatecnologica_lista != "") {
            $query = "UPDATE mod_spouam.dat_cartatecnologica
                    SET enuso = 1
                    WHERE idcartatecnologica IN($idcartatecnologica_lista)";
            $conn->execute($query);
        }
        return true;
    }

    public function obtenerActxCarta($params) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT 
                        a.codigo,
                        a.denominacion,  
                        ca.plazo,
                        dn.denominacion as etapa,
                        ca.porciento,
                        COALESCE(sum(ip.precio*n.necesidad),0)  as importe

                       FROM 
                         mod_spouam.dat_cartatecnologica c  
                         INNER JOIN mod_spouam.dat_cartatecnologicaactividad ca
                         ON(c.idcartatecnologica=ca.idcartatecnologica)
                         INNER JOIN mod_planificacion.nom_datosnomenclador dn
                         ON(dn.iddatosnomenclador=ca.idetapa) 
                         INNER JOIN mod_planificacion.nom_actividad a
                         ON(ca.idactividad=a.idactividad)
                         LEFT JOIN mod_planificacion.dat_norma n
                         ON(a.idactividad=n.idactividad and n.idejercicio={$params['idejercicio']})
                         LEFT JOIN mod_datosmaestros.nom_indicadorplanif ip
                         ON(ip.idindicador=n.idindicador and ip.nivelplanif=1 and ip.idaprobacion=4)
                         where c.idcartatecnologica={$params['cartatecnologica']->idcartatecnologica}
                         GROUP BY 
                         ca.idcartatecnologicaactividad,
                         a.denominacion,  
                         a.codigo,
                         ca.plazo,
                         dn.denominacion,
                         ca.porciento
                       ORDER BY ca.plazo, a.codigo, ca.idcartatecnologicaactividad ASC";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function obtenerIndxCarta($params) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT i.codigo,
                        i.denominacion,
                        ip.precio,
                        i.idnaturaleza,
                        i.idumedida,
                        COALESCE(sum(n.necesidad), 0) as cantidad,
                        COALESCE(sum(ip.precio * n.necesidad), 0) as importe
                 FROM mod_spouam.dat_cartatecnologica c
                      INNER JOIN mod_spouam.dat_cartatecnologicaactividad ca 
                      ON (c.idcartatecnologica = ca.idcartatecnologica)
                      INNER JOIN mod_planificacion.nom_actividad a 
                      ON (ca.idactividad = a.idactividad)
                      INNER JOIN mod_planificacion.dat_norma n 
                      ON (a.idactividad = n.idactividad and n.idejercicio = {$params['idejercicio']})
                      INNER JOIN mod_datosmaestros.nom_indicador i 
                      ON (i.idindicador = n.idindicador)
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                      ON (ip.idindicador = i.idindicador and ip.nivelplanif = 1 and ip.idaprobacion = 4)
                 where c.idcartatecnologica = {$params['cartatecnologica']->idcartatecnologica} 
                 GROUP BY i.codigo,
                          i.denominacion,
                          ip.precio,
                          i.idnaturaleza,
                          i.idumedida
                 ORDER BY i.codigo";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarEquiposAsocACarta($params) {
        $idcartatec = $params['idcartatecnologica'];
        $diascarta = ($this->DiasDuracionCarta($idcartatec) != 0) ? $this->DiasDuracionCarta($idcartatec) + 1 : 0;
        $addWhere = "true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere .= " AND upper(ind.codigo) LIKE  " . "'" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'denominacion') {
                    $addWhere .= " AND upper(ind.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos ['field'] == 'gastosmantenimiento') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND (((depanual.depreciacionanual/365) * $diascarta::integer) * 0.25)<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND (((depanual.depreciacionanual/365) * $diascarta::integer) * 0.25)>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND (((depanual.depreciacionanual/365) * $diascarta::integer) * 0.25)={$datos['data']['value']}";
                    }
                } elseif ($datos ['field'] == 'depreciasionperiodo') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND ((depanual.depreciacionanual/365) * $diascarta::integer)<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND ((depanual.depreciacionanual/365) * $diascarta::integer)>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND ((depanual.depreciacionanual/365) * $diascarta::integer)={$datos['data']['value']}";
                    }
                } elseif ($datos ['field'] == 'depreciacionanual') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND depanual.depreciacionanual <{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND depanual.depreciacionanual >{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND depanual.depreciacionanual ={$datos['data']['value']}";
                    }
                }
            }
        }

        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }

        $conn = Doctrine_Manager:: connection();
        $query = "SELECT 
           equic.idequipocarta,
           depr.iddepreciacionequipo,
           round(((depanual.depreciacionanual/365) * $diascarta::integer),6) as depreciasionperiodo,
           round((((depanual.depreciacionanual/365) * $diascarta::integer) * 0.25),6) as gastosmantenimiento,
           depanual.depreciacionanual,    
           ind.codigo,
           ind.denominacion,
           count(*) OVER() as total
        FROM 
           mod_spouam.dat_equipocarta equic
           INNER JOIN mod_spouam.dat_depreciacionequipo depr 
           ON equic.iddepreciacionequipo = depr.iddepreciacionequipo
           INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
           ON indp.idindicador =depr.idindicador
           INNER JOIN mod_datosmaestros.nom_indicador ind
           ON ind.idindicador =depr.idindicador,
           (SELECT 
           d.iddepreciacionequipo,
           round((d.cantidad * i.precio * d.tasadepreciacion),6) as depreciacionanual
            FROM 
           mod_spouam.dat_depreciacionequipo d 
           INNER JOIN mod_datosmaestros.nom_indicadorplanif i 
           ON i.idindicador =d.idindicador) as depanual
           where equic.idcartatecnologica = $idcartatec and depanual.iddepreciacionequipo = depr.iddepreciacionequipo
           and  $addWhere
           ORDER BY ind.codigo $delimitando";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function TotalesDepACarta($params) {
        $idcartatec = $params['idcartatecnologica'];
        $diascarta = ($this->DiasDuracionCarta($idcartatec) != 0) ? $this->DiasDuracionCarta($idcartatec) + 1 : 0;
        $conn = Doctrine_Manager:: connection();
        $query = "Select sum(p.depreciacionanual) as totalda, sum(p.depreciasionperiodo) as totaldp, sum(p.gastosmantenimiento) as totalgm from 
       (SELECT 
           round(((depanual.depreciacionanual/365) * $diascarta::integer),6) as depreciasionperiodo,
           round((((depanual.depreciacionanual/365) * $diascarta::integer) * 0.25),6) as gastosmantenimiento,
           depanual.depreciacionanual 
        FROM 
           mod_spouam.dat_equipocarta equic
           INNER JOIN mod_spouam.dat_depreciacionequipo depr 
           ON equic.iddepreciacionequipo = depr.iddepreciacionequipo
           INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
           ON indp.idindicador =depr.idindicador
           INNER JOIN mod_datosmaestros.nom_indicador ind
           ON ind.idindicador =depr.idindicador,
           (SELECT 
           d.iddepreciacionequipo,
           round((d.cantidad * i.precio * d.tasadepreciacion),6) as depreciacionanual
            FROM 
           mod_spouam.dat_depreciacionequipo d 
           INNER JOIN mod_datosmaestros.nom_indicadorplanif i 
           ON i.idindicador =d.idindicador) as depanual
           where equic.idcartatecnologica = $idcartatec and depanual.iddepreciacionequipo = depr.iddepreciacionequipo) as p";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if ($data[0]['totalda'] == null) {
            $data[0]['totalda'] = 0;
        }
        if ($data[0]['totaldp'] == null) {
            $data[0]['totaldp'] = 0;
        }
        if ($data[0]['totalgm'] == null) {
            $data[0]['totalgm'] = 0;
        }
        return $data;
    }

    public function listarEquipos($params) {
        $idcartatec = $params['idcartatecnologica'];
        $addWhere = "true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere .= " AND upper(ind.codigo) LIKE  " . "'" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'denominacion') {
                    $addWhere .= " AND upper(ind.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos ['field'] == 'cantidad') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND depr.cantidad<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND depr.cantidad>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND depr.cantidad={$datos['data']['value']}";
                    }
                } elseif ($datos ['field'] == 'precio') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND indp.precio<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND indp.precio>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND indp.precio={$datos['data']['value']}";
                    }
                } elseif ($datos ['field'] == 'tasadepreciacion') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND depr.tasadepreciacion<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND depr.tasadepreciacion>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND depr.tasadepreciacion={$datos['data']['value']}";
                    }
                } elseif ($datos ['field'] == 'depreciacionanual') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND round((depr.cantidad * indp.precio * depr.tasadepreciacion),3)<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND round((depr.cantidad * indp.precio * depr.tasadepreciacion),3)>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND round((depr.cantidad * indp.precio * depr.tasadepreciacion),3)={$datos['data']['value']}";
                    }
                }
            }
        }

        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }

        $conn = Doctrine_Manager:: connection();
        $query = "SELECT 
           depr.iddepreciacionequipo,
           depr.cantidad,
           depr.tasadepreciacion,
           ind.codigo,
           ind.denominacion,
           indp.precio,
           round((depr.cantidad * indp.precio * depr.tasadepreciacion),3) as depreciacionanual
        FROM 
	   mod_spouam.dat_depreciacionequipo depr 
           INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
           ON indp.idindicador =depr.idindicador
           INNER JOIN mod_datosmaestros.nom_indicador ind
           ON ind.idindicador =depr.idindicador
	   where depr.iddepreciacionequipo not in
                    (Select iddepreciacionequipo from mod_spouam.dat_equipocarta where idcartatecnologica = $idcartatec)   
           and $addWhere
           ORDER BY ind.codigo $delimitando";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function DiasDuracionCarta($idcartatec) {
        $objActividadesCarta = Doctrine::getTable('DatCartatecnologicaactividad')->findByDql("idcartatecnologica={$idcartatec}");
        $minfecha = null;
        $maxfecha = null;
        $fechaux = '01-07-2018';
        if ($objActividadesCarta != null) {
            foreach ($objActividadesCarta as $key => $value) {
                //aqui calcular las fechas
                if ($value->plazo == 0) {
                    //$objActividadProduccion[0]->fechainicio = $prod->fecha;
                    $nuevafecha = $fechaux;
                } else {
                    $nuevafecha = strtotime('+' . $value->plazo . ' day', strtotime($fechaux));
                    $nuevafecha = date('d-m-Y', $nuevafecha);
                    //$objActividadProduccion[0]->fechainicio = $nuevafecha;
                }
                //var_dump($nuevafecha);die;
                $duracion = ($value->duracion / 8);
                if ($value->duracion % 8 == 0) {
                    $duracion = $duracion - 1;
                } else {
                    $duracion = (int) $duracion;
                }

                $nuevafechafin = strtotime('+' . $duracion . ' day', strtotime($nuevafecha));
                $nuevafechafin = date('d-m-Y', $nuevafechafin);
                //$objActividadProduccion[0]->fechafin = $nuevafechafin;

                if ($key == 0) {
                    $minfecha = $nuevafecha;
                    $maxfecha = $nuevafechafin;
                } else {
                    $string_minfecha = strtotime($minfecha);
                    $string_nuevafecha = strtotime($nuevafecha);
                    if ($string_nuevafecha < $string_minfecha)
                        $minfecha = $nuevafecha;

                    $string_maxfecha = strtotime($maxfecha);
                    $string_nuevafecha = strtotime($nuevafechafin);
                    if ($string_nuevafecha > $string_maxfecha)
                        $maxfecha = $nuevafechafin;
                }
            }
            //Con este pedacito se calcula la cantidad de dias de duracion de una carta tecnologica
            $inicio = strtotime($minfecha);
            $fin = strtotime($maxfecha);
            $dif = $fin - $inicio;
            $diasCartas = (( ( $dif / 60 ) / 60 ) / 24);
            ///////////////////////////////////////////////////////////
            return $diasCartas;
        }else {
            return 0;
        }
    }

    public function getIndicadores($parametros) {
        $condiciones = array();
        if (is_array($parametros->filtros)) {
            foreach ($parametros->filtros as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = " ind.codigo LIKE '{$datos['data']['value']}%'";
                } elseif ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion' || $datos['field'] == 'numeropieza') {
                    $condiciones[] = "upper(ind.{$datos['field']}) LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } elseif ($datos['field'] == 'idumedida') {
                    $condiciones[] = "ind.idumedida = " . $datos['data']['value'] . " ";
                } elseif ($datos['field'] == 'precio' || $datos['field'] == 'precioventa') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $condiciones[] = "indp." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                }
            }
        }//Fin de los filtros

        $conn = Doctrine_Manager::connection();
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT ind.idindicador,
                        ind.codigo,
                        ind.denominacion,
                        ind.descripcion,
                        ind.idumedida,
                        ind.numeropieza,
                        indp.precio,
                        indp.precioventa,
                        count(*) over() as total
                 FROM mod_datosmaestros.nom_indicador ind
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (ind.idindicador =
                        indp.idindicador)
                 WHERE indp.nivelplanif = 1 AND
                       --ind.nivel = 4 AND
                       ind.estado = 1 AND
                       indp.idaprobacion = 4 AND
                       indp.precioventa > 0" . $WHERE . " 
                        LIMIT $parametros->limit OFFSET $parametros->start";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function obtenerCartasxEntidadEnEjercicio($params, $idcartatecnologica) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT 
                         COALESCE(sum(ip.precio*n.necesidad),0) as importecarta
                        FROM 
                          mod_spouam.dat_cartatecnologica c                         
                          LEFT JOIN mod_spouam.dat_cartatecnologicaactividad ca
                          ON(c.idcartatecnologica=ca.idcartatecnologica)
                          LEFT JOIN mod_planificacion.nom_actividad a
                          ON(ca.idactividad=a.idactividad)
                          LEFT JOIN mod_planificacion.dat_norma n
                          ON(a.idactividad=n.idactividad and n.idejercicio={$params['idejercicio']})--aqui el ejercicio actual
                          LEFT JOIN mod_datosmaestros.nom_indicadorplanif ip
                          ON(ip.idindicador=n.idindicador and ip.nivelplanif=1 and ip.idaprobacion=4)
                          where c.idcartatecnologica=$idcartatecnologica";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function buscardenominacion($params) {

        $conn = Doctrine_Manager::connection();
        $query = "SELECT *
                        FROM 
                          mod_spouam.dat_cartatecnologica c                         
                          
                          where c.denominacion LIKE '{$params['denominacion']}'";
        if ($params['accion'] == 'modificar') {
            $query = $query . " AND c.idcartatecnologica <> {$params['idcartatecnologica']}";
        }
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}

//fin clase 
