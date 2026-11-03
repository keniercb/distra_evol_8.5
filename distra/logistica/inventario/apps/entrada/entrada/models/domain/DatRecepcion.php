<?php

class DatRecepcion extends BaseDatRecepcion
{
    public function setUp()
    {
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('DatDocumentoPadre', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('DatRecepcionSolicitud', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasMany('DatMovimientos', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('NomMoneda', array('local' => 'idmoneda', 'foreign' => 'idmoneda'));
        if (class_exists('DatRecepcionreserva')) {
            $this->hasOne('DatRecepcionreserva', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        }
        parent::setUp();
    }

    /**
     * @param Doctrine_Query $query
     * @param array $filtro
     * @param string $aliasExterno
     */
    public function getJoinDatRecepcion(Doctrine_Query $query, $filtro, $aliasExterno)
    {
        $query->addSelect(
                'r.fechadocorigen AS fechadocorigen, r.nrodocorigen AS nrodocorigen, r.nrocontrato AS nrocontrato, '
                . 'r.fechacontrato AS fechacontrato, r.tipopago AS tipopago, r.recargo AS recargo, '
                . 'r.descuento AS descuento, r.recargoalternativo AS recargoalternativo, '
                . 'r.descuentoalternativo AS descuentoalternativo, dp.idpadre AS idpadre, dsp.idsolicitudpadre AS idsolicitudpadre, '
                . 'coalesce((SELECT sum(m2.importecontable) FROM DatMovimientos m2 '
                . "WHERE m2.iddocumento = d.iddocumento) + (CASE WHEN r.salidafactura = 1 or d.estado = 1 THEN COALESCE((SELECT SUM(COALESCE(dci.valormn,0)) FROM DatConceptoimporterecep dci WHERE dci.iddocumento = {$aliasExterno}.iddocumento),0) ELSE 0 END), 0) AS importecontable, "
                . 'coalesce((SELECT sum(m3.importealternativo) FROM DatMovimientos m3 '
                . "WHERE m3.iddocumento = d.iddocumento) + (CASE WHEN r.salidafactura = 1 or d.estado = 1 THEN COALESCE((SELECT SUM(COALESCE(dci1.valoralt,0)) FROM DatConceptoimporterecep dci1 WHERE dci1.iddocumento = {$aliasExterno}.iddocumento),0) ELSE 0 END), 0) AS importealternativo, "
                . 'd.idestructuracomun AS iddeposito, r.idcondicionpago AS idcondicionpago, r.cantbulto AS cantbulto, '
                . 'r.tipobulto AS tipobulto, r.tasa AS tasa, r.salidafactura as salidafactura, '
                . 'nm.idmoneda AS idmoneda, nm.codigoiso as codigoiso,'
                . 'r.idcontrato AS idcontrato, r.bl as bl, r.idpuertodestino as idpuertodestino, r.puertodestino as puertodestino,'
                . 'r.destinocomercial AS destinocomercial, r.prodgenerico as prodgenerico, r.contenedor as contenedor'
            )
            ->innerJoin("{$aliasExterno}.DatRecepcion r")
            ->leftJoin("{$aliasExterno}.DatDocumentoPadre dp")
            ->leftJoin("{$aliasExterno}.DatRecepcionSolicitud dsp")
            ->leftJoin("r.NomMoneda nm");
        if ($filtro['docorigen']) {
            $query->addWhere('r.nrodocorigen = ?', $filtro['docorigen']);
        }
    }

    /**
     * @param Doctrine_Query $query
     * @param string $aliasExterno
     */
    public function getJoinDatRecepcionReserva(Doctrine_Query $query, $aliasExterno)
    {
        $query->addSelect('rr.usareserva AS usareserva, rr.numero AS numeroDoc, rr.concepto AS concepto')
            ->leftJoin("{$aliasExterno}.DatRecepcionreserva rr");
    }

}
