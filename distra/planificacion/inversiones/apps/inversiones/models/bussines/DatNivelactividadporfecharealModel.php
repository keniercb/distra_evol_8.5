<?php

class DatNivelactividadporfecharealModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardat_nivelactividadporfechareal($dat_nivelactividadporfechareal)
    {
        $dat_nivelactividadporfechareal->save();
    }

    public function modificardat_nivelactividadporfechareal($dat_nivelactividadporfechareal)
    {
        $dat_nivelactividadporfechareal->save();
    }

    public function eliminardat_nivelactividadporfechareal($dat_nivelactividadporfechareal)
    {
        $dat_nivelactividadporfechareal->delete();
    }

    public function estadoActividad($params)
    {
        if ($params['fin'] == 1) {
            $data = DatNivelactividadporfechareal::finalizada($params);
            if ($data[0] != null) {
                return array('codMsg' => 2);
            }
        }
        $datnivel = Doctrine::getTable('DatNivelactividadporfechareal')->find($params['idnivelactividadporfechareal']);
        $datnivel->fin = $params['fin'];
        $datnivel->save();
        return array('codMsg' => 24);
    }

}

?>
