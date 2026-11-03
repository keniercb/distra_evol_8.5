<?php

class DatEvalescalavalorescualitativos extends BaseDatEvalescalavalorescualitativos {

    public function setUp() {
        parent::setUp();
        $this->hasMany('DatEvalescala', array('local' => 'idescala', 'foreign' => 'idescala'));
        $this->hasMany('NomEvalvalorescualitativos', array('local' => 'idvalorescualitativos', 'foreign' => 'idvalorescualitativos'));
    }

    public function Buscar($idescalavalorescualitativos) {
        $temp = $this->conn->getTable('DatEvalescalavalorescualitativos')->find($idescalavalorescualitativos);
        return $temp->toArray();
    }

    function exiteValorCualitativoInEscala($idvalorescualitativos, $idescala) {
         $queryObj = Doctrine_Query::create()
            ->select('idescalavalorescualitativos')
            ->from('DatEvalescalavalorescualitativos')
            ->where('idescala = ? and idvalorescualitativos = ?', array($idescala, $idvalorescualitativos));
         return $queryObj->fetchArray();
    }

    public function obtenerEscalaValorCualitativo($idescalavalorescualitativos) {
        return $DatMetadato = Doctrine::getTable('DatEvalescalavalorescualitativos')->find($idescalavalorescualitativos);
    }

    //Devuelve la cantidad de valores cualitativos por escala
    public function cantValorCualitativoXEscala($idescala) {
        $query = new Doctrine_Query ();
        $result = $query->select('COUNT(vc.idescala) as cantidad')
                ->from('DatEvalescalavalorescualitativos vc')
                ->where('vc.idescala = ?', $idescala)
                ->execute();
        $result = $result->toArray();
        return $result[0]['cantidad'];
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalescalavalorescualitativos')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalescalavalorescualitativos')->limit($limite)->offset($inicio)->execute();
        return $result->toArray();
    }

    public function ValorCualitativoEnUso($idvc) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalescalavalorescualitativos')
                ->where("idvalorescualitativos='$idvc'")
                ->execute();
        return $result->toArray();
    }

    public function GetEscalaValoresPoridescala($id) {
        $query = new Doctrine_Query();
        $result = $query->select('vc.idescalavalorescualitativos,vc.peso,nvc.idvalorescualitativos as idvalorescualitativos,nvc.denom as denom,nvc.descripcion as descripcion,vc.color as color')
                ->from('DatEvalescalavalorescualitativos vc')
                ->innerJoin('vc.NomEvalvalorescualitativos nvc')
                ->where('vc.idescala=?', $id)
                ->orderBy('vc.peso ASC')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function GetEscalaVaoresPoridescala($id) {
        $query = new Doctrine_Query();
        $result = $query->select('vc.idvalorescualitativos,nvc.denom')
                ->from('DatEvalescalavalorescualitativos vc')
                ->innerJoin('vc.NomEvalvalorescualitativos nvc')
                ->where('vc.idescala=?', array($id))
                ->orderBy('vc.peso')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function getDenomPorId($id) {
        $query = new Doctrine_Query();
        $result = $query->select('vc.idvalorescualitativos,nvc.denom')
                ->from('DatEvalescalavalorescualitativos vc')
                ->innerJoin('vc.NomEvalvalorescualitativos nvc')
                ->where('vc.idescala=? and nvc.idvalorescualitativos=?', array($id['idescala'], $id['idvalorescualitativos']))
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    /**
     * Devuelve el sql con la integracion de las clases DatEvalescalavalorescualitativos y NomEvalvalorescualitativos.
     * @param Doctrine_Query $objDoctrineQuery
     * @param $aliasTablaReferencia
     * @param $aliasTabla
     * @param $includeDqlSelect
     * @return Doctrine_Query
     */
    public function agregarDqlDatosEscala(Doctrine_Query $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $includeDqlSelect) {
        if ($includeDqlSelect) {
            $objDoctrineQuery->addSelect("$aliasTabla.idescalavalorescualitativos AS idescalavalorescualitativos, $aliasTabla.peso AS peso
            , $aliasTabla.color AS color, nevc.denom as denom, nevc.descripcion as descripcion");
        }
        $objDoctrineQuery->leftJoin("$aliasTablaReferencia.DatEvalescalavalorescualitativos $aliasTabla");
        return $objDoctrineQuery->leftJoin("$aliasTabla.NomEvalvalorescualitativos nevc");
    }
}