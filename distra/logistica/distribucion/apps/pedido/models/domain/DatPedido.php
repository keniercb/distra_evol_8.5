<?php

class DatPedido extends BaseDatPedido
{

    public function setUp()
    {
        $this->hasOne(
            'DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->hasMany(
            'DatProductopedido', array('local' => 'iddocumento', 'foreign' => 'idpedido')
        );
        $this->hasMany(
            'DatReclamopedido', array('local' => 'iddocumento', 'foreign' => 'idpedido')
        );
        if (class_exists('DatDistribucionpedido')) {
            $relations[] = array('cardinalidad' => 'many', 'relation' => 'DatPedido',
                'properties' => array('local' => 'idpedido', 'foreign' => 'iddocumento'));
            LogisticaDoctrineHelper::__init()
                ->tryInyectRelactions(
                    new DatDistribucionpedido(), $relations
                );
        }
        parent::setUp();
    }

    public function getJoinDatPedido(Doctrine_Query $query, $aliasExterno, $aliasLocal = 't', $aliaspp = 'dpp')
    {
        return $query->innerJoin("{$aliasExterno}.DatPedido {$aliasLocal}")
            ->leftJoin("{$aliasLocal}.DatProductopedido {$aliaspp}");

    }

    public function addFiltersQueryPedido(Doctrine_Query $dql, $parametros, $aliaspp = 'dpp', $aliasLocal = 't')
    {
        if ($parametros['estadoejecucion']) {
            $dql->addWhere("{$aliaspp}.estado = ? ", array($parametros['estadoejecucion']));
        }
        if ($parametros['distribucion']) {
            $dql->addWhere("{$aliaspp}.servicio = 0");
            if(!$parametros['iddocumento']){
                $dql->andWhere(
                    "(SELECT SUM(n.cantidad - n.distribuido) FROM DatProductopedido n WHERE n.idpedido = {$aliasLocal}.iddocumento ) > 0"
                );
            }
            if ($parametros['idseleccionados']) {
                $dql->whereNotIn("{$aliasLocal}.iddocumento", $parametros['idseleccionados']);
            }
        }
        if ($parametros['talleres']) {
            $dql->addWhere("{$aliaspp}.servicio = 1");
            $dql->addWhere("{$aliaspp}.estado = 2");
        }
        if ($parametros['fechavencimiento']) {
            $dql->addWhere("{$aliasLocal}.fechavencimiento = ? ", array($parametros['fechavencimiento']));
        } elseif ($parametros['fecha']) {
            $dql->addWhere("{$aliasLocal}.fechavencimiento >= ? ", array($parametros['fecha']));
        }
        if ($parametros['idpedido']) {
            $dql->addWhere("{$aliasLocal}.iddocumento = ? ", array($parametros['idpedido']));
        }
        if ($parametros['avanidcontrato']) {
            $dql->addWhere("{$aliasLocal}.idcontrato= ? ", array($parametros['avanidcontrato']));
        }
        if ($parametros['idtiporeclamo']) {
            $dql->innerJoin("{$aliasLocal}.DatReclamopedido drp");
            $dql->addWhere("drp.idtiporeclamoentidad = ? ", array($parametros['idtiporeclamo']));
        }
        if ($parametros['nroDoc']) {
            $dql->addWhere("ddpadre.nrodoc = ? ", array($parametros['nroDoc']));
        }
        if ($parametros['tipodoc']) {
            if ($parametros['tipodoc'] == 1) {
                $dql->addWhere("ndprim.denominacion ILIKE '%Oferta%'");
            }
           if ($parametros['tipodoc'] == 2) {
            $dql->addWhere("ndprim.denominacion ILIKE '%Orden de trabajo%'");
            }
            if ($parametros['tipodoc'] == 3) {
                $dql->addWhere("ndprim.denominacion ILIKE '%Pedido%'");
            };
            if ($parametros['tipodoc'] == 4) {
                $dql->addWhere("ndprim.denominacion ILIKE '%Cita%'");
            };
            if ($parametros['tipodoc'] == 5) {
                $dql->addWhere("ndprim.denominacion ILIKE '%ABC%'");
            };
        }
        if ($parametros['idnomconcepto']) {
            $dql->addWhere("{$aliasLocal}.idnomconcepto = ? ", array($parametros['idnomconcepto']));
        }
        if ($parametros['desde']) {
            $dql->addWhere("d.fechacontable >= ? ", array($parametros['desde']));
        }
        if ($parametros['hasta']) {
            $dql->addWhere("d.fechacontable <= ? ", array($parametros['hasta']));
        }
        return $dql;
    }

