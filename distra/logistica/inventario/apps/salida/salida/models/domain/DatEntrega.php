<?php

class DatEntrega extends BaseDatEntrega
{
    public function setUp()
    {
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasMany('DatDocumentoCliente', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasMany('DatMovimientos', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        parent::setUp();
    }

    /**
     * @param Doctrine_Query $query
     * @param array $filtro [Opcional]
     * @return Doctrine_Query
     */
    public function getJoinDatEntrega(Doctrine_Query $query, $filtro)
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatDocumentoprim',
            'properties' => array('local' => 'iddoc', 'foreign' => 'iddoc')
        );
        LogisticaDoctrineHelper::__init()->tryInyectRelactions(new DatDocumento(), $relations);
        $query->addSelect(
                "e.iddestino AS iddestino, e.origen AS origen, e.cicliente AS cicliente, "
                . "e.nombrecliente AS nombrecliente, e.cargocliente AS cargocliente, e.nombrefirma AS nombrefirma, "
                . "e.casilla AS casilla, e.cantbulto AS cantbulto, e.version AS version, d2.iddoc AS iddocPadre, "
                . "(SELECT array_to_string(array_agg(d3.nroDoc), ', ') FROM DatDocumento d3 "
                . "INNER JOIN d3.DatDocumentoPadre dp2 ON (dp2.idpadre = d3.iddocumento) "
                . "WHERE dp2.iddocumento = d.iddocumento) AS nroDocPadre, d2.fechacontable AS fechacontablePadre, "
                . "nprm.denominacion AS tipodocumento, nprm.abreviatura AS abreviatura, e.idcuenta AS idcuenta, "
                . "e.idcuentaalternativa AS idcuentaalternativa"
            )
            ->innerJoin("d.DatEntrega e")
            ->innerJoin("d.DatDocumentoprim dprm")
            ->innerJoin("dprm.NomDocprim nprm")
            ->leftJoin("d.DatDocumentoPadre dp")
            ->leftJoin("dp.DatDocumento d2");
        if ($filtro['idtipodoc']) {
            $tipo = $filtro['idtipodoc'] == 1 ? [2] : [1, 3];
            $query->andWhereIn("e.iddestino", $tipo);
        }
        if ($filtro['centroscosto']) {
            $filtro['centroscosto'] = is_array($filtro['centroscosto']) ?
                $filtro['centroscosto'] : array($filtro['centroscosto']);
            $query->innerJoin("d.DatDocumentoCliente ddc")
                ->addWhere('ddc.tipocliente = 2')
                ->whereIn('ddc.idcliente', $filtro['centroscosto']);
        }
        if (is_array($filtro['ids']) && count($filtro['ids'])) {
            $query->andWhereNotIn("d.iddocumento", $filtro['ids']);
        }
        if ($filtro['idpadre']) {
            $query->innerJoin("d.DatDocumentoPadre ddpa")
            ->addWhere('ddpa.idpadre = ?',array($filtro['idpadre']));
        }
        return $query;
    }

}
