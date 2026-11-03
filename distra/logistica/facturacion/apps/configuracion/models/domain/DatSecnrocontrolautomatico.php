<?php

class DatSecnrocontrolautomatico extends BaseDatSecnrocontrolautomatico
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getRangoFacuraManuales($parametros)
    {
        $query = Doctrine_Query::create();
        return $query->select('*')
            ->from('DatSecnrocontrolautomatico dsca')
            ->where(
                "dsca.idestructuracomun =? "
                . "and dsca.idsecuencianumerocontrol =? ",
                array(
                    $parametros['idestructuracomun'],
                    $parametros['idsecuencianumerocontrol']
                )
            )
            ->fetchArray();
    }

    /**
     * Funcion que cargar los datos de numero de control
     *
     * @param array $params Arreglo con los parametros necesarios
     *
     * @return array Retorna datos y cantidad de elementos
     */
    public function loadNumeroControl($parametros)
    {
        $query = Doctrine_Query::create();
        $query->select('*')
            ->from('DatSecnrocontrolautomatico dsca')
            ->where(
                "dsca.idestructuracomun =?", array($parametros['idestructuracomun'])
            );
        if ($parametros['limit']) {
            $query->offset($parametros['start'])->limit($parametros['limit']);
        }
        $datos = $query->fetchArray();
        $cantidad = $query->count();
        return array('datos' => $datos, 'cantidad' => $cantidad);
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
        $nrofacturainicio = (int)$params['nrofacturainicio'];
        $nrofacturafinal = (int)$params['nrofacturafinal'];
        $nrocontrolinicial = (int)str_replace('-', '', $params['nrocontrolinicial']);
        $nrocontrolfinal = (int)str_replace('-', '', $params['nrocontrolfinal']);
        $idconf = $params['idestructuracomun'];
        $query = Doctrine_Query::create()
            ->from('DatSecnrocontrolautomatico')
            ->where(
                "(({$nrofacturainicio} between cast(replace(nrofacturainicio, '-', '') as int) and cast(replace(nrofacturafinal, '-', '') as int)) "
                . "or ({$nrofacturafinal} between cast(replace(nrofacturainicio, '-', '') as int) and cast(replace(nrofacturafinal, '-', '') as int)) "
                . "or ({$nrocontrolinicial} between cast(replace(nrocontrolinicial, '-', '') as int) and cast(replace(nrocontrolfinal, '-', '') as int)) "
                . "or ({$nrocontrolfinal} between cast(replace(nrocontrolinicial, '-', '') as int) and cast(replace(nrocontrolfinal, '-', '') as int))) "
                . "and idestructuracomun = {$idconf}"
            );
        if ($params['idsecuencianumerocontrol']) {
            $query->addWhere('idsecuencianumerocontrol <> ?', array($params['idsecuencianumerocontrol']));
        }
        return $query->count();
    }

    public function existsRangoNumeroControl($params)
    {
        $nroinicio = (int)str_replace('-', '', $params['nroinicio']);
        $query = Doctrine_Query::create()
            ->from('DatSecnrocontrolautomatico')
            ->where(
                " {$nroinicio} between cast(replace(nrocontrolinicial, '-', '') as int) "
                . "and cast(replace(nrocontrolfinal, '-', '') as int) "
                . "and idestructuracomun = '{$params['idestructuracomun']}'"
            );
        $existe = $query->count();
        if ($existe) {
            return $existe;
        }
        return $this->existsRangoNumeroControlAux($params);
    }

    public function existsRangoNumeroControlAux($params)
    {
        $nrofin = (int)str_replace('-', '', $params['nrofin']);
        $query = Doctrine_Query::create()
            ->from('DatSecnrocontrolautomatico')
            ->where(
                " {$nrofin} between cast(replace(nrocontrolinicial, '-', '') as int) "
                . "and cast(replace(nrocontrolfinal, '-', '') as int) "
                . "and idestructuracomun = '{$params['idestructuracomun']}'"
            );
        $existe = $query->count();
        if ($existe) {
            return $existe;
        }
        return 0;
    }

    public function validateIfUseRango($params)
    {
        foreach ($params['nroscntrl'] as $nroscntrl) {
            $nroctrl = (int)str_replace('-', '', $nroscntrl['nrocontrol']);
            $query = Doctrine_Query::create()
                ->from('DatSecnrocontrolautomatico')
                ->where(
                    " {$nroctrl} between cast(replace(nrocontrolinicial, '-', '') as int) "
                    . "and cast(replace(nrocontrolfinal, '-', '') as int) "
                    . "and idestructuracomun = {$params['idestructuracomun']}"
                );
            $existe = $query->count();
            if ($existe) {
                return $existe;
            }
        }
        return 0;
    }

}
