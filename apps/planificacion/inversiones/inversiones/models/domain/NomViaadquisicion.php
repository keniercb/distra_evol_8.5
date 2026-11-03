<?php

class NomViaadquisicion extends BaseNomViaadquisicion {

    public function setUp() {
        parent::setUp();
        $this->hasMany(
                'DatIndicadorviaadquisicion', array('local' => 'idviaadquisicion', 'foreign' => 'idviaadquisicion')
        );
        $this->hasMany(
                'DatControldivisadocumentoviaadquisicion', array('local' => 'idviaadquisicion', 'foreign' => 'idviaadquisicion')
        );
    }

    public function Obtener_via_adquisicion() {
        $query = Doctrine_Query::create();
        $data->data = $query->select('va.idviaadquisicion, va.denominacion, va.uriviaadquisicion')->from(
                        'NomViaadquisicion va'
                )->orderby('va.denominacion')->execute()->toArray();
        return $data;
    }

    public function Obtener_via_adquisicion_utilizada() {
        $query = Doctrine_Query::create();
        $data->data = $query->select('va.idviaadquisicion, va.denominacion,iva.idindicador')
                        ->from('NomViaadquisicion va')
                        ->innerJoin('va.DatIndicadorviaadquisicion iva')
                        ->execute()->toArray();
        return $data;
    }

    function obtenerPordenom($denominacion) {
        $query = Doctrine_Query::create();
        $query->from('NomViaadquisicion c')
                ->where('lower(c.denominacion) = ?', array(strtolower($denominacion)))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    public function obtenerViaDadoId($idvia) {
        $query = Doctrine_Query::create();
        return $query->select('va.idviaadquisicion, va.denominacion')->from('NomViaadquisicion va')->where(
                        'va.idviaadquisicion = ?', $idvia
                )->execute()->toArray();
    }

    public function listarParaExportar($parametros) {   //***cambio para mod_datosmaestros ***
        print_r($parametros);
        die;
        $conn = Doctrine_Manager::connection();
        $query
                = "SELECT
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
                    dvaos.idorganosatisface,
                    dvaos.cantidad,
                    nos_emp.denominacion as denoempresa,                    
                    (SELECT nos_osde.denominacion FROM mod_datosmaestros.nom_organosatisface nos_osde WHERE nos_osde.nivelarbol = 2 and nos_osde.idarbol = nos_emp.idarbol and (nos_osde.ordenizq < nos_emp.ordenizq and nos_osde.ordender > nos_emp.ordender )  ) as denoosde,
                    (SELECT nos_grupo.denominacion FROM mod_datosmaestros.nom_organosatisface nos_grupo WHERE nos_grupo.nivelarbol = 3 and nos_grupo.idarbol = nos_emp.idarbol and (nos_grupo.ordenizq < nos_emp.ordenizq and nos_grupo.ordender > nos_emp.ordender )  ) as denogrupo
                    
                    FROM
                        mod_planificacion.dat_ajusteexistencia ae
                    INNER JOIN mod_datosmaestros.nom_indicador ind ON (ae.idindicador = ind.idindicador)
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on ind.idindicador = ipnif.idindicador
                    LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicion indva ON (ind.idindicador = indva.idindicador)
                    LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indvaos ON (indva.idindicador = indvaos.idindicador)
                    AND (indva.idviaadquisicion = indvaos.idviaadquisicion)
                    LEFT JOIN mod_datosmaestros.nom_viaadquisicion va ON (indva.idviaadquisicion = va.idviaadquisicion)
                    LEFT JOIN mod_datosmaestros.nom_organosatisface os ON (indvaos.idorganosatisface = os.idorganosatisface)
                    LEFT JOIN mod_planificacion.dat_ajusteexistenciacb aecb ON (ae.idajusteexistencia = aecb.idajusteexistencia)
                    LEFT JOIN mod_datosmaestros.dat_indicadorcentrobalance indcb ON (ind.idindicador = indcb.idindicador)
                    LEFT JOIN mod_planificacion.dat_entidaddatosnomenclador edn ON (indcb.identidaddatosnomenclador = edn.identidaddatosnomenclador)
                    LEFT JOIN mod_planificacion.dat_entidadmodelo em ON (em.identidadmodelo = aecb.identidadmodelo)
                    LEFT JOIN mod_planificacion.dat_desgviaadquisorgsat dvaos ON (dvaos.idindicadorviaadquisicionorganosatisface = indvaos.idindicadorviaadquisicionorganosatisface)
                    LEFT JOIN mod_datosmaestros.nom_organosatisface nos_emp ON (indvaos.idorganosatisface = nos_emp.idorganosatisface)
               WHERE aecb.demanda > 0 and (em.identidad=? AND em.idmodelo=?)";

        $array_parametros = array();
        $array_parametros[] = $parametros['id_entidad'];
        $array_parametros[] = $parametros['id_plan'];

        $res = $conn->execute($query, $array_parametros);
        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public function listarVA($parametros, $start, $limit) {
        $query = new Doctrine_Query ();
        if ($parametros) {

            foreach ($parametros as $p => $s) {
                if ($s != null) {
                    if ($p == 'denominacion') {
                        $query->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'");
                    } else {
                        if ($p == 'descripcion') {
                            $query->addWhere("upper(n.descripcion) LIKE '%" . strtoupper($s) . "%'");
                        }
                    }
                }
            }
        }
        $res = $query->select('n.idviaadquisicion, n.denominacion,n.descripcion,n.color')
                ->from('NomViaadquisicion n')
                ->offset($start)
                ->limit($limit)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $res;
    }

    public function total($parametros) {
        $query = new Doctrine_Query ();
        if ($parametros) {

            foreach ($parametros as $p => $s) {
                if ($s != null) {
                    if ($p == 'denominacion') {
                        $query->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'");
                    } else {
                        if ($p == 'descripcion') {
                            $query->addWhere("upper(n.descripcion) LIKE '%" . strtoupper($s) . "%'");
                        }
                    }
                }
            }
        }
        $query->select('COUNT(n.idviaadquisicion)')
                ->from('NomViaadquisicion n')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();

        $result = $query->count();
        return $result;
    }

    public function ObtenerViaAporId($idvia) {
        $query = new Doctrine_Query ();
        $res = $query->select('n.idviaadquisicion, n.denominacion,n.descripcion,n.color')
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
                        ->where('UPPER(d.denominacion) = ? AND d.idviaadquisicion<>?', array(strtoupper($denominacion), $idvia))
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

}

?>