<?php

class DatErogacionliquido extends BaseDatErogacionliquido {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($iderogacionliquido) {
        return Doctrine::getTable('DatErogacionliquido')->find($iderogacionliquido)->toArray();
    }

    public function adicionarLiquido($params, $arrel, $objLiquido) {
        $objdatoinversion = $objLiquido ? $objLiquido : new DatErogacionliquido();

        $objdatoinversion->idinversion = $params['id'];
        $objdatoinversion->idmonedaentidad = $arrel['idmoneda'];
        $objdatoinversion->valor = $arrel['valor'];
        $objdatoinversion->save();
        return 1;
    }

    public function EliminarLiquidos($parametros) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatErogacionliquido')
                        ->whereIn('iderogacionliquido', $parametros['iderogacionliquido'])
                        ->execute();
        return false;
    }

}

