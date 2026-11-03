<?php

class OrdenMaterialesModel extends DocumentoModel
{
    private $valeModel;
    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->valeModel = ValeProduccionModel::getInstance();
    } 

    /**
     * Adiciona los movimientos asociados a un documento.
     * @author Yadrian Aguila
     * @return Array
     */
    public function adicionarMateriales(&$documento, $params)
    {
        $params['idcartatecindustrial'] = $params['idcartatecnologica'];
        //$datos = $this->valeModel->cargarMaterialesAll($params);
        foreach ($params['productos'] as $dat) {//foreach ($datos['datos'] as $dat) {
            $om = new DatOrdenMateriaPrima();
            $exist = $params['iddocumento'] ? $this->existeProducto($dat['idindicador'],$params['iddocumento']) : array('idordenmateriales'=>false);
            if($dat['idordenmateriales'] && $params['iddocumento'] && $exist['idordenmateriales']){//
                $om->assignIdentifier($dat['idordenmateriales']);
            }
            $om->synchronizeWithArray($dat);
            
            if($dat['idordenmateriales']){//$params['iddocumento'] && $exist['idordenmateriales']
                $om->save();
            } else {
                $documento->DatOrdenMateriaPrima->add($om);
            }
        }
    }
    /**
     * existeProducto los movimientos asociados a un documento.
     * @author Yadrian Aguila
     * @return Array
     */
    public function existeProducto($idindicador, $iddocumento)
    {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT om.idordenmateriales                      
                FROM mod_logproduccion.dat_ordenmateriales om
                WHERE om.idindicador = {$idindicador} AND  om.idordenproduccion = {$iddocumento}";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return count($data) > 0 ? $data[0] : false;
    }
}


//idproducto
//cantidad = ((norma * cantidadorden)/parseFloat(cantidadcarta))