<?php

class DatPuestotrabajorango extends BaseDatPuestotrabajorango
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatRangonumerocontrol', array('local' => 'idrango', 'foreign' => 'idrango'));
        $this->hasOne('NomPuestotrabajo', array('local' => 'idpuestotrabajo', 'foreign' => 'idpuestotrabajo'));
    }

    /**
     * Funcion que permite saber si existe el elemento
     *
     * @param array $params Arreglo con los parametros necesarios
     *
     * @return array Retorna cantidad de elementos
     */
    public function existsNumeroControl($params)
    {
        $nrocontrolinicial = (int)str_replace('-', '', $params['nroinicio']);
        $nrocontrolfinal = (int)str_replace('-', '', $params['nrofin']);
        $idconf = $params['idestructuracomun'];
        $query = Doctrine_Query::create()
            ->from('DatPuestotrabajorango dptr')
            ->innerJoin('dptr.NomPuestotrabajo npt')
            ->innerJoin('dptr.DatRangonumerocontrol drnc')
            ->innerJoin('drnc.DatNumerocontrol dnc')
            ->where(
                "{$nrocontrolinicial} = cast(replace(dnc.nrocontrol, '-', '') as int) "
                . "or {$nrocontrolfinal} = cast(replace(dnc.nrocontrol, '-', '') as int) "
                . "and npt.idestructuracomun = {$idconf}"
            );
        return $query->count();
    }

}
