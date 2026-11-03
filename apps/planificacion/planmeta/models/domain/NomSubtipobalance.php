<?php

class NomSubtipobalance extends BaseNomSubtipobalance
{

    public function setUp()
    {
        parent::setUp();

        $this->HasMany(
            'DatSubtipobalancebalance', array('local' => 'idsubtipobalance',
                                              'foreign' => 'idsubtipobalance')
        );
        $this->hasOne(
            'NomTipobalance',
            array('local' => 'idtipobalance', 'foreign' => 'idtipobalance')
        );
    }

    public function BuscarRelaciones($id, $tipo)
    {
        $query = new Doctrine_Query();
        if ($tipo == "subtipobalance") {
            return $query->from('NomBalance n')
                ->innerJoin('n.DatSubtipobalancebalance d')
                ->where('d.idsubtipobalance=?', $id)
                ->execute()
                ->toArray();
        } else {
            return $query->from('NomSubtipobalance n')
                ->where('n.idtipobalance=?', $id)
                ->execute()
                ->toArray();
        }
    }

    public function eliminarasociacion($id)
    {
        $query = new Doctrine_Query();
        return $query->from('DatSubtipobalancebalance d')
            ->where('d.idbalance=?', $id)
            ->execute();
    }

    public function verificarexistetciasub($denominacion, $id)
    {
        $query = new Doctrine_Query();
        if ($denominacion) {
            $serult = $query->from('NomSubtipobalance n')->where(
                "n.denominacion = ?", trim(strtoupper($denominacion))
            )
                ->execute()->toArray();
            return $serult;
        } else {
            if ($id) {
                $subtipobalance = Doctrine::getTable('NomSubtipobalance')->find(
                    $id
                );
                $idp = $query->from('NomSubtipobalance n')->where(
                    "n.denominacion = ?", trim(strtoupper($denominacion))
                )
                    ->execute()->toArray();
                if (trim(strtolower($denominacion)) != trim(
                    strtolower($subtipobalance->denominacion)
                )
                ) {
                    if ($id == $idp['idsubtipobalance']) {
                        return array();
                    } else {
                        return $idp;
                    }
                } else {
                    return array();
                }
            }
        }
    }

    public function listartodosSubTipoBalance($start, $limit,
        $idbalance
    )
    {
        $query = new Doctrine_Query();
        $query->from('NomSubtipobalance n');

        /*if ($tipos) {
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
                                    "upper(n.descripcion) LIKE '%" . strtoupper(
                                        $s
                                    ) . "%'"
                                );
                            }
                        }
                    }
                }
            }
        }*/
        return $query->select(
            'n.idsubtipobalance,n.denominacion,n.descripcion,n.idtipobalance,t.denominacion'
        )
            ->innerjoin('n.NomTipobalance t')
            ->where("n.idtipobalance = ?", $idbalance)
            ->offset($start)
            ->limit($limit)
            ->orderby('n.denominacion')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

    public function totalSubtipoBalance($idbalance)
    {
        $q = Doctrine_Query:: create();
        $q->from('NomSubtipobalance n');
       /* if ($tipos) {
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
                                    "upper(n.descripcion) LIKE '%" . strtoupper(
                                        $s
                                    ) . "%'"
                                );
                            }
                        }
                    }
                }
            }
        }*/
        return $q->select('COUNT(idsubtipobalance) as total')
            ->innerjoin('n.NomTipobalance t')
            ->where("n.idtipobalance = ?", $idbalance)
            ->execute()->getFirst()->total;
    }

}

