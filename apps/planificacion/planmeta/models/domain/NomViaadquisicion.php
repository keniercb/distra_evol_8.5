<?php

class NomViaadquisicion extends BaseNomViaadquisicion {

    public function setUp() {
        parent::setUp();
        $this->hasMany(
                'DatIndicadorviaadquisicion', array('local' => 'idviaadquisicion',
            'foreign' => 'idviaadquisicion')
        );
        $this->hasMany(
                'DatControldivisadocumentoviaadquisicion', array('local' => 'idviaadquisicion',
            'foreign' => 'idviaadquisicion')
        );
    }

    //Utilizado como servicio
    public function Obtener_via_adquisicion($limit = false) {
        $query = Doctrine_Query::create();
        $query->select(
                'va.idviaadquisicion, va.denominacion, va.uriviaadquisicion'
        )->from(
                'NomViaadquisicion va'
        );
        if ($limit) {
            $query->limit($limit);
        }
        $data->data = $query->orderby('va.denominacion')->execute()->toArray();
        return $data;
    }

    public function Obtener_via_adquisicion_utilizada() {
        $query = Doctrine_Query::create();
        $data->data = $query->select(
                                'va.idviaadquisicion, va.denominacion,iva.idindicador'
                        )
                        ->from('NomViaadquisicion va')
                        ->innerJoin('va.DatIndicadorviaadquisicion iva')
                        ->execute()->toArray();
        return $data;
    }

