<?php

class NomTipocontenido extends BaseNomTipocontenido
{

    public function setUp()
    {
        parent::setUp();
        $this->HasMany(
            'DatContenido',
            array('local' => 'idtipocont', 'foreign' => 'idtipocont')
        );
    }

    static function cargarTipoContenidosDenom($denominacion, $limit, $start)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('denominacion, idtipocont')
            ->from('NomTipocontenido')
            ->where("denominacion like '%$denominacion%'")
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->orderby('denominacion')
            ->execute();

        return $datos;
    }

    static function cantidadTipoContenidosDenom($denominacion)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('count(idtipocont) cant')
            ->from('NomTipocontenido')
            ->where("denominacion like '%$denominacion%'")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();

        return $datos[0]['cant'];
    }

    static function cargarTipoContenidos($start = 0, $limit = 10)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('denominacion, idtipocont, viaenvio')
            ->from('NomTipocontenido')
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->orderby('denominacion')
            ->execute();

        return $datos;
    }

    static function cantidadTipoContenidos()
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('count(idtipocont) cant')
            ->from('NomTipocontenido')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();

        return $datos[0]['cant'];
    }

    static function eliminarTipoContenidos($array)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('NomTipocontenido')
            ->whereIn('idtipocont', $array)
            ->execute();
    }

    static function getId($name)
    {
        $query = Doctrine_Query::create();
        $id = $query->select('idtipocont id')
            ->from('NomTipocontenido')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->where('denominacion = ?', $name)
            ->execute();

        return $id[0]['id'];
    }

}
