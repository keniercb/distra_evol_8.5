<?php

/**
 *
 */
class DestinoFinalModel extends NomencladoresModel
{

    /**
     *
     */
    public function DestinoFinalModelModel()
    {
        parent::__construct();
    }

    /**
     *
     */
    public function buscar($obj)
    {
        $obj['alias'] = 'mm';
        $arrQuery = parent::buscar($obj, array(), true);
        $data = array();
        $objQuery = $arrQuery['query'];

        if ($obj['incluirvencidas'] != 2) {//1 es false, 2 true
            $fechacontable = date('d/m/Y');
            $objQuery->addWhere("mm.fechainicio <= '{$fechacontable}' ");
            $objQuery->addWhere("mm.fechafin >= '{$fechacontable}' or mm.fechafin is null");
        }
        $a = $objQuery->fetchArray();
        foreach ($a as $key => $value) {
            $data[] = $value;
            if ($value['estado'] == '') {
                $data[$key]['estado'] = 1;
            }
        }
        return array('cantidad' => $objQuery->count(), 'datos' => $data);
    }

}
