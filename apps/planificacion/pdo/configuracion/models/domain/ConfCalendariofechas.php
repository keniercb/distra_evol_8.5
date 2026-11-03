<?php

class ConfCalendariofechas extends BaseConfCalendariofechas
{
    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'ConfCalendario', array('local'   => 'idcalendario',
                'foreign' => 'idcalendario')
        );
    }

    public function getFechasEstructuraPorTipodia($idcalendario, $anno)
    {
        $query = new Doctrine_Query ();
        $query->select(
            'cf.fechas'
        )
            ->from('ConfCalendariofechas cf')
            ->where(
                "cf.idcalendario = $idcalendario AND cf.anno = $anno"
            )
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $query->execute();

    }

    public function getCalendarioPorTipodia($parametros)
    {
        $idestructura = ($parametros['getByIdEstructura']) ? $parametros['idestructura'] : $parametros['idcalendario'];
        $idtipodia = $parametros['idtipodia'];
        $anno = $parametros['anno'];
        $query = new Doctrine_Query ();
        $query->select(
            'cf.idcalendario, cf.fechas, cf.heredada'
        )
            ->from('ConfCalendariofechas cf')
            ->innerJoin('cf.ConfCalendario c')
            ->where(
                "c.idestructura = $idestructura AND c.idtipodia = $idtipodia AND cf.anno = $anno"
            )
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $query->execute();
    }

    public function getCalendario($parametros)
    {
        $idestructura = $parametros['idestructura'];
        $idtipodia = $parametros['idtipodia'];
        $anno = $parametros['anno'];
        $query = new Doctrine_Query ();
        $query->select(
            'cf.idcalendario, cf.fechas, cf.heredada, c.idtipodia'
        )
            ->from('ConfCalendariofechas cf')
            ->innerJoin('cf.ConfCalendario c')
            ->where(
                "c.idestructura = $idestructura AND cf.anno = $anno"
            )
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $query->execute();
    }

    public function getDiasDadoEstructura($params)
    {
        $idestructura = ($params['getByIdEstructura']) ? $params['idestructura'] : $params['idcalendario'];
        $anno = $params['anno'];

        $query = new Doctrine_Query ();
        $query->select(
            'cf.fechas, cf.horas, c.idestructura, c.idtipodia, n.incidencia'
        )
            ->from('ConfCalendariofechas cf')
            ->innerJoin('cf.ConfCalendario c')
            ->innerJoin('c.NomTipoDia n')
            ->where("c.idestructura = $idestructura AND cf.anno = $anno")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $query->execute();
    }


}//fin clase


