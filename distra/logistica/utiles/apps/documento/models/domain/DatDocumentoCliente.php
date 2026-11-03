<?php

/**
 * Description of DatDocumentoCliente
 *
 * @author Kenier Cumba Bueno
 */
class DatDocumentoCliente extends BaseDatDocumentoCliente
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
    }

    public function existeClienteDocumento($iddocumento, $idcliente, $tipo)
    {
        $existe = LogisticaDoctrineHelper::__init()->query(
            "SELECT count(c.iddocumentocliente) as cantidad "
            . "FROM DatDocumentoCliente c WHERE c.iddocumento = {$iddocumento} "
            . "AND c.tipocliente = {$tipo} AND c.idcliente = {$idcliente}"
        )->toArray();

        return $existe[0]['cantidad'] == 0 ? false : true;
    }

    public function addDqlClientesDocumentos(Doctrine_Query $dql, $asDoc = 'd', $asCliente = 'c', $parametros)
    {
        if($parametros['idcliente']){
            $cliente = (is_array($parametros['idcliente'])) ? "".implode(',', $parametros['idcliente'])."" : $parametros['idcliente'];
        }       
        
        $addWhere = (!$parametros['clienteorden']) ? '' : " AND {$asCliente}.tipocliente = 1";
        $addWhere .= ($parametros['idcliente'] && is_array($parametros['idcliente'])) ? " AND {$asCliente}.idcliente IN ($cliente) " : "";
        $dql->addSelect(
            "(SELECT count({$asCliente}.iddocumentocliente) FROM DatDocumentoCliente {$asCliente} "
            . "WHERE {$asCliente}.iddocumento = {$asDoc}.iddocumento {$addWhere}) as cant_clientes"
        );
        $asCliente .= '_id';
        $addWhere = (!$parametros['clienteorden']) ? '' : " AND {$asCliente}.tipocliente = 1";
        $addWhere .= ($parametros['idcliente'] && is_array($parametros['idcliente'])) ? " AND {$asCliente}.idcliente IN ($cliente) " : "";
        $dql->addSelect(
            "(SELECT {$asCliente}.idcliente FROM DatDocumentoCliente {$asCliente} "
            . "WHERE {$asCliente}.iddocumento = {$asDoc}.iddocumento  {$addWhere} LIMIT 1) as idcliente"
        );
        $asCliente .= '_tipo';
        $addWhere = (!$parametros['clienteorden']) ? '' : " AND {$asCliente}.tipocliente = 1";
        $addWhere .= ($parametros['idcliente'] && is_array($parametros['idcliente'])) ? " AND {$asCliente}.idcliente IN ($cliente) " : "";
        $dql->addSelect(
            "(SELECT {$asCliente}.tipocliente FROM DatDocumentoCliente {$asCliente} "
            . "WHERE {$asCliente}.iddocumento = {$asDoc}.iddocumento  {$addWhere} LIMIT 1) as tipocliente"
        );
    }

    public function addFilterCliente(Doctrine_Query $query, $aliasExterno, $aliasLocal = 'dcc', $parametros = array())
    {
        if ($parametros['idcliente'] || isset($parametros['tipocliente'])) {
            $query->leftJoin("{$aliasExterno}.DatDocumentoCliente {$aliasLocal}");
            if ($parametros['idcliente'] && !is_array($parametros['idcliente'])) {
                $parametros['idcliente'] = array($parametros['idcliente']);
            }
            if (count($parametros['idcliente']) > 0) {
                $query->andWhereIn("{$aliasLocal}.idcliente", $parametros['idcliente']);
            }
            if (isset($parametros['tipocliente'])) {
                $query->addWhere("{$aliasLocal}.tipocliente = ?", array($parametros['tipocliente']));
            }
        }
    }

}
