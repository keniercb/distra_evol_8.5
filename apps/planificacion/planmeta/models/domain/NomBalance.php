<?php

class NomBalance extends BaseNomBalance {

    public function setUp() {
        parent::setUp();

        $this->HasMany(
                'DatSubtipobalancebalance', array('local' => 'idbalance', 'foreign' => 'idbalance')
        );
        $this->hasOne(
                'DatConftiponomesp', array('local' => 'idconftiponomesp',
            'foreign' => 'idconftiponomesp')
        );
    }

    public function verificarexistetciabal($denominacion, $id) {
        $query = new Doctrine_Query();
        if ($id) {
            $balance = Doctrine::getTable('NomBalance')->find($id);
            if (trim(strtolower($denominacion)) != trim(
                            strtolower($balance->denominacion)
                    )
            ) {
                $idp = $query->from('NomBalance n')->where(
                                        "n.denominacion = ?", trim(strtoupper($denominacion))
                                )
                                ->execute()->toArray();
                if ($id == $idp['idbalance']) {
                    return array();
                } else {
                    return $idp;
                }
            } else {
                return array();
            }
        }
        return $query->from('NomBalance n')->where(
                                "n.denominacion = ?", trim(strtoupper($denominacion))
                        )->execute()
                        ->toArray();
    }

