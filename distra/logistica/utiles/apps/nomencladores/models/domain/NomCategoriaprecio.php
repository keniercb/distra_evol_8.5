<?php

class NomCategoriaprecio extends BaseNomCategoriaprecio
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatCategoriaprecioEntidad', array('local'   => 'idcategoriaprecio',
                                               'foreign' => 'idcategoriaprecio')
        );
        $this->hasMany(
            'DatCuentadesgloceprecio', array('local'   => 'idcategoriaprecio',
                'foreign' => 'idcategoriaprecio')
        );
    }

    public function getCategoriaPrecio($identidad)
    {
        $query = new Doctrine_Query();
        $query->select(
            'nc.idcategoriaprecio, nc.denominacion'
        )//, nc.concepto, nc.porciento, nc.conformaprecio, nc.estado, nc.actual
        ->from('NomCategoriaprecio nc')->innerJoin(
            'nc.DatCategoriaprecioEntidad dcpe'
        )->where("dcpe.idestructuracomun =?", $identidad);

        return array('datos'    => $query->fetchArray(),
                     'cantidad' => $query->count());
    }

    public function getQueryCategoriaPrecio()
    {
        $query = new Doctrine_Query();

        $query->select(
            'm.idcategoriaprecio,
             m.denominacion,
             m.concepto,
             m.porciento,
             m.conformaprecio,
             m.estado,
             m.fechafin,
             m.fechainicio,
             m.aplicartodos,
             m.idmoneda as moneda,
             dcpe.idcategoriaprecioentidad as idcategoriaprecioentidad,
             coalesce(m.idtipo,0) as idtipo,
             (SELECT nm.codigoiso FROM NomMoneda nm WHERE nm.idmoneda = m.idmoneda) as isomoneda'
        )
            ->from('NomCategoriaprecio m')
            ->innerJoin('m.DatCategoriaprecioEntidad dcpe');
        return $query;
    }

    public function devolverCategoriasEntidad($idestructura)
    {
        $query = new Doctrine_Query();
        $query->select('nc.idcategoriaprecio, nc.denominacion')
            ->from('NomCategoriaprecio nc')
            ->innerJoin('nc.DatCategoriaprecioEntidad dce')
            ->where("dce.idestructuracomun =?", $idestructura);
        return array('datos'    => $query->fetchArray(),
                     'cantidad' => $query->count());
    }
}