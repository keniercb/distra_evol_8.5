<?php

class DatMonedaContrato extends BaseDatMonedaContrato
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function getByParams($params, $torray = true)
    {
        $where = $this->getFilter($params);
        $query = new Doctrine_Query();
        $query->from('DatMonedaContrato dmc');

        if ($where) {
            $query->where($where);
        }
        $result = $query->execute();
        return $torray ? $result->toArray() : $result;
    }

    public function getFilter($params)
    {
        $filter = [];
        foreach ($params as $key => $value) {
            $filter[] = $key . '=' . $value;
        }
        return implode(' AND ', $filter);
    }
}
