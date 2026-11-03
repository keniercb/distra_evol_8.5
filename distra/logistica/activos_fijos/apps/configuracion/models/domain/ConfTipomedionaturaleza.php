<?php

/**
 *
 */
class ConfTipomedionaturaleza extends BaseConfTipomedionaturaleza
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

    /**
     *
     */
    public function getConfigNaturaleza($params)
    {

        $query = new Doctrine_Query();

        if ($params->tipo) {
            $query->addWhere('cn.tipo = ?', $params->tipo);
        }

        if ($params->limit) {
            $query->offset($params->start);
            $query->limit($params->limit);
        }

        $query->from('ConfTipomedionaturaleza cn');

        return $query->fetchArray();
    }

    /**
     *
     */
    public function existsNaturaleza($params)
    {
        $query = new Doctrine_Query();

        if ($params['idnaturaleza']) {
            $query->addWhere('cn.idnaturaleza =?', array($params['idnaturaleza']));
        }

        $query->from('ConfTipomedionaturaleza cn');

        return $query->count();
    }

    /**
     *
     */
    public function getCountConfigNaturaleza($params)
    {
        $query = new Doctrine_Query();

        if ($params->tipo) {
            $query->addWhere('cn.tipo =?', $params->tipo);
        }

        $query->from('ConfTipomedionaturaleza n');

        return $query->count();
    }

    /**
     *
     */
    public function getArrayNaturalezas($tipoDeUnidad = false)
    {
        $query = new Doctrine_Query();
        $query->select('cn.idnaturaleza')
            ->from('ConfTipomedionaturaleza cn');

        if ($tipoDeUnidad) {
            $query->addWhere('cn.tipo = ?', array($tipoDeUnidad));
        }

        $respuesta = array();
        foreach ($query->fetchArray() as $value) {
            array_push($respuesta, $value['idnaturaleza']);
        }

        return $respuesta;
    }

    /**
     *
     */
    public function loadNaturaleza($params)
    {
        $query = new Doctrine_Query();
        if ($params['tipo']) {
            $query->addWhere('cn.tipo = ?', $params['tipo']);
        }

        $query->from('ConfTipomedionaturaleza cn');
        $cantidad = $query->count();
        if ($params['limit']) {
            $query->offset($params['start'])->limit($params['limit']);
        }
        return array('datos' => $query->fetchArray(), 'cantidad' => $cantidad);
    }

}
