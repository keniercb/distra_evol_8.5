<?php

class DatRectortiponomesp extends BaseDatRectortiponomesp {

    public function Setup() {
        parent::setUp();
        $this->hasOne(
                'NomTiponomenclador', array('local' => 'idtiponomenclador',
            'foreign' => 'idtiponomenclador')
        );
    }

    public function listarnomesp($idespecialidad) {

        $conn = Doctrine_Manager::connection();
        $query = "SELECT rtne.idtiponomenclador
                    FROM mod_planificacion.dat_rectortiponomesp rtne
		    WHERE rtne.idespecialidad=$idespecialidad";
        $nomasocesp = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $nomasocesp;
    }

    public function getAsociados($idespecialidad, $parametros, $start = null, $limit = null) {
        $conn = Doctrine_Manager::connection();
        $query = new Doctrine_Query();
        $idpadre = $parametros['idreal'];
        $devolverPadre = (!$idpadre ? "null as _parent" : $idpadre . " as _parent");
        $addwhere = "";
        $ADDWHERE = "";
        $paramsquery = array();

        if ($parametros['tipo'] == 0) {
            if ($parametros['denominacion'] != null) {
                self::addWhereConParams(
                        $addwhere, "upper(tn.denominacion)  LIKE", ("'%" . strtoupper($parametros['denominacion']) . "%'")
                );
            }
            if ($parametros['descripcion'] != null) {
                self::addWhereConParams(
                        $addwhere, "upper(tn.descripcion)  LIKE", ("'%" . strtoupper($parametros['descripcion']) . "%'")
                );
            }
            $query = "SELECT rtne.idtiponomenclador, tn.idtiponomenclador as id,
                    d.iddatosnomenclador AS iddatonomenclador,
                    tn.idtiponomenclador as idreal,1 AS tipo,tn.denominacion,
                    tn.descripcion, tn.color,null as _parent, false as _is_leaf
                    FROM mod_planificacion.dat_rectortiponomesp rtne
                    INNER JOIN mod_planificacion.nom_tiponomenclador tn ON
                    (rtne.idtiponomenclador = tn.idtiponomenclador)
                    LEFT JOIN mod_planificacion.nom_datosnomenclador d
                    ON (tn.idtiponomenclador = d.idtiponomenclador)
		    WHERE rtne.idespecialidad=$idespecialidad
                    $addwhere
                    $ADDWHERE
                    ";
            $nomCN = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
            return $nomCN;
        } else {
            if ($parametros['denominacion'] != null) {
                self::addWhereConParams(
                        $addwhere, "upper(n.denominacion)  LIKE", ("'%" . strtoupper($parametros['denominacion']) . "%'")
                );
            }
            if ($parametros['descripcion'] != null) {
                self::addWhereConParams(
                        $addwhere, "upper(n.descripcion)  LIKE", ("'%" . strtoupper($parametros['descripcion']) . "%'")
                );
            }
            if ($parametros['tipo'] == 1) {
                $result = $query->select(
                                        "n.iddatosnomenclador as id,n.iddatosnomenclador as idreal, n.denominacion , n.descripcion,"
                                        . $devolverPadre
                                        . ",false as _is_leaf,2 AS tipo,n.cantdescendente"
                                )->from("NomDatosnomenclador n")->offset($start)->limit($limit)
                                ->orderby("n.denominacion, n.descripcion")
                                ->addwhere(
                                        ' n.idtiponomenclador =? AND n.cantascendente = 0', $idpadre
                                )->orderby("n.denominacion")->execute()->toArray();
                return $result;
            } else {
                $result = $query->select(
                                        "n.iddatosnomenclador as id,n.iddatosnomenclador as idreal,
                     n.denominacion,n.cantascendente as hijos, n.descripcion, "
                                        . $devolverPadre . ",false as _is_leaf,3 AS tipo,n.cantdescendente"
                                )->from("NomDatosnomenclador n")
                                ->innerJoin("n.DatDatosnomencladordatosnomenclador dn")
                                ->offset($start)->limit($limit)->orderby("n.denominacion")
                                ->addwhere('dn.iddatosnomencladorpadre=?', $idpadre)
                                ->execute()->toArray();
                return $result;
            }
        }
    }

    public function noAsociados() {
        $query = new Doctrine_Query();
        $result = $query->select(
                        "n.idtiponomenclador"
                )->from("DatRectortiponomesp n")->execute()->toArray();
        return $result;
    }

