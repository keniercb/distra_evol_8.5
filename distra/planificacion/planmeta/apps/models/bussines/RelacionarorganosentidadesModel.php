<?php

class RelacionarorganosentidadesModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listarOrganosRelacionados($params) {
        $objDatOrganosatisfaceentidad = new DatOrganosatisfaceentidad();
        $data = $objDatOrganosatisfaceentidad->listarOrganosRelacionados($params);
        return $data;
    }

    public function listarOrganosAdd($params) {
        $objDatOrganosatisfaceentidad = new DatOrganosatisfaceentidad();
        $data = $objDatOrganosatisfaceentidad->listarOrganosAdd($params);
        return $data;
    }

    public function adicionarOrganos($params) {
        $objDatOrganosatisfaceentidad = new DatOrganosatisfaceentidad();
        $data = $objDatOrganosatisfaceentidad->adicionarOrganos($params);
        self::reordenarPrioridad($params);
        return count($data);
    }

    public function eliminarOrganos($params) {
        $objDatOrganosatisfaceentidad = new DatOrganosatisfaceentidad();
        $idorganossatisfaceentidad_array = array();
        foreach ($params['organos'] as $organo) {
            $idorganossatisfaceentidad_array[] = $organo->organo->idorganosatisfaceentidad;
        }
        $idorganosatisfaceentidad = implode(',', $idorganossatisfaceentidad_array);

        $data = $objDatOrganosatisfaceentidad->eliminarOrganos($idorganosatisfaceentidad);
        self::reordenarPrioridad($params);
        return count($data);
    }

    public function actualizarPrioridad($params) {
        $objDatOrganosatisfaceentidad = new DatOrganosatisfaceentidad();
        $data = $objDatOrganosatisfaceentidad->actualizarPrioridad($params);
        return $data;
    }

    public function reordenarPrioridad($params) {
        $objDatOrganosatisfaceentidad = new DatOrganosatisfaceentidad();
        $organosRelacionados = $objDatOrganosatisfaceentidad->listarOrganosRelacionados($params);
        foreach ($organosRelacionados as $key => $organo) {
            $objOrganosatisfaceentidad = Doctrine::getTable('DatOrganosatisfaceentidad')->find($organo['idorganosatisfaceentidad']);
            if ($objOrganosatisfaceentidad->idorganosatisfaceentidad != null) {
                $objOrganosatisfaceentidad->prioridad = $key + 1;
                $objOrganosatisfaceentidad->save();
            }
        }
        return 1;
    }

}
