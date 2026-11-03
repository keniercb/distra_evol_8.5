<?php

class DatAjustedemanda extends BaseDatAjustedemanda
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'NomIndicador',
            array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->hasOne(
            'DatEntidadmodelo',
            array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasOne(
            'NomEjercicioplanificacion',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasOne(
            'NomAprobacion',
            array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasOne(
            'DatEntidaddatosnomenclador',
            array('local' => 'identidaddatosnomenclador',
                  'foreign' => 'identidaddatosnomenclador')
        );
    }

    public function AjusteDemPorIndicador($idindicador)
    {
        $query = new Doctrine_Query();
        $res = $query->from('DatAjustedemanda dad')
            ->where('dad.idindicador =? ', $idindicador)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function AjusteDemPorIndicadorEntimodelo($idindicador,
        $identidadmodelo
    )
    {
        $query = new Doctrine_Query();
        $res = $query->from('DatAjustedemanda dad')
            ->where(
                'dad.idindicador =? AND dad.identidadmodelo=?',
                array($idindicador, $identidadmodelo)
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function ExisteIndicadorAjusteDemanda(
        $idindicador, $identidaddatosnomenclador, $idejercicio, $identidadmodelo
    )
    {
        $query = new Doctrine_Query();
        $res = $query->select('dad.idajustedemanda')
            ->from('DatAjustedemanda dad')
            ->where(
                'dad.idindicador =? AND dad.identidaddatosnomenclador=?',
                array($idindicador, $identidaddatosnomenclador)
            )
            ->addWhere(
                "dad.idejercicio=? AND dad.identidadmodelo=?",
                array($idejercicio, $identidadmodelo)
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $res;
    }

    public function getObjectDemanda($idindicador, $identidaddatosnomenclador,
        $identidadmodelo
    )
    {
        $query = new Doctrine_Query();
        $res = $query
            ->from('DatAjustedemanda dad')
            ->where(
                'dad.idindicador =? AND dad.identidaddatosnomenclador=? AND dad.identidadmodelo=?',
                array($idindicador, $identidaddatosnomenclador,
                      $identidadmodelo)
            )->execute()->getFirst();
        return $res;
    }

}