    private function addWhereConParams(&$where, $columcond, $param) {
        $where .= " AND " . $columcond . $param;
    }

    private function addConParams(&$where, $columcond, $param) {
        $where .= " WHERE " . $columcond . $param;
    }

    public function gettodosAsociados($parametros) {
        $conn = Doctrine_Manager::connection();
        $querya = new Doctrine_Query();
        $idpadre = $parametros['idreal'];
        $devolverPadre = (!$idpadre ? "null as _parent" : $idpadre . " as _parent");
        $addwhere = "";
        $ADDWHERE = "";
        $querycc = Doctrine_Query::create();
        $paramsquery = array();

        if ($parametros['tipo'] == 0) {
            if ($parametros['denominacion'] != null) {
                self::addConParams(
                        $addwhere, "upper(tn.denominacion)  LIKE", ("'%" . strtoupper($parametros['denominacion']) . "%'")
                );
            }
            if ($parametros['descripcion'] != null) {
                self::addConParams(
                        $addwhere, "upper(tn.descripcion)  LIKE", ("'%" . strtoupper($parametros['descripcion']) . "%'")
                );
            }

            $querya = "SELECT DISTINCT ON(rtne.idtiponomenclador )rtne.idtiponomenclador,
                tn.idtiponomenclador as id,d.iddatosnomenclador AS iddatonomenclador,
                    tn.idtiponomenclador as idreal,1 AS tipo,tn.denominacion,
                    tn.descripcion,tn.color,null as _parent,false as _is_leaf
                    FROM mod_planificacion.dat_rectortiponomesp rtne
                    INNER JOIN mod_planificacion.nom_tiponomenclador tn
                    ON (rtne.idtiponomenclador = tn.idtiponomenclador)
                    LEFT JOIN mod_planificacion.nom_datosnomenclador d 
                    ON (tn.idtiponomenclador = d.idtiponomenclador)
                    $addwhere $ADDWHERE";
            $nomCN = $conn->execute($querya)->fetchAll(PDO::FETCH_ASSOC);

            return $nomCN;
        } else {
            if ($parametros['denominacion'] != null) {
                self::addWhereConParams(
                        $addwhere, "upper(n.denominacion)  LIKE", ("'%" . strtoupper($parametros['denominacion']) . "%'")
                );
            }
            if ($parametros['descripcion'] != null) {
                self::addWhereConParams(
                        $addwhere, "upper(n.descripcion)  LIKE", ("'%" . strtoupper($parametros['descripcion']) . "%'")
                );
            }
            if ($parametros['tipo'] == 1) {

                $result = $querycc->select(
                                        "n.iddatosnomenclador as id,n.iddatosnomenclador as idreal, n.denominacion , n.descripcion,"
                                        . $devolverPadre
                                        . ",false as _is_leaf,2 AS tipo,n.cantdescendente"
                                )->from("NomDatosnomenclador n")->orderby("n.denominacion, n.descripcion")
                                ->addwhere(
                                        ' n.idtiponomenclador =? AND n.cantascendente = 0', $idpadre
                                )->orderby("n.denominacion")->execute()->toArray();
                return $result;
            } else {
                $result = $querycc->select(
                                        "n.iddatosnomenclador as id,
                        n.iddatosnomenclador as idreal,
                        n.denominacion,
                        n.cantascendente as hijos,
                        n.descripcion, "
                                        . $devolverPadre
                                        . ",false as _is_leaf,3 AS tipo,n.cantdescendente"
                                )->from("NomDatosnomenclador n")
                                ->innerJoin("n.DatDatosnomencladordatosnomenclador dn")
                                ->orderby("n.denominacion")
                                ->addwhere('dn.iddatosnomencladorpadre=?', $idpadre)
                                ->execute()->toArray();
                return $result;
            }
        }
    }

    public function getAsociadosEliminar($idespecialidad, $idtiponomenclador) {
        $query = new Doctrine_Query();
        $result = $query->select("c.idrectortiponomesp ")
                ->from("DatRectortiponomesp c")
                ->where(
                        "c.idespecialidad = " . $idespecialidad
                        . " AND c.idtiponomenclador = " . $idtiponomenclador
                )
                ->execute();
        return $result;
    }

    public function getAsociadosEliminarAssC($idespecialidad, $idtiponomenclador
    ) {
        $query = new Doctrine_Query();
        $result = $query->select("c.idrectortiponomesp ")
                        ->from("DatRectortiponomesp c")
                        ->where(
                                "c.idespecialidad = " . $idespecialidad
                                . " AND c.idtiponomenclador = " . $idtiponomenclador
                        )->execute()->toArray();
        return $result;
    }

