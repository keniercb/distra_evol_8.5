<?php

class DatDocBalanceo extends BaseDatDocBalanceo
{      
    public function setUp()
    {
        $this->hasOne(
            'DatDocumento', array(
                'foreign' => 'iddocumento', 'local' => 'iddocbalanceo'
            )
        );
        $this->hasOne(
            'DatProductosBalanceo', array(
                'foreign' => 'iddocbalanceo', 'local' => 'iddocbalanceo'
            )
        );
        $this->hasOne(
            'DatDocObservaciones', array(
                'foreign' => 'iddocumento', 'local' => 'iddocbalanceo'
            )
        );
        parent::setUp();

        $array[] = array('cardinalidad' => 'one',
                         'relation' => 'DatDocBalanceo',
                         'properties' => array('local' => 'iddocumento',
                                               'foreign' => 'iddocbalanceo'));
        $obj = new DatDocumento();
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($obj, $array);
    }

    public function getJoinDatDocBalanceo(Doctrine_Query $query, $aliasExterno, $aliasLocal = 'ddb'){
      $integrator = ZendExt_IoC::getInstance();
      $integrator->metadatos->obtenerIUEstructura();

      return $query
        ->addSelect("ddpa.iddocumentopadre, array_to_string(array_agg(distinct ddpadre.nrodoc),',') as padres")
        ->addSelect("ddpa.iddocumentopadre, array_to_string(array_agg(distinct (
          SELECT COALESCE(eop.denominacion, e.denominacion)
          FROM NomFilaestruc f 
          LEFT JOIN f.DatEstructuraop eop on eop.idestructuraop = f.idfila and eop.idproyecto = 0
          LEFT JOIN f.DatEstructura e on e.idestructura = f.idfila and e.idproyecto = 0
          WHERE f.idfila = ddpadre.idestructuracomun 
          ) || ' - ' || ddpadre.nrodoc),',') as padres_con_entidad")
         ->addSelect("(SELECT count(dpb.iddocbalanceo)  From DatProductosBalanceo dpb
          where dpb.iddocbalanceo = {$aliasLocal}.iddocbalanceo) as cant_productos") 
        ->innerJoin("{$aliasExterno}.DatDocBalanceo {$aliasLocal}")
        ->addSelect("{$aliasLocal}.fechacreacion as fechacreacion, {$aliasLocal}.fechaaprobacion as fechaaprobacion")
        ->leftJoin("{$aliasLocal}.DatProductosBalanceo pb ON (pb.iddocbalanceo = {$aliasLocal}.iddocbalanceo)")
        ->leftJoin("{$aliasExterno}.DatDocumentoPadre dp ON (dp.iddocumento = {$aliasLocal}.iddocbalanceo)")
        ->leftJoin("dp.DatDocumento ddpadre ON (ddpadre.iddocumento = dp.idpadre)")
        ->leftJoin("ddpadre.DatDocumentocl dcl ON (dcl.iddocumento = ddpadre.iddocumento)")
        ->leftJoin("ddpadre.DatPedido dped ON (dped.iddocumento = ddpadre.iddocumento)")
        ->leftJoin("{$aliasLocal}.DatDocObservaciones dobs ON (dobs.iddocumento = {$aliasLocal}.iddocbalanceo)")
        ->groupBy("{$aliasExterno}.iddocumento, {$aliasLocal}.iddocbalanceo");
    }

    public function addFiltersQueryDocBalanceo(Doctrine_Query $dql, $parametros, $aliasExterno, $aliasLocal = 'ddb')
    {
        if ($parametros['nroDoc']) {
            $dql->addWhere("ddpadre.nrodoc = ? ", array($parametros['nroDoc']));
        }
        if ($parametros['estado']) {
            $dql->addWhere("{$aliasExterno}.estado = ? ", array($parametros['estado']));
        }
        if ($parametros['desde']) {
            $dql->addWhere("{$aliasExterno}.fechacontable >= ? ", array($parametros['desde']));
        }
        if ($parametros['hasta']) {
            $dql->addWhere("{$aliasExterno}.fechacontable <= ? ", array($parametros['hasta']));
        }
        if ($parametros['idproducto']) {
            $dql->addWhere("pb.idindicador = ? ", array($parametros['idproducto']));
        }
        if ($parametros['idnomconcepto']) {
            $dql->addWhere("dped.idnomconcepto = ? ", array($parametros['idnomconcepto']));
        }
        if ($parametros['entidaddestino']) {
            $dql->addWhere("ddpadre.idestructuracomun = ? ", array($parametros['entidaddestino']));
        }
        if ($parametros['observaciones']) {
            $dql->addWhere("dobs.observaciones ILIKE '%{$parametros['observaciones']}%'");
        }
        if ($parametros['capacidadliquida'] == 'true') {
            $dql->addWhere("dcl.iddocumentocl is not null ");
        }
        return $dql;
    }
}