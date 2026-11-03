<?php

class CitasordenesModel extends ZendExt_Model
{
    private $_citasService;

    public function __construct()
    {
        parent::__construct();
        $this->_citasService = new CitasTalleresService();
    }

    public function getCitasOrdenes($params)
    {
        try{
           $params['recuperaciones'] = true;
           return $this->_citasService->cargarCitas($params);
        } catch(Exception $e){
            return array(
                'success' => false,
                'mensaje' => $e->getMessage()
            );
        }
    }
}