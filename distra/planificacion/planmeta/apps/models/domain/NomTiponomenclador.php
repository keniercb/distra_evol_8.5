<?php

class NomTiponomenclador extends BaseNomTiponomenclador {

    public function setUp() {
        parent::setUp();
        $this->hasMany('NomDatosnomenclador', array('local' => 'idtiponomenclador', 'foreign' => 'idtiponomenclador'));
        $this->hasMany('NomTipomodelocolumna', array('local' => 'idtiponomenclador', 'foreign' => 'idtiponomenclador'));

        //ver si estas tablas se mantienen o no
        $this->hasMany('DatTipocomponentetiponomenclador', array('local' => 'idtiponomenclador', 'foreign' => 'idtiponomenclador'));
        $this->hasMany('DatDesglosetiponomenclador', array('local' => 'idtiponomenclador', 'foreign' => 'idtiponomenclador'));
        $this->hasMany('DatConftiponomesp', array('local' => 'idtiponomenclador', 'foreign' => 'idtiponomenclador'));
    }

    public function listarTiponomenclador($params) {
        if ($params['permisoConfigSistema'] == 'true')
            $listarConSistema = "";
        else
            $listarConSistema = "AND configsistema=0";

        if ($params['criteriobusqueda'] == undefined || !$params['criteriobusqueda'])
            $addWhereDenom = "";
        else
            $addWhereDenom = " AND upper(denominacion) LIKE  " . "'%" . mb_convert_case($params['criteriobusqueda'], MB_CASE_UPPER, 'UTF-8') . "%'";
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT idtiponomenclador,
                        idtiponomenclador as id,
                        denominacion,
                        denominacion as text,
                        descripcion,
                        uritiponomenclador,
                        configsistema,
                        true as leaf
                 FROM mod_planificacion.nom_tiponomenclador
                 WHERE TRUE
                 $listarConSistema $addWhereDenom
                 ORDER BY denominacion";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    function crearUriTipoNomenclador($idtiponomenclador) {
        $paramsQuery = array($idtiponomenclador);
        $query = "select * from mod_planificacion.f_generaruritiponomencladorxid(?)";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($query, $paramsQuery);
        $result->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listarNomencladoresTM($idtipomodelo) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT tn.idtiponomenclador,
                                tn.denominacion
                FROM mod_planificacion.nom_tiponomenclador tn
                LEFT JOIN mod_planificacion.nom_tipomodelocolumna tmc
                ON (tn.idtiponomenclador = tmc.idtiponomenclador AND tmc.idtipomodelo = $idtipomodelo)
                WHERE tmc.idtiponomenclador is NULL order by tn.denominacion";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function buscarpordenom($denom) {
        $query = new Doctrine_Query();
        return $query->select('n.idtiponomenclador')
                        ->from('Nomtiponomenclador n')
                        ->addWhere("lower(n.denominacion) LIKE '" . strtolower($denom) . "'")
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public function getTipoNomenclador($idtiponomenclador) {
        return Doctrine:: getTable('NomTiponomenclador')->find($idtiponomenclador);
    }

    public function obtenerDatosNomenclador($uritiponomenclador) {
        $query = new Doctrine_Query();
        return $query->select('n.idtiponomenclador')
                        ->from('Nomtiponomenclador n')
                        ->innerJoin('n.NomDatosnomenclador d')
                        ->addWhere("lower(n.uritiponomenclador) LIKE '" . strtolower($uritiponomenclador) . "'")
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public function obtenerUriTipoNom($idtiponomenclador) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT tn.uritiponomenclador
                FROM  mod_planificacion.nom_tiponomenclador tn
                WHERE tn.idtiponomenclador = $idtiponomenclador";
        return $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listarTiponomencladorSCP($uriMes, $uriTrimestre) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT idtiponomenclador,
                        denominacion,
                        idtiponomenclador as idperiodo,
                        denominacion as periodo
                 FROM mod_planificacion.nom_tiponomenclador
                 WHERE lower(uritiponomenclador)='" . strtolower($uriMes) . "'
                 OR    lower(uritiponomenclador)='" . strtolower($uriTrimestre) . "'
                ";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

}