    public function verifAS($idbalance, $idsubtipobalance, $idEstructura) {
        $query = new Doctrine_Query();
        return $query->select('n.idbalance,n.idsubtipobalance,n.identidad')
                        ->from('DatSubtipobalancebalance n')
                        ->where(
                                "n.idbalance=? AND n.idsubtipobalance=? AND n.identidad=?", array($idbalance, $idsubtipobalance, $idEstructura)
                        )
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

    public function listartodosBalance($start, $limit, $parametros, $idconftiponomesp
    ) {
        $query = new Doctrine_Query();
        $query->addWhere("n.idconftiponomesp = ?", $idconftiponomesp);
        $query->from('NomBalance n');
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
        return $query->select('n.idbalance,n.denominacion,n.descripcion')
                        ->offset($start)->limit($limit)->orderby('n.denominacion')
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

    public function totalBalance($idconftiponomesp, $parametros) {
        $q = Doctrine_Query:: create();
        $q->from('NomBalance n');
        $q->addWhere("n.idconftiponomesp = ?", $idconftiponomesp);
        if ($parametros) {

            foreach ($parametros as $p => $s) {
                if ($s != null) {
                    if ($p == 'denominacion') {
                        $q->addWhere(
                                "upper(n.denominacion) LIKE '%" . strtoupper($s)
                                . "%'"
                        );
                    } else {
                        if ($p == 'descripcion') {
                            $q->addWhere(
                                    "upper(n.descripcion) LIKE '%" . strtoupper($s)
                                    . "%'"
                            );
                        }
                    }
                }
            }
        }
        return $q->select('COUNT(idbalance) as total')->execute()->getFirst(
                )->total;
    }

    public function listarRaciones($identidad, $idsubtipobalance, $todos, $idconftiponomesp, $idejercicio
    ) {
        $query = new Doctrine_Query();
        $query->from('NomBalance n');
        if ($todos == 'true') {
            $query->addWhere("n.idconftiponomesp = ?", $idconftiponomesp);
            $query->leftjoin("n.DatSubtipobalancebalance ds");
        } else {
            $query->leftjoin("n.DatSubtipobalancebalance ds");
            $query->addWhere("ds.identidad=? ", $identidad);
            $query->addWhere("ds.idejercicio=? ", $idejercicio);
            $query->addWhere("ds.idsubtipobalance=?", $idsubtipobalance);
        }
        $aux = $query->select(
                        'n.idbalance,n.denominacion,n.descripcion,ds.idsubtipobalancebalance,ds.total,ds.coeficiente,ds.racion'
                )->orderby('n.denominacion')->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $aux;
    }

    public function listartotalRaciones($identidad, $idsubtipobalance, $todos, $idconftiponomesp, $parametros, $idejercicio
    ) {
        $query = new Doctrine_Query();
        $query->from('NomBalance n');
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
                        } elseif ($p == 'total_mayorq' || $p == 'total_menorq' || $p == 'total_iguala'
                        ) {
                            $query->addWhere(
                                    " ds.total " . $s['condicion'] . ""
                                    . $s['total'] . " "
                            );
                        } elseif ($p == 'coeficiente_mayorq' || $p == 'coeficiente_menorq' || $p == 'coeficiente_iguala'
                        ) {
                            $query->addWhere(
                                    " ds.coeficiente " . $s['condicion'] . ""
                                    . $s['coeficiente'] . " "
                            );
                        } elseif ($p == 'racion_mayorq' || $p == 'racion_menorq' || $p == 'racion_iguala'
                        ) {
                            $query->addWhere(
                                    " ds.racion " . $s['condicion'] . ""
                                    . $s['racion'] . " "
                            );
                        }
                    }
                }
            }
        }
        if ($todos == 'true') {
            $query->addWhere("n.idconftiponomesp = ?", $idconftiponomesp);
            $query->leftjoin("n.DatSubtipobalancebalance ds");
        } else {
            $query->innerjoin("n.DatSubtipobalancebalance ds");
            $query->addWhere("ds.identidad=?", $identidad);
            $query->addWhere("ds.idejercicio=?", $idejercicio);
            $query->addWhere("ds.idsubtipobalance=?", $idsubtipobalance);
        }
        return $query->select('COUNT(idbalance) as total')->execute()->getFirst(
                )->total;
    }

    public function totalParcialNiveles($identidad, $idsubtipobalance, $parametros, $hijas, $idejercicio
    ) {
        $query = new Doctrine_Query();
        $query->from('NomBalance n');

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
                        } elseif ($p == 'total_mayorq' || $p == 'total_menorq' || $p == 'total_iguala'
                        ) {
                            $query->addWhere(
                                    " ds.total " . $s['condicion'] . ""
                                    . $s['total'] . " "
                            );
                        } elseif ($p == 'coeficiente_mayorq' || $p == 'coeficiente_menorq' || $p == 'coeficiente_iguala'
                        ) {
                            $query->addWhere(
                                    " ds.coeficiente " . $s['condicion'] . ""
                                    . $s['coeficiente'] . " "
                            );
                        } elseif ($p == 'racion_mayorq' || $p == 'racion_menorq' || $p == 'racion_iguala'
                        ) {
                            $query->addWhere(
                                    " ds.racion " . $s['condicion'] . ""
                                    . $s['racion'] . " "
                            );
                        }
                    }
                }
            }
        }


        $query->innerjoin("n.DatSubtipobalancebalance ds");

        foreach ($hijas as $value) {
            $query->orWhere("ds.identidad = ?", $value);
        }
        $query->addWhere("ds.idejercicio=?", $idejercicio);
        $query->addWhere("ds.idsubtipobalance=?", $idsubtipobalance);

        return $query->select('SUM(ds.racion) as total')->execute()->getFirst(
                )->total;
    }

    public function totalGeneralNiveles($identidad, $idejercicio, $hijas = null) {
        $query = new Doctrine_Query();
        $query->from('NomBalance n');
        $query->innerjoin("n.DatSubtipobalancebalance ds");
        foreach ($hijas as $value) {
            $query->orWhere("ds.identidad = ?", $value);
        }
        $query->addWhere("ds.idejercicio=?", $idejercicio);
        return $query->select('SUM(ds.racion) as total')->execute()->getFirst(
                )->total;
    }

    public function buscarrelacion($idbalance, $idsubtipobalance) {
        $query = new Doctrine_Query();
        return $query->from('DatSubtipobalancebalance n')
                        ->where(
                                'n.idbalance=? AND n.idsubtipobalance=?', array($idbalance, $idsubtipobalance)
                        )->execute();
    }

    public function consolidar($idsubtipobalance, $idconftiponomesp) {
        $query = new Doctrine_Query();
        $query->from('NomBalance n');
        return $query->innerjoin('n.DatSubtipobalancebalance ds')
                        ->where(
                                'n.idconftiponomesp=? AND ds.idsubtipobalance=?', array($idconftiponomesp, $idsubtipobalance)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

}
