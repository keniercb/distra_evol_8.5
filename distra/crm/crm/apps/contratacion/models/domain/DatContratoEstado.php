<?php

class DatContratoEstado extends BaseDatContratoEstado
{

    public function setUp()
    {
        parent::setUp();
    }

    static function getEstadoByParams($params){
        try {
            $query = new Doctrine_Query();
            $query->select('ne.*')
                ->from('DatContratoEstado ne')
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY);

            $where = self::getFilter($params);
            if ($where) {
                $query->where($where);
            }
            return $query->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getFilter($params)
    {
        $filter = [];
        foreach ($params as $key => $value) {
            if($value == 'isnull'){
                $filter[] = $key .' '. $value;
            }else{
                $filter[] = $key . '=' . $value;
            }

        }
        return implode(' AND ', $filter);
    }
}
