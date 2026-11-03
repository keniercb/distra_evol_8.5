<?php

class DatProyectocampoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Actualizar($datos)
    {
        foreach ($datos as $val) {
            $objQuery = Doctrine_Query::create()->update('DatProyectocampo')->set('orden', $val->orden);
            if (empty($val->obligatorio)) {
                $objQuery->set('obligatorio', 0);
            } else {
                $objQuery->set('obligatorio', 1);
            }
            if (empty($val->activo)) {
                $objQuery->set('activo', 0);
            } else {
                $objQuery->set('activo', 1);
            }
            if (empty($val->historico)) {
                $objQuery->set('historico', 0);
            } else {
                $objQuery->set('historico', 1);
            }
            $objQuery->where('idcampo=?', $val->idcampo);
            $resp = $objQuery->execute();
        }

        return $resp;
    }

}

