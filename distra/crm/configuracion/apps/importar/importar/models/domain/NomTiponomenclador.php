<?php

class NomTiponomenclador extends BaseNomTiponomenclador {

    public function setUp() {
        parent::setUp();
        $this->hasMany(
                'DatTipocomponentetiponomenclador', array('local' => 'idtiponomenclador',
            'foreign' => 'idtiponomenclador')
        );
        $this->hasMany(
                'NomDatosnomenclador', array('local' => 'idtiponomenclador',
            'foreign' => 'idtiponomenclador')
        );
        $this->hasMany(
                'DatDesglosetiponomenclador', array('local' => 'idtiponomenclador',
            'foreign' => 'idtiponomenclador')
        );
        $this->hasMany(
                'DatConftiponomesp', array('local' => 'idtiponomenclador',
            'foreign' => 'idtiponomenclador')
        );
        $this->hasMany(
                'NomTipomodelocolumna', array('local' => 'idtiponomenclador',
            'foreign' => 'idtiponomenclador')
        );
    }

    public function listarGrupos() {
        $query = new Doctrine_Query();
        if (isset($start)) {
            $query->offset($start);
        }
        if (isset($limit)) {
            $query->limit($limit);
        }
        $result = $query->select(
                        "n.denominacion, n.descripcion,n.idtiponomenclador"
                )
                ->from("NomTiponomenclador n")
                ->orderby("n.denominacion")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function getIdTipoDadoDenomTipo($tc) {
        return NomTiponomenclador::getIdTipoDadoDenomTipo($tc);
    }

    public function listar($parametros, $start, $limit, $listarAsoc, $idgrupo, $idespecialidad, $idtipoalistar
    ) {
        $query = new Doctrine_Query();
        $queryc = new Doctrine_Query();
        $idpadre = $parametros['idreal'];
        $devolverPadre = (!$idpadre ? "null as _parent" : $idpadre . " as _parent");
        //Condiciones que garantizan el filtrado de los tipo de nomencladores
        if ($parametros['tipo'] == 0) {

            if ($parametros['denominacion'] != null) {
                $query->addWhere(
                        "upper(n.denominacion) LIKE '%" . strtoupper(
                                $parametros['denominacion']
                        ) . "%'"
                );
                $queryc->addWhere(
                        "upper(n.denominacion) LIKE '%" . strtoupper(
                                $parametros['denominacion']
                        ) . "%'"
                );
            }
            if ($parametros['descripcion'] != null) {
                $query->addWhere(
                        "upper(n.descripcion) LIKE '%" . strtoupper(
                                $parametros['descripcion']
                        ) . "%'"
                );
                $queryc->addWhere(
                        "upper(n.descripcion) LIKE '%" . strtoupper(
                                $parametros['descripcion']
                        ) . "%'"
                );
            }
            if ($parametros['es_especialidad']) {
                if ($idespecialidad) {
                    $query->addWhere(
                            "idtiponomenclador $listarAsoc IN
                        ( SELECT esp.idtiponomenclador FROM DatConftiponomesp esp WHERE esp.idespecialidad = "
                            . $idespecialidad . " )"
                    );
                    $queryc->addWhere(
                            "idtiponomenclador $listarAsoc IN
                        ( SELECT esp.idtiponomenclador FROM DatConftiponomesp esp WHERE esp.idespecialidad = "
                            . $idespecialidad . " )"
                    );
                }
            } else {
                if ($idgrupo) {
                    $query->addWhere(
                            "idtiponomenclador $listarAsoc IN
                        ( SELECT nt.idtiponomenclador
                        FROM DatTipocomponentetiponomenclador nt
                        WHERE nt.idtipocomponente = "
                            . $idgrupo . " )"
                    );
                    $queryc->addWhere(
                            "idtiponomenclador $listarAsoc IN
                        ( SELECT nt.idtiponomenclador
                        FROM DatTipocomponentetiponomenclador nt
                        WHERE nt.idtipocomponente = "
                            . $idgrupo . " )"
                    );
                }
            }
            if ($idtipoalistar) {
                $query->addWhere("n.idtiponomenclador = $idtipoalistar");
                $queryc->addWhere("n.idtiponomenclador = $idtipoalistar");
            }

            /**
             * Evitar listar el paramatro por defecto
             *
             */
            $query->addWhere('n.denominacion !=?', '-');
            $queryc->addWhere('n.denominacion !=?', '-');
            $result = $query->select(
                                    "n.idtiponomenclador as id ,d.iddatosnomenclador AS iddatonomenclador,
                n.idtiponomenclador as idreal,1 AS tipo, n.denominacion, n.descripcion,
                null as _parent, false as _is_leaf"
                            )
                            ->from("NomTiponomenclador n")
                            ->leftJoin("n.NomDatosnomenclador d")
                            ->offset($start)
                            ->limit($limit)
                            ->orderby("n.denominacion")
                            ->execute()->toArray();

            $contar = $queryc->from("NomTiponomenclador n")
                    ->leftJoin("n.NomDatosnomenclador d")
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->count();
        } else {
            if ($parametros['denominacion'] != null) {
                $query->addWhere(
                        "upper(n.denominacion) LIKE '%" . strtoupper(
                                $parametros['denominacion']
                        ) . "%'"
                );
                $queryc->addWhere(
                        "upper(n.denominacion) LIKE '%" . strtoupper(
                                $parametros['denominacion']
                        ) . "%'"
                );
            }
            if ($parametros['descripcion'] != null) {
                $query->addWhere(
                        "upper(n.descripcion) LIKE '%" . strtoupper(
                                $parametros['descripcion']
                        ) . "%'"
                );
                $queryc->addWhere(
                        "upper(n.descripcion) LIKE '%" . strtoupper(
                                $parametros['descripcion']
                        ) . "%'"
                );
            }


            /**
             * Evitar listar el paramatro por defecto
             *
             */
            $query->addWhere('n.uridatosnomenclador !=?', '-');
            $queryc->addWhere('n.uridatosnomenclador !=?', '-');


            if ($parametros['tipo'] == 1) {

                $result = $query->select(
                                        "n.iddatosnomenclador as id,n.iddatosnomenclador as idreal, n.denominacion , n.descripcion,"
                                        . $devolverPadre
                                        . ",false as _is_leaf,2 AS tipo,n.cantdescendente"
                                )
                                ->from("NomDatosnomenclador n")
                                ->offset($start)
                                ->limit($limit)
                                ->orderby("n.denominacion, n.descripcion")
                                ->addwhere(
                                        ' n.idtiponomenclador =? AND n.cantascendente = 0', $idpadre
                                )
                                // ->addwhere('n.denominacion !=?', '-')
                                ->orderby("n.denominacion")
                                ->execute()->toArray();
                $contar = $queryc->from("NomDatosnomenclador n")
                        ->orderby("n.denominacion, n.descripcion")
                        ->addwhere(
                                ' n.idtiponomenclador =? AND n.cantascendente = 0', $idpadre
                        )
                        //->addwhere('n.denominacion !=?', '-')
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->count();
            } else {
                $result = $query->select(
                                        "n.iddatosnomenclador as id,n.iddatosnomenclador as idreal,
                                         n.denominacion,n.cantascendente as hijos, n.descripcion, "
                                        . $devolverPadre
                                        . ",false as _is_leaf,3 AS tipo,n.cantdescendente"
                                )
                                ->from("NomDatosnomenclador n")
                                ->innerJoin("n.DatDatosnomencladordatosnomenclador dn")
                                ->offset($start)
                                ->limit($limit)
                                ->orderby("n.denominacion")
                                ->addwhere('dn.iddatosnomencladorpadre=?', $idpadre)
                                ->execute()->toArray();
                $contar = $queryc->from("NomDatosnomenclador n")
                        ->innerJoin("n.DatDatosnomencladordatosnomenclador dn")
                        ->addwhere('dn.iddatosnomencladorpadre=?', $idpadre)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->count();
            }
        }
        $result[20]['total'] = $contar;
        return $result;
    }

//fin de la función listar
//
//listar del arbol
    public function listarArbol($parametros, $node) {
        $query = new Doctrine_Query();
        $idpadre = $node;
        if ($idpadre == 0) {
            $parametros['tipo'] = 0;
        } else {
            $parametros['tipo'] = 1;
        }
        $devolverPadre = (!$idpadre ? "null as _parent" : $idpadre . " as _parent");
        if ($parametros['tipo'] == 0) {

            $result = $query->select(
                                    "n.idtiponomenclador as id ,d.iddatosnomenclador AS iddatonomenclador,
                n.idtiponomenclador as idreal,1 AS tipo, n.denominacion, n.descripcion,
                null as _parent, false as _is_leaf"
                            )
                            ->from("NomTiponomenclador n")
                            ->leftJoin("n.NomDatosnomenclador d")
                            ->orderby("n.denominacion")
                            ->execute()->toArray();
        } else {
            if ($parametros['tipo'] == 1) {
                $result = $query->select(
                                        "n.iddatosnomenclador as id,n.iddatosnomenclador as idreal,
                    n.denominacion , n.descripcion,true as _is_leaf,"
                                        . $devolverPadre . ""
                                )
                                ->from("NomDatosnomenclador n")
                                ->orderby("n.denominacion, n.descripcion")
                                ->addwhere(
                                        ' n.idtiponomenclador =? AND n.cantascendente = 0', $idpadre
                                )
                                ->orderby("n.denominacion")
                                ->execute()->toArray();
            } else {
                $result = $query->select(
                                        "n.iddatosnomenclador as id,false as _is_leaf,
                    n.iddatosnomenclador as idreal,
                    n.denominacion,n.cantascendente as hijos, n.descripcion, "
                                        . $devolverPadre . ""
                                )
                                ->from("NomDatosnomenclador n")
                                ->innerJoin("n.DatDatosnomencladordatosnomenclador dn")
                                ->orderby("n.denominacion")
                                ->addwhere('dn.iddatosnomencladorpadre=?', $idpadre)
                                ->execute()->toArray();
            }
        }

        return $result;
    }

    public function listarNomencladores($noConfSist = false) {
        $query = new Doctrine_Query();
        $query->select('idtiponomenclador,denominacion')
                ->from('Nomtiponomenclador')
                ->orderby("denominacion");
        if ($noConfSist)
            $query->addWhere("configsistema=2");
        return $query->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public function listarNomencladoresTM($idtipomodelo) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT tn.idtiponomenclador, tn.denominacion
                FROM mod_planificacion.nom_tiponomenclador tn
                LEFT JOIN mod_planificacion.nom_tipomodelocolumna tmc 
                ON (tn.idtiponomenclador = tmc.idtiponomenclador AND tmc.idtipomodelo = $idtipomodelo)
                WHERE tmc.idtiponomenclador is NULL order by tn.denominacion";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function listarNomencladoresDenom($denom) {
        $query = new Doctrine_Query();
        return $query->select('idtiponomenclador,denominacion')
                        ->from('Nomtiponomenclador n')
                        ->addWhere("upper(n.denominacion) LIKE '" . strtoupper($denom) . "'")
                        ->orderby("denominacion")
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public function buscarpordenom($denom) {
        $query = new Doctrine_Query();
        return $query->select('n.idtiponomenclador')
                        ->from('Nomtiponomenclador n')
                        ->addWhere("upper(n.denominacion) LIKE '" . strtoupper($denom) . "'")
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public function getTipoNomenclador($idtiponomenclador) {
        return Doctrine:: getTable('NomTiponomenclador')->find(
                        $idtiponomenclador
        );
    }

    public function obtenerDatosNomenclador($uritiponomenclador) {
        $query = new Doctrine_Query();
        return $query->select('n.idtiponomenclador')
                        ->from('Nomtiponomenclador n')
                        ->innerJoin('n.NomDatosnomenclador d')
                        ->where('n.uritiponomenclador=?', $uritiponomenclador)
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

    /* Este metodo se usa para el desglose multiple */

    public function ObtenerTipoNom() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT dt.iddesglosetiponomenclador as id,tn.denominacion as denom
FROM mod_planificacion.dat_desglosetiponomenclador dt
INNER JOIN mod_planificacion.nom_tiponomenclador tn ON dt.idtiponomenclador = tn.idtiponomenclador
WHERE tn.uritiponomenclador = 'SectorRama' OR tn.uritiponomenclador = 'Destino'";
        return $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

}
