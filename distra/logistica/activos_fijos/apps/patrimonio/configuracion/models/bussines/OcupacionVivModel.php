<?php
/**
 * Created by JetBrains PhpStorm.
 * User: lester
 * Date: 31/07/13
 * Time: 16:41
 * To change this template use File | Settings | File Templates.
 */

class OcupacionVivModel extends NomencladoresGeneralesModel
{

    public function OcupacionVivModel()
    {
        parent::NomencladoresGeneralesModel();
    }

    public function buscar($obj) {
   
        $obj['alias'] = 'mm';       
      
        $arrQuery = parent::buscar($obj, array(), true);
		$data = array();
        $objQuery = $arrQuery['query'];
		$a = $objQuery->fetchArray();
        foreach ($a as $key => $value) {
            $data[] = $value;
            if ($value['estado'] == '')
                $data[$key]['estado'] = 1;
            }
        return array('cantidad' => $objQuery->count(), 'datos' => $data);
    }

}