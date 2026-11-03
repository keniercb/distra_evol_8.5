<?php

class DatOrganosatisface extends BaseDatOrganosatisface
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomDatosnomenclador', array('local'   => 'iddatosnomenclador',
                                         'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
            'DatIndicadormaterialdatosnomenclador',
            array('local'   => 'idindicadormaterialdatosnomenclador',
                  'foreign' => 'idindicadormaterialdatosnomenclador')
        );
    }

    public function ObtenerDenomOACEporId($idindicadormaterialdatosnomenclador)
    {
        $query = new Doctrine_Query();
        $result = $query->select(
            'n.iddatosnomenclador, dn.denominacion as denominacionnom'
        )
            ->from('DatOrganosatisface n, n.NomDatosnomenclador dn')
            ->where(
                'n.idindicadormaterialdatosnomenclador= ? ',
                $idindicadormaterialdatosnomenclador
            )
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();

        return $result;
    }

}