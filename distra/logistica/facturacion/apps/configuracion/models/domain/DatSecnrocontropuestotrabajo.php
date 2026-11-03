<?php

class DatSecnrocontropuestotrabajo extends BaseDatSecnrocontropuestotrabajo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomPuestotrabajo',
            array(
                'local'   => 'idpuestotrabajo',
                'foreign' => 'idpuestotrabajo'
            )
        );
    }

    /**
     * Funcion que cargar los datos de numero de control
     *
     * @param array $params Arreglo con los parametros necesarios
     *
     * @return array Retorna datos y cantidad de elementos
     */
    public function loadSecuenciaNumeroControl($parametros)
    {
        $query = Doctrine_Query::create();
        $query->select('*')
            ->from('DatSecnrocontropuestotrabajo dsca')
            ->where("dsca.idpuestotrabajo =?", array($parametros['idpuestotrabajo']));
        $datos = $query->offset($parametros['start'])->limit($parametros['limit'])->fetchArray();
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
    public function existsSecuenciaNumeroControl($params)
    {
        $nroinicio = $params['nroinicio'];
        $nrofin = $params['nrofin'];
        $idpuest = $params['idpuestotrabajo'];
        $query = Doctrine_Query::create();
        $query->from('DatSecnrocontropuestotrabajo ta')
            ->where(
                " (ta.nroinicio <= '$nrofin') and (ta.nrofin >= "
                . "'$nroinicio') and ta.idpuestotrabajo= '$idpuest'"
            );
        if ($params['idsecuenciapuestotrabajo']) {
            $query->addWhere(
                'ta.idsecuenciapuestotrabajo <> ?', array($params['idsecuenciapuestotrabajo'])
            );
        }
        return $query->count();
    }

    public function existsSecuenciaNumeroControlAux($params)
    {
        $nroinicio = (int)str_replace('-', '', $params['nrocontrolinicial']);
        $nrofin = (int)str_replace('-', '', $params['nrocontrolfinal']);
        $query = Doctrine_Query::create()
            ->from('NomPuestotrabajo npt')
            ->innerjoin('npt.DatSecnrocontropuestotrabajo ta')
            ->where(
                "(({$nroinicio} between cast(replace(ta.nroinicio, '-', '') as int) "
                . "and cast(replace(ta.nrofin, '-', '') as int)) "
                . "or ({$nrofin} between cast(replace(ta.nroinicio, '-', '') as int) "
                . "and cast(replace(ta.nrofin, '-', '') as int))) "
                . "and npt.idestructuracomun = {$params['idestructuracomun']}"
            );
        return $query->count();
    }

    public function existsSecuenNroCtrl($params)
    {
        foreach ($params['idsecuenciapuestotrabajo'] as $idsecuenciapuestotrabajo) {
            $existe = $this->existsSecuenciaNroCtrl($params, $idsecuenciapuestotrabajo);
            if ($existe) {
                return $existe;
            }
        }
        return 0;
    }

    public function existsSecuenciaNroCtrl($params, $idsecuenciapuestotrabajo)
    {
        foreach ($params['nroscntrl'] as $nroscntrl) {
            $nrocontrol = (int)str_replace('-', '', $nroscntrl['nrocontrol']);
            $query = Doctrine_Query::create()
                ->from('DatSecnrocontropuestotrabajo')
                ->where(
                    "{$nrocontrol} between cast(replace(nroinicio, '-', '') as int) "
                    . "and cast(replace(nrofin, '-', '') as int) "
                    . "and idsecuenciapuestotrabajo = {$idsecuenciapuestotrabajo}"
                )
                ->count();
            if ($query) {
                return $query;
            }
        }
        return 0;
    }

}