    public function getEliminar($idtiponomenclador) {
        $query = new Doctrine_Query();
        $result = $query->from("DatRectortiponomesp c")
                ->where("c.idtiponomenclador = " . $idtiponomenclador)
                ->execute();
        return $result;
    }

    public function esrectorniveles($idespecialidad, $idnomenclador) {
        $rectores = self::getAsociadosEliminarAssC(
                        $idespecialidad, $idnomenclador
        );
        if ($rectores[0] != "") {
            return 1;
        } else {
            return 0;
        }
    }

    public function listarNomCalculoNiveles($parametros) {

        $conn = Doctrine_Manager::connection();
        $idpadre = $parametros['idreal'];

        $devolverPadre = (!$idpadre ? "null as _parent" : $idpadre . " as _parent");
        $addwhere = "";
        $ADDWHERE = "";
        $paramsquery = array();

        if ($parametros['tipo'] == 0) {
            if ($parametros['denominacion'] != null) {
                self::addWhereConParams(
                        $addwhere, "upper(tn.denominacion)  LIKE", ("'%" . strtoupper($parametros['denominacion']) . "%'")
                );
            }
            if ($parametros['descripcion'] != null) {
                self::addWhereConParams(
                        $addwhere, "upper(tn.descripcion)  LIKE", ("'%" . strtoupper($parametros['descripcion']) . "%'")
                );
            }

            $query = "SELECT  DISTINCT ON(tn.idtiponomenclador ) 
                    tn.idtiponomenclador as id,d.iddatosnomenclador AS iddatonomenclador,
            tn.idtiponomenclador as idreal,1 AS tipo,tn.denominacion,
            tn.descripcion, tn.color,null as _parent, false as _is_leaf
            FROM mod_planificacion.nom_tiponomenclador tn
            LEFT JOIN mod_planificacion.nom_datosnomenclador d 
            ON (tn.idtiponomenclador = d.idtiponomenclador)
            INNER JOIN mod_planificacion.dat_tipocomponentetiponomenclador tctn 
            ON (tctn.idtiponomenclador = tn.idtiponomenclador)
            INNER JOIN mod_planificacion.nom_tipocomponente tc 
            ON (tc.idtipocomponente = tctn.idtipocomponente)
            WHERE tc.denominacion='NIVELES'
            and tn.idtiponomenclador NOT IN (SELECT rtne.idtiponomenclador
            FROM mod_planificacion.dat_rectortiponomesp rtne) $addwhere $ADDWHERE";
            $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        } else {
            if ($parametros['denominacion'] != null) {
                self::addWhereConParams(
                        $addwhere, "upper(n.denominacion)  LIKE", ("'%" . strtoupper($parametros['denominacion']) . "%'")
                );
            }
            if ($parametros['descripcion'] != null) {
                self::addWhereConParams(
                        $addwhere, "upper(n.descripcion)  LIKE", ("'%" . strtoupper($parametros['descripcion']) . "%'")
                );
            }

            if ($parametros['tipo'] == 1) {

                $query = "SELECT n.iddatosnomenclador as id,
                        n.iddatosnomenclador as idreal, 
                        n.denominacion , n.descripcion,"
                        . $devolverPadre . ",false as _is_leaf,2 AS tipo,n.cantdescendente
                            FROM mod_planificacion.nom_datosnomenclador n
                            WHERE n.cantascendente = 0 AND n.idtiponomenclador="
                        . $idpadre . " $addwhere $ADDWHERE ORDER BY n.denominacion";

                $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $query = "SELECT n.iddatosnomenclador as id,n.iddatosnomenclador as idreal, 
                        n.denominacion,n.cantascendente as hijos, n.descripcion, "
                        . $devolverPadre . ",false as _is_leaf,3 AS tipo,n.cantdescendente
                            FROM mod_planificacion.nom_datosnomenclador n
                            INNER JOIN mod_planificacion.dat_datosnomencladordatosnomenclador dn 
                            ON (n.iddatosnomenclador = dn.iddatosnomencladorpadre)
                            WHERE n.cantascendente = 0 AND n.idtiponomenclador="
                        . $idpadre . " $addwhere $ADDWHERE ORDER BY n.denominacion";

                $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
            }
        }

        return $result;
    }

}
