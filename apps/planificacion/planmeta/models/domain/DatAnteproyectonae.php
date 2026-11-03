<?php

class DatAnteproyectonae extends BaseDatAnteproyectonae
{

    public function setUp()
    {
        parent::setUp();
    }

    public function obtenerIngresosDoc($idanteproyecto, $idnae, $start = 0,
        $limit = 10
    ) {
        $query = Doctrine_Query::create();
        $query->from('DatAnteproyectonaeingreso apni')
            ->where('apn.idanteproyecto = ?', array($idanteproyecto))
            ->innerJoin('apni.DatAnteproyectonae apn')
            ->innerJoin('apn.DatAnteproyecto ap')->offset($start)
            ->limit($limit)->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        if (isset($idnae)) {
            $query->addWhere('apn.idnae = ?', $idnae);
        }


        return $query->execute();
    }

    public function obtenerCantIngresosDoc($idanteproyecto, $idnae
    ) {
        $query = Doctrine_Query::create();

        $query->from('DatAnteproyectonaeingreso apni')
            ->where('apn.idanteproyecto = ?', array($idanteproyecto))
            ->innerJoin('apni.DatAnteproyectonae apn')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        if (isset($idnae)) {
            $query->addWhere('apn.idnae = ?', $idnae);
        }

        return $query->count();
    }

    public function obtenerGastosDoc($idanteproyecto, $idnae, $start = 0,
        $limit = 10
    ) {
        $query = Doctrine_Query::create();
        $query->from('DatAnteproyectonaeobjetogasto apni')
            ->where('apn.idanteproyecto = ?', array($idanteproyecto))
            ->innerJoin('apni.DatAnteproyectonae apn')
            ->innerJoin('apn.DatAnteproyecto ap')->offset($start)
            ->limit($limit)->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        if (isset($idnae)) {
            $query->addWhere('apn.idnae = ?', $idnae);
        }
        return $query->execute();
    }

    public function obtenerGastosDocconsolidados($idanteproyecto, $idnae,
        $start = 0, $limit = 10
    ) {
        $query = Doctrine_Query::create();
        $query->select('SUM(apni.planificacion)')
            ->from('DatAnteproyectonaeobjetogasto apni')
            ->where('apn.idanteproyecto = ?', array($idanteproyecto))
            ->innerJoin('apni.DatAnteproyectonae apn')->offset($start)
            ->limit($limit)->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        if (isset($idnae)) {
            $query->addWhere('apn.idnae = ?', $idnae);
        }
        return $query->execute();
    }

    public
    function obtenerIngresosDocconsolidados($idanteproyecto, $idnae,
        $start = 0, $limit = 10
    ) {
        $query = Doctrine_Query::create();

        $query->select('SUM(apni.planificacion)')
            ->from('DatAnteproyectonaeingreso apni')
            ->where('apn.idanteproyecto = ?', array($idanteproyecto))
            ->innerJoin('apni.DatAnteproyectonae apn')->offset($start)
            ->limit($limit)->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        if (isset($idnae)) {
            $query->addWhere('apn.idnae = ?', $idnae);
        }
        return $query->execute();
    }

    public
    function obtenerGastosPunt($idanteproyecto, $idnae, $start = 0,
        $limit = 10
    ) {
        $query = Doctrine_Query::create();
        $query->select(
            'apni.planificacion,apni.idobjetogasto,apn.idnae as idnae,inc.idincremento as idicremento,
            inc.cantidad as cantidad_inc,lib.cantidad as liberacion'
        )->from('DatAnteproyectonaeobjetogasto apni')
            ->where('apn.idanteproyecto = ?', array($idanteproyecto))
            ->leftJoin('apni.DatAnteproyectonae apn')
            ->leftJoin('apni.DatIncremento inc')
            ->leftJoin('apni.DatLiberacion lib')->offset($start)
            ->limit($limit)->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        if (isset($idnae)) {
            $query->addWhere('apn.idnae = ?', $idnae);
        }
        return $query->execute();
    }

    public function obtenerCantGastosDoc($idanteproyecto, $idnae
    ) {
        $query = Doctrine_Query::create();

        $query->from('DatAnteproyectonaeobjetogasto apni')
            ->where('apn.idanteproyecto = ?', array($idanteproyecto))
            ->innerJoin('apni.DatAnteproyectonae apn');
        if (isset($idnae)) {
            $query->addWhere('apn.idnae = ?', $idnae);
        }

        return $query->count();
    }

    public function obtenerIdsNaesDadoIdDoc($idanteproyecto, $start = 0,
        $limit = 10
    ) {
        $query = Doctrine_Query::create();
            $query->select('apn.idnae as idnae')
                ->from('DatAnteproyectonae apn')
                ->where('apn.idanteproyecto = ?', array($idanteproyecto))
                ->offset($start)->limit($limit)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        return $query->execute();
    }

    public function obtenerCantIdsNaesDadoIdDoc($idanteproyecto
    ) {
        $query = Doctrine_Query::create();
            $query->select('apn.idnae as idnae')
                ->from('DatAnteproyectonae apn')
                ->where('apn.idanteproyecto = ?', $idanteproyecto);

        return $query->count();
    }

}
