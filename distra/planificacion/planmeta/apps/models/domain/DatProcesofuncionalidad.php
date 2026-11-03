<?php

class DatProcesofuncionalidad extends BaseDatProcesofuncionalidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomDatosnomenclador',
            array('local' => 'idproceso', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
            'DatProcesofuncionalidadestado',
            array('local' => 'idprocesofuncionalidad',
                  'foreign' => 'idprocesofuncionalidad')
        );
    }

    public function obtenerFuncionalidadesPorProcesos($idproceso)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('pf.*')
            ->from('DatProcesofuncionalidad pf')
            ->where('pf.idproceso=?', $idproceso)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

}

