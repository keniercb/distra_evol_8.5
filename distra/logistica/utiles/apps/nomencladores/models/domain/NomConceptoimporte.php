<?php

class NomConceptoimporte extends BaseNomConceptoimporte
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatConceptoimporteEntidad', array('local'   => 'idconceptoimporte',
                                               'foreign' => 'idconceptoimporte')
        );
    }

    public function getConceptoImporte($identidad)
    {
        $query = new Doctrine_Query();
        $query->select(
            'nc.idconceptoimporte, nc.denominacion'
        )//, nc.concepto, nc.porciento, nc.conformaprecio, nc.estado, nc.actual
        ->from('NomConceptoimporte nc')->innerJoin(
            'nc.DatConceptoimporteEntidad dcpe'
        )->where("dcpe.idestructuracomun =?", $identidad);

        return array('datos'    => $query->fetchArray(),
                     'cantidad' => $query->count());
    }

    public function getQueryConceptoImporte()
    {
        $query = new Doctrine_Query();

        $query->select(
            'm.idcategoriaprecio as idconceptoimporte,
             m.denominacion,
             m.concepto,
             m.porciento,
             m.estado,
             m.fechafin,
             m.fechainicio,
             m.idmoneda as moneda,
             dcpe.idcategoriaprecioentidad as idconceptoimporteentidad,
             coalesce(m.idtipo,0) as idtipo'
        )
            ->from('NomCategoriaprecio m')
            ->innerJoin('m.DatCategoriaprecioEntidad dcpe')
            ->addWhere('m.conformaprecio = ?', array(0));
        return $query;
    }

    public function devolverConceptoImporteEntidad($idestructura)
    {
        $query = new Doctrine_Query();
        $query->select('nc.idconceptoimporte, nc.denominacion')
            ->from('NomConceptoimporte nc')
            ->innerJoin('nc.DatConceptoimporteEntidad dce')
            ->where("dce.idestructuracomun =?", $idestructura);
        return array('datos'    => $query->fetchArray(),
                     'cantidad' => $query->count());
    }
}