<?php

class DatNivelactividadporfecharealModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatNivelactividadporfechareal($datNivelactividadporfechareal
    )
    {
        $datNivelactividadporfechareal->save();
    }

    public function modificardatNivelactividadporfechareal($datNivelactividadporfechareal
    )
    {
        $datNivelactividadporfechareal->save();
    }

    public function eliminardatNivelactividadporfechareal($datNivelactividadporfechareal
    )
    {
        $datNivelactividadporfechareal->delete();
    }

    public function estadoActividad($params)
    {
        if ($params['fin'] == 1) {
            $data = DatNivelactividadporfechareal::finalizada($params);
            if ($data[0] != null) {
                return array('codMsg' => 2);
            }
        }
        $datnivel = Doctrine::getTable('DatNivelactividadporfechareal')->find(
            $params['idnivelactividadporfechareal']
        );
        $datnivel->fin = $params['fin'];
        $datnivel->save();
        return array('codMsg' => 24);
    }

}


