<?php

class NomNae extends BaseNomNae
{

    public function setUp()
    {
        parent::setUp();
    }

    public function obtenerNAE($filters, $idnae, $start = 0, $limit = 20)
    {
        $query = new Doctrine_Query();
        if (!empty($filters)) {
            foreach ($filters as $filter) {
                if ($filter ['data'] ['type'] == 'string') {
                    if ($filter ['field'] == 'denominacion') {
                        $query->addWhere(
                            "upper(nae.denominacion) LIKE '%" . strtoupper(
                                $filter ['data'] ['value']
                            ) . "%'"
                        );
                    } else {
                        if ($filter ['data'] ['type'] == 'string') {
                            if ($filter ['field'] == 'codigo') {
                                $query->addWhere(
                                    "upper(nae.codigo) LIKE '%" . strtoupper(
                                        $filter ['data'] ['value']
                                    ) . "%'"
                                );
                            }
                        }
                    }
                }
            }
        }
        if ($idnae) {
            return $query->select('nae.idnae,nae.codigo,nae.denominacion')
                ->from('NomNae nae')
                ->where('nae.idnae=?', $idnae)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        } else {
            return $query->select('nae.idnae,nae.codigo,nae.denominacion')
                ->from('NomNae nae')
                ->offset($start)
                ->limit($limit)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        }
    }

    public function obtenerTotalNAE()
    {
        $query = new Doctrine_Query();
        if (!empty($filters)) {
            foreach ($filters as $filter) {
                if ($filter ['data'] ['type'] == 'string') {
                    if ($filter ['field'] == 'denominacion') {
                        $query->addWhere(
                            "upper(nae.denominacion) LIKE '%" . strtoupper(
                                $filter ['data'] ['value']
                            ) . "%'"
                        );
                    } else {
                        if ($filter ['data'] ['type'] == 'string') {
                            if ($filter ['field'] == 'codigo') {
                                $query->addWhere(
                                    "upper(nae.codigo) LIKE '%" . strtoupper(
                                        $filter ['data'] ['value']
                                    ) . "%'"
                                );
                            }
                        }
                    }
                }
            }
        }
        return $query->from('NomNae nae')
            ->count();
    }

    public function obtenerNAEsDadoIds($idsnaes)
    {
        $query = new Doctrine_Query();
        return $query->select('nae.idnae,nae.codigo,nae.denominacion')
            ->from('NomNae nae')
            ->whereIn('nae.idnae', $idsnaes)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

    public function obtenerTodasNaes($idnaes)
    {
        $query = new Doctrine_Query();
        if($idnaes) {
            return $query->select('nae.idnae,nae.codigo,nae.denominacion')
                ->from('NomNae nae')
                ->orderBy('nae.idnae')
                ->whereIn('nae.idnae',$idnaes)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        } else {
            return $query->select('nae.idnae,nae.codigo,nae.denominacion')
                ->from('NomNae nae')
                ->orderBy('nae.idnae')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        }
    }
}
