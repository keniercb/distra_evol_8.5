<?php

class DatValedevolucion extends BaseDatValedevolucion
{
    public function setUp()
    {
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasMany('DatMovimientos', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        parent::setUp();
    }

    /**
     * @param Doctrine_Query $query
     * @param array $filtro
     * @param string $aliasExterno
     */
    public function getJoinDatValedevolucion(Doctrine_Query $query, $filtro, $aliasExterno)
    {
        $query->addSelect('dc.idcliente AS idcliente, dc.tipocliente, dp.idpadre as idpadre, 
        COALESCE((SELECT df.nrofactura FROM DatDocfactura df WHERE df.idfactura = d2.iddocumento),d2.nrodoc) AS nroVale, ndp.denominacion as tipodocorigen')
            ->innerJoin("{$aliasExterno}.DatDocumentoCliente dc")
            ->innerJoin("{$aliasExterno}.DatDocumentoPadre dp")
            ->innerJoin("dp.DatDocumento d2 ON (dp.idpadre = d2.iddocumento)")
            ->innerJoin("d2.DatDocumentoprim ddp")
            ->innerJoin("ddp.NomDocprim ndp");
        if ($filtro['tieneorigen']) {
            $tabla = $filtro['tieneorigen'] == 1 ? 'DatEntrega' : 'DatDocfactura';
            $query->innerJoin("d2.{$tabla} _as");
        }
    }

}
