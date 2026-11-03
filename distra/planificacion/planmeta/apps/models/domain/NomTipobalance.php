<?php

class NomTipobalance extends BaseNomTipobalance
{

    public function setUp()
    {
        parent::setUp();

        $this->HasMany(
            'NomSubtipobalance',
            array('local' => 'idtipobalance', 'foreign' => 'idtipobalance')
        );
        $this->hasOne(
            'DatConftiponomesp', array('local' => 'idconftiponomesp',
                                       'foreign' => 'idconftiponomesp')
        );
    }

    public function listarTipoBalance($idconftiponomesp)
    {
        $query = new Doctrine_Query();
        if ($idconftiponomesp) {
            return $query->select('n.idtipobalance,n.denominacion')
                ->from('NomTipobalance n')
                ->where('n.idconftiponomesp=?', $idconftiponomesp)
                ->orderby('n.denominacion')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        }
    }

    public function listartodosTipoBalance($start, $limit, $parametros,
        $idconftiponomesp
    )
    {
        $query = new Doctrine_Query();
        $query->from('NomTipobalance n');
        $query->addWhere("n.idconftiponomesp = ?", $idconftiponomesp);
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
        if ($idconftiponomesp) {
            return $query->select(
                'n.idtipobalance,n.denominacion,n.descripcion'
            )
                ->offset($start)
                ->limit($limit)
                ->orderby('n.denominacion')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        }
    }

    public function totalTipoBalance($idconftiponomesp, $parametros)
    {
        $q = Doctrine_Query:: create();
        $q->from('NomTipobalance n');
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
        return $q->select('COUNT(idtipobalance) as total')->execute()->getFirst(
        )->total;
    }

    public function verificarexistetcia($denominacion, $idtipobalance)
    {
        $query = new Doctrine_Query();
        if ($idtipobalance) {
            $tipobalance = Doctrine::getTable('NomTipobalance')->find(
                $idtipobalance
            );
            $idp = $query->from('NomTipobalance n')->where(
                "n.denominacion = ?", trim(strtoupper($denominacion))
            )
                ->execute()->toArray();
            if (trim(strtolower($denominacion)) != trim(
                strtolower($tipobalance->denominacion)
            )
            ) {
                if ($idtipobalance == $idp['idtipobalance']) {
                    return array();
                } else {
                    return $idp;
                }
            } else {
                return array();
            }
        }
        return $query->from('NomTipobalance n')->where(
            "n.denominacion = ?", trim(strtoupper($denominacion))
        )
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

    public function listarnomencladorTipo()
    {
        $conn = Doctrine_Manager::connection();
        $sql
            = "SELECT idtiponomencladoraft
                FROM  mod_planificacion.nom_nomencladordinamicoaft ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarnomencladorSubtipo()
    {
        $conn = Doctrine_Manager::connection();
        $sql
            = "SELECT i.idtiponomencladoraft
                FROM  mod_planificacion.nom_nomencladordinamicoaft i ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

}
