<?php

/**
 *  Esta clase gestiona el acceso a datos de los productos mínimos y máximos
 * @copyright XETID
 * @author Divicion de Gestion de Entidades
 * @version 1.0
 */
class ProductoMinimoMaximoModel extends RecuperacionesInventarioModel
{

    private $prodModel;

    public function __construct()
    {
        parent::__construct();
        $this->prodModel = new LogisticaProductoModel();
    }

    /**
     * Funcion que permite obtener los productos mínimos o los
     * productos máximos
     * @params $params (arreglo de parametros a filtrar),
     * @params $accion (1 devuelve los minimos, 2 los maximos)
     * @author División de Gestión de Entidades
     * @return array
     *
     */
    public function getProductosMinORMax($params)
    {

        $params['idestructura'] = Zend_Json::decode($params['idestructura']);
        /*$params['idestructura'] = "'" .implode(',',$params['idestructura']) . "'";*/

        /*$query = $this->prodModel->cargarProductos($params, true);//print_r($query->getSqlQuery());die;
        if ($accion == 0) {
            $query->addSelect("abs(p.cantidad - p.minimo) as diferencia")
                ->andWhere("p.minimo > p.cantidad")->orderBy("p.minimo , p.cantidad asc");
        }
        if ($accion == 1) {
            $query->addSelect("abs(p.cantidad - p.maximo) as diferencia")
                ->andWhere("p.maximo < p.cantidad")->orderBy("p.maximo desc");
        }

        $query->andWhere("p.cronologia <> 0");*/

        if(empty($params['idestructura'])) {
            $datos = $this->loadDepositos()['datos'];
            $params['idestructura'] = LogisticaObjectHelper::__init()->extractValueFromArrayColumn($datos, 'iddeposito');
            array_push($params['idestructura'],$this->global->Estructura->idestructura);
            $idestructuraop = "'" .implode(',',$params['idestructura']) . "'";
        } else {
            if(is_array($params['idestructura'])){
                $idestructuraop = "'" .implode(',',$params['idestructura']) . "'";
            }else{
                $idestructuraop = "'" .implode(',',array($params['idestructura'])) . "'";
            }
        }

        $subsistema = LogisticaGlobal::SUBSISTEMA_INV;
        $params['criterio'] = empty($params['criterio'])? 'null' : "'{$params['criterio']}'";
        $sql = "select * from mod_loginventario.f_recprodminmax(
            {$idestructuraop},
            {$params['criterio']},
            {$params['valor']},
            {$this->global->Estructura->idestructura},{$subsistema}) ";
        $conn = Zend_Registry::get('conexion');
        return array(
            'cantidad' => $conn->execute($sql)->rowCount(),
            'datos' => $conn->execute($sql . " limit {$params['limit']} offset {$params['start']}")->fetchAll(PDO::FETCH_ASSOC)
        );
    }

}
