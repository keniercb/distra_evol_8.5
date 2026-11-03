<?php
class BuscarPersonaFUCService
{
    public function buscarPersonaFUC($id, $numid)
    {
        $params = array();
        if(!empty($id)) {
            $params['id'] = $id;
        } elseif (!empty($numid)) {
            $params['identidad_numero'] = $numid;
        } else {
            return false;
        }
        $fucModel = new FUCModel();
        return $fucModel->buscarPersonaFUC($params);
    }
}