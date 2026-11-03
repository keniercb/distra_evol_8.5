<?php

class DatAjusteentidad extends BaseDatAjusteentidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomIndicador',
            array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->hasOne(
            'DatAjusteentidadcentrobalance',
            array('local' => 'idajusteentidad', 'foreign' => 'idajusteentidad')
        );
    }

    public function ListarIndEntDatNom($identdatnom, $start, $limit)
    {
        $query = new Doctrine_Query();
        $result = $query->select(
            'dae.idajusteentidad, dae.cantidadeninventario, dae.cantidadcontratado,
             dae.necesidadannoactual, dae.mercanciaentransito, dae.coberturatotalestimada,
             dae.ajustepornivelactividad, dae.ajustepornivelactividadneg, ni.codigo,
             ni.denominacion, ni.numeropieza, daecb.idajusteentidad, daecb.cantidadreservaministro,
             daecb.cantidadeconomia'
        )->from(
                'DatAjusteentidad dae, dae.NomIndicador ni, dae.DatAjusteentidadcentrobalance daecb'
            )->where('dae.identidaddatosnomenclador =? ', $identdatnom)
            ->offset($start)->limit($limit)->orderby('dae.idajusteentidad')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function TotalIndEntDatNom($identdatnom)
    {
        $query = new Doctrine_Query();
        $result = $query->select(
            'dae.idajusteentidad, dae.cantidadeninventario, dae.cantidadcontratado,
             dae.necesidadannoactual, dae.mercanciaentransito, dae.coberturatotalestimada,
             dae.ajustepornivelactividad, dae.ajustepornivelactividadneg, ni.codigo,
             ni.denominacion, ni.numeropieza, daecb.idajusteentidad, daecb.cantidadreservaministro,
              daecb.cantidadeconomia'
        )->from(
                'DatAjusteentidad dae, dae.NomIndicador ni, dae.DatAjusteentidadcentrobalance daecb'
            )->where('dae.identidaddatosnomenclador =? ', $identdatnom)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function ExisteIndicadorAjuste($idindicador, $identidad)
    {
        $query = new Doctrine_Query();
        $res = $query->select('dae.idajusteentidad')
            ->from('DatAjusteentidad dae')
            ->where(
                'dae.idindicador =? AND dae.identidad=?',
                array($idindicador, $identidad)
            )->execute()->toArray();

        if ($res[0]['idajusteentidad'] != null) {
            return true;
        } else {
            return false;
        }
    }

    public function getIdAjusteentidad($idindicador, $identidaddatosnomenclador)
    {
        $query = new Doctrine_Query();
        $res = $query->select('dae.idajusteentidad')
            ->from('DatAjusteentidad dae')
            ->where(
                'dae.idindicador =? AND dae.identidaddatosnomenclador=?',
                array($idindicador, $identidaddatosnomenclador)
            )->execute()->toArray();

        return $res;
    }

    public function getIdAjusteentidad1($idindicador)
    {
        $query = new Doctrine_Query();
        $res = $query->select('dae.idajusteentidad')
            ->from('DatAjusteentidad dae')->where('dae.idindicador =? ', $idindicador)
            ->execute()->toArray();

        return $res;
    }

    public function getAllAjusteentidad($idindicador, $identidad)
    {
        $query = new Doctrine_Query();
        $res = $query
            ->from('DatAjusteentidad dae')
            ->where(
                'dae.idindicador =? AND dae.identidad=?',
                array($idindicador, $identidad)
            )->execute()->getFirst();
        return $res;
    }

}