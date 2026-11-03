<?php

class ProductoModel extends ZendExt_Model
{
    private $_producto;
    private $_logistica;
    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_producto = new DatCampannaProducto();
        $this->_logistica = new LogisticaComunicationInterface();
    }

    public function insert($params){
        try{
            if($params->idcampannaproducto){
                $producto = Doctrine::getTable('DatCampannaProducto')->find($params->idcampannaproducto);
            }else{
                $producto = new DatCampannaProducto();
            }
            $producto->idproducto = $params->idproducto;
            $producto->idcampanna = $params->idcampanna;
            $producto->precio = $params->precio;

            $producto->save();
            return array('success' => true, 'msg' => '', 'code' => 1);
        }catch (Exception $e){
            throw $e;
        }
    }

    public function delete($productos){
    try{
        foreach($productos as $idproducto){
            $producto = Doctrine::getTable('DatCampannaProducto')->find($idproducto);
            $producto->delete();
        }
        return array('success' => true, 'msg' => '', 'code' => 1);
    }catch (Doctrine_Exception $e){
        throw $e;
    }
}

    //TODO pedir dql de producto para evitar esta llamada innecesaria
    public function getCampannaProducto($params)
    {
        $result = $this->_producto->getProducto($params);
        foreach($result['data'] as $key=>$value){
            $indicador = $this->_logistica->getProductService(array('idindicador'=>$value['idproducto']));
            $result['data'][$key]['denominacion'] = $indicador['datos'][0]['denominacion'];
            $result['data'][$key]['tipo'] = $indicador['datos'][0]['tipo'];
        }
        return $result;
}

}