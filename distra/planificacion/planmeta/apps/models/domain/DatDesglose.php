<?php

class DatDesglose extends BaseDatDesglose {

    public function setUp() {
        parent::setUp();
        $this->hasMany(
                'DatDesglosetiponomenclador', array('local' => 'iddesglose', 'foreign' => 'iddesglose')
        );
        $this->hasMany(
                'DatTipomodelodesglose', array('local' => 'iddesglose', 'foreign' => 'iddesglose')
        );
    }

    public function listar($params, $parametros) {
        $query = new Doctrine_Query();
        $query->select('d.* , tmd.iddesglose as asociado')
                ->from("DatDesglose d")
                ->leftjoin('d.DatTipomodelodesglose tmd')
                ->offset($params['start']);

        $queryTotal = new Doctrine_Query();
        $queryTotal->select('COUNT(d.iddesglose) as total')
                ->from("DatDesglose d")
                ->leftjoin('d.DatTipomodelodesglose tmd');

        if ($parametros != null || $parametros != '') {
            foreach ($parametros as $p => $s) {
                if ($s != null) {
                    if ($p == 'denominacion') {
                        $query->addWhere(
                                "upper(d.denominacion) LIKE '%" . strtoupper($s) . "%'");
                        $queryTotal->addWhere("upper(d.denominacion) LIKE '%" . strtoupper($s) . "%'");
                    }
                    if ($p == 'descripcion') {
                        $query->addWhere(
                                "upper(d.descripcion) LIKE '%" . strtoupper($s) . "%'");
                        $queryTotal->addWhere(
                                "upper(d.descripcion) LIKE '%" . strtoupper($s) . "%'");
                    } if ($p == 'asociado') {
                        if ($s == 1) {
                            $query->addWhere("tmd.iddesglose is not null");
                            $queryTotal->addWhere("tmd.iddesglose is not null");
                        } else {
                            $query->addWhere("tmd.iddesglose is null");
                            $queryTotal->addWhere("tmd.iddesglose is null");
                        }
                    }
                }
            }
        }
        $data->data = $query->limit($params['limit'])->orderby("d.denominacion")
                        ->execute()->toArray(true);

        $data->total = $queryTotal->execute()->getFirst()->total;
        return $data;
    }

    public function getAsociado($idmodelo) {
        $sqlQuery = "SELECT d.iddesglose
FROM mod_planificacion.dat_tipomodelodesglose d
     INNER JOIN mod_planificacion.nom_tipomodelo tm ON d.idtipomodelo =
       tm.idtipomodelo
     INNER JOIN mod_planificacion.dat_modelo m ON m.idtipomodelo =
       tm.idtipomodelo
WHERE m.idmodelo = $idmodelo";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function getDatDesglosetiponomenclador($iddesglose, $orden) {
        $query = new Doctrine_Query();
        return $query
                        ->from('DatDesglosetiponomenclador dtn')
                        ->addWhere('dtn.iddesglose = ?', $iddesglose)
                        ->addWhere('dtn.orden = ?', $orden)->execute()->getFirst();
    }

    public function getTodosDatDesglosetiponomenclador($iddesglose) {
        $query = new Doctrine_Query();
        return $query
                        ->from('DatDesglosetiponomenclador dtn')
                        ->addWhere('dtn.iddesglose = ?', $iddesglose)->execute()->toArray();
    }

    public function cambiarActual() {
        $query = Doctrine_Query::create();
        $query->update('DatDesglose ep')->set('ep.actual', 0)->where('ep.actual=1');
        $result = $query->execute();
        return $result;
    }

    public function datosXIdDesglose($iddesglose) {
        $query = Doctrine_Query::create();
        $query->select(
                        'dp.idtiponomenclador, dp.iddesglosetiponomenclador , 
                ntn.denominacion as denominacion,
                ntn.uritiponomenclador as uritiponomenclador'
                )->from('DatDesglosetiponomenclador dp')
                ->innerJoin('dp.NomTiponomenclador ntn')
                ->where('dp.iddesglose=?', $iddesglose);
        $result = $query->execute()->toArray();
        return $result;
    }

    public function columnasDesglose($idtipomodelo) {
        $sqlQuery = "SELECT dp.idtiponomenclador,
       dp.iddesglosetiponomenclador,
       ntn.denominacion as denominacion,
       ntn.uritiponomenclador as uritiponomenclador
FROM mod_planificacion.dat_desglosetiponomenclador dp
     INNER JOIN mod_planificacion.nom_tiponomenclador ntn ON
       dp.idtiponomenclador = ntn.idtiponomenclador
     INNER JOIN mod_planificacion.dat_desglose d ON dp.iddesglose = d.iddesglose
     INNER JOIN mod_planificacion.dat_tipomodelodesglose tmd ON d.iddesglose =
       tmd.iddesglose AND tmd.idtipomodelo = $idtipomodelo";
      //  print_r($sqlQuery);DIE;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function datosXIdTiponomenclador($idtiponomenclador, $uri = 'no') {
        $query = Doctrine_Query::create();
        $query->select(
                        'ndn.iddatosnomenclador as iddatosnomenclador, ndn.denominacion as denominacion'
                )->from('NomDatosnomenclador ndn')
                ->where('ndn.idtiponomenclador=?', $idtiponomenclador);
        if (strtolower($uri) != 'mes')
            $query->orderBy("upper(ndn.denominacion)");
        else
            $query->orderBy("ndn.iddatosnomenclador");
        $result = $query->execute()->toArray();
        return $result;
    }

    public function datosXTiponomenclador($idtiponomenclador) {       
        $sqlQuery = " SELECT dn.iddatosnomenclador,
                            dn.denominacion
                     FROM mod_planificacion.nom_datosnomenclador dn
                     WHERE dn.idtiponomenclador = $idtiponomenclador
                     ORDER BY dn.orden";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
