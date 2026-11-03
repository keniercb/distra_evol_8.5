<?php

class NomTipoaviso extends BaseNomTipoaviso
{

    /**
     * @todo add a boolean field in the phisic table.
     */
    const DEFAULT_TYPE = "información";

    public function setUp()
    {
        parent::setUp();
        $this->HasMany(
            'DatAviso',
            array('local' => 'idtipoaviso', 'foreign' => 'idtipoaviso')
        );
    }

    static function cargarTipoAvisosDenom($denominacion, $limit, $start)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'bodyclass, denominacion, headertext, iconclass, idtipoaviso'
        )
            ->from('NomTipoaviso')
            ->where("denominacion like '%$denominacion%'")
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->orderby('denominacion')
            ->execute();

        return $datos;
    }

    static function cantidadTipoAvisosDenom($denominacion)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('count(idtipoaviso) cant')
            ->from('NomTipoaviso')
            ->where("denominacion like '%$denominacion%'")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();

        return $datos[0]['cant'];
    }

    static function cargarTipoAvisos($start, $limit)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'bodyclass, denominacion, headertext, iconclass,
             idtipoaviso, descripcion'
        )
            ->from('NomTipoaviso')
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->orderBy('denominacion')
            ->execute();

        return $datos;
    }

    static function cantidadTipoAvisos()
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('count(idtipoaviso) cant')
            ->from('NomTipoaviso')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();

        return $datos[0]['cant'];
    }

    static function eliminarTipoAvisos($array)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('NomTipoaviso')
            ->whereIn('idtipoaviso', $array)
            ->execute();
    }

    public function getIdByName($name)
    {
        $tipoAviso = $this->getByParam('denominacion', $name);

        return $tipoAviso[0]['idtipoaviso'];
    }

    public static function getDefault()
    {
        return Doctrine:: getTable(__CLASS__)->findOneByDenominacion(
            ucfirst(self::DEFAULT_TYPE)
        )->idtipoaviso;
    }
}