    function obtenerPordenom($denominacion) {
        $query = Doctrine_Query::create();
        $query->from('NomViaadquisicion c')
                ->where(
                        'lower(c.denominacion) = ?', array(strtolower($denominacion))
                )
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    //Utilizado como servicio
    public function obtenerViaDadoId($idvia) {
        $query = Doctrine_Query::create();
        return $query->select('va.idviaadquisicion, va.denominacion')->from(
                        'NomViaadquisicion va'
                )->where(
                        'va.idviaadquisicion = ?', $idvia
                )->execute()->toArray();
    }

    public function listarParaExportar($parametros) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT
                    ind.codigo,
                    ind.numeropieza,
                    ind.denominacion,
                    ind.idumedida,
                    ipnif.precio,
                    edn.identidad AS centrobalance,
                    aecb.demanda,
                    aecb.idaprobacion,
                    (aecb.demanda * ipnif.precio) AS importe,
                    va.denominacion AS via,
                    os.denominacion AS denoorganosatisface,
                    dvaos.cantidad
                    
                    FROM
                        mod_planificacion.dat_ajusteexistencia ae
                    INNER JOIN mod_datosmaestros.nom_indicador ind
                    ON (ae.idindicador = ind.idindicador)
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif
                    on ind.idindicador = ipnif.idindicador
                    LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicion indva
                    ON (ind.idindicador = indva.idindicador)
                    LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indvaos
                    ON (indva.idindicador = indvaos.idindicador)
                    AND (indva.idviaadquisicion = indvaos.idviaadquisicion)
                    LEFT JOIN mod_datosmaestros.nom_viaadquisicion va
                    ON (indva.idviaadquisicion = va.idviaadquisicion)
                    LEFT JOIN mod_datosmaestros.nom_organosatisface os
                    ON (indvaos.idorganosatisface = os.idorganosatisface)
                    LEFT JOIN mod_planificacion.dat_ajusteexistenciacb aecb
                    ON (ae.idajusteexistencia = aecb.idajusteexistencia)
                    LEFT JOIN mod_datosmaestros.dat_indicadorcentrobalance indcb
                    ON (ind.idindicador = indcb.idindicador)
                    LEFT JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                    ON (indcb.identidaddatosnomenclador = edn.idedat_entidaddatosnomencladorntidaddatosnomenclador)
                    LEFT JOIN mod_planificacion.dat_entidadmodelo em
                     ON (em.identidadmodelo = aecb.identidadmodelo)
                    LEFT JOIN mod_planificacion.dat_desgviaadquisorgsat dvaos
                    ON (dvaos.idindicadorviaadquisicionorganosatisface =
                    indvaos.idindicadorviaadquisicionorganosatisface)                   
               WHERE aecb.demanda > 0 and (em.identidad=? AND em.idmodelo=?)";

        $arrayParametros = array();
        $arrayParametros[] = $parametros['id_entidad'];
        $arrayParametros[] = $parametros['id_plan'];

        $res = $conn->execute($query, $arrayParametros);
        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public function listarVA($parametros, $start, $limit) {
        $query = new Doctrine_Query();
        if ($parametros) {

            foreach ($parametros as $p => $s) {
                if ($s != null) {
                    if ($p == 'denominacion') {
                        $query->addWhere(
                                "upper(n.denominacion) LIKE '%" . strtoupper($s)
                                . "%'"
                        );
                    } else {
                        if ($p == 'descripcion') {
                            $query->addWhere(
                                    "upper(n.descripcion) LIKE '%" . strtoupper($s)
                                    . "%'"
                            );
                        }
                    }
                }
            }
        }
        $res = $query->select(
                        'n.idviaadquisicion,n.denominacion,n.descripcion,n.color,n.uriviaadquisicion'
                )
                ->from('NomViaadquisicion n')
                ->where("n.uriviaadquisicion='sustitucionimportaciones'
            OR n.uriviaadquisicion='importaciondirecta' OR n.uriviaadquisicion='concentraciondecompras'")
                ->offset($start)
                ->limit($limit)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $res;
    }

    public function listarContingencia($idejercicio) {
        $connAux = Doctrine_Manager:: connection();
        $consulta = "SELECT  v.denominacion as denominacion,v.idviaadquisicion,v.uriviaadquisicion,
                   COALESCE( con.porciento,0) as porciento
                   FROM  mod_datosmaestros.nom_viaadquisicion v
                   LEFT JOIN mod_planificacion.conf_contingenciaviasadq con
                   ON (v.idviaadquisicion = con.idviaadquisicion and con.idejercicio= " . $idejercicio . ")
                   where (v.uriviaadquisicion <> 'balancecentral' and v.uriviaadquisicion <> 'oace')
                   ";
        $consultasegunda = "SELECT  m.denominacion as denominacion,m.idmodelo,COALESCE( con.porciento,0) as porciento
                    FROM mod_planificacion.dat_modelo m
                    LEFT JOIN mod_planificacion.conf_contingenciaviasadq con
                    ON (m.idmodelo = con.idmodelo and con.idejercicio=" . $idejercicio . ")
                    WHERE m.denominacion = 'Operaciones no comerciales' ";

        $res = $connAux->execute($consulta);
        $ressegunda = $connAux->execute($consultasegunda);
        $result = $res->fetchAll();
        $resultsegunda = $ressegunda->fetchAll();
        if ($resultsegunda != null && $resultsegunda != '') {
            foreach ($resultsegunda as $data) {
                array_push($result, $data);
            }
        }
        return $result;
    }

    public function guardarviaparacontingencia($idejercicio, $idvia, $porciento) {

        $connAux = Doctrine_Manager:: connection();
        $consulta = "INSERT INTO mod_planificacion.conf_contingenciaviasadq
                (idviaadquisicion,idejercicio, porciento)
               VALUES (" . $idvia . "," . $idejercicio . "," . $porciento . ")";
        $res = $connAux->execute($consulta);
        $result = $res->fetchAll();
    }

    public function actualizate($id, $porciento) {
        $connAux = Doctrine_Manager:: connection();
        $consulta = "UPDATE mod_planificacion.conf_contingenciaviasadq
SET porciento = " . $porciento . " WHERE idcontingenciaviasadq = " . $id . "
";
        $res = $connAux->execute($consulta);
        $respuesta = $res->fetchAll();
        return $respuesta;
    }

    public function verificarplanyviaparacontingencia($plan, $id, $ejercicio) {
        $connAux = Doctrine_Manager:: connection();
        $cadenawhere = '';
        if ($plan) {
            $cadenawhere = " WHERE a.idmodelo=" . $id . " AND a.idejercicio=" . $ejercicio . "";
        } else {
            $cadenawhere = " WHERE a.idviaadquisicion=" . $id . " AND a.idejercicio=" . $ejercicio . "";
        }
        $consulta = "SELECT a.idcontingenciaviasadq as idcont
                   FROM  mod_planificacion.conf_contingenciaviasadq a " . $cadenawhere . " ";
        $res = $connAux->execute($consulta);
        $respuesta = $res->fetchAll();
        return $respuesta[0]['idcont'];
    }

    public function guardarplanparacontingencia($idejercicio, $idmodelo, $porciento) {

        $connAux = Doctrine_Manager:: connection();
        $consulta = "INSERT INTO mod_planificacion.conf_contingenciaviasadq
                (idmodelo,idejercicio, porciento)
                   VALUES (" . $idmodelo . "," . $idejercicio . "," . $porciento . ")";
        $res = $connAux->execute($consulta);
        $res->fetchAll();
    }

    public function total($parametros) {
        $query = new Doctrine_Query();
        if ($parametros) {

            foreach ($parametros as $p => $s) {
                if ($s != null) {
                    if ($p == 'denominacion') {
                        $query->addWhere(
                                "upper(n.denominacion) LIKE '%" . strtoupper($s)
                                . "%'"
                        );
                    } else {
                        if ($p == 'descripcion') {
                            $query->addWhere(
                                    "upper(n.descripcion) LIKE '%" . strtoupper($s)
                                    . "%'"
                            );
                        }
                    }
                }
            }
        }
        $query->select('COUNT(n.idviaadquisicion)')
                ->from('NomViaadquisicion n')
                ->where("n.uriviaadquisicion='sustitucionimportaciones'
            OR n.uriviaadquisicion='importaciondirecta' OR n.uriviaadquisicion='concentraciondecompras'")
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();

        $result = $query->count();
        return $result;
    }

    public function ObtenerViaAporId($idvia) {
        $query = new Doctrine_Query();
        $res = $query->select(
                        'n.idviaadquisicion, n.denominacion,n.descripcion,n.color'
                )
                ->from('NomViaadquisicion n')
                ->where('n.idviaadquisicion=?', $idvia)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $res;
    }

    public function existeDenominacionModificar($denominacion, $idvia) {
        $query = new Doctrine_Query();
        return $query->select('d.denominacion,d.idviaadquisicion')
                        ->from('NomViaadquisicion d')
                        ->where(
                                'UPPER(d.denominacion) = ? AND d.idviaadquisicion<>?', array(strtoupper($denominacion), $idvia)
                        )
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

}
