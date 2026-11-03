<?php

class NomRecursofinanciero extends BaseNomRecursofinanciero
{

    public function setUp()
    {
        parent::setUp();
    }

    public function obtenerRF($start, $limit, $filters)
    {
        $query = new Doctrine_Query();
        if (!empty($filters)) {
            foreach ($filters as $filter) {
                if ($filter ['data'] ['type'] == 'string') {
                    if ($filter ['field'] == 'denominacion') {
                        $query->addWhere(
                            "upper(rf.denominacion) LIKE '%" . strtoupper(
                                $filter ['data'] ['value']
                            ) . "%'"
                        );
                    } else {
                        if ($filter ['data'] ['type'] == 'string') {
                            if ($filter ['field'] == 'codigo') {
                                $query->addWhere(
                                    "upper(rf.codigo) LIKE '%" . strtoupper(
                                        $filter ['data'] ['value']
                                    ) . "%'"
                                );
                            }
                        }
                    }
                }
            }
        }
        return $query->select(
            'rf.idrecursofinanciero,rf.codigo,rf.denominacion'
        )
            ->from('NomRecursofinanciero rf')
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

    public function obtenerRFtotal($start, $limit, $filters)
    {
        $query = new Doctrine_Query();
        if (!empty($filters)) {
            foreach ($filters as $filter) {
                if ($filter ['data'] ['type'] == 'string') {
                    if ($filter ['field'] == 'denominacion') {
                        $query->addWhere(
                            "upper(rf.denominacion) LIKE '%" . strtoupper(
                                $filter ['data'] ['value']
                            ) . "%'"
                        );
                    } else {
                        if ($filter ['data'] ['type'] == 'string') {
                            if ($filter ['field'] == 'codigo') {
                                $query->addWhere(
                                    "upper(rf.codigo) LIKE '%" . strtoupper(
                                        $filter ['data'] ['value']
                                    ) . "%'"
                                );
                            }
                        }
                    }
                }
            }
        }
        return $query->select(
            'rf.idrecursofinanciero,rf.codigo,rf.denominacion'
        )
            ->from('NomRecursofinanciero rf')
            ->limit($limit)
            ->offset($start)
            ->count();
    }

    public function obtenerRFDadoId($idingreso)
    {
        $query = new Doctrine_Query();
        return $query->select(
            'rf.idrecursofinanciero,rf.codigo,rf.denominacion'
        )
            ->from('NomRecursofinanciero rf')
            ->where('rf.idrecursofinanciero = ?', $idingreso)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

    /*public function obtenerNaeDadoId($idnae)
    {
        $query = new Doctrine_Query();
        return $query->from('NomNae na')
            ->where('na.idnae = ?', $idnae)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }*/

    public function obtenerTodosRecursosFinancieros($idrecursos = null){
        $query = new Doctrine_Query();
        if($idrecursos) {
            return $query->select(
                'rf.idrecursofinanciero,rf.codigo,rf.denominacion'
            )
                ->from('NomRecursofinanciero rf')
                ->whereIn('rf.idrecursofinanciero',$idrecursos)
                ->orderBy('rf.codigo')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        }
        else {
            return $query->select('rf.idrecursofinanciero,rf.codigo,rf.denominacion')
                ->from('NomRecursofinanciero rf')
                ->orderBy('rf.idrecursofinanciero')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        }
    }

}