    public function getDatosPedido(Doctrine_Query $query, $datosDoc, $aliasLocal, $aliaspp)
    {
        if ($datosDoc['numero']) {
            $query->addWhere('d.nrodoc = ?', $datosDoc['numero']);
        }
        if ($datosDoc['idestado']) {
            $query->addWhere('d.estado = ?', $datosDoc['idestado']);
        }
        if(isset($datosDoc['capacidadliquida'])){
            if (($datosDoc['capacidadliquida'])) {
                $query->addWhere("{$aliasLocal}.capacidadliquida = ?", 1);
            } else {
                $query->addWhere("{$aliasLocal}.capacidadliquida = ?", 0);
            }
        }
        /*if (!$datosDoc['capacidadliquida']) {
            $query->addWhere("{$aliasLocal}.capacidadliquida is null or {$aliasLocal}.capacidadliquida = ?", 0);
        } */
        $query->addSelect(
            "(SELECT COUNT(_dpp.idpedido) FROM DatProductopedido _dpp "
            . "WHERE _dpp.idpedido = {$aliasLocal}.iddocumento and _dpp.servicio = 0) as productos "
        );
        $query->addSelect(
            "(SELECT COUNT(_dpps.idpedido) FROM DatProductopedido _dpps "
            . "WHERE _dpps.idpedido = {$aliasLocal}.iddocumento and _dpps.servicio = 1) as servicios "
        );
        $query->addSelect(
            "(SELECT COUNT(_drp.idpedido) FROM DatReclamopedido _drp "
            . "WHERE _drp.idpedido = {$aliasLocal}.iddocumento) as reclamos "
        );
        $query->addSelect(
            "(SELECT SUM(_dppd.cantidad) FROM DatProductopedido _dppd "
            . "WHERE _dppd.idpedido = {$aliasLocal}.iddocumento ) as cantidadTotal "
        );
        $query->addSelect(
            "(Case when (SELECT Count(__dppd.estado) FROM DatProductopedido __dppd "
            . "WHERE __dppd.idpedido = {$aliasLocal}.iddocumento and __dppd.estado = 1)>0 then 1"
            ." WHEN (SELECT Count(__dppd1.estado) FROM DatProductopedido __dppd1 "
            ." WHERE __dppd1.idpedido = {$aliasLocal}.iddocumento and __dppd1.estado = 3)>0 then 3"
            ." WHEN (SELECT Count(__dppd2.estado) FROM DatProductopedido __dppd2"
            ." WHERE __dppd2.idpedido = {$aliasLocal}.iddocumento and __dppd2.estado = 2)>0 then 2"
            ." WHEN (SELECT Count(__dppd3.estado) FROM DatProductopedido __dppd3"
            ." WHERE __dppd3.idpedido = {$aliasLocal}.iddocumento and __dppd3.estado = 4)>0 then 4"
            ." else 0 end) as estadopedido "
        );
        return $query->addSelect(
            "{$aliasLocal}.fechavencimiento as fechavencimiento,
             {$aliasLocal}.idnomconcepto as idnomconcepto,
             {$aliasLocal}.idcontrato as idcontrato,
             {$aliasLocal}.capacidadliquida as capacidadliquida,
             {$aliasLocal}.iddocumento,
             {$aliaspp}.*,
             {$aliaspp}.cantidad as cantidad,
            ({$aliaspp}.cantidad- {$aliaspp}.distribuido) as distribuir"
        );
    }


}


