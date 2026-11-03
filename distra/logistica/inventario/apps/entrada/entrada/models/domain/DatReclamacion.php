<?php

class DatReclamacion extends BaseDatReclamacion
{
    public function setUp()
    {
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('DatDocumentoPadre', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasMany('DatMovimientos', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        parent::setUp();
    }

    /**
     * @param Doctrine_Query $query
     * @param array $filtros
     * @param string $aliasExterno
     * @param string $aliasLocal
     */
    public function getJoinDatReclamacion(Doctrine_Query $query, $filtros, $aliasExterno = 'd')
    {
        $query->addSelect(
                "r.aceptada AS aceptada, r.viatransporte AS viatransporte, rec.iddocumento AS idrecepcion, "
                . "d2.nrodoc AS nrorecepcion, d2.idoperacion AS idoperacionrec, rec.fechadocorigen AS fechadocorigen, "
                . "rec.nrodocorigen AS nrodocorigen, rec.nrocontrato AS nrocontrato, dc2.idcliente AS idcliente, "
                . "rec.fechacontrato AS fechacontrato, dc2.tipocliente AS tipocliente, "
                . "d2.fechacontable AS fechacontablerec, (CASE WHEN coalesce((SELECT count(_mr.idmovimiento) FROM DatMovrecepcion _mr "
                . "INNER JOIN _mr.DatMovimientos _m ON _m.idmovimiento = _mr.idmovimiento "
                . "WHERE _m.iddocumento = rec.iddocumento), 0) > 0 THEN 1 END) AS porfactura, r.tiporeclamacion as tiporeclamacion"
            )
            ->innerJoin("{$aliasExterno}.DatReclamacion r")
            ->innerJoin("r.DatDocumentoPadre dp")
            ->innerJoin("dp.DatDocumento d2 ON (d2.iddocumento = dp.idpadre)")
            ->innerJoin("d2.DatRecepcion rec")
            ->innerJoin("d2.DatDocumentoCliente dc2");
        if ($filtros['nrodocrecepcion'] || $filtros['annorecepcion']) {
            if ($filtros['nrodocrecepcion']) {
                $query->addWhere("d2.nrodoc = ?", array($filtros['nrodocrecepcion']));
            }
            if ($filtros['annorecepcion']) {
                $query->addWhere("d2.anno = ?", array($filtros['annorecepcion']));
            }
        }
    }

}